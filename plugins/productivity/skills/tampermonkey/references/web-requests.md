# Web Request Interception API Reference

Documentation for GM_webRequest - intercept and modify browser requests.

---

## Overview

GM_webRequest allows userscripts to intercept, block, or redirect web requests before they're made. This is useful for:
- Blocking ads and tracking
- Redirecting URLs
- Modifying request patterns

**Important Limitations:**
- **Experimental API** - may change at any time
- **Not available in Manifest V3** (Chrome 5.2+, Edge)
- **Firefox only** for current usage
- Only handles: `sub_frame`, `script`, `xhr`, `websocket` request types

---

## Required Setup

```javascript
// @grant GM_webRequest
```

---

## Basic Usage

```javascript
GM_webRequest([
    // Cancel requests to ads
    {
        selector: '*://ads.example.com/*',
        action: 'cancel'
    },

    // Redirect tracking URLs
    {
        selector: '*://tracker.example.com/*',
        action: {
            redirect: 'https://example.com/blocked'
        }
    },

    // Pattern-based redirect
    {
        selector: { match: '*://old.example.com/*' },
        action: {
            redirect: {
                from: '([^:]+)://old.example.com/(.*)',
                to: '$1://new.example.com/$2'
            }
        }
    },

    // Exclude certain paths
    {
        selector: {
            include: '*://example.com/*',
            exclude: '*://example.com/api/*'
        },
        action: 'cancel'
    }
], function(info, message, details) {
    console.log('Action:', info);        // 'cancel' or 'redirect'
    console.log('Message:', message);    // 'ok' or 'error'
    console.log('URL:', details.url);
    console.log('Redirect URL:', details.redirect_url);
});
```

---

## Rule Properties

### Selector

Defines which URLs the rule matches.

| Property | Type | Description |
|----------|------|-------------|
| `selector` | string | Simple URL pattern |
| `selector.include` | string/array | URLs to include |
| `selector.match` | string/array | Match patterns |
| `selector.exclude` | string/array | URLs to exclude |

```javascript
// String selector (simplest)
{ selector: '*://ads.example.com/*' }

// Object selector with include/exclude
{
    selector: {
        include: '*://example.com/*',
        exclude: '*://example.com/api/*'
    }
}

// Array of patterns
{
    selector: {
        include: ['*://ads1.com/*', '*://ads2.com/*'],
        match: '*://tracker.com/*'
    }
}
```

### Action

Defines what to do when a URL matches.

| Property | Type | Description |
|----------|------|-------------|
| `action` | string | `'cancel'` to block |
| `action.cancel` | boolean | Block the request |
| `action.redirect` | string/object | Redirect destination |

```javascript
// Cancel (block) the request
{ action: 'cancel' }
{ action: { cancel: true } }

// Redirect to static URL
{ action: { redirect: 'https://example.com/blocked' } }

// Redirect with pattern replacement
{
    action: {
        redirect: {
            from: '([^:]+)://old.com/(.*)',
            to: '$1://new.com/$2'
        }
    }
}
```

---

## @webRequest Header

Define rules at script level (applies before script loads):

```javascript
// @webRequest {"selector": "*://ads.example.com/*", "action": "cancel"}
// @webRequest {"selector": {"include": "*tracking*"}, "action": {"redirect": "about:blank"}}
```

This is useful for blocking resources that load before your script runs.

---

## Listener Callback

```javascript
GM_webRequest(rules, function(info, message, details) {
    // info: 'cancel' or 'redirect'
    // message: 'ok' or 'error'
    // details: {
    //     rule: <the triggered rule>,
    //     url: <request URL>,
    //     redirect_url: <where redirected>,
    //     description: <error description if any>
    // }
});
```

---

## Common Use Cases

### Block Ads

```javascript
GM_webRequest([
    { selector: '*://ads.example.com/*', action: 'cancel' },
    { selector: '*://tracking.example.com/*', action: 'cancel' },
    { selector: '*://analytics.example.com/*', action: 'cancel' }
]);
```

### Redirect Old URLs

```javascript
GM_webRequest([
    {
        selector: { match: '*://old-domain.com/*' },
        action: {
            redirect: {
                from: '([^:]+)://old-domain.com/(.*)',
                to: '$1://new-domain.com/$2'
            }
        }
    }
]);
```

### Block Specific Resource Types

```javascript
// Block scripts from untrusted domains
GM_webRequest([
    {
        selector: {
            include: '*://*.untrusted.com/*.js'
        },
        action: 'cancel'
    }
]);
```

### Redirect to Local Resources

```javascript
GM_webRequest([
    {
        selector: 'https://cdn.example.com/library.js',
        action: {
            redirect: 'https://my-cdn.com/modified-library.js'
        }
    }
]);
```

---

## Limitations

### Browser Support

| Browser | GM_webRequest Support |
|---------|----------------------|
| Firefox | ✅ Supported |
| Chrome (MV3) | ❌ Not available |
| Edge (MV3) | ❌ Not available |
| Safari | ❌ Not available |

### Request Types

Only these request types can be intercepted:
- `sub_frame` - iframes
- `script` - JavaScript files
- `xhr` - XMLHttpRequest/fetch
- `websocket` - WebSocket connections

These **cannot** be intercepted:
- Main document (`main_frame`)
- Images
- Stylesheets
- Fonts

---

## Alternatives for MV3

Since GM_webRequest doesn't work in Chrome/Edge MV3, use these alternatives:

### Page-Level Interception

```javascript
// @grant unsafeWindow

// Intercept fetch
const originalFetch = unsafeWindow.fetch;
unsafeWindow.fetch = function(...args) {
    const url = args[0]?.url || args[0];
    console.log('Intercepted fetch:', url);

    // Block certain URLs
    if (url.includes('tracking.com')) {
        return Promise.reject(new Error('Blocked'));
    }

    return originalFetch.apply(this, args);
};

// Intercept XMLHttpRequest
const originalOpen = unsafeWindow.XMLHttpRequest.prototype.open;
unsafeWindow.XMLHttpRequest.prototype.open = function(method, url) {
    console.log('Intercepted XHR:', method, url);

    // Block certain URLs
    if (url.includes('tracking.com')) {
        throw new Error('Blocked');
    }

    return originalOpen.apply(this, arguments);
};
```

### Remove Elements After Load

```javascript
// Remove ad iframes after they load
const observer = new MutationObserver(() => {
    document.querySelectorAll('iframe[src*="ads"]').forEach(el => el.remove());
});
observer.observe(document.body, { childList: true, subtree: true });
```

### Use CSS to Hide

```javascript
// @grant GM_addStyle

GM_addStyle(`
    iframe[src*="ads"],
    [id*="advertisement"],
    [class*="sponsored"] {
        display: none !important;
    }
`);
```

---

## Best Practices

1. **Be specific with selectors** - Avoid overly broad patterns
2. **Test thoroughly** - Request interception can break sites
3. **Provide fallbacks** - Check if GM_webRequest is available
4. **Log actions** - Use the listener callback for debugging
5. **Consider MV3 alternatives** - Your script may need to work in Chrome too

```javascript
// Check if GM_webRequest is available
if (typeof GM_webRequest !== 'undefined') {
    GM_webRequest([...rules...]);
} else {
    console.log('GM_webRequest not available, using fallback');
    // Use page-level interception instead
}
```
