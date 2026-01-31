# GA4 Events Fundamentals

Comprehensive guide to GA4 event architecture including event types, parameters, scopes, and naming conventions.

## Overview

Google Analytics 4 uses an event-based architecture where every user interaction is tracked as an event. Understanding GA4's event structure, parameter system, and scoping model is fundamental to successful implementation.

## Event-Based Model

Unlike Universal Analytics (session-based), GA4 tracks everything as events:

- Page views are events
- Clicks are events
- Purchases are events
- Custom interactions are events

Each event has a name and optional parameters providing context.

## Four Event Categories

### 1. Automatically Collected Events

Events that fire without additional configuration once GA4 is installed.

| Event | Description | When Fired |
|-------|-------------|------------|
| session_start | Session begins | First event in session |
| first_visit | User's first visit | First ever session |
| user_engagement | Page in focus | After 1+ second focused |
| page_view | Page loads | With Enhanced Measurement |

These events cannot be disabled and always fire when conditions are met.

### 2. Enhanced Measurement Events

Automatically tracked interactions that can be toggled on/off in GA4 settings.

| Event | Trigger | Configuration |
|-------|---------|---------------|
| scroll | 90% vertical scroll depth | Data Stream settings |
| click | Outbound link clicks | Data Stream settings |
| file_download | PDF, DOC, ZIP, etc. | Data Stream settings |
| video_start | YouTube video starts | Requires JS API |
| video_progress | 10%, 25%, 50%, 75% | Requires JS API |
| video_complete | Video finishes | Requires JS API |
| view_search_results | Site search performed | Query parameter config |
| form_start | First form interaction | Data Stream settings |
| form_submit | Form submission | Data Stream settings |

**Enabling/Disabling:**
Admin -> Data Streams -> Stream -> Enhanced Measurement (gear icon)

### 3. Recommended Events

Google-defined event names with standardised parameters for consistency.

**Engagement Events:**
- login (method parameter)
- sign_up (method parameter)
- search (search_term parameter)
- share (method, content_type parameters)

**Monetisation Events:**
- purchase (transaction_id, value, currency, items)
- add_to_cart (items, value, currency)
- remove_from_cart (items)
- begin_checkout (items, value, currency)
- add_payment_info (payment_type)
- add_shipping_info (shipping_tier)
- refund (transaction_id, value, items)

**Content Events:**
- view_item (items)
- view_item_list (items, item_list_id)
- select_item (items)
- view_promotion (promotion_id, promotion_name)
- select_promotion (promotion_id, promotion_name)

### 4. Custom Events

Business-specific events created for unique tracking needs.

**Examples:**
- video_tutorial_watched
- whitepaper_downloaded
- demo_requested
- pricing_calculator_used
- support_ticket_created

## Event Structure

Every GA4 event consists of:

```
Event
├── event_name (required, max 40 chars)
├── event_parameters (optional, max 25 per event)
│   ├── parameter_name: value
│   ├── parameter_name: value
│   └── ...
├── event_timestamp (automatic)
└── user_information (automatic)
```

**Example Event:**
```javascript
gtag('event', 'purchase', {
  'transaction_id': 'TXN_12345',
  'value': 99.99,
  'currency': 'USD',
  'items': [
    {
      'item_id': 'SKU_001',
      'item_name': 'Blue T-Shirt',
      'price': 29.99,
      'quantity': 2
    }
  ]
});
```

## Parameter Scopes

Parameters apply at different scopes depending on their purpose.

### Event Scope

Applies to a single event occurrence only.

**Use for:** Event-specific information
**Lifespan:** That specific event
**Examples:** button_name, form_id, video_title

```javascript
gtag('event', 'button_click', {
  'button_name': 'Subscribe',      // Event-scoped
  'button_location': 'header',     // Event-scoped
  'button_id': 'btn_subscribe_01'  // Event-scoped
});
```

### User Scope

Applies to all events from that user during the session.

**Use for:** User attributes that persist
**Lifespan:** Session (until cleared)
**Examples:** subscription_tier, customer_segment, loyalty_level

```javascript
gtag('set', 'user_properties', {
  'subscription_tier': 'premium',      // User-scoped
  'customer_lifetime_value': 5000,     // User-scoped
  'preferred_language': 'en'           // User-scoped
});
```

### Item Scope

Applies to individual items in ecommerce events.

**Use for:** Product-specific information
**Lifespan:** That transaction only
**Examples:** item_color, item_size, supplier_name

