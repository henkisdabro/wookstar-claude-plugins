# Claude Code Marketplace

A comprehensive plugin providing productivity-enhancing commands, specialized AI agents, and powerful integrations for Claude Code.

## Installation

```bash
# Add the marketplace
/plugin marketplace add github:henkisdabro/wookstar-claude-plugins

# Install the main plugin
/plugin install claudecode-marketplace@claudecode-marketplace
```

This installs all commands and agents in one package.

---

## Quick Navigation

- **[Commands](#commands)** - 13 slash commands for development workflows
- **[Specialized Agents](#specialized-agents)** - 3 AI experts for full-stack, docs, and testing
- **[MCP Servers](#mcp-servers)** - 20+ external integrations
- **[Environment Variables](#environment-variables)** - Required API keys

---

## Commands

All commands are available immediately after installing the plugin.

### Development Utilities

#### `/containerize`

Containerize your application with production-ready Docker configuration.

```bash
/containerize --node              # Node.js application
/containerize --python            # Python application
/containerize --multi-stage       # Optimized multi-stage build
```

**Features:**
- Analyzes application architecture
- Creates optimized Dockerfile with security best practices
- Generates docker-compose.yaml for local development
- Configures health checks and graceful shutdown

#### `/prompt_writer`

Advanced prompt engineering assistant.

```bash
/prompt_writer "Create a function that validates email addresses"
```

**Features:**
- Analyzes your request for clarity
- Structures prompts for optimal Claude responses
- Suggests context and constraints

#### `/reflection`

Code analysis and reflection tool.

```bash
/reflection
```

**Features:**
- Analyzes recent code changes
- Identifies patterns and anti-patterns
- Suggests refactoring opportunities

#### `/primer`

Quick project initialization and setup.

#### `/create-agentsmd-symlink`

Manages agent configuration symlinks for team setups.

---

### Planning & Strategy

#### `/ultra-think`

Deep analytical thinking mode for complex problems.

```bash
/ultra-think "Design a real-time collaboration system with WebSockets"
```

**Features:**
- Multi-layered problem analysis
- Considers edge cases and constraints
- Evaluates multiple approaches
- Provides detailed reasoning and tradeoffs

**Best for:** Architecture decisions, complex algorithm design, system design

#### `/planning`

Structured planning workflows for feature development.

```bash
/planning "Build user authentication module"
```

**Features:**
- Creates step-by-step implementation plans
- Identifies dependencies and prerequisites
- Breaks down tasks into manageable chunks

#### `/generate-prp`

Generate a Progressive Refinement Plan.

```bash
/generate-prp "Build a recommendation engine"
```

**Features:**
- Creates phased implementation plan
- Defines milestones and deliverables
- Prioritizes core functionality first

#### `/execute-prp`

Execute a previously generated Progressive Refinement Plan.

```bash
/execute-prp
```

**Features:**
- Implements plan phase by phase
- Validates each milestone
- Adapts plan based on learnings

#### `/infinite`

Extended context planning mode for large-scale projects.

```bash
/infinite "Design microservices architecture for e-commerce platform"
```

---

### Parallel Execution

#### `/prep-parallel`

Prepare and analyze tasks for parallel execution.

```bash
/prep-parallel "Run tests, build frontend, compile backend, lint code"
```

**Features:**
- Analyzes task dependencies
- Groups independent tasks
- Optimizes execution order

#### `/execute-parallel`

Execute prepared tasks in parallel.

```bash
/execute-parallel
```

**Features:**
- Runs independent tasks simultaneously
- Monitors progress of each task
- Handles failures gracefully

---

## Specialized Agents

These agents activate automatically when relevant to your work.

### Full-Stack Developer

Expert full-stack development specialist.

**Expertise:**
- Frontend: React, TypeScript, Vue, modern CSS
- Backend: Node.js, Express, FastAPI, REST/GraphQL APIs
- Databases: PostgreSQL, MongoDB, Redis
- Architecture: Microservices, serverless, monoliths

**When it activates:**
- Building web applications
- API development
- Database schema design
- Full-stack feature implementation

### Documentation Manager

Technical documentation specialist.

**Expertise:**
- README files and getting started guides
- API documentation
- Architecture diagrams and decisions
- Code comments and JSDoc
- Technical specifications

**When it activates:**
- After implementing new features
- When code structure changes
- Creating new projects
- API modifications

### Validation Gates

Testing and quality assurance specialist.

**Expertise:**
- Unit testing (Jest, pytest, etc.)
- Integration testing
- Build validation
- Code quality checks
- Test coverage analysis

**When it activates:**
- After feature implementation
- Before commits
- During refactoring
- When tests are requested

---

## MCP Servers

MCP servers are installed individually to extend Claude Code with external data sources and integrations.

### Core Utilities

Essential servers for most projects:

- **mcp-fetch** - Web content fetching and scraping
- **mcp-playwright** - Browser automation and testing

### AI & Planning

AI-powered assistants:

- **mcp-serena** - AI planning assistant
- **mcp-gemini-bridge** - Gemini API capabilities
- **mcp-perplexity** - AI-powered search

### Data & APIs

External data sources (most require API keys):

- **mcp-open-meteo** - Weather data (no key required)
- **mcp-currency-conversion** - Currency exchange rates
- **mcp-coingecko** - Cryptocurrency market data
- **mcp-alphavantage** - Stock market data
- **mcp-context7** - Context management
- **mcp-firecrawl** - Advanced web scraping
- **mcp-google-workspace** - Gmail, Calendar, Drive
- **mcp-notion** - Notion workspace integration

### Documentation

Quick access to technical docs:

- **mcp-cloudflare-docs** - Cloudflare documentation
- **mcp-microsoft-docs** - Microsoft documentation

### Development Tools

Development automation:

- **mcp-chrome-devtools** - Chrome DevTools protocol
- **mcp-n8n** - n8n workflow automation
- **mcp-mikrotik** - MikroTik router management

**Installation:**

```bash
/plugin install mcp-fetch@claudecode-marketplace
/plugin install mcp-perplexity@claudecode-marketplace
```

---

## Environment Variables

Some MCP servers require API keys. Create a `.env` file in your project root:

```bash
# Cryptocurrency data
COINGECKO_DEMO_API_KEY=your_key_here

# Stock market data
ALPHAVANTAGEAPIKEY=your_key_here

# Workspace management
CONTEXT7_API_KEY=your_key_here

# Web scraping
FIRECRAWL_API_KEY=your_key_here

# AI search
PERPLEXITY_API_KEY=your_key_here

# Workflow automation
N8N_API_KEY=your_key_here

# Google Workspace
GOOGLE_OAUTH_CLIENT_ID=your_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret

# Network management
MIKROTIK_HOST=192.168.88.1
MIKROTIK_USER=admin
MIKROTIK_PASSWORD=your_password
```

---

## Common Workflows

### New Project Setup

```bash
/plugin install claudecode-marketplace@claudecode-marketplace

/containerize --node --multi-stage
# Fullstack agent implements features
# Documentation agent maintains docs
```

### Complex Feature Development

```bash
/ultra-think "Design authentication system with OAuth2"
/generate-prp
/execute-prp
# Validation agent tests implementation
```

### Data Integration Project

```bash
# Install MCP data servers
/plugin install mcp-coingecko@claudecode-marketplace
/plugin install mcp-open-meteo@claudecode-marketplace

# Query external data sources
"Show me Bitcoin price trends and weather correlation"
```

---

## Getting Help

### Plugin Management

```bash
/plugin list                    # Show installed plugins
/plugin uninstall claudecode-marketplace@claudecode-marketplace
/plugin marketplace update claudecode-marketplace
```

### Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Design decisions and technical details
- **[USAGE.md](./USAGE.md)** - Detailed examples and troubleshooting

---

## Support

- **GitHub Issues:** [Report bugs or request features](https://github.com/henkisdabro/wookstar-claude-plugins/issues)
- **Email:** whom-wealthy.2z@icloud.com
- **Claude Code Docs:** [docs.claude.com/claude-code](https://docs.claude.com/en/docs/claude-code)

---

## Version

**Marketplace Version:** 2.0.0

---

**Happy coding with Claude Code!**
