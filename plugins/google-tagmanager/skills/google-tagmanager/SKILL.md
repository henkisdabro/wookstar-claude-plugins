---
name: google-tagmanager
description: Google Tag Manager guardrails - the overloaded vocabulary, the mistakes models typically make and the optimised container model. Use when installing a GTM container snippet, configuring tags, triggers or variables, designing dataLayer pushes, writing Custom HTML, Custom JavaScript variable or custom template code, setting up Consent Mode in GTM, debugging with Preview mode, migrating a container to Destination tags, setting up a server-side (sGTM) container, auditing a container, or changing containers through the gtm CLI or the Stape MCP server. Do NOT use for gtag.js installs that bypass GTM, GA4 reporting or BigQuery export - use google-analytics; Adobe Launch, Tealium or other tag managers.
---

# Google Tag Manager

## Steps

1. **Settle the vocabulary.** When the request uses an overloaded term - event, tag, pixel, Google tag, conversion, container, publish, snippet - fix its meaning from the matching section of [glossary.md](references/glossary.md). Done when each such term maps to one glossary entry, or the user has been asked which is meant.
2. **Read the container before advising on it**, when one is reachable: through the MCP server or the `gtm` CLI (see Automating a container), or from an exported container JSON the user supplies. Establish its **model** - legacy (Google tags), optimised (Destination tags) or mixed - because the advice differs. Done when the answer names real tag, trigger and variable names and states the model. With no access, say the advice is generic and ask which model applies.
3. **Read the route for the task** (below) and its group in [pitfalls.md](references/pitfalls.md). Done when no line in that group, or in the pitfalls at the end of this file, describes what you are about to recommend.
4. **Give the configuration** as GTM shows it, in the order it has to be built: the `dataLayer.push` the site must make, then variables, triggers, tags, and any setting needed in the destination product. Name each setting by its feature name rather than a click path - Google moves menus often.
5. **Say how to verify it**: the Preview mode check for the tag firing, and DebugView or the vendor's own view for the hit arriving. Done when the user has a check they can run before publishing.

## Routes

| Read | When |
|---|---|
| [glossary.md](references/glossary.md) | A term in the request has more than one meaning in GTM (step 1) |
| [javascript-environments.md](references/javascript-environments.md) | Writing or reviewing any code or regex that goes into a container - Custom HTML, Custom JavaScript variable, custom template, trigger or Regex Table pattern |
| [optimised-container.md](references/optimised-container.md) | The container has Destination tags or Shared settings, a migration is planned or just done, the task adds a Google product, or the install snippet is in question |
| [pitfalls.md](references/pitfalls.md) | Every task (step 3) - one group each for installing, Google products, triggers, variables and data layer, Consent Mode (with its setup order), templates, server containers, debugging, API and governance, specs and audits |
| [cli.md](references/cli.md) | Installing or using the `gtm` CLI |
| [tool-setup.md](references/tool-setup.md) | The task needs a real container and the session has neither tool |
| [vendor-docs.md](references/vendor-docs.md) | A step-by-step procedure this skill leaves to Google - the link for each topic |

## Automating a container

Two ways to read and change a container without the GTM UI. Both are third-party tools on Google's API, and both can create, update, delete and publish.

| Tool | Reach for it when |
|---|---|
| `gtm` CLI - [owntag/gtm-cli](https://github.com/owntag/gtm-cli), local binary | The default: scripting, CI, bulk audits and exports, service-account auth, and container access that stays on the user's machine |
| Stape's hosted GTM MCP server, added by the user from Stape's guide | Its tools are present in the session |

Use whichever the session has. With neither - no such tools and `command -v gtm` finds nothing - read [tool-setup.md](references/tool-setup.md) and offer the user the choice of the two.

**Guardrail for both:** before a delete or a publish, state what will change and in which account, container and workspace, and wait for the user's approval.

## Pitfalls on every task

- **A `dataLayer.push` sends nothing.** A hit leaves the browser only when a tag fires on a trigger that matches the push's `event`.
- **Two container models.** "GA4 in GTM is the Google tag plus GA4 Event tags" holds for legacy containers only. On an optimised container (since 2026-10-12) Destination tags replace Google tags and collection settings are Shared settings. Advising a Google tag or a Conversion Linker there is wrong.
- **The "GA4 Configuration" tag is retired** - it became the Google tag in 2023.
- **Automatic event detection is not GA4 Enhanced measurement.** Check both before adding an event tag for `page_view`, `scroll` or `form_submit`, or the event doubles.
- **Three JavaScript environments, three styles.** A Custom JavaScript variable is one anonymous function that returns a value. A template is sandboxed: no `window` or `document`, APIs through `require()`, and a tag must call `data.gtmOnSuccess()` or `data.gtmOnFailure()`. Custom HTML tags and Custom JavaScript variables are **ES5 only** - `var` and `function () {}`; `const`, `let`, arrow functions and template literals fail to compile and block publishing. Only templates accept `const`, `let` and arrow functions.
- **Regex is not one dialect.** Web-container trigger conditions run JavaScript regex in the browser and match a substring unless anchored with `^` and `$`. GA4 reports, Explorations, segments and audiences use RE2 and match the whole value. A pattern moved between them breaks on lookarounds, backreferences, `(?i)` or a missing `.*`. The Regex Table variable matches the whole input and ignores case by default.
- **Wildcard Custom Event triggers** catch Tag Manager's own events and, since 2026-10-08, a `gtag.config` event for every `gtag('config')` call on the page. Name the event exactly, or anchor the pattern.
- **Ecommerce pushes**: push `{ ecommerce: null }` before each ecommerce event.
- **The install snippet changed in 2026** to a head-only `<script async src>`; it pushes no `gtm.js` object to `dataLayer`. The old snippet still works.
- **No container-level tag timeout exists**; the control is Wait for Tags on link and form triggers.
