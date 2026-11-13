// Remote awareness for the preview server. The server always binds loopback
// on the machine it runs on, so when that machine is not the one the user is
// sitting at, their browser cannot reach the URL without a forwarded port.
//
// Two levels, so a wrong guess never changes what a local user gets:
//   suspected - SSH variables, or Linux with no display. Nothing changes; the
//               server only adds a note saying how to reach the preview.
//   on        - asked for with MESSAGE_REMOTE=1 or --remote. No browser launch
//               on this machine, and the page opens compose links itself.
// MESSAGE_REMOTE=0 silences the guess.
//
// Pure functions, unit-tested in tests/remote.test.ts.

export interface RemoteState {
  mode: "on" | "suspected";
  reason: string;
}

export interface RemoteContext {
  platform: string;   // process.platform
  isWSL: boolean;
  flag: boolean;      // --remote
}

type Env = Record<string, string | undefined>;

export function remoteState(env: Env, ctx: RemoteContext): RemoteState | null {
  if (ctx.flag) return { mode: "on", reason: "--remote" };
  if (env.MESSAGE_REMOTE === "1") return { mode: "on", reason: "MESSAGE_REMOTE" };
  if (env.MESSAGE_REMOTE === "0") return null;
  if (env.SSH_CONNECTION || env.SSH_TTY) return { mode: "suspected", reason: "ssh" };
  if (ctx.platform === "linux" && !ctx.isWSL && !env.DISPLAY && !env.WAYLAND_DISPLAY) {
    return { mode: "suspected", reason: "headless" };
  }
  return null;
}

// What the agent relays to the user. The SSH destination stays a placeholder:
// SSH_CONNECTION holds addresses, not the alias or jump host the user connects
// with, so only they know it.
export function remoteNote(state: RemoteState, port: number): string {
  const head = state.mode === "on"
    ? "remote-preview: on\nNo browser was opened on this machine."
    : `remote-preview: suspected (${state.reason})\nThis session looks remote. The browser launch was still attempted on this machine.`;
  return [
    head,
    "The preview URL is on the machine running the agent. If the user's browser cannot reach it, they run this on their own computer, then open the same URL:",
    `  ssh -N -o ExitOnForwardFailure=yes -L 127.0.0.1:${port}:127.0.0.1:${port} <ssh-host>`,
    "VS Code, Cursor and similar remote editors forward the port themselves.",
    state.mode === "on" ? "" : "Set MESSAGE_REMOTE=1 to skip the browser launch here, or MESSAGE_REMOTE=0 to silence this note.",
  ].filter(Boolean).join("\n");
}

const LOOPBACK = new Set(["127.0.0.1", "localhost", "[::1]"]);

// The Host header of a request to this server: loopback on any port (a
// forwarded port may differ from the server's own). Anything else is a page
// on another name resolving here - DNS rebinding.
export function isLoopbackHost(host: string | null | undefined): boolean {
  if (!host) return false;
  return LOOPBACK.has(host.toLowerCase().replace(/:\d+$/, ""));
}

// Browsers send Origin on a cross-site POST and on every WebSocket handshake;
// tools such as curl and the hook send none.
export function isAllowedOrigin(origin: string | null | undefined): boolean {
  if (!origin) return true;
  try {
    return isLoopbackHost(new URL(origin).host);
  } catch {
    return false;
  }
}
