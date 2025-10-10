# Usage Guide

Practical examples and workflows for using the Claude Code Marketplace.

## Getting Started

### Step 1: Add the Marketplace

```bash
# From GitHub (recommended for teams)
/plugin marketplace add henkisdabro/claudecode-marketplace

# From local directory (for development)
/plugin marketplace add /path/to/claudecode-marketplace
```

### Step 2: Browse Available Plugins

```bash
# Interactive browser
/plugin

# List all marketplaces
/plugin marketplace list

# View marketplace details
/plugin marketplace info claudecode-marketplace
```

### Step 3: Install Plugins

```bash
# Install a single plugin
/plugin install development-utilities@claudecode-marketplace

# Install multiple plugins
/plugin install development-utilities@claudecode-marketplace planning-tools@claudecode-marketplace
```

## Common Workflows

### Workflow 1: Setting Up a New Project

**Scenario:** Starting a new full-stack web application

```bash
# 1. Install essential plugins
/plugin install development-utilities@claudecode-marketplace
/plugin install fullstack-developer@claudecode-marketplace
/plugin install documentation-manager@claudecode-marketplace

# 2. Use containerize command to set up Docker
/containerize --node --multi-stage

# 3. Generate project documentation
# The documentation-manager agent will help maintain docs as you build
```

### Workflow 2: Complex Planning Session

**Scenario:** Architecting a new feature

```bash
# 1. Install planning tools
/plugin install planning-tools@claudecode-marketplace

# 2. Start with ultra-think for deep analysis
/ultra-think "Design a real-time collaboration system with WebSockets and Redis"

# 3. Generate a progressive refinement plan
/generate-prp

# 4. Execute the plan systematically
/execute-prp
```

### Workflow 3: Team Development Setup

**Scenario:** Onboarding team members with consistent tooling

**1. Team Lead: Configure project settings**

Create `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "claudecode-marketplace": {
      "source": {
        "source": "github",
        "repo": "henkisdabro/claudecode-marketplace"
      }
    }
  },
  "enabledPlugins": [
    "development-utilities@claudecode-marketplace",
    "planning-tools@claudecode-marketplace",
    "fullstack-developer@claudecode-marketplace",
    "documentation-manager@claudecode-marketplace",
    "validation-gates@claudecode-marketplace",
    "tool-usage-logger@claudecode-marketplace"
  ]
}
```

**2. Team Members: Trust repository**

When team members trust the repository in Claude Code, plugins are automatically installed.

### Workflow 4: Quality Assurance Pipeline

**Scenario:** Ensuring code quality with automated validation

```bash
# 1. Install validation tools
/plugin install validation-gates@claudecode-marketplace
/plugin install tool-usage-logger@claudecode-marketplace

# 2. The validation-gates agent automatically:
#    - Runs tests after code changes
#    - Validates build processes
#    - Ensures quality gates pass

# 3. Review audit logs
cat .claude/logs/tool-usage.log
```

### Workflow 5: Data Integration Project

**Scenario:** Building a dashboard with multiple data sources

```bash
# 1. Install MCP data sources
/plugin install mcp-data-sources@claudecode-marketplace

# 2. Set up environment variables
cat > .env << EOF
COINGECKO_DEMO_API_KEY=your_key
ALPHAVANTAGEAPIKEY=your_key
CONTEXT7_API_KEY=your_key
EOF

# 3. Now you can access:
#    - Weather data (open-meteo)
#    - Crypto prices (coingecko)
#    - Stock data (alphavantage)
#    - Currency conversion
```

## Plugin-Specific Usage

### Development Utilities

#### Containerize Command

```bash
# Node.js application
/containerize --node

# Python application
/containerize --python

# Multi-stage build for production
/containerize --multi-stage

# With specific application type
/containerize api-server
```

#### Prompt Writer

```bash
# Generate optimized prompts
/prompt_writer "Create a function that validates email addresses"

# The tool will help you craft effective prompts for Claude
```

#### Reflection Tool

```bash
# Analyze current code state
/reflection

# Review recent changes and suggest improvements
```

### Planning Tools

#### Ultra-Think

```bash
# Deep analysis mode
/ultra-think "How should we implement authentication with OAuth2?"

# Break down complex problems systematically
```

#### Progressive Refinement Planning

```bash
# Generate a plan
/generate-prp "Build a recommendation engine"

# Execute the plan
/execute-prp

# View plan status
/planning status
```

#### Infinite Planning

```bash
# Extended planning session
/infinite "Design microservices architecture for e-commerce platform"
```

### Parallel Execution

```bash
# Prepare tasks for parallel execution
/prep-parallel "Run tests, build frontend, compile backend"

# Execute tasks in parallel
/execute-parallel
```

### Specialized Agents

#### Fullstack Developer

```bash
# Invoke the agent for full-stack tasks
# The agent proactively handles:
# - Frontend development (React, TypeScript)
# - Backend APIs (Node.js, Express, FastAPI)
# - Database design (PostgreSQL, MongoDB)
# - Full application architecture

# Example: "Build a REST API for user management with React frontend"
```

#### Documentation Manager

```bash
# The agent automatically:
# - Updates README.md after code changes
# - Maintains API documentation
# - Creates comprehensive technical docs
# - Ensures documentation accuracy

# Example: "Update documentation for the new authentication module"
```

#### Validation Gates

```bash
# The agent proactively:
# - Runs tests after implementation
# - Validates builds
# - Checks code quality
# - Ensures all tests pass

# Example: "Implement user registration feature"
# Agent will test and validate automatically
```

## MCP Server Usage

### Essential Servers

Once installed, MCP servers are automatically available:

```bash
# Fetch web content
# Uses the fetch MCP server automatically

# Check current time in Perth
# Uses the time MCP server

# Browser automation
# Uses playwright MCP server
```

