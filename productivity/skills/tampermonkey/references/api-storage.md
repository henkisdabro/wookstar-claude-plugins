# Tampermonkey Storage API Reference

Complete documentation for persistent data storage functions.

---

## Overview

Tampermonkey provides a key-value storage system that:
- Persists across page reloads and browser sessions
- Is isolated per script (scripts can't access each other's data)
- Supports any JSON-serialisable value type
- Can notify listeners of changes across tabs

---

## Single Value Operations

### GM_setValue(key, value)

Store a value. Supports strings, numbers, booleans, objects, arrays, null, and undefined.

```javascript
// @grant GM_setValue

// Primitive values
GM_setValue('username', 'John');
GM_setValue('count', 42);
GM_setValue('enabled', true);
GM_setValue('lastVisit', Date.now());

// Objects and arrays
GM_setValue('settings', {
    theme: 'dark',
    fontSize: 14,
    notifications: true
});

GM_setValue('history', ['page1', 'page2', 'page3']);

// Nested objects work too
GM_setValue('userData', {
    profile: { name: 'John', age: 30 },
    preferences: { lang: 'en', timezone: 'UTC' }
});
```

### GM_getValue(key, defaultValue)

Retrieve a value. Returns defaultValue if key doesn't exist.

```javascript
// @grant GM_getValue

const username = GM_getValue('username', 'Guest');
const count = GM_getValue('count', 0);
const settings = GM_getValue('settings', { theme: 'light' });

// Check if value exists
const value = GM_getValue('maybeExists');
if (value === undefined) {
    console.log('Key does not exist');
}
```

### GM_deleteValue(key)

Remove a stored value.

```javascript
// @grant GM_deleteValue

GM_deleteValue('temporaryData');
GM_deleteValue('cache');
```

### GM_listValues()

Get an array of all stored keys.

```javascript
// @grant GM_listValues

const keys = GM_listValues();
console.log('Stored keys:', keys);
// ['username', 'settings', 'history']

// Iterate all stored data
keys.forEach(key => {
    console.log(key, '=', GM_getValue(key));
});
```

---

## Batch Operations (v5.3+)

More efficient for multiple operations - reduces overhead.

### GM_setValues(values)

Store multiple values at once.

```javascript
// @grant GM_setValues

GM_setValues({
    username: 'John',
    theme: 'dark',
    lastLogin: Date.now(),
    settings: { notifications: true, sound: false }
});
```

### GM_getValues(keysOrDefaults)

Retrieve multiple values at once.

```javascript
// @grant GM_getValues

// With array - returns object with keys (undefined for missing)
const values = GM_getValues(['username', 'theme', 'nonexistent']);
// { username: 'John', theme: 'dark', nonexistent: undefined }

// With defaults object - missing keys get default values
const values2 = GM_getValues({
    username: 'Guest',
    theme: 'light',
    notifications: true
});
// { username: 'John', theme: 'dark', notifications: true }
```

### GM_deleteValues(keys)

Delete multiple values at once.

```javascript
// @grant GM_deleteValues

GM_deleteValues(['cache', 'tempData', 'oldSettings']);
```

---

## Change Listeners

Listen for value changes, including from other tabs/windows.

### GM_addValueChangeListener(key, callback)

```javascript
// @grant GM_addValueChangeListener

const listenerId = GM_addValueChangeListener('counter', (key, oldValue, newValue, remote) => {
    console.log(`Key: ${key}`);
    console.log(`Old value: ${oldValue}`);
    console.log(`New value: ${newValue}`);
    console.log(`Remote change: ${remote}`);  // true if from another tab

    if (remote) {
        // Another tab changed this value
        updateUI(newValue);
    }
});
```

**Callback parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `key` | string | The key that changed |
| `oldValue` | any | Previous value |
| `newValue` | any | New value |
| `remote` | boolean | true if change was from another tab |

### GM_removeValueChangeListener(listenerId)

```javascript
// @grant GM_removeValueChangeListener

GM_removeValueChangeListener(listenerId);
```

---

## Common Patterns

### Settings Manager

