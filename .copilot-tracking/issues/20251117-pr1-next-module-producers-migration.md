<!-- markdownlint-disable-file -->

# Issue: PR1 — Next module migration (Producers pilot)

Summary

This issue tracks the next pilot migration for PR1 (shared contracts & token cleanup). The goal is to migrate the `producers` module (and the related `vegetables` module) to use typed repository contracts and Symbol DI tokens, following the Activities pilot pattern already implemented.

Why producers?

- `producers` has clear repository/service boundaries and is a good next candidate to validate the migration pattern across controllers, services, and repositories.

Scope

- Create contract: `src/domain/contracts/producers.contract.ts` exporting `IProducersRepository` and `PRODUCERS_REPOSITORY` Symbol.
- Create contract: `src/domain/contracts/vegetables.contract.ts` exporting `IVegetablesRepository` and `VEGETABLES_REPOSITORY` Symbol (vegetables are closely related to producers and should be migrated together).
- Add barrel export in `src/domain/contracts/index.ts` for both contracts.
- Update `src/modules/producers/producers.repository.ts` to implement `IProducersRepository`.
- Update `src/modules/vegetables/vegetables.repository.ts` to implement `IVegetablesRepository`.
- Update `src/modules/producers/producers.module.ts` to provide `PRODUCERS_REPOSITORY` using `useClass` and export it.
- Update `src/modules/vegetables/vegetables.module.ts` to provide `VEGETABLES_REPOSITORY` similarly.
- Update `src/modules/producers/producers.service.ts` and `src/modules/vegetables/vegetables.service.ts` to inject typed repositories via `@Inject(...)`.
- Add unit tests: `src/modules/producers/producers.module.spec.ts` and `src/modules/vegetables/vegetables.module.spec.ts` that bootstrap TestingModule, override `PrismaService`, and assert DI and method calls.
- Update `.copilot-tracking/changes/` when complete and create PR with branch `pr-1/producers-vegetables-contracts`.

Acceptance criteria

- Module compiles, tests pass locally (module-level tests) and DI resolves to an object implementing `IProducersRepository`.
- All provider references in `producers` code change from string literals (if any) to the new Symbol token.
- Changes recorded in `.copilot-tracking/changes/` and PR includes migration notes.

Implementation checklist

- [ ] Create `src/domain/contracts/producers.contract.ts` (interface + Symbol)
- [ ] Export from `src/domain/contracts/index.ts`
- [ ] Update `producers.repository.ts` to implement interface
- [ ] Update `producers.module.ts` to provide & export the Symbol token
- [ ] Update `producers.service.ts` injections
- [ ] Add `producers.module.spec.ts` and verify tests
- [ ] Commit to branch `pr-1/producers-contract`, push, open PR, link to this issue

Suggested PR template

Title: PR1: Producers — contract & token migration (pilot)

Body (brief):

This PR migrates the `producers` module to use a typed contract and Symbol DI token as part of PR1 (Shared contracts & token cleanup).

Files changed:

- `src/domain/contracts/producers.contract.ts` (new)
- `src/domain/contracts/index.ts` (updated)
- `src/modules/producers/*` (module, service, repository updates)
- `src/modules/producers/producers.module.spec.ts` (new tests)

Notes:

- Activities pilot already migrated and tests added in PR branch `pr-1/shared-contracts-and-token-cleanup`.
- Run `npm test` locally; module-level tests can be run with Jest config if desired.

Runbook / Commands

```bash
# run all tests
npm test

# run only producers tests
npx jest src/modules/producers --config=jest.config.js --runInBand
```

Risks / Rollback

- Minimal risk; migration is local to DI tokens and interfaces. If issues occur, revert commit and restore original string tokens.

Related

- .copilot-tracking/changes/20251116-pr-1-shared-contracts-and-token-cleanup-changes.md
- PR: pr-1/shared-contracts-and-token-cleanup (Activities pilot branch)
