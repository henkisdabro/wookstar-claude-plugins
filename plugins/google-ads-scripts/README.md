# Google Ads Scripts

A Claude Code skill for writing Google Ads Scripts - the JavaScript that runs inside Google Ads against the AdsApp API and GAQL.

## What's Included

### Skills (1)

- **google-ads-scripts** - a five-step workflow (pick selector or GAQL, filter on the server, get currency vs micros right, gate every mutation, fit the 30-minute limit), plus an API reference, examples, two dry-run-by-default templates and a Python validator

## Installation

```bash
/plugin install google-ads-scripts@wookstar-claude-plugins
```

## Coverage

- **Selectors** - campaigns, ad groups, keywords and ads with GAQL field-name conditions
- **Reporting** - `AdsApp.search` and `AdsApp.report` with GAQL, exported to Google Sheets
- **Bids and budgets** - keyword and ad-group CPC, campaign bidding strategies, shared-budget safety
- **Quality score** - the score and its components via GAQL
- **Targeting** - device, location and ad-schedule bid modifiers
- **Manager accounts** - `AdsManagerApp` and `executeInParallel`
- **Removed features** - the ad customizer and legacy extension sunset of 14 July 2025, and what replaces them

## Usage Examples

```bash
"Write a script to pause low-performing keywords automatically"
"Create a weekly performance report sent via email"
"Build a script to adjust bids based on ROAS targets"
```
