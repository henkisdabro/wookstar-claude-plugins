# MCP Google Tag Manager

Remote GTM API server at `https://gtm-mcp.stape.ai/mcp`, connected over HTTP. It is run by [Stape](https://stape.io/helpdesk/documentation/how-to-set-up-mcp-server-for-gtm), a third party - not Google ([source](https://github.com/stape-io/google-tag-manager-mcp-server)).

## What it can do

It reads and **writes** your containers: create, update and delete tags, triggers, variables, folders, templates, environments and user permissions, and create and **publish** container versions. Publishing changes what runs on a live site.

Review each delete, permission or publish call - the container, workspace and entities it targets - before approving it.

Try: *"Audit this container for tags that fire without a consent check."*

It pairs with the `google-tagmanager` plugin, whose skill says how to work on a container safely. That plugin does not need this one: it also works with the `gtm` command-line tool from owntag, which keeps container access on your machine.

## Installation

```bash
/plugin install mcp-google-tagmanager@wookstar-claude-plugins
```

On Claude Code 2.1.275 or later, in one step without adding the marketplace first: `/plugin install mcp-google-tagmanager --marketplace henkisdabro/wookstar-claude-plugins`

## Authentication

The first time the server is used, run `/mcp` in Claude Code, select `gtm-mcp-server` and complete the Google OAuth sign-in in your browser. Claude Code stores and refreshes the token.

Before 3.0.0 of `google-tagmanager` this server was bundled with that plugin. You sign in again after installing this one.
