# Three JavaScript environments

Code for Tag Manager is written in one of three places, each with its own rules. Name the environment before writing a line; code in the wrong style is the commonest GTM mistake.

| | Custom HTML tag | Custom JavaScript variable | Custom template (sandboxed JavaScript) |
|---|---|---|---|
| Where it runs | In the visitor's page (web containers only) | In the visitor's page, each time the variable is evaluated | In Tag Manager's sandbox - in the browser for a web container, on the tagging server for a server container |
| Accepted syntax | ECMAScript 5 only | ECMAScript 5 only | ECMAScript 5.1 plus some ES6: arrow functions, `const` / `let` |
| `window`, `document`, DOM | Available | Available | Not available. Nor are global functions such as `setTimeout` and `encodeURI`, the `new` keyword, `this` inside functions, or constructors such as `String()` and `Number()` |
| Required shape | HTML; JavaScript must sit inside `<script></script>` | One anonymous function that returns a value: `function() { return ...; }` - no name, no statements outside it | Top-level code. Every API is imported with `require('apiName')` and needs a matching permission. A tag template must call `data.gtmOnSuccess()` or `data.gtmOnFailure()` on every path; a variable template must `return` its value |
| How it reads data | `{{Variable Name}}` references; page globals | `{{Variable Name}}` references; page globals | `data.<field name>` for the template's fields; APIs for everything else - `copyFromDataLayer`, `copyFromWindow`, `getUrl`, `getCookieValues` (web), `getAllEventData`, `getEventData` (server) |
| Side effects | Whatever the page allows | Keep it to returning a value | Only through APIs: `sendPixel`, `injectScript`, `setInWindow`, `callInWindow`, `createQueue` (web); `sendHttpRequest`, `sendHttpGet` (server, both return a promise) |

## Syntax in Custom HTML tags and Custom JavaScript variables

Both are **ECMAScript 5 only**. Tag Manager compiles and minifies container code with the Closure Compiler in ES5 mode before publishing, whatever the visitor's browser supports. ES6 syntax - `const`, `let`, arrow functions, template literals, destructuring, spread, classes, `async` - raises a compiler error ("this language feature is only supported for ECMASCRIPT6 mode or better") and the container cannot be published. Google's help pages state no version; this is how the compiler behaves.

- Write `var`, `function () {}` and string concatenation.
- For modern syntax, in order of preference: move the logic into a custom template, which accepts `const`, `let` and arrow functions; transpile to ES5 before pasting; or have an ES5 Custom HTML tag inject an external script, which the compiler never sees.
- `<script type="text/gtmscript">` is an undocumented attribute that practitioners report gets a block past the syntax check. Google's documentation does not mention it, so it can stop working without notice, and nothing validates what it wraps.
- Nothing transpiles for you: code that reaches the page must still run in every visitor's browser.
- Minification can turn single quotes into double quotes in Custom HTML.

## Sandboxed JavaScript specifics

- Types are `null`, `undefined`, `string`, `number`, `boolean`, `array`, `object` and `function`. `JSON`, `Math` and `Object` come from `require()`, not from globals.
- Web and server containers have separate API references. `sendHttpRequest`, `createRegex` and `testRegex` are in the server reference and absent from the web one; `claimRequest`, `runContainer` and `returnResponse` are client-template APIs on the server. Check the reference for the container type before calling an API.
- Consent in a template goes through `setDefaultConsentState` and `updateConsentState` (permission `access_consent`), not `gtag('consent', ...)` - a queued gtag command may not run before the next trigger.
- `readAnalyticsStorage` (added 2025-08) returns the GA client and session IDs; use it in place of parsing the `_ga` cookies.
- Permissions are added when an API is required; narrow each one to named URLs, cookies or keys.

## Regex dialect

Which engine runs a pattern depends on where it is evaluated: in the visitor's browser, in a template sandbox, or on Google's servers. Google's Tag Manager help names no engine for web containers; the JavaScript rows below describe observed behaviour.

| Where | Engine | Default matching | Notes |
|---|---|---|---|
| Web-container trigger and filter conditions (**matches RegEx**, **matches RegEx (ignore case)**) | JavaScript `RegExp`, in the browser | Substring - acts like "contains" unless anchored with `^` and `$` | Lookahead, lookbehind and backreferences work. Inline flags such as `(?i)` do not - use the ignore-case operator |
| Custom Event trigger, **use regex matching** | JavaScript `RegExp` | The event name field becomes a pattern | `.*` fires on every event, including those Tag Manager and the Google tag emit themselves, such as `gtag.config` |
| Regex Table variable | JavaScript `RegExp` | Whole input, case ignored - **Full Matches Only** and **Ignore Case** are on by default under Advanced Settings | Rows are tried in order and the first match wins. Outputs can reuse capture groups with dollar-sign syntax when that option is on |
| Web container templates | No regex API | - | String methods `match`, `replace`, `search` and `split` are available |
| Server container templates, `createRegex` / `testRegex` | RE2 | - | Only the `g` and `i` flags are honoured; other flags are silently ignored. A regex created with `g` is stateful. No lookarounds or backreferences |
| GA4 event create and modify rules | JavaScript `RegExp`, in the browser | Whole string - wrap with `.*` to match a substring | These rules backtrack, so a heavy pattern costs the visitor's browser |
| GA4 reports, Explorations, segments and audiences | RE2, on Google's servers | Whole string in most places; custom channel groups allow a partial match | No lookarounds or backreferences. Inline `(?i)` is supported |

A pattern tested in a GTM trigger often fails in a GA4 Exploration or audience: it may rely on a lookahead RE2 rejects, or on substring matching where GA4 needs `.*` around it. When one pattern has to work in several of these places, write the shared subset:

- Use character classes, `* + ? {n,m}`, `^ $`, `\d \w \s`, groups `( )` and `(?: )`, and alternation.
- Leave out lookahead `(?= )` `(?! )`, lookbehind `(?<= )` `(?<! )`, backreferences `\1` and possessive quantifiers - RE2 rejects them.
- Leave out inline flags such as `(?i)` - JavaScript rejects them.
- Anchor explicitly with `^` and `$`, so substring and whole-string engines agree.

## Sources

- <https://developers.google.com/tag-platform/tag-manager/templates/sandboxed-javascript>
- <https://developers.google.com/tag-platform/tag-manager/templates/api>
- <https://developers.google.com/tag-platform/tag-manager/templates/standard-library>
- <https://developers.google.com/tag-platform/tag-manager/server-side/api>
- <https://support.google.com/tagmanager/answer/6107167> (Custom HTML)
- <https://support.google.com/tagmanager/answer/7683362> (variable types, Regex Table)
- <https://support.google.com/tagmanager/answer/7679109> (regex operators)
