# lsp-yaml

YAML language server for Claude Code, powered by [yaml-language-server](https://github.com/redhat-developer/yaml-language-server).

Provides schema validation, completions, hover documentation, and formatting for `.yaml` and `.yml` files.

## Installation

### 1. Install the language server

```bash
npm install -g yaml-language-server
```

Verify installation:

```bash
yaml-language-server --version
```

### 2. Install the plugin

```bash
/plugin install lsp-yaml@wookstar-claude-plugins
```

On Claude Code 2.1.275 or later, in one step without adding the marketplace first: `/plugin install lsp-yaml --marketplace henkisdabro/wookstar-claude-plugins`

## Supported Files

| Extension | Language |
|-----------|----------|
| `.yaml` | YAML |
| `.yml` | YAML |

## Features

- JSON Schema and custom schema validation
- Key and value completions based on schema
- Auto-detects schemas for GitHub Actions, Docker Compose, Kubernetes, and more via SchemaStore
- Hover documentation
- Syntax error highlighting
- Code formatting
