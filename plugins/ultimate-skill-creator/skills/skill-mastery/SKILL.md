---
name: skill-mastery
description: >-
  Provides master-level guidance for creating exceptional Claude Code skills using
  combined best practices from official plugin-dev toolkit, community patterns, and
  latest API. Use when creating skills, designing skill architecture, writing skill
  descriptions, planning progressive disclosure, choosing skill archetypes, optimising
  token efficiency, or when user says "create a skill", "skill best practices",
  "skill description help", "token-efficient skill".
user-invocable: false
---

# Skill Mastery: The Ultimate Guide

Combines three authoritative sources into a unified approach:

1. **Official plugin-dev toolkit** - Validation, patterns, AI-assisted creation
2. **Community best practices** - Token hierarchy, archetypes, advanced patterns
3. **Official documentation** - Current API fields, latest features

## Mental Model: How Skills Actually Work

Skills use **pure LLM reasoning** for selection - no embeddings or keyword matching. Claude evaluates all skill descriptions via natural language understanding, making description quality critical.

### Token Loading Hierarchy

```
Level 1: Metadata (~100 tokens)        Always loaded at startup
         name + description in system prompt
                    ↓
Level 2: SKILL.md (~1,500-5,000 tokens) Loaded when skill triggers
         Full instructions after selection
                    ↓
Level 3: Resources (unlimited)          Loaded on-demand only
         scripts/, references/, assets/
         Zero cost until accessed
```

**Key insight**: Only Level 1 costs tokens in every conversation. Design accordingly.

## Quick Start: Creating a Skill

### 1. Choose Your Archetype

| Archetype | Best For | Structure |
|-----------|----------|-----------|
| **CLI Reference** | Tool documentation (git, gcloud) | Pure reference, minimal prose |
| **Methodology** | Workflows, processes | Philosophy + THE EXACT PROMPT + examples |
| **Safety Tool** | Validation, security | Threat model + risk tiers + what blocks/allows |
| **Orchestration** | Multi-agent coordination | Quick start + robot mode APIs + integrations |

See [references/archetypes.md](references/archetypes.md) for detailed templates.

### 2. Write the Description (Most Critical)

**Rules:**
- Third person always ("Processes files" not "I help you")
- Include WHAT it does AND WHEN to trigger
- Specific trigger phrases users would say
- Max 1024 characters

**Template:**
```yaml
description: >-
  [What it does - actions, capabilities].
  Use when [trigger phrases, contexts, file types, user intents].
```

**Good examples:**
```yaml
# Specific + triggers
description: >-
  Extract text and tables from PDF files, fill forms, merge documents.
  Use when working with PDF files or when user mentions PDFs, forms,
  or document extraction.

# Action + context
description: >-
  Generate descriptive commit messages by analysing git diffs.
  Use when user asks for help writing commit messages or reviewing
  staged changes.
```

### 3. Structure with Progressive Disclosure

```
skill-name/
├── SKILL.md              # Core guidance (<500 lines, ~2,000 words)
├── references/           # Detailed docs (loaded on-demand)
│   ├── api.md
│   └── patterns.md
├── examples/             # Working code samples
│   └── complete-example.md
└── scripts/              # Executable utilities (run, not loaded)
    └── validate.py
```

**Critical rules:**
- Keep references ONE level deep from SKILL.md
- No chains: SKILL.md -> advanced.md -> details.md (Claude may partial-read)
- Long files (>100 lines): include TOC at top

### 4. Write the Body

**Style:**
- Imperative/infinitive form (verb-first): "Extract the data", "Run validation"
- NOT second person: avoid "You should extract..."
- Concise - assume Claude is intelligent
- Challenge each line: "Does Claude need this?"

**Bad (~150 tokens):**
```markdown
PDF (Portable Document Format) files are a common file format that
contains text, images, and other content. To extract text from a PDF,
you'll need to use a library. There are many libraries available...
```

**Good (~50 tokens):**
```markdown
## Extract PDF text
Use pdfplumber:
python
import pdfplumber
with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

## Required Frontmatter Fields

| Field | Required | Constraints |
|-------|----------|-------------|
| `name` | Yes | Max 64 chars, `[a-z0-9-]` only, no "anthropic"/"claude" |
| `description` | Yes | Max 1024 chars, non-empty, no XML tags |

## Optional Frontmatter Fields

| Field | Purpose | Example |
|-------|---------|---------|
| `allowed-tools` | Limit tool access | `Read, Grep, Glob` |
| `model` | Specific model | `claude-sonnet-4-20250514` |
| `context` | Isolation | `fork` for separate context |
| `agent` | Subagent type | `Explore`, `Plan`, custom |
| `hooks` | Lifecycle events | `PreToolUse`, `PostToolUse`, `Stop` |
| `user-invocable` | Slash menu visibility | `false` to hide |
| `disable-model-invocation` | Block Skill tool | `true` to prevent programmatic use |

See [references/api-reference.md](references/api-reference.md) for complete field documentation.

## Degrees of Freedom

Match specificity to task fragility:

| Freedom | When | Example |
|---------|------|---------|
| **High** | Multiple valid approaches | Code review guidelines |
| **Medium** | Preferred pattern exists | Report templates |
| **Low** | Fragile/error-prone | DB migration scripts - exact command |

**Analogy:** Narrow bridge with cliffs = low freedom (exact guardrails). Open field = high freedom (general direction).

## Advanced Patterns

### THE EXACT PROMPT Pattern

For reproducible prompts in agent-to-agent handoff:

```markdown
## THE EXACT PROMPT - Plan Review

