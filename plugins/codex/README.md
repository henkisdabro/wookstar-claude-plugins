# Codex CLI

Expert guidance for OpenAI Codex CLI non-interactive mode operations with Claude Code - running prompts programmatically, parsing output formats, building automation scripts, and CI/CD integration.

## What's Included

### Agents (1)

- **codex** - Comprehensive Codex CLI automation expert

## Installation

```bash
/plugin install codex@wookstar-claude-plugins
```

## Coverage

### Core Commands

- **Direct prompts** - `codex exec "query"`
- **Stdin input** - `echo "content" | codex exec -`
- **With workspace writes** - `codex exec --full-auto "task"`
- **With working directory** - `codex exec -C /path "task"`

### Output Methods

- **Plain text (default)** - Final message to stdout, progress to stderr
- **JSONL event stream** - `--json` for programmatic event parsing
- **File output** - `-o path` for downstream scripts
- **Structured JSON** - `--output-schema schema.json` for validated output

### Configuration Options

| Option | Description |
|--------|-------------|
| `--full-auto` | Workspace-write sandbox + on-request approvals |
| `--sandbox`, `-s` | read-only, workspace-write, danger-full-access |
| `--model`, `-m` | Model override |
| `--json` | JSONL event stream |
| `--ephemeral` | No session persistence |

## Usage Examples

```bash
# Code review automation
"Review my auth module with Codex CLI"

# CI/CD integration
"How do I get structured output from codex exec for parsing in my GitHub Action?"

# Delegated tasks
"Run codex on this diff to generate a commit message"
```

## Common Patterns

### Code review via stdin

```bash
cat src/auth.py | codex exec - --ephemeral "Review for security issues"
```

### Commit message from diff

```bash
git diff --cached | codex exec - --ephemeral "Write a concise commit message"
```

### Structured output

```bash
codex exec "Extract project metadata" --output-schema schema.json -o result.json --ephemeral
```
