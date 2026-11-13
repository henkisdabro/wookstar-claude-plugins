import { test, expect } from "bun:test";
import { writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SERVE = join(import.meta.dir, "..", "scripts", "serve.ts");

// Review finding #1: a connected preview tab must keep the server alive past
// the idle timeout; once the tab goes, the idle clock runs again.
test("an open tab keeps the server alive; closing it lets it idle out", async () => {
  const dir = await mkdtemp(join(tmpdir(), "msg-idle-"));
  const path = join(dir, "i.fragment.md");
  await writeFile(path, "---\nto: a@example.com\nsubject: Idle\n---\n\nBody\n", "utf-8");
  const proc = Bun.spawn(["bun", "run", SERVE, path, "--timeout", "1", "--no-open"], { stdout: "pipe", stderr: "ignore" });
  try {
    const reader = proc.stdout.getReader();
    let out = "";
    while (!/http:\/\/\S+/.test(out)) out += new TextDecoder().decode((await reader.read()).value);
    const url = out.match(/http:\/\/\S+/)![0];
    const ws = new WebSocket(url.replace("http", "ws") + "ws");
    await new Promise((r) => (ws.onopen = r));
    // With --timeout 1 the idle check runs every 500 ms, so without the open
    // tab the server would have exited by about 1.5 s.
    await Bun.sleep(2000);
    expect(proc.exitCode).toBeNull();
    expect(ws.readyState).toBe(WebSocket.OPEN);
    ws.close();
    await Promise.race([proc.exited, Bun.sleep(4000)]);
    expect(proc.exitCode).toBe(0);
  } finally {
    proc.kill();
    await rm(dir, { recursive: true, force: true });
  }
}, 15000);
