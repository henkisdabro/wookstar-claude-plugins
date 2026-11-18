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

This is the 80/20 pass: the test, the code under it and its callers, plus a break on each close call and on every deletion.

## Steps

1. **Scope.** Use the path given. With none, take the whole suite; over about 30 test files or 5,000 lines, propose one package or directory and confirm it before reading.
2. **Baseline.** Run the suite for that scope and record the pass count. If it is already red, stop and report: a red suite cannot tell a broken test from a pruned one.
3. **Classify.** Read every test in scope and give it one verdict from the categories below: _keep_, _rewrite_ or _delete_. Done when every test has a verdict and a category.
4. **Break-it check** on each close call:
   - a test you would delete but suspect is the sole guard of something callers rely on;
   - a copy whose partner runs other inputs (another call, method, entry, type or value, or a field left out), or whose partner you doubt;
   - a test you would keep whose assertion looks weaker than its name.

   Break the production line its call reaches, so that only its case changes, the way its assertion would notice - an edge moved (`>` to `>=`), its one member dropped from a set or range, a failure swallowed into an empty result, a configured value hard-coded, the bug its ticket names. A break runs real code: a broken guard in front of a client the test does not stub reaches live services on whatever credentials the code finds, so break it only where the client is stubbed. Script the breaks: apply one, check the diff reaches the test's own input, run the scoped suite and any outside partner, then reverse just that edit - `git checkout` would drop this prune's edits. A crash that reddens unrelated tests is no break.
   - No such break turns it red: it guards nothing. Delete it, or rewrite it if the behaviour it names is real and nothing else guards it.
   - Red with a partner: delete it.
   - Red alone: it is the sole guard, so keep it - unless no caller can tell the broken result from the right one (a break that only slows it, such as a dropped index, they can). A branch no production caller reaches is older dead code (step 5).
5. **Prune.**
   - Before deleting or rewriting a test, check each of its assertions against the tests that stay: move any that no survivor makes into one with the same setup, or trim the test down to it. Leave the assertions inside a test you keep.
   - Rewrite each _rewrite_ test against the behaviour at its seam, with an exact, independent expected value - a literal, a worked example, the spec - that goes red on every break the old test caught.
   - Delete this prune's **orphans**: production code whose only callers were the removed tests (test-only resets, getters, exports), and the fixtures and helpers it left unused; repoint comments and docs that name a deleted test. Older dead code is listed, not deleted, and so are the tests whose only subject it is.
6. **Verify.** Run the scoped suite again: green, with the count of test ids the runner executes for the scope (parametrised cases expanded) down by exactly what the ledger removes. Then self-check every deletion with the step-4 script: against the pruned tree, apply the break the deleted test's own assertion catches, one per deleted case; when the pruned suite stays green, restore that test. If the prune touched code outside the test files in scope, also run everything that can reach it, the type-check included.
7. **Report** in these sections, writing "none" in an empty one:
   - **Ledger** - one line per pruned or rewritten test, with its category and a few words of evidence (group parametrised cases and long ledgers), then the counts, taken from the ledger: before, after, deleted and rewritten.
   - **Break-its** - each step-4 check (the break, which tests went red, the verdict), then the step-6 self-checks as a count, naming every test they restored.
   - **Listed** - every item the rules below say to list, grouped as decisions left in place, follow-ups, older dead code, and weaker partners outside the scope.

## Categories

**The past** - it guards code that is gone or will never run again (a backfill already applied, a flag that is permanently off), or never runs itself: skipped, commented out or never collected, unless the skip is a decision.

- Asserts a removed feature is gone, a file is absent, or a module left its old path - unless the removal fixed a fault or code still refuses the old form, which it then guards.

**Nothing** - no plausible change to the production code can make it fail.

- Asserts only existence or no-throw (`toBeDefined`, truthy, `not.toThrow`) on code that cannot return nothing or throw.
- Bounds so loose no plausible bug crosses them (`x >= 0`, `x < 1000`), or an expected set that admits every outcome (`exit in (0, 1)`).

A check on a fixture, list, sample or helper that other tests rely on is not Nothing: when it breaks, those tests pass while testing nothing. Nor is a check over a registry or repo data that is empty today.

**The implementation** - it changes whenever the code does, even when behaviour did not.

- Tautological: the expected value is computed the way the code computes it.
- Asserts private state, internal call order or which helper ran, or what a mock of a collaborator the project owns received or returned; a stub that only trims the setup is no verdict. Mock only at system boundaries (network, clock, randomness, third-party services, or the project's thin wrapper around one).
- A snapshot or pinned literal of whatever the code currently emits, re-recorded whenever the code changes (the git log shows it). Rewrite to assert the few values a caller depends on.

**A copy** - another test already guards the same behaviour.

- The partner counts only if it goes red on every regression the copy catches and survives this prune itself (of two tests that name each other, delete one). It must:
  - assert the behaviour succeeding;
  - run inputs that tell the cases apart - a default fixture cannot tell a configured value from a hard-coded one;
  - expect a value not derived the way the code derives it.

  Where the guarding assertion is incidental to the partner's subject, add a comment beside it naming what it guards, so a later prune keeps it.
- Keep the one at the higher seam, closest to what a caller sees; at the same seam, the one with an independent expected value, then the easier to read. Delete the rest. Except: a lower function with production callers besides that seam is a seam of its own, so its tests are not copies; and where a layer adds no branch of its own for a rule (a command line, a route, a wrapper method, a loader that only gathers the service's inputs), keep the layer's wiring tests (any that alone go red when the layer hard-codes what it forwards) and the rule tests at the service - layer tests that re-check those rules are copies.
- A test that holds two implementations equal (two copies of a pattern, a port and its source) is no copy of either side's tests: only it goes red when one side changes alone.
- A partner outside the scope counts as a guard when the checks that run on a change to the in-scope code run it too. Where the outside one is the weaker copy, list it rather than widening the scope.
- Table-driven cases that run one path with interchangeable values count as one; keep the boundaries and one ordinary case on each side. Each member of a set a condition admits (`status in (warning, critical, missing)`) is a boundary. Failures of the same call that fall straight into the same catch (a rejected fetch, a throwing parse) count as one; another call's failure is its own case, as is a failure with its own branch. A case per entry of a lookup table guards that entry; keep each, unless a partner guards it.

**Decisions.** A skip or expected-fail with a comment or ticket, a platform guard, a skip-list entry, or a snapshot the repo keeps on purpose to flag changes is a decision, not waste: leave it and list it. A comment or ticket explaining an ordinary test is not; judge the test.

**Follow-ups.** When a rewrite needs more than the test itself - a seam that does not exist, a new fixture - keep the test as it is and list it as a follow-up.

## Done

- Every deleted test's own break turns a surviving test red.
- Apart from listed follow-ups, no test left asserts absent code, a mock's own return value or a value derived from the code under test, and no two tests guard the same behaviour at the same seam. No orphans remain.
