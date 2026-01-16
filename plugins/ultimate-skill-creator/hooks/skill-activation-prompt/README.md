# skill-activation-prompt Hook

Automatically suggests relevant skills based on user prompts, helping Claude activate the right skills before responding.

## Quick Start

Run the setup command in your project:

```bash
/setup-skill-hook
```

This handles all the installation steps automatically. Continue reading for manual setup or configuration details.

## How It Works

1. Triggers on every `UserPromptSubmit` event (when you send a message)
2. Reads your `skill-rules.json` configuration for trigger patterns
3. Matches your prompt against keywords and intent patterns
4. Outputs skill suggestions grouped by priority (critical, high, medium, low)

## Installation

### Step 1: Copy Hook Files to Your Project

```bash
# Create hooks directory if it doesn't exist
mkdir -p your-project/.claude/hooks

# Copy all hook files from this plugin
cp -r /path/to/ultimate-skill-creator/hooks/skill-activation-prompt/* your-project/.claude/hooks/

# Make the shell script executable
chmod +x your-project/.claude/hooks/skill-activation-prompt.sh
```

### Step 2: Install Dependencies

```bash
cd your-project/.claude/hooks
npm install
```

This installs `tsx` for TypeScript execution.

### Step 3: Create Your Skill Rules

Create a `skill-rules.json` file in your project's `.claude/skills/` directory:

```bash
mkdir -p your-project/.claude/skills
```

**Example `.claude/skills/skill-rules.json`:**

```json
{
  "version": "1.0.0",
  "skills": {
    "xlsx": {
      "type": "domain",
      "enforcement": "suggest",
      "priority": "high",
      "promptTriggers": {
        "keywords": ["spreadsheet", "excel", "csv", "xlsx"],
        "intentPatterns": ["create.*spreadsheet", "export.*excel"]
      }
    },
    "pdf-processing-pro": {
      "type": "domain",
      "enforcement": "suggest",
      "priority": "high",
      "promptTriggers": {
        "keywords": ["pdf", "ocr", "extract text"],
        "intentPatterns": ["read.*pdf", "convert.*pdf"]
      }
    },
    "security-review": {
      "type": "guardrail",
      "enforcement": "block",
      "priority": "critical",
      "promptTriggers": {
        "keywords": ["credentials", "api key", "password", "secret"],
        "intentPatterns": ["commit.*secret", "push.*credentials"]
      }
    }
  }
}
```

### Step 4: Configure Claude Code Settings

Add the hook to your project's `.claude/settings.json`:

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

## Configuration Reference

### Skill Rule Properties

| Property | Values | Description |
|----------|--------|-------------|
| `type` | `guardrail`, `domain` | Guardrails enforce safety, domain skills provide expertise |
| `enforcement` | `block`, `warn`, `suggest` | How strongly to recommend the skill |
| `priority` | `critical`, `high`, `medium`, `low` | Display grouping in suggestions |
| `promptTriggers.keywords` | `string[]` | Simple word matches (case-insensitive) |
| `promptTriggers.intentPatterns` | `string[]` | Regex patterns for complex matching |

### Priority Display

When skills match, they're grouped and displayed as:

- **CRITICAL** (⚠️): Required skills - typically guardrails
- **HIGH** (📚): Recommended skills - strong relevance
- **MEDIUM** (💡): Suggested skills - likely helpful
- **LOW** (📌): Optional skills - might be useful

## Example Output

When you type a prompt that matches configured rules:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 SKILL ACTIVATION CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 RECOMMENDED SKILLS:
  → xlsx

ACTION: Use Skill tool BEFORE responding
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Troubleshooting

**Hook not triggering:**

- Verify executable permission: `chmod +x skill-activation-prompt.sh`
- Check `.claude/settings.json` is valid JSON
- Ensure `$CLAUDE_PROJECT_DIR` environment variable is set

**"Cannot find module" errors:**

- Run `npm install` in the `.claude/hooks/` directory
- Verify `tsx` is installed: `npx tsx --version`

**Skills not being suggested:**

- Confirm `skill-rules.json` exists in `.claude/skills/` (not `.claude/hooks/`)
- Check JSON syntax is valid
- Verify keywords are lowercase (matching is case-insensitive)
- Test regex patterns separately before adding as `intentPatterns`

**TypeScript errors:**

- Run `npm run check` to validate TypeScript
- Ensure Node.js 18+ is installed
