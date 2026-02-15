---
name: tampermonkey
description: Write Tampermonkey userscripts for browser automation, page modification, and web enhancement. Use when creating browser scripts, writing greasemonkey scripts, automating user interactions, injecting CSS or JavaScript into web pages, modifying website behaviour, building browser extensions, hiding unwanted page elements, adding form auto-fill, scraping website data, intercepting requests, detecting URL changes in SPAs, or storing persistent user preferences. Covers userscript headers (@match, @grant, @require), synchronous and async GM_* API functions, common patterns (DOM mutation, URL change detection, element waiting), security sandboxing, and cross-browser compatibility (Chrome, Firefox, Edge).
allowed-tools: Read, Glob, Grep, Write, Edit
---

# Tampermonkey Userscript Development

Expert guidance for writing Tampermonkey userscripts - browser scripts that modify web pages, automate tasks, and enhance browsing experience.

## Quick Start Template

```javascript
// ==UserScript==
// @name         My Script Name                    // <- CUSTOMISE: Unique script name
// @namespace    https://example.com/scripts/      // <- CUSTOMISE: Your unique namespace
// @version      1.0.0                             // <- INCREMENT on updates
// @description  Brief description of the script   // <- CUSTOMISE: What it does
// @author       Your Name                         // <- CUSTOMISE: Your name
// @match        https://example.com/*             // <- CUSTOMISE: Target URL pattern
// @grant        none                              // <- ADD permissions as needed
// @run-at       document-idle                     // <- ADJUST timing if needed
// ==/UserScript==

(function() {
    'use strict';

    // Your code here
    console.log('Script loaded!');
})();
```

---

## Essential Header Tags

| Tag | Required | Purpose | Example |
|-----|----------|---------|---------|
| `@name` | Yes | Script name (supports i18n with `:locale`) | `@name My Script` |
| `@namespace` | Recommended | Unique identifier namespace | `@namespace https://yoursite.com/` |
| `@version` | Yes* | Version for updates (*required for auto-update) | `@version 1.2.3` |
| `@description` | Recommended | What the script does | `@description Enhances page layout` |
| `@match` | Yes** | URLs to run on (**or @include) | `@match https://example.com/*` |
| `@grant` | Situational | API permissions (use `none` for no GM_* APIs) | `@grant GM_setValue` |
| `@run-at` | Optional | When to inject (default: `document-idle`) | `@run-at document-start` |

**For complete header documentation, see:** [header-reference.md](references/header-reference.md)

---

## URL Matching Quick Reference

```javascript
// Exact domain                  // @match https://example.com/*
// All subdomains                // @match https://*.example.com/*
// HTTP and HTTPS                // @match *://example.com/*
// Exclude paths (with @match)   // @exclude https://example.com/admin/*
```

**For advanced patterns (regex, @include, specific paths), see:** [url-matching.md](references/url-matching.md)

---

## @grant Permissions Quick Reference

| You Need To... | Grant This |
|----------------|------------|
| Store persistent data | `@grant GM_setValue` + `@grant GM_getValue` |
| Make cross-origin requests | `@grant GM_xmlhttpRequest` + `@connect domain` |
| Add custom CSS | `@grant GM_addStyle` |
| Access page's window | `@grant unsafeWindow` |
| Show notifications | `@grant GM_notification` |
| Add menu commands | `@grant GM_registerMenuCommand` |
| Detect URL changes (SPA) | `@grant window.onurlchange` |

```javascript
// Disable sandbox (no GM_* except GM_info)
// @grant none

// Cross-origin requests require @connect
// @grant GM_xmlhttpRequest
// @connect api.example.com
// @connect *.googleapis.com
```

**For complete permissions guide, see:** [header-reference.md](references/header-reference.md)

---

## @run-at Injection Timing

| Value | When Script Runs | Use Case |
|-------|------------------|----------|
| `document-start` | Before DOM exists | Block resources, modify globals early |
| `document-body` | When body exists | Early DOM manipulation |
| `document-end` | At DOMContentLoaded | Most scripts - DOM ready |
| `document-idle` | After DOMContentLoaded (default) | Safe default |
| `context-menu` | On right-click menu | User-triggered actions |

---

## Common Patterns

These patterns are used frequently. Brief summaries are below - load [patterns.md](references/patterns.md) for full implementations with code examples.

