# Wookstar Claude Code Plugins

A comprehensive marketplace for [Claude Code](https://claude.ai/code) providing specialised plugins for development, documents, analytics, e-commerce, AI integrations, and individual MCP servers.

## Quick Start

Add this marketplace to Claude Code:

```bash
/plugin marketplace add henkisdabro/wookstar-claude-plugins
```

Then install the plugins you need:

```bash
# Core development
/plugin install developer@wookstar-claude-plugins

# Document processing
/plugin install documents@wookstar-claude-plugins

# Shopify development
/plugin install shopify-developer@wookstar-claude-plugins

# Claude Code thinking tools
/plugin install claudecode@wookstar-claude-plugins

# Skill development
/plugin install ultimate-skill-creator@wookstar-claude-plugins

# Analytics (standalone)
/plugin install google-tagmanager@wookstar-claude-plugins
/plugin install google-analytics@wookstar-claude-plugins
/plugin install google-ads-scripts@wookstar-claude-plugins

# Automation skills (standalone)
/plugin install google-apps-script@wookstar-claude-plugins
/plugin install tampermonkey@wookstar-claude-plugins
/plugin install git-worktrees@wookstar-claude-plugins
/plugin install gemini@wookstar-claude-plugins
/plugin install codex@wookstar-claude-plugins

# Utilities
/plugin install timezone-tools@wookstar-claude-plugins
```

Or install individual MCP servers without the full toolkits:

```bash
/plugin install mcp-fetch@wookstar-claude-plugins             # Web content fetching
/plugin install mcp-google-workspace@wookstar-claude-plugins  # Gmail, Drive, Calendar
/plugin install mcp-mikrotik@wookstar-claude-plugins          # MikroTik router management
/plugin install mcp-n8n@wookstar-claude-plugins               # n8n workflow automation
/plugin install mcp-notion@wookstar-claude-plugins            # Notion integration
/plugin install mcp-open-meteo@wookstar-claude-plugins        # Weather data (no API key)
/plugin install mcp-gemini-bridge@wookstar-claude-plugins     # Google Gemini AI
/plugin install mcp-perplexity@wookstar-claude-plugins        # Perplexity AI search
/plugin install mcp-alphavantage@wookstar-claude-plugins      # Stock market data
/plugin install mcp-coingecko@wookstar-claude-plugins         # Cryptocurrency data
/plugin install mcp-currency-conversion@wookstar-claude-plugins # Currency exchange rates
```

---

## Upgrading from v5.x

If you previously installed productivity, marketing, or utilities plugins:

### Step 1: Uninstall Old Plugins (run in terminal, not in Claude Code)

```bash
# One-liner: Complete removal and update
claude plugin uninstall productivity@wookstar-claude-plugins && claude plugin uninstall marketing@wookstar-claude-plugins && claude plugin uninstall utilities@wookstar-claude-plugins && claude plugin marketplace update wookstar-claude-plugins && rm -rf ~/.claude/plugins/productivity ~/.claude/plugins/marketing ~/.claude/plugins/utilities
```

Or run each step separately:

```bash
# Uninstall old plugins
claude plugin uninstall productivity@wookstar-claude-plugins
claude plugin uninstall marketing@wookstar-claude-plugins
claude plugin uninstall utilities@wookstar-claude-plugins

# Update marketplace to get v6.0.0
claude plugin marketplace update wookstar-claude-plugins

# Remove leftover plugin folders
rm -rf ~/.claude/plugins/productivity ~/.claude/plugins/marketing ~/.claude/plugins/utilities
```

### Step 2: Clean Up Config Files

Check these files for references to the old plugins and remove/update them:

**User-level settings** (`~/.claude/settings.json`):

```bash
# Check for old plugin references
grep -E "productivity|marketing|utilities" ~/.claude/settings.json
```

Look in `enabledPlugins`, `permissions.allow`, and `permissions.deny` arrays.

**Project-level settings** (`.claude/settings.json` in your projects):

```bash
# Find project settings with old references
find ~ -path "*/.claude/settings.json" -exec grep -l -E "productivity|marketing|utilities" {} \; 2>/dev/null
```

**What to look for and update:**

| Old Reference | Replace With |
|---------------|--------------|
| `productivity@wookstar-claude-plugins` | Remove or replace with specific plugins |
| `marketing@wookstar-claude-plugins` | Remove or replace with `google-tagmanager`, `google-analytics`, `google-ads-scripts` |
| `utilities@wookstar-claude-plugins` | `timezone-tools@wookstar-claude-plugins` |

### Step 3: Install New Plugins (in Claude Code or terminal)

```bash
/plugin install timezone-tools@wookstar-claude-plugins        # replaces utilities
/plugin install google-apps-script@wookstar-claude-plugins    # was in productivity
/plugin install tampermonkey@wookstar-claude-plugins          # was in productivity
/plugin install git-worktrees@wookstar-claude-plugins         # was productivity commands
/plugin install google-tagmanager@wookstar-claude-plugins     # was in marketing
/plugin install google-analytics@wookstar-claude-plugins      # was in marketing
/plugin install google-ads-scripts@wookstar-claude-plugins    # was in marketing
/plugin install gemini@wookstar-claude-plugins   # new
```

---

## Environment Variables

Many MCP-powered plugins require API keys or credentials. Set these in your shell profile (`~/.bashrc` or `~/.zshrc`) or a `.env` file.

### Plugins Without API Keys (Ready to Use)

These plugins work immediately without configuration:

- `mcp-fetch` - Web content fetching
- `mcp-open-meteo` - Weather data
- `mcp-currency-conversion` - Currency exchange rates
- `mcp-gemini-bridge` - Uses Google AI Studio (browser auth)
- `mcp-notion` - Uses Notion's hosted MCP (browser auth)
- `google-tagmanager` - GTM MCP via Stape.ai (browser auth)

### Required Environment Variables by Plugin

#### developer

```bash
# Optional - only needed if using these MCP servers
export CONTEXT7_API_KEY="your-context7-key"      # https://upstash.com/context7
export FIRECRAWL_API_KEY="your-firecrawl-key"    # https://firecrawl.dev/
```

#### google-analytics

```bash
# Required for Analytics MCP server
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
export GOOGLE_PROJECT_ID="your-gcp-project-id"
# Get credentials: GCP Console > APIs & Services > Credentials > Service Account
```

#### mcp-google-workspace

```bash
export GOOGLE_OAUTH_CLIENT_ID="your-client-id"
export GOOGLE_OAUTH_CLIENT_SECRET="your-client-secret"
# Get credentials: GCP Console > APIs & Services > Credentials > OAuth 2.0 Client
```

#### mcp-mikrotik

```bash
export MIKROTIK_HOST="your-router-ip"
export MIKROTIK_USER="your-username"
export MIKROTIK_PASSWORD="your-password"
```

#### mcp-n8n

```bash
export N8N_API_KEY="your-n8n-api-key"
# Get from: n8n Settings > API > Create API Key
```

#### mcp-alphavantage

```bash
export ALPHAVANTAGEAPIKEY="your-alphavantage-key"
# Free key: https://www.alphavantage.co/support/#api-key
```

#### mcp-coingecko

```bash
export COINGECKO_DEMO_API_KEY="your-coingecko-key"
# Demo key: https://www.coingecko.com/en/api
```

#### mcp-perplexity

```bash
export PERPLEXITY_API_KEY="your-perplexity-key"
# Get from: https://www.perplexity.ai/settings/api
```

### Applying Changes

After setting environment variables, restart your terminal or run:

```bash
source ~/.bashrc  # or ~/.zshrc
```

### Troubleshooting

If you see "Missing environment variables" errors in `claude doctor`, either:

1. **Set the variables** using the examples above
2. **Uninstall unused plugins** if you don't need the service (run in terminal):

```bash
claude plugin uninstall mcp-perplexity@wookstar-claude-plugins
```

---

## Available Plugins

### Developer

**Complete full-stack development suite**

**Includes:**

- 3 agents: fullstack-developer, validation-gates, documentation-manager
- 3 commands: /containerize, /generate-prp, /execute-prp
- 5 skills: git-commit-helper, webapp-testing, devtools, prp-generator, fifteen-factor-app
- 6 MCP servers: Chrome DevTools, Playwright, Cloudflare docs, Microsoft docs, Firecrawl, Context7

**Installation:**

```bash
/plugin install developer@wookstar-claude-plugins
```

**Use Cases:** Web development, testing, browser automation, technical documentation, architecture design

---

### Documents

**Professional document processing**

**Includes:**

- 3 skills: docx (Word), xlsx (Excel), pdf-processing-pro

**Installation:**

```bash
/plugin install documents@wookstar-claude-plugins
```

**Use Cases:** Word docs with tracked changes, Excel spreadsheets with formulas, PDF forms and OCR

---

### Shopify Developer

**Professional Shopify development toolkit**

**Includes:**

- 6 skills: shopify-liquid, shopify-theme-dev, shopify-api, shopify-app-dev, shopify-performance, shopify-debugging

**Installation:**

```bash
/plugin install shopify-developer@wookstar-claude-plugins
```

**Use Cases:** Custom theme development, Liquid templating, headless storefronts, app development

[View Shopify Developer Documentation](./plugins/shopify-developer/README.md)

---

### Claude Code

**Thinking and reasoning tools**

**Includes:**

- 2 commands: /ultra-think (deep analytical reasoning), /reflection (improve CLAUDE.md)

**Installation:**

```bash
/plugin install claudecode@wookstar-claude-plugins
```

**Use Cases:** Complex problem-solving, multi-perspective analysis, improving Claude Code configuration

---

### Ultimate Skill Creator

**Advanced skill development toolkit**

**Requires:** [plugin-dev@claude-plugins-official](https://github.com/anthropics/claude-plugins-official) for validation agents

**Includes:**

- 1 agent: skill-architect (structure design and archetype recommendations)
- 2 commands: /create-skill-ultimate (guided workflow), /setup-skill-hook (automatic hook setup)
- 1 skill: skill-mastery (comprehensive development guide with 4 reference guides and 2 utility scripts)
- 1 hook: skill-activation-prompt (auto-suggest relevant skills)

**Installation:**

```bash
# Install required dependency first
/plugin install plugin-dev@claude-plugins-official

# Then install the plugin
/plugin install ultimate-skill-creator@wookstar-claude-plugins
```

**Use Cases:** Creating professional skills, token-efficient architecture, progressive disclosure design

---

### Google Tag Manager

**GTM implementation and configuration**

**Includes:**

- 1 skill: google-tagmanager (9 reference guides)
- 1 MCP server: GTM API via Stape.ai

**Installation:**

```bash
/plugin install google-tagmanager@wookstar-claude-plugins
```

**Use Cases:** Container setup, tags, triggers, variables, data layer, debugging, custom templates

---

### Google Analytics

**GA4 tracking and analysis**

**Includes:**

- 1 skill: google-analytics (15 reference guides)
- 1 MCP server: Analytics API

**Installation:**

```bash
/plugin install google-analytics@wookstar-claude-plugins
```

**Required Environment Variables:**

```bash
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
GOOGLE_PROJECT_ID=your-project-id
```

**Use Cases:** Event tracking, e-commerce, BigQuery analysis, Measurement Protocol, privacy compliance

---

### Google Ads Scripts

**Google Ads automation**

**Includes:**

- 1 skill: google-ads-scripts

**Installation:**

```bash
/plugin install google-ads-scripts@wookstar-claude-plugins
```

**Use Cases:** Campaign automation, bid management, reporting, keyword optimization

---

### Google Apps Script

**Google Workspace automation**

**Includes:**

- 1 skill: google-apps-script

**Installation:**

```bash
/plugin install google-apps-script@wookstar-claude-plugins
```

**Use Cases:** Sheets automation, Gmail scripts, Drive integration, Calendar automation

---

### Tampermonkey

**Browser userscript development**

**Includes:**

- 1 skill: tampermonkey (18 reference files)

**Installation:**

```bash
/plugin install tampermonkey@wookstar-claude-plugins
```

**Use Cases:** Browser automation, page modification, web enhancement, userscripts

---

### Git Worktrees

**Parallel development workflow**

**Includes:**

- 1 skill: git-worktrees

**Installation:**

```bash
/plugin install git-worktrees@wookstar-claude-plugins
```

**Use Cases:** Parallel feature development, A/B testing code changes, comparing implementation approaches

---

### Gemini CLI Headless

**Gemini CLI automation expert**

**Includes:**

- 1 agent: gemini

**Installation:**

```bash
/plugin install gemini@wookstar-claude-plugins
```

**Use Cases:** Programmatic prompts, JSON/streaming output parsing, CI/CD integration, batch processing

---

### Codex

**OpenAI Codex CLI automation expert**

**Includes:**

- 1 agent: codex

**Installation:**

```bash
/plugin install codex@wookstar-claude-plugins
```

**Use Cases:** Programmatic prompts, structured output parsing, CI/CD integration, workspace automation

---

### Timezone Tools

**Time utilities**

**Includes:**

- 1 skill: timezone-tools

**Installation:**

```bash
/plugin install timezone-tools@wookstar-claude-plugins
```

**Use Cases:** Timezone conversions, scheduling across regions

---

## Usage Examples

### Full-Stack Development

```bash
# Fullstack agent helps with implementation
"Build a REST API with authentication and rate limiting"

# Validation agent runs tests
"Run all tests and ensure 80% coverage"

# Git commit helper
"Generate a commit message for these changes"
```

### Analytics Implementation

```bash
# GTM implementation
"Help me install GTM on my React website"
"My form submission tag isn't firing, help me debug"

# GA4 tracking
"Implement purchase event tracking for my checkout"
"Write SQL to analyze GA4 conversion funnels in BigQuery"

# Google Ads automation
"Write a script to pause low-performing keywords automatically"
```

### Shopify Development

```bash
# Liquid templating
"Create a Shopify product card with Liquid"

# Theme development
"Build a custom collection page with filtering"

# API integration
"Use Storefront API to build a headless checkout"
```

### Document Processing

```bash
# Work with Word documents
"Create a professional proposal with tracked changes"

# Excel spreadsheets
"Create a budget spreadsheet with monthly projections"

# PDF processing
"Extract all tables from this PDF report"
```

---

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Developer guide for working with this marketplace
- **Toolkit READMEs** - Detailed documentation for each plugin:
  - [Developer](./plugins/developer/README.md)
  - [Documents](./plugins/documents/README.md)
  - [Shopify Developer](./plugins/shopify-developer/README.md)
  - [Claude Code](./plugins/claudecode/README.md)
  - [Ultimate Skill Creator](./plugins/ultimate-skill-creator/README.md)
  - [Google Tag Manager](./plugins/google-tagmanager/README.md)
  - [Google Analytics](./plugins/google-analytics/README.md)
  - [Google Ads Scripts](./plugins/google-ads-scripts/README.md)
  - [Google Apps Script](./plugins/google-apps-script/README.md)
  - [Tampermonkey](./plugins/tampermonkey/README.md)
  - [Git Worktrees](./plugins/git-worktrees/README.md)
  - [Gemini](./plugins/gemini/README.md)
  - [Codex](./plugins/codex/README.md)
  - [Timezone Tools](./plugins/timezone-tools/README.md)

---

## Development

### Local Testing

```bash
# Clone the repository
git clone https://github.com/henkisdabro/wookstar-claude-plugins.git
cd wookstar-claude-plugins

# Add as local marketplace
/plugin marketplace add .

# Install a plugin for testing
/plugin install developer@wookstar-claude-plugins

# Update marketplace after changes
/plugin marketplace update wookstar
```

### Validation

```bash
# Validate marketplace structure
claude plugin validate .
```

---

## Marketplace Stats

- **Version:** 6.0.0
- **Total Plugins:** 24 (13 toolkits + 11 individual MCPs)
- **Components:** 4 agents, 9 commands, 25 skills, 10 embedded MCP servers
- **Categories:** Development, Documents, Analytics, E-commerce, AI, Utilities

---

## Architecture

All plugins use **file references** (`.mcp.json`) for MCP configurations:

```
<plugin>/
├── .mcp.json          # MCP server configuration (if applicable)
├── agents/            # Agent definitions
├── commands/          # Slash commands
└── skills/            # Skills
```

---

## Team Configuration

For teams, add to `.claude/settings.json` to auto-enable plugins:

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

When team members trust the repository, enabled plugins install automatically.

---

## Support

- **Issues:** [GitHub Issues](https://github.com/henkisdabro/wookstar-claude-plugins/issues)
- **Email:** whom-wealthy.2z@icloud.com
- **Docs:** [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)

---

## License

MIT License - see [LICENSE](./LICENSE) for details

---

## Acknowledgments

Built for the Claude Code community. Special thanks to:

- Anthropic for creating Claude Code and the plugin system
- [Simo Ahava](https://www.simoahava.com/) for GTM and GA4 expertise
- The open-source community for MCP server integrations

**Happy coding with Claude Code!**
