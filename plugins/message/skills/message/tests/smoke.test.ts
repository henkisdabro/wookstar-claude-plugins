import { test, expect } from "bun:test";
import { mkdtemp, cp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, basename } from "node:path";
import { build } from "../scripts/build";

const FIXTURES = [
  "/Users/Henrik/claudecode/lifeos/data/writing/email_drafts/2026-02-13_smiljka_contract-response.fragment.md",
  "/Users/Henrik/claudecode/lifeos/data/writing/email_drafts/2026-02-13_stuart_markdown-test.fragment.md",
];

async function buildInScratch(fixture: string) {
  const dir = await mkdtemp(join(tmpdir(), "msgv2-test-"));
  const scratch = join(dir, basename(fixture));
  await cp(fixture, scratch);
  try {
    const result = await build(scratch);
    return { dir, result };
  } catch (e) {
    await rm(dir, { recursive: true, force: true });
    throw e;
  }
}

for (const fixture of FIXTURES) {
  test(`builds ${basename(fixture)}`, async () => {
    const { dir, result } = await buildInScratch(fixture);
    try {
      expect(result.meta.to).toBeTruthy();
      expect(result.meta.subject).toBeTruthy();
      expect(result.gmailBody.length).toBeGreaterThan(10);
      expect(result.outlookBody.length).toBeGreaterThan(10);
      expect(result.html).toContain('id="gmail-body"');
      expect(result.html).toContain('id="outlook-body"');
      expect(result.html).toContain('id="whatsapp-raw"');
      expect(result.html).not.toContain("<!-- INJECT:");
      expect(result.html).toContain(result.meta.subject);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
}

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
  const dir = await mkdtemp(join(tmpdir(), "msgv2-test-"));
  const scratch = join(dir, "strike.fragment.md");
  await Bun.write(
    scratch,
    "---\nto: a@b.com\nsubject: test\n---\n\nThis is ~~struck~~ text.",
  );
  try {
    const result = await build(scratch);
    expect(result.gmailBody).toContain("<strike>struck</strike>");
    expect(result.outlookBody).toContain("<strike>struck</strike>");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
