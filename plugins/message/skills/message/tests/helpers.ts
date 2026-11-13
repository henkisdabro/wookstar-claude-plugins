import { writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseFragment } from "../scripts/parse";

// Run a Markdown body through the real fragment parser and return marked's
// HTML - the exact input every payload is built from.
export async function fragmentHtml(body: string, frontmatter = "to: a@example.com\nsubject: Test"): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "msg-frag-"));
  const path = join(dir, "f.fragment.md");
  await writeFile(path, `---\n${frontmatter}\n---\n\n${body}\n`, "utf-8");
  try {
    return (await parseFragment(path)).bodyHtml;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
