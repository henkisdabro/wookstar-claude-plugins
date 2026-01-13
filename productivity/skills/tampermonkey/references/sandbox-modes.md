# Tampermonkey Sandbox Modes

Understanding script execution contexts and security sandboxing.

---

## Overview

Tampermonkey can inject userscripts into different execution contexts (worlds). The context affects:
- What the script can access
- Security isolation
- CSP (Content Security Policy) restrictions
- How to communicate with the page

---

## Execution Worlds

### MAIN_WORLD (Page Context)

Script runs in the same context as the page's JavaScript.

**Pros:**
- Direct access to page variables and functions
- No need for unsafeWindow
- Can modify page objects directly

**Cons:**
- Subject to page's CSP
- Can be detected by the page
- Security risks if page is malicious

### ISOLATED_WORLD (Content Script Context)

Script runs in an isolated context, separate from the page.

**Pros:**
- Protected from page scripts
- Can't be detected easily
- Safer execution

**Cons:**
- Cannot directly access page variables
- Need unsafeWindow for page interaction
- Some APIs may not work

### USERSCRIPT_WORLD (Firefox Only)

Special context created for userscripts, with enhanced capabilities.

**Pros:**
- Bypasses CSP
- Better isolation than MAIN_WORLD
- Supports document-start timing

**Cons:**
- Firefox only
- Need cloneInto/exportFunction for page communication

---

## @sandbox Directive

Control where your script runs using @sandbox.

### @sandbox raw

Request to run in page context (MAIN_WORLD).

```javascript
// @sandbox raw

// Direct page access
console.log(window.pageVariable);  // Works
pageFunction();  // Works
```

**Use when:**
- You need direct page variable access
- Page CSP doesn't block inline scripts
- You don't need isolation

### @sandbox JavaScript

Request access to unsafeWindow. May use USERSCRIPT_WORLD on Firefox.

```javascript
// @sandbox JavaScript

// Access page through unsafeWindow
console.log(unsafeWindow.pageVariable);
unsafeWindow.pageFunction();
```

**Use when:**
- You need unsafeWindow access
- You want CSP bypass (Firefox)
- Default for most scripts needing page interaction

### @sandbox DOM

Only need DOM access, no page JavaScript access.

```javascript
// @sandbox DOM

// DOM access works
document.querySelector('#element').textContent = 'Modified';

// Page variables are NOT accessible
// window.pageVariable is undefined
```

**Use when:**
- Only modifying DOM/CSS
- Don't need page JavaScript access
- Want maximum isolation

---

## @grant none

Disables the sandbox entirely.

```javascript
// @grant none

// Runs in page context
// No GM_* functions available (except GM_info)
console.log(window.pageVariable);  // Direct access
```

**When to use:**
- Simple scripts that don't need GM_* APIs
- Direct page integration needed
- Smallest footprint

**What you lose:**
- All GM_* functions (except GM_info)
- Cross-origin requests
- Persistent storage
- CSP bypass

---

## Firefox: cloneInto and exportFunction

When running in USERSCRIPT_WORLD, you need special functions to share data with the page.

### cloneInto

Clone an object so the page can access it.

```javascript
// Share data with page
const data = { name: 'John', count: 42 };
unsafeWindow.myData = cloneInto(data, unsafeWindow);

// Clone with functions
const obj = { getValue: () => 42 };
unsafeWindow.myObj = cloneInto(obj, unsafeWindow, { cloneFunctions: true });
```

### exportFunction

Export a function so the page can call it.

```javascript
// Export a function
function myHandler(arg) {
    console.log('Called with:', arg);
    return 'response';
}

unsafeWindow.myHandler = exportFunction(myHandler, unsafeWindow);

// Page can now call: myHandler('hello')
```

### Complete Example

```javascript
// @sandbox JavaScript

// Create an API for the page
const scriptAPI = {
    version: '1.0.0',
    getData: function() {
        return GM_getValue('data', null);
    },
    setData: function(data) {
        GM_setValue('data', data);
    }
};

// Export to page
if (typeof cloneInto !== 'undefined') {
    // Firefox - need to export
    unsafeWindow.ScriptAPI = cloneInto(scriptAPI, unsafeWindow, {
        cloneFunctions: true
    });
} else {
    // Chrome - direct assignment works
    unsafeWindow.ScriptAPI = scriptAPI;
}
```

---

## Content Security Policy (CSP)

### What CSP Blocks

CSP can prevent:
- Inline `<script>` tags
- eval() and new Function()
- Inline event handlers
- Loading scripts from non-whitelisted domains

### How Tampermonkey Bypasses CSP

| Context | CSP Bypass |
|---------|------------|
| MAIN_WORLD | No - subject to CSP |
| ISOLATED_WORLD | Partial - script runs, but injected scripts may be blocked |
| USERSCRIPT_WORLD | Yes - bypasses CSP |

### Techniques for CSP Issues

**Use GM_addElement instead of createElement:**

```javascript
// This may be blocked by CSP:
const script = document.createElement('script');
script.textContent = 'console.log("blocked")';
document.head.appendChild(script);

// This bypasses CSP:
GM_addElement('script', {
    textContent: 'console.log("works")'
});
```

**Use @require for external scripts:**

```javascript
// Instead of dynamically loading scripts, use @require
// @require https://code.jquery.com/jquery-3.6.0.min.js
```

---

## Content Script API Setting

In Tampermonkey settings, you can configure how scripts are injected:

### Content Script (Default)

- Scripts injected via content script API
- Retrieved via messaging
- No true document-start support

### UserScripts API

- Uses browser's UserScripts API
- Chrome: via messaging, no document-start
- Firefox: instant execution, document-start works

### UserScripts API Dynamic

- Both wrapper and script injected via API
- True document-start support
- Most compatible

---

## Detecting the Current Context

```javascript
// Check if in isolated world
const isIsolated = typeof cloneInto !== 'undefined';

// Check sandbox mode from GM_info
console.log('Sandbox mode:', GM_info.sandboxMode);
// Values: 'js', 'raw', 'dom'

// Check if page objects are directly accessible
const hasDirectAccess = window.somePageVariable !== undefined;
```

---

## Best Practices

### 1. Start with @sandbox DOM

If you only need DOM access, use the most restrictive mode:

```javascript
// @sandbox DOM
// Most isolated, safest
```

### 2. Use @sandbox JavaScript for page interaction

```javascript
// @sandbox JavaScript
// Access page via unsafeWindow
const pageData = unsafeWindow.APP_CONFIG;
```

### 3. Handle cross-browser differences

```javascript
// Works in all contexts
function shareWithPage(name, value) {
    if (typeof cloneInto !== 'undefined') {
        // Firefox USERSCRIPT_WORLD
        unsafeWindow[name] = cloneInto(value, unsafeWindow, {
            cloneFunctions: true
        });
    } else {
        // Chrome or MAIN_WORLD
        unsafeWindow[name] = value;
    }
}
```

### 4. Test in multiple browsers

Different browsers may behave differently. Test in:
- Chrome (Manifest V3)
- Firefox
- Edge
- Safari (if using Userscripts app)
