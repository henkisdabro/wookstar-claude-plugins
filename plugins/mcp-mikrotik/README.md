# MCP MikroTik

MikroTik router management and network automation over SSH via [mcp-server-mikrotik](https://github.com/jeff-nasseri/mikrotik-mcp).

## What it can do

The server (0.27.0.0) has 218 tools covering most of RouterOS over SSH: backups and exports, bridges and VLANs, DHCP, DNS, firewall filter and NAT rules, address lists, routes, interfaces, wireless, users, logs and more. 120 of them **write to the router**, and a wrong firewall or bridge change can lock you out.

Since 3.0.0 the plugin starts the server with `MIKROTIK_READ_ONLY=true`, so only its 98 read-only tools load. Every session with the plugin enabled carries their names, so disable it when you are not working on the router.

Try: *"Show the DHCP leases and flag any device I have not named."* or *"List the firewall filter rules that never match."*

## Quick checks over SSH

For a one-off look at the router, plain SSH costs nothing in context and needs no plugin. RouterOS runs a command passed on the SSH line and exits:

```bash
ssh admin@router '/ip/firewall/filter/print'
ssh admin@router '/ip/dhcp-server/lease/print'
ssh admin@router '/log/print where topics~"error"'
```

Make this the default for checks, with a key-based login for a RouterOS user in the `read` group. Reach for the plugin when a task needs many lookups in a row.

## Making changes

The plugin cannot change the router. When you do want Claude to write, add the server yourself without the read-only flag, take a backup first, and review every create, update, remove and restore call before approving it:

```bash
claude mcp add mikrotik-rw -e MIKROTIK_HOST=router -e MIKROTIK_USERNAME=admin -e MIKROTIK_PASSWORD=... -- uvx mcp-server-mikrotik@0.27.0.0
```

That stores the password in your Claude Code config in plain text, so remove the server (`claude mcp remove mikrotik-rw`) when you are done.

## Installation

```bash
/plugin install mcp-mikrotik@wookstar-claude-plugins
```

On Claude Code 2.1.275 or later, in one step without adding the marketplace first: `/plugin install mcp-mikrotik --marketplace henkisdabro/wookstar-claude-plugins`

Claude Code prompts for the router host, SSH username, password and port (default 22) when you enable the plugin; the password goes to your system keychain.

Since 2.0.0 credentials reach the server as environment variables rather than command-line arguments, so the password no longer shows in `ps` output. The `MIKROTIK_USER` shell variable and the hard-coded port 2200 are gone - enter your values at the prompt.

Use a dedicated RouterOS user with the narrowest group that covers what you ask Claude to do.
