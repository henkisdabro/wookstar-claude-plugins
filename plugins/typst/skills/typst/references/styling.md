# Typst Styling Reference

Complete guide to Typst's styling system: set rules, show rules, and the context system.

## Set Rules

Set rules configure default properties for elements. They apply from their position to the end of the containing scope.

### Basic Syntax

```typst
#set element(parameter: value)
```

### Common Set Rules

```typst
// Text styling
#set text(
  font: "Libertinus Serif",
  size: 11pt,
  lang: "en",
  fill: black,
  weight: "regular",    // regular, bold, 100-900
  style: "normal",      // normal, italic, oblique
)

// Page setup
#set page(
  paper: "a4",          // or "us-letter", custom size
  margin: 2.5cm,        // or (top: .., bottom: .., left: .., right: ..)
  columns: 1,
  numbering: "1",       // Page numbering pattern
  header: [...],
  footer: [...],
)

// Paragraph styling
#set par(
  justify: true,
  leading: 0.65em,      // Line spacing
  first-line-indent: 1em,
  spacing: 1.2em,       // Between paragraphs
)

// Headings
#set heading(
  numbering: "1.1",     // Numbering pattern
  supplement: [Section],
)

// Lists
#set list(
  marker: [--],         // Bullet marker
  indent: 1em,
  body-indent: 0.5em,
)

#set enum(
  numbering: "1.a.",    // Nested numbering pattern
  indent: 1em,
)

// Figures
#set figure(
  placement: auto,      // auto, top, bottom
  supplement: [Figure],
)

// Tables
#set table(
  columns: 3,
  stroke: 0.5pt,
  inset: 5pt,
  fill: none,
)

// Raw code blocks
#set raw(
  theme: "themes/one-dark.tmTheme",
)

// Document metadata
#set document(
  title: [Document Title],
  author: "Author Name",
  keywords: ("typst", "document"),
)
```

### Conditional Set Rules

```typst
// Set-if: apply conditionally
#let dark-mode = true
#set text(fill: white) if dark-mode
#set page(fill: black) if dark-mode
```

### Scoped Set Rules

Set rules only apply within their containing block:

```typst
This is normal text.

#[
  #set text(fill: red)
  This is red.
]

This is normal again.
```

## Show Rules

Show rules transform how elements are displayed.

### Show-Set Rules

Apply set rules only to specific elements:

```typst
// Make all headings blue
#show heading: set text(fill: blue)

// Center all headings
#show heading: set align(center)

// Turn justification off inside quotes only
// (justify is a par property - text() has no justify parameter)
#show quote: set par(justify: false)
```

### Transformational Show Rules

Completely redefine element appearance:

```typst
// Basic transformation
#show heading: it => {
  text(blue, it.body)
}

// Access element fields
#show heading: it => {
  let num = counter(heading).display()
  block[#num #it.body]
}

// Chain multiple transformations
#show heading: it => {
  set text(navy)
  block[
    #smallcaps(it.body)
    #v(0.5em)
  ]
}
```

### Element Fields

When transforming elements, access their fields:

```typst
// Heading fields
#show heading: it => [
  Level: #it.level \
  Body: #it.body \
  Numbering: #it.numbering
]

// Figure fields
#show figure: it => [
  Body: #it.body \
  Caption: #it.caption \
  Kind: #it.kind
]

// Table cell fields
#show table.cell: it => [
  Content: #it.body \
  Position: (#it.x, #it.y)
]
```

### Selectors

#### Element Selectors

```typst
#show heading: ...          // All headings
#show figure: ...           // All figures
#show table: ...            // All tables
#show raw: ...              // All raw/code blocks
#show list: ...             // All bullet lists
#show enum: ...             // All numbered lists
```

#### Filtered Selectors

```typst
// By property value
#show heading.where(level: 1): ...
#show heading.where(level: 2): ...
#show table.cell.where(x: 0): ...     // First column
#show table.cell.where(y: 0): ...     // Header row

// Combined conditions
#show heading.where(level: 1, numbering: none): ...
```

#### Text Selectors

