import { test, expect, describe } from "bun:test";
import { writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseFragment, validateFragment } from "../scripts/parse";
import { build } from "../scripts/build";

async function withFragment(name: string, content: string, fn: (path: string) => Promise<void>) {
  const dir = await mkdtemp(join(tmpdir(), "msg-test-"));
  const path = join(dir, name);
  await writeFile(path, content, "utf-8");
  try {
    await fn(path);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

describe("validateFragment", () => {
  test("passes a clean fragment", () => {
    expect(validateFragment({ to: "a@b.com", subject: "Hi" } as never, "Body")).toEqual([]);
  });

  test("flags an em dash in the body", () => {
    const errs = validateFragment({ to: "a@b.com", subject: "Hi" } as never, "text — more");
    expect(errs.some((e) => /dash/i.test(e))).toBe(true);
  });

  test("flags an en dash in the subject", () => {
    const errs = validateFragment({ to: "a@b.com", subject: "Q1 – Q2" } as never, "Body");
    expect(errs.some((e) => /dash/i.test(e))).toBe(true);
  });

  test("flags the Windows-1252 mojibake em dash", () => {
    const errs = validateFragment({ to: "a@b.com", subject: "Hi" } as never, "cost â more");
    expect(errs.some((e) => /dash/i.test(e))).toBe(true);
  });
});

describe("parseFragment", () => {
  test("parses CRLF frontmatter (L4)", async () => {
    const crlf = "---\r\nto: a@b.com\r\nsubject: Hi\r\n---\r\nBody line\r\n";
    await withFragment("crlf.fragment.md", crlf, async (p) => {
      const { meta } = await parseFragment(p);
      expect(meta.to).toBe("a@b.com");
      expect(meta.subject).toBe("Hi");
    });
  });

  test("single newline in a paragraph is a line break (sign-off stays two lines)", async () => {
    const frag = "---\nto: a@b.com\nsubject: Hi\n---\n\nHello.\n\nBest,\nAlex\n";
    await withFragment("signoff.fragment.md", frag, async (p) => {
      const { bodyHtml } = await parseFragment(p);
      expect(bodyHtml).toContain("Best,<br>Alex");
    });
  });
});

describe("build injection", () => {
  test("preserves $-sequences in body/subject (C2)", async () => {
    const frag = "---\nto: a@b.com\nsubject: Budget in $'000s and $& signs\n---\n\nTracked in $'000s here.\n";
    await withFragment("dollar.fragment.md", frag, async (p) => {
      const { html } = await build(p);
      expect(html).toContain("Tracked in $&#39;000s here.");
      expect(html).toContain("Budget in $&#39;000s and $&amp; signs");
    });
  });

  test("inlines the client helpers and consumes the marker", async () => {
    const frag = "---\nto: a@b.com\nsubject: Hi\n---\n\nHello.\n";
    await withFragment("inj.fragment.md", frag, async (p) => {
      const { html } = await build(p);
      expect(html).toContain("function buildMailto");
      expect(html).toContain("function htmlToWhatsApp");
      expect(html).not.toContain("INJECT:CLIENT_JS");
      expect(html).not.toContain("export function");
    });
  });
});
