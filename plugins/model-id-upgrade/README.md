# model-id-upgrade

When a new Claude model ships, old model IDs linger in skills, agent definitions, prompts, config defaults and code. This plugin sweeps them up without touching history.

## What it does

1. Reads the current model IDs from the [Claude models overview](https://platform.claude.com/docs/en/about-claude/models/overview) at run time - nothing is hard-coded, so it keeps working after the next release.
2. Scans read-only for every stale form of a family: dated and dateless API IDs, old-order `claude-3-5-sonnet-*`, `-latest`, dotted versions, OpenRouter `anthropic/...`, Bedrock (`us.anthropic....-v1:0`) and Vertex (`@YYYYMMDD`) forms, and prose such as "Sonnet 4.5".
3. Flags **made-up or malformed IDs** and says why: a date on a model that has none, a snapshot date that never shipped, the wrong name order, a dotted API ID, a stray `-v1` Bedrock suffix. These are common in code written by a model from memory.
4. Splits hits into **TARGET** (skills, agents, configs, code - candidates for editing) and **RECORD** (changelogs, logs, transcripts, backups, caches, vendored code - never rewritten).
5. Reports per family and per repo, with the new model's rates and any retirement date for the model it replaces, then asks for scope (instructions only, plus runtime code, or report only) and whether to commit.
6. Edits ID-shaped strings only, re-scans for leftovers, and commits per repo if approved. For runtime code it reads the new model's migration guide first and fixes the call in the same commit, since a new ID there is an API migration.

## Prerequisites

- [uv](https://docs.astral.sh/uv/) to run the bundled scanner (standard library only)
- [ripgrep](https://github.com/BurntSushi/ripgrep) (`rg`)
- Web access for the models page

## Install

```
/plugin install model-id-upgrade@wookstar-claude-plugins
```

On Claude Code 2.1.275 or later, in one step without adding the marketplace first: `/plugin install model-id-upgrade --marketplace henkisdabro/wookstar-claude-plugins`

## Usage

Ask "a new Claude model is out - upgrade the model IDs in this repo", or run `/model-id-upgrade:claude-model-upgrade ~/projects` to sweep several repos.

The scanner also runs on its own:

```bash
uv run skills/claude-model-upgrade/scripts/scan.py sonnet claude-sonnet-5-5 ~/projects --out /tmp
```

## Excluding your own records

Add one path regex per line to `~/.config/claude-model-upgrade/ignore` to class matching paths as RECORD on every run (meeting notes, exported chats, archived reports). `--exclude GLOB` skips a tree entirely; `--record REGEX` adds a one-off rule.
