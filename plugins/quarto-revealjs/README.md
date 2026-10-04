# Quarto Reveal.js

Build HTML slide decks with [Quarto](https://quarto.org)'s [Reveal.js](https://revealjs.com) format. The skill starts a deck from a bundled template, fills it with your content, renders it, and knows the syntax for speaker notes, columns, fragments, code highlighting, backgrounds, themes and PDF export.

## What's included

- **quarto-revealjs** skill with:
  - Templates: `meeting-deck.qmd` (light), `technical-talk.qmd` (dark, executable Python), `minimal.qmd`
  - Themes: `theme-clean.scss` and `theme-clean-dark.scss` (Inter and JetBrains Mono); the light theme adds right-aligned monospace number columns, `.small-table`, enlarged Mermaid labels and a labelled `.bar-chart`
  - References loaded on demand: YAML options, theming, advanced features (fragments, auto-animate, positioning), code blocks, presenting (speaker view, chalkboard, multiplex, PDF)

## Prerequisites

- [Quarto CLI](https://quarto.org/docs/get-started/) - it bundles Reveal.js, so nothing else is needed for the meeting and minimal templates.
- For the technical-talk template, which executes Python cells: a Python with `jupyter`, `numpy`, `pandas` and `matplotlib` (for example via `uv run --with ...`, as the skill shows).

## Installation

```bash
/plugin install quarto-revealjs@wookstar-claude-plugins
```

## Usage

```text
"Create a meeting deck for the quarterly update"
"Build a technical talk in Quarto about our API design"
"Add speaker notes to these slides"
"Make the code on slide 4 highlight lines 2-3, then 5"
"Customise the Reveal.js theme with our brand colours"
"Export this Quarto deck to PDF"
```

## Related

For PowerPoint (.pptx) files, use Anthropic's `document-skills` (`/plugin marketplace add anthropics/skills`, then `/plugin install document-skills@anthropic-agent-skills`).
