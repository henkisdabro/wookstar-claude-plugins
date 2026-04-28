# Wookstar Claude Code Plugins

A curated marketplace for [Claude Code](https://claude.ai/code) - **34 plugins** across development, analytics, AI, content, and ops. Pick what you need; everything is independently installable.

---

## What's inside

| Category | Plugins | What you get |
|---|---:|---|
| [Development](#development) | 6 | A full dev toolkit, Cloudflare platform access, React/Next.js rules, Shopify, browser userscripts, Google Apps Script |
| [Analytics](#analytics) | 3 | GTM, GA4, Google Ads automation |
| [AI](#ai) | 4 | Gemini and Codex CLI agents, Gemini and Perplexity MCP servers |
| [Productivity](#productivity) | 5 | Rich-text email drafts, Gmail/Drive/Calendar, Notion, n8n, Excalidraw |
| [Content](#content) | 3 | Word/Excel/PDF processing, FFmpeg reference, AI-text humaniser |
| [Data](#data) | 3 | Stocks, crypto, FX rates |
| [Utilities](#utilities) | 4 | Timezone tools, HTTP fetcher, MikroTik routers, weather |
| [LSP servers](#lsp-servers) | 6 | Real-time diagnostics for Bash, CSS, HTML, JSON, Tailwind, YAML |

> Two install surfaces - `/plugin install …` runs **inside** an active Claude Code session; `claude plugin install …` runs in a **plain terminal**. Both accept the same arguments. See [Installation Methods](#installation-methods) for the full mapping.

---

## Plugin catalogue

### Development

- **`developer`** - Pro toolkit: 3 commands (`/containerize`, `/generate-prp`, `/execute-prp`) + 4 skills (webapp testing, Chrome DevTools, PRP generation, Fifteen-Factor App) + 5 MCP servers (Chrome DevTools, Playwright, Microsoft docs, Firecrawl, Context7).
- **`mcp-cloudflare`** - Official Cloudflare MCP. 2,500+ API endpoints exposed through 2 tools (~1k tokens) for Workers, D1, KV, R2, DNS, Pages, WAF, Tunnels. OAuth.
- **`react-best-practices`** - 40+ rules for eliminating wasteful re-renders, optimising bundle size, and following modern React/Next.js patterns.
- **`shopify-developer`** - Liquid, theme dev (OS 2.0), GraphQL/REST APIs, app dev, Shopify Functions, Hydrogen, performance, debugging. API version 2026-01.
- **`tampermonkey`** - Userscript development with 18 reference files - browser automation, page modification, web enhancement.
- **`google-apps-script`** - Workspace automation: SpreadsheetApp, DocumentApp, GmailApp, DriveApp, CalendarApp, FormApp, SlidesApp, triggers.

### Analytics

- **`google-tagmanager`** - GTM containers, tags, triggers, variables, datalayer, debugging, custom templates. Includes GTM API MCP server (Stape.ai, browser auth).
- **`google-analytics`** - GA4 events, ecommerce, BigQuery analysis, Measurement Protocol, privacy compliance. Includes Analytics API MCP server (requires service account).
- **`google-ads-scripts`** - AdsApp campaign automation, bid management, keyword optimisation, reporting.

### AI

- **`gemini`** - Agent that drives Gemini CLI in headless mode. Use for second opinions, large-context analysis, code review, document summarisation.
- **`codex`** - Agent that drives OpenAI Codex CLI. Use for second opinions, agentic code tasks, automated review, bug triage.
- **`mcp-gemini-bridge`** - Google Gemini via MCP, browser auth.
- **`mcp-perplexity`** - Perplexity AI search and information retrieval.

### Productivity

- **`message`** - Rich-text email/WhatsApp drafts with **live browser preview**. Triggered by phrases like "draft an email to…" or "write a WhatsApp message…". Bun-powered preview server starts automatically.
- **`mcp-google-workspace`** - Gmail, Drive, Calendar (OAuth).
- **`mcp-notion`** - Notion workspace integration (browser auth).
- **`mcp-n8n`** - n8n workflow automation.
- **`mcp-excalidraw`** - Hand-drawn diagrams with streaming animations, fullscreen editing, checkpoint/restore, export to excalidraw.com.

### Content

- **`documents`** - Word (.docx), Excel (.xlsx), PDF processing - tracked changes, forms, tables, OCR, formulas.
- **`ffmpeg`** - Video and audio CLI reference - filters, codecs (H.264/H.265/VP9), GPU acceleration, common workflows.
- **`humanise`** - Strip 29 AI writing tells from text - inflated language, em-dash overuse, sycophantic tone, formulaic structure, placeholder text.

### Data

- **`mcp-alphavantage`** - Stock market data, company info, financial indicators (free API key).
- **`mcp-coingecko`** - Cryptocurrency prices and market data (demo API key).
- **`mcp-currency-conversion`** - Real-time FX exchange rates (no API key).

### Utilities

- **`timezone-tools`** - Timezone conversions and time queries across IANA timezones.
- **`mcp-fetch`** - Web content fetching and HTTP requests (no API key).
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
| **`lsp-tailwind`** | Tailwind classes in `.html`/`.css`/`.tsx`/`.jsx`/`.ts`/`.js` | `npm i -g @tailwindcss/language-server` |
| **`lsp-yaml`** | `.yaml`, `.yml` (auto-detects GitHub Actions, Docker Compose, Kubernetes, 900+ schemas) | `npm i -g yaml-language-server` |

> `lsp-css`, `lsp-html`, and `lsp-json` share the same `vscode-langservers-extracted` package - one npm install covers all three.

Then install the plugins (e.g. all six at once):

```
/plugin install lsp-bash@wookstar-claude-plugins
/plugin install lsp-css@wookstar-claude-plugins
/plugin install lsp-html@wookstar-claude-plugins
/plugin install lsp-json@wookstar-claude-plugins
/plugin install lsp-tailwind@wookstar-claude-plugins
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
/plugin install mcp-cloudflare@wookstar-claude-plugins
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

If a plugin needs an API key, see [Environment Variables](#environment-variables).

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

## Environment Variables

Many MCP-powered plugins need API keys or credentials. Set these in your shell profile (`~/.bashrc` or `~/.zshrc`).

### Plugins that work without keys

`mcp-fetch`, `mcp-open-meteo`, `mcp-currency-conversion`, `mcp-gemini-bridge` (browser auth), `mcp-notion` (browser auth), `google-tagmanager` (GTM MCP via Stape.ai, browser auth).

<details>
<summary><strong>Required environment variables by plugin</strong> (click to expand)</summary>

#### `developer`

```bash
# Optional - only needed if using these MCP servers
export CONTEXT7_API_KEY="your-context7-key"      # https://upstash.com/context7
export FIRECRAWL_API_KEY="your-firecrawl-key"    # https://firecrawl.dev/
```

#### `google-analytics`

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
export GOOGLE_PROJECT_ID="your-gcp-project-id"
# Get credentials: GCP Console > APIs & Services > Credentials > Service Account
```

#### `mcp-google-workspace`

```bash
export GOOGLE_OAUTH_CLIENT_ID="your-client-id"
export GOOGLE_OAUTH_CLIENT_SECRET="your-client-secret"
# Get credentials: GCP Console > APIs & Services > Credentials > OAuth 2.0 Client
```

#### `mcp-mikrotik`

```bash
export MIKROTIK_HOST="your-router-ip"
export MIKROTIK_USER="your-username"
export MIKROTIK_PASSWORD="your-password"
```

#### `mcp-n8n`

```bash
export N8N_API_KEY="your-n8n-api-key"
# Get from: n8n Settings > API > Create API Key
```

#### `mcp-alphavantage`

```bash
export ALPHAVANTAGEAPIKEY="your-alphavantage-key"
# Free key: https://www.alphavantage.co/support/#api-key
```

#### `mcp-coingecko`

```bash
export COINGECKO_DEMO_API_KEY="your-coingecko-key"
# Demo key: https://www.coingecko.com/en/api
```

#### `mcp-perplexity`

```bash
export PERPLEXITY_API_KEY="your-perplexity-key"
# Get from: https://www.perplexity.ai/settings/api
```

</details>

After setting variables, restart your terminal or `source ~/.bashrc` (or `~/.zshrc`). If `claude doctor` reports missing variables for a plugin you don't need, just `claude plugin uninstall <name>`.

---

## Recommended companion plugins

Wookstar focuses on domain-specific skills. For core Claude Code capabilities, the **[official Anthropic marketplace](https://github.com/anthropics/claude-plugins-official)** is the best complement:

```
/plugin marketplace add anthropics/claude-plugins-official
```

Then pick from:

- `feature-dev`, `code-review`, `pr-review-toolkit`, `agent-sdk-dev` - dev agents
- `typescript-lsp`, `pyright-lsp` - LSPs not covered here
- `claude-md-management`, `hookify`, `skill-creator`, `commit-commands`, `context7`, `playwright`, `ralph-loop` - meta-tools

---

## Upgrading

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
    "wookstar": {
      "source": {
        "source": "github",
        "repo": "henkisdabro/wookstar-claude-plugins"
      }
    }
  },
  "enabledPlugins": [
    "developer@wookstar-claude-plugins",
    "documents@wookstar-claude-plugins",
    "google-tagmanager@wookstar-claude-plugins",
    "google-analytics@wookstar-claude-plugins"
  ]
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
/plugin marketplace update wookstar

# Validate manifest
claude plugin validate .
```

For contributor guidelines (manifest rules, MCP file references, LSP exception, skill style), see **[CLAUDE.md](./CLAUDE.md)**.

---

## Documentation

Per-plugin READMEs:

- **Toolkits** - [developer](./plugins/developer/README.md) · [documents](./plugins/documents/README.md) · [shopify-developer](./plugins/shopify-developer/README.md) · [humanise](./plugins/humanise/README.md) · [message](./plugins/message/README.md) · [react-best-practices](./plugins/react-best-practices/README.md) · [ffmpeg](./plugins/ffmpeg/README.md) · [google-tagmanager](./plugins/google-tagmanager/README.md) · [google-analytics](./plugins/google-analytics/README.md) · [google-ads-scripts](./plugins/google-ads-scripts/README.md) · [google-apps-script](./plugins/google-apps-script/README.md) · [tampermonkey](./plugins/tampermonkey/README.md) · [gemini](./plugins/gemini/README.md) · [codex](./plugins/codex/README.md) · [timezone-tools](./plugins/timezone-tools/README.md)
- **MCP servers** - [mcp-cloudflare](./plugins/mcp-cloudflare/README.md) · [mcp-excalidraw](./plugins/mcp-excalidraw/README.md) · [mcp-fetch](./plugins/mcp-fetch/README.md) · [mcp-google-workspace](./plugins/mcp-google-workspace/README.md) · [mcp-mikrotik](./plugins/mcp-mikrotik/README.md) · [mcp-n8n](./plugins/mcp-n8n/README.md) · [mcp-notion](./plugins/mcp-notion/README.md) · [mcp-open-meteo](./plugins/mcp-open-meteo/README.md) · [mcp-gemini-bridge](./plugins/mcp-gemini-bridge/README.md) · [mcp-perplexity](./plugins/mcp-perplexity/README.md) · [mcp-alphavantage](./plugins/mcp-alphavantage/README.md) · [mcp-coingecko](./plugins/mcp-coingecko/README.md) · [mcp-currency-conversion](./plugins/mcp-currency-conversion/README.md)
- **LSP servers** - [lsp-bash](./plugins/lsp-bash/README.md) · [lsp-css](./plugins/lsp-css/README.md) · [lsp-html](./plugins/lsp-html/README.md) · [lsp-json](./plugins/lsp-json/README.md) · [lsp-tailwind](./plugins/lsp-tailwind/README.md) · [lsp-yaml](./plugins/lsp-yaml/README.md)

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
