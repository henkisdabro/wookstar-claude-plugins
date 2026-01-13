# Security Checklist for Userscripts

Pre-delivery validation to ensure scripts are secure and well-formed.

---

## Critical Security Checks

These issues can expose users to serious risks.

### 1. No Hardcoded Secrets

**Check:** Script contains no API keys, tokens, or passwords.

```javascript
// DANGEROUS - exposed credentials
const API_KEY = 'sk-1234567890abcdef';
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIs...';

// SAFE - user provides credentials
const API_KEY = GM_getValue('apiKey', '');
if (!API_KEY) {
    alert('Please set your API key in the script settings');
}
```

### 2. @match Not Overly Broad

**Check:** Script doesn't run on all websites unnecessarily.

```javascript
// DANGEROUS - runs everywhere
// @match *://*/*
// @match https://*/*

// SAFE - specific targets
// @match https://example.com/*
// @match https://*.example.com/*
```

### 3. User Input Sanitised

**Check:** User-provided data is sanitised before DOM insertion.

```javascript
// DANGEROUS - XSS vulnerability
const userInput = prompt('Enter name:');
element.innerHTML = `Hello, ${userInput}!`;  // Can inject HTML/JS

// SAFE - use textContent
element.textContent = `Hello, ${userInput}!`;

// SAFE - escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
element.innerHTML = `Hello, ${escapeHtml(userInput)}!`;
```

### 4. HTTPS for External Requests

**Check:** All external URLs use HTTPS.

```javascript
// DANGEROUS - HTTP can be intercepted
// @connect http://api.example.com
GM_xmlhttpRequest({ url: 'http://api.example.com/data' });

// SAFE - HTTPS encrypted
// @connect api.example.com
GM_xmlhttpRequest({ url: 'https://api.example.com/data' });
```

### 5. No eval() or new Function()

**Check:** Script doesn't execute arbitrary code.

```javascript
// DANGEROUS - code injection risk
eval(userInput);
new Function(userInput)();
setTimeout(userInput, 1000);  // If userInput is a string

// SAFE - use proper callbacks
setTimeout(() => doSomething(), 1000);
```

---

## Header Validation

### Required Headers

```javascript
// ==UserScript==
// @name         ✓ Descriptive and unique
// @namespace    ✓ Your unique identifier
// @version      ✓ Semantic version (1.0.0)
// @description  ✓ Clear description
// @author       ✓ Your name
// @match        ✓ Specific URL patterns
// @grant        ✓ Only needed permissions
// ==/UserScript==
```

### Permission Minimisation

**Check:** Only necessary @grant statements are included.

```javascript
// BAD - excessive permissions
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @grant GM_notification
// @grant unsafeWindow
// @grant GM_download
// @grant GM_cookie

// GOOD - only what's needed
// @grant GM_addStyle
// (Script only modifies CSS)
```

### @connect Validation

**Check:** All @connect domains are legitimate and expected.

```javascript
// Verify each domain is needed
// @connect api.example.com      ✓ Main API
// @connect cdn.example.com      ✓ CDN resources
// @connect tracking.ads.com     ✗ Why is this here?
```

---

## Code Quality Checks

### 1. IIFE Wrapper

**Check:** Script is wrapped to prevent global pollution.

```javascript
// REQUIRED
(function() {
    'use strict';
    // Script code here
})();
```

### 2. Error Handling

**Check:** Async operations have error handlers.

```javascript
// BAD - no error handling
GM_xmlhttpRequest({
    url: 'https://api.example.com/data',
    onload: (r) => process(JSON.parse(r.responseText))
});

// GOOD - comprehensive error handling
GM_xmlhttpRequest({
    url: 'https://api.example.com/data',
    onload: (r) => {
        try {
            const data = JSON.parse(r.responseText);
            process(data);
        } catch (e) {
            console.error('Parse error:', e);
        }
    },
    onerror: (e) => console.error('Request failed:', e),
    ontimeout: () => console.error('Request timed out')
});
```

### 3. Null Checks

**Check:** DOM queries check for null before use.

```javascript
// BAD - crashes if element missing
document.querySelector('#target').click();

// GOOD - safe access
const el = document.querySelector('#target');
if (el) {
    el.click();
}

// BETTER - optional chaining
document.querySelector('#target')?.click();
```

---

## Performance Checks

### 1. No Infinite Loops

**Check:** Loops have proper exit conditions.

```javascript
// DANGEROUS - potential infinite loop
while (true) {
    if (condition) break;
}

// SAFE - bounded iterations
for (let i = 0; i < 1000; i++) {
    if (condition) break;
}
```

### 2. Observer Cleanup

**Check:** MutationObservers are disconnected when done.

```javascript
// BAD - runs forever
const observer = new MutationObserver(callback);
observer.observe(document.body, { childList: true, subtree: true });

// GOOD - disconnects when appropriate
const observer = new MutationObserver((mutations, obs) => {
    if (foundTarget) {
        obs.disconnect();
    }
});
```

### 3. Debounced Operations

**Check:** Frequent operations are throttled.

```javascript
// BAD - runs on every mutation
observer.observe(document.body, { childList: true, subtree: true });

// GOOD - debounced
let timeout;
const observer = new MutationObserver(() => {
    clearTimeout(timeout);
    timeout = setTimeout(processChanges, 100);
});
```

---

## Pre-Delivery Checklist

Before returning a userscript, verify:

### Critical (Must Pass)

- [ ] No hardcoded API keys, tokens, or passwords
- [ ] @match is specific (not `*://*/*`)
- [ ] All external URLs use HTTPS
- [ ] User input is sanitised before DOM insertion
- [ ] No eval() or string-based setTimeout/setInterval

### Important (Should Pass)

- [ ] Wrapped in IIFE with 'use strict'
- [ ] All @grant statements are necessary
- [ ] @connect includes all external domains
- [ ] Error handling for async operations
- [ ] Null checks before DOM manipulation

### Recommended (Nice to Have)

- [ ] @version follows semantic versioning
- [ ] MutationObservers are cleaned up
- [ ] Frequent operations are debounced
- [ ] Comments explain non-obvious code
- [ ] Works in both Chrome and Firefox

---

## Security Red Flags

Immediately question scripts that:

| Red Flag | Concern |
|----------|---------|
| `@match *://*/*` | Why does it need to run everywhere? |
| `@grant unsafeWindow` | Does it really need page context? |
| `eval()` or `new Function()` | Code injection risk |
| Hardcoded URLs to unknown domains | Data exfiltration? |
| `@connect *` without explanation | Where is data going? |
| Minified/obfuscated code | What is it hiding? |
| Requests to IP addresses | Suspicious destination |
| localStorage/cookie access without clear purpose | Data harvesting? |

---

## Safe Patterns

### Safe Data Storage

```javascript
// Use GM storage, not localStorage
GM_setValue('userPrefs', { theme: 'dark' });
const prefs = GM_getValue('userPrefs', {});
```

### Safe External Requests

```javascript
// Validate response before use
GM_xmlhttpRequest({
    url: 'https://api.example.com/data',
    onload: (r) => {
        if (r.status !== 200) {
            console.error('Unexpected status:', r.status);
            return;
        }

        let data;
        try {
            data = JSON.parse(r.responseText);
        } catch (e) {
            console.error('Invalid JSON');
            return;
        }

        if (!data.expected_field) {
            console.error('Missing expected field');
            return;
        }

        process(data);
    }
});
```

### Safe DOM Insertion

```javascript
// Create elements programmatically
const div = document.createElement('div');
div.textContent = userInput;  // Safe - no HTML parsing
div.className = 'my-class';
document.body.appendChild(div);
```
