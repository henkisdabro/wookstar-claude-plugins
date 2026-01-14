# GA4 BigQuery Export and Analysis

Complete guide to GA4 BigQuery export including setup, schema, SQL query patterns, and data analysis.

## Overview

GA4 BigQuery export provides raw, event-level data access for advanced analysis, custom reporting, machine learning, and long-term data warehousing. Unlike GA4 reports, BigQuery data is unsampled and allows SQL-based analysis.

## Why Use BigQuery

| Benefit | Description |
|---------|-------------|
| Unsampled data | No sampling thresholds |
| Raw event data | Access every parameter |
| SQL analysis | Complex queries and joins |
| Data integration | Combine with other sources |
| Long-term storage | Beyond GA4 retention |
| Custom attribution | Build custom models |
| Machine learning | Train on GA4 data |

## BigQuery Export Setup

### Prerequisites

- GA4 property (standard or 360)
- Google Cloud project
- BigQuery API enabled
- Editor permissions on GA4 property

### Setup Steps

**Step 1: Create/Select Google Cloud Project**

1. Go to console.cloud.google.com
2. Create new project or select existing
3. Enable BigQuery API

**Step 2: Link GA4 to BigQuery**

1. GA4 Admin -> Product Links -> BigQuery Links
2. Click "Link"
3. Choose Google Cloud project
4. Select dataset location (US, EU, etc.)
5. Configure export:
   - Daily: Complete export once per day
   - Streaming: Real-time (360 only)
6. Include advertising IDs (optional)
7. Confirm setup

### Export Options

| Option | Description | Availability |
|--------|-------------|--------------|
| Daily Export | Once per day (~9 AM property timezone) | Standard GA4 |
| Streaming Export | Near real-time | GA4 360 only |
| Include Advertising IDs | For Ads integration | Optional |

### Data Availability

- Daily tables: ~24 hours after day ends
- Intraday tables: ~3 updates per day
- Streaming: Minutes after collection (360)

## Table Structure

### Table Naming

```
project.dataset.events_YYYYMMDD     # Daily export
project.dataset.events_intraday_YYYYMMDD  # Intraday
project.dataset.events_*            # Wildcard all dates
```

### Key Schema Fields

#### Event Fields

| Field | Type | Description |
|-------|------|-------------|
| event_date | STRING | YYYYMMDD format |
| event_timestamp | INTEGER | Microseconds since epoch |
| event_name | STRING | Event name |
| event_params | RECORD (REPEATED) | Event parameters |
| event_value_in_usd | FLOAT | Event value |

#### User Fields

| Field | Type | Description |
|-------|------|-------------|
| user_id | STRING | User ID if set |
| user_pseudo_id | STRING | Anonymous ID |
| user_properties | RECORD (REPEATED) | User properties |
| user_first_touch_timestamp | INTEGER | First visit |

#### Device Fields

| Field | Type | Description |
|-------|------|-------------|
| device.category | STRING | desktop, mobile, tablet |
| device.operating_system | STRING | Windows, iOS, Android |
| device.browser | STRING | Chrome, Safari |

#### Geo Fields

| Field | Type | Description |
|-------|------|-------------|
| geo.country | STRING | Country name |
| geo.region | STRING | State/region |
| geo.city | STRING | City name |

#### Traffic Source Fields

| Field | Type | Description |
|-------|------|-------------|
| traffic_source.source | STRING | google, direct |
| traffic_source.medium | STRING | organic, cpc |
| traffic_source.name | STRING | Campaign name |

#### E-commerce Fields

| Field | Type | Description |
|-------|------|-------------|
| ecommerce.transaction_id | STRING | Transaction ID |
| ecommerce.purchase_revenue_in_usd | FLOAT | Purchase revenue |
| items | RECORD (REPEATED) | Items array |

## SQL Query Patterns

### Query 1: Event Count by Name

