# json-lsp

JSON and JSONC language server for Claude Code, powered by [vscode-langservers-extracted](https://github.com/hrsh7th/vscode-langservers-extracted).

Provides schema-based validation, completions, hover documentation, and formatting for `.json` and `.jsonc` files.

## Installation

### 1. Install the language server

```bash
npm install -g vscode-langservers-extracted
```

Verify installation:

```bash
vscode-json-language-server --version
```

### 2. Install the plugin

```bash
/plugin install json-lsp@wookstar-claude-plugins
```

## Supported Files

| Extension | Language |
|-----------|----------|
| `.json` | JSON |
| `.jsonc` | JSON with Comments |

## Features

- JSON Schema validation (auto-detects schemas from SchemaStore)
- Key and value completions based on schema
- Hover documentation
- Syntax error highlighting
- Code formatting

## Notes

`vscode-langservers-extracted` bundles the CSS, HTML, and JSON language servers together. Installing it once covers `css-lsp`, `html-lsp`, and `json-lsp`.
