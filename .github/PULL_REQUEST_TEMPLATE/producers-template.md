---
name: Producers contract migration
about: Migrate Producers module to shared contracts pattern (interfaces + Symbol DI token)
---

This PR isolates the Producers migration for focused review.

Files to review:
- src/domain/contracts/producers.contract.ts
- src/modules/producers/*
- src/modules/producers/producers.module.spec.ts

Notes:
- Adds `PRODUCERS_REPOSITORY` symbol and `IProducersRepository` interface.
- Module wiring switched to use the Symbol token and typed injection.
- Unit tests provided mocking PrismaService.
