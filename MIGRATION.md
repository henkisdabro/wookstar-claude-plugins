# Migrating to 7.0.0

7.0.0 retires the plugins and skills that Anthropic, OpenAI, Shopify and other vendors now publish officially, fixes how MCP plugins handle credentials, and rewrites the remaining skills for current Claude Code. The official versions are maintained by the people who build the underlying tools - prefer them.

## How 7.0.0 reaches you

Claude Code does not auto-update third-party marketplaces unless you turned that on. Without it, refreshing the marketplace only updates the catalogue - update each plugin as well:

```bash
claude plugin marketplace update wookstar-claude-plugins
claude plugin update <plugin>@wookstar-claude-plugins   # once per plugin you keep
```

Inside Claude Code, `/plugin` does the same from its Installed tab. If you enabled auto-update, Claude Code updates in the background and shows `Plugin updated: <name> · Run /reload-plugins to apply`.

The next time Claude Code starts after the update, notices tell you what needs doing. `/reload-plugins` loads the new versions but does not show them - restart to see them.


- **A retired plugin** still installed shows a notice at every start naming its replacement and the uninstall command, until you uninstall it. Its final version contains nothing else.
- **A credential plugin** with no settings yet (`mcp-n8n`, `mcp-coingecko`, `mcp-perplexity`, `mcp-mikrotik`, `mcp-google-workspace`) shows a notice at every start until you configure it. Without settings its MCP server does not start.
- **`developer`, `documents` and `shopify-developer`** show one notice, once, listing what moved.

## Fastest path

From a clone of this repo:

```bash
scripts/upgrade-v7.sh --dry-run   # see what it would do
scripts/upgrade-v7.sh             # do it
```

Without a clone:

```bash
curl -fsSL https://raw.githubusercontent.com/henkisdabro/wookstar-claude-plugins/main/scripts/upgrade-v7.sh | bash -s -- --dry-run
curl -fsSL https://raw.githubusercontent.com/henkisdabro/wookstar-claude-plugins/main/scripts/upgrade-v7.sh | bash
```

The script:

1. refreshes this marketplace and updates every plugin you keep from it
2. uninstalls every retired plugin you have at user scope and installs its official replacement, adding that marketplace if you lack it
3. fills in the settings credential plugins now need - it reuses the shell variable 6.x read where you still have it set, keeps `mcp-mikrotik` on port 2200 as 6.x did, and otherwise asks on the terminal, hiding secrets as you type
4. prints the commands for anything installed at project or local scope, and suggestions for plugins that lost components

It needs `claude` and `jq` on your `PATH`, is safe to run twice, and exits non-zero if any step failed.

## Or hand it to Claude

Paste this into a Claude Code session:

```text
Migrate my wookstar-claude-plugins installs to 7.0.0 using
https://github.com/henkisdabro/wookstar-claude-plugins/blob/main/MIGRATION.md.
Run `claude plugin list --json`, then for every plugin from
wookstar-claude-plugins in the "Retired plugins" table: uninstall it at the
scope it is installed in, and install its replacement at the same scope,
adding the replacement's marketplace first if `claude plugin marketplace list`
lacks it. For each credential plugin in the "Credential changes" table that I
have installed, run `claude plugin configure <plugin>@wookstar-claude-plugins`
and tell me which values are unset - ask me for them rather than guessing, and
save them with `--values-stdin`. For kept plugins in the "Moved components"
table, show me which replacements apply and ask before installing them. Finish
by listing what changed and telling me to restart Claude Code.
```

## Retired plugins

| Retired | Replacement | Install |
|---|---|---|
| `codex` | OpenAI's official Codex plugin | `claude plugin marketplace add openai/codex-plugin-cc` then `claude plugin install codex@openai-codex` |
| `gemini` | None. Gemini CLI stopped serving individual accounts on 2026-06-18 and Google is moving to Antigravity CLI. | - |
| `mcp-gemini-bridge` | None - it wraps Gemini CLI. | - |
| `mcp-notion` | Notion's official plugin (same server, `mcp.notion.com`) | `claude plugin install notion@claude-plugins-official` |
| `mcp-cloudflare` | Cloudflare's official plugin (same server, plus Workers and Wrangler skills) | `claude plugin install cloudflare@claude-plugins-official` |
| `mcp-fetch` | Claude Code's built-in WebFetch tool | nothing to install |

