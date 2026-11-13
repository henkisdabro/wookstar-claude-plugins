# MCP MikroTik

MikroTik router management and network automation over SSH via [mcp-server-mikrotik](https://github.com/jeff-nasseri/mikrotik-mcp).

## What it can do

About 220 tools covering most of RouterOS over SSH: backups and exports, bridges and VLANs, DHCP, DNS, firewall filter and NAT rules, address lists, routes, interfaces, wireless, users, logs and more. Most of them **write to the router** - a wrong firewall or bridge change can lock you out.

Review every create, update, remove and restore call before approving it, take a backup first (the server has a tool for it), and prefer a read-only RouterOS group for the account when you only want to inspect.

Try: *"Show the DHCP leases and flag any device I have not named."* or *"Back up the router, then list firewall filter rules that never match."*

## Installation

```bash
/plugin install mcp-mikrotik@wookstar-claude-plugins
```

On Claude Code 2.1.275 or later, in one step without adding the marketplace first: `/plugin install mcp-mikrotik --marketplace henkisdabro/wookstar-claude-plugins`

Claude Code prompts for the router host, SSH username, password and port (default 22) when you enable the plugin; the password goes to your system keychain.

Since 2.0.0 credentials reach the server as environment variables rather than command-line arguments, so the password no longer shows in `ps` output. The `MIKROTIK_USER` shell variable and the hard-coded port 2200 are gone - enter your values at the prompt.

Use a dedicated RouterOS user with the narrowest group that covers what you ask Claude to do.
