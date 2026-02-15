---
name: create-ultimate-skill
description: Create, review, and iterate on Claude Code skills using Anthropic's official best practices and latest API documentation. Use when creating skills, reviewing existing skills, writing skill descriptions, designing skill architecture, or when user says "create a skill", "review my skill", "skill best practices", "skill description help". Do NOT use for creating plugins, commands, agents, or hooks - use plugin-dev skills for those.
user-invocable: true
argument-hint: <skill-purpose> [--review path/to/skill]
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Task, AskUserQuestion, WebFetch
---

# Create Ultimate Skill

## Creation Workflow

When creating a new skill based on user's request: $ARGUMENTS

### Phase 1: Define Use Cases

Ask the user:

1. **Use cases**: "Describe 2-3 specific scenarios where you'd want this skill to activate. What would you say to Claude, and what should it do?"
2. **Non-use cases**: "What should this skill NOT be used for?" (defines negative triggers)

### Phase 2: Choose Archetype and Scope

Ask the user:

1. **Archetype** (see Archetypes section below)
2. **Triggers**: What phrases should activate this skill?
3. **Scope**: What's in scope vs out of scope?

### Phase 3: Fetch Latest Documentation

Fetch the latest official skill documentation to verify current fields and constraints:

```
WebFetch: https://markdown.new/https://code.claude.com/docs/en/skills.md
```

### Phase 4: Choose Save Location

Use AskUserQuestion:

- **Personal (home folder)**: `~/.claude/skills/<skill-name>/` - available in all projects
- **Project folder**: `.claude/skills/<skill-name>/` - project-specific
- **Existing plugin**: ask which plugin, then `plugins/<plugin-name>/skills/`

### Phase 5: Create the Skill

Scaffold with init_skill.py or create manually:

```bash
python .claude/skills/create-ultimate-skill/scripts/init_skill.py <skill-name> --path <location>
```

Then write SKILL.md applying all rules below. Review with the checklist before presenting to user.

### Phase 6: Summary

When complete, provide:
- Skill location and how to trigger it
- What it does
- Suggestions for improvement
- Testing prompts the user can try

---

## Frontmatter Hard Rules

- `description` MUST be a single-line plain string. NEVER use YAML multi-line indicators (`>-`, `|`, `>`, `|-`). Multi-line descriptions break frontmatter parsing.
- `allowed-tools` MUST be a single-line comma-separated string (e.g. `allowed-tools: Read, Write, Edit`). NEVER use YAML list syntax.

## Required Fields

| Field | Constraints |
|-------|-------------|
| `name` | Max 64 chars, `[a-z0-9-]` only, no "anthropic"/"claude" |
| `description` | Max 1024 chars, non-empty, no XML tags |

## Optional Fields

| Field | Purpose | Example |
|-------|---------|---------|
| `allowed-tools` | Limit tool access | `Read, Grep, Glob` |
| `model` | Override model | `sonnet`, `opus` |
| `context` | Isolation | `fork` |
| `agent` | Subagent type | `Explore`, `Plan` |
| `hooks` | Lifecycle events | `PreToolUse`, `PostToolUse`, `Stop` |
| `user-invocable` | Slash menu visibility | `false` to hide |
| `disable-model-invocation` | Block Skill tool | `true` |

See [references/api-reference.md](references/api-reference.md) for full field documentation.

## Archetypes

| Archetype | Best For | Structure |
|-----------|----------|-----------|
| **CLI Reference** | Tool documentation | Commands grouped by function, minimal prose |
| **Methodology** | Workflows, processes | Philosophy + THE EXACT PROMPT + examples |
| **Safety Tool** | Validation, security | Threat model + risk tiers + rules |
| **Orchestration** | Multi-agent coordination | Quick start + APIs + integrations |

See [references/archetypes.md](references/archetypes.md) for templates.

## Description Rules

- Third person always ("Processes files" not "I help you")
- Include WHAT it does AND WHEN to trigger
- Specific trigger phrases users would say
- Add negative triggers ("Do NOT use for...") to prevent over-triggering
- Max 1024 characters

**Template:**
```yaml
description: [What it does]. Use when [triggers]. Do NOT use for [exclusions].
```

**Examples:**
```yaml
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when user mentions PDFs, forms, or document extraction.

description: Process and transform CSV data files. Use when working with CSV imports, exports, or data cleaning. Do NOT use for Excel files (.xlsx) or database queries.
```

## SKILL.md Body Rules

