# Wookstar Claude Code Marketplace

**Version 3.0** - Thematic Toolkits Architecture

A comprehensive marketplace for [Claude Code](https://claude.ai/code) providing specialized toolkits for productivity, development, documents, analytics, and AI integrations.

## 🚀 Quick Start

Add this marketplace to Claude Code:

```bash
/plugin marketplace add github:henkisdabro/claudecode-marketplace
```

Then install the toolkits you need:

```bash
# For productivity and planning
/plugin install productivity-toolkit@wookstar

# For full-stack development
/plugin install developer-toolkit@wookstar

# For document processing
/plugin install documents-toolkit@wookstar
```

## 📦 What's New in V3.0

**Thematic Bundles**: Components are now organized into focused toolkits that bundle related agents, commands, skills, and MCP servers together.

**Better Organization**: Install complete toolsets in one command instead of managing dozens of individual plugins.

**Clear Categories**: Productivity, Development, Documents, Analytics, Finance, AI, and more.

See [MIGRATION_V3.md](./MIGRATION_V3.md) for complete migration details from v2.x.

---

## 🎯 Available Toolkits

### 📊 Productivity Toolkit
**Essential planning and workflow tools**

**Includes:**
- 1 agent: documentation-manager
- 11 commands: /ultra-think, /planning, /containerize, /generate-prp, /execute-prp, and more
- 2 skills: prp-generator, timezone-tools

**Installation:**
```bash
/plugin install productivity-toolkit@wookstar
```

**Use Cases:** Project planning, deep analysis, containerization, timezone management

---

### 💻 Developer Toolkit
**Complete full-stack development suite**

**Includes:**
- 2 agents: fullstack-developer, validation-gates
- 2 skills: git-commit-helper, webapp-testing
- 7 MCP servers: Chrome DevTools, Playwright, Cloudflare docs, Microsoft docs, Firecrawl, Context7, Serena

**Installation:**
```bash
/plugin install developer-toolkit@wookstar
```

**Use Cases:** Web development, testing, browser automation, technical documentation

**Required Environment Variables:**
```bash
CONTEXT7_API_KEY=your_key          # Optional
FIRECRAWL_API_KEY=your_key         # Optional
```

---

### 📄 Documents Toolkit
**Professional document processing**

**Includes:**
- 3 skills: docx (Word), xlsx (Excel), pdf-processing-pro

**Installation:**
```bash
/plugin install documents-toolkit@wookstar
```

**Use Cases:** Word docs with tracked changes, Excel spreadsheets with formulas, PDF forms and OCR

---

### 🔧 Claude Code Toolkit
**Meta tools for extending Claude Code**

**Includes:**
- 1 skill: skill-creator (comprehensive skill development guide)

**Installation:**
```bash
/plugin install claudecode-toolkit@wookstar
```

**Use Cases:** Creating new skills, understanding skill architecture, extending Claude's capabilities

---

### 💰 Finance Toolkit
**Real-time market data**

**Includes:**
- 2 MCP servers: AlphaVantage (stocks), CoinGecko (crypto)

**Installation:**
```bash
/plugin install finance-toolkit@wookstar
```

**Use Cases:** Stock prices, cryptocurrency data, financial analysis

**Required Environment Variables:**
```bash
ALPHAVANTAGEAPIKEY=your_key
COINGECKO_DEMO_API_KEY=your_key
```

---

### 🤖 AI Toolkit
**Enhanced AI capabilities**

**Includes:**
- 2 MCP servers: Gemini Bridge, Perplexity

**Installation:**
```bash
/plugin install ai-toolkit@wookstar
```

**Use Cases:** AI-powered search, multi-modal tasks, research

**Required Environment Variables:**
```bash
PERPLEXITY_API_KEY=your_key
```

---

### 📊 Analytics Suites (Coming Soon)

#### GTM Suite (v0.1.0 - Placeholder)
**Google Tag Manager toolkit**

Structure ready for:
- GTM specialist agents
- GTM commands (/gtm-init, /gtm-audit, etc.)
- GTM skills (event tracking, container management, etc.)

#### GA Suite (v0.1.0 - Placeholder)
**Google Analytics 4 toolkit**

Structure ready for:
- GA4 analyst agents
- GA4 commands (/ga-report, /ga-init, etc.)
- GA4 skills (reporting, goals, conversions, etc.)

---

## 🔌 Individual MCP Servers

Standalone integrations available separately:

```bash
/plugin install mcp-currency-conversion@wookstar  # Currency exchange
/plugin install mcp-fetch@wookstar                # Web fetching
/plugin install mcp-google-workspace@wookstar     # Gmail, Drive, Calendar
/plugin install mcp-mikrotik@wookstar             # Router management
/plugin install mcp-n8n@wookstar                  # Workflow automation
/plugin install mcp-notion@wookstar               # Notion integration
/plugin install mcp-open-meteo@wookstar           # Weather data (no API key)
```

---

## 💡 Usage Examples

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

### Document Processing

```bash
# Work with Word documents
"Create a professional proposal with tracked changes"

# Excel spreadsheets
"Create a budget spreadsheet with monthly projections"

# PDF processing
"Extract all tables from this PDF report"
```

### Research and Analysis

```bash
# Use AI toolkit for research
"Search for the latest developments in quantum computing"

# Get market data with finance toolkit
"What's Tesla's stock performance this month?"
"Show me Bitcoin vs Ethereum price trends"
```

---

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Developer guide for working with this marketplace
- **[MIGRATION_V3.md](./MIGRATION_V3.md)** - Migration guide from v2.x
- **[Toolkit READMEs](./productivity-toolkit/README.md)** - Detailed docs for each toolkit

---

## 🎓 For Teams

Configure automatic installation in your repository's `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "wookstar": {
      "source": {
        "source": "github",
        "repo": "henkisdabro/claudecode-marketplace"
      }
    }
  },
  "enabledPlugins": [
    "productivity-toolkit@wookstar",
    "developer-toolkit@wookstar"
  ]
}
```

When team members trust the repository, Claude Code automatically installs these toolkits.

---

## 🛠️ Development

### Local Testing

```bash
# Clone the repository
git clone https://github.com/henkisdabro/claudecode-marketplace.git
cd claudecode-marketplace

