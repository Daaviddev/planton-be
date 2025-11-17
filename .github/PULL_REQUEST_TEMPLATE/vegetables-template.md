---
name: Vegetables contract migration
about: Migrate Vegetables module to shared contracts pattern (interfaces + Symbol DI token)
---

This PR isolates the Vegetables migration for focused review.

Files to review:
- src/domain/contracts/vegetables.contract.ts
- src/modules/vegetables/*
- src/modules/vegetables/vegetables.module.spec.ts

Notes:
- Adds `VEGETABLES_REPOSITORY` symbol and `IVegetablesRepository` interface.
- Module wiring switched to use the Symbol token and typed injection.
- Unit tests provided mocking PrismaService.
