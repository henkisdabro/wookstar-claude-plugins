# html-lsp

HTML language server for Claude Code, powered by [vscode-langservers-extracted](https://github.com/hrsh7th/vscode-langservers-extracted).

Provides real-time diagnostics, tag and attribute completions, hover documentation, and formatting for `.html` and `.htm` files.

## Installation

### 1. Install the language server

```bash
npm install -g vscode-langservers-extracted
```

Verify installation:

```bash
vscode-html-language-server --version
```

### 2. Install the plugin

```bash
/plugin install html-lsp@wookstar-claude-plugins
```

## Supported Files

| Extension | Language |
|-----------|----------|
| `.html` | HTML |
| `.htm` | HTML |

## Features

- Tag and attribute completions
- Hover documentation
- Syntax diagnostics
- Code formatting
- Embedded CSS and JavaScript support

## Notes

`vscode-langservers-extracted` bundles the CSS, HTML, and JSON language servers together. Installing it once covers `css-lsp`, `html-lsp`, and `json-lsp`.
