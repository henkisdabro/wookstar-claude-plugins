# Wookstar Claude Code Plugins

A comprehensive marketplace for [Claude Code](https://claude.ai/code) providing specialised toolkits for productivity, development, documents, marketing analytics, e-commerce, and AI integrations - featuring consolidated GTM, GA4, and Shopify skills.

## Quick Start

Add this marketplace to Claude Code:

```bash
/plugin marketplace add henkisdabro/wookstar-claude-plugins
```

Then install the toolkits you need:

```bash
# For productivity and planning
/plugin install productivity@wookstar

# For full-stack development
/plugin install developer@wookstar

# For document processing
/plugin install documents@wookstar

# For marketing analytics (GTM + GA4 + Google Ads Scripts)
/plugin install marketing@wookstar

# For Shopify development
/plugin install shopify-developer@wookstar

# For Cloudflare AI agents and MCP servers (official)
/plugin install cloudflare-skills@wookstar

# For utility tools
/plugin install utilities@wookstar
```

Or install individual MCP servers without the full toolkits:

```bash
/plugin install mcp-fetch@wookstar             # Web content fetching
/plugin install mcp-google-workspace@wookstar  # Gmail, Drive, Calendar
/plugin install mcp-mikrotik@wookstar          # MikroTik router management
/plugin install mcp-n8n@wookstar               # n8n workflow automation
/plugin install mcp-notion@wookstar            # Notion integration
/plugin install mcp-open-meteo@wookstar        # Weather data (no API key)
/plugin install mcp-gemini-bridge@wookstar     # Google Gemini AI
/plugin install mcp-perplexity@wookstar        # Perplexity AI search
/plugin install mcp-alphavantage@wookstar      # Stock market data
/plugin install mcp-coingecko@wookstar         # Cryptocurrency data
/plugin install mcp-currency-conversion@wookstar # Currency exchange rates
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

### Required Environment Variables by Plugin

#### developer

```bash
# Optional - only needed if using these MCP servers
export CONTEXT7_API_KEY="your-context7-key"      # https://upstash.com/context7
export FIRECRAWL_API_KEY="your-firecrawl-key"    # https://firecrawl.dev/
```

#### marketing

```bash
# Required for Analytics MCP server
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
export GOOGLE_PROJECT_ID="your-gcp-project-id"
# Get credentials: GCP Console → APIs & Services → Credentials → Service Account
```

#### mcp-google-workspace

```bash
export GOOGLE_OAUTH_CLIENT_ID="your-client-id"
export GOOGLE_OAUTH_CLIENT_SECRET="your-client-secret"
# Get credentials: GCP Console → APIs & Services → Credentials → OAuth 2.0 Client
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
# Get from: n8n Settings → API → Create API Key
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
2. **Uninstall unused plugins** if you don't need the service:

```bash
/plugin uninstall mcp-perplexity@wookstar
```

---

## Available Toolkits

### Productivity

**Workflow orchestration and automation**

**Includes:**

- 4 commands: /planning, /prep-parallel, /execute-parallel, /primer
- 2 skills: google-apps-script (Workspace automation), tampermonkey (browser userscripts)

**Installation:**

```bash
/plugin install productivity@wookstar
```

**Use Cases:** Project planning, parallel task execution, Google Workspace automation, browser userscripts, page modification

---

### Developer

**Complete full-stack development suite**

**Includes:**

- 3 agents: fullstack-developer, validation-gates, documentation-manager
- 3 commands: /containerize, /generate-prp, /execute-prp
- 5 skills: git-commit-helper, webapp-testing, devtools, prp-generator, fifteen-factor-app
- 7 MCP servers: Chrome DevTools, Playwright, Cloudflare docs, Microsoft docs, Firecrawl, Context7, Serena

**Installation:**

```bash
/plugin install developer@wookstar
```

**Use Cases:** Web development, testing, browser automation, technical documentation, architecture design

**Required Environment Variables:**

```bash
CONTEXT7_API_KEY=your_key          # Optional
FIRECRAWL_API_KEY=your_key         # Optional
```

---

### Documents

**Professional document processing**

**Includes:**

- 3 skills: docx (Word), xlsx (Excel), pdf-processing-pro

**Installation:**

```bash
/plugin install documents@wookstar
```

**Use Cases:** Word docs with tracked changes, Excel spreadsheets with formulas, PDF forms and OCR

---

### Claude Code

**Thinking and reasoning tools**

**Includes:**

- 2 commands: /ultra-think (deep analytical reasoning), /reflection (improve CLAUDE.md)

**Installation:**

```bash
/plugin install claudecode@wookstar
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
/plugin install ultimate-skill-creator@wookstar
```

**Optional Hook Setup:** To enable automatic skill suggestions, run `/setup-skill-hook` in your project after installing this plugin. See [Ultimate Skill Creator README](./plugins/ultimate-skill-creator/README.md#hook-setup-optional) for details.

**Use Cases:** Creating professional skills, token-efficient architecture, progressive disclosure design, skill validation

---

### Cloudflare Skills

**Official Cloudflare development skills** - sourced from [cloudflare/skills](https://github.com/cloudflare/skills)

**Includes:**

- 2 commands: /build-agent, /build-mcp
- 2 skills: building-ai-agent-on-cloudflare, building-mcp-server-on-cloudflare
- Reference guides for agent patterns, state management, OAuth setup, and troubleshooting

**Installation:**

```bash
/plugin install cloudflare-skills@wookstar
```

**Use Cases:** Building AI agents with Cloudflare Agents SDK, deploying remote MCP servers on Cloudflare Workers, OAuth authentication setup

---

### Utilities

**General-purpose utility tools**

**Includes:**

- 1 skill: timezone-tools (IANA timezone conversion)

**Installation:**

```bash
/plugin install utilities@wookstar
```

**Use Cases:** Timezone conversions, scheduling across regions

---

### Marketing

**Complete marketing analytics suite**

**Includes:**

- 3 comprehensive skills:
  - **ga4** - Google Analytics 4 with 15 reference guides
  - **gtm** - Google Tag Manager with 9 reference guides
  - **google-ads-scripts** - Campaign automation
- 2 MCP servers: Analytics API, GTM API

**Installation:**

```bash
/plugin install marketing@wookstar
```

**Use Cases:** GTM implementation, GA4 tracking, e-commerce analytics, BigQuery analysis, privacy compliance, Google Ads automation

**Required Environment Variables:**

```bash
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
GOOGLE_PROJECT_ID=your-project-id
```

[View Marketing Toolkit Documentation](./plugins/marketing/README.md)

---

### Shopify Developer

**Professional Shopify development toolkit**

**Includes:**

- 6 skills: shopify-liquid, shopify-theme-dev, shopify-api, shopify-app-dev, shopify-performance, shopify-debugging

**Installation:**

```bash
/plugin install shopify-developer@wookstar
```

**Use Cases:** Custom theme development, Liquid templating, headless storefronts, app development

[View Shopify Developer Documentation](./plugins/shopify-developer/README.md)

---

## Usage Examples

### Planning a Complex Feature

```bash
# Use ultra-think for deep analysis
/ultra-think "Design a real-time collaboration system with WebSockets"

# Generate a comprehensive plan
/generate-prp "Build user authentication module"

# Execute the plan step-by-step
/execute-prp
```

### Full-Stack Development

```bash
# Fullstack agent helps with implementation
"Build a REST API with authentication and rate limiting"

# Validation agent runs tests
"Run all tests and ensure 80% coverage"

# Git commit helper
"Generate a commit message for these changes"
```

### Marketing Analytics

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
- **Toolkit READMEs** - Detailed documentation for each toolkit:
  - [Marketing](./plugins/marketing/README.md)
  - [Shopify Developer](./plugins/shopify-developer/README.md)
  - [Productivity](./plugins/productivity/README.md)
  - [Developer](./plugins/developer/README.md)
  - [Documents](./plugins/documents/README.md)
  - [Claude Code](./plugins/claudecode/README.md)
  - [Ultimate Skill Creator](./plugins/ultimate-skill-creator/README.md)
  - [Utilities](./plugins/utilities/README.md)
  - [Cloudflare Skills](./plugins/cloudflare-skills/README.md) (official Cloudflare)

---

## Development

### Local Testing

```bash
# Clone the repository
git clone https://github.com/henkisdabro/wookstar-claude-plugins.git
cd wookstar-claude-plugins

# Add as local marketplace
/plugin marketplace add .

# Install a toolkit for testing
/plugin install productivity@wookstar

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

- **Version:** 5.2.0
- **Total Plugins:** 20 (9 toolkits + 11 individual MCPs)
- **Components:** 4 agents, 13 commands, 23 skills, 9 embedded MCP servers
- **Categories:** Productivity, Development, Documents, Meta, Analytics, E-commerce, Utilities

---

## Architecture

All toolkits use **file references** (`.mcp.json`) for MCP configurations:

```
<toolkit>/
├── .mcp.json          # MCP server configuration
├── agents/            # Agent definitions
├── commands/          # Slash commands
└── skills/            # Skills
```

---

## Team Configuration

For teams, add to `.claude/settings.json` to auto-enable toolkits:

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
    "productivity@wookstar",
    "developer@wookstar",
    "documents@wookstar",
    "marketing@wookstar"
  ]
}
```

When team members trust the repository, enabled toolkits install automatically.

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
- [Cloudflare](https://github.com/cloudflare/skills) for the official AI agents and MCP server skills
- [Simo Ahava](https://www.simoahava.com/) for GTM and GA4 expertise
- The open-source community for MCP server integrations

**Happy coding with Claude Code!**
