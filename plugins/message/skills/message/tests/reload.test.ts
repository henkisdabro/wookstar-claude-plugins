import { test, expect, describe, afterEach } from "bun:test";
import { writeFile, appendFile, rename, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";

const SERVE = join(import.meta.dir, "..", "scripts", "serve.ts");
const FRAGMENT = `---
to: a@b.com
subject: Reload test
---

Original body.
`;

interface Server {
  proc: ReturnType<typeof Bun.spawn>;
  port: string;
  path: string;
  dir: string;
}

const running: Server[] = [];

afterEach(async () => {
  for (const s of running.splice(0)) {
    try {
      s.proc.kill();
    } catch {
      /* already gone */
    }
    await rm(s.dir, { recursive: true, force: true }).catch(() => {});
  }
});

async function startServer(): Promise<Server> {
  const dir = await mkdtemp(join(tmpdir(), "msg-reload-"));
  const path = join(dir, "r.fragment.md");
  await writeFile(path, FRAGMENT, "utf-8");

  const proc = Bun.spawn(["bun", "run", SERVE, path], {
    env: { ...process.env, MESSAGE_NO_OPEN: "1" },
    stdout: "pipe",
    stderr: "ignore",
  });

  // serve.ts prints line 1 = output path, line 2 = http URL.
  const reader = proc.stdout.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  const deadline = Date.now() + 10_000;
  while (buf.split("\n").filter(Boolean).length < 2 && Date.now() < deadline) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value);
  }
  reader.releaseLock();
  const lines = buf.split("\n").filter(Boolean);
  const url = lines[1] ?? "";
  const port = (url.match(/:(\d+)\//) ?? [])[1] ?? "";
  const server: Server = { proc, port, path, dir };
  running.push(server);
  return server;
}

// Open a socket, run `trigger` (the edit), and resolve with the first WS
// message (or null on timeout).
async function reloadAfter(port: string, trigger: () => Promise<void>, timeoutMs = 5000) {
  const ws = new WebSocket(`ws://127.0.0.1:${port}/ws`);
  await new Promise<void>((res, rej) => {
    ws.onopen = () => res();
    ws.onerror = () => rej(new Error("ws error"));
  });
  const got = new Promise<Record<string, unknown> | null>((resolve) => {
    const timer = setTimeout(() => resolve(null), timeoutMs);
    ws.onmessage = (e) => {
      clearTimeout(timer);
      try {
        resolve(JSON.parse(String(e.data)));
      } catch {
        resolve(null);
      }
    };
  });
  await trigger();
  const msg = await got;
  try {
    ws.close();
  } catch {
    /* noop */
  }
  return msg;
}

describe("live reload", () => {
  test("reloads on an in-place append (fs.watch fast path)", async () => {
    const s = await startServer();
    expect(s.port).not.toBe("");
    const msg = await reloadAfter(s.port, () => appendFile(s.path, "\nAppended.\n"));
    expect(msg?.type).toBe("reload");
  }, 20_000);

  test("reloads on an atomic write+rename (mtime poll safety net)", async () => {
    const s = await startServer();
    const tmp = join(dirname(s.path), "r.new");
    const msg = await reloadAfter(s.port, async () => {
      await writeFile(tmp, FRAGMENT + "\nAtomic edit.\n", "utf-8");
      await rename(tmp, s.path);
    });
    expect(msg?.type).toBe("reload");
  }, 20_000);

  test("pushes an error message when an edit breaks the build", async () => {
    const s = await startServer();
    // Em dash trips validateFragment -> build error.
    const msg = await reloadAfter(s.port, () =>
      writeFile(s.path, FRAGMENT.replace("Original body.", "Broken — body."), "utf-8"),
    );
    expect(msg?.type).toBe("error");
  }, 20_000);
});
