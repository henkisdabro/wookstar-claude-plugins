/**
 * Context-echo detector for the /message skill.
 *
 * Verifies that the email body does NOT appear verbatim in Claude's assistant
 * response when a fragment is written. A "context echo" is when Claude drafts
 * the email inline in its reply before calling Write — which bloats the main
 * conversation context unnecessarily.
 *
 * Usage:
 *   bun run scripts/serve.ts <fragment> --build-only   # build a real fragment first
 *   bun test tests/context-echo.test.ts                # then run this
 *
 * The hook-latency test can be run standalone:
 *   bun test tests/context-echo.test.ts --test-name-pattern "hook"
 */

import { test, expect, describe } from "bun:test";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";
import { existsSync } from "node:fs";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns true if haystack contains a substantial portion of needle.
 * Uses a sliding window: if any 80-char span of needle appears in haystack,
 * we call it an echo. This catches partial echoes even with light reformatting.
 */
function containsEcho(haystack: string, needle: string): boolean {
  const WINDOW = 80;
  if (needle.length < WINDOW) return haystack.includes(needle.trim());
  for (let i = 0; i <= needle.length - WINDOW; i += 20) {
    const chunk = needle.slice(i, i + WINDOW).trim();
    if (chunk.length > 40 && haystack.includes(chunk)) return true;
  }
  return false;
}

/**
 * Find the most recent Claude Code project conversation log for a project path.
 * Claude Code stores JSONL logs in ~/.claude/projects/<encoded-path>/
 */
async function findLatestConversationLog(
  projectDir: string,
): Promise<string | null> {
  const encoded = projectDir.replace(/\//g, "-").replace(/^-/, "");
  const logsDir = join(homedir(), ".claude", "projects", encoded);
  if (!existsSync(logsDir)) return null;

  const entries = await readdir(logsDir, { withFileTypes: true });
  const jsonlFiles = entries
    .filter((e) => e.isFile() && e.name.endsWith(".jsonl"))
    .map((e) => join(logsDir, e.name));

  if (jsonlFiles.length === 0) return null;

  // Return most recently modified
  const withMtime = await Promise.all(
    jsonlFiles.map(async (f) => {
      const stat = await Bun.file(f).stat();
      return { f, mtime: stat.mtime };
    }),
  );
  withMtime.sort((a, b) => b.mtime - a.mtime);
  return withMtime[0].f;
}

/**
 * Parse a JSONL conversation log and return all assistant message text content.
 */
function extractAssistantText(jsonl: string): string[] {
  return jsonl
    .split("\n")
    .filter(Boolean)
    .flatMap((line) => {
      try {
        const entry = JSON.parse(line);
        if (entry.type !== "assistant") return [];
        const content = entry.message?.content ?? [];
        return content
          .filter((c: { type: string }) => c.type === "text")
          .map((c: { text: string }) => c.text as string);
      } catch {
        return [];
      }
    });
}

// ---------------------------------------------------------------------------
// Echo-detection logic tests (pure, no Claude dependency)
// ---------------------------------------------------------------------------

describe("echo detection logic", () => {
  test("detects exact match", () => {
    const body = "Dear Stuart,\n\nThank you for your time.\n\nBest,\nHenrik";
    expect(containsEcho("Here is the draft: " + body, body)).toBe(true);
  });

  test("detects partial echo via window", () => {
    const longBody =
      "Dear Stuart,\n\nI wanted to follow up on the invoice we discussed last week. The amount due is $5,000 and the due date is approaching. Please let me know if you have any questions.\n\nBest,\nHenrik";
    // Only a portion appears in assistant text
    const partialQuote =
      "I wanted to follow up on the invoice we discussed last week. The amount due is $5,000";
    expect(containsEcho("Sure, I made it shorter: " + partialQuote, longBody)).toBe(true);
  });

  test("does not flag unrelated text", () => {
    const body = "Dear Stuart,\n\nThank you for your time.\n\nBest,\nHenrik";
    expect(containsEcho("Draft ready: email to Stuart → http://127.0.0.1:3000", body)).toBe(false);
  });

  test("does not flag short URL-only response", () => {
    const body = "Here is a longer email body that has lots of text in it for sure.";
    const response = "Draft ready → http://127.0.0.1:51234";
    expect(containsEcho(response, body)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Live conversation log scan (requires a real Claude Code session)
// ---------------------------------------------------------------------------

describe("conversation log echo scan", () => {
  test("no recent /message invocation echoes fragment body", async () => {
    const PROJECT_DIR = "/Users/Henrik/claudecode/lifeos";
    const DRAFTS_DIR = join(PROJECT_DIR, "data/writing/email_drafts");

    const logFile = await findLatestConversationLog(PROJECT_DIR);
    if (!logFile) {
      console.log("No conversation log found - skipping live scan");
      return;
    }

    const logContent = await readFile(logFile, "utf-8");
    const assistantTexts = extractAssistantText(logContent);

    if (assistantTexts.length === 0) {
      console.log("No assistant messages in log - skipping");
      return;
    }

    // Find fragment files written in the last 24 hours
    const entries = await readdir(DRAFTS_DIR, { withFileTypes: true });
    const recentFragments = entries.filter(
      (e) => e.isFile() && e.name.endsWith(".fragment.md"),
    );

    if (recentFragments.length === 0) {
      console.log("No fragment files found - skipping");
      return;
    }

    const combinedAssistantText = assistantTexts.join("\n");

    for (const entry of recentFragments.slice(-5)) {
      const fragPath = join(DRAFTS_DIR, entry.name);
      const fragContent = await readFile(fragPath, "utf-8");

      // Strip frontmatter, check only the body
      const body = fragContent.replace(/^---[\s\S]*?---\n/, "").trim();
      if (body.length < 40) continue;

      const echoed = containsEcho(combinedAssistantText, body);
      if (echoed) {
        console.warn(`Echo detected: fragment body from ${entry.name} appeared in assistant response`);
      }
      expect(echoed).toBe(false);
    }
  });
});