```sql
SELECT
  event_name,
  COUNT(*) as event_count
FROM
  `project.dataset.events_*`
WHERE
  _TABLE_SUFFIX BETWEEN '20250101' AND '20250131'
GROUP BY
  event_name
ORDER BY
  event_count DESC
```

### Query 2: Extract Event Parameters

```sql
SELECT
  event_date,
  event_name,
  user_pseudo_id,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location') as page_location,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_title') as page_title
FROM
  `project.dataset.events_*`
WHERE
  _TABLE_SUFFIX BETWEEN '20250101' AND '20250131'
  AND event_name = 'page_view'
LIMIT 1000
```

### Query 3: Purchase Analysis

```sql
SELECT
  event_date,
  COUNT(DISTINCT user_pseudo_id) as purchasers,
  COUNT(DISTINCT ecommerce.transaction_id) as transactions,
  SUM(ecommerce.purchase_revenue_in_usd) as total_revenue,
  AVG(ecommerce.purchase_revenue_in_usd) as avg_order_value
FROM
  `project.dataset.events_*`
WHERE
  _TABLE_SUFFIX BETWEEN '20250101' AND '20250131'
  AND event_name = 'purchase'
  AND ecommerce.transaction_id IS NOT NULL
GROUP BY
  event_date
ORDER BY
  event_date
```

### Query 4: UNNEST Items Array

```sql
SELECT
  event_date,
  item.item_name,
  item.item_category,
  SUM(item.quantity) as total_quantity,
  SUM(item.item_revenue_in_usd) as total_revenue
FROM
  `project.dataset.events_*`,
  UNNEST(items) as item
WHERE
  _TABLE_SUFFIX BETWEEN '20250101' AND '20250131'
  AND event_name = 'purchase'
GROUP BY
  event_date,
  item.item_name,
  item.item_category
ORDER BY
  total_revenue DESC
```

### Query 5: User Journey Analysis

```sql
WITH user_events AS (
  SELECT
    user_pseudo_id,
    event_timestamp,
    event_name,
    (SELECT value.string_value FROM UNNEST(event_params)
     WHERE key = 'page_location') as page_location
  FROM
    `project.dataset.events_*`
  WHERE
    _TABLE_SUFFIX = '20250115'
)
SELECT
  user_pseudo_id,
  ARRAY_AGG(
    STRUCT(event_name, page_location, event_timestamp)
    ORDER BY event_timestamp
  ) as event_sequence
FROM
  user_events
GROUP BY
  user_pseudo_id
LIMIT 100
```

### Query 6: Session Attribution

```sql
SELECT
  event_date,
  traffic_source.source,
  traffic_source.medium,
  traffic_source.name as campaign,
  COUNT(DISTINCT user_pseudo_id) as users,
  COUNT(DISTINCT CONCAT(user_pseudo_id,
    (SELECT value.int_value FROM UNNEST(event_params)
     WHERE key = 'ga_session_id'))) as sessions
FROM
  `project.dataset.events_*`
WHERE
  _TABLE_SUFFIX BETWEEN '20250101' AND '20250131'
GROUP BY
  event_date,
  traffic_source.source,
  traffic_source.medium,
  traffic_source.name
ORDER BY
  sessions DESC
```

### Helper Functions

```sql
-- Reusable functions for parameter extraction
CREATE TEMP FUNCTION GetParamString(params ANY TYPE, target_key STRING)
RETURNS STRING
AS (
  (SELECT value.string_value FROM UNNEST(params) WHERE key = target_key)
);

CREATE TEMP FUNCTION GetParamInt(params ANY TYPE, target_key STRING)
RETURNS INT64
AS (
  (SELECT value.int_value FROM UNNEST(params) WHERE key = target_key)
);

-- Usage
SELECT
  event_date,
  GetParamString(event_params, 'page_location') as page_location,
  GetParamInt(event_params, 'engagement_time_msec') as engagement_time
FROM
  `project.dataset.events_*`
WHERE
  _TABLE_SUFFIX BETWEEN '20250101' AND '20250131'
```

