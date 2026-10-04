# MCP n8n

n8n workflow automation via [n8n-mcp](https://github.com/czlonkowski/n8n-mcp).

## Installation

```bash
/plugin install mcp-n8n@wookstar-claude-plugins
```

Claude Code prompts for your n8n instance URL and API key when you enable the plugin; the key goes to your system keychain.

Since 2.0.0 the instance URL is yours to set - earlier versions pointed every install at one hard-coded instance. The `N8N_API_KEY` shell variable is no longer read.
