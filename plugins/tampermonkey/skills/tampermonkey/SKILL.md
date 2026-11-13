---
name: tampermonkey
description: "Write and debug Tampermonkey userscripts - scripts that change or automate a website from inside the browser. Use when the user wants a userscript (Tampermonkey, Greasemonkey or Violentmonkey), wants JavaScript or CSS injected into a site they visit, wants page elements hidden or rearranged, wants a form auto-filled or page data scraped, needs to react to URL changes in a single-page app, needs cross-origin requests from a page script, has a userscript that does not run, or is setting one up in TypeScript. Do NOT use for Selenium, Puppeteer or Playwright automation - use a browser-automation tool; for building a browser extension (WebExtensions/Manifest V3) - write it as an extension; or for server-side scripts."
allowed-tools: Read, Glob, Grep, Write, Edit, Bash(npm *), Bash(pnpm *), Bash(npx *), Bash(node *)
---

# Tampermonkey Userscript Development

## Steps

1. **Read the references the task needs** from the table at the end. Done when every file whose condition matches the task has been read.
2. **A script that does not run:** in Chrome and Edge, first have the user confirm the "Allow User Scripts" toggle on the extension's details page (Developer Mode on older browsers) - [common-pitfalls.md](references/common-pitfalls.md) Pitfall 15 - then work through [debugging.md](references/debugging.md). Done when the cause is named and the fix is in the script or handed to the user.
3. **Write the header** from the template below. Done when every GM API the body calls has its `@grant`, every cross-origin host has its `@connect`, and `@match` covers only the target pages.
4. **Write the body**, checking each limit below against what the user asked for. Done when the script is complete, with no placeholder left for the user to fill beyond the customisation points you name.
5. **Run the pre-delivery checklist.** Done when every item passes or the failure is stated in the reply.
6. **Reply** with: what the script does (1-2 sentences); the complete userscript in one code block; installation ("Copy/paste into Tampermonkey dashboard" or "Save as .user.js"); customisation points the user can safely change (selectors, timeouts); each `@grant` used and why; browser support if not universal.

## Template

```javascript
// ==UserScript==
// @name         My Script Name                    // unique script name
// @namespace    https://example.com/scripts/      // your unique namespace
// @version      1.0.0                             // increment on every update
// @description  Brief description of the script
// @author       Your Name
// @match        https://example.com/*             // target URL pattern
// @grant        GM.getValue                       // one line per GM API used
// @grant        GM.setValue
// @run-at       document-idle                     // the default
// ==/UserScript==

(async () => {
    'use strict';
    const setting = await GM.getValue('myKey', 'default');
})();
```

A script that uses no GM APIs takes `@grant none` (which disables the sandbox) and a plain `(function() { 'use strict'; ... })();` wrapper.

## Grants

| The script needs to | Grant |
|---------------------|-------|
| Store persistent data | `GM_setValue` + `GM_getValue` |
| Batch read/write settings (v5.3+) | `GM.getValues` + `GM.setValues` |
| Make cross-origin requests | `GM_xmlhttpRequest` + `@connect domain` |
| Add custom CSS | `GM_addStyle` |
| Access the page's window | `unsafeWindow` |
| Show notifications | `GM_notification` |
| Add menu commands | `GM_registerMenuCommand` |
| Detect URL changes (SPA) | `window.onurlchange` |
| Mute/unmute tab audio | `GM_audio` |

## Limits

A userscript cannot:

- read or write local files
- run before page scripts when in isolated sandbox mode
- reach into cross-origin iframes
- carry GM storage across machines - it is local to each browser
- bypass a very strict CSP
- run in Chrome or Edge until the user enables "Allow User Scripts" - a script cannot request or bypass this

Workarounds for most of these are in [common-pitfalls.md](references/common-pitfalls.md).

## Pre-delivery checklist

Critical:

- [ ] No hardcoded API keys, tokens or passwords
- [ ] `@match` is specific (not `*://*/*`)
- [ ] All external URLs use HTTPS
- [ ] User input sanitised before DOM insertion
- [ ] No `eval()`, `new Function()` or string-based `setTimeout`/`setInterval`

Important:

- [ ] Wrapped in an IIFE with `'use strict'`
- [ ] Every `@grant` is necessary
- [ ] `@connect` includes every external domain
- [ ] Error handling for async operations
- [ ] Null checks before DOM manipulation

Recommended:

- [ ] `@version` follows semantic versioning (X.Y.Z)
- [ ] Works in both Chrome and Firefox

## References

| Read | When the task involves |
|------|------------------------|
| [header-reference.md](references/header-reference.md) | Any tag beyond the template: `@run-at` timing, `@run-in`, `@require`/`@resource` with SRI, `@noframes`, update URLs, i18n names |
| [url-matching.md](references/url-matching.md) | A `@match` beyond one domain or its subdomains: specific paths, `@include` regex, `@exclude` |
| [patterns.md](references/patterns.md) | Waiting for an element, SPA navigation, mutation observers, element or form manipulation, keyboard shortcuts, table or link extraction, debouncing, retry with backoff - full implementations |
| [sandbox-modes.md](references/sandbox-modes.md) | `@sandbox`, page-context access, CSP errors, Firefox `cloneInto`/`exportFunction` |
| [api-async.md](references/api-async.md) | `GM.*` promise APIs - prefer these for new scripts |
| [api-sync.md](references/api-sync.md) | `GM_*` callback APIs: notifications, menu commands, clipboard, downloads, resources, `GM_info` |
| [api-storage.md](references/api-storage.md) | Stored settings, batch values, value-change listeners |
| [http-requests.md](references/http-requests.md) | Cross-origin requests with `GM_xmlhttpRequest` |
| [web-requests.md](references/web-requests.md) | Intercepting or blocking requests: `GM_webRequest` (Firefox only), page-level interception elsewhere |
| [api-cookies.md](references/api-cookies.md) | Reading or changing cookies with `GM_cookie` |
| [api-dom-ui.md](references/api-dom-ui.md) | `GM_addElement`, `GM_addStyle`, `unsafeWindow`, custom UI, page frameworks |
| [api-tabs.md](references/api-tabs.md) | Tab-persistent data, opening or closing tabs, cross-tab communication |
| [api-audio.md](references/api-audio.md) | Muting or unmuting tabs |
| [common-pitfalls.md](references/common-pitfalls.md) | A script that misbehaves, or a workaround for a limit above |
| [debugging.md](references/debugging.md) | A script that does not run or throws |
| [browser-compatibility.md](references/browser-compatibility.md) | Chrome vs Firefox differences, Manifest V3, Safari |
| [security-checklist.md](references/security-checklist.md) | Scripts handling credentials, cookies or user input, or reviewing someone else's script |
| [version-numbering.md](references/version-numbering.md) | Version strings beyond X.Y.Z, or auto-update comparison |
| [typescript.md](references/typescript.md) | TypeScript: `@types/tampermonkey`, tsconfig, bundling to a single `.user.js` |
