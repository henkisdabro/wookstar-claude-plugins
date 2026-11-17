// Publish the preview on the user's tailnet with a foreground `tailscale
// serve`: https://<this node>.<tailnet>.ts.net:PORT -> http://127.0.0.1:PORT.
// The mapping lives only as long as that child process, which serve.ts stops
// on shutdown. Tailnet-only: Funnel is never touched.
//
// serve.ts calls this after it has printed the local URL, so the local
// preview never waits on Tailscale.

import { existsSync } from "node:fs";
import type { Subprocess } from "bun";
import type { TailnetState } from "./remote";

const MAC_CLI = "/Applications/Tailscale.app/Contents/MacOS/Tailscale";

export interface Tailnet {
  state: TailnetState;
  host: string | null;          // the Host to accept once published
  proc: Subprocess | null;      // the `tailscale serve` child to stop
}

function tailscaleBin(): string | null {
  return Bun.which("tailscale") ?? (process.platform === "darwin" && existsSync(MAC_CLI) ? MAC_CLI : null);
}

// This node's MagicDNS name, or null when Tailscale is not running.
async function nodeName(bin: string): Promise<string | null> {
  try {
    const proc = Bun.spawn([bin, "status", "--json"], { stdout: "pipe", stderr: "ignore", timeout: 5000 });
    const status = JSON.parse(await new Response(proc.stdout).text());
    if (status.BackendState !== "Running") return null;
    return String(status.Self?.DNSName ?? "").replace(/\.$/, "") || null;
  } catch {
    return null;
  }
}

// publish=false only looks, for the hint. publish=true maps the port.
export async function startTailnet(port: number, publish: boolean, isWSL: boolean): Promise<Tailnet | null> {
  const failed = (reason: string): Tailnet => ({ state: { phase: "failed", reason }, host: null, proc: null });
  const bin = tailscaleBin();
  if (!bin) return publish ? failed("the tailscale CLI is not installed here") : null;
  const name = await nodeName(bin);
  if (!name) return publish ? failed("Tailscale is not running here") : null;
  if (!publish) return { state: { phase: "available", name }, host: null, proc: null };

  // A Linux node whose tailscaled has no operator set, or that already serves
  // a folder, refuses serve changes from a normal user; passwordless sudo is
  // the second try. WSL drives the Windows client, where sudo means nothing.
  const serve = [bin, "serve", `--https=${port}`, `http://127.0.0.1:${port}`];
  const attempts = [serve];
  if (process.platform === "linux" && !isWSL && process.getuid?.() !== 0 && Bun.which("sudo")) {
    attempts.push(["sudo", "-n", ...serve]);
  }
  let reason = "tailscale serve exited";
  for (const cmd of attempts) {
    const proc = Bun.spawn(cmd, { stdin: "ignore", stdout: "ignore", stderr: "pipe" });
    // A refused serve exits within a moment; one that is still up is serving.
    const exited = await Promise.race([proc.exited.then(() => true), Bun.sleep(1500).then(() => false)]);
    if (!exited) {
      return { state: { phase: "ready", url: `https://${name}:${port}/` }, host: name, proc };
    }
    const err = (await new Response(proc.stderr).text()).trim().split("\n")[0];
    if (err) reason = err;
  }
  return failed(reason);
}
