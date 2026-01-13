# URL Matching Patterns

Complete guide to @match, @include, and @exclude patterns.

---

## @match (Recommended)

The modern, safer way to specify where scripts run.

### Pattern Format

```
<scheme>://<host><path>
```

| Component | Description | Wildcards |
|-----------|-------------|-----------|
| `scheme` | Protocol (http, https, *) | `*` matches http or https |
| `host` | Domain name | `*` matches any subdomain |
| `path` | URL path | `*` matches any characters |

### Common Patterns

```javascript
// Exact domain
// @match https://example.com/*

// All subdomains
// @match https://*.example.com/*

// Both HTTP and HTTPS
// @match *://example.com/*

// Specific path
// @match https://example.com/app/*

// Any page on any HTTPS site (use sparingly!)
// @match https://*/*

// Specific file
// @match https://example.com/page.html
```

### Wildcard Rules

| Pattern | Matches | Does NOT Match |
|---------|---------|----------------|
| `https://example.com/*` | example.com/page | sub.example.com |
| `https://*.example.com/*` | sub.example.com | example.com |
| `*://example.com/*` | http://example.com, https://example.com | ftp://example.com |
| `https://example.com/app/*` | example.com/app/page | example.com/other |

### Special Patterns

```javascript
// Match root domain AND all subdomains
// @match https://example.com/*
// @match https://*.example.com/*

// Match specific subdomains only
// @match https://www.example.com/*
// @match https://api.example.com/*

// Path with wildcard in middle
// @match https://example.com/user/*/profile
```

---

## @include (Legacy)

More flexible but less secure than @match. Supports glob patterns and regex.

### Glob Patterns

```javascript
// Standard glob
// @include https://example.com/*

// Multiple wildcards
// @include *://*.example.com/*

// Match any TLD
// @include https://example.*/*
```

### Regular Expressions

Wrap in forward slashes:

```javascript
// Match URLs containing "example"
// @include /example/

// Match specific pattern
// @include /^https:\/\/www\.example\.com\/page\/\d+$/

// Case-insensitive
// @include /example\.com/i
```

### @include vs @match

| Feature | @match | @include |
|---------|--------|----------|
| Security | Stricter | More permissive |
| Regex support | No | Yes |
| TLD wildcards | No | Yes (`example.*`) |
| Recommended | Yes | Legacy |

---

## @exclude

Exclude URLs even if they match @match or @include.

```javascript
// Run on example.com except admin pages
// @match https://example.com/*
// @exclude https://example.com/admin/*
// @exclude https://example.com/api/*

// Exclude with regex
// @exclude /example\.com\/private/

// Exclude specific file
// @exclude https://example.com/login.html
```

### Precedence

1. @exclude is checked first
2. If URL matches @exclude, script doesn't run
3. Otherwise, @match/@include is checked

---

## Common Use Cases

### Single Website

```javascript
// All pages on example.com
// @match https://example.com/*
// @match https://www.example.com/*
```

### Multiple Related Sites

```javascript
// Company's multiple domains
// @match https://example.com/*
// @match https://example.co.uk/*
// @match https://example.de/*
```

### SaaS Application

```javascript
// Customer subdomains
// @match https://*.example.com/*
// @exclude https://api.example.com/*
// @exclude https://static.example.com/*
```

### Social Media Platform

```javascript
// Multiple sections
// @match https://twitter.com/*
// @match https://x.com/*
// @match https://mobile.twitter.com/*
```

### Development & Production

```javascript
// Both environments
// @match https://example.com/*
// @match https://staging.example.com/*
// @match http://localhost:3000/*
// @match http://127.0.0.1:3000/*
```

---

## Testing Patterns

### Verify in Browser

1. Navigate to target page
2. Check if Tampermonkey icon shows script count
3. Click icon → see which scripts matched

### Debug Patterns

```javascript
// Add to script to verify matching
console.log('Script matched URL:', location.href);
console.log('Host:', location.host);
console.log('Path:', location.pathname);
```

### Pattern Tester

Test if a URL matches your pattern:

```javascript
// Manual test
const patterns = [
    'https://example.com/*',
    'https://*.example.com/*'
];

const testUrl = 'https://sub.example.com/page';

// Note: This is simplified - actual matching is more complex
patterns.forEach(pattern => {
    const regex = pattern
        .replace(/\*/g, '.*')
        .replace(/\//g, '\\/');
    const matches = new RegExp(`^${regex}$`).test(testUrl);
    console.log(`${pattern}: ${matches}`);
});
```

---

## Common Mistakes

### Mistake 1: Missing www

```javascript
// WRONG - misses www subdomain
// @match https://example.com/*

// RIGHT - include both
// @match https://example.com/*
// @match https://www.example.com/*

// OR use subdomain wildcard (but matches ALL subdomains)
// @match https://*.example.com/*
```

### Mistake 2: HTTP vs HTTPS

```javascript
// WRONG - only matches HTTPS
// @match https://example.com/*

// RIGHT - if site uses both
// @match *://example.com/*
```

### Mistake 3: Trailing Slash

```javascript
// These are different!
// @match https://example.com/    // Only root page
// @match https://example.com/*   // All pages
```

### Mistake 4: Too Broad

```javascript
// WRONG - runs on every site (security risk, performance hit)
// @match *://*/*

// RIGHT - be specific
// @match https://example.com/*
```

### Mistake 5: Query Parameters

@match doesn't match query strings or hashes:

```javascript
// This won't match https://example.com/page?id=123
// @match https://example.com/page?*

// Use @include with regex instead
// @include /^https:\/\/example\.com\/page\?/
```

---

## URL Fragment Handling

@match ignores URL fragments (#hash):

```javascript
// @match https://example.com/*

// Matches all of these:
// https://example.com/page
// https://example.com/page#section1
// https://example.com/page#section2
```

For SPA fragment detection, use window.onurlchange:

```javascript
// @grant window.onurlchange

if (window.onurlchange === null) {
    window.addEventListener('urlchange', (info) => {
        console.log('URL changed:', info.url);
    });
}
```

---

## Performance Considerations

More @match patterns = more overhead:

```javascript
// SLOW - 100 separate patterns
// @match https://site1.com/*
// @match https://site2.com/*
// ... 98 more ...

// FASTER - use wildcards where possible
// @match https://*.example.com/*

// Or use @include with regex for complex patterns
// @include /^https:\/\/(site1|site2|site3)\.com/
```
