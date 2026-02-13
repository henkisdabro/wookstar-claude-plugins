---
name: message
description: Create and edit rich text message drafts for Gmail, Outlook, and WhatsApp. Writes small HTML fragments and assembles full preview via build script. Use when writing emails, drafting emails, composing replies, sending messages, writing WhatsApp messages, sending Gmail messages, replying via email, or when user mentions Gmail, Outlook, WhatsApp, email client, "email to", "reply to", "draft an email", "write an email", "send a message", "message to", "WhatsApp to", or professional correspondence.
argument-hint: "[optional: path to existing .fragment.html for editing]"
allowed-tools:
  - Bash
  - Write
  - Read
  - Edit
---

# Message Drafts

Create rich text messages that paste perfectly into Gmail, Outlook, or convert to WhatsApp-formatted text. Uses a fragment architecture - write only the dynamic content, a build script handles the rest.

## Architecture

```
Claude writes              Build script assembles        Output (separate file)
name.fragment.html  --->   shell.html + fragment   --->  name.html
(12-85 lines)              (never seen by Claude)        (self-contained preview)
```

The fragment is the source of truth. The assembled HTML is a derived output. Never edit the `.html` output directly.

## Create Workflow

1. Draft email content in conversation
2. Write a `.fragment.html` file to `data/writing/email_drafts/`
3. Run the assembler to produce the full preview HTML
4. Launch the preview server

```bash
python3 ${CLAUDE_PLUGIN_ROOT}/skills/message/scripts/assemble.py /path/to/name.fragment.html --serve
```

This single command assembles the fragment into a full HTML preview and launches the server. Run with `run_in_background: true`.

## Edit Workflow

When editing an existing email (argument provided, or user asks to change something):

1. Read the small `.fragment.html` file
2. Use the Edit tool to make targeted changes
3. Re-run the assembler to rebuild the preview

```bash
python3 ${CLAUDE_PLUGIN_ROOT}/skills/message/scripts/assemble.py /path/to/name.fragment.html --serve
```

This is cheap - read a small file, make a small edit, one bash call.

## Fragment Format

```html
<!DOCTYPE html>
<html>
<head>
<meta name="to" content="veronika@example.com">
<meta name="cc" content="">
<meta name="subject" content="Perth Zoo - Excel Audit Proposal">
<meta name="title" content="HTML Email Preview">
</head>
<body>
<p style="font-family: Aptos, Calibri, Arial, sans-serif; font-size: 11pt; color: #000000; margin: 0 0 12pt 0;">Hi Veronika,</p>

<p style="font-family: Aptos, Calibri, Arial, sans-serif; font-size: 11pt; color: #000000; margin: 0 0 12pt 0;">Content here...</p>

<p style="font-family: Aptos, Calibri, Arial, sans-serif; font-size: 11pt; color: #000000; margin: 0 0 12pt 0;">Cheers,<br>Henrik</p>
</body>
</html>
```

### Meta Tags

| Tag | Required | Default | Notes |
|-----|----------|---------|-------|
| `to` | Yes | - | Primary recipient(s), comma-separated |
| `subject` | Yes | - | Email subject line |
| `cc` | No | empty | Hidden in preview if empty |
| `bcc` | No | empty | Hidden in preview if empty |
| `title` | No | "HTML Email Preview" | Page title shown in preview |

Special characters in meta `content` use standard HTML entity encoding (e.g., `&amp;` for &, `&quot;` for quotes).

## File Naming

```
data/writing/email_drafts/YYYY-MM-DD_recipient_subject.fragment.html   <-- source (Claude writes/edits)
data/writing/email_drafts/YYYY-MM-DD_recipient_subject.html            <-- output (build script writes)
```

Examples:

- `2026-02-12_veronika_audit-proposal.fragment.html`
- `2026-02-12_danielle_project-update.fragment.html`

## Generation Format: Outlook-Native HTML

**Always generate Outlook-native HTML** for the fragment body. This is the single generation format because:

- Outlook-native HTML degrades gracefully in Gmail (preserves semantic structure)
- Gmail HTML breaks in Outlook (no inline styles = broken rendering)

### Essential Formatting Rules

**All styles must be inline.** Outlook strips `<style>` blocks and CSS classes.

**Explicit colour on every element.** Outlook does not inherit colours. Every text element needs `color: #000000` (or appropriate colour).

| Element | Style |
|---------|-------|
| Body text | `font-family: Aptos, Calibri, Arial, sans-serif; font-size: 11pt; color: #000000; margin: 0 0 12pt 0;` |
| Headings | `font-family: Aptos, Calibri, Arial, sans-serif; font-size: 14pt; font-weight: bold; color: #1a5276; margin: 0 0 12pt 0;` |
| Subheadings | `font-family: Aptos, Calibri, Arial, sans-serif; font-size: 12pt; font-weight: bold; color: #1a5276; margin: 0 0 12pt 0;` |
| Spacer | `<p style="font-family: Aptos, Calibri, Arial, sans-serif; font-size: 11pt; color: #000000; margin: 0;">&nbsp;</p>` |

**Structure:**

- Use `<p>` tags for headings with inline bold/size (not `<h1>`, `<h2>`)
- Bold text with `<strong>` not `<b>`
- Bullet lists with inline styles on `<ul>` AND every `<li>`
- Tables with `border="1" cellpadding="8" cellspacing="0"` and inline styles on every cell
- No horizontal rules in casual emails

**Spacing:** Double blank lines (`&nbsp;` x2) before major section headings. Single blank line before/after tables and lists.

For full formatting detail including tables, lists, row highlighting, and colour palette, see `references/outlook-formatting.md`.

## Preview

The assembled HTML has a **Gmail/Outlook/WhatsApp mode toggle**:

- **Gmail mode**: Gmail font rendering (Arial 13px), Gmail action buttons (Compose in Gmail, Open Gmail Inbox)
- **Outlook mode**: Outlook font rendering (Aptos 11pt), Outlook action button (Copy for Outlook)
- **WhatsApp mode**: Converts HTML to WhatsApp-compatible plain text. Action buttons: Copy for WhatsApp, Send via WhatsApp

Instruct user:

1. Click the URL printed by the server
2. Select Gmail, Outlook, or WhatsApp mode
3. Review the email preview
4. Use the action buttons for their chosen client

## WhatsApp Formatting

When WhatsApp mode is selected, the HTML email is converted to plain text with WhatsApp markdown:

- `*bold*` from `<strong>` and `<b>` tags
- `_italic_` from `<em>` and `<i>` tags
- `~strikethrough~` from `<strike>` tags
- Headings become `*HEADING TEXT*`
- Lists become text with `- ` or `1. ` prefixes
- Tables become pipe-separated text rows

## Tone

- Write naturally, as a human would compose
- Avoid repetitive language from previous emails in the thread
- Keep prose flowing, not overly structured
- Match the recipient's formality level
- Use British English spelling (colour, analyse, organise, behaviour, centre)

## References

- `references/outlook-formatting.md` - Outlook copy-paste snippets for all element types
- `references/formatting-rules.md` - Gmail rendering behaviour reference

## After Preview

Once the user has the preview URL, ask whether they'd like to run the **humanizer** skill on the message to remove any AI writing patterns before sending. Example prompt: "Would you like me to run the humanizer skill on this draft to make it sound more natural?"
