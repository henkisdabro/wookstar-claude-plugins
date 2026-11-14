# MCP n8n

n8n workflow automation via [n8n-mcp](https://github.com/czlonkowski/n8n-mcp).

## What it can do

The server (2.102.0) has 28 tools; the plugin loads the 20 used for building and running workflows. The 7 documentation tools search n8n's nodes and templates and validate workflow JSON, and work without touching your instance. The 13 instance tools **read and write**: they list, create, update, delete, test and auto-fix workflows, keep version history, read executions, deploy templates and check the connection.

Since 3.0.0 the plugin turns off the other 8 through `DISABLED_TOOLS`: `n8n_manage_credentials`, `n8n_manage_datatable`, `n8n_manage_folders`, `n8n_evaluations`, `n8n_audit_instance` and `n8n_list_catalog`, plus `n8n_explore_node_resources` and `n8n_manage_agents`, which need an `N8N_MCP_ACCESS_TOKEN` the plugin never sets. Fewer tools means fewer names in every session's context. If you need them, add n8n-mcp yourself with `claude mcp add` (see its [README](https://github.com/czlonkowski/n8n-mcp)) and disable this plugin.

Review any call that deletes a workflow before approving it, and give the API key the narrowest scope your n8n plan allows.

Try: *"List my active workflows and tell me which failed in the last day."* or *"Build a workflow that posts new Typeform responses to Slack, validate it, then create it inactive."*

## Installation

```bash
/plugin install mcp-n8n@wookstar-claude-plugins
```

On Claude Code 2.1.275 or later, in one step without adding the marketplace first: `/plugin install mcp-n8n --marketplace henkisdabro/wookstar-claude-plugins`

Claude Code prompts for your n8n instance URL and API key when you enable the plugin; the key goes to your system keychain.

Since 2.0.0 the instance URL is yours to set - earlier versions pointed every install at one hard-coded instance. The `N8N_API_KEY` shell variable is no longer read.
