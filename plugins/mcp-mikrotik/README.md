# MCP MikroTik

MikroTik router management and network automation over SSH via [mcp-server-mikrotik](https://github.com/jeff-nasseri/mikrotik-mcp).

## Installation

```bash
/plugin install mcp-mikrotik@wookstar-claude-plugins
```

Claude Code prompts for the router host, SSH username, password and port (default 22) when you enable the plugin; the password goes to your system keychain.

Since 2.0.0 credentials reach the server as environment variables rather than command-line arguments, so the password no longer shows in `ps` output. The `MIKROTIK_USER` shell variable and the hard-coded port 2200 are gone - enter your values at the prompt.

Use a dedicated RouterOS user with the narrowest group that covers what you ask Claude to do.
