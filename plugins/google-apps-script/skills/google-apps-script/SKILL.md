---
name: google-apps-script
description: Google Apps Script development for automating Google Workspace - Sheets, Docs, Gmail, Drive, Calendar and Forms - with built-in services, triggers and the appsscript.json manifest. Use when writing or fixing a .gs file, automating a Google Sheet, sending or processing Gmail from a script, setting up time-based or on-edit triggers, writing a custom spreadsheet function, calling an external API with UrlFetchApp, or scoping OAuth in appsscript.json. Do NOT use for Google Ads scripts - use google-ads-scripts. Do NOT use for Node.js, Cloud Functions, Cloud Run or REST clients of the Workspace APIs - those use different APIs and quotas.
---

# Google Apps Script

Server-side JavaScript that runs on Google's infrastructure with built-in, auto-authorised services for Workspace. V8 is the only runtime: Rhino was shut down on 31 January 2026, so write modern JavaScript (`const`/`let`, arrow functions, classes, template literals, destructuring) and set `"runtimeVersion": "V8"` in `appsscript.json` if a legacy manifest still says `DEPRECATED_ES5`.

## Steps

1. **Pick the binding and entry point.** Container-bound scripts (opened from a Sheet, Doc or Form) can use `getActiveSpreadsheet()` / `getActiveDocument()` and simple triggers (`onOpen`, `onEdit`). Standalone scripts and anything run from a time trigger must open files by ID or URL. Done when every file access in the plan uses a call that works in the chosen binding.

2. **Write against the service, batching I/O.** Read a whole range with `getValues()`, transform in memory, write back once with `setValues()`. Cache expensive lookups with CacheService and persist config or cursors with PropertiesService. Done when no `getValue`/`setValue`/`appendRow` sits inside a loop over rows.

3. **Fit the 6-minute limit.** Each execution stops at 6 minutes (custom functions at 30 seconds). For larger jobs, process a slice, save a cursor in PropertiesService, and let a time trigger pick up the next slice. Done when the worst-case run is bounded by a batch size, not the data size.

4. **Set triggers idempotently.** Before `ScriptApp.newTrigger(...)`, delete existing triggers for the same handler so re-running setup never duplicates them. Done when running the setup function twice leaves one trigger per handler.

5. **Narrow the scopes.** List `oauthScopes` explicitly in `appsscript.json`, preferring `spreadsheets.currentonly`, `drive.file` and `script.send_mail` over their broad counterparts. Done when every scope in the manifest maps to a call the script makes.

6. **Handle failure visibly.** Wrap trigger handlers in try/catch, log with `console.error` (it reaches Cloud Logging with severity), and notify by email or an error sheet - a failed time trigger is otherwise silent. Done when every trigger handler has a catch that records the error somewhere a human will see it.

## Quick start

```javascript
function generateWeeklyReport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rows = ss.getSheetByName('Data').getRange('A2:C').getValues()
    .filter(row => row[0]);

  const summary = ss.getSheetByName('Summary') || ss.insertSheet('Summary');
  summary.clear();
  const out = [['Name', 'Value', 'Status'], ...rows];
  summary.getRange(1, 1, out.length, out[0].length).setValues(out);

  MailApp.sendEmail({
    to: Session.getEffectiveUser().getEmail(),
    subject: 'Weekly report generated',
    body: `Report generated with ${rows.length} records.`
  });
}
```

## Gotchas

- **Retired services.** ContactsApp (shut down 31 Jan 2025) - use the People advanced service. Classic Sites service (shut down 24 Sep 2024), UiApp (2019) and DocsList (2015) are gone - use HtmlService for UI and DriveApp for files. Google keeps the list at https://developers.google.com/apps-script/guides/support/sunset.
- **GmailApp vs MailApp.** Both send. MailApp is send-only and needs the narrower `script.send_mail` scope; reach for GmailApp when the script also reads, searches, labels or drafts.
- **CacheService** defaults to 10 minutes, caps at 6 hours and 100 KB per value, and can evict early - always handle a miss.
- **Simple triggers** (`onOpen`, `onEdit`) run without authorisation, so they cannot send mail or open other files; use an installable trigger for that.
- **Quotas differ by account.** Email recipients are 100/day on consumer accounts and 1,500/day on Workspace; trigger runtime is 90 min/day vs 6 h/day.
- **Local development** with clasp: `.clasp.json` holds the `scriptId` and `rootDir`; `clasp push` uploads `.js`/`.gs` and `appsscript.json`.

## Validation

`scripts/validators.py` checks spreadsheet IDs, A1 notation (including open-ended ranges like `A2:D`), sheet names, cell values and the 10-million-cell limit before you hard-code them. Run with `python3 scripts/validators.py` for a self-test, or import its functions.

## References

- [references/apps-script-api-reference.md](references/apps-script-api-reference.md) - read when you need a service's method signatures (SpreadsheetApp, DocumentApp, GmailApp, DriveApp, CalendarApp, ScriptApp, UrlFetchApp, Utilities), OAuth scopes, or the full quota table.
- [references/examples.md](references/examples.md) - read when building a report, Gmail auto-responder, document-from-template or daily trigger from scratch.
- [references/best-practices.md](references/best-practices.md) - read when reviewing an existing script for batching, caching, error handling or scope problems.
- [references/patterns.md](references/patterns.md) - read when adding data validation dropdowns, retry with backoff, or form-submit processing.
- `assets/spreadsheet-automation-template.js` and `assets/trigger-setup-template.js` - copy as a starting point for a new Sheets automation or trigger manager.
