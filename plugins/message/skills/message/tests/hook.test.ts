import { describe, test, expect } from "bun:test";
import { mkdtemp, mkdir, rm } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

// End-to-end exercise of the plugin's PostToolUse hook: feed it a Write-tool
// JSON payload, expect it to launch a server, record state files, and reuse
// the live server (without relaunching) on a second invocation.
//
// MESSAGE_NO_OPEN=1 is passed through the hook's inherited env so serve.ts
// never opens a real browser during the test. CLAUDE_PLUGIN_ROOT is left
// unset - the hook's import.meta.dirname fallback must resolve it.

const HOOK = resolve(import.meta.dir, "..", "..", "..", "hooks", "auto-serve-fragment.ts");

const FRAGMENT_CONTENT = `---
to: recipient@example.com
subject: Hook e2e
---

Hello from the hook test.

Best,
Test
`;

async function runHook(projectDir: string, fragmentPath: string): Promise<number> {
  const input = JSON.stringify({ tool_input: { file_path: fragmentPath } });
  const proc = Bun.spawn(["bun", "run", HOOK], {
    env: { ...process.env, CLAUDE_PROJECT_DIR: projectDir, MESSAGE_NO_OPEN: "1" },
    stdin: Buffer.from(input),
    stdout: "ignore",
    stderr: "ignore",
  });
  return proc.exited;
}

function killServerOnPort(url: string): void {
  if (process.platform === "win32") return;
  const port = new URL(url).port;
  if (!port) return;
  // -sTCP:LISTEN so only the server dies - a bare port match would also hit
  // this test process's own keep-alive fetch connection.
  Bun.spawnSync(["bash", "-c", `lsof -ti tcp:${port} -sTCP:LISTEN | xargs kill 2>/dev/null`]);
}

describe("auto-serve-fragment hook", () => {
  test.skipIf(!existsSync(HOOK) || process.platform === "win32")(
    "launches a server, writes state, and reuses it on re-fire",
    async () => {
      const projectDir = await mkdtemp(join(tmpdir(), "hook-e2e-"));
      const draftsDir = join(projectDir, "data", "writing", "email_drafts");
      await mkdir(draftsDir, { recursive: true });
      const fragment = join(draftsDir, "2026-01-01_test_hook-e2e.fragment.md");
      await Bun.write(fragment, FRAGMENT_CONTENT);

      let url = "";
      try {
        // First fire: cold start - must launch and record a URL.
        expect(await runHook(projectDir, fragment)).toBe(0);
        const latestFile = join(projectDir, ".claude", ".message-preview-url");
        expect(existsSync(latestFile)).toBe(true);
        url = readFileSync(latestFile, "utf8").trim();
        expect(url).toStartWith("http://127.0.0.1:");

        // The server must answer the /check-modified contract the hook's own
        // reuse probe depends on.
        const res = await fetch(new URL("check-modified", url));
        expect(res.ok).toBe(true);
        const data = (await res.json()) as { mtime?: unknown };
        expect(typeof data.mtime).toBe("number");

        // Second fire: must reuse the live server (same URL, no relaunch).
        expect(await runHook(projectDir, fragment)).toBe(0);
        expect(readFileSync(latestFile, "utf8").trim()).toBe(url);

        // Previews map keys by absolute fragment path.
        const previews = JSON.parse(
          readFileSync(join(projectDir, ".claude", ".message-previews.json"), "utf8"),
        );
        expect(previews[fragment]).toBe(url);
      } finally {
        if (url) killServerOnPort(url);
        await rm(projectDir, { recursive: true, force: true });
      }
    },
    60_000,
  );

  test("ignores non-fragment writes", async () => {
    const projectDir = await mkdtemp(join(tmpdir(), "hook-e2e-skip-"));
    try {
      expect(await runHook(projectDir, join(projectDir, "notes.md"))).toBe(0);
      expect(existsSync(join(projectDir, ".claude", ".message-preview-url"))).toBe(false);
    } finally {
      await rm(projectDir, { recursive: true, force: true });
    }
  });
});
