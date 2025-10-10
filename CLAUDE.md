# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a Claude Code Plugin Marketplace containing a curated collection of plugins, agents, slash commands, hooks, and MCP server configurations designed to enhance Claude Code development workflows.

**Official Documentation:** <https://docs.claude.com/en/docs/claude-code/plugin-marketplaces.md>

## Key Commands

### Testing the Marketplace Locally

```bash
# Add marketplace from local directory
/plugin marketplace add /home/henkisdabro/claudecode/claudecode-marketplace

# Or use relative path from project root
/plugin marketplace add .

# Install a specific plugin for testing
/plugin install development-utilities@claudecode-marketplace

# List installed plugins
/plugin list

# Remove marketplace for clean testing
/plugin marketplace remove claudecode-marketplace
```

### Validation

```bash
# Validate marketplace structure and manifest
claude plugin validate .claude-plugin

# Validate individual plugin manifests
claude plugin validate .claude-plugin/plugins/development-utilities
```

### Publishing Changes

Since there's no build step, changes are immediate. Testing workflow:

1. Make changes to plugin files
2. If marketplace is already added: `/plugin marketplace update claudecode-marketplace`
3. If testing new plugin: `/plugin install <plugin-name>@claudecode-marketplace`
4. Test the plugin functionality
5. Commit changes with semantic commit messages

## Architecture Overview

### Directory Structure

```
Repository Root/
├── .claude-plugin/
│   ├── marketplace.json          # Central registry of all plugins
│   ├── README.md                  # User-facing documentation
│   ├── ARCHITECTURE.md            # Detailed architecture guide
│   ├── USAGE.md                   # Usage examples and workflows
│   ├── commands/                  # All slash commands
│   │   ├── containerize.md
│   │   ├── prompt_writer.md
│   │   ├── planning.md
│   │   ├── ultra-think.md
│   │   └── ...
│   ├── agents/                    # Specialized AI agents
│   │   ├── fullstack-developer/
│   │   │   └── fullstack-developer.md
│   │   ├── documentation-manager/
│   │   │   └── documentation-manager.md
│   │   └── validation-gates/
│   │       └── validation-gates.md
│   └── hooks/                     # Hook scripts for tool interception
│       └── tool-logger/
│           └── log-tool-usage.sh
├── CLAUDE.md                      # This file
└── README.md                      # Repository overview
```

### Plugin Types and Components

#### 1. Command Plugins

Provide slash commands like `/containerize`, `/ultra-think`. Commands are Markdown files with prompt content.

**Path convention:** `.claude-plugin/commands/<command-name>.md`
**Reference in marketplace.json:** `"./commands/<command-name>.md"`

#### 2. Agent Plugins

Specialized AI agents invoked proactively. Agents are Markdown files defining behavior and expertise.

**Path convention:** `.claude-plugin/agents/<agent-name>/<agent-name>.md`
**Reference in marketplace.json:** `"./agents/<agent-name>/<agent-name>.md"`

#### 3. Hook Plugins

Scripts that intercept tool usage for logging/monitoring. Currently only PostToolUse hooks.

**Path convention:** `.claude-plugin/hooks/<hook-name>/<script-name>.sh`
**Reference in marketplace.json:** `"./hooks/<hook-name>/<script-name>.sh"`

#### 4. MCP Collection Plugins

Bundled MCP server configurations. No separate files needed - configuration lives entirely in marketplace.json.

**No plugin.json required** when using `strict: false` in marketplace.json.

### Critical Files

#### marketplace.json

The single source of truth for the marketplace. Contains:

- Marketplace metadata (name, owner, description, version)
- Complete plugin registry with all metadata
- Plugin sources (relative paths or GitHub repos)
- MCP server configurations
- Command/agent/hook definitions

**Key Design Decision:** Uses `strict: false` which means plugins don't need individual `plugin.json` files if the marketplace.json entry is complete. This reduces duplication and simplifies the structure.

**Path Resolution:**
- All plugins use `"source": "./"` which points to the `.claude-plugin/` directory (where marketplace.json is located)
- All file paths in plugin configurations are relative to this source directory
- Example: `"./commands/containerize.md"` resolves to `.claude-plugin/commands/containerize.md`
- Environment variables: Use `${VAR_NAME}` syntax for user-provided environment variables

## Adding New Plugins

### Key Path Resolution Rules

