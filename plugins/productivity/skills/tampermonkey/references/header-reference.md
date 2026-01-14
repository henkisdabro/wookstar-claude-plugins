# Tampermonkey Header Tags Reference

Complete documentation for all userscript header tags.

## Metadata Block Format

```javascript
// ==UserScript==
// @tag value
// ==/UserScript==
```

---

## Script Identity

### @name

The script's display name. Supports internationalisation.

```javascript
// @name         My Awesome Script
// @name:de      Mein tolles Skript
// @name:fr      Mon script génial
// @name:ja      私の素晴らしいスクリプト
```

### @namespace

Unique identifier namespace, typically a URL you control.

```javascript
// @namespace    https://yoursite.com/userscripts
```

### @version

Script version for update checking. Must increase with each update.

```javascript
// @version      1.0.0
// @version      2.3.1-beta
// @version      2024-01-15
```

**See:** [version-numbering.md](version-numbering.md) for comparison rules.

### @description

Brief description of what the script does. Supports i18n.

```javascript
// @description       Enhances the user interface with dark mode
// @description:de    Verbessert die Benutzeroberfläche mit Dunkelmodus
```

### @author

The script author's name.

```javascript
// @author       John Doe
```

### @copyright

Copyright statement shown in the script editor.

```javascript
// @copyright    2024, John Doe (https://example.com)
```

### @homepage, @homepageURL, @website, @source

Link to the script's homepage (all are aliases).

```javascript
// @homepage     https://github.com/user/repo
// @supportURL   https://github.com/user/repo/issues
```

### @supportURL

URL for users to report issues.

```javascript
// @supportURL   https://github.com/user/repo/issues
```

---

## Icons

### @icon, @iconURL, @defaulticon

Script icon (low resolution).

```javascript
// @icon         https://example.com/icon.png
// @icon         data:image/png;base64,iVBORw0...
```

### @icon64, @icon64URL

Script icon at 64x64 pixels. Used at various places in the options page.

```javascript
// @icon64       https://example.com/icon64.png
```

---

## URL Matching

### @match

Specify pages where the script runs. Uses match patterns.

**Pattern format:** `<scheme>://<host><path>`

```javascript
// Match all pages on example.com
// @match        https://example.com/*

// Match any subdomain
// @match        https://*.example.com/*

// Match all HTTPS sites
// @match        https://*/*

// Match HTTP and HTTPS
// @match        *://example.com/*

// Match specific paths
// @match        https://example.com/page/*/details

// Multiple matches (use multiple tags)
// @match        https://example.com/*
// @match        https://other.com/*
```

**Special patterns:**
- `*` in scheme matches http or https
- `*` in host matches any subdomain
- `*` in path matches any characters

### @include

Legacy matching with glob patterns and regex support.

```javascript
// Glob patterns
// @include      https://example.com/*
// @include      *://*.example.com/*

// Regular expression (wrapped in //)
// @include      /^https:\/\/www\.example\.com\/page\/\d+$/
```

**Note:** @include with `://` is interpreted like @match. Use @match for new scripts.

### @exclude

Exclude URLs even if matched by @match or @include.

```javascript
// @match        https://example.com/*
// @exclude      https://example.com/admin/*
// @exclude      https://example.com/api/*
```

---

## Execution Control

### @run-at

When to inject the script.

| Value | Description |
|-------|-------------|
| `document-start` | Inject as early as possible, before DOM |
| `document-body` | Inject when body element exists |
| `document-end` | Inject at/after DOMContentLoaded |
| `document-idle` | Inject after DOMContentLoaded (default) |
| `context-menu` | Inject when clicked in browser context menu |

```javascript
// @run-at       document-start
// @run-at       document-idle
// @run-at       context-menu
```

**Note:** With `context-menu`, @include and @exclude are ignored.

### @run-in (v5.3+)

Control browser context (normal vs incognito tabs).

