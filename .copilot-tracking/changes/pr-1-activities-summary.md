### PR: pr-1/activities

This branch isolates the Activities module contract migration and tests from the combined PR.

Files included:
- src/domain/contracts/activities.contract.ts
- src/domain/contracts/index.ts (exports activities contract)
- src/modules/activities/* (repository/module/service updates)
- src/modules/activities/activities.module.spec.ts

Purpose: enable focused review of the Activities migration.