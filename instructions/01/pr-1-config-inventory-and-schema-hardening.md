# PR 1 — Config Inventory & Schema Hardening

## Objective

Ensure every runtime secret, origin, and credential flows through validated environment variables. Remove code-level fallbacks so the application refuses to boot when configuration is incomplete or insecure.

## Scope & Deliverables

- Comprehensive inventory of all files referencing secrets or origins (config factories, guards, pipes, utils).
- Updated `src/config/env.validation.ts` with strict Zod schemas for every required variable (minimum lengths, enums, URL validation, etc.).
- Config factory files (`app.config.ts`, `auth.config.ts`, `jwt.config.ts`, `swagger.config.ts`, etc.) rewritten to trust validated env values rather than providing defaults.
- Documentation notes inside the PR detailing each new/renamed env var plus migration guidance.

## Key Tasks

1. **Discovery pass**
   - Search for `process.env`, hard-coded origins, passwords, or secrets throughout `src/**`.
   - Document findings in the PR description (table with file, variable, action).
2. **Env schema expansion**
   - Add missing keys to `env.validation.ts`, including structural validations (arrays via `z.string().transform(...)`, enums, numeric ranges).
   - Introduce helpful error messages so misconfigurations are self-explanatory.
3. **Config factory cleanup**
   - Update `ConfigModule` factories to simply read from `ConfigService` without fallback values.
   - Remove inline secret defaults elsewhere (guards, passport strategy configs, etc.).
4. **Sanity checks & automation**
   - Add/adjust unit tests that instantiate `ConfigModule` with incomplete env maps to ensure boot fails.
   - Optional: create a script/test that compares `.env.example` keys to the schema; note that full sync occurs in PR 3 but guardrails can begin here.

## Validation & Testing

- Run `pnpm test` (or targeted config tests) to verify new validation logic.
- Manually attempt to start the app with a missing critical variable (e.g., `JWT_SECRET`) and capture the failure message in the PR.
- Provide evidence that secrets are no longer present via a `git grep` snippet attached to the PR.

## Risks & Mitigations

- **Risk:** Immediate boot failures in environments missing new vars.
  - _Mitigation:_ Document required vars, coordinate rollout timing, and consider temporary dual-key support (old + new) noted in the PR.
- **Risk:** Overly strict validators blocking legitimate values.
  - _Mitigation:_ Pilot with staging env configs and gather feedback before merging.

## Handoff Checklist

- [ ] Inventory notes included in PR description.
- [ ] Updated `env.validation.ts` committed with tests.
- [ ] Config factories confirmed free of secret defaults.
- [ ] Manual boot-failure screenshot/log attached.
- [ ] Communication plan drafted for ops/dev teams regarding new env requirements.
