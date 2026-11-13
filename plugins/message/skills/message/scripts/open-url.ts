// Allowlist for the POST /open endpoint in serve.ts. The endpoint hands the
// URL to the OS (`open` / `xdg-open`), so it must never become an
// open-anything launcher: only the compose URLs of destinations in
// scripts/client/destinations.js are accepted.
const ALLOWED_PREFIXES = [
  "https://mail.google.com/",
  "https://wa.me/",
  "mailto:",
  "whatsapp://",
  "https://x.com/intent/tweet?",
  "https://www.threads.com/intent/post?",
  "https://bsky.app/intent/compose?",
];

export function isAllowedOpenUrl(target: string): boolean {
  return ALLOWED_PREFIXES.some((p) => target.startsWith(p));
}
