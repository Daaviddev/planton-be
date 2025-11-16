# PR 1: Config Inventory & Schema Hardening

This document lists the environment variables required by PlantOn Backend and their usage.

| Key                 | Type     | Description                          | Default / Placeholder             | Consuming Module        |
| ------------------- | -------- | ------------------------------------ | --------------------------------- | ----------------------- |
| NODE_ENV            | enum     | runtime environment                  | development                       | app module              |
| PORT                | number   | application port                     | 3001                              | app module              |
| BASE_URL            | string   | bind address                         | 0.0.0.0                           | app module              |
| APP_LOGGER_LEVEL    | string   | csv logger levels                    | log,error,warn,debug,verbose      | app module              |
| SWAGGER_PASSWORD    | string   | Basic auth for Swagger               | CHANGE_ME                         | swagger.config.ts       |
| DATABASE_URL        | string   | Prisma DB connection                 | CHANGE_ME                         | prisma/                 |
| DIRECT_URL          | string   | Prisma direct URL                    | optional                          | prisma/                 |
| JWT_SECRET          | string   | JWT signing key (min 32 chars)       | CHANGE_ME_SUPER_SECURE_MIN32CHARS | jwt.config.ts           |
| JWT_ACCESS_EXPIRES  | string   | access token expiry                  | 30m                               | jwt.config.ts           |
| JWT_REFRESH_EXPIRES | string   | refresh token expiry                 | 30d                               | jwt.config.ts           |
| PLATFORM_URL        | string   | frontend URL                         | http://localhost:5173             | app.config.ts           |
| SENDER_EMAIL        | string   | email sender                         | no-reply@planton.app              | app.config.ts           |
| AUTH_EMAIL_ENABLED  | boolean  | email login feature toggle           | false                             | auth.config.ts          |
| ALLOWED_ORIGINS     | string[] | comma separated allowed CORS origins | http://localhost:5173             | main.ts / app.config.ts |

Notes:

- Sensitive values are marked as CHANGE_ME in `.env.example`.
- `ALLOWED_ORIGINS` should be a comma-separated list of schemes + hosts, or a regex string.
- The application will refuse to boot in production if `JWT_SECRET` or `ALLOWED_ORIGINS` are missing.

---

Please keep this inventory in sync with `src/config/env.validation.ts` and `.env.example`.
