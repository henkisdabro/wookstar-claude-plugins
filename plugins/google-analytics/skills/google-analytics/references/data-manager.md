# Data Manager

Two different things carry this name. Both are stated here only as far as Google's pages go (checked 13 November 2026); the interface is in open beta and Google says it may change.

## Data Manager in Google Analytics (open beta, 6 November 2026)

Source: [About Data Manager in Google Analytics (beta)](https://support.google.com/analytics/answer/18107176), [What's new](https://support.google.com/analytics/answer/9164320).

- **What it is**: one Admin home page for a property's data streams and connected products, with diagnostics and connection health.
- **Where**: Admin, the **Data Manager** tab in the left navigation, below "My preferences". Subproperties and roll-up properties do not have it.
- **What it holds**: web and app data streams ("+Add stream"); product links and data import connections ("+Connect Product"); a data connection map with four columns - data sources (for example Tag Manager, a CRM, a Google Ads link, an offline file), data types, the property and its streams, and export destinations; and a data strength guide that lists measurement gaps. A source with an error shows red and offers "Fix".
- **What it absorbs**: existing data imports appear in it automatically, and Google recommends making future connections there. Google's page does not say the older screens are removed - Admin -> Data collection and modification -> Data import is still documented.
- **Direction of flow**: data brought in through Data Manager in Google Analytics flows on to linked Google Ads and Google Marketing Platform accounts, not the other way.

What an implementer does differently:

- Before adding a connection, look for the same pipeline in Google Ads or Google Marketing Platform. Google warns that activating an identical pipeline in both interfaces can log conversions twice. Connections already managed there can stay there.
- Some data types, item data and third-party campaign data among them, must be set up directly in Data Manager in Google Analytics.
- Treat the page as the place to find what feeds a property and what it exports to, before auditing links one by one.

Google's page does not name the roles required ("appropriate permissions") and does not mention audiences or Customer Match; state neither.

## Data Manager API (events to GA4 since 7 May 2026)

Source: [Data Manager API](https://developers.google.com/data-manager/api), [recommended and custom events](https://developers.google.com/data-manager/api/devguides/events/analytics/recommended-custom-events), [upgrade from the Measurement Protocol](https://developers.google.com/data-manager/api/devguides/events/analytics/measurement-protocol/upgrade), [field mappings](https://developers.google.com/data-manager/api/devguides/events/analytics/measurement-protocol/upgrade/field-mappings).

One ingestion API for Google Ads, Google Analytics, Display & Video 360, Campaign Manager 360, Search Ads 360 and Google Ad Manager. For GA4 it sends recommended and custom events, with user-provided data and user properties, to web and app streams. Multi-source events (an extra data source for tag events, keyed by transaction ID) are allowlist-only.

| | Data Manager API | Measurement Protocol |
|---|---|---|
| Credentials | OAuth with the Data Manager API scope | `api_secret` |
| Destination | `operating_account` with `account_type` `GOOGLE_ANALYTICS_PROPERTY` and the property ID, plus `product_destination_id` = measurement ID or Firebase App ID; several destinations per request | One data stream per request |
| Call | `events.ingest`; `validate_only: true` checks without ingesting; `requestStatus.retrieve` reports processing | POST `/mp/collect`; `/debug/mp/collect` validates |
| Errors | Fast-fail: one bad record fails the whole request | None reported outside the validation endpoint |
| Timestamp | Per event (`event_timestamp`); no request-level timestamp | `timestamp_micros` on the request or the event |
| Encryption of user data | Supported | Not supported |

Field moves that catch people out: `events[].name` -> `event_name`; `params.value` -> `conversion_value`; `params.items` -> `cart_data.items` with `item_id`, `quantity` and `unit_price` required; `session_id` and `engagement_time_msec` go in `additional_event_parameters`; `event_source` is `WEB` or `APP`; `client_id` is required for web events and `app_instance_id` for app events.

Behaviour to know:

- It adds to gtag.js, Tag Manager or Firebase collection and is not a substitute for it.
- Reserved event names are rejected (`INVALID_EVENT_NAME`).
- Events sent this way do not trigger the property's create-event or modify-event rules; reproduce that logic before sending.
- To attach an event to a session, send its `session_id` within 24 hours of the session start.
- Events sent to a web stream as an additional data source do not reach conversion bidding for a 14-day trial period.
- Google's release note presents it as an alternative to the Measurement Protocol, which remains documented.

## Not the same thing

**Google Ads Data Manager** is the import tool inside Google Ads ([About the "Data manager" page](https://support.google.com/google-ads/answer/11320486)). A connection made there belongs to the ads account, not to the GA4 property.
