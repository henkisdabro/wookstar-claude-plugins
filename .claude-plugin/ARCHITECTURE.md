# Marketplace Architecture

## Overview

This document explains the architecture and design decisions behind the Claude Code Marketplace.

## Marketplace Structure

### Core Files

```
Repository Root/
├── .claude-plugin/
│   ├── marketplace.json       # Marketplace manifest (registry of all plugins)
│   ├── README.md              # User-facing documentation
│   ├── ARCHITECTURE.md        # This file (architecture documentation)
│   ├── USAGE.md               # Usage guide and examples
│   ├── commands/              # All slash commands
│   ├── agents/                # All specialized agents
│   └── hooks/                 # All hook scripts
├── CLAUDE.md                  # Guidance for Claude Code instances
└── README.md                  # Repository overview
```

### marketplace.json

The central registry that defines:

- Marketplace metadata (name, owner, description)
- Plugin catalog with sources and configurations
- Version information
- Category organization

**Key Features:**

- Uses `strict: false` for flexibility (marketplace entries serve as complete manifests)
- All plugins use `"source": "./"` which points to the `.claude-plugin/` directory
- File paths are relative to the source (e.g., `"./commands/foo.md"` → `.claude-plugin/commands/foo.md`)
- Includes comprehensive metadata for discoverability
- Uses `${VAR_NAME}` syntax for user-provided environment variables

## Plugin Organization

### Category-Based Structure

Plugins are organized into logical categories:

1. **Productivity Tools** - Commands and utilities for daily development
2. **Agents** - Specialized AI agents for specific tasks
3. **Infrastructure** - Hooks and monitoring tools
4. **MCP Collections** - Grouped MCP server configurations

### Plugin Types

All plugin content lives directly under `.claude-plugin/` in a flat structure. No individual `plugin.json` files are needed - all configuration lives in `marketplace.json`.

#### Command Plugins

Plugins that provide slash commands (e.g., `/containerize`, `/ultra-think`):

```
.claude-plugin/
└── commands/
    ├── containerize.md
    ├── prompt_writer.md
    ├── planning.md
    ├── ultra-think.md
    └── ...
```

**marketplace.json reference:** `"commands": ["./commands/containerize.md"]`

#### Agent Plugins

Plugins that provide specialized agents:

```
.claude-plugin/
└── agents/
    ├── fullstack-developer/
    │   └── fullstack-developer.md
    ├── documentation-manager/
    │   └── documentation-manager.md
    └── validation-gates/
        └── validation-gates.md
```

**marketplace.json reference:** `"agents": ["./agents/fullstack-developer/fullstack-developer.md"]`

#### Hook Plugins

Plugins that provide hooks for tool interception:

```
.claude-plugin/
└── hooks/
    └── tool-logger/
        └── log-tool-usage.sh
```

**marketplace.json reference:**
```json
"hooks": {
  "PostToolUse": [{
    "matcher": "*",
    "hooks": [{"type": "command", "command": "./hooks/tool-logger/log-tool-usage.sh"}]
  }]
}
```

#### MCP Collection Plugins

Plugins that bundle MCP server configurations. No files needed - configuration lives entirely in marketplace.json:

**marketplace.json example:**
```json
{
  "name": "mcp-essentials",
  "source": "./",
  "mcpServers": {
    "fetch": {"command": "uvx", "args": ["mcp-server-fetch"]}
  }
}
```

## Design Principles

### 1. Modularity

Each plugin is self-contained and can be installed independently:

```bash
/plugin install development-utilities@claudecode-marketplace
```

### 2. Discoverability

Comprehensive metadata enables easy plugin discovery:

- Clear descriptions
- Relevant keywords
- Category classification
- Version tracking

### 3. Flexibility

Using `strict: false` allows plugins to:

- Omit `plugin.json` if marketplace entry is complete
- Override marketplace settings with local `plugin.json`
- Support various plugin structures

### 4. Team-Friendly

Designed for team adoption:

```json
{
  "extraKnownMarketplaces": {
    "claudecode-marketplace": {
      "source": {
        "source": "github",
        "repo": "henkisdabro/claudecode-marketplace"
      }
    }
  }
}
```

## Plugin Manifest Schema

### Standard Fields

All plugins include:

```json
{
  "name": "plugin-name",
  "version": "1.0.0",
  "description": "Plugin description",
  "author": {
    "name": "Author Name",
    "email": "email@example.com"
  },
  "license": "MIT",
  "keywords": ["tag1", "tag2"],
  "category": "category-name"
}
```

### Component-Specific Fields

#### Commands Plugin

```json
{
  "commands": "./commands/"  // or array of paths
}
```

#### Agents Plugin

```json
{
  "agents": ["./agent-name.md"]
}
```

#### Hooks Plugin

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "*",
        "hooks": [{"type": "command", "command": "..."}]
      }
    ]
  }
}
```

#### MCP Plugin

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["package-name"]
    }
  }
}
```

## Environment Variable Handling

MCP server configurations use environment variable references:

```json
{
  "env": {
    "API_KEY": "${API_KEY}"
  }
}
```

Users should create a `.env` file in their project root with required values.

## Installation Flow

### User Installation

1. User adds marketplace:
   ```bash
   /plugin marketplace add henkisdabro/claudecode-marketplace
   ```

