---
description: Create exceptional skills using combined best practices from official toolkit, community patterns, and latest API documentation
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Task, Skill, AskUserQuestion, TodoWrite
argument-hint: <skill-purpose> [--archetype=cli|methodology|safety|orchestration]
---

# Ultimate Skill Creation Workflow

Create bleeding-edge Claude Code skills by combining three authoritative sources:
1. Official plugin-dev toolkit (validation, AI-assisted creation)
2. Community best practices (token hierarchy, archetypes, advanced patterns)
3. Latest official documentation (current API fields)

## Phase 1: Load Combined Knowledge

First, load the skill-mastery skill to have all best practices available:

Load the `skill-mastery` skill from this plugin using the Skill tool.

## Phase 2: Understand Requirements

Based on the user's request: $ARGUMENTS

Ask clarifying questions to understand:
1. **Purpose**: What problem does this skill solve?
2. **Archetype**: Which pattern fits best?
   - CLI Reference (tool documentation)
   - Methodology (workflows, processes)
   - Safety Tool (validation, guardrails)
   - Orchestration (multi-agent coordination)
3. **Triggers**: What phrases should activate this skill?
4. **Scope**: What's in scope vs out of scope?

## Phase 3: Fetch Latest Documentation

Use the claude-code-guide agent via Task tool to verify latest API fields:

```
Fetch the current official documentation for Claude Code skills frontmatter fields.
Confirm the current constraints for: name, description, allowed-tools, model, context, agent, hooks, user-invocable, disable-model-invocation.
Report any new fields or changed constraints.
```

## Phase 4: Design Skill Architecture

Based on the archetype, design the structure:

### CLI Reference Structure
```
skill-name/
├── SKILL.md (commands grouped by function)
└── references/
    └── advanced-options.md
```

### Methodology Structure
```
skill-name/
├── SKILL.md (philosophy + THE EXACT PROMPT + examples)
└── references/
    ├── why-it-works.md
    └── before-after-examples.md
```

### Safety Tool Structure
```
skill-name/
├── SKILL.md (threat model + risk tiers + rules)
└── references/
    ├── risk-classification.md
    └── override-mechanisms.md
```

### Orchestration Structure
```
skill-name/
├── SKILL.md (quick start + core commands)
├── references/
│   ├── robot-mode-api.md
│   └── integrations.md
└── scripts/
    └── automation-helpers.sh
```

## Phase 5: Write the Description (Most Critical)

Apply these rules:
- Third person always ("Processes files" not "I help you")
- Include WHAT it does AND WHEN to trigger
- Specific trigger phrases users would say
- Max 1024 characters

Use this template:
```yaml
description: >-
  [What it does - actions, capabilities].
  Use when [trigger phrases, contexts, file types, user intents].
```

## Phase 6: Create the Skill

**CRITICAL: Use AskUserQuestion to ask where the skill should be saved.**

Use the AskUserQuestion tool with these options:

```
Question: "Where should this skill be saved?"
Header: "Location"
Options:
1. Label: "Personal (home folder)"
   Description: "Save to ~/.claude/skills/<skill-name>/ - Available in all projects for this user"
2. Label: "Project folder"
   Description: "Save to .claude/skills/<skill-name>/ in current working directory - Project-specific skill"
3. Label: "Existing plugin"
   Description: "Add to an existing plugin in this project - For plugin development"
```

After the user selects their preference, set the `--path` argument accordingly:
- **Personal**: `--path ~/.claude/skills`
- **Project**: `--path .claude/skills` (relative to current working directory)
- **Plugin**: Ask which plugin, then use `--path plugins/<plugin-name>/skills`

### Option A: Use init_skill.py (Recommended)

Run the initialisation script to scaffold the skill structure:

```bash
python ${CLAUDE_PLUGIN_ROOT}/skills/skill-mastery/scripts/init_skill.py <skill-name> --path <location>
```

Then customise the generated files:
1. Edit SKILL.md - replace TODO placeholders
2. Customise or delete example files in scripts/, references/, assets/

### Option B: Manual Creation

Create the skill structure using Write tool:

1. Create directory structure
2. Write SKILL.md with:
   - Proper frontmatter (verified against latest API)
   - Lean body (<500 lines, ~2,000 words)
   - Progressive disclosure (pointers to references)
3. Create reference files for detailed content
4. Create scripts if needed (execute, don't load)

## Phase 7: Validate Quality

Use the skill-reviewer agent from plugin-dev:

```
Use the Task tool to launch the skill-reviewer agent to review the skill at [path].
Check: description quality, progressive disclosure, writing style, token efficiency.
```

Apply the Quick Reference checklist:
- [ ] name: lowercase, hyphens, ≤64 chars
- [ ] description: third person, specific triggers, ≤1024 chars
- [ ] SKILL.md body: <500 lines
- [ ] References: one level deep
- [ ] Consistent terminology
- [ ] Examples concrete, not abstract

## Phase 8: Test and Iterate

Guide user through testing:

1. **Test triggering**: Ask questions using trigger phrases
2. **Test content**: Does guidance apply correctly?
3. **Test references**: Do they load when needed?
4. **Test with fresh context**: Start new conversation, try skill

If issues found, iterate on the skill and re-validate.

## Phase 9: Package for Distribution (Optional)

If the user wants to share the skill, use the packaging script:

```bash
python ${CLAUDE_PLUGIN_ROOT}/skills/skill-mastery/scripts/package_skill.py <path/to/skill> [output-dir]
```

This validates the skill and creates a distributable zip file.

## Summary

When complete, provide:
- Skill location
- How to trigger it
- What it does
- Token efficiency estimate (metadata + SKILL.md size)
- Package location (if packaged)
- Suggestions for improvement

---

## Notes

- Always use British English spelling (analyse, optimise, behaviour)
- Never use emdashes - use hyphens with spaces instead
- Validate against latest API before finalising frontmatter
- Prefer progressive disclosure over inline content
- Test with the actual trigger phrases in description
