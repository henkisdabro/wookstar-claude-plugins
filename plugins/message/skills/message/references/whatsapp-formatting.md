# WhatsApp / Markdown Lane Formatting Reference

How the **WhatsApp** destination converts the message. Conversion is
`htmlToWhatsApp()` in `scripts/client/whatsapp.js`, which renders the `whatsapp`
spec of `DIALECTS` in `scripts/client/dialects.js`, run client-side at copy time.
Gmail and Rich Text are unaffected by anything on this page.

## Inline conversion summary

| HTML | WhatsApp output |
|------|-----------------|
| `<strong>` / `<b>` | `*bold*` |
| `<em>` / `<i>` | `_italic_` |
| `<del>` | `~strike~` |
| `<a href>` | `text (url)`, or just the url when the text is the url |
| headings | `*bold line*` |
| `<pre><code>` | fenced ``` block, flush against its neighbours |

## Code blocks: flush fences

Code blocks emit their ``` fences with NO blank line before the opening fence,
after the closing fence, or inside the block - WhatsApp hides the fence lines
when rendering, so any blank line around them becomes visible dead space.
Tables (below) are the deliberate exception: their fenced blocks keep a blank
line on each side, the same separation paragraphs get.

## Tables: fixed-width code blocks

Tables that fit a phone (see "Tables wider than a phone" below) are emitted as
a fenced ``` code block with columns padded to equal
display width - WhatsApp renders fenced blocks in monospace on iOS, Android and
Web, so the grid aligns. Numeric/currency columns are right-aligned (header
included, so the label sits flush over the figures) and a dashed divider row is
inserted under the header.

### Width model

- Width is measured per grapheme cluster via `Intl.Segmenter`, never
  `String.length` (which counts UTF-16 code units and breaks on emoji/CJK).
- CJK/fullwidth glyphs and emoji count as two columns; zero-width marks
  (VS16, ZWJ, combining) count zero.
- CJK padding deficits are filled with IDEOGRAPHIC SPACE (U+3000, exactly one
  CJK glyph wide) so every cell in a column keeps identical glyph composition.

### Alignment guarantees and limits

- **Latin, digits, currency, punctuation: pixel-exact** in any monospace font.
- **Emoji: within about a third of a character** - emoji have no invisible
  same-width filler, so they are modelled as two columns.
- **CJK: best-effort.** The U+3000 padding glyph and real ideographs can come
  from different fallback fonts with slightly different advances, so exact CJK
  alignment is impossible with space padding (roughly 0.7 of a character
  worst-case drift, still about 6x better than plain space padding).
- **Width budget: `TABLE_WIDTH_BUDGET` display columns** (`scripts/client/text-common.js`).
  See below for how it was chosen and what happens past it.

## Tables wider than a phone: stacked rows

A grid only works while every line fits the screen; once a monospace line
wraps, the grid is gone. `TABLE_WIDTH_BUDGET` is the widest line, in display
columns (emoji and CJK count two), that a small phone shows unwrapped.

How the figure was chosen (estimated, not measured on a device): an iPhone 13
mini is 375pt wide. A WhatsApp bubble leaves roughly 300pt of text width after
the bubble margins and insets, and a monospace glyph at the default text size
(about 16-17pt) advances about 0.6em, roughly 10pt. That gives about 29
columns; the budget keeps headroom below that for a larger text-size setting
and the received-bubble tail. An earlier ~40-column guide wrapped on that phone.

A table whose grid fits the budget is emitted as the aligned code block above,
unchanged. A wider one is emitted as plain text, one block per row, rows
separated by a blank line:

```
*Search*
Budget: $6,000
Status: Live
Notes: Brand and generic
```

The first cell is the bold title; every other non-empty cell becomes
`Header: value`. Nothing is truncated: a long value wraps like any other line
of the message. Empty cells are left out. To keep the grid, write WhatsApp-bound
tables with 2-3 lean columns; roll minor rows into an "Other" row rather than
widening the table.
