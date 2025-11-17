# Configuration & Secrets Hardening Plan

## Overview

Tighten runtime configuration, secret management, and request entrypoint behaviour so deployments are deterministic, auditable, and safe. This work unifies the `ConfigModule`, removes code-level fallbacks (JWT secrets, Swagger passwords, CORS origins), and ensures every consumer reads from the validated environment contract in `src/config/env.validation.ts`.

## Goals

- Every secret, credential, or allow-list must be provided via environment variables that are validated before Nest bootstraps.
- `ConfigModule` exposes typed namespaces (`app`, `auth/jwt`, `privy`, `swagger`, etc.) without undefined sections.
- `main.ts` honours config-driven CORS + Helmet policies, and logging happens through Nest's `Logger` configured after bootstrap.

## In Scope

1. Expanding `ConfigModule.forRoot` to load all config factories (`app`, `auth/jwt`, `swagger`, `privy`, future mailers) and export a single `EnvironmentVariables` interface.
2. Updating `src/config/*.config.ts` files so no property has a code fallback for secrets or passwords; instead, rely on Zod validation with descriptive error messages.
3. Refactoring `src/main.ts` to consume config-driven settings for CORS origins, Helmet CSP, Swagger basic auth, and to remove regex-based host checks.
4. Providing environment documentation (`.env.example`) plus deployment notes describing required variables and safe defaults for local development.

## Key Steps & Ordering

1. **Config inventory** – catalogue every place a secret/origin/password is hard-coded (JWT config, Swagger guard, rate limiter, cookie parser usage).
2. **Env schema updates** – extend `env.validation.ts` with required keys, enums, and refined validators (e.g., `z.string().min(32)` for JWT secret).
3. **Config module wiring** – ensure `AppModule` imports `ConfigModule.forRoot({ isGlobal: true, load: [...] })` with all namespaces and typed injection.
4. **Bootstrap cleanup** – adjust `main.ts` to:
   - resolve CORS + Helmet settings from `ConfigService`.
   - remove `console.log` before Nest logger is ready.
   - avoid global `'unsafe-inline'` by scoping relaxed CSP to Swagger routes only.
5. **Documentation & templates** – update `.env.example`, README snippet, and maybe `CODEBASE_REVIEW.md` appendix to describe the new expectations.

## Dependencies & Considerations

- Coordinate with infra/devops so new env vars exist in every environment before merging.
- Align naming with frontend expectations (e.g., allowed origins for docs, staging). Consider per-environment config files if using containers.
- Ensure automated tests (when added) can inject mocked config without leaking secrets in CI logs.

## Definition of Done / Validation

- Boot fails fast if any required env var is missing or malformed.
- Security review confirms no secrets are present in the repo after changes.
- Manual smoke test proves Swagger, auth, and cookies work with config-driven values.
- `.env.example` stays synchronized with `env.validation.ts` and is referenced in onboarding docs.

## Risks & Mitigation

- **Risk:** Breaking deployments missing newer env vars.
  - _Mitigation:_ introduce feature flags or two-phase rollout (accept old + new value temporarily) and communicate changes with ops.
- **Risk:** Overly strict CSP blocking Swagger assets.
  - _Mitigation:_ scope relaxed CSP header only when serving `/api/docs` via conditional middleware.

## Success Metrics

- Zero hard-coded secrets/origins remain in tracked files (verified via grep).
- Config coverage reaches 100% of namespaces consumed across services.
- Reduced time-to-diagnose misconfigurations thanks to descriptive Zod errors (<2 minutes to pinpoint).

## PR Plan

1. **PR 1 – Config inventory & schema hardening**

- Add any missing env keys to `env.validation.ts` with strict validators.
- Remove in-code fallbacks inside `src/config/*.config.ts` and document required variables.
- CI gate: run validation-focused unit tests to prove the app fails fast without secrets.

2. **PR 2 – Bootstrap + consumer refactor**

- Update `AppModule` + `main.ts` to load all config namespaces, wire CORS/Helmet/Swagger from `ConfigService`, and replace console logging with Nest `Logger`.
- Adjust feature modules to inject the typed config namespaces instead of reading env vars directly.
- Smoke-test Swagger/auth locally with the new config wiring.

3. **PR 3 – Documentation & rollout**

- Refresh `.env.example`, README/onboarding notes, and (optionally) CODEBASE_REVIEW appendix to reflect the new variables.
- Provide migration guidance for ops (feature-flag strategy, deployment checklist) plus verification steps for each environment.
- Add lint/docs checks (or a simple script) ensuring `.env.example` stays in sync with `env.validation.ts` going forward.

### Prompt

"""
Implement the Configuration & Secrets Hardening plan by:

1. Expanding env validation + config factories so every secret/origin/password is sourced from the environment with no code fallbacks.
2. Refactoring `main.ts` and related config consumers to read these typed values (CORS, Helmet CSP, Swagger basic auth, JWT).
3. Updating developer documentation (`.env.example`, README) to reflect the new required variables and defaults.
   Provide unit/integration verification notes demonstrating the app refuses to boot when secrets are absent.
   """
