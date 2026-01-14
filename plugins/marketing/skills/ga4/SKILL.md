---
name: ga4
description: Comprehensive Google Analytics 4 guide covering property setup, events, custom events, recommended events, custom dimensions, user tracking, audiences, reporting, BigQuery integration, gtag.js implementation, GTM integration, Measurement Protocol, DebugView, privacy compliance, and data management. Use when working with GA4 implementation, tracking, analysis, or any GA4-related tasks.
---

# Google Analytics 4 Complete Guide

## Overview

Google Analytics 4 (GA4) is Google's event-based analytics platform for measuring user interactions across websites and applications. This comprehensive skill provides guidance on all aspects of GA4 - from initial property setup through advanced analysis, implementation methods, and compliance.

GA4 uses an event-based data model where every user interaction is tracked as an event with associated parameters. This differs from the session-based model of Universal Analytics, providing more flexibility and cross-platform measurement capabilities.

## When to Use This Skill

Invoke this skill for any GA4-related task, including:

**Setup and Configuration:**
- Creating GA4 properties and data streams
- Configuring Measurement IDs (G-XXXXXXXXXX)
- Setting up data retention and collection settings
- Managing property access and permissions

**Implementation:**
- Installing GA4 via gtag.js, GTM, or CMS plugins
- Implementing event tracking (automatic, recommended, custom)
- Setting up ecommerce tracking
- Configuring cross-domain measurement

**Events and Tracking:**
- Understanding event architecture and parameters
- Implementing recommended events (purchase, login, sign_up)
- Creating custom events for business-specific tracking
- Working with event parameters and limits

**Analysis and Reporting:**
- Using standard reports and Explorations
- Building funnel and path analyses
- Creating audiences and segments
- Exporting data to BigQuery

**Advanced Topics:**
- Measurement Protocol for server-side tracking
- User ID and cross-device tracking
- Privacy compliance and Consent Mode
- DebugView testing and validation

## Quick Start

### 1. Create GA4 Property

1. Navigate to analytics.google.com
2. Admin -> Create -> Property
3. Enter property name, timezone, currency
4. Create web data stream
5. Note your Measurement ID (G-XXXXXXXXXX)

### 2. Install Tracking (Choose One Method)

**Option A: Google Tag Manager (Recommended)**
```
1. Install GTM container on website
2. Create Google Tag with GA4 Measurement ID
3. Trigger: Initialisation - All Pages
4. Publish container
```

**Option B: gtag.js Direct**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 3. Verify Installation

1. Enable Google Analytics Debugger extension
2. Admin -> DebugView
3. Confirm events appearing: session_start, page_view
4. Check Realtime reports for active users

### 4. Send Custom Events

```javascript
gtag('event', 'button_click', {
  'button_name': 'Subscribe',
  'button_location': 'header'
});
```

## Decision Tree: Which Reference Do I Need?

```
What are you trying to do?

Setting up GA4 for the first time?
  -> references/setup.md

Understanding how events work?
  -> references/events-fundamentals.md

Implementing standard tracking events?
  -> references/recommended-events.md

Creating business-specific custom events?
  -> references/custom-events.md

Making parameters appear in reports?
  -> references/custom-dimensions.md

Implementing User ID / cross-device tracking?
  -> references/user-tracking.md

Building audiences for remarketing?
  -> references/audiences.md

Analysing data in GA4 reports?
  -> references/reporting.md

Exporting to BigQuery for SQL analysis?
  -> references/bigquery.md

Installing via gtag.js directly?
  -> references/gtag.md

Setting up GA4 in Google Tag Manager?
  -> references/gtm-integration.md

Sending events from server/backend?
  -> references/measurement-protocol.md

Testing and debugging implementation?
  -> references/debugview.md

Implementing GDPR/Consent Mode?
  -> references/privacy.md

Configuring Admin settings?
  -> references/data-management.md
```

## Core Concepts

### Event-Based Model

