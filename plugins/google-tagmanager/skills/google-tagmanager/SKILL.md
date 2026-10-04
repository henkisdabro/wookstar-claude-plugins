---
name: google-tagmanager
description: Google Tag Manager implementation reference for web and server containers. Use when installing a GTM container snippet, configuring tags, triggers or variables, designing dataLayer pushes, setting up Consent Mode in GTM, debugging with Preview mode or Tag Assistant, building a custom template, setting up a server-side (sGTM) container, or automating containers through the GTM API or the bundled Stape MCP server. Do NOT use for gtag.js installs that bypass GTM, GA4 reporting or BigQuery export - use google-analytics; Adobe Launch, Tealium or other tag managers.
---

# Google Tag Manager

Pick the reference file from the table at the end and read it before answering anything beyond the basics below.

The bundled `gtm-mcp-server` is Stape's hosted GTM MCP server (a third party, not Google). Its tools can create, update and delete tags, triggers, variables and other entities, and create and publish container versions. Before calling a delete or publish action, state what will change and in which container and workspace, and let the user approve it.

## Quick Start

1. Create a GTM account at [tagmanager.google.com](https://tagmanager.google.com)
2. Create a container (Web, iOS, Android, or Server)
3. Install the container snippet - see [setup.md](references/setup.md)
4. Configure tags, triggers, and variables
5. Test in Preview mode - see [debugging.md](references/debugging.md)
6. Publish

### Basic Tag Configuration

```text
Example: Google Tag (GA4)
Tag Type: Google Tag
Tag ID: G-XXXXXXXXXX
Trigger: All Pages
```

See [tags.md](references/tags.md) for tag documentation.

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

## Common Workflows

### GA4 Page View Tracking

1. Create Google Tag with your GA4 Measurement ID (formerly the "GA4 Configuration" tag type)
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

### Consent Mode v2

Four consent types gate Google tags: `ad_storage`, `analytics_storage`, `ad_user_data` and `ad_personalization` (the last two are required for EEA/UK ad measurement and personalisation).

1. Add the CMP's template from the Community Template Gallery (or build one with the `setDefaultConsentState` / `updateConsentState` template APIs - templates call these rather than `gtag('consent', ...)`).
2. Fire it on the **Consent Initialization - All Pages** trigger so defaults (usually `denied`, optionally per region, with `wait_for_update`) are set before any other tag.
3. The CMP updates consent when the user chooses; Google tags adjust automatically. For non-Google tags, set **Additional consent checks** in each tag's Consent Settings and use the container's **Consent Overview** to confirm every tag is covered.
4. Choose basic mode (tags blocked until consent) or advanced mode (Google tags load and send cookieless pings while denied).
5. In Preview, the Consent tab for each event shows default and update states - confirm defaults appear on Consent Initialization before the first tag fires.

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

// Purchase - clear the previous ecommerce object first
dataLayer.push({ 'ecommerce': null });
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
| Server-side containers: hosting, custom domain, clients, GA4 server tag | [server-side.md](references/server-side.md) |

## External Resources

- [GTM Help Center](https://support.google.com/tagmanager)
- [GTM Developer Documentation](https://developers.google.com/tag-platform/tag-manager)
- [GA4 Implementation Guide](https://developers.google.com/analytics/devguides/collection/ga4)
- [GTM API Reference](https://developers.google.com/tag-platform/tag-manager/api/v2)
