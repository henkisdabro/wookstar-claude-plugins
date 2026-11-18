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

This is the 80/20 pass: the evidence is the test, the code under it and that code's callers, and at most one break-it check for a test you are unsure of. It removes the obvious waste quickly. Mutation campaigns, kill matrices and new property or E2E suites are separate work, done when the user asks for them.

Speak the `/tdd` vocabulary: **seam** (the public boundary where behaviour is observed), **tautological**, **implementation-coupled**. When a rewrite is not obvious, read the `tdd` skill's `tests.md`, which shows good and bad tests side by side.

## Steps

1. **Scope.** Use the path given. With none, take the whole suite; when it has more than about 30 test files, propose a scope (one package or directory) and confirm it before reading. Done when the list of test files is fixed.
2. **Baseline.** Run the suite for that scope and record the pass count. If it is already red, stop and report: pruning against a red suite cannot tell a broken test from a pruned one.
3. **Classify.** Where the repo's linter has rules for skipped, focused or assertion-less tests (`no-disabled-tests`, `no-focused-tests` and `expect-expect` in the jest and vitest ESLint plugins; ruff's `PT` rules), run them first: their hits are settled, so judgement goes on the rest. Read every test in scope and give it one verdict from the categories below: _keep_, _rewrite_ or _delete_. Done when every test has a verdict and a category.
4. **Break-it check**, only for close calls: a test you would delete but suspect is the sole guard of something callers rely on, or a copy's partner you are not sure would catch the regression. Break that behaviour once - at its boundary where it has one (`>` to `>=`, off by one), since that is the break a weak test misses - then run the test and revert. Red: it guards the behaviour. Green: it does not, so delete the test, or keep the copy whose partner failed the check.
5. **Prune.**
   - Delete each _delete_ test, and the empty `describe` blocks, section comments and files it leaves behind.
   - Rewrite each _rewrite_ test against the behaviour at its seam, with an independent expected value: a literal, a worked example, the spec.
   - Delete production code whose only callers were the removed tests (test-only resets, getters, exports), and fixtures and helpers this prune left unused. Dead code that was already there goes in the report, not the bin.
6. **Verify.** Run the scoped suite again: green, with the count down by exactly the tests you deleted. If the prune touched anything outside the test files in scope (production code, shared fixtures or helpers), run the full suite too. Leave the changes uncommitted for review, unless the user asked for a commit.
7. **Report** a ledger: one line per pruned or rewritten test (cases of one parametrised test share a line per category, listing the case ids), with its category and a few words of evidence, then the before and after counts. List tests you kept after a break-it check separately, since those are the close calls. Close with the lint rules that would stop each category you found from coming back.

## Categories

**The past** - it guards code that is gone or will never run again.

- Asserts a removed feature is gone, a file is absent, or a module left its old path.
- Tests a spent one-off: a data migration or backfill already applied, a flag that is permanently off. A schema migration replayed on every fresh database still runs; its tests stay.
- Skipped, commented-out or `.only`-shadowed tests, and test files the runner never picks up (outside its glob, missing the suffix). Dead weight that reads like coverage. Delete, or rewrite if the behaviour it names still exists and nothing else guards it.

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

- The partner counts only if it would go red on this regression: it asserts the behaviour succeeding (read the snapshot lines that cover it - a snapshot can record a crash), with inputs that tell the cases apart (a fixture equal to the default cannot). When unsure, run the break-it check on the partner.
- Keep the one at the higher seam, closest to what a caller or user sees; at the same seam, keep the one with an independent expected value (a literal, a worked example), then the easier one to read. Delete the rest. A lower function that other code calls directly is a seam of its own, so its tests are not copies.
- A test that is only partly a copy: trim it to its unique assertions.
- A partner outside the scope still counts as a guard, so the in-scope copy can go. Where the outside one is the weaker copy, list it in the report rather than widening the scope.
- A wiring test at a thin outer layer (a command line, a route) and rule tests at the service beneath it guard different things. Neither is a copy; keep both.
- Table-driven cases that run one path with interchangeable numbers count as one; keep the boundaries and one ordinary case. A case per entry of a lookup table guards that entry; keep each.

**Decisions.** Anything with a stated reason - a skip or expected-fail with a comment or ticket, a platform guard, a skip-list entry, a snapshot the repo keeps on purpose to flag changes - is a decision, not waste: leave it and list it.

**Follow-ups.** When a rewrite needs more than the test itself - a seam that does not exist, a new fixture - keep the test as it is and list it in the report as a follow-up. A missing seam is a design problem for `/codebase-design`, not a pruning one.

## Done

- Every test in scope has a verdict; the ledger accounts for every deletion and rewrite.
- The scoped suite is green, and the full suite too where the prune touched code outside it; the count dropped by exactly the deletions.
- No test left asserts absent code, a mock's own return value, or a value derived from the code under test, other than the follow-ups the report lists.
- No two tests left guard the same behaviour at the same seam.
- Nothing this prune left unused remains: production code, fixtures, helpers.

## Example

```diff
--- a/pricing.test.ts
+++ b/pricing.test.ts
@@ rewritten: tautological expected value @@
 test("applies the discount", () => {
-  const price = 100;
-  expect(applyDiscount(price, 0.2)).toBe(price - price * 0.2);
+  expect(applyDiscount(100, 0.2)).toBe(80);
 });
--- a/cart.test.ts
+++ b/cart.test.ts
@@ rewritten at the seam: it asserted private state @@
 test("adds an item to the cart", () => {
   const cart = new Cart();
   cart.add(book);
-  expect(cart._items.length).toBe(1);
+  expect(cart.total()).toBe(book.price);
 });
@@ deleted, a copy: checkout.test.ts guards the same total through the checkout seam @@
-test("total includes tax", () => {
-  expect(cartTotal([book], { tax: 0.1 })).toBe(11);
-});
--- a/export.test.ts
+++ b/export.test.ts
@@ deleted, the past: guards code that no longer exists @@
-test("legacy exporter is gone", () => {
-  expect(existsSync("src/export/legacy.ts")).toBe(false);
-});
-test.skip("exports v1 CSV", () => {
-  expect(exportV1(rows)).toMatchSnapshot();
-});
--- a/session.test.ts
+++ b/session.test.ts
@@ deleted, with the production code that only existed for it @@
-test("clears the cache", () => {
-  _resetCacheForTests();
-  expect(_getCacheSize()).toBe(0);
-});
--- a/session.ts
+++ b/session.ts
@@ @@
-export function _resetCacheForTests() { cache.clear(); }
-export function _getCacheSize() { return cache.size; }
```
