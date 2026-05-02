#!/usr/bin/env bun
import { watch, statSync, existsSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import type { ServerWebSocket } from "bun";
import { build } from "./build";
import { openBrowser } from "./platform";

interface Args {
  fragment: string;
  buildOnly: boolean;
  timeout: number;
  noOpen: boolean;
}

function parseArgs(): Args {
  const args = Bun.argv.slice(2);
  let fragment = "";
  let buildOnly = false;
  let timeout = 1800;
  let noOpen = process.env.MESSAGE_NO_OPEN === "1";

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--build-only") buildOnly = true;
    else if (a === "--no-open") noOpen = true;
    else if (a === "--timeout") timeout = Number(args[++i] ?? 1800);
    else if (!fragment) fragment = a;
  }

  if (!fragment) {
    console.error("Usage: serve.ts <fragment.md> [--build-only] [--timeout SEC] [--no-open]");
    process.exit(1);
  }

  return { fragment: resolve(fragment), buildOnly, timeout, noOpen };
}

async function main(): Promise<void> {
  const { fragment, buildOnly, timeout, noOpen } = parseArgs();

  if (!(await Bun.file(fragment).exists())) {
    console.error(`Error: ${fragment} not found`);
    process.exit(1);
  }

  let buildError: string | null = null;
  let lastBuildAt = Date.now();

  async function doBuild(): Promise<string | null> {
    try {
      const result = await build(fragment);
      buildError = null;
      lastBuildAt = Date.now();
      return result.outputPath;
    } catch (err) {
      buildError = err instanceof Error ? err.message : String(err);
      lastBuildAt = Date.now();
      console.error(`Build error: ${buildError}`);
      return null;
    }
  }

  const initialOutput = await doBuild();
  if (!initialOutput) process.exit(1);
  console.log(initialOutput);

  if (buildOnly) return;

  type WsData = { kind: "reload" };
  const sockets = new Set<ServerWebSocket<WsData>>();
  let lastRequest = Date.now();

  const server = Bun.serve<WsData, Record<string, never>>({
    port: 0,
    hostname: "127.0.0.1",
    fetch(req, srv) {
      lastRequest = Date.now();
      const url = new URL(req.url);

      if (url.pathname === "/ws") {
        if (srv.upgrade(req, { data: { kind: "reload" } })) return;
        return new Response("WS upgrade failed", { status: 400 });
      }

      if (url.pathname === "/check-modified") {
        return Response.json({ mtime: lastBuildAt / 1000, error: buildError });
      }

      if (url.pathname === "/" || url.pathname === "/index.html") {
        if (buildError) {
          return new Response(errorPage(buildError), {
            status: 200,
            headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" },
          });
        }
        // The output may have been deleted externally between requests (e.g.
        // user cleaning up). Fail soft with a friendly message instead of
        // streaming a missing file and producing a raw ENOENT.
        if (!existsSync(initialOutput)) {
          return new Response(
            errorPage(`Preview output is missing. The fragment may have been moved or deleted.\nExpected: ${initialOutput}`),
            { status: 200, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" } },
          );
        }
        return new Response(Bun.file(initialOutput), {
          headers: { "cache-control": "no-cache" },
        });
      }

      return new Response("Not found", { status: 404 });
    },
    websocket: {
      open(ws) {
        sockets.add(ws);
        lastRequest = Date.now();
      },
      close(ws) {
        sockets.delete(ws);
      },
      message() {},
    },
  });

  const url = `http://127.0.0.1:${server.port}/`;
  console.log(url);

  if (!noOpen) openBrowser(url);

  // Watch the parent directory (not the file). fs.watch on a single path binds
  // to the inode and goes deaf after atomic writes (write-temp + rename), which
  // is how the Edit tool and many editors save. Watching the directory and
  // filtering by basename survives both in-place writes and atomic replaces.
  const fragmentDir = dirname(fragment);
  const fragmentName = basename(fragment);

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let lastFragmentMtime = 0;
  function captureMtime(): void {
    try {
      lastFragmentMtime = statSync(fragment).mtimeMs;
    } catch {
      // fragment temporarily missing during atomic rename
    }
  }
  captureMtime();

  function broadcast(): void {
    const msg = JSON.stringify({
      type: buildError ? "error" : "reload",
      error: buildError,
    });
    for (const ws of sockets) {
      try {
        ws.send(msg);
      } catch {
        sockets.delete(ws);
      }
    }
  }

  function scheduleRebuild(): void {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      await doBuild();
      broadcast();
    }, 80);
  }

  const watcher = watch(fragmentDir, (_evt, name) => {
    if (name !== fragmentName) return;
    captureMtime();
    scheduleRebuild();
  });

  // Backstop for environments where the directory watcher can miss events
  // (network mounts, WSL2 cross-filesystem edits on /mnt/c, some Windows
  // editors). One stat() per 2 s is negligible.
  const mtimePoll = setInterval(() => {
    try {
      const m = statSync(fragment).mtimeMs;
      if (m && m !== lastFragmentMtime) {
        lastFragmentMtime = m;
        scheduleRebuild();
      }
    } catch {
      // fragment temporarily missing during atomic rename
    }
  }, 2000);

  // Idle shutdown - skip while a browser is connected.
  const idleCheck = setInterval(() => {
    if (sockets.size > 0) return;
    if (Date.now() - lastRequest > timeout * 1000) {
      console.error(`\nIdle for ${timeout}s - shutting down.`);
      shutdown();
    }
  }, 10_000);

  function shutdown(): void {
    clearInterval(idleCheck);
    clearInterval(mtimePoll);
    watcher.close();
    for (const ws of sockets) ws.close();
    server.stop();
    process.exit(0);
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

function errorPage(msg: string): string {
  return `<!DOCTYPE html><html><head><title>Build error</title><style>
body{font-family:-apple-system,sans-serif;background:#1a1a1a;color:#f4f4f4;padding:40px;margin:0}
.card{background:#2a1515;border:1px solid #e74c3c;border-radius:8px;padding:24px;max-width:800px;margin:0 auto}
h1{color:#e74c3c;margin:0 0 12px 0;font-size:18px}
pre{background:#000;padding:16px;border-radius:4px;overflow:auto;margin:0;color:#ff8a80;font-size:13px;line-height:1.5}
.hint{color:#aaa;margin-top:16px;font-size:13px}
</style><script>
const ws=new WebSocket('ws://'+location.host+'/ws');
ws.onmessage=e=>{try{const d=JSON.parse(e.data);if(d.type==='reload')location.reload()}catch{}};
</script></head><body><div class="card"><h1>Build error</h1><pre>${msg.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c] as string)}</pre><div class="hint">Fix the fragment and save - this page auto-reloads.</div></div></body></html>`;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
