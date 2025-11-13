# Google Analytics 4 Suite

Comprehensive toolkit for Google Analytics 4 implementation, reporting, and optimization.

## Status: COMING SOON

This is a placeholder structure. The suite will include specialized agents, commands, skills, and MCP integrations for Google Analytics 4.

## Planned Components

### Agents (To Be Added)
- **ga-analyst** - Data analysis and reporting expert
- **ga-optimizer** - Conversion optimization specialist
- **ga-implementation** - GA4 setup and configuration expert

### Commands (To Be Added)
- **/ga-init** - Initialize GA4 property setup
- **/ga-report** - Generate custom reports
- **/ga-audit** - Audit tracking implementation
- **/ga-migrate** - Migrate from Universal Analytics to GA4
- **/ga-dashboard** - Create custom dashboards

### Skills (To Be Added)
- **reporting-basics** - GA4 reporting fundamentals
- **custom-reports** - Custom report creation and analysis
- **goal-configuration** - Conversion goals and funnels
- **audience-management** - Audience segmentation and targeting
- **custom-dimensions** - Custom dimensions and metrics
- **event-tracking** - GA4 event tracking implementation
- **conversion-tracking** - E-commerce and conversion tracking

## Directory Structure

```
ga-suite/
├── agents/          ← Add agent markdown files here
├── commands/        ← Add command markdown files here
├── skills/          ← Add skill directories with SKILL.md files here
└── .mcp.json        ← Add GA4-specific MCP servers here if needed
```

## How to Add Components

1. **Add Agents**: Create .md files in `agents/` directory
2. **Add Commands**: Create .md files in `commands/` directory
3. **Add Skills**: Create directories with SKILL.md files in `skills/`
4. **Add MCP Servers**: Update `.mcp.json` if you have GA4 API integrations

See the README.md files in each subdirectory for format guidelines.

## Installation

Once components are added:

```bash
/plugin install ga-suite@wookstar
```

## Placeholder Version

Current version: 0.1.0 (placeholder structure only)
