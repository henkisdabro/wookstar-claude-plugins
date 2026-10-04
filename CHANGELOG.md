# Changelog

All notable changes to this marketplace. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Each plugin is versioned on its own with [SemVer](https://semver.org/); the marketplace version moves with each release.

## [Unreleased]

## [7.0.0] - 2026-10-04

Upgrading from 6.x: run `scripts/upgrade-v7.sh` or follow [MIGRATION.md](./MIGRATION.md).

### Added

- Startup notices, because plugin updates arrive without release notes:
  - each retired plugin's final version names its replacement and the uninstall command at every start
  - the five credential plugins say which command sets their values while any required setting is missing
  - `developer`, `documents` and `shopify-developer` list what moved, once per version
- `scripts/upgrade-v7.sh`:
  - updates the plugins you keep, uninstalls retired ones at user scope and installs their replacements, and prints the commands for project or local installs
  - fills in credential settings from your 6.x shell variables or a terminal prompt, keeping secrets out of process arguments and temporary files
  - lists suggestions for plugins that lost components
- `MIGRATION.md`, with a prompt you can hand to Claude instead of running the script.

### Removed

Retired plugins ship a final 2.0.0 that contains only a startup notice. A later release removes them from the marketplace.

- `codex` - use OpenAI's official plugin, `codex@openai-codex`.
- `gemini` and `mcp-gemini-bridge` - Gemini CLI stopped serving individual accounts on 2026-06-18. There is no official replacement.
- `mcp-notion` and `mcp-cloudflare` - use `notion` and `cloudflare` from `claude-plugins-official`, which connect to the same servers.
- `mcp-fetch` - the built-in WebFetch tool in Claude Code covers it.
- `documents` 2.0.0: the `docx` and `xlsx` skills. They were copies of Anthropic's skills under a licence this public repo may not redistribute. Use `document-skills@anthropic-agent-skills`.
- `developer` 4.0.0:
  - the `webapp-testing` skill - use `example-skills@anthropic-agent-skills`
  - the `devtools` skill - use `chrome-devtools-mcp`
  - the five bundled MCP servers - use the same-named official plugins
  - the `/generate-prp` command - use the `prp-generator` skill
- `shopify-developer` 3.0.0: the bulk Admin and Storefront API references. Use `shopify-ai-toolkit` for live API lookup.

### Changed

- **MCP credentials come from plugin configuration.** Secrets go in the keychain and these plugins no longer read shell variables. An existing install does not prompt on update - run `claude plugin configure <plugin>@wookstar-claude-plugins` or the upgrade script. Affected: `mcp-coingecko` 2.0.0, `mcp-perplexity` 2.0.0, `mcp-n8n` 2.0.0, `mcp-mikrotik` 2.0.0 and `mcp-google-workspace` 2.0.0.
- `mcp-alphavantage` 2.0.0 signs in with OAuth instead of carrying the API key in the URL.
- `mcp-currency-conversion` 1.1.0 and `google-tagmanager` 1.1.0 connect to their remote servers directly, without `mcp-remote`. `google-tagmanager` users sign in to Stape again through `/mcp`.
- `developer` 4.0.0:
  - `/containerize` and `/execute-prp` are now skills you invoke by name.
  - `containerize` follows current Docker practice.
  - `execute-prp` has a valid tool list.
- `react-best-practices` 1.1.0:
  - Resynced to Vercel's upstream 70 rules.
  - Notes for React Compiler and Next.js 16 caching.
- `shopify-developer` 3.0.0:
  - No pinned API version.
  - Scripts recorded as retired.
  - Covers the Hydrogen 2026.4 changes, the React Router app template and Polaris web components.
- `google-tagmanager` 1.1.0: adds server-side tagging and Consent Mode v2 guidance.
- `google-ads-scripts` 1.1.0:
  - The reference is rewritten against the current AdsApp and GAQL docs.
  - Templates default to dry run.
- `google-apps-script` 1.1.0:
  - V8 is the only runtime.
  - Retired services are flagged.
  - Quotas are corrected.
- `timezone-tools` 1.2.0: `convert_time.py` takes an optional date, so conversions across a daylight-saving change use that date's offset.
- `tampermonkey` 2.1.0:
  - Covers the Allow User Scripts toggle that Tampermonkey 5.5.1 requires.
  - Sandbox facts are corrected.
- Skill descriptions rewritten in this release use one trigger per case and a Do NOT clause naming where else to go. The longest, tampermonkey's, drops from 1,037 characters to about 720.

### Fixed

- `mcp-mikrotik` 2.0.0:
  - The password no longer appears on the command line, where `ps` exposed it.
  - The port no longer defaults to a hard-coded 2200.
- `mcp-n8n` 2.0.0 no longer points every install at one hard-coded instance.
- `mcp-open-meteo` 1.0.1 and `mcp-n8n` add `-y` to `npx`, which could otherwise stall on an install prompt.
- `google-analytics` 1.1.0:
  - Measurement Protocol consent fields and the backdating window are corrected.
  - BigQuery export tiers and pricing are corrected.
  - The server config passes `GOOGLE_CLOUD_PROJECT`, empty when unset rather than a literal placeholder.
- `google-ads-scripts` 1.1.0: removes calls to methods that do not exist, and handles costs in account currency rather than micros.
- `documents` 2.0.0: `pdf-processing-pro` scripts run with `uv run` and no install step. Previously they needed a pip step that pointed at a missing `requirements.txt`.
- `message` 3.0.1: the preview hook no longer errors on every file write when bun is missing, and works from install paths with spaces.
- `documents`, `google-ads-scripts` and `google-apps-script` call their bundled scripts through `CLAUDE_SKILL_DIR`, so they run from any directory. `message` does the same through `CLAUDE_PLUGIN_ROOT`.
- `ffmpeg` 1.0.1: replaces `-vsync`, which FFmpeg 9.0 removed.
- `humanise` 4.5.1: the description now routes proofreading and translation elsewhere.
