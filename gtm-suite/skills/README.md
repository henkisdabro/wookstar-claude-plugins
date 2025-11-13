# GTM Suite - Skills

Add your GTM skills here. Each skill should be in its own directory with a SKILL.md file.

## Suggested Skills

```
skills/
├── event-tracking/
│   ├── SKILL.md
│   ├── scripts/
│   └── references/
├── container-management/
│   ├── SKILL.md
│   └── references/
├── variable-configuration/
│   ├── SKILL.md
│   └── references/
├── trigger-setup/
│   ├── SKILL.md
│   └── references/
├── tag-templates/
│   ├── SKILL.md
│   ├── assets/
│   └── references/
└── debugging-tools/
    ├── SKILL.md
    ├── scripts/
    └── references/
```

## Skill Format

Each skill directory should contain:
- **SKILL.md** (required) - Main skill file with frontmatter
- **scripts/** (optional) - Executable scripts
- **references/** (optional) - Documentation to load as needed
- **assets/** (optional) - Templates and files for output

### SKILL.md Structure

```markdown
---
name: skill-name
description: When this skill should be used
---

# Skill Name

## Overview
What this skill does

## Workflow
How to use this skill

## Resources
Reference the bundled resources (scripts, references, assets)
```
