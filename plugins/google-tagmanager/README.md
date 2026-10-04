# Google Tag Manager

Google Tag Manager reference for Claude Code, covering container setup, tags, triggers, variables, the data layer, Consent Mode, debugging, custom templates, server-side containers and API automation.

## What's Included

### Skills (1)

- **google-tagmanager** - GTM implementation reference for web and server containers

### MCP Servers (1)

- **gtm-mcp-server** - Remote GTM API server at `https://gtm-mcp.stape.ai/mcp`, connected over HTTP. It is run by [Stape](https://stape.io/helpdesk/documentation/how-to-set-up-mcp-server-for-gtm), a third party - not Google ([source](https://github.com/stape-io/google-tag-manager-mcp-server)).

### Authentication

The first time the server is used, run `/mcp` in Claude Code, select `gtm-mcp-server` and complete the Google OAuth sign-in in your browser. Claude Code stores and refreshes the token; no local package or `mcp-remote` bridge is needed.

### Review before approving

The server's tools can write to your containers: create, update and delete tags, triggers, variables, folders, templates, environments and user permissions, and create and **publish** container versions. Publishing changes what runs on a live site. Review each delete, permission or publish call - the container, workspace and entities it targets - before approving it.

## Installation

```bash
/plugin install google-tagmanager@wookstar-claude-plugins
```

## Coverage

- **Container setup** - Creating and configuring GTM containers
- **Consent Mode v2** - CMP templates, Consent Initialization trigger, consent checks
- **Server-side tagging** - Tagging server hosting, first-party domain, clients, GA4 server tag
- **Tags** - GA4, Google Ads, Facebook Pixel, custom HTML
- **Triggers** - Page views, clicks, form submissions, custom events
- **Variables** - Data layer, DOM elements, custom JavaScript
- **Data layer** - E-commerce tracking, custom event implementation
- **Debugging** - Preview mode, Tag Assistant, error handling
- **Custom templates** - Sandboxed JavaScript, community templates
- **API automation** - GTM REST API for programmatic management

## Usage Examples

```bash
# Implementation
"Set up GTM for my React application"

# E-commerce tracking
"Implement data layer for product page views and add-to-cart events"

# Debugging
"My form submission tag isn't firing, help me debug"

# Custom templates
"Create a custom GTM template for a third-party pixel"
```

## Reference Materials

The skill includes 10 reference files, listed in a table at the end of SKILL.md.
