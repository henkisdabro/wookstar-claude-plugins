# React Best Practices

Vercel Engineering's React and Next.js performance rules, ranked by impact from async waterfalls and
bundle size down to JavaScript micro-optimisations, plus local overrides for React Compiler and
Next.js 16 caching.

## Skills

- **react-best-practices** - one rule per file in `rules/`, indexed in `SKILL.md` by category and
  impact. It auto-invokes only when working on `*.tsx`, `*.jsx` or `next.config.*` files; call
  `/react-best-practices` to use it anywhere else.

## Layout

```
skills/react-best-practices/
  SKILL.md         steps and rule index (local)
  local-notes.md   React Compiler and Next.js 16 overrides (local)
  LICENSE.txt      MIT, Vercel copyright
  rules/           upstream rule files, unchanged
```

Everything under `rules/` is Vercel's and keeps upstream's US spelling. All local changes live in
`SKILL.md` and `local-notes.md`, so a resync never touches them.

## Upstream

- Source: https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices
- Licence: MIT
- Synced commit: `063bee94c3f4df8453406c830b0a7df0f2860278`
- Synced on: 20261004

Upstream also ships a compiled `AGENTS.md` (every rule in one file) and build tooling. Neither is
copied: the compiled file repeats `rules/`.

### Resync

```bash
git clone --depth 1 https://github.com/vercel-labs/agent-skills.git /tmp/agent-skills
git -C /tmp/agent-skills rev-parse HEAD
rsync -a --delete /tmp/agent-skills/skills/react-best-practices/rules/ \
  plugins/react-best-practices/skills/react-best-practices/rules/
git diff --stat -- plugins/react-best-practices
```

Then:

1. Rebuild the rule index in `SKILL.md` from upstream's `SKILL.md` Quick Reference, so every file in
   `rules/` has exactly one index line.
2. Re-check each rule named in `local-notes.md` still exists, and drop any note upstream now covers.
3. Update the synced commit and date above, and bump the version in `.claude-plugin/plugin.json` and
   the marketplace entry.
