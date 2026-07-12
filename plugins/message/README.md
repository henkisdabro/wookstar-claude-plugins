# Message Plugin

Rich text message drafts for Gmail, desktop mail apps, and WhatsApp with live browser preview.

## Prerequisites

- [Bun](https://bun.sh) runtime on PATH

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

To edit an existing draft:

- `/message data/writing/email_drafts/2026-02-12_john_update.fragment.md`
- "Change the subject line in that email"
- "Fix the typo in the second paragraph"

## Architecture

```
Claude writes                Hook / build script          Output
name.fragment.md   --->      Markdown -> HTML   --->      name.html
(frontmatter + body)         Gmail transform               (self-contained preview
                             Rich Text transform            with three destination
                             Inline client JS               lanes + Copy/Open buttons)
                             Inject into shell.html
```

- **Fragment** (`.fragment.md`): Markdown with YAML frontmatter (`to`, `subject`, optional `cc`/`bcc`)
- **Shell** (`templates/shell.html`): Static template with all CSS, JS, and dark-mode chrome
- **Client scripts** (`scripts/client/`): Copy/Open lane logic and WhatsApp fixed-width table rendering, inlined into the output at build time - the built `.html` is fully self-contained
- **Build pipeline** (`scripts/`): TypeScript modules compiled and run by Bun

## What's Included

- **1 skill** - Message drafting with Gmail-native HTML, inline-styled Rich Text (pastes cleanly into any desktop mail client), and WhatsApp text conversion with aligned monospace tables
- **1 shell template** - Dark-mode aware preview with WebSocket hot-reload, Copy/Open lanes, and keyboard shortcuts
- **8 TypeScript modules** - `build.ts`, `parse.ts`, `serve.ts`, `open-url.ts`, `transform-gmail.ts`, `transform-outlook.ts`, `transform-shared.ts`, `types.ts` + 2 client scripts (`client/mailto.js`, `client/whatsapp.js`)
- **3 formatting references** - Gmail rendering behaviour, Rich Text element styles, and WhatsApp conversion rules
- **Preflight script** - `scripts/preflight.sh` installs bun + dependencies and self-tests the build
- **Tests** - `bun test` in the skill directory

## Preview UI

Three destination lanes (Gmail / Mail app / WhatsApp), each with a step-1 **Copy** button and a step-2 **Open ↗** button. Keyboard shortcuts:

| Key | Action |
|-----|--------|
| `G` | Copy for Gmail (rich HTML) |
| `T` | Copy Rich Text (inline-styled HTML for any desktop mail client) |
| `M` | Copy Markdown (WhatsApp text, tables as aligned monospace grids) |
| `E` | Open default mail app (`mailto:` with recipients + subject) |
| `W` | Open WhatsApp |
| `R` | Force reload |

Copy buttons use the Clipboard API's HTML MIME type - paste into Gmail, Outlook, or Thunderbird preserves full formatting in one clean operation. Open buttons POST to the preview server's `/open` endpoint, which launches the URL via the OS default handler - so the right app opens even when the preview is viewed inside an embedded webview. The endpoint accepts only the four destination URL forms (see `scripts/open-url.ts`).

## Workflow

1. Claude writes a `.fragment.md` (recommended: `data/writing/email_drafts/`; the hook fires on any `*.fragment.md`)
2. The PostToolUse hook (`auto-serve-fragment.ts`, runs under Bun) auto-builds and launches the preview server; the server opens the browser once, the instant its port is ready
3. Edits to the fragment hot-reload in under 100 ms via WebSocket (atomic-save editors reload via a 300 ms mtime poll)
4. Use the lane Copy/Open buttons to send via Gmail, your mail app, or WhatsApp
5. With no preview tab connected, servers idle-shut-down after 30 minutes; the next write/edit starts a fresh one

## Platform Support

macOS, Linux, WSL2 (Ubuntu), and native Windows. Browser opening: `open` on macOS, `cmd /c start` on Windows, `cmd.exe /c start` on WSL2 (opens the Windows host browser via shared localhost), `xdg-open` elsewhere.
