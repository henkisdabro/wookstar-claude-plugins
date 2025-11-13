# Google Tag Manager Suite

Complete toolkit for Google Tag Manager implementation, management, and debugging.

## Status: COMING SOON

This is a placeholder structure. The suite will include specialized agents, commands, skills, and MCP integrations for Google Tag Manager.

## Planned Components

### Agents (To Be Added)
- **gtm-specialist** - Expert in GTM architecture and best practices
- **gtm-debugger** - Troubleshooting and debugging specialist
- **gtm-implementation** - Implementation and migration expert

### Commands (To Be Added)
- **/gtm-init** - Initialize GTM container setup
- **/gtm-audit** - Audit current GTM configuration
- **/gtm-migrate** - Migrate tags from old tracking system
- **/gtm-test** - Test GTM configuration
- **/gtm-export** - Export container configuration

### Skills (To Be Added)
- **event-tracking** - GTM event tracking implementation
- **container-management** - GTM container organization and workflow
- **variable-configuration** - Data layer and variable setup
- **trigger-setup** - Trigger configuration and patterns
- **tag-templates** - Tag templates and best practices
- **debugging-tools** - GTM debugging and troubleshooting

## Directory Structure

```
gtm-suite/
├── agents/          ← Add agent markdown files here
├── commands/        ← Add command markdown files here
├── skills/          ← Add skill directories with SKILL.md files here
└── .mcp.json        ← Add GTM-specific MCP servers here if needed
```

## How to Add Components

1. **Add Agents**: Create .md files in `agents/` directory
2. **Add Commands**: Create .md files in `commands/` directory
3. **Add Skills**: Create directories with SKILL.md files in `skills/`
4. **Add MCP Servers**: Update `.mcp.json` if you have GTM API integrations

See the README.md files in each subdirectory for format guidelines.

## Installation

Once components are added:

```bash
/plugin install gtm-suite@wookstar
```

## Placeholder Version

Current version: 0.1.0 (placeholder structure only)
