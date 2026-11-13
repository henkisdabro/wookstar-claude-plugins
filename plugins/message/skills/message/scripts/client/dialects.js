// One converter for every text destination: it walks marked's HTML output (no
// second Markdown parser) and writes it in a dialect described by a spec in
// DIALECTS. WhatsApp, Slack, Telegram, Discord, Reddit, generic Markdown and
// plain text are all specs; adding a dialect is one entry. Which markup each
// platform really converts is recorded in references/destinations.md - an
// element a platform cannot type falls back to plain text, never to Unicode
// look-alikes.
import { decodeEntities, formatTableRows, stackTableRows, lineWidth, TABLE_WIDTH_BUDGET } from "./text-common.js";

// Spec fields:
//   name      - how the preview describes the paste ("plain text", "Markdown")
//   bold/italic/strike/code/underline - [open, close] markers, or null for plain
//   heading   - "bold" (a bold line), "hash" (# marks, up to maxHeading), "plain"
//   link      - "paren" for "text (url)", "markdown" for [text](url)
//   nest      - nested list indent: a number of spaces per level, or "marker"
//               (the parent item's marker width, as CommonMark wants)
//   quote     - true to prefix each quoted line with "> "
//   codeBlock - "fence", "fence-lang" (keeps the language), "indent" (4 spaces), "plain"
//   codeFlush - code blocks sit against their neighbours with no blank line
//   table     - "dash" (cells joined " - "), "gfm" (pipe table), or a number:
//               the grid width budget, past which rows are stacked
//   hardBreak - what a line break inside a paragraph becomes
//   hr        - what a horizontal rule becomes ("" drops it)
const B2 = ["**", "**"];
export const DIALECTS = {
  plain: {
    name: "plain text",
    bold: null, italic: null, strike: null, code: null, underline: null,
    heading: "plain", link: "paren", nest: 2, quote: false, codeBlock: "plain",
    codeFlush: false, table: "dash", hardBreak: "\n", hr: "",
  },
  whatsapp: {
    name: "WhatsApp formatting",
    bold: ["*", "*"], italic: ["_", "_"], strike: ["~", "~"], code: ["`", "`"], underline: null,
    heading: "bold", link: "paren", nest: 2, quote: true, codeBlock: "fence",
    codeFlush: true, table: TABLE_WIDTH_BUDGET, hardBreak: "\n", hr: "---",
  },
  slack: {
    name: "Slack formatting",
    bold: ["*", "*"], italic: ["_", "_"], strike: ["~", "~"], code: ["`", "`"], underline: null,
    heading: "bold", link: "paren", nest: 2, quote: true, codeBlock: "fence",
    codeFlush: false, table: 60, hardBreak: "\n", hr: "",
  },
  telegram: {
    name: "Telegram formatting",
    bold: B2, italic: ["__", "__"], strike: ["~~", "~~"], code: ["`", "`"], underline: null,
    heading: "bold", link: "markdown", nest: 2, quote: false, codeBlock: "fence",
    codeFlush: false, table: TABLE_WIDTH_BUDGET, hardBreak: "\n", hr: "",
  },
  discord: {
    name: "Discord formatting",
    bold: B2, italic: ["*", "*"], strike: ["~~", "~~"], code: ["`", "`"], underline: ["__", "__"],
    heading: "hash", maxHeading: 3, link: "markdown", nest: 2, quote: true, codeBlock: "fence-lang",
    codeFlush: false, table: TABLE_WIDTH_BUDGET, hardBreak: "\n", hr: "",
  },
  reddit: {
    name: "Reddit Markdown",
    bold: B2, italic: ["*", "*"], strike: ["~~", "~~"], code: ["`", "`"], underline: null,
    heading: "hash", maxHeading: 6, link: "markdown", nest: 4, quote: true, codeBlock: "indent",
    codeFlush: false, table: "gfm", hardBreak: "  \n", hr: "---",
  },
  markdown: {
    name: "Markdown",
    bold: B2, italic: ["*", "*"], strike: ["~~", "~~"], code: ["`", "`"], underline: null,
    heading: "hash", maxHeading: 6, link: "markdown", nest: "marker", quote: true, codeBlock: "fence-lang",
    codeFlush: false, table: "gfm", hardBreak: "  \n", hr: "---",
  },
};

