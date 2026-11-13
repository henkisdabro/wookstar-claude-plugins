# Tampermonkey Synchronous API Reference

Documentation for all GM_* synchronous functions.

---

## GM_info

Get information about the script and Tampermonkey. No @grant required.

```javascript
console.log(GM_info.script.name);        // Script name
console.log(GM_info.script.version);     // Script version
console.log(GM_info.scriptHandler);      // "Tampermonkey"
console.log(GM_info.version);            // Tampermonkey version
```

**Key properties:**

| Property | Type | Description |
|----------|------|-------------|
| `script.name` | string | Script name |
| `script.version` | string | Script version |
| `script.description` | string | Script description |
| `script.namespace` | string | Script namespace |
| `script.matches` | string[] | @match patterns |
| `script.includes` | string[] | @include patterns |
| `script.excludes` | string[] | @exclude patterns |
| `script.grant` | string[] | Granted permissions |
| `scriptHandler` | string | "Tampermonkey" |
| `version` | string | Tampermonkey version |
| `isIncognito` | boolean | Running in private mode |
| `sandboxMode` | string | 'js', 'raw', or 'dom' |
| `downloadMode` | string | 'native', 'disabled', or 'browser' |

---

## GM_log(message)

Log a message to the console.

```javascript
// @grant GM_log

GM_log('Debug message');
GM_log('User ID: ' + userId);
```

---

## GM_addStyle, GM_addElement and unsafeWindow

Documented in [api-dom-ui.md](api-dom-ui.md).

---

## GM_notification(details, ondone)
## GM_notification(text, title, image, onclick)

Display desktop notifications.

**Object syntax:**

```javascript
// @grant GM_notification

GM_notification({
    text: 'Download complete!',
    title: 'My Script',
    image: 'https://example.com/icon.png',
    timeout: 5000,                    // Auto-close after 5 seconds
    silent: false,                    // Play sound
    highlight: false,                 // Highlight tab
    url: 'https://example.com/',      // Open on click (v5.0+)
    tag: 'download-notification',     // Update existing (v5.0+)
    onclick: (event) => {
        event.preventDefault();       // Prevent URL opening
        console.log('Clicked!');
    },
    ondone: () => {
        console.log('Notification closed');
    }
});
```

**Simple syntax:**

```javascript
GM_notification('Message', 'Title', 'https://example.com/icon.png', () => {
    console.log('Clicked!');
});
```

**Parameters:**

| Property | Type | Description |
|----------|------|-------------|
| `text` | string | Notification message |
| `title` | string | Notification title |
| `image` | string | Icon URL |
| `timeout` | number | Auto-close time in ms |
| `silent` | boolean | Suppress sound |
| `highlight` | boolean | Flash the tab |
| `url` | string | URL to open on click (v5.0+) |
| `tag` | string | Unique ID for updating (v5.0+) |
| `onclick` | function | Click handler |
| `ondone` | function | Close handler |

---

## GM_openInTab

Documented with the other tab APIs in [api-tabs.md](api-tabs.md).

---

## GM_registerMenuCommand(name, callback, options_or_accessKey)

Add an entry to Tampermonkey's menu.

```javascript
// @grant GM_registerMenuCommand

// Simple usage
const menuId = GM_registerMenuCommand('Say Hello', () => {
    alert('Hello!');
});

// With options (v4.20+)
const menuId2 = GM_registerMenuCommand('Toggle Feature', (event) => {
    console.log('Clicked with:', event);
}, {
    accessKey: 't',       // Keyboard shortcut
    autoClose: true,      // Close menu after click
    title: 'Enable or disable the feature',  // Tooltip (v5.0+)
    id: existingId        // Update existing command (v5.0+)
});

// With just access key (legacy)
const menuId3 = GM_registerMenuCommand('Quick Action', callback, 'q');
```

**Returns:** Menu command ID for later removal.

---

## GM_unregisterMenuCommand(menuCmdId)

Remove a menu command.

```javascript
// @grant GM_unregisterMenuCommand

const menuId = GM_registerMenuCommand('Temporary', callback);
// Later...
GM_unregisterMenuCommand(menuId);
```

---

## GM_setClipboard(data, info, cb)

Copy data to the clipboard.

```javascript
// @grant GM_setClipboard

// Copy text
GM_setClipboard('Hello, World!', 'text');

// Copy HTML
GM_setClipboard('<b>Bold text</b>', 'html');

// With callback
GM_setClipboard('Copied text', 'text', () => {
    console.log('Clipboard set!');
});

// With full info object
GM_setClipboard('Data', {
    type: 'text',
    mimetype: 'text/plain'
});
```

---

## GM_download(details)
## GM_download(url, name)

Download a file.

```javascript
// @grant GM_download

// Simple download
GM_download('https://example.com/file.pdf', 'document.pdf');

// With options
const download = GM_download({
    url: 'https://example.com/file.zip',
    name: 'archive.zip',
    saveAs: true,              // Prompt for location
    headers: {
        'Authorization': 'Bearer token123'
    },
    onload: () => console.log('Complete!'),
    onerror: (error) => console.error('Failed:', error.error),
    onprogress: (progress) => console.log(`${progress.loaded}/${progress.total}`),
    ontimeout: () => console.log('Timed out')
});

// Cancel download
download.abort();
```

**Note:** File extensions must be whitelisted in Tampermonkey options.

**Error types:**
- `not_enabled` - Download feature disabled
- `not_whitelisted` - Extension not allowed
- `not_permitted` - Missing permission
- `not_supported` - Browser doesn't support
- `not_succeeded` - Download failed

---

## GM_getResourceText(name)

Get text content of a preloaded @resource.

```javascript
// @resource myCSS https://example.com/style.css
// @grant GM_getResourceText
// @grant GM_addStyle

const css = GM_getResourceText('myCSS');
GM_addStyle(css);
```

---

## GM_getResourceURL(name)

Get a data URL for a preloaded @resource.

```javascript
// @resource myIcon https://example.com/icon.png
// @grant GM_getResourceURL

const iconUrl = GM_getResourceURL('myIcon');
const img = document.createElement('img');
img.src = iconUrl;
document.body.appendChild(img);
```
