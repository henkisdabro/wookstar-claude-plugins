---
name: quarto-revealjs
description: Builds HTML slide decks with Quarto's Reveal.js format - new decks from bundled templates, SCSS themes, speaker notes, columns, fragments, code highlighting, Mermaid diagrams and PDF export. Use when creating a presentation or slide deck, making a meeting deck or technical talk in Quarto, editing a .qmd file with format revealjs, adding speaker notes or incremental reveals, customising a Reveal.js theme, highlighting code lines on slides, or exporting Quarto slides to PDF. Do NOT use for PowerPoint (.pptx) files - use Anthropic's document-skills pptx; do NOT use for Quarto documents, websites or books that are not slides.
---

# Quarto Reveal.js presentations

Quarto renders a `.qmd` file with `format: revealjs` into a self-contained HTML slide deck. This file covers the everyday workflow and syntax; `references/` carries the full option set.

## Creating a new deck

1. **Pick a template.** Ask the user which kind of deck they need, offering:
   - **Meeting deck** (recommended) - light theme, Inter font; agenda, columns, tables, speaker notes, action items. For meetings, updates, proposals.
   - **Technical talk** - dark theme; code blocks with line highlighting, executable Python, live demo slides. Needs Jupyter (see step 4).
   - **Minimal starter** - bare `format: revealjs` to build from scratch.
2. **Copy it into the user's project**, together with its theme so the relative `theme:` path resolves:
   - Meeting deck: `${CLAUDE_SKILL_DIR}/templates/meeting-deck.qmd` + `theme-clean.scss`
   - Technical talk: `${CLAUDE_SKILL_DIR}/templates/technical-talk.qmd` + `theme-clean-dark.scss`
   - Minimal: `${CLAUDE_SKILL_DIR}/templates/minimal.qmd`
3. **Fill it in.** Replace the title, subtitle, author, footer and placeholder content with the user's material. Every placeholder ("Your Name", "Organisation Name", "Topic One", "Person A", example URLs) is gone when this step is done.
4. **Render** with `quarto render deck.qmd` (or `quarto preview deck.qmd` for live reload). Done when the output ends in `Output created: deck.html` with no errors. The technical-talk template executes Python cells, so it needs a Python with `jupyter`, `numpy`, `pandas` and `matplotlib`; with uv: `uv run --with jupyter,numpy,pandas,matplotlib sh -c 'QUARTO_PYTHON=$(which python) quarto render deck.qmd'`. Set `execute: enabled: false` to render without executing.

If `quarto` is missing, point the user to https://quarto.org/docs/get-started/.

## Slide syntax

| Syntax | Creates |
|--------|---------|
| `## Slide Title` | New slide with title |
| `# Section Title` | Section divider slide |
| `---` | Untitled slide |
| `. . .` | Pause (reveal what follows on the next click) |

### Speaker notes - place them first

Put the notes block straight after the slide title, before any visible content, so the notes show as soon as the slide opens rather than after every fragment has played. The templates use this structure:

```markdown
## Slide Title

::: {.notes}
**SAY FIRST:** Opening line to say as the slide appears.

**KEY MESSAGE:** The core point of this slide.

---

**Detail (if needed):**

- Supporting information
- Backup data if asked
:::

Visible slide content here...

. . .

Content that appears after a pause
```

Press `S` during the presentation to open speaker view.

### Columns

```markdown
:::: {.columns}

::: {.column width="58%"}
Left content (chart)
:::

::: {.column width="42%"}
Right content (table)
:::

::::
```

### Incremental lists

```markdown
::: {.incremental}
- First point (appears first)
- Second point (appears next)
:::
```

### Images and backgrounds

```markdown
![Caption](image.png){width="80%"}

## Dark Background {background-color="#1a1a2e"}

## Image Background {background-image="photo.jpg" background-opacity="0.5"}
```

### Code with line highlighting

````markdown
```{.python code-line-numbers="2-3"}
def example():
    highlighted_line_1 = True
    highlighted_line_2 = True
    normal_line = False
```
````

Use `code-line-numbers="1|2-3"` to step through highlights one click at a time.

## Themes

Built-in themes: `default`, `dark`, `simple`, `serif`, `night`, `moon`, `sky`, `beige`, `blood`, `dracula`, `league`, `solarized`.

The bundled themes use Inter for text and JetBrains Mono for code (both loaded from Google Fonts):

| Theme | File | Best for |
|-------|------|----------|
| Clean Light | `theme-clean.scss` | Meetings, proposals, general use |
| Clean Dark | `theme-clean-dark.scss` | Technical talks, code demos |

```yaml
format:
  revealjs:
    theme: theme-clean.scss
```

### Extras in the light theme

`theme-clean.scss` adds styling the dark theme does not carry:

- **Tables** - first column left-aligned in the sans font (labels); every other column right-aligned in monospace with tabular numbers.
- **`.small-table`** - a compact table to sit beside a chart:

  ```markdown
  ::: {.small-table}
  | Metric | Value |
  |--------|------:|
  | Revenue | $120,000 |
  | Orders | 1,500 |
  :::
  ```

- **Mermaid** - enlarged labels (nodes 18px, clusters 20px bold, edges 16px, titles 22px bold). Pair with `mermaid: theme: neutral` under `revealjs:`, as the meeting-deck template does:

  ````markdown
  ```{mermaid}
  %%| fig-width: 14
  flowchart LR
      subgraph GROUP["Group Label"]
          A["Node A"]
          B["Node B"]
      end
      A --> C["Result"]
      style GROUP fill:#dbeafe,stroke:#3b82f6,stroke-width:2px
  ```
  ````

- **`.bar-chart`** - horizontal bars with the value inside the bar, for when Mermaid's xychart cannot label bars. Colours: `.green`, `.blue`, `.amber`, `.red`.

  ```markdown
  ::: {.bar-chart}
  ::: {.bar-row}
  ::: {.bar-label}
  Label Text
  :::
  ::: {.bar-container}
  ::: {.bar-fill .green style="width: 95%"}
  $120K
  :::
  :::
  :::
  :::
  ```

## Slide size and transitions

Both full templates use a 16:9 canvas with fast fades:

```yaml
format:
  revealjs:
    width: 1600
    height: 900
    margin: 0.15
    min-scale: 0.2
    max-scale: 1.5
    transition: fade
    transition-speed: fast
```

## Presenting and PDF export

| Key | Action |
|-----|--------|
| `Space` / `→` | Next slide |
| `←` | Previous slide |
| `S` | Speaker view |
| `O` / `Esc` | Overview |
| `F` | Fullscreen |
| `B` / `.` | Blackout |
| `E` | Print (PDF) view |
| `G` | Jump to slide |
| `M` | Slide menu |
| `?` | All shortcuts |

For PDF: open the rendered deck in Chrome, press `E`, then print (Cmd/Ctrl+P) and save as PDF with margins set to none and background graphics on. `references/presenting.md` covers the `?print-pdf` URL route and the `pdf-*` options (fragments per page, pages per slide).

## Reference files

| File | Open when |
|------|-----------|
| `references/yaml-options.md` | Looking up any `revealjs:` YAML option (navigation, slide numbers, footer, logo, scaling, menu, multiplex) |
| `references/theming.md` | Writing or adjusting an SCSS theme, Sass variables, custom CSS classes |
| `references/advanced-features.md` | Fragments, auto-animate, absolute positioning, stacks, iframes, video and background media |
| `references/code-blocks.md` | Syntax highlighting styles, line highlighting, executable code cells, code output |
| `references/presenting.md` | Speaker view, chalkboard, multiplex audience sync, PDF export, accessibility |
