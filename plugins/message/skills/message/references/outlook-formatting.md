# Outlook Email Formatting - Copy-Paste Reference

> **Note:** Fragments are now Markdown. This file documents Outlook's inline style requirements for reference - the build script applies these styles automatically. For the fragment format, see SKILL.md.

Consolidated snippets for Outlook-compatible HTML emails with 100% inline styles.

## Document Structure

Every email starts with MSO conditional comments:

```html
<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<!--[if gte mso 9]>
<xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
<![endif]-->
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
</head>
<body>
<!-- Content here -->
</body>
</html>
```

Note: Do not add styles to the `<body>` tag - they are ignored when copy/pasting. Style each element individually.

## Paragraphs

### Body Text

```html
<p style="font-family: Aptos, Calibri, Arial, sans-serif; font-size: 11pt; color: #000000; margin: 0 0 12pt 0;">Text content here.</p>
```

### Blank Line (Spacing)

```html
<p style="font-family: Aptos, Calibri, Arial, sans-serif; font-size: 11pt; color: #000000; margin: 0;">&nbsp;</p>
```

**Spacing rules (as enforced by the transform):**

- Single blank line (`&nbsp;` spacer paragraph) between consecutive paragraphs -
  paragraphs carry `margin: 0`, so the spacer is the only source of the gap
  (this is also what separates the sign-off "Best,/Alex" from the paragraph
  above it)
- Single blank line before headings; NO blank line after a heading - the text
  under a heading sits flush
- Single blank line before and after tables and bullet/numbered lists

## Headings

### Main Heading (14pt)

```html
<p style="font-family: Aptos, Calibri, Arial, sans-serif; font-size: 14pt; font-weight: bold; color: #1a5276; margin: 0 0 12pt 0;">Heading Text</p>
```

### Sub-heading (12pt)

```html
<p style="font-family: Aptos, Calibri, Arial, sans-serif; font-size: 12pt; font-weight: bold; color: #1a5276; margin: 0 0 12pt 0;">Sub-heading Text</p>
```

### Inline Bold Label

```html
<p style="font-family: Aptos, Calibri, Arial, sans-serif; font-size: 11pt; color: #000000; margin: 0 0 6pt 0;"><strong>Label:</strong> Description text</p>
```

## Tables

### Table Structure

```html
<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; border: 1px solid #999999; font-family: Aptos, Calibri, Arial, sans-serif; font-size: 11pt; margin: 12pt 0;">
```

### Header Row

```html
<tr style="background-color: #f2f2f2;">
<th style="text-align: left; border: 1px solid #999999; color: #000000; padding: 8px;">Text Header</th>
<th style="text-align: right; border: 1px solid #999999; color: #000000; padding: 8px;">Numeric Header</th>
</tr>
```

### Numeric columns

Columns whose body cells are all numbers are handled automatically by
`applyNumericColumns()` in `scripts/numeric-columns.ts`, shared with the other
email payload. Body cells are right-aligned in a monospaced font with tabular
figures; the header cell is right-aligned but keeps the normal font.

- **What counts as numeric:**
  - plain numbers, decimals and thousands separators: `1,200.50`
  - currency symbols or codes: `$6,000`, `A$90`, `AUD 1,200`, `1,200 AUD`
  - negatives: `-12`, `-$1,200`. Accounting brackets count as negatives and are
    rewritten with a leading minus that goes before any symbol or code:
    `(1,200)` becomes `-1,200`, `($1,200)` becomes `-$1,200`, `(12%)` becomes `-12%`,
    `(AUD 1,200)` and `AUD (1,200)` become `-AUD 1,200`, and `(1,200) AUD` becomes
    `-1,200 AUD`. A cell holding markup, and every text column, is left as written.
  - percentages: `+4.5%`
  - unit suffixes: `45k`, `$1.2m`, `3.4bn`
- **How the column is judged:** only the body cells decide, not the header. Empty cells
  and a lone `-` are skipped. One text cell in the column keeps it a text column.
- **Alignment marks win:** an explicit Markdown alignment (`:--`, `:-:`, `--:`) on a
  numeric column is used instead of right alignment, and the mono font still applies.
- **Left alone:** text columns and tables you styled by hand are not touched.

