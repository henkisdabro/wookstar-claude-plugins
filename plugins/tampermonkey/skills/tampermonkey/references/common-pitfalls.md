# Common Userscript Pitfalls

Mistakes that break userscripts and how to avoid them.

---

## Pitfall 1: @match Too Broad

Running on every page slows the browser and causes unexpected behaviour.

**Wrong:**
```javascript
// @match *://*/*
// @match https://*/*
```

**Right:**
```javascript
// @match https://example.com/*
// @match https://*.example.com/*
```

**Why it matters:** Overly broad patterns mean your script runs on thousands of sites, consuming memory and potentially breaking pages.

---

## Pitfall 2: Missing @connect

Cross-origin requests fail silently or show permission dialogs without @connect.

**Wrong:**
```javascript
// @grant GM_xmlhttpRequest
// No @connect declaration

GM_xmlhttpRequest({
    url: 'https://api.example.com/data',  // Will prompt or fail
    ...
});
```

**Right:**
```javascript
// @grant GM_xmlhttpRequest
// @connect api.example.com

GM_xmlhttpRequest({
    url: 'https://api.example.com/data',  // Works
    ...
});
```

**Best practice:** Declare all known domains, then add `@connect *` as fallback.

---

## Pitfall 3: Not Waiting for Elements

Elements may not exist when your script runs, especially on SPAs.

**Wrong:**
```javascript
// @run-at document-end

// Element might not exist yet!
document.querySelector('#dynamic-content').textContent = 'Modified';
// TypeError: Cannot read property 'textContent' of null
```

**Right:**
```javascript
// Use waitForElement pattern
async function init() {
    const element = await waitForElement('#dynamic-content');
    element.textContent = 'Modified';
}

function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const el = document.querySelector(selector);
        if (el) return resolve(el);

        const observer = new MutationObserver((_, obs) => {
            const el = document.querySelector(selector);
            if (el) {
                obs.disconnect();
                resolve(el);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Timeout: ${selector}`));
        }, timeout);
    });
}

init();
```

---

## Pitfall 4: Blocking Async Operations

GM_xmlhttpRequest is asynchronous - you can't use its return value directly.

**Wrong:**
```javascript
const response = GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://api.example.com/data'
});
console.log(response.responseText);  // undefined!
```

**Right (callback):**
```javascript
GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://api.example.com/data',
    onload: function(response) {
        console.log(response.responseText);  // Works
    }
});
```

**Right (async/await with GM.*):**
```javascript
const response = await GM.xmlHttpRequest({
    method: 'GET',
    url: 'https://api.example.com/data'
});
console.log(response.responseText);  // Works
```

---

## Pitfall 5: CSP Blocking Script Injection

Content Security Policy blocks dynamically created scripts.

**Wrong:**
```javascript
const script = document.createElement('script');
script.textContent = 'console.log("blocked by CSP")';
document.head.appendChild(script);  // Blocked!
```

**Right:**
```javascript
// @grant GM_addElement

GM_addElement('script', {
    textContent: 'console.log("bypasses CSP")'
});
```

---

## Pitfall 6: Sandbox Context Confusion

Without unsafeWindow, you can't access page variables.

**Wrong:**
```javascript
// @grant none

// Trying to access page's React app
console.log(window.React);  // undefined in sandbox
```

**Right:**
```javascript
// @grant unsafeWindow

console.log(unsafeWindow.React);  // Works
```

**Note:** `@grant none` disables the sandbox entirely (different approach).

---

## Pitfall 7: Memory Leaks in Observers

MutationObservers that never disconnect consume memory.

**Wrong:**
```javascript
const observer = new MutationObserver(() => {
    processNewContent();
});
observer.observe(document.body, { childList: true, subtree: true });
// Never disconnected - runs forever!
```

**Right:**
```javascript
const observer = new MutationObserver(() => {
    if (shouldStop()) {
        observer.disconnect();
        return;
    }
    processNewContent();
});
observer.observe(document.body, { childList: true, subtree: true });

