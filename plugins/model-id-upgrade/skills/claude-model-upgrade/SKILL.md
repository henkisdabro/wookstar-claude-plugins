---
name: claude-model-upgrade
description: Find and upgrade stale Claude model IDs (Fable, Mythos, Opus, Sonnet, Haiku) across skills, agents, prompts, configs and code after a new Claude release - read-only scan first, approval gate, then edits. Use when a new Claude model is out, the user asks to upgrade or bump model IDs, update sonnet/opus/haiku/fable references, find old or deprecated model names, or migrate Bedrock or Vertex model strings. Do NOT use for choosing which model to use or API pricing questions - use the claude-api skill or the models docs; or for changing Claude Code's own session model - use /model.
argument-hint: "[directory ...]"
---

# Claude model upgrade

Nothing changes before the approval gate in step 4.

Scan roots: `$ARGUMENTS`, or the current repository when empty. Scanning a home directory or several repos is fine when the user names them.

## 1. Get the current models

Fetch `https://platform.claude.com/docs/en/about-claude/models/overview` (WebFetch) and take each family's current Claude API ID from the comparison table; legacy models are listed below it. Cross-check the format rules at `https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions`:

- 4.6 generation onwards: dateless `claude-{name}-{major}[-{minor}]` (`claude-sonnet-4-6`, `claude-opus-5`). A dateless ID is a pinned snapshot, not an alias.
- Before 4.6: dated `claude-{name}-{major}-{minor}-YYYYMMDD`; the short form (`claude-haiku-4-5`) is an alias to it. Both count as current when the dated model is still the family's latest.
- Bedrock: `anthropic.` prefix, optional `us.`/`eu.`/`global.` region prefix; dated models end `-v1:0`, newer ones drop the suffix.
- Vertex: dated models use `@YYYYMMDD` (`claude-haiku-4-5@20251001`); newer ones match the API form.

Also fetch `https://platform.claude.com/docs/en/about-claude/model-deprecations` and `https://platform.claude.com/docs/en/about-claude/pricing`. A stale model at or near its retirement date makes its runtime callers urgent - list them first in the report. Quote the current model's rates from the pricing page, because a runtime move changes cost.

A run aimed at one family ("especially Haiku") still scans every family, but classifies and edits only that one; report the others' TARGET counts and offer a follow-up.

Done when: you have stated one current ID per family, with its rates and any retirement date for the models it replaces. Ask the user only if the docs offer two candidates for a family.

## 2. Scan (read-only)

Run the scanner once per family from a scratch directory (it writes `scan-<family>.tsv` to `--out`, default the working directory):

```bash
uv run "${CLAUDE_SKILL_DIR}/scripts/scan.py" sonnet <current-sonnet-id> <root>... [--exclude GLOB] [--record REGEX]
```

It needs ripgrep (`rg`). It splits hits into TARGET and RECORD (rule below) and skips, automatically: the current ID in every platform form, its gateway form (`anthropic/claude-sonnet-5.5`), its prose name ("Sonnet 5.5", also regex-escaped), and truncated matches ending in `-` or `.` (an ID built from a template variable). Eyeball the odd remainder, for example a bare `claude-sonnet` CLI alias.

It also prints a **Made-up or malformed ID** table, and the TSV's fifth column says why: a date on a 4.6+ model, a snapshot date that never shipped, the wrong name order for 3.x versus 4+, a dotted API ID, or `-v1` on a 4.6+ Bedrock ID. Put every TARGET row from that table in the report. `KNOWN_DATED` in the scanner lists the real pre-4.6 snapshots; later models are dateless, so it should need no new entries. A version that never shipped at all (`claude-sonnet-4-7`) passes this check - compare it with the docs' model list.

Done when: every family has a TSV and a TARGET count.

## 3. Classify: RECORD versus TARGET

**RECORD - never rewrite.** Rewriting a record falsifies history or gets overwritten upstream: changelogs and release notes, logs, transcripts and session stores (`~/.claude/projects`, `~/.claude.json`), backups and archives, caches, telemetry snapshots, generated reports, and third-party trees that update themselves (plugin caches, vendored code, `site-packages`). The scanner classes these by path; anything else historical that it misses, reclassify by hand.

**TARGET - candidates for editing.** Instructions and code that choose a model going forward: skills, agents, commands, prompts, templates, examples and integration docs; runtime defaults, config files, `docker-compose.yml`, environment templates, and test fixtures that pass an ID through.

