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
// Tailnet: with MESSAGE_TAILNET=1 the server also publishes itself on the
// user's tailnet (scripts/tailnet.ts), and accepts this node's tailnet name as
// a Host besides loopback. Unset, a remote session only gets a hint that it
// could; MESSAGE_TAILNET=0 skips Tailscale entirely.
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

export type TailnetMode = "on" | "hint" | "off";

export function tailnetMode(env: Env): TailnetMode {
  if (env.MESSAGE_TAILNET === "1") return "on";
  if (env.MESSAGE_TAILNET === "0") return "off";
  return "hint";
}

export type TailnetState =
  | { phase: "pending" }
  | { phase: "ready"; url: string }
  | { phase: "failed"; reason: string }
  | { phase: "available"; name: string };

// The tailnet line(s) of the note. "pending" lasts until Tailscale answers;
// the hook waits it out (a second or two) so the agent relays the final word.
export function tailnetNote(state: TailnetState, port: number): string {
  switch (state.phase) {
    case "pending":
      return "tailnet: pending";
    case "ready":
      return `tailnet: ${state.url}\nThe preview is also on the tailnet at that address, for tailnet devices only, until the server stops. Give the user this link.`;
    case "failed":
      return `tailnet: failed - ${state.reason}`;
    case "available":
      return `tailnet: available - Tailscale runs here as ${state.name}. With MESSAGE_TAILNET=1 set before starting the agent, previews are also served at https://${state.name}:${port}/ for tailnet devices only.`;
  }
}

const LOOPBACK = new Set(["127.0.0.1", "localhost", "[::1]"]);

function hostName(host: string): string {
  return host.toLowerCase().replace(/:\d+$/, "");
}

// The Host header of a request to this server: loopback on any port (a
// forwarded port may differ from the server's own). Anything else is a page
// on another name resolving here - DNS rebinding.
export function isLoopbackHost(host: string | null | undefined): boolean {
  if (!host) return false;
  return LOOPBACK.has(hostName(host));
}

// Loopback, or this node's tailnet name once the server is published there.
export function isAllowedHost(host: string | null | undefined, tailnetHost: string | null = null): boolean {
  if (!host) return false;
  return isLoopbackHost(host) || (!!tailnetHost && hostName(host) === tailnetHost.toLowerCase());
}

// Browsers send Origin on a cross-site POST and on every WebSocket handshake;
// tools such as curl and the hook send none.
export function isAllowedOrigin(origin: string | null | undefined, tailnetHost: string | null = null): boolean {
  if (!origin) return true;
  try {
    return isAllowedHost(new URL(origin).host, tailnetHost);
  } catch {
    return false;
  }
}
