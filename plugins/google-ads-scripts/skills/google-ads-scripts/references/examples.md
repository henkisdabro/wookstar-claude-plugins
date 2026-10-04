# Google Ads Scripts - Code Examples

Each example is a complete `main()` you can paste into the scripts editor. All dates are relative, so they keep working.

## Example 1: Pause Low-Quality Keywords

Pauses keywords with a quality score below 4 that spent more than 100 (account currency) in the last 30 days.

```javascript
const DRY_RUN = true;

function main() {
  const keywords = AdsApp.keywords()
    .withCondition('ad_group_criterion.status = ENABLED')
    .withCondition('ad_group_criterion.quality_info.quality_score < 4')
    .withCondition('metrics.cost_micros > 100000000')  // 100 in account currency
    .forDateRange('LAST_30_DAYS')
    .get();

  let count = 0;
  while (keywords.hasNext()) {
    const keyword = keywords.next();
    if (!DRY_RUN) keyword.pause();
    count++;
  }

  Logger.log(`${DRY_RUN ? '[dry run] ' : ''}Paused ${count} low-quality keywords`);
}
```

## Example 2: Adjust Bids by ROAS

`Stats` has no conversion value, so ROAS comes from GAQL; the bid change goes through the keyword entity. Only meaningful for keywords under manual CPC.

```javascript
const TARGET_ROAS = 3.0;   // 300%
const DRY_RUN = true;

function main() {
  const rows = AdsApp.search(`
    SELECT ad_group.id, ad_group_criterion.criterion_id,
           metrics.cost_micros, metrics.conversions_value
    FROM keyword_view
    WHERE ad_group_criterion.status = ENABLED
      AND campaign.bidding_strategy_type = MANUAL_CPC
      AND metrics.conversions > 5
      AND segments.date DURING LAST_30_DAYS`);

  const roasById = {};
  while (rows.hasNext()) {
    const row = rows.next();
    const cost = Number(row.metrics.costMicros) / 1e6;
    if (cost > 0) {
      roasById[`${row.adGroup.id}~${row.adGroupCriterion.criterionId}`] =
        (row.metrics.conversionsValue || 0) / cost;
    }
  }

  const ids = Object.keys(roasById).map(key => key.split('~'));
  if (ids.length === 0) return;

  const keywords = AdsApp.keywords().withIds(ids).get();   // [adGroupId, criterionId] pairs
  while (keywords.hasNext()) {
    const keyword = keywords.next();
    const roas = roasById[`${keyword.getAdGroup().getId()}~${keyword.getId()}`];
    const bid = keyword.bidding().getCpc();                 // Currency
    let newBid = bid;

    if (roas > TARGET_ROAS) newBid = bid * 1.10;
    else if (roas < TARGET_ROAS * 0.7) newBid = bid * 0.95;

    newBid = Math.round(newBid * 100) / 100;
    if (newBid !== bid) {
      Logger.log(`${keyword.getText()}: ROAS ${roas.toFixed(2)}, ${bid} -> ${newBid}`);
      if (!DRY_RUN) keyword.bidding().setCpc(newBid);
    }
  }
}
```

## Example 3: Export Campaign Performance to Sheets

One GAQL report, written to a Sheet in a single `setValues` call.

```javascript
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit';

function main() {
  const rows = AdsApp.search(`
    SELECT campaign.name, metrics.clicks, metrics.cost_micros,
           metrics.conversions, metrics.conversions_value, metrics.average_cpc
    FROM campaign
    WHERE campaign.status = ENABLED
      AND segments.date DURING LAST_30_DAYS
    ORDER BY metrics.cost_micros DESC`);

  const out = [['Campaign', 'Clicks', 'Cost', 'Conversions', 'Avg CPC', 'ROAS']];
  while (rows.hasNext()) {
    const r = rows.next();
    const cost = Number(r.metrics.costMicros || 0) / 1e6;
    out.push([
      r.campaign.name,
      Number(r.metrics.clicks || 0),
      cost,
      r.metrics.conversions || 0,
      Number(r.metrics.averageCpc || 0) / 1e6,               // average_cpc is in micros in GAQL
      cost > 0 ? (r.metrics.conversionsValue || 0) / cost : 0
    ]);
  }

  const ss = SpreadsheetApp.openByUrl(SHEET_URL);
  const sheet = ss.getSheetByName('Campaign Report') || ss.insertSheet('Campaign Report');
  sheet.clearContents();
  sheet.getRange(1, 1, out.length, out[0].length).setValues(out);
}
```
