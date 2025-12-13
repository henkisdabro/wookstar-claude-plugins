# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a Claude Code Plugin Marketplace containing **thematic toolkits** - curated bundles of agents, commands, skills, and MCP integrations organized by use case. Each toolkit is designed as a complete, installable unit that provides specialized capabilities for different workflows.

**Architecture Philosophy:** Instead of individual plugins, this marketplace offers comprehensive toolkits where related components (agents, commands, skills, MCPs) are bundled together for a cohesive user experience.

**Official Documentation:** <https://docs.claude.com/en/docs/claude-code/plugin-marketplaces.md>

## Key Commands

### Testing the Marketplace Locally

```bash
# Add marketplace from local directory
/plugin marketplace add /home/user/wookstar-claude-code-plugins

# Or use relative path from project root
/plugin marketplace add .

# Install a specific toolkit for testing
/plugin install productivity-toolkit@wookstar
/plugin install developer-toolkit@wookstar
/plugin install documents-toolkit@wookstar

# Install individual MCP servers
/plugin install mcp-fetch@wookstar
/plugin install mcp-notion@wookstar

# List installed plugins
/plugin list

# Update marketplace after changes
/plugin marketplace update wookstar

# Remove marketplace for clean testing
/plugin marketplace remove wookstar
```

### Validation

```bash
# Validate marketplace structure and manifest
claude plugin validate .

# Validate from .claude-plugin directory
claude plugin validate .claude-plugin

# Validate specific toolkit
claude plugin validate ./productivity-toolkit
```

### Publishing Changes

Since there's no build step, changes are immediate. Testing workflow:

1. Make changes to toolkit files (agents, commands, skills, or MCP configs)
2. If marketplace is already added: `/plugin marketplace update wookstar`
3. If testing new toolkit: `/plugin install <toolkit-name>@wookstar`
4. Test the toolkit functionality
5. Commit changes with semantic commit messages

## Architecture Overview

### v3.0 Thematic Bundles Architecture

This marketplace uses a **thematic bundles architecture** where components are organized into self-contained toolkits by use case. Users install complete toolsets rather than individual components.

**Key Design Principles:**
- **Thematic Organization**: Related components bundled by domain (productivity, development, documents, etc.)
- **Complete Toolsets**: Each toolkit provides everything needed for its domain
- **Flexible Installation**: Users can install only the toolkits they need
- **Consistent Structure**: All toolkits follow the same internal organization
- **No Strict Validation**: Toolkits use `strict: false` for maximum flexibility

### Directory Structure

