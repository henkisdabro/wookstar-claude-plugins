# GA4 Custom Dimensions and Metrics

Expert guidance for registering event parameters as custom dimensions and creating custom metrics.

## Overview

Custom dimensions and metrics transform event parameters into reportable fields in GA4. All custom parameters remain invisible in reports until registered. Registration requires understanding scope types, following naming conventions, and accounting for processing delays.

## Understanding Scopes

GA4 uses three scopes that determine what data the parameter applies to:

### Event Scope

**Applies to:** Single event occurrence
**Lifespan:** That specific event only
**Use for:** Event-specific information

```javascript
gtag('event', 'button_click', {
  'button_name': 'Subscribe',        // Event-scoped
  'button_location': 'header',       // Event-scoped
  'button_id': 'btn_subscribe_01'    // Event-scoped
});
```

**Examples:** form_name, video_title, button_name, page_section

### User Scope

**Applies to:** All events from that user
**Lifespan:** Session persistence (until cleared)
**Use for:** User attributes that persist

```javascript
gtag('set', 'user_properties', {
  'subscription_tier': 'premium',         // User-scoped
  'customer_lifetime_value': 5000,        // User-scoped
  'preferred_language': 'en'              // User-scoped
});
```

**Examples:** subscription_tier, customer_segment, company_size, signup_date

### Item Scope

**Applies to:** Individual items in ecommerce events
**Lifespan:** That transaction only
**Use for:** Product-specific information

```javascript
gtag('event', 'purchase', {
  'items': [
    {
      'item_id': 'SKU_123',
      'item_name': 'Blue T-Shirt',
      'item_color': 'blue',         // Item-scoped
      'item_size': 'large',         // Item-scoped
      'supplier': 'Vendor A'        // Item-scoped
    }
  ]
});
```

**Examples:** item_color, item_size, supplier, product_quality

## Scope Selection Matrix

| Question | Event Scope | User Scope | Item Scope |
|----------|-------------|------------|------------|
| Applies to one event? | Yes | No | No |
| Applies to all user events? | No | Yes | No |
| Applies to products? | No | No | Yes |
| Changes per interaction? | Yes | Rarely | Per item |

## Dimension Limits

### Standard GA4

| Dimension Type | Limit |
|----------------|-------|
| Event-scoped | 50 |
| User-scoped | 25 |
| Item-scoped | 10 |
| Custom metrics | 50 |
| Calculated metrics | 5 |

### GA4 360

| Dimension Type | Limit |
|----------------|-------|
| Event-scoped | 125 |
| User-scoped | 100 |
| Item-scoped | 25 |
| Custom metrics | 125 |
| Calculated metrics | 50 |

## Registration Workflow

### Step 1: Send Parameter in Event

First, ensure the parameter is being sent in events:

**Event-scoped parameter:**
```javascript
gtag('event', 'video_watched', {
  'video_title': 'Getting Started Guide',
  'video_duration': 180,
  'video_quality': 'hd'
});
```

**User-scoped parameter (user property):**
```javascript
gtag('set', 'user_properties', {
  'customer_segment': 'enterprise',
  'subscription_tier': 'premium'
});
```

**Item-scoped parameter:**
```javascript
gtag('event', 'purchase', {
  'items': [{
    'item_id': 'SKU_123',
    'supplier': 'Vendor A'  // Custom item parameter
  }]
});
```

### Step 2: Verify in DebugView

Before registration, confirm the parameter appears:

1. Admin -> DebugView
2. Enable Google Analytics Debugger extension
3. Trigger the event
4. Click event in DebugView
5. See parameter in event details
6. Note exact parameter name (case-sensitive)

### Step 3: Register as Custom Dimension

Navigate to Admin -> Data Display -> Custom Definitions:

1. Click "Create custom dimension"
2. Fill form:
   - **Dimension name:** Human-friendly name (e.g., "Video Quality")
   - **Scope:** Select Event, User, or Item
   - **Description:** Optional notes
   - **Event parameter / User property:** Exact name from code (case-sensitive)
3. Click Save

### Step 4: Wait for Data Population

**Critical:** Custom dimensions don't appear immediately.

- **Wait time:** 24-48 hours
- **Historical data:** Retroactively processed
- **New data:** Starts populating
- **Do not** create duplicate dimensions while waiting

### Step 5: Use in Reports

After 24-48 hours:

- **Standard Reports:** Add as secondary dimension
- **Explorations:** Select from dimension picker
- **Filters/Segments:** Filter by dimension values
- **Google Ads:** Export for audience building

## Creating Custom Metrics

### Standard Custom Metrics

For numerical tracking beyond standard metrics:

