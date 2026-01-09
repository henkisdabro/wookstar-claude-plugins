# CLAUDE.md

Development guidance for Claude Code when working with this plugin marketplace.

## Quick Reference

```bash
# Validation
claude plugin validate .

# Local testing
/plugin marketplace add .
/plugin install <toolkit>@wookstar
/plugin marketplace update wookstar

# After changes
/plugin marketplace update wookstar
```

**Official Documentation:** <https://docs.claude.com/en/docs/claude-code/plugin-marketplaces.md>

## Architecture Decisions

### Consolidated Bundles (v4.0)

Components are organised into self-contained toolkits by domain rather than scattered individual plugins.

**Why this approach:**

- Users install complete toolsets, not individual components
- Related agents, commands, skills, and MCPs bundled together
- Consistent structure across all toolkits
- `strict: false` enables auto-discovery without plugin.json files

### Directory Structure

```
wookstar-claude-plugins/
├── .claude-plugin/
│   └── marketplace.json         # Root manifest (defines all plugins)
├── <toolkit>/                   # Each toolkit at root level
│   ├── README.md
│   ├── .mcp.json                # Optional: embedded MCP servers
│   ├── agents/*.md              # Auto-loaded
│   ├── commands/*.md            # Auto-loaded
│   └── skills/<name>/SKILL.md   # Auto-loaded
├── mcp-servers/                 # Standalone MCP plugins
│   └── <server>/.mcp.json
└── docs/                        # Development reference files
```

### Auto-Loading Rules

With `strict: false`, Claude Code auto-discovers:

| Directory | File Pattern | Loaded As |
|-----------|--------------|-----------|
| `agents/` | `*.md` | Agents |
| `commands/` | `*.md` | Commands |
| `skills/<name>/` | `SKILL.md` | Skills |
| Root | `.mcp.json` | MCP Servers |

No individual `plugin.json` files required within toolkits.

## MCP Configuration Rules

**CRITICAL:** All MCP servers MUST use file references, not inline configurations.

```json
// CORRECT - File reference
"mcpServers": "./.mcp.json"

// WRONG - Inline configuration
"mcpServers": { "server-name": { "command": "..." } }
```

**Why file references:**

1. Atomic ownership - each toolkit owns its MCP config
2. Easier maintenance - modify MCPs without editing marketplace.json
3. Cleaner diffs - changes isolated to toolkit's .mcp.json
4. Consistent architecture - same pattern everywhere

**Validation checklist:**

- [ ] `.mcp.json` exists in plugin directory
- [ ] marketplace.json uses `"mcpServers": "./.mcp.json"`
- [ ] No inline `mcpServers` objects in marketplace.json
- [ ] `claude plugin validate .` passes

## Adding Components

### New Toolkit

1. Create directory: `<toolkit-name>/`
2. Create `README.md` for documentation
3. Add component directories: `agents/`, `commands/`, `skills/`
4. Add entry to `.claude-plugin/marketplace.json` (see [docs/templates.md](docs/templates.md))
5. Test: `/plugin install <toolkit>@wookstar`

### Command/Agent (to existing toolkit)

1. Create file: `<toolkit>/commands/<name>.md` or `<toolkit>/agents/<name>.md`
2. Auto-loaded on marketplace update
3. Test: `/plugin marketplace update wookstar`

### Skill (to existing toolkit)

1. Create: `<toolkit>/skills/<skill-name>/SKILL.md`
2. Optional subdirectories: `assets/`, `references/`, `scripts/`
3. Auto-loaded on marketplace update

### MCP Server (embedded in toolkit)

1. Create/edit: `<toolkit>/.mcp.json`
2. Add `"mcpServers": "./.mcp.json"` to marketplace.json entry
3. Test: `/plugin install <toolkit>@wookstar`

### MCP Server (standalone)

1. Create: `mcp-servers/<server>/.mcp.json`
2. Add entry to marketplace.json with `"category": "mcpServers"`
3. Test: `/plugin install mcp-<server>@wookstar`

## Critical Files

### .claude-plugin/marketplace.json

Root manifest containing:

- Marketplace metadata (name, version)
- All plugin definitions with source paths
- Toolkit metadata (version, description, keywords, category)

**Path resolution:**

- `"source": "./productivity"` - toolkit root
- `"mcpServers": "./.mcp.json"` - relative to plugin source

### <toolkit>/.mcp.json

MCP server configurations for the toolkit. Format:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["package-name"],
      "env": { "API_KEY": "${ENV_VAR}" }
    }
  }
}
```

## Version Management

**Marketplace version:** Updated for architectural changes (currently 4.0.0)
**Toolkit versions:** Independent semantic versioning per toolkit

Follow semantic versioning:

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

## Constraints

1. **No build process** - pure marketplace, no compilation
2. **Strict: false** - all toolkits use flexible auto-discovery
3. **MCP file references** - never inline configurations
4. **Markdown format** - commands and agents are `.md` files
5. **No plugin.json in skills** - not required with `strict: false`
6. **Environment variable security** - never commit secrets

## Testing Checklist

Before committing:

1. Run `claude plugin validate .`
2. Install toolkit locally and verify components load
3. Test commands, agents, and skills function correctly
4. Update toolkit version if needed (MAJOR/MINOR/PATCH)
5. Commit with semantic message
