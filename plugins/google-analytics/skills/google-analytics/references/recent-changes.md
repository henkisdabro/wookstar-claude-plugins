# Recent changes

Checked against Google's release notes on 13 November 2026. Read the note itself before relying on a detail: [Analytics "What's new"](https://support.google.com/analytics/answer/9164320), [Tag Manager release notes](https://support.google.com/tagmanager/answer/4620708), [Admin API changelog](https://developers.google.com/analytics/devguides/config/admin/v1/changelog), [Data API changelog](https://developers.google.com/analytics/devguides/reporting/data/v1/changelog).

| Date | Change |
|---|---|
| 2026-11-06 | Data Manager in Google Analytics (open beta) - see [data-manager.md](data-manager.md) |
| 2026-10-12 | Tag Manager containers can be optimised to send to Google destinations without loading gtag.js |
| 2026-10-08 | Every `gtag('config')` call reaches a Tag Manager container as a `gtag.config` dataLayer event, so wildcard Custom Event triggers can fire on it; container snippets initialise on load regardless of config commands |
| 2026-10-05 | User groups can be managed through the Admin API |
| 2026-09-29 | App conversions in conversion reports, with their own attribution settings (Google Ads customers; not every property) |
| 2026-09-21 | "Include" hostname data filters (an allowlist) |
| 2026-09-14 | Data API: `dataTruncationReasons` in response metadata; `properties.chat` natural-language method (v1alpha) |
| 2026-09-09 | Dashboards in the GA4 interface |
| 2026-08-11 | Conversion windows take any value: click-through 1-90 days, engaged-view 1-30 days (Advertising > Conversion management) |
| 2026-07-28 | Campaign data imports with cost require a currency field |
| 2026-07-13 | AdMob links under Product links |
| 2026-07-09 | A container loaded by a `G-` or `AW-` ID runs only Google-provided tags; only a `GTM-` ID allows all tag types |
| 2026-06-18 | Admin API v1alpha can update reporting identity (`UpdateReportingIdentitySettings`) |
| 2026-06-11 | "Source Group" dimension, applied to history; hostname (exclude) data filter |
| 2026-06-08 | Google Business Profile link, importing seven metrics over a rolling 6 months |
| 2026-05-13 | "AI Assistant" default channel; medium `ai-assistant`, campaign `(ai-assistant)` |
| 2026-05-07 | Data Manager API can send recommended and custom events to web and app streams |
| 2026-04-23 | Data API v1alpha conversion reporting (`ConversionSpec`, attribution `DATA_DRIVEN` or `LAST_CLICK`; not every property) |
| 2026-04-14 | Admin API v1alpha exposes `UserProvidedDataSettings` |
| 2026-01-16 | Per-conversion attribution settings and the conversion attribution analysis report (beta, Google Ads customers); cross-channel budgeting (beta) |
| 2025-12-11 | Tag Manager built-in variables for Analytics Client ID, Session ID and Session Number |
| 2025-08-20 | Admin API v1alpha drops six Universal Analytics-era methods (connected site tags, automated GA4 setup opt-out) |
| 2025-05-08 | "First-party mode" renamed Google tag gateway for advertisers |
| 2025-04-16 | Report annotations manageable through the Admin API (v1alpha `ReportingDataAnnotation`) |
| 2025-04-10 | Containers with Google Ads or Floodlight tags load a Google tag automatically before sending events |

Older corrections that models still get wrong are in [pitfalls.md](pitfalls.md): the Admin regrouping, key events, the attribution models removed in November 2023, and reporting identity.
