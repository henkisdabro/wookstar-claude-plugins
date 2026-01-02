# Claude Code Toolkit

Meta toolkit for working with Claude Code itself - enhance thinking, create skills, and optimise prompts.

## What's Included

### Commands (4)

- **/ultra-think** - Deep analytical thinking mode for complex problems
- **/infinite** - Extended iterative generation for large-scale content creation
- **/reflection** - Analyse chat history and improve CLAUDE.md instructions
- **/prompt_writer** - Advanced prompt engineering assistant following Anthropic best practices

### Skills (1)

- **skill-creator** - Comprehensive guide for creating effective skills that extend Claude's capabilities

### Hooks (1)

- **skill-activation-prompt** - Automatically suggests relevant skills based on user prompts and file context

## Installation

```bash
/plugin install claudecode@wookstar
```

## Usage Examples

```bash
# Deep analytical thinking for complex problems
/ultra-think "Design a distributed caching system for global users"

# Extended iterative generation
/infinite "spec.md" "output/" 10

# Analyse and improve your CLAUDE.md instructions
/reflection

# Craft improved prompts following best practices
/prompt_writer "Create a code review assistant"

# Create a new skill
"Help me create a new skill for PDF editing"
```

## Command Details

### /ultra-think

Activates deep analysis mode for complex problem-solving:

- Multi-dimensional analysis (technical, business, user perspectives)
- Systematic exploration of the problem space
- Identification of constraints and hidden complexities
- Comprehensive solution evaluation

### /infinite

Iterative content generation from a specification:

- Reads specification file defining generation rules
- Analyses output directory for existing iterations
- Generates new iterations building on previous work
- Supports numbered iterations or continuous generation

### /reflection

Analyses your conversation history to improve instructions:

- Reviews chat history for patterns and issues
- Identifies areas where responses could improve
- Proposes specific changes to CLAUDE.md
- Implements approved improvements

### /prompt_writer

Prompt engineering assistant using Anthropic best practices:

- Reads latest Claude documentation
- Analyses your initial prompt brief
- Applies prompt engineering principles
- Outputs improved, validated prompt

## Skill Details

### skill-creator

Comprehensive guide for creating effective skills:

- Step-by-step skill creation process
- Best practices and patterns
- SKILL.md structure guidance
- Bundled resources organisation (scripts, references, assets)
- Progressive disclosure design principles
- Testing and validation tips

**Included Scripts:**

- `init_skill.py` - Initialise a new skill directory structure
- `package_skill.py` - Package skill for distribution
- `quick_validate.py` - Validate skill structure

## Hook Details

### skill-activation-prompt

Automatically suggests relevant skills based on your work:

**Setup:**

1. Copy hook files to your project:

   ```bash
   cp claudecode/hooks/skill-activation-prompt/* .claude/hooks/
   chmod +x .claude/hooks/skill-activation-prompt.sh
   ```

2. Install dependencies:

   ```bash
   cd .claude/hooks
   npm install
   ```

3. Add to `.claude/settings.json`:

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

See `hooks/skill-activation-prompt/README.md` for detailed setup instructions.

## When to Use

This toolkit is ideal for:

- Complex problem-solving requiring deep analysis
- Large-scale content or code generation projects
- Improving your Claude Code configuration
- Crafting effective prompts for AI assistants
- Creating new skills for Claude Code
- Extending Claude Code's capabilities
- Learning skill development best practices

## Skill Creation Workflow

1. **Understanding** - Gather examples of how the skill will be used
2. **Planning** - Identify reusable resources (scripts, references, assets)
3. **Implementation** - Create SKILL.md and bundled resources
4. **Testing** - Validate the skill works as expected
5. **Iteration** - Refine based on usage

The skill-creator skill guides you through each step.
