# MCP Excalidraw

Hand-drawn diagrams with streaming animations, fullscreen editing, checkpoint/restore, and export to excalidraw.com.

## Installation

```bash
/plugin install mcp-excalidraw@wookstar-claude-plugins
```

## Configuration

This MCP server uses HTTP transport via a remote Vercel endpoint. No API key or environment variables required.

## Available Tools

| Tool | Description |
|------|-------------|
| `read_me` | Returns the Excalidraw element format reference with colour palettes, examples, and tips. Call before using `create_view` for the first time. |
| `create_view` | Renders a hand-drawn diagram using Excalidraw elements with draw-on animations. |
| `export_to_excalidraw` | Uploads diagram to excalidraw.com and returns a shareable URL. |
| `save_checkpoint` | Saves a checkpoint of the current diagram state for later restoration. |
| `read_checkpoint` | Reads a previously saved checkpoint to restore diagram state. |

## Usage Examples

- Architecture diagrams
- Flowcharts and process diagrams
- Sequence diagrams
- Mind maps and brainstorming visuals
- UI wireframes and mockups

## Credits

Based on the [Excalidraw MCP App](https://github.com/antonpk1/excalidraw-mcp-app) by [Anton Pidkuiko](https://github.com/antonpk1). Licensed under MIT.
