# GA4 BigQuery Export

Source of truth for the export itself: its options, table naming and schema. Writing and running SQL against it - parameter extraction, sessionisation, cost control and query patterns - is the plugin's `bigquery` skill. How export numbers relate to reports is in [data-sources.md](data-sources.md); linking mistakes are in the "BigQuery link" group of [pitfalls.md](pitfalls.md).

## Export options

Linked at Admin -> Product links -> BigQuery links (Editor on the property, Owner on the Cloud project). The dataset is `analytics_<property_id>`; first data arrives within about 24 hours.

| Option | What it writes | Availability |
|--------|----------------|--------------|
| Daily | The previous day, once a day, typically early to mid afternoon in the property time zone. 1 million events a day on standard, 20 billion on 360 | Standard and 360 |
| Fresh Daily | Typically by 5 am, then batched updates about hourly | 360 only |
| Streaming | `events_intraday_` within minutes; best effort, no completeness guarantee, no volume limit, USD 0.05 per GB. Omits new-user and new-session traffic source data | Standard and 360 |
| User data | Daily `pseudonymous_users_` and `users_` tables | Standard and 360 |

- A daily table can be rewritten for up to 72 hours as late events arrive.
- The intraday table is replaced when the daily table lands.
- The export holds raw events keyed by device ID. It has no Google signals data, no modelled data, no `wbraid` / `gbraid`, and nothing from linked products.

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

## Pricing

On-demand queries cost USD 6.25 per TiB scanned, with the first 1 TiB each month free; streaming export costs USD 0.05 per GB. Prices change - confirm on [BigQuery pricing](https://cloud.google.com/bigquery/pricing).
