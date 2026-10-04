# Google Ads Scripts API Reference

Method names and units for the `AdsApp` object model. Ads scripts run on the Google Ads API, and Google picks the API version for you - pin one only when `AdsApp.search` / `AdsApp.report` need a newer field, via their optional `apiVersion` argument. For anything not below, the class reference is at https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp.

## Contents

1. [Units: currency vs micros](#units-currency-vs-micros)
2. [Selectors and conditions](#selectors-and-conditions)
3. [GAQL reporting: AdsApp.search and AdsApp.report](#gaql-reporting-adsappsearch-and-adsappreport)
4. [Campaigns](#campaigns)
5. [Ad groups](#ad-groups)
6. [Keywords](#keywords)
7. [Ads](#ads)
8. [Bidding](#bidding)
9. [Budgets](#budgets)
10. [Targeting and bid modifiers](#targeting-and-bid-modifiers)
11. [Labels](#labels)
12. [Manager accounts](#manager-accounts)
13. [Removed features](#removed-features)
14. [Limits](#limits)

---

## Units: currency vs micros

The single most common bug. Entity methods work in **account currency**; GAQL works in **micros** (1,000,000 micros = 1 unit of currency).

| Where | Unit | Example |
|-------|------|---------|
| `Stats.getCost()`, `getAverageCpc()`, `getAverageCpm()` | currency | `12.34` |
| `Budget.getAmount()` / `setAmount()` | currency | `setAmount(50)` |
| `keyword.bidding().getCpc()` / `setCpc()`, builder `withCpc()` | currency | `setCpc(1.25)` |
| `withCondition('metrics.cost_micros > ...')`, `orderBy('metrics.cost_micros')` | micros | `> 100000000` = 100 |
| GAQL rows from `AdsApp.search` / `AdsApp.report` (`*_micros` fields) | micros | `Number(row.metrics.costMicros) / 1e6` |

---

## Selectors and conditions

Every collection follows selector -> iterator. Conditions and ordering use **GAQL field names** (`campaign.status`, `ad_group_criterion.status`, `metrics.clicks`), not the old AWQL names (`Status`, `Clicks`).

```javascript
const keywords = AdsApp.keywords()
  .withCondition('ad_group_criterion.status = ENABLED')
  .withCondition('campaign.status = ENABLED')
  .withCondition('metrics.clicks > 10')
  .forDateRange('LAST_30_DAYS')        // Required whenever a condition or orderBy uses metrics.*
  .orderBy('metrics.cost_micros DESC')
  .withLimit(500)
  .get();

Logger.log(keywords.totalNumEntities());
while (keywords.hasNext()) {
  const keyword = keywords.next();
}
```

**Field prefix by selector:**

| Selector | Entity fields |
|----------|---------------|
| `AdsApp.campaigns()` | `campaign.*` |
| `AdsApp.adGroups()` | `ad_group.*`, `campaign.*` |
| `AdsApp.keywords()` | `ad_group_criterion.*` (e.g. `ad_group_criterion.keyword.text`, `ad_group_criterion.quality_info.quality_score`), `ad_group.*`, `campaign.*` |
| `AdsApp.ads()` | `ad_group_ad.*`, `ad_group.*`, `campaign.*` |

Metrics are always `metrics.*` (`metrics.clicks`, `metrics.impressions`, `metrics.ctr`, `metrics.conversions`, `metrics.cost_micros`).

**Date ranges** for `forDateRange()` and `getStatsFor()`: `TODAY`, `YESTERDAY`, `LAST_7_DAYS`, `LAST_14_DAYS`, `LAST_30_DAYS`, `LAST_BUSINESS_WEEK`, `LAST_WEEK_SUN_SAT`, `LAST_WEEK_MON_SUN`, `THIS_WEEK_SUN_TODAY`, `THIS_WEEK_MON_TODAY`, `THIS_MONTH`, `LAST_MONTH`, `ALL_TIME`. Prefer these over hard-coded dates. For a custom window, compute `YYYYMMDD` strings relative to today:

```javascript
function yyyymmdd(daysAgo) {
  const tz = AdsApp.currentAccount().getTimeZone();
  return Utilities.formatDate(new Date(Date.now() - daysAgo * 86400000), tz, 'yyyyMMdd');
}
const stats = campaign.getStatsFor(yyyymmdd(90), yyyymmdd(1));  // Last 90 days, excluding today
```

**Labels in conditions** take the label resource name: `campaign.labels CONTAINS ANY ('customers/1234567890/labels/123')`. Get it with `label.getResourceName()`.

---

## GAQL reporting: AdsApp.search and AdsApp.report

Use GAQL whenever you need a metric the `Stats` object lacks (conversion value, impression share, quality-score components) or rows across many entities in one call. Both methods take the same query.

```javascript
const query = `
  SELECT campaign.id, campaign.name,
         metrics.cost_micros, metrics.conversions, metrics.conversions_value
  FROM campaign
  WHERE campaign.status = ENABLED
    AND segments.date DURING LAST_30_DAYS`;

// AdsApp.search - nested objects, lowerCamelCase keys
const rows = AdsApp.search(query);
while (rows.hasNext()) {
  const row = rows.next();
  const cost = Number(row.metrics.costMicros) / 1e6;
  const roas = cost > 0 ? row.metrics.conversionsValue / cost : 0;
  Logger.log(`${row.campaign.name}: ROAS ${roas.toFixed(2)}`);
}

// AdsApp.report - flat rows keyed by the query's snake_case field names
const report = AdsApp.report(query);
const it = report.rows();
while (it.hasNext()) {
  const row = it.next();
  Logger.log(row['campaign.name'] + ' ' + row['metrics.conversions']);
}

// Straight to Sheets
report.exportToSheet(SpreadsheetApp.openByUrl(SHEET_URL).getSheetByName('Raw'));
```

Gotchas:

- `AdsApp.search` returns **lowerCamelCase** keys (`row.adGroupCriterion.qualityInfo.qualityScore`) even though the query is snake_case. Fields with no value are omitted from the row, so guard with `?.` or a default.
- Int64 fields such as `metrics.cost_micros` can arrive as strings - wrap in `Number()`.
- Quality score lives on `keyword_view` / `ad_group_criterion`: `ad_group_criterion.quality_info.quality_score`, `.creative_quality_score`, `.post_click_quality_score`, `.search_predicted_ctr`. Field reference: https://developers.google.com/google-ads/api/fields/latest/ad_group_criterion.
- Combine GAQL metrics with entity updates by keying on IDs, then fetch the entities with `.withIds([...])` (at most 10,000 IDs per selector).

---

## Campaigns

The selector and builder APIs read and modify campaigns but have no campaign builder. To create a campaign from a script, send Google Ads API operations through `AdsApp.mutate` or `AdsApp.mutateAll`, or use Bulk Uploads.

```javascript
const campaign = AdsApp.campaigns()
  .withCondition('campaign.name = "Brand - AU"')
  .get().next();

campaign.getId(); campaign.getName(); campaign.getBiddingStrategyType();
campaign.getStartDate(); campaign.getEndDate();   // { year, month, day } objects
campaign.isEnabled(); campaign.isPaused(); campaign.isRemoved();

campaign.setName('Brand - AU (2)');
campaign.setEndDate('20271231');                  // YYYYMMDD string or { year, month, day }
campaign.pause();
campaign.enable();

campaign.createNegativeKeyword('[free shoes]');   // [exact], "phrase", plain = broad
```

Filter by channel with `campaign.advertising_channel_type = SEARCH` (also `DISPLAY`, `SHOPPING`, `VIDEO`, `PERFORMANCE_MAX`, `DEMAND_GEN`, and others). Performance Max, Shopping and Video campaigns have their own selectors: `AdsApp.performanceMaxCampaigns()`, `AdsApp.shoppingCampaigns()`, `AdsApp.videoCampaigns()`.

---

## Ad groups

```javascript
const adGroup = campaign.newAdGroupBuilder()
  .withName('Running Shoes')
  .withStatus('PAUSED')
  .withCpc(0.75)                    // Currency
  .build()
  .getResult();

adGroup.bidding().getCpc();
adGroup.bidding().setCpc(0.9);
adGroup.setName('Running Shoes - Men');
adGroup.pause();
adGroup.createNegativeKeyword('"second hand"');
```

Builder operations return an operation: call `.isSuccessful()` / `.getErrors()` before `.getResult()` when failures matter.

---

## Keywords

```javascript
const op = adGroup.newKeywordBuilder()
  .withText('[leather shoes]')      // Match type is in the text: [exact], "phrase", plain = broad
  .withCpc(1.5)                     // Currency
  .withFinalUrl('https://example.com/shoes')
  .build();

const keyword = op.getResult();
keyword.getText();                  // '[leather shoes]'
keyword.getMatchType();             // EXACT | PHRASE | BROAD
keyword.getQualityScore();          // 1-10, or null when there is too little data
keyword.getApprovalStatus();
keyword.getFirstPageCpc();
keyword.getTopOfPageCpc();
keyword.bidding().getCpc();
keyword.bidding().setCpc(1.75);
keyword.urls().setFinalUrl('https://example.com/leather');
keyword.pause();
keyword.remove();
```

`Keyword` has no `getMaxCpc`/`setMaxCpc` and no quality-score component getters - use `bidding()` and GAQL respectively.

---

## Ads

Create Responsive Search Ads; Expanded Text Ads can no longer be created.

```javascript
const op = adGroup.newAd().responsiveSearchAdBuilder()
  .withHeadlines(['Leather Shoes', 'Free Delivery', { text: 'Shop Now', pinning: 'HEADLINE_1' }])
  .withDescriptions(['Handmade in Italy.', 'Order by 3pm for next-day delivery.'])
  .withPath1('shoes')
  .withFinalUrl('https://example.com/shoes')
  .build();

const ads = AdsApp.ads()
  .withCondition('ad_group_ad.status = ENABLED')
  .withCondition('ad_group_ad.ad.type = RESPONSIVE_SEARCH_AD')
  .get();
// ad.getType(), ad.isEnabled(), ad.pause(), ad.enable(), ad.remove(), ad.getStatsFor(...)
```

For dynamic text in RSAs, use asset-based customizers (`{CUSTOMIZER.name:default}`) managed in the Google Ads UI or API - the scripts-side `AdCustomizerSource` is gone (see [Removed features](#removed-features)).

---

## Bidding

Keyword and ad-group CPC bids only take effect under a manual CPC strategy.

```javascript
const bidding = campaign.bidding();
bidding.getStrategyType();                      // e.g. MANUAL_CPC, TARGET_CPA, MAXIMIZE_CONVERSION_VALUE
bidding.setStrategy('MANUAL_CPC');
bidding.setTargetCpa(25);                       // Currency
bidding.setTargetRoas(4.0);                     // 4.0 = 400%
bidding.setStrategy(AdsApp.biddingStrategies().withCondition('bidding_strategy.name = "Portfolio A"').get().next());
```

---

## Budgets

```javascript
const budget = campaign.getBudget();
budget.getAmount();                // Currency, per day
budget.setAmount(120);             // Currency
budget.isExplicitlyShared();       // true = changing it affects every campaign in budget.campaigns()
budget.getType();                  // DAILY or TOTAL
```

Check `isExplicitlyShared()` before scaling a budget per campaign, or one campaign's rule silently changes its siblings.

---

## Targeting and bid modifiers

```javascript
const targeting = campaign.targeting();

// Device
targeting.platforms().mobile().get().next().setBidModifier(1.2);   // +20%

// Locations (Geo target constant IDs, e.g. 2036 = Australia)
campaign.addLocation(2036, 1.1);
targeting.targetedLocations().get().next().setBidModifier(0.9);
campaign.excludeLocation(2554);

// Ad schedule: dayOfWeek, startHour, startMinute, endHour, endMinute, bidModifier
campaign.addAdSchedule('MONDAY', 9, 0, 17, 0, 1.2);
targeting.adSchedules().get();       // Existing schedules
```

---

## Labels

A label must exist before you apply it.

```javascript
if (!AdsApp.labels().withCondition("label.name = 'Paused by script'").get().hasNext()) {
  AdsApp.createLabel('Paused by script');
}
keyword.applyLabel('Paused by script');
keyword.removeLabel('Paused by script');
```

---

## Manager accounts

```javascript
function main() {
  AdsManagerApp.accounts()
    .withCondition("customer_client.descriptive_name CONTAINS 'AU'")
    .withLimit(50)                                     // executeInParallel handles at most 50
    .executeInParallel('processAccount', 'allDone');
}

function processAccount() {
  const account = AdsApp.currentAccount();             // Already switched for you
  return JSON.stringify({ id: account.getCustomerId(), cost: account.getStatsFor('YESTERDAY').getCost() });
}

function allDone(results) {
  results.forEach(r => Logger.log(r.getReturnValue()));
}
```

For sequential work, iterate `AdsManagerApp.accounts().get()` and call `AdsManagerApp.select(account)` before each account's operations.

---

## Removed features

Since **14 July 2025** these throw sunset errors in scripts (the end of the Expanded Text Ad and feed-based extension migration):

- `AdsApp.AdCustomizerSource`, `AdsApp.newAdCustomizerSourceBuilder()` and the items built from them - replace with asset-based customizers (`{CUSTOMIZER.name}`) set up in the Google Ads UI or API.
- `withOnlyLegacy()` on extension selectors (feed-based sitelinks, callouts and so on) - use the asset-based extensions returned by the default selectors.

Also gone or inert: creating Expanded Text Ads, `Stats.getAveragePosition()` (deprecated; use `metrics.top_impression_percentage` / `metrics.absolute_top_impression_percentage` via GAQL).

---

## Limits

From https://developers.google.com/google-ads/scripts/docs/limits:

| Limit | Value |
|-------|-------|
| Execution time | 30 minutes (manager scripts using `executeInParallel`: up to 60 minutes) |
| Accounts per `executeInParallel` | 50 |
| Results per iterator | 50,000 by default |
| IDs per `withIds()` | 10,000 |
| Logging output | truncated at 100 KB |
| `executeInParallel` return value | 10 MB per account |
| Authorised scripts per account | 250 |
| Bulk upload file | 50 MB, one million rows |
