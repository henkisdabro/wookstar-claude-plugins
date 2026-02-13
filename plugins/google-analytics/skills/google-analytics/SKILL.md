---
name: google-analytics
description: Comprehensive Google Analytics 4 guide covering property setup, events, custom events, recommended events, custom dimensions, user tracking, audiences, reporting, BigQuery integration, gtag.js implementation, GTM integration, Measurement Protocol, DebugView, privacy compliance, and data management. Use when working with GA4 implementation, tracking, analysis, or any GA4-related tasks.
---

# Google Analytics 4 Complete Guide

## Overview

Google Analytics 4 (GA4) is Google's event-based analytics platform for measuring user interactions across websites and applications. Every user interaction is tracked as an event with associated parameters, providing flexible cross-platform measurement.

## When to Use This Skill

Invoke this skill for any GA4-related task:

- Setting up GA4 properties, data streams, and Measurement IDs
- Installing GA4 via gtag.js, GTM, or CMS plugins
- Implementing event tracking (automatic, recommended, custom, ecommerce)
- Creating custom dimensions, audiences, and reports
- Exporting data to BigQuery for SQL analysis
- Server-side tracking via Measurement Protocol
- User ID and cross-device tracking
- Privacy compliance, Consent Mode, and GDPR/CCPA
- Testing and debugging with DebugView

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
| Event names per property | 500 distinct |
| Parameters per event | 25 |
| Event name length | 40 characters |
| Parameter name/value length | 40 / 100 characters |
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
