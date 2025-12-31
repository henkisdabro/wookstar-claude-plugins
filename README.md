# Wookstar Claude Code Plugins

A comprehensive marketplace for [Claude Code](https://claude.ai/code) providing specialized toolkits for productivity, development, documents, analytics, e-commerce, and AI integrations - now featuring complete GTM, GA4, Shopify, and Google Automation suites!

## 🚀 Quick Start

Add this marketplace to Claude Code:

```bash
/plugin marketplace add henkisdabro/wookstar-claude-code-plugins
```

Then install the toolkits you need:

```bash
# For productivity and planning
/plugin install productivity-toolkit@wookstar

# For full-stack development
/plugin install developer-toolkit@wookstar

# For document processing
/plugin install documents-toolkit@wookstar

# For Google Tag Manager expertise
/plugin install gtm-suite@wookstar

# For Google Analytics 4 expertise
/plugin install ga-suite@wookstar

# For Shopify development
/plugin install shopify-developer@wookstar

# For Google Workspace & Ads automation
/plugin install google-apps-ads-script@wookstar
```

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
**Complete full-stack development suite (v1.1.0)**

**Includes:**
- 2 agents: fullstack-developer, validation-gates
- 3 skills: git-commit-helper, webapp-testing, devtools (Chrome DevTools setup)
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
- 3 MCP servers: AlphaVantage (stocks), CoinGecko (crypto), Currency Conversion

**Installation:**
```bash
/plugin install finance-toolkit@wookstar
```

**Use Cases:** Stock prices, cryptocurrency data, currency exchange rates, financial analysis

**Required Environment Variables:**
```bash
ALPHAVANTAGEAPIKEY=your_key
COINGECKO_DEMO_API_KEY=your_key
# Note: Currency conversion requires no API key
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

### 📊 GTM Suite ✨ NEW!
**Complete Google Tag Manager expertise (v1.0.0)**

**Includes:**
- 10 specialized skills covering all aspects of GTM

**Skills:** gtm-general (fundamentals), gtm-setup, gtm-tags, gtm-triggers, gtm-variables, gtm-datalayer, gtm-debugging, gtm-best-practices, gtm-custom-templates, gtm-api

**Installation:**
```bash
/plugin install gtm-suite@wookstar
```

**Use Cases:** GTM implementation, data layer architecture, debugging, SPA tracking, e-commerce tracking, custom templates, API automation

**Perfect for:** Digital marketers, analytics engineers, web developers implementing tracking

[View Full GTM Suite Documentation](./gtm-suite/README.md)

---

### 📈 GA Suite ✨ NEW!
**Comprehensive Google Analytics 4 expertise (v1.0.0)**

**Includes:**
- 15 specialized skills organized into 5 progressive tiers

**Skills:** ga4-setup, ga4-events-fundamentals, ga4-gtag-implementation, ga4-recommended-events, ga4-custom-events, ga4-user-tracking, ga4-custom-dimensions, ga4-audiences, ga4-debugview, ga4-gtm-integration, ga4-measurement-protocol, ga4-privacy-compliance, ga4-reporting, ga4-bigquery, ga4-data-management

**Installation:**
```bash
/plugin install ga-suite@wookstar
```

**Use Cases:** GA4 implementation, e-commerce tracking, BigQuery analysis, privacy compliance (GDPR/Consent Mode v2), server-side tracking, custom reporting

**Perfect for:** Data analysts, marketing teams, analytics engineers, enterprise analytics

[View Full GA Suite Documentation](./ga-suite/README.md)

---

### 🛍️ Shopify Developer ✨ NEW!
**Professional Shopify development toolkit (v1.0.0)**

**Includes:**
- 6 specialized skills for Shopify development

**Skills:** shopify-liquid (templating), shopify-theme-dev, shopify-api (GraphQL/REST), shopify-app-dev, shopify-performance, shopify-debugging

**Installation:**
```bash
/plugin install shopify-developer@wookstar
```

**Use Cases:** Custom theme development, Liquid templating, headless storefronts, custom app development, performance optimization, API integration

**Perfect for:** Shopify developers, e-commerce agencies, theme customizers, app developers

[View Full Shopify Developer Documentation](./shopify-developer/README.md)

---

### 🔄 Google Apps & Ads Script ✨ NEW!
**Automation toolkit for Workspace and Ads (v1.0.0)**

**Includes:**
- 2 comprehensive automation skills

**Skills:** google-apps-script (Workspace automation), google-ads-scripts (campaign automation)

**Installation:**
```bash
/plugin install google-apps-ads-script@wookstar
```

**Use Cases:**
- **Apps Script:** Sheets automation, Gmail automation, Drive management, Calendar automation, Document generation, Workspace add-ons
- **Ads Scripts:** Campaign automation, bidding strategies, performance reports, keyword management, automated alerts

**Perfect for:** Marketing automation engineers, data analysts, PPC managers, Workspace power users

[View Full Google Apps & Ads Script Documentation](./google-apps-ads-script/README.md)

---

## 🔌 Individual MCP Servers

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

### Google Tag Manager Implementation

```bash
# Get GTM fundamentals
"Explain how GTM data layer works for SPAs"

# Setup guidance
"Help me install GTM on my React website"

# Debug tracking
"My form submission tag isn't firing, help me debug"

# E-commerce tracking
"Implement GA4 e-commerce tracking via GTM"
```

### Google Analytics 4 Setup

```bash
# Initial setup
"Help me create a GA4 property and install tracking"

# E-commerce tracking
"Implement purchase event tracking for my checkout"

# BigQuery analysis
"Write SQL to analyze GA4 conversion funnels in BigQuery"

# Privacy compliance
"Implement Google Consent Mode v2 for GDPR"
```

### Shopify Development

```bash
# Liquid templating
"Create a Shopify product card with Liquid"

# Theme development
"Build a custom collection page with filtering"

# API integration
"Use Storefront API to build a headless checkout"

# Performance optimization
"Optimize my Shopify theme for Core Web Vitals"
```

### Google Workspace Automation

```bash
# Sheets automation
"Create an automated weekly report that emails stakeholders"

# Gmail automation
"Build an auto-responder for specific email addresses"

# Google Ads Scripts
"Write a script to pause low-performing keywords automatically"

# Document generation
"Generate personalized contracts from a template"
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
- **Toolkit READMEs** - Detailed documentation for each toolkit:
  - [GTM Suite](./gtm-suite/README.md)
  - [GA Suite](./ga-suite/README.md)
  - [Shopify Developer](./shopify-developer/README.md)
  - [Google Apps & Ads Script](./google-apps-ads-script/README.md)
  - [Productivity Toolkit](./productivity-toolkit/README.md)
  - [Developer Toolkit](./developer-toolkit/README.md)
  - [Documents Toolkit](./documents-toolkit/README.md)

---

## 🛠️ Development

### Fresh Installation Script (Personal Use)

> **Note:** This script is a personal utility for the maintainer's development environment. It installs plugins from multiple marketplaces and represents personal preferences - not intended for general redistribution.

For new Linux machines, the automated installation script sets up a complete Claude Code environment:

```bash
# Clone and run
git clone https://github.com/henkisdabro/wookstar-claude-code-plugins.git
cd wookstar-claude-code-plugins
./scripts/install-claude-plugins.sh
```

The script installs:
- **4 marketplaces:** claude-code-plugins (Anthropic), wookstar, claude-scientific-skills, claude-skills
- **Working plugins** from each marketplace (avoiding known buggy bundles)

See [scripts/README.md](./scripts/README.md) for full documentation and customisation options.

### Local Testing

```bash
# Clone the repository
git clone https://github.com/henkisdabro/wookstar-claude-code-plugins.git
cd wookstar-claude-code-plugins

# Add as local marketplace
/plugin marketplace add .

# Install a toolkit for testing
/plugin install productivity-toolkit@wookstar

# Test your changes
/ultra-think "Test the toolkit"

# Update marketplace after changes
/plugin marketplace update wookstar
```

### Contributing to Suites

All suites are now ready for community contributions:

```bash
# Navigate to a suite
cd gtm-suite  # or ga-suite, shopify-developer, etc.

# Add agents (if suite supports agents)
vi agents/new-agent.md

# Add commands (if suite supports commands)
vi commands/new-command.md

# Add skills
mkdir skills/new-skill
vi skills/new-skill/SKILL.md

# See suite READMEs for detailed structure guidance
```

---

## 📊 Marketplace Stats

- **Version:** 3.1.0
- **Total Plugins:** 16 (10 toolkits + 6 individual MCPs)
- **Components:** 3 agents, 11 commands, 42 skills, 20 MCP servers
- **Categories:** Productivity, Development, Documents, Meta, Finance, AI, Analytics, E-commerce, Automation
- **New in v3.1:** All toolkits updated to v1.1.0, standardised MCP architecture using file references (.mcp.json)

## 🏗️ Architecture

All MCP servers are configured using **file references** (`.mcp.json`) rather than inline configurations:

```
<toolkit>/
├── .mcp.json          # MCP server configuration
├── agents/            # Agent definitions
├── commands/          # Slash commands
└── skills/            # Skills
```

Benefits:
- **Atomic ownership** - each toolkit owns its MCP config
- **Easier maintenance** - modify MCPs directly in toolkit folders
- **Cleaner marketplace.json** - no massive inline blocks
- **Consistent architecture** - same pattern everywhere

---

## 🆘 Support

- **Issues:** [GitHub Issues](https://github.com/henkisdabro/wookstar-claude-code-plugins/issues)
- **Email:** whom-wealthy.2z@icloud.com
- **Docs:** [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)

---

## 📝 License

MIT License - see [LICENSE](./LICENSE) for details

---

## 🙏 Acknowledgments

Built for the Claude Code community. Special thanks to:
- Anthropic for creating Claude Code and the plugin system
- [Simo Ahava](https://www.simoahava.com/) for GTM and GA4 expertise
- The open-source community for MCP server integrations
- All contributors to this marketplace

---

**Happy coding with Claude Code!** 🚀
