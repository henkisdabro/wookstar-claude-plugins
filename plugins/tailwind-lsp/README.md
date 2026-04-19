# tailwind-lsp

Tailwind CSS language server for Claude Code, powered by the official [@tailwindcss/language-server](https://github.com/tailwindlabs/tailwindcss-intellisense/tree/master/packages/tailwindcss-language-server).

Provides class completions with previews, hover documentation, and diagnostics across HTML, CSS, and JavaScript/TypeScript files.

## Installation

### 1. Install the language server

```bash
npm install -g @tailwindcss/language-server
```

Verify installation:

```bash
tailwindcss-language-server --version
```

### 2. Install the plugin

```bash
/plugin install tailwind-lsp@wookstar-claude-plugins
```

## Supported Files

| Extension | Language |
|-----------|----------|
| `.html` | HTML |
| `.css` | CSS |
| `.tsx` | TypeScript React |
| `.jsx` | JavaScript React |
| `.ts` | TypeScript |
| `.js` | JavaScript |

## Features

- Tailwind class name completions with CSS preview on hover
- Unknown class warnings
- CSS `@apply` directive support
- Works with Tailwind v3 and v4
- Reads your `tailwind.config.js` for custom theme completions

## Requirements

A `tailwind.config.js` (or `tailwind.config.ts`) must be present in your project root for the language server to activate fully.
