# Google Analytics

Google Analytics 4 reference for Claude Code, covering property setup, event tracking, e-commerce, BigQuery export, Measurement Protocol and privacy compliance.

## What's Included

### Skills (1)

- **google-analytics** - GA4 implementation and analysis reference

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

## Coverage

- **Property setup** - Creating and configuring GA4 properties
- **Events** - Automatic, recommended, and custom events
- **Custom dimensions** - User and event scoped parameters
- **E-commerce** - Purchase tracking, product views, cart events
- **BigQuery** - Raw data export and SQL analysis
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

# Server-side
"Send offline conversion data using Measurement Protocol"
```

## Reference Materials

The skill includes 15 reference files, routed from a decision tree in SKILL.md.
