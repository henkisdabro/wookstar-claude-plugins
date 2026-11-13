# Google Tag Manager glossary

One canonical meaning per term, with the terms it gets confused with. When a request uses one of these words loosely, settle which meaning is meant before advising.

## Events

**dataLayer event**:
A message pushed to `dataLayer` that carries an `event` key. It exists only in the page: nothing leaves the browser because of it.
_Not the same as_: a vendor event. A `dataLayer.push` with no tag listening sends nothing anywhere.

**Trigger firing**:
A trigger's conditions matching one dataLayer event, which lets the tags attached to it run.
_Not the same as_: the dataLayer event itself (many events match no trigger), or the tag succeeding.

**Vendor event**:
A hit a tag sends to a vendor - a GA4 event, an Ads conversion, a Meta event. It has its own name and parameters, set in the tag, which need not equal the dataLayer event name.
_Avoid_: calling this "the event" without saying which kind.

**Automatic event detection**:
The Google tag setting (in an optimised container, a Shared setting) under which the tag itself detects page views, history changes, scrolls, outbound clicks, form interactions, video engagement and file downloads.
_Not the same as_: GA4 **Enhanced measurement**, the switch on a GA4 web data stream. Observed in practice (late 2026): they are separate switches and can disagree.

**Key event**:
A GA4 event marked as important to the business, used in Analytics reports.
_Not the same as_: a **conversion**, the Google Ads measure used for bidding and ad reporting, which can be created from an Analytics event. A GA4 event is neither until marked or imported.

## Tags and loaders

**Tag**:
A unit in a container that runs when a trigger fires, usually to send a vendor event.
_Avoid_: **pixel** - a vendor's word for its tag or its base code. In Shopify, "custom pixel" is a Shopify sandbox, not a GTM object.

**Container snippet**:
The install code on the site that loads `gtm.js` for a `GTM-` container. See **old snippet** and **new snippet**.
_Not the same as_: the Google tag snippet, which loads `/gtag/js` for a `G-`, `AW-`, `DC-` or `GT-` ID.

**gtag.js**:
Google's own library and `gtag()` command API, installed without Tag Manager.
_Not the same as_: `gtm.js` (the container). The new container snippet also defines a `gtag()` function, which does not make the site a gtag.js install.

**Google tag**:
In a legacy container, the tag (API type `googtag`) that loads one Google product by its tag ID and carries its configuration. Its collection settings live in the product's own Google tag settings screen, outside the container.
_Avoid_: **GA4 Configuration tag** - retired; those tags became Google tags on 2023-09-05.
_Not the same as_: a Destination tag.

**GA4 Event tag**:
The tag (API type `gaawe`) that sends one GA4 event. Unchanged between the legacy and optimised models.

**Conversion Linker**:
The tag that stores ad-click information in first-party `_gcl_*` cookies and local storage. Google: a container that already loads a Google tag or a matching Destination tag on every page does not also need one.

**Custom HTML tag**:
A tag holding raw HTML and `<script>` code that runs in the page.
_Not the same as_: a **custom template** (sandboxed JavaScript with declared permissions, built in the container) or a **community template** (a custom template imported from the Community Template Gallery).

## Container models (2026)

**Destination**:
A Google measurement product account that receives data from the container: a GA4 web data stream, a Google Ads account, a Floodlight configuration or a Merchant Center conversion source.

**Destination tag**:
The tag that connects one Destination to the container and sends data to it directly, without loading a separate gtag.js. Settings and permissions are governed at container level.
_Not the same as_: a Google tag. Google's help sometimes writes "destination (Google) tag"; keep the two apart by what the container actually holds.

**Optimised container**:
A container whose Google products are all attached by Destination tags, with collection settings held in the container. Launched 2026-10-12; adopting it is a choice.
_Not the same as_: a **legacy container** (Google products loaded by Google tags; still fully supported) or a **mixed container** (both kinds present - usually a half-finished migration).

**Shared settings**:
The container-level collection settings every Destination inherits - automatic event detection, domains, user-provided data, internal traffic, unwanted referrals, session timeout, cookie and consent overrides. Google's help calls this the **Settings** tab.
_Not the same as_: Google tag settings (per product, outside the container) or the "Google tag: Configuration settings" variable.

