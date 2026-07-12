import { test, expect } from "bun:test";
import { transformGmail } from "../scripts/transform-gmail";
import { transformOutlook } from "../scripts/transform-outlook";

test("headings: h1 styled for Gmail", () => {
  const result = transformGmail("<h1>Hi</h1>");
  expect(result).toContain('<font size="6"><b>Hi</b>');
});

test("headings: h1 styled for Outlook", () => {
  const result = transformOutlook("<h1>Hi</h1>");
  expect(result).toContain("font-size: 14pt");
  expect(result).toContain("font-weight: bold");
});

test("bold/italic/strikethrough: Gmail uses legacy tags", () => {
  const result = transformGmail(
    "<strong>bold</strong> <em>italic</em> <del>gone</del>",
  );
  expect(result).toContain("<b>bold</b>");
  expect(result).toContain("<i>italic</i>");
  expect(result).toContain("<strike>gone</strike>");
});

test("bold/italic/strikethrough: Outlook keeps strong/em, converts del", () => {
  const result = transformOutlook(
    "<strong>bold</strong> <em>italic</em> <del>gone</del>",
  );
  expect(result).toContain("<strong>bold</strong>");
  expect(result).toContain("<em>italic</em>");
  expect(result).toContain("<strike>gone</strike>");
});

test("links: plain anchor gets brand colour in Gmail", () => {
  const result = transformGmail('<a href="https://x.com">x</a>');
  expect(result).toContain("rgb(17, 85, 204)");
  expect(result).toContain('href="https://x.com"');
});

test("links: plain anchor gets brand colour in Outlook", () => {
  const result = transformOutlook('<a href="https://x.com">x</a>');
  expect(result).toContain("#0563c1");
  expect(result).toContain('href="https://x.com"');
});

test("links: anchor with href not first attribute still styled in Gmail (BUG 2 regression)", () => {
  const result = transformGmail(
    '<a target="_blank" href="https://x.com">x</a>',
  );
  expect(result).toContain("rgb(17, 85, 204)");
  expect(result).toContain('href="https://x.com"');
});

test("links: anchor with href not first attribute still styled in Outlook", () => {
  const result = transformOutlook(
    '<a target="_blank" href="https://x.com">x</a>',
  );
  expect(result).toContain("#0563c1");
  expect(result).toContain('href="https://x.com"');
});

test("tables: plain table/td get styled in Gmail", () => {
  const result = transformGmail("<table><tr><td>a</td></tr></table>");
  expect(result).toContain('border="1"');
  expect(result).toContain("border: 1px solid #999999; padding: 8px;");
});

test("tables: plain table/td get styled in Outlook", () => {
  const result = transformOutlook("<table><tr><td>a</td></tr></table>");
  expect(result).toContain('border="1"');
  expect(result).toContain("border: 1px solid #999999; padding: 8pt;");
});

test("tables: header cells get light grey background, content cells do not (Gmail)", () => {
  const result = transformGmail("<table><tr><th>H</th></tr><tr><td>a</td></tr></table>");
  expect(result).toMatch(/<th style="[^"]*background-color: #f2f2f2;[^"]*">H<\/th>/);
  expect(result).not.toMatch(/<td[^>]*background-color/);
});

test("tables: header cells get light grey background, content cells do not (Outlook)", () => {
  const result = transformOutlook("<table><tr><th>H</th></tr><tr><td>a</td></tr></table>");
  expect(result).toMatch(/<th style="[^"]*background-color: #f2f2f2;[^"]*">H<\/th>/);
  expect(result).not.toMatch(/<td[^>]*background-color/);
});

test("tables: user-styled td is left untouched in Gmail (BUG 1 regression)", () => {
  const input = '<table><tr><td style="color:red" colspan="2">a</td></tr></table>';
  const result = transformGmail(input);
  expect(result).toContain('style="color:red" colspan="2"');
});

test("tables: user-styled td is left untouched in Outlook (BUG 1 regression)", () => {
  const input = '<table><tr><td style="color:red" colspan="2">a</td></tr></table>';
  const result = transformOutlook(input);
  expect(result).toContain('style="color:red" colspan="2"');
});

test("tables: user-styled table survives in Gmail", () => {
  const result = transformGmail('<table style="width:100%"><tr><td>a</td></tr></table>');
  expect(result).toContain('<table style="width:100%">');
});

test("tables: user-styled table survives in Outlook", () => {
  const result = transformOutlook('<table style="width:100%"><tr><td>a</td></tr></table>');
  expect(result).toContain('<table style="width:100%">');
});

