# GA4 Google Tag Manager Integration

Expert guidance for implementing GA4 using Google Tag Manager including tags, triggers, variables, and data layer.

## Overview

Google Tag Manager (GTM) provides a powerful, no-code approach to implementing GA4 tracking. GTM centralises tag management, enables version control, and allows updates without code changes.

## Why Use GTM

| Benefit | Description |
|---------|-------------|
| No code changes | Update tracking without developers |
| Version control | Rollback to previous versions |
| Team collaboration | Multiple users, permissions |
| Testing | Preview mode before publish |
| Multiple tags | Manage all tags in one place |
| Flexibility | Complex trigger conditions |

## GTM Container Installation

### Head Snippet

Place immediately after `<head>`:

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->
```

### Body Snippet

Place immediately after `<body>`:

```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

## GA4 Configuration Tag

The base tag that initialises GA4 on all pages.

### Creating the Tag

1. GTM -> Tags -> New
2. Click "Tag Configuration"
3. Select "Google Tag"
4. Enter GA4 Measurement ID (G-XXXXXXXXXX)
5. Click "Triggering"
6. Select "Initialisation - All Pages"
7. Name tag: "GA4 - Configuration"
8. Save

### Configuration Options

| Option | Description |
|--------|-------------|
| Send page view | Auto page view on load (default: true) |
| Google Signals | Demographics, cross-device |
| User ID | Cross-device tracking |
| Debug mode | Enable DebugView |

### Adding User ID

1. Create Data Layer Variable for user_id
2. In Configuration tag, expand "Configuration Settings"
3. Add Fields to Set:
   - Field Name: user_id
   - Value: {{DL - User ID}}

## GA4 Event Tags

Send specific events to GA4.

### Creating Event Tags

1. Tags -> New
2. Tag Configuration -> Google Tag
3. Tag ID: G-XXXXXXXXXX (same as config)
4. Event Name: enter event name
5. Event Parameters: add parameters
6. Set trigger
7. Save

### Event Tag Example: Button Click

**Tag Configuration:**
- Tag Type: Google Tag
- Tag ID: G-XXXXXXXXXX
- Event Name: button_click
- Event Parameters:
  - button_name: {{Click Text}}
  - button_id: {{Click ID}}
  - button_location: header

**Trigger:**
- Trigger Type: Click - All Elements
- Fire on: Some Clicks
- Condition: Click ID equals "subscribe-btn"

### Event Tag Example: Form Submit

**Tag Configuration:**
- Tag Type: Google Tag
- Tag ID: G-XXXXXXXXXX
- Event Name: form_submit
- Event Parameters:
  - form_name: {{Form Name Variable}}
  - form_id: {{Form ID}}

**Trigger:**
- Trigger Type: Form Submission
- Fire on: Some Forms
- Condition: Form ID equals "contact-form"

### Event Tag Example: Purchase

**Tag Configuration:**
- Tag Type: Google Tag
- Tag ID: G-XXXXXXXXXX
- Event Name: purchase
- Event Parameters:
  - transaction_id: {{DL - Transaction ID}}
  - value: {{DL - Purchase Value}}
  - currency: {{DL - Currency}}
  - items: {{DL - Items}}

**Trigger:**
- Trigger Type: Custom Event
- Event Name: purchase

## GTM Triggers

### Trigger Types

| Type | Use For |
|------|---------|
| Page View | Page loads |
| DOM Ready | After DOM parsed |
| Window Loaded | After all resources |
| Click - All Elements | Any click |
| Click - Just Links | Link clicks only |
| Form Submission | Form submits |
| Custom Event | dataLayer.push events |
| Scroll Depth | Scroll percentage |
| Timer | Time-based |
| JavaScript Error | Error tracking |

### Creating Triggers

**Page View Trigger:**
1. Triggers -> New
2. Trigger Type: Page View
3. Fire on: Some Page Views
4. Condition: Page Path contains "/products"
5. Name: "Page View - Products"
6. Save

**Click Trigger:**
1. Triggers -> New
2. Trigger Type: Click - All Elements
3. Fire on: Some Clicks
4. Condition: Click ID equals "cta-button"
5. Name: "Click - CTA Button"
6. Save

**Custom Event Trigger:**
1. Triggers -> New
2. Trigger Type: Custom Event
3. Event Name: add_to_cart
4. Fire on: All Custom Events
5. Name: "CE - Add to Cart"
6. Save

## GTM Variables

### Built-in Variables

Enable in Variables section:

**Page Variables:**
- Page URL
- Page Hostname
- Page Path
- Referrer

**Click Variables:**
- Click Element
- Click Classes
- Click ID
- Click Text
- Click URL

**Form Variables:**
- Form Element
- Form Classes
- Form ID
- Form Text

### Data Layer Variables

Extract data from dataLayer.push():

**Creating Variable:**
1. Variables -> User-Defined -> New
2. Variable Type: Data Layer Variable
3. Data Layer Variable Name: exact key name
4. Name: "DL - Product ID"
5. Save

**Example:**
```javascript
dataLayer.push({
  'event': 'add_to_cart',
  'product_id': 'SKU_123',
  'product_name': 'Blue T-Shirt',
  'product_price': 29.99
});
```

