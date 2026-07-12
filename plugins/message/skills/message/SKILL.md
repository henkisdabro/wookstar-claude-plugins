---
name: message
description: Create and edit rich text message drafts for Gmail, Outlook, and WhatsApp with live browser preview. Runs on Bun for near-instant cold start and opens the preview automatically. Use when writing emails, drafting emails, composing replies, sending messages, writing WhatsApp messages, or when user mentions Gmail, Outlook, WhatsApp, "email to", "reply to", "draft an email", "write an email", "send a message". Do NOT use for reading emails, managing contacts, or calendar invitations.
argument-hint: "[optional: path to existing .fragment.md for editing]"
model: sonnet
allowed-tools: Bash, Write, Read, Edit
hooks:
  PostToolUse:
    - matcher: "Write|Edit|MultiEdit"
      hooks:
        - type: command
          command: "bun run ${CLAUDE_PLUGIN_ROOT}/hooks/auto-serve-fragment.ts"
          timeout: 30
---

# Message Drafts

Bun-based preview server. Fragments are written in Markdown - the build script converts to platform-specific HTML. The plugin's PostToolUse hook (`hooks/auto-serve-fragment.ts`, registered in this file's frontmatter on the `Write|Edit|MultiEdit` matcher) auto-builds, starts the preview server, and opens the browser whenever a `.fragment.md` is written or edited.

## Flow

1. Write the `.fragment.md` directly to `data/writing/email_drafts/` in ONE Write tool call.
   **Do NOT write the email body inline in your response before the Write call.** Compose the
   draft mentally and write it straight to the file - the preview server renders it.
2. After the Write tool returns, read the URL the hook wrote:
   ```bash
   cat "${CLAUDE_PROJECT_DIR}/.claude/.message-preview-url" 2>/dev/null
   ```
3. Reply with only the preview URL and a one-line summary:
   `Draft ready: email to Sam re invoice follow-up → http://127.0.0.1:XXXX`

**The hook has already started the server and opened the browser by the time the Write tool returns.** Do NOT run `bun run serve.ts` yourself. Do NOT call `open <url>`. Do NOT launch a second server. The browser is already open.

**Always relay the preview URL to the user.** Read it from `.claude/.message-preview-url`. If that file is empty or missing, the hook did not start a server - run the manual **Fallback** below rather than guessing at a URL.

**On revision** ("make it shorter", "change the tone"): use Read to load the fragment, Edit to apply changes. The running server hot-reloads over WebSocket (typically <100 ms; up to ~400 ms for editors that save atomically, which reload via the mtime poll). Do not echo the revised body - just confirm the change and include the same URL. Do NOT start a new server - the existing one is still running (and the `Edit` matcher on the hook will resurrect one if it had shut down).

**Multiple concurrent drafts** are fully supported. Each fragment gets its own server on its own port. A server stays alive while a preview tab is connected to it; with no connected tab it idle-shuts-down after 30 minutes (re-writing/editing the fragment starts a fresh one via the hook). To find the URL for any previously opened draft, run:

```bash
python3 -c "
import json, sys
d = json.load(open('${CLAUDE_PROJECT_DIR}/.claude/.message-previews.json'))
print(d.get(sys.argv[1], 'not found'))
" "/absolute/path/to/draft.fragment.md"
```

## Fallback - if hook is not firing

If the hook is not firing (e.g. skill used outside the plugin), run manually.
On a fresh install or a new machine, run the preflight first - it resolves/installs
bun, installs dependencies, self-tests the build, and prints the exact serve
command (and fails loudly with the fix if the environment is missing something):

```bash
bash ${CLAUDE_PLUGIN_ROOT}/skills/message/scripts/preflight.sh
```

Then serve (use `bun` if it is on PATH, otherwise `$HOME/.bun/bin/bun` - the
preflight prints the resolved path):

```bash
bun run ${CLAUDE_PLUGIN_ROOT}/skills/message/scripts/serve.ts /path/to/name.fragment.md
```

