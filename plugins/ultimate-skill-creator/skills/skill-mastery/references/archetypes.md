# Skill Archetypes

Four proven patterns for organising skills based on their purpose.

## 1. CLI Reference Skill

**Best for:** Tool documentation (git, gcloud, vercel, npm)

**Characteristics:**
- Pure reference, minimal explanatory prose
- Claude already knows CLI semantics
- Group commands by function
- Include common workflows as recipes

**Structure:**
```markdown
# Tool Name Skill

## Authentication
[auth commands with examples]

## Core Operations

### Create
command create [options]
  -n, --name     Name for resource
  -t, --type     Type (default: basic)

### Read
command list [filters]
command get <id>

### Update
command update <id> [options]

### Delete
command delete <id> [--force]

## Common Workflows

### Deploy to Production
1. command build --prod
2. command deploy --env production
3. command verify --wait
```

**Token efficiency:** Highest. No explanations Claude doesn't need.

---

## 2. Methodology Skill

**Best for:** Workflows, processes, thinking frameworks

**Characteristics:**
- Philosophy statement upfront
- THE EXACT PROMPT pattern for reproducibility
- Before/after examples
- Why it works explanations

**Structure:**
```markdown
# Methodology Name

> **Core Philosophy:** [One-liner insight that drives everything]

## Why This Matters

[Brief motivation - 2-3 sentences max]

## THE EXACT PROMPT

[Copy-paste ready prompt in code block]

## Why This Prompt Works

[Technical breakdown of each component]

## Before/After Examples

### Before (Without Methodology)
[Concrete example of suboptimal approach]

### After (With Methodology)
[Same scenario, better outcome]

## When NOT to Use

[Boundaries and limitations]
```

**Example - Code Review Methodology:**
```markdown
# Deep Code Review

> **Core Philosophy:** Reviews should find bugs the tests missed, not style issues the linter catches.

## THE EXACT PROMPT

Review this code focusing on:
1. Logic errors that tests wouldn't catch
2. Edge cases in error handling
3. Security implications of data flow
4. Performance under scale

Skip: formatting, naming conventions, documentation.

## Why This Prompt Works

- "Logic errors tests wouldn't catch" - focuses on value-add
- "Edge cases in error handling" - common bug source
- "Security implications" - expertise most devs lack
- "Skip formatting" - prevents noise
```

---

## 3. Safety Tool Skill

**Best for:** Validation, security, guardrails

**Characteristics:**
- Threat model explicit
- Risk tiering tables
- What it blocks AND allows
- Modular/extensible design
- Security considerations section

**Structure:**
```markdown
# Tool Name

## Why This Exists

[Threat model - what could go wrong without this]

## Critical Design Principles

1. **Principle One** - [Explanation]
2. **Principle Two** - [Explanation]

## Risk Tiers

| Tier | Approval | Auto-approve | Examples |
|------|----------|--------------|----------|
| CRITICAL | 2+ humans | Never | rm -rf /, DROP DATABASE |
| DANGEROUS | 1 human | Never | git reset --hard |
| CAUTION | 0 | After 30s | rm single_file.txt |
| SAFE | 0 | Immediately | rm *.log |

## What It Blocks

| Pattern | Reason | Override |
|---------|--------|----------|
| `rm -rf /` | Catastrophic | None |
| `DROP TABLE` | Data loss | --i-really-mean-it |

## What It Allows

| Pattern | Why Safe |
|---------|----------|
| `rm *.tmp` | Temporary files |
| `git stash` | Recoverable |

## Modular Extensions

[How to add new rules]

## Security Considerations

- [Assumption 1]
- [Limitation 1]
- [Known bypass scenarios]
```

---

## 4. Orchestration Tool Skill

**Best for:** Multi-agent coordination, automation, pipelines

**Characteristics:**
- Quick start for immediate use
- Robot mode (JSON APIs) for automation
- Integration matrix with other tools
- State diagrams for complex flows

**Structure:**
```markdown
# Tool Name

## Why This Exists

[Pain points solved - bullet list]

## Quick Start

[Minimal viable usage - 3 commands max]

## Core Commands

### Session Management
[commands grouped logically]

### Agent Control
[commands grouped logically]

## Robot Mode (Automation APIs)

### Status Query
tool --robot-status

Output:
{"sessions": [...], "agents": [...], "status": "ok"}

### Snapshot
tool --robot-snapshot

Output:
{"type": "snapshot", "timestamp": "...", "data": {...}}

## Integration Matrix

| Tool | Integration Type | Setup |
|------|-----------------|-------|
| Agent Mail | Message routing | Automatic |
| Validator | Pre-flight checks | Enable in config |

## State Diagram

┌─────────────┐
│   IDLE      │
└──────┬──────┘
       │ start
       ▼
┌─────────────┐
│  RUNNING    │◄──────┐
└──────┬──────┘       │
       │ complete     │ retry
       ▼              │
┌─────────────┐       │
│  VALIDATE   │───────┘
└──────┬──────┘
       │ pass
       ▼
┌─────────────┐
│  COMPLETE   │
└─────────────┘
```

---

## Choosing Your Archetype

| If your skill... | Use |
|------------------|-----|
| Documents a CLI tool | CLI Reference |
| Teaches a process/workflow | Methodology |
| Validates/blocks/guards | Safety Tool |
| Coordinates multiple agents | Orchestration |
| Does multiple of above | Hybrid (pick primary, add sections) |

## Hybrid Example

A "deployment skill" might combine:
- **CLI Reference** sections for deploy commands
- **Safety Tool** tiers for production vs staging
- **Orchestration** for multi-step deploy pipeline

```markdown
# Deployment Skill

## Commands (CLI Reference style)
[deploy commands]

## Safety Tiers (Safety Tool style)
| Environment | Approval Required |
|-------------|-------------------|
| Production  | 2 humans          |
| Staging     | 1 human           |
| Dev         | None              |

## Deployment Pipeline (Orchestration style)
[state diagram and robot mode]
```
