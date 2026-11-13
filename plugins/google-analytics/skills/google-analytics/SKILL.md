---
name: google-analytics
description: Google Analytics 4 guardrails - the overloaded vocabulary, the mistakes models typically make and which data source a number comes from. Use when querying live GA4 report data, reading or changing GA4 through the ga CLI or the Analytics MCP server, designing events, key events or ecommerce tracking, registering custom dimensions or metrics, explaining why numbers differ between reports, Explorations, the Data API and BigQuery, sending server-side events, working with Data Manager or data import, reading the BigQuery export schema, or configuring Consent Mode. Do NOT use for GTM container work - use google-tagmanager; Google Ads scripting - use google-ads-scripts; SQL against GA4 export tables - use the bigquery skill; Universal Analytics or other analytics tools.
---

# Google Analytics 4

GA4 work goes wrong on vocabulary and on which data source a number came from, not on procedure. This skill pins both down and links to Google for everything else.

## Steps

1. **Settle vocabulary.** When the request uses event, conversion, parameter, dimension, user, session, ID, tag, audience, segment or Data Manager, read `references/glossary.md` and map each word to one entry. Done when every overloaded term in the request has one meaning, or you have asked the user which they mean.
2. **Name the source or route.** For a question about numbers, name the reading surface; for an implementation, name the collection route. Both tables are in `references/data-sources.md`. Done when you can say which surface or route applies and what it cannot do.
3. **Read the pitfall group for the task** in `references/pitfalls.md`, and scan the dated list in `references/recent-changes.md` for anything the task touches. Done when no line in that group, in that list or in the pitfalls at the end of this file describes what you are about to do.
4. **Act with the right tool** (below), quoting any limit from `references/limits.md` and any procedure from Google's page in `references/vendor-docs.md`. Done when each number in the answer names its surface and date range, and each configuration change was approved before it was sent.

## Live data and configuration

Use whichever tool the session has. Both take the numeric property ID (`123456789`), not the measurement ID (`G-XXXXXXXXXX`).

- **The `ga` CLI** ([daidalytics/google-analytics-cli](https://github.com/daidalytics/google-analytics-cli)) - reports, and configuration through the Admin API: custom dimensions, key events, data streams, bulk audits across properties, CI. Before any create, update or delete: run it with `--dry-run`, show the user the request and the property it targets, and send it only after they approve.
- **Google's Analytics MCP server** (added by the user from Google's guide) - read-only: Data API reports, funnel and realtime reports, and account, property, custom-definition and Google Ads link details.

With neither - no such tools and `command -v ga` finds nothing - read `references/tool-setup.md` and offer the user the choice of the two.

SQL against the export tables belongs to the bigquery skill.

## Routes

| Read | When |
|------|------|
| `references/glossary.md` | The request uses an overloaded term (step 1) |
| `references/data-sources.md` | Two numbers disagree, a number needs a caveat, or you are choosing how to collect or send events |
| `references/pitfalls.md` | Before designing events, registering definitions, reconciling numbers, sending server-side, setting consent, pointing at an Admin screen or linking BigQuery - read that group |
| `references/limits.md` | Before quoting any limit or quota |
| `references/data-manager.md` | Data Manager, data import, product links, or the Data Manager API |
| `references/bigquery.md` | Export options, table names or a column of the export schema |
| `references/cli.md` | Installing, authenticating or using the `ga` CLI |
| `references/tool-setup.md` | The task needs live data or a configuration change and the session has neither tool |
| `references/recent-changes.md` | Every task (step 3) - dated 2025-2026 changes a model's training is likely to miss |
| `references/vendor-docs.md` | A step-by-step procedure, an event's parameter list or an API reference - the link for each topic |
| the bigquery skill | Writing or running SQL against `events_*` tables |

## Pitfalls on every task

- "Conversion" in GA4 -> the GA4 object is a **key event**. A conversion is the ads object created from a key event and shared with Google Ads; the two are counted differently by design.
- Two surfaces disagree -> expected. Reports, Explorations, the Data API and BigQuery differ in freshness, sampling, thresholding, `(other)`, identity and modelling; name the cause from `references/data-sources.md` before calling anything broken.
- A parameter is "missing" from reports -> it is collected but unregistered. Register a custom dimension or metric with the matching scope; it fills from then on, in 24-48 hours.
- A `dataLayer.push` is treated as tracking -> it sends nothing until a tag fires on it.
- Automatic events doubled or missing -> the stream's enhanced measurement and the Google tag's automatic event detection are separate switches, and a manual tag for the same event is a third source.
- Property ID and measurement ID swapped -> APIs, the MCP server, the CLI and BigQuery take the numeric property ID; tags and the Measurement Protocol take `G-XXXXXXXXXX`.
- A Measurement Protocol 2xx read as success -> it accepts malformed payloads silently; validate at `/debug/mp/collect`, reuse the browser's `client_id`, and send `session_id`.
- Sessions counted in BigQuery by `ga_session_id` -> the key is `user_pseudo_id` plus `ga_session_id`; there is no session table.
- Old Admin paths and attribution models -> "Data Settings" is now "Data collection and modification"; DebugView, Events, Audiences, Custom definitions, Channel groups, Comparisons and Reporting identity are under "Data display"; first click, linear, time decay and position-based attribution were removed in November 2023.
- Data import or a product link set up without looking -> since November 2026 these live in Data Manager, and the same pipeline active on the ads side as well can log conversions twice.
- Universal Analytics habits -> there is no Event Category, Action or Label, no Views and no Goals. An interaction is an event name plus parameters.
- Modelling promised under basic consent mode -> only advanced consent mode sends the cookieless pings that behavioural modelling needs.

Use placeholder IDs in anything written down: `G-XXXXXXXXXX`, `GT-XXXXXXX`, `GTM-XXXXXXX`, `123456789`.
