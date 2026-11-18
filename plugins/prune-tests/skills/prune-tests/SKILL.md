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

This is the 80/20 pass. The evidence is the test, the code under it and that code's callers, plus a break-it check on each close call.

## Steps

1. **Scope.** Use the path given. With none, take the whole suite; when it has more than about 30 test files, propose a scope (one package or directory) and confirm it before reading. Done when the list of test files is fixed.
2. **Baseline.** Run the suite for that scope and record the pass count. If it is already red, stop and report: pruning against a red suite cannot tell a broken test from a pruned one.
3. **Classify.** Read every test in scope and give it one verdict from the categories below: _keep_, _rewrite_ or _delete_. Done when every test has a verdict and a category.
4. **Break-it check** on each close call: a test you would delete but suspect is the sole guard of something callers rely on, or a copy whose partner runs other inputs (another call, method, entry, type or value), or whose partner you doubt. Break the production line it asserts on, the way its assertion would notice - an edge moved (`>` to `>=`), a range narrowed, a failure swallowed into an empty result, a configured value hard-coded - run the scoped suite and any outside partner, then revert.
   - No such break turns it red: it guards nothing. Delete it, or rewrite it if the behaviour it names is real and nothing else guards it.
   - Red with a partner, through a **seam** (the public boundary where behaviour is observed): delete it. A partner red only because it spies on internals is implementation-coupled, not a guard.
   - Red alone: it is the sole guard, so keep it - unless no caller can tell the broken result from the right one.
5. **Prune.**
   - Before deleting or rewriting a test, check each of its assertions against the tests that stay: move any that no survivor makes into one with the same setup, or trim the test down to it. Delete each _delete_ test with the empty `describe` blocks, section comments and files it leaves behind.
   - Rewrite each _rewrite_ test against the behaviour at its seam, with an exact, independent expected value - a literal, a worked example, the spec - that goes red on every break the old test caught.
   - Delete this prune's **orphans**: production code whose only callers were the removed tests (test-only resets, getters, exports), and the fixtures and helpers it left unused. Older dead code is listed, not deleted, and so are the tests whose only subject it is.
6. **Verify.** Run the scoped suite again: green, with the count down by exactly the tests you deleted. If the prune touched anything outside the test files in scope (production code, shared fixtures or helpers), also run everything that can reach it: other packages' tests and the type-check. Leave the changes uncommitted for review, unless the user asked for a commit.
7. **Report** in these sections, writing "none" in an empty one:
   - **Ledger** - one line per pruned or rewritten test, with its category and a few words of evidence (cases of one parametrised test share a line per category, listing the case ids; group a long ledger by file), then the counts, taken from the ledger: before, after, deleted and rewritten.
   - **Break-its** - each check: the break, which tests went red, and the verdict.
   - **Listed** - every item the rules below say to list, grouped as decisions left in place, follow-ups, older dead code, and weaker partners outside the scope.

## Categories

**The past** - it guards code that is gone or will never run again.

- Asserts a removed feature is gone, a file is absent, or a module left its old path - unless code still refuses the old form; then it guards that refusal.
- Tests a spent one-off: a data migration or backfill already applied, a flag that is permanently off. A schema migration replayed on every fresh database still runs; its tests stay.
- Skipped, commented-out or `.only`-shadowed tests, and test files the runner never picks up (outside its glob, missing the suffix), unless the skip is a decision (below). Delete, or rewrite if the behaviour it names still exists and nothing else guards it.

**Nothing** - no plausible change to the production code can make it fail.

- Asserts only existence or no-throw (`toBeDefined`, truthy, `not.toThrow`) on code that cannot return nothing or throw.
- Bounds so loose no plausible bug crosses them (`x >= 0`, `x < 1000`), or an expected set that admits every outcome (`exit in (0, 1)`).

**The implementation** - it changes whenever the code does, even when behaviour did not.

- Tautological: the expected value is computed the way the code computes it.
- Asserts private state, internal call order, which helper ran, or mocks a collaborator the project owns. Mocks belong at system boundaries only: network, clock, randomness, third-party services - including the project's own thin wrapper around one.
- A snapshot or pinned literal of whatever the code currently emits, re-recorded whenever the code changes (the git log shows it). Rewrite to assert the few values a caller depends on.

**A copy** - another test already guards the same behaviour.

- The partner counts only if it goes red on every regression the copy catches and survives this prune itself - of two tests that name each other, delete one. It asserts the behaviour succeeding (read the snapshot lines that cover it - a snapshot can record a crash), with inputs that tell the cases apart (a default fixture cannot tell a configured value from a hard-coded one) and an expected value not derived the way the code derives it. Where the guarding assertion is incidental to the partner's subject, add a comment beside it naming what it guards, so a later prune keeps it.
- Keep the one at the higher seam, closest to what a caller or user sees; at the same seam, keep the one with an independent expected value (a literal, a worked example), then the easier one to read. Delete the rest. Except: a lower function with callers besides that seam is a seam of its own, so its tests are not copies; and where thin layers only pass input through to a shared service (a command line, a route, a wrapper method), keep one wiring test per layer and the rule tests at the service - layer tests that re-check those rules are copies.
- A partner outside the scope counts as a guard when the checks that run on a change to the in-scope code run it too. Where the outside one is the weaker copy, list it rather than widening the scope.
- Table-driven cases that run one path with interchangeable numbers count as one; keep the boundaries and one ordinary case. Failure inputs that fall straight into the same catch with no code of their own (a rejected fetch, a throwing parse) count as one; a failure with its own branch (`!res.ok`, a status check) is its own case. A case per entry of a lookup table guards that entry; keep each, unless a partner guards that entry.

**Decisions.** A skip or expected-fail with a comment or ticket, a platform guard, a skip-list entry, or a snapshot the repo keeps on purpose to flag changes is a decision, not waste: leave it and list it. A comment or ticket explaining an ordinary test is not; judge the test.

**Follow-ups.** When a rewrite needs more than the test itself - a seam that does not exist, a new fixture - keep the test as it is and list it as a follow-up.

## Done

- Every test in scope has a verdict, and the report accounts for every deletion, rewrite and listed item.
- The scoped suite is green (the full suite too where the prune touched code outside it), and the count dropped by exactly the deletions.
- Apart from listed follow-ups, no test left asserts absent code, a mock's own return value or a value derived from the code under test, and no two guard the same behaviour at the same seam. No orphans remain.