```javascript
gtag('event', 'purchase', {
  'items': [
    {
      'item_id': 'SKU_123',
      'item_name': 'Blue T-Shirt',
      'item_color': 'blue',    // Item-scoped
      'item_size': 'large',    // Item-scoped
      'supplier': 'Vendor A'   // Item-scoped
    }
  ]
});
```

## Event and Parameter Limits

### Property Limits

| Limit | Standard GA4 | GA4 360 |
|-------|-------------|---------|
| Distinct event names | 500 | 2,000 |
| Event-scoped dimensions | 50 | 125 |
| User-scoped dimensions | 25 | 100 |
| Item-scoped dimensions | 10 | 25 |
| Custom metrics | 50 | 125 |
| Calculated metrics | 5 | 50 |

### Per-Event Limits

| Limit | Value |
|-------|-------|
| Parameters per event | 25 |
| Event name length | 40 characters |
| Parameter name length | 40 characters |
| Parameter value length | 100 characters |
| Items array size | 27 items |

### Special Parameter Limits

| Parameter | Max Length |
|-----------|------------|
| page_title | 300 characters |
| page_referrer | 420 characters |
| page_location | 1,000 characters |

## Event Naming Conventions

### Best Practices

- Use snake_case (lowercase with underscores)
- Be descriptive and action-oriented
- Start with verb when possible
- Keep under 40 characters
- Avoid generic names

### Naming Pattern

```
[action]_[object]_[context]

Examples:
- video_tutorial_started
- whitepaper_downloaded
- demo_request_submitted
- pricing_calculator_used
```

### Good Examples

| Event Name | Purpose |
|------------|---------|
| video_tutorial_watched | User completed video |
| product_comparison_viewed | User compared products |
| trial_signup_completed | User signed up for trial |
| support_ticket_created | User created support issue |

### Bad Examples

| Event Name | Problem |
|------------|---------|
| event1 | Too generic |
| click | Not descriptive |
| MyCustomEvent | Wrong case (not snake_case) |
| data | Meaningless |
| very_long_descriptive_event_name_that_exceeds_limits | Too long |

## Reserved Event Names

Do not use these names (reserved by Google):

- ad_activeview
- ad_click
- ad_exposure
- ad_impression
- ad_query
- adunit_exposure
- app_clear_data
- app_install
- app_update
- app_remove
- error
- first_open
- first_visit
- in_app_purchase
- notification_dismiss
- notification_foreground
- notification_open
- notification_receive
- os_update
- screen_view
- session_start
- user_engagement

## Reserved Parameter Names

Do not use these parameter names:

- firebase_conversion
- Parameters starting with:
  - google_
  - ga_
  - firebase_

## Common Event Parameters

### Standard Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| value | Number | Monetary value |
| currency | String | ISO currency code (USD, EUR) |
| transaction_id | String | Unique transaction ID |
| items | Array | Product objects |
| method | String | Login/signup method |
| search_term | String | User search query |

### Automatically Collected Parameters

These are collected automatically with each event:

- page_location
- page_referrer
- page_title
- language
- screen_resolution
- engagement_time_msec

## Accessing Event Data

### DebugView (Real-time)

- Location: Admin -> DebugView
- Shows live event stream
- Click event to see parameters
- Best for testing

### Realtime Reports (30 minutes)

- Location: Reports -> Realtime
- Event count by name
- Active users
- Geographic location

### Standard Reports (24hr+ delay)

- Location: Reports -> Engagement -> Events
- All event activity
- Event counts and trends
- Parameter breakdown (if registered as dimensions)

## Implementation Examples

### Simple Event

```javascript
gtag('event', 'button_click', {
  'button_name': 'Subscribe',
  'button_location': 'header'
});
```

### Form Submission

```javascript
gtag('event', 'form_submit', {
  'form_name': 'Contact Form',
  'form_id': 'contact-form',
  'form_destination': '/thank-you'
});
```

### Video Engagement

```javascript
gtag('event', 'video_watched', {
  'video_title': 'Getting Started Guide',
  'video_id': 'VID_001',
  'video_duration': 180,
  'video_percent': 100
});
```

### Purchase

```javascript
gtag('event', 'purchase', {
  'transaction_id': 'TXN_' + Date.now(),
  'value': 149.99,
  'currency': 'USD',
  'tax': 10.00,
  'shipping': 5.99,
  'items': [
    {
      'item_id': 'SKU_123',
      'item_name': 'Premium Widget',
      'item_category': 'Electronics',
      'price': 149.99,
      'quantity': 1
    }
  ]
});
```

## Next Steps

After understanding event fundamentals:

1. Review recommended events for your use case
2. Design custom events for business-specific tracking
3. Register parameters as custom dimensions
4. Implement via gtag.js or GTM
5. Test with DebugView
