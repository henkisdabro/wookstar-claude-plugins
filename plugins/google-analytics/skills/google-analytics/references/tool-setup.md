# Getting a tool for live GA4 data

Read this when the session has neither Analytics MCP tools nor the `ga` CLI and the task needs live report data or a configuration change. Offer the user the choice once; do not install either without their yes. With no tool, explain how to get the number in the GA4 interface, or give the configuration steps, and say that is what you are doing.

Neither tool ships with this plugin. Each is installed from its maker's own instructions, so it stays current with them.

| | `ga` CLI | Google's Analytics MCP server |
|---|---|---|
| What it is | [daidalytics/google-analytics-cli](https://github.com/daidalytics/google-analytics-cli), a local tool (third party) | Google's official server, [googleanalytics/google-analytics-mcp](https://github.com/googleanalytics/google-analytics-mcp) |
| Can do | Reports, and configuration changes through the Admin API | Reports and account or property details - read-only unless started with its write flag |
| Suits | Changing configuration, audits across properties, scripting, CI | Reading live data with no risk of changing anything |
| Sign-in | `ga auth login` with the user's own Google Cloud OAuth client, or a service account key | Application Default Credentials with the `analytics.readonly` scope, and a Google Cloud project |
| Official guide | The repository's README | <https://github.com/googleanalytics/google-analytics-mcp#setup-instructions-> |

**CLI** - commands and auth are in `cli.md`.

**MCP server** - follow Google's guide: enable the Analytics Admin and Data APIs in a Cloud project, create credentials with `gcloud auth application-default login` and the readonly scope, then add the server. Its "Configure Claude Code" section gives the command, which you may run once the user agrees and has supplied both values:

```bash
claude mcp add analytics-mcp --scope user -e GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json -e GOOGLE_CLOUD_PROJECT=your-project-id -- pipx run analytics-mcp
```

It needs `pipx`. The server loads in the next session, or after the user runs `/mcp` and reconnects. Read Google's guide first if the command fails; the package and its flags are theirs to change.

A task that changes configuration needs the CLI, or the GA4 interface.
