# skill-activation-prompt Hook

**Purpose:** Automatically suggests relevant skills based on user prompts and file context

## How It Works

1. Reads `skill-rules.json` to understand skill trigger patterns
2. Matches user prompts against configured patterns
3. Checks which files the user is working with
4. Injects skill suggestions into Claude's context automatically

## Why This Hook Is Essential

This hook makes skill auto-activation work seamlessly. Instead of manually invoking skills, Claude automatically recognizes when a skill would be relevant and suggests it to you.

## Installation

### Step 1: Copy Hook Files

Copy both the shell script and TypeScript implementation to your project's hooks directory:

```bash
# Copy both files from the claudecode-toolkit hooks folder
cp skill-activation-prompt.sh your-project/.claude/hooks/
cp skill-activation-prompt.ts your-project/.claude/hooks/

# Make the shell script executable
chmod +x your-project/.claude/hooks/skill-activation-prompt.sh
```

### Step 2: Install Dependencies

Navigate to your hooks directory and install dependencies:

```bash
cd your-project/.claude/hooks
npm install
```

### Step 3: Configure Claude Code

Add the hook to your `.claude/settings.json`:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/skill-activation-prompt.sh"
          }
        ]
      }
    ]
  }
}
```

## Configuration

The hook looks for a `skill-rules.json` file in your `.claude/hooks` directory to understand which skills to suggest. This file defines patterns that trigger skill suggestions.

**Example skill-rules.json:**

```json
{
  "rules": [
    {
      "patterns": ["spreadsheet", "excel", "csv", "xlsx"],
      "skills": ["xlsx"],
      "filePatterns": ["**/*.xlsx", "**/*.csv"]
    },
    {
      "patterns": ["pdf", "document", "ocr"],
      "skills": ["pdf-processing-pro"],
      "filePatterns": ["**/*.pdf"]
    }
  ]
}
```

## How the Hook Triggers

The hook activates on the `UserPromptSubmit` event, which occurs every time you submit a prompt to Claude. It:

1. Analyzes your prompt text for relevant keywords
2. Checks your current project files for context
3. Matches against configured rules
4. Suggests applicable skills before Claude processes your request

## Troubleshooting

**Hook not triggering:**
- Verify the shell script is executable: `chmod +x skill-activation-prompt.sh`
- Check settings.json is properly formatted
- Ensure `skill-rules.json` exists in `.claude/hooks/`

**npm install fails:**
- Make sure you're in the `.claude/hooks/` directory
- Verify Node.js is installed: `node --version`
- Try clearing npm cache: `npm cache clean --force`

**Skills not being suggested:**
- Review `skill-rules.json` patterns
- Check that skill names match installed skills
- Verify file patterns match your project structure
