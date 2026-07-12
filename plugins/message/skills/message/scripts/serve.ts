#!/usr/bin/env bun
import { watch, statSync, readFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import type { ServerWebSocket } from "bun";
import { build } from "./build";
import { isAllowedOpenUrl } from "./open-url";

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

function isWSL(): boolean {
  if (process.platform !== "linux") return false;
  if (process.env.WSL_DISTRO_NAME) return true;
  try {
    return readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft");
  } catch {
    return false;
  }
}

function openBrowser(url: string): void {
  let cmd: string[];
  if (process.platform === "darwin") cmd = ["open", url];
  else if (process.platform === "win32") cmd = ["cmd", "/c", "start", "", url];
  // WSL2: open via the Windows host - localhost is shared, and xdg-open is
  // typically absent or headless inside the WSL distro.
  else if (isWSL()) cmd = ["cmd.exe", "/c", "start", "", url];
  else cmd = ["xdg-open", url];
  try {
    Bun.spawn(cmd, { stdout: "ignore", stderr: "ignore" });
  } catch {
    // Non-fatal
  }
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

      // Open a destination URL via the HOST's default handler (browser, mail
      // app, WhatsApp). The preview page may be rendered inside an embedded
      // webview (cmux browser pane, VS Code/Zed in-app browsers) where
      // window.open lands in that webview instead of the user's real apps.
      if (url.pathname === "/open" && req.method === "POST") {
        const target = url.searchParams.get("url") ?? "";
        if (!isAllowedOpenUrl(target)) {
          return new Response("URL not allowed", { status: 400 });
        }
        openBrowser(target);
        return new Response(null, { status: 204 });
      }

      if (url.pathname === "/" || url.pathname === "/index.html") {
        if (buildError) {
          return new Response(errorPage(buildError), {
            status: 200,
            headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" },
          });
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

  // Live-reload pipeline. Two triggers feed one debounced, mtime-deduped
  // rebuild:
  //   1. fs.watch on the containing directory - fast path (<100 ms).
  //   2. an mtime poll - safety net.
  // The poll is not optional: macOS fs.watch on a directory silently DROPS the
  // event when an editor saves atomically (write temp file + rename over the
  // target), which is the common save path for many editors and tools. Without
  // the poll, atomic-save edits never reload. (Verified: in-place appends fire
  // the watcher; a `mv new over target` does not.)
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  function fragmentMtime(): number {
    try {
      return statSync(fragment).mtimeMs;
    } catch {
      return lastFragmentMtime; // mid-rename or transiently missing - ignore
    }
  }

  let lastFragmentMtime = fragmentMtime();

  function scheduleReload(): void {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      await doBuild();
      for (const ws of sockets) {
        try {
          ws.send(JSON.stringify({ type: buildError ? "error" : "reload", error: buildError }));
        } catch {
          sockets.delete(ws);
        }
      }
    }, 80);
  }

  // Rebuild only when the fragment's own mtime actually advanced. Deduping on
  // mtime means the fs.watch trigger and the poll trigger never double-build,
  // and the build's own output write (a sibling .html in the same dir) can't
  // loop back into a rebuild.
  function checkFragment(): void {
    const mtime = fragmentMtime();
    if (mtime === lastFragmentMtime) return;
    lastFragmentMtime = mtime;
    scheduleReload();
  }

  const fragmentDir = dirname(fragment);
  const fragmentName = basename(fragment);
  const watcher = watch(fragmentDir, (_eventType, filename) => {
    if (filename && filename.toString() !== fragmentName) return;
    checkFragment();
  });
  // A directory that is removed/unmounted (or EMFILE) emits 'error'; without a
  // handler that throws and kills the long-lived server. Swallow it - the mtime
  // poll below remains as the sole reload trigger.
  watcher.on("error", () => {});

  // Safety-net poll for atomic-rename saves fs.watch drops on macOS.
  const pollTimer = setInterval(checkFragment, 300);

  // Idle shutdown
  const idleCheck = setInterval(() => {
    if (Date.now() - lastRequest > timeout * 1000) {
      console.error(`\nIdle for ${timeout}s - shutting down.`);
      shutdown();
    }
  }, 10_000);

  function shutdown(): void {
    clearInterval(idleCheck);
    clearInterval(pollTimer);
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
