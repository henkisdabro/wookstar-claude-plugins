// Text helpers shared by every text dialect (scripts/client/dialects.js):
// entity decoding, display-width measurement, and the two table layouts a
// monospace-markup dialect uses - a padded grid, or stacked rows when the grid
// would be wider than a phone. Pure functions, no DOM.

export function decodeEntities(s) {
  return s
    .replace(/&nbsp;/gi, " ")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&#(\d+);/g, (_m, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_m, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/gi, "&");
}

// -- fixed-width table rendering ---------------------------------------------
// WhatsApp renders ``` blocks in a monospace font, so a table whose columns are
// padded to equal display width reads as an aligned grid. Width is measured per
// grapheme cluster, never String.length: CJK/fullwidth glyphs count 2 columns,
// emoji 2, zero-width marks 0. CJK padding deficits are filled with IDEOGRAPHIC
// SPACE (U+3000, one CJK glyph wide) so every cell in a column keeps identical
// glyph composition - the closest a space-padding scheme can get to pixel
// alignment across unknown fonts. Latin/digit/currency tables are exact.
// Widest code-block line, in display columns, that WhatsApp shows unwrapped on
// a 375pt-wide phone (iPhone 13 mini) at the default text size: a ~300pt text
// area at ~10pt per monospace glyph gives ~29, less headroom. Wider tables
// stack instead (stackTableRows). Derivation: references/whatsapp-formatting.md.
export const TABLE_WIDTH_BUDGET = 24;

export const GRAPHEMES = new Intl.Segmenter(undefined, { granularity: "grapheme" });
export const EMOJI_RE = /\p{Extended_Pictographic}/u;
const NUMERIC_CELL_RE = /^[$€£]?[\d,.\s%kKmM+-]*$/;

function isWideCp(cp) {
  return (cp >= 0x1100 && cp <= 0x115f) || (cp >= 0x2e80 && cp <= 0xa4cf) ||
    (cp >= 0xac00 && cp <= 0xd7a3) || (cp >= 0xf900 && cp <= 0xfaff) ||
    (cp >= 0xfe30 && cp <= 0xfe4f) || (cp >= 0xff00 && cp <= 0xff60) ||
    (cp >= 0xffe0 && cp <= 0xffe6) || (cp >= 0x20000 && cp <= 0x3fffd) ||
    cp === 0x3000;
}

function cellStats(text) {
  let wide = 0, narrow = 0;
  for (const { segment } of GRAPHEMES.segment(text)) {
    const cp = segment.codePointAt(0);
    if (cp === 0xfe0f || cp === 0x200d || cp === 0x200b || (cp >= 0x0300 && cp <= 0x036f)) continue;
    if (EMOJI_RE.test(segment)) narrow += 2;
    else if (isWideCp(cp)) wide++;
    else narrow++;
  }
  return { wide, narrow };
}

export function formatTableRows(rows) {
  const ncols = Math.max(...rows.map((r) => r.length));
  const stats = rows.map((r) => r.map(cellStats));
  const wideMax = new Array(ncols).fill(0);
  const narrowMax = new Array(ncols).fill(0);
  rows.forEach((r, ri) => r.forEach((_c, i) => {
    wideMax[i] = Math.max(wideMax[i], stats[ri][i].wide);
    narrowMax[i] = Math.max(narrowMax[i], stats[ri][i].narrow);
  }));
  // right-align a column when every body cell is numeric/currency (header included
  // in the alignment so it sits flush over the figures)
  const body = rows.slice(1);
  const rightAlign = Array.from({ length: ncols }, (_x, i) =>
    body.length > 0 &&
    body.every((r) => i >= r.length || !r[i] || NUMERIC_CELL_RE.test(r[i])) &&
    body.some((r) => i < r.length && /\d/.test(r[i] || "")));
  const pad = (cell, st, i) => {
    const fill = "　".repeat(wideMax[i] - st.wide) + " ".repeat(narrowMax[i] - st.narrow);
    return rightAlign[i] ? fill + cell : cell + fill;
  };
  const EMPTY = { wide: 0, narrow: 0 };
  const lines = rows.map((r, ri) =>
    Array.from({ length: ncols }, (_x, i) => pad(r[i] || "", stats[ri][i] || EMPTY, i)).join("  ").replace(/[ 　]+$/, ""));
  if (lines.length > 1) {
    lines.splice(1, 0, wideMax.map((w, i) => "-".repeat(2 * w + narrowMax[i])).join("  "));
  }
  return lines;
}

export const lineWidth = (line) => { const { wide, narrow } = cellStats(line); return 2 * wide + narrow; };

// Too wide for a phone: one block per row, the first cell as a bold title and
// every other non-empty cell as "Header: value". Plain wrapping text, so a long
// value wraps like any message line instead of breaking a grid; nothing is cut.
export function stackTableRows(rows, bold = "*") {
  const [head, ...body] = rows;
  if (!body.length) return head.filter(Boolean).join("\n");
  return body.map((r) => {
    const lines = [];
    if (r[0]) lines.push(r[0].startsWith(bold) && r[0].endsWith(bold) && r[0].length > 2 * bold.length ? r[0] : bold + r[0] + bold);
    for (let i = 1; i < r.length; i++) {
      if (r[i]) lines.push(head[i] ? `${head[i]}: ${r[i]}` : r[i]);
    }
    return lines.join("\n");
  }).join("\n\n");
}
