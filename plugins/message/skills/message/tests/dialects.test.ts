import { test, expect, describe } from "bun:test";
import { writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseFragment } from "../scripts/parse";
import { renderDialect, DIALECTS } from "../scripts/client/dialects.js";

// One rich fixture through the real parser, asserted against every dialect.
const FIXTURE = [
  "# Weekly update",
  "",
  "Hello **team**, a *quick* note with ~~old~~ news and `npm test`.",
  "Second line of the paragraph.",
  "",
  "> Quoted line",
  "> second line",
  "",
  "- Item one",
  "  - Nested item",
  "- Item [docs](https://example.com/docs)",
  "",
  "1. First",
  "2. Second",
  "",
  "```js",
  "const x = 1;",
  "```",
  "",
  "| Name | Qty |",
  "|---|---|",
  "| Apples | 3 |",
].join("\n");

async function html(body: string): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "msg-dialect-"));
  const path = join(dir, "d.fragment.md");
  await writeFile(path, `---\nchannel: markdown\n---\n\n${body}\n`, "utf-8");
  try {
    return (await parseFragment(path)).bodyHtml;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
const render = async (id: string, body = FIXTURE) => renderDialect(await html(body), DIALECTS[id]);

const EXPECTED: Record<string, string> = {
  plain: [
    "Weekly update",
    "",
    "Hello team, a quick note with old news and npm test.",
    "Second line of the paragraph.",
    "",
    "Quoted line",
    "second line",
    "",
    "- Item one",
    "  - Nested item",
    "- Item docs (https://example.com/docs)",
    "",
    "1. First",
    "2. Second",
    "",
    "const x = 1;",
    "",
    "Name - Qty",
    "Apples - 3",
  ].join("\n"),
  whatsapp: [
    "*Weekly update*",
    "",
    "Hello *team*, a _quick_ note with ~old~ news and `npm test`.",
    "Second line of the paragraph.",
    "",
    "> Quoted line",
    "> second line",
    "",
    "- Item one",
    "  - Nested item",
    "- Item docs (https://example.com/docs)",
    "",
    "1. First",
    "2. Second",
    "```",
    "const x = 1;",
    "```",
    "```",
    "Name    Qty",
    "------  ---",
    "Apples    3",
    "```",
  ].join("\n"),
  slack: [
    "*Weekly update*",
    "",
    "Hello *team*, a _quick_ note with ~old~ news and `npm test`.",
    "Second line of the paragraph.",
    "",
    "> Quoted line",
    "> second line",
    "",
    "- Item one",
    "  - Nested item",
    "- Item docs (https://example.com/docs)",
    "",
    "1. First",
    "2. Second",
    "",
    "```",
    "const x = 1;",
    "```",
    "",
    "```",
    "Name    Qty",
    "------  ---",
    "Apples    3",
    "```",
  ].join("\n"),
  telegram: [
    "**Weekly update**",
    "",
    "Hello **team**, a __quick__ note with ~~old~~ news and `npm test`.",
    "Second line of the paragraph.",
    "",
    "Quoted line",
    "second line",
    "",
    "- Item one",
    "  - Nested item",
    "- Item [docs](https://example.com/docs)",
    "",
    "1. First",
    "2. Second",
    "",
    "```",
    "const x = 1;",
    "```",
    "",
    "```",
    "Name    Qty",
    "------  ---",
    "Apples    3",
    "```",
  ].join("\n"),
  discord: [
    "# Weekly update",
    "",
    "Hello **team**, a *quick* note with ~~old~~ news and `npm test`.",
    "Second line of the paragraph.",
    "",
    "> Quoted line",
    "> second line",
    "",
    "- Item one",
    "  - Nested item",
    "- Item [docs](https://example.com/docs)",
    "",
    "1. First",
    "2. Second",
    "",
    "```js",
    "const x = 1;",
    "```",
    "",
    "```",
    "Name    Qty",
    "------  ---",
    "Apples    3",
    "```",
  ].join("\n"),
  reddit: [
    "# Weekly update",
    "",
    "Hello **team**, a *quick* note with ~~old~~ news and `npm test`.  ",
    "Second line of the paragraph.",
    "",
    "> Quoted line  ",
    "> second line",
    "",
    "- Item one",
    "    - Nested item",
    "- Item [docs](https://example.com/docs)",
    "",
    "1. First",
    "2. Second",
    "",
    "    const x = 1;",
    "",
    "| Name | Qty |",
    "| --- | --- |",
    "| Apples | 3 |",
  ].join("\n"),
  markdown: [
    "# Weekly update",
    "",
    "Hello **team**, a *quick* note with ~~old~~ news and `npm test`.  ",
    "Second line of the paragraph.",
    "",
    "> Quoted line  ",
    "> second line",
    "",
    "- Item one",
    "  - Nested item",
    "- Item [docs](https://example.com/docs)",
    "",
    "1. First",
    "2. Second",
    "",
    "```js",
    "const x = 1;",
    "```",
    "",
    "| Name | Qty |",
    "| --- | --- |",
    "| Apples | 3 |",
  ].join("\n"),
};

describe("every dialect renders the shared rich fixture", () => {
  for (const [id, expected] of Object.entries(EXPECTED)) {
    test(id, async () => {
      expect(await render(id)).toBe(expected);
    });
  }

  test("every dialect spec has a fixture expectation", () => {
    expect(Object.keys(DIALECTS).sort()).toEqual(Object.keys(EXPECTED).sort());
  });
});

describe("dialect details", () => {
  test("Discord caps headings at three hashes", async () => {
    expect(await render("discord", "#### Deep heading")).toBe("### Deep heading");
  });

  test("bare-url links collapse in markup dialects", async () => {
    expect(await render("discord", "https://example.com")).toBe("https://example.com");
    expect(await render("markdown", "[https://example.com](https://example.com)")).toBe("https://example.com");
  });

  test("Markdown nests under an ordered item by the marker width", async () => {
    expect(await render("markdown", "1. a\n   - b\n2. c")).toBe("1. a\n   - b\n2. c");
  });

  test("Reddit and Markdown keep the language-free fence content verbatim", async () => {
    expect(await render("markdown", "```\na *b* c\n```")).toBe("```\na *b* c\n```");
  });

  test("raw <u> becomes Discord underline, plain text elsewhere", async () => {
    expect(await render("discord", "x <u>under</u> y")).toBe("x __under__ y");
    expect(await render("slack", "x <u>under</u> y")).toBe("x under y");
  });

  test("dialects introduce no em or en dash", async () => {
    for (const id of Object.keys(DIALECTS)) expect(await render(id)).not.toMatch(new RegExp("[" + String.fromCharCode(0x2013, 0x2014) + "]"));
  });

  test("Slack keeps a grid up to its wider desktop budget, WhatsApp stacks", async () => {
    const wide = "| Channel | Budget | Spend | Status |\n|---|---|---|---|\n| Search | $6,000 | $5,412 | Live |";
    expect((await render("slack", wide)).startsWith("```")).toBe(true);
    expect(await render("whatsapp", wide)).toBe("*Search*\nBudget: $6,000\nSpend: $5,412\nStatus: Live");
  });
});
