---
name: typst
description: Typst language reference - markup, math and code modes, set/show rules, layout, tables, templates, and PDF/HTML/PNG/SVG export, current to the latest stable release. Use when writing or editing a .typ file, fixing a Typst compile error, building a Typst table, figure or equation, writing a Typst template, exporting Typst to PDF/A, PDF/UA or HTML, migrating a document to a newer Typst release, or asking what changed in Typst. Do NOT use for Word (.docx) files or filling existing PDF forms - use Anthropic's document-skills (docx, pdf); do NOT use for extracting text from an existing PDF - use the documents plugin's pdf-extract.
---

# Typst

Typst is a markup-based typesetting system with three modes (markup, math, code), a styling system of set and show rules, and a CLI that compiles `.typ` sources to PDF, PNG, SVG and (experimentally) HTML. This file carries the everyday syntax; the `references/` files carry depth.

## Working on a document

1. **Check the installed version** with `typst --version`. If it is older than 0.15, the removals table below does not apply yet - write for the installed version. If `typst` is missing, point the user to https://github.com/typst/typst#installation.
2. **Write or edit** using the quick reference below, opening a reference file when the task needs depth (see "Reference files").
3. **Compile** with `typst compile doc.typ` (or `typst watch doc.typ` while iterating). Done when it compiles with no errors and no deprecation warnings - those become errors in the next release. (HTML export always warns that it is experimental; that one is expected.) PDF/UA and PDF/A-a standards also fail on any image, figure or equation without `alt:` text.
4. **Fix errors** with the troubleshooting table. A message naming an unknown function, type or symbol is usually an API that 0.15 removed - check "Version currency" first.

## Quick reference

### Three modes

| Mode | Entry | Example |
|------|-------|---------|
| **Markup** | Default | `= Heading`, `*bold*`, `_italic_` |
| **Math** | `$...$` | `$sum_(i=0)^n x_i$` (block: `$ ... $` with spaces) |
| **Code** | `#` prefix | `#set text(font: "Arial")` |

### Markup

```typst
= Heading 1           // Heading (== for level 2, etc.)
*strong*              // Bold
_emphasis_            // Italic
`code`                // Raw/code
- item                // Bullet list
+ item                // Numbered list
/ Term: description   // Term list
@label                // Reference
<label>               // Label
https://...           // Auto-link
\                     // Line break
```

### Set rules (configure defaults)

```typst
#set page(paper: "a4", margin: 2cm)
#set text(font: "New Computer Modern", size: 11pt)
#set par(justify: true, leading: 0.65em)
#set heading(numbering: "1.1")
```

### Show rules (transform appearance)

```typst
// Show-set: apply a set rule to specific elements
#show heading: set text(navy)

// Transform: redefine appearance completely
#show heading: it => block[
  #counter(heading).display()
  #it.body
]

// Filter by properties
#show heading.where(level: 1): set align(center)

// Text replacement
#show "LaTeX": [Typst]
```

Rules apply from their position to the end of the enclosing scope (file or block).

### Common functions

```typst
#image("file.png", width: 50%)
#figure(content, caption: [Caption]) <label>
#table(columns: 3, [A], [B], [C], ...)
#grid(columns: (1fr, 2fr), [...], [...])
#align(center)[Content]
#box[inline] / #block[block-level]
#v(1em) / #h(1fr)              // Vertical/horizontal space
#divider()                     // Thematic break (0.15+)
#pagebreak()
#colbreak()
```

### Math

```typst
$x^2$                          // Inline
$ x^2 $                        // Block (spaces required)
$x_i$, $x^n$                   // Sub/superscript
$frac(a, b)$                   // Fraction (also a/b)
$sqrt(x)$, $root(3, x)$        // Roots
$vec(a, b, c)$                 // Vector
$mat(1, 2; 3, 4)$              // Matrix
$sum_(i=0)^n$, $integral_a^b$  // Big operators
$alpha$, $beta$, $RR$          // Greek/symbols
```

## Version currency

Current stable is 0.15 (0.15.1, July 2026). Pretraining knowledge of Typst may predate it - these APIs are gone and now hard-error:

| Removed | Use instead |
|---------|-------------|
| `path` element (shapes) | `curve` (`path("...")` is now the file-path type) |
| `pattern` type | `tiling` |
| `pdf.embed` | `pdf.attach` |
| `json.decode`, `csv.decode`, etc. | pass bytes to the top-level function: `json(bytes)` |
| `sect`, `sect.big` symbols | `inter`, `inter.big` |
| `plus.circle`, `times.circle` symbols | `plus.o`, `times.o` |
| Backslashes in file paths | forward slashes only, on all platforms |

