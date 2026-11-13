#!/usr/bin/env bun
import { watch, statSync, readFileSync, existsSync, readdirSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import type { ServerWebSocket } from "bun";
import { build } from "./build";
import { isAllowedOpenUrl } from "./open-url";
import { openCommand, wslMountRoot } from "./open-command";
import { remoteState, remoteNote, isLoopbackHost, isAllowedOrigin } from "./remote";
import { parseServeArgs, listChannels, USAGE, type ServeArgs } from "./cli-args";

function parseArgs(): ServeArgs {
  try {
    return parseServeArgs(Bun.argv.slice(2));
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(2);
  }
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

// Mounted Windows drive roots under WSL (/mnt/c, /mnt/d, ...), from the
// automount root in /etc/wsl.conf rather than a hard-coded drive.
function wslDrives(): string[] {
  let conf = "";
  try { conf = readFileSync("/etc/wsl.conf", "utf8"); } catch { /* no wsl.conf: defaults */ }
  const root = wslMountRoot(conf);
  try {
    return readdirSync(root).filter((d) => /^[a-z]$/i.test(d)).map((d) => root + d);
  } catch {
    return [];
  }
}

// Hand a URL to the OS default handler. Returns false when nothing could be
// launched, so /open can answer with an error and the page falls back to
// window.open instead of the request throwing.
function openBrowser(url: string): boolean {
  const wsl = isWSL();
  const cmd = openCommand(url, {
    platform: process.platform,
    isWSL: wsl,
    which: (name) => Bun.which(name),
    exists: (p) => existsSync(p),
    drives: wsl ? wslDrives() : [],
  });
  if (!cmd) return false;
  try {
    Bun.spawn(cmd, { stdout: "ignore", stderr: "ignore" });
    return true;
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  const args = parseArgs();
  if (args.help) {
    console.log(USAGE);
    return;
  }
  if (args.listChannels) {
    console.log(listChannels(args.listChannels));
    return;
  }
  const { buildOnly, timeout, noOpen } = args;
  const fragment = resolve(args.fragment);
  const overrides = { channel: args.channel, tier: args.tier };

  if (!(await Bun.file(fragment).exists())) {
    console.error(`Error: ${fragment} not found`);
    process.exit(1);
  }

  let buildError: string | null = null;
  let lastBuildAt = Date.now();

  async function doBuild(): Promise<string | null> {
    try {
      const result = await build(fragment, overrides);
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

  // Remote awareness (scripts/remote.ts). Only an explicit remote mode changes
  // behaviour; a suspected remote session gets a note and nothing else.
  const remote = remoteState(process.env, { platform: process.platform, isWSL: isWSL(), flag: args.remote });
  const remoteOn = remote?.mode === "on";
  let note: string | null = null;

  const server = Bun.serve<WsData, Record<string, never>>({
    port: 0,
    hostname: "127.0.0.1",
    fetch(req, srv) {
      lastRequest = Date.now();
      const url = new URL(req.url);

      // Loopback only, by name as well as by socket: a page on another host
      // name that resolves here (DNS rebinding) must not read the draft, and
      // another site must not drive /open or the reload socket.
      if (!isLoopbackHost(req.headers.get("host"))) {
        return new Response("Forbidden", { status: 403 });
      }
      const sameSite = isAllowedOrigin(req.headers.get("origin"));

      if (url.pathname === "/ws") {
        if (!sameSite) return new Response("Forbidden", { status: 403 });
        if (srv.upgrade(req, { data: { kind: "reload" } })) return;
        return new Response("WS upgrade failed", { status: 400 });
      }

      if (url.pathname === "/check-modified") {
        return Response.json({ mtime: lastBuildAt / 1000, error: buildError, remote: note });
      }

      // Open a destination URL via the HOST's default handler (browser, mail
      // app, WhatsApp). The preview page may be rendered inside an embedded
      // webview (a terminal browser pane, VS Code/Zed in-app browsers) where
      // window.open lands in that webview instead of the user's real apps.
      if (url.pathname === "/open" && req.method === "POST") {
        if (!sameSite) return new Response("Forbidden", { status: 403 });
        // Remote mode: this machine's handlers are not the user's. The page
        // opens the link itself (see openExternal in templates/shell.html).
        if (remoteOn) return new Response("Remote mode", { status: 403 });
        const target = url.searchParams.get("url") ?? "";
        if (!isAllowedOpenUrl(target)) {
          return new Response("URL not allowed", { status: 400 });
        }
        if (!openBrowser(target)) {
          return new Response("Could not launch a handler for this URL", { status: 502 });
        }
        return new Response(null, { status: 204 });
      }

      if (url.pathname === "/" || url.pathname === "/index.html") {
        if (buildError) {
          return new Response(errorPage(buildError), {
            status: 200,
            headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" },
          });
        }
        if (remoteOn) {
          const html = readFileSync(initialOutput, "utf8").replace("<head>", "<head><script>window.__MESSAGE_REMOTE=1</script>");
          return new Response(html, {
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
        lastRequest = Date.now(); // the idle clock restarts when the last tab goes
      },
      message() {},
    },
  });

  const url = `http://127.0.0.1:${server.port}/`;
  if (remote) note = remoteNote(remote, server.port as number);
  // One write, so a reader of this output never sees the URL without its note.
  console.log(note ? `${url}\n${note}` : url);

  if (!noOpen && !remoteOn) openBrowser(url);

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

  // Idle shutdown. A connected preview tab sends no HTTP requests (only its
  // WebSocket stays open), so a connected socket counts as activity: the server
  // stays up while any tab is open and idles out `timeout` after the last closes.
  const idleCheck = setInterval(() => {
    if (sockets.size > 0) return;
    if (Date.now() - lastRequest > timeout * 1000) {
      console.error(`\nIdle for ${timeout}s - shutting down.`);
      shutdown();
    }
  }, Math.min(10_000, Math.max(250, timeout * 500)));

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
