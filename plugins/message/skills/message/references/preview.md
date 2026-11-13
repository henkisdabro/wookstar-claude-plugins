# Preview: UI, rendering and platform support

How the preview page behaves once a fragment is served: the destination picker, Copy and Open, shortcuts, how tables render per destination, hot reload, and what opens the browser on each platform. `SKILL.md` carries what drafting needs; this file is the detail behind it.

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

## Destinations

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

## Email tables

In the Gmail and Rich Text payloads (and so Teams), a column whose body cells are all numbers is right-aligned and set in a monospaced font with tabular figures, so amounts line up. That covers currency symbols and codes (`$`, `€`, `£`, `AUD`: `€6,000`, `AUD 1,200`), negatives, percentages and `k`/`m` suffixes, and the header is right-aligned but keeps its font. Detection uses the body cells only; empty cells and `-` are skipped, and one text cell keeps the column as text. An explicit `:--` / `:-:` / `--:` alignment on that column wins. Everything else in the table is untouched. **Write negative amounts with a leading minus** (`-1,200`, `-12%`, and the minus before any symbol or code, as in `-AUD 1,200`), never accounting brackets. A bracketed negative in a numeric column is rewritten with a minus anyway (`(1,200)` becomes `-1,200`, `AUD (1,200)` becomes `-AUD 1,200`), while text columns keep their brackets. Rules: `scripts/numeric-columns.ts`, `references/formatting-rules.md` ("Tables: numeric columns").

## WhatsApp tables

The **WhatsApp** destination renders a table as a fenced ``` code block with columns padded to equal width, so it reads as an aligned grid in WhatsApp's monospace rendering; Gmail and Rich Text keep the real HTML table; Slack, Telegram and Discord use the same grid with their own width budget (`DIALECTS` in `scripts/client/dialects.js`). A table too wide for a small phone (`TABLE_WIDTH_BUDGET` in `scripts/client/text-common.js`) is stacked instead: one block per row, the first cell as a bold title and each other cell as `Header: value`. Keep WhatsApp-bound tables to 2-3 lean columns to keep the grid. Mechanics and limits: `references/whatsapp-formatting.md`.

## Destination precedence

**Which destination wins**, first match: the preview URL's `?channel=<id>&tier=<t>` (re-points a running server without a restart) > a `serve.ts` flag (`--channel <id>`, `--<id>`, `--tier`) > the fragment's `channel:` / `tier:` > the choice remembered in this browser > Gmail. A chip clicked in the tab stays selected across hot reloads until that winning source changes (`resolveSelection()` in `scripts/client/selection.js`).

## Hot reload

Edit the `.fragment.md` file. The running server detects the change (`fs.watch` fast path, plus a 300 ms mtime poll that catches the atomic write+rename saves `fs.watch` silently drops on macOS) and pushes a reload over WebSocket. No manual refresh. Latency from save to visible update: typically under 100 ms, up to ~400 ms for atomic-save editors.

## Env flags

- `MESSAGE_NO_OPEN=1` - skip auto-opening the browser (useful in headless contexts)
- `MESSAGE_REMOTE=1` (or `serve.ts --remote`) - remote mode, below. `MESSAGE_REMOTE=0` silences the remote guess.

## Remote sessions

The server binds `127.0.0.1` on the machine it runs on, so a browser on another machine reaches it only through a forwarded port. `scripts/remote.ts` decides between two levels:

- **Suspected** - `SSH_CONNECTION` or `SSH_TTY` is set, or it is Linux with no `DISPLAY` / `WAYLAND_DISPLAY` (WSL excluded). Behaviour is unchanged, browser launch included; the server prints a `remote-preview: suspected (...)` note after the URL, with the forwarding command for its port. The guess misses sessions that carry no SSH variables (terminal multiplexer daemons, containers, WSL reached from another machine) - set `MESSAGE_REMOTE=1` there.
- **On** - `MESSAGE_REMOTE=1` or `--remote`. The server launches no browser, `/open` answers 403, and the page opens compose links itself, in the browser showing the preview.

The note is also the `remote` field of `/check-modified`; the hook writes it to `.claude/.message-preview-note` and removes that file for a local session. The forwarding command binds loopback on both ends and leaves the SSH host as a placeholder, because `SSH_CONNECTION` holds addresses, not the alias or jump host the user connects with. The port is random per server, so the command is per draft.

**Requests.** The server refuses any request whose `Host` is not `127.0.0.1`, `localhost` or `[::1]` (any port, so a forwarded port that differs still works), and `/open` and `/ws` refuse an `Origin` that is not loopback.

## Platform support

Works on macOS, Linux, WSL2 (Ubuntu), and native Windows. The hook is `auto-serve-fragment.ts` and runs under Bun on all platforms. When `bun` is not on PATH the hook exits silently and nothing is previewed - run the **Fallback** preflight in `SKILL.md`, which installs bun. Browser opening is handled by `serve.ts` itself (`scripts/open-command.ts`), never through a shell, so a URL's `&` survives: `open` on macOS, `rundll32.exe url.dll,FileProtocolHandler` on Windows, and on WSL2 `wslview` when installed, else `rundll32.exe` from PATH or from the mounted Windows drive (opens the Windows host browser via shared localhost); `xdg-open` elsewhere. On minimal Linux setups without `xdg-open` handlers for `mailto:`/`whatsapp://`, the Open buttons may no-op - use the Copy buttons instead.
