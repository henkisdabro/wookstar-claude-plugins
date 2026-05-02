#!/usr/bin/env bun
// PostToolUse hook: auto-builds and serves .fragment.md files written by Claude.
// Cross-platform - runs on macOS, Linux, WSL2, and native Windows under Bun.
//
// State files written into ${CLAUDE_PROJECT_DIR}/.claude/:
//   .message-preview-url    - URL of the most recently served fragment
//   .message-previews.json  - map of {absoluteFragmentPath: url} for all live servers

import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { openBrowser } from "../skills/message/scripts/platform";

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

function readLatest(): string {
  try {
    return readFileSync(LATEST_FILE, "utf8").trim();
  } catch {
    return "";
  }
}

async function isServerAlive(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(300) });
    return res.ok;
  } catch {
    return false;
  }
}

async function spawnServer(absPath: string): Promise<string | null> {
  const logFile = join(tmpdir(), `msg-serve-${process.pid}-${Date.now()}.log`);

  const proc = Bun.spawn(["bun", "run", SERVE_TS, absPath], {
    env: { ...process.env, MESSAGE_NO_OPEN: "1" },
    stdin: "ignore",
    stdout: Bun.file(logFile),
    stderr: "ignore",
  });
  // Detach so this hook can exit while the server keeps running.
  if (typeof proc.unref === "function") proc.unref();

  // serve.ts prints: line 1 = output HTML path, line 2 = http://127.0.0.1:PORT/
  for (let i = 0; i < 30; i++) {
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

function inDraftsDir(p: string): boolean {
  // Claude Code writes JSON paths with forward slashes on Windows too, but
  // belt-and-braces: normalise before matching.
  return p.replaceAll("\\", "/").includes("data/writing/email_drafts");
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

async function main(): Promise<void> {
  const input = await readStdin();
  const filePath = parseFilePath(input);
  if (!filePath || !filePath.endsWith(".fragment.md") || !inDraftsDir(filePath)) return;

  const absPath = resolve(isAbsolute(filePath) ? filePath : join(PROJECT_DIR, filePath));

  const existing = readPreviews()[absPath];
  if (existing && (await isServerAlive(existing))) {
    writeState(absPath, existing);
    openBrowser(existing);
    return;
  }

  if (!existsSync(SERVE_TS)) return;
  if (!(await ensureDependencies())) return;

  const url = await spawnServer(absPath);
  if (!url) return;

  writeState(absPath, url);
  openBrowser(url);
}

main().catch((err) => {
  // Fail open so the hook never blocks Claude, but surface errors to stderr
  // so they show up in Claude Code's hook diagnostics.
  console.error("[auto-serve-fragment]", err);
});
