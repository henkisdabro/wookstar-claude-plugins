# Tampermonkey Async API Reference

Documentation for GM.* promise-based functions.

---

## Overview

The GM.* API provides promise-based versions of GM_* functions. Use with async/await for cleaner code.

**Key differences from GM_* functions:**
- Return Promises instead of values/callbacks
- Use `await` or `.then()` for results
- Some have slightly different names (note capitalisation)

---

## Naming Conventions

| Sync (GM_*) | Async (GM.*) | Note |
|-------------|--------------|------|
| `GM_getValue` | `GM.getValue` | Same name |
| `GM_setValue` | `GM.setValue` | Same name |
| `GM_deleteValue` | `GM.deleteValue` | Same name |
| `GM_listValues` | `GM.listValues` | Same name |
| `GM_getResourceURL` | `GM.getResourceUrl` | Note: lowercase "r" and "l" |
| `GM_xmlhttpRequest` | `GM.xmlHttpRequest` | Note: uppercase "H" |
| `GM_notification` | `GM.notification` | Returns boolean (was clicked) |
| `GM_setClipboard` | `GM.setClipboard` | Returns Promise<void> |

---

## Storage Functions

### GM.getValue(key, defaultValue)

```javascript
// @grant GM.getValue

const username = await GM.getValue('username', 'Anonymous');
const settings = await GM.getValue('settings', { theme: 'dark', lang: 'en' });
```

### GM.setValue(key, value)

```javascript
// @grant GM.setValue

await GM.setValue('username', 'John');
await GM.setValue('settings', { theme: 'light', lang: 'fr' });
await GM.setValue('lastVisit', Date.now());
```

### GM.deleteValue(key)

```javascript
// @grant GM.deleteValue

await GM.deleteValue('tempData');
```

### GM.listValues()

```javascript
// @grant GM.listValues

const keys = await GM.listValues();
console.log('Stored keys:', keys);
```

### GM.getValues(keysOrDefaults) (v5.3+)

```javascript
// @grant GM.getValues

// With array of keys
const values = await GM.getValues(['foo', 'bar', 'baz']);

// With default values
const values2 = await GM.getValues({
    foo: 1,
    bar: 'default',
    baz: null
});
```

### GM.setValues(values) (v5.3+)

```javascript
// @grant GM.setValues

await GM.setValues({
    username: 'John',
    theme: 'dark',
    lastLogin: Date.now()
});
```

### GM.deleteValues(keys) (v5.3+)

```javascript
// @grant GM.deleteValues

await GM.deleteValues(['tempData', 'cache', 'oldSettings']);
```

### GM.addValueChangeListener(key, callback)

```javascript
// @grant GM.addValueChangeListener

const listenerId = await GM.addValueChangeListener('counter', (key, oldValue, newValue, remote) => {
    console.log(`${key} changed from ${oldValue} to ${newValue}`);
    if (remote) {
        console.log('Change came from another tab');
    }
});
```

### GM.removeValueChangeListener(listenerId)

```javascript
// @grant GM.removeValueChangeListener

await GM.removeValueChangeListener(listenerId);
```

---

## Resource Functions

### GM.getResourceText(name)

```javascript
// @resource myCSS https://example.com/style.css
// @grant GM.getResourceText

const cssText = await GM.getResourceText('myCSS');
```

### GM.getResourceUrl(name)

**Note:** Lowercase "r" and "l" in "Url" (different from sync version).

```javascript
// @resource myIcon https://example.com/icon.png
// @grant GM.getResourceUrl

const iconUrl = await GM.getResourceUrl('myIcon');
img.src = iconUrl;
```

---

## Network Requests

### GM.xmlHttpRequest(details)

**Note:** Uppercase "H" in "Http" (different from sync version).

```javascript
// @grant GM.xmlHttpRequest
// @connect api.example.com

try {
    const response = await GM.xmlHttpRequest({
        method: 'GET',
        url: 'https://api.example.com/data',
        headers: {
            'Accept': 'application/json'
        }
    });

    const data = JSON.parse(response.responseText);
    console.log(data);
} catch (error) {
    console.error('Request failed:', error);
}
```

