# WhatsApp / Markdown Lane Formatting Reference

How the **Copy Markdown** lane converts the message for WhatsApp. Conversion is
`htmlToWhatsApp()` in `scripts/client/whatsapp.js`, run client-side at copy time.
The Gmail and Rich Text lanes are unaffected by anything on this page.

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

Tables are emitted as a fenced ``` code block with columns padded to equal
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
- **Width budget: ~40 display columns.** A phone-width WhatsApp code block fits
  roughly 35-42 monospace columns before wrapping, which breaks the grid. Keep
  WhatsApp-bound tables to 3-4 lean columns; roll minor rows into an "Other"
  row rather than widening the table.
