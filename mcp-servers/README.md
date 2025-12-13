# Individual MCP Servers

This directory previously contained individual MCP server configurations. These have been **inlined directly into the root marketplace.json** for simplicity.

## Available MCP Servers

The following MCP servers are available as individual plugins:

| Plugin Name | Description |
|-------------|-------------|
| `mcp-fetch` | Web content fetching and HTTP requests |
| `mcp-google-workspace` | Google Workspace integration (Gmail, Drive, Calendar) |
| `mcp-mikrotik` | MikroTik router management and network automation |
| `mcp-n8n` | n8n workflow automation integration |
| `mcp-notion` | Notion workspace and database integration |
| `mcp-open-meteo` | Weather and climate data (no API key required) |

## Installation

```bash
/plugin install mcp-fetch@wookstar
/plugin install mcp-google-workspace@wookstar
/plugin install mcp-mikrotik@wookstar
/plugin install mcp-n8n@wookstar
/plugin install mcp-notion@wookstar
/plugin install mcp-open-meteo@wookstar
```

## Configuration

MCP server configurations are defined in `.claude-plugin/marketplace.json` under each plugin's `mcpServers` field. Environment variables are specified using `${VAR_NAME}` syntax.

See the root marketplace.json for full configuration details.
