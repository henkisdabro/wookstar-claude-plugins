---
name: prune-tests
description: Prune tests that guard no behaviour - dead, tautological, implementation-coupled or duplicated - in one cheap read-and-judge pass.
disable-model-invocation: true
argument-hint: "[optional path]"
model: opus
effort: high
---

# Prune tests

A test earns its place when it is **anchored**: it depends on intended behaviour, so it changes only when that behaviour changes and goes **red** only when it regresses. Prune every test that is not anchored.

This is the 80/20 pass. The evidence is the test, the code under it and that code's callers, plus a break-it check on each close call. Mutation campaigns, kill matrices and new property or E2E suites are separate work, done when the user asks for them.

Speak the `/tdd` vocabulary: **seam** (the public boundary where behaviour is observed), **tautological**, **implementation-coupled**. When the form of a rewrite or deletion is not obvious, read [EXAMPLE.md](EXAMPLE.md), then the `tdd` skill's `tests.md`.

## Steps

1. **Scope.** Use the path given. With none, take the whole suite; when it has more than about 30 test files, propose a scope (one package or directory) and confirm it before reading. Done when the list of test files is fixed.
2. **Baseline.** Run the suite for that scope and record the pass count. If it is already red, stop and report: pruning against a red suite cannot tell a broken test from a pruned one.
3. **Classify.** Where the repo's linter has rules for skipped, focused or assertion-less tests (such as `no-disabled-tests` and `expect-expect` in the jest and vitest ESLint plugins, or ruff's `PT` rules), run them first: their hits are settled, so judgement goes on the rest. Read every test in scope and give it one verdict from the categories below: _keep_, _rewrite_ or _delete_. Done when every test has a verdict and a category.
4. **Break-it check** on each close call: a test you would delete but suspect is the sole guard of something callers rely on, or a copy's partner you doubt would catch the regression. Break that behaviour once - at its boundary where it has one (`>` to `>=`, off by one), the break a weak test misses - run the test, then revert. Red: it guards the behaviour. Green on a suspected sole guard: delete it. Green on a partner: it is no guard, so the copy stays.
5. **Prune.**
   - Delete each _delete_ test, with the empty `describe` blocks, section comments and files it leaves behind.
   - Rewrite each _rewrite_ test against the behaviour at its seam, with an independent expected value: a literal, a worked example, the spec.
   - Delete this prune's **orphans**: production code whose only callers were the removed tests (test-only resets, getters, exports), and the fixtures and helpers it left unused. Older dead code is listed, not deleted.
6. **Verify.** Run the scoped suite again: green, with the count down by exactly the tests you deleted. If the prune touched anything outside the test files in scope (production code, shared fixtures or helpers), run the full suite too. Leave the changes uncommitted for review, unless the user asked for a commit.
7. **Report** in these sections, writing "none" in an empty one:
   - **Ledger** - one line per pruned or rewritten test, with its category and a few words of evidence (cases of one parametrised test share a line per category, listing the case ids), then the before and after counts.
   - **Close calls** - tests kept after a break-it check.
   - **Listed** - every item the rules below say to list: decisions left in place, follow-ups, older dead code, weaker partners outside the scope.
   - **Lint rules** that would stop each category you found from coming back.

## Categories

**The past** - it guards code that is gone or will never run again.

- Asserts a removed feature is gone, a file is absent, or a module left its old path.
- Tests a spent one-off: a data migration or backfill already applied, a flag that is permanently off. A schema migration replayed on every fresh database still runs; its tests stay.
- Skipped, commented-out or `.only`-shadowed tests, and test files the runner never picks up (outside its glob, missing the suffix), unless the skip is a decision (below). Delete, or rewrite if the behaviour it names still exists and nothing else guards it.

**Nothing** - no change to the production code can make it fail.

- Tests the browser, framework or language: a `<button>` renders, a click fires, a type the compiler already guarantees.
- Mocks the unit under test, then asserts what the mock returns.
- Asserts only existence or no-throw (`toBeDefined`, truthy, `not.toThrow`) on code that cannot return nothing or throw.
- Bounds so loose no plausible bug crosses them (`x >= 0`, `x < 1000`), or an expected set that admits every outcome (`exit in (0, 1)`).

**The implementation** - it changes whenever the code does, even when behaviour did not.

- Tautological: the expected value is computed the way the code computes it.
- Asserts private state, internal call order, which helper ran, or mocks a collaborator the project owns. Mocks belong at system boundaries only: network, clock, randomness, third-party services - including the project's own thin wrapper around one.
- A large snapshot of whatever the code currently emits, updated wholesale whenever it changes. Rewrite to assert the few values a caller depends on.
- A characterisation or equivalence suite pinned for a refactor goes only once the refactor has shipped (check the git log or the plan, not the test file) and other tests guard what it pinned. While it is the only guard, keep it.

**A copy** - another test already guards the same behaviour.

- The partner counts only if it would go red on this regression: it asserts the behaviour succeeding (read the snapshot lines that cover it - a snapshot can record a crash), with inputs that tell the cases apart (a fixture equal to the default cannot). When in doubt, give the partner a break-it check.
- Keep the one at the higher seam, closest to what a caller or user sees; at the same seam, keep the one with an independent expected value (a literal, a worked example), then the easier one to read. Delete the rest. A lower function that other code calls directly is a seam of its own, so its tests are not copies.
- A test that is only partly a copy: trim it to its unique assertions.
- A partner outside the scope still counts as a guard, so the in-scope copy can go. Where the outside one is the weaker copy, list it rather than widening the scope.
- A wiring test at a thin outer layer (a command line, a route) and rule tests at the service beneath it guard different things. Neither is a copy; keep both.
- Table-driven cases that run one path with interchangeable numbers count as one; keep the boundaries and one ordinary case. A case per entry of a lookup table guards that entry; keep each.

**Decisions.** Anything with a stated reason - a skip or expected-fail with a comment or ticket, a platform guard, a skip-list entry, a snapshot the repo keeps on purpose to flag changes - is a decision, not waste: leave it and list it.

**Follow-ups.** When a rewrite needs more than the test itself - a seam that does not exist, a new fixture - keep the test as it is and list it as a follow-up. A missing seam is a design problem for `/codebase-design`, not a pruning one.

## Done

- Every test in scope has a verdict, and the report accounts for every deletion, rewrite and listed item.
- The scoped suite is green (the full suite too where the prune touched code outside it), and the count dropped by exactly the deletions.
- Apart from listed follow-ups, no test left asserts absent code, a mock's own return value or a value derived from the code under test, and no two guard the same behaviour at the same seam. No orphans remain.
