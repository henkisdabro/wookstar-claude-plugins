# Ultimate Skill Creator

Advanced skill development toolkit for creating exceptional Claude Code skills, aligned with Anthropic's official best practices.

## Requirements

```bash
/plugin install ultimate-skill-creator@wookstar-claude-plugins
```

## What's Included

### Skill (1)

- **create-ultimate-skill** - Create, review, and iterate on Claude Code skills (`/create-ultimate-skill`)

### Command (1)

- **/setup-skill-hook** - Automatically set up the skill-activation-prompt hook in your project

### Hook (1)

- **skill-activation-prompt** - Automatically suggests relevant skills based on user prompts

### Utility Scripts

- `init_skill.py` - Scaffold a new skill directory structure
- `package_skill.py` - Validate and package skill for distribution

## Usage

### Create a New Skill

```bash
/create-ultimate-skill PDF processing tool
/create-ultimate-skill --archetype=methodology code review workflow
```

### Review an Existing Skill

```bash
/create-ultimate-skill --review .claude/skills/my-skill
```

Or simply say "review my skill" and it will activate automatically.

## Four Skill Archetypes

| Archetype | Best For |
|-----------|----------|
| CLI Reference | Tool documentation |
| Methodology | Workflows, processes |
| Safety Tool | Validation, guardrails |
| Orchestration | Multi-agent coordination |

## File Structure

```
ultimate-skill-creator/
├── .claude-plugin/plugin.json
├── README.md
├── commands/
│   └── setup-skill-hook.md
├── hooks/
│   └── skill-activation-prompt/
│       ├── README.md
│       ├── skill-activation-prompt.sh
│       ├── skill-activation-prompt.ts
│       ├── package.json
│       └── tsconfig.json
└── skills/
    └── create-ultimate-skill/
        ├── SKILL.md
        ├── references/
        │   ├── archetypes.md
        │   └── api-reference.md
        └── scripts/
            ├── init_skill.py
            └── package_skill.py
```

## Hook Setup (Optional)

The skill-activation-prompt hook automatically suggests relevant skills based on your prompts.

### Automatic Setup (Recommended)

```bash
/setup-skill-hook
```

### Manual Setup

See `hooks/skill-activation-prompt/README.md` for full configuration reference.

## Author

Henrik Soederlund