- **Wait for Element** - Promise-based MutationObserver that resolves when a CSS selector appears in the DOM, with configurable timeout
- **SPA URL Change Detection** - Detect navigation in single-page apps using `window.onurlchange` grant or History API interception
- **Cross-Origin Request** - Fetch data from external APIs using `GM_xmlhttpRequest` with `@connect` domain whitelisting. See also [http-requests.md](references/http-requests.md)
- **Add Custom Styles** - Inject CSS with `GM_addStyle` to restyle pages or hide elements. See also [api-dom-ui.md](references/api-dom-ui.md)
- **Persistent Settings** - Store user preferences with `GM_setValue`/`GM_getValue` and expose toggle via `GM_registerMenuCommand`. See also [api-storage.md](references/api-storage.md)
- **DOM Mutation Observation** - Watch for dynamically added content with MutationObserver (debounced variant included)
- **Element Manipulation** - Inject HTML, remove/hide elements, replace text across the page
- **Keyboard Shortcuts** - Simple handlers and a shortcut manager with modifier key support
- **Data Extraction** - Extract table data to arrays/objects, collect and filter page links
- **Error Handling** - Safe wrapper for try/catch and async retry with exponential backoff

---

## External Resources

```javascript
// @require - Load external scripts
// @require https://code.jquery.com/jquery-3.6.0.min.js#sha256-/xUj+3OJU...
// @require tampermonkey://vendor/jquery.js         // Built-in library

// @resource - Preload and inject external CSS
// @resource myCSS https://example.com/style.css    // Then: GM_addStyle(GM_getResourceText('myCSS'))
// @grant GM_getResourceText
// @grant GM_addStyle
```

---

## What Tampermonkey Cannot Do

Userscripts have limitations:

- **Access local files** - Cannot read/write files on your computer
- **Run before page scripts** - In isolated sandbox mode, page scripts run first
- **Access cross-origin iframes** - Browser security prevents this
- **Persist across machines** - GM storage is local to each browser
- **Bypass all CSP** - Some very strict CSP cannot be bypassed

Most limitations have **workarounds** - see [common-pitfalls.md](references/common-pitfalls.md).

---

## When Generating Userscripts

Always include in your response:

1. **Explanation** - What the script does (1-2 sentences)
2. **Complete userscript** - Full code with all headers in a code block
3. **Installation** - "Copy/paste into Tampermonkey dashboard" or "Save as .user.js"
4. **Customisation points** - What the user can safely modify (selectors, timeouts, etc.)
5. **Permissions used** - Which @grants and why they're needed
6. **Browser support** - If Chrome-only, Firefox-only, or universal

---

## Pre-Delivery Checklist

Before returning a userscript, verify:

### Critical (Must Pass)

- [ ] No hardcoded API keys, tokens, or passwords
- [ ] @match is specific (not `*://*/*`)
- [ ] All external URLs use HTTPS
- [ ] User input sanitised before DOM insertion

### Important (Should Pass)

- [ ] Wrapped in IIFE with 'use strict'
- [ ] All @grant statements are necessary
- [ ] @connect includes all external domains
- [ ] Error handling for async operations
- [ ] Null checks before DOM manipulation

### Recommended

- [ ] @version follows semantic versioning (X.Y.Z)
- [ ] Works in both Chrome and Firefox
- [ ] Comments explain non-obvious code

**For complete security checklist, see:** [security-checklist.md](references/security-checklist.md)

---

## Reference Files Guide

Load these on-demand based on user needs:

| File | When to Load |
|------|--------------|
| **Core** | |
| [header-reference.md](references/header-reference.md) | Header syntax - all @tags with examples |
| [url-matching.md](references/url-matching.md) | @match, @include, @exclude patterns |
| [patterns.md](references/patterns.md) | Common implementation patterns with code |
| [sandbox-modes.md](references/sandbox-modes.md) | Security/isolation execution contexts |
| **API** | |
| [api-sync.md](references/api-sync.md) | GM_* synchronous function usage |
| [api-async.md](references/api-async.md) | GM.* promise-based API usage |
| [api-storage.md](references/api-storage.md) | GM_setValue, GM_getValue, listeners |
| [http-requests.md](references/http-requests.md) | GM_xmlhttpRequest cross-origin |
| [web-requests.md](references/web-requests.md) | GM_webRequest interception (Firefox) |
| [api-cookies.md](references/api-cookies.md) | GM_cookie manipulation |
| [api-dom-ui.md](references/api-dom-ui.md) | addElement, addStyle, unsafeWindow |
| [api-tabs.md](references/api-tabs.md) | getTab, saveTab, openInTab |
| [api-audio.md](references/api-audio.md) | Mute/unmute tabs |
| **Quality** | |
| [common-pitfalls.md](references/common-pitfalls.md) | What breaks scripts and workarounds |
| [debugging.md](references/debugging.md) | How to debug userscripts |
| [browser-compatibility.md](references/browser-compatibility.md) | Chrome vs Firefox differences |
| [security-checklist.md](references/security-checklist.md) | Pre-delivery security validation |
| [version-numbering.md](references/version-numbering.md) | Version string comparison rules |
