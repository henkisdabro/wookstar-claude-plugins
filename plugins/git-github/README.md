# git-github

Commit, workflow and release conventions for Git and GitHub, built around one problem: models write GitHub Actions versions from memory, and action majors move faster than any training cutoff.

## Skills

- **git-github** (model-invoked) - Conventional Commits, SemVer and Keep a Changelog defaults, explicit-path staging, and a live action-version check. Fires when Claude writes a workflow `uses:` line, stages a commit, tags a release or edits a changelog.
- **release** (user-invoked, `/git-github:release [patch|minor|major|X.Y.Z]`) - finds every version file (`package.json`, `pyproject.toml`, `Cargo.toml`, `plugin.json` and friends), bumps them per SemVer, moves `[Unreleased]` in `CHANGELOG.md`, commits, creates an annotated `v` tag, then asks before pushing and asks again before `gh release create`.

## The action-version check

`scripts/check_actions_versions.py` asks GitHub directly for each action's latest release and tags, and prints the ref to use: the moving major tag (`actions/checkout@v7`) when one exists, otherwise the full release tag to pin (`astral-sh/setup-uv@v10.2.0`, which stopped publishing major tags). It covers third-party actions, and `--validate` flags outdated refs, tags that do not exist and SHA pins in a workflow file.

```bash
uv run scripts/check_actions_versions.py --common
uv run scripts/check_actions_versions.py --validate .github/workflows/ci.yml
```

## Prerequisites

- [uv](https://docs.astral.sh/uv/) to run the script (standard library only, PEP 723 metadata)
- [GitHub CLI](https://cli.github.com/) (`gh`), authenticated - used for the API token and by `/release`
- git

## Install

```
/plugin install git-github@wookstar-claude-plugins
```

## Project overrides

The defaults defer to your repo's `AGENTS.md` or `CLAUDE.md`. Put team rules there - commit trailers, committing straight to main, pnpm or uv in workflows, a custom release process - and both skills follow them.

## Credits

The idea of feeding agents live action versions comes from Simon Willison's [actions-latest](https://github.com/simonw/actions-latest). This plugin queries the GitHub API itself instead of reading that feed.
