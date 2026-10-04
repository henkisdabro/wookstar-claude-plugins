---
name: release
description: Cut a release - bump the version in every version file, move the CHANGELOG, commit, tag, push and create the GitHub release, confirming before anything leaves the machine.
argument-hint: "[patch|minor|major|X.Y.Z]"
disable-model-invocation: true
allowed-tools: Read, Edit, Glob, Grep, Bash(git:*), Bash(gh:*), AskUserQuestion
---

# Release

Version bump, release commit, annotated tag, push, GitHub release - in that order. Steps 1-4 are local and reversible; steps 5-6 publish and each needs the user's explicit yes.

Requested bump: `$ARGUMENTS` (ask for patch, minor, major or an explicit version when empty).

If the repo's `AGENTS.md`, `CLAUDE.md`, `RELEASING.md` or `CONTRIBUTING.md` describes a release process, follow it and use these steps only to fill its gaps.

## 1. Pre-flight

```bash
git status --short
git branch --show-current
git fetch --tags && git status -sb | head -1
gh auth status
```

Done when: the tree is clean, the branch is the default branch (or the one the repo's docs name for releases), it is level with its upstream, and `gh` is authenticated. Anything else - stop and report it.

## 2. Find every version file

Look for the version in each of these that exists, and also grep the repo for the current version string to catch hand-maintained copies (a `VERSION` constant, a README badge, docs metadata):

| File | Field |
|---|---|
| `package.json` | `"version"` (lockfile: regenerate with the repo's package manager, never hand-edit) |
| `pyproject.toml` | `[project] version` or `[tool.poetry] version` (skip when `dynamic = ["version"]`) |
| `Cargo.toml` | `[package] version` (then `cargo update -w` refreshes `Cargo.lock`) |
| `.claude-plugin/plugin.json` | `"version"`, plus the matching entry in `.claude-plugin/marketplace.json` |
| `manifest.json`, `version.txt`, `VERSION`, `src/**/__init__.py` `__version__` | the literal version |

A version derived from git tags (setuptools-scm, hatch-vcs, semantic-release) needs no file edit - the tag in step 4 is the bump.

Done when: you have listed every file and line carrying the current version, and they all agree. Disagreement - stop and ask which is right.

## 3. Bump and update the changelog

Compute the new version per SemVer: patch for fixes, minor for backwards-compatible features, major for breaking changes (resetting the lower parts to 0). Pre-1.0 projects may treat minor as breaking - say which you chose and why.

1. Edit every location from step 2 to the new version.
2. In `CHANGELOG.md`, rename `## [Unreleased]` to `## [X.Y.Z] - YYYY-MM-DD` (today, ISO), add a fresh empty `## [Unreleased]` above it, and update the compare links at the foot if the file has them. No changelog - offer to start one; skip if declined.
3. Run the repo's build and test commands, if it has them.

Done when: a grep for the old version finds only historical entries (changelog sections, lockfile entries for other packages), and build and tests pass.

## 4. Commit and tag (local)

```bash
git add -- <each file from step 2 and CHANGELOG.md>
git diff --cached --stat
git commit -m "chore(release): vX.Y.Z"
git tag -a vX.Y.Z -m "Release vX.Y.Z"
```

Use the repo's own tag format if its existing tags differ (`git tag --sort=-v:refname | head -3`).

Done when: `git show --stat vX.Y.Z` shows the release commit with exactly those files.

## 5. Confirm, then push

Show the user the commit, the tag, the remote and the branch, and what pushing the tag will trigger (check `.github/workflows/` for `on: push: tags` or `on: release` - often a package publish). Ask with `AskUserQuestion`: push commit and tag / push nothing yet. Only on an explicit yes:

```bash
git push origin <branch>
git push origin vX.Y.Z
```

Push the commit before the tag so the tag points at a commit the remote already has.

## 6. Confirm, then create the GitHub release

Ask again before publishing. On yes:

```bash
gh release create vX.Y.Z --title "vX.Y.Z" --notes-file <changelog section saved to a temp file>
```

Use `--generate-notes` instead when there is no changelog. Then `gh run list --limit 3` to show any workflow the release started, and report its status.

Done when: the user has the release URL and the status of any triggered workflow.

## Undo

Before step 5: `git tag -d vX.Y.Z && git reset --hard HEAD~1`. After publishing, deleting a tag or release others may have fetched needs the user's say-so: `gh release delete vX.Y.Z --yes`, `git push origin --delete vX.Y.Z`, then `git revert` the release commit. A published package version usually cannot be reused - ship the next patch instead.
