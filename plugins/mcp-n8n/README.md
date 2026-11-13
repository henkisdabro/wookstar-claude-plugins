# MCP n8n

n8n workflow automation via [n8n-mcp](https://github.com/czlonkowski/n8n-mcp).

## What it can do

Twenty-eight tools in two groups. The documentation tools search n8n's nodes and templates and validate workflow JSON, and work without touching your instance. The instance tools **read and write**: they list, create, update, delete, test and auto-fix workflows, read executions, deploy templates, and manage data tables, folders and credentials.

Review any call that deletes a workflow or changes credentials before approving it, and give the API key the narrowest scope your n8n plan allows.

Try: *"List my active workflows and tell me which failed in the last day."* or *"Build a workflow that posts new Typeform responses to Slack, validate it, then create it inactive."*

## Installation

```bash
/plugin install mcp-n8n@wookstar-claude-plugins
```

On Claude Code 2.1.275 or later, in one step without adding the marketplace first: `/plugin install mcp-n8n --marketplace henkisdabro/wookstar-claude-plugins`

Claude Code prompts for your n8n instance URL and API key when you enable the plugin; the key goes to your system keychain.

Since 2.0.0 the instance URL is yours to set - earlier versions pointed every install at one hard-coded instance. The `N8N_API_KEY` shell variable is no longer read.