// -- tag tree -----------------------------------------------------------------
const VOID_TAGS = /^(br|hr|img|input|meta|link|wbr|col|source)$/;
const BLOCK_TAGS = /^(p|h[1-6]|ul|ol|li|blockquote|pre|table|thead|tbody|tfoot|tr|hr|div|section|article|header|footer|aside|nav|figure|figcaption|details|summary|dl|dt|dd|center)$/;

function attr(tag, name) {
  const m = tag.match(new RegExp("\\s" + name + "\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s>]+))", "i"));
  return m ? decodeEntities(m[1] ?? m[2] ?? m[3]) : "";
}

// Tolerant tree builder: a stray close tag is ignored, an unclosed element is
// closed by its parent's close tag. Comments, <script> and <style> are dropped.
function parseTree(html) {
  const root = { name: "#root", children: [] };
  const stack = [root];
  const re = /<!--[\s\S]*?-->|<(script|style)\b[\s\S]*?<\/\1\s*>|<(\/?)([a-zA-Z][\w-]*)([^>]*)>|([^<]+|<)/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const top = stack[stack.length - 1];
    if (m[5] !== undefined) { top.children.push({ text: m[5] }); continue; }
    if (!m[3]) continue;
    const name = m[3].toLowerCase();
    if (m[2]) {
      const i = stack.findLastIndex((n) => n.name === name);
      if (i > 0) stack.length = i;
      continue;
    }
    const node = { name, tag: m[0], children: [] };
    top.children.push(node);
    if (!VOID_TAGS.test(name) && !m[4].endsWith("/")) stack.push(node);
  }
  return root;
}

const textOf = (node) => node.text !== undefined ? node.text : node.children.map(textOf).join("");
const BR = { name: "br", children: [] };
const LIST = /^(ul|ol)$/;

