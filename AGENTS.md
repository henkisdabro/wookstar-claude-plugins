# wookstar-claude-plugins

A Claude Code plugin marketplace. No build step, no tests: every plugin is a directory under
`plugins/`, and it does not exist until it also has an entry in `.claude-plugin/marketplace.json`.

Verify a change with `claude plugin validate .` (clean at HEAD, warnings included), then exercise
it: `/plugin marketplace add .`, `/plugin install <plugin>@wookstar-claude-plugins`, and
`/plugin marketplace update wookstar-claude-plugins` to pick up later edits.

Bump the plugin's `version` whenever its content changes - that is what busts the install cache for
people who already have it. Bump it in **`plugins/<name>/.claude-plugin/plugin.json`**, which is the
field that decides the installed version, and update the marketplace entry to match. Bumping only
the marketplace entry does nothing: at install time plugin.json wins and the entry version is
silently ignored, so the cache never busts and the change never reaches anyone. Every plugin
currently agrees across both files; `claude plugin validate .` warns on any pair that drifts.

Removing a plugin takes more than deleting its directory and entry: add `"<name>": null` to the
marketplace's top-level `renames`, so existing installs show a removal notice instead of a
`not found` error on every session, and give it a row in `MIGRATION.md` naming the replacement.

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

## Three things that are declared in two places

**MCP servers** belong in the plugin's own `.mcp.json`, referenced from its marketplace entry as
`"mcpServers": "./.mcp.json"`. Never repeat them in `plugin.json` - one source of truth, and the
marketplace decides what loads.

**LSP servers** are the opposite and do need duplicating: each `plugins/lsp-*/` has its `lspServers`
block in both `.claude-plugin/plugin.json` and its marketplace entry. Change one and you must change
the other.

**Plugin versions** live in both files too, and here the duplication is not symmetrical: plugin.json
is authoritative at install time and the marketplace entry is cosmetic. Bump both, lead with
plugin.json, and let the validator confirm they match. See the note above on why bumping the entry
alone is a no-op.

## Skill descriptions are the only trigger surface

Nothing validates them and a bad one fails silently, so keep every new `SKILL.md` to the house
formula: a declarative one-line summary, then `Use when` with 5-10 explicit trigger phrases, then
`Do NOT use for` with the scenarios that should route elsewhere. Both halves matter - the negative
signals are what stop a skill firing on unrelated requests.