GA4 tracks everything as events. Four categories:

| Category | Description | Examples |
|----------|-------------|----------|
| Automatic | Fire without configuration | session_start, first_visit |
| Enhanced Measurement | Toggle on/off in settings | scroll, click, file_download |
| Recommended | Google-defined with standard parameters | purchase, login, sign_up |
| Custom | Business-specific tracking | demo_requested, trial_started |

### Key Limits and Constraints

| Limit | Value |
|-------|-------|
| Event names per property | 500 distinct |
| Parameters per event | 25 |
| Event name length | 40 characters |
| Parameter name length | 40 characters |
| Parameter value length | 100 characters |
| Custom dimensions (event-scoped) | 50 |
| Custom dimensions (user-scoped) | 25 |
| Custom dimensions (item-scoped) | 10 |
| Audiences per property | 100 |

### Measurement ID Format

- Format: G-XXXXXXXXXX (G- prefix + 10 alphanumeric characters)
- Location: Admin -> Data Streams -> Web Stream
- Used in: gtag.js config, GTM tags, Measurement Protocol

## Topic Overview

### Setup and Installation
**Reference:** [references/setup.md](references/setup.md)

Create GA4 accounts, properties, and data streams. Covers account hierarchy, property configuration, data stream setup for web/iOS/Android, and initial configuration settings.

### Events Fundamentals
**Reference:** [references/events-fundamentals.md](references/events-fundamentals.md)

Understand GA4's event-based architecture. Covers the four event categories, event structure, parameter scopes (event/user/item), naming conventions, and limits.

### Custom Events
**Reference:** [references/custom-events.md](references/custom-events.md)

Create business-specific events beyond recommended events. Covers naming conventions, parameter design, industry patterns (SaaS, education, media), and implementation examples.

### Recommended Events
**Reference:** [references/recommended-events.md](references/recommended-events.md)

Implement Google-defined recommended events. Covers engagement events (login, sign_up), monetisation events (purchase, add_to_cart), and the items array structure for ecommerce.

### Custom Dimensions
**Reference:** [references/custom-dimensions.md](references/custom-dimensions.md)

Transform event parameters into reportable dimensions. Covers registration workflow, scope selection (event/user/item), custom metrics, calculated metrics, and troubleshooting.

### User Tracking
**Reference:** [references/user-tracking.md](references/user-tracking.md)

Implement User ID and cross-device tracking. Covers User ID setup, user properties, Reporting Identity options, cross-domain tracking, and data deletion.

### Audiences
**Reference:** [references/audiences.md](references/audiences.md)

Create segments for analysis and remarketing. Covers audience conditions, predictive audiences, sequence conditions, membership duration, and Google Ads export.

### Reporting
**Reference:** [references/reporting.md](references/reporting.md)

Analyse data using standard reports and Explorations. Covers report types, exploration techniques (funnel, path, cohort), segments, comparisons, and attribution models.

### BigQuery Export
**Reference:** [references/bigquery.md](references/bigquery.md)

Export raw event data to BigQuery for advanced analysis. Covers linking setup, table schema, SQL query patterns, UNNEST operations, and cost optimisation.

### gtag.js Implementation
**Reference:** [references/gtag.md](references/gtag.md)

Implement GA4 directly using gtag.js without GTM. Covers installation, gtag commands (config, event, set), common patterns, and framework integration.

### GTM Integration
**Reference:** [references/gtm-integration.md](references/gtm-integration.md)

Implement GA4 using Google Tag Manager. Covers configuration tags, event tags, triggers, variables, data layer integration, and Preview mode testing.

### Measurement Protocol
**Reference:** [references/measurement-protocol.md](references/measurement-protocol.md)

Send events server-side using the Measurement Protocol API. Covers authentication, request format, validation, Python/Node.js/PHP examples, and best practices.

### DebugView
**Reference:** [references/debugview.md](references/debugview.md)

