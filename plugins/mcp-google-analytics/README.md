# MCP Google Analytics

Google's official [Google Analytics MCP server](https://github.com/googleanalytics/google-analytics-mcp), run with `pipx run` and pinned to a known release.

## What it can do

It is **read-only**: Data API reports (standard, funnel, conversions, realtime) plus Admin API reads of account summaries, property details, custom dimensions and metrics, property annotations and Google Ads links. It cannot create, change or delete anything in GA4.

Try: *"Which landing pages lost the most sessions last month compared with the month before?"*

It pairs with the `google-analytics` plugin, whose skills say how to read the numbers. That plugin does not need this one: it also works with the `ga` command-line tool, which can change configuration as well.

## Installation

```bash
/plugin install mcp-google-analytics@wookstar-claude-plugins
```

On Claude Code 2.1.275 or later, in one step without adding the marketplace first: `/plugin install mcp-google-analytics --marketplace henkisdabro/wookstar-claude-plugins`

`pipx` must be on your PATH.

## Configuration

Claude Code asks for two values when you enable the plugin (later: `/plugin configure mcp-google-analytics@wookstar-claude-plugins`):

- **Google credentials file** - path to a credentials JSON file
- **Google Cloud project ID** - the project used for API quota and billing

The credentials need the `https://www.googleapis.com/auth/analytics.readonly` scope, and the Google Analytics Data API and Admin API must be enabled in the project. Either use Application Default Credentials (`gcloud auth application-default login --scopes https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/cloud-platform`, adding `--client-id-file` for your own OAuth client or `--impersonate-service-account` for a service account) and give the path of the resulting file, or use a service account key and add the service account as a Viewer on the GA4 property.

Until both values are set the server does not start, and a startup notice reminds you.

Before 3.0.0 of `google-analytics` this server was bundled with that plugin. Settings entered there do not carry over - enter them again here.
