<!-- markdownlint-disable-file -->

# Issue: PR1 — User & Gardens migration

Summary

This issue tracks a combined migration for the `user` and `gardens` modules as part of PR1 (shared contracts & token cleanup). Both modules are high-value domain modules: `user` is central for authentication/authorization and `gardens` powers many features.

Scope

- Create contracts:
  - `src/domain/contracts/user.contract.ts` exporting `IUserRepository` and `USERS_REPOSITORY` Symbol.
  - `src/domain/contracts/gardens.contract.ts` exporting `IGardensRepository` and `GARDENS_REPOSITORY` Symbol.
- Add exports to `src/domain/contracts/index.ts`.
- Update repositories to implement the new interfaces:
  - `src/modules/user/user.repository.ts`
  - `src/modules/gardens/gardens.repository.ts`
- Update modules to provide and export symbol tokens:
  - `src/modules/user/user.module.ts` -> `{ provide: USERS_REPOSITORY, useClass: UserRepository }`
  - `src/modules/gardens/gardens.module.ts` -> `{ provide: GARDENS_REPOSITORY, useClass: GardensRepository }`
- Update services to inject typed repositories via `@Inject(USERS_REPOSITORY)` and `@Inject(GARDENS_REPOSITORY)`.
- Add unit tests:
  - `src/modules/user/user.module.spec.ts`
  - `src/modules/gardens/gardens.module.spec.ts`
    Each test should bootstrap TestingModule, override `PrismaService` with mocks, and assert DI & method calls.
- Create branch `pr-1/user-gardens-contracts` and open a PR referencing this issue.

Acceptance criteria

- Both modules compile and their tests pass locally (module-level tests).
- Services inject typed repository interfaces and rely on Symbol tokens for DI.
- PR includes `.copilot-tracking/changes` updates and a short migration note.

Run commands

```bash
npx jest src/modules/user --config=jest.config.js --runInBand
npx jest src/modules/gardens --config=jest.config.js --runInBand
```

Notes

- Migrate `user` before `auth` since `auth` depends on `user` logic. Consider migrating `auth` after `user` is stable.
- Keep PR focused: one module per PR is preferred, but `user` + `gardens` are related enough to combine if desired.
