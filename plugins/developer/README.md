# Developer Toolkit

Complete development toolkit with expert agents, commands, testing skills, and powerful MCP integrations.

## What's Included

### Agents (3)

- **fullstack-developer** - Expert in frontend (React, TypeScript, Vue) and backend (Node.js, FastAPI, databases)
- **validation-gates** - Testing and quality assurance specialist (unit tests, integration tests, coverage)
- **documentation-manager** - Technical documentation specialist for README files, API docs, and architecture decisions

### Commands (3)

- **/containerize** - Create production-ready Docker configurations
- **/generate-prp** - Generate Progressive Refinement Plans for complex features
- **/execute-prp** - Execute previously generated PRPs

### Skills (5)

- **git-commit-helper** - Generate descriptive commit messages from git diffs
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
# Fullstack agent helps with development
"Build a REST API with authentication"

# Documentation manager keeps docs in sync
"Update the documentation after these code changes"

# Validation agent runs tests
"Run all tests and check coverage"

# Generate a Progressive Refinement Plan
/generate-prp "Build user authentication module"

# Execute the generated plan
/execute-prp

# Container-ize your application
/containerize

# Git commit helper
"Generate a commit message for my changes"

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

- Full-stack web application development
- Testing and quality assurance
- Browser automation and testing
- Git workflow optimisation
- Accessing technical documentation
- Web scraping and data extraction
- Generating comprehensive project plans
- Maintaining documentation alongside code changes
- SaaS architecture design and review
- Container-ising applications for deployment
