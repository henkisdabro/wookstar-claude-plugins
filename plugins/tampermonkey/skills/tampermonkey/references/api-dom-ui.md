# Tampermonkey DOM and UI API Reference

Documentation for DOM manipulation and UI-related functions.

---

## unsafeWindow

Access the page's actual window object, bypassing the sandbox.

```javascript
// @grant unsafeWindow

// Access page variables
const config = unsafeWindow.pageConfig;
const userData = unsafeWindow.APP.user;

// Call page functions
unsafeWindow.showModal('Hello from userscript!');
unsafeWindow.analytics.track('userscript_loaded');

// Modify page globals
unsafeWindow.DEBUG_MODE = true;
unsafeWindow.featureFlags.newUI = true;

// Listen to page events
unsafeWindow.addEventListener('customEvent', (e) => {
    console.log('Page event:', e.detail);
});
```

### When to Use unsafeWindow

| Scenario | Use unsafeWindow? |
|----------|-------------------|
| Read page JavaScript variables | Yes |
| Call page-defined functions | Yes |
| Access page's jQuery/React/Vue | Yes |
| DOM manipulation | No (use document) |
| Add event listeners to elements | No |
| Create/modify elements | No |

### Security Considerations

```javascript
// Safe - reading data
const token = unsafeWindow.authToken;

// Dangerous - executing untrusted code
// unsafeWindow.eval(userInput);  // DON'T DO THIS

// Be careful with callbacks
unsafeWindow.someFunction({
    callback: function() {
        // This runs in page context - be careful!
    }
});
```

---

## GM_addStyle(css)

Add CSS styles to the document. Useful for customising page appearance.

```javascript
// @grant GM_addStyle

// Basic styling
GM_addStyle(`
    .my-class {
        background: #f0f0f0;
        padding: 10px;
        border-radius: 5px;
    }
`);

// Hide elements
GM_addStyle(`
    #annoying-banner,
    .popup-overlay,
    .cookie-notice {
        display: none !important;
    }
`);

// Dark mode
GM_addStyle(`
    body {
        background-color: #1a1a1a !important;
        color: #e0e0e0 !important;
    }

    a {
        color: #6db3f2 !important;
    }

    img {
        filter: brightness(0.9);
    }
`);

// Returns the style element
const styleEl = GM_addStyle('body { font-size: 16px; }');
console.log('Style element:', styleEl);
```

### Dynamic Styles

