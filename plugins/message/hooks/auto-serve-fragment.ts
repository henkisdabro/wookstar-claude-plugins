#!/usr/bin/env bun
// PostToolUse hook: auto-builds and serves .fragment.md files written or
// edited by Claude. Cross-platform - runs under Bun on macOS, Linux, WSL2,
// and native Windows.
//
// serve.ts self-opens the browser exactly once, the instant its port is
// ready, so this hook never opens anything itself. It launches serve.ts at
// most once per fragment - when a live server is found the hook returns
// early and the existing tab hot-reloads in place (no new tab per edit).
//
// State files written into ${CLAUDE_PROJECT_DIR}/.claude/:
//   .message-preview-url    - URL of the most recently served fragment
//   .message-previews.json  - map of {absoluteFragmentPath: url} for all live servers

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { tmpdir } from "node:os";

const PROJECT_DIR = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
// CLAUDE_PLUGIN_ROOT is always set when Claude Code invokes a plugin hook;
// the import.meta.dirname fallback is for direct `bun run` testing.
const PLUGIN_ROOT = process.env.CLAUDE_PLUGIN_ROOT ?? resolve(import.meta.dirname, "..");
const SCRIPTS_DIR = join(PLUGIN_ROOT, "skills", "message", "scripts");
const SERVE_TS = join(SCRIPTS_DIR, "serve.ts");
const PREVIEWS_FILE = join(PROJECT_DIR, ".claude", ".message-previews.json");
const LATEST_FILE = join(PROJECT_DIR, ".claude", ".message-preview-url");

async function readStdin(): Promise<string> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of process.stdin as AsyncIterable<Uint8Array>) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

function readPreviews(): Record<string, string> {
  try {
    return JSON.parse(readFileSync(PREVIEWS_FILE, "utf8"));
  } catch {
    return {};
  }
}

function writeState(absPath: string, url: string): void {
  const data = readPreviews();
  // Skip the disk write when nothing has changed - common case when reusing
  // a still-alive server for the same fragment.
  if (data[absPath] === url && readLatest() === url) return;
  mkdirSync(dirname(PREVIEWS_FILE), { recursive: true });
  data[absPath] = url;
  writeFileSync(PREVIEWS_FILE, JSON.stringify(data, null, 2));
  writeFileSync(LATEST_FILE, url);
}

function pruneState(absPath: string): void {
  const data = readPreviews();
  if (!(absPath in data)) return;
  delete data[absPath];
  try {
    writeFileSync(PREVIEWS_FILE, JSON.stringify(data, null, 2));
  } catch {
    // Non-fatal - a stale entry just gets re-probed next time
  }
}

function readLatest(): string {
  try {
    return readFileSync(LATEST_FILE, "utf8").trim();
  } catch {
    return "";
  }
}

// Probe the /check-modified JSON endpoint (not just the root) and require the
// expected shape, so a different app that happens to be on a reused port can't
// be mistaken for our server.
async function isOurServer(url: string): Promise<boolean> {
  try {
    const res = await fetch(new URL("check-modified", url), {
      signal: AbortSignal.timeout(1000),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { mtime?: unknown };
    return typeof data?.mtime === "number";
  } catch {
    return false;
  }
}

async function ensureDependencies(): Promise<boolean> {
  // Plugin ships without node_modules to keep the pack small. Install on first
  // use so the build pipeline can resolve `marked`.
  if (existsSync(join(SCRIPTS_DIR, "node_modules"))) return true;
  try {
    const proc = Bun.spawn(["bun", "install", "--silent"], {
      cwd: SCRIPTS_DIR,
      stdin: "ignore",
      stdout: "ignore",
      stderr: "ignore",
    });
    const code = await proc.exited;
    return code === 0;
  } catch {
    return false;
  }
}

async function spawnServer(absPath: string): Promise<string | null> {
  const logFile = join(tmpdir(), `msg-serve-${process.pid}-${Date.now()}.log`);

  // Inherit env (so MESSAGE_NO_OPEN=1 set externally still suppresses the
  // browser, e.g. in tests) but never force it - serve.ts owns the single
  // browser-open, fired once when its port is ready.
  const proc = Bun.spawn(["bun", "run", SERVE_TS, absPath], {
    env: { ...process.env },
    stdin: "ignore",
    stdout: Bun.file(logFile),
    stderr: "ignore",
  });
  // Detach so this hook can exit while the server keeps running.
  if (typeof proc.unref === "function") proc.unref();

  // serve.ts prints: line 1 = output HTML path, line 2 = http://127.0.0.1:PORT/
  // Poll up to 10 s - a first-ever run also cold-starts Bun, installs nothing
  // further, and builds.
  for (let i = 0; i < 100; i++) {
    await Bun.sleep(100);
    try {
      const lines = readFileSync(logFile, "utf8").split("\n").filter(Boolean);
      if (lines.length >= 2) return lines[1].trim();
    } catch {
      // log not flushed yet
    }
  }
  return null;
}

function parseFilePath(input: string): string | null {
  try {
    const data = JSON.parse(input);
    const path = data?.tool_input?.file_path;
    return typeof path === "string" && path ? path : null;
  } catch {
    return null;
  }
}

async function main(): Promise<void> {
  const input = await readStdin();
  const filePath = parseFilePath(input);
  // Fires on any *.fragment.md, wherever the project keeps its drafts.
  if (!filePath || !filePath.endsWith(".fragment.md")) return;

  const absPath = resolve(isAbsolute(filePath) ? filePath : join(PROJECT_DIR, filePath));

  const existing = readPreviews()[absPath];
  if (existing) {
    if (await isOurServer(existing)) {
      // A server is already live for this fragment, so a browser tab was
      // opened for it on the first serve (by serve.ts). That tab reloads
      // itself in place - do NOT relaunch or re-open anything.
      writeState(absPath, existing);
      return;
    }
    pruneState(absPath);
  }

  if (!existsSync(SERVE_TS)) return;
  if (!(await ensureDependencies())) return;

  const url = await spawnServer(absPath);
  if (!url) return;

  writeState(absPath, url);
}

main().catch((err) => {
  // Fail open so the hook never blocks Claude, but surface errors to stderr
  // so they show up in Claude Code's hook diagnostics.
  console.error("[auto-serve-fragment]", err);
});