- Imperative voice ("Extract the data", "Run validation")
- Never second person ("You should...")
- Concise - challenge each line: "Does Claude need this?"
- Under 500 lines, under 5,000 words (~2,000 ideal)
- Put critical instructions at the top of the file
- Use scripts for validation where possible - code is deterministic, language interpretation is not
- "Take your time to do this thoroughly" is more effective in user prompts than in SKILL.md

## Structure Rules

```
skill-name/
├── SKILL.md              # Core guidance only
├── references/           # Detailed docs (on-demand)
├── examples/             # Working code samples
└── scripts/              # Executable utilities
```

- References ONE level deep only - no chains
- Long files (>100 lines): include TOC
- Never include README.md in skill folder (SKILL.md IS the readme)
- Forward slashes only (no Windows paths)

## Anti-Patterns

| Anti-Pattern | Fix |
|-------------|-----|
| Vague descriptions | Specific triggers + negative triggers |
| Deeply nested references | One level deep |
| README.md in skill folder | Delete it - SKILL.md IS the readme |
| `>-` or `|` in description | Single-line plain string |
| YAML list for allowed-tools | Comma-separated string |

## Testing

Define success criteria before building:

- **Quantitative**: Trigger rate >90% of relevant queries, correct tool sequence, task completes without user intervention
- **Qualitative**: Output matches expected format, no hallucinated commands, consistent across sessions

**Debug technique:** Ask Claude "When would you use the [skill name] skill?" - the response reveals how Claude interprets the description.

Test three areas:
1. **Triggering**: Direct trigger phrases, paraphrased requests, and edge cases that should NOT trigger
2. **Functional**: Run each use case end-to-end, check output format and accuracy
3. **Performance**: Compare skill-assisted vs manual - does the skill save time and improve quality?

**Pro tip:** Iterate on a single challenging task until Claude succeeds, then extract the winning approach into the skill. This grounds design in proven patterns rather than theory.

## Iteration Signals

| Signal | Fix |
|--------|-----|
| Skill never activates | Add more trigger phrases to description |
| Wrong skill activates | Add "Do NOT use for..." negative triggers |
| Output is wrong | Refine SKILL.md instructions, add examples |
| Output is inconsistent | Reduce degrees of freedom, be more prescriptive |

## Utility Scripts

### init_skill.py

```bash
python .claude/skills/create-ultimate-skill/scripts/init_skill.py <skill-name> --path <location>
```

Creates SKILL.md with template, plus scripts/, references/, assets/ directories.

### package_skill.py

```bash
python .claude/skills/create-ultimate-skill/scripts/package_skill.py <path/to/skill> [output-dir]
```

Validates and creates distributable zip. Checks frontmatter, naming, ensures no TODOs remain.

## Skill Review Mode

When reviewing an existing skill (triggered by `--review` or "review my skill"):

1. Read SKILL.md frontmatter, body, and supporting directories
2. Categorise issues by severity:
   - **Critical**: Won't trigger or wrong output (missing description, vague triggers, broken refs)
   - **Major**: Significantly reduces effectiveness (>5,000 words, no progressive disclosure)
   - **Minor**: Polish (inconsistent terminology, missing TOC, no negative triggers)
3. Generate structured review report:

```markdown
## Skill Review: [skill-name]

### Summary
[Assessment, word counts, structure]

### Description Analysis
**Current:** [description]
**Issues:** [with severity]
**Suggested:** "[improved version]"

### Issues by Severity
#### Critical ([count])
- [File]: [Issue] - [Fix]
#### Major ([count])
- [File]: [Issue] - [Fix]
#### Minor ([count])
- [File]: [Issue] - [Suggestion]

### Rating: [Pass / Needs Improvement / Needs Major Revision]

### Priority Fixes
1. [Highest impact]
2. [Second]
3. [Third]
```

## Review Checklist

- [ ] Use cases: 2-3 concrete scenarios defined
- [ ] name: lowercase, hyphens, ≤64 chars
- [ ] description: single-line plain string, third person, specific triggers, ≤1024 chars
- [ ] description: negative triggers if needed
- [ ] SKILL.md body: <500 lines, <5,000 words
- [ ] No README.md in skill folder
- [ ] References: one level deep
- [ ] Forward slashes only
- [ ] Examples concrete, not abstract

## Latest Documentation

Before finalising any skill's frontmatter, fetch the latest official documentation to check for new fields, changed constraints, or updated rules:

```
WebFetch: https://markdown.new/https://code.claude.com/docs/en/skills.md
```

## Further Reading

- [Skill Archetypes](references/archetypes.md)
- [Official API Reference](references/api-reference.md)