```javascript
gtag('event', 'video_watched', {
  'video_title': 'GA4 Tutorial',
  'minutes_watched': 45,      // Custom metric
  'completion_rate': 85       // Custom metric
});
```

**Registration:**

1. Admin -> Data Display -> Custom Definitions
2. Click "Create custom metric"
3. Fill form:
   - **Metric name:** Display name (e.g., "Minutes Watched")
   - **Scope:** Event (only option)
   - **Event parameter:** Parameter name (minutes_watched)
   - **Unit of measurement:** Standard, Currency, Distance, Time (optional)
4. Save and wait 24-48 hours

### Calculated Metrics

Create metrics derived from existing metrics:

**Examples:**
- Revenue per User = revenue / users
- Conversion Rate = conversions / sessions * 100
- Average Order Value = revenue / purchases

**Creation:**

1. Admin -> Data Display -> Custom Definitions
2. Click "Create custom metric"
3. Metric Name: "Revenue per User"
4. Type: Calculated
5. Formula: `revenue / users`
6. Save (no processing delay for calculated metrics)

## Common Registration Examples

### Event-Scoped Dimensions

| Dimension Name | Parameter Name | Use Case |
|----------------|----------------|----------|
| Video Title | video_title | Track video performance |
| Form Name | form_name | Analyse form submissions |
| Button Location | button_location | Track CTA placement |
| Content Type | content_type | Categorise content |
| Error Message | error_message | Debug issues |

### User-Scoped Dimensions

| Dimension Name | User Property | Use Case |
|----------------|---------------|----------|
| Subscription Tier | subscription_tier | Segment by plan |
| Customer Segment | customer_segment | Analyse cohorts |
| Company Size | company_size | B2B analysis |
| Account Age | account_age_days | Retention analysis |
| Preferred Language | preferred_language | Localisation |

### Item-Scoped Dimensions

| Dimension Name | Item Parameter | Use Case |
|----------------|----------------|----------|
| Item Colour | item_color | Product analysis |
| Item Size | item_size | Inventory insights |
| Supplier | supplier | Vendor performance |
| Material | material | Product attributes |
| Stock Status | stock_status | Availability analysis |

## Troubleshooting

### Dimension Not Appearing After 48 Hours

**Possible causes:**
- Parameter name mismatch (case-sensitive)
- Events not sending parameter
- Wrong scope selected
- Low data volume (threshold not met)

**Solutions:**
1. Verify exact parameter name in DebugView
2. Confirm events are sending parameter
3. Check scope matches how parameter is sent
4. Wait for more data volume

### Parameter in DebugView But Not Reports

**Expected behaviour for first 24-48 hours**

**If persists:**
1. Check Realtime reports (available sooner)
2. Verify at least 1000 events with parameter
3. Check data retention settings
4. Confirm dimension registered correctly

### Dimension Quota Exceeded

**Cause:** Hit maximum dimension limit

**Solutions:**
1. Delete unused dimensions
2. Combine similar dimensions
3. Plan essential dimensions
4. Consider GA4 360 for higher limits

### Multiple Users Same Dimension Value

**For user-scoped:** Expected - applies to all user events
**For event-scoped:** Expected if same value sent
**For item-scoped:** Expected across products

## Best Practices

### Planning Strategy

1. **Audit existing parameters** - What are you already sending?
2. **Prioritise dimensions** - Which are essential for reporting?
3. **Reserve capacity** - Don't use all 50 immediately
4. **Document dimensions** - Maintain registry of all dimensions

### Naming Conventions

**Parameter names:**
- snake_case
- Under 40 characters
- Descriptive and consistent

**Dimension display names:**
- Title Case
- Clear and descriptive
- Match parameter purpose

### Documentation Template

```markdown
## Custom Dimension: Video Title

**Parameter Name:** video_title
**Scope:** Event
**Description:** Title of video watched by user
**Events Using:** video_start, video_complete, video_progress
**Registration Date:** 2024-01-15
**Status:** Active

**Example Value:** "Getting Started with GA4"

**Reports Using:**
- Video Performance Exploration
- Content Engagement Dashboard
```

## Quick Reference

### Registration Checklist

- [ ] Parameter sent in events
- [ ] Verified in DebugView
- [ ] Correct scope selected
- [ ] Exact parameter name used
- [ ] Waited 24-48 hours
- [ ] Tested in Explorations

### Scope Quick Guide

| I want to track... | Use Scope |
|-------------------|-----------|
| Per-event data | Event |
| User attributes | User |
| Product attributes | Item |

### Limits Summary

| Type | Standard | 360 |
|------|----------|-----|
| Event dimensions | 50 | 125 |
| User dimensions | 25 | 100 |
| Item dimensions | 10 | 25 |
| Custom metrics | 50 | 125 |
