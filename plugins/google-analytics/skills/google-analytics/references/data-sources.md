# Where the numbers come from

Four surfaces read GA4 data and they are not expected to agree. Name the surface a number came from before comparing it with another.

## Reading surfaces

| | Standard reports | Explorations | Data API (also the MCP server and `ga reports`) | BigQuery export |
|---|---|---|---|---|
| Built from | Pre-aggregated tables | Event-level data inside the data retention window (2 or 14 months standard; up to 50 months on 360) | The reporting backend; responses carry quality flags | Raw events as received, one row per event |
| Freshness (standard property, typical) | Intraday in 2-6 hours; a day is complete after about 12 hours, shown around 3:30 pm next day | Previous day ready around 11:30 am | As reports; the realtime method covers the last 30 minutes with few fields | Daily table around midday next day; it can still change for 72 hours. Streaming fills `events_intraday_` within minutes |
| Sampling | Rare; possible when the events needed exceed the quota | When a query needs more than 10 million events (360: up to 1 billion, 100 million by default) | Reported in `samplingMetadatas` | None |
| Thresholding | Yes | Yes | Yes - `subjectToThresholding` | None |
| Cardinality | `(other)` row past the table's row limit; more of it in intraday data | `(other)` possible | `dataLossFromOtherRow` | None |
| Identity and modelling | Follows reporting identity, so can include modelled users | Same | Same | Device ID only: no modelling, no Google signals data |
| Counting | Sessions and other unique counts are estimates (HyperLogLog++) | Same | Same | Exact, whatever the SQL counts |
| Attribution | Reporting attribution model; key event credit can shift for up to 12 days | Same | Same | None applied; only the collected traffic-source fields |
| Cannot answer | Anything needing an unregistered parameter or a custom funnel or path | History older than the retention window | Unregistered parameters; conversion reporting is alpha only | Demographics and interests, modelled data, anything from before the link existed |

Notes that decide most reconciliations:

- The data quality icon on a report or exploration says whether sampling, thresholding or `(other)` applies. In the Data API read `metadata` on every response; `dataTruncationReasons` (added 14 September 2026) lists truncation.
- Google expects a 2-5% difference in total event count between GA4 and BigQuery. To compare users, set reporting identity to Device-based first, match the time zone, and mirror any streams or events excluded from the export.
- A dimension with more than 500 values is high-cardinality by Google's guidance. Standard reports cope best because they use aggregate tables. For high-cardinality data Google advises leaving the parameter unregistered - it stays usable in BigQuery, audiences and segments.
- Late events are accepted for about three days (two calendar days after the day they happened) and ignored after that. Compare periods older than that.
- Reports use the last-click model until the daily data lands, so today's attribution will move.
- The standard daily export stops at 1 million events a day (360: 20 billion). Streaming has no volume cap but omits new-user and new-session traffic source data. Exported data cannot be re-exported.
- Data API quotas, standard property: 200,000 tokens a day, 40,000 an hour, 10 concurrent requests, and 120 potentially thresholded requests an hour (those using `userAgeBracket`, `userGender`, `brandingInterest`, `audienceId` or `audienceName`). 360 gets ten times the tokens and 50 concurrent requests.

## Collection routes

| Route | Needs | Can | Cannot |
|---|---|---|---|
| gtag.js on the page | A Google tag ID (`G-XXXXXXXXXX` or `GT-XXXXXXX`) | Automatic and enhanced measurement events, `gtag('event')`, consent commands | Run non-Google tags. Its tag settings live in the Google tag settings screen, not in code |
| Tag Manager web container | Container ID `GTM-XXXXXXX`; a Google tag (takes a tag ID) plus GA4 Event tags (take the measurement ID) | Everything gtag.js does, plus triggers, variables, non-Google tags, versions | Send anything from a `dataLayer.push` alone - a tag must fire on it |
| Optimised Tag Manager container (since 12 October 2026) | The same container, upgraded from a banner on its Overview page; a destination tag per destination (GA4 web stream, Google Ads account, Floodlight configuration, Merchant Center conversion source) | Send straight to Google destinations without loading gtag.js; settings and permissions are governed at container level on the Settings tab, with per-destination overrides in the destination tag; existing event tags and triggers are kept | Be added beside a manual `page_view` unchecked - adding a destination tag sends a page view for that destination automatically |
| Measurement Protocol | `measurement_id` + `api_secret` + `client_id` (web), or `firebase_app_id` + `api_secret` + `app_instance_id` (app) | Server-side and offline events, backdated up to 72 hours, joined to the user's tagged activity when they arrive within 48 hours | Send reserved events (`session_start`, `first_visit`, `user_engagement`); report a bad payload (it answers 2xx regardless - validate at `/debug/mp/collect`); take consent beyond `ad_user_data` and `ad_personalization` (`GRANTED` / `DENIED`) |
| Data Manager API | OAuth, the property ID, and the measurement ID or Firebase App ID as destination; `client_id` or `app_instance_id` per event | The same server-to-server job with fast-fail errors and several destinations per request - see [data-manager.md](data-manager.md) | Send reserved events; trigger create-event or modify-event rules |
| Firebase SDK | An app data stream; identifies installs by `app_instance_id` | App events, including the app-only `screen_view`, `ad_impression` and `in_app_purchase` | Be replaced by gtag.js - app streams collect through the SDK |

Server-to-server routes add to tag or SDK collection; Google states that sending only server-to-server gives partial reporting. Give each such event the `session_id` and `engagement_time_msec` of the live session or it will not count towards sessions, engagement or Realtime correctly. Geography and device are taken from the user's tagged events unless `user_location`, `ip_override` or `device` is sent.

Observed in practice on optimised containers in late 2026, not stated on Google's help pages: the upgrade carries the Google tag's automatic event detection into the container settings, not the stream's enhanced measurement. After an upgrade, check automatic event detection against the stream's enhanced measurement and against any GA4 Event tag that already sends `form_submit`, `scroll` or `page_view`, and compare event counts with a baseline taken beforehand.
