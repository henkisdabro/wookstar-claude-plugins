# Google Apps Script - Best Practices

Detailed best practices with code examples for writing efficient and reliable Apps Script code.

## 1. Use Batch Operations for Performance

Minimise API calls by batching reads and writes:

```javascript
// Good - Single batch read
const values = sheet.getRange('A1:Z1000').getValues();

// Bad - 1000 individual reads
for (let i = 1; i <= 1000; i++) {
  const value = sheet.getRange(`A${i}`).getValue();
}
```

## 2. Cache Frequently Accessed Data

Use CacheService for temporary data (25 min TTL):

```javascript
function getCachedData(key) {
  const cache = CacheService.getScriptCache();
  let data = cache.get(key);

  if (!data) {
    // Fetch from source
    data = expensiveOperation();
    cache.put(key, JSON.stringify(data), 600);  // 10 minutes
  }

  return JSON.parse(data);
}
```

## 3. Handle Errors Gracefully

Implement comprehensive error handling:

```javascript
function safeOperation() {
  try {
    // Operation code
    const range = sheet.getRange('A1');
    range.setValue('Value');
  } catch (error) {
    Logger.log('Error: ' + error.message);
    Logger.log('Stack: ' + error.stack);

    // Notify user
    const ui = SpreadsheetApp.getUi();
    ui.alert('Error: ' + error.message);

    // Log to sheet for audit trail
    const logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Error Log');
    if (logSheet) {
      logSheet.appendRow([new Date(), error.message, error.stack]);
    }
  }
}
```

## 4. Respect Execution Limits

Scripts have a 6-minute timeout. For large operations:

- Process in batches
- Use triggers to split work
- Implement progress tracking

## 5. Minimise OAuth Scopes

Request only necessary permissions in `appscript.json`:

```json
{
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets.currentonly",
    "https://www.googleapis.com/auth/script.send_mail"
  ]
}
```

## 6. Use PropertiesService for Persistence

Store configuration and state:

```javascript
function saveConfig(key, value) {
  const props = PropertiesService.getScriptProperties();
  props.setProperty(key, value);
}

function getConfig(key) {
  const props = PropertiesService.getScriptProperties();
  return props.getProperty(key);
}
```
