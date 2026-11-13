// The destination registry: one row per place a message can be pasted. The
// preview builds its chips, Copy/Open pair, counter and shortcuts from this
// table; adding a destination is one row (plus, at most, one dialect spec in
// dialects.js). What each platform accepts, with sources: references/destinations.md.
//
// Row fields:
//   id, label, group   - group is Email | Messaging | Social | Generic
//   icon               - a neutral glyph key (shell.html ICONS); never a brand logo
//   payload            - "gmail" (Gmail-native HTML), "rich" (inline-styled HTML),
//                        or "text" (text/plain from the dialect below)
//   dialect            - a key of DIALECTS, for payload "text"
//   counter            - a countFor() rule, or null where no limit is known
//   thread             - true: a post over the limit is split into a numbered
//                        thread (scripts/client/thread.js)
//   tiers              - account tiers that change the limit, e.g. X Free and
//                        Premium: { id: { label, max, thread } }; the first is the default
//   openUrl(text, f)   - the compose URL, or absent when none exists
//   key                - the copy shortcut, where one is kept from the old lanes
//   openKey            - the open shortcut (select the destination, then Open)
//   aliases            - other names for the destination: each is also a serve.ts
//                        flag (--plaintext) and a valid `channel:` value
import { buildMailto } from "./mailto.js";

const enc = encodeURIComponent;
const WHATSAPP_PREFILL_MAX = 700;

export const DESTINATIONS = [
  { id: "gmail", aliases: ["email"], label: "Gmail", group: "Email", icon: "mail", payload: "gmail", key: "g",
    openUrl: (_t, f) => {
      const u = new URL("https://mail.google.com/mail/");
      u.searchParams.set("view", "cm"); u.searchParams.set("tf", "1");
      u.searchParams.set("to", f.to); u.searchParams.set("su", f.subject);
      if (f.cc) u.searchParams.set("cc", f.cc);
      if (f.bcc) u.searchParams.set("bcc", f.bcc);
      return u.toString();
    } },
  { id: "mail", aliases: ["outlook", "mail-app", "rich"], label: "Mail app", group: "Email", icon: "inbox", payload: "rich", key: "t",
    openKey: "e", openUrl: (_t, f) => buildMailto({ to: f.to, subject: f.subject, cc: f.cc, bcc: f.bcc, body: "" }).href },

  { id: "whatsapp", aliases: ["wa"], label: "WhatsApp", group: "Messaging", icon: "chat", payload: "text", dialect: "whatsapp", key: "m",
    // whatsapp:// prefill truncates or mangles long, multi-paragraph text, so
    // only short messages are prefilled; longer ones open the app to paste into.
    openKey: "w", openUrl: (t) => (t.length <= WHATSAPP_PREFILL_MAX ? "whatsapp://send?text=" + enc(t) : "whatsapp://send") },
  { id: "slack", label: "Slack", group: "Messaging", icon: "chat", payload: "text", dialect: "slack",
    counter: { kind: "graphemes", max: 40000, about: true } },
  { id: "telegram", aliases: ["tg"], label: "Telegram", group: "Messaging", icon: "chat", payload: "text", dialect: "telegram",
    counter: { kind: "graphemes", max: 4096, about: true, note: "counted after formatting is applied" } },
  { id: "discord", label: "Discord", group: "Messaging", icon: "chat", payload: "text", dialect: "discord",
    counter: { kind: "graphemes", max: 2000, note: "4,000 with Nitro" } },
  { id: "teams", label: "Teams", group: "Messaging", icon: "chat", payload: "rich" },
  { id: "signal", label: "Signal", group: "Messaging", icon: "chat", payload: "text", dialect: "plain" },
  { id: "imessage", aliases: ["sms"], label: "iMessage", group: "Messaging", icon: "chat", payload: "text", dialect: "plain" },
  { id: "messenger", label: "Messenger", group: "Messaging", icon: "chat", payload: "text", dialect: "plain",
    counter: { kind: "graphemes", max: 2000, about: true } },

  { id: "x", aliases: ["twitter", "tweet"], label: "X", group: "Social", icon: "post", payload: "text", dialect: "plain",
    counter: { kind: "x" },   // max comes from the active tier
    tiers: { free: { label: "Free", max: 280, thread: true }, premium: { label: "Premium", max: 25000, thread: false } },
    openUrl: (t) => "https://x.com/intent/tweet?text=" + enc(t) },
  { id: "linkedin", label: "LinkedIn", group: "Social", icon: "post", payload: "text", dialect: "plain",
    counter: { kind: "graphemes", max: 3000 } },
  { id: "facebook", label: "Facebook", group: "Social", icon: "post", payload: "text", dialect: "plain" },
  { id: "instagram", label: "Instagram", group: "Social", icon: "post", payload: "text", dialect: "plain",
    counter: { kind: "graphemes", max: 2200 } },
  { id: "threads", label: "Threads", group: "Social", icon: "post", payload: "text", dialect: "plain",
    counter: { kind: "graphemes", max: 500, about: true }, thread: true,
    openUrl: (t) => "https://www.threads.com/intent/post?text=" + enc(t) },
  { id: "bluesky", aliases: ["bsky"], label: "Bluesky", group: "Social", icon: "post", payload: "text", dialect: "plain",
    counter: { kind: "graphemes", max: 300 }, thread: true,
    openUrl: (t) => "https://bsky.app/intent/compose?text=" + enc(t) },
  { id: "mastodon", label: "Mastodon", group: "Social", icon: "post", payload: "text", dialect: "plain",
    counter: { kind: "graphemes", max: 500, urlWeight: 23, about: true, note: "server default; links count 23" }, thread: true },
  { id: "reddit", label: "Reddit", group: "Social", icon: "post", payload: "text", dialect: "reddit" },
  { id: "tiktok", label: "TikTok", group: "Social", icon: "post", payload: "text", dialect: "plain" },
  { id: "youtube", aliases: ["yt"], label: "YouTube", group: "Social", icon: "post", payload: "text", dialect: "plain",
    counter: { kind: "graphemes", max: 5000, about: true, note: "description; YouTube counts bytes" } },

  { id: "plain", aliases: ["plaintext", "text", "txt"], label: "Plain text", group: "Generic", icon: "text", payload: "text", dialect: "plain", key: "p" },
  { id: "markdown", aliases: ["md"], label: "Markdown", group: "Generic", icon: "markdown", payload: "text", dialect: "markdown" },
];

export const destinationById = (id) => DESTINATIONS.find((d) => d.id === id);

// Every name a destination answers to: its id and its aliases.
export const channelNames = () => DESTINATIONS.flatMap((d) => [d.id, ...(d.aliases || [])]);

// An id or alias (any case) -> the destination id, or null.
export function resolveChannel(name) {
  const n = String(name || "").trim().toLowerCase();
  const d = DESTINATIONS.find((x) => x.id === n || (x.aliases || []).includes(n));
  return d ? d.id : null;
}

// Every tier id any destination offers (frontmatter `tier:` must be one).
export const TIER_IDS = [...new Set(DESTINATIONS.flatMap((d) => Object.keys(d.tiers || {})))];

// Channels that still need a recipient and subject in the frontmatter.
export const EMAIL_CHANNELS = DESTINATIONS.filter((d) => d.group === "Email").map((d) => d.id);
