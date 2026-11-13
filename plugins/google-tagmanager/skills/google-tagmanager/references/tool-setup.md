# Getting a tool for container access

Read this when the session has neither GTM MCP tools nor the `gtm` CLI and the task needs to read or change a real container. Offer the user the choice once; do not install either without their yes. With no tool, work from an exported container JSON, or give generic advice and say so.

Neither tool ships with this plugin. Each is installed from its maker's own instructions, so it stays current with them.

| | `gtm` CLI | Stape's GTM MCP server |
|---|---|---|
| What it is | [owntag/gtm-cli](https://github.com/owntag/gtm-cli), a local binary | A hosted MCP server run by Stape (a third party, not Google) |
| Container access goes through | The user's machine, straight to Google's API | Stape's server |
| Suits | Scripting, CI, bulk audits and exports, service accounts | Working conversationally, with nothing to install |
| Sign-in | `gtm auth login` (browser), or a service account key | Google OAuth through `/mcp` |
| Official guide | The repository's README | <https://stape.io/helpdesk/documentation/how-to-set-up-mcp-server-for-gtm> |

**CLI** - commands and auth are in [cli.md](cli.md).

**MCP server** - Stape's guide covers Claude Desktop; for Claude Code the equivalent is one command, which you may run once the user agrees:

```bash
claude mcp add --transport http --scope user gtm https://gtm-mcp.stape.io/mcp
```

Then the user runs `/mcp`, picks `gtm` and completes the Google sign-in in the browser - slash commands are theirs to type. Read Stape's guide first if the command fails; the server URL is theirs to change.

Both tools can delete and publish. The approval guardrail in SKILL.md applies to each.