```
wookstar-claude-code-plugins/        # Repository root
├── .claude-plugin/
│   ├── marketplace.json             # Marketplace manifest (defines all toolkits)
│   ├── README.md                    # User-facing documentation
│   ├── ARCHITECTURE.md              # Detailed architecture guide
│   └── USAGE.md                     # Usage examples and workflows
│
├── productivity-toolkit/            # Productivity toolkit (v1.0.0)
│   ├── README.md                    # Toolkit documentation
│   ├── agents/                      # Productivity agents
│   │   └── documentation-manager.md
│   ├── commands/                    # Productivity commands
│   │   ├── ultra-think.md
│   │   ├── planning.md
│   │   ├── containerize.md
│   │   ├── generate-prp.md
│   │   ├── execute-prp.md
│   │   ├── infinite.md
│   │   ├── prep-parallel.md
│   │   ├── execute-parallel.md
│   │   ├── reflection.md
│   │   ├── primer.md
│   │   └── prompt_writer.md
│   └── skills/                      # Productivity skills
│       ├── prp-generator/
│       │   └── SKILL.md
│       └── timezone-tools/
│           └── SKILL.md
│
├── developer-toolkit/               # Development toolkit (v1.0.0)
│   ├── README.md
│   ├── agents/                      # Development agents
│   │   ├── fullstack-developer.md
│   │   └── validation-gates.md
│   ├── skills/                      # Development skills
│   │   ├── git-commit-helper/
│   │   │   └── SKILL.md
│   │   └── webapp-testing/
│   │       └── SKILL.md
│   └── .mcp.json                    # Embedded MCP servers (7 servers)
│
├── documents-toolkit/               # Document processing toolkit (v1.0.0)
│   ├── README.md
│   └── skills/                      # Document processing skills
│       ├── docx/
│       │   └── SKILL.md
│       ├── xlsx/
│       │   └── SKILL.md
│       └── pdf-processing-pro/
│           └── SKILL.md
│
├── claudecode-toolkit/              # Meta toolkit (v1.0.0)
│   ├── README.md
│   └── skills/                      # Claude Code development skills
│       └── skill-creator/
│           └── SKILL.md
│
├── finance-toolkit/                 # Financial data toolkit (v1.0.0)
│   ├── README.md
│   └── .mcp.json                    # Finance MCPs (AlphaVantage, CoinGecko, Currency)
│
├── ai-toolkit/                      # AI integrations toolkit (v1.0.0)
│   ├── README.md
│   └── .mcp.json                    # AI MCPs (Gemini, Perplexity)
│
├── gtm-suite/                       # Google Tag Manager suite (v1.0.0)
│   ├── README.md
│   ├── skills/                      # 10 GTM skills
│   └── .mcp.json                    # GTM MCP server
│
├── ga-suite/                        # Google Analytics 4 suite (v1.0.0)
│   ├── README.md
│   ├── skills/                      # 15 GA4 skills
│   └── .mcp.json                    # Analytics MCP server
│
├── mcp-servers/                     # Individual MCP server plugins (configs inlined in marketplace.json)
│   └── README.md                    # Documentation only
│
├── scripts/                         # Utility scripts (personal use)
│   ├── README.md
│   └── install-claude-plugins.sh    # Automated plugin installation
│
├── CLAUDE.md                        # This file
├── README.md                        # Repository overview
└── MIGRATION_V3.md                  # Migration guide from v2.x to v3.0
```

### Toolkit Structure

Each toolkit follows a consistent internal structure:

```
<toolkit-name>/
├── README.md                        # Toolkit-specific documentation
├── agents/                          # Optional: Agent definitions
│   └── *.md
├── commands/                        # Optional: Slash commands
│   └── *.md
├── skills/                          # Optional: Skills
│   └── <skill-name>/
│       └── SKILL.md
└── .mcp.json                        # Optional: Embedded MCP servers
```

**Auto-Loading Behavior:**
- All `.md` files in `agents/` are auto-loaded as agents
- All `.md` files in `commands/` are auto-loaded as commands
- All directories with `SKILL.md` in `skills/` are auto-loaded as skills
- MCP servers defined in `.mcp.json` are loaded when toolkit is installed (via `mcpServers` reference in marketplace.json)

**No plugin.json Required:**
- Toolkits use `strict: false` in marketplace.json
- No individual `plugin.json` files needed
- Claude Code auto-discovers components in standard directories

### Component Types

#### 1. Toolkits

**Primary Unit**: Complete bundles of related agents, commands, skills, and MCPs organized by domain.

**Location:** Root-level directories (e.g., `productivity-toolkit/`, `developer-toolkit/`)
**Configuration:** Defined in `.claude-plugin/marketplace.json` at repository root
**Installation:** `/plugin install <toolkit-name>@wookstar`

**Available Toolkits:**
- **productivity-toolkit** (v1.0.0): Planning, workflows, documentation tools
- **developer-toolkit** (v1.0.0): Development agents, testing skills, dev MCPs
- **documents-toolkit** (v1.0.0): Word, Excel, PDF processing skills
- **claudecode-toolkit** (v1.0.0): Meta tools for extending Claude Code
- **finance-toolkit** (v1.0.0): Financial market data MCPs
- **ai-toolkit** (v1.0.0): AI integration MCPs (Gemini, Perplexity)
- **gtm-suite** (v1.0.0): Google Tag Manager (10 skills) - PRODUCTION READY
- **ga-suite** (v1.0.0): Google Analytics 4 (15 skills) - PRODUCTION READY
- **shopify-developer** (v1.0.0): Shopify development (6 skills) - PRODUCTION READY
- **google-apps-ads-script** (v1.0.0): Google Workspace & Ads automation (2 skills) - PRODUCTION READY

