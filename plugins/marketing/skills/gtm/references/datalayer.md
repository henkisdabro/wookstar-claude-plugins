# Data Layer Implementation

**Sources**:

- <https://developers.google.com/tag-platform/tag-manager/datalayer>
- <https://developers.google.com/analytics/devguides/collection/ga4/ecommerce>

**Last Updated**: 2025-01-09

## Overview

The data layer is a JavaScript object that passes information from your website to Google Tag Manager. It serves as the central hub for all tracking data, enabling consistent and reliable tag configuration. This guide covers data layer fundamentals, e-commerce implementation, SPA handling, and best practices.

## Data Layer Fundamentals

### What is the Data Layer?

The data layer is a JavaScript array that stores data for GTM to consume:

```javascript
window.dataLayer = window.dataLayer || [];
```

Every subsequent push into the dataLayer should be preceded with the above snippet for safety.

### How It Works

1. Website pushes data to `dataLayer`
2. GTM listens for pushes
3. Data becomes available via Data Layer Variables
4. Tags and triggers can access the data

### Basic Push Syntax

```javascript
window.dataLayer.push({
  'key': 'value',
  'anotherKey': 'anotherValue'
});
```

### Event Push Syntax

```javascript
window.dataLayer.push({
  'event': 'custom_event_name',
  'eventData': 'associated data'
});
```

## Data Layer Initialisation

### Proper Setup Order

```html
<!-- 1. Initialise data layer BEFORE GTM -->
<script>
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'pageType': 'product',
    'userId': 'USER123',
    'userStatus': 'logged_in'
  });
</script>

<!-- 2. GTM snippet loads and reads initial data -->
<script>...</script>
```

### Why Order Matters

- Data must be available when Container Loaded fires
- Page View triggers need access to initial data
- Prevents race conditions

## Common Data Layer Patterns

### Page Data

```javascript
window.dataLayer.push({
  'event': 'page_data',
  'page': {
    'type': 'product',
    'category': 'Electronics',
    'subcategory': 'Phones'
  }
});
```

### User Data

```javascript
window.dataLayer.push({
  'event': 'user_data',
  'user': {
    'id': 'USER123',
    'status': 'logged_in',
    'type': 'premium',
    'lifetime_value': 1500.00
  }
});
```

### Form Submission

```javascript
window.dataLayer.push({
  'event': 'form_submit',
  'form': {
    'id': 'contact-form',
    'name': 'Contact Us',
    'type': 'contact'
  }
});
```

### Button Click

```javascript
window.dataLayer.push({
  'event': 'button_click',
  'button': {
    'id': 'cta-signup',
    'text': 'Sign Up Now',
    'location': 'hero'
  }
});
```

## GA4 E-commerce Data Layer

### View Item List

```javascript
window.dataLayer.push({ ecommerce: null });  // Clear previous ecommerce data
window.dataLayer.push({
  'event': 'view_item_list',
  'ecommerce': {
    'item_list_id': 'category_phones',
    'item_list_name': 'Phones',
    'items': [
      {
        'item_id': 'SKU001',
        'item_name': 'iPhone 15',
        'affiliation': 'Online Store',
        'index': 0,
        'item_brand': 'Apple',
        'item_category': 'Electronics',
        'item_category2': 'Phones',
        'item_list_id': 'category_phones',
        'item_list_name': 'Phones',
        'price': 1299.00,
        'quantity': 1
      },
      {
        'item_id': 'SKU002',
        'item_name': 'Samsung Galaxy S24',
        'index': 1,
        'item_brand': 'Samsung',
        'item_category': 'Electronics',
        'item_category2': 'Phones',
        'price': 999.00,
        'quantity': 1
      }
    ]
  }
});
```

### Select Item

```javascript
window.dataLayer.push({ ecommerce: null });
window.dataLayer.push({
  'event': 'select_item',
  'ecommerce': {
    'item_list_id': 'category_phones',
    'item_list_name': 'Phones',
    'items': [{
      'item_id': 'SKU001',
      'item_name': 'iPhone 15',
      'item_brand': 'Apple',
      'item_category': 'Electronics',
      'price': 1299.00,
      'quantity': 1
    }]
  }
});
```

### View Item

```javascript
window.dataLayer.push({ ecommerce: null });
window.dataLayer.push({
  'event': 'view_item',
  'ecommerce': {
    'currency': 'AUD',
    'value': 1299.00,
    'items': [{
      'item_id': 'SKU001',
      'item_name': 'iPhone 15',
      'affiliation': 'Online Store',
      'item_brand': 'Apple',
      'item_category': 'Electronics',
      'item_category2': 'Phones',
      'item_variant': '128GB Black',
      'price': 1299.00,
      'quantity': 1
    }]
  }
});
```