Run with `run_in_background: true`. The server prints the output HTML path then the URL. Relay the URL to the user. On subsequent edits, the server hot-reloads automatically - do not re-run it.

## Fragment format

Markdown with YAML frontmatter.

```markdown
---
to: recipient@example.com
subject: Subject line
cc: optional
bcc: optional
---

Body content in Markdown. Supports bold, italic, ~~strikethrough~~, headings, lists, blockquotes, code, tables, links. Embed raw HTML where Markdown falls short.
```

Required: `to`, `subject`. Do not use horizontal rules - they render poorly in email clients.

Line breaks: a single newline inside a paragraph is a real line break in every lane (`marked` runs with `breaks: true`), so write sign-offs as `Best,` newline `Alex` - no trailing-space tricks. Consequently, never hard-wrap prose; keep each paragraph on one source line. A blank line separates paragraphs and renders as one blank line in all lanes. Around other blocks the lanes differ deliberately: headings sit flush above their text in both email lanes; the Gmail lane adds no blank line around lists (Gmail's own paste margins provide the gap) while the Rich Text lane does; the WhatsApp lane keeps code-block fences flush against neighbouring text. See references/formatting-rules.md, outlook-formatting.md and whatsapp-formatting.md for the per-lane rules.

Note: em and en dashes in the subject or body fail the build by design (house style: use " - " instead). The preview shows the exact error; replace the dash and it hot-reloads.

## Tables - mandatory rules

When using tables, ALWAYS provide meaningful header names in the first row. Markdown's pipe-table syntax accepts blank headers (`| | |`) but the rendered output then shows a styled header row with no labels.

GOOD:

```markdown
| Item | Amount |
|---|--:|
| Salary | $1,000.00 |
```

BAD - blank header row:

```markdown
| | |
|---|--:|
| Salary | $1,000.00 |
```

If a table truly has no natural header, use descriptive labels like `Item` / `Amount`, `Field` / `Value`, `Category` / `Notes`. Header cells render with a light grey background (`#f5f5f5`) by default in both email lanes to differentiate them from data rows.

## File naming

```
data/writing/email_drafts/YYYY-MM-DD_recipient_subject.fragment.md
data/writing/email_drafts/YYYY-MM-DD_recipient_subject.html        # generated
```

The hook fires on any `*.fragment.md` wherever it lives, so projects that keep drafts elsewhere work too - the path above is the recommended convention.

## Preview UI

The browser preview shows three destination **lanes** - **Gmail / Mail app / WhatsApp** - each with a step-1 **Copy** button and a step-2 **Open ↗** button. Internally they are still keyed `gmail` / `outlook` / `whatsapp` (wired to the build). The single visible body preview is the Rich Text rendering; the Gmail body stays off-screen so its copy payload remains faithful. Keyboard shortcuts:

- **G / T / M** - copy for Gmail / copy Rich Text / copy Markdown
- **E / W** - open default mail app / open WhatsApp
- **R** - manual reload

**Open ↗ buttons launch the system default apps.** Each Open action POSTs to the preview server's `/open` endpoint, which hands the URL to the OS (`open` / `xdg-open` / `cmd start`) - so Gmail compose, the mail app, and WhatsApp open in the user's real browser/apps even when the preview page itself is viewed inside an embedded webview (VS Code / Zed in-app browsers, terminal-app browser panes). The endpoint allowlists only the four destination URL forms (`scripts/open-url.ts`); if the page is opened as a static file with no server, the buttons fall back to in-page `window.open`.

Features: dark-mode aware, live WebSocket hot reload (typically <100 ms; atomic-save editors reload via a 300 ms mtime poll), tooltips on every button, mobile-responsive, copy buttons use the Clipboard API's HTML MIME type so paste into Gmail/Outlook/Thunderbird preserves formatting as a single clean operation. The **Rich Text** lane (the old "Outlook" transform) is inline-styled HTML that pastes cleanly into any desktop mail client, not just Outlook. Build errors render as a red overlay with the exact message instead of a silent failure.

### WhatsApp tables

**Copy Markdown** renders any table in the message as a fenced ``` code block with columns padded to equal width, so it reads as an aligned grid in WhatsApp's monospace rendering; the Gmail and Rich Text lanes keep the real HTML table. Keep WhatsApp-bound tables to 3-4 lean columns. Mechanics and limits: `references/whatsapp-formatting.md`.

## Edit flow

Edit the `.fragment.md` file. The running server detects the change (`fs.watch` fast path, plus a 300 ms mtime poll that catches the atomic write+rename saves `fs.watch` silently drops on macOS) and pushes a reload over WebSocket. No manual refresh. Latency from save to visible update: typically under 100 ms, up to ~400 ms for atomic-save editors.

## Env flags

- `MESSAGE_NO_OPEN=1` - skip auto-opening the browser (useful in headless contexts)

## Date and day-of-week accuracy

Any fragment that names a specific date, a day of week, or a relative time ("this Thursday", "next week", "the 15th", "COB Friday", "tomorrow", "end of the month") MUST be verified with a `python3` datetime run BEFORE the draft is finalised - never rely on mental arithmetic. Confirm the weekday matches the calendar date, that any relative reference resolves to the intended absolute date, and that the date is not unintentionally in the past. Anchor relative references to today's date (in the environment context).

```bash
python3 -c "import datetime; d=datetime.date(2026,7,17); print(d.strftime('%A %d %B %Y'))"
```

If the check contradicts the draft (e.g. it says "Thursday the 15th" but the 15th is a Wednesday), fix the fragment and re-verify. The preview hot-reloads, so correcting the date in the fragment updates the preview immediately.

## Structure and tone

1. Lead with the point (request, update, instruction the recipient must act on)
2. Supporting detail (context, logistics)
3. Warm close (gratitude, relational content) just before the sign-off

Match the recipient's formality.

## Your defaults

Customise these for the user's context:

- From / reply-to: `your-email@example.com`
- Sign-off: `Best,\n[Your Name]`

## After preview

Once the user has the preview URL, ask: "Would you like me to run the humanise skill on this draft to make it sound more natural?"

## Post-draft actions

After a client-facing draft, prompt the user if they'd like to log this to a comms log or trigger any downstream actions in their project.

## References

**Maintainer-only - do NOT load while drafting.** You write Markdown; the build
script's transforms produce all the inline-styled HTML. Loading these mid-draft
will mislead you into hand-writing raw HTML. They exist so a human can
audit/adjust the transform output.

- `references/formatting-rules.md` - Gmail native HTML the build transform emits
- `references/outlook-formatting.md` - Outlook element styles and colour palette
- `references/whatsapp-formatting.md` - WhatsApp text conversion and fixed-width table mechanics

## Development

Code lives in `${CLAUDE_PLUGIN_ROOT}/skills/message/scripts/`. First-time setup on any machine: `bash scripts/preflight.sh` - it installs bun + dependencies and self-tests, or fails loudly with the fix. Then `bun` commands work (fall back to `$HOME/.bun/bin/bun` if bun is not on PATH). Run tests: `cd skills/message && bun test`. Build-only without serving: `bun run scripts/serve.ts <fragment> --build-only`.

## Platform support

Works on macOS, Linux, WSL2 (Ubuntu), and native Windows. The hook is `auto-serve-fragment.ts` and runs under Bun on all platforms - `bun` must be on PATH. Browser opening is handled by `serve.ts` itself: `open` on macOS, `cmd /c start` on Windows, `cmd.exe /c start` on WSL2 (opens the Windows host browser via shared localhost), `xdg-open` elsewhere. On minimal Linux setups without `xdg-open` handlers for `mailto:`/`whatsapp://`, the Open buttons may no-op - use the Copy buttons instead.
