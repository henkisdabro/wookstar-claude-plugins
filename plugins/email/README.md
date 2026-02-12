# Email Plugin

HTML email drafts with rich text formatting that paste cleanly into Gmail and Outlook.

## Prerequisites

- Python 3 (for the preview server - stdlib only, no pip dependencies)

## Installation

```bash
/plugin install email@wookstar-claude-plugins
```

## Usage

Ask Claude to draft an email:

- "Write an email to John about the project update"
- "Draft a reply to Sarah's proposal"
- "Email to client@example.com with three pricing options"

Claude will create an HTML file matching Gmail's exact formatting, launch a local preview server, and provide a URL to review and send.

## What's Included

- **1 skill** - Email drafting with Gmail-exact CSS, spacing rules, and tone guidelines
- **2 templates** - `basic.html` for simple emails, `proposals.html` for multi-option proposals
- **1 preview server** - Python HTTP server with idle auto-shutdown, Gmail compose integration, and clipboard copy
- **1 formatting reference** - Complete guide to Gmail-compatible HTML elements (lists, quotes, links, etc.)

## Workflow

1. Draft email content in conversation
2. HTML file created using template with Gmail-exact styling
3. Preview server launches on a random port
4. Click "Compose in Gmail" to open Gmail with To/CC/Subject pre-filled and body on clipboard
5. Paste with Ctrl+V
