# MCP MikroTik

MikroTik router management and network automation.

## Installation

```bash
/plugin install mcp-mikrotik@wookstar-claude-plugins
```

## Configuration

Requires the following environment variables:

- `MIKROTIK_HOST`: MikroTik router hostname or IP
- `MIKROTIK_USER`: SSH username
- `MIKROTIK_PASSWORD`: SSH password

Default port: 2200

Uses `uvx mcp-server-mikrotik` command.
