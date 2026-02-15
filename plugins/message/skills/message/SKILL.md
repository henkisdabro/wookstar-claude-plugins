---
name: message
description: Create and edit rich text message drafts for Gmail, Outlook, and WhatsApp. Writes Markdown fragments and assembles platform-specific HTML via build script. Use when writing emails, drafting emails, composing replies, sending messages, writing WhatsApp messages, sending Gmail messages, replying via email, or when user mentions Gmail, Outlook, WhatsApp, email client, "email to", "reply to", "draft an email", "write an email", "send a message", "message to", "WhatsApp to", or professional correspondence.
argument-hint: "[optional: path to existing .fragment.md for editing]"
allowed-tools: Bash, Write, Read, Edit
---

# Message Drafts

Create rich text messages that paste perfectly into Gmail, Outlook, or convert to WhatsApp-formatted text. Fragments are written in Markdown - the build script converts to platform-specific HTML automatically.

## Setup

The assembly script requires the Python `markdown` package:

    pip install markdown

## Architecture

```
Claude writes              Build script assembles          Output (separate file)
name.fragment.md  --->     Markdown -> HTML                name.html
(10-30 lines)              Gmail transform (tags)          (self-contained preview
                           Outlook transform (styles)       with three body versions)
                           Inject into shell.html
```

The fragment is the source of truth. The assembled HTML is a derived output. Never edit the `.html` output directly.

## Create Workflow

1. Draft email content in conversation
2. Write a `.fragment.md` file to `data/writing/email_drafts/`
3. Run the assembler to produce the full preview HTML
4. Launch the preview server

```bash
python3 ${CLAUDE_PLUGIN_ROOT}/skills/message/scripts/assemble.py /path/to/name.fragment.md --serve
```

This single command assembles the fragment into a full HTML preview and launches the server. Run with `run_in_background: true`.

## Edit Workflow

When editing an existing email (argument provided, or user asks to change something):

1. Read the small `.fragment.md` file
2. Use the Edit tool to make targeted changes
3. Re-run the assembler to rebuild the preview

```bash
python3 ${CLAUDE_PLUGIN_ROOT}/skills/message/scripts/assemble.py /path/to/name.fragment.md --serve
```

## Fragment Format

Fragments are Markdown files with YAML frontmatter:

```markdown
---
to: recipient@example.com
cc: optional@example.com
subject: Email Subject
---

Hi **Stuart**,

Here's the ~~old approach~~ new approach.

## Key Points

- First item
- Second item

> Quoted text from previous email

| Feature | Status |
|---------|--------|
| Auth    | Done   |

Inline `code` and [a link](https://example.com).

Cheers,
Henrik
```

### Frontmatter Fields

| Field | Required | Notes |
|-------|----------|-------|
| `to` | Yes | Comma-separated recipients |
| `subject` | Yes | Email subject line |
| `cc` | No | Hidden in preview if empty |
| `bcc` | No | Hidden in preview if empty |

### Formatting Reference

Standard Markdown maps to platform-specific HTML automatically:

| What you want | Write in Markdown |
|---------------|-------------------|
| Bold | `**bold**` |
| Italic | `*italic*` |
| Strikethrough | `~~strikethrough~~` |
| Heading | `## Heading` |
| Bullet list | `- item` |
| Numbered list | `1. item` |
| Blockquote | `> quoted text` |
| Inline code | `` `code` `` |
| Code block | triple backticks |
| Link | `[text](url)` |
| Table | `| col | col |` with separator row |

For features not in standard Markdown, embed HTML directly (it passes through unchanged):

| What you want | Embed as HTML |
|---------------|---------------|
| Custom colour | `<span style="color: #c0392b;">red text</span>` |
| Large text | `<font size="4">larger text</font>` |
| Underline | `<u>underlined</u>` |
| Indent | `<blockquote style="margin: 0 0 0 40px; border: none; padding: 0px;">indented</blockquote>` |

### Example: User Asks for Colour and Strikethrough

```
User: "Write an email to Stuart. Strikethrough '$5000' and make his name red."

Claude writes .fragment.md:

---
to: akumanostuart@gmail.com
subject: Pricing Update
---

Hi <span style="color: #c0392b;">Stuart</span>,

The old pricing was ~~$5000~~ but the new rate is $3000.

Cheers,
Henrik
```

## File Naming

```
data/writing/email_drafts/YYYY-MM-DD_recipient_subject.fragment.md   <- source
data/writing/email_drafts/YYYY-MM-DD_recipient_subject.html          <- assembled output
```

Examples:

- `2026-02-12_veronika_audit-proposal.fragment.md`
- `2026-02-12_danielle_project-update.fragment.md`

## Platform Transforms

The build script produces three HTML versions from a single Markdown source:

**Gmail** (tag transform): Converts semantic HTML to Gmail-native elements. `<p>` becomes `<div>`, `<strong>` becomes `<b>`, `<em>` becomes `<i>`, headings become `<font size>` with `<b>`. Container gets Arial 13px. No custom colours added - only platform defaults.

**Outlook** (style injection): Adds inline styles to every element for Word's rendering engine. Aptos/Calibri 11pt, explicit `color: #000000` on every text element, `mso-line-height-rule` for spacing control. No custom colours added - only platform defaults.

**WhatsApp** (text conversion): Strips HTML and converts to WhatsApp markdown - `*bold*`, `_italic_`, `~strikethrough~`. Tables become pipe-separated text.

User-specified inline styles (colours, font sizes) are preserved through all transforms.

## Preview

The assembled HTML has a **Gmail/Outlook/WhatsApp mode toggle**:

- **Gmail mode**: Gmail-native HTML with Arial 13px container, Gmail action buttons (Compose in Gmail, Open Gmail Inbox, Copy for Gmail)
- **Outlook mode**: Outlook-native HTML with full inline styles, Outlook action button (Copy for Outlook)
- **WhatsApp mode**: Converts to WhatsApp-compatible plain text. Action buttons: Copy for WhatsApp, Send via WhatsApp

Instruct user:

1. Click the URL printed by the server
2. Select Gmail, Outlook, or WhatsApp mode
3. Review the email preview
4. Use the action buttons for their chosen client

## Backward Compatibility

Legacy `.fragment.html` files still work. The assembler detects the extension and uses the appropriate parser. For HTML fragments, the same body is used for all three platform views (matching previous behaviour).

## Tone

- Write naturally, as a human would compose
- Avoid repetitive language from previous emails in the thread
- Keep prose flowing, not overly structured
- Match the recipient's formality level
- Use British English spelling (colour, analyse, organise, behaviour, centre)

## References

- `references/outlook-formatting.md` - Outlook element styles and colour palette reference
- `references/formatting-rules.md` - Gmail native HTML element reference

## After Preview

Once the user has the preview URL, ask whether they'd like to run the **humanizer** skill on the message to remove any AI writing patterns before sending. Example prompt: "Would you like me to run the humanizer skill on this draft to make it sound more natural?"
