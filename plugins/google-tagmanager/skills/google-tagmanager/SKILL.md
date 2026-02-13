---
name: google-tagmanager
description: Comprehensive Google Tag Manager guide covering container setup, tags, triggers, variables, data layer, debugging, custom templates, and API automation. Use when working with GTM implementation, configuration, optimisation, troubleshooting, or any GTM-related tasks.
---

# Google Tag Manager

## Overview

Expertise for Google Tag Manager (GTM) covering container setup, tag configuration, triggers, variables, data layer implementation, debugging, custom templates, and API automation. See the reference files below for detailed guidance on each topic.

## When to Use This Skill

Invoke when setting up or configuring GTM containers, tags, triggers, or variables; implementing the data layer; debugging with Preview mode or Tag Assistant; building custom templates; automating via the REST API; or optimising container performance and consent management.

## Quick Start

1. Create a GTM account at [tagmanager.google.com](https://tagmanager.google.com)
2. Create a container (Web, iOS, Android, or Server)
3. Install the container snippet - see [setup.md](references/setup.md)
4. Configure tags, triggers, and variables
5. Test in Preview mode - see [debugging.md](references/debugging.md)
6. Publish

### Basic Tag Configuration

```javascript
// Example: GA4 Configuration Tag
Tag Type: Google Analytics: GA4 Configuration
Measurement ID: G-XXXXXXXXXX
Trigger: All Pages
```

See [tags.md](references/tags.md) for comprehensive tag documentation.

### Data Layer Push

```javascript
window.dataLayer = window.dataLayer || [];
dataLayer.push({
  'event': 'custom_event',
  'category': 'engagement',
  'action': 'button_click',
  'label': 'CTA Button'
});
```

See [datalayer.md](references/datalayer.md) for data layer patterns.

## Core Concepts

**Tags** are snippets of code that execute on your site (e.g., GA4, Google Ads, Facebook Pixel).

**Triggers** define when tags fire (e.g., page views, clicks, form submissions).

**Variables** capture dynamic values for use in tags and triggers (e.g., page URL, click text, data layer values).

```
User Action --> Trigger Fires --> Tag Executes --> Data Sent
     ^                                    |
     |                                    v
     +--- Variables provide values -------+
```

## Common Workflows

### GA4 Page View Tracking

1. Create GA4 Configuration tag with Measurement ID
2. Set trigger to "All Pages"
3. Test in Preview mode, verify in GA4 DebugView
4. Publish

### Form Submission Tracking

1. Create Form Submission trigger
2. Create GA4 Event tag (`form_submit`) with form ID/name as parameter
3. Test in Preview mode and publish

### E-commerce Tracking

1. Implement data layer with e-commerce events - see [datalayer.md](references/datalayer.md)
2. Create data layer variables and GA4 Event tags for each event
3. Map variables to event parameters
4. Test complete purchase flow and publish

### Debug Tag Not Firing

1. Enable Preview mode and perform the action
2. Check "Tags Not Fired" section and review trigger conditions
3. Verify data layer values, fix conditions, and retest
4. See [debugging.md](references/debugging.md) for detailed workflows

## Technical Constraints

**ES5 Required**: Custom JavaScript Variables and Custom HTML Tags must use ES5 syntax (`var`, `function()`, string concatenation). Custom Templates support some ES6. See [best-practices.md](references/best-practices.md) for details and workarounds.

**RE2 Regex**: GTM uses RE2 regex - no lookahead, lookbehind, or backreferences. See [best-practices.md](references/best-practices.md) for supported patterns.

## Quick Reference

### Built-in Variables to Enable

- Page URL, Page Path, Page Hostname
- Click Element, Click Classes, Click ID, Click URL, Click Text
- Form Element, Form ID, Form Classes
- Scroll Depth Threshold, Scroll Direction

### Common Trigger Types

Page View, Click (All Elements / Just Links), Form Submission, Custom Event, History Change (SPAs), Timer, Scroll Depth

### Essential Data Layer Events

```javascript
// Page view
dataLayer.push({ 'event': 'page_view' });

// User login
dataLayer.push({ 'event': 'login', 'method': 'Google' });

// Purchase
dataLayer.push({
  'event': 'purchase',
  'ecommerce': {
    'transaction_id': 'T12345',
    'value': 99.99,
    'currency': 'AUD',
    'items': [...]
  }
});
```

## Reference Files

| Topic | Reference File |
|-------|----------------|
| Container setup | [setup.md](references/setup.md) |
| Tag configuration | [tags.md](references/tags.md) |
| Trigger configuration | [triggers.md](references/triggers.md) |
| Variable configuration | [variables.md](references/variables.md) |
| Data layer | [datalayer.md](references/datalayer.md) |
| Debugging | [debugging.md](references/debugging.md) |
| Best practices, naming, performance, security | [best-practices.md](references/best-practices.md) |
| Custom templates | [custom-templates.md](references/custom-templates.md) |
| API automation | [api.md](references/api.md) |

## External Resources

- [GTM Help Center](https://support.google.com/tagmanager)
- [GTM Developer Documentation](https://developers.google.com/tag-platform/tag-manager)
- [GA4 Implementation Guide](https://developers.google.com/analytics/devguides/collection/ga4)
- [GTM API Reference](https://developers.google.com/tag-platform/tag-manager/api/v2)
