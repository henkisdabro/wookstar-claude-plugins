# MCP Test: File Reference

Test plugin to verify MCP configuration via `.mcp.json` file reference.

## Purpose

This plugin tests whether MCP servers configured via a separate `.mcp.json` file (referenced in marketplace.json as `"mcpServers": "./.mcp.json"`) are properly loaded by Claude Code.

## Expected Behaviour

After installation, a `open-meteo-test-fileref` MCP server should be available.

## Verification

```bash
claude mcp list | grep -i open-meteo-test-fileref
```

## Cleanup

Delete this plugin after testing is complete.