```javascript
// Toggle styles
let darkModeStyle = null;

function toggleDarkMode() {
    if (darkModeStyle) {
        darkModeStyle.remove();
        darkModeStyle = null;
    } else {
        darkModeStyle = GM_addStyle(`
            body { background: #1a1a1a; color: #fff; }
        `);
    }
}

GM_registerMenuCommand('Toggle Dark Mode', toggleDarkMode);
```

---

## GM_addElement(tag_name, attributes)
## GM_addElement(parent_node, tag_name, attributes)

Create and inject HTML elements. Can bypass Content Security Policy (CSP).

### Add Script

```javascript
// @grant GM_addElement

// Inline script
GM_addElement('script', {
    textContent: `
        window.myGlobal = 'injected';
        console.log('Script injected!');
    `
});

// External script
GM_addElement('script', {
    src: 'https://example.com/library.js',
    type: 'text/javascript'
});

// Module script
GM_addElement('script', {
    src: 'https://example.com/module.mjs',
    type: 'module'
});
```

### Add Styles

```javascript
// Inline styles
GM_addElement('style', {
    textContent: `
        body { font-family: Arial; }
        .highlight { background: yellow; }
    `
});

// External stylesheet
GM_addElement('link', {
    rel: 'stylesheet',
    href: 'https://example.com/style.css'
});
```

### Add to Specific Parent

```javascript
// Add to body
GM_addElement(document.body, 'div', {
    id: 'my-container',
    className: 'userscript-ui'
});

// Add to specific element
const container = document.querySelector('#main');
GM_addElement(container, 'button', {
    textContent: 'Click Me',
    onclick: () => alert('Clicked!')
});

// Add to Shadow DOM
const shadowRoot = element.shadowRoot;
GM_addElement(shadowRoot, 'style', {
    textContent: 'div { color: blue; }'
});
```

### Add Images

```javascript
GM_addElement('img', {
    src: 'https://example.com/image.png',
    alt: 'Description',
    width: 100,
    height: 100,
    style: 'border-radius: 50%;'
});
```

### Bypassing CSP

```javascript
// Sites with strict CSP block inline scripts
// GM_addElement can bypass this

// Instead of (may be blocked by CSP):
const script = document.createElement('script');
script.textContent = 'console.log("blocked")';
document.head.appendChild(script);

// Use (bypasses CSP):
GM_addElement('script', {
    textContent: 'console.log("works!")'
});
```

---

## Creating Custom UI

### Floating Panel

```javascript
function createPanel() {
    const panel = document.createElement('div');
    panel.id = 'userscript-panel';
    panel.innerHTML = `
        <div class="panel-header">
            <span>My Script</span>
            <button class="close-btn">&times;</button>
        </div>
        <div class="panel-content">
            <label>
                <input type="checkbox" id="feature1"> Enable Feature 1
            </label>
            <label>
                <input type="checkbox" id="feature2"> Enable Feature 2
            </label>
        </div>
    `;

    document.body.appendChild(panel);

    // Add styles
    GM_addStyle(`
        #userscript-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 250px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 999999;
            font-family: system-ui, sans-serif;
        }

        #userscript-panel .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            background: #f5f5f5;
            border-radius: 8px 8px 0 0;
            border-bottom: 1px solid #e0e0e0;
        }

        #userscript-panel .close-btn {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #666;
        }

        #userscript-panel .panel-content {
            padding: 15px;
        }

        #userscript-panel label {
            display: block;
            margin-bottom: 10px;
            cursor: pointer;
        }
    `);

    // Event handlers
    panel.querySelector('.close-btn').onclick = () => panel.remove();

    return panel;
}

GM_registerMenuCommand('Open Panel', createPanel);
```

### Toast Notifications

```javascript
function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'userscript-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto-remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

GM_addStyle(`
    .userscript-toast {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        z-index: 999999;
        opacity: 0;
        transition: all 0.3s ease;
    }

    .userscript-toast.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
`);

// Usage
showToast('Settings saved!');
```

### Draggable Element

```javascript
function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    const header = element.querySelector('.panel-header') || element;
    header.style.cursor = 'move';

    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + 'px';
        element.style.left = (element.offsetLeft - pos1) + 'px';
        element.style.right = 'auto';
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Usage
const panel = createPanel();
makeDraggable(panel);
```

---

## Interacting with Page Frameworks

### Inject into React App

```javascript
// @grant unsafeWindow

// Wait for React
function waitForReact(callback) {
    const interval = setInterval(() => {
        if (unsafeWindow.React && unsafeWindow.ReactDOM) {
            clearInterval(interval);
            callback(unsafeWindow.React, unsafeWindow.ReactDOM);
        }
    }, 100);
}

// Access React component state
function getReactState(element) {
    const key = Object.keys(element).find(k => k.startsWith('__reactInternalInstance'));
    if (key) {
        let fiber = element[key];
        while (fiber) {
            if (fiber.memoizedState) return fiber.memoizedState;
            fiber = fiber.return;
        }
    }
    return null;
}
```

### Inject into Vue App

```javascript
// @grant unsafeWindow

// Access Vue component
const vueElement = document.querySelector('#app');
const vueInstance = vueElement.__vue__;

if (vueInstance) {
    console.log('Vue data:', vueInstance.$data);
    // Modify Vue state
    vueInstance.someProperty = 'new value';
}
```

### Inject into Angular App

```javascript
// @grant unsafeWindow

// Access Angular scope (AngularJS)
const element = document.querySelector('[ng-controller]');
const scope = unsafeWindow.angular.element(element).scope();

if (scope) {
    scope.$apply(() => {
        scope.someValue = 'modified';
    });
}
```
