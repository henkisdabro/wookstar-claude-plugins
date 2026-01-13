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

# For utility tools
/plugin install utilities@wookstar
```

Or install individual MCP servers without the full toolkits:

```bash
/plugin install mcp-fetch@wookstar           # Web content fetching
/plugin install mcp-google-workspace@wookstar # Gmail, Drive, Calendar
/plugin install mcp-mikrotik@wookstar        # MikroTik router management
/plugin install mcp-n8n@wookstar             # n8n workflow automation
/plugin install mcp-notion@wookstar          # Notion integration
/plugin install mcp-open-meteo@wookstar      # Weather data (no API key)
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

**Meta tools for extending Claude Code**

**Includes:**

- 4 commands: /ultra-think, /infinite, /reflection, /prompt_writer
- 1 skill: skill-creator (comprehensive skill development guide)

**Installation:**

```bash
/plugin install claudecode@wookstar
```

**Use Cases:** Deep reasoning, creating new skills, extending Claude's capabilities

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

### Finance

**Real-time market data**

**Includes:**

- 3 MCP servers: AlphaVantage (stocks), CoinGecko (crypto), Currency Conversion

**Installation:**

```bash
/plugin install finance@wookstar
```

**Use Cases:** Stock prices, cryptocurrency data, currency exchange rates

**Required Environment Variables:**

```bash
ALPHAVANTAGEAPIKEY=your_key
COINGECKO_DEMO_API_KEY=your_key
```

---

### AI

**Enhanced AI capabilities**

**Includes:**

- 2 MCP servers: Gemini Bridge, Perplexity

**Installation:**

```bash
/plugin install ai@wookstar
```

**Use Cases:** AI-powered search, multi-modal tasks, research

**Required Environment Variables:**

```bash
PERPLEXITY_API_KEY=your_key
```

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

[View Marketing Toolkit Documentation](./marketing/README.md)

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

[View Shopify Developer Documentation](./shopify-developer/README.md)

---

## Individual MCP Servers

Standalone integrations available separately:

```bash
/plugin install mcp-fetch@wookstar                # Web fetching
/plugin install mcp-google-workspace@wookstar     # Gmail, Drive, Calendar
/plugin install mcp-mikrotik@wookstar             # Router management
/plugin install mcp-n8n@wookstar                  # Workflow automation
/plugin install mcp-notion@wookstar               # Notion integration
/plugin install mcp-open-meteo@wookstar           # Weather data (no API key)
```

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
  - [Marketing](./marketing/README.md)
  - [Shopify Developer](./shopify-developer/README.md)
  - [Productivity](./productivity/README.md)
  - [Developer](./developer/README.md)
  - [Documents](./documents/README.md)
  - [Utilities](./utilities/README.md)

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

- **Version:** 4.0.0
- **Total Plugins:** 15 (9 toolkits + 6 individual MCPs)
- **Components:** 3 agents, 11 commands, 22 skills, 14 MCP servers
- **Categories:** Productivity, Development, Documents, Meta, Finance, AI, Analytics, E-commerce, Utilities

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
- [Simo Ahava](https://www.simoahava.com/) for GTM and GA4 expertise
- The open-source community for MCP server integrations

**Happy coding with Claude Code!**