Uninstall each with `claude plugin uninstall <name>@wookstar-claude-plugins`, adding `--scope project` or `--scope local` if that is where you installed it. Until you do, the retired plugin's final version shows a startup notice and does nothing else. A later release removes these names from the marketplace for good.

## Moved components

These plugins stay, but parts of them moved to official plugins.

| Plugin | Removed | Replacement | Install |
|---|---|---|---|
| `documents` | `docx`, `xlsx` skills | Anthropic's `document-skills` (docx, xlsx, pptx, pdf) | `claude plugin marketplace add anthropics/skills` then `claude plugin install document-skills@anthropic-agent-skills` |
| `developer` | `webapp-testing` skill | Anthropic's `example-skills` | `claude plugin install example-skills@anthropic-agent-skills` (after adding `anthropics/skills`) |
| `developer` | `devtools` skill and Chrome DevTools MCP | `chrome-devtools-mcp` | `claude plugin install chrome-devtools-mcp@claude-plugins-official` |
| `developer` | Playwright, Context7, Firecrawl and Microsoft Docs MCP servers | Same-named official plugins | `claude plugin install playwright@claude-plugins-official` (likewise `context7`, `firecrawl`, `microsoft-docs`) |
| `developer` | `/generate-prp` command | The `prp-generator` skill (same job, working template) | already included |
| `shopify-developer` | Admin and Storefront API reference bulk | Shopify's `shopify-ai-toolkit` for live schema lookup and validation | `claude plugin install shopify-ai-toolkit@claude-plugins-official` |

`docx` and `xlsx` were removed for licensing as well as staleness: they were copies of Anthropic's source-available skills, which this public repo may not redistribute.

`/containerize` and `/execute-prp` still work - they are now skills you invoke by name rather than commands, so they cost no context until you call them.

`claude-plugins-official` is added automatically the first time you start Claude Code interactively. On a fresh machine where you only script, add it first with `claude plugin marketplace add anthropics/claude-plugins-official`.

## Credential changes

These MCP plugins now take their settings from plugin configuration and keep secrets in your system keychain instead of reading shell variables. A fresh install prompts when you enable the plugin. An existing install does **not** prompt on update - its MCP server stays off and a startup notice appears until you set the values with either of:

- `/plugin configure <plugin>@wookstar-claude-plugins` inside Claude Code
- `claude plugin configure <plugin>@wookstar-claude-plugins` in a terminal, which lists what is unset; add `--values-stdin` to pipe a JSON object of values

The upgrade script does this for you. Afterwards you can unset the old variables.

| Plugin | Now prompts for | Old variable no longer read |
|---|---|---|
| `mcp-coingecko` | demo API key | `COINGECKO_DEMO_API_KEY` |
| `mcp-perplexity` | API key | `PERPLEXITY_API_KEY` |
| `mcp-n8n` | instance URL and API key | `N8N_API_KEY` (the URL used to be hard-coded) |
| `mcp-mikrotik` | host, username, password, port | `MIKROTIK_HOST`, `MIKROTIK_USER`, `MIKROTIK_PASSWORD`; the port defaults to 22 instead of the 2200 that 6.x hard-coded, so set `mikrotik_port` to 2200 if that is where your router listens (the script does) |
| `mcp-google-workspace` | OAuth client ID and secret | `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET` |
| `mcp-alphavantage` | nothing - sign in through `/mcp` (OAuth) | `ALPHAVANTAGEAPIKEY` |

`google-analytics` now passes `GOOGLE_CLOUD_PROJECT` (the variable Google's auth library reads) instead of `GOOGLE_PROJECT_ID`, which the server never used. If you exported `GOOGLE_PROJECT_ID`, export `GOOGLE_CLOUD_PROJECT` instead.

`mcp-currency-conversion` and `google-tagmanager` now connect to their remote servers directly, so they no longer need Node or the `mcp-remote` proxy. For `google-tagmanager` that means signing in to Stape again: run `/mcp`, pick its server and complete the browser sign-in. Tokens that `mcp-remote` cached do not carry over.

## Everything else

`CHANGELOG.md` lists every change by plugin.
