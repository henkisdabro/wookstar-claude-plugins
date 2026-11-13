import { test, expect, describe } from "bun:test";
import { renderDialect, DIALECTS } from "../scripts/client/dialects.js";

const htmlToWhatsApp = (html: string) => renderDialect(html, DIALECTS.whatsapp);

// Independent width model for verification - deliberately NOT the
// implementation's own counter, so the tests cannot mark their own homework.
const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
function measure(line: string) {
  let wide = 0, narrow = 0;
  for (const { segment } of seg.segment(line)) {
    const cp = segment.codePointAt(0)!;
    if (cp === 0xfe0f || cp === 0x200d || cp === 0x200b || (cp >= 0x0300 && cp <= 0x036f)) continue;
    const isWide = (cp >= 0x1100 && cp <= 0x115f) || (cp >= 0x2e80 && cp <= 0xa4cf) ||
      (cp >= 0xac00 && cp <= 0xd7a3) || (cp >= 0xf900 && cp <= 0xfaff) ||
      (cp >= 0xfe30 && cp <= 0xfe4f) || (cp >= 0xff00 && cp <= 0xff60) ||
      (cp >= 0xffe0 && cp <= 0xffe6) || (cp >= 0x20000 && cp <= 0x3fffd) || cp === 0x3000;
    if (/\p{Extended_Pictographic}/u.test(segment)) narrow += 2;
    else if (isWide) wide++;
    else narrow++;
  }
  return { wide, narrow };
}
// Display columns of a line: wide glyphs count two.
const width = (line: string) => { const m = measure(line); return 2 * m.wide + m.narrow; };
import { TABLE_WIDTH_BUDGET } from "../scripts/client/text-common.js";

describe("htmlToWhatsApp", () => {
  test("bold/italic/strike -> WhatsApp markers", () => {
    expect(htmlToWhatsApp("<strong>b</strong>")).toBe("*b*");
    expect(htmlToWhatsApp("<em>i</em>")).toBe("_i_");
    expect(htmlToWhatsApp("<del>s</del>")).toBe("~s~");
  });

  test("preserves link URL as text (url)", () => {
    expect(htmlToWhatsApp('<a href="https://x.com">click here</a>')).toBe("click here (https://x.com)");
  });

  test("bare-url link collapses to just the url", () => {
    expect(htmlToWhatsApp('<a href="https://x.com">https://x.com</a>')).toBe("https://x.com");
  });

  test("link with attributes before href still preserved", () => {
    expect(htmlToWhatsApp('<a target="_blank" href="https://x.com">go</a>')).toBe("go (https://x.com)");
  });

  test("unordered list -> dashes", () => {
    const out = htmlToWhatsApp("<ul><li>one</li><li>two</li></ul>");
    expect(out).toContain("- one");
    expect(out).toContain("- two");
  });

  test("ordered list -> numbers", () => {
    const out = htmlToWhatsApp("<ol><li>a</li><li>b</li></ol>");
    expect(out).toContain("1. a");
    expect(out).toContain("2. b");
  });

  test("heading -> bold line", () => {
    expect(htmlToWhatsApp("<h2>Title</h2>").trim()).toBe("*Title*");
  });

  test("decodes entities", () => {
    expect(htmlToWhatsApp("<p>Tom &amp; Jerry</p>")).toBe("Tom & Jerry");
    expect(htmlToWhatsApp("<p>a&nbsp;b</p>")).toBe("a b");
    expect(htmlToWhatsApp("<p>&#39;quoted&#39;</p>")).toBe("'quoted'");
  });

  test("collapses excess blank lines", () => {
    const out = htmlToWhatsApp("<p>a</p><p></p><p></p><p>b</p>");
    expect(out).toBe("a\n\nb");
  });

  test("introduces no em/en dash on clean input", () => {
    const out = htmlToWhatsApp("<p>plain - text</p>");
    expect(out).not.toMatch(/[–—]/);
  });

  test("code block sits flush against neighbouring paragraphs (no blank lines around fences)", () => {
    const out = htmlToWhatsApp("<p>before</p>\n<pre><code>x\ny\n</code></pre>\n<p>after</p>");
    expect(out).toBe("before\n```\nx\ny\n```\nafter");
  });

  test("code block at start/end of message leaks no sentinels or stray newlines", () => {
    expect(htmlToWhatsApp("<pre><code>x\n</code></pre>")).toBe("```\nx\n```");
    expect(htmlToWhatsApp("<pre><code>x\n</code></pre>\n<p>tail</p>")).toBe("```\nx\n```\ntail");
    expect(htmlToWhatsApp("<p>head</p>\n<pre><code>x\n</code></pre>")).toBe("head\n```\nx\n```");
  });

  test("table fences KEEP their blank-line separation from neighbouring paragraphs", () => {
    const out = htmlToWhatsApp("<p>before</p>\n<table><tr><td>a</td><td>b</td></tr></table>\n<p>after</p>");
    expect(out).toBe("before\n\n```\na  b\n```\n\nafter");
  });
});

