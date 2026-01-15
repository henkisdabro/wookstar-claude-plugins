# Cloudflare Skills for Claude

A collection of Claude Skills for building on the Cloudflare developer platform.

## Skills

### building-mcp-server-on-cloudflare

Build remote Model Context Protocol (MCP) servers on Cloudflare with tools, OAuth authentication, and production deployment.

**Triggers:** "build MCP server", "create MCP tools", "remote MCP", "deploy MCP", "OAuth to MCP", "MCP authentication"

**Contents:**
- `SKILL.md` - Core guide for building MCP servers
- `references/examples.md` - Official templates and boilerplates
- `references/oauth-setup.md` - Security and OAuth configuration
- `references/troubleshooting.md` - Common issues and fixes

### building-ai-agent-on-cloudflare

Build AI agents using the Cloudflare Agents SDK with state management, real-time WebSockets, scheduled tasks, and tool integration.

**Triggers:** "build an agent", "AI agent", "chat agent", "stateful agent", "Agents SDK", "real-time AI", "WebSocket AI"

**Contents:**
- `SKILL.md` - Core guide for building agents
- `references/examples.md` - Official templates and reference implementations
- `references/agent-patterns.md` - Tool calling, RAG, multi-agent orchestration
- `references/state-patterns.md` - State management strategies
- `references/troubleshooting.md` - Common issues and fixes

## Usage

These skills are designed for use with Claude. When a user's request matches the trigger phrases, Claude will use the relevant skill to provide accurate, up-to-date guidance for building on Cloudflare.

## Structure

Each skill follows the standard layout:

```
skill-name/
├── SKILL.md              # Main skill file with YAML frontmatter
└── references/           # Supporting documentation
    ├── examples.md
    ├── patterns.md
    └── troubleshooting.md
```

## Resources

- [Cloudflare Agents Documentation](https://developers.cloudflare.com/agents/)
- [Cloudflare MCP Guide](https://developers.cloudflare.com/agents/model-context-protocol/)
- [Agents SDK Repository](https://github.com/cloudflare/agents)
- [Agents Starter Template](https://github.com/cloudflare/agents-starter)
