# Google Analytics

Google Analytics 4 reference for Claude Code, covering property setup, event tracking, e-commerce, BigQuery export, Measurement Protocol and privacy compliance - plus a skill for querying GA4's BigQuery export directly.

## What's Included

### Skills (2)

- **google-analytics** - GA4 implementation and analysis reference, including how to link BigQuery and the export schema
- **bigquery** - Queries the GA4 BigQuery export (`events_*` tables) through a BigQuery MCP server: event_params extraction, sessionisation, landing pages, session source/medium, funnels, and cost control with dry runs and shard filters. Invoke directly with `/google-analytics:bigquery <question>`

### MCP Servers (1)

- **analytics-mcp** - Google's official [Google Analytics MCP server](https://github.com/googleanalytics/google-analytics-mcp), run with `pipx run analytics-mcp`. It is **read-only**: Data API reports (standard, funnel, conversions, realtime) plus Admin API reads of account summaries, property details, custom dimensions/metrics, property annotations and Google Ads links. It cannot create, change or delete anything in GA4.

## Installation

```bash
/plugin install google-analytics@wookstar-claude-plugins
```

## Required Environment Variables

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/credentials.json"
export GOOGLE_CLOUD_PROJECT="your-gcp-project-id"  # project used for API quota and billing
```

The credentials need the `https://www.googleapis.com/auth/analytics.readonly` scope, and the Google Analytics Data API and Admin API must be enabled in the project. Either use Application Default Credentials (`gcloud auth application-default login --scopes https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/cloud-platform`, adding `--client-id-file` for your own OAuth client or `--impersonate-service-account` for a service account) and point `GOOGLE_APPLICATION_CREDENTIALS` at the resulting file, or use a service account key and add the service account as a Viewer on the GA4 property. `pipx` must be on your PATH.

## BigQuery querying

The `bigquery` skill needs a BigQuery MCP server, which this plugin does not bundle. Use one of Google's official options:

**Recommended - Google's `bigquery-data-analytics` plugin** (runs [MCP Toolbox for Databases](https://github.com/googleapis/mcp-toolbox) locally with `npx`, so Node.js is required):

```bash
gcloud auth application-default login
gcloud auth application-default set-quota-project YOUR_PROJECT_ID
/plugin install bigquery-data-analytics@claude-plugins-official
```

The plugin asks for a Project ID on install - the project your queries run in and are billed to. It can query the export in another project as long as you can read it. Optional safety settings, exported in your shell before starting Claude Code:

```bash
export BIGQUERY_MAXIMUM_BYTES_BILLED=10000000000   # refuse any query that would bill over ~10 GB
export BIGQUERY_READONLY=true                      # SELECT only
export BIGQUERY_MAX_QUERY_RESULT_ROWS=500          # default is 50
```

**Alternative - Google's remote BigQuery MCP server** at `https://bigquery.googleapis.com/mcp` (no local process, Streamable HTTP, OAuth). Create an OAuth client ID in your Google Cloud project with a localhost redirect URI on the port you pass as `--callback-port`, then:

```bash
claude mcp add --transport http bigquery https://bigquery.googleapis.com/mcp \
  --client-id YOUR_CLIENT_ID --client-secret --callback-port 8080
```

It has no dry-run parameter, so the skill falls back to `bq query --dry_run` for cost estimates when the `bq` CLI is installed. See [Use the BigQuery MCP server](https://docs.cloud.google.com/bigquery/docs/use-bigquery-mcp).

**Permissions** (either option): BigQuery Job User (`roles/bigquery.jobUser`) on the project that runs queries and BigQuery Data Viewer (`roles/bigquery.dataViewer`) on the GA4 export dataset (`analytics_<property_id>`). The remote server also needs MCP Tool User (`roles/mcp.toolUser`).

**Quota project:** `YOUR_PROJECT_ID` above is any Google Cloud project you can bill to - usually the one holding the export. If you also use `analytics-mcp`, the scoped login in the previous section already includes `cloud-platform`, which covers BigQuery, so one login serves both.

## Coverage

- **Property setup** - Creating and configuring GA4 properties
- **Events** - Automatic, recommended, and custom events
- **Custom dimensions** - User and event scoped parameters
- **E-commerce** - Purchase tracking, product views, cart events
- **BigQuery** - Export setup and schema (google-analytics skill); SQL querying with cost control (bigquery skill)
- **Measurement Protocol** - Server-side event tracking
- **DebugView** - Real-time event debugging
- **Privacy compliance** - Consent mode, data retention

## Usage Examples

```bash
# Implementation
"Set up GA4 tracking for my Next.js application"

# E-commerce
"Implement purchase event tracking for my checkout flow"

# Analysis
"Write SQL to analyse GA4 conversion funnels in BigQuery"
"/google-analytics:bigquery sessions by source/medium for last month"

# Server-side
"Send offline conversion data using Measurement Protocol"
```

## Reference Materials

The google-analytics skill includes 15 reference files, routed from a decision tree in its SKILL.md. The bigquery skill adds a library of GA4 export query patterns.
