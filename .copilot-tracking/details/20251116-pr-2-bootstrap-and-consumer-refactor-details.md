<!-- markdownlint-disable-file -->

# Task Details: PR 2 — Bootstrap & Consumer Refactor

## Research Reference

**Source Research**: #file:../research/20251116-pr-2-bootstrap-and-consumer-refactor-research.md

## Phase 1: Config Namespace Coverage and Validation

### Task 1.1: Confirm or add config factories

Add or confirm the existence of these config files:

- `src/config/app.config.ts` — base app settings including allowedOrigins, port, baseUrl, loggerLevel
- `src/config/swagger.config.ts` — swagger username + password
- `src/config/jwt.config.ts` — jwt token settings
- `src/config/auth.config.ts` — auth feature flags

If additional config namespaces (privy, rate-limiter, etc.) are required, create `src/config/<name>.config.ts` using the existing registerAs pattern and add to `AppModule`.

- **Files to change**:

  - `src/modules/app/app.module.ts` — add missing config factories to `ConfigModule.forRoot` load property

- **Success**:
  - All config factories exist and load in `AppModule`.

... (truncated) ...