2. Claude Code:
   - Clones/downloads the marketplace repository
   - Parses `marketplace.json`
   - Indexes available plugins

3. User installs plugin:
   ```bash
   /plugin install development-utilities@claudecode-marketplace
   ```

4. Claude Code:
   - Resolves plugin source from marketplace
   - Downloads/copies plugin files
   - Merges plugin configuration with user settings
   - Activates plugin components

### Team Installation

1. Team lead adds to `.claude/settings.json`:
   ```json
   {
     "extraKnownMarketplaces": {...},
     "enabledPlugins": [...]
   }
   ```

2. Team member trusts repository

3. Claude Code automatically:
   - Adds marketplace
   - Installs enabled plugins
   - Configures MCP servers

## Plugin Source Types

### Relative Paths (This Marketplace)

All plugins in this marketplace use the same source pattern:

```json
{
  "source": "./"
}
```

This points to the `.claude-plugin/` directory (where marketplace.json is located). All file paths are then relative to this source.

**Benefits:**

- Single repository for marketplace and plugins
- Simplified version management
- Easy local testing
- Consistent path resolution
- No nested plugin directories needed

### GitHub Repositories

For distributing plugins from separate repos:

```json
{
  "source": {
    "source": "github",
    "repo": "owner/plugin-repo"
  }
}
```

### Git URLs

For non-GitHub git hosting:

```json
{
  "source": {
    "source": "url",
    "url": "https://gitlab.com/team/plugin.git"
  }
}
```

## MCP Server Collections

### Grouping Strategy

MCP servers are grouped by function:

1. **essentials** - Core functionality (fetch, time, playwright)
2. **ai-tools** - AI integrations (Serena, Gemini)
3. **data-sources** - APIs and data services
4. **dev-tools** - Development and automation

### Benefits

- Install only what you need
- Reduce configuration complexity
- Easier to understand and discover
- Better performance (fewer inactive servers)

## Version Management

### Semantic Versioning

All plugins follow semver (major.minor.patch):

- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes

### Marketplace Versioning

The marketplace itself has a version:

```json
{
  "metadata": {
    "version": "1.0.0"
  }
}
```

## Testing and Validation

### Local Testing

```bash
# Add local marketplace
/plugin marketplace add ./claudecode-marketplace

# Install and test plugin
/plugin install development-utilities@claudecode-marketplace
```

### Validation

```bash
# Validate marketplace structure
claude plugin validate .claude-plugin
```

## Future Enhancements

### Planned Features

1. **Plugin Dependencies** - Define plugin dependencies
2. **Version Constraints** - Specify compatible versions
3. **Update Notifications** - Alert users to plugin updates
4. **Usage Analytics** - Track plugin installation and usage
5. **Community Ratings** - User reviews and ratings
6. **Automated Testing** - CI/CD for plugin validation

### Extension Points

The architecture supports future additions:

- Additional plugin types (themes, snippets)
- Custom plugin categories
- Plugin marketplaces federation
- Private marketplace hosting

## Best Practices

### For Plugin Authors

1. **Clear Documentation** - Write comprehensive README files
2. **Semantic Versioning** - Follow semver strictly
3. **Minimal Dependencies** - Reduce external dependencies
4. **Error Handling** - Handle edge cases gracefully
5. **Testing** - Test plugins thoroughly before publishing

### For Marketplace Maintainers

1. **Quality Control** - Review plugins before adding
2. **Security** - Scan for security vulnerabilities
3. **Documentation** - Keep documentation up to date
4. **Versioning** - Track marketplace and plugin versions
5. **Deprecation** - Communicate breaking changes

### For Users

1. **Review Plugins** - Check plugin documentation before installing
2. **Environment Variables** - Set up required credentials
3. **Updates** - Keep plugins updated
4. **Feedback** - Report issues and suggest improvements

## Security Considerations

### Environment Variables

- Never commit secrets to repository
- Use `.env` files (gitignored)
- Reference variables with `${VAR_NAME}` syntax

### Hook Scripts

- Review hook scripts before installation
- Hooks run with user permissions
- Log hook activities for audit

### MCP Servers

- MCP servers can access external APIs
- Review server permissions
- Use API keys with minimal scopes

## Performance

### Plugin Loading

- Plugins load on-demand
- Minimal startup overhead
- Lazy loading of components

### MCP Server Management

- Servers start when needed
- Automatic cleanup of inactive servers
- Resource usage monitoring

## Troubleshooting

### Common Issues

1. **Plugin Not Found**
   - Verify marketplace is added
   - Check plugin name spelling
   - Update marketplace: `/plugin marketplace update`

2. **Installation Fails**
   - Check network connectivity
   - Verify source URL accessibility
   - Review error logs

3. **MCP Server Errors**
   - Verify environment variables
   - Check MCP server compatibility
   - Review server logs

## Resources

- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)
- [Plugin Development](https://docs.claude.com/en/docs/claude-code/plugins)
- [Plugin Marketplaces](https://docs.claude.com/en/docs/claude-code/plugin-marketplaces)
- [MCP Specification](https://github.com/modelcontextprotocol)

## Support

For architecture questions or suggestions:

- Email: whom-wealthy.2z@icloud.com
- GitHub Issues: henkisdabro/claudecode-marketplace