## Query Optimisation

### Best Practices

**1. Use _TABLE_SUFFIX Filtering:**
```sql
-- Good
WHERE _TABLE_SUFFIX BETWEEN '20250101' AND '20250131'

-- Bad (scans all partitions)
WHERE event_date BETWEEN '20250101' AND '20250131'
```

**2. Filter on Clustered Columns:**
```sql
-- Tables clustered by event_name and event_timestamp
WHERE event_name IN ('page_view', 'purchase')
```

**3. Select Specific Columns:**
```sql
-- Good
SELECT event_name, user_pseudo_id, event_timestamp

-- Bad (high cost)
SELECT *
```

**4. Limit UNNEST Operations:**
```sql
-- Good: Inline UNNEST
(SELECT value.string_value FROM UNNEST(event_params)
 WHERE key = 'page_location')

-- Avoid: Full UNNEST in FROM
FROM table, UNNEST(event_params) as param
WHERE param.key = 'page_location'
```

**5. Use LIMIT During Development:**
```sql
LIMIT 1000  -- Test query first
```

## Cost Management

### BigQuery Pricing

| Type | Cost |
|------|------|
| Storage | ~$0.02/GB/month |
| Queries | ~$5/TB scanned |
| Streaming inserts | ~$0.05/GB (360 only) |

### Free Tier

- 10 GB storage free/month
- 1 TB queries free/month

### Reducing Costs

1. Partition by date using _TABLE_SUFFIX
2. Select only needed columns
3. Use LIMIT for testing
4. Create materialised views for frequent queries
5. Set up cost alerts in Google Cloud

## Data Retention

### GA4 vs BigQuery

| Platform | Retention |
|----------|-----------|
| GA4 Standard | 2 or 14 months |
| BigQuery | Unlimited (until deleted) |

### Setting Table Expiration

```sql
ALTER TABLE `project.dataset.events_20250101`
SET OPTIONS (
  expiration_timestamp=TIMESTAMP "2026-01-01 00:00:00 UTC"
)
```

## Common Use Cases

### 1. Unsampled Reporting

GA4 UI may sample large datasets. BigQuery provides complete data.

### 2. Custom Attribution

- Access full user journey
- Build custom attribution models
- Credit touchpoints as needed

### 3. Data Integration

- Join GA4 with CRM data
- Combine with product catalogue
- Enrich with external sources

### 4. Machine Learning

- Export to ML tools
- Predict churn, LTV, conversions
- Train custom models

### 5. Long-term Analysis

- Historical analysis beyond GA4 limits
- Year-over-year comparisons
- Trend analysis

## Troubleshooting

### No Data in Tables

**Causes:**
- Link just created (wait 24 hours)
- Export paused
- Wrong project/dataset

**Solutions:**
1. Wait for first export
2. Check BigQuery Links status
3. Verify project configuration

### Missing Events

**Causes:**
- Events not firing
- Consent mode blocking
- Filter applied

**Solutions:**
1. Verify in DebugView first
2. Check consent configuration
3. Review data filters

### High Query Costs

**Causes:**
- SELECT * usage
- Missing date filters
- Large date ranges

**Solutions:**
1. Select specific columns
2. Always use _TABLE_SUFFIX
3. Narrow date ranges

## Quick Reference

### Table Names

- Daily: `events_YYYYMMDD`
- Intraday: `events_intraday_YYYYMMDD`
- Wildcard: `events_*`

### Date Filter

```sql
WHERE _TABLE_SUFFIX BETWEEN '20250101' AND '20250131'
```

### Extract Parameter

```sql
(SELECT value.string_value FROM UNNEST(event_params)
 WHERE key = 'param_name')
```

### UNNEST Items

```sql
FROM table, UNNEST(items) as item
```

### Costs

- Storage: $0.02/GB/month
- Queries: $5/TB scanned
- Free: 10 GB storage, 1 TB queries/month