describe("htmlToWhatsApp fixed-width tables", () => {
  const tableHtml = (rows: string[][]) =>
    "<table>" + rows.map((r) => "<tr>" + r.map((c) => "<td>" + c + "</td>").join("") + "</tr>").join("") + "</table>";

  const fenceLines = (out: string) => {
    const m = out.match(/```\n([\s\S]*?)\n```/);
    expect(m).not.toBeNull();
    return m![1].split("\n");
  };

  test("currency table: exact padded output, numerics right-aligned incl header", () => {
    const out = htmlToWhatsApp(tableHtml([
      ["Channel", "Budget", "Status"],
      ["Google", "$6,000", "Live"],
      ["Meta", "$4,500", "Paused"],
      ["Total", "$10,500", "-"],
    ]));
    expect(out).toBe([
      "```",
      "Channel   Budget  Status",
      "-------  -------  ------",
      "Google    $6,000  Live",
      "Meta      $4,500  Paused",
      "Total    $10,500  -",
      "```",
    ].join("\n"));
  });

  test("emoji cells: every content row has identical display composition", () => {
    const lines = fenceLines(htmlToWhatsApp(tableHtml([
      ["Ch", "Health", "Spend"],
      ["G", "✅ OK", "$600"],
      ["M", "⚠️ Low", "$450"],
      ["T", "🔴 Off", "$0"],
    ])));
    const content = lines.filter((l) => !/^[- ]+$/.test(l));
    expect(content.length).toBe(4);
    const ref = measure(content[0]);
    for (const line of content) expect(measure(line)).toEqual(ref);
  });

  test("CJK cells: composition padding with U+3000 equalises every row", () => {
    const lines = fenceLines(htmlToWhatsApp(tableHtml([
      ["Mkt", "Name", "Spend"],
      ["JP", "東京", "$200"],
      ["KR", "서울", "$150"],
      ["AU", "Paris", "$600"],
    ])));
    const content = lines.filter((l) => !/^[- ]+$/.test(l));
    expect(content.length).toBe(4);
    const ref = measure(content[0]);
    for (const line of content) expect(measure(line)).toEqual(ref);
    // Latin cells in the CJK column are padded with IDEOGRAPHIC SPACE, not 2x space
    expect(content.some((l) => l.includes("　"))).toBe(true);
  });

  test("entities decode before width is measured, gutters are two spaces", () => {
    const out = htmlToWhatsApp(tableHtml([["A", "B"], ["T&amp;Cs", "x"]]));
    expect(out).toContain("A     B");
    expect(out).toContain("T&Cs  x");
  });

  test("single-row table gets no divider; inline markup survives as markers", () => {
    const out = htmlToWhatsApp("<table><tr><td><strong>x</strong></td><td>y</td></tr></table>");
    expect(out).toBe("```\n*x*  y\n```");
  });

  test("table output introduces no em/en dash", () => {
    const out = htmlToWhatsApp(tableHtml([["a", "b"], ["c", "d"]]));
    expect(out).not.toMatch(/[–—]/);
  });
});