# Add as local marketplace
/plugin marketplace add .

# Install a toolkit for testing
/plugin install productivity-toolkit@wookstar

# Test your changes
/ultra-think "Test the toolkit"

# Update marketplace after changes
/plugin marketplace update wookstar
```

### Adding to GTM or GA Suites

The GTM and GA suites are placeholder structures ready for content:

```bash
# Navigate to the suite
cd gtm-suite

# Add agents
vi agents/gtm-specialist.md

# Add commands
vi commands/gtm-init.md

# Add skills
mkdir skills/event-tracking
vi skills/event-tracking/SKILL.md

# See suite READMEs for detailed structure guidance
```

---

## 📊 Marketplace Stats

- **Version:** 3.0.0
- **Total Plugins:** 15 (8 toolkits + 7 individual MCPs)
- **Components:** 3 agents, 11 commands, 8 skills, 18 MCP servers
- **Categories:** Productivity, Development, Documents, Meta, Finance, AI, Analytics

---

## 🆘 Support

- **Issues:** [GitHub Issues](https://github.com/henkisdabro/claudecode-marketplace/issues)
- **Email:** whom-wealthy.2z@icloud.com
- **Docs:** [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)

---

## 📝 License

MIT License - see [LICENSE](./LICENSE) for details

---

## 🙏 Acknowledgments

Built for the Claude Code community. Special thanks to Anthropic for creating Claude Code and the plugin system that makes this marketplace possible.

---

**Happy coding with Claude Code!** 🚀
