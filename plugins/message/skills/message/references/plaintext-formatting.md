# Plain Text Formatting Reference

How the **Plain text** destination (shortcut `P`, and every destination whose composer takes no markup) converts the message for X and other
social posts, where any markup shows up as literal characters. Conversion is
`renderDialect()` with the `plain` spec of `DIALECTS` in
`scripts/client/dialects.js`, run client-side at copy time
on the same marked output every text destination reads. It copies `text/plain`
only, never `text/html`, so a paste carries no formatting. Other destinations are
unaffected by anything on this page.

## Conversion summary

| Source | Plain text output |
|--------|-------------------|
| `**bold**`, `*italic*`, `_italic_`, `~~strike~~`, `` `code` `` | the text alone |
| `# Heading` | the heading text on its own line |
| `[text](url)` | `text (url)`, or just the url when the text is the url |
| `- item` / `* item` | `- item` |
| `1. item` | `1. item` (a list's start number is kept) |
| nested list item | indented two spaces per level |
| `> quote` | the quoted text, no `>` |
| fenced code block | the code verbatim, no fences |
| table | one line per row, cells joined with ` - ` |
| raw HTML | its text; comments are dropped |
| frontmatter (to, subject, cc, bcc) | left out |

## Lines and paragraphs

- A single newline inside a paragraph stays a line break.
- Blocks (paragraphs, headings, lists, quotes, code, tables) are separated by
  exactly one blank line. A list written directly under a line of text
  therefore gains a blank line above it - the Markdown parser has already
  made it a separate block.
- Lines are never hard-wrapped.

## Characters

Emoji, punctuation and straight quotes pass through unchanged; nothing is
converted to curly quotes. HTML entities decode to their characters. A hashtag
such as `#launch` (no space after the `#`) is text, not a heading, and is kept.