```javascript
// Only in normal tabs
// @run-in       normal-tabs

// Only in incognito/private mode
// @run-in       incognito-tabs

// Firefox containers
// @run-in       container-id-2
// @run-in       container-id-3
```

Default: Runs in all tabs if not specified.

### @noframes

Only run on main page, not in iframes.

```javascript
// @noframes
```

---

## Permissions and Security

### @grant

Whitelist GM_* functions and special window features.

```javascript
// GM functions
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_notification

// Special window access
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @grant        window.onurlchange

// Disable sandbox (no GM_* except GM_info)
// @grant        none
```

### @sandbox (v4.18+)

Control script injection context.

| Value | Behaviour |
|-------|-----------|
| `raw` | Run in page context (MAIN_WORLD) - default |
| `JavaScript` | Need unsafeWindow access, may use USERSCRIPT_WORLD |
| `DOM` | Only need DOM access, may use ISOLATED_WORLD |

```javascript
// @sandbox      JavaScript
// @sandbox      DOM
// @sandbox      raw
```

**See:** [sandbox-modes.md](sandbox-modes.md) for details.

### @connect

Whitelist domains for GM_xmlhttpRequest.

```javascript
// @connect      api.example.com
// @connect      *.googleapis.com
// @connect      self
// @connect      localhost
// @connect      127.0.0.1
// @connect      *
```

**Best practice:** Declare known domains explicitly, add `*` to offer "allow all" option.

### @antifeature

Disclose monetisation (required by GreasyFork).

```javascript
// @antifeature       ads         We show advertisements
// @antifeature       tracking    Analytics included
// @antifeature       miner       Uses crypto mining
// @antifeature:de    ads         Wir zeigen Werbung an
```

---

## External Resources

### @require

Load external JavaScript before script runs.

```javascript
// External URLs
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js

// With integrity hash (SRI)
// @require      https://code.jquery.com/jquery-3.6.0.min.js#sha256-/xUj+3OJU...

// Multiple hashes
// @require      https://example.com/lib.js#md5=abc123,sha256=def456

// Built-in vendor libraries
// @require      tampermonkey://vendor/jquery.js
// @require      tampermonkey://vendor/jszip/jszip.js
```

### @resource

Preload resources accessible via GM_getResourceText/GM_getResourceURL.

```javascript
// @resource     myCSS    https://example.com/style.css
// @resource     myIcon   https://example.com/icon.png
// @resource     myData   https://example.com/data.json

// With integrity hash
// @resource     secure   https://example.com/file.js#sha256=abc123
```

---

## Updates

### @updateURL

URL to check for updates (requires @version).

```javascript
// @updateURL    https://example.com/script.meta.js
```

### @downloadURL

URL to download updates from. Use `none` to disable.

```javascript
// @downloadURL  https://example.com/script.user.js
// @downloadURL  none
```

---

## Web Request Interception

### @webRequest

Define request interception rules (experimental, MV2 only).

```javascript
// @webRequest   {"selector": "*://ads.example.com/*", "action": "cancel"}
// @webRequest   {"selector": {"include": "*tracking*"}, "action": {"redirect": "https://example.com/blocked"}}
```

---

## Miscellaneous

### @tag (v5.0+)

Add categorisation tags visible in script list.

```javascript
// @tag          productivity
// @tag          social-media
// @tag          utility
```

### @unwrap

Inject script without wrapper/sandbox (for Scriptlets).

```javascript
// @unwrap
```

---

## Subresource Integrity (SRI)

Ensure external resources haven't been tampered with.

**Supported hash algorithms:**
- SHA-256 (native)
- MD5 (native)
- SHA-1, SHA-384, SHA-512 (require window.crypto)

**Formats:**
- Hex: `#sha256=e3b0c44298fc1c149...`
- Base64: `#sha256-47DEQpj8HBSa+/TImW...`

```javascript
// Single hash
// @require      https://example.com/lib.js#sha256=abc123def456...

// Multiple hashes (last supported one used)
// @require      https://example.com/lib.js#md5=abc,sha256=def
```