// -- rendering ----------------------------------------------------------------
function makeRenderer(spec) {
  const wrap = (marks, s) => marks && s.trim() ? marks[0] + s + marks[1] : s;

  // Inline content: <br> is a hard break, source newlines are spaces (marked
  // emits a <br> for every kept break), unknown tags reduce to their text.
  function inline(nodes) {
    const walk = (n) => {
      if (n.text !== undefined) return decodeEntities(n.text.replace(/\n/g, " "));
      const inner = () => n.children.map(walk).join("");
      switch (n.name) {
        case "br": return "\n";
        case "img": return attr(n.tag, "alt");
        case "strong": case "b": return wrap(spec.bold, inner());
        case "em": case "i": return wrap(spec.italic, inner());
        case "del": case "s": case "strike": return wrap(spec.strike, inner());
        case "u": return wrap(spec.underline, inner());
        case "code": return wrap(spec.code, decodeEntities(textOf(n)));
        case "a": {
          const href = attr(n.tag, "href");
          const t = inner().trim();
          if (!href || t === href) return t;
          if (!t) return href;
          return spec.link === "markdown" ? `[${t}](${href})` : `${t} (${href})`;
        }
        default: return LIST.test(n.name) ? "" : inner();
      }
    };
    return nodes.map(walk).join("").replace(/ *\n */g, "\n").trim().replace(/\n/g, spec.hardBreak);
  }

  function renderList(list, indent) {
    const ordered = list.name === "ol";
    let n = ordered ? parseInt(attr(list.tag, "start"), 10) || 1 : 1;
    const lines = [];
    for (const li of list.children) {
      if (li.name !== "li") continue;
      const marker = ordered ? `${n++}. ` : "- ";
      // A loose item wraps its text in <p>; flatten those to inline runs.
      const flat = li.children.flatMap((c) => c.name === "p" ? [...c.children, BR] : [c]);
      const text = inline(flat).replace(/\n/g, "\n" + indent + " ".repeat(marker.length));
      lines.push(indent + marker + text);
      const step = spec.nest === "marker" ? marker.length : spec.nest;
      for (const c of li.children) if (LIST.test(c.name)) lines.push(renderList(c, indent + " ".repeat(step)));
    }
    return lines.join("\n");
  }

  function renderTable(node) {
    const rows = [];
    const collect = (n) => {
      if (n.name === "tr") {
        const cells = n.children.filter((c) => c.name === "td" || c.name === "th").map((c) => inline(c.children));
        if (cells.length) rows.push(cells);
      } else (n.children || []).forEach(collect);
    };
    collect(node);
    if (!rows.length) return "";
    if (spec.table === "dash") return rows.map((r) => r.join(" - ")).join("\n");
    if (spec.table === "gfm") {
      const line = (r) => "| " + r.map((c) => c.replace(/\|/g, "\\|")).join(" | ") + " |";
      return [line(rows[0]), line(rows[0].map(() => "---")), ...rows.slice(1).map(line)].join("\n");
    }
    const grid = formatTableRows(rows);
    return grid.every((l) => lineWidth(l) <= spec.table)
      ? "```\n" + grid.join("\n") + "\n```"
      : stackTableRows(rows, spec.bold ? spec.bold[0] : "");
  }

  function renderCode(node) {
    const code = decodeEntities(textOf(node)).replace(/\n+$/, "");
    if (spec.codeBlock === "plain") return code;
    if (spec.codeBlock === "indent") return code.replace(/^/gm, "    ");
    const lang = spec.codeBlock === "fence-lang" ? (node.children.find((c) => c.name === "code")?.tag.match(/language-([\w+-]+)/)?.[1] ?? "") : "";
    return "```" + lang + "\n" + code + "\n```";
  }

  function renderHeading(node) {
    const text = inline(node.children);
    if (spec.heading === "hash") return "#".repeat(Math.min(Number(node.name[1]), spec.maxHeading)) + " " + text;
    return spec.heading === "bold" ? wrap(spec.bold, text) : text;
  }

  function renderBlock(node) {
    const name = node.name;
    if (LIST.test(name)) return renderList(node, "");
    if (name === "pre") return renderCode(node);
    if (name === "hr") return spec.hr;
    if (name === "table") return renderTable(node);
    if (/^h[1-6]$/.test(name)) return renderHeading(node);
    if (name === "p") return inline(node.children);
    if (name === "blockquote") {
      const body = renderBlocks(node.children);
      return spec.quote ? body.split("\n").map((l) => (l ? "> " + l : ">")).join("\n") : body;
    }
    return renderBlocks(node.children);
  }

  // Consecutive inline nodes form one paragraph; each block element is its own
  // block; blocks are separated by one blank line (none around a flush code block).
  function renderBlocks(nodes) {
    const blocks = [];
    let run = [];
    const flush = () => { if (run.length) blocks.push({ text: inline(run), code: false }); run = []; };
    for (const n of nodes) {
      if (n.name && BLOCK_TAGS.test(n.name)) { flush(); blocks.push({ text: renderBlock(n), code: n.name === "pre" }); }
      else run.push(n);
    }
    flush();
    const kept = blocks.filter((b) => b.text.trim());
    return kept.map((b, i) => (i === 0 ? "" : spec.codeFlush && (b.code || kept[i - 1].code) ? "\n" : "\n\n") + b.text).join("");
  }

  return (html) => renderBlocks(parseTree(html || "").children).replace(/\s+$/, "");
}

export const renderDialect = (html, spec) => makeRenderer(spec)(html);
