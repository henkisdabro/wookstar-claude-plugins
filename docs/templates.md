# Component Templates

JSON and configuration templates for creating new marketplace components.

## Toolkit Entry (marketplace.json)

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
  "homepage": "https://github.com/henkisdabro/wookstar-claude-plugins",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "category": "appropriate-category",
  "strict": false
}
```

## Toolkit with MCP Servers (marketplace.json)

```json
{
  "name": "my-toolkit",
  "source": "./my-toolkit",
  "description": "Toolkit with embedded MCP servers",
  "version": "1.0.0",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "keywords": ["keyword1", "mcp"],
  "category": "development",
  "mcpServers": "./.mcp.json",
  "strict": false
}
```

## MCP Configuration (.mcp.json)

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

## Individual MCP Server Plugin (marketplace.json)

```json
{
  "name": "mcp-my-server",
  "source": "./mcp-servers/my-server",
  "description": "MCP server description",
  "keywords": ["mcp", "integration"],
  "category": "mcpServers",
  "mcpServers": "./.mcp.json",
  "strict": false
}
```

## Category Values

**For Toolkits:**

- `"productivity"` - Productivity and workflow tools
- `"development"` - Development and coding tools
- `"documents"` - Document processing tools
- `"meta"` - Tools for Claude Code itself
- `"data"` - Data and analytics tools
- `"ai"` - AI integrations
- `"analytics"` - Analytics and tracking tools
- `"utilities"` - General utility tools

**For Individual Plugins:**

- `"mcpServers"` - MCP server integrations
