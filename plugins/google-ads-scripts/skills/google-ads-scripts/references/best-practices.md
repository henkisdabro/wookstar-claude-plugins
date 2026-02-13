# Google Ads Scripts - Best Practices

Detailed best practices with code examples for writing efficient, reliable Google Ads Scripts.

## 1. Use Batch Operations

Avoid individual API calls in loops. Instead, collect entities and perform batch operations:

```javascript
// Good - Batch collection
const keywords = AdsApp.keywords()
  .withCondition('keyword.quality_info.quality_score < 5')
  .get();

const toUpdate = [];
while (keywords.hasNext()) {
  toUpdate.push(keywords.next());
}

toUpdate.forEach(keyword => keyword.setMaxCpc(50000));
```

## 2. Filter with Conditions

Use `.withCondition()` to filter at the API level rather than in JavaScript:

```javascript
// Good - API-level filtering
const campaigns = AdsApp.campaigns()
  .withCondition('campaign.status = ENABLED')
  .withCondition('campaign.budget_information.budget_amount > 100000000')
  .get();
```

## 3. Handle Errors Gracefully

Always wrap operations in try-catch blocks and log errors:

```javascript
function safeOperation() {
  try {
    // Operation code
  } catch (error) {
    Logger.log('Error: ' + error.message);
    Logger.log('Stack: ' + error.stack);

    // Optionally email alert
    MailApp.sendEmail(
      Session.getEffectiveUser().getEmail(),
      'Ads Script Error',
      error.message
    );
  }
}
```

## 4. Respect Execution Limits

Scripts have a 30-minute execution timeout. For large accounts:

- Limit result sets with `.withLimit()`
- Process in batches
- Use early termination when needed

## 5. Convert Micros Correctly

Google Ads API uses micros (1/1,000,000) for currency values:

```javascript
const costMicros = stats.getCost();
const costCurrency = costMicros / 1000000;  // Convert to dollars/local currency

const bidCurrency = 5.00;  // $5.00
const bidMicros = bidCurrency * 1000000;  // 5000000 micros
```

## 6. Log Operations for Auditing

Maintain audit trails by logging changes to Google Sheets:

```javascript
function logChange(operation, entity, details) {
  const ss = SpreadsheetApp.openById('LOG_SHEET_ID');
  const sheet = ss.getSheetByName('Audit Log');
  sheet.appendRow([
    new Date(),
    operation,
    entity,
    JSON.stringify(details)
  ]);
}
```
