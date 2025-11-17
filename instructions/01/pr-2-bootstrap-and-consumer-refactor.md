# PR 2 — Bootstrap & Consumer Refactor

## Objective

Wire the NestJS bootstrap process and downstream consumers to the hardened configuration layer so runtime behaviour (CORS, Helmet, Swagger, auth) is entirely driven by validated config values and logged consistently.

## Scope & Deliverables

- `AppModule`/`ConfigModule` initialization updated to load every config namespace defined in PR 1.
- `src/main.ts` refactored to:
  - configure CORS, Helmet CSP, rate limiting, and Swagger Basic Auth via `ConfigService`.
  - remove regex host checks and inline secrets.
  - switch early `console.log` usage to Nest's `Logger` post-bootstrap.
- Feature modules (auth, swagger, rate limiter, etc.) updated to inject typed config namespaces rather than accessing env variables directly.
- Local smoke-test evidence (screenshots/logs) showing Swagger + auth still function with config-driven values.

## Key Tasks

1. **ConfigModule wiring**
   - Ensure `ConfigModule.forRoot({ isGlobal: true, load: [...] })` imports all config factories (app, auth/jwt, swagger, privy, etc.).
   - Export a consistent `ConfigType<typeof appConfig>` style where needed for type-safe injections.
2. **Bootstrap cleanup**
   - Replace ad-hoc CORS origin regex with values from config arrays.
   - Scope Helmet CSP relaxation to `/api/docs` routes via conditional middleware.
   - Initialize Nest `Logger` before emitting any log statements.
3. **Consumer refactors**
   - Update decorators/guards/services (e.g., Swagger guard, JWT strategy) to read from injected config providers.
   - Remove duplicate `new ValidationPipe` instantiations where not required.
4. **Verification**
   - Run the app locally with representative `.env` values and confirm:
     - Swagger docs require the configured credentials.
     - CORS blocks unauthorized origins and allows whitelisted ones.
     - Logs appear via Nest `Logger`.

## Validation & Testing

- Manual smoke tests for Swagger, login, and a protected endpoint.
- Add/update integration tests (if available) for the bootstrap module to ensure config tokens resolve.
- Provide a short checklist in the PR description for QA (e.g., "Update env X", "Hit Swagger with non-whitelisted origin").

## Risks & Mitigations

- **Risk:** Missing config tokens cause DI errors during bootstrap.
  - _Mitigation:_ Add e2e bootstrap test using `Test.createTestingModule` to catch missing providers early.
- **Risk:** CSP/CORS misconfiguration blocks legitimate clients.
  - _Mitigation:_ Coordinate with frontend team; include sample env files for dev/staging.

## Handoff Checklist

- [ ] `AppModule`/`main.ts` updated and linted.
- [ ] All config consumers now inject typed namespaces.
- [ ] Swagger, CORS, Helmet verified locally with screenshots/logs attached.
- [ ] QA checklist added to PR description.
- [ ] Rollback plan documented (e.g., revert to previous bootstrap commit) in case deployment uncovers edge cases.
