// Command-line parsing for serve.ts, pure so it is unit-tested. Besides the
// fragment path and the server options it takes the destination to open on:
// --channel <id|alias>, --tier <id>, or a shorthand flag generated from the
// registry - one per id and alias (--x, --linkedin, --plain, --plaintext ...).
import { DESTINATIONS, resolveChannel, TIER_IDS, channelNames } from "./client/destinations.js";

export interface ServeArgs {
  fragment: string;
  buildOnly: boolean;
  timeout: number;
  noOpen: boolean;
  channel: string | null;
  tier: string | null;
  listChannels: "text" | "json" | null;
  help: boolean;
}

export const USAGE = "Usage: serve.ts <fragment.md> [--build-only] [--timeout SEC] [--no-open] [--channel ID | --<id>] [--tier ID]\n       serve.ts --list-channels [--json]   (ids, labels, groups, aliases)";

// Flags with their own meaning; no destination id or alias may take one.
export const RESERVED_FLAGS = ["build-only", "no-open", "timeout", "channel", "tier", "list-channels", "json", "help"];


function validFlags(): string {
  return [
    ...RESERVED_FLAGS.map((f) => "--" + f),
    ...channelNames().map((n: string) => "--" + n),
  ].join(", ");
}

export function parseServeArgs(argv: string[]): ServeArgs {
  const out: ServeArgs = {
    fragment: "", buildOnly: false, timeout: 1800,
    noOpen: process.env.MESSAGE_NO_OPEN === "1", channel: null, tier: null, listChannels: null, help: false,
  };
  let json = false;
  const setChannel = (name: string) => {
    const id = resolveChannel(name);
    if (!id) throw new Error(`Unknown channel: ${name}. Valid: ${channelNames().join(", ")}`);
    if (out.channel && out.channel !== id) throw new Error(`More than one channel given: ${out.channel} and ${id}`);
    out.channel = id;
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) {
      if (out.fragment) throw new Error(`Unexpected argument: ${a}`);
      out.fragment = a;
      continue;
    }
    const flag = a.slice(2);
    if (flag === "build-only") out.buildOnly = true;
    else if (flag === "no-open") out.noOpen = true;
    else if (flag === "timeout") out.timeout = Number(argv[++i] ?? 1800);
    else if (flag === "channel") setChannel(argv[++i] ?? "");
    else if (flag === "tier") {
      const t = (argv[++i] ?? "").toLowerCase();
      if (!TIER_IDS.includes(t)) throw new Error(`Unknown tier: ${t || "(missing)"}. Valid: ${TIER_IDS.join(", ")}`);
      out.tier = t;
    } else if (flag === "list-channels") out.listChannels = "text";
    else if (flag === "json") json = true;
    else if (flag === "help") out.help = true;
    else if (resolveChannel(flag) && flag === flag.toLowerCase()) setChannel(flag);
    else throw new Error(`Unknown flag: ${a}. Valid flags: ${validFlags()}`);
  }
  if (out.listChannels && json) out.listChannels = "json";
  if (!out.fragment && !out.listChannels && !out.help) throw new Error(USAGE);
  return out;
}

// Every destination: id, label, group, aliases - as aligned text or JSON.
export function listChannels(format: "text" | "json"): string {
  const rows = DESTINATIONS.map((d: { id: string; label: string; group: string; aliases?: string[] }) =>
    ({ id: d.id, label: d.label, group: d.group, aliases: d.aliases || [] }));
  if (format === "json") return JSON.stringify(rows, null, 2);
  const w = Math.max(...rows.map((r) => r.id.length));
  const lw = Math.max(...rows.map((r) => r.label.length));
  return rows.map((r) => `${r.id.padEnd(w)}  ${r.label.padEnd(lw)}  ${r.group.padEnd(9)}  ${r.aliases.join(", ")}`.trimEnd()).join("\n");
}