### Add to Cart

```javascript
window.dataLayer.push({ ecommerce: null });
window.dataLayer.push({
  'event': 'add_to_cart',
  'ecommerce': {
    'currency': 'AUD',
    'value': 1299.00,
    'items': [{
      'item_id': 'SKU001',
      'item_name': 'iPhone 15',
      'item_brand': 'Apple',
      'item_category': 'Electronics',
      'item_variant': '128GB Black',
      'price': 1299.00,
      'quantity': 1
    }]
  }
});
```

### Remove from Cart

```javascript
window.dataLayer.push({ ecommerce: null });
window.dataLayer.push({
  'event': 'remove_from_cart',
  'ecommerce': {
    'currency': 'AUD',
    'value': 1299.00,
    'items': [{
      'item_id': 'SKU001',
      'item_name': 'iPhone 15',
      'price': 1299.00,
      'quantity': 1
    }]
  }
});
```

### View Cart

```javascript
window.dataLayer.push({ ecommerce: null });
window.dataLayer.push({
  'event': 'view_cart',
  'ecommerce': {
    'currency': 'AUD',
    'value': 2298.00,
    'items': [
      {
        'item_id': 'SKU001',
        'item_name': 'iPhone 15',
        'price': 1299.00,
        'quantity': 1
      },
      {
        'item_id': 'SKU003',
        'item_name': 'AirPods Pro',
        'price': 399.00,
        'quantity': 1
      }
    ]
  }
});
```

### Begin Checkout

```javascript
window.dataLayer.push({ ecommerce: null });
window.dataLayer.push({
  'event': 'begin_checkout',
  'ecommerce': {
    'currency': 'AUD',
    'value': 2298.00,
    'coupon': 'SUMMER10',
    'items': [{
      'item_id': 'SKU001',
      'item_name': 'iPhone 15',
      'price': 1299.00,
      'quantity': 1
    }]
  }
});
```

### Add Shipping Info

```javascript
window.dataLayer.push({ ecommerce: null });
window.dataLayer.push({
  'event': 'add_shipping_info',
  'ecommerce': {
    'currency': 'AUD',
    'value': 2298.00,
    'shipping_tier': 'Express',
    'items': [{
      'item_id': 'SKU001',
      'item_name': 'iPhone 15',
      'price': 1299.00,
      'quantity': 1
    }]
  }
});
```

### Add Payment Info

```javascript
window.dataLayer.push({ ecommerce: null });
window.dataLayer.push({
  'event': 'add_payment_info',
  'ecommerce': {
    'currency': 'AUD',
    'value': 2298.00,
    'payment_type': 'Credit Card',
    'items': [{
      'item_id': 'SKU001',
      'item_name': 'iPhone 15',
      'price': 1299.00,
      'quantity': 1
    }]
  }
});
```

### Purchase

```javascript
window.dataLayer.push({ ecommerce: null });
window.dataLayer.push({
  'event': 'purchase',
  'ecommerce': {
    'transaction_id': 'T12345',
    'affiliation': 'Online Store',
    'value': 2348.00,
    'tax': 213.45,
    'shipping': 50.00,
    'currency': 'AUD',
    'coupon': 'SUMMER10',
    'items': [
      {
        'item_id': 'SKU001',
        'item_name': 'iPhone 15',
        'affiliation': 'Online Store',
        'coupon': 'SUMMER10',
        'item_brand': 'Apple',
        'item_category': 'Electronics',
        'item_category2': 'Phones',
        'item_variant': '128GB Black',
        'price': 1299.00,
        'quantity': 1
      },
      {
        'item_id': 'SKU003',
        'item_name': 'AirPods Pro',
        'item_brand': 'Apple',
        'item_category': 'Electronics',
        'item_category2': 'Audio',
        'price': 399.00,
        'quantity': 1
      }
    ]
  }
});
```

### Refund

```javascript
window.dataLayer.push({ ecommerce: null });
window.dataLayer.push({
  'event': 'refund',
  'ecommerce': {
    'transaction_id': 'T12345',
    'value': 1299.00,
    'currency': 'AUD',
    'items': [{
      'item_id': 'SKU001',
      'item_name': 'iPhone 15',
      'price': 1299.00,
      'quantity': 1
    }]
  }
});
```

