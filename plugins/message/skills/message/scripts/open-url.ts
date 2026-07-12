// Allowlist for the POST /open endpoint in serve.ts. The endpoint hands the
// URL to the OS (`open` / `xdg-open`), so it must never become an
// open-anything launcher: only the exact destinations the preview's three
// Open buttons produce are accepted.
const ALLOWED_PREFIXES = [
  "https://mail.google.com/",
  "https://wa.me/",
  "mailto:",
  "whatsapp://",
];

export function isAllowedOpenUrl(target: string): boolean {
  return ALLOWED_PREFIXES.some((p) => target.startsWith(p));
}
