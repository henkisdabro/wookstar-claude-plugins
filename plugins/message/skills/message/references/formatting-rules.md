# Gmail Email Formatting Rules - Complete Reference

> **Note:** This documents Gmail's rendering behaviour for reference. The email skill generates Outlook-native HTML which degrades gracefully in Gmail. For generation rules, see SKILL.md. For Outlook copy-paste snippets, see outlook-formatting.md.

## CSS Styling (Gmail Exact Match)

```css
body {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;
  line-height: 19.5px;
  color: rgb(34, 34, 34);
  max-width: 568px;
}
```

These values are extracted directly from Gmail's compose window and ensure the email looks identical when pasted.

## Spacing Rules

### Between Paragraphs

- Use `<br><br>` between paragraphs (one blank line)
- No CSS margins on paragraphs

### Before Bold Headings/Sections

- Use `<br><br>` before `<b>` headings (one blank line)

### After Bold Headings

- NO blank line after `<b>Heading</b>`
- Text follows immediately on next line with single `<br>`

**Correct:**

```html
[Previous paragraph text]
<br><br>
<b>Project Title - $2,500</b>
<br>Description starts here on the next line...
```

**Wrong:**

```html
<b>Project Title - $2,500</b>
<br><br>Description with extra blank line after heading...
```

### After Lists

- Single `<br>` before continuing prose
- No extra spacing needed after `</ul>` or `</ol>`

## Structure Rules

### Avoid Auto-Generated Appearance

- NO horizontal rules (`<hr>`)
- NO numbered headings (1. 2. 3.)
- NO `<h1>`, `<h2>`, etc. tags - use `<b>` for emphasis
- NO excessive structure - let prose flow naturally

### When to Use Bullet Lists

Use bullet lists ONLY when genuinely listing:

- Feature sets
- Multiple distinct options
- Requirements or deliverables

Do NOT use bullets for:

- General information that reads as prose
- Single items
- Sequential steps (use prose instead)

## Lists, Quotes, and Formatting (Critical for Gmail Paste)

Gmail's paste handler requires proper HTML elements. Using `&bull;` entities or manual `1. 2. 3.` numbering with `<br>` tags will paste as **plain text**, not formatted lists.

**Important:** Inline styles on list elements (`<ul>`, `<ol>`, `<li>`) are for **preview rendering only**. Gmail strips them on paste and applies its own defaults. The `<style>` block is also stripped. Always use proper HTML tags - that's what matters for paste.

### Bullet Lists

Use `<ul><li>` (inline styles for preview only):

```html
<ul style="margin: 8px 0; padding-left: 28px;">
<li style="margin-bottom: 2px;">First item</li>
<li style="margin-bottom: 2px;">Second item</li>
<li>Last item (no margin-bottom on last)</li>
</ul>
```

Gmail internally renders this as bare `<ul><li>item</li></ul>` with no styles.

### Numbered Lists

Use `<ol><li>` (inline styles for preview only):

```html
<ol style="margin: 8px 0; padding-left: 28px;">
<li style="margin-bottom: 2px;">First step</li>
<li style="margin-bottom: 2px;">Second step</li>
<li>Final step</li>
</ol>
```

### Quote Blocks

Use `<blockquote>` with Gmail's exact `gmail_quote` class and styling:

```html
<blockquote class="gmail_quote" style="margin: 0px 0px 0px 0.8ex; border-left: 1px solid rgb(204, 204, 204); padding-left: 1ex;">
Quoted text here.
</blockquote>
```

This is Gmail's **native** quote format - extracted directly from the compose window.

### Indented Text (no border)

Different from quotes - uses `<blockquote>` with left margin only:

```html
<blockquote style="margin: 0 0 0 40px; border: none; padding: 0px;">
Indented text here.
</blockquote>
```

### Strikethrough

```html
<strike>Struck-through text</strike>
```

### Links

Use `<a>` with Gmail's default blue:

```html
<a href="https://example.com" style="color: rgb(17, 85, 204);">Link text</a>
```

### Font Sizes (rarely needed in professional emails)

Gmail uses the HTML `<font size>` attribute:

```html
<font size="1">Small</font>     <!-- ~10px -->
<font size="4">Large</font>     <!-- ~18px -->
<font size="6">Huge</font>      <!-- ~32px -->
```

Default body text has no size attribute (renders at 13px with our CSS).

### Bold, Italic, Underline

```html
<b>Bold text</b>
<i>Italic text</i>
<u>Underlined text</u>
```

### What NOT to Use

| Wrong | Right |
|-------|-------|
| `&bull; Item<br>` | `<ul><li>Item</li></ul>` |
| `1. Step one<br>` | `<ol><li>Step one</li></ol>` |
| `> Quote text` | `<blockquote class="gmail_quote" ...>text</blockquote>` |
| Plain URL text | `<a href="..." style="color: rgb(17, 85, 204);">text</a>` |
| `<del>text</del>` | `<strike>text</strike>` |

## Gmail Native Paragraph Structure

Gmail internally wraps each line in `<div>` tags and uses `<div><br></div>` for blank lines. Our templates use `<br><br>` between paragraphs which works fine for pasting - Gmail converts them automatically. Both approaches produce identical results in the compose window.

## Tone Guidelines

### Natural Writing

- Vary sentence structure
- Use contractions where appropriate
- Match the recipient's tone
- Avoid corporate jargon

### Avoid Repetition

When replying to an email thread:

- Read the previous emails
- Do NOT reuse the same phrases
- Find fresh ways to express similar sentiments

## HTML Template Structure

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 13px;
      line-height: 19.5px;
      color: rgb(34, 34, 34);
      max-width: 568px;
    }
    ul, ol { margin: 8px 0; padding-left: 28px; }
    li { margin-bottom: 2px; }
    blockquote.gmail_quote { margin: 0px 0px 0px 0.8ex; border-left: 1px solid rgb(204, 204, 204); padding-left: 1ex; }
    a { color: rgb(17, 85, 204); }
  </style>
</head>
<body>

[EMAIL CONTENT HERE]

</body>
</html>
```

**Important:** Always use inline styles on `<ul>`, `<ol>`, `<li>`, `<blockquote>`, and `<a>` tags in the email body. The `<style>` block is for the preview only - Gmail strips `<style>` tags during paste.

## Local Preview

Assemble and launch the preview server:

```bash
python3 ${CLAUDE_PLUGIN_ROOT}/skills/message/scripts/assemble.py /path/to/name.fragment.html --serve
```

Run with `run_in_background: true` in Claude Code. Auto-stops after 10 minutes idle.

User workflow:

1. Click the URL printed by the server
2. Select Gmail, Outlook, or WhatsApp mode
3. Review the email preview (To, CC, BCC, Subject, Body)
4. Use platform-specific action buttons to send

## File Organisation

### Naming Convention

```
YYYY-MM-DD_recipient_subject.fragment.html   (source - Claude writes/edits)
YYYY-MM-DD_recipient_subject.html            (output - build script writes)
```

### Save Location

```
data/writing/email_drafts/
```
