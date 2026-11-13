// Numeric table columns in the two email payloads (Gmail and Rich Text):
// right-aligned, monospaced and with tabular figures, so amounts line up the
// way they do in a spreadsheet.
//
// Detection runs on marked's HTML, before a transform drops the `align`
// attributes Markdown's :-- / :-: / --: produce. A column is numeric when it
// has at least one numeric body cell and every non-empty body cell is numeric
// (the header is ignored; empty cells and a lone "-" placeholder are skipped).
// The restyling runs on the transform's output and touches only the cells of
// numeric columns, so every other byte of the payload is unchanged.

import { decodeEntities } from "./client/text-common.js";

export interface ColumnSpec { numeric: boolean; align: "left" | "center" | "right" | null }
export interface TableSpec { columns: ColumnSpec[]; userStyled: boolean }

// Monospace stacks as complete inline declarations: Gmail keeps inline
// font-family; Outlook's Word engine reads the font only from the cell itself.
// Sizes are set a step below the body text so the mono glyphs match it optically
// (Gmail body is 13px Arial; the Rich Text body is 11pt Aptos/Calibri).
export const GMAIL_MONO = "font-family: ui-monospace, 'SF Mono', Menlo, Consolas, 'Liberation Mono', 'Courier New', monospace";
export const OUTLOOK_MONO = "font-family: Consolas, 'SF Mono', Menlo, 'Liberation Mono', 'Courier New', monospace";
const MONO = {
  gmail: { family: GMAIL_MONO, size: "font-size: 12px" },
  outlook: { family: OUTLOOK_MONO, size: "font-size: 10pt" },
};

const PLACEHOLDER = /^-?$/;

// The amount itself, once any bracketed negative is written with a minus:
// optional sign, currency symbol or 3-letter code, digits with thousands
// commas and decimals, then %, k/m/b/bn or a trailing code.
function isPlainNumeric(value: string): boolean {
  let t = value.replace(/^[+\-\u2212]\s*/, "");
  t = t.replace(/^(?:[A-Z]{3}\s?|[A-Z]{0,2}[$\u20ac\u00a3\u00a5\u20b9]\s?)/, "");
  t = t.replace(/^[+\-\u2212]/, "");
  t = t.replace(/\s?(?:%|[kKmMbB]n?|[A-Z]{3})$/, "");
  return /^(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?$|^\.\d+$/.test(t);
}

// Accounting-style negatives become a value led by an ASCII minus, which goes
// before any currency symbol or code:
//   (1,200) -> -1,200   ($1,200) -> -$1,200   (12%) -> -12%
//   (AUD 1,200) and AUD (1,200) -> -AUD 1,200   (1,200) AUD -> -1,200 AUD
// Anything else (an already-signed "(-5)", "(note)") is returned unchanged.
export function toLeadingMinus(raw: string): string {
  const t = raw.trim();
  const forms: [RegExp, (m: RegExpMatchArray) => string][] = [
    [/^([A-Z]{3})\s?\(([^()]+)\)$/, (m) => `-${m[1]} ${m[2].trim()}`],
    [/^\(([^()]+)\)\s?([A-Z]{3})$/, (m) => `-${m[1].trim()} ${m[2]}`],
    [/^\(([^()]+)\)$/, (m) => `-${m[1].trim()}`],
  ];
  for (const [re, build] of forms) {
    const m = t.match(re);
    if (!m) continue;
    const candidate = build(m);
    if (/^-[+\-\u2212]/.test(candidate) || !isPlainNumeric(candidate)) return raw;
    return raw.replace(t, candidate);
  }
  return raw;
}

// "$6,000", "AUD 1,200", "1,200 AUD", "A$90", "(1,200)", "AUD (1,200)",
// "-$1,200", "+4.5%", "$1.2m", "45k", "3.4bn". A Unicode minus (U+2212) counts.
export function isNumericCell(raw: string): boolean {
  let t = toLeadingMinus(raw.replace(/\u00a0/g, " ").trim());
  if (/^\(.*\)$/.test(t)) t = t.slice(1, -1).trim();
  return isPlainNumeric(t);
}

const decode = (s: string) => decodeEntities(s.replace(/<[^>]+>/g, ""));

const TABLE_RE = /<table\b([^>]*)>([\s\S]*?)<\/table>/gi;
const ROW_RE = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
const CELL_RE = /<(td|th)\b([^>]*)>([\s\S]*?)<\/\1>/gi;

export function tableColumnSpecs(html: string): TableSpec[] {
  return [...html.matchAll(TABLE_RE)].map((t) => {
    let userStyled = /\sstyle\s*=/i.test(t[1]);
    const columns: ColumnSpec[] = [];
    const seen: { numeric: number; text: number }[] = [];
    for (const row of t[2].matchAll(ROW_RE)) {
      const rowCells = [...row[1].matchAll(CELL_RE)];
      const header = rowCells.every((c) => c[1].toLowerCase() === "th");
      rowCells.forEach((c, i) => {
        if (/\sstyle\s*=/i.test(c[2])) userStyled = true;
        columns[i] ??= { numeric: false, align: null };
        seen[i] ??= { numeric: 0, text: 0 };
        const align = c[2].match(/\salign\s*=\s*"(left|center|right)"/i)?.[1]?.toLowerCase();
        if (align) columns[i].align = align as ColumnSpec["align"];
        if (header) return;
        const v = decode(c[3]).trim();
        if (PLACEHOLDER.test(v)) return;
        if (isNumericCell(v)) seen[i].numeric++; else seen[i].text++;
      });
    }
    columns.forEach((c, i) => { c.numeric = seen[i].numeric > 0 && seen[i].text === 0; });
    return { columns, userStyled };
  });
}

function restyle(tag: string, add: string[], drop: RegExp | null): string {
  const m = tag.match(/\sstyle="([^"]*)"/);
  const decls = (m ? m[1] : "").split(";").map((d) => d.trim()).filter((d) => d && !(drop && drop.test(d)));
  const style = [...decls, ...add].join("; ") + ";";
  return m ? tag.replace(m[0], ` style="${style}"`) : tag.replace(/^<(td|th)/i, `<$1 style="${style}"`);
}

// Restyle the numeric columns of every table in a transformed payload, using
// the specs detected on the HTML before the transform. Tables are matched by
// order; a table the author styled by hand is left exactly as written.
export function applyNumericColumns(html: string, specs: TableSpec[], flavour: keyof typeof MONO): string {
  const mono = MONO[flavour];
  let n = 0;
  return html.replace(TABLE_RE, (table) => {
    const spec = specs[n++];
    if (!spec || spec.userStyled || !spec.columns.some((c) => c.numeric)) return table;
    return table.replace(ROW_RE, (row) => {
      let i = 0;
      return row.replace(CELL_RE, (cell, kind, attrs, content) => {
        const col = spec.columns[i++];
        if (!col || !col.numeric) return cell;
        const tag = `<${kind}${attrs}>`;
        const align = `text-align: ${col.align ?? "right"}`;
        if (kind.toLowerCase() === "th") return restyle(tag, [align], null) + content + `</${kind}>`;
        // A plain-text cell with a bracketed negative is rewritten with a minus;
        // a cell holding markup is left as written.
        const body = /</.test(content) ? content : toLeadingMinus(content);
        return restyle(tag, [align, mono.family, mono.size, "font-variant-numeric: tabular-nums"], /^font-(family|size)\s*:/i)
          + body + `</${kind}>`;
      });
    });
  });
}