Carefully review this entire plan and provide revisions for
better architecture, new features, edge cases...
```

Copy-paste ready, automation friendly, no ambiguity.

### Validation Loop Pattern

```markdown
## Validation workflow

1. Make edits
2. **Validate immediately**: python scripts/validate.py output/
3. If validation fails:
   - Review error message
   - Fix issues
   - Run validation again
4. **Only proceed when validation passes**
```

### Risk Tiering Pattern

For safety-critical skills:

| Tier | Approvals | Auto-approve | Examples |
|------|-----------|--------------|----------|
| **CRITICAL** | 2+ | Never | `rm -rf /`, `DROP DATABASE` |
| **DANGEROUS** | 1 | Never | `git reset --hard` |
| **CAUTION** | 0 | After 30s | `rm file.txt` |

See [references/advanced-patterns.md](references/advanced-patterns.md) for more patterns.

## Anti-Patterns to Avoid

| Anti-Pattern | Why Bad | Fix |
|-------------|---------|-----|
| Windows paths (`scripts\helper.py`) | Breaks on Unix | Forward slashes |
| Deeply nested references | Partial reads | One level deep |
| Too many options | Confusing | Default + escape hatch |
| Vague descriptions | Never triggers | Specific + triggers |
| Magic numbers | Unverifiable | Document why |

## Workflow: Creating Your Skill

1. **Identify the archetype** - CLI, methodology, safety, or orchestration?
2. **Write description first** - This determines if skill ever triggers
3. **Initialise with script** - Use `init_skill.py` to scaffold structure
4. **Draft SKILL.md** - Core guidance only (<500 lines)
5. **Extract to references** - Detailed docs, API specs, schemas
6. **Add examples** - Working code that demonstrates usage
7. **Create scripts** - Utilities that execute (not load into context)
8. **Test with fresh instance** - Does it trigger? Apply rules correctly?
9. **Validate** - Use skill-reviewer or plugin-validator agents
10. **Package for distribution** - Use `package_skill.py` to create zip

## Utility Scripts

This skill includes two utility scripts in `scripts/`:

### init_skill.py - Scaffold New Skills

```bash
python scripts/init_skill.py <skill-name> --path <location>

# Examples:
python scripts/init_skill.py my-api-helper --path ~/.claude/skills
python scripts/init_skill.py database-tool --path .claude/skills
```

Creates a complete skill directory structure:
- `SKILL.md` with template and TODO placeholders
- `scripts/` directory with example script
- `references/` directory with example reference
- `assets/` directory for output files

### package_skill.py - Create Distributable Zip

```bash
python scripts/package_skill.py <path/to/skill> [output-dir]

# Examples:
python scripts/package_skill.py ~/.claude/skills/my-skill
python scripts/package_skill.py ./my-skill ./dist
```

Validates the skill and creates a distributable zip file:
- Checks frontmatter format and required fields
- Validates naming conventions
- Ensures no TODO placeholders remain
- Excludes `__pycache__` and `.pyc` files

## Integration with Plugin-Dev

This skill works alongside the official plugin-dev toolkit (requires `plugin-dev@claude-plugins-official`):

- **Use `/plugin-dev:create-plugin`** for full plugin creation workflow
- **Use `plugin-dev:skill-reviewer` agent** for quality validation
- **Use `plugin-dev:plugin-validator` agent** for comprehensive checks

## Quick Reference Card

```
SKILL CHECKLIST
===============
[ ] name: lowercase, hyphens, ≤64 chars
[ ] description: third person, specific triggers, ≤1024 chars
[ ] SKILL.md body: <500 lines
[ ] References: one level deep
[ ] Long refs: include TOC
[ ] Scripts: tested, explicit error handling
[ ] Forward slashes only
[ ] Consistent terminology
[ ] Examples concrete, not abstract
[ ] Tested with real scenarios

DESCRIPTION TEMPLATE
====================
description: >-
  [What it does - actions, capabilities].
  Use when [trigger phrases, contexts, file types].
```

## Further Reading

- [Token Hierarchy Deep Dive](references/token-hierarchy.md)
- [Skill Archetypes](references/archetypes.md)
- [Advanced Patterns](references/advanced-patterns.md)
- [Official API Reference](references/api-reference.md)
