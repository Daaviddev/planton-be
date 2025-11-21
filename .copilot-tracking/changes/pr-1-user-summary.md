This branch isolates the User module contract migration and tests from the combined PR.

Files included:
- src/domain/contracts/user.contract.ts
- src/domain/contracts/index.ts (exports user contract)
- src/modules/user/* (repository/module/service updates)
- src/modules/user/user.module.spec.ts

Purpose: enable focused review of the User migration.