# Google Ads Scripts - Best Practices

Practices with code, for writing and reviewing scripts.

## 1. Collect, Then Mutate

Read everything you need first, decide, then apply changes. Interleaving reads and writes forces the script to flush pending mutations before each read, which is slow on large accounts.

```javascript
const toLower = [];
const keywords = AdsApp.keywords()
  .withCondition('ad_group_criterion.status = ENABLED')
  .withCondition('ad_group_criterion.quality_info.quality_score < 5')
  .get();
while (keywords.hasNext()) toLower.push(keywords.next());

toLower.forEach(keyword => {
  const bid = keyword.bidding().getCpc();
  keyword.bidding().setCpc(Math.round(bid * 0.9 * 100) / 100);   // Currency
});
```

## 2. Filter with Conditions

Filter at the API with GAQL field names, not in JavaScript:

```javascript
const campaigns = AdsApp.campaigns()
  .withCondition('campaign.status = ENABLED')
  .withCondition('campaign.advertising_channel_type = SEARCH')
  .withCondition('metrics.cost_micros > 100000000')   // 100 in account currency
  .forDateRange('LAST_7_DAYS')
  .get();
```

## 3. Handle Errors Visibly

A scheduled script that fails is otherwise silent. Catch, log, email, rethrow:

```javascript
const ALERT_EMAIL = 'you@example.com';

function main() {
  try {
    run();
  } catch (error) {
    Logger.log(`Error: ${error.message}\n${error.stack}`);
    MailApp.sendEmail(ALERT_EMAIL,
      `Ads script failed: ${AdsApp.currentAccount().getName()}`,
      `${error.message}\n\n${error.stack}`);
    throw error;   // Keeps the run marked as failed in the history
  }
}
```

## 4. Respect Execution Limits

Scripts stop at 30 minutes. For large accounts:

- Cap with `.withLimit()` and process the most important entities first (`orderBy('metrics.cost_micros DESC')`)
- Fetch by ID with `.withIds()` after a GAQL pass instead of iterating everything
- Check `AdsApp.getExecutionInfo().getRemainingTime()` (seconds) in long loops and stop cleanly

## 5. Get Currency Units Right

Entity methods use account currency; GAQL uses micros.

```javascript
const cost = campaign.getStatsFor('LAST_7_DAYS').getCost();     // Currency, e.g. 412.37
campaign.getBudget().setAmount(75);                             // Currency

const row = AdsApp.search('SELECT metrics.cost_micros FROM customer WHERE segments.date DURING LAST_7_DAYS').next();
const gaqlCost = Number(row.metrics.costMicros) / 1e6;          // Micros -> currency
```

## 6. Log Changes for Auditing

Keep an audit trail in a Sheet, written once at the end:

```javascript
const LOG_SHEET_URL = 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit';

function writeAuditLog(changes) {   // changes: [[operation, entity, details], ...]
  if (changes.length === 0) return;
  const sheet = SpreadsheetApp.openByUrl(LOG_SHEET_URL).getSheetByName('Audit Log');
  const now = new Date();
  const rows = changes.map(c => [now, ...c]);
  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
}
```