#### 2. Commands

Slash commands within toolkits. Commands are Markdown files with prompt content.

**Location:** `<toolkit-name>/commands/*.md`
**Auto-loaded:** Yes, when toolkit is installed
**Format:** Markdown files containing prompt instructions

#### 3. Agents

Specialized AI agents within toolkits. Agents are Markdown files defining behavior and expertise.

**Location:** `<toolkit-name>/agents/*.md`
**Auto-loaded:** Yes, when toolkit is installed
**Format:** Markdown files containing agent instructions

#### 4. Skills

Agent Skills that extend Claude's capabilities within toolkits.

**Location:** `<toolkit-name>/skills/<skill-name>/SKILL.md`
**Auto-loaded:** Yes, when toolkit is installed
**Format:** Directory with `SKILL.md` file (may include assets, references)

#### 5. Embedded MCP Servers

MCP servers bundled within toolkits for domain-specific integrations.

**Location:** `<toolkit-name>/.mcp.json`
**Configuration:** JSON file with `mcpServers` object
**Referenced:** Via `"mcpServers": "./.mcp.json"` in root marketplace.json plugin entry
**Loaded:** Automatically when toolkit is installed

#### 6. Individual MCP Servers

Standalone MCP server plugins for general-purpose integrations.

**Location:** `mcp-servers/<server-name>/.mcp.json`
**Configuration:** JSON file with `mcpServers` object (inlined in root marketplace.json)
**Installation:** `/plugin install mcp-<server-name>@wookstar`

**Available Individual MCPs:**
- **mcp-fetch**: Web content fetching
- **mcp-google-workspace**: Gmail, Drive, Calendar integration
- **mcp-mikrotik**: Router management
- **mcp-n8n**: Workflow automation
- **mcp-notion**: Workspace integration
- **mcp-open-meteo**: Weather data (no API key required)

**Note:** Currency conversion MCP is now part of the finance-toolkit (3 MCPs total: AlphaVantage, CoinGecko, Currency Conversion).

### Critical Files

#### marketplace.json (Root)

The main marketplace manifest at `.claude-plugin/marketplace.json`. Contains:

- Marketplace metadata (name: "wookstar", version: "3.0.0")
- Complete plugin registry with all toolkits and individual MCPs
- Plugin sources (relative paths to toolkit directories)
- Toolkit metadata (version, description, keywords, category)

**Key Design Decision:**
- All toolkits use `"strict": false` for flexibility
- Toolkit sources point to toolkit directories (e.g., `"source": "./productivity-toolkit"`)
- Individual MCP sources point to server directories (e.g., `"source": "./mcp-servers/fetch"`)

**Path Resolution:**
- Toolkit source: `"./productivity-toolkit"` → Toolkit root
- Components auto-loaded from: `agents/`, `commands/`, `skills/` within toolkit
- Embedded MCPs: Defined in `<toolkit>/.mcp.json`, referenced via `"mcpServers": "./.mcp.json"` in marketplace.json

#### .mcp.json (Embedded in Toolkits)

Optional `.mcp.json` files within toolkits for embedded MCP servers.

**Location:** `<toolkit-name>/.mcp.json`
**Purpose:** Define MCP servers specific to the toolkit domain
**Format:** JSON with `mcpServers` object containing server configurations
**Referenced:** Via `"mcpServers": "./.mcp.json"` in the toolkit's entry in root marketplace.json

**Example toolkits with embedded MCPs:**
- `developer-toolkit/.mcp.json`: Chrome DevTools, Playwright, Cloudflare docs, etc.
- `finance-toolkit/.mcp.json`: AlphaVantage, CoinGecko, Currency Conversion
- `ai-toolkit/.mcp.json`: Gemini, Perplexity

#### README.md Files

Each toolkit includes its own README.md documenting:
- Toolkit purpose and capabilities
- Included components (agents, commands, skills, MCPs)
- Installation instructions
- Usage examples
- Configuration requirements (API keys, environment variables)

## Adding New Components

### Adding a New Toolkit

