# Research: PR 2 - Bootstrap & Consumer Refactor

Date: 2025-11-16

Source files referenced:
- src/main.ts - project bootstrap and configuration of CORS, Helmet, Swagger, etc.
- src/config/* - config factories: app.config.ts, jwt.config.ts, swagger.config.ts, auth.config.ts
- src/modules/app/app.module.ts - ConfigModule.forRoot and loaded config namespaces
- src/decorators, src/guards, src/services and feature modules - potential consumers for config providers

Project summary and current state:
- The project uses NestJS + @nestjs/config to register config namespaces and to provide typed configuration through ConfigService.
- `AppModule` currently loads four config namespaces via `ConfigModule.forRoot`: app, swagger, jwt, auth.
- `src/main.ts` reads config values via `ConfigService.get('app')` and `ConfigService.get('swagger')` and uses them for CORS, logger, swagger authentication, and helmet defaults.
- CORS in production uses a dynamic function that converts config string entries to regex. In development it allows all origins.
- Swagger Basic Auth uses `express-basic-auth` with a password taken from `swagger` config.
- Helmet CSP currently applies globally and includes several inline directives; PR asks to scope CSP relaxation to /api/docs routes only.
- There are no other config namespaces present; PR 1 previously introduced a pattern to add more config namespaces (privy, rate-limiter, etc.) and the plan suggests wiring any missing config factories.

Research Goals
- Validate that all current config consumers read from `ConfigService` (they do for main.ts), and identify code that still uses `process.env` directly.
- Confirm `ConfigModule.forRoot` loads all relevant config files; in this repository it already loads app, jwt, swagger, auth.
- Identify modules that may still read environment variables directly or use hard-coded values for CORS, Swagger credentials, or CSP.

Findings
- process.env usage: Only found within `src/config` factories (app, jwt, swagger, auth). Feature code does not appear to query `process.env` directly.
- `src/main.ts` currently converts `app.allowedOrigins` (from config) to regex; this is still config driven but the PR suggests removing ad-hoc patterns and rely on arrays of strings to control origin allow list. That requires updating allowedOrigins format and CORS check logic.
- `swagger` config only contains a `password` - there is no `username` env var configured and main.ts uses `admin` as the username. The PR suggests removing inline secrets; using a `SWAGGER_USERNAME` env var or a better plan is required.
- Helmet CSP directives are global; we can scope relaxed CSP to `/${DOCS_PATH}` route or apply a middleware to documents route only.
- The project already uses `ConfigService` and typed `ConfigType` in places; bootstrapping sets the application logger via `app.useLogger(appConfig.loggerLevel)`; PR wants to ensure logger is initialised earlier before emitting logs during bootstrap. Currently they call `Logger.log` between getting config and before `app.useLogger`? We should rely on console during early phases or set Nest Logger globally earlier.

External sources consulted
- NestJS ConfigModule docs: https://docs.nestjs.com/techniques/configuration
- NestJS Swagger docs: https://docs.nestjs.com/openapi/introduction
- Helmet middleware usage and CSP scoping in Express: https://helmetjs.github.io/
- express-basic-auth docs: https://www.npmjs.com/package/express-basic-auth

Recommended Implementation Strategy (evidence-based)
- Ensure `ConfigModule.forRoot` loads the full list of config factories. If there are additional configs expected by PR 1, add them to `src/config` and load them in `AppModule`.
- Replace ad-hoc CORS regex logic with a function that treats allowed origins as either exact matches or regex strings, but enforce documented format via env validation schema (env.validation.ts).

Example:

```ts
// app.config.ts
// allowedOrigins => array of strings
allowedOrigins: (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean),

// main.ts
const allowedOrigins = appConfig.allowedOrigins || [];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, false);
    const allowed = allowedOrigins.some(pattern => new RegExp(pattern).test(origin));
    callback(allowed ? null : new Error('Not allowed by CORS'), allowed);
  }
};
```

- Add optional `SWAGGER_USERNAME` to `swagger.config.ts` and update `Dockerfile/.env` and `env.validation.ts` accordingly. Use `ConfigService` to supply both username and password to express-basic-auth.

Example:

```ts
// swagger.config.ts
export default registerAs('swagger', () => ({
  username: process.env.SWAGGER_USERNAME || 'admin',
  password: process.env.SWAGGER_PASSWORD,
}));

// main.ts
const swaggerConfig = configService.get('swagger', { infer: true });
app.use(['/docs'], basicAuth({ challenge: true, users: { [swaggerConfig.username]: swaggerConfig.password } }));
```

- Scope Helmet CSP relaxations to apply only to Swagger route by applying an additional middleware before Swagger setup (e.g., use app.use(DOCS_PATH, helmet({ contentSecurityPolicy: { directives: {...} } })) ), leaving the global helmet defaults stricter.

Example:

```ts
// default global helmet
app.use(helmet());

// relaxed CSP for swagger route only
app.use(`/${DOCS_PATH}`, helmet({ contentSecurityPolicy: { directives: { scriptSrc: ["'self'", "'unsafe-inline'", 'https:'] } } }));
```

- Move initialization of Nest `Logger` to earliest point possible: call `Logger.overrideLogger()` or configure `app.useLogger(appConfig.loggerLevel)` early, and avoid pre-bootstrap console logs. Replace `Logger.log` usage with `Logger.debug` or `Logger.verbose` as appropriate, after logger is set.
- Update Swagger and other modules to inject and read typed config via `@Inject(ConfigType)` or via `ConfigService.get` with `infer: true` to get a typed namespace.

Example:

```ts
// some service
constructor(
  private configService: ConfigService,
) {
  const jwtConfig = this.configService.get('jwt', { infer: true });
}
```

- Add unit/integration tests to verify DI resolves config namespaces, Swagger Basic Auth is enforced, and CORS blocks unauthorized origins.

Files to create or modify
- .copilot-tracking/** - planning files for the implementation (plan, details, prompt)
- src/config/swagger.config.ts - add username env var
- src/config/app.config.ts - ensure allowedOrigins are validated and typed
- src/modules/app/app.module.ts - wire any additional config namespaces
- src/main.ts - refactor bootstrap to set logger early, scope helmet CSP to docs route, and use injected config values; remove inline 'admin' username usage and use typed swagger config with username and password
- src/config/env.validation.ts - add validation for new env vars (SWAGGER_USERNAME) and enforce allowedOrigins format
- tests - update/add tests to validate bootstrapping

Implementation Risks
- Missed config tokens cause DI or runtime errors during startup. Mitigation: Add a minimal unit test to boot a Test.createTestingModule that loads AppModule and resolves config to ensure all registered config providers are valid.
- CORS/CSP misconfiguration leads to blocked legitimate clients. Mitigation: Add env sample and run local manual checks, plus unit tests using supertest that mimic allowed and disallowed origins.

Next steps
- Create the PR planning files (.copilot-tracking/plans, .copilot-tracking/details, .copilot-tracking/prompts).
- Draft and validate the specific changes for `src/main.ts`, `src/config` files, `app.module.ts`, and required tests.

End of research
