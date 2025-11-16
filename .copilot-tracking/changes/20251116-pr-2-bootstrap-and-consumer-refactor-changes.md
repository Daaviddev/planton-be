<!-- markdownlint-disable-file -->

# Changes tracking file for PR 2 — Bootstrap & Consumer Refactor

Date: 2025-11-16

This file will track changes for PR 2 and provide a single place for the implementation summary.

## Summary of changes

- src/config/swagger.config.ts — added `username` field to swagger config (defaults to 'admin')
- src/config/env.validation.ts — made `SWAGGER_USERNAME` optional with default, relaxed `SWAGGER_PASSWORD` to be optional in non-prod and transformed `ALLOWED_ORIGINS` to default to empty string and parsed to array
- src/main.ts — refactored bootstrap:
  - initialize Nest `Logger` earlier via `app.useLogger` before emitting logs
  - apply strict global `helmet()` then scoped relaxed CSP for the docs route
  - use `swagger` config username/password for express-basic-auth instead of inline 'admin'
  - adjust CORS origin handling to allow no-origin requests and build patterns from `app.allowedOrigins`

