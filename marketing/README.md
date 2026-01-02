# Marketing Toolkit

Complete marketing analytics suite covering Google Tag Manager, Google Analytics 4, and Google Ads Scripts with comprehensive reference documentation.

## What's Included

### Skills (3)

- **ga4** - Comprehensive Google Analytics 4 guide with 15 reference documents covering setup, events, custom dimensions, audiences, BigQuery, Measurement Protocol, privacy compliance, and more
- **gtm** - Complete Google Tag Manager guide with 9 reference documents covering tags, triggers, variables, data layer, debugging, custom templates, and API automation
- **google-ads-scripts** - Google Ads Scripts expertise for campaign automation, bidding strategies, and performance reporting

### MCP Servers (2)

- **analytics-mcp** - Google Analytics API integration
- **gtm-mcp-server** - Google Tag Manager API integration via Stape

## Installation

```bash
/plugin install marketing@wookstar
```

## Required Environment Variables

```bash
# For analytics-mcp
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
GOOGLE_PROJECT_ID=your-project-id
```

## Usage Examples

### Google Tag Manager

```bash
# Get GTM fundamentals
"Explain how GTM data layer works for SPAs"

# Setup guidance
"Help me install GTM on my React website"

# Debug tracking
"My form submission tag isn't firing, help me debug"

# E-commerce tracking
"Implement GA4 e-commerce tracking via GTM"

# Custom templates
"Build a custom GTM template for my analytics tool"
```

### Google Analytics 4

```bash
# Initial setup
"Help me create a GA4 property and install tracking"

# E-commerce tracking
"Implement purchase event tracking for my checkout"

# BigQuery analysis
"Write SQL to analyze GA4 conversion funnels in BigQuery"

# Privacy compliance
"Implement Google Consent Mode v2 for GDPR"

# Measurement Protocol
"Send server-side events to GA4 from my Node.js backend"
```

### Google Ads Scripts

```bash
# Campaign automation
"Write a script to pause low-performing keywords automatically"

# Bidding strategies
"Create an automated bid adjustment script based on ROAS"

# Performance reports
"Generate a weekly campaign performance report"
```

## Skill Details

### GA4 Skill

Comprehensive Google Analytics 4 expertise covering:

**Setup & Configuration:**
- Property and data stream creation
- Measurement ID configuration
- Data retention settings

**Implementation:**
- gtag.js installation
- GTM integration
- Cross-domain measurement

**Events:**
- Event architecture and parameters
- Recommended events (purchase, login, etc.)
- Custom event design

**Advanced:**
- Measurement Protocol for server-side tracking
- BigQuery export and SQL analysis
- User ID and cross-device tracking
- Privacy and Consent Mode v2

**Reference Files (15):**
- setup.md, events-fundamentals.md, custom-events.md
- recommended-events.md, custom-dimensions.md, user-tracking.md
- audiences.md, reporting.md, bigquery.md
- gtag.md, gtm-integration.md, measurement-protocol.md
- debugview.md, privacy.md, data-management.md

### GTM Skill

Complete Google Tag Manager expertise covering:

**Core Concepts:**
- Tags, triggers, and variables
- Container types and installation

**Configuration:**
- GA4 tags and event tracking
- Google Ads conversion tracking
- Third-party tag integration

**Advanced:**
- Data layer implementation
- Custom JavaScript variables
- Custom templates with sandboxed JS
- GTM API automation

**Reference Files (9):**
- setup.md, tags.md, triggers.md
- variables.md, datalayer.md, debugging.md
- best-practices.md, custom-templates.md, api.md

### Google Ads Scripts

Campaign automation expertise covering:

- AdsApp API for campaign management
- Bidding strategy automation
- Performance reporting scripts
- Keyword and ad management
- Scheduled script execution

## When to Use

This toolkit is ideal for:

- Implementing GTM containers and configurations
- Setting up GA4 tracking and analytics
- Building e-commerce tracking implementations
- Debugging tracking issues
- Creating BigQuery exports and analyses
- Implementing privacy and consent features
- Automating Google Ads campaign management
- Building custom GTM templates
