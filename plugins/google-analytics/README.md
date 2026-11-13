# Google Analytics

Guardrails for working on Google Analytics 4 with Claude Code, plus a skill for querying GA4's BigQuery export. It does not re-teach GA4 - current models know the basics. It pins down the vocabulary models blur, says which data source a number came from and why sources disagree, lists the mistakes models typically make, and covers what changed recently, then links to Google's own docs for the rest.

## What's Included

### Skills (2)

- **google-analytics** - GA4 guardrails: glossary, data sources, pitfalls, limits, Data Manager and the BigQuery export schema
- **bigquery** - Queries the GA4 BigQuery export (`events_*` tables) through a BigQuery MCP server: event_params extraction, sessionisation, landing pages, session source/medium, funnels, and cost control with dry runs and shard filters. Invoke directly with `/google-analytics:bigquery <question>`

### Tools it works with

The skills carry no server of their own. For live data and configuration they use whichever of these you have:

- **The `ga` CLI** - [daidalytics/google-analytics-cli](https://github.com/daidalytics/google-analytics-cli) (a third party, not Google). Reports and configuration changes from the terminal. Ask Claude to install it, or run `uv tool install google-analytics-cli` and `ga auth login`. Claude previews each change with `--dry-run` and asks before sending it.
- **Google's Analytics MCP server** - read-only reports, from the separate `mcp-google-analytics` plugin: `/plugin install mcp-google-analytics@wookstar-claude-plugins`. Before 3.0.0 it was bundled here.

## Installation

```bash
/plugin install google-analytics@wookstar-claude-plugins
```

On Claude Code 2.1.275 or later, in one step without adding the marketplace first: `/plugin install google-analytics --marketplace henkisdabro/wookstar-claude-plugins`

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

- **Glossary** - event in its senses, key event versus conversion, parameter versus custom dimension and scope, the user identifiers and reporting identity, session, the IDs (measurement, property, stream, Google tag), audience versus segment versus comparison
- **Where the numbers come from** - standard reports, Explorations, the Data API and the BigQuery export compared on freshness, sampling, thresholding, cardinality and modelling, so differences are explained and not "fixed"
- **Collection routes** - gtag.js, a GTM web container, an optimised container with Destination tags, the Measurement Protocol, the Data Manager API and Firebase
- **Data Manager** - the Analytics Admin page (open beta, November 2026) and the Data Manager API for sending events
- **Limits** - one table, checked against Google's pages
- **Pitfalls** - one line each, grouped by task
- **What changed in 2025-2026**, and a table of links to Google's docs for step-by-step procedures
- **BigQuery export** - schema reference, and the `bigquery` skill for cost-controlled SQL

## Usage examples

- "Why does this Exploration show fewer users than the standard report?"
- "Which landing pages lost the most sessions last month compared with the month before?"
- "Design the ecommerce events for our checkout, and tell me which parameters need registering."
- "Create a custom dimension for `plan_tier` on property 123456789." (uses the `ga` CLI, with a dry run first)
- `/google-analytics:bigquery sessions by landing page last week`
