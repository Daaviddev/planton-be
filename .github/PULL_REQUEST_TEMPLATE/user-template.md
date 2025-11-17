---
name: User contract migration
about: Migrate User module to shared contracts pattern (interfaces + Symbol DI token)
---

This PR isolates the User migration for focused review.

Files to review:
- src/domain/contracts/user.contract.ts
- src/modules/user/*
- src/modules/user/user.module.spec.ts

Notes:
- Adds `USERS_REPOSITORY` symbol and `IUsersRepository` interface.
- Module wiring switched to use the Symbol token and typed injection.
- Unit tests provided mocking PrismaService.
