---
name: bigquery
description: Query the GA4 BigQuery export (events_* tables) through a BigQuery MCP server and answer questions from raw event data. Use when asked to run or write SQL against GA4 export tables, unnest event_params or items, build sessions, landing pages or session-level source/medium from raw events, reconcile BigQuery numbers with the GA4 UI, estimate or cap query cost with a dry run, or find which dataset holds a property's export. Do NOT use for live GA4 reports via the Data API or for setting up the BigQuery link and export - use google-analytics; for BigQuery work unrelated to GA4 data, use Google's bigquery-data-analytics plugin directly.
argument-hint: "[question about GA4 export data]"
---

# GA4 BigQuery Export Querying

The request: **$ARGUMENTS** - treat it as the query brief. With no arguments, ask what the user wants to know and over which dates.

The export's setup, table naming and full schema live in the google-analytics skill: read `${CLAUDE_SKILL_DIR}/../google-analytics/references/bigquery.md` whenever you need a column, record or event_params key you have not already confirmed. Ready-made SQL (sessions, landing pages, channels, ecommerce, funnels) is in `${CLAUDE_SKILL_DIR}/references/query-patterns.md` - start from it rather than writing from scratch.

## Step 1 - Confirm a BigQuery MCP server

Look for BigQuery tools (`execute_sql`, `list_dataset_ids`, `get_table_info`). Two official Google options supply them:

| Server | How | Cost controls |
|--------|-----|---------------|
| `bigquery-data-analytics` plugin (Google, MCP Toolbox over stdio, Application Default Credentials) | `/plugin install bigquery-data-analytics@claude-plugins-official` | `execute_sql` accepts `dry_run: true`; env `BIGQUERY_MAXIMUM_BYTES_BILLED` sets a hard cap; results return 50 rows unless `BIGQUERY_MAX_QUERY_RESULT_ROWS` is raised |
| Remote BigQuery MCP server `https://bigquery.googleapis.com/mcp` (OAuth) | `claude mcp add --transport http` - see the plugin README | No dry-run parameter; prefer `execute_sql_readonly`; 3-minute timeout, 3,000-row cap |

Done when a BigQuery tool is callable. If none is, point the user to the plugin README's "BigQuery querying" section and stop.

## Step 2 - Locate the export

