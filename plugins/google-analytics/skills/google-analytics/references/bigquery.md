# GA4 BigQuery Export

Source of truth for the export itself: why to use it, how to link it, export options, table naming and the schema. Writing and running SQL against the export - parameter extraction, sessionisation, cost control and query patterns - lives in the plugin's `bigquery` skill (`skills/bigquery/SKILL.md` and its `references/query-patterns.md`).

## Why Use BigQuery

| Benefit | Description |
|---------|-------------|
| Unsampled data | No sampling or thresholding |
| Raw event data | Access every parameter |
| SQL analysis | Complex queries and joins |
| Data integration | Combine with other sources |
| Long-term storage | Beyond GA4 retention |
| Custom attribution | Build custom models |
| Machine learning | Train on GA4 data |

## BigQuery Export Setup

### Prerequisites

- GA4 property (standard or 360)
- Google Cloud project with the BigQuery API enabled and billing (or the BigQuery sandbox)
- Editor permissions on the GA4 property, Owner on the Cloud project

### Setup Steps

1. console.cloud.google.com - create or select a project, enable the BigQuery API
2. GA4 Admin -> Product Links -> BigQuery Links -> Link
3. Choose the Cloud project and a dataset location (US, EU, a region) - it cannot be changed later
4. Choose export frequency (see below) and the data streams/events to include
5. Optionally include advertising IDs, then submit

The dataset is created as `analytics_<property_id>`. First data arrives within about 24 hours.

### Export Options

| Option | Description | Availability |
|--------|-------------|--------------|
| Daily Export | Once per day, previous day's complete data (standard: 1 million events/day limit) | Standard and 360 |
| Fresh Daily | Delivered by ~5am, updated through the day | 360 only |
| Streaming Export | Near real-time, best-effort, $0.05/GB | Standard and 360 |
| User data export | Daily `pseudonymous_users_` and `users_` tables | Standard and 360 |
| Include Advertising IDs | For Ads integration | Optional |

### Data Availability

- Daily tables: once per day, after the day ends (time varies). GA4 can rewrite a daily table for up to 72 hours to add late-arriving events.
- Intraday tables (`events_intraday_`): filled by streaming export within minutes, replaced when the daily table lands
- Streaming omits new-user and new-session traffic source data - use the daily table for acquisition analysis

## Table Structure

### Table Naming

```
project.dataset.events_YYYYMMDD             # Daily export (date-sharded, one table per day)
project.dataset.events_intraday_YYYYMMDD    # Streaming/intraday
project.dataset.pseudonymous_users_YYYYMMDD # User data export, keyed by user_pseudo_id
project.dataset.users_YYYYMMDD              # User data export, keyed by user_id
project.dataset.events_*                    # Wildcard - also matches events_intraday_*
```

### Schema

One row per event. `event_params`, `user_properties` and `items` are repeated records and need `UNNEST`.

