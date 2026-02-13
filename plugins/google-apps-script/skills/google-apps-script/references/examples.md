# Google Apps Script - Code Examples

Detailed, production-ready examples for common Google Apps Script automation tasks.

## Example 1: Automated Spreadsheet Report

```javascript
function generateWeeklyReport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Data');

  // Batch read for performance
  const data = sheet.getRange('A2:D').getValues();

  // Process data
  const report = data
    .filter(row => row[0])  // Filter empty rows
    .map(row => ({
      name: row[0],
      value: row[1],
      status: row[2],
      date: row[3]
    }));

  // Write summary
  const summarySheet = ss.getSheetByName('Summary') || ss.insertSheet('Summary');
  summarySheet.clear();
  summarySheet.appendRow(['Name', 'Total Value', 'Status']);

  report.forEach(item => {
    summarySheet.appendRow([item.name, item.value, item.status]);
  });

  // Email notification
  MailApp.sendEmail({
    to: Session.getEffectiveUser().getEmail(),
    subject: 'Weekly Report Generated',
    body: `Report generated with ${report.length} records.`
  });
}
```

## Example 2: Gmail Auto-Responder

```javascript
function processUnreadEmails() {
  const threads = GmailApp.search('is:unread from:specific@example.com');

  threads.forEach(thread => {
    const messages = thread.getMessages();
    const latestMessage = messages[messages.length - 1];

    const subject = latestMessage.getSubject();
    const body = latestMessage.getPlainBody();

    // Process and respond
    thread.reply(`Thank you for your email regarding: ${subject}\n\nWe will respond within 24 hours.`);

    // Mark as read and label
    thread.markRead();
    const label = GmailApp.getUserLabelByName('Auto-Responded');
    thread.addLabel(label);
  });
}
```

## Example 3: Document Generation from Template

```javascript
function generateDocumentFromTemplate() {
  // Get template
  const templateId = 'YOUR_TEMPLATE_ID';
  const template = DriveApp.getFileById(templateId);

  // Make copy
  const newDoc = template.makeCopy('Generated Document - ' + new Date());

  // Open and edit
  const doc = DocumentApp.openById(newDoc.getId());
  const body = doc.getBody();

  // Replace placeholders
  body.replaceText('{{NAME}}', 'John Doe');
  body.replaceText('{{DATE}}', new Date().toDateString());
  body.replaceText('{{AMOUNT}}', '$1,234.56');

  // Save
  doc.saveAndClose();

  // Share with user
  newDoc.addEditor('recipient@example.com');

  Logger.log('Document created: ' + newDoc.getUrl());
}
```

## Example 4: Time-Based Trigger Setup

```javascript
function setupDailyTrigger() {
  // Delete existing triggers to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'dailyReport') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Create new trigger for 9 AM daily
  ScriptApp.newTrigger('dailyReport')
    .timeBased()
    .atHour(9)
    .everyDays(1)
    .create();

  Logger.log('Daily trigger configured');
}

function dailyReport() {
  // This function runs daily at 9 AM
  generateWeeklyReport();
}
```
