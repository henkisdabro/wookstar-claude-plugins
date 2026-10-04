# GA4 Export Query Patterns

Replace `project.analytics_123456789` and the dates. Every pattern already follows the cost rules in SKILL.md Step 3; keep them when adapting.

## Helper functions

Prepend to any query that reads many parameters. Each call is still a scalar subquery, so cost is unchanged - they only shorten the SQL.

```sql
CREATE TEMP FUNCTION param_str(params ANY TYPE, k STRING) AS (
  (SELECT ANY_VALUE(COALESCE(value.string_value, CAST(value.int_value AS STRING),
     CAST(value.double_value AS STRING), CAST(value.float_value AS STRING)))
   FROM UNNEST(params) WHERE key = k)
);
CREATE TEMP FUNCTION param_int(params ANY TYPE, k STRING) AS (
  (SELECT ANY_VALUE(value.int_value) FROM UNNEST(params) WHERE key = k)
);
```

`param_str` reads whichever value column is populated, so it is safe for keys whose type varies (`session_engaged`, custom parameters).

## Discover the parameters on an event

```sql
SELECT ep.key,
  COUNTIF(ep.value.string_value IS NOT NULL) AS string_vals,
  COUNTIF(ep.value.int_value IS NOT NULL) AS int_vals,
  COUNTIF(COALESCE(ep.value.double_value, ep.value.float_value) IS NOT NULL) AS num_vals
FROM `project.analytics_123456789.events_*`, UNNEST(event_params) AS ep
WHERE _TABLE_SUFFIX = '20260101' AND event_name = 'page_view'
GROUP BY 1 ORDER BY string_vals + int_vals + num_vals DESC
```

## Event counts

```sql
SELECT event_name, COUNT(*) AS events, COUNT(DISTINCT user_pseudo_id) AS users
FROM `project.analytics_123456789.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20260101' AND '20260131'
GROUP BY 1 ORDER BY 2 DESC
```

## Users, sessions, engaged sessions, page views

```sql
WITH sessions AS (
  SELECT
    user_pseudo_id,
    CONCAT(user_pseudo_id, '.', CAST(param_int(event_params, 'ga_session_id') AS STRING)) AS session_key,
    MAX(param_str(event_params, 'session_engaged')) = '1' AS engaged,
    SUM(param_int(event_params, 'engagement_time_msec')) AS engagement_msec,
    COUNTIF(event_name = 'page_view') AS page_views
  FROM `project.analytics_123456789.events_*`
  WHERE _TABLE_SUFFIX BETWEEN '20260101' AND '20260131'
  GROUP BY 1, 2
)
SELECT
  COUNT(DISTINCT user_pseudo_id) AS users,
  COUNT(*) AS sessions,
  COUNTIF(engaged) AS engaged_sessions,
  SAFE_DIVIDE(COUNTIF(engaged), COUNT(*)) AS engagement_rate,
  SUM(page_views) AS page_views
FROM sessions
```

Needs the helper functions. For a daily trend, add `MIN(event_date)` as the session's date in the CTE and group by it - never count sessions per shard and sum.

## Landing pages

```sql
SELECT
  param_str(event_params, 'page_location') AS landing_page,
  COUNT(DISTINCT CONCAT(user_pseudo_id, '.', CAST(param_int(event_params, 'ga_session_id') AS STRING))) AS sessions
FROM `project.analytics_123456789.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20260101' AND '20260131'
  AND event_name = 'page_view'
  AND param_int(event_params, 'entrances') = 1
GROUP BY 1 ORDER BY 2 DESC
LIMIT 50
```

Strip query strings with `REGEXP_REPLACE(page, r'\?.*$', '')` when UTMs fragment the list.

## Sessions by source / medium

Newer exports (column present):

