# Changelog

All notable changes to this marketplace. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Each plugin is versioned on its own with [SemVer](https://semver.org/); the marketplace version moves with each release.

## [Unreleased]

### Changed

- `mcp-mikrotik` 3.0.0: **breaking** - the server starts read-only (`MIKROTIK_READ_ONLY=true`), so 98 of its 218 tools load and none can change the router. The README makes plain SSH (`ssh admin@router '/ip/firewall/filter/print'`) the default for quick checks and gives the `claude mcp add` command for a write-enabled server when you need one.
- `mcp-n8n` 3.0.0: **breaking** - 20 of the server's 28 tools load. `DISABLED_TOOLS` turns off credential, data table, folder, evaluation, audit and catalogue management, and two tools that need an access token the plugin never sets. The README lists them and how to get them back.
- `mcp-alphavantage` 2.0.1: the README states the hosted server's tool count (about 120) and that it cannot be narrowed.

### Fixed

- `google-analytics` 3.0.1: the 3.0.0 startup notice failed with a `SessionStart` hook error instead of showing, because an apostrophe in its text broke the shell quoting.

## [8.1.0] - 2026-11-13

Upgrading from 8.0.x: nothing to do unless you used the MCP server that came with `google-analytics` or `google-tagmanager` - then add it yourself with one `claude mcp add` command. See [MIGRATION.md](./MIGRATION.md#to-810-from-80x).

### Changed

- `google-analytics` 3.0.0 and `google-tagmanager` 3.0.0: **breaking** - they no longer bundle an MCP server. The skills use the `ga` and `gtm` command-line tools, or Google's and Stape's own MCP servers when the user has added them. Both servers are other people's products with their own install guides; the plugins now point to those guides and give the one command for Claude Code. `google-analytics` no longer asks for credentials or shows a "needs settings" notice.
- When a task needs a real container or live data and the session has neither tool, the skill lays out the two options and their trade-offs, installs the one the user picks, and says which steps are the user's (`references/tool-setup.md` in each skill).
- `scripts/upgrade.sh` no longer configures `google-analytics`, and prints the command for adding each server by hand.

## [8.0.1] - 2026-11-13

No action needed. Update `model-id-upgrade` to pick up the changes.

### Added

- `model-id-upgrade` 1.1.0:
  - The scanner flags **made-up or malformed model IDs** and says why - a date on a dateless (4.6+) model, a snapshot date that never shipped, the wrong name order for 3.x versus 4+, a dotted API ID, a `-v1` suffix on a 4.6+ Bedrock ID. The TSV gains a fifth column with the reason.
  - The skill looks up the deprecations and pricing pages, lists callers of a model near retirement first, and quotes the new model's rates in the report.
  - For runtime code it reads the new model's migration guide and fixes the call in the same commit.

### Fixed

- `model-id-upgrade`: the scanner no longer reports the current model's gateway form (`anthropic/claude-sonnet-5.5`), regex-escaped prose, or an ID truncated at a template variable.

## [8.0.0] - 2026-11-13

This is a major release (8.0.0): it deletes plugins, retires one and changes how `google-analytics` takes credentials.

**Upgrading from 7.x - four things to check:**

1. `google-analytics` 2.0.0 takes its credentials file and Google Cloud project ID from plugin configuration. Run `claude plugin configure google-analytics@wookstar-claude-plugins`; until you do, its MCP server stays off and a startup notice reminds you.
2. `timezone-tools` is retired. Run `claude plugin uninstall timezone-tools@wookstar-claude-plugins`; nothing replaces it.
3. `mcp-google-workspace` 3.0.0 loads Gmail, Drive and Calendar only. If you used its Docs, Sheets or other tools, add the server yourself with those services - see its README.
4. `codex`, `gemini`, `mcp-gemini-bridge`, `mcp-notion`, `mcp-cloudflare` and `mcp-fetch`, retired in 7.0.0, are deleted. Uninstall any still installed.

`scripts/upgrade.sh` does the first two and the last, and updates the plugins you keep; it replaces `scripts/upgrade-v7.sh`, which still works. Step-by-step notes, and what changes without action, are in [MIGRATION.md](./MIGRATION.md#to-800-from-7x).

### Added

- `message` 4.1.0: **remote awareness for the preview.** Local use is unchanged. When the session looks remote (SSH variables, or Linux with no display) the server adds a note with the port-forwarding command and the skill relays it. `MESSAGE_REMOTE=1` or `--remote` turns on remote mode: no browser launch on the remote machine, and Open links open in the browser showing the preview. `MESSAGE_REMOTE=0` silences the note.
- `google-tagmanager` 2.0.0: covers the **optimised container** launched on 2026-10-12 - Destination tags, Shared settings, External account links, telling legacy from optimised from mixed, a checklist for the migration wizard - and the 2026 head-only install snippet (`references/optimised-container.md`).
- `google-tagmanager` 2.0.0: the skill can install and drive [owntag/gtm-cli](https://github.com/owntag/gtm-cli) as an alternative to the bundled Stape MCP server, for scripting, CI and service-account access (`references/cli.md`).
- `google-analytics` 2.0.0: covers **Data Manager** - the Analytics Admin page in open beta since 2026-11-06, and the Data Manager API as a route for sending events (`references/data-manager.md`).
- `google-analytics` 2.0.0: the skill can install and drive [google-analytics-cli](https://github.com/daidalytics/google-analytics-cli) (`ga`) for GA4 configuration changes, which the bundled read-only MCP server cannot make (`references/cli.md`).
- A trigger eval per model-invoked skill under each plugin's `evals/` (22 cases), run with `claude plugin eval plugins/<name>`.
- CI on every pull request: `claude plugin validate`, the personal-info scan and the `message` tests.
- `scripts/upgrade.sh`: one upgrade script for every earlier version. It uninstalls retired plugins, updates the rest and fills in prompted settings from your old shell variables.
- README: prerequisites per plugin, example prompts, the one-step `--marketplace` install, and an upgrade section saying what each release asks of you.
- MIGRATION.md: a section per release, and how retirement works.
- MCP plugin READMEs say what each server can do, counted from its real tool list, which tools write, and what to try. Every plugin README gives the one-step install line.

### Changed

- `google-analytics` 2.0.0: **breaking** - the Analytics MCP server takes its credentials file and Google Cloud project ID from plugin configuration; `GOOGLE_APPLICATION_CREDENTIALS` and `GOOGLE_CLOUD_PROJECT` are no longer read from the shell. A startup notice reminds you until they are set. The server is pinned to `analytics-mcp` 1.1.0.
- `google-analytics` 2.0.0: **rebuilt as guardrails, not a tutorial** - 5,800 lines of reference cut to about 700. The fourteen tutorial reference files are gone; in their place are a glossary, a table of where numbers come from and why reports, Explorations, the Data API and BigQuery disagree, the collection routes, one limits table, a pitfalls list grouped by task, what changed in 2025-2026, and links to Google's docs. Corrections along the way: event-name, item and data-stream limits; the renamed Admin sections; the attribution models removed in 2023; what a data deletion request removes; the Measurement Protocol consent payload; the Consent Mode v2 dates.
- `google-tagmanager` 2.0.0: **rebuilt as guardrails, not a tutorial** - 4,500 lines of reference cut to about 550. The ten tutorial reference files are gone; in their place are a glossary of the overloaded terms, the three JavaScript environments side by side with the regex dialect, a pitfalls list grouped by task, and a table of links to Google's docs. Every statement was checked against Google's documentation; what rests on field observation is marked. Corrections along the way: web-container regex is not documented as RE2, no container-level tag timeout exists, only the Live environment is built in, Shopify's documented route is a custom pixel, and regex is described per environment - JavaScript regex in web-container triggers, RE2 in server templates and in GA4 reports - where the old text called everything RE2. Custom HTML tags and Custom JavaScript variables are stated as ES5 only; templates accept `const`, `let` and arrow functions.
- `humanise` 4.7.0: 39 patterns (was 34), adding 2025-26 corpus studies of model tells to the Wikipedia source, with new `sources.md` and `voice-and-pulse.md` references. Sources last checked 2026-11-11.
- `model-id-upgrade` 1.0.1: treats a new ID in runtime code as an API migration - it flags call sites whose request parameters newer models reject and points to the migration guide. Mythos is listed as a family.
- MCP servers pinned to exact releases, so upstream updates arrive only with a plugin bump: `mcp-coingecko` 2.0.1, `mcp-n8n` 2.0.1, `mcp-open-meteo` 1.0.2, `mcp-perplexity` 2.0.1, `mcp-mikrotik` 2.0.1.
- `mcp-google-workspace` 3.0.0: **breaking** - loads only the Gmail, Drive and Calendar tools (38) where it used to load every Workspace service (about 120). Docs, Sheets, Slides, Forms, Tasks, Chat, Contacts and Apps Script tools are no longer available through this plugin; its README shows how to add the server yourself with the services you want. Pinned to `workspace-mcp` 2.4.0.
- Marketplace entries no longer repeat `mcpServers`, `lspServers` or `strict`: each plugin's own `.mcp.json` and `plugin.json` are the single source, which Claude Code loads by default (verified on 2.1.323).
- Skills tightened - steps first, a completion criterion per step, reference material behind conditional pointers: `message` 4.1.0 (preview internals moved to `references/preview.md`), `tampermonkey` 2.1.1, `documents` 2.0.1, `ffmpeg` 1.0.2, `developer` 4.0.1, `git-github` 1.0.1, `media-tools` 1.0.1, `quarto-revealjs` 1.0.1.

- Facts in every skill checked against vendor documentation and corrected, and duplicated reference material given a single owner:
  - `shopify-developer` 3.1.0: Hydrogen reference rewritten for the framework-agnostic Hydrogen that went generally available in October 2026, with the earlier API kept under a legacy heading and a migration table; the legacy samples checked against the 2026.4 skeleton and corrected (cart action, SEO `media`, Shop Pay domain, default query caching); Functions limits corrected.
  - `tampermonkey` 2.1.1: `@types/tampermonkey` 5.5.0, Manifest V3 wording, and about 400 lines of duplicated reference consolidated.
  - `quarto-revealjs` 1.0.1: PDF export - fragments print on one page by default, speaker notes use `show-notes: separate-page`.
  - `developer` 4.0.1: Compose `version:` is obsolete and warns; tracing goes over OTLP to Jaeger; pinned library versions updated or generalised; the PRP research reference cut to external research only.
  - `documents` 2.0.1: Ghostscript is no longer required from OCRmyPDF 17.
  - `ffmpeg` 1.0.2: container and codec wording, more GPU encoder names, and one owner each for `-c copy`, seeking and codec flags.
  - `google-ads-scripts` 1.1.1, `google-apps-script` 1.1.1, `typst` 1.0.1: dates and limits confirmed; duplication removed.

### Fixed

- `message`: the preview server answers only requests addressed to a loopback host name, and `/open` and the reload socket refuse another site's `Origin`, so a web page elsewhere can neither read a draft through DNS rebinding nor trigger an Open.
- README listed `/plugin update <name>`, which is not a session command.
- `google-analytics` `bigquery` and `quarto-revealjs`: a `$` before a digit in `SKILL.md`, which the skill loader replaced with a positional argument when the skill was invoked with arguments.
- `message`: the hook matcher no longer names the legacy `MultiEdit` tool, and the documented test command now matches `package.json`.
- `git-github`: `/release` uses the documented `Bash(git *)` permission form.
- `tampermonkey`: the skill may run `npm`, `pnpm`, `npx` and `node`, which its TypeScript reference tells it to use.

### Removed

- `scripts/install-claude-plugins.sh`, a personal machine-setup script that read like an official installer. Install plugins with `/plugin install`, and upgrade with `scripts/upgrade.sh`.
- The tutorial reference files in `google-tagmanager` and `google-analytics`, replaced by the glossary, pitfalls and links to Google's docs described above.
- `timezone-tools` 2.0.0 is **retired**: current Claude models convert timezones on their own. The final version only shows an uninstall notice.
- `codex`, `gemini`, `mcp-gemini-bridge`, `mcp-notion`, `mcp-cloudflare` and `mcp-fetch`, retired in 7.0.0, are deleted and mapped to `null` in the marketplace `renames`.

## [7.1.0] - 2026-11-13

Upgrading `message` to 4.0.0: its preview is now a destination picker titled Paste Ready, and new drafts go to `drafts/` unless your project's CLAUDE.md or AGENTS.md names a drafts directory. Fragments and every old shortcut keep working.

### Added

- `message` 4.0.0:
  - **22 destinations** in one picker - Email (Gmail, Mail app), Generic (Plain text, Markdown), Messaging (WhatsApp, Slack, Telegram, Discord, Teams, Signal, iMessage, Messenger) and Social (X, LinkedIn, Facebook, Instagram, Threads, Bluesky, Mastodon, Reddit, TikTok, YouTube) - driving one Copy and one Open button. The preview shows exactly what will be pasted, converted to each app's own markup by one dialect-driven converter. Research, limits and sources in `references/destinations.md`.
  - A length counter per destination (X uses its weighted count), red past the limit.
  - X Free / Premium toggle. On Free, a post over 280 becomes a numbered thread (` 1/3` ...) with one card per post; `C` copies the next post. Bluesky, Threads and Mastodon thread the same way.
  - Choose the destination with `channel:` / `tier:` frontmatter, `serve.ts --channel <id>`, a shorthand `--<id or alias>` flag, `--tier`, or a `?channel=` / `&tier=` query on the preview URL; `--list-channels` prints them all. Fragments without `channel` open on Gmail as before.
  - **Copy Plain Text** (shortcut `P`) copies the message as `text/plain` with all Markdown syntax stripped. Rules in `references/plaintext-formatting.md`.
  - Shortcuts `C` / `O` (copy / open the selected destination) and `[` / `]` (previous / next destination); `G`, `T`, `M`, `P`, `E`, `W` and `R` keep working.
  - In the Gmail and Rich Text payloads, a table column whose body cells are all numbers (amounts, currency, percentages, `k`/`m` suffixes) is right-aligned in a monospaced font with tabular figures, so figures line up. An explicit Markdown alignment wins, and a bracketed negative in such a column is written with a leading minus (`(1,200)` becomes `-1,200`, `AUD (1,200)` becomes `-AUD 1,200`); text columns keep their brackets. Rules in `references/formatting-rules.md`.

### Changed

- `message` 4.0.0:
  - `marked` 18.0.3 → 18.1.3, parser bug fixes including two catastrophic-backtracking fixes. Rendered output for the skill's formatting rules is unchanged.
  - To, CC, BCC and Subject are required and shown for email destinations only.
  - The preview page is redesigned around the destination picker, in light and dark, and is titled **Paste Ready** (was Message Preview).
  - A WhatsApp table wider than 24 display columns is stacked as one block per row, the first cell as a bold title and each other cell as `Header: value`, instead of wrapping on a small phone.
  - The default drafts directory is now `drafts/` (was `data/writing/email_drafts/`). A project that names its own drafts directory in CLAUDE.md or AGENTS.md is unaffected, and the hook previews a fragment wherever it lives.
  - Browser opening no longer goes through `cmd`: `rundll32` on Windows, and on WSL2 `wslview` or `rundll32.exe` found on PATH or the mounted Windows drive, so a URL's `&` is never cut.

### Fixed

- `message`:
  - `bun run test` ran from `scripts/` and found no test files; it now runs `../tests`.
  - The table examples in SKILL.md no longer contain a `$` before a digit, which the skill loader replaced with a positional argument when the skill was invoked with arguments. A test now guards it.
  - An open preview tab now keeps its server alive; the 30-minute idle clock starts when the last tab closes.
  - Text copies fall back to a hidden textarea when the Clipboard API is refused.
  - `/open` answers 502 when no handler could be launched, so the page falls back to `window.open`.
  - WhatsApp text keeps nested-list bullets and indents, one `> ` per quoted line, line breaks inside list items, and an ordered list's start number.

## [7.0.0] - 2026-10-04

Upgrading from 6.x: run `scripts/upgrade-v7.sh` or follow [MIGRATION.md](./MIGRATION.md).

### Added

- New plugins:
  - `git-github` 1.0.0: commit and workflow conventions, a live GitHub Actions version resolver (the actions-latest feed it used to read went empty on 2026-09-30), and a user-triggered `/release` that confirms before every push and publish.
  - `model-id-upgrade` 1.0.0: scans for stale Claude model IDs, separates historical records from live targets, and edits only after approval.
  - `typst` 1.0.0: Typst language reference, current to 0.15.1.
  - `quarto-revealjs` 1.0.0: Quarto reveal.js slide decks with templates and themes, current to Quarto 1.10.
  - `media-tools` 1.0.0: YouTube search and caption or audio download with yt-dlp, and local Whisper transcription.
- `documents` 2.0.0 gains `ocr` (OCRmyPDF) and `document-parse` (LiteParse and AILANG Parse).
- `google-analytics` 1.1.0 gains a `bigquery` skill for GA4 export querying through Google's official BigQuery MCP options.
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
- `gemini` and `mcp-gemini-bridge` - Gemini CLI stopped serving individual accounts on 2026-06-18. Google's successor is Antigravity CLI; there is no official Claude Code plugin for it.
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
- `humanise` 4.6.0:
  - Synced to Wikipedia's Signs of AI writing as of 2026-10-04.
  - #20 catches recommended-usage disclaimers ("should be treated as X rather than Y").
  - #9 notes that ChatGPT and Claude now produce "X rather than Y", not only Grok.
  - #2 adds "was identified by" and the awards-and-recognition section as a structural sign.
  - A stored voice profile now counts as a calibration sample.
- `message` 3.0.2 tells Claude to edit fragments only with Write or Edit, since the preview hook ignores other tools.
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
- `message` 3.0.2: the preview hook no longer errors on every file write when bun is missing, and works from install paths with spaces.
- `documents`, `google-ads-scripts` and `google-apps-script` call their bundled scripts through `CLAUDE_SKILL_DIR`, so they run from any directory. `message` does the same through `CLAUDE_PLUGIN_ROOT`.
- `ffmpeg` 1.0.1: replaces `-vsync`, which FFmpeg 9.0 removed.
- `humanise` 4.6.0: the description now routes proofreading and translation elsewhere.
- LSP plugins (`lsp-bash`, `lsp-css`, `lsp-html` 1.0.2; `lsp-json`, `lsp-yaml` 1.1.2): the READMEs gave install commands for plugin names that do not exist.
- `timezone-tools` 1.2.0 warns when a time falls in a daylight-saving gap or overlap, and its scripts answer `--help`.
- `documents` 2.0.0: `pdf-extract` imports `pymupdf` instead of the deprecated `fitz` alias.
- `developer` 4.0.0: fifteen-factor examples no longer use end-of-life log4j 1.x, Springfox or OpenTracing.