GA4 datasets are named `analytics_<property_id>`. Use `list_dataset_ids` (pass a project ID if the export lives outside the server's default project), then `list_table_ids` to find the first and last `events_` shard and whether `events_intraday_` tables exist. Always write fully qualified names: `` `project-id.analytics_123456789.events_*` ``.

Done when you know the project, dataset, the date range the shards cover, and the property time zone if timing matters (`get_table_info`, or ask).

## Step 3 - Write the query with the cost rules

The export is **date-sharded** (one table per day), not partitioned, so the shard filter is the partition filter. Every query against `events_*`:

1. Filters `_TABLE_SUFFIX BETWEEN 'YYYYMMDD' AND 'YYYYMMDD'`. A filter on `event_date` alone scans every shard.
2. Selects named columns only - `SELECT *` reads every record, including `items` and `event_params`.
3. Filters `event_name` as early as possible.
4. Extracts parameters with a scalar subquery: `(SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location')`. Use `CROSS JOIN UNNEST(...)` only when you need one row per parameter or item.
5. Reads the right value column: `ga_session_id`, `engagement_time_msec`, `entrances` are `int_value`; URLs, titles and UTMs are `string_value`; `session_engaged` can be either, so `COALESCE(value.string_value, CAST(value.int_value AS STRING))`. A wrong column returns NULL silently, never an error.

Done when the SQL meets all five rules.

## Step 4 - Dry run, then run

Dry-run first: `execute_sql` with `dry_run: true` (Toolbox), or `bq query --use_legacy_sql=false --dry_run '<sql>'` when only the remote server is available. Report bytes processed and the approximate on-demand cost (bytes / 2^40 x US$6.25 - confirm current pricing if the user is cost-sensitive).

- Under ~10 GB: run it.
- Over ~10 GB, or above any limit the user set: show the estimate and ask before running, offering a narrower date range or fewer columns.
- Explore on one or two days with `LIMIT 100` before widening the range.

Done when the query has run and you have checked the row count against the row cap of the server (Step 1) - a result of exactly 50 or 3,000 rows is truncated, so aggregate further or raise the cap.

## Step 5 - Present

Lead with the answer, then a compact table, then the SQL in a fenced block so the user can rerun it. State the date range, the time zone assumption and anything excluded (intraday data, consent-denied traffic).

## Sessionisation

A session is `user_pseudo_id` + `ga_session_id`. `ga_session_id` alone repeats across users, and `CONCAT` needs strings:

```sql
CONCAT(user_pseudo_id, '.', CAST((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS STRING)) AS session_key
```

- **Session counts**: `COUNT(DISTINCT session_key)` across the whole range. Sessions crossing midnight appear in two daily shards, so summing per-day counts overcounts.
- **Engaged sessions**: a session where any event has `session_engaged = '1'`; engagement time is `SUM(engagement_time_msec)` per session.
- **Landing page**: `page_location` of the `page_view` with `entrances = 1`, or the session's first `page_view` by `event_timestamp` (break ties with `batch_page_id`, `batch_ordering_id`, `batch_event_index`).
- **Session source/medium**: `session_traffic_source_last_click.cross_channel_campaign` matches GA4's session attribution where the column exists. For older shards, take `collected_traffic_source` (or the `source`/`medium` params) from the session's first event, and treat NULL as `(direct) / (none)`.
- **`traffic_source`** is the user's first-ever acquisition - use it for user acquisition, never for sessions.

## Time and table gotchas

- `event_date` is in the property's time zone; `event_timestamp` is UTC microseconds. Convert with `DATETIME(TIMESTAMP_MICROS(event_timestamp), 'Area/City')`.
- `events_*` also matches `events_intraday_*`, but those suffixes start with `intraday_`, so a `BETWEEN` on digits excludes them. To include today, `UNION ALL` the intraday table explicitly - and leave acquisition out, since intraday lacks new-session traffic source data.
- Daily shards can be rewritten for about 72 hours after the day ends; flag figures for the last three days as provisional.

## UI vs BigQuery

Expect BigQuery counts to differ from the GA4 UI by a few percent and explain why rather than forcing a match: the UI estimates users and sessions with HyperLogLog++, applies thresholding and consent-mode modelling, and may use Google signals; the export holds only observed, consented events, exactly counted. Large gaps usually mean a time zone mismatch, an intraday/daily mix, or a different user definition (`user_id` vs `user_pseudo_id`).

## Access and troubleshooting

Both servers authenticate as the user. Query jobs run in, and are billed to, the server's default project (`BIGQUERY_PROJECT` for the plugin), which may differ from the project that holds the export.

| Symptom | Fix |
|---------|-----|
| `Reauthentication is needed` / `RefreshError` | `gcloud auth application-default login`, then restart MCP servers with `/mcp` |
| Quota-project warning or `USER_PROJECT_DENIED` | `gcloud auth application-default set-quota-project YOUR_PROJECT_ID` with a project you can bill to |
| `403 Access Denied` running a query | Need BigQuery Job User (`roles/bigquery.jobUser`) on the billing project and BigQuery Data Viewer (`roles/bigquery.dataViewer`) on the export dataset; the remote server also needs MCP Tool User (`roles/mcp.toolUser`) |
| `403` reading `__TABLES__` | Expected for some roles - use `list_table_ids` |
| `Unrecognized name` on a column | The column predates or postdates the shard range (for example `session_traffic_source_last_click`) - check the schema with `get_table_info` on the earliest shard |