```javascript
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_registerMenuCommand

const DEFAULT_SETTINGS = {
    enabled: true,
    theme: 'auto',
    fontSize: 14,
    notifications: true
};

class Settings {
    constructor() {
        this.data = GM_getValue('settings', DEFAULT_SETTINGS);
    }

    get(key) {
        return this.data[key] ?? DEFAULT_SETTINGS[key];
    }

    set(key, value) {
        this.data[key] = value;
        GM_setValue('settings', this.data);
    }

    reset() {
        this.data = { ...DEFAULT_SETTINGS };
        GM_setValue('settings', this.data);
    }
}

const settings = new Settings();

// Menu commands
GM_registerMenuCommand('Toggle Feature', () => {
    settings.set('enabled', !settings.get('enabled'));
    location.reload();
});
```

### Cache with Expiry

```javascript
// @grant GM_getValue
// @grant GM_setValue

function getCached(key, fetchFn, maxAgeMs = 3600000) {
    const cached = GM_getValue(`cache_${key}`);

    if (cached && Date.now() - cached.timestamp < maxAgeMs) {
        return Promise.resolve(cached.data);
    }

    return fetchFn().then(data => {
        GM_setValue(`cache_${key}`, {
            data: data,
            timestamp: Date.now()
        });
        return data;
    });
}

// Usage
getCached('userData', () => fetchUserData(), 60000)  // 1 minute cache
    .then(data => console.log(data));
```

### Cross-Tab Communication

```javascript
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addValueChangeListener

// Tab 1: Send message
function broadcast(channel, message) {
    GM_setValue(`broadcast_${channel}`, {
        message: message,
        timestamp: Date.now(),
        sender: GM_getValue('tabId', Math.random().toString(36))
    });
}

// Tab 2: Receive messages
GM_addValueChangeListener('broadcast_main', (key, oldVal, newVal, remote) => {
    if (remote && newVal) {
        console.log('Received:', newVal.message);
        handleMessage(newVal.message);
    }
});

// Send a message
broadcast('main', { action: 'refresh', data: { userId: 123 } });
```

### Migration Between Versions

```javascript
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue

const CURRENT_VERSION = 3;

function migrateStorage() {
    const version = GM_getValue('storageVersion', 1);

    if (version < 2) {
        // v1 -> v2: Rename key
        const oldData = GM_getValue('userData');
        if (oldData) {
            GM_setValue('user', oldData);
            GM_deleteValue('userData');
        }
    }

    if (version < 3) {
        // v2 -> v3: Convert settings format
        const settings = GM_getValue('settings', {});
        if (typeof settings.theme === 'boolean') {
            settings.theme = settings.theme ? 'dark' : 'light';
            GM_setValue('settings', settings);
        }
    }

    GM_setValue('storageVersion', CURRENT_VERSION);
}

migrateStorage();
```

### Persistent Counter

```javascript
// @grant GM_getValue
// @grant GM_setValue

function incrementCounter(key, amount = 1) {
    const current = GM_getValue(key, 0);
    const newValue = current + amount;
    GM_setValue(key, newValue);
    return newValue;
}

// Track page visits
const visitCount = incrementCounter('pageVisits');
console.log(`You've visited this page ${visitCount} times`);
```

---

## Data Types and Limits

### Supported Types

| Type | Support | Notes |
|------|---------|-------|
| string | Yes | No size limit (practical) |
| number | Yes | Including floats, Infinity, NaN |
| boolean | Yes | |
| null | Yes | |
| undefined | Yes | |
| object | Yes | Must be JSON-serialisable |
| array | Yes | Must be JSON-serialisable |
| Date | Partial | Stored as string, retrieve with new Date() |
| Map/Set | No | Convert to array/object first |
| Function | No | Cannot be serialised |
| Symbol | No | Cannot be serialised |

### Handling Non-Serialisable Data

```javascript
// Date objects
GM_setValue('lastUpdate', new Date().toISOString());
const date = new Date(GM_getValue('lastUpdate'));

// Map
const map = new Map([['a', 1], ['b', 2]]);
GM_setValue('myMap', Array.from(map.entries()));
const restored = new Map(GM_getValue('myMap'));

// Set
const set = new Set([1, 2, 3]);
GM_setValue('mySet', Array.from(set));
const restoredSet = new Set(GM_getValue('mySet'));
```

---

## Async Versions

All storage functions have GM.* async equivalents. See [api-async.md](api-async.md).

```javascript
// Async equivalents
const value = await GM.getValue('key', 'default');
await GM.setValue('key', 'value');
await GM.deleteValue('key');
const keys = await GM.listValues();
await GM.setValues({ a: 1, b: 2 });
const values = await GM.getValues(['a', 'b']);
await GM.deleteValues(['a', 'b']);
```