### AI Tools

```bash
# Serena planning assistant
# Available for complex planning tasks

# Gemini integration
# Access Gemini API capabilities
```

### Data Sources

```bash
# Weather queries
"What's the weather in Perth?"

# Crypto prices
"Get current Bitcoin price"

# Stock data
"Show me Tesla stock performance"

# Currency conversion
"Convert 100 USD to EUR"
```

### Dev Tools

```bash
# Chrome DevTools integration
# Debug web applications

# n8n automation
# Trigger n8n workflows

# MikroTik management
# Configure network devices
```

## Environment Configuration

### Required Environment Variables

Create `.env` in your project root:

```bash
# API Keys
COINGECKO_DEMO_API_KEY=your_key_here
ALPHAVANTAGEAPIKEY=your_key_here
CONTEXT7_API_KEY=your_key_here
FIRECRAWL_API_KEY=your_key_here
N8N_API_KEY=your_key_here

# OAuth (Google Workspace)
GOOGLE_OAUTH_CLIENT_ID=your_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret

# Network (MikroTik)
MIKROTIK_HOST=192.168.88.1
MIKROTIK_USER=admin
MIKROTIK_PASSWORD=your_password

# Cloudflare Access
CF_ACCESS_CLIENT_ID=your_client_id
CF_ACCESS_CLIENT_SECRET=your_client_secret
```

### Testing Environment Setup

```bash
# Verify environment variables are loaded
/plugin test-env

# Check MCP server connectivity
/plugin mcp-status

# View active MCP servers
/plugin mcp-list
```

## Troubleshooting

### Plugin Installation Issues

```bash
# Update marketplace metadata
/plugin marketplace update claudecode-marketplace

# Reinstall plugin
/plugin uninstall development-utilities
/plugin install development-utilities@claudecode-marketplace

# Clear plugin cache
/plugin cache clear
```

### MCP Server Issues

```bash
# Check MCP server logs
cat ~/.claude/logs/mcp-*.log

# Restart specific MCP server
/plugin mcp-restart fetch

# Verify environment variables
echo $COINGECKO_DEMO_API_KEY
```

### Hook Issues

```bash
# Check hook execution logs
cat .claude/logs/tool-usage.log

# Disable specific hook temporarily
# Edit .claude/settings.json

# Test hook manually
bash .claude-plugin/hooks/tool-logger/log-tool-usage.sh
```

## Best Practices

### 1. Start Small

```bash
# Install one plugin category at a time
/plugin install development-utilities@claudecode-marketplace

# Test thoroughly before adding more
```

### 2. Configure Environment Early

```bash
# Set up .env before installing MCP plugins
cp .env.example .env
# Edit .env with your credentials

# Then install MCP plugins
/plugin install mcp-data-sources@claudecode-marketplace
```

### 3. Use Version Pinning for Teams

```json
{
  "enabledPlugins": [
    "development-utilities@claudecode-marketplace#v1.0.0"
  ]
}
```

### 4. Regular Updates

```bash
# Update marketplace metadata weekly
/plugin marketplace update claudecode-marketplace

# Check for plugin updates
/plugin list --outdated

# Update all plugins
/plugin update --all
```

### 5. Monitor Resource Usage

```bash
# Check MCP server resource usage
/plugin mcp-stats

# Disable unused MCP servers
/plugin mcp-disable serena
```

## Advanced Usage

### Custom Plugin Development

Based on marketplace plugins:

```bash
# Clone marketplace
git clone https://github.com/henkisdabro/claudecode-marketplace

# Create custom command
mkdir -p .claude-plugin/commands
# Create your command markdown file
touch .claude-plugin/commands/my-command.md

# Add entry to marketplace.json
# Edit marketplace.json and add your plugin entry

# Test locally
/plugin marketplace add ./claudecode-marketplace
/plugin install my-plugin@claudecode-marketplace
```

### Combining Plugins

```bash
# Use multiple plugins together
/ultra-think "Design authentication system"  # planning-tools
/containerize --node                          # development-utilities
# fullstack-developer agent implements
# validation-gates agent tests
# documentation-manager agent documents
```

### Creating Team Workflows

```bash
# Define standard workflow in team docs
# 1. Planning: /ultra-think or /generate-prp
# 2. Implementation: Use fullstack-developer agent
# 3. Validation: validation-gates agent runs tests
# 4. Documentation: documentation-manager updates docs
# 5. Review: Check .claude/logs/tool-usage.log
```

## Performance Tips

### 1. Selective MCP Server Installation

```bash
# Don't install all MCP collections
# Install only what you need
/plugin install mcp-essentials@claudecode-marketplace  # Always useful
/plugin install mcp-data-sources@claudecode-marketplace  # If needed
```

### 2. Lazy Loading

Plugins and MCP servers load on-demand. No performance impact when not in use.

### 3. Resource Monitoring

```bash
# Monitor active MCP servers
/plugin mcp-stats

# Disable servers when project is complete
/plugin mcp-disable unused-server
```

## Support and Resources

### Getting Help

```bash
# Plugin help
/plugin help

# Marketplace help
/plugin marketplace help

# Command-specific help
/containerize --help
```

### Documentation

- [Main README](README.md)
- [Architecture Guide](ARCHITECTURE.md)
- [This Usage Guide](USAGE.md)

### Community

- GitHub Issues: Report bugs and request features
- Email: whom-wealthy.2z@icloud.com
- Documentation: https://docs.claude.com/en/docs/claude-code

## Next Steps

1. Install your first plugin
2. Explore plugin capabilities
3. Set up team configuration
4. Integrate into your workflow
5. Provide feedback for improvements

Happy coding with Claude Code Marketplace!
