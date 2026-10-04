# Browser Compatibility Guide

Cross-browser differences and compatibility matrix for Tampermonkey userscripts.

---

## Browser Support Matrix

| Feature | Chrome | Firefox | Edge | Safari | Opera |
|---------|--------|---------|------|--------|-------|
| **Tampermonkey** | ✅ | ✅ | ✅ | ✅ App Store (paid) | ✅ |
| **MV3 userscript limits** | Yes | No | Yes | - | Yes |
| **"Allow User Scripts" / Developer Mode needed** | Yes | No | Yes | No | Yes |

### API Compatibility

| API | Chrome | Firefox | Edge | Notes |
|-----|--------|---------|------|-------|
| `GM_setValue/getValue` | ✅ | ✅ | ✅ | Universal |
| `GM_xmlhttpRequest` | ✅ | ✅ | ✅ | Universal |
| `GM_addStyle` | ✅ | ✅ | ✅ | Universal |
| `GM_addElement` | ✅ | ✅ | ✅ | Universal |
| `GM_notification` | ✅ | ✅ | ✅ | Universal |
| `GM_download` | ✅ | ✅ | ✅ | Universal |
| `GM_openInTab` | ✅ | ✅ | ✅ | Universal |
| `GM_registerMenuCommand` | ✅ | ✅ | ✅ | Universal |
| `GM_cookie` | ✅ | ✅ | ✅ | Universal |
| `GM_webRequest` | ❌ MV3 | ✅ | ❌ MV3 | Firefox only now |
| `GM_audio` | ✅ | ✅ | ✅ | v5.0+ |
| `window.onurlchange` | ✅ | ✅ | ✅ | Universal |
| `unsafeWindow` | ✅ | ✅ | ✅ | Universal |

### Sandbox & Execution Context

| Feature | Chrome | Firefox | Notes |
|---------|--------|---------|-------|
| `@sandbox raw` | ✅ | ✅ | Page context (MAIN_WORLD); the default when `@sandbox` is omitted |
| `@sandbox JavaScript` | ✅ page context | ✅ USERSCRIPT_WORLD | Only Firefox gets the special context; other browsers fall back to `raw` |
| `@sandbox DOM` | ✅ | ✅ | Extension content-script context (ISOLATED_WORLD) |
| `document-start` timing | ⚠️ | ✅ | Firefox more reliable |
| `cloneInto` | ❌ | ✅ | Firefox only |
| `exportFunction` | ❌ | ✅ | Firefox only |

---

## Manifest V3 Limitations (Chrome/Edge)

Chrome, Edge and other Chromium browsers run the Manifest V3 build of Tampermonkey, which restricts certain features:

### The user must allow userscripts

No script runs until the user enables **Allow User Scripts** on Tampermonkey's extension details page (Chrome 138+), or Developer Mode on `chrome://extensions` / `edge://extensions` where that toggle is absent. Tampermonkey 5.5.1 made this permission mandatory for injection. When a user reports that nothing runs at all, ask about this before debugging the script. See [Tampermonkey FAQ Q209](https://www.tampermonkey.net/faq.php?q=Q209).

### What Doesn't Work in MV3

1. **`@webRequest` / `GM_webRequest`** - not available in MV3 builds since Tampermonkey 5.2
2. **Some background script patterns** - Persistent background pages removed
3. **Certain CSP bypass methods** - More restricted

