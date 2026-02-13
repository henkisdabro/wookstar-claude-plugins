# Google Apps Script - Common Patterns

Reusable patterns for typical Google Apps Script automation scenarios.

## Pattern: Spreadsheet Data Validation

```javascript
function setupDataValidation() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getRange('A2:A100');

  // Create dropdown rule
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Option 1', 'Option 2', 'Option 3'])
    .setAllowInvalid(false)
    .build();

  range.setDataValidation(rule);
}
```

## Pattern: Retry Logic for API Calls

```javascript
function fetchWithRetry(url, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = UrlFetchApp.fetch(url);
      return JSON.parse(response.getContentText());
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      Utilities.sleep(Math.pow(2, attempt) * 1000);  // Exponential backoff
    }
  }
}
```

## Pattern: Form Response Processing

```javascript
function onFormSubmit(e) {
  const response = e.values;  // Form responses
  const email = response[1];  // Assuming email is column B
  const name = response[2];   // Name in column C

  // Send confirmation email
  MailApp.sendEmail({
    to: email,
    subject: 'Form Submission Received',
    body: `Hi ${name},\n\nThank you for your submission.`
  });

  // Log to separate sheet
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const logSheet = ss.getSheetByName('Processed') || ss.insertSheet('Processed');
  logSheet.appendRow([new Date(), name, email, 'Processed']);
}
```
