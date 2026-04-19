# css-lsp

CSS, SCSS, and Less language server for Claude Code, powered by [vscode-langservers-extracted](https://github.com/hrsh7th/vscode-langservers-extracted).

Provides real-time diagnostics, completions, hover documentation, and formatting for `.css`, `.scss`, and `.less` files.

## Installation

### 1. Install the language server

```bash
npm install -g vscode-langservers-extracted
```

Verify installation:

```bash
vscode-css-language-server --version
```

### 2. Install the plugin

```bash
/plugin install css-lsp@wookstar-claude-plugins
```

## Supported Files

| Extension | Language |
|-----------|----------|
| `.css` | CSS |
| `.scss` | SCSS |
| `.less` | Less |

## Features

- Syntax diagnostics and error highlighting
- Property and value completions
- Hover documentation with MDN references
- Code formatting
- Colour previews

## Notes

`vscode-langservers-extracted` bundles the CSS, HTML, and JSON language servers together in a single package. Installing it once covers `css-lsp`, `html-lsp`, and `json-lsp`.
