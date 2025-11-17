This branch isolates the Producers module contract migration and tests from the combined PR.

Files included:
- src/domain/contracts/producers.contract.ts
- src/domain/contracts/index.ts (exports producers contract)
- src/modules/producers/* (repository/module/service updates)
- src/modules/producers/producers.module.spec.ts

Purpose: enable focused review of the Producers migration.