Full 0.15 delta (new features, deprecations, migration steps): `references/whats-new.md`.

## Core concepts

**Content and functions.** Everything produces content. Call functions with `#function()` in markup and without `#` inside code. `[...]` holds markup; `{...}` holds code.

```typst
This is #text(red)[red] text.

#{
  let x = text(red)[red]
  [This is ] + x + [ text.]
}
```

**Context.** Location-dependent values need `context`:

```typst
#context counter(heading).get()      // Current heading number
#context here().page()               // Current page number
#context text.lang                   // Current language setting
```

**Templates** are functions that wrap the document body:

```typst
// template.typ
#let article(title: [], body) = {
  set page(paper: "a4")
  set text(11pt)
  align(center, text(17pt, strong(title)))
  body
}

// document.typ
#import "template.typ": article
#show: article.with(title: [My Article])
```

## Common patterns

### Academic paper

```typst
#set document(title: [Paper Title], author: "Author Name")
#set page(paper: "us-letter", margin: 1in, numbering: "1")
#set text(font: "New Computer Modern", size: 12pt)
#set par(justify: true, first-line-indent: 1em)
#set heading(numbering: "1.1")
#show heading.where(level: 1): set text(size: 14pt)

#align(center)[
  #text(17pt, strong[Paper Title])
  #v(1em)
  Author Name \
  Institution
]

= Introduction
#lorem(100)
```

### Two-column layout with full-width title

```typst
#set page(columns: 2)

#place(top + center, float: true, scope: "parent")[
  #align(center, text(17pt, strong[Title]))
]

= Section
Content flows in columns...
```

### Custom heading style

```typst
#show heading.where(level: 1): it => {
  set text(size: 14pt, weight: "bold")
  v(1em)
  block[
    #counter(heading).display("I.")
    #h(0.5em)
    #smallcaps(it.body)
  ]
  v(0.5em)
}
```

### Figure with caption and cross-reference

```typst
#figure(
  image("diagram.svg", width: 80%),
  caption: [System architecture overview],
) <fig:arch>

As shown in @fig:arch, the system...
```

Prefer semantic elements (`= Heading`, `figure`, `table`) over hand-sized `text` calls - tagged PDF, HTML export and show rules all key off the element.

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| "unknown variable" | Typo or scope issue | Check spelling; set/show rules and `let` bindings only apply forward and within their block |
| "unknown variable: sect" (or other symbol) | Symbol removed or renamed in 0.15 | Check "Version currency" and `references/whats-new.md` |
| "expected content" | Code where markup expected | Wrap in a `[...]` content block |
| "expected expression" | Markup where code expected | Add the `#` prefix or use a code block |
| "cannot access" | Context required | Wrap in a `context` expression |
| "layout did not converge" | Self-referential context/state/counter | Read the diagnostics - they list which elements changed per iteration |

To inspect a value, render `#repr(value)`; to isolate a failure, cut the document down until the error disappears.

## Export at a glance

- **PDF** (default): metadata via `#set document(...)`; tagged for accessibility automatically; PDF/A and PDF/UA via `--pdf-standard` (comma-separate to target several, e.g. `a-2a,ua-1`); output minified unless `--pretty`.
- **HTML** (experimental): `--features html --format html`; `target()` works without the flag; equations become MathML.
- **PNG/SVG**: `--ppi` sets PNG resolution; one file per page; no text accessibility.
- **Bundle** (experimental): `--features bundle` emits several output files from one project.

## Reference files

Open the file that matches the task; each is self-contained.

| File | Open when |
|------|-----------|
| `references/syntax.md` | Markup escapes, code-mode syntax, types, operators, loops, closures |
| `references/styling.md` | Writing non-trivial set/show rules, selectors (`where`, `within`), templates |
| `references/math.md` | Equations beyond the quick reference: alignment, symbols, `lr`, numbering |
| `references/layout.md` | Page setup, margins, headers/footers, grids, columns, placement, spacing |
| `references/tables.md` | Tables with spans, strokes, fills, headers repeating across pages, data-driven rows |
| `references/functions.md` | Looking up parameters of text, list, bibliography, shapes (`curve`), data loading |
| `references/export.md` | CLI flags, HTML/SVG/PNG specifics, bundle export, fonts, `typst eval` |
| `references/accessibility.md` | PDF/UA, alt text, tagged PDF, accessible tables and maths |
| `references/whats-new.md` | Migrating an older document, or the user asks what changed in 0.15 |
