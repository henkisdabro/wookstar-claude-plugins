# GA4 gtag.js Direct Implementation

Expert guidance for implementing GA4 using gtag.js directly without Google Tag Manager.

## Overview

gtag.js (Google Tag) is the official JavaScript library for implementing GA4 tracking directly on websites. This reference covers installation, gtag commands, event tracking, user properties, and framework integration patterns.

## When to Use gtag.js

**Choose gtag.js when:**
- Only need Google products (GA4, Google Ads)
- Want lightweight implementation
- Have code access to website
- No tag management system required
- Simple tracking needs

**Choose GTM instead when:**
- Need multiple tracking tags
- Team collaboration required
- Frequent changes expected
- Want version control for tags

## Installation

### Basic Installation

Place in `<head>` section, before all other scripts:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Placement Requirements

| Requirement | Description |
|-------------|-------------|
| Location | `<head>` section |
| Position | Before all other scripts |
| Async | Script loaded asynchronously |
| Every page | Must be on all pages |

## gtag Commands

### gtag('js', new Date())

Initialises the library with timestamp.

```javascript
gtag('js', new Date());
```

**Required:** Yes, must be called first

### gtag('config', 'G-ID')

Configures GA4 with Measurement ID.

**Basic:**
```javascript
gtag('config', 'G-XXXXXXXXXX');
```

**With Options:**
```javascript
gtag('config', 'G-XXXXXXXXXX', {
  'page_title': 'Custom Page Title',
  'page_location': window.location.href,
  'send_page_view': true,
  'allow_google_signals': true,
  'allow_ad_personalization_signals': true,
  'user_id': 'USER_12345'
});
```

### gtag('event', 'name', {params})

Sends events to GA4.

**Simple Event:**
```javascript
gtag('event', 'button_click', {
  'button_name': 'Subscribe',
  'button_location': 'header'
});
```

**Recommended Event:**
```javascript
gtag('event', 'purchase', {
  'transaction_id': 'TXN_12345',
  'value': 99.99,
  'currency': 'USD',
  'items': [{
    'item_id': 'SKU_001',
    'item_name': 'Product Name',
    'price': 99.99,
    'quantity': 1
  }]
});
```

### gtag('set', {properties})

Sets user properties and User ID.

**User ID:**
```javascript
// On login
gtag('set', 'user_id', 'USER_12345');

// On logout - MUST use null, never empty string
gtag('set', 'user_id', null);
```

**User Properties:**
```javascript
gtag('set', 'user_properties', {
  'subscription_tier': 'premium',
  'customer_segment': 'enterprise',
  'account_age_days': 365
});
```

### gtag('consent', 'default/update', {})

Manages consent state.

**Default (Before Consent):**
```javascript
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied'
});
```

**Update (After Consent):**
```javascript
gtag('consent', 'update', {
  'ad_storage': 'granted',
  'analytics_storage': 'granted',
  'ad_user_data': 'granted',
  'ad_personalization': 'granted'
});
```

## Common Implementation Patterns

### Button Click Tracking

```html
<button id="subscribe-btn">Subscribe</button>

<script>
document.getElementById('subscribe-btn').addEventListener('click', function() {
  gtag('event', 'button_click', {
    'button_name': 'Subscribe',
    'button_location': 'homepage_hero',
    'button_id': 'subscribe-btn'
  });
});
</script>
```

### Form Submission Tracking

```html
<form id="contact-form">
  <input type="email" name="email" required>
  <button type="submit">Submit</button>
</form>

<script>
document.getElementById('contact-form').addEventListener('submit', function(e) {
  gtag('event', 'form_submit', {
    'form_name': 'Contact Form',
    'form_id': 'contact-form',
    'form_destination': '/thank-you'
  });
});
</script>
```

### Video Tracking

```javascript
// Video start
gtag('event', 'video_start', {
  'video_title': 'Getting Started Guide',
  'video_id': 'VID_001',
  'video_duration': 180
});

// Video progress
gtag('event', 'video_progress', {
  'video_title': 'Getting Started Guide',
  'video_id': 'VID_001',
  'video_percent': 50
});

// Video complete
gtag('event', 'video_complete', {
  'video_title': 'Getting Started Guide',
  'video_id': 'VID_001'
});
```

### Ecommerce Purchase

