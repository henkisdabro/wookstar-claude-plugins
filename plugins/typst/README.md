# Typst

Language reference for [Typst](https://typst.app), the markup-based typesetting system. It covers syntax, maths, set and show rules, layout, tables, templates, accessibility and every export target, and it flags the APIs that Typst 0.15 removed so older habits do not produce compile errors.

## What's included

- **typst** skill - everyday syntax and patterns in `SKILL.md`, a compile-and-fix workflow, and nine reference files loaded on demand:

| File | Topics |
|---|---|
| `syntax.md` | Markup, code mode, types, operators, control flow |
| `styling.md` | Set and show rules, selectors, templates |
| `math.md` | Equations, symbols, alignment, delimiters |
| `layout.md` | Pages, margins, headers and footers, grids, columns, placement |
| `tables.md` | Spans, strokes, fills, repeating headers, data-driven tables |
| `functions.md` | Parameters of the common built-in functions |
| `export.md` | CLI flags, PDF standards, HTML, PNG, SVG, bundle export, fonts |
| `accessibility.md` | Tagged PDF, PDF/UA, alt text |
| `whats-new.md` | 0.15 changes, removals, deprecations and migration |

## Prerequisites

The `typst` CLI for compiling: see the [installation instructions](https://github.com/typst/typst#installation) (`brew install typst`, `cargo install --locked typst-cli`, or a release binary). The skill still answers language questions without it.

## Installation

```bash
/plugin install typst@wookstar-claude-plugins
```

## Usage

```text
"Create a Typst document for a two-column paper"
"Fix this Typst error: unknown variable: sect"
"Make a Typst table with a repeating header row"
"Export this .typ file as PDF/UA"
"What changed in Typst 0.15?"
```

## Related

- Word files and filling existing PDF forms: Anthropic's `document-skills` (`/plugin marketplace add anthropics/skills`, then `/plugin install document-skills@anthropic-agent-skills`).
- Extracting text from an existing PDF: this marketplace's `documents` plugin.
