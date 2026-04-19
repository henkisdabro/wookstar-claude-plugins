# bash-lsp

Bash and shell script language server for Claude Code, powered by [bash-language-server](https://github.com/bash-lsp/bash-language-server).

Provides diagnostics via ShellCheck, completions, hover documentation, and go-to-definition for `.sh` and `.bash` files.

## Installation

### 1. Install the language server

```bash
npm install -g bash-language-server
```

Verify installation:

```bash
bash-language-server --version
```

### 2. (Recommended) Install ShellCheck for diagnostics

ShellCheck provides the static analysis that powers error detection. Install via your package manager:

```bash
# macOS
brew install shellcheck

# Ubuntu/Debian
sudo apt-get install shellcheck

# Windows
winget install koalaman.shellcheck
```

### 3. Install the plugin

```bash
/plugin install bash-lsp@wookstar-claude-plugins
```

## Supported Files

| Extension | Language |
|-----------|----------|
| `.sh` | Shell Script |
| `.bash` | Bash Script |

## Features

- ShellCheck-powered diagnostics (requires ShellCheck installed)
- Shell variable and command completions
- Hover documentation for built-in commands
- Go-to-definition for functions and variables
- Document symbols and outline
