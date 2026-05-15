# Developer Toolkit

Complete development toolkit with commands, testing skills, and powerful MCP integrations.

## What's Included

### Commands (3)

- **/containerize** - Create production-ready Docker configurations
- **/generate-prp** - Generate Progressive Refinement Plans for complex features
- **/execute-prp** - Execute previously generated PRPs

### Skills (4)

- **webapp-testing** - Web application testing toolkit with Playwright
- **devtools** - Chrome DevTools MCP setup guide for browser debugging and automation
- **prp-generator** - Generate comprehensive Product Requirement Plans with research methodology
- **fifteen-factor-app** - SaaS architecture principles (extends the Twelve-Factor App methodology)

### MCP Servers (5)

- **chrome-devtools** - Chrome DevTools Protocol integration
- **context7** - Context-aware code understanding
- **firecrawl** - Advanced web scraping and crawling
- **microsoft-docs** - Microsoft documentation access
- **playwright** - Browser automation and testing

## Installation

```bash
/plugin install developer@wookstar-claude-plugins
```

## Required Environment Variables

Create a `.env` file in your project root:

```bash
# Context7 (optional)
CONTEXT7_API_KEY=your_key_here

# Firecrawl (optional)
FIRECRAWL_API_KEY=your_key_here
```

## Usage Examples

```bash
# Generate a Progressive Refinement Plan
/generate-prp "Build user authentication module"

# Execute the generated plan
/execute-prp

# Container-ise your application
/containerize

# Playwright testing
"Test the checkout flow in our web app"

# Use Chrome DevTools
"Debug this JavaScript performance issue"

# Architecture guidance
"Help me design this service following fifteen-factor principles"
```

## Skill Details

### fifteen-factor-app

Extends the original Twelve-Factor App methodology with three additional factors for modern cloud-native applications:

- **API First** - Design APIs before implementation
- **Telemetry** - Built-in observability and monitoring
- **Security** - Security as a first-class concern

Use when planning SaaS architecture, creating PRPs/PRDs, or evaluating application designs.

### prp-generator

Generates comprehensive Product Requirement Plans with:

- Research methodology documentation
- Structured requirement templates
- Implementation guidance
- Risk assessment frameworks

## When to Use

This toolkit is ideal for:

- Browser automation and testing
- Accessing technical documentation
- Web scraping and data extraction
- Generating comprehensive project plans
- SaaS architecture design and review
- Container-ising applications for deployment
