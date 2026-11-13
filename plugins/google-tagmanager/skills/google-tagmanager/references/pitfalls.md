# Pitfalls by task

Each line is the wrong move, then the right one. Read only the group for the task in hand. The pitfalls listed in SKILL.md apply to every task and are not repeated here. **(observed)** marks points from practitioner field notes in late 2026 that Google's documentation does not state.

## Installing a container

- Loading a `G-`, `AW-` or `DC-` ID through the `gtm.js` snippet, or pairing a `gtm.js` snippet with `gtag('config')` -> unsupported. A `GTM-` ID goes with `gtm.js`; a site that configures through `gtag('config')` uses the gtag.js snippet.
- Assuming the loading path decides what a container may run -> since 2026-07 the container ID does: `GTM-` allows every tag type, product IDs allow Google tags only.
- Assigning `dataLayer = [...]` after the snippet -> it overwrites the queue Tag Manager listens to. Declare `window.dataLayer = window.dataLayer || []` above the snippet and only ever `push`.
- Shopify: treating a custom pixel like a normal page -> custom pixels (Customer events) run in a sandboxed iframe, so a container loaded there cannot read the storefront DOM and receives only the events Shopify publishes to it. Keep storefront theme tracking and checkout pixel tracking as two separate designs.
- Shopify: pasting the snippet into `theme.liquid` and expecting checkout coverage -> that covers the storefront only. Shopify's documented route is a custom pixel that loads GTM and forwards `analytics.subscribe` events to `dataLayer`. Inside the pixel sandbox GTM keeps no persistent data layer state, so send the full data with each event; only Shopify's standard events arrive unless the theme calls `analytics.publish()`; Tag Assistant's "Troubleshoot tag" does not work there.
- Describing Latest or Now Editing as built-in environments -> only Live is documented as built in.

## Google products - GA4, Ads, Floodlight

- Universal Analytics concepts in a GA4 setup - Event Category, Action and Label, Views, Goals, `analytics.js`, `ga('send', ...)` -> none exist in GA4. An interaction is an event name plus parameters.
- Adding a Conversion Linker by reflex -> a container that already loads a Google tag or a matching Destination tag on every page does not need one. Do not delete an existing one mid-migration; pause it.
- Forgetting that a Destination tag sends a page view by itself -> check for a second page-view source before adding one.
- Leaving a second `gtag()` source on the page (a CMS plugin, hard-coded gtag.js) beside the container -> it collects in parallel and, since 2026-10-08, each `gtag('config')` call also arrives in the container as a `gtag.config` event.
- Reusing the Universal Analytics "Google Analytics Settings" variable -> shared parameters go in the "Google tag: Configuration settings" and "Google tag: Event settings" variables.
- Writing a Custom JavaScript variable to parse `_ga` cookies -> since 2025-12 Client ID, Session ID and Session Number are built-in variables, and there is an Analytics Storage user-defined variable.
- Saying "mark it as a conversion in GA4" -> GA4 has key events; conversions are the Google Ads measure.
- Assuming Ads and Floodlight tags send nothing but their own hit -> since April 2025 a container with those tags and no connected Destination tag loads a Google tag first, and user-provided data settings apply to its events.

## Triggers

- Firing a tag on Page View, DOM Ready or Window Loaded when it reads a value the site pushes later -> the variable resolves empty. Fire on a Custom Event trigger for the push that carries the value, and name the trigger in the answer.
- Using tag firing priority to make one tag finish before another -> priority (an integer, default 0, higher first) orders when tags start. Tags run asynchronously; use tag sequencing (setup and cleanup tags) for a real dependency.
- Expecting several triggers on a tag to all be required -> they are ORed. AND across triggers is a trigger group.
- SPA page views from a History Change trigger alone -> check whether automatic detection already sends history-change page views. Since 2026-11-09 these also fire when a page is restored from the back/forward cache.
- A click or form trigger whose condition uses a variable that reads blank -> the built-in Click and Form variables must be switched on under Variables > Configure.

## Variables and the data layer

- Pushing values without an `event` key and expecting a tag to react -> the values are stored, but only a message with an `event` key is evaluated against triggers.
- Pushing the data after the event that needs it -> put the values in the same push as the `event`, or in an earlier one.
- Assuming a key pushed for one event is gone by the next -> Tag Manager merges every push into one data model, so a key keeps its last value until it is overwritten or the page unloads. In a single-page app or multi-step form, reset keys that must not carry over (push them as `undefined`), as with `ecommerce: null`.
- Expecting data layer values to survive a page load -> they last only while the visitor stays on the page.
- Reading `a.b.c` with a Data Layer Variable on Version 1 -> Version 1 treats the dots as part of one key; Version 2 reads nested values, including array indexes such as `ecommerce.items.0.item_name`.
- A Custom JavaScript variable that throws when an element or key is missing -> wrap the body in `try { ... } catch (e) { return undefined; }`, and return on every path; an accidental `null` or empty object changes how trigger comparisons read it.
- Pushing personal data in clear text -> hash or pseudonymise before it reaches the data layer.

## Consent Mode

Setup order for Consent Mode v2:

Four consent types gate Google tags: `ad_storage`, `analytics_storage`, `ad_user_data` and `ad_personalization`.

