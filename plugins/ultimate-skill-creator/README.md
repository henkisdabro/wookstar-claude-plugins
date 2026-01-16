# Ultimate Skill Creator

Advanced skill development toolkit combining three authoritative sources for creating exceptional Claude Code skills.

## Requirements

**This plugin requires the official [plugin-dev](https://github.com/anthropics/claude-plugins-official) plugin for validation agents.**

```bash
# Install the required plugin-dev dependency first
/plugin install plugin-dev@claude-plugins-official

# Then install this plugin
/plugin install ultimate-skill-creator@wookstar
```

## What's Included

### Agent (1)

- **skill-architect** - Designs optimal skill structure, recommends archetypes, and plans progressive disclosure

### Commands (2)

- **/create-skill-ultimate** - Guided skill creation workflow with all best practices applied
- **/setup-skill-hook** - Automatically set up the skill-activation-prompt hook in your project

### Skill (1)

- **skill-mastery** - Comprehensive skill development guide (model-managed, not directly invocable)

### Hook (1)

- **skill-activation-prompt** - Automatically suggests relevant skills based on user prompts

## Sources Combined

| Source | What It Provides |
|--------|-----------------|
| **Official plugin-dev** | Validation agents, proven patterns, AI-assisted creation |
| **Community best practices** | Token hierarchy, archetypes, advanced patterns |
| **Official documentation** | Current API fields, latest features |

## Usage

### Create a New Skill

```bash
/create-skill-ultimate PDF processing tool
/create-skill-ultimate --archetype=methodology code review workflow
```

### Get Architecture Advice

```bash
# Triggers skill-architect agent automatically
"Help me design a skill for API documentation"
"What archetype should I use for a database migration skill?"
```

## Key Features

### Token Hierarchy Understanding

```
Level 1: Metadata (~100 tokens)     - Always loaded
Level 2: SKILL.md (~1,500-5,000)    - On trigger
Level 3: References (unlimited)      - On-demand only
```

### Four Skill Archetypes

| Archetype | Best For |
|-----------|----------|
| CLI Reference | Tool documentation |
| Methodology | Workflows, processes |
| Safety Tool | Validation, guardrails |
| Orchestration | Multi-agent coordination |

### Advanced Patterns

- THE EXACT PROMPT - reproducible prompts
- Risk Tiering - safety classifications
- Robot Mode - machine-readable output
- Why This Exists - context for triggering

### Utility Scripts

- `init_skill.py` - Scaffold a new skill directory structure
- `package_skill.py` - Validate and package skill for distribution

## File Structure

```
ultimate-skill-creator/
├── .claude-plugin/plugin.json
├── README.md
├── agents/
│   └── skill-architect.md
├── commands/
│   ├── create-skill-ultimate.md
│   └── setup-skill-hook.md
├── hooks/
│   └── skill-activation-prompt/
│       ├── README.md
│       ├── skill-activation-prompt.sh
│       ├── skill-activation-prompt.ts
│       ├── package.json
│       └── tsconfig.json
└── skills/
    └── skill-mastery/
        ├── SKILL.md
        ├── references/
        │   ├── token-hierarchy.md
        │   ├── archetypes.md
        │   ├── advanced-patterns.md
        │   └── api-reference.md
        └── scripts/
            ├── init_skill.py
            └── package_skill.py
```

## Hook Setup (Optional)

The skill-activation-prompt hook automatically suggests relevant skills based on your prompts. This is optional but recommended for teams with many custom skills.

### Automatic Setup (Recommended)

Run the setup command in your target project:

```bash
/setup-skill-hook
```

This will:
- Copy all hook files to `.claude/hooks/`
- Install npm dependencies
- Create a starter `skill-rules.json`
- Configure `.claude/settings.json`

### Manual Setup

If you prefer manual configuration:

1. **Copy hook files to your project:**

   ```bash
   mkdir -p .claude/hooks
   cp -r /path/to/ultimate-skill-creator/hooks/skill-activation-prompt/* .claude/hooks/
   chmod +x .claude/hooks/skill-activation-prompt.sh
   ```

2. **Install dependencies:**

   ```bash
   cd .claude/hooks && npm install
   ```

3. **Create skill rules configuration:**

   ```bash
   mkdir -p .claude/skills
   ```

   Create `.claude/skills/skill-rules.json`:

   ```json
   {
     "version": "1.0.0",
     "skills": {
       "xlsx": {
         "type": "domain",
         "enforcement": "suggest",
         "priority": "high",
         "promptTriggers": {
           "keywords": ["spreadsheet", "excel", "csv"],
           "intentPatterns": ["create.*spreadsheet"]
         }
       }
     }
   }
   ```

4. **Add hook to `.claude/settings.json`:**

   ```json
   {
     "hooks": {
       "UserPromptSubmit": [
         {
           "type": "command",
           "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/skill-activation-prompt.sh"
         }
       ]
     }
   }
   ```

See `hooks/skill-activation-prompt/README.md` for full configuration reference.

## Skill Creation Workflow

1. **Choose archetype** - CLI, Methodology, Safety, or Orchestration
2. **Write description first** - This determines if skill ever triggers
3. **Scaffold with script** - Use init_skill.py to create structure
4. **Draft SKILL.md** - Core guidance only (<500 lines)
5. **Extract to references** - Detailed docs, API specs, schemas
6. **Add examples** - Working code that demonstrates usage
7. **Create scripts** - Utilities that execute (not load into context)
8. **Test with fresh instance** - Does it trigger? Apply rules correctly?
9. **Validate** - Use plugin-dev's skill-reviewer agent
10. **Package** - Use package_skill.py for distribution

## Quick Reference

```
SKILL CHECKLIST
===============
[ ] name: lowercase, hyphens, ≤64 chars
[ ] description: third person, specific triggers, ≤1024 chars
[ ] SKILL.md body: <500 lines
[ ] References: one level deep
[ ] Consistent terminology
[ ] Tested with real scenarios

DESCRIPTION TEMPLATE
====================
description: >-
  [What it does - actions, capabilities].
  Use when [trigger phrases, contexts, file types].
```

## Author

Henrik Soederlund
