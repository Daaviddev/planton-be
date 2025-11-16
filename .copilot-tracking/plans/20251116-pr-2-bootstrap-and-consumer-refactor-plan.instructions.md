---
applyTo: '.copilot-tracking/changes/20251116-pr-2-bootstrap-and-consumer-refactor-changes.md'
---

<!-- markdownlint-disable-file -->

# Task Checklist: PR 2 — Bootstrap & Consumer Refactor

## Overview

Refactor NestJS bootstrap process and consumers to load hardened/typed configuration, scope CSP to Swagger route, replace ad-hoc CORS logic with validated config-driven checks, and centralize logging using Nest `Logger`.

## Objectives

- Load and export all required config namespaces via `ConfigModule.forRoot`.
- Ensure `src/main.ts` config-driven behavior for CORS, Helmet CSP, Swagger Basic Auth, and logging.
- Update downstream consumers to inject typed config or use `ConfigService.get` with `infer: true`.
- Add tests validating bootstrap and core behaviors.

## Research Summary

### Project Files

- src/main.ts - bootstrapping and middleware configuration - used to implement CORS, Helmet, logger, swagger.
- src/modules/app/app.module.ts - ConfigModule.forRoot and where config factories are imported/loaded.
- src/config/* - config factories for app, jwt, swagger, auth.
- src/config/env.validation.ts - environment validation rules used to guard config input.

### External References

- .copilot-tracking/research/20251116-pr-2-bootstrap-and-consumer-refactor-research.md - validated findings and code examples
- https://docs.nestjs.com/techniques/configuration - Config module usage
- https://docs.nestjs.com/openapi/introduction - Swagger usage
- https://helmetjs.github.io/ - Helmet CSP recommendations

## Implementation Checklist

### [ ] Phase 1: Config Namespace Coverage and Validation

- [ ] Task 1.1: Confirm all expected `src/config` namespaces are created (app, jwt, swagger, auth) and add new ones if missing (eg. privy, rate-limiter).
  - Details: .copilot-tracking/details/20251116-pr-2-bootstrap-and-consumer-refactor-details.md (Lines 20-80)
- [ ] Task 1.2: Expand `env.validation.ts` to validate new env vars and allowed origins format.
  - Details: .copilot-tracking/details/20251116-pr-2-bootstrap-and-consumer-refactor-details.md (Lines 80-140)

## Success Criteria

- App boots with typed config providers without DI errors.
- Swagger docs remain protected by configured Basic Auth credentials.
- CORS configuration only allows whitelisted origins in production and all origins in development.
- CSP relaxation only applies to Swagger route; other routes stay protected.
- Bootstrap logs use Nest `Logger` and are consistent.
