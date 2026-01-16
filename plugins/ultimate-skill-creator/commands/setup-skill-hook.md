---
description: Set up the skill-activation-prompt hook in your project with automatic configuration
allowed-tools: Bash, Read, Write, Edit, Glob, AskUserQuestion
argument-hint: "[project-path]"
---

# Setup Skill Activation Hook

You are setting up the skill-activation-prompt hook for a Claude Code project.

## Your Task

1. **Determine the target project directory:**
   - If the user provided a path argument, use that
   - Otherwise, use the current working directory
   - Confirm the path exists and is a valid project directory

2. **Check prerequisites:**
   - Verify Node.js is installed (`node --version`)
   - Check if `.claude/` directory exists (create if needed)

3. **Copy hook files:**
   - Create `.claude/hooks/` directory if it doesn't exist
   - Copy these files from the plugin to the target:
     - `skill-activation-prompt.sh`
     - `skill-activation-prompt.ts`
     - `package.json`
     - `tsconfig.json`
   - Make the shell script executable

4. **Install dependencies:**
   - Run `npm install` in the `.claude/hooks/` directory

5. **Create skill-rules.json template:**
   - Create `.claude/skills/` directory if it doesn't exist
   - Create a starter `skill-rules.json` with example rules
   - Ask user if they want to customise the rules now or later

6. **Update settings.json:**
   - Check if `.claude/settings.json` exists
   - If it exists, merge the hook configuration (preserve existing settings)
   - If not, create it with the hook configuration

7. **Verify setup:**
   - Confirm all files are in place
   - Show a summary of what was configured

## Hook Files Location

The hook source files are in the ultimate-skill-creator plugin:
```
${CLAUDE_PLUGIN_ROOT}/hooks/skill-activation-prompt/
```

Use `${CLAUDE_PLUGIN_ROOT}` to reference the plugin directory.

## Starter skill-rules.json Template

Create with practical examples (adjust skill names to match your installed skills):

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
        "keywords": ["pdf", "extract text", "ocr"],
        "intentPatterns": ["read.*pdf", "convert.*pdf"]
      }
    }
  }
}
```

Note: Users should customise this with their actual installed skill names.

## Settings.json Hook Configuration

For `UserPromptSubmit` events, the `matcher` field is omitted (it operates at the conversation level, not on tool names):

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

## Important Notes

- If settings.json already has hooks configured, merge carefully - don't overwrite existing hooks
- The hook expects `skill-rules.json` in `.claude/skills/`, not `.claude/hooks/`
- Always make the shell script executable with `chmod +x`
- Run npm install to get the `tsx` dependency

## Success Message

After setup, inform the user:
- The hook is now active and will trigger on every prompt
- They should edit `.claude/skills/skill-rules.json` to add their own skill triggers
- Link to the hook README for configuration reference
