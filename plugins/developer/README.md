# Developer Toolkit

Planning, implementation and containerisation skills for application development.

## What's included

### Skills you run by name

- **/containerize** - Dockerfile, `.dockerignore` and `compose.yaml` for the current project: multi-stage builds, BuildKit cache mounts, pinned base images, non-root user, healthchecks. Aware of pnpm, uv and Bun.
- **/execute-prp** - Implement a feature from a PRP file and drive it until every validation gate passes.

### Skills Claude picks up automatically

- **prp-generator** - Writes a researched Product Requirement Plan with executable validation gates, saved to `PRPs/`.
- **fifteen-factor-app** - Twelve-Factor plus API First, Telemetry and Security, for cloud-native SaaS architecture and reviews.

## Installation

```bash
/plugin install developer@wookstar-claude-plugins
```

## Usage

```bash
# Plan a feature, then implement it
"Write a PRP for user authentication"
/execute-prp PRPs/user-authentication.md

# Containerise the project
/containerize

# Architecture guidance
"Review this service against the fifteen factors"
```

## Moved to official plugins

These used to ship here. Install the maintained versions instead:

| Removed from this plugin | Replacement |
|--------------------------|-------------|
| `webapp-testing` skill | `example-skills` from the `anthropics/skills` marketplace |
| `devtools` skill and `chrome-devtools` MCP server | `chrome-devtools-mcp` from `claude-plugins-official` |
| `playwright` MCP server | `playwright` from `claude-plugins-official` |
| `context7` MCP server | `context7` from `claude-plugins-official` |
| `firecrawl` MCP server | `firecrawl` from `claude-plugins-official` |
| `microsoft-docs` MCP server | `microsoft-docs` from `claude-plugins-official` |
| `/generate-prp` command | the `prp-generator` skill above - ask for a PRP |

```bash
/plugin marketplace add anthropics/skills
/plugin install example-skills@anthropic-agent-skills
/plugin install chrome-devtools-mcp@claude-plugins-official
```
