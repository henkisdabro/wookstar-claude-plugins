# Google Analytics glossary

The overloaded terms of Google Analytics 4 (GA4), one meaning each. When a request uses one of these words, map it to the entry here before acting; when the user's meaning is unclear, ask which entry they mean.

## Events

**GA4 event**:
A named hit that Google has collected for a data stream, carrying event parameters. It is the only unit of GA4 data - a page view, a purchase and a session start are all events.
_Not the same as_: dataLayer event, key event

**dataLayer event**:
A message pushed to the page's `dataLayer` (`{event: 'name', ...}`) that Tag Manager triggers can listen for. It sends nothing to Google by itself; a tag must fire on it to produce a GA4 event.
_Not the same as_: GA4 event

**Automatically collected event**:
An event the Google tag or Firebase SDK sends with no configuration and that cannot be switched off, such as `session_start`, `first_visit` and `user_engagement`.

**Enhanced measurement event**:
One of the web-stream events GA4 collects when its switch is on in the stream settings: `page_view`, `scroll`, outbound `click`, `view_search_results`, `video_start` / `video_progress` / `video_complete`, `file_download`, `form_start` / `form_submit`. `page_view` cannot be turned off.
_Not the same as_: automatic event detection

**Automatic event detection**:
A Google tag setting that decides whether the tag detects those same interactions at all. It belongs to the tag and affects every destination the tag serves; enhanced measurement belongs to the GA4 web stream. Both must be on for the event to be collected.
_Not the same as_: enhanced measurement

**Recommended event**:
An event whose name and parameters Google has defined (`purchase`, `login`, `generate_lead`) and which you must send yourself. Using the exact name unlocks the matching reports.

**Custom event**:
An event with a name you chose because no automatic, enhanced measurement or recommended event fits.

**Key event**:
A GA4 event marked as important to the business; it feeds GA4's behavioural reports. Formerly called a "conversion" in GA4.
_Avoid_: conversion, goal

**Conversion**:
An ads-measurement object created from a key event and shared between GA4 and a linked Google Ads account, used for campaign reporting and bidding. Google's chain is event -> key event -> conversion; conversions are reported in the Advertising section, not in standard reports.
_Not the same as_: key event

## Parameters and definitions

**Event parameter**:
A key-value pair sent with an event. It is collected and exported to BigQuery whether or not anything else is configured.
_Not the same as_: custom dimension

**User property**:
A key-value attribute set on the user rather than on one event.
_Not the same as_: User-ID

**Custom dimension**:
A registration in the property that makes one event parameter, user property or item parameter available as a dimension in reports, Explorations and the Data API, from registration onwards.
_Not the same as_: event parameter

**Custom metric**:
A registration that makes a numeric event parameter available as a metric. Event scope only.

**Calculated metric**:
A metric defined in the property as a formula over existing metrics; nothing is collected for it.

**Scope**:
What a custom definition's value attaches to: one event (event scope), the user (user scope, fed by a user property) or one entry in the `items` array (item scope).

## Identity

**User-ID**:
An identifier you assign to a signed-in user and send with their events, so GA4 can join their activity across devices.
_Not the same as_: user property, client ID

**Device ID**:
GA4's own pseudonymous identifier for a browser or app install: the client ID on the web (held in the `_ga` cookie) and the app-instance ID in apps. The BigQuery export calls it `user_pseudo_id`.
_Avoid_: user ID, cookie ID

**Google signals**:
A property setting that lets Google enrich reports with demographics, interests and aggregated cross-device data from signed-in Google users who allow ads personalisation. It is not one of the reporting identity options, and its data is not exported to BigQuery.

**Reporting identity**:
The property setting that chooses how reports count users: Blended (User-ID, then device ID, then modelling), Observed (User-ID, then device ID) or Device-based (device ID only). It changes reports only, never collection, and can be switched at any time.

## Sessions

**Session**:
A run of one user's events that begins with `session_start` and ends after 30 minutes of inactivity by default. Its `ga_session_id` is the start time in seconds, so it is unique only together with the device ID. A session is derived from events; the BigQuery export has one row per event and no session table.

## Structure and IDs

**Account**:
The top-level container that holds properties and account-level access.

**Property**:
The unit that holds data, settings, reports and product links. Identified by the property ID.

**Data stream**:
One source of events into a property: a website, an iOS app or an Android app.

