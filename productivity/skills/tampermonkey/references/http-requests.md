# HTTP Requests API Reference

Documentation for GM_xmlhttpRequest - cross-origin HTTP requests.

---

## Overview

GM_xmlhttpRequest allows userscripts to make HTTP requests to any domain, bypassing the browser's same-origin policy. This is one of the most powerful Tampermonkey APIs.

---

## Required Setup

```javascript
// @grant GM_xmlhttpRequest
// @connect api.example.com
// @connect *.googleapis.com
```

**Important:** Always declare domains with `@connect`. Without it, users get permission dialogs or requests fail.

---

## Basic Examples

### GET Request

```javascript
GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://api.example.com/data',
    onload: function(response) {
        console.log('Status:', response.status);
        console.log('Response:', response.responseText);
    },
    onerror: function(error) {
        console.error('Request failed');
    }
});
```

### POST Request with JSON

```javascript
GM_xmlhttpRequest({
    method: 'POST',
    url: 'https://api.example.com/submit',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    data: JSON.stringify({
        name: 'John',
        email: 'john@example.com'
    }),
    onload: function(response) {
        const result = JSON.parse(response.responseText);
        console.log('Success:', result);
    }
});
```

---

## Full Options Reference

```javascript
GM_xmlhttpRequest({
    // Request configuration
    method: 'POST',                    // GET, HEAD, POST, PUT, DELETE, PATCH
    url: 'https://api.example.com/',   // Target URL (or Blob/File v5.4.6226+)
    headers: {                         // Custom headers
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123',
        'X-Custom-Header': 'value'
    },
    data: 'request body',              // String, Blob, File, FormData, URLSearchParams

    // Request modifiers
    timeout: 30000,                    // Timeout in milliseconds
    binary: false,                     // Send data in binary mode
    nocache: false,                    // Don't cache the resource
    revalidate: false,                 // Revalidate cached content
    anonymous: false,                  // Don't send cookies (enforces fetch mode)
    fetch: false,                      // Use fetch instead of XMLHttpRequest

    // Authentication
    user: 'username',                  // Basic auth username
    password: 'password',              // Basic auth password
    cookie: 'name=value',              // Cookie to include
    cookiePartition: {                 // Partitioned cookies (v5.2+)
        topLevelSite: 'https://example.com'
    },

    // Response handling
    responseType: 'json',              // arraybuffer, blob, json, stream
    overrideMimeType: 'text/plain',    // Override response MIME type

    // Redirect handling (v6180+)
    redirect: 'follow',                // follow, error, manual

    // Context for callbacks
    context: { custom: 'data' },       // Passed to response object

    // Proxy (Firefox only v5.5.6233+)
    proxy: {
        type: 'http',                  // direct, http, https, socks, socks4
        host: 'proxy.example.com',
        port: 8080,
        username: 'proxyuser',
        password: 'proxypass',
        proxyDNS: true,
        failoverTimeout: 5,
        proxyAuthorizationHeader: 'Basic ...',
        connectionIsolationKey: 'key'
    },

    // Callbacks
    onload: function(response) {},
    onerror: function(response) {},
    onabort: function(response) {},
    ontimeout: function(response) {},
    onprogress: function(progress) {},
    onreadystatechange: function(response) {},
    onloadstart: function(response) {}  // For stream responseType
});
```

---

## Response Object

```javascript
onload: function(response) {
    response.finalUrl;        // Final URL after redirects
    response.readyState;      // XMLHttpRequest readyState (4 = DONE)
    response.status;          // HTTP status code (200, 404, etc.)
    response.statusText;      // HTTP status text ("OK", "Not Found")
    response.responseHeaders; // Response headers as string
    response.response;        // Parsed response (if responseType set)
    response.responseText;    // Raw response text
    response.responseXML;     // Parsed XML (if applicable)
    response.context;         // Custom context from request
}
```

---

## @connect Directive

Whitelist domains for GM_xmlhttpRequest.

```javascript
// Specific domain (includes subdomains)
// @connect api.example.com

// Subdomain pattern
// @connect *.googleapis.com

// Current page's domain
// @connect self

// Localhost
// @connect localhost
// @connect 127.0.0.1

// Any IP address
// @connect 192.168.1.1

// Allow all (prompts user)
// @connect *
```

**Best practice:**
1. Declare all known domains explicitly
2. Add `@connect *` as fallback for "allow all" option
3. Both initial URL and final URL (after redirects) are checked

