This branch isolates the Vegetables module contract migration and tests from the combined PR.

Files included:
- src/domain/contracts/vegetables.contract.ts
- src/domain/contracts/index.ts (exports vegetables contract)
- src/modules/vegetables/* (repository/module/service updates)
- src/modules/vegetables/vegetables.module.spec.ts

Purpose: enable focused review of the Vegetables migration.