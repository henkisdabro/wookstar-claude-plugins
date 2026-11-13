import { test, expect, describe } from "bun:test";
import { writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { remoteState, remoteNote, isLoopbackHost, isAllowedOrigin } from "../scripts/remote";
import { parseServeArgs } from "../scripts/cli-args";

const SERVE = join(import.meta.dir, "..", "scripts", "serve.ts");

describe("remoteState", () => {
  const local = { platform: "darwin", isWSL: false, flag: false };

  test("a local desktop is not remote", () => {
    expect(remoteState({}, local)).toBeNull();
    expect(remoteState({ DISPLAY: ":0" }, { ...local, platform: "linux" })).toBeNull();
    expect(remoteState({ WAYLAND_DISPLAY: "wayland-0" }, { ...local, platform: "linux" })).toBeNull();
  });

  test("WSL without a display is not treated as headless", () => {
    expect(remoteState({}, { platform: "linux", isWSL: true, flag: false })).toBeNull();
  });

  test("SSH variables and a display-less Linux are only suspected", () => {
    expect(remoteState({ SSH_CONNECTION: "10.0.0.2 5555 10.0.0.1 22" }, local)).toEqual({ mode: "suspected", reason: "ssh" });
    expect(remoteState({ SSH_TTY: "/dev/pts/0" }, local)).toEqual({ mode: "suspected", reason: "ssh" });
    expect(remoteState({}, { ...local, platform: "linux" })).toEqual({ mode: "suspected", reason: "headless" });
  });

  test("MESSAGE_REMOTE=1 or --remote turns remote mode on", () => {
    expect(remoteState({ MESSAGE_REMOTE: "1" }, local)).toEqual({ mode: "on", reason: "MESSAGE_REMOTE" });
    expect(remoteState({}, { ...local, flag: true })).toEqual({ mode: "on", reason: "--remote" });
  });

  test("MESSAGE_REMOTE=0 silences detection", () => {
    expect(remoteState({ MESSAGE_REMOTE: "0", SSH_TTY: "/dev/pts/0" }, local)).toBeNull();
    expect(remoteState({ MESSAGE_REMOTE: "0" }, { ...local, platform: "linux" })).toBeNull();
  });
});

describe("remoteNote", () => {
  test("carries a forwarding recipe for the port, bound to loopback on both ends", () => {
    const note = remoteNote({ mode: "on", reason: "MESSAGE_REMOTE" }, 47812);
    expect(note).toStartWith("remote-preview: on");
    expect(note).toContain("ssh -N -o ExitOnForwardFailure=yes -L 127.0.0.1:47812:127.0.0.1:47812 <ssh-host>");
    expect(note).toContain("No browser was opened");
  });

  test("a suspected session says the browser launch was still attempted", () => {
    const note = remoteNote({ mode: "suspected", reason: "ssh" }, 5000);
    expect(note).toStartWith("remote-preview: suspected (ssh)");
    expect(note).toContain("MESSAGE_REMOTE=1");
    expect(note).not.toContain("No browser was opened");
  });
});

describe("loopback checks", () => {
  test("Host must be loopback, on any port", () => {
    for (const h of ["127.0.0.1:5000", "localhost:5000", "localhost", "[::1]:5000", "LOCALHOST:1"]) expect(isLoopbackHost(h)).toBe(true);
    for (const h of [null, "", "evil.example", "127.0.0.1.evil.example:5000", "10.0.0.5:5000"]) expect(isLoopbackHost(h)).toBe(false);
  });

  test("Origin may be absent (non-browser client) or loopback, nothing else", () => {
    expect(isAllowedOrigin(null)).toBe(true);
    expect(isAllowedOrigin("http://127.0.0.1:5000")).toBe(true);
    expect(isAllowedOrigin("http://localhost:9999")).toBe(true);
    expect(isAllowedOrigin("https://evil.example")).toBe(false);
    expect(isAllowedOrigin("null")).toBe(false);
  });
});

test("--remote parses, and is off by default", () => {
  expect(parseServeArgs(["d.fragment.md"]).remote).toBe(false);
  expect(parseServeArgs(["d.fragment.md", "--remote"]).remote).toBe(true);
});

// -- the running server -------------------------------------------------------

async function startServer(env: Record<string, string>, extraArgs: string[] = []) {
  const dir = await mkdtemp(join(tmpdir(), "msg-remote-"));
  const path = join(dir, "r.fragment.md");
  await writeFile(path, "---\nto: a@example.com\nsubject: Remote\n---\n\nBody\n", "utf-8");
  // A clean slate: no inherited SSH variables, and a display on Linux so the
  // test machine itself (CI is headless) does not look remote.
  const base: Record<string, string> = { ...(process.env as Record<string, string>), DISPLAY: ":0" };
  for (const k of ["SSH_CONNECTION", "SSH_TTY", "SSH_CLIENT", "MESSAGE_REMOTE"]) delete base[k];
  const proc = Bun.spawn(["bun", "run", SERVE, path, "--no-open", ...extraArgs], {
    env: { ...base, ...env }, stdout: "pipe", stderr: "ignore",
  });
  const reader = proc.stdout.getReader();
  let out = "";
  while (!/http:\/\/\S+\n/.test(out)) out += new TextDecoder().decode((await reader.read()).value);
  await Bun.sleep(150); // anything printed after the URL
  const url = out.match(/http:\/\/\S+/)![0];
  const stop = async () => { proc.kill(); await rm(dir, { recursive: true, force: true }); };
  const rest = async () => {
    const more = await Promise.race([reader.read(), Bun.sleep(100).then(() => ({ value: undefined }))]);
    return out + (more.value ? new TextDecoder().decode(more.value) : "");
  };
  return { url, out: await rest(), stop };
}

describe("serve.ts", () => {
  test("default: prints the path and the URL and nothing else; no remote note", async () => {
    const s = await startServer({});
    try {
      expect(s.out.trim().split("\n").length).toBe(2);
      const data = (await (await fetch(s.url + "check-modified")).json()) as { remote: unknown };
      expect(data.remote).toBeNull();
      expect(await (await fetch(s.url)).text()).not.toContain("window.__MESSAGE_REMOTE=1");
    } finally { await s.stop(); }
  }, 15000);

  test("suspected: the note is printed and reported, behaviour is unchanged", async () => {
    const s = await startServer({ SSH_CONNECTION: "10.0.0.2 5555 10.0.0.1 22" });
    try {
      expect(s.out).toContain("remote-preview: suspected (ssh)");
      const data = (await (await fetch(s.url + "check-modified")).json()) as { remote: string };
      expect(data.remote).toContain(`-L 127.0.0.1:${new URL(s.url).port}:127.0.0.1:${new URL(s.url).port}`);
      expect(await (await fetch(s.url)).text()).not.toContain("window.__MESSAGE_REMOTE=1");
      // /open still reaches the allowlist (400 for a URL that is not on it).
      expect((await fetch(s.url + "open?url=" + encodeURIComponent("https://example.com/"), { method: "POST" })).status).toBe(400);
    } finally { await s.stop(); }
  }, 15000);

  test("MESSAGE_REMOTE=1: /open declines and the page opens links itself", async () => {
    const s = await startServer({ MESSAGE_REMOTE: "1" });
    try {
      expect(s.out).toContain("remote-preview: on");
      const open = await fetch(s.url + "open?url=" + encodeURIComponent("https://mail.google.com/mail/?view=cm"), { method: "POST" });
      expect(open.status).toBe(403);
      expect(await (await fetch(s.url)).text()).toContain("window.__MESSAGE_REMOTE=1");
    } finally { await s.stop(); }
  }, 15000);

  test("--remote does the same as the variable", async () => {
    const s = await startServer({}, ["--remote"]);
    try {
      expect(s.out).toContain("remote-preview: on");
    } finally { await s.stop(); }
  }, 15000);

  test("a non-loopback Host is refused (DNS rebinding)", async () => {
    const s = await startServer({});
    try {
      expect((await fetch(s.url, { headers: { Host: "evil.example" } })).status).toBe(403);
      expect((await fetch(s.url + "check-modified", { headers: { Host: "evil.example" } })).status).toBe(403);
    } finally { await s.stop(); }
  }, 15000);

  test("/open and the WebSocket refuse another site's Origin", async () => {
    const s = await startServer({});
    try {
      const target = "open?url=" + encodeURIComponent("https://example.com/");
      expect((await fetch(s.url + target, { method: "POST", headers: { Origin: "https://evil.example" } })).status).toBe(403);
      // The page's own origin passes the check and reaches the allowlist.
      expect((await fetch(s.url + target, { method: "POST", headers: { Origin: s.url.slice(0, -1) } })).status).toBe(400);
      const ws = await fetch(s.url + "ws", { headers: { Origin: "https://evil.example", Upgrade: "websocket", Connection: "Upgrade" } });
      expect(ws.status).toBe(403);
    } finally { await s.stop(); }
  }, 15000);
});
