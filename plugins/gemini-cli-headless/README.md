# Gemini CLI Headless

Expert guidance for Gemini CLI headless mode operations with Claude Code - running prompts programmatically, parsing output formats, building automation scripts, and CI/CD integration.

## What's Included

### Agents (1)

- **gemini-cli-headless** - Comprehensive Gemini CLI automation expert

## Installation

```bash
/plugin install gemini-cli-headless@wookstar-claude-plugins
```

## Coverage

### Core Commands

- **Direct prompts** - `gemini --prompt "query"` or `gemini -p "query"`
- **Stdin input** - `echo "content" | gemini` or `cat file.md | gemini`
- **Combined** - `cat README.md | gemini --prompt "Summarize this"`

### Output Formats

- **Text (default)** - Human-readable output
- **JSON** - Structured data with response, stats, and error fields
- **Streaming JSON (JSONL)** - Real-time newline-delimited events

### Configuration Options

| Option | Description |
|--------|-------------|
| `--prompt`, `-p` | Run in headless mode |
| `--output-format` | text, json, or stream-json |
| `--model`, `-m` | Specify model |
| `--debug`, `-d` | Enable debug output |
| `--yolo`, `-y` | Auto-approve all actions |

## Usage Examples

```bash
# Code review automation
"Set up automated code review with Gemini CLI on my git diffs"

# CI/CD integration
"How do I get JSON output from gemini cli for parsing in my GitHub Action?"

# Batch processing
"Write a script to run Gemini on all Python files in a directory"

# Troubleshooting
"My gemini -p command isn't returning anything when I pipe a file to it"
```

## Common Patterns

### Generate commit messages

```bash
git diff --cached | gemini -p "Write a concise commit message" --output-format json | jq -r '.response'
```

### Batch processing

```bash
for file in src/*.py; do
    cat "$file" | gemini -p "Find bugs" --output-format json | jq -r '.response' > "reports/$(basename "$file").analysis"
done
```

### Usage tracking

```bash
result=$(gemini -p "query" --output-format json)
total_tokens=$(echo "$result" | jq -r '.stats.models | to_entries | map(.value.tokens.total) | add')
```
