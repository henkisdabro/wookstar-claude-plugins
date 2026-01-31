# Browser Compatibility Guide

Cross-browser differences and compatibility matrix for Tampermonkey userscripts.

---

## Browser Support Matrix

| Feature | Chrome | Firefox | Edge | Safari | Opera |
|---------|--------|---------|------|--------|-------|
| **Tampermonkey** | ✅ | ✅ | ✅ | ⚠️ Userscripts app | ✅ |
| **Manifest Version** | V3 | V2 | V3 | N/A | V3 |

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
| `@sandbox raw` | ✅ | ✅ | Page context |
| `@sandbox JavaScript` | ✅ | ✅ USERSCRIPT_WORLD | Firefox has special context |
| `@sandbox DOM` | ✅ | ✅ | Isolated context |
| `document-start` timing | ⚠️ | ✅ | Firefox more reliable |
| `cloneInto` | ❌ | ✅ | Firefox only |
| `exportFunction` | ❌ | ✅ | Firefox only |

---

## Manifest V3 Limitations (Chrome/Edge)

Chrome and Edge use Manifest V3, which restricts certain features:

### What Doesn't Work in MV3

1. **@webRequest** - Request interception is blocked
2. **Some background script patterns** - Persistent background pages removed
3. **Certain CSP bypass methods** - More restricted

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

Firefox supports container tabs for privacy isolation.

```javascript
// @run-in container-id-2
// @run-in container-id-3

// Get container ID at runtime
console.log('Container:', GM_info.container);
// { id: "2", name: "Personal" }
```

---

## Safari Support

Safari uses a third-party app called "Userscripts" (not Tampermonkey).

### Key Differences

| Feature | Safari Userscripts | Tampermonkey |
|---------|-------------------|--------------|
| Installation | Mac App Store | Browser extension |
| @grant support | Limited | Full |
| GM_* APIs | Subset | Full |
| Auto-update | Manual | Automatic |

### Writing Safari-Compatible Scripts

```javascript
// Check if running in Safari Userscripts app
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// Use only widely-supported APIs
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest

// Avoid Safari-incompatible features
// @grant GM_webRequest  // May not work
// @grant GM_audio       // May not work
```

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
4. ⚠️ Test in Safari if targeting Mac users

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

```javascript
// Check Tampermonkey version
const version = GM_info.version;
console.log('Tampermonkey version:', version);

// Feature detection is safer than version checking
if (typeof GM_audio !== 'undefined') {
    // Use GM_audio
}
```
