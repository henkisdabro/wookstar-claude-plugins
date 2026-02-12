# Message Plugin

Rich text message drafts for Gmail, Outlook, and WhatsApp with formatting preview.

## Prerequisites

- Python 3 (for the assembler and preview server - stdlib only, no pip dependencies)

## Installation

```bash
/plugin install message@wookstar-claude-plugins
```

## Usage

Ask Claude to draft a message:

- "Write an email to John about the project update"
- "Draft a reply to Sarah's proposal"
- "Send a WhatsApp message to the team about the meeting"
- "Email to client@example.com with three pricing options"

To edit an existing draft:

- `/message data/writing/email_drafts/2026-02-12_john_update.fragment.html`
- "Change the subject line in that email"
- "Fix the typo in the second paragraph"

## Architecture

The plugin uses a **fragment architecture** for token efficiency:

```
Claude writes              Build script assembles        Output
name.fragment.html  --->   shell.html + fragment   --->  name.html
(12-85 lines)              (never seen by Claude)        (self-contained preview)
```

- **Fragment** (`.fragment.html`): Small file with just meta tags (to, subject, cc) and body HTML. This is what Claude reads and writes.
- **Shell** (`shell.html`): Static template with all CSS, JS, and HTML chrome. Never read by Claude.
- **Assembler** (`assemble.py`): Combines fragment + shell into a full preview HTML.
- **Preview server** (`preview-server.py`): Serves the assembled HTML for browser review.

This means creating an email costs ~150-750 tokens instead of ~15,000, and editing a typo is equally cheap.

## What's Included

- **1 skill** - Message drafting with Outlook-native HTML, Gmail CSS override, and WhatsApp text conversion
- **1 shell template** - `shell.html` with all CSS, JS, and mode toggle
- **1 assembler** - `assemble.py` combines fragments with shell
- **1 preview server** - Python HTTP server with idle auto-shutdown and clipboard copy
- **2 formatting references** - Outlook formatting snippets and Gmail rendering behaviour

## Workflow

1. Draft message content in conversation
2. Fragment file created with meta tags and Outlook-native body HTML
3. Assembler combines fragment with shell template
4. Preview server launches on a random port
5. Toggle between Gmail, Outlook, or WhatsApp mode
6. Use platform-specific action buttons to send
