// Allowlist for the POST /open endpoint in serve.ts. The endpoint hands the
// URL to the OS (`open` / `xdg-open`), so it must never become an
// open-anything launcher: only the compose URLs of destinations in
// scripts/client/destinations.js are accepted.
const ALLOWED_PREFIXES = [
  "https://mail.google.com/",
  "mailto:",
  "whatsapp://",
  "slack://open",
  "tg://",
  "msteams:",
  "discord://",
  "sms:",
  "https://www.messenger.com/",
  "https://x.com/intent/tweet?",
  "https://www.threads.com/intent/post?",
  "https://bsky.app/intent/compose?",
];

// Web versions opened when a destination's desktop app is not installed
// (each destination's webUrl). HTTPS only, and only these.
const WEB_FALLBACK_PREFIXES = [
  "https://web.whatsapp.com/",
  "https://app.slack.com/client",
  "https://web.telegram.org/",
  "https://teams.microsoft.com/",
  "https://discord.com/app",
];

export function isAllowedOpenUrl(target: string): boolean {
  return ALLOWED_PREFIXES.some((p) => target.startsWith(p)) || isAllowedWebFallback(target);
}

export function isAllowedWebFallback(target: string): boolean {
  return WEB_FALLBACK_PREFIXES.some((p) => target.startsWith(p));
}