---

## Advanced Features

### Aborting Requests

```javascript
const request = GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://api.example.com/large-file',
    onload: response => console.log('Done'),
    onabort: () => console.log('Aborted')
});

// Cancel after 5 seconds
setTimeout(() => request.abort(), 5000);
```

### Progress Tracking

```javascript
GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://example.com/large-file.zip',
    onprogress: function(progress) {
        if (progress.lengthComputable) {
            const percent = (progress.loaded / progress.total * 100).toFixed(2);
            console.log(`Downloaded: ${percent}%`);
        }
    },
    onload: response => console.log('Complete')
});
```

### Streaming Response

```javascript
GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://api.example.com/stream',
    responseType: 'stream',
    onloadstart: function(response) {
        const reader = response.response.getReader();

        function read() {
            reader.read().then(({ done, value }) => {
                if (done) return;
                console.log('Chunk:', new TextDecoder().decode(value));
                read();
            });
        }

        read();
    }
});
```

---

## Common Patterns

### REST API Client

```javascript
// @grant GM_xmlhttpRequest
// @connect api.example.com

const api = {
    baseUrl: 'https://api.example.com',
    token: null,

    request(method, endpoint, data = null) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: method,
                url: this.baseUrl + endpoint,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token ? `Bearer ${this.token}` : ''
                },
                data: data ? JSON.stringify(data) : null,
                onload: response => {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: reject
            });
        });
    },

    get(endpoint) { return this.request('GET', endpoint); },
    post(endpoint, data) { return this.request('POST', endpoint, data); },
    put(endpoint, data) { return this.request('PUT', endpoint, data); },
    delete(endpoint) { return this.request('DELETE', endpoint); }
};

// Usage
api.token = 'your-api-token';
api.get('/users/123').then(user => console.log(user));
```

### Form Data Upload

```javascript
const formData = new FormData();
formData.append('file', blob, 'filename.txt');
formData.append('description', 'My file');

GM_xmlhttpRequest({
    method: 'POST',
    url: 'https://api.example.com/upload',
    data: formData,
    onload: response => console.log('Uploaded!')
});
```

### Retry with Exponential Backoff

```javascript
function requestWithRetry(options, maxRetries = 3) {
    return new Promise((resolve, reject) => {
        let attempt = 0;

        function tryRequest() {
            GM_xmlhttpRequest({
                ...options,
                onload: resolve,
                onerror: (error) => {
                    if (++attempt < maxRetries) {
                        const delay = Math.pow(2, attempt) * 1000;
                        console.log(`Retry ${attempt} in ${delay}ms`);
                        setTimeout(tryRequest, delay);
                    } else {
                        reject(error);
                    }
                }
            });
        }

        tryRequest();
    });
}
```

### Handle Different Response Types

```javascript
// JSON response
GM_xmlhttpRequest({
    url: 'https://api.example.com/data.json',
    responseType: 'json',
    onload: r => console.log(r.response)  // Already parsed
});

// Binary data
GM_xmlhttpRequest({
    url: 'https://example.com/image.png',
    responseType: 'blob',
    onload: response => {
        const url = URL.createObjectURL(response.response);
        img.src = url;
    }
});

// ArrayBuffer
GM_xmlhttpRequest({
    url: 'https://example.com/data.bin',
    responseType: 'arraybuffer',
    onload: response => {
        const view = new DataView(response.response);
        console.log(view.getUint32(0));
    }
});
```

---

## Async/Await Version

Use GM.xmlHttpRequest (note uppercase H) for promises:

```javascript
// @grant GM.xmlHttpRequest
// @connect api.example.com

try {
    const response = await GM.xmlHttpRequest({
        method: 'GET',
        url: 'https://api.example.com/data'
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

## Error Handling

Always include error handlers:

```javascript
GM_xmlhttpRequest({
    url: 'https://api.example.com/data',
    onload: (response) => {
        if (response.status >= 200 && response.status < 300) {
            try {
                const data = JSON.parse(response.responseText);
                processData(data);
            } catch (e) {
                console.error('Invalid JSON:', e);
            }
        } else {
            console.error('HTTP error:', response.status, response.statusText);
        }
    },
    onerror: (error) => {
        console.error('Network error:', error);
    },
    ontimeout: () => {
        console.error('Request timed out');
    }
});
```
