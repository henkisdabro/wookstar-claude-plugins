---
name: email
description: >-
  Create HTML email drafts with rich text formatting that paste cleanly into any email client.
  Use when writing emails, drafting emails, creating email drafts, composing replies, or when
  user mentions Gmail, Outlook, email client, "email to", "reply to", "draft an email",
  "write an email", "send an email", or needs to send any professional correspondence.
allowed-tools:
  - Bash
  - Write
  - Read
---

# Email Drafts

Create HTML emails that paste perfectly into any email client (Gmail, Outlook, etc.) as rich text.

## Workflow

1. Draft email content in conversation
2. Create HTML file using template from `${CLAUDE_PLUGIN_ROOT}/skills/email/templates/`
3. Save to project's `data/writing/email_drafts/` with naming: `YYYY-MM-DD_recipient_subject.html`
4. Launch preview server and provide URL

## Formatting Rules (Non-negotiable)

### Spacing

- **One blank line (`<br><br>`) between paragraphs**
- **One blank line before bold headings/sections** - use `<br><br>` before `<b>`
- **No blank line after bold headings** - description text follows on next line with single `<br>`
- No paragraph margins - rely on `<br>` tags only

### Structure

- No horizontal rules (`<hr>`) - looks auto-generated
- No numbered lists for proposals (1. 2. 3.) - looks templated
- Bold text for headings (`<b>`) not `<h2>` tags
- Bullet lists only where genuinely appropriate (feature lists, options)

### Lists and Formatting (Critical for Gmail Paste)

Gmail requires proper HTML elements to paste as formatted rich text. Using entities or manual formatting will paste as plain text.

**Bullet lists** - use `<ul><li>` with inline styles for preview:

```html
<ul style="margin: 8px 0; padding-left: 28px;">
<li style="margin-bottom: 2px;">First item</li>
<li style="margin-bottom: 2px;">Second item</li>
<li>Last item (no margin-bottom)</li>
</ul>
```

**Numbered lists** - use `<ol><li>` with inline styles for preview:

```html
<ol style="margin: 8px 0; padding-left: 28px;">
<li style="margin-bottom: 2px;">First step</li>
<li style="margin-bottom: 2px;">Second step</li>
<li>Final step</li>
</ol>
```

**Quote blocks** - use Gmail's exact `gmail_quote` class and styling:

```html
<blockquote class="gmail_quote" style="margin: 0px 0px 0px 0.8ex; border-left: 1px solid rgb(204, 204, 204); padding-left: 1ex;">
Quoted text goes here.
</blockquote>
```

**Indented text** (different from quotes - no border):

```html
<blockquote style="margin: 0 0 0 40px; border: none; padding: 0px;">
Indented text here.
</blockquote>
```

**Strikethrough:** `<strike>text</strike>`

**Never use:**

- `&bull;` entities with `<br>` - pastes as plain text
- Manual `1.` `2.` numbering with `<br>` - pastes as plain text
- `>` characters for quotes - not HTML

**Note:** Inline styles on `<ul>`, `<ol>`, `<li>` are for preview rendering only. Gmail strips them on paste and applies its own defaults. The `<style>` block in the template is also preview-only.

### Styling

Must match Gmail's exact CSS:

```css
font-family: Arial, Helvetica, sans-serif;
font-size: 13px;
line-height: 19.5px;
color: rgb(34, 34, 34);
max-width: 568px;
```

### Tone

- Write naturally, as a human would compose
- Avoid repetitive language from previous emails in the thread
- Keep prose flowing, not overly structured
- Match the recipient's formality level

## Template Fields

Both templates use these element IDs:

| Field | ID | Required | Notes |
|-------|----|----------|-------|
| To | `#to` | Yes | Primary recipient(s), comma-separated |
| CC | `#cc` | No | Hidden if empty |
| BCC | `#bcc` | No | Hidden if empty |
| Subject | `#subject` | Yes | Email subject line |
| Body | `#body` | Yes | Email content with HTML formatting |

## Templates

Use templates from `${CLAUDE_PLUGIN_ROOT}/skills/email/templates/` directory:

- `basic.html` - Simple email (greetings, thank yous, short messages)
- `proposals.html` - Multiple options/proposals with bold headings

## File Naming

```
data/writing/email_drafts/YYYY-MM-DD_recipient_subject.html
```

Examples:

- `2026-02-01_danielle-henry_reply.html`
- `2026-02-01_veronika_proposals.html`

## Local Preview with Python Server

After creating the HTML file, launch the preview server:

```bash
python3 ${CLAUDE_PLUGIN_ROOT}/skills/email/scripts/preview-server.py /path/to/email.html
```

Run with `run_in_background: true`. The server auto-stops after 10 minutes idle.

Instruct user:

1. Click the URL printed by the server
2. Review the email preview
3. Click **"Compose in Gmail"** to open Gmail with To/CC/Subject pre-filled and body on clipboard
4. Paste body into Gmail compose with Ctrl+V
5. Alternatively, use **"Open Gmail Inbox"** or **"Open in Email Client"** buttons

## Output

Always create:

1. `.md` file - for reference/version control
2. `.html` file - for Gmail paste

Both saved to `data/writing/email_drafts/`
