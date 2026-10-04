# Google Apps Script API Reference

Built-in services, triggers, authorisation and limits. Every runtime is V8 - Rhino was shut down on 31 January 2026, so ES5-only workarounds are unnecessary. Google lists retired services at https://developers.google.com/apps-script/guides/support/sunset; check there before reaching for anything not documented below.

## Contents

1. [Core Architecture](#core-architecture)
2. [Built-in Services](#built-in-services)
3. [SpreadsheetApp](#spreadsheetapp)
4. [DocumentApp](#documentapp)
5. [GmailApp and MailApp](#gmailapp-and-mailapp)
6. [DriveApp](#driveapp)
7. [CalendarApp](#calendarapp)
8. [Triggers](#triggers)
9. [Advanced Services and Utilities](#advanced-services-and-utilities)
10. [Authorisation](#authorisation)
11. [Error Handling and Debugging](#error-handling-and-debugging)
12. [Performance](#performance)
13. [Patterns](#patterns)
14. [Quotas and Limits](#quotas-and-limits)

---

## Core Architecture

### Google Apps Script Execution Model

**Sandboxed JavaScript Runtime:**
- Server-side execution
- V8 runtime (modern JavaScript; the only runtime since Rhino's shutdown on 31 January 2026)
- 6-minute execution timeout per function
- Automatic service authorization

**Services Architecture:**
```
┌─────────────────────────────────────────┐
│    Google Apps Script Runtime (V8)      │
├─────────────────────────────────────────┤
│                                         │
│  Built-in Services (Auto-available)    │
│  ├─ SpreadsheetApp                     │
│  ├─ DocumentApp                        │
│  ├─ GmailApp                           │
│  ├─ DriveApp                           │
│  ├─ CalendarApp                        │
│  ├─ FormApp                            │
│  ├─ SlidesApp                          │
│  └─ More...                            │
│                                         │
│  Utility Services                      │
│  ├─ Logger                             │
│  ├─ PropertiesService                  │
│  ├─ CacheService                       │
│  ├─ UrlFetchApp                        │
│  └─ Utilities                          │
│                                         │
│  Advanced Services (Enable manually)   │
│  ├─ Google Analytics 4                 │
│  ├─ Google BigQuery                    │
│  └─ More...                            │
│                                         │
└─────────────────────────────────────────┘
```

### Script Execution Limits

See [Quotas and Limits](#quotas-and-limits) for the full table. The two that shape most designs: 6 minutes per execution, and 30 seconds per custom function call.

---

## Built-in Services

| Service | Type | Purpose |
|---------|------|---------|
| **SpreadsheetApp** | Built-in | Google Sheets manipulation |
| **DocumentApp** | Built-in | Google Docs creation/editing |
| **FormApp** | Built-in | Google Forms management |
| **SlidesApp** | Built-in | Google Slides creation |
| **GmailApp** | Built-in | Gmail read, search, labels, drafts and sending |
| **MailApp** | Built-in | Send-only email (narrower `script.send_mail` scope) |
| **CalendarApp** | Built-in | Google Calendar management |
| **DriveApp** | Built-in | Google Drive file operations |
| **Logger** | Built-in | Debug logging (console.log alternative) |
| **PropertiesService** | Built-in | Persistent key-value storage |
| **CacheService** | Built-in | Temporary key-value cache (10 min default, 6 h max) |
| **UrlFetchApp** | Built-in | HTTP requests to external APIs |
| **Utilities** | Built-in | Encoding, hashing, compression |
| **ScriptApp** | Built-in | Trigger management |
| **Session** | Built-in | User session information |
| **Browser** | Built-in | Sheets-only dialogs; prefer `SpreadsheetApp.getUi()` |

---

## SpreadsheetApp

### Core Concepts

SpreadsheetApp is the primary interface for Google Sheets automation.

**Global Object:** `SpreadsheetApp`

### Opening Spreadsheets

**Get active spreadsheet:**
```javascript
const ss = SpreadsheetApp.getActiveSpreadsheet();
const ssId = ss.getId();              // Get ID
const name = ss.getName();            // Get name
const url = ss.getUrl();              // Get URL
```

**Open by ID:**
```javascript
const ss = SpreadsheetApp.openById('SHEET_ID_HERE');
```

**Open by URL:**
```javascript
const ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/SHEET_ID/edit');
```

**Search and open:**
```javascript
const files = DriveApp.getFilesByName('My Spreadsheet');
if (files.hasNext()) {
  const ss = SpreadsheetApp.open(files.next());
}
```

### Sheet Operations

**Get sheets:**
```javascript
const ss = SpreadsheetApp.getActiveSpreadsheet();
const sheets = ss.getSheets();              // All sheets array
const sheet = sheets[0];                    // First sheet
const sheet = ss.getSheetByName('Sheet1');  // By name
const sheet = ss.getActiveSheet();          // Currently active
```

**Create sheet:**
```javascript
const newSheet = ss.insertSheet('New Sheet Name');
const newSheet = ss.insertSheet('Sheet', 0);  // Insert at position
```

**Sheet properties:**
```javascript
const name = sheet.getName();
const index = sheet.getIndex();
const id = sheet.getSheetId();
const rows = sheet.getMaxRows();
const cols = sheet.getMaxColumns();
```

**Delete sheet:**
```javascript
ss.deleteSheet(sheet);
```

**Rename sheet:**
```javascript
sheet.setName('New Name');
```

### Range Operations

**Get ranges:**
```javascript
const range = sheet.getRange('A1');                    // Single cell
const range = sheet.getRange('A1:D10');               // Named range
const range = sheet.getRange(1, 1);                   // Row 1, Col 1
const range = sheet.getRange(1, 1, 5, 3);            // 5 rows, 3 cols from (1,1)
const namedRange = ss.getRangeByName('MyRange');      // Named range
```

**Read values:**
```javascript
const value = range.getValue();                       // Single value
const values = range.getValues();                     // 2D array
const formulas = range.getFormulas();                 // Get formulas instead
const displayValues = range.getDisplayValues();       // Formatted display
const richValues = range.getRichTextValues();         // Rich text objects
```

**Write values:**
```javascript
range.setValue('New Value');                          // Single cell
range.setValues([['A1', 'B1'], ['A2', 'B2']]);      // 2D array
range.setFormula('=SUM(A1:A10)');                    // Formula
range.setFormulas([['=A1', '=B1']]);                 // Array of formulas
```

**Clear ranges:**
```javascript
range.clear();                          // Clear contents and formatting
range.clearContent();                   // Clear values only
range.clearFormat();                    // Clear formatting only
```

**Batch operations (faster):**
```javascript
// Get multiple ranges at once
const values = sheet.getRangeList(['A1', 'B1', 'C1']).getRanges()
  .map(r => r.getValue());

// Update multiple ranges
sheet.getRangeList(['A1', 'B1', 'C1']).setValue('New Value');
```

### Formatting Operations

**Text formatting:**
```javascript
range.setFontSize(12);
range.setFontWeight('bold');
range.setFontStyle('italic');
range.setFontColor('#ff0000');
range.setFontFamily('Arial');
```

**Number formatting:**
```javascript
range.setNumberFormat('0.00');           // 2 decimal places
range.setNumberFormat('$#,##0.00');      // Currency
range.setNumberFormat('0%');              // Percentage
range.setNumberFormat('mm/dd/yyyy');      // Date
range.setNumberFormat('h:mm AM/PM');      // Time
```

**Background color:**
```javascript
range.setBackground('#00ff00');
range.setBackgroundRGB(0, 255, 0);
```

**Borders:**
```javascript
range.setBorder(true, true, true, true, false, false);
// top, left, bottom, right, vertical, horizontal
```

**Alignment:**
```javascript
range.setHorizontalAlignment('center');      // left, center, right
range.setVerticalAlignment('middle');        // top, middle, bottom
range.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
```

**Row and column operations:**
```javascript
sheet.setRowHeight(2, 50);                   // Set row height
sheet.setColumnWidth(1, 100);                // Set column width
sheet.autoResizeRows(1, 5);                  // Auto-fit 5 rows
sheet.autoResizeColumns(1, 3);               // Auto-fit 3 columns
```

### Data Operations

**Insert rows/columns:**
```javascript
sheet.insertRows(1, 5);                      // Insert 5 rows at position 1
sheet.insertColumns(2, 3);                   // Insert 3 columns at position 2
```

**Delete rows/columns:**
```javascript
sheet.deleteRows(2, 5);                      // Delete 5 rows starting at row 2
sheet.deleteColumns(3, 2);                   // Delete 2 columns starting at column 3
```

**Move rows/columns:**
```javascript
sheet.moveRows(range, destinationIndex);
```

**Copy range:**
```javascript
const source = sheet.getRange('A1:C10');
source.copyTo(sheet.getRange('E1'));        // Copy to same sheet
source.copyTo(otherSheet.getRange('A1'));   // Copy to other sheet
```

**Append rows:**
```javascript
sheet.appendRow(['Value1', 'Value2', 'Value3']);
```

**Find and replace:**
```javascript
const range = sheet.getRange('A1:Z100');
range.createTextFinder('old text')
  .replaceAllWith('new text');
```

**Data validation:**
```javascript
const range = sheet.getRange('A1:A10');
const rule = SpreadsheetApp.newDataValidation()
  .requireNumberBetween(1, 100)
  .setAllowInvalid(false)
  .build();
range.setDataValidation(rule);
```

**Conditional formatting:**
```javascript
const range = sheet.getRange('A1:A10');
const rule = SpreadsheetApp.newConditionalFormatRule()
  .whenNumberGreaterThan(50)
  .setBackground('#00ff00')
  .setRanges([range])
  .build();
sheet.setConditionalFormatRules([rule]);
```

### Named Ranges

**Create named range:**
```javascript
const range = sheet.getRange('A1:C5');
ss.setNamedRange('MyRange', range);
```

**Get by name:**
```javascript
const range = ss.getRangeByName('MyRange');
```

**Remove named range:**
```javascript
ss.removeNamedRange('MyRange');
```

### Frozen Rows/Columns

**Freeze rows/columns:**
```javascript
sheet.setFrozenRows(1);                      // Freeze first row
sheet.setFrozenColumns(2);                   // Freeze first 2 columns
sheet.setFrozenRows(1);
sheet.setFrozenColumns(1);                   // Freeze row and column
```

**Unfreeze:**
```javascript
sheet.setFrozenRows(0);
sheet.setFrozenColumns(0);
```

### Filters

**Add filter:**
```javascript
const range = sheet.getRange('A1:D50');
range.createFilter();
```

**Get filter:**
```javascript
const filter = sheet.getFilter();
if (filter) {
  filter.remove();  // Remove filter
}
```

---

## DocumentApp

### Document Operations

**Create document:**
```javascript
const doc = DocumentApp.create('My Document');
const docId = doc.getId();
const body = doc.getBody();
```

**Open document:**
```javascript
const doc = DocumentApp.openById('DOCUMENT_ID');
const doc = DocumentApp.openByUrl('https://docs.google.com/document/d/DOCUMENT_ID/edit');
```

**Get active document (in bound script):**
```javascript
const doc = DocumentApp.getActiveDocument();
```

### Body Operations

**Append content:**
```javascript
const body = doc.getBody();
body.appendParagraph('Text content');
body.appendHeading1('Heading 1');
body.appendHeading2('Heading 2');
body.appendHeading3('Heading 3');
body.appendTable([['Cell 1', 'Cell 2'], ['Cell 3', 'Cell 4']]);
body.appendHorizontalRule();
body.appendPageBreak();
```

**Insert content at specific position:**
```javascript
const position = body.getChild(0);
body.insertParagraph(0, 'New first paragraph');
body.insertHeading1(0, 'New first heading');
```

**Text formatting:**
```javascript
const text = body.editAsText();
text.setFontSize(12);
text.setFontFamily('Arial');
text.setBold(0, 5, true);                    // Bold characters 0-5
text.setItalic(6, 10, true);
text.setForegroundColor(0, 10, '#ff0000');
```

**Paragraph formatting:**
```javascript
const paragraph = body.getParagraphs()[0];
paragraph.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
paragraph.setHeading(DocumentApp.ParagraphHeading.HEADING1);
paragraph.setIndentFirstLine(36);            // First line indent
paragraph.setIndentStart(18);                // Left indent
paragraph.setIndentEnd(18);                  // Right indent
paragraph.setSpacingBefore(12);
paragraph.setSpacingAfter(12);
paragraph.setLineSpacing(1.5);               // 1.5 line spacing
```

**Insert images:**
```javascript
const imageBlob = DriveApp.getFileById('FILE_ID').getBlob();
body.appendImage(imageBlob);
body.appendImage(imageBlob)
  .setWidth(200)
  .setHeight(150);
```

**Insert links:**
```javascript
// Whole paragraph
body.appendParagraph('Click here').setLinkUrl('https://example.com');

// Part of a paragraph (offsets are inclusive)
body.appendParagraph('Read the docs').editAsText().setLinkUrl(9, 12, 'https://example.com');
```

### Tables

**Append table:**
```javascript
const table = body.appendTable([
  ['Header 1', 'Header 2'],
  ['Row 1, Col 1', 'Row 1, Col 2'],
  ['Row 2, Col 1', 'Row 2, Col 2']
]);
```

**Modify tables:**
```javascript
const table = body.getTables()[0];
table.appendTableRow(['New Cell 1', 'New Cell 2']);
table.deleteRow(0);                          // Delete first row
const cell = table.getRow(0).getCell(0);
cell.setText('New content');
```

### Document Properties

**Get/set title:**
```javascript
const title = doc.getName();
doc.setName('New Title');
```

**Document ID:**
```javascript
const docId = doc.getId();
const url = doc.getUrl();
```

**Body margins:**
```javascript
const body = doc.getBody();
body.setMarginTop(72);          // 1 inch in points
body.setMarginBottom(72);
body.setMarginLeft(72);
body.setMarginRight(72);
```

**Page size:**
```javascript
body.setPageHeight(792);        // 11 inches, in points
body.setPageWidth(612);         // 8.5 inches
```

### Finding and Replacing

**Find text:**
```javascript
const body = doc.getBody();
const element = body.findText('search term');
```

**Replace text:**
```javascript
body.replaceText('old', 'new');
```

---

## GmailApp and MailApp

### Sending Email (MailApp)

MailApp only sends, so it needs the narrower `script.send_mail` scope. Use GmailApp when the script also reads, searches, labels or drafts mail - it sends too (`GmailApp.sendEmail`, `thread.reply`).

**Basic email:**
```javascript
MailApp.sendEmail('recipient@example.com', 'Subject', 'Message body');
```

**Email with options:**
```javascript
MailApp.sendEmail(
  'recipient@example.com',
  'Subject',
  'Message body',
  {
    name: 'Sender Name',
    replyTo: 'reply@example.com',
    attachments: [blob1, blob2],
    cc: 'cc@example.com',
    bcc: 'bcc@example.com',
    inlineImages: { imageName: imageBlob }
  }
);
```

**HTML email:**
```javascript
MailApp.sendEmail(
  'recipient@example.com',
  'Subject',
  '',
  {
    htmlBody: '<h1>Hello</h1><p>This is HTML content</p>',
    name: 'My Script'
  }
);
```

**Email with attachments:**
```javascript
const file = DriveApp.getFileById('FILE_ID');
MailApp.sendEmail('recipient@example.com', 'Subject', 'See attachment', {
  attachments: [file.getAs(MimeType.PDF)]
});
```

### GmailApp (Reading, Labels, Drafts)

**Search emails:**
```javascript
const threads = GmailApp.search('is:unread from:sender@example.com');
threads.forEach(thread => {
  Logger.log(thread.getFirstMessageSubject());
});
```

**Get threads:**
```javascript
const unreadThreads = GmailApp.getInboxUnreadCount();
const threads = GmailApp.getInboxThreads(0, 10);  // Get first 10
```

**Read messages:**
```javascript
const thread = threads[0];
const messages = thread.getMessages();
messages.forEach(message => {
  Logger.log(message.getSubject());
  Logger.log(message.getFrom());
  Logger.log(message.getPlainBody());
  Logger.log(message.getHtmlBody());
});
```

**Label operations:**
```javascript
const label = GmailApp.getUserLabelByName('MyLabel');  // null if it doesn't exist
const threads = label.getThreads();

// Add label
const thread = GmailApp.getInboxThreads()[0];
const newLabel = GmailApp.getUserLabelByName('Archive') || GmailApp.createLabel('Archive');
thread.addLabel(newLabel);

// Remove label
thread.removeLabel(newLabel);
```

**Mark as read:**
```javascript
thread.markRead();
thread.markUnread();
```

**Star/unstar:**
```javascript
thread.star();
thread.unstar();
```

**Archive:**
```javascript
thread.moveToArchive();
```

**Delete:**
```javascript
thread.moveToTrash();
```

---

## DriveApp

### File Operations

**Create file:**
```javascript
const blob = Utilities.newBlob('Content', 'text/plain', 'file.txt');
const file = DriveApp.createFile(blob);
const fileId = file.getId();
```

**Open file:**
```javascript
const file = DriveApp.getFileById('FILE_ID');
const files = DriveApp.getFilesByName('filename.txt');  // Iterator - names are not unique
```

**File properties:**
```javascript
const name = file.getName();
const id = file.getId();
const url = file.getUrl();
const mimeType = file.getMimeType();
const size = file.getSize();
const owner = file.getOwner().getEmail();
const lastUpdated = file.getLastUpdated();
const description = file.getDescription();
```

**Copy file:**
```javascript
const copy = file.makeCopy('Copy Name');
```

**Move file:**
```javascript
const folder = DriveApp.getFolderById('FOLDER_ID');
file.moveTo(folder);
```

**Rename file:**
```javascript
file.setName('New Name');
```

**Delete file:**
```javascript
file.setTrashed(true);  // Move to trash
DriveApp.getFileById('FILE_ID').setTrashed(true);
```

**Download file:**
```javascript
const blob = file.getBlob();
const content = blob.getDataAsString();
```

**Convert to different format:**
```javascript
const csvBlob = file.getAs(MimeType.CSV);
const pdfBlob = file.getAs(MimeType.PDF);
```

### Folder Operations

**Create folder:**
```javascript
const folder = DriveApp.createFolder('New Folder');
const folderId = folder.getId();
```

**Open folder:**
```javascript
const folder = DriveApp.getFolderById('FOLDER_ID');
const root = DriveApp.getRootFolder();
```

**List contents:**
```javascript
const files = folder.getFiles();
while (files.hasNext()) {
  const file = files.next();
  Logger.log(file.getName());
}

const subfolders = folder.getFolders();
```

**Get files by name:**
```javascript
const files = folder.getFilesByName('filename.txt');
while (files.hasNext()) {
  const file = files.next();
  Logger.log(file.getId());
}
```

**Copy folder (recursive):**
```javascript
function copyFolder(sourceFolder, targetFolder) {
  // Copy files
  const files = sourceFolder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    file.makeCopy(file.getName(), targetFolder);
  }
  
  // Copy subfolders
  const folders = sourceFolder.getFolders();
  while (folders.hasNext()) {
    const subfolder = folders.next();
    const newFolder = targetFolder.createFolder(subfolder.getName());
    copyFolder(subfolder, newFolder);
  }
}
```

### Sharing

**Share with users:**
```javascript
file.addEditor('user@example.com');
file.addViewer('viewer@example.com');
file.addCommenter('commenter@example.com');
file.removeEditor('user@example.com');
file.removeViewer('user@example.com');
```

**Get editors:**
```javascript
const editors = file.getEditors();
editors.forEach(user => {
  Logger.log(user.getEmail());
});
```

**Get viewers:**
```javascript
const viewers = file.getViewers();
```

**Link sharing:**
```javascript
file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);  // Anyone with the link
file.setSharing(DriveApp.Access.DOMAIN_WITH_LINK, DriveApp.Permission.VIEW);  // Your Workspace domain
```

### Search

**Search files/folders:**
```javascript
const files = DriveApp.searchFiles("title = 'filename'");
const files = DriveApp.searchFiles("trashed = false and mimeType != 'application/vnd.google-apps.folder'");
const files = DriveApp.searchFiles("'FOLDER_ID' in parents and trashed = false");
```

---

## CalendarApp

### Calendar Operations

**Get calendars:**
```javascript
const calendar = CalendarApp.getDefaultCalendar();
const calendar = CalendarApp.getCalendarById('CALENDAR_ID');
const calendars = CalendarApp.getAllCalendars();
```

**Calendar properties:**
```javascript
const name = calendar.getName();
const id = calendar.getId();
const color = calendar.getColor();
const description = calendar.getDescription();
const timeZone = calendar.getTimeZone();
```

### Event Operations

**Create event:**
```javascript
const startTime = new Date();
startTime.setDate(startTime.getDate() + 1);       // Tomorrow
startTime.setHours(9, 0, 0, 0);                   // 9 AM, script time zone
const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);  // 1 hour later
const event = calendar.createEvent('Meeting', startTime, endTime);
```

**All-day event:**
```javascript
const event = calendar.createAllDayEvent('All-Day Event', startTime);
```

**Event with multiple days:**
```javascript
// End date is exclusive: this spans three days
const endDate = new Date(startTime.getTime() + 3 * 24 * 60 * 60 * 1000);
const event = calendar.createAllDayEvent('Multi-day Event', startTime, endDate);
```

**Recurring events:**
```javascript
const recurrence = CalendarApp.newRecurrence()
  .addDailyRule()
  .addCount(10);                      // Repeat 10 times
const event = calendar.createEventSeries('Daily Meeting', startTime, endTime, recurrence);

// Weekly
const recurrence = CalendarApp.newRecurrence()
  .addWeeklyRule()
  .addDayOfWeek(CalendarApp.Weekday.MONDAY)
  .addDayOfWeek(CalendarApp.Weekday.WEDNESDAY)
  .addDayOfWeek(CalendarApp.Weekday.FRIDAY);

// Monthly
const recurrence = CalendarApp.newRecurrence()
  .addMonthlyRule()
  .addDayOfMonth(15);                 // 15th of each month

// Every other week
const recurrence = CalendarApp.newRecurrence()
  .addWeeklyRule()
  .setInterval(2);                    // Every 2 weeks
```

**Get events:**
```javascript
// Next 7 days
const now = new Date();
const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
const events = calendar.getEvents(now, weekAhead);

const event = calendar.getEventById('EVENT_ID');
```

### Event Details

**Event properties:**
```javascript
const title = event.getTitle();
const description = event.getDescription();
const location = event.getLocation();
const startTime = event.getStartTime();
const endTime = event.getEndTime();
const color = event.getColor();
const id = event.getId();
```

**Modify event:**
```javascript
event.setTitle('New Title');
event.setDescription('Event description');
event.setLocation('Meeting Room 123');
event.setTime(newStart, newEnd);
event.setColor(CalendarApp.EventColor.RED);  // Enum, not a hex colour
```

**Add guests:**
```javascript
event.addGuest('guest@example.com');
event.removeGuest('guest@example.com');
const guests = event.getGuests();
guests.forEach(guest => {
  Logger.log(guest.getEmail());
});
```

**Add reminders:**
```javascript
event.addPopupNotification(15);         // 15 minutes before
event.addEmailNotification(24 * 60);    // 24 hours before
event.removeAllReminders();
```

**Tags (custom metadata):**
```javascript
event.setTag('customKey', 'customValue');
const value = event.getTag('customKey');
const keys = event.getAllTags();
event.deleteTag('customKey');
```

**Delete event:**
```javascript
event.deleteEvent();
```

---

## Triggers

### Simple Triggers (No Authorization Needed)

**onOpen(e)** - Runs when document/sheet opens:
```javascript
function onOpen(e) {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Menu')
    .addItem('Item 1', 'functionName1')
    .addItem('Item 2', 'functionName2')
    .addToUi();
}
```

**onEdit(e)** - Runs when cell value changes:
```javascript
function onEdit(e) {
  const range = e.range;
  const value = e.value;
  const sheet = e.source.getSheets()[0];
  
  Logger.log('Cell ' + range.getA1Notation() + ' changed to ' + value);
}
```

**onInstall(e)** - Runs when add-on installed:
```javascript
function onInstall(e) {
  onOpen(e);  // Typically calls onOpen
}
```

### Installable Triggers (Require Authorization)

**Time-based triggers:**
```javascript
function createTimeTriggers() {
  // Every 6 hours
  ScriptApp.newTrigger('myFunction')
    .timeBased()
    .everyHours(6)
    .create();
  
  // Every day at 9 AM (randomized within the hour)
  ScriptApp.newTrigger('myFunction')
    .timeBased()
    .atHour(9)
    .everyDays(1)
    .create();
  
  // Every Monday at 9 AM
  ScriptApp.newTrigger('myFunction')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(9)
    .create();
  
  // Every minute (use sparingly!)
  ScriptApp.newTrigger('myFunction')
    .timeBased()
    .everyMinutes(1)
    .create();
}
```

**Event-based triggers:**
```javascript
function createEventTriggers() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // On any change in spreadsheet (structure as well as values)
  ScriptApp.newTrigger('myFunction')
    .forSpreadsheet(spreadsheet)
    .onChange()
    .create();
  
  // On form submit
  const form = FormApp.openById('FORM_ID');
  ScriptApp.newTrigger('onFormSubmit')
    .forForm(form)
    .onFormSubmit()
    .create();
  
  // On edit in spreadsheet
  ScriptApp.newTrigger('onEdit')
    .forSpreadsheet(spreadsheet)
    .onEdit()
    .create();
}
```

**Delete triggers:**
```javascript
// Delete all triggers for a function
const triggers = ScriptApp.getProjectTriggers();
triggers.forEach(trigger => {
  if (trigger.getHandlerFunction() === 'functionName') {
    ScriptApp.deleteTrigger(trigger);
  }
});
```

**Get all triggers:**
```javascript
const triggers = ScriptApp.getProjectTriggers();
triggers.forEach(trigger => {
  Logger.log('Function: ' + trigger.getHandlerFunction());
  Logger.log('Type: ' + trigger.getTriggerSource());
});
```

---

## Advanced Services and Utilities

### UrlFetchApp (HTTP Requests)

**GET request:**
```javascript
const response = UrlFetchApp.fetch('https://api.example.com/data');
const content = response.getContentText();
const json = JSON.parse(content);
const statusCode = response.getResponseCode();
```

**POST request:**
```javascript
const payload = {
  key1: 'value1',
  key2: 'value2'
};

const options = {
  method: 'POST',
  payload: JSON.stringify(payload),
  headers: {
    'Content-Type': 'application/json'
  }
};

const response = UrlFetchApp.fetch('https://api.example.com/submit', options);
```

**Authentication headers:**
```javascript
const options = {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + TOKEN,
    'Accept': 'application/json'
  }
};

const response = UrlFetchApp.fetch('https://api.example.com/protected', options);
```

**Non-2xx handling** (UrlFetchApp has no timeout option; a slow call counts against the 6-minute execution limit):
```javascript
const options = {
  method: 'GET',
  muteHttpExceptions: true  // Return 4xx/5xx responses instead of throwing
};

try {
  const response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() === 200) {
    Logger.log(response.getContentText());
  } else {
    Logger.log('Error: ' + response.getResponseCode());
  }
} catch (error) {
  Logger.log('Request failed: ' + error);
}
```

### Utilities

**Base64 encoding:**
```javascript
const text = 'Hello World';
const encoded = Utilities.base64Encode(text);
const decoded = Utilities.newBlob(Utilities.base64Decode(encoded)).getDataAsString();
```

**Hashing:**
```javascript
const text = 'password';
const hash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text);
const hashString = Utilities.base64Encode(hash);
```

**MD5:**
```javascript
const md5 = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, text);
```

**UUID generation:**
```javascript
const uuid = Utilities.getUuid();  // Generate unique ID
```

**URL encoding** (Utilities has no URL encoder; use the JavaScript built-in):
```javascript
const encoded = encodeURIComponent('Hello@World!');
```

### PropertiesService (Persistent Storage)

**Script properties (global):**
```javascript
const scriptProperties = PropertiesService.getScriptProperties();

// Set
scriptProperties.setProperty('key', 'value');
scriptProperties.setProperties({ key1: 'value1', key2: 'value2' });

// Get
const value = scriptProperties.getProperty('key');
const allProperties = scriptProperties.getProperties();

// Delete
scriptProperties.deleteProperty('key');
scriptProperties.deleteAllProperties();
```

**Document properties:**
```javascript
const documentProperties = PropertiesService.getDocumentProperties();
// Same methods as script properties
```

**User properties:**
```javascript
const userProperties = PropertiesService.getUserProperties();
// Separate storage per user
```

### CacheService (Temporary Storage)

**Script cache:**
```javascript
const cache = CacheService.getScriptCache();

// Set (seconds; default 600, max 21600 = 6 hours; value max 100 KB)
cache.put('key', 'value', 600);

// Get
const value = cache.get('key');

// Remove
cache.remove('key');
cache.removeAll(['key1', 'key2']);
```

**Difference from Properties:**
```
PropertiesService: Persistent; 9 KB per value, 500 KB per property store
CacheService: Temporary (10 min default, 6 h max), may be evicted early, faster access
```

### Logger (Debugging)

**Log messages:**
```javascript
Logger.log('Simple message');
Logger.log('Value: ' + value);
Logger.log('Object: ' + JSON.stringify(object));

// View logs: Executions panel, or the log pane after a run from the editor
```

**Log levels** (`console` writes to Cloud Logging with a severity; `Logger` does not):
```javascript
console.info('Info');
console.warn('Warning');
console.error('Error');
```

---

## Authorisation

### OAuth Scopes

**Common scopes:**
```javascript
// Spreadsheets
https://www.googleapis.com/auth/spreadsheets
https://www.googleapis.com/auth/spreadsheets.readonly
https://www.googleapis.com/auth/spreadsheets.currentonly

// Drive
https://www.googleapis.com/auth/drive
https://www.googleapis.com/auth/drive.readonly
https://www.googleapis.com/auth/drive.file

// Gmail
https://www.googleapis.com/auth/gmail.readonly
https://www.googleapis.com/auth/gmail.modify
https://www.googleapis.com/auth/gmail.send

// Calendar
https://www.googleapis.com/auth/calendar
https://www.googleapis.com/auth/calendar.readonly

// Documents
https://www.googleapis.com/auth/documents
https://www.googleapis.com/auth/documents.readonly

// Forms
https://www.googleapis.com/auth/forms.currentonly
https://www.googleapis.com/auth/forms

// External requests
https://www.googleapis.com/auth/script.external_request

// Email sending
https://www.googleapis.com/auth/script.send_mail
```

### Setting Scopes Manually (appsscript.json)

**Manifest file:**
```json
{
  "timeZone": "America/New_York",
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets.currentonly",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/script.send_mail"
  ]
}
```

**Best practice: Always use narrowest necessary scopes**

### Authorization Flow

**Check authorization:**
```javascript
const info = ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL);
const needsAuth = info.getAuthorizationStatus() === ScriptApp.AuthorizationStatus.REQUIRED;
const authUrl = info.getAuthorizationUrl();  // Send the user here when needsAuth
```

**Request authorization:**
```javascript
// For specific scopes
ScriptApp.requireScopes(
  ScriptApp.AuthMode.FULL,
  ['https://www.googleapis.com/auth/script.send_mail']
);

// For all scopes
ScriptApp.requireAllScopes(ScriptApp.AuthMode.FULL);
```

---

## Error Handling and Debugging

### Try-Catch-Finally

**Basic error handling:**
```javascript
try {
  // Code that might fail
  const range = sheet.getRange('A1');
  range.getValue();
} catch (error) {
  Logger.log('Error: ' + error);
  // Handle error
} finally {
  // Always runs
  Logger.log('Completed');
}
```

**Error object properties:**
```javascript
try {
  // Code
} catch (error) {
  Logger.log('Message: ' + error.message);
  Logger.log('Stack: ' + error.stack);
  Logger.log('Name: ' + error.name);
}
```

**Throwing errors:**
```javascript
function validateInput(value) {
  if (!value) {
    throw new Error('Value cannot be empty');
  }
  if (value < 0) {
    throw new Error('Value must be positive');
  }
}
```

### Debugging Techniques

**Logging:**
```javascript
Logger.log('Debug message');
Logger.log(JSON.stringify(object, null, 2));
Logger.log('Value at step 1: ' + variable);
```

**Browser alerts (UI):**
```javascript
const ui = SpreadsheetApp.getUi();
ui.alert('Error occurred: ' + error.message);
ui.showModelessDialog(
  HtmlService.createHtmlOutput('Content'),
  'Dialog Title'
);
```

**Conditional logging:**
```javascript
const DEBUG = true;

if (DEBUG) {
  Logger.log('Debug info');
}
```

**Using debugger:**
1. Add breakpoints in editor (click line number)
2. Run function
3. Execution pauses at breakpoint
4. Inspect variables in sidebar

---

## Performance

### Spreadsheet Operations

**Batch reads/writes:**
```javascript
// SLOW - Individual cell access
for (let i = 1; i <= 100; i++) {
  for (let j = 1; j <= 10; j++) {
    const range = sheet.getRange(i, j);
    const value = range.getValue();
  }
}

// FAST - Batch read
const range = sheet.getRange(1, 1, 100, 10);
const values = range.getValues();
for (let i = 0; i < values.length; i++) {
  for (let j = 0; j < values[i].length; j++) {
    const value = values[i][j];
  }
}
```

**Caching frequently accessed data:**
```javascript
function getFastData() {
  const cache = CacheService.getScriptCache();
  let data = cache.get('myData');
  
  if (!data) {
    // Fetch from sheet
    const range = sheet.getRange('A1:C100');
    data = JSON.stringify(range.getValues());
    cache.put('myData', data, 600);  // 10 minutes
  }
  
  return JSON.parse(data);
}
```

**Properties vs Cache:**
- Properties: Persistent, use for config
- Cache: Fast, temporary, use for session data

---

## Patterns

### Error-Resistant Script Template

```javascript
/**
 * Main function with error handling
 */
function main() {
  try {
    validateSetup();
    const data = fetchData();
    processData(data);
    Logger.log('Completed successfully');
  } catch (error) {
    handleError(error);
  }
}

/**
 * Validates script setup
 */
function validateSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error('No active spreadsheet');
  }
}

/**
 * Fetch data with retry logic
 */
function fetchData(maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = UrlFetchApp.fetch('https://api.example.com/data');
      return JSON.parse(response.getContentText());
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      Utilities.sleep(Math.pow(2, attempt) * 1000);
    }
  }
}

/**
 * Process and error handling
 */
function processData(data) {
  if (!data || data.length === 0) {
    throw new Error('No data to process');
  }
  // Process...
}

/**
 * Centralized error handling
 */
function handleError(error) {
  const errorMessage = 'Script error: ' + error.message;
  Logger.log(errorMessage);
  
  // Notify user
  const ui = SpreadsheetApp.getUi();
  ui.alert(errorMessage);
  
  // Log to sheet for audit trail
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Logs');
  if (sheet) {
    sheet.appendRow([new Date(), error.message, error.stack]);
  }
}
```

### Factory Functions Pattern

```javascript
function createSpreadsheetManager(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  
  return {
    appendRow: function(values) {
      sheet.appendRow(values);
    },
    
    getRange: function(notation) {
      return sheet.getRange(notation);
    },
    
    getData: function() {
      return sheet.getDataRange().getValues();
    }
  };
}

// Usage
const manager = createSpreadsheetManager('Data');
manager.appendRow(['Value1', 'Value2']);
```

### Quota and Rate Limiting

```javascript
/**
 * Respects Google APIs rate limits
 */
function respectRateLimits(items, batchSize = 100) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    processBatch(batch);
    
    // Don't sleep on last batch
    if (i + batchSize < items.length) {
      Utilities.sleep(1000);  // 1 second between batches
    }
  }
}
```

---

## Quotas and Limits

From https://developers.google.com/apps-script/guides/services/quotas - Google changes these without notice, so check there when a design depends on one.

| Limit | Consumer (gmail.com) | Google Workspace |
|-------|----------------------|------------------|
| Script runtime | 6 min / execution | 6 min / execution |
| Custom function runtime | 30 s / execution | 30 s / execution |
| Triggers total runtime | 90 min / day | 6 h / day |
| Simultaneous executions | 30 / user | 30 / user |
| Triggers | 20 / user / script | 20 / user / script |
| Email recipients | 100 / day | 1,500 / day |
| URL Fetch calls | 20,000 / day | 100,000 / day |
| Properties read/write | 50,000 / day | 500,000 / day |
| Properties value size | 9 KB / value | 9 KB / value |
| Properties total storage | 500 KB / store | 500 KB / store |
| Cache | 100 KB / value, 1,000 items, 6 h max | same |
| Spreadsheet size | 10 million cells | 10 million cells |