Test and validate GA4 implementation. Covers enabling debug mode, reading DebugView interface, validation workflows, and troubleshooting common issues.

### Privacy Compliance
**Reference:** [references/privacy.md](references/privacy.md)

Implement GDPR/CCPA compliance. Covers Consent Mode v2, consent parameters, regional settings, data deletion, and integration with consent management platforms.

### Data Management
**Reference:** [references/data-management.md](references/data-management.md)

Configure GA4 Admin settings. Covers data retention, data filters, user permissions, property settings, enhanced measurement, and key events (conversions).

## Common Workflows

### Implementing Ecommerce Tracking

1. **Review recommended events:** [references/recommended-events.md](references/recommended-events.md)
2. **Implement the purchase funnel:**
   - view_item -> add_to_cart -> begin_checkout -> purchase
3. **Structure items array correctly:**
   - Required: item_id OR item_name
   - Recommended: price, quantity, item_category
4. **Test with DebugView:** [references/debugview.md](references/debugview.md)
5. **Register custom item parameters:** [references/custom-dimensions.md](references/custom-dimensions.md)

### Setting Up Cross-Device Tracking

1. **Implement User ID:** [references/user-tracking.md](references/user-tracking.md)
2. **Configure Reporting Identity:** Admin -> Data Settings -> Reporting Identity
3. **Set user properties:** [references/custom-dimensions.md](references/custom-dimensions.md)
4. **Build cross-device audiences:** [references/audiences.md](references/audiences.md)

### Implementing GDPR Compliance

1. **Set up Consent Mode:** [references/privacy.md](references/privacy.md)
2. **Configure default consent state (denied)**
3. **Integrate with CMP (OneTrust, Cookiebot, etc.)**
4. **Update consent on user acceptance**
5. **Test consent implementation:** [references/debugview.md](references/debugview.md)

### Building Custom Reports

1. **Understand available data:** [references/reporting.md](references/reporting.md)
2. **Register custom parameters as dimensions:** [references/custom-dimensions.md](references/custom-dimensions.md)
3. **Create Explorations for custom analysis**
4. **For unsampled data, export to BigQuery:** [references/bigquery.md](references/bigquery.md)

## Best Practices

### Naming Conventions

- Use snake_case for event names: `video_tutorial_watched`
- Be descriptive and action-oriented
- Keep under 40 characters
- Avoid generic names (event1, click, data)

### Implementation Strategy

1. Start with Enhanced Measurement (automatic events)
2. Add recommended events for standard tracking
3. Create custom events only when needed
4. Register parameters as custom dimensions for reporting
5. Test thoroughly with DebugView before production

### Data Quality

- Create separate properties for test/production
- Set up internal traffic filters from day one
- Document all custom events and parameters
- Regularly audit implementation with DebugView
- Export to BigQuery for data backup

## References

| Topic | File |
|-------|------|
| Property Setup | [references/setup.md](references/setup.md) |
| Events Fundamentals | [references/events-fundamentals.md](references/events-fundamentals.md) |
| Custom Events | [references/custom-events.md](references/custom-events.md) |
| Recommended Events | [references/recommended-events.md](references/recommended-events.md) |
| Custom Dimensions | [references/custom-dimensions.md](references/custom-dimensions.md) |
| User Tracking | [references/user-tracking.md](references/user-tracking.md) |
| Audiences | [references/audiences.md](references/audiences.md) |
| Reporting | [references/reporting.md](references/reporting.md) |
| BigQuery Export | [references/bigquery.md](references/bigquery.md) |
| gtag.js Implementation | [references/gtag.md](references/gtag.md) |
| GTM Integration | [references/gtm-integration.md](references/gtm-integration.md) |
| Measurement Protocol | [references/measurement-protocol.md](references/measurement-protocol.md) |
| DebugView Testing | [references/debugview.md](references/debugview.md) |
| Privacy Compliance | [references/privacy.md](references/privacy.md) |
| Data Management | [references/data-management.md](references/data-management.md) |
