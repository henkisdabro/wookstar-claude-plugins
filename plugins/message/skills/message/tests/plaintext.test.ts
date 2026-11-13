import { test, expect, describe } from "bun:test";
import { writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseFragment } from "../scripts/parse";
import { build } from "../scripts/build";
import { htmlToPlainText } from "../scripts/client/plaintext.js";

// Drive every case through the real fragment parser, so the tests exercise the
// exact HTML the preview's Copy Plain Text button receives.
async function plain(body: string, frontmatter = "to: a@example.com\nsubject: Test"): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "msg-plain-"));
  const path = join(dir, "draft.fragment.md");
  await writeFile(path, `---\n${frontmatter}\n---\n\n${body}\n`, "utf-8");
  try {
    const { bodyHtml } = await parseFragment(path);
    return htmlToPlainText(bodyHtml);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

// Formatting characters that must never survive into plain text.
function expectNoMarkup(out: string) {
  expect(out).not.toMatch(/\*\*|(^|\s)\*\S|\S\*(\s|$)/m);
  expect(out).not.toMatch(/(^|\s)_\S|\S_(\s|$)/m);
  expect(out).not.toContain("`");
  expect(out).not.toMatch(/^#{1,6} /m);
  expect(out).not.toContain("~~");
  expect(out).not.toMatch(/^>/m);
  expect(out).not.toContain("](");
  expect(out).not.toMatch(/<\/?[a-z][^>]*>/i);
}

describe("htmlToPlainText inline formatting", () => {
  test("bold, italic, strike and code spans reduce to their text", async () => {
    const out = await plain("**bold** *star* _under_ ~~gone~~ `code`");
    expect(out).toBe("bold star under gone code");
    expectNoMarkup(out);
  });

  test("snake_case and literal asterisks inside a code span are kept as text", async () => {
    expect(await plain("Run `my_var * 2` now")).toBe("Run my_var * 2 now");
  });
});

describe("htmlToPlainText headings", () => {
  test("heading drops its marks and sits on its own line", async () => {
    expect(await plain("# Big news\nThe body")).toBe("Big news\n\nThe body");
    expect(await plain("Intro\n\n### Small heading\n\nMore")).toBe("Intro\n\nSmall heading\n\nMore");
  });
});

describe("htmlToPlainText links", () => {
  test("text link becomes text (url)", async () => {
    expect(await plain("See [the docs](https://example.com/docs)")).toBe("See the docs (https://example.com/docs)");
  });

  test("link whose text is the url becomes just the url", async () => {
    expect(await plain("[https://example.com](https://example.com)")).toBe("https://example.com");
    expect(await plain("Visit https://example.com today")).toBe("Visit https://example.com today");
  });

  test("ampersands in an href decode once", async () => {
    expect(await plain("[go](https://example.com/?a=1&b=2)")).toBe("go (https://example.com/?a=1&b=2)");
  });

  test("formatted link text is stripped too", async () => {
    expect(await plain("[**bold link**](https://example.com)")).toBe("bold link (https://example.com)");
  });
});

describe("htmlToPlainText lists", () => {
  test("unordered items use dashes", async () => {
    expect(await plain("- one\n- two\n* three")).toBe("- one\n- two\n\n- three");
  });

  test("ordered items keep their numbers, including a custom start", async () => {
    expect(await plain("1. first\n2. second")).toBe("1. first\n2. second");
    expect(await plain("3. third\n4. fourth")).toBe("3. third\n4. fourth");
  });

  test("nested items indent two spaces per level", async () => {
    expect(await plain("- a\n  - b\n    - c\n- d")).toBe("- a\n  - b\n    - c\n- d");
    expect(await plain("1. a\n   - b\n2. c")).toBe("1. a\n  - b\n2. c");
  });

  test("loose list items stay one line each", async () => {
    expect(await plain("- loose\n\n- items")).toBe("- loose\n- items");
  });

  test("inline formatting inside items is stripped", async () => {
    expect(await plain("- **bold** item\n- [link](https://example.com)")).toBe("- bold item\n- link (https://example.com)");
  });

  test("list separated from paragraphs by one blank line", async () => {
    expect(await plain("Before\n\n- a\n\nAfter")).toBe("Before\n\n- a\n\nAfter");
  });
});

describe("htmlToPlainText block quotes and code blocks", () => {
  test("block quote drops the > and keeps line breaks", async () => {
    expect(await plain("> quoted\n> more")).toBe("quoted\nmore");
    expect(await plain("Intro\n\n> one\n>\n> two\n\nOutro")).toBe("Intro\n\none\n\ntwo\n\nOutro");
  });

  test("code block drops the fences and keeps the code verbatim", async () => {
    expect(await plain("Run:\n\n```bash\nls -la\n  echo \"<hi>\" && exit\n```\n\nDone")).toBe(
      "Run:\n\nls -la\n  echo \"<hi>\" && exit\n\nDone",
    );
  });
});

describe("htmlToPlainText tables", () => {
  test("one line per row, cells joined with ' - '", async () => {
    const out = await plain("| Name | Count |\n|---|---|\n| **Apples** | 3 |\n| Pears & figs | 10 |");
    expect(out).toBe("Name - Count\nApples - 3\nPears & figs - 10");
  });
});

describe("htmlToPlainText raw HTML", () => {
  test("raw HTML reduces to its text", async () => {
    expect(await plain('<div align="center">Hello <b>there</b><br>friend</div>')).toBe("Hello there\nfriend");
    expect(await plain("Text with <span style=\"color:red\">inline</span> html")).toBe("Text with inline html");
  });

  test("HTML comments are dropped", async () => {
    expect(await plain("Keep<!-- hidden --> this")).toBe("Keep this");
  });
});

describe("htmlToPlainText paragraphs and characters", () => {
  test("single newline stays a line break; blank line stays one blank line", async () => {
    expect(await plain("Line one\nLine two\n\n\n\nNext para")).toBe("Line one\nLine two\n\nNext para");
  });

  test("long lines are never hard-wrapped", async () => {
    const long = "word ".repeat(80).trim();
    expect(await plain(long)).toBe(long);
  });

  test("frontmatter is left out", async () => {
    const out = await plain("Just the body", "to: a@example.com\nsubject: Hidden subject\ncc: c@example.com\nbcc: d@example.com");
    expect(out).toBe("Just the body");
  });

  test("emoji, punctuation and straight quotes pass through unchanged", async () => {
    const s = `Rocket 🚀 launch! It's "great" - isn't it? 50% off, $10 & more... (ok) 👍🏽`;
    expect(await plain(s)).toBe(s);
  });

  test("entities decode to their characters", async () => {
    expect(await plain("Tom & Jerry < Spike > cat")).toBe("Tom & Jerry < Spike > cat");
  });
});

describe("htmlToPlainText realistic social post", () => {
  const post = [
    "**Big news:** our new guide is live 🎉",
    "",
    "Three things it covers:",
    "- Setting up `config.yaml` in five minutes",
    "- Writing *cleaner* reports",
    "- Shipping on time",
    "",
    "Read it here: [the full guide](https://example.com/guide?ref=x&utm=social)",
    "",
    "#launch #writing",
  ].join("\n");

  test("converts to clean plain text", async () => {
    const out = await plain(post);
    expect(out).toBe([
      "Big news: our new guide is live 🎉",
      "",
      "Three things it covers:",
      "",
      "- Setting up config.yaml in five minutes",
      "- Writing cleaner reports",
      "- Shipping on time",
      "",
      "Read it here: the full guide (https://example.com/guide?ref=x&utm=social)",
      "",
      "#launch #writing",
    ].join("\n"));
  });

  test("leaves no formatting syntax behind (hashtags are text, not headings)", async () => {
    const out = await plain(post);
    expect(out).not.toContain("*");
    expect(out).not.toContain("`");
    expect(out).not.toContain("~~");
    expect(out).not.toContain("](");
    expect(out).not.toMatch(/^>/m);
    expect(out).not.toMatch(/<\/?[a-z][^>]*>/i);
    expectNoMarkup(out);
  });
});

describe("Copy Plain Text in the built preview", () => {
  test("the preview inlines htmlToPlainText and wires the P shortcut", async () => {
    const dir = await mkdtemp(join(tmpdir(), "msg-plain-"));
    const path = join(dir, "draft.fragment.md");
    await writeFile(path, "---\nto: a@example.com\nsubject: Hi\n---\n\nBody\n", "utf-8");
    try {
      const { html } = await build(path);
      expect(html).toContain("function htmlToPlainText(");
      expect(html).not.toMatch(/^\s*import\s/m);
      // P is the plain-text row's key in the destination registry; the shell
      // maps registry keys to select-and-copy.
      expect(html).toMatch(/id: "plain"[^\n]*key: "p"/);
      expect(html).toContain("d.key === k");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
