---
name: google-analytics
description: Google Analytics 4 implementation and analysis reference. Use when querying live GA4 report data, setting up a GA4 property or data stream, installing gtag.js, designing event or ecommerce tracking, registering custom dimensions or audiences, sending server-side events via Measurement Protocol, writing SQL against the BigQuery export, debugging with DebugView, or configuring Consent Mode and data retention. Do NOT use for general GTM container work such as triggers, variables, custom templates or server-side containers - use google-tagmanager; Google Ads scripting or ad reporting - use google-ads-scripts; Universal Analytics or non-Google analytics tools.
---

# Google Analytics 4

GA4 is event-based: every interaction is an event with parameters. Pick the reference from the decision tree below and read it before answering anything beyond the Quick Start.

The bundled `analytics-mcp` server (Google's official GA MCP) is read-only: it runs Data API reports, funnel and realtime reports, and reads account, property, custom-definition and Google Ads link details. Use it to answer questions about live GA4 data; configuration changes are made in the GA4 UI or through the Admin API outside this server.

## Quick Start

1. **Create property:** analytics.google.com -> Admin -> Create -> Property
2. **Create data stream:** Add web stream, note Measurement ID (G-XXXXXXXXXX)
3. **Install tracking** (choose one):
   - **GTM (recommended):** Install container, create Google Tag with Measurement ID, trigger on All Pages, publish
   - **gtag.js direct:**
     ```html
     <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
     <script>
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'G-XXXXXXXXXX');
     </script>
     ```
4. **Verify:** Enable GA Debugger extension, check Admin -> DebugView for session_start, page_view
5. **Send custom events:**
   ```javascript
   gtag('event', 'button_click', { button_name: 'Subscribe', button_location: 'header' });
   ```

## Decision Tree: Which Reference Do I Need?

```
What are you trying to do?

Setting up GA4 for the first time?         -> references/setup.md
Understanding how events work?              -> references/events-fundamentals.md
Implementing standard tracking events?      -> references/recommended-events.md
Creating business-specific custom events?   -> references/custom-events.md
Making parameters appear in reports?        -> references/custom-dimensions.md
Implementing User ID / cross-device?        -> references/user-tracking.md
Building audiences for remarketing?         -> references/audiences.md
Analysing data in GA4 reports?              -> references/reporting.md
Exporting to BigQuery for SQL analysis?     -> references/bigquery.md
Installing via gtag.js directly?            -> references/gtag.md
Setting up GA4 in Google Tag Manager?       -> references/gtm-integration.md
Sending events from server/backend?         -> references/measurement-protocol.md
Testing and debugging implementation?       -> references/debugview.md
Implementing GDPR/Consent Mode?             -> references/privacy.md
Configuring Admin settings?                 -> references/data-management.md
```

## Core Concepts

### Event-Based Model

GA4 tracks everything as events in four categories:

| Category | Description | Examples |
|----------|-------------|----------|
| Automatic | Fire without configuration | session_start, first_visit |
| Enhanced Measurement | Toggle on/off in settings | scroll, click, file_download |
| Recommended | Google-defined with standard parameters | purchase, login, sign_up |
| Custom | Business-specific tracking | demo_requested, trial_started |

### Key Limits

| Limit | Value |
|-------|-------|
| Distinct event names | 500 per app stream (no limit for web) |
| Parameters per event | 25 |
| Event name length | 40 characters |
| Parameter name/value length | 40 / 100 characters (page_location 1,000) |
| Custom dimensions (event/user/item) | 50 / 25 / 10 |
| Audiences per property | 100 |

### Measurement ID

- Format: `G-XXXXXXXXXX` (G- prefix + 10 alphanumeric characters)
- Location: Admin -> Data Streams -> Web Stream
- Used in: gtag.js config, GTM tags, Measurement Protocol

## Common Workflows

### Ecommerce Tracking

1. Review [recommended events](references/recommended-events.md) for the purchase funnel: view_item -> add_to_cart -> begin_checkout -> purchase
2. Structure items array (required: item_id OR item_name; recommended: price, quantity, item_category)
3. Test with [DebugView](references/debugview.md), then register custom item parameters as [custom dimensions](references/custom-dimensions.md)

### Cross-Device Tracking

1. Implement [User ID](references/user-tracking.md) and configure Reporting Identity (Admin -> Data Settings)
2. Set [user properties](references/custom-dimensions.md) and build [cross-device audiences](references/audiences.md)

### GDPR Compliance

1. Set up [Consent Mode](references/privacy.md) with default denied state
2. Integrate with CMP (OneTrust, Cookiebot, etc.), update consent on user acceptance
3. Test consent implementation with [DebugView](references/debugview.md)

### Custom Reports

1. Understand available data in [reporting](references/reporting.md)
2. Register custom parameters as [dimensions](references/custom-dimensions.md), create Explorations
3. For unsampled data, export to [BigQuery](references/bigquery.md)

## Best Practices

- **Naming:** Use snake_case, be descriptive and action-oriented, keep under 40 characters, avoid generic names
- **Implementation order:** Enhanced Measurement -> recommended events -> custom events -> custom dimensions
- **Data quality:** Separate test/production properties, set up internal traffic filters from day one, document all custom events, audit regularly with DebugView, export to BigQuery for backup