**External account link**:
A link between the container and a Destination's product account that lets that product's users open the container. It is a permission, not versioned.

**Old snippet**:
The inline function that pushes `{'gtm.start': ..., event: 'gtm.js'}` and injects `gtm.js`, plus a `<noscript>` iframe in `<body>`. Still works; no retagging needed.

**New snippet**:
The 2026 head-only install: a static `<script async src=".../gtm.js?id=GTM-XXXXXXX">` plus a block that defines `dataLayer` and `gtag()` and calls `gtag('js', new Date())`.

## Triggers

**Trigger**:
A condition evaluated against each dataLayer event. Several firing triggers on one tag are ORed; conditions inside one trigger are ANDed.

**Trigger group**:
A trigger made of other triggers, giving AND across triggers.
_Not the same as_: adding several triggers to a tag, which is OR.

**Exception**:
A trigger attached to a tag to block it when the exception matches.
_Avoid_: "blocking trigger" as if it were a separate trigger type - any trigger can serve as an exception.

## Variables

**Built-in variable**:
A predefined variable that is switched on, not created (Page Path, Click URL, Container Version, and since 2025-12 Client ID, Session ID and Session Number).

**User-defined variable**:
A variable created in the container from a variable type.

**Data Layer Variable**:
A user-defined variable that reads one key from the data layer model. Version 2 treats dots as nesting; Version 1 treats `a.b.c` as a single key.
_Not the same as_: a **JavaScript Variable**, which reads a global such as `document.title`.

**Custom JavaScript variable**:
A user-defined variable whose value is the return value of one anonymous function.
_Not the same as_: a JavaScript Variable, or a variable template.

**Google tag: Configuration settings / Event settings variables**:
Variables holding a reusable table of configuration-level or event-level parameters for Google tags, Destination tags and GA4 Event tags.
_Avoid_: **Google Analytics Settings variable** - Universal Analytics, legacy only.

## Containers and releases

**Container**:
The set of tags, triggers and variables published under one container ID.
_Not the same as_: an **account** (holds containers and users).

**Workspace**:
A draft area for changes; nothing in it is live.

**Version**:
A saved snapshot of the container. Creating a version does not publish it.

**Publish**:
Making a version live in an environment.
_Not the same as_: **Preview**, which runs a workspace or version in one browser only, or saving, which only changes the workspace.

**Environment**:
A named target a version is published to. Live is the only built-in one; custom environments have their own snippet and are for non-production sites.

**Web container**:
A container that runs in the visitor's browser.
_Not the same as_: a **server container**, which runs on a server the owner controls and receives requests from browsers or apps.

**Client** (server container):
An adapter that claims an incoming request and turns it into events; once one client claims a request, no other client runs.
_Not the same as_: a tag in a server container, which fires on those events and sends data onward. Also not the GA4 "client ID".

**Event data** (server container):
The object a client builds from the incoming request; server tags and variables read it.
_Not the same as_: the `dataLayer`, which exists only in the browser. A server container has no page, no DOM and no `dataLayer`.

## Identifiers

**Container ID** (`GTM-XXXXXXX`):
Identifies a Tag Manager container and allows every tag type.

**Google tag ID** (`G-`, `AW-`, `DC-`, `GT-` prefixes):
Identifies a Google tag. A container loaded under one of these IDs runs Google tags only.

**Measurement ID** (`G-XXXXXXXXXX`):
Identifies a GA4 web data stream; it is also usable as a Google tag ID and is the Destination ID for GA4.
_Not the same as_: the GA4 property ID (numeric), or a Google Ads conversion ID (`AW-XXXXXXXXX`).

## Consent

**Consent type**:
One named permission in Consent Mode: `ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`, and the non-Google-specific `functionality_storage`, `personalization_storage`, `security_storage`.

**Basic consent mode**:
Google tags are blocked from loading until the visitor answers the banner; nothing is sent before that.
_Not the same as_: **advanced consent mode**, where Google tags load at once, send cookieless measurements while consent is `denied`, and send full data after it is granted.

**Built-in consent check**:
Consent behaviour inside a tag type (Google Ads, Google Analytics, Floodlight).
_Not the same as_: an **additional consent check**, set per tag under Consent Settings to require named consent types before the tag fires - the only gate a non-Google tag has.
