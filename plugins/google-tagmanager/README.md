# Google Tag Manager

Guardrails for working on Google Tag Manager with Claude Code. It does not re-teach GTM - current models know the basics. It pins down the vocabulary models blur, lists the mistakes they typically make, and covers what changed recently enough that a model's training is likely wrong, then links to Google's own docs for the rest.

## What's Included

### Skills (1)

- **google-tagmanager** - GTM guardrails for web and server containers

### Tools it works with

The skill carries no server of its own. To read and change a container it uses whichever of these you have:

- **The `gtm` CLI** - [owntag/gtm-cli](https://github.com/owntag/gtm-cli), an open-source command-line client for the Tag Manager API (a third party, not Google). Suits scripting, CI, bulk audits and service-account access, and keeps container access on your machine. Ask Claude to install it, or run `npm install -g @owntag/gtm-cli` and `gtm auth login`.
- **Stape's hosted GTM MCP server** - see [Stape's guide](https://stape.io/helpdesk/documentation/how-to-set-up-mcp-server-for-gtm). For Claude Code:

  ```bash
  claude mcp add --transport http --scope user gtm https://gtm-mcp.stape.io/mcp
  ```

  then run `/mcp`, pick `gtm` and sign in. Before 3.0.0 this plugin bundled it. It no longer does: the server is Stape's to document and change.

Either can delete and publish. Claude states what will change and waits for your approval first.

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
- **Automation** - the `gtm` CLI or the optional MCP server, with approval before any delete or publish

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
