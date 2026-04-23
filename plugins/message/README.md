# Message Plugin

Rich text message drafts for Gmail, Outlook, and WhatsApp with live browser preview.

## Prerequisites

- [Bun](https://bun.sh) runtime
- Run once after install to fetch dependencies:

```bash
cd <skill-dir>/scripts && bun install
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
                             Outlook transform              with three platform views)
                             Inject into shell.html
```

- **Fragment** (`.fragment.md`): Markdown with YAML frontmatter (`to`, `subject`, optional `cc`/`bcc`)
- **Shell** (`templates/shell.html`): Static template with all CSS, JS, and dark-mode chrome
- **Build pipeline** (`scripts/`): TypeScript modules compiled and run by Bun

## What's Included

- **1 skill** - Message drafting with Gmail-native HTML, Outlook inline styles, and WhatsApp text conversion
- **1 shell template** - Dark-mode aware preview with WebSocket hot-reload and keyboard shortcuts
- **6 TypeScript modules** - `build.ts`, `parse.ts`, `serve.ts`, `transform-gmail.ts`, `transform-outlook.ts`, `types.ts`
- **2 formatting references** - Outlook formatting snippets and Gmail rendering behaviour
- **Tests** - `bun test` in the skill directory

## Preview UI

Three-tab preview (Gmail / Outlook / WhatsApp) with keyboard shortcuts:

| Key | Action |
|-----|--------|
| `G` | Switch to Gmail tab |
| `O` | Switch to Outlook tab |
| `W` | Switch to WhatsApp tab |
| `C` | Copy current tab to clipboard |
| `R` | Force reload |

Copy buttons use the Clipboard API's HTML MIME type - paste into Gmail or Outlook preserves full formatting.

## Workflow

1. Claude writes a `.fragment.md` to `data/writing/email_drafts/`
2. The PostToolUse hook (`auto_serve_fragment.sh`) auto-builds and launches the preview server
3. Browser opens automatically with the preview URL
4. Edits to the fragment hot-reload in under 100 ms via WebSocket
5. Use platform tabs and copy buttons to send via Gmail, Outlook, or WhatsApp