**Property ID**:
The numeric ID of a property (`123456789`). The Admin API, the Data API, the Analytics MCP server, the `ga` CLI and the BigQuery dataset name (`analytics_123456789`) use it.
_Not the same as_: measurement ID

**Measurement ID**:
The `G-XXXXXXXXXX` ID of a web data stream. Tags and the Measurement Protocol use it. For Google Analytics it is the same value as the destination ID.
_Not the same as_: property ID, Google tag ID

**Stream ID**:
The numeric ID of a data stream; the `stream_id` column in the BigQuery export.

**Google tag ID**:
An ID placed on the page to load a Google tag. It can be a `GT-XXXXXXX`, `G-XXXXXXXXXX` or `AW-` ID, and one tag can answer to several.
_Not the same as_: measurement ID

**Destination ID**:
The ID of the product account a Google tag sends to: the measurement ID for Google Analytics, the `AW-` ID for Google Ads.

**Container ID**:
The `GTM-XXXXXXX` ID of a Tag Manager container.

## Tagging

**Google tag**:
The single tag Google products share to collect from a website and route events to one or more destinations. Its settings (automatic event detection, domains, internal traffic, unwanted referrals, session timeout, cookie overrides) belong to the tag, not to the GA4 property. Formerly the global site tag.

**gtag.js**:
The JavaScript library and `gtag()` command API through which a page loads and commands a Google tag directly.
_Not the same as_: Google tag, Tag Manager container

**Tag Manager container**:
A separately managed bundle of tags, triggers and variables loaded by its `GTM-` ID, which can run Google and non-Google tags.

**Optimised container**:
A Tag Manager container upgraded (available since 12 October 2026) to send data straight to Google destinations without loading gtag.js, with Google settings held in the container.

**Destination**:
A Google product account that receives data from a Google tag or a Tag Manager container: a GA4 web data stream, a Google Ads account, a Floodlight configuration or a Merchant Center conversion source.

**Destination tag**:
The Tag Manager tag that connects one destination to a container and sends to it directly. Adding one sends a page view for that destination automatically.
_Not the same as_: Google tag, GA4 Event tag

## Analysis objects

**Audience**:
A stored group of users who met conditions; users enter and leave over time. It fills from its creation onwards and can be shared with linked ad products.
_Not the same as_: segment

**Segment**:
A set of conditions that filters data inside Explorations, at user, session or event level. Fully retroactive, with no membership.
_Not the same as_: audience, comparison

**Comparison**:
A side-by-side filter on dimension values applied to standard reports.
_Not the same as_: segment

## Ways to read the data

**Standard reports**:
The Reports section of the GA4 interface, served from pre-aggregated tables.

**Explorations**:
The Explore section: ad-hoc analysis over event-level data, limited by the property's data retention setting.

**Data API**:
The programmatic route to report data. The Analytics MCP server and the `ga` CLI's report commands are clients of it.

**BigQuery export**:
A copy of the raw events GA4 received, written to BigQuery tables you own.

**Thresholding**:
Rows withheld by GA4 so that individuals cannot be inferred from small counts. System-defined; it cannot be adjusted.
_Not the same as_: sampling

**Sampling**:
A result computed from part of the events and scaled up, applied when a query needs more events than the property's quota allows.

**(other) row**:
The row that groups the remaining values when a table exceeds its row limit.

**Modelling**:
Estimates GA4 adds for users it could not observe. Behavioural modelling fills in users who declined analytics consent; it is what the Blended reporting identity falls back to.

## Consent

**Consent mode**:
The mechanism by which a site tells Google tags what the visitor consented to. Version 2 (November 2023) has four types Google acts on: `ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`.

**Basic consent mode**:
Google tags are blocked until the visitor consents, so nothing is collected for visitors who decline.

**Advanced consent mode**:
Google tags load before the consent dialog and send cookieless pings while consent is denied. Only this form gives GA4 behavioural modelling.

## Data Manager

**Data Manager (in Google Analytics)**:
The Admin hub, in open beta since 6 November 2026, for a property's data streams, product links and data imports, with a map of sources and export destinations.
_Not the same as_: Data Manager API, Google Ads Data Manager

**Data Manager API**:
Google's unified server-to-server ingestion API for first-party data across its advertising products. Since 7 May 2026 it can send events to GA4 data streams as an alternative to the Measurement Protocol.

**Data import**:
Joining uploaded data (campaign cost, item, user, offline events, custom event data) to a property. Existing imports now appear in Data Manager.