1. Create toolkit directory: `<toolkit-name>/`
2. Create README.md documenting the toolkit
3. Create component directories as needed:
   - `<toolkit-name>/agents/`
   - `<toolkit-name>/commands/`
   - `<toolkit-name>/skills/`
4. Add toolkit entry to `.claude-plugin/marketplace.json`:

```json
{
  "name": "my-toolkit",
  "source": "./my-toolkit",
  "description": "Comprehensive description of toolkit capabilities",
  "version": "1.0.0",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "homepage": "https://github.com/henkisdabro/wookstar-claude-code-plugins",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "category": "appropriate-category",
  "strict": false
}
```

5. Test locally with `/plugin install my-toolkit@wookstar`

### Adding Components to Existing Toolkit

#### Adding a Command

1. Create command file: `<toolkit-name>/commands/<command-name>.md`
2. File is auto-loaded when toolkit is installed (no manifest update needed)
3. Test locally with `/plugin marketplace update wookstar`

#### Adding an Agent

1. Create agent file: `<toolkit-name>/agents/<agent-name>.md`
2. File is auto-loaded when toolkit is installed (no manifest update needed)
3. Test locally with `/plugin marketplace update wookstar`

#### Adding a Skill

1. Create skill directory: `<toolkit-name>/skills/<skill-name>/`
2. Create skill file: `<toolkit-name>/skills/<skill-name>/SKILL.md`
3. Optionally add subdirectories: `assets/`, `references/`, etc.
4. File is auto-loaded when toolkit is installed (no manifest update needed)
5. Test locally with `/plugin marketplace update wookstar`

**Important:** Skills do NOT require individual `plugin.json` files when using `strict: false`

#### Adding Embedded MCP Server to Toolkit

