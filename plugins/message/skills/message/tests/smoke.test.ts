import { test, expect } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { build } from "../scripts/build";

async function buildInline(content: string, name = "test.fragment.md") {
  const dir = await mkdtemp(join(tmpdir(), "msgv2-test-"));
  const scratch = join(dir, name);
  await Bun.write(scratch, content);
  try {
    const result = await build(scratch);
    return { dir, result };
  } catch (e) {
    await rm(dir, { recursive: true, force: true });
    throw e;
  }
}

test("builds a basic fragment", async () => {
  const { dir, result } = await buildInline(
    "---\nto: test@example.com\nsubject: Hello\n---\n\nHi there.\n\nBest,\nHenrik",
  );
  try {
    expect(result.meta.to).toBe("test@example.com");
    expect(result.meta.subject).toBe("Hello");
    expect(result.gmailBody.length).toBeGreaterThan(10);
    expect(result.outlookBody.length).toBeGreaterThan(10);
    expect(result.html).toContain('id="gmail-body"');
    expect(result.html).toContain('id="outlook-body"');
    expect(result.html).toContain('id="whatsapp-raw"');
    expect(result.html).not.toContain("<!-- INJECT:");
    expect(result.html).toContain("Hello");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("rejects fragment missing `to` frontmatter", async () => {
  const dir = await mkdtemp(join(tmpdir(), "msgv2-test-"));
  const scratch = join(dir, "bad.fragment.md");
  await Bun.write(scratch, "---\nsubject: test\n---\n\nbody text");
  try {
    await expect(build(scratch)).rejects.toThrow(/to/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("preserves strikethrough via GFM", async () => {
  const { dir, result } = await buildInline(
    "---\nto: a@b.com\nsubject: test\n---\n\nThis is ~~struck~~ text.",
  );
  try {
    expect(result.gmailBody).toContain("<strike>struck</strike>");
    expect(result.outlookBody).toContain("<strike>struck</strike>");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("injects cc and bcc when present", async () => {
  const { dir, result } = await buildInline(
    "---\nto: a@b.com\ncc: c@d.com\nbcc: e@f.com\nsubject: test\n---\n\nBody.",
  );
  try {
    expect(result.html).toContain("c@d.com");
    expect(result.html).toContain("e@f.com");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