Users who still need an MV2 build are covered by [FAQ Q408](https://www.tampermonkey.net/faq.php?q=Q408); Chrome has been removing the policy that allows it, so do not design scripts around it.

### Workarounds

```javascript
// Instead of @webRequest, use page-level interception
// @grant unsafeWindow

// Intercept fetch
const originalFetch = unsafeWindow.fetch;
unsafeWindow.fetch = function(...args) {
    console.log('Intercepted fetch:', args[0]);
    return originalFetch.apply(this, args);
};

// Intercept XMLHttpRequest
const originalOpen = unsafeWindow.XMLHttpRequest.prototype.open;
unsafeWindow.XMLHttpRequest.prototype.open = function(method, url) {
    console.log('Intercepted XHR:', method, url);
    return originalOpen.apply(this, arguments);
};
```

---

## Firefox-Specific Features

### cloneInto and exportFunction

Firefox's USERSCRIPT_WORLD requires special functions to share data with the page.

```javascript
// Share object with page (Firefox)
function shareWithPage(name, value) {
    if (typeof cloneInto !== 'undefined') {
        // Firefox - must use cloneInto
        unsafeWindow[name] = cloneInto(value, unsafeWindow, {
            cloneFunctions: true
        });
    } else {
        // Chrome - direct assignment works
        unsafeWindow[name] = value;
    }
}

// Export function for page to call (Firefox)
function exportToPage(name, fn) {
    if (typeof exportFunction !== 'undefined') {
        // Firefox
        unsafeWindow[name] = exportFunction(fn, unsafeWindow);
    } else {
        // Chrome
        unsafeWindow[name] = fn;
    }
}

// Usage
shareWithPage('myData', { count: 42, items: ['a', 'b'] });
exportToPage('myFunction', (arg) => console.log('Called with:', arg));
```

### Firefox Containers

Firefox supports container tabs for privacy isolation. Tampermonkey 5.5.1 dropped Firefox's contextual-identities permission again ([gh:2792](https://github.com/Tampermonkey/tampermonkey/issues/2792)), because holding it forced container tabs on for every user. Scripts can therefore no longer open container tabs or start downloads in a container; test container-based `@run-in` on the user's installed version before relying on it.

```javascript
// @run-in container-id-2
// @run-in container-id-3

// Get container ID at runtime
console.log('Container:', GM_info.container);
// { id: "2", name: "Personal" }
```

---

## Safari Support

Tampermonkey is available for Safari as a paid App Store extension; it has its own release line and changelog. Some APIs (notably `GM_webRequest`) are unavailable, so stick to widely supported grants and use feature detection (below) for anything else. Test on Safari before promising support.

---

## Cross-Browser Best Practices

### 1. Feature Detection

```javascript
// Check if API exists before using
if (typeof GM_notification !== 'undefined') {
    GM_notification('Hello!');
} else {
    alert('Hello!');  // Fallback
}

// Check for Firefox-specific features
const isFirefox = typeof cloneInto !== 'undefined';
```

### 2. Graceful Degradation

```javascript
// Provide fallbacks for unsupported features
async function showNotification(message) {
    if (typeof GM_notification !== 'undefined') {
        GM_notification({ text: message });
    } else if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(message);
    } else {
        console.log('Notification:', message);
    }
}
```

### 3. Avoid Browser-Specific Code

```javascript
// Wrong - breaks in other browsers
if (navigator.userAgent.includes('Firefox')) {
    // Firefox-specific code
}

// Right - feature detection
if (typeof exportFunction !== 'undefined') {
    // Use exportFunction
} else {
    // Use alternative
}
```

### 4. Test in Multiple Browsers

Before releasing a script:

1. ✅ Test in Chrome (most common)
2. ✅ Test in Firefox (second most common)
3. ✅ Test in Edge (uses same engine as Chrome)
4. ⚠️ Test in Safari (Tampermonkey for Safari) if targeting Mac users

---

## Browser-Specific Bugs & Workarounds

### Chrome: document-start Timing

Chrome's document-start isn't always reliable.

```javascript
// @run-at document-start

// May not run early enough - add fallback
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();  // Already loaded
}
```

### Firefox: Strict CSP Sites

Some sites have strict CSP that even Tampermonkey can't bypass.

```javascript
// If GM_addElement fails, try @require instead
// @require https://example.com/library.js

// Or inject via unsafeWindow
unsafeWindow.eval('console.log("injected")');  // Last resort
```

### Edge: Extension Sync Issues

Edge sometimes doesn't sync Tampermonkey settings.

**Workaround:** Export/import settings manually between devices.

---

## Version Requirements

Some features require specific Tampermonkey versions:

| Feature | Minimum Version |
|---------|-----------------|
| `GM.* async APIs` | 4.0+ |
| `GM_audio` | 5.0+ |
| `@tag` | 5.0+ |
| `GM_notification.tag` | 5.0+ |
| `@run-in` | 5.3+ |
| `GM_setValues/getValues` | 5.3+ |
| "Allow User Scripts" permission mandatory (Chrome/Edge) | 5.5.1 |

```javascript
// Check Tampermonkey version
const version = GM_info.version;
console.log('Tampermonkey version:', version);

// Feature detection is safer than version checking
if (typeof GM_audio !== 'undefined') {
    // Use GM_audio
}
```