```javascript
gtag('event', 'purchase', {
  'transaction_id': 'TXN_' + Date.now(),
  'value': 149.99,
  'currency': 'USD',
  'tax': 10.00,
  'shipping': 5.99,
  'coupon': 'SUMMER20',
  'items': [
    {
      'item_id': 'SKU_001',
      'item_name': 'Premium Widget',
      'item_brand': 'Acme',
      'item_category': 'Electronics',
      'item_variant': 'Blue',
      'price': 149.99,
      'quantity': 1
    }
  ]
});
```

### User Authentication

```javascript
// On login
function handleLogin(userId, method) {
  // Set User ID
  gtag('set', 'user_id', userId);

  // Send login event
  gtag('event', 'login', {
    'method': method
  });

  // Set user properties
  gtag('set', 'user_properties', {
    'account_type': 'registered',
    'login_method': method
  });
}

// On logout
function handleLogout() {
  // Clear User ID
  gtag('set', 'user_id', null);

  // Optional: track logout
  gtag('event', 'logout');
}
```

## Single Page Applications

### Manual Page View Tracking

SPAs don't trigger traditional page loads. Track manually:

```javascript
// Call on route change
function trackPageView(path, title) {
  gtag('config', 'G-XXXXXXXXXX', {
    'page_path': path,
    'page_title': title
  });
}

// Example with router
router.afterEach((to) => {
  trackPageView(to.path, to.meta.title);
});
```

### Disable Automatic Page View

If handling manually:

```javascript
gtag('config', 'G-XXXXXXXXXX', {
  'send_page_view': false
});

// Then send manually
gtag('event', 'page_view', {
  'page_title': 'Custom Title',
  'page_location': window.location.href,
  'page_path': '/custom-path'
});
```

## Framework Integration

### React / Next.js

```javascript
// lib/gtag.js
export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

export const pageview = (url) => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

export const event = (action, params) => {
  window.gtag('event', action, params);
};
```

```javascript
// In _app.js or layout
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as gtag from '../lib/gtag';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
}
```

### Vue.js

```javascript
// plugins/gtag.js
export default {
  install(app) {
    app.config.globalProperties.$gtag = (action, params) => {
      window.gtag('event', action, params);
    };
  }
};
```

```javascript
// In router
router.afterEach((to, from) => {
  gtag('config', 'G-XXXXXXXXXX', {
    page_path: to.fullPath,
    page_title: to.meta.title
  });
});
```

### Angular

```typescript
// analytics.service.ts
import { Injectable } from '@angular/core';

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  event(action: string, params: object) {
    gtag('event', action, params);
  }

  pageView(path: string, title: string) {
    gtag('config', 'G-XXXXXXXXXX', {
      page_path: path,
      page_title: title
    });
  }
}
```

## Multiple Properties

Track to multiple GA4 properties:

```javascript
// Configure both
gtag('config', 'G-XXXXXXXXXX');  // Property 1
gtag('config', 'G-YYYYYYYYYY');  // Property 2

// Events sent to both automatically
gtag('event', 'purchase', {
  'value': 99.99,
  'currency': 'USD'
});

// Send to specific property only
gtag('event', 'purchase', {
  'send_to': 'G-XXXXXXXXXX',
  'value': 99.99,
  'currency': 'USD'
});
```

## Debug Mode

Enable debug mode for testing:

```javascript
gtag('config', 'G-XXXXXXXXXX', {
  'debug_mode': true
});
```

**Important:** Remove for production.

## Common Pitfalls

### 1. gtag Called Before Initialisation

**Problem:** Events called before gtag snippet
**Solution:** Ensure snippet loads first in `<head>`

### 2. Multiple gtag Snippets

**Problem:** Duplicate events
**Solution:** Single snippet, multiple config calls

### 3. Empty String for User ID

**Problem:** User ID not cleared properly
**Solution:** Use `null`, never empty string `""`

### 4. Missing Currency

**Problem:** Monetary events without currency
**Solution:** Always include `currency` with `value`

### 5. Unregistered Parameters

**Problem:** Parameters not in reports
**Solution:** Register as custom dimensions

## Critical Rules

| Rule | Value |
|------|-------|
| Event name max | 40 characters |
| Parameter name max | 40 characters |
| Parameter value max | 100 characters |
| Parameters per event | 25 |
| Event names | snake_case |

## Quick Reference

### Initialise

```javascript
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX');
```

### Send Event

```javascript
gtag('event', 'event_name', {params});
```

### Set User ID

```javascript
gtag('set', 'user_id', 'USER_123');
```

### Set User Properties

```javascript
gtag('set', 'user_properties', {key: 'value'});
```

### Clear User ID

```javascript
gtag('set', 'user_id', null);
```