// Or disconnect on page unload
window.addEventListener('beforeunload', () => observer.disconnect());
```

---

## Pitfall 8: Overly Aggressive DOM Modifications

Modifying the DOM too frequently causes performance issues.

**Wrong:**
```javascript
// Runs on EVERY mutation
const observer = new MutationObserver(() => {
    document.querySelectorAll('.item').forEach(el => {
        el.style.color = 'red';  // Runs thousands of times
    });
});
```

**Right:**
```javascript
// Debounce modifications
let timeout;
const observer = new MutationObserver(() => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        document.querySelectorAll('.item:not(.processed)').forEach(el => {
            el.style.color = 'red';
            el.classList.add('processed');
        });
    }, 100);
});
```

---

## Pitfall 9: Forgetting Error Handling

Network requests and async operations can fail.

**Wrong:**
```javascript
GM_xmlhttpRequest({
    url: 'https://api.example.com/data',
    onload: (r) => {
        const data = JSON.parse(r.responseText);  // Crashes if invalid JSON
        process(data);
    }
});
```

**Right:**
```javascript
GM_xmlhttpRequest({
    url: 'https://api.example.com/data',
    onload: (r) => {
        try {
            const data = JSON.parse(r.responseText);
            process(data);
        } catch (e) {
            console.error('Failed to parse response:', e);
        }
    },
    onerror: (e) => {
        console.error('Request failed:', e);
    },
    ontimeout: () => {
        console.error('Request timed out');
    }
});
```

---

## Pitfall 10: Global Variable Pollution

Variables leak into page scope without IIFE wrapper.

**Wrong:**
```javascript
// ==UserScript==
// ...
// ==/UserScript==

var myData = 'secret';  // Visible to page as window.myData!
function process() { ... }  // Visible to page
```

**Right:**
```javascript
// ==UserScript==
// ...
// ==/UserScript==

(function() {
    'use strict';

    var myData = 'secret';  // Private to script
    function process() { ... }  // Private to script
})();
```

---

## Pitfall 11: Wrong Timing with @run-at

Script runs before elements exist.

**Wrong:**
```javascript
// @run-at document-start

document.querySelector('#header').remove();  // null - DOM doesn't exist yet!
```

**Right:**
```javascript
// @run-at document-end

document.querySelector('#header').remove();  // Works
```

**Or wait for DOM:**
```javascript
// @run-at document-start

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#header').remove();
});
```

---

## Pitfall 12: Cross-Browser Differences

Firefox and Chrome behave differently.

**Firefox-only features:**
```javascript
// cloneInto and exportFunction only exist in Firefox
if (typeof cloneInto !== 'undefined') {
    unsafeWindow.myData = cloneInto(data, unsafeWindow);
} else {
    unsafeWindow.myData = data;  // Chrome
}
```

**Manifest V3 limitations (Chrome):**
```javascript
// @webRequest doesn't work in Chrome MV3
// Use alternative approaches or inform user
```

---

## Pitfall 13: Hardcoded Selectors

Page structure changes break scripts.

**Fragile:**
```javascript
document.querySelector('div.sc-1234abcd > div:nth-child(3) > span');
```

**Robust:**
```javascript
// Use stable attributes
document.querySelector('[data-testid="username"]');
document.querySelector('[aria-label="Close"]');

// Or multiple fallbacks
const element = document.querySelector('#username') ||
                document.querySelector('[data-user]') ||
                document.querySelector('.profile-name');
```

---

## Pitfall 14: Not Testing in Target Browser

Scripts that work in Chrome may break in Firefox.

**Before deploying:**
1. Test in Chrome
2. Test in Firefox
3. Test in private/incognito mode
4. Test with page's CSP (disable extensions to check)

---

## Quick Diagnostic Checklist

When a script doesn't work:

```
[ ] Console shows errors? (F12 → Console)
[ ] Script is enabled in Tampermonkey dashboard?
[ ] @match pattern matches current URL?
[ ] Required @grant statements present?
[ ] @connect includes target domains?
[ ] Element exists when script runs?
[ ] Using async correctly (callbacks/await)?
[ ] Browser-specific features used correctly?
```
