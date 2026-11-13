---
name: message
description: Create and edit rich text message drafts for Gmail, Outlook, and WhatsApp, or Slack, X and social posts, with live browser preview. Runs on Bun for near-instant cold start and opens the preview automatically. Use when writing emails, drafting emails, composing replies, sending messages, writing WhatsApp or Slack messages, writing a tweet, X thread or LinkedIn post, or when user mentions Gmail, Outlook, WhatsApp, "email to", "reply to", "draft an email", "write an email", "send a message". Do NOT use for reading emails, managing contacts, or calendar invitations.
argument-hint: "[--<destination> e.g. --x --linkedin --whatsapp --plain] [--tier premium] [path to existing .fragment.md]"
allowed-tools: Bash, Write, Read, Edit
hooks:
  PostToolUse:
    - matcher: "Write|Edit|MultiEdit"
      hooks:
        - type: command
          command: "command -v bun >/dev/null 2>&1 || exit 0; bun run \"${CLAUDE_PLUGIN_ROOT}/hooks/auto-serve-fragment.ts\""
          timeout: 30
---

# Message Drafts

Bun-based preview server. Fragments are written in Markdown - the build script converts to platform-specific HTML. The plugin's PostToolUse hook (`hooks/auto-serve-fragment.ts`, registered in this file's frontmatter on the `Write|Edit|MultiEdit` matcher) auto-builds, starts the preview server, and opens the browser whenever a `.fragment.md` is written or edited.

## Flow

1. Write the `.fragment.md` directly to the drafts directory (see **File naming**) in ONE Write tool call.
   **Do NOT write the email body inline in your response before the Write call.** Compose the
   draft mentally and write it straight to the file - the preview server renders it.
2. After the Write tool returns, read the URL the hook wrote:
   ```bash
   cat "${CLAUDE_PROJECT_DIR}/.claude/.message-preview-url" 2>/dev/null
   ```
3. Reply with only the preview URL and a one-line summary:
   `Draft ready: email to Sam re invoice follow-up → http://127.0.0.1:XXXX`

**The hook has already started the server and opened the browser by the time the Write tool returns.** Do NOT run `bun run serve.ts` yourself. Do NOT call `open <url>`. Do NOT launch a second server. The browser is already open.

Edit a fragment only with Write or Edit. The hook fires on those tools alone, so a Bash or Python edit leaves the preview stale.

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
bash "${CLAUDE_PLUGIN_ROOT}/skills/message/scripts/preflight.sh"
```

Then serve (use `bun` if it is on PATH, otherwise `$HOME/.bun/bin/bun` - the
preflight prints the resolved path):

```bash
bun run "${CLAUDE_PLUGIN_ROOT}/skills/message/scripts/serve.ts" /path/to/name.fragment.md
```

Run with `run_in_background: true`. The server prints the output HTML path then the URL. Relay the URL to the user. On subsequent edits, the server hot-reloads automatically - do not re-run it.

## Choosing the destination

The preview opens on one destination chip. Pick it from the user's intent and **write it into the fragment** - `channel:` (plus `tier:` for X) - because the hook starts the server and passes no flags, so the frontmatter is your lever. For any non-email channel, leave out `to` and `subject`. Writing or changing `channel:` in an existing fragment switches the open tab on its next hot reload.

Skill arguments name the destination directly: `/message --x ...`, `--linkedin`, `--plaintext`. Any destination id or alias works as `--<name>`, and `--tier premium` sets the X tier. Set the matching `channel:` / `tier:`.

| The user says | `channel:` |
|---|---|
| tweet, post on X, thread | `x` (`tier: premium` only if they say they have X Premium) |
| LinkedIn post | `linkedin` |
| text, WhatsApp to ... | `whatsapp` |
| Slack message | `slack` |
| Bluesky, Threads, Mastodon, Reddit post | `bluesky`, `threads`, `mastodon`, `reddit` |
| just the text, plain text, no formatting | `plain` |
| Markdown, for a README or a doc | `markdown` |
| email, reply to, draft an email | none (Gmail), or `mail` when they name Outlook, Apple Mail or their mail app |

Ids, labels, groups and aliases: `bun run "${CLAUDE_PLUGIN_ROOT}/skills/message/scripts/serve.ts" --list-channels` (`--json` for JSON).

**Which destination wins**, first match: the preview URL's `?channel=<id>&tier=<t>` (re-points a running server without a restart) > a `serve.ts` flag (`--channel <id>`, `--<id>`, `--tier`) > the fragment's `channel:` / `tier:` > the choice remembered in this browser > Gmail. A chip clicked in the tab stays selected across hot reloads until that winning source changes (`resolveSelection()` in `scripts/client/selection.js`).

## Fragment format

Markdown with YAML frontmatter.

```markdown
---
to: recipient@example.com
subject: Subject line
cc: optional
bcc: optional
channel: optional - a destination id or alias, e.g. x, slack, linkedin, plaintext
tier: optional - free or premium, for X
---

