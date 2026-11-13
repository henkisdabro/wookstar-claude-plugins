# Message Plugin

Message drafts with a live browser preview: rich-text email for Gmail and desktop mail apps, and correctly converted text for WhatsApp, Slack, Telegram, Discord, X, LinkedIn, Bluesky and 15 more destinations.

## Prerequisites

- [Bun](https://bun.sh) runtime on PATH. Without it the preview hook exits silently (no error on every write) and no preview opens; the preflight below installs it.

Dependencies install automatically on first use (the hook runs `bun install` in the skill's scripts directory). To set up manually, or to self-test the environment:

```bash
bash <skill-dir>/scripts/preflight.sh
```

The skill directory is typically `~/.claude/plugins/message/skills/message/`.

## Installation

```bash
/plugin install message@wookstar-claude-plugins
```

## Usage

Ask Claude to draft a message:

- "Write an email to John about the project update"
- "Draft a reply to Sarah's proposal"
- "Send a WhatsApp message to the team about the meeting"
- "Email to client@example.com with three pricing options"
- "Write a tweet announcing the release" (an X Free post over 280 characters becomes a numbered thread)
- "Draft a LinkedIn post about the launch"
- "Slack message to the team about the outage"

To edit an existing draft:

- `/message drafts/2026-02-12_john_update.fragment.md`
- "Change the subject line in that email"
- "Fix the typo in the second paragraph"

## Architecture

```
Claude writes                Hook / build script          Output
name.fragment.md   --->      Markdown -> HTML   --->      name.html
(frontmatter + body)         Gmail transform               (self-contained preview
                             Rich Text transform            with a destination
                             Inline client JS               picker + Copy/Open)
                             Inject into shell.html
```

- **Fragment** (`.fragment.md`): Markdown with YAML frontmatter - `to` and `subject` for email, optional `cc`/`bcc`, and optional `channel` (destination id or alias) and `tier` (`free`/`premium`, for X). A non-email `channel` needs no `to` or `subject`
- **Shell** (`templates/shell.html`): Static template with all CSS, JS, and dark-mode chrome
- **Client scripts** (`scripts/client/`): the destination registry (`destinations.js`), one dialect-driven text converter (`dialects.js`, `text-common.js`), length counters (`counter.js`), thread splitting (`thread.js`) and destination precedence (`selection.js`), inlined into the output at build time - the built `.html` is fully self-contained
- **Build pipeline** (`scripts/`): TypeScript modules compiled and run by Bun

## What's Included

- **1 skill** - Message drafting with Gmail-native HTML, inline-styled Rich Text (pastes cleanly into any desktop mail client), and text converted for each messaging and social destination
- **1 shell template** - Light/dark preview with WebSocket hot-reload, a destination picker, length counters, X threads and keyboard shortcuts
- **TypeScript modules** in `scripts/` - `build.ts`, `parse.ts`, `serve.ts`, `cli-args.ts`, `open-url.ts`, `open-command.ts`, `transform-*.ts`, `types.ts` - plus the client scripts above
- **5 references** - Gmail rendering behaviour, Rich Text element styles, WhatsApp and plain-text conversion rules, and `destinations.md` (what each platform's composer accepts, its limits and compose URLs, with sources)
- **Preflight script** - `scripts/preflight.sh` installs bun + dependencies and self-tests the build
- **Tests** - `bun run test` in `scripts/`

## Destinations

| Group | Destinations | Pasted as |
|---|---|---|
| Email | Gmail, Mail app | Gmail-native HTML; inline-styled rich text |
| Generic | Plain text, Markdown | no markup; clean GFM |
| Messaging | WhatsApp, Slack, Telegram, Discord | each app's own typed markup |
| Messaging | Teams | rich text |
| Messaging | Signal, iMessage, Messenger | plain text (their formatting is menu-only) |
| Social | Reddit | Reddit Markdown |
| Social | X, LinkedIn, Facebook, Instagram, Threads, Bluesky, Mastodon, TikTok, YouTube | plain text |

**Open ↗** is offered where a real compose URL exists: Gmail, the mail app, WhatsApp, X, Threads and Bluesky. A counter beside Copy shows the destination's length limit where one is known (X uses its weighted count) and turns red past it.

**X Free / Premium.** A toggle on X picks the account tier. Premium counts one post against 25,000. On Free, a post over 280 becomes a numbered thread (` 1/3`, ` 2/3` ...), one card per post; `C` copies the next post and moves on. Bluesky, Threads and Mastodon thread the same way past their limits.

### Choosing the destination

The first match wins:

1. the preview URL's `?channel=<id>&tier=<t>` - re-points a running preview without a restart
2. a `serve.ts` flag - `--channel <id>`, a shorthand `--<id or alias>` (`--x`, `--linkedin`, `--plaintext` ...), `--tier premium`
3. the fragment's `channel:` / `tier:` frontmatter
4. the choice remembered in this browser
5. Gmail

The auto-serve hook passes no flags, so the frontmatter decides for previews it starts. `/message --x ...` and similar skill arguments tell Claude which `channel:` to write. List every id, label, group and alias with:

```bash
bun run <skill-dir>/scripts/serve.ts --list-channels   # --json for JSON
```

Aliases: `email` (gmail); `outlook`, `mail-app`, `rich` (mail); `wa` (whatsapp); `tg` (telegram); `sms` (imessage); `twitter`, `tweet` (x); `bsky` (bluesky); `yt` (youtube); `plaintext`, `text`, `txt` (plain); `md` (markdown). An unknown channel or tier is a build error that lists the valid values.

## Preview UI

One destination picker drives one **Copy** and one **Open ↗** button; the preview shows exactly what Copy will paste. To, CC, BCC and Subject show for the Email group only. Keyboard shortcuts:

| Key | Action |
|-----|--------|
| `C` | Copy for the selected destination (in a thread, the next post) |
| `O` | Open the selected destination's compose window |
| `[` / `]` | Previous / next destination (arrow keys on a focused chip) |
| `G` | Select and copy Gmail (rich HTML) |
| `T` | Select and copy Rich Text (inline-styled HTML for any desktop mail client) |
| `M` | Select and copy WhatsApp (tables as aligned monospace grids, or stacked per row when too wide for a phone) |
| `P` | Select and copy Plain text (no markup, `text/plain` only) |
| `E` | Open the default mail app (`mailto:` with recipients + subject) |
| `W` | Open WhatsApp |
| `R` | Force reload |

Gmail and Rich Text copy with the Clipboard API's HTML MIME type - paste into Gmail, Outlook, or Thunderbird preserves full formatting in one clean operation. Every other destination copies `text/plain`, with a hidden-textarea fallback when the Clipboard API is refused. Open buttons POST to the preview server's `/open` endpoint, which launches the URL via the OS default handler - so the right app opens even when the preview is viewed inside an embedded webview. The endpoint accepts only the destinations' compose URL forms (see `scripts/open-url.ts`) and answers 502 when no handler could be launched, so the page falls back to `window.open`.

## Workflow

1. Claude writes a `.fragment.md` to the drafts directory - `drafts/` by default; name a different one in your project's CLAUDE.md or AGENTS.md to override it (the hook fires on any `*.fragment.md`)
2. The PostToolUse hook (`auto-serve-fragment.ts`, runs under Bun) auto-builds and launches the preview server; the server opens the browser once, the instant its port is ready
3. Edits to the fragment hot-reload in under 100 ms via WebSocket (atomic-save editors reload via a 300 ms mtime poll)
4. Pick a destination, then use Copy and Open to paste or send it
5. A server stays alive while a preview tab is connected; with none, it shuts down after 30 minutes idle and the next write/edit starts a fresh one

## Platform Support

macOS, Linux, WSL2 (Ubuntu), and native Windows. Browser opening never goes through a shell, so a URL's `&` survives (`scripts/open-command.ts`): `open` on macOS, `rundll32.exe url.dll,FileProtocolHandler` on Windows, and on WSL2 `wslview` when installed, else `rundll32.exe` from PATH or from the mounted Windows drive (opens the Windows host browser via shared localhost); `xdg-open` elsewhere.
