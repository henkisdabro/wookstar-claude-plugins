// Pure HTML -> WhatsApp/Markdown-style light-markup text. Shared by the preview
// UI (injected into shell.html at build time) and its unit tests. Operates on
// an HTML string with NO DOM access. Input is marked's own well-formed output,
// not arbitrary HTML, so regex-on-HTML is acceptable here.

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/gi, " ")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&#(\d+);/g, (_m, n) => String.fromCharCode(Number(n)))
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
const GRAPHEMES = new Intl.Segmenter(undefined, { granularity: "grapheme" });
const EMOJI_RE = /\p{Extended_Pictographic}/u;
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

function formatTableRows(rows) {
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

export function htmlToWhatsApp(rawHtml) {
  let html = rawHtml || "";
  // Preserve link URLs (WhatsApp has no rich links): keep "text (url)", or just
  // the url when the text IS the url. Must run before the generic tag strip.
  html = html.replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_m, href, txt) => {
    const t = txt.replace(/<[^>]+>/g, "").trim();
    return t && t !== href ? `${t} (${href})` : href;
  });
  html = html.replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*");
  html = html.replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, "_$2_");
  html = html.replace(/<(del|strike)\b[^>]*>([\s\S]*?)<\/\1>/gi, "~$2~");
  // Code blocks sit flush against their neighbours (no blank line before the
  // opening or after the closing fence, none inside before the close). The
  // PUA sentinels U+E000/U+E001 survive the global blank-line collapse and are
  // squeezed to single newlines at the end. Tables (also ``` fences, below)
  // deliberately keep their blank-line separation.
  html = html.replace(/<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi,
    (_m, code) => "\uE000```\n" + code.replace(/\n+$/, "") + "\n```\uE001");
  html = html.replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, "`$1`");
  html = html.replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, "\n*$1*\n");
  html = html.replace(/<hr\b[^>]*\/?>/gi, "\n---\n");
  html = html.replace(/<table\b[^>]*>([\s\S]*?)<\/table>/gi, (_m, inner) => {
    const rows = [];
    const trRe = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
    let tr;
    while ((tr = trRe.exec(inner)) !== null) {
      const cells = [];
      const tdRe = /<(?:td|th)\b[^>]*>([\s\S]*?)<\/(?:td|th)>/gi;
      let td;
      // decode entities here so padding is measured on the real cell text
      while ((td = tdRe.exec(tr[1])) !== null) cells.push(decodeEntities(td[1].replace(/<[^>]+>/g, "")).trim());
      if (cells.length) rows.push(cells);
    }
    if (!rows.length) return "\n";
    // re-escape so the generic tag strip below cannot eat literal <...> in cell
    // text and the single decodeEntities pass at the end restores it exactly once
    const block = formatTableRows(rows).join("\n")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return "\n```\n" + block + "\n```\n";
  });
  html = html.replace(/<ol\b[^>]*>([\s\S]*?)<\/ol>/gi, (_m, inner) => {
    const items = [];
    let n = 1;
    const re = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
    let li;
    while ((li = re.exec(inner)) !== null) items.push(n++ + ". " + li[1].replace(/<[^>]+>/g, "").trim());
    return "\n" + items.join("\n") + "\n";
  });
  html = html.replace(/<ul\b[^>]*>([\s\S]*?)<\/ul>/gi, (_m, inner) => {
    const items = [];
    const re = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
    let li;
    while ((li = re.exec(inner)) !== null) items.push("- " + li[1].replace(/<[^>]+>/g, "").trim());
    return "\n" + items.join("\n") + "\n";
  });
  html = html.replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, (_m, inner) => {
    return "\n> " + inner.replace(/<[^>]+>/g, "").trim() + "\n";
  });
  html = html.replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n").replace(/<p\b[^>]*>/gi, "");
  html = html.replace(/<[^>]+>/g, "");
  const text = decodeEntities(html).replace(/\n[ \t]+\n/g, "\n\n").replace(/\n{2,}/g, "\n\n")
    .replace(/\n*\uE000/g, "\n").replace(/\uE001\n*/g, "\n");
  return text.trim();
}