```sql
SELECT
  COALESCE(session_traffic_source_last_click.cross_channel_campaign.source, '(direct)') AS source,
  COALESCE(session_traffic_source_last_click.cross_channel_campaign.medium, '(none)') AS medium,
  COUNT(DISTINCT CONCAT(user_pseudo_id, '.', CAST(param_int(event_params, 'ga_session_id') AS STRING))) AS sessions
FROM `project.analytics_123456789.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20260101' AND '20260131'
GROUP BY 1, 2 ORDER BY 3 DESC
```

Older shards - first event of each session:

```sql
WITH firsts AS (
  SELECT
    CONCAT(user_pseudo_id, '.', CAST(param_int(event_params, 'ga_session_id') AS STRING)) AS session_key,
    ARRAY_AGG(STRUCT(collected_traffic_source.manual_source AS source,
                     collected_traffic_source.manual_medium AS medium,
                     collected_traffic_source.gclid AS gclid)
              ORDER BY event_timestamp, batch_page_id, batch_ordering_id, batch_event_index
              LIMIT 1)[OFFSET(0)] AS first_touch
  FROM `project.analytics_123456789.events_*`
  WHERE _TABLE_SUFFIX BETWEEN '20260101' AND '20260131'
  GROUP BY 1
)
SELECT
  CASE WHEN first_touch.gclid IS NOT NULL THEN 'google' ELSE COALESCE(first_touch.source, '(direct)') END AS source,
  CASE WHEN first_touch.gclid IS NOT NULL THEN 'cpc' ELSE COALESCE(first_touch.medium, '(none)') END AS medium,
  COUNT(*) AS sessions
FROM firsts
GROUP BY 1, 2 ORDER BY 3 DESC
```

This approximates GA4 rather than matching it: GA4 also carries a previous non-direct source into direct sessions.

## Purchases and revenue

```sql
SELECT
  event_date,
  COUNT(DISTINCT ecommerce.transaction_id) AS transactions,
  SUM(ecommerce.purchase_revenue) AS revenue,
  SAFE_DIVIDE(SUM(ecommerce.purchase_revenue), COUNT(DISTINCT ecommerce.transaction_id)) AS avg_order_value
FROM `project.analytics_123456789.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20260101' AND '20260131'
  AND event_name = 'purchase'
  AND ecommerce.transaction_id IS NOT NULL
GROUP BY 1 ORDER BY 1
```

`purchase_revenue` is in the property currency; the `_in_usd` columns are converted. Duplicate `transaction_id`s are common - `COUNT(DISTINCT)` guards the count, but deduplicate before summing revenue if the user reports double-counting.

## Item performance

```sql
SELECT
  item.item_name,
  item.item_category,
  SUM(item.quantity) AS units,
  SUM(item.item_revenue) AS revenue
FROM `project.analytics_123456789.events_*`, UNNEST(items) AS item
WHERE _TABLE_SUFFIX BETWEEN '20260101' AND '20260131'
  AND event_name = 'purchase'
GROUP BY 1, 2 ORDER BY 4 DESC
LIMIT 50
```

## Closed funnel (session-scoped)

```sql
WITH steps AS (
  SELECT
    CONCAT(user_pseudo_id, '.', CAST(param_int(event_params, 'ga_session_id') AS STRING)) AS session_key,
    MIN(IF(event_name = 'view_item', event_timestamp, NULL)) AS t1,
    MIN(IF(event_name = 'add_to_cart', event_timestamp, NULL)) AS t2,
    MIN(IF(event_name = 'begin_checkout', event_timestamp, NULL)) AS t3,
    MIN(IF(event_name = 'purchase', event_timestamp, NULL)) AS t4
  FROM `project.analytics_123456789.events_*`
  WHERE _TABLE_SUFFIX BETWEEN '20260101' AND '20260131'
    AND event_name IN ('view_item', 'add_to_cart', 'begin_checkout', 'purchase')
  GROUP BY 1
)
SELECT
  COUNTIF(t1 IS NOT NULL) AS view_item,
  COUNTIF(t2 > t1) AS add_to_cart,
  COUNTIF(t3 > t2 AND t2 > t1) AS begin_checkout,
  COUNTIF(t4 > t3 AND t3 > t2 AND t2 > t1) AS purchase
FROM steps
```

Drop the ordering conditions for an open funnel.

## Event sequence for a sample of users

```sql
SELECT
  user_pseudo_id,
  ARRAY_AGG(STRUCT(event_name, param_str(event_params, 'page_location') AS page, event_timestamp)
            ORDER BY event_timestamp, batch_page_id, batch_ordering_id, batch_event_index) AS journey
FROM `project.analytics_123456789.events_*`
WHERE _TABLE_SUFFIX = '20260115'
GROUP BY 1
LIMIT 20
```

## Today's data (daily + intraday)

```sql
SELECT event_name, COUNT(*) AS events
FROM (
  SELECT event_name FROM `project.analytics_123456789.events_*`
  WHERE _TABLE_SUFFIX BETWEEN '20260101' AND '20260131'
  UNION ALL
  SELECT event_name FROM `project.analytics_123456789.events_intraday_*`
  WHERE _TABLE_SUFFIX > '20260131'
)
GROUP BY 1 ORDER BY 2 DESC
```

Bound the intraday suffix above the last daily shard so a day present in both is not counted twice.