The promise also has an `abort()` function:

```javascript
const request = GM.xmlHttpRequest({
    method: 'GET',
    url: 'https://api.example.com/large-file'
});

// Cancel after 5 seconds
setTimeout(() => request.abort(), 5000);

try {
    const response = await request;
} catch (error) {
    console.log('Request was aborted or failed');
}
```

---

## UI Functions

### GM.notification(details)

Returns a Promise that resolves to `true` if clicked, `false` otherwise.

```javascript
// @grant GM.notification

const wasClicked = await GM.notification({
    text: 'Click me!',
    title: 'Notification',
    timeout: 10000
});

if (wasClicked) {
    console.log('User clicked the notification');
} else {
    console.log('Notification timed out or was dismissed');
}
```

### GM.setClipboard(data, type)

```javascript
// @grant GM.setClipboard

await GM.setClipboard('Copied text', 'text');
console.log('Text copied to clipboard');
```

---

## Tab Functions

### GM.getTab()

```javascript
// @grant GM.getTab

const tab = await GM.getTab();
console.log('Tab data:', tab);
```

### GM.saveTab(tab)

```javascript
// @grant GM.saveTab

const tab = await GM.getTab();
tab.customData = { lastAction: 'click', timestamp: Date.now() };
await GM.saveTab(tab);
```

### GM.getTabs()

```javascript
// @grant GM.getTabs

const tabs = await GM.getTabs();
for (const [tabId, tabData] of Object.entries(tabs)) {
    console.log(`Tab ${tabId}:`, tabData);
}
```

---

## Cookie Functions

### GM.cookie.list(details)

```javascript
// @grant GM.cookie

const cookies = await GM.cookie.list({ domain: 'example.com' });
console.log('Cookies:', cookies);
```

### GM.cookie.set(details)

```javascript
// @grant GM.cookie

await GM.cookie.set({
    name: 'myCookie',
    value: 'myValue',
    domain: 'example.com',
    path: '/',
    secure: true
});
```

### GM.cookie.delete(details)

```javascript
// @grant GM.cookie

await GM.cookie.delete({ name: 'myCookie' });
```

---

## Audio Functions (v5.0+)

### GM.audio.setMute(details)

```javascript
// @grant GM.audio

await GM.audio.setMute({ isMuted: true });
console.log('Tab muted');
```

### GM.audio.getState()

```javascript
// @grant GM.audio

const state = await GM.audio.getState();
console.log(`Muted: ${state.isMuted}, Audible: ${state.isAudible}`);
```

### GM.audio.addStateChangeListener(listener)

```javascript
// @grant GM.audio

await GM.audio.addStateChangeListener((event) => {
    if ('muted' in event) console.log('Mute changed:', event.muted);
    if ('audible' in event) console.log('Audible changed:', event.audible);
});
```

---

## Combining Async Operations

### Sequential Operations

```javascript
async function loadUserData() {
    const userId = await GM.getValue('userId');
    const response = await GM.xmlHttpRequest({
        url: `https://api.example.com/users/${userId}`
    });
    const userData = JSON.parse(response.responseText);
    await GM.setValue('userData', userData);
    return userData;
}
```

### Parallel Operations

```javascript
async function loadAllSettings() {
    const [theme, language, notifications] = await Promise.all([
        GM.getValue('theme', 'dark'),
        GM.getValue('language', 'en'),
        GM.getValue('notifications', true)
    ]);

    return { theme, language, notifications };
}
```

### Error Handling

```javascript
async function safeRequest(url) {
    try {
        const response = await GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            timeout: 5000
        });
        return JSON.parse(response.responseText);
    } catch (error) {
        console.error('Request failed:', error);
        await GM.notification({
            text: 'Failed to load data',
            title: 'Error'
        });
        return null;
    }
}
```
