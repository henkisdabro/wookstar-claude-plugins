# Wookstar Claude Code Plugins

A curated marketplace for [Claude Code](https://claude.ai/code) - **32 active plugins** across development, analytics, content, data and ops. Pick what you need; everything is independently installable.

> **New in 7.0.0:** `git-github`, `model-id-upgrade`, `typst`, `quarto-revealjs` and `media-tools`, OCR and document parsing in `documents`, and GA4 BigQuery querying in `google-analytics`. Every skill was re-checked against current Claude Code and live vendor docs, and most were rewritten - see the [CHANGELOG](./CHANGELOG.md).
>
> **Upgrading from 6.x?** 7.0.0 retires plugins that now have official equivalents and changes how MCP plugins take credentials. Run [`scripts/upgrade-v7.sh`](./scripts/upgrade-v7.sh) or follow [MIGRATION.md](./MIGRATION.md). Retired plugins stay listed for one release as `[RETIRED]` entries that only show a notice.

---

## What's inside

| Category | Plugins | What you get |
|---|---:|---|
| [Development](#development) | 6 | PRP planning and containerisation, git and GitHub Actions with releases, React/Next.js rules, Shopify themes, browser userscripts, Google Apps Script |
| [Analytics](#analytics) | 3 | GTM, GA4, Google Ads automation |
| [AI](#ai) | 2 | Claude model ID upgrades, Perplexity search MCP server |
| [Productivity](#productivity) | 4 | Rich-text email drafts, Gmail/Drive/Calendar, n8n, Excalidraw |
| [Content](#content) | 6 | PDF extraction, OCR and parsing, Typst, Quarto slide decks, FFmpeg, YouTube search and transcription, AI-text humaniser |
| [Data](#data) | 3 | Stocks, crypto, FX rates |
| [Utilities](#utilities) | 3 | Timezone tools, MikroTik routers, weather |
| [LSP servers](#lsp-servers) | 5 | Real-time diagnostics for Bash, CSS, HTML, JSON, YAML |

> Two install surfaces - `/plugin install …` runs **inside** an active Claude Code session; `claude plugin install …` runs in a **plain terminal**. Both accept the same arguments. See [Installation Methods](#installation-methods) for the full mapping.

---

## Plugin catalogue

### Development

- **`developer`** - PRP planning (`prp-generator`, `/execute-prp`), `/containerize`, and the Fifteen-Factor App methodology.
- **`git-github`** - Commits, workflows and a user-triggered `/release`, with a script that resolves the current version of every GitHub Action from the GitHub API.
- **`react-best-practices`** - Vercel Engineering's 70 React and Next.js performance rules, with local notes for React Compiler and Next.js 16 caching.
- **`shopify-developer`** - Liquid, theme development (OS 2.0), Hydrogen, Functions and debugging. Live API lookup goes to Shopify's official `shopify-ai-toolkit`.
- **`tampermonkey`** - Userscript development with 18 reference files - browser automation, page modification, web enhancement.
- **`google-apps-script`** - Workspace automation: SpreadsheetApp, DocumentApp, GmailApp, DriveApp, CalendarApp, FormApp, SlidesApp, triggers.

### Analytics

- **`google-tagmanager`** - GTM containers, tags, triggers, variables, datalayer, debugging, custom templates. Includes GTM API MCP server (Stape.ai, browser auth).
- **`google-analytics`** - GA4 events, ecommerce, Measurement Protocol, privacy compliance, and cost-controlled querying of the GA4 BigQuery export. Includes Analytics API MCP server (requires service account).
- **`google-ads-scripts`** - AdsApp campaign automation, bid management, keyword optimisation, reporting.

### AI

- **`model-id-upgrade`** - Finds stale Claude model IDs across a repo or machine, separates historical records from live config, and upgrades only the targets after your approval.
- **`mcp-perplexity`** - Perplexity AI search and information retrieval.

### Productivity

- **`message`** - Rich-text email/WhatsApp drafts with **live browser preview**. Triggered by phrases like "draft an email to…" or "write a WhatsApp message…". Bun-powered preview server starts automatically.
- **`mcp-google-workspace`** - Gmail, Drive, Calendar (OAuth).
- **`mcp-n8n`** - n8n workflow automation.
- **`mcp-excalidraw`** - Hand-drawn diagrams with streaming animations, fullscreen editing, checkpoint/restore, export to excalidraw.com.

### Content

- **`documents`** - Fast PDF text extraction, OCR for scans (OCRmyPDF), structured parsing of complex PDFs and office files, plus scripts for forms, tables, merging and splitting. For writing Word, Excel and PowerPoint files use Anthropic's `document-skills`.
- **`typst`** - Typst language reference: markup, maths, set/show rules, layout, tables, templates and PDF/HTML export.
- **`quarto-revealjs`** - Quarto reveal.js slide decks with meeting and technical-talk templates, light and dark themes, speaker notes and PDF export.
- **`ffmpeg`** - Video and audio CLI reference - filters, codecs (H.264/H.265/VP9), GPU acceleration, common workflows.
- **`media-tools`** - Search YouTube and pull captions or audio with yt-dlp, then transcribe locally with Whisper (mlx-whisper on Apple Silicon).
- **`humanise`** - Strip 34 AI writing tells from text - inflated language, em-dash overuse, sycophantic tone, formulaic structure, placeholder text, leaked chatbot artifacts. Calibrates on a sample of your own writing, audits its own draft, and never invents a fact to make a vague sentence specific.

### Data

- **`mcp-alphavantage`** - Stock market data, company info, financial indicators (free API key).
- **`mcp-coingecko`** - Cryptocurrency prices and market data (demo API key).
- **`mcp-currency-conversion`** - Real-time FX exchange rates (no API key).

### Utilities

- **`timezone-tools`** - Timezone conversions and time queries across IANA timezones.
- **`mcp-mikrotik`** - MikroTik router management and network automation.
- **`mcp-open-meteo`** - Weather and climate data (no API key).

### LSP servers

Real-time diagnostics, completions, and hover docs. **Two-step install for each:** first the language server binary (npm command shown), then the plugin itself (`/plugin install lsp-<lang>@wookstar-claude-plugins`).

| Plugin | Languages | Binary install |
|---|---|---|
| **`lsp-bash`** | `.sh`, `.bash` (ShellCheck-powered) | `npm i -g bash-language-server` + `brew install shellcheck` |
| **`lsp-css`** | `.css`, `.scss`, `.less` | `npm i -g vscode-langservers-extracted` |
| **`lsp-html`** | `.html`, `.htm` | `npm i -g vscode-langservers-extracted` |
| **`lsp-json`** | `.json`, `.jsonc` | `npm i -g vscode-langservers-extracted` |
| **`lsp-yaml`** | `.yaml`, `.yml` (auto-detects GitHub Actions, Docker Compose, Kubernetes, 900+ schemas) | `npm i -g yaml-language-server` |

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

## Quick Start

### 1. Add the marketplace

Inside Claude Code:

```
/plugin marketplace add henkisdabro/wookstar-claude-plugins
```

Or from your terminal:

```bash
claude plugin marketplace add henkisdabro/wookstar-claude-plugins
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

If a plugin needs an API key or URL, Claude Code asks for it when you enable the plugin - see [Credentials](#credentials).

---

## Installation Methods

There are two ways to install and manage plugins. They do the same thing but run in different places - **don't mix them up**.

| Action | Inside Claude Code | Terminal CLI |
|---|---|---|
| Add this marketplace | `/plugin marketplace add henkisdabro/wookstar-claude-plugins` | `claude plugin marketplace add henkisdabro/wookstar-claude-plugins` |
| Install a plugin | `/plugin install <name>@wookstar-claude-plugins` | `claude plugin install <name>@wookstar-claude-plugins` |
| Update marketplace | `/plugin marketplace update wookstar-claude-plugins` | `claude plugin marketplace update wookstar-claude-plugins` |
| Update a plugin | `/plugin update <name>` | `claude plugin update <name>` |
| Enable / disable | `/plugin enable <name>` · `/plugin disable <name>` | `claude plugin enable <name>` · `claude plugin disable <name>` |
| Uninstall | `/plugin uninstall <name>` | `claude plugin uninstall <name>` |
| List installed | `/plugin list` | `claude plugin list` |
| Browse interactively | `/plugin` (opens UI) | n/a |
| Validate manifest | n/a | `claude plugin validate <path>` |

**Rule of thumb:** the `/plugin` snippets in this README assume a Claude Code session is open. In a plain terminal or CI, swap `/plugin …` for `claude plugin …`.

---

## Credentials

MCP plugins that need a key or URL declare it as plugin configuration: Claude Code prompts for the values when you enable the plugin, keeps secrets in your system keychain, and passes them to the server. Nothing goes in your shell profile.

| Plugin | Asks for |
|---|---|
| `mcp-coingecko` | demo API key ([get one](https://www.coingecko.com/en/api)) |
| `mcp-perplexity` | API key ([get one](https://www.perplexity.ai/settings/api)) |
| `mcp-n8n` | instance URL and API key |
| `mcp-mikrotik` | router host, SSH username, password, port |
| `mcp-google-workspace` | OAuth client ID and secret |

`mcp-alphavantage` and `google-tagmanager` (Stape) sign in through OAuth - run `/mcp` and pick the server on first use. `mcp-excalidraw`, `mcp-open-meteo` and `mcp-currency-conversion` need nothing.

Installed one of the plugins above before 7.0.0? Updating does not prompt - run `claude plugin configure <plugin>@wookstar-claude-plugins`, or let the upgrade script fill the values in. A startup notice reminds you until you do.

`google-analytics` is the exception: its server uses Google Application Default Credentials, so export `GOOGLE_APPLICATION_CREDENTIALS` (path to a credentials file) and `GOOGLE_CLOUD_PROJECT`. See its [README](./plugins/google-analytics/README.md).

---

## Recommended companion plugins

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

## Upgrading

### From 6.x to 7.0.0

7.0.0 retires `codex`, `gemini`, `mcp-gemini-bridge`, `mcp-notion`, `mcp-cloudflare` and `mcp-fetch`, moves parts of `developer`, `documents` and `shopify-developer` to official plugins, and switches MCP plugins to prompted credentials. Run the upgrade script, or hand [MIGRATION.md](./MIGRATION.md) to Claude:

```bash
curl -fsSL https://raw.githubusercontent.com/henkisdabro/wookstar-claude-plugins/main/scripts/upgrade-v7.sh | bash -s -- --dry-run   # preview
curl -fsSL https://raw.githubusercontent.com/henkisdabro/wookstar-claude-plugins/main/scripts/upgrade-v7.sh | bash
```

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
| `utilities@…` | `timezone-tools` |

### Step 3 - Install replacements

```
/plugin install timezone-tools@wookstar-claude-plugins
/plugin install google-apps-script@wookstar-claude-plugins
/plugin install tampermonkey@wookstar-claude-plugins
/plugin install google-tagmanager@wookstar-claude-plugins
/plugin install google-analytics@wookstar-claude-plugins
/plugin install google-ads-scripts@wookstar-claude-plugins
```

`git-worktrees` is no longer published - Claude Code now supports worktrees natively.

</details>

---

## Team configuration

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

## Local development

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
```

For contributor guidelines (manifest rules, MCP file references, LSP exception, skill style), see **[AGENTS.md](./AGENTS.md)**.

---

## Documentation

Per-plugin READMEs:

- **Toolkits** - [developer](./plugins/developer/README.md) · [documents](./plugins/documents/README.md) · [shopify-developer](./plugins/shopify-developer/README.md) · [humanise](./plugins/humanise/README.md) · [message](./plugins/message/README.md) · [react-best-practices](./plugins/react-best-practices/README.md) · [ffmpeg](./plugins/ffmpeg/README.md) · [google-tagmanager](./plugins/google-tagmanager/README.md) · [google-analytics](./plugins/google-analytics/README.md) · [google-ads-scripts](./plugins/google-ads-scripts/README.md) · [google-apps-script](./plugins/google-apps-script/README.md) · [tampermonkey](./plugins/tampermonkey/README.md) · [timezone-tools](./plugins/timezone-tools/README.md) · [git-github](./plugins/git-github/README.md) · [model-id-upgrade](./plugins/model-id-upgrade/README.md) · [typst](./plugins/typst/README.md) · [quarto-revealjs](./plugins/quarto-revealjs/README.md) · [media-tools](./plugins/media-tools/README.md)
- **MCP servers** - [mcp-excalidraw](./plugins/mcp-excalidraw/README.md) · [mcp-google-workspace](./plugins/mcp-google-workspace/README.md) · [mcp-mikrotik](./plugins/mcp-mikrotik/README.md) · [mcp-n8n](./plugins/mcp-n8n/README.md) · [mcp-open-meteo](./plugins/mcp-open-meteo/README.md) · [mcp-perplexity](./plugins/mcp-perplexity/README.md) · [mcp-alphavantage](./plugins/mcp-alphavantage/README.md) · [mcp-coingecko](./plugins/mcp-coingecko/README.md) · [mcp-currency-conversion](./plugins/mcp-currency-conversion/README.md)
- **LSP servers** - [lsp-bash](./plugins/lsp-bash/README.md) · [lsp-css](./plugins/lsp-css/README.md) · [lsp-html](./plugins/lsp-html/README.md) · [lsp-json](./plugins/lsp-json/README.md) · [lsp-yaml](./plugins/lsp-yaml/README.md)

---

## Marketplace stats

- **Version:** 6.7.0 (see [`marketplace.json`](./.claude-plugin/marketplace.json) for the authoritative current value)
- **Plugins:** 34
- **Components:** 2 agents, 3 commands, 18 skills, 16 embedded MCP servers, 6 LSP servers
- **Categories:** development, analytics, ai, productivity, documents, media, writing, data, utilities, lsp

---

## Support

- **Issues:** [GitHub Issues](https://github.com/henkisdabro/wookstar-claude-plugins/issues)
- **Docs:** [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)

## License

MIT - see [LICENSE](./LICENSE).

## Acknowledgments

Built for the Claude Code community. Thanks to Anthropic for Claude Code and the plugin system, [Simo Ahava](https://www.simoahava.com/) for GTM/GA4 expertise, and the open-source community for the MCP server integrations.