Body content in Markdown. Supports bold, italic, ~~strikethrough~~, headings, lists, blockquotes, code, tables, links. Embed raw HTML where Markdown falls short.
```

Required: `to` and `subject` for email - no `channel`, or `channel: gmail` / `mail`. A post or chat message sets `channel` to its destination id (see **Destinations** below) and needs neither - Messaging, Social and Generic channels never require them, and the preview hides the To, CC, BCC and Subject rows for them. `tier` picks the X account tier (`free`, the default, or `premium`) and overrides the tier remembered in the browser. An unknown `channel` is a build error that lists the valid ids. Do not use horizontal rules - they render poorly in email clients.

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
<drafts-dir>/YYYY-MM-DD_recipient_subject.fragment.md
<drafts-dir>/YYYY-MM-DD_recipient_subject.html        # generated
```

`<drafts-dir>` is the drafts directory the project's CLAUDE.md or AGENTS.md names; if it names none, use the default `drafts/` (relative to the project root). The hook fires on any `*.fragment.md` wherever it lives, so any directory works.

## Preview UI

The preview is one picker of **destinations**, grouped Email / Generic / Messaging / Social, driving one **Copy** and one **Open ↗** button. The preview frame shows exactly what will be pasted for the selected destination: the rendered rich text for Gmail, the mail app and Teams, and the converted text for every markup or plain-text destination. To, CC, BCC and Subject show for the Email group only. A live counter next to Copy shows the destination's length limit where one is known ("about" where the figure is uncertain; X uses its weighted count) and turns red past it; elsewhere it shows the character count. The last choice is remembered per browser; a fragment's `channel` overrides it.

**X Free / Premium.** X has a Free / Premium toggle (remembered per browser; frontmatter `tier:` overrides it). Premium counts one post against 25,000. On Free, a post over 280 becomes a **numbered thread**: one card per post, each ending ` i/n`, each with its own counter and Copy. **C** copies the next post and moves on, so pressing C, pasting, and repeating posts the thread in order; Open opens X with the next post. Bluesky, Threads and Mastodon thread the same way past their limits. Splitting rules: `references/destinations.md` ("X").

Keyboard shortcuts:

- **C / O** - copy / open for the selected destination (in a thread, C copies the next post)
- **[ / ]** - previous / next destination (arrow keys work on a focused chip)
- **G / T / M / P** - select and copy Gmail / Rich Text / WhatsApp / Plain text
- **E / W** - open the mail app / WhatsApp
- **R** - manual reload

**Gmail** copies the Gmail-native HTML (`scripts/transform-gmail.ts`) from an off-screen body, so its payload stays faithful. **Rich Text** (the mail app, and Teams) is the inline-styled HTML that pastes cleanly into any desktop mail client, not just Outlook. Both copy with the Clipboard API's HTML MIME type, so paste into Gmail/Outlook/Thunderbird keeps the formatting in one clean operation. Every other destination copies `text/plain` only, converted by `renderDialect()` in `scripts/client/dialects.js` from the same marked HTML; when the Clipboard API is refused, text copies fall back to a hidden textarea.

**Open ↗ launches the system default apps.** Each Open action POSTs to the preview server's `/open` endpoint, which hands the URL to the OS (see **Platform support**), so compose windows open in the user's real browser or app even when the preview is viewed inside an embedded webview (VS Code / Zed in-app browsers, terminal-app browser panes). Open is offered only where a destination has a real compose URL; the endpoint allowlists exactly those (`scripts/open-url.ts`) and answers 502 when no handler could be launched. If the page is opened as a static file with no server, or the server refuses, the buttons fall back to in-page `window.open`.

Features: light and dark via `prefers-color-scheme`, live WebSocket hot reload (typically <100 ms; atomic-save editors reload via a 300 ms mtime poll), a tooltip on every control, keyboard focus outlines, works at phone width. Build errors render as a red overlay with the exact message instead of a silent failure.

### Destinations