**Extend the exclusions.** Add a path regex per line to `~/.config/claude-model-upgrade/ignore` (or pass `--ignore-file`) to class a path as RECORD on every run; use `--exclude GLOB` to skip a tree entirely. Offer to add any new record class you find to that file.

**Leave, but list in the report:**

- Pricing rows and tier rationale - quote the new rates from the pricing page in the report, and update the rows only when the user says so. Write a price without a dollar sign before the digit, which the skill loader treats as an argument placeholder.
- Historical attributions ("Built with Sonnet 4.5"), and quoted old examples deliberately contrasted with the current one.
- Fixtures asserting an attribution string.
- Capability claims tied to a specific model - unverifiable for the new one.
- Config holding both old and new keys - offer to drop the old key.
- Evergreen aliases such as `"model": "sonnet"` - not stale.
- Telemetry and dashboard queries that filter on a model label - renaming breaks them.
- Words that only look like models (a composer's "Opus 7").

**Edit rules:**

- Change ID-shaped strings only; prose gets a hand edit or none.
- Bedrock and Vertex forms take the current dateless form with their prefix kept: `us.anthropic.claude-sonnet-4-5-20250929-v1:0` becomes `us.anthropic.claude-sonnet-5-5`.
- Made-up or malformed IDs get the current ID: a date on a 4.6+ model (`claude-sonnet-4-6-20250414`), a wrong snapshot date (`claude-sonnet-4-5-20250514`; the real one is `-20250929`), the wrong name order (`claude-haiku-3-5` for `claude-3-5-haiku`, `claude-4-sonnet`), a dotted API ID (`claude-sonnet-5.5` without `anthropic/`). In RECORD files, report them and leave them.
- Constant tables (`SONNET_3_5`, `SONNET_4`) get renamed and the obsolete duplicate removed, not just re-valued.
- An ID preceded by `-` or `.` (`${VAR:-claude-sonnet-5}`) slips past word-boundary regexes; the leftover re-scan in step 5 catches it.
- A shorter ID inside an ASCII box or an aligned comment column needs padding to keep the alignment.
- Use Python for multi-line edits; BSD `sed` on macOS needs `sed -i ''`.

Done when: every hit is classed RECORD, TARGET or leave-and-list.

## 4. Report and approval gate

Print, as tables in the reply:

| Family | Current ID | Stale variants found | Files to edit | Files skipped |
|---|---|---|---|---|

Then per repo: `repo | branch | files | already dirty?`, marking runtime-code files (behaviour and cost change), directories that are not git repos, and repos on a non-default branch. Then the skipped items with the reason.

Ask with `AskUserQuestion`:

- **Scope**: instructions only / instructions and runtime code / report only
- **Commits**: leave uncommitted / commit per repo, no push / commit and push

A new ID in runtime code is an API migration, not a rename - say so when the user picks runtime code. Step 5 covers what to check.

Wait for both answers. "Report only" ends here. The answer authorises edits in the listed repos and no others.

## 5. Implement

1. Apply the edits with one Python script over the approved file list, following the edit rules.
2. Runtime callers: read the new model's migration guide first (find it from `https://platform.claude.com/docs/en/about-claude/models/migration-guide`), because an ID-only swap can break the call. Sampling parameters, assistant prefills, thinking configuration, forced `tool_choice` and `max_tokens` sizing have each changed between releases, and code that reads `content[0].text` can find a thinking block there. Fix the call in the same commit, as the guide directs for that model, and update any doc that explains the old parameter. Where the claude-api skill is installed, its `migrate` flow does this.
3. Re-run the scanner on the edited roots. Done when only intentional skips remain as TARGET.
4. Show `git diff` for runtime-code files and say which tests were not run.

## 6. Commit (when approved)

Per repo, following the repo's own commit conventions (`AGENTS.md`, `CLAUDE.md`):

- Stage by explicit path from `git diff --name-only`, leaving files that were dirty before you started.
- Message: `chore(models): move Claude model IDs to <ids>` (`fix(<scope>): ...` when a runtime call changed), with a body saying what changed and why.
- Before pushing, `git fetch` and check whether the same change already landed upstream; drop duplicate edits.
- Report per repo: branch, commit, pushed or not, and any hook output that mattered. Directories without `.git` stay uncommitted - say so.