1. **Source Directory:** All plugins use `"source": "./"` which means the `.claude-plugin/` directory
2. **File Paths:** All paths are relative to the source (e.g., `"./commands/foo.md"` → `.claude-plugin/commands/foo.md`)
3. **No plugin.json Required:** With `strict: false`, all metadata lives in marketplace.json
4. **Flat Structure:** All commands, agents, and hooks live directly under `.claude-plugin/`

### Adding a Command Plugin

1. Create command file: `.claude-plugin/commands/<command-name>.md`
2. Add entry to `marketplace.json` plugins array:

```json
{
  "name": "my-plugin",
  "source": "./",
  "description": "Plugin description",
  "version": "1.0.0",
  "author": {
    "name": "Your Name",
    "email": "your-email@example.com"
  },
  "homepage": "https://github.com/username/repo",
  "repository": "https://github.com/username/repo",
  "license": "MIT",
  "keywords": ["keyword1", "keyword2"],
  "category": "productivity",
  "commands": [
    "./commands/<command-name>.md"
  ],
  "strict": false
}
```

3. Test locally with `/plugin marketplace add .`

### Adding an Agent Plugin

1. Create directory and agent file: `.claude-plugin/agents/<agent-name>/<agent-name>.md`
2. Add entry to `marketplace.json`:

```json
{
  "name": "my-agent",
  "source": "./",
  "description": "Agent description",
  "version": "1.0.0",
  "category": "agents",
  "agents": ["./agents/<agent-name>/<agent-name>.md"],
  "strict": false
}
```

3. Test locally

### Adding a Hook Plugin

1. Create directory and script: `.claude-plugin/hooks/<hook-name>/<script-name>.sh`
2. Add entry to `marketplace.json`:

```json
{
  "name": "my-hook",
  "source": "./",
  "description": "Hook description",
  "version": "1.0.0",
  "category": "monitoring",
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "./hooks/<hook-name>/<script-name>.sh"
          }
        ]
      }
    ]
  },
  "strict": false
}
```

3. Test locally

### Adding an MCP Collection Plugin

No files needed - configuration lives entirely in marketplace.json:

```json
{
  "name": "mcp-my-collection",
  "source": "./",
  "description": "MCP server collection description",
  "version": "1.0.0",
  "category": "mcp-servers",
  "mcpServers": {
    "server-name": {
      "command": "uvx",
      "args": ["package-name"]
    }
  },
  "strict": false
}
```

## Environment Variables

Many MCP servers require API keys and credentials. Users should create a `.env` file in their project root with required values. The marketplace uses `${VAR_NAME}` syntax in marketplace.json which gets resolved from user environment.

See README.md for complete list of required environment variables.

## Metadata Standards

All plugins must include:

- `name`: kebab-case identifier
- `version`: Semantic versioning (major.minor.patch)
- `description`: Clear, concise description
- `author`: Name and email
- `category`: One of: productivity, agents, monitoring, mcp-servers
- `keywords`: Array of searchable tags
- `license`: "MIT" (or appropriate license)

## Version Management

Follow semantic versioning strictly:

- **MAJOR**: Breaking changes (incompatible with previous versions)
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

Update both the plugin version AND the marketplace metadata version when making significant marketplace-wide changes.

## Team Configuration

This marketplace is designed for team adoption. Users can add to `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "claudecode-marketplace": {
      "source": {
        "source": "github",
        "repo": "henkisdabro/claudecode-marketplace"
      }
    }
  },
  "enabledPlugins": [
    "development-utilities@claudecode-marketplace",
    "planning-tools@claudecode-marketplace"
  ]
}
```

When team members trust the repository, plugins install automatically.

## Important Constraints

1. **No Build Process**: This is a pure marketplace - no compilation or build steps
2. **Flattened Structure**: All content lives directly under `.claude-plugin/` (no nested `plugins/` subdirectories)
3. **Single Source of Truth**: marketplace.json is the only configuration file (no individual plugin.json files)
4. **Relative Path Convention**: All plugins use `"source": "./"` and paths are relative to `.claude-plugin/`
5. **Environment Variable Security**: Never commit API keys or secrets to the repository
6. **Markdown Format**: Commands and agents are Markdown files, not code
7. **Plugin Isolation**: Each plugin should be independent and self-contained

## Documentation Files

- **README.md**: User-facing overview, installation instructions, plugin catalog
- **ARCHITECTURE.md**: Deep dive into design decisions, plugin types, structure
- **USAGE.md**: Practical examples, workflows, troubleshooting, best practices
- **CLAUDE.md** (this file): Quick reference for Claude Code instances

When making changes to plugins, consider whether documentation needs updating to reflect new functionality or changed behavior.
