# Debugging Userscripts

How to troubleshoot and fix broken userscripts.

---

## Quick Diagnostic Checklist

When a script doesn't work, check these first:

```
[ ] 1. Is the script enabled in Tampermonkey dashboard?
[ ] 2. Does the @match pattern match the current URL?
[ ] 3. Are there errors in the browser console? (F12)
[ ] 4. Are all required @grant statements present?
[ ] 5. Does @connect include all external domains?
[ ] 6. Is the element present when the script runs?
```

---

## Viewing Script Errors

### Browser Console (Recommended)

1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Look for red error messages
4. Filter by "userscript" if needed

### Tampermonkey Dashboard

1. Click Tampermonkey icon → **Dashboard**
2. Look for scripts with error indicators
3. Click script name → **Editor** to see inline errors

---

## Testing if Script Runs

### Method 1: Alert (Most Obvious)

```javascript
// ==UserScript==
// @name         Test Script
// @match        https://example.com/*
// ==/UserScript==

alert('Script is running!');  // Will definitely show if script loads
```

### Method 2: Console Log

```javascript
console.log('=== USERSCRIPT LOADED ===');
console.log('URL:', location.href);
console.log('Time:', new Date().toISOString());
```

### Method 3: Visual Indicator

```javascript
// @grant GM_addStyle

GM_addStyle(`
    body::before {
        content: 'Script Active';
        position: fixed;
        top: 0;
        right: 0;
        background: green;
        color: white;
        padding: 5px 10px;
        z-index: 999999;
        font-size: 12px;
    }
`);
```

---

## Common Error Messages

### "Cannot read property 'X' of null"

**Cause:** Element doesn't exist when script runs.

```javascript
// Error
document.querySelector('#missing').textContent = 'Hi';

// Fix: Check if element exists
const el = document.querySelector('#missing');
if (el) {
    el.textContent = 'Hi';
} else {
    console.log('Element not found');
}

// Better fix: Wait for element
waitForElement('#missing').then(el => {
    el.textContent = 'Hi';
});
```

### "GM_xxx is not defined"

**Cause:** Missing @grant statement.

```javascript
// Error - forgot @grant
GM_setValue('key', 'value');  // ReferenceError

// Fix - add @grant
// @grant GM_setValue
GM_setValue('key', 'value');  // Works
```

### "Access to XMLHttpRequest blocked by CORS"

**Cause:** Using native fetch/XHR instead of GM_xmlhttpRequest.

```javascript
// Error - blocked by CORS
fetch('https://api.example.com/data');

// Fix - use GM_xmlhttpRequest
// @grant GM_xmlhttpRequest
// @connect api.example.com

GM_xmlhttpRequest({
    url: 'https://api.example.com/data',
    onload: (r) => console.log(r.responseText)
});
```

### "Content Security Policy" errors

**Cause:** Site's CSP blocks inline scripts.

```javascript
// Error - blocked by CSP
const script = document.createElement('script');
script.textContent = 'console.log("blocked")';
document.head.appendChild(script);

// Fix - use GM_addElement
// @grant GM_addElement
GM_addElement('script', {
    textContent: 'console.log("works")'
});
```

---

## Debugging Techniques

### 1. Isolate the Problem

Comment out sections to find what's breaking:

```javascript
console.log('Step 1');
// doSomething();

console.log('Step 2');
// doSomethingElse();

console.log('Step 3');
// maybeBroken();  // Uncomment one at a time
```

### 2. Log Variables

```javascript
const element = document.querySelector('#target');
console.log('Element:', element);
console.log('Element exists:', !!element);
console.log('Element HTML:', element?.outerHTML);
```

### 3. Breakpoints

```javascript
// Pause execution here
debugger;

// Or set breakpoints in DevTools:
// 1. F12 → Sources tab
// 2. Find your script (search for script name)
// 3. Click line number to set breakpoint
```

### 4. Network Tab

For GM_xmlhttpRequest issues:

1. F12 → **Network** tab
2. Look for your request
3. Check **Headers**, **Response**, **Timing**
4. Red = failed request

### 5. Test @match Pattern

```javascript
// Log when script runs to verify @match
console.log('Script matched:', location.href);

// Test pattern manually:
// @match https://example.com/*
// Should match: https://example.com/page
// Should NOT match: https://other.com/example.com
```

---

## Debugging Async Code

### Problem: Callback Not Firing

```javascript
GM_xmlhttpRequest({
    url: 'https://api.example.com/data',
    onload: (response) => {
        console.log('Response received');  // Never logs
    }
});

// Debug: Add all callbacks
GM_xmlhttpRequest({
    url: 'https://api.example.com/data',
    onload: (r) => console.log('Success:', r.status),
    onerror: (e) => console.log('Error:', e),
    ontimeout: () => console.log('Timeout'),
    onabort: () => console.log('Aborted')
});
```

### Problem: Promise Never Resolves

```javascript
// Stuck promise
const data = await someAsyncFunction();  // Never continues

// Debug: Add timeout
const data = await Promise.race([
    someAsyncFunction(),
    new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout after 10s')), 10000)
    )
]);
```

---

## Debugging Element Waiting

### Check if Element Ever Appears

```javascript
// Watch for element in console
const observer = new MutationObserver((mutations) => {
    const el = document.querySelector('#target');
    if (el) {
        console.log('FOUND:', el);
        observer.disconnect();
    }
});
observer.observe(document.body, { childList: true, subtree: true });

// After 30 seconds, report if not found
setTimeout(() => {
    if (document.querySelector('#target') === null) {
        console.log('Element never appeared after 30s');
        console.log('Current DOM:', document.body.innerHTML.substring(0, 1000));
    }
}, 30000);
```

---

## Debugging Storage

### Verify Values Are Saved

```javascript
// Save
GM_setValue('test', { foo: 'bar' });
console.log('Saved');

// Read back immediately
const value = GM_getValue('test');
console.log('Retrieved:', value);
console.log('Type:', typeof value);

// List all keys
const keys = GM_listValues();
console.log('All keys:', keys);
```

### Clear Storage for Fresh Start

```javascript
// Delete all stored values
GM_listValues().forEach(key => {
    console.log('Deleting:', key);
    GM_deleteValue(key);
});
```

---

## Browser-Specific Debugging

### Chrome DevTools Tips

- **Sources** → **Content Scripts** shows userscripts
- **Application** → **Storage** shows extension data
- Use **Snippets** to test code quickly

### Firefox DevTools Tips

- **Debugger** → Search for script name
- About:debugging → This Firefox → Tampermonkey → Inspect
- Firefox shows better error messages for cloneInto issues

---

## Getting Help

If you can't solve the issue:

1. **Check Tampermonkey forums** - Search for similar issues
2. **Provide minimal reproduction** - Smallest script that shows the bug
3. **Include browser/TM version** - Found in GM_info
4. **Share console errors** - Copy the exact error message

```javascript
// Get debug info to share
console.log('Browser:', navigator.userAgent);
console.log('Tampermonkey:', GM_info.version);
console.log('Script:', GM_info.script.name, GM_info.script.version);
```
