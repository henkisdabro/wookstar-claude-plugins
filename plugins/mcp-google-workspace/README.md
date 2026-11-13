# MCP Google Workspace

Gmail, Drive and Calendar via [workspace-mcp](https://github.com/taylorwilsdon/google_workspace_mcp).

## What it can do

Thirty-eight tools for Gmail, Drive and Calendar. Many **act as you**: sending and drafting mail, changing labels and filters, creating, sharing and updating Drive files, and creating or changing calendar events, out-of-office and focus time.

Review any call that sends mail, shares a file or changes an event before approving it.

Try: *"Find last week's emails from the accountant and summarise what they need from me."* or *"Create a calendar event for Friday 10am and draft the invite email."*

The upstream server also covers Docs, Sheets, Slides, Forms, Tasks, Chat, Contacts and Apps Script - about 120 tools in all. This plugin loads only Gmail, Drive and Calendar to keep the tool list small; before 3.0.0 it loaded everything. To use the other services, add the server yourself with the services you want, for example `claude mcp add google-workspace -- uvx workspace-mcp --tools gmail drive calendar docs sheets`, and see the [upstream README](https://github.com/taylorwilsdon/google_workspace_mcp) for its options.

If you only need to read Gmail, Calendar or Drive, Claude's built-in Google connectors need no OAuth client.

## Installation

```bash
/plugin install mcp-google-workspace@wookstar-claude-plugins
```

On Claude Code 2.1.275 or later, in one step without adding the marketplace first: `/plugin install mcp-google-workspace --marketplace henkisdabro/wookstar-claude-plugins`

Claude Code prompts for your Google OAuth client ID and secret when you enable the plugin; the secret goes to your system keychain. Create a Desktop-app OAuth client in Google Cloud Console and enable the APIs you need.

Since 2.0.0 the `GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_SECRET` shell variables are no longer read - enter them at the prompt instead.

`OAUTHLIB_INSECURE_TRANSPORT=1` is set because the server's OAuth callback listens on plain-HTTP `localhost`, as the upstream docs specify. Traffic to Google itself stays on HTTPS.
