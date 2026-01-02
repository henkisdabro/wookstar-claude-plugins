# GA4 Recommended Events

Complete guide to implementing Google-defined recommended events including ecommerce, engagement, and monetisation events.

## Overview

GA4 provides recommended event names and parameter structures defined by Google for consistency across analytics implementations. These standardised events enable key features like ecommerce reports, conversion modelling, and Google Ads integration.

## Why Use Recommended Events

1. **Standard reporting** - Pre-built reports for recommended events
2. **Google Ads integration** - Automatic conversion import
3. **Machine learning** - Better predictive audiences
4. **Consistency** - Cross-property comparison
5. **Future compatibility** - New features use standard events

## Recommended Events Categories

### Engagement Events

| Event | Description | Key Parameters |
|-------|-------------|----------------|
| login | User authentication | method |
| sign_up | Account creation | method |
| search | Site search | search_term |
| share | Content sharing | method, content_type, item_id |
| select_content | Content selection | content_type, item_id |

### Monetisation Events (Ecommerce)

| Event | Description | Key Parameters |
|-------|-------------|----------------|
| view_item | Product page view | items, value, currency |
| view_item_list | Product list view | items, item_list_id, item_list_name |
| select_item | Product selected | items |
| add_to_cart | Cart addition | items, value, currency |
| remove_from_cart | Cart removal | items |
| view_cart | Cart viewed | items, value, currency |
| begin_checkout | Checkout started | items, value, currency |
| add_shipping_info | Shipping selected | shipping_tier, items |
| add_payment_info | Payment entered | payment_type, items |
| purchase | Transaction complete | transaction_id, value, currency, items |
| refund | Purchase refunded | transaction_id, value, items |

### Promotion Events

| Event | Description | Key Parameters |
|-------|-------------|----------------|
| view_promotion | Promotion displayed | promotion_id, promotion_name, items |
| select_promotion | Promotion clicked | promotion_id, promotion_name, items |

### Other Recommended Events

| Event | Description | Key Parameters |
|-------|-------------|----------------|
| add_to_wishlist | Wishlist addition | items, value, currency |
| generate_lead | Lead generation | value, currency |

## The Items Array

The items array is critical for ecommerce tracking. Each item object can contain:

### Required (At Least One)

| Parameter | Type | Description |
|-----------|------|-------------|
| item_id | string | Product SKU |
| item_name | string | Product name |

### Highly Recommended

| Parameter | Type | Description |
|-----------|------|-------------|
| price | number | Unit price |
| quantity | integer | Number of units |
| item_category | string | Primary category |

### Optional

| Parameter | Type | Description |
|-----------|------|-------------|
| item_brand | string | Brand name |
| item_variant | string | Size, colour, etc. |
| coupon | string | Item-level coupon |
| discount | number | Discount amount |
| item_category2-5 | string | Hierarchy categories |
| item_list_id | string | List identifier |
| item_list_name | string | List name |
| affiliation | string | Store affiliation |
| location_id | string | Store location |
| index | integer | Position in list |

### Items Array Example

```javascript
'items': [
  {
    'item_id': 'SKU_001',
    'item_name': 'Blue T-Shirt',
    'item_brand': 'Acme',
    'item_category': 'Apparel',
    'item_category2': 'T-Shirts',
    'item_variant': 'Large',
    'price': 29.99,
    'quantity': 2,
    'coupon': 'SUMMER20',
    'discount': 5.00
  },
  {
    'item_id': 'SKU_002',
    'item_name': 'Black Jeans',
    'item_brand': 'Acme',
    'item_category': 'Apparel',
    'item_category2': 'Jeans',
    'item_variant': '32',
    'price': 59.99,
    'quantity': 1
  }
]
```

## Complete Ecommerce Implementation

### Purchase Event (Most Important)

```javascript
gtag('event', 'purchase', {
  'transaction_id': 'TXN_12345',      // Required: unique per purchase
  'value': 119.97,                     // Recommended: total value
  'currency': 'USD',                   // Recommended: currency code
  'tax': 8.40,                         // Optional: tax amount
  'shipping': 9.99,                    // Optional: shipping cost
  'coupon': 'SUMMER20',                // Optional: order-level coupon
  'affiliation': 'Online Store',       // Optional: store name
  'items': [
    {
      'item_id': 'SKU_001',
      'item_name': 'Blue T-Shirt',
      'item_category': 'Apparel',
      'price': 29.99,
      'quantity': 2
    },
    {
      'item_id': 'SKU_002',
      'item_name': 'Black Jeans',
      'item_category': 'Apparel',
      'price': 59.99,
      'quantity': 1
    }
  ]
});
```

### Full Ecommerce Journey

**1. view_item_list (Product Listing Page)**

```javascript
gtag('event', 'view_item_list', {
  'item_list_id': 'category_apparel',
  'item_list_name': 'Apparel Collection',
  'items': [
    {
      'item_id': 'SKU_001',
      'item_name': 'Blue T-Shirt',
      'price': 29.99,
      'index': 1
    },
    {
      'item_id': 'SKU_002',
      'item_name': 'Black Jeans',
      'price': 59.99,
      'index': 2
    }
  ]
});
```

**2. select_item (Product Click)**

```javascript
gtag('event', 'select_item', {
  'item_list_id': 'category_apparel',
  'item_list_name': 'Apparel Collection',
  'items': [
    {
      'item_id': 'SKU_001',
      'item_name': 'Blue T-Shirt',
      'price': 29.99
    }
  ]
});
```