1. Add the CMP's template from the Community Template Gallery, or build one on the `setDefaultConsentState` / `updateConsentState` template APIs.
2. Fire it on **Consent Initialization - All Pages**, so defaults (usually `denied`, optionally per region, with `wait_for_update`) are set before any other tag.
3. The CMP updates consent when the visitor chooses; Google tags adjust by themselves. For other tags, set **Additional consent checks** in each tag's Consent Settings, and use **Consent Overview** to confirm every tag is covered.
4. Choose basic mode (Google tags blocked until consent) or advanced mode (they load and send cookieless measurements while denied).
5. Check that Preview's Consent tab shows the defaults on Consent Initialization, before the first tag fires.

Pitfalls:

- Marketing tags on All Pages when a banner gates them -> they miss the visitor who accepts on that page, until the next page load. Fire them on the CMP's own consent-update event (its name differs per CMP - read the CMP's docs), with the consent check on the tag.
- Calling `gtag('consent', ...)` from a custom template or Custom HTML tag -> use the template APIs `setDefaultConsentState` and `updateConsentState`; a queued gtag command may not run before the next trigger.
- Assuming a non-Google tag respects consent -> it does only if **Additional consent checks** is set to require consent for it. Enable **Consent Overview** (Admin > Container Settings > Additional Settings) to see every unconfigured tag.
- Blocking Google tags with exception triggers while calling the set-up "advanced" -> blocking until consent is basic mode; in advanced mode Google tags load and send cookieless measurements while denied.
- Missing the consent settings outside the tag list -> "Set consent mode override" and "Manage default consent settings" are Google tag settings (Shared settings in an optimised container).

## Custom templates

- `sendHttpRequest` in a web container template -> it is a server container API. Web templates have `sendPixel` (GET) and `injectScript`.
- A permission left at "any" -> restrict it to the URLs, cookies and keys the template needs.

## Server containers

- Referring to the `dataLayer` in a server container -> there is none. Tags and variables read the **event data** object a client built from the incoming request (`getAllEventData`, `getEventData`, Event Data variables).
- A browser tag plus the same vendor's server-side API (Meta, TikTok and similar) with no shared ID -> the vendor counts the action twice. Generate one deduplication ID per event in the web container and send it on both routes - `event_id` for Meta and TikTok; check the vendor's name for it.
- Running the tagging server on a third-party domain -> serve it from a subdomain of the site, so its cookies are first-party. On a same-site domain the GA4 client can keep the client ID in a server-set `FPID` cookie marked `HttpOnly`, which page scripts cannot read - so do not plan to read it from the browser.
- Reading the page from a server container - `document`, `window`, cookies via the DOM, element scraping -> none of it exists there. A server container sees an incoming HTTP request and the event data a client built from it; anything from the page must be sent in that request.
- Describing a server container as one that replaces the web container -> something must still send requests to it; a web container's Google tag or Destination tag routes there through the `server_container_url` parameter.
- Expecting tags to see a request no client claimed -> a client must claim the request and produce events; once one claims it, no other client runs.
- Serving `gtag.js` or `gtm.js` through the GA4 client -> since 2025-06-30 scripts are served through the web container client.
- Writing regex with lookarounds in a server template -> `createRegex` is RE2.
- Calling first-party serving "first-party mode" -> renamed Google tag gateway for advertisers on 2025-05-08.

## Debugging and verifying

- Stopping at "the tag fired" in Preview -> that shows the tag ran. Confirm the hit arrived in the vendor's own view; for GA4, Admin > Data display > DebugView. Preview mode sends that browser's GA4 events in debug mode automatically.
- Pointing at "Tag Assistant Legacy" or "Tag Assistant Companion" -> there is one Tag Assistant extension.
- Scanning `window.dataLayer` for the `gtm.js` / `gtm.start` object to detect the container -> the new snippet pushes none **(observed)**. Check `window.google_tag_manager` or the network request for `gtm.js`.
- Testing a publish immediately -> browsers can hold the previous `gtm.js` for about 15 minutes **(observed)**.
- Unsure which version a visitor ran -> the built-in Container Version variable returns the preview version in Preview and the live version otherwise.
- Promising a side-by-side diff of two arbitrary versions -> each version shows only its changes from the one before; Custom HTML changes are highlighted there.

## API, CLI and governance

- Composing resource bodies from memory -> read an existing resource first. Type codes: `googtag` (parameter `tagId`), `gaawe`, `html`, `v` (Data Layer Variable). Use resource paths returned by the API instead of building them.
- Ignoring quotas in a bulk script -> 10,000 requests per day and 0.25 queries per second; pace calls and back off on HTTP 429.
- Treating "create version" as "publish" -> separate operations, and separate OAuth scopes (`tagmanager.edit.containerversions`, `tagmanager.publish`).
- Proposing an approval workflow on a standard container -> **Request Approval** exists in Tag Manager 360 only.
- Expecting the API to return a legacy Google tag's own settings -> it does not **(observed)**; ask for the Google tag settings screen.
- Deleting or publishing as part of "tidying up" -> state the account, container, workspace and change, and wait for approval.

## Specs and audits

- A tracking spec written as prose -> give one table: event name, trigger condition, data layer payload (JSON), and the destination parameter each key maps to.
- An audit with no checklist -> read the real container, state its model (legacy, optimised or mixed), then check at least: Universal Analytics tags or "GA4 Configuration" tags still present; tags on All Pages with no consent check; Custom HTML tags injecting render-blocking or unreviewed third-party scripts; the same event from two sources - automatic event detection, GA4 Enhanced measurement and a manual tag, page views on history change above all; wildcard Custom Event triggers; and tags with no firing trigger.

