# Google Apps Script

A Claude Code skill for writing Google Apps Script that automates Google Workspace: Sheets, Docs, Gmail, Drive, Calendar and Forms.

## What's Included

### Skills (1)

- **google-apps-script** - a six-step workflow (binding, batched I/O, the 6-minute limit, idempotent triggers, narrow scopes, visible failure), plus a service reference, examples, templates and a Python validator for IDs and A1 notation

## Installation

```bash
/plugin install google-apps-script@wookstar-claude-plugins
```

## Coverage

- **Built-in services** - SpreadsheetApp, DocumentApp, GmailApp, MailApp, DriveApp, CalendarApp, FormApp
- **Triggers** - simple and installable, time-based and event-based
- **Storage** - PropertiesService and CacheService, with their real limits
- **HTTP** - UrlFetchApp for external APIs
- **Authorisation** - OAuth scopes in `appsscript.json`
- **Runtime** - V8 only (Rhino was shut down on 31 January 2026); retired services such as ContactsApp and classic Sites are flagged with their replacements
- **Quotas** - consumer vs Workspace limits from Google's quota page

## Usage Examples

```bash
"Write an Apps Script to send weekly reports from a Google Sheet"
"Create a script that auto-labels incoming emails by sender domain"
"Write code to create calendar events from spreadsheet data"
```
