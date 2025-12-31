# MCP Test: Inline Configuration

Test plugin to verify MCP configuration via inline `mcpServers` in marketplace.json.

## Purpose

This plugin tests whether MCP servers configured inline in marketplace.json (directly in the plugin entry) are properly loaded by Claude Code.

## Expected Behaviour

After installation, a `open-meteo-test-inline` MCP server should be available.

## Verification

```bash
claude mcp list | grep -i open-meteo-test-inline
```

## Cleanup

Delete this plugin after testing is complete.
