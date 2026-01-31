# Tampermonkey Common Patterns

Reusable patterns and templates for common userscript tasks.

---

## Page Load Detection

### Wait for DOM Ready

```javascript
// For @run-at document-start scripts
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    console.log('DOM is ready');
}
```

### Wait for Specific Element

```javascript
function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
        // Check if already exists
        const existing = document.querySelector(selector);
        if (existing) return resolve(existing);

        // Set up observer
        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                obs.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        // Timeout
        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Timeout waiting for ${selector}`));
        }, timeout);
    });
}

// Usage
waitForElement('#main-content').then(el => {
    console.log('Found element:', el);
}).catch(err => {
    console.log('Element not found:', err);
});
```

### Wait for Multiple Elements

```javascript
async function waitForElements(selectors, timeout = 10000) {
    const results = {};
    await Promise.all(selectors.map(async selector => {
        results[selector] = await waitForElement(selector, timeout);
    }));
    return results;
}

// Usage
const elements = await waitForElements(['#header', '#footer', '.sidebar']);
```

---

## DOM Mutation Observation

### Watch for Dynamic Content

```javascript
function observeDOM(targetSelector, callback, options = {}) {
    const target = document.querySelector(targetSelector) || document.body;

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        callback(node, 'added');
                    }
                });
            }
        }
    });

    observer.observe(target, {
        childList: true,
        subtree: true,
        ...options
    });

    return observer;
}

// Usage - watch for new posts
observeDOM('#feed', (node, action) => {
    if (node.matches('.post')) {
        console.log('New post added:', node);
        processPost(node);
    }
});
```

### Debounced Observer

```javascript
function observeDOMDebounced(target, callback, delay = 100) {
    let timeout;

    const observer = new MutationObserver(() => {
        clearTimeout(timeout);
        timeout = setTimeout(callback, delay);
    });

    observer.observe(target, { childList: true, subtree: true });
    return observer;
}

// Usage - process changes once they settle
observeDOMDebounced(document.body, () => {
    console.log('DOM changes settled');
    processPage();
});
```

---

## SPA Navigation Handling

### URL Change Detection

```javascript
// @grant window.onurlchange

let currentUrl = location.href;

function handleUrlChange() {
    if (location.href !== currentUrl) {
        currentUrl = location.href;
        console.log('URL changed:', currentUrl);
        onPageChange();
    }
}

// Method 1: window.onurlchange (if granted)
if (window.onurlchange === null) {
    window.addEventListener('urlchange', handleUrlChange);
}

// Method 2: History API interception
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function() {
    originalPushState.apply(this, arguments);
    handleUrlChange();
};

history.replaceState = function() {
    originalReplaceState.apply(this, arguments);
    handleUrlChange();
};

window.addEventListener('popstate', handleUrlChange);
```

### Route-Based Handlers

```javascript
const routes = {
    '/': homeHandler,
    '/profile': profileHandler,
    '/settings': settingsHandler,
    '/post/:id': postHandler
};

function matchRoute(path) {
    for (const [pattern, handler] of Object.entries(routes)) {
        const regex = new RegExp('^' + pattern.replace(/:(\w+)/g, '(?<$1>[^/]+)') + '$');
        const match = path.match(regex);
        if (match) {
            return { handler, params: match.groups || {} };
        }
    }
    return null;
}

function onPageChange() {
    const route = matchRoute(location.pathname);
    if (route) {
        route.handler(route.params);
    }
}

function postHandler(params) {
    console.log('Viewing post:', params.id);
}
```

---

## Element Manipulation

### Inject HTML

```javascript
function injectHTML(targetSelector, html, position = 'beforeend') {
    const target = document.querySelector(targetSelector);
    if (target) {
        target.insertAdjacentHTML(position, html);
    }
}

// Positions: beforebegin, afterbegin, beforeend, afterend
injectHTML('#container', '<div class="injected">Hello</div>', 'afterbegin');
```

### Remove Elements

```javascript
function removeElements(selector) {
    document.querySelectorAll(selector).forEach(el => el.remove());
}

// Hide elements with CSS (faster, reversible)
function hideElements(selector) {
    GM_addStyle(`${selector} { display: none !important; }`);
}

// Usage
removeElements('.ads, .sponsored, .promoted');
hideElements('[data-ad], .advertisement');
```

### Replace Text

```javascript
function replaceText(find, replace, root = document.body) {
    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    const textNodes = [];
    while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
    }

    textNodes.forEach(node => {
        if (node.nodeValue.includes(find)) {
            node.nodeValue = node.nodeValue.replace(new RegExp(find, 'g'), replace);
        }
    });
}

