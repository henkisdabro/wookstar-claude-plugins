import { test, expect, describe } from "bun:test";
import { htmlToWhatsApp } from "../scripts/client/whatsapp.js";

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
      ["Channel", "Health", "Spend"],
      ["Google", "✅ OK", "$6,000"],
      ["Meta", "⚠️ Fatigue", "$4,500"],
      ["TikTok", "🔴 Off", "$0"],
    ])));
    const content = lines.filter((l) => !/^[- ]+$/.test(l));
    expect(content.length).toBe(4);
    const ref = measure(content[0]);
    for (const line of content) expect(measure(line)).toEqual(ref);
  });

  test("CJK cells: composition padding with U+3000 equalises every row", () => {
    const lines = fenceLines(htmlToWhatsApp(tableHtml([
      ["Market", "Name", "Spend"],
      ["Japan", "東京キャンペーン", "$2,000"],
      ["Korea", "서울", "$1,500"],
      ["Australia", "Paris", "$6,000"],
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
