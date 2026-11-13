---
name: message
description: Create and edit rich text message drafts for Gmail, Outlook and WhatsApp, or Slack, X and social posts, with a live browser preview that opens automatically. Use when drafting or writing an email, composing a reply ("reply to"), writing a WhatsApp or Slack message, writing a tweet or X thread, writing a LinkedIn or other social post, revising an existing .fragment.md draft, or when the user mentions Gmail, Outlook or WhatsApp in a writing context. Do NOT use for reading emails, managing contacts or calendar invitations - use the user's mail, contacts or calendar tooling.
argument-hint: "[--<destination> e.g. --x --linkedin --whatsapp --plain] [--tier premium] [path to existing .fragment.md]"
allowed-tools: Bash, Write, Read, Edit
hooks:
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "command -v bun >/dev/null 2>&1 || exit 0; bun run \"${CLAUDE_PLUGIN_ROOT}/hooks/auto-serve-fragment.ts\""
          timeout: 30
---

# Message Drafts

Fragments are Markdown; the build converts them to each destination's format. The plugin's PostToolUse hook (`hooks/auto-serve-fragment.ts`, on the `Write|Edit` matcher in this file's frontmatter) builds the fragment, starts a Bun preview server and opens the browser whenever a `.fragment.md` is written or edited.

## Flow

1. **Check dates.** If the draft names a date, a weekday or a relative time, resolve it per **Dates** first. Done when every such reference has been confirmed by a `python3` run.
2. **Write the fragment** to the drafts directory (see **File naming**) in ONE Write call, with its destination set (see **Choosing the destination**). The draft lives in the file, not in chat: compose it straight into the Write call. Done when Write returns - the hook has by then built the fragment, started the server and opened the browser.
3. **Read the URL** the hook wrote, and the remote note if there is one:
   ```bash
   cat "${CLAUDE_PROJECT_DIR}/.claude/.message-preview-url" "${CLAUDE_PROJECT_DIR}/.claude/.message-preview-note" 2>/dev/null
   ```
   Done when you hold a URL. If the URL file is empty or missing, the hook started no server - run the **Fallback**.
4. **Reply** with only the preview URL and a one-line summary:
   `Draft ready: email to Sam re invoice follow-up → http://127.0.0.1:XXXX`
   No output after the URL means a local session: add nothing. A `remote-preview:` note means the server is on a machine the user may not be sitting at - see **Remote sessions**.
5. **Offer follow-ups.** Ask: "Would you like me to run the humanise skill on this draft to make it sound more natural?" After a client-facing draft, also ask whether the user wants any follow-up their project defines for sent messages.

**One server per fragment, started by the hook.** Never run `serve.ts` or `open <url>` yourself while the hook is working - that launches a second server and a second tab.

**Revision** ("make it shorter", "change the tone"): Read the fragment, apply the change with Edit, then confirm the change in one line with the same URL. The running server hot-reloads the open tab, and the hook restarts it if it had shut down. Edit a fragment only with Write or Edit - the hook fires on those tools alone, so a Bash or Python edit leaves the preview stale.

**Several drafts at once**: each fragment gets its own server on its own port. A server with no connected tab shuts down after 30 minutes idle; writing or editing the fragment starts a fresh one. The URL of any earlier draft is in `${CLAUDE_PROJECT_DIR}/.claude/.message-previews.json`, a map of absolute fragment path to URL.

## Remote sessions

The server always binds loopback on the machine the agent runs on. Act only when step 3 printed a `remote-preview:` note:

- **`suspected`** (SSH variables, or Linux with no display): the guess can be wrong, and nothing was changed. Give the URL as usual and add one line: if it does not load, run the note's `ssh -N ... -L` command on your own computer, replacing `<ssh-host>` with the host you connect to, then open the same URL. Remote editors (VS Code, Cursor) forward the port themselves.
- **`on`** (`MESSAGE_REMOTE=1` or `--remote`): no browser was opened, so never say one was. Give the URL and the same command.
- Never guess `<ssh-host>`; only the user knows the alias they connect with.
- If the user cannot forward a port, paste the draft in chat.

## Fallback - if hook is not firing

Run the preflight first. It resolves or installs bun, installs dependencies, self-tests the build and prints the exact serve command, or fails with the fix:

```bash
bash "${CLAUDE_PLUGIN_ROOT}/skills/message/scripts/preflight.sh"
```

Then serve with `run_in_background: true`, using the bun path the preflight printed:

```bash
bun run "${CLAUDE_PLUGIN_ROOT}/skills/message/scripts/serve.ts" /path/to/name.fragment.md
```

The server prints the output HTML path, then the URL. Done when you have relayed that URL. Later edits hot-reload - one run serves the fragment for the whole session.

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

Every other id, label, group and alias: `bun run "${CLAUDE_PLUGIN_ROOT}/skills/message/scripts/serve.ts" --list-channels` (`--json` for JSON).

The fragment's `channel:` / `tier:` beat the choice remembered in the browser. A `?channel=<id>&tier=<t>` on the preview URL beats both and re-points a running server without a restart. Full precedence: `references/preview.md` ("Destination precedence").

Write a long X, Bluesky, Threads or Mastodon post as one body: past the destination's limit the preview splits it into a numbered thread, one card per post.

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

- **Required:** `to` and `subject` for email - no `channel`, or `channel: gmail` / `mail`. Every other channel needs neither.
- **Build errors** show in the preview with the exact message, and the fix hot-reloads. Two are by design: an unknown `channel` (the error lists the valid ids), and an em or en dash in the subject or body (house style: use " - ").
- **Line breaks:** a single newline inside a paragraph is a real line break in every lane, so write sign-offs as `Best,` newline `Alex`, and keep each paragraph on one source line - a hard-wrapped paragraph renders with the wraps. A blank line separates paragraphs.
- **Horizontal rules** render poorly in email clients - leave them out.

## Tables

- **Name every header.** A blank header row (`| | |`) renders as a styled header with no labels; where no natural header exists use `Item` / `Amount`, `Field` / `Value` or `Category` / `Notes`.
- **Numeric columns** align themselves: in the email lanes a column whose body cells are all numbers is right-aligned in a monospaced font, unless the column sets an explicit alignment.
- **Negative amounts take a leading minus** (`-1,200`, `-12%`, `-AUD 1,200`), not accounting brackets.
- **WhatsApp-bound tables stay at 2-3 lean columns**, so they render as an aligned grid rather than stacked rows.

## File naming

```
<drafts-dir>/YYYY-MM-DD_recipient_subject.fragment.md
<drafts-dir>/YYYY-MM-DD_recipient_subject.html        # generated
```

`<drafts-dir>` is the drafts directory the project's CLAUDE.md or AGENTS.md names; if it names none, use the default `drafts/` (relative to the project root). The hook fires on any `*.fragment.md` wherever it lives, so any directory works.

## Dates

Verify every date, weekday and relative time ("this Thursday", "next week", "the 15th", "COB Friday", "end of the month") with a `python3` datetime run, anchored to today's date from the environment context - mental arithmetic is not a check.

```bash
python3 -c "import datetime; d=datetime.date(2026,7,17); print(d.strftime('%A %d %B %Y'))"
```

Done when the weekday matches the calendar date, each relative reference resolves to the intended absolute date, and no date is unintentionally in the past. If the check contradicts the draft, fix the fragment and re-verify.

## Structure and tone

1. Lead with the point (request, update, instruction the recipient must act on)
2. Supporting detail (context, logistics)
3. Warm close (gratitude, relational content) just before the sign-off

## Your defaults

Customise these for the user's context:

- From / reply-to: `your-email@example.com`
- Sign-off: `Best,\n[Your Name]`

## References

- `references/preview.md` - open when the user asks how the preview behaves (destination picker, Copy and Open, keyboard shortcuts, counters, X threads), when a table renders unexpectedly, when the browser or an Open button fails on some platform, when running headless (`MESSAGE_NO_OPEN`), or for what remote mode changes (`MESSAGE_REMOTE`).

**Maintainer-only - do NOT load while drafting.** You write Markdown; the build
script's transforms produce all the inline-styled HTML. Loading these mid-draft
will mislead you into hand-writing raw HTML. Open one only to audit or change a
transform or a destination.

- `references/formatting-rules.md` - Gmail native HTML the build transform emits
- `references/outlook-formatting.md` - Outlook element styles and colour palette
- `references/whatsapp-formatting.md` - WhatsApp text conversion and fixed-width table mechanics
- `references/plaintext-formatting.md` - plain-text conversion rules (X and other social posts)
- `references/destinations.md` - every destination: what its composer accepts, limits, compose URLs, sources

## Development

Code lives in `${CLAUDE_PLUGIN_ROOT}/skills/message/scripts/`; first-time setup on any machine is the **Fallback** preflight. Run tests: `cd "${CLAUDE_PLUGIN_ROOT}/skills/message/scripts" && bun run test`. Build-only without serving: `bun run "${CLAUDE_PLUGIN_ROOT}/skills/message/scripts/serve.ts" <fragment> --build-only`.
