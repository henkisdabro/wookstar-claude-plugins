---
name: google-ads-scripts
description: Expert guidance for Google Ads Script development including AdsApp API, campaign management, ad groups, keywords, bidding strategies, performance reporting, budget management, automated rules, and optimization patterns. Use when automating Google Ads campaigns, managing keywords and bids, creating performance reports, implementing automated rules, optimizing ad spend, working with campaign budgets, monitoring quality scores, tracking conversions, pausing low-performing keywords, adjusting bids based on ROAS, or building Google Ads automation scripts. Covers campaign operations, keyword targeting, bid optimization, conversion tracking, error handling, and JavaScript-based automation in Google Ads editor.
---

# Google Ads Scripts

## Overview

Guidance for developing Google Ads Scripts using the AdsApp API. Automate campaign management, bid optimisation, performance reporting, and bulk operations through JavaScript running in the Google Ads editor.

## When to Use This Skill

- Automating campaign management or bulk operations
- Managing keywords and adjusting bids programmatically
- Creating performance reports or dashboards
- Implementing automated rules for campaign optimisation
- Optimising ad spend based on ROAS or CPA targets
- Monitoring quality scores, budgets, or conversions
- Debugging Google Ads Script code or API issues

## Core Capabilities

### 1. Campaign Operations

Manage campaigns programmatically - creation, modification, status changes, bulk updates. Use `AdsApp.campaigns()` with conditions to filter by status, budget, name patterns, or type. Apply labels for organisation.

### 2. Keyword & Bid Management

Automate keyword targeting and bid adjustments based on performance. Filter by quality score, adjust max CPC bids based on ROAS/CPA targets, add/remove negative keywords, and implement bid optimisation algorithms.

### 3. Performance Reporting

Generate custom reports using campaign, ad group, keyword, and ad statistics. Retrieve metrics for custom date ranges, calculate derived metrics (CTR, CPC, conversion rate), and export data to Google Sheets.

### 4. Budget Management

Control spending and allocate budgets across campaigns. Get/set daily campaign budgets, monitor spend against thresholds, pause campaigns when limits are reached, and distribute budgets based on performance.

### 5. Automated Rules & Optimisation

Build intelligence into campaign management with automated decision-making. Pause low-performing keywords, increase bids for high-performers, adjust budgets based on day-of-week patterns.

### 6. Error Handling & Resilience

Implement robust error handling for API limits, quota issues, and runtime errors. Use try-catch blocks, null checks, sheet-based logging for audit trails. Be aware of the 30-minute execution limit.

## Quick Start

The most common pattern - pause keywords with low quality scores and high spend:

```javascript
function pauseLowQualityKeywords() {
  const keywords = AdsApp.keywords()
    .withCondition('keyword.status = ENABLED')
    .withCondition('keyword.quality_info.quality_score < 4')
    .withCondition('keyword.metrics.cost > 100000000')
    .get();

  let count = 0;
  while (keywords.hasNext()) {
    keywords.next().pause();
    count++;
  }
  Logger.log(`Paused ${count} low-quality keywords`);
}
```

## Best Practices

- **Batch operations** - collect entities first, then process; avoid individual API calls in loops
- **API-level filtering** - use `.withCondition()` instead of filtering in JavaScript
- **Error handling** - wrap operations in try-catch, log errors to sheets or email
- **Execution limits** - use `.withLimit()` and batch processing for large accounts (30-min timeout)
- **Micros conversion** - currency values are in micros (divide by 1,000,000 for display)
- **Audit logging** - log all changes to Google Sheets with timestamps

See [references/best-practices.md](references/best-practices.md) for detailed code examples of each practice.

## Integration with Other Skills

- **google-apps-script** - Use for Google Sheets reporting, Gmail notifications, Drive file management, and trigger setup
- **ga4-measurement-protocol** - Combine with GA4 for tracking script-triggered events
- **gtm-api** - Coordinate with GTM configurations for holistic tracking

## Validation & Testing

Use the validation scripts in `scripts/` for pre-deployment checks:

- **scripts/validators.py** - Validate campaign data, bid values, budget amounts before applying changes

## Troubleshooting

**Common issues:**

1. **Execution timeout** - reduce scope with `.withLimit()` or process in batches
2. **Quota exceeded** - reduce API call frequency, use cached data
3. **Type errors** - remember micros conversion for currency values
4. **Null values** - always check for null before accessing properties

Use `Logger.log()` for debugging - view logs via View > Logs in the script editor.

## References

Load these on demand for detailed documentation:

- [references/ads-api-reference.md](references/ads-api-reference.md) - Complete AdsApp API reference including selectors, methods, conditions, statistics, and enterprise patterns
- [references/examples.md](references/examples.md) - Detailed code examples: pause low-quality keywords, optimise bids by ROAS, export campaign performance to Sheets
- [references/best-practices.md](references/best-practices.md) - Best practices with code blocks: batch operations, API filtering, error handling, micros conversion, audit logging
- [references/patterns.md](references/patterns.md) - Reusable automation patterns: conditional bid adjustment, quality score monitoring
