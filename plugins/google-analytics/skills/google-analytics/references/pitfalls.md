# GA4 pitfalls

Each line is the wrong move, then the right one. Read the group for the task in hand. The pitfalls listed in SKILL.md apply to every task and are not repeated here. Terms are defined in [glossary.md](glossary.md); numbers are in [limits.md](limits.md).

## Designing and sending events

- Mixed naming styles (`AddToCart`, `add-to-cart`) -> names are case-sensitive, so two spellings are two events. Follow Google's own style, lower-case `snake_case`, for every custom event and parameter.
- Inventing a name for something Google already names (`purchase_complete`, `signup`) -> use the exact recommended event name; the reports keyed to it stay empty otherwise.
- Sending `value` without `currency` -> send both on every monetary event, or revenue is not reported.
- Reusing a `transaction_id`, or sending none -> one unique ID per order; GA4 deduplicates purchases on it.
- Putting an email address, phone number or name in a parameter, user property or User-ID -> send an internal ID; Google's terms forbid personally identifiable information in all three.
- Clearing User-ID with an empty string on sign-out -> set it to `null`.
- Sending more than a limit allows -> GA4 drops the excess (the 26th parameter, the 101st character) with no error, so check the design against the limits first.
- Using a reserved event name or a parameter starting `ga_`, `google_`, `firebase_` or `_` -> pick another; reserved names are listed in the [Measurement Protocol reference](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference).
- Running gtag.js and a Tag Manager Google tag for the same stream, or a CMS plugin beside either -> one loader per stream; a second one duplicates every event.
- Expecting `page_view` on single-page-app route changes without checking -> enhanced measurement sends it on browser history changes only when that advanced setting is on; do not also send it manually.

## Parameters, custom definitions and key events

- Registering a user property with event scope, or an item parameter with event scope -> the scope must match how the value is sent: event parameter, user property or key inside `items`.
- Registering a per-user or per-order identifier as a custom dimension -> leave it unregistered and read it in BigQuery; it floods reports with `(other)`.
- Expecting a key event to cover history -> marking an event applies from that point on. Key events are managed on the Events page (Admin -> Data display -> Events), where attribution settings also sit.
- Comparing GA4 key events with Google Ads conversions as if they should match -> channels credited, attribution model, window, counting method and identity differ by design.

## Identity and users

- Listing Google signals as a reporting identity option, or saying Blended uses it -> the options are Blended (User-ID, device ID, modelling), Observed and Device-based.
- Using a user property to identify a person -> that is User-ID's job; a user property is an attribute.
- Using Admin's data deletion request to erase a person -> that removes parameter text over a date range. Erase a user from Explore -> User explorer or with the User Deletion API.
- Assuming audiences or newly registered dimensions backfill -> audiences collect users from creation onwards (Google Ads audiences are pre-filled with up to 30 days where available) and take 24-48 hours to populate; segments are the retroactive tool.
- Changing reporting identity to "fix" collection -> it changes how reports count, never what is collected.

## Reading and reconciling numbers

- A regex carried over from a GTM trigger into a report filter, Exploration, segment or audience -> those use RE2 on Google's servers and match the whole value: no lookarounds or backreferences, `(?i)` is allowed, and a substring needs `.*` around it (custom channel groups are the exception and allow a partial match). GTM triggers use JavaScript regex and match a substring.
- A regex in a create-event or modify-event rule -> those run as JavaScript regex in the visitor's browser, match the whole string and backtrack, so keep the pattern simple.
- Reading today's or yesterday's figures as final -> a standard property's day completes after about 12 hours and attribution can move for up to 12 days.
- Ignoring Data API response metadata -> check `subjectToThresholding`, `samplingMetadatas`, `dataLossFromOtherRow` and `dataTruncationReasons` and say so when one is set.
- Asking the Data API or MCP server for an unregistered parameter -> it only knows registered custom definitions (`ga reports metadata` lists them); go to BigQuery for the rest.
- Building an Exploration over a range longer than the retention setting -> event-level data is kept 2 months by default, 14 at most on a standard property; standard reports are not bound by it.
- Using `traffic_source` for session source in BigQuery -> that record is the user's first acquisition; session attribution is in `session_traffic_source_last_click`.
- Expecting AI-assistant visits under Referral -> since 13 May 2026 they fall in the "AI Assistant" channel with medium `ai-assistant`.

## Server-side sending

- Minting a new `client_id` on the server -> reuse the browser's, or the event belongs to a new user with no session, geography or device.
- Omitting `session_id` and `engagement_time_msec` -> the event shows in some reports but not in sessions, engagement or Realtime.
- Sending `analytics_storage` or lower-case values in the Measurement Protocol `consent` object -> it takes only `ad_user_data` and `ad_personalization`, each `GRANTED` or `DENIED`.
- Sending `session_start`, `first_visit` or `user_engagement` from a server -> reserved; a new `session_id` starts the session.
- Replacing browser tagging with server-to-server sending -> Google positions both the Measurement Protocol and the Data Manager API as additions to tag or SDK collection.
- Assuming the Measurement Protocol is the only server route -> the Data Manager API has sent events to GA4 since 7 May 2026; see [data-manager.md](data-manager.md).

## Consent and privacy

- Calling `gtag('consent', 'default', ...)` after the config command -> it must run first on every page, or the defaults do nothing.
- Setting only `ad_storage` and `analytics_storage` -> version 2 (November 2023) also needs `ad_user_data` and `ad_personalization`.
- Dating the requirement as "v2 required from March 2024" -> Google's wording: without consent signals, users in the European Economic Area are left out of audiences used by linked advertising products from early March 2024.
- Using gtag consent commands inside a Tag Manager template -> templates use `setDefaultConsentState` and `updateConsentState`.
- Adding `anonymize_ip` -> a Universal Analytics setting; GA4 does not log or store IP addresses.

## Admin interface

- Giving a click-by-click path from memory -> Google moves Admin menus often. Name the feature ("Custom definitions", "Data streams") and give the path only as stated in this file or on Google's page.
- Looking for internal traffic rules, unwanted referrals, cross-domain or session timeout among property settings -> they are Google tag settings, reached from the web stream's details, and they apply to every destination of that tag.
- Treating unwanted referrals as a data filter -> data filters are internal traffic, developer traffic and hostname (exclude since 11 June 2026, include since 21 September 2026). A filter in Testing state only labels traffic. Once Active its effect is permanent: excluded events are never processed and never reach reports or BigQuery, so offer a report filter when the aim is only to hide data.
- Changing the property time zone to repair history -> it applies to data from the change onwards.

## BigQuery link

- Linking and expecting history -> data starts arriving within 24 hours of the link and flows forward from there; exported data cannot be re-exported.
- Choosing the dataset location casually -> changing it later means deleting and recreating the dataset (or replicating it across regions), with the export paused meanwhile.
- Leaving a standard property over the daily limit on daily export -> Google pauses the daily export and does not reprocess the missed days; exclude events or streams on the link, or use streaming, which has no event limit.
- Leaving the export in a BigQuery sandbox project -> tables expire after 60 days.
