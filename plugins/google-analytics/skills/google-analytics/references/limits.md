# GA4 limits

The one statement of GA4 limits in this skill. Sources: Google's [collection limits](https://support.google.com/analytics/answer/9267744), [configuration limits](https://support.google.com/analytics/answer/12229528), [360 limits](https://support.google.com/analytics/answer/11202874) and the pages linked in each section. Google changes them; open the source when a design sits close to one.

## Collection

| Limit | Standard | 360 |
|-------|----------|-----|
| Distinct event names - web streams | No limit | No limit |
| Distinct event names - app streams | 500 per app user | 2,000 per app user |
| Event name length | 40 characters | 40 characters |
| Parameters per event | 25 | 100 |
| Parameter name length | 40 characters | 40 characters |
| Parameter value length | 100 characters | 500 characters |
| `page_title` / `page_referrer` / `page_location` value length | 300 / 420 / 1,000 characters | same |
| Items in the `items` array | 200 | 200 |
| Custom item parameters per ecommerce event | 27 | 27 |
| User properties per property | 25 | 100 |
| User property name / value length | 24 / 36 characters | same |
| User ID length | 256 characters | 256 characters |
| Data streams per property | 50, at most 30 of them app streams | same |

Automatically collected and enhanced measurement events do not count towards the app event-name limit. Whatever exceeds a limit is dropped without an error. An event whose name is over 40 characters cannot be marked as a key event.

## Configuration (per property)

| Limit | Standard | 360 |
|-------|----------|-----|
| Event-scoped custom dimensions | 50 | 125 |
| User-scoped custom dimensions | 25 | 100 |
| Item-scoped custom dimensions | 10 | 25 |
| Event-scoped custom metrics | 50 | 125 |
| Calculated metrics | 5 | 50 |
| Key events | 30 | 50 |
| Audiences | 100 | 400 |
| Audience membership duration | up to 540 days; 14 months with "Reset on new activity" | same |
| Event data retention | 2 or 14 months | 2, 14, 26, 38 or 50 months |
| Saved segments | 50 | 200 |
| Saved comparisons | 200 | 200 |
| BigQuery daily export | 1 million events a day | 20 billion events a day |

Key event lookback window: 30 days (default) or 7 for `first_open` and `first_visit`; 90 days (default), 60 or 30 for all others. Conversion windows are set per conversion: click-through 1-90 days, engaged-view 1-30 days (since 11 August 2026).

## Explorations ([source](https://support.google.com/analytics/answer/7579450))

| Limit | Value |
|-------|-------|
| Explorations per user per property | 200 |
| Shared explorations per property | 500 |
| Segments per exploration | 10, four applied to one technique at a time |
| Filters per tab | 10 |
| Dimensions / metrics per exploration | 20 / 20 |
| Tabs per exploration | 10 |
| Sampling starts | above 10 million events per query (360: up to 1 billion, 100 million by default) |
| Conditions per comparison | 5 |

## Measurement Protocol ([source](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference))

| Limit | Value |
|-------|-------|
| Events per request | 25 |
| Parameters per event | 25 |
| User properties per request | 25 |
| Custom parameters per item | 10 |
| Request body | under 130 kB |
| Backdating | 72 hours; older timestamps are moved to 72 hours ago, or rejected under `ENFORCE_RECOMMENDATIONS` |
| Joining to tagged activity | arrive within 48 hours of the client-side event |
| Requests per property | 100 million non-conversion requests an hour on a standard property; the rest are ignored silently |

Name and value lengths are those in the collection table.

## Data import ([source](https://support.google.com/analytics/answer/10071301))

| Limit | Value |
|-------|-------|
| Import source size | 1 GB |
| Uploads | 120 per property per day |
| Import sources per property | item 5, user 10, custom event 5 |
| Storage | 1 GB across campaign, item and custom event sources |

User data and offline events are joined at collection time and are not applied to history; campaign, item and custom event data are joined at query time and are not available to audiences or Explorations segments.

Data API quotas are in [data-sources.md](data-sources.md).