| Group | Destinations | Pasted as |
|---|---|---|
| Email | Gmail, Mail app | Gmail-native HTML; inline-styled rich text |
| Messaging | WhatsApp, Slack, Telegram, Discord | each app's own typed markup |
| Messaging | Teams | rich text |
| Messaging | Signal, iMessage, Messenger | plain text (their formatting is menu-only) |
| Social | Reddit | Reddit Markdown |
| Social | X, LinkedIn, Facebook, Instagram, Threads, Bluesky, Mastodon, TikTok, YouTube | plain text |
| Generic | Plain text, Markdown | no markup; clean GFM |

The registry is `DESTINATIONS` in `scripts/client/destinations.js` (one row each: payload, dialect, counter, compose URL, shortcut); adding a destination is one row. What each platform's composer really accepts, its limits and compose links, with sources and the open unknowns: `references/destinations.md`.

### Email tables

In the Gmail and Rich Text payloads (and so Teams), a column whose body cells are all numbers is right-aligned and set in a monospaced font with tabular figures, so amounts line up. That covers currency (`$6,000`, `AUD 1,200`), negatives (`-12`, `(1,200)`), percentages and `k`/`m` suffixes, and the header is right-aligned but keeps its font. Detection uses the body cells only; empty cells and `-` are skipped, and one text cell keeps the column as text. An explicit `:--` / `:-:` / `--:` alignment on that column wins. Everything else in the table is untouched. Rules: `scripts/numeric-columns.ts`, `references/formatting-rules.md` ("Tables: numeric columns").

### WhatsApp tables

The **WhatsApp** destination renders a table as a fenced ``` code block with columns padded to equal width, so it reads as an aligned grid in WhatsApp's monospace rendering; Gmail and Rich Text keep the real HTML table; Slack, Telegram and Discord use the same grid with their own width budget (`DIALECTS` in `scripts/client/dialects.js`). A table too wide for a small phone (`TABLE_WIDTH_BUDGET` in `scripts/client/text-common.js`) is stacked instead: one block per row, the first cell as a bold title and each other cell as `Header: value`. Keep WhatsApp-bound tables to 2-3 lean columns to keep the grid. Mechanics and limits: `references/whatsapp-formatting.md`.

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

After a client-facing draft, ask whether the user wants any follow-up their project defines for sent messages.

## References

**Maintainer-only - do NOT load while drafting.** You write Markdown; the build
script's transforms produce all the inline-styled HTML. Loading these mid-draft
will mislead you into hand-writing raw HTML. They exist so a human can
audit/adjust the transform output.

- `references/formatting-rules.md` - Gmail native HTML the build transform emits
- `references/outlook-formatting.md` - Outlook element styles and colour palette
- `references/whatsapp-formatting.md` - WhatsApp text conversion and fixed-width table mechanics
- `references/plaintext-formatting.md` - plain-text conversion rules (X and other social posts)
- `references/destinations.md` - every destination: what its composer accepts, limits, compose URLs, sources

## Development

Code lives in `${CLAUDE_PLUGIN_ROOT}/skills/message/scripts/`. First-time setup on any machine: `bash "${CLAUDE_PLUGIN_ROOT}/skills/message/scripts/preflight.sh"` - it installs bun + dependencies and self-tests, or fails loudly with the fix. Then `bun` commands work (fall back to `$HOME/.bun/bin/bun` if bun is not on PATH). Run tests: `cd "${CLAUDE_PLUGIN_ROOT}/skills/message" && bun test`. Build-only without serving: `bun run "${CLAUDE_PLUGIN_ROOT}/skills/message/scripts/serve.ts" <fragment> --build-only`.

## Platform support

Works on macOS, Linux, WSL2 (Ubuntu), and native Windows. The hook is `auto-serve-fragment.ts` and runs under Bun on all platforms. When `bun` is not on PATH the hook exits silently and nothing is previewed - run the **Fallback** preflight, which installs bun. Browser opening is handled by `serve.ts` itself (`scripts/open-command.ts`), never through a shell, so a URL's `&` survives: `open` on macOS, `rundll32.exe url.dll,FileProtocolHandler` on Windows, and on WSL2 `wslview` when installed, else `rundll32.exe` from PATH or from the mounted Windows drive (opens the Windows host browser via shared localhost); `xdg-open` elsewhere. On minimal Linux setups without `xdg-open` handlers for `mailto:`/`whatsapp://`, the Open buttons may no-op - use the Copy buttons instead.