## Single-Page Application (SPA) Handling

### Virtual Pageviews

For SPAs, push virtual pageviews when routes change:

```javascript
// React Router example
useEffect(() => {
  window.dataLayer.push({
    'event': 'virtual_pageview',
    'page_path': location.pathname,
    'page_title': document.title,
    'page_location': window.location.href
  });
}, [location]);
```

### Data Clearing for SPAs

Clear previous page data to prevent carryover:

```javascript
// Method 1: Set to undefined
window.dataLayer.push({
  'event': 'virtual_pageview',
  'page_path': '/new-page',
  // Clear previous values
  'transaction_id': undefined,
  'ecommerce': undefined
});

// Method 2: Use reset function
window.dataLayer.push(function() {
  this.reset();
});

window.dataLayer.push({
  'event': 'virtual_pageview',
  'page_path': '/new-page'
});
```

### What to Clear

**Clear on every virtual pageview**:

- Previous page-scoped data
- Transaction data
- Ecommerce data

**Keep persistent**:

- User ID
- User status
- Session-level data

## Data Layer Best Practices

### Never Overwrite the Array

```javascript
// BAD - Loses existing data
dataLayer = [{'key': 'value'}];

// GOOD - Preserves existing data
window.dataLayer.push({'key': 'value'});
```

### Use Correct Casing

```javascript
// BAD - Wrong casing
window.dataLayer.push({});  // lowercase 'l'
window.dataLayer.push({});  // capital 'D'

// GOOD - Correct camelCase
window.dataLayer.push({});
```

### Quote Variable Names

```javascript
// GOOD - Always use quotes
window.dataLayer.push({
  'variable-name': 'value',
  'anotherVariable': 'value'
});
```

### Consistent Naming

```javascript
// BAD - Inconsistent
// Page 1:
window.dataLayer.push({'user_type': 'premium'});
// Page 2:
window.dataLayer.push({'userType': 'premium'});

// GOOD - Consistent across all pages
window.dataLayer.push({'userType': 'premium'});
```

### Clear E-commerce Data

Always clear ecommerce object before pushing:

```javascript
window.dataLayer.push({ ecommerce: null });
window.dataLayer.push({
  'event': 'purchase',
  'ecommerce': { /* purchase data */ }
});
```

### Avoid PII

Never push personally identifiable information:

```javascript
// BAD - Contains PII
window.dataLayer.push({
  'email': 'user@example.com',
  'phone': '+61412345678'
});

// GOOD - Hash or pseudonymise
window.dataLayer.push({
  'emailHash': 'a1b2c3d4...',  // SHA-256 hash
  'hasPhone': true
});
```

## Custom Data Layer Methods

### The set() Method

Store values for later retrieval:

```javascript
window.dataLayer.push(function() {
  this.set('lastUpdated', new Date());
});
```

### The get() Method

Retrieve stored values:

```javascript
window.dataLayer.push(function() {
  var lastUpdated = this.get('lastUpdated');
  console.log('Last updated:', lastUpdated);
});
```

### The reset() Method

Clear all data layer state:

```javascript
window.dataLayer.push(function() {
  this.reset();
});
```

## Debugging the Data Layer

### Console Inspection

```javascript
// View entire data layer
console.log(window.dataLayer);

// Find specific events
dataLayer.filter(function(item) {
  return item.event === 'purchase';
});
```

### Monitor Pushes

```javascript
var originalPush = window.dataLayer.push;
window.dataLayer.push = function() {
  console.log('Data Layer push:', arguments[0]);
  return originalPush.apply(this, arguments);
};
```

### GTM Preview Mode

1. Enable Preview mode
2. Click any event in Summary
3. Open Data Layer tab
4. View data layer state at that event

## Data Layer Specification

### Documentation Template

Document your data layer for developers:

```markdown
## userType

- **Type**: String
- **Values**: 'guest', 'registered', 'premium'
- **Populated**: On all pages after user identification
- **Example**: `{'userType': 'premium'}`
- **Used by**: User Segmentation Tags, Personalisation Triggers

## ecommerce.items

- **Type**: Array of Objects
- **Required Fields**: item_id, item_name, price
- **Optional Fields**: item_brand, item_category, quantity
- **Populated**: E-commerce events only
- **Example**: See purchase event documentation
```

## Resources

- [Data Layer Developer Guide](https://developers.google.com/tag-platform/tag-manager/datalayer)
- [GA4 E-commerce Implementation](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [Data Layer Best Practices](https://support.google.com/tagmanager/answer/6164391)