1. Create or edit the toolkit's MCP config file: `<toolkit-name>/.mcp.json`
2. Add MCP server configuration:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["my-mcp-package"],
      "env": {
        "API_KEY": "${MY_API_KEY}"
      }
    }
  }
}
```

3. Add `mcpServers` reference to the toolkit entry in root `.claude-plugin/marketplace.json`:

```json
{
  "name": "my-toolkit",
  "source": "./my-toolkit",
  "mcpServers": "./.mcp.json",
  "strict": false
}
```

4. Test locally by reinstalling toolkit: `/plugin install <toolkit-name>@wookstar`

### Adding Individual MCP Server

Add entry directly to root `.claude-plugin/marketplace.json` with **inline** `mcpServers`:

```json
{
  "name": "mcp-my-server",
  "source": "./mcp-servers/my-server",
  "description": "MCP server description",
  "keywords": ["mcp", "integration"],
  "category": "mcpServers",
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["my-mcp-package"],
      "env": {
        "API_KEY": "${MY_API_KEY}"
      }
    }
  },
  "strict": false
}
```

4. Test locally with `/plugin install mcp-my-server@wookstar`

**Note:** For individual MCP servers, the `mcpServers` configuration is inlined directly in the root marketplace.json entry. No separate directory or `.mcp.json` file is required - the configuration lives entirely in marketplace.json.

## Environment Variables

Many MCP servers require API keys and credentials. Users should configure environment variables according to their system:

**For Claude Code Web:** Set in user's system environment
**For Claude Code Desktop:** Configure in system or shell environment
**Syntax in marketplace.json:** `"${VAR_NAME}"` gets resolved from environment

See README.md and individual toolkit documentation for required environment variables.

**Security:** Never commit API keys or secrets to the repository.

## Metadata Standards

All toolkits and plugins must include:

- `name`: kebab-case identifier
- `description`: Clear, concise description of capabilities
- `category`: Appropriate category (see Category Values section)
- `keywords`: Array of searchable tags for discoverability
- `version`: Semantic version (MAJOR.MINOR.PATCH)
- `strict`: Set to `false` for flexibility

## Version Management

**Current Version:** v3.0.0

Follow semantic versioning strictly:

- **MAJOR**: Breaking changes (incompatible with previous versions)
  - Example: v2.x → v3.0.0 (architectural change to thematic bundles)
- **MINOR**: New features (backward compatible)
  - Example: Adding new toolkit or major features to existing toolkit
- **PATCH**: Bug fixes (backward compatible)
  - Example: Fixing command bugs, updating documentation

**Versioning Strategy:**
- **Marketplace version**: Updated for architectural changes (currently 3.0.0)
- **Toolkit versions**: Independent semantic versioning per toolkit
- **Placeholder toolkits**: Start at v0.1.0 until production-ready
- **Production toolkits**: v1.0.0 and above

**Version Status:**
- Production toolkits (v1.0.0): productivity, developer, documents, claudecode, finance, ai, gtm-suite, ga-suite, shopify-developer, google-apps-ads-script
- All toolkits are now production-ready!

Update versions when:
1. Adding significant features to a toolkit (MINOR bump)
2. Making breaking changes to a toolkit (MAJOR bump)
3. Fixing bugs in a toolkit (PATCH bump)
4. Promoting placeholder to production (v0.1.0 → v1.0.0)

## Team Configuration

This marketplace is designed for team adoption. Users can add to `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "wookstar": {
      "source": {
        "source": "github",
        "repo": "henkisdabro/wookstar-claude-code-plugins"
      }
    }
  },
  "enabledPlugins": [
    "productivity-toolkit@wookstar",
    "developer-toolkit@wookstar",
    "documents-toolkit@wookstar"
  ]
}
```

When team members trust the repository, enabled toolkits install automatically.

## Important Constraints

1. **No Build Process**: This is a pure marketplace - no compilation or build steps
2. **Thematic Bundles Architecture**: Components organized by domain, not scattered
3. **Strict: False**: All toolkits use `strict: false` for maximum flexibility
4. **Auto-Loading**: Components in standard directories load automatically
5. **No plugin.json in Skills**: Skills don't require individual plugin.json files
6. **Complete Toolsets**: Users install entire toolkits, not individual components
7. **Environment Variable Security**: Never commit API keys or secrets
8. **Markdown Format**: Commands and agents are Markdown files
9. **Placeholder Toolkits**: GTM and GA suites are v0.1.0 placeholders for future expansion

## Documentation Files

- **README.md**: User-facing overview, installation instructions
- **.claude-plugin/README.md**: Complete toolkit catalog and feature documentation
- **.claude-plugin/ARCHITECTURE.md**: Deep dive into design decisions and v3.0 architecture
- **.claude-plugin/USAGE.md**: Practical examples, workflows, troubleshooting
- **CLAUDE.md** (this file): Quick reference for Claude Code instances
- **MIGRATION_V3.md**: Migration guide from v2.x to v3.0
- **<toolkit>/README.md**: Toolkit-specific documentation

When making changes to components, consider whether documentation needs updating to reflect new functionality or changed behavior.

## Category Values

In marketplace.json, the "category" field can have these values:

**For Toolkits:**
- `"productivity"` - Productivity and workflow tools
- `"development"` - Development and coding tools
- `"documents"` - Document processing tools
- `"meta"` - Tools for Claude Code itself
- `"data"` - Data and analytics tools
- `"ai"` - AI integrations
- `"analytics"` - Analytics and tracking tools

**For Individual Plugins:**
- `"mcpServers"` - MCP server integrations

## Testing Checklist

Before committing changes:

1. **Validate Structure**: Run `claude plugin validate .`
2. **Test Installation**: Install toolkit locally and verify all components load
3. **Test Functionality**: Execute commands, invoke agents, use skills
4. **Check Documentation**: Ensure README and toolkit docs are up-to-date
5. **Verify Environment Variables**: Document any new API keys or config requirements
6. **Update Version**: Bump toolkit version appropriately (MAJOR/MINOR/PATCH)
7. **Commit with Semantic Message**: Use clear commit messages describing changes

## Migration Notes

**From v2.x to v3.0:**
- Root-level `/agents`, `/commands`, `/skills` directories removed
- Components now organized within toolkits
- Single monolithic plugin split into thematic bundles
- Users must install specific toolkits instead of single comprehensive plugin
- See MIGRATION_V3.md for detailed migration guide
