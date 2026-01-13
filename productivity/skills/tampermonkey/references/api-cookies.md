# Tampermonkey Cookie API Reference

Documentation for browser cookie manipulation functions.

---

## Overview

The GM_cookie API allows userscripts to:
- List cookies from any domain (with @match/@include access)
- Set cookies with full control over attributes
- Delete cookies

**Note:** httpOnly cookies are supported in BETA versions only.

**Required grant:**
```javascript
// @grant GM_cookie
```

---

## GM_cookie.list(details[, callback])

Retrieve cookies matching specified criteria.

### Basic Usage

```javascript
// @grant GM_cookie

// List all cookies for current domain
GM_cookie.list({}, function(cookies, error) {
    if (error) {
        console.error('Error:', error);
        return;
    }
    console.log('Cookies:', cookies);
});

// Async version
const cookies = await GM.cookie.list();
```

### Filter Options

```javascript
// By domain
GM_cookie.list({ domain: 'example.com' }, callback);

// By name
GM_cookie.list({ name: 'sessionId' }, callback);

// By path
GM_cookie.list({ path: '/app' }, callback);

// By URL
GM_cookie.list({ url: 'https://example.com/page' }, callback);

// Partitioned cookies (v5.2+)
GM_cookie.list({
    partitionKey: { topLevelSite: 'https://example.com' }
}, callback);

// All cookies (empty partitionKey)
GM_cookie.list({ partitionKey: {} }, callback);
```

### Cookie Object Properties

```javascript
GM_cookie.list({}, (cookies, error) => {
    cookies.forEach(cookie => {
        console.log(cookie.name);           // Cookie name
        console.log(cookie.value);          // Cookie value
        console.log(cookie.domain);         // Domain (e.g., ".example.com")
        console.log(cookie.path);           // Path (e.g., "/")
        console.log(cookie.secure);         // HTTPS only
        console.log(cookie.httpOnly);       // Not accessible via JS
        console.log(cookie.sameSite);       // "strict", "lax", "none"
        console.log(cookie.session);        // Session cookie (no expiry)
        console.log(cookie.expirationDate); // Unix timestamp (seconds)
        console.log(cookie.hostOnly);       // Exact domain match only
        console.log(cookie.firstPartyDomain); // First-party isolation
    });
});
```

---

## GM_cookie.set(details[, callback])

Create or update a cookie.

### Basic Usage

```javascript
// @grant GM_cookie

// Simple cookie
GM_cookie.set({
    name: 'myCookie',
    value: 'myValue'
}, function(error) {
    if (error) {
        console.error('Failed to set cookie:', error);
    } else {
        console.log('Cookie set!');
    }
});

// Async version
await GM.cookie.set({ name: 'myCookie', value: 'myValue' });
```

### Full Options

```javascript
GM_cookie.set({
    // Required
    name: 'sessionToken',
    value: 'abc123xyz',

    // Optional - domain and path
    url: 'https://example.com',           // URL to associate with
    domain: '.example.com',               // Cookie domain
    path: '/',                            // Cookie path

    // Optional - security
    secure: true,                         // HTTPS only
    httpOnly: true,                       // Not accessible via JS
    sameSite: 'strict',                   // "strict", "lax", "none"

    // Optional - expiry
    expirationDate: Math.floor(Date.now() / 1000) + 86400,  // 24 hours

    // Optional - partitioning (v5.2+)
    partitionKey: {
        topLevelSite: 'https://example.com'
    },

    // Optional - first-party isolation
    firstPartyDomain: 'example.com'
}, callback);
```

### Cookie Expiry Examples

```javascript
// Session cookie (no expirationDate)
GM_cookie.set({ name: 'session', value: 'temp' });

// Expire in 1 hour
GM_cookie.set({
    name: 'hourly',
    value: 'data',
    expirationDate: Math.floor(Date.now() / 1000) + 3600
});

// Expire in 30 days
GM_cookie.set({
    name: 'monthly',
    value: 'data',
    expirationDate: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)
});

// Expire at specific date
GM_cookie.set({
    name: 'endOfYear',
    value: 'data',
    expirationDate: new Date('2025-12-31').getTime() / 1000
});
```

---

## GM_cookie.delete(details, callback)

Remove a cookie.

### Basic Usage