describe("htmlToWhatsApp tables on narrow phones", () => {
  const tableHtml = (rows: string[][]) =>
    "<table><thead><tr>" + rows[0].map((c) => "<th>" + c + "</th>").join("") + "</tr></thead><tbody>" +
    rows.slice(1).map((r) => "<tr>" + r.map((c) => "<td>" + c + "</td>").join("") + "</tr>").join("") +
    "</tbody></table>";

  const fenced = (out: string) => (out.match(/```\n([\s\S]*?)\n```/)?.[1] ?? "").split("\n").filter(Boolean);

  test("budget is a conservative phone-width figure", () => {
    expect(TABLE_WIDTH_BUDGET).toBeGreaterThanOrEqual(20);
    expect(TABLE_WIDTH_BUDGET).toBeLessThanOrEqual(30);
  });

  test("a table that fits keeps the aligned code-block grid unchanged", () => {
    const out = htmlToWhatsApp(tableHtml([["Item", "Qty"], ["Apples", "3"], ["Pears", "12"]]));
    expect(out).toBe("```\nItem    Qty\n------  ---\nApples    3\nPears    12\n```");
  });

  test("a table exactly at the budget stays a grid", () => {
    const a = "a".repeat(TABLE_WIDTH_BUDGET - 4);
    const out = htmlToWhatsApp(tableHtml([["H", "V"], [a, "xy"]]));
    expect(out.startsWith("```")).toBe(true);
    for (const l of fenced(out)) expect(width(l)).toBeLessThanOrEqual(TABLE_WIDTH_BUDGET);
  });

  test("a wide table stacks into one block per row, keeping every value", () => {
    const out = htmlToWhatsApp(tableHtml([
      ["Channel", "Budget", "Status", "Notes"],
      ["Search", "$6,000", "Live", "Brand and generic"],
      ["Social", "$4,500", "Paused", "Creative refresh due"],
    ]));
    expect(out).not.toContain("```");
    expect(out).toBe([
      "*Search*",
      "Budget: $6,000",
      "Status: Live",
      "Notes: Brand and generic",
      "",
      "*Social*",
      "Budget: $4,500",
      "Status: Paused",
      "Notes: Creative refresh due",
    ].join("\n"));
  });

  test("many columns stack rather than overflow", () => {
    const head = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const out = htmlToWhatsApp(tableHtml([head, head.map((h) => h.toLowerCase() + "1"), head.map((h) => h.toLowerCase() + "2")]));
    expect(out).not.toContain("```");
    for (const v of ["a1", "j1", "a2", "j2"]) expect(out).toContain(v);
    expect(out).toContain("J: j2");
  });

  test("long cell text is never truncated", () => {
    const long = "A long note that would never fit on a small phone screen in a grid";
    const out = htmlToWhatsApp(tableHtml([["Task", "Note"], ["Review", long]]));
    expect(out).toContain("Note: " + long);
    expect(out).not.toContain("```");
  });

  test("emoji count two columns, so an emoji table can tip into the stacked layout", () => {
    const narrow = htmlToWhatsApp(tableHtml([["S", "K"], ["✅", "ok"]]));
    expect(narrow.startsWith("```")).toBe(true);
    const cells = Math.floor(TABLE_WIDTH_BUDGET / 2); // emoji-only row just over the budget
    const row = Array.from({ length: 2 }, () => "🔴".repeat(Math.ceil(cells / 2)));
    const out = htmlToWhatsApp(tableHtml([["Left", "Right"], row]));
    expect(out).not.toContain("```");
    expect(out).toContain("Right: " + row[1]);
  });

  test("CJK cells are measured wide", () => {
    const out = htmlToWhatsApp(tableHtml([["Name", "City"], ["東京キャンペーン東京", "東京キャンペーン"]]));
    expect(out).not.toContain("```");
    expect(out).toContain("*東京キャンペーン東京*");
    expect(out).toContain("City: 東京キャンペーン");
  });

  test("stacked rows skip empty cells and do not double bold markers", () => {
    const out = htmlToWhatsApp(tableHtml([
      ["Name", "Status", "Comment"],
      ["<strong>First</strong>", "", "Something quite long to push the width over"],
    ]));
    expect(out).toBe("*First*\nComment: Something quite long to push the width over");
  });

  test("stacked table keeps blank-line separation from neighbours", () => {
    const out = htmlToWhatsApp("<p>before</p>\n" + tableHtml([["Key", "Value"], ["k", "x".repeat(40)]]) + "\n<p>after</p>");
    expect(out).toBe("before\n\n*k*\nValue: " + "x".repeat(40) + "\n\nafter");
  });

  test("grid output never exceeds the budget on any line", () => {
    const out = htmlToWhatsApp(tableHtml([["Ch", "Spend", "CPA"], ["Search", "$6,000", "$41"], ["Social", "$4,500", "$58"]]));
    expect(out.startsWith("```")).toBe(true);
    for (const l of fenced(out)) expect(width(l)).toBeLessThanOrEqual(TABLE_WIDTH_BUDGET);
  });
});
