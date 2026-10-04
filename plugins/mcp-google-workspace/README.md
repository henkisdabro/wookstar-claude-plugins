# MCP Google Workspace

Gmail, Drive, Calendar and other Google Workspace services via [workspace-mcp](https://github.com/taylorwilsdon/google_workspace_mcp).

## Installation

```bash
/plugin install mcp-google-workspace@wookstar-claude-plugins
```

Claude Code prompts for your Google OAuth client ID and secret when you enable the plugin; the secret goes to your system keychain. Create a Desktop-app OAuth client in Google Cloud Console and enable the APIs you need.

Since 2.0.0 the `GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_SECRET` shell variables are no longer read - enter them at the prompt instead.

`OAUTHLIB_INSECURE_TRANSPORT=1` is set because the server's OAuth callback listens on plain-HTTP `localhost`, as the upstream docs specify. Traffic to Google itself stays on HTTPS.
