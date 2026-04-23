---
name: message
description: Create and edit rich text message drafts for Gmail, Outlook, and WhatsApp with live browser preview. Runs on Bun for near-instant cold start and opens the preview automatically. Use when writing emails, drafting emails, composing replies, sending messages, writing WhatsApp messages, or when user mentions Gmail, Outlook, WhatsApp, "email to", "reply to", "draft an email", "write an email", "send a message". Do NOT use for reading emails, managing contacts, or calendar invitations.
argument-hint: "[optional: path to existing .fragment.md for editing]"
model: sonnet
allowed-tools: Bash, Write, Read, Edit
hooks:
  PostToolUse:
    - matcher: "Write"
      hooks:
        - type: command
          command: "bash ${CLAUDE_PLUGIN_ROOT}/hooks/auto-serve-fragment.sh"
          timeout: 30
---

# Message Drafts

Bun-based preview server. Fragments are written in Markdown - the build script converts to platform-specific HTML. The bundled PostToolUse hook auto-builds, starts the preview server, and opens the browser whenever a `.fragment.md` is written.

## Flow

1. Write the `.fragment.md` directly to `data/writing/email_drafts/` in ONE Write tool call.
   **Do NOT write the email body inline in your response before the Write call.** Compose the
   draft mentally and write it straight to the file - the preview server renders it.
2. After the Write tool returns, read the URL the hook wrote:
   ```bash
   cat "${CLAUDE_PROJECT_DIR}/.claude/.message-preview-url" 2>/dev/null
   ```
3. Reply with only the preview URL and a one-line summary:
   `Draft ready: email to Stuart re invoice follow-up → http://127.0.0.1:XXXX`

**The hook has already started the server and opened the browser by the time the Write tool returns.** Do NOT run `bun run serve.ts` yourself. Do NOT call `open <url>`. Do NOT launch a second server. The browser is already open.

**Always relay the preview URL to the user.** Read it from `.claude/.message-preview-url`. If that file is empty or missing, the fragment was still written - point the user at the most recent `.html` sibling file.

**On revision** ("make it shorter", "change the tone"): use Read to load the fragment, Edit to apply changes. The server hot-reloads in <100 ms via WebSocket. Do not echo the revised body - just confirm the change and include the same URL. Do NOT start a new server — the existing one is still running.

**Multiple concurrent drafts** are fully supported. Each fragment gets its own server on its own port. All servers stay alive until the machine reboots. To find the URL for any previously opened draft, run:

```bash
python3 -c "
import json, sys
d = json.load(open('${CLAUDE_PROJECT_DIR}/.claude/.message-previews.json'))
print(d.get(sys.argv[1], 'not found'))
" "/absolute/path/to/draft.fragment.md"
```

## Fallback — if hook is not firing

If the hook is not firing (e.g. skill used outside the plugin), run manually:

```bash
~/.bun/bin/bun run <skill-scripts-dir>/serve.ts /path/to/name.fragment.md
```

Run with `run_in_background: true`. The server prints the output HTML path then the URL. Relay the URL to the user. On subsequent edits, the server hot-reloads automatically - do not re-run it.

**First-time setup check:** before running `serve.ts`, verify `node_modules` exists in the scripts directory. If not, run `cd <skill-scripts-dir> && bun install` first (requires [Bun](https://bun.sh) to be installed).


## Fragment format

Markdown with YAML frontmatter, same as `/message` v1.

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

## File naming

```
data/writing/email_drafts/YYYY-MM-DD_recipient_subject.fragment.md
data/writing/email_drafts/YYYY-MM-DD_recipient_subject.html        # generated
```

## Preview UI

The browser preview shows three tabs (Gmail / Outlook / WhatsApp) with keyboard shortcuts:

- **G / O / W** - switch tab
- **C** - copy current tab (rich HTML for Gmail/Outlook, text for WhatsApp)
- **R** - manual reload

Features: dark-mode aware, live WebSocket hot reload (<100 ms), mobile-responsive, copy buttons use the Clipboard API's HTML MIME type so paste into Gmail/Outlook preserves formatting as a single clean operation. Word and character counts update per tab. Build errors render as a red overlay with the exact message instead of a silent failure.

## Edit flow

Edit the `.fragment.md` file. The server watches it via `fs.watch` and pushes a reload over WebSocket. No Bash command, no polling, no manual refresh. Latency from save to visible update: typically under 100 ms.

## Env flags

- `MESSAGE_NO_OPEN=1` - skip auto-opening the browser (useful in headless contexts)

## Structure and tone

1. Lead with the point (request, update, instruction the recipient must act on)
2. Supporting detail (context, logistics)
3. Warm close (gratitude, relational content) just before the sign-off

Match the recipient's formality. British English (colour, analyse, organise, behaviour, centre). Henrik's title is "Digital Consultant" - do not use "Strategy" or "Strategist" unless explicitly asked.

## Henrik's defaults

- From / reply-to: `admin@henriksoderlund.com`
- Google platform access requests (GA4, GTM, Search Console, Google Ads): `admin@henriksoderlund.com`

Sign-off:

```
Best,
Henrik
```

## After preview

Once the user has the preview URL, ask: "Would you like me to run the humanise skill on this draft to make it sound more natural?"

## Post-draft actions

After a client-facing draft, prompt: "Log this to the client comms log?" If yes, append to `data/consulting/clients/[slug]/comms/_comms-log.json` via Edit tool.

Consulting emails (proposal, invoice, contract, engagement) - run:

```bash
python3 .claude/lib/scripts/sync_consulting_ledgers.py --client <slug> --event <type>
```

Event mapping: proposal email -> `proposal-sent`, invoice -> `invoice-issued`, contract -> `contract-signed`.

## References

- `references/formatting-rules.md` - Gmail native HTML element reference (copied from v1)
- `references/outlook-formatting.md` - Outlook element styles and colour palette (copied from v1)

## Development

Code lives in `.claude/skills/message/scripts/`. First-time setup: `cd .claude/skills/message/scripts && bun install`. Run tests: `cd .claude/skills/message && ~/.bun/bin/bun test`. Build-only without serving: `~/.bun/bin/bun run scripts/serve.ts <fragment> --build-only`.