// Usage
replaceText('old term', 'new term');
```

---

## Form Enhancement

### Auto-Fill Forms

```javascript
function autoFill(fieldValues) {
    for (const [selector, value] of Object.entries(fieldValues)) {
        const field = document.querySelector(selector);
        if (field) {
            field.value = value;
            // Trigger change event for reactive frameworks
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
}

// Usage
autoFill({
    '#email': 'user@example.com',
    '#name': 'John Doe',
    'input[name="phone"]': '555-1234'
});
```

### Form Validation Enhancement

```javascript
function enhanceValidation(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) return;

    form.addEventListener('submit', (e) => {
        const email = form.querySelector('[type="email"]');
        const password = form.querySelector('[type="password"]');

        let valid = true;

        if (email && !email.value.includes('@')) {
            showError(email, 'Invalid email address');
            valid = false;
        }

        if (password && password.value.length < 8) {
            showError(password, 'Password must be at least 8 characters');
            valid = false;
        }

        if (!valid) {
            e.preventDefault();
        }
    });
}

function showError(field, message) {
    let error = field.nextElementSibling;
    if (!error || !error.classList.contains('field-error')) {
        error = document.createElement('span');
        error.className = 'field-error';
        error.style.color = 'red';
        field.parentNode.insertBefore(error, field.nextSibling);
    }
    error.textContent = message;
}
```

---

## Keyboard Shortcuts

### Simple Keyboard Handler

```javascript
document.addEventListener('keydown', (e) => {
    // Ignore when typing in inputs
    if (e.target.matches('input, textarea, [contenteditable]')) return;

    // Ctrl+Shift+S
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        saveAction();
    }

    // Alt+D
    if (e.altKey && e.key === 'd') {
        e.preventDefault();
        toggleDarkMode();
    }
});
```

### Keyboard Shortcut Manager

```javascript
const shortcuts = new Map();

function registerShortcut(combo, callback, description) {
    shortcuts.set(combo.toLowerCase(), { callback, description });
}

document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea, [contenteditable]')) return;

    const parts = [];
    if (e.ctrlKey) parts.push('ctrl');
    if (e.altKey) parts.push('alt');
    if (e.shiftKey) parts.push('shift');
    parts.push(e.key.toLowerCase());

    const combo = parts.join('+');
    const shortcut = shortcuts.get(combo);

    if (shortcut) {
        e.preventDefault();
        shortcut.callback();
    }
});

// Usage
registerShortcut('ctrl+shift+d', toggleDarkMode, 'Toggle dark mode');
registerShortcut('alt+s', openSettings, 'Open settings');
```

---

## Data Extraction

### Table to Array

```javascript
function tableToArray(tableSelector) {
    const table = document.querySelector(tableSelector);
    if (!table) return [];

    const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
    const rows = Array.from(table.querySelectorAll('tbody tr'));

    return rows.map(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        const obj = {};
        cells.forEach((cell, i) => {
            obj[headers[i] || `col${i}`] = cell.textContent.trim();
        });
        return obj;
    });
}

// Usage
const data = tableToArray('#results-table');
console.log(JSON.stringify(data, null, 2));
```

### Extract Links

```javascript
function extractLinks(selector = 'a[href]') {
    return Array.from(document.querySelectorAll(selector)).map(a => ({
        text: a.textContent.trim(),
        href: a.href,
        title: a.title || ''
    }));
}

// Filter external links
const externalLinks = extractLinks().filter(link =>
    !link.href.includes(location.hostname)
);
```

---

## Performance Patterns

### Throttle Function

```javascript
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Usage
const throttledScroll = throttle(() => {
    console.log('Scrolled');
}, 100);

window.addEventListener('scroll', throttledScroll);
```

### Debounce Function

```javascript
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Usage
const debouncedSearch = debounce((query) => {
    console.log('Searching:', query);
}, 300);

input.addEventListener('input', (e) => debouncedSearch(e.target.value));
```

### Lazy Execution

```javascript
function lazyExecute(callback, delay = 0) {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(callback);
    } else {
        setTimeout(callback, delay);
    }
}

// Usage - run non-critical code when browser is idle
lazyExecute(() => {
    console.log('Running low-priority task');
    collectAnalytics();
});
```

---

## Error Handling

### Safe Wrapper

```javascript
function safe(fn, fallback = null) {
    return function(...args) {
        try {
            return fn.apply(this, args);
        } catch (error) {
            console.error('Error in userscript:', error);
            return fallback;
        }
    };
}

// Usage
const safeParseJSON = safe(JSON.parse, {});
const data = safeParseJSON(maybeInvalidJSON);
```

### Retry Pattern

```javascript
async function retry(fn, maxAttempts = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === maxAttempts) throw error;
            console.log(`Attempt ${attempt} failed, retrying...`);
            await new Promise(r => setTimeout(r, delay * attempt));
        }
    }
}

// Usage
const data = await retry(() => fetchData(url), 3, 1000);
```