The Rich Text cell swaps its Aptos font for
`font-family: Consolas, 'SF Mono', Menlo, 'Liberation Mono', 'Courier New', monospace;
font-size: 10pt; font-variant-numeric: tabular-nums;` (`OUTLOOK_MONO`). The font has to be
on the cell itself, because the Word engine ignores inherited and `<style>` fonts, and
10pt Consolas matches 11pt Aptos optically.

### Normal Row

```html
<tr>
<td style="border: 1px solid #999999; color: #000000; padding: 8px;">Text value</td>
<td style="text-align: right; border: 1px solid #999999; color: #000000; padding: 8px;">1,234</td>
</tr>
```

**Column alignment:**

- Left-align: Text, labels, descriptions
- Right-align: Numbers, percentages, currency

## Row Highlighting

### Success/Positive (Green)

```html
<tr style="background-color: #e8f6e8;">
<td style="border: 1px solid #999999; color: #000000; padding: 8px;">Label</td>
<td style="text-align: right; border: 1px solid #999999; color: #27ae60; padding: 8px;"><strong>+12.3%</strong></td>
</tr>
```

### Warning/Negative (Red)

```html
<tr style="background-color: #ffeaea;">
<td style="border: 1px solid #999999; color: #000000; padding: 8px;">Label</td>
<td style="text-align: right; border: 1px solid #999999; color: #c0392b; padding: 8px;"><strong>-5.4%</strong></td>
</tr>
```

### Attention/Important (Yellow)

```html
<tr style="background-color: #fff9e6;">
<td style="border: 1px solid #999999; color: #000000; padding: 8px;"><strong>Important</strong></td>
<td style="text-align: right; border: 1px solid #999999; color: #000000; padding: 8px;"><strong>Value</strong></td>
</tr>
```

### Informational (Blue)

```html
<tr style="background-color: #e8f0fe;">
<td style="border: 1px solid #999999; color: #000000; padding: 8px;">Info row</td>
<td style="text-align: right; border: 1px solid #999999; color: #2980b9; padding: 8px;"><strong>Value</strong></td>
</tr>
```

## Lists

### Bullet List

```html
<ul style="font-family: Aptos, Calibri, Arial, sans-serif; font-size: 11pt; color: #000000; margin: 0 0 12pt 0;">
<li style="color: #000000; margin-bottom: 6pt;"><strong>Label:</strong> Description</li>
<li style="color: #000000; margin-bottom: 6pt;"><strong>Label:</strong> Description</li>
<li style="color: #000000; margin-bottom: 6pt;"><strong>Label:</strong> Description</li>
</ul>
```

### Numbered List

```html
<ol style="font-family: Aptos, Calibri, Arial, sans-serif; font-size: 11pt; color: #000000; margin: 0 0 12pt 0;">
<li style="color: #000000; margin-bottom: 6pt;">First item</li>
<li style="color: #000000; margin-bottom: 6pt;">Second item</li>
<li style="color: #000000; margin-bottom: 6pt;">Third item</li>
</ol>
```

## Other Elements

### Horizontal Rule

```html
<hr style="border: none; border-top: 1px solid #cccccc; margin: 24pt 0;">
```

### Coloured Warning Text

```html
<p style="font-family: Aptos, Calibri, Arial, sans-serif; font-size: 11pt; color: #c0392b; font-weight: bold; margin: 0 0 6pt 0;">Warning heading</p>
```

### Key Insight Callout

```html
<p style="font-family: Aptos, Calibri, Arial, sans-serif; font-size: 11pt; color: #000000; margin: 0 0 12pt 0;"><strong>Key insight:</strong> Interpretation text here.</p>
```

### Email Signature

```html
<p style="font-family: Aptos, Calibri, Arial, sans-serif; font-size: 11pt; color: #000000; margin: 0 0 12pt 0;">Cheers,<br>Alex</p>
```

## Colour Reference

| Purpose | Colour Code |
|---------|-------------|
| Heading text | #1a5276 |
| Body text | #000000 |
| Success text | #27ae60 |
| Success background | #e8f6e8 |
| Warning text | #c0392b |
| Warning background | #ffeaea |
| Yellow highlight bg | #fff9e6 |
| Blue highlight bg | #e8f0fe |
| Blue highlight text | #2980b9 |
| Table header bg | #f2f2f2 |
| Border colour | #999999 |
| HR colour | #cccccc |
