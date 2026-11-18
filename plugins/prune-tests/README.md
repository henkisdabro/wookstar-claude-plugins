# prune-tests

Test suites gather tests that look like coverage but guard nothing: they assert a deleted feature is gone, check what the type system already guarantees, recompute the expected value the way the code does, or repeat another test. This plugin finds and removes them in one cheap pass, and rewrites the ones that cover real behaviour.

It is the 80/20 pass. The evidence is the test, the code it names, and at most one deliberate break of the code for a test it is unsure of. No mutation campaign, no kill matrix, no new property or E2E suites - run those separately once the obvious waste is gone.

## What it prunes

A test stays when it is **anchored**: it changes only when intended behaviour changes, and fails only when that behaviour regresses. Everything else falls into one of four categories:

| Category | Examples |
|---|---|
| **The past** | Asserts a removed feature is gone or a module left its old path; tests a spent one-off migration or backfill; a refactor's equivalence suite once the refactor has shipped; skipped, commented-out or `.only`-shadowed tests; test files the runner never picks up |
| **Nothing** | Tests the browser, framework or type system; mocks the unit under test and asserts the mock; only `toBeDefined` or `not.toThrow` on code that cannot fail that way |
| **The implementation** | Tautological expected values; private state, call order or internal mocks; large snapshots updated wholesale |
| **A copy** | Another test guards the same behaviour - the one closest to what a caller sees is kept |

It also deletes production code, fixtures and helpers that existed only for the removed tests.

## How a run goes

1. **Scope** - the path you give, or the whole suite. Over about 30 test files with no path, it proposes a scope and asks first.
2. **Baseline** - runs the suite. A suite that is already failing stops the run: a pruned test and a broken one would look the same.
3. **Classify** every test in scope as keep, rewrite or delete. Lint rules the repo already has for skipped, focused or assertion-less tests run first, so judgement goes only where a reader is needed.
4. **Break-it check** for close calls only: break the behaviour once at its boundary (`>` to `>=`, off by one), see whether the test fails, revert.
5. **Prune** and rewrite.
6. **Verify** - suite green, and the test count down by exactly the deletions.
7. **Report** a ledger of every deletion and rewrite, with the close calls listed separately and the lint rules that would stop each category coming back.

Changes are left uncommitted so you review the diff before keeping it.

## Install

```
/plugin install prune-tests@wookstar-claude-plugins
```

On Claude Code 2.1.275 or later, in one step without adding the marketplace first: `/plugin install prune-tests --marketplace henkisdabro/wookstar-claude-plugins`

## Usage

The skill runs only when you type it - deleting tests should be a deliberate act, so Claude never starts it on its own.

```
/prune-tests:prune-tests                  # whole suite (asks for a scope if it is large)
/prune-tests:prune-tests src/billing      # one directory
```

Start on a clean working tree so the diff holds only the pruning.

## Model and effort

The skill sets `model: opus` and `effort: high` for its turn; your session model returns on your next message. Judging whether a test is tautological or a copy is careful reading, and a wrong deletion costs more than the tokens saved by a smaller model. To run it on your session model instead, change `model` to `inherit` in the installed `SKILL.md`. `CLAUDE_CODE_EFFORT_LEVEL`, when set, overrides the effort.

## Works well with

The skill uses the vocabulary of Matt Pocock's [`/tdd`](https://github.com/mattpocock/skills) skill - seam, tautological, implementation-coupled - and points to it for rewrites and to `/codebase-design` when a test has no seam to rewrite against. Neither is required.

## Credit

Built on [caldoai's `/prune-tests`](https://github.com/caldoai/skills/blob/main/skills/prune-tests/SKILL.md) - its three categories (the past, nothing, the implementation) and its examples. This version adds dead and skipped tests, copies, a green baseline and verify step, the break-it check and the ledger.
