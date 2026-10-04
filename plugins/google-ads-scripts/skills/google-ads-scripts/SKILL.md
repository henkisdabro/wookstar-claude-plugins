---
name: google-ads-scripts
description: Google Ads Scripts development - JavaScript run inside the Google Ads UI against the AdsApp API and GAQL. Use when writing a script to pause or enable keywords, adjusting bids or budgets from performance rules, pulling a GAQL report into Google Sheets, monitoring quality scores, alerting on spend or anomalies by email, or running a script across accounts from a manager (MCC) account. Do NOT use for the Google Ads API from Python, REST or gRPC - this covers Ads Scripts only. Do NOT use for Google Apps Script outside Google Ads - use google-apps-script. Do NOT use for Microsoft Ads, Meta Ads or other ad platforms.
---

# Google Ads Scripts

JavaScript that runs in Google Ads (Tools > Bulk actions > Scripts) on the Google Ads API. Selector conditions and reports use GAQL field names (`campaign.status`, `ad_group_criterion.quality_info.quality_score`, `metrics.cost_micros`); Google picks the API version, so scripts do not pin one.

## Steps

1. **Read with the cheapest tool.** Use selectors (`AdsApp.keywords().withCondition(...)`) when you will modify the entities you read. Use `AdsApp.search` or `AdsApp.report` with a GAQL query when you need metrics the `Stats` object lacks (conversion value, ROAS, impression share, quality-score components) or rows across many entities. Done when every metric the script uses comes from a source that actually returns it.

2. **Filter on the server.** Put every filter in `.withCondition()` or the GAQL `WHERE`, add `.forDateRange('LAST_30_DAYS')` (or another relative range) whenever a condition touches `metrics.*`, and cap with `.withLimit()`. Done when no JavaScript `if` re-filters what a condition could have filtered, and no date is hard-coded.

3. **Get the units right.** Entity methods are in account currency (`Stats.getCost()`, `Budget.setAmount(50)`, `keyword.bidding().setCpc(1.25)`); GAQL is in micros (`metrics.cost_micros > 100000000` means 100). Done when every `/ 1000000` divides a GAQL `*_micros` value and nothing else.

4. **Gate every mutation.** Ship with `DRY_RUN = true`, clamp each change (minimum and maximum bid, maximum percentage change per run), skip shared budgets unless intended (`budget.isExplicitlyShared()`), and record what changed to a Sheet or email. Done when a dry run logs exactly the changes a live run would make.

5. **Fit the 30-minute limit.** Collect the IDs to change first, then mutate; fetch entities in bulk with `.withIds([...])` (10,000 per selector). For manager accounts use `AdsManagerApp.accounts().executeInParallel(...)` (50 accounts per call). Done when the run time is bounded by `.withLimit()` or batch size, not account size.

## Quick start

Pause keywords with a low quality score and real spend:

```javascript
const DRY_RUN = true;

function main() {
  const keywords = AdsApp.keywords()
    .withCondition('ad_group_criterion.status = ENABLED')
    .withCondition('ad_group_criterion.quality_info.quality_score < 4')
    .withCondition('metrics.cost_micros > 100000000')   // 100 in account currency
    .forDateRange('LAST_30_DAYS')
    .get();

  let count = 0;
  while (keywords.hasNext()) {
    const keyword = keywords.next();
    Logger.log(`${DRY_RUN ? '[dry run] ' : ''}Pause ${keyword.getText()} (QS ${keyword.getQualityScore()})`);
    if (!DRY_RUN) keyword.pause();
    count++;
  }
  Logger.log(`${count} keywords matched`);
}
```

## Gotchas

- **Removed since 14 July 2025:** `AdsApp.AdCustomizerSource`, `newAdCustomizerSourceBuilder()` and `withOnlyLegacy()` on extension selectors throw sunset errors. Use asset-based customizers (`{CUSTOMIZER.name:default}`) in Responsive Search Ads, set up in the Google Ads UI or API.
- **No campaign creation** from scripts - use Bulk Uploads or the Google Ads API. Expanded Text Ads cannot be created; build Responsive Search Ads.
- **No `getMaxCpc` / `setMaxCpc` / `getReturnOnAdSpend`.** Bids go through `entity.bidding().getCpc()` / `setCpc()`, and ROAS is `metrics.conversions_value / (metrics.cost_micros / 1e6)` from GAQL. Keyword CPC bids only bite under manual CPC.
- **`AdsApp.search` rows are lowerCamelCase** (`row.metrics.costMicros`) even though the query is snake_case; int64 values may be strings, so wrap in `Number()`.
- **Spreadsheets:** there is no active spreadsheet - open by URL or ID. Logs view under the script's run history; output past 100 KB is truncated.

## Validation

`scripts/validators.py` checks campaign names, keyword text (80 characters, 10 words), match types, campaign types, bids, budgets and currency/micros conversion before you hard-code them. Run `python3 "${CLAUDE_SKILL_DIR}/scripts/validators.py"` for a self-test, or import its functions.

## References

- [references/ads-api-reference.md](references/ads-api-reference.md) - read when you need a method signature, a GAQL field prefix for a selector, targeting/bid-modifier calls, manager-account patterns, or the limits table.
- [references/examples.md](references/examples.md) - read when building a keyword pauser, ROAS bid adjuster or Sheets performance export from scratch.
- [references/patterns.md](references/patterns.md) - read when adding day-of-week budget changes or quality-score alerting.
- [references/best-practices.md](references/best-practices.md) - read when reviewing an existing script for filtering, error handling, unit or audit-log problems.
- `assets/bid-manager-template.js` and `assets/campaign-optimizer-template.js` - copy as the starting point for a keyword bid manager or campaign budget optimiser; both default to dry run.