Variables needed:
- DL - Product ID: `product_id`
- DL - Product Name: `product_name`
- DL - Product Price: `product_price`

### Custom JavaScript Variables

For computed values:

```javascript
function() {
  return document.title + ' | ' + window.location.pathname;
}
```

## Data Layer Integration

### What is the Data Layer

JavaScript object that holds structured data for GTM:

```javascript
window.dataLayer = window.dataLayer || [];
```

### Pushing Events

```javascript
// Simple event
dataLayer.push({
  'event': 'button_click',
  'button_name': 'Subscribe',
  'button_location': 'header'
});

// Ecommerce event
dataLayer.push({
  'event': 'purchase',
  'ecommerce': {
    'transaction_id': 'TXN_12345',
    'value': 99.99,
    'currency': 'USD',
    'items': [
      {
        'item_id': 'SKU_001',
        'item_name': 'Product Name',
        'price': 99.99,
        'quantity': 1
      }
    ]
  }
});
```

### GTM Listens for Event Key

When dataLayer.push includes `event`, GTM can trigger tags.

## Preview Mode Testing

### Enabling Preview

1. Click "Preview" (top-right in GTM)
2. Enter website URL
3. Click "Connect"
4. Tag Assistant window opens

### What to Check

**Tags Tab:**
- Which tags fired
- Which tags didn't fire
- Firing order

**Variables Tab:**
- Variable values at each event
- Data Layer contents

**Data Layer Tab:**
- All dataLayer.push calls
- Event sequence

**Errors Tab:**
- Any configuration errors
- Warning messages

### Testing Workflow

1. Enable Preview mode
2. Navigate website
3. Trigger actions (clicks, forms, purchases)
4. Verify in Tag Assistant:
   - Correct tags fire
   - Parameters populated
   - No errors

## Publishing Changes

### Process

1. Click "Submit" (top-right)
2. Enter Version Name (e.g., "GA4 Setup - January 2025")
3. Enter Version Description
4. Click "Publish"

### Best Practices

- Use descriptive version names
- Include date in version name
- Document all changes
- Test in Preview before publish
- Keep version history clean

## Common Tag Configurations

### GA4 Configuration Tag

```
Name: GA4 - Configuration
Type: Google Tag
Tag ID: G-XXXXXXXXXX
Trigger: Initialisation - All Pages
```

### GA4 Event - Button Click

```
Name: GA4 - Button Click
Type: Google Tag
Tag ID: G-XXXXXXXXXX
Event Name: button_click
Parameters:
  - button_name: {{Click Text}}
  - button_id: {{Click ID}}
Trigger: Click - CTA Buttons
```

### GA4 Event - Form Submit

```
Name: GA4 - Form Submit
Type: Google Tag
Tag ID: G-XXXXXXXXXX
Event Name: form_submit
Parameters:
  - form_name: {{DL - Form Name}}
  - form_id: {{Form ID}}
Trigger: Form Submission
```

### GA4 Event - Purchase

```
Name: GA4 - Purchase
Type: Google Tag
Tag ID: G-XXXXXXXXXX
Event Name: purchase
Parameters:
  - transaction_id: {{DL - Transaction ID}}
  - value: {{DL - Value}}
  - currency: {{DL - Currency}}
  - items: {{DL - Items}}
Trigger: CE - Purchase
```

## Troubleshooting

### Tags Not Firing

**Causes:**
- Trigger conditions not met
- Wrong variable values
- Tag paused

**Solutions:**
1. Check trigger conditions in Preview
2. Verify variable values
3. Ensure tag not paused

### Wrong Parameter Values

**Causes:**
- Incorrect variable mapping
- Data layer not populated
- Timing issues

**Solutions:**
1. Check Data Layer in Preview
2. Verify variable names match exactly
3. Check event sequence timing

### Duplicate Events

**Causes:**
- Multiple tags for same event
- Both GTM and gtag.js
- Trigger fires multiple times

**Solutions:**
1. Remove duplicate tags
2. Choose GTM OR gtag.js
3. Add trigger conditions

## Best Practices

### Naming Conventions

**Tags:**
- "GA4 - Configuration"
- "GA4 - Purchase"
- "GA4 - Form Submit"

**Triggers:**
- "PV - Products Pages"
- "Click - CTA Buttons"
- "CE - Add to Cart"

**Variables:**
- "DL - Product ID"
- "CJS - Page Category"
- "Constant - GA4 ID"

### Container Organisation

- Create folders for GA4 tags
- Create folders for variables
- Use consistent naming
- Document custom configurations

### Testing Protocol

1. Always use Preview mode
2. Test all triggers
3. Verify all parameters
4. Check DebugView
5. Then publish

## Quick Reference

### Setup Order

1. Create GA4 Configuration tag (Initialisation trigger)
2. Test with Preview
3. Create event tags
4. Create triggers
5. Create variables
6. Test with Preview
7. Publish

### Common Issues

- Tags not firing: Check triggers
- Wrong values: Check variables
- Duplicates: Remove extra tags
- No data: Verify Measurement ID
