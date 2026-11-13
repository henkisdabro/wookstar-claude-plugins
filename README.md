# 🧰 Wookstar Claude Code Plugins

[![Latest release](https://img.shields.io/github/v/release/henkisdabro/wookstar-claude-plugins?label=release&color=blue)](https://github.com/henkisdabro/wookstar-claude-plugins/releases/latest)
[![Licence: MIT](https://img.shields.io/github/license/henkisdabro/wookstar-claude-plugins?color=green)](./LICENSE)
[![Claude Code](https://img.shields.io/badge/built%20for-Claude%20Code-d97757)](https://code.claude.com/docs)

A curated collection of [Claude Code](https://code.claude.com/docs) plugins, published as a plugin marketplace - **31 active plugins** across development, analytics, content, data and ops. 🎯 Pick what you need; every plugin installs on its own.

> ✨ **New in 8.0.0:** the `google-tagmanager` and `google-analytics` skills are rebuilt as guardrails - a glossary of the terms models blur, the mistakes they typically make, and what changed recently (GTM's optimised container and 2026 install snippet, Data Manager in Analytics) - and both can now drive a command-line tool as well as their MCP server. Every other skill was fact-checked against vendor docs and tightened. See the [CHANGELOG](./CHANGELOG.md).
>
> 🔎 **8.0.1:** `model-id-upgrade` now flags made-up or malformed Claude model IDs and says why, and checks retirement dates and pricing.
>
> ⬆️ **Upgrading from 7.x?** Four things to check: `google-analytics` now asks for its credentials, `mcp-google-workspace` loads Gmail, Drive and Calendar only, `timezone-tools` is retired, and the plugins retired in 7.0.0 are gone. Run [`scripts/upgrade.sh`](./scripts/upgrade.sh) or follow [MIGRATION.md](./MIGRATION.md) - see [Upgrading](#upgrading).
>
> 📦 **Earlier:** 7.1.0 brought `message` 4.0.0 with the Paste Ready preview for 22 destinations; 7.0.0 added `git-github`, `model-id-upgrade`, `typst`, `quarto-revealjs` and `media-tools`.

---

## 📦 What's inside

| Category | Plugins | What you get |
|---|---:|---|
| 🛠️ [Development](#development) | 6 | PRP planning and containerisation, git and GitHub Actions with releases, React/Next.js rules, Shopify themes, browser userscripts, Google Apps Script |
| 📊 [Analytics](#analytics) | 3 | GTM and GA4 guardrails with MCP servers and CLIs, GA4 BigQuery querying, Google Ads automation |
| 🤖 [AI](#ai) | 2 | Claude model ID upgrades, Perplexity search MCP server |
| ⚡ [Productivity](#productivity) | 4 | Rich-text email drafts, Gmail/Drive/Calendar, n8n, Excalidraw |
| 📝 [Content](#content) | 6 | PDF extraction, OCR and parsing, Typst, Quarto slide decks, FFmpeg, YouTube search and transcription, AI-text humaniser |
| 💹 [Data](#data) | 3 | Stocks, crypto, FX rates |
| 🔧 [Utilities](#utilities) | 2 | MikroTik routers, weather |
| 🩺 [LSP servers](#lsp-servers) | 5 | Real-time diagnostics for Bash, CSS, HTML, JSON, YAML |

> Two install surfaces - `/plugin install …` runs **inside** an active Claude Code session; `claude plugin install …` runs in a **plain terminal**. Both accept the same arguments. See [Installation Methods](#installation-methods) for the full mapping.

---

<a id="plugin-catalogue"></a>

## 🗂️ Plugin catalogue

<a id="development"></a>

### 🛠️ Development

- **`developer`** - PRP planning (`prp-generator`, `/execute-prp`), `/containerize`, and the Fifteen-Factor App methodology.
- **`git-github`** - Commits, workflows and a user-triggered `/release`, with a script that resolves the current version of every GitHub Action from the GitHub API.
- **`react-best-practices`** - Vercel Engineering's 70 React and Next.js performance rules, with local notes for React Compiler and Next.js 16 caching.
- **`shopify-developer`** - Liquid, theme development (OS 2.0), Hydrogen (the 2026.10 framework-agnostic release, with a migration table from the earlier one), Functions and debugging. Live API lookup goes to Shopify's official `shopify-ai-toolkit`.
- **`tampermonkey`** - Userscript development with 19 reference files - browser automation, page modification, web enhancement.
- **`google-apps-script`** - Workspace automation: SpreadsheetApp, DocumentApp, GmailApp, DriveApp, CalendarApp, FormApp, SlidesApp, triggers.

<a id="analytics"></a>

### 📊 Analytics

- **`google-tagmanager`** - Guardrails for GTM work: a glossary of the terms models blur (event, tag, pixel, Google tag, Destination), the three JavaScript environments side by side, the optimised container and 2026 install snippet, and a pitfalls list - with links to Google's docs for the rest. Includes the Stape GTM MCP server (browser sign-in) and optional support for the `gtm` CLI from owntag.
- **`google-analytics`** - Guardrails for GA4 work: a glossary (event, key event versus conversion, parameter versus dimension, the IDs), why reports, the Data API and BigQuery disagree, Data Manager, one checked limits table and a pitfalls list - plus cost-controlled querying of the GA4 BigQuery export. Includes Google's read-only Analytics MCP server and optional support for the `ga` CLI for configuration changes.
- **`google-ads-scripts`** - AdsApp campaign automation, bid management, keyword optimisation, reporting.

<a id="ai"></a>

### 🤖 AI

- **`model-id-upgrade`** - Finds stale and made-up Claude model IDs across a repo or machine, separates historical records from live config, and upgrades only the targets after your approval - reading the migration guide first where runtime code is involved.
- **`mcp-perplexity`** - Perplexity AI search and information retrieval, for when you want Perplexity's cited answers rather than the built-in web search.

<a id="productivity"></a>

### ⚡ Productivity

- **`message`** - Email, WhatsApp, Slack and social-post drafts with **live browser preview** across 22 destinations. Triggered by phrases like "draft an email to…", "write a WhatsApp message…" or "write a tweet…". Bun-powered preview server starts automatically.
- **`mcp-google-workspace`** - Gmail, Drive and Calendar through your own Google OAuth client; 38 tools, several of which act as you. If you only need read access, Claude's built-in Google connectors are less setup.
- **`mcp-n8n`** - n8n node and template lookup, workflow validation, and reading and writing workflows on your instance.
- **`mcp-excalidraw`** - Hand-drawn diagrams with streaming animations, fullscreen editing, checkpoint/restore, export to excalidraw.com. Third-party hosted server.

<a id="content"></a>

### 📝 Content

- **`documents`** - Fast PDF text extraction, OCR for scans (OCRmyPDF 17, no Ghostscript needed), structured parsing of complex PDFs and office files, plus scripts for forms, tables, merging and splitting. For writing Word, Excel and PowerPoint files use Anthropic's `document-skills`.
- **`typst`** - Typst language reference: markup, maths, set/show rules, layout, tables, templates and PDF/HTML export.
- **`quarto-revealjs`** - Quarto reveal.js slide decks with meeting and technical-talk templates, light and dark themes, speaker notes and PDF export.
- **`ffmpeg`** - Video and audio CLI reference - filters, codecs (H.264/H.265/VP9), GPU acceleration, common workflows.
- **`media-tools`** - Search YouTube and pull captions or audio with yt-dlp, then transcribe locally with Whisper (mlx-whisper on Apple Silicon).
- **`humanise`** - Strip 39 AI writing tells from text - inflated language, em-dash overuse, sycophantic tone, formulaic structure, placeholder text, leaked chatbot artifacts - drawn from Wikipedia's "Signs of AI writing" and 2025-26 corpus studies of model tells. Calibrates on a sample of your own writing, audits its own draft, and never invents a fact to make a vague sentence specific.

<a id="data"></a>

### 💹 Data

- **`mcp-alphavantage`** - Stock market data, company info, financial indicators (OAuth sign-in through `/mcp`).
- **`mcp-coingecko`** - Cryptocurrency prices and market data (demo API key).
- **`mcp-currency-conversion`** - Real-time FX exchange rates (no API key). Community-hosted server, best-effort.

<a id="utilities"></a>

### 🔧 Utilities

- **`mcp-mikrotik`** - MikroTik router management over SSH: about 220 tools, most of which write to the router.
- **`mcp-open-meteo`** - Weather and climate data (no API key).

<a id="lsp-servers"></a>

### 🩺 LSP servers

Real-time diagnostics, completions, and hover docs. **Two-step install for each:** first the language server binary (npm command shown), then the plugin itself (`/plugin install lsp-<lang>@wookstar-claude-plugins`).

| Plugin | Languages | Binary install |
|---|---|---|
| **`lsp-bash`** | `.sh`, `.bash` (ShellCheck-powered) | `npm i -g bash-language-server` + `brew install shellcheck` |
| **`lsp-css`** | `.css`, `.scss`, `.less` | `npm i -g vscode-langservers-extracted` |
| **`lsp-html`** | `.html`, `.htm` | `npm i -g vscode-langservers-extracted` |
| **`lsp-json`** | `.json`, `.jsonc` | `npm i -g vscode-langservers-extracted` |
| **`lsp-yaml`** | `.yaml`, `.yml` (auto-detects GitHub Actions, Docker Compose, Kubernetes, 1,500+ schemas) | `npm i -g yaml-language-server` |

> `lsp-css`, `lsp-html`, and `lsp-json` share the same `vscode-langservers-extracted` package - one npm install covers all three.

Then install the plugins (e.g. all five at once):

```
/plugin install lsp-bash@wookstar-claude-plugins
/plugin install lsp-css@wookstar-claude-plugins
/plugin install lsp-html@wookstar-claude-plugins
/plugin install lsp-json@wookstar-claude-plugins
/plugin install lsp-yaml@wookstar-claude-plugins
```

---

## 🚀 Quick Start

### 1. Add the marketplace

Inside Claude Code:

```
/plugin marketplace add henkisdabro/wookstar-claude-plugins
```

Or from your terminal:

```bash
claude plugin marketplace add henkisdabro/wookstar-claude-plugins
```

On Claude Code 2.1.275 or later you can skip this step and install in one line:

```
/plugin install message --marketplace henkisdabro/wookstar-claude-plugins
```

### 2. Install the plugins you want

Pick from the [catalogue above](#plugin-catalogue). Pattern is always `<name>@wookstar-claude-plugins`. A few common combinations:

```bash
# Core development
/plugin install developer@wookstar-claude-plugins
/plugin install react-best-practices@wookstar-claude-plugins

# Analytics + email
/plugin install google-tagmanager@wookstar-claude-plugins
/plugin install google-analytics@wookstar-claude-plugins
/plugin install message@wookstar-claude-plugins

# Document and media work
/plugin install documents@wookstar-claude-plugins
/plugin install ffmpeg@wookstar-claude-plugins
/plugin install humanise@wookstar-claude-plugins
```

### 3. Use a plugin

Most plugins **trigger automatically** when you describe what you want in plain language - no slash command needed. For example, after installing `message`:

> *"Draft an email to Sarah about the project update."*

The skill loads, generates the draft, and (for `message`) opens a live browser preview. For commands that have explicit slash forms (e.g. `/containerize` from the developer plugin), type the command directly.

A few more things to ask once the matching plugin is installed:

| Plugin | Try |
|---|---|
| `documents` | *"This PDF is a scan - make it searchable and pull out the tables."* |
| `google-analytics` | *"Which landing pages lost the most sessions last month compared with the month before?"* |
| `google-tagmanager` | *"Audit this container for tags that fire without consent."* |
| `git-github` | *"Check every action version in my workflows."* then `/release minor` |
| `media-tools` | *"Find the three most-viewed YouTube videos on sGTM this year and transcribe the first."* |
| `humanise` | *"Humanise this draft."* |
| `model-id-upgrade` | *"A new Claude model is out - upgrade the model IDs in this repo."* |
| `quarto-revealjs` | *"Turn these meeting notes into a slide deck."* |

If a plugin needs an API key or URL, Claude Code asks for it when you enable the plugin - see [Credentials](#credentials).

<a id="prerequisites"></a>

### Prerequisites

Skill-only plugins such as `shopify-developer`, `tampermonkey`, `humanise`, `react-best-practices` and the Google scripting and analytics references need nothing installed. The rest call tools on your machine:

| Plugin | Needs |
|---|---|
| `message` | [Bun](https://bun.sh) |
| `documents` | [uv](https://docs.astral.sh/uv/); OCRmyPDF for `ocr`; LiteParse and AILANG Parse for `document-parse` - see its [README](./plugins/documents/README.md) |
| `media-tools` | yt-dlp, ffmpeg, and mlx-whisper or openai-whisper |
| `ffmpeg` | ffmpeg |
| `typst` | Typst |
| `quarto-revealjs` | Quarto |
| `git-github` | uv, and the `gh` CLI for releases |
| `model-id-upgrade` | uv and ripgrep |
| `developer` | Docker or Podman for `/containerize` |
| `google-analytics` | pipx for the bundled MCP server |
| `mcp-coingecko`, `mcp-n8n`, `mcp-open-meteo`, `mcp-perplexity` | Node.js (`npx`) |
| `mcp-google-workspace`, `mcp-mikrotik` | uv (`uvx`) |
| `lsp-*` | the language server binary - see [LSP servers](#lsp-servers) |

The local MCP servers are pinned to a known release, so a new upstream version reaches you only when the plugin is updated.

---

<a id="installation-methods"></a>

## 💻 Installation Methods

There are two ways to install and manage plugins. They do the same thing but run in different places - **don't mix them up**.

| Action | Inside Claude Code | Terminal CLI |
|---|---|---|
| Add this marketplace | `/plugin marketplace add henkisdabro/wookstar-claude-plugins` | `claude plugin marketplace add henkisdabro/wookstar-claude-plugins` |
| Install a plugin | `/plugin install <name>@wookstar-claude-plugins` | `claude plugin install <name>@wookstar-claude-plugins` |
| Update marketplace | `/plugin marketplace update wookstar-claude-plugins` | `claude plugin marketplace update wookstar-claude-plugins` |
| Update a plugin | `/plugin`, then **Update now** on the Installed tab | `claude plugin update <name>` |
| Enable / disable | `/plugin enable <name>` · `/plugin disable <name>` | `claude plugin enable <name>` · `claude plugin disable <name>` |
| Uninstall | `/plugin uninstall <name>` | `claude plugin uninstall <name>` |
| List installed | `/plugin list` | `claude plugin list` |
| Browse interactively | `/plugin` (opens UI) | n/a |
| Validate manifest | n/a | `claude plugin validate <path>` |

**Rule of thumb:** the `/plugin` snippets in this README assume a Claude Code session is open. In a plain terminal or CI, swap `/plugin …` for `claude plugin …`.

---

<a id="credentials"></a>

## 🔐 Credentials

MCP plugins that need a key or URL declare it as plugin configuration: Claude Code prompts for the values when you enable the plugin, keeps secrets in your system keychain, and passes them to the server. Nothing goes in your shell profile.

| Plugin | Asks for |
|---|---|
| `mcp-coingecko` | demo API key ([get one](https://www.coingecko.com/en/api)) |
| `mcp-perplexity` | API key ([get one](https://www.perplexity.ai/settings/api)) |
| `mcp-n8n` | instance URL and API key |
| `mcp-mikrotik` | router host, SSH username, password, port |
| `mcp-google-workspace` | OAuth client ID and secret |
| `google-analytics` | credentials file and Google Cloud project ID |

`mcp-alphavantage` and `google-tagmanager` (Stape) sign in through OAuth - run `/mcp` and pick the server on first use. `mcp-excalidraw`, `mcp-open-meteo` and `mcp-currency-conversion` need nothing.

Installed one of the plugins above before it took prompted settings (7.0.0, or 2.0.0 for `google-analytics`)? Updating does not prompt - run `claude plugin configure <plugin>@wookstar-claude-plugins`, or let the upgrade script fill the values in. A startup notice reminds you until you do.

---

## 🤝 Recommended companion plugins

Wookstar focuses on domain-specific skills. For core Claude Code capabilities, the **[official Anthropic marketplace](https://github.com/anthropics/claude-plugins-official)** is the best complement:

```
/plugin marketplace add anthropics/claude-plugins-official
```

It is added automatically the first time you start Claude Code interactively. Plugins that replaced parts of this marketplace in 7.0.0:

- `chrome-devtools-mcp`, `playwright`, `context7`, `firecrawl`, `microsoft-docs` - browser and docs tooling formerly bundled in `developer`
- `notion`, `cloudflare` - formerly `mcp-notion` and `mcp-cloudflare`
- `shopify-ai-toolkit` - live Shopify API lookup and validation
- `document-skills` and `example-skills` from `anthropics/skills` (`/plugin marketplace add anthropics/skills`) - Word, Excel, PowerPoint, PDF and web-app testing
- `codex` from `openai/codex-plugin-cc` - OpenAI Codex

---

<a id="upgrading"></a>

## ⬆️ Upgrading

Claude Code does not auto-update third-party marketplaces unless you turned that on, and updates carry no release notes. So after a release, either run the upgrade script or do the three steps by hand.

**The script** works from any earlier version, previews with `--dry-run`, and is safe to run twice:

```bash
curl -fsSL https://raw.githubusercontent.com/henkisdabro/wookstar-claude-plugins/main/scripts/upgrade.sh | bash -s -- --dry-run   # preview
curl -fsSL https://raw.githubusercontent.com/henkisdabro/wookstar-claude-plugins/main/scripts/upgrade.sh | bash
```

**By hand:**

```bash
claude plugin marketplace update wookstar-claude-plugins          # 1. refresh the catalogue
claude plugin update <plugin>@wookstar-claude-plugins             # 2. once per plugin you keep
claude plugin uninstall <plugin>@wookstar-claude-plugins          # 3. for each retired plugin
```

Then restart Claude Code. Inside a session, `/plugin` does steps 2 and 3 from its Installed tab.

### What each release asks of you

| Coming from | What needs action | Details |
|---|---|---|
| **7.x to 8.0.0** | Configure `google-analytics` (`claude plugin configure google-analytics@wookstar-claude-plugins`). If you used `mcp-google-workspace` for Docs or Sheets, add the server yourself (it now loads Gmail, Drive and Calendar only). Uninstall `timezone-tools`. Uninstall any of `codex`, `gemini`, `mcp-gemini-bridge`, `mcp-notion`, `mcp-cloudflare`, `mcp-fetch` still installed. | [MIGRATION.md](./MIGRATION.md#to-800-from-7x) |
| **6.x to 7.0.0** | Replace the retired plugins with their official equivalents. Configure the MCP plugins that moved to prompted credentials. Install official plugins for the parts of `developer`, `documents` and `shopify-developer` that moved. | [MIGRATION.md](./MIGRATION.md#to-700-from-6x) |
| **5.x to 6.0** | Swap the three umbrella plugins for the single-purpose ones. | Below |

### How plugins are retired

A plugin never disappears without warning. Its final version contains only a startup notice that names the replacement and the uninstall command; a later release deletes it, and Claude Code then marks an installed copy as removed. `timezone-tools` is at the notice stage now.

<details>
<summary><strong>Upgrading from v5.x</strong> (only relevant if you installed before v6.0)</summary>

In v6.0 the `productivity`, `marketing`, and `utilities` umbrella plugins were split into focused single-purpose plugins.

### Step 1 - Uninstall the old umbrellas (in your terminal)

```bash
# One-liner
claude plugin uninstall productivity@wookstar-claude-plugins && \
  claude plugin uninstall marketing@wookstar-claude-plugins && \
  claude plugin uninstall utilities@wookstar-claude-plugins && \
  claude plugin marketplace update wookstar-claude-plugins && \
  rm -rf ~/.claude/plugins/productivity ~/.claude/plugins/marketing ~/.claude/plugins/utilities
```

### Step 2 - Clean up settings files

Check `~/.claude/settings.json` and any `.claude/settings.json` in your projects:

```bash
grep -E "productivity|marketing|utilities" ~/.claude/settings.json
find ~ -path "*/.claude/settings.json" -exec grep -l -E "productivity|marketing|utilities" {} \; 2>/dev/null
```

| Old reference | Replace with |
|---|---|
| `productivity@…` | Specific plugins (`google-apps-script`, `tampermonkey`, `message`) |
| `marketing@…` | `google-tagmanager`, `google-analytics`, `google-ads-scripts` |
| `utilities@…` | nothing - `timezone-tools` is retired, Claude converts timezones on its own |

### Step 3 - Install replacements

```
/plugin install google-apps-script@wookstar-claude-plugins
/plugin install tampermonkey@wookstar-claude-plugins
/plugin install google-tagmanager@wookstar-claude-plugins
/plugin install google-analytics@wookstar-claude-plugins
/plugin install google-ads-scripts@wookstar-claude-plugins
```

`git-worktrees` is no longer published - Claude Code now supports worktrees natively.

</details>

---

## 👥 Team configuration

Add the marketplace and pre-enable plugins in `.claude/settings.json` so team members install them automatically when they trust the repo:

```json
{
  "extraKnownMarketplaces": {
    "wookstar-claude-plugins": {
      "source": {
        "source": "github",
        "repo": "henkisdabro/wookstar-claude-plugins"
      }
    }
  },
  "enabledPlugins": {
    "developer@wookstar-claude-plugins": true,
    "documents@wookstar-claude-plugins": true,
    "google-tagmanager@wookstar-claude-plugins": true,
    "google-analytics@wookstar-claude-plugins": true
  }
}
```

---

## 🧪 Local development

```bash
git clone https://github.com/henkisdabro/wookstar-claude-plugins.git
cd wookstar-claude-plugins

# Add as local marketplace
/plugin marketplace add .

# Install a plugin for testing
/plugin install developer@wookstar-claude-plugins

# After making changes
/plugin marketplace update wookstar-claude-plugins

# Validate manifest
claude plugin validate .

# Check a skill still fires on its trigger prompt (makes real model calls)
claude plugin eval plugins/developer
```

Every pull request runs the validator, a personal-info scan and the `message` tests in CI. Each model-invoked skill has a trigger eval under its plugin's `evals/`.

For contributor guidelines (manifest rules, where servers are declared, version bumps, skill style), see **[AGENTS.md](./AGENTS.md)**.

---

## 📚 Documentation

Per-plugin READMEs:

- **Toolkits** - [developer](./plugins/developer/README.md) · [documents](./plugins/documents/README.md) · [shopify-developer](./plugins/shopify-developer/README.md) · [humanise](./plugins/humanise/README.md) · [message](./plugins/message/README.md) · [react-best-practices](./plugins/react-best-practices/README.md) · [ffmpeg](./plugins/ffmpeg/README.md) · [google-tagmanager](./plugins/google-tagmanager/README.md) · [google-analytics](./plugins/google-analytics/README.md) · [google-ads-scripts](./plugins/google-ads-scripts/README.md) · [google-apps-script](./plugins/google-apps-script/README.md) · [tampermonkey](./plugins/tampermonkey/README.md) · [git-github](./plugins/git-github/README.md) · [model-id-upgrade](./plugins/model-id-upgrade/README.md) · [typst](./plugins/typst/README.md) · [quarto-revealjs](./plugins/quarto-revealjs/README.md) · [media-tools](./plugins/media-tools/README.md)
- **MCP servers** - [mcp-excalidraw](./plugins/mcp-excalidraw/README.md) · [mcp-google-workspace](./plugins/mcp-google-workspace/README.md) · [mcp-mikrotik](./plugins/mcp-mikrotik/README.md) · [mcp-n8n](./plugins/mcp-n8n/README.md) · [mcp-open-meteo](./plugins/mcp-open-meteo/README.md) · [mcp-perplexity](./plugins/mcp-perplexity/README.md) · [mcp-alphavantage](./plugins/mcp-alphavantage/README.md) · [mcp-coingecko](./plugins/mcp-coingecko/README.md) · [mcp-currency-conversion](./plugins/mcp-currency-conversion/README.md)
- **LSP servers** - [lsp-bash](./plugins/lsp-bash/README.md) · [lsp-css](./plugins/lsp-css/README.md) · [lsp-html](./plugins/lsp-html/README.md) · [lsp-json](./plugins/lsp-json/README.md) · [lsp-yaml](./plugins/lsp-yaml/README.md)

---

## 💬 Support

- **Issues:** [GitHub Issues](https://github.com/henkisdabro/wookstar-claude-plugins/issues)
- **Docs:** [Claude Code Documentation](https://code.claude.com/docs)

## 📄 License

MIT - see [LICENSE](./LICENSE).

## 🙏 Acknowledgments

Built for the Claude Code community. Thanks to Anthropic for Claude Code and the plugin system, [Simo Ahava](https://www.simoahava.com/) for GTM/GA4 expertise, [owntag](https://github.com/owntag/gtm-cli) and [daidalytics](https://github.com/daidalytics/google-analytics-cli) for the GTM and GA4 command-line tools, and the open-source community for the MCP server integrations.