```typst
// Literal text
#show "TODO": text(red, it)
#show "LaTeX": [Typst]

// Regular expressions
#show regex("\d+"): it => text(blue, it)
#show regex("[A-Z]{2,}"): smallcaps
```

#### Label Selectors

```typst
#show <important>: set text(red)

This is normal. This is #[important]<important>.
```

#### Within Selector (0.15+)

Match elements only when nested inside a matching ancestor - for `query()` and introspection, not show rules ("this selector cannot currently be used with show"):

```typst
// All strong elements that sit inside headings
#context query(selector(strong).within(heading))

// Scope to a figure kind
#context query(selector(figure.caption).within(figure.where(kind: table)))
```

#### Everything Selector

```typst
// Transform entire document
#show: it => {
  set text(font: "Arial")
  columns(2, it)
}

// Template pattern
#show: my-template
```

### Show Rule Order

Later rules override earlier ones for the same selector:

```typst
#show heading: set text(blue)    // Applied first
#show heading: set text(size: 14pt)  // Applied second
// Headings are blue AND 14pt
```

For transformational rules, order matters more:

```typst
#show heading: smallcaps
#show heading: set text(blue)
// smallcaps applied, but NOT blue (transformation took over)

// To combine: nest them
#show heading: it => {
  set text(blue)
  smallcaps(it)
}
```

## Context System

Access location-dependent values with `context`.

### Style Context

Access current set rule values:

```typst
#set text(size: 14pt)
#context text.size           // 14pt

#set page(paper: "a4")
#context page.width          // 595.28pt
```

### Location Context

Access position in document:

```typst
// Current page
#context here().page()
#context here().position()

// Counter values
#context counter(heading).get()
#context counter(page).get()

// Query elements
#context query(heading).map(h => h.body)
```

### Counter and State

```typst
// Heading counter
#context counter(heading).display()
#context counter(heading).get()

// Counter value at another location (0.15+)
#context counter(heading).display(at: <intro>)

// Page counter
#context counter(page).display("1 / 1", both: true)

// Custom counter
#let mycounter = counter("my-counter")
#mycounter.step()
#context mycounter.get()

// State
#let mystate = state("my-state", 0)
#mystate.update(x => x + 1)
#context mystate.get()
```

### Context in Functions

```typst
#let current-chapter() = context {
  let headings = query(selector(heading).before(here()))
  if headings.len() > 0 {
    headings.last().body
  } else {
    [No chapter]
  }
}

In page header: #current-chapter()
```

### Context Nesting

Inner context sees changes from outer scope:

```typst
#set text(lang: "de")
#context [
  #set text(lang: "fr")
  Outer: #text.lang \          // de (outer context)
  #context text.lang           // fr (inner context)
]
```

## Common Styling Patterns

### Academic Paper

```typst
#set document(title: [Paper Title])
#set page(paper: "us-letter", margin: 1in, numbering: "1")
#set text(font: "Times New Roman", size: 12pt)
#set par(justify: true, first-line-indent: 0.5in)
#set heading(numbering: "1.1")

#show heading.where(level: 1): it => {
  pagebreak(weak: true)
  set text(size: 14pt)
  v(1em)
  it
  v(0.5em)
}
```

### Report with Header

```typst
#set page(
  header: context {
    if counter(page).get().first() > 1 [
      #h(1fr)
      _My Report_
      #h(1fr)
      #counter(page).display()
    ]
  },
  header-ascent: 30%,
)
```

### Custom Heading Numbering

```typst
#set heading(numbering: (..nums) => {
  let level = nums.pos().len()
  if level == 1 {
    numbering("I.", ..nums)
  } else {
    numbering("1.1", ..nums)
  }
})
```

### Alternating Page Margins

```typst
#set page(margin: (
  inside: 2.5cm,
  outside: 2cm,
  top: 2.5cm,
  bottom: 2cm,
))
```

### Custom Figure Captions

```typst
#show figure.caption: it => {
  set text(size: 10pt, style: "italic")
  [#it.supplement #context it.counter.display(): ]
  it.body
}
```