```javascript
// @grant GM_cookie

GM_cookie.delete({ name: 'myCookie' }, function(error) {
    if (error) {
        console.error('Failed to delete:', error);
    } else {
        console.log('Cookie deleted');
    }
});

// Async version
await GM.cookie.delete({ name: 'myCookie' });
```

### Delete Options

```javascript
GM_cookie.delete({
    name: 'sessionToken',
    url: 'https://example.com',           // URL associated with cookie
    firstPartyDomain: 'example.com',      // First-party isolation
    partitionKey: {                       // Partitioned cookies (v5.2+)
        topLevelSite: 'https://example.com'
    }
}, callback);
```

---

## Common Patterns

### Read and Modify Cookie

```javascript
async function updateCookie(name, modifier) {
    const cookies = await GM.cookie.list({ name });

    if (cookies.length === 0) {
        console.log('Cookie not found');
        return;
    }

    const cookie = cookies[0];
    const newValue = modifier(cookie.value);

    await GM.cookie.set({
        name: cookie.name,
        value: newValue,
        domain: cookie.domain,
        path: cookie.path,
        secure: cookie.secure,
        expirationDate: cookie.expirationDate
    });

    return newValue;
}

// Usage: increment a counter cookie
updateCookie('visitCount', val => String(parseInt(val || '0') + 1));
```

### Cookie Manager Class

```javascript
class CookieManager {
    constructor(domain) {
        this.domain = domain;
    }

    async get(name) {
        const cookies = await GM.cookie.list({ domain: this.domain, name });
        return cookies.length > 0 ? cookies[0].value : null;
    }

    async set(name, value, options = {}) {
        await GM.cookie.set({
            name,
            value,
            domain: this.domain,
            path: options.path || '/',
            secure: options.secure ?? true,
            expirationDate: options.expiresIn
                ? Math.floor(Date.now() / 1000) + options.expiresIn
                : undefined
        });
    }

    async delete(name) {
        await GM.cookie.delete({ name, domain: this.domain });
    }

    async getAll() {
        return await GM.cookie.list({ domain: this.domain });
    }

    async clear() {
        const cookies = await this.getAll();
        for (const cookie of cookies) {
            await this.delete(cookie.name);
        }
    }
}

// Usage
const cookies = new CookieManager('example.com');
await cookies.set('theme', 'dark', { expiresIn: 86400 * 30 });
const theme = await cookies.get('theme');
```

### Backup and Restore Cookies

```javascript
async function backupCookies(domain) {
    const cookies = await GM.cookie.list({ domain });
    GM_setValue('cookieBackup', cookies);
    return cookies.length;
}

async function restoreCookies() {
    const backup = GM_getValue('cookieBackup', []);
    for (const cookie of backup) {
        await GM.cookie.set({
            name: cookie.name,
            value: cookie.value,
            domain: cookie.domain,
            path: cookie.path,
            secure: cookie.secure,
            httpOnly: cookie.httpOnly,
            sameSite: cookie.sameSite,
            expirationDate: cookie.expirationDate
        });
    }
    return backup.length;
}
```

### Session Hijacking Prevention Check

```javascript
async function checkSessionSecurity() {
    const cookies = await GM.cookie.list({});
    const issues = [];

    for (const cookie of cookies) {
        if (cookie.name.toLowerCase().includes('session') ||
            cookie.name.toLowerCase().includes('token')) {

            if (!cookie.secure) {
                issues.push(`${cookie.name}: Not secure (sent over HTTP)`);
            }
            if (!cookie.httpOnly) {
                issues.push(`${cookie.name}: Not httpOnly (accessible via JS)`);
            }
            if (cookie.sameSite === 'none' && !cookie.secure) {
                issues.push(`${cookie.name}: SameSite=None without Secure`);
            }
        }
    }

    if (issues.length > 0) {
        console.warn('Cookie security issues:', issues);
    }
    return issues;
}
```

---

## Security Considerations

1. **Access Control**: Tampermonkey checks @match/@include access to the URL before allowing cookie operations

2. **httpOnly Cookies**: Only available in BETA versions - most session cookies are httpOnly

3. **Secure Flag**: Always set `secure: true` for sensitive cookies

4. **SameSite**: Use `sameSite: 'strict'` or `'lax'` to prevent CSRF

5. **Domain Scope**: Be careful with domain - `.example.com` includes all subdomains