**3. view_item (Product Detail Page)**

```javascript
gtag('event', 'view_item', {
  'currency': 'USD',
  'value': 29.99,
  'items': [
    {
      'item_id': 'SKU_001',
      'item_name': 'Blue T-Shirt',
      'item_brand': 'Acme',
      'item_category': 'Apparel',
      'item_variant': 'Large',
      'price': 29.99
    }
  ]
});
```

**4. add_to_cart**

```javascript
gtag('event', 'add_to_cart', {
  'currency': 'USD',
  'value': 59.98,
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

**5. view_cart**

```javascript
gtag('event', 'view_cart', {
  'currency': 'USD',
  'value': 119.97,
  'items': [
    {
      'item_id': 'SKU_001',
      'item_name': 'Blue T-Shirt',
      'price': 29.99,
      'quantity': 2
    },
    {
      'item_id': 'SKU_002',
      'item_name': 'Black Jeans',
      'price': 59.99,
      'quantity': 1
    }
  ]
});
```

**6. begin_checkout**

```javascript
gtag('event', 'begin_checkout', {
  'currency': 'USD',
  'value': 119.97,
  'coupon': 'SUMMER20',
  'items': [
    {
      'item_id': 'SKU_001',
      'item_name': 'Blue T-Shirt',
      'price': 29.99,
      'quantity': 2
    },
    {
      'item_id': 'SKU_002',
      'item_name': 'Black Jeans',
      'price': 59.99,
      'quantity': 1
    }
  ]
});
```

**7. add_shipping_info**

```javascript
gtag('event', 'add_shipping_info', {
  'currency': 'USD',
  'value': 119.97,
  'shipping_tier': 'Express',
  'items': [/* same items array */]
});
```

**8. add_payment_info**

```javascript
gtag('event', 'add_payment_info', {
  'currency': 'USD',
  'value': 119.97,
  'payment_type': 'Credit Card',
  'items': [/* same items array */]
});
```

**9. purchase** (see complete example above)

## Engagement Events Implementation

### login Event

```javascript
gtag('event', 'login', {
  'method': 'Google'  // or 'Email', 'Facebook', etc.
});
```

### sign_up Event

```javascript
gtag('event', 'sign_up', {
  'method': 'Email'
});
```

### search Event

```javascript
gtag('event', 'search', {
  'search_term': 'blue t-shirt'
});
```

### share Event

```javascript
gtag('event', 'share', {
  'method': 'Twitter',
  'content_type': 'article',
  'item_id': 'ARTICLE_123'
});
```

### generate_lead Event

```javascript
gtag('event', 'generate_lead', {
  'currency': 'USD',
  'value': 50.00  // Estimated lead value
});
```

## GTM Implementation

### Data Layer Push

```javascript
dataLayer.push({
  'event': 'purchase',
  'ecommerce': {
    'transaction_id': 'TXN_12345',
    'value': 119.97,
    'currency': 'USD',
    'tax': 8.40,
    'shipping': 9.99,
    'items': [
      {
        'item_id': 'SKU_001',
        'item_name': 'Blue T-Shirt',
        'price': 29.99,
        'quantity': 2
      }
    ]
  }
});
```

### GTM Configuration

1. Create Data Layer Variables for ecommerce parameters
2. Create Custom Event trigger for 'purchase'
3. Create GA4 Event tag:
   - Event Name: purchase
   - Map ecommerce parameters to event parameters
4. Test in Preview mode
5. Publish

## Critical Implementation Rules

### Transaction ID

- **Must be unique** for each purchase
- Same transaction_id = duplicate (deduped by GA4)
- Use order number or generate unique ID

### Currency

- **Always include** with monetary events
- Use ISO 4217 codes (USD, EUR, GBP, AUD)
- Same currency for value and item prices

### Items Array

- Include at least item_id OR item_name (required)
- Keep items array consistent across events
- Maximum 27 items per event

### Value Calculation

- Should match sum of (price * quantity) for all items
- Include discounts in calculation
- Exclude tax and shipping from item values

## Testing Recommended Events

### DebugView Validation

1. Enable debug mode
2. Complete user journey
3. For each event, verify:
   - Event name matches exactly
   - All required parameters present
   - Parameter values correct
   - Items array structure valid

### Ecommerce Validation Checklist

- [ ] view_item fires on product pages
- [ ] add_to_cart fires when adding items
- [ ] begin_checkout fires at checkout start
- [ ] purchase fires once per transaction
- [ ] transaction_id is unique
- [ ] Value matches cart total
- [ ] Currency included on all monetary events
- [ ] Items array populated correctly

## Common Issues

### Duplicate Purchases

**Cause:** Same transaction_id sent multiple times
**Solution:** Ensure unique ID, implement prevention logic

### Missing Revenue

**Cause:** Currency parameter missing
**Solution:** Always include currency with value

### Empty Items Array

**Cause:** Data not available when event fires
**Solution:** Validate items array before sending

### Wrong Event Names

**Cause:** Using custom names instead of recommended
**Solution:** Use exact recommended event names (case-sensitive)

## Key Events (Conversions)

Mark recommended events as key events for conversion tracking:

1. Admin -> Events
2. Find event (e.g., purchase)
3. Toggle "Mark as key event"

Events marked as key events:
- Appear in conversion reports
- Can be imported to Google Ads
- Used for optimisation