| Column | Type | Notes |
|--------|------|-------|
| `event_date` | STRING | YYYYMMDD in the property's reporting time zone |
| `event_timestamp` | INTEGER | UTC, microseconds since epoch |
| `event_name` | STRING | page_view, session_start, purchase, ... |
| `event_params` | RECORD (REPEATED) | `.key`, `.value.string_value`, `.value.int_value`, `.value.float_value`, `.value.double_value` |
| `event_previous_timestamp` | INTEGER | Microseconds |
| `event_value_in_usd` | FLOAT | Event value converted to USD |
| `event_bundle_sequence_id` | INTEGER | Sequential ID of the upload bundle |
| `event_server_timestamp_offset` | INTEGER | Microseconds |
| `batch_page_id`, `batch_ordering_id`, `batch_event_index` | INTEGER | Ordering of events within a batch - tie-breakers when timestamps collide |
| `user_id` | STRING | Set via `user_id`; null when not set |
| `user_pseudo_id` | STRING | Pseudonymous client ID, always present (unless consent denied) |
| `is_active_user` | BOOLEAN | Whether the user was active in the day |
| `privacy_info` | RECORD | `.analytics_storage`, `.ads_storage`, `.uses_transient_token` |
| `user_properties` | RECORD (REPEATED) | `.key`, `.value.string_value`, `.value.int_value`, `.value.float_value`, `.value.double_value`, `.value.set_timestamp_micros` |
| `user_first_touch_timestamp` | INTEGER | Microseconds |
| `user_ltv` | RECORD | `.revenue`, `.currency` |
| `device` | RECORD | `.category`, `.mobile_brand_name`, `.mobile_model_name`, `.mobile_marketing_name`, `.mobile_os_hardware_model`, `.operating_system`, `.operating_system_version`, `.vendor_id`, `.advertising_id`, `.language`, `.is_limited_ad_tracking`, `.time_zone_offset_seconds`, `.web_info.browser`, `.web_info.browser_version`, `.web_info.hostname` |
| `geo` | RECORD | `.continent`, `.sub_continent`, `.country`, `.region`, `.metro`, `.city` |
| `app_info` | RECORD | `.id`, `.version`, `.firebase_app_id`, `.install_source` |
| `traffic_source` | RECORD | `.name`, `.medium`, `.source` - the **user's first** acquisition, never session-level |
| `collected_traffic_source` | RECORD | Event-scoped: `.manual_campaign_id`, `.manual_campaign_name`, `.manual_source`, `.manual_medium`, `.manual_term`, `.manual_content`, `.manual_creative_format`, `.manual_marketing_tactic`, `.manual_source_platform`, `.gclid`, `.dclid`, `.srsltid` |
| `session_traffic_source_last_click` | RECORD | Session-scoped last-click attribution as GA4 reports it: `.manual_campaign.{source, medium, campaign_name, campaign_id, term, content, source_platform, creative_format, marketing_tactic}`, `.cross_channel_campaign.{source, medium, campaign_name, campaign_id, source_platform}`, plus `google_ads_campaign`, `sa360_campaign`, `dv360_campaign`, `cm360_campaign`. Only in newer exports - older tables lack it |
| `stream_id` | STRING | Data stream ID |
| `platform` | STRING | WEB, IOS, ANDROID |
| `ecommerce` | RECORD | `.transaction_id`, `.purchase_revenue`, `.purchase_revenue_in_usd`, `.refund_value`, `.shipping_value`, `.tax_value` (each with `_in_usd`), `.total_item_quantity`, `.unique_items` |
| `items` | RECORD (REPEATED) | `.item_id`, `.item_name`, `.item_brand`, `.item_variant`, `.item_category` to `.item_category5`, `.price`, `.price_in_usd`, `.quantity`, `.item_revenue`, `.item_revenue_in_usd`, `.item_refund`, `.item_refund_in_usd`, `.coupon`, `.affiliation`, `.location_id`, `.item_list_id`, `.item_list_name`, `.item_list_index`, `.promotion_id`, `.promotion_name`, `.creative_name`, `.creative_slot`, `.item_params` |
| `publisher` | RECORD | App ad revenue: `.ad_revenue_in_usd`, `.ad_format`, `.ad_source_name`, `.ad_unit_id` |

Full field list: [GA4 BigQuery Export schema](https://support.google.com/analytics/answer/7029846).

### Common event_params keys (web)

| Key | Value column | Notes |
|-----|--------------|-------|
| `ga_session_id` | `int_value` | Session start time in seconds; unique only per `user_pseudo_id` |
| `ga_session_number` | `int_value` | 1 = first session |
| `page_location`, `page_referrer`, `page_title` | `string_value` | |
| `engagement_time_msec` | `int_value` | Sum per session for engagement time |
| `session_engaged` | `string_value` (`'1'`) | Sometimes arrives as `int_value` - read both |
| `entrances` | `int_value` | `1` on the landing-page `page_view` |
| `source`, `medium`, `campaign` | `string_value` | Event-level UTMs, mostly on the first event of a session |

## BigQuery Pricing

| Type | Cost |
|------|------|
| Storage | ~$0.02/GB/month |
| Queries (on-demand) | ~$6.25/TiB scanned |
| GA4 streaming export | $0.05/GB |

Free tier: 10 GiB storage and 1 TiB of query scanning per month. Prices change - confirm on [BigQuery pricing](https://cloud.google.com/bigquery/pricing).

## Data Retention

| Platform | Retention |
|----------|-----------|
| GA4 Standard | 2 or 14 months |
| BigQuery | Unlimited (until deleted, or until the dataset's default table expiration) |

A BigQuery sandbox project sets a 60-day table expiration - upgrade to billing to keep history.

```sql
ALTER TABLE `project.dataset.events_20250101`
SET OPTIONS (
  expiration_timestamp=TIMESTAMP "2026-01-01 00:00:00 UTC"
)
```

## Common Use Cases

- **Unsampled reporting** - complete data where GA4 UI samples or thresholds
- **Custom attribution** - full user journeys, custom credit models
- **Data integration** - join GA4 with CRM, product catalogue, ad spend
- **Machine learning** - churn, LTV, conversion propensity
- **Long-term analysis** - history beyond GA4 retention, year-over-year

## Export Troubleshooting

| Symptom | Causes | Fix |
|---------|--------|-----|
| No tables in the dataset | Link just created, export paused, wrong project, billing disabled | Wait 24 hours, check Admin -> BigQuery Links status, confirm the project and billing |
| Daily export stopped | Standard property over 1 million events/day | Exclude events or streams from export, or move to streaming |
| Events missing | Events not firing, consent denied, data filter applied | Verify in DebugView, check Consent Mode, review data filters |
| Numbers differ from GA4 UI | Expected - see the `bigquery` skill's "UI vs BigQuery" section | |
