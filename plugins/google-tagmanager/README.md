# Google Tag Manager

Guardrails for working on Google Tag Manager with Claude Code. It does not re-teach GTM - current models know the basics. It pins down the vocabulary models blur, lists the mistakes they typically make, and covers what changed recently enough that a model's training is likely wrong, then links to Google's own docs for the rest.

## What's Included

### Skills (1)

- **google-tagmanager** - GTM guardrails for web and server containers

### MCP Servers (1)

- **gtm-mcp-server** - Remote GTM API server at `https://gtm-mcp.stape.ai/mcp`, connected over HTTP. It is run by [Stape](https://stape.io/helpdesk/documentation/how-to-set-up-mcp-server-for-gtm), a third party - not Google ([source](https://github.com/stape-io/google-tag-manager-mcp-server)).

### Authentication

The first time the server is used, run `/mcp` in Claude Code, select `gtm-mcp-server` and complete the Google OAuth sign-in in your browser. Claude Code stores and refreshes the token; no local package or `mcp-remote` bridge is needed.

### Review before approving

The server's tools can write to your containers: create, update and delete tags, triggers, variables, folders, templates, environments and user permissions, and create and **publish** container versions. Publishing changes what runs on a live site. Review each delete, permission or publish call - the container, workspace and entities it targets - before approving it.

### Optional: the gtm CLI

For scripting, CI, bulk audits or service-account access, the skill can also drive [owntag/gtm-cli](https://github.com/owntag/gtm-cli), an open-source command-line client for the Tag Manager API (a third party, not Google). It is not bundled - ask Claude to install it, or run `npm install -g @owntag/gtm-cli` and `gtm auth login`. The same review rule applies to its delete and publish commands.

## Installation

```bash
/plugin install google-tagmanager@wookstar-claude-plugins
```

On Claude Code 2.1.275 or later, in one step without adding the marketplace first: `/plugin install google-tagmanager --marketplace henkisdabro/wookstar-claude-plugins`

## Coverage

- **Glossary** - event in its three senses, tag versus pixel versus Google tag, Destination and Destination tag, container versus workspace versus version, the IDs, key event versus conversion
- **Three JavaScript environments** - Custom HTML tag, Custom JavaScript variable and sandboxed custom template side by side, plus the regex dialect for triggers, variables and the Regex Table
- **Optimised container (October 2026)** - Destination tags and Shared settings, how to tell a legacy, optimised or mixed container, and a checklist for the migration wizard
- **The 2026 install snippet** - what changed and what it breaks
- **Pitfalls** - one line each, grouped by task: installing, Google products, triggers, data layer, consent, templates, server containers, debugging, API
- **Consent Mode v2** in GTM
- **Automation** - the bundled MCP server and the optional `gtm` CLI, with approval before any delete or publish

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
