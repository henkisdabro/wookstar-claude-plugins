// Pure mailto: URL construction, shared by the preview UI (injected into
// shell.html at build time) and its unit tests. No DOM access - the browser
// side extracts the field strings and passes them in.

// Reduce a free-text "To"/"Cc" value to a comma-separated addr list: pull the
// address out of any "Name <addr>" form. Addresses are left BARE - RFC 6068
// allows a literal "@", and percent-encoding it to "%40" makes macOS / Thunderbird
// / Apple Mail treat the recipient as malformed and refuse to open. Real email
// addresses are already URL-safe, so no encoding is needed here.
export function mailtoAddrs(raw) {
  return (raw || "")
    .split(",")
    .map((part) => {
      const m = part.match(/<([^>]+)>/);
      return (m ? m[1] : part).trim();
    })
    .filter(Boolean)
    .join(",");
}

// Build a mailto: href from message fields. mailto carries plain text only.
// Returns { href, overflow }. Desktop clients (Thunderbird, Apple Mail, Outlook)
// handle long mailto bodies fine, so the default limit is generous - it only
// guards genuinely pathological drafts. Windows ShellExecute has a hard ~2083
// cap, but truncating every normal email to protect that case is worse UX than
// letting the body through. On overflow we set overflow=true and return an href
// WITHOUT the body, and the caller puts the body on the clipboard instead.
export function buildMailto(fields, maxLen = 16000) {
  const to = mailtoAddrs(fields.to);
  const params = [];
  if (fields.subject) params.push("subject=" + encodeURIComponent(fields.subject));
  const cc = mailtoAddrs(fields.cc);
  const bcc = mailtoAddrs(fields.bcc);
  if (cc) params.push("cc=" + cc);
  if (bcc) params.push("bcc=" + bcc);
  const noBody = () => "mailto:" + to + (params.length ? "?" + params.join("&") : "");
  // No body param when the caller hands us an empty body - this is the
  // "copy the rich text, open an empty compose window, paste it in yourself"
  // path (the mailto only carries to/subject/cc/bcc). Keeps the recipient clean:
  // mailto:addr with no stray trailing "?".
  if (!fields.body) return { href: noBody(), overflow: false };
  const body = fields.body.replace(/\r?\n/g, "\r\n");
  const withBody = params.concat("body=" + encodeURIComponent(body));
  const full = "mailto:" + to + "?" + withBody.join("&");
  if (full.length <= maxLen) return { href: full, overflow: false };
  return { href: noBody(), overflow: true };
}
