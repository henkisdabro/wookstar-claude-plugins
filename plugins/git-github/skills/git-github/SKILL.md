---
name: git-github
description: Git commits, GitHub Actions workflows, release tags and changelogs, with a live check that resolves every action version from GitHub. Use when writing or editing a workflow `uses:` line, bumping or auditing action versions, validating a workflow file, staging or writing a commit message, naming a branch, tagging a release, or editing CHANGELOG.md. Do NOT use for running a full release (bump, tag, push, GitHub release) - use /release; or for general git troubleshooting such as merge conflicts - handle directly.
---

# Git and GitHub

Conventional Commits, Semantic Versioning and Keep a Changelog apply as published. This skill adds the committing discipline, the release conventions, and the live action-version check.

When the repo's `AGENTS.md` or `CLAUDE.md` sets its own rules for commits, branches, trailers or workflows, those rules win over every default below.

## Committing

1. Stage by explicit path: `git add -- <path>...`.
2. Review the staged set with `git diff --cached --stat` (`git status --short` shows the whole tree).
3. Commit once the staged set holds exactly the files this change touched.

Message: subject `type(scope): subject` - imperative, lowercase, no full stop, 72 characters or fewer. The body says what changed and why.

Branches: `feature/`, `fix/`, `docs/` or `refactor/` plus a short description, merged to the default branch through a pull request.

## Releases

- Tags take a `v` prefix and are annotated: `git tag -a v1.2.3 -m "Release v1.2.3"`.
- The release commit is `chore(release): v1.2.3`, moving `## [Unreleased]` in `CHANGELOG.md` under a new `## [1.2.3] - YYYY-MM-DD` heading.

The full bump-tag-publish sequence lives in the `/release` skill.

## GitHub Actions

Write every `uses:` line from script output - action majors move faster than any model's training data, and several popular actions have stopped publishing moving major tags.

```bash
uv run "${CLAUDE_SKILL_DIR}/scripts/check_actions_versions.py" --common                       # widely used actions
uv run "${CLAUDE_SKILL_DIR}/scripts/check_actions_versions.py" actions/checkout pnpm/action-setup
uv run "${CLAUDE_SKILL_DIR}/scripts/check_actions_versions.py" --validate .github/workflows/ci.yml
```

The script queries GitHub directly, so it covers first-party and third-party actions alike. It prints the ref to use: the moving major tag (`v7`) when the latest release's major has one, otherwise the full release tag to pin (`v10.2.0`). `--validate` exits non-zero and lists outdated refs, tags that do not exist, and SHA pins to confirm by hand. It authenticates through `GITHUB_TOKEN`, `GH_TOKEN` or `gh auth token`; anonymous calls cap at 60 an hour.

Done when every `uses:` line in the workflow matches a ref the script printed this session, and `--validate` on the file exits 0 (SHA pins excepted once confirmed).

Every workflow declares a `permissions:` block scoped to what its jobs need.

## Project overrides

House rules vary by team; take them from the repo's `AGENTS.md` or `CLAUDE.md` and apply them over the defaults above. Typical ones:

- Commit trailers - whether to add or omit `Co-Authored-By` lines.
- Branching - commit straight to the default branch instead of pull requests, or squash-merge only.
- Toolchain in workflows - for example pnpm for Node (with `pnpm/action-setup` reading `packageManager` from `package.json`, so `with: version` stays off) or uv for Python.
