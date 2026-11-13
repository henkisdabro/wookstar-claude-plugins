# wookstar-claude-plugins

A Claude Code plugin marketplace. No build step: every plugin is a directory under `plugins/`, and
it does not exist until it also has an entry in `.claude-plugin/marketplace.json`. The only unit
tests are the message plugin's - `bun run test` in `plugins/message/skills/message/scripts/`. CI
(`.github/workflows/ci.yml`) runs those, the validator and the personal-info scan below on every
pull request.

Verify a change with `claude plugin validate .` (no errors or warnings at HEAD), then exercise
it: `/plugin marketplace add .`, `/plugin install <plugin>@wookstar-claude-plugins`, and
`/plugin marketplace update wookstar-claude-plugins` to pick up later edits. Its Advice block lists
the retired plugins (see below) as lacking an install line; that is expected, since their READMEs
carry only the uninstall line, and it does not change the verdict.

Bump the plugin's `version` whenever its content changes - that is what busts the install cache for
people who already have it. Bump it in **`plugins/<name>/.claude-plugin/plugin.json`**, which is the
field that decides the installed version, and update the marketplace entry to match. Bumping only
the marketplace entry does nothing: at install time plugin.json wins and the entry version is
silently ignored, so the cache never busts and the change never reaches anyone. Every plugin
currently agrees across both files; `claude plugin validate .` warns on any pair that drifts.

Retire a plugin in two releases, because updates arrive without release notes and a bare removal
only flips installed copies to `disabled`. First ship a final major version holding nothing but a
`SessionStart` hook whose `systemMessage` names the replacement and the uninstall command, with a
`[RETIRED]` description and a row in `MIGRATION.md`. A later release deletes the directory and entry
and adds `"<name>": null` to the marketplace's top-level `renames`. When a release removes skills
from a plugin that stays, or adds required `userConfig`, give that plugin a startup notice too:
once per version via a marker file in `${CLAUDE_PLUGIN_DATA}`, or for missing settings, while the
`CLAUDE_PLUGIN_OPTION_<KEY>` variables are empty.

## This repo is public

Henrik's real name, email, phone and client paths must never land here. The handle `henkisdabro` and
the throwaway address `whom-wealthy.2z@icloud.com` are the correct stand-ins and already fill every
author block. His global instructions hand you his real name every session, so this is easy to get
wrong by being helpful.

Before committing, expect zero hits from:

```bash
git ls-files -z | xargs -0 grep -EIin \
  'henrik ?so[ei]derlund|[a-z0-9._%+-]+@(henriksoderlund|gmail|icloud|outlook)\.[a-z]{2,}' \
  | grep -v 'whom-wealthy.2z@icloud.com'
```

It scans every tracked file rather than a hand-listed set of paths, so it cannot go stale as the
repo grows - and it covers this file, which a path list left out and which is the likeliest place
for a real name to land.

## MCP credentials

Credentials come from `userConfig` in the plugin's `plugin.json`, referenced in `.mcp.json` as
`${user_config.<key>}` with `"sensitive": true` on secrets. Claude Code prompts at enable time and
keeps secrets in the keychain. Pass keys through `env` or `headers` - an `args` entry shows in `ps`
and a URL query string lands in proxy logs - and use a remote server's own OAuth where it offers one.

## One place for servers, two for versions

**MCP servers** live in the plugin's own `.mcp.json` and **LSP servers** in the `lspServers` block of
its `.claude-plugin/plugin.json`. Claude Code loads both from there by default, so the marketplace
entry carries neither `mcpServers`, `lspServers` nor `strict`. Tested on Claude Code 2.1.323 with a
scratch marketplace: a plugin with only `.mcp.json`, and one with `lspServers` only in plugin.json,
each loaded its server; the copies this repo used to keep in the entries changed nothing.

**Plugin versions** are the one thing in both files, and the duplication is not symmetrical:
plugin.json is authoritative at install time and the marketplace entry is cosmetic. Bump both, lead
with plugin.json, and let the validator confirm they match. See the note above on why bumping the
entry alone is a no-op.

## Skill descriptions are the only trigger surface

The validator does not check them and a bad one fails silently, so keep every new `SKILL.md` to the house
formula: a declarative one-line summary, then `Use when` with 5-10 explicit trigger phrases, then
`Do NOT use for` with the scenarios that should route elsewhere. Both halves matter - the negative
signals are what stop a skill firing on unrelated requests.

Each model-invoked skill has a trigger case under its plugin's `evals/trigger-<skill>/`: a prompt
that should fire the skill and a grader that checks it did. Add one with every new skill, and run
`claude plugin eval plugins/<name>` after changing a description. A run makes real model calls, so
it is not in CI.

## Skills are guardrails, not tutorials

A skill earns its context by changing what a current model does. `google-tagmanager` and
`google-analytics` are the pattern: a glossary of the terms models blur, pitfalls as one line each
(wrong move, then right one), what changed recently enough that training is likely wrong, and links
to the vendor's docs for everything else. Each meaning has one home - the pitfalls that apply to
every task sit in `SKILL.md`, the rest in a reference group read only for that task. Check a fact
against the vendor's own page before writing it, and mark what rests on observation.

## MCP servers are pinned

Every `npx`, `uvx` and `pipx` server in a `.mcp.json` names an exact version, so a new upstream release
reaches users only through a plugin bump. When raising a pin, pick a release at least three days
old and bump the plugin.
