# Google Analytics

Comprehensive Google Analytics 4 guide for Claude Code, covering property setup, event tracking, e-commerce, BigQuery integration, and privacy compliance.

## What's Included

### Skills (1)

- **google-analytics** - Complete GA4 development and implementation guide

### MCP Servers (1)

- **analytics-mcp** - GA4 API integration for data queries

## Installation

```bash
/plugin install google-analytics@wookstar-claude-plugins
```

## Required Environment Variables

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
export GOOGLE_PROJECT_ID="your-gcp-project-id"
# Get credentials: GCP Console > APIs & Services > Credentials > Service Account
```

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
"Write SQL to analyze GA4 conversion funnels in BigQuery"

# Server-side
"Send offline conversion data using Measurement Protocol"
```

## Reference Materials

The skill includes 15 comprehensive reference guides covering all aspects of GA4 implementation and analysis.