test("code: inline code styled in Gmail", () => {
  const result = transformGmail("<code>x</code>");
  expect(result).toContain('<font face="monospace">');
});

test("code: inline code styled in Outlook", () => {
  const result = transformOutlook("<code>x</code>");
  expect(result).toContain("Courier New");
});

test("lists: NO spacer before or after a list in Gmail (Gmail's own list margins provide the gap)", () => {
  const result = transformGmail("<p>Intro:</p>\n<ul>\n<li>a</li>\n</ul>\n<p>Best,<br>Alex</p>");
  expect(result).not.toContain("<div><br></div>");
});

test("paragraphs: consecutive paragraphs get one blank-line spacer in Gmail", () => {
  const result = transformGmail("<p>one</p>\n<p>two</p>\n<p>Best,<br>Alex</p>");
  expect(result).toBe(
    "<div>one</div>\n<div><br></div>\n<div>two</div>\n<div><br></div>\n<div>Best,<br>Alex</div>",
  );
});

test("headings: text sits flush under a heading in Gmail, spacer still precedes the heading", () => {
  const result = transformGmail("<p>intro</p>\n<h2>Section</h2>\n<p>body</p>");
  expect(result).toContain('</div>\n<div><br></div>\n<div><font size="4"><b>Section</b></font></div>');
  expect(result).toContain("</font></div>\n<div>body</div>");
});

test("hr: paragraphs separated by a stripped <hr> keep their spacer in Gmail", () => {
  const result = transformGmail("<p>a</p>\n<hr>\n<p>b</p>");
  expect(result).toBe("<div>a</div>\n<div><br></div>\n<div>b</div>");
});

test("lists: blank-line spacer before and after a list in Outlook", () => {
  const result = transformOutlook("<p>Intro:</p>\n<ul>\n<li>a</li>\n</ul>\n<p>Best,<br>Alex</p>");
  const spacers = result.match(/&nbsp;/g) || [];
  expect(spacers.length).toBe(2);
});

test("paragraphs: consecutive paragraphs get exactly one spacer each in Outlook (sign-off case)", () => {
  const result = transformOutlook("<p>one</p>\n<p>two</p>\n<p>Best,<br>Alex</p>");
  const spacers = result.match(/&nbsp;/g) || [];
  expect(spacers.length).toBe(2);
  expect(result).toMatch(/two<\/p>\n<p style="[^"]*margin: 0;">&nbsp;<\/p>\n<p style="[^"]*">Best,<br>Alex<\/p>/);
});

test("headings: text sits flush under a heading in Outlook, spacer still precedes the heading", () => {
  const result = transformOutlook("<p>intro</p>\n<h2>Section</h2>\n<p>body</p>");
  const spacers = result.match(/&nbsp;/g) || [];
  expect(spacers.length).toBe(1);
  expect(result).toMatch(/&nbsp;<\/p>\n<p style="[^"]*font-weight: bold[^"]*">Section<\/p>/);
  expect(result).toMatch(/Section<\/p>\n<p style="[^"]*">body<\/p>/);
});

test("hr: paragraphs separated by a stripped <hr> keep their spacer in Outlook", () => {
  const result = transformOutlook("<p>a</p>\n<hr>\n<p>b</p>");
  const spacers = result.match(/&nbsp;/g) || [];
  expect(spacers.length).toBe(1);
});

test("lists: nested list gets no spacer inside the parent item in Gmail", () => {
  const result = transformGmail("<ul>\n<li>outer\n<ul>\n<li>inner</li>\n</ul>\n</li>\n</ul>");
  expect(result).not.toContain("outer\n<div><br></div>");
});

test("code blocks: newlines become <br> in Gmail (multi-line block stays multi-line)", () => {
  const result = transformGmail("<pre><code>line one\nline two\n</code></pre>");
  expect(result).toContain("line one<br>line two");
  expect(result).not.toContain("line two<br></font>");
});

test("code blocks: newlines become <br> in Outlook", () => {
  const result = transformOutlook("<pre><code>line one\nline two\n</code></pre>");
  expect(result).toContain("line one<br>line two");
});

test("dash sanity: Gmail transform does not introduce em/en dashes", () => {
  const result = transformGmail("<p>Hello world</p>");
  expect(result).not.toContain("–");
  expect(result).not.toContain("—");
});

test("dash sanity: Outlook transform does not introduce em/en dashes", () => {
  const result = transformOutlook("<p>Hello world</p>");
  expect(result).not.toContain("–");
  expect(result).not.toContain("—");
});
