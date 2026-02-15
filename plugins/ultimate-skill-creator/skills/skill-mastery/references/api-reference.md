# Official API Reference

Current frontmatter fields and constraints from official Claude Code documentation.

## Required Fields

### name

**Type:** String
**Required:** Yes
**Constraints:**
- Maximum 64 characters
- Lowercase letters, numbers, and hyphens only: `[a-z0-9-]`
- No XML tags
- No reserved words: "anthropic", "claude"

**Examples:**
```yaml
name: pdf-processing       # Good
name: commit-helper        # Good
name: BigQuery-Analysis    # Bad - uppercase
name: claude-helper        # Bad - reserved word
name: my_skill             # Bad - underscores
```

### description

**Type:** String
**Required:** Yes
**Constraints:**
- Maximum 1024 characters
- Non-empty
- No XML tags
- Must be third person

**Template:**
```yaml
description: >-
  [What it does - actions, capabilities].
  Use when [trigger phrases, contexts, file types, user intents].
```

**Examples:**
```yaml
# Good - specific, third person, trigger phrases
description: >-
  Extract text and tables from PDF files, fill forms, merge documents.
  Use when working with PDF files or when user mentions PDFs, forms,
  or document extraction.

# Good - action + context
description: >-
  Generate descriptive commit messages by analysing git diffs.
  Use when user asks for help writing commit messages or reviewing
  staged changes.

# Bad - first person
description: I can help you process Excel files

# Bad - vague
description: Helps with documents

# Bad - too long (over 1024 chars)
description: [very long description...]
```

---

## Optional Fields

### allowed-tools

**Type:** String (comma-separated) or Array
**Purpose:** Limit which tools Claude can use when skill is active
**Default:** All tools available

**Examples:**
```yaml
# Comma-separated string
allowed-tools: Read, Grep, Glob

# YAML array
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash(git:*)
```

**Tool patterns:**
- `Read` - Specific tool
- `Bash(git:*)` - Bash limited to git commands
- `Bash(npm:*)` - Bash limited to npm commands
- `mcp__server__tool` - Specific MCP tool

### model

**Type:** String
**Purpose:** Override model for this skill's execution
**Default:** Inherits from conversation

**Examples:**
```yaml
model: sonnet
model: opus
model: inherit  # Explicit inherit
```

### context

**Type:** String
**Purpose:** Run skill in isolated context
**Values:** `fork`

**Example:**
```yaml
context: fork
```

**Effect:** Skill runs in separate context window, isolated from main conversation history.

### agent

**Type:** String
**Purpose:** Specify subagent type when using `context: fork`
**Values:** `Explore`, `Plan`, `general-purpose`, or custom agent name

**Example:**
```yaml
context: fork
agent: Explore
```

### hooks

**Type:** Object
**Purpose:** Define lifecycle hooks for the skill
**Events:** `PreToolUse`, `PostToolUse`, `Stop`

**Example:**
```yaml
hooks:
  PreToolUse:
    - matcher: Write
      prompt: |
        Before writing, verify the file path is within the project directory.
        If not, ask user for confirmation.
```

### user-invocable

**Type:** Boolean
**Purpose:** Control visibility in slash command menu
**Default:** `true`

**Examples:**
```yaml
user-invocable: false  # Hidden from menu
user-invocable: true   # Visible in menu (default)
```

**Note:** When `false`, skill is hidden from `/skill-name` menu but Claude can still:
- Invoke via `Skill` tool programmatically
- Discover and apply automatically based on description

### disable-model-invocation

**Type:** Boolean
**Purpose:** Prevent Claude from programmatically invoking via Skill tool
**Default:** `false`

**Examples:**
```yaml
disable-model-invocation: true   # Only user can invoke via /skill-name
disable-model-invocation: false  # Claude can also invoke (default)
```

---

## Visibility Control Matrix

| Setting | Slash Menu | Skill Tool | Auto-discovery |
|---------|------------|------------|----------------|
| Default | ✅ | ✅ | ✅ |
| `user-invocable: false` | ❌ | ✅ | ✅ |
| `disable-model-invocation: true` | ✅ | ❌ | ✅ |
| Both false/true | ❌ | ❌ | ✅ |

---

## Complete Frontmatter Example

```yaml
---
name: advanced-pdf-processing
description: >-
  Extract text, tables, and images from PDF files. Fill PDF forms
  programmatically. Merge and split PDF documents. Use when working
  with PDF files, document extraction, form filling, or PDF manipulation.
allowed-tools:
  - Read
  - Write
  - Bash(pdftotext:*)
  - Bash(pdftk:*)
model: inherit
user-invocable: true
hooks:
  PreToolUse:
    - matcher: Write
      prompt: Verify output path ends with .pdf before writing.
---
```

---

## Skills in Subagents

Inject skills into subagent context:

```yaml
---
name: code-reviewer
description: Review code for quality and security issues.
skills: security-check, style-guide
---

[System prompt for code-reviewer agent]
```

**Effect:** Full content of `security-check` and `style-guide` skills is injected into the subagent's context.

---

## File Locations

### Personal Skills (all projects)
```
~/.claude/skills/skill-name/SKILL.md
```

### Project Skills (shared via git)
```
.claude/skills/skill-name/SKILL.md
```

### Plugin Skills
```
plugin-name/skills/skill-name/SKILL.md
```

---

## Validation Rules Summary

| Field | Max Length | Pattern | Required |
|-------|------------|---------|----------|
| name | 64 | `[a-z0-9-]+` | Yes |
| description | 1024 | Non-empty, no XML | Yes |
| allowed-tools | - | Valid tool names | No |
| model | - | Valid model ID | No |
| context | - | `fork` | No |
| agent | - | Valid agent name | No |

---

## Troubleshooting

### Skill not triggering
- Description too vague
- Missing trigger phrases
- Conflicting with another skill's description

### Skill not loading
- SKILL.md not found (case-sensitive)
- Invalid YAML syntax (check `---` delimiters)
- Name contains invalid characters

### Skill errors during execution
- Missing dependencies in scripts
- Permission issues (`chmod +x`)
- Windows paths instead of forward slashes

### Debug mode
```bash
claude --debug
```
Shows skill loading and selection decisions.
