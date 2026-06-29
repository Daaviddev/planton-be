---
name: Activities contract migration
about: Migrate Activities module to shared contracts pattern (interfaces + Symbol DI token)
---

This PR isolates the Activities migration for focused review.

Files to review:
- src/domain/contracts/activities.contract.ts
- src/modules/activities/*
- src/modules/activities/activities.module.spec.ts

Notes:
- Adds `ACTIVITIES_REPOSITORY` symbol and `IActivitiesRepository` interface.
- Module wiring switched to use the Symbol token and typed injection.
- Unit tests provided mocking PrismaService.
