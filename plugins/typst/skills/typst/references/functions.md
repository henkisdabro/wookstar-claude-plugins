# Typst Functions Reference

Quick reference for commonly used Typst functions organised by category.

## Text Functions

### text

Configure text appearance.

```typst
#text(
  font: "Arial",              // Font family
  size: 12pt,                 // Size
  weight: "bold",             // regular, bold, 100-900
  style: "italic",            // normal, italic, oblique
  fill: blue,                 // Colour
  tracking: 0.5pt,            // Letter spacing
  spacing: 100%,              // Word spacing
  baseline: 0pt,              // Baseline shift
  lang: "en",                 // Language
  region: "GB",               // Region variant
  variations: (SOFT: 0),      // Custom variable-font axes (0.15+)
)[Content]
```

### emph / strong

```typst
#emph[Emphasised text]        // Italic
#strong[Strong text]          // Bold

// Shorthand
_emphasis_ / *strong*
```

### smallcaps / upper / lower

```typst
#smallcaps[Small Capitals]
#upper[uppercase]
#lower[LOWERCASE]
```

### raw

Display code.

```typst
#raw("print('hello')")
#raw("fn main() {}", lang: "rust")
#raw(block: true, "multi\nline")
```

### link

```typst
#link("https://typst.app")[Typst]
#link("mailto:info@example.com")[Email]
#link(<label>)[Internal link]
```

## Layout Functions

### page

```typst
#set page(
  paper: "a4",
  width: 21cm,
  height: 29.7cm,
  margin: 2.5cm,
  columns: 1,
  numbering: "1",
  header: [...],
  footer: [...],
  fill: white,
  background: [...],
)
```

### par

```typst
#set par(
  justify: true,
  first-line-indent: 1em,
  leading: 0.65em,            // Line spacing
  spacing: 1.2em,             // Paragraph spacing
  hanging-indent: 0pt,
)
```

### align

```typst
#align(left)[...]
#align(center)[...]
#align(right)[...]
#align(center + horizon)[...]  // 2D alignment
```

### box / block

```typst
// Inline container
#box(
  width: auto,
  height: auto,
  baseline: 0%,
  fill: none,
  stroke: none,
  radius: 0pt,
  inset: 0pt,
  outset: 0pt,
  clip: false,
)[Content]

// Block container
#block(
  width: 100%,
  height: auto,
  above: 1.2em,
  below: 1.2em,
  breakable: true,
  fill: none,
  stroke: none,
  radius: 0pt,
  inset: 0pt,
)[Content]
```

### grid

```typst
#grid(
  columns: (1fr, 2fr),
  rows: auto,
  gutter: 10pt,
  column-gutter: 10pt,
  row-gutter: 10pt,
  align: center,
  inset: 5pt,
  fill: none,
  stroke: none,
  [Cell 1], [Cell 2],
)
```

### stack

```typst
#stack(
  dir: ttb,                   // ttb, btt, ltr, rtl
  spacing: 1em,
  [Item 1], [Item 2],
)
```

### columns

```typst
#columns(2, gutter: 1em)[
  Content in columns...
]
```

### place

```typst
#place(
  top + right,                // Alignment
  dx: 0pt,                    // X offset
  dy: 0pt,                    // Y offset
  float: false,               // Float to top/bottom
  scope: "column",            // column or parent
  clearance: 0pt,             // Space around
)[Content]
```

### v / h

```typst
#v(1em)                       // Vertical space
#v(1fr)                       // Fill vertical
#v(1em, weak: true)           // Weak space

#h(1em)                       // Horizontal space
#h(1fr)                       // Fill horizontal
```

## Document Structure

### heading

```typst
#heading(
  level: 1,
  numbering: "1.1",
  supplement: [Section],
  outlined: true,
  bookmarked: true,
)[Title]

// Shorthand
= Level 1
== Level 2
```

### list / enum / terms

```typst
// Bullet list
#list(
  marker: [•],
  marker-align: end,          // Marker alignment (0.15+); default end + baseline
  indent: 0pt,
  body-indent: 0.5em,
  spacing: auto,
  tight: true,
)[Item 1][Item 2]

// Numbered list
#enum(
  numbering: "1.",
  start: 1,
  full: false,
)[Item 1][Item 2]

// Definition list
#terms(
  separator: [: ],
  hanging-indent: 1em,
  tight: true,
)([Term], [Definition])
```

### table

```typst
#table(
  columns: 3,
  rows: auto,
  gutter: 0pt,
  column-gutter: 0pt,
  row-gutter: 0pt,
  align: auto,
  inset: 5pt,
  fill: none,
  stroke: 1pt,
  [A], [B], [C],
)
```

### figure

```typst
#figure(
  content,
  caption: [Caption text],
  supplement: [Figure],
  numbering: "1",
  placement: auto,            // auto, top, bottom
  gap: 0.65em,
  alt: "Alt text for images",
) <label>
```

### outline

```typst
#outline(
  title: [Contents],
  target: heading,
  depth: none,                // Max depth
  indent: auto,
  fill: repeat[.],
)
```

### bibliography

```typst
#bibliography(
  "refs.bib",
  title: [References],
  style: "ieee",              // or "apa", "chicago-author-date", etc.
  full: false,
)

// 0.15+: a document may contain several bibliographies.
// target: selector controlling which citations this bibliography collects
// group: string key sharing/resetting numbering across bibliographies
```

### cite

```typst
#cite(<key>)
#cite(<key>, form: "prose")   // "Author (2023)"
#cite(<key>, form: "year")    // "(2023)"
```

## Images and Shapes

### image

```typst
#image(
  "path.png",
  width: auto,
  height: auto,
  fit: "contain",             // contain, cover, stretch
  alt: "Description",
)
```

### rect / circle / ellipse / polygon

```typst
#rect(
  width: 100%,
  height: 1cm,
  fill: blue,
  stroke: 1pt + black,
  radius: 5pt,
  inset: 10pt,
)[Content]

#circle(
  radius: 1cm,
  fill: red,
)

#ellipse(
  width: 2cm,
  height: 1cm,
  fill: green,
)

#polygon(
  fill: yellow,
  (0pt, 0pt),
  (1cm, 0pt),
  (0.5cm, 1cm),
)
```

### line

```typst
#line(
  start: (0pt, 0pt),
  end: (100%, 0pt),
  length: 100%,               // Alternative to end
  angle: 0deg,
  stroke: 1pt + black,
)
```

### curve

Free-form paths (replaces the `path` element, removed in 0.15 - `path("...")` is now the file-path type):

```typst
#curve(
  fill: blue,
  stroke: 1pt,
  curve.move((0pt, 0pt)),
  curve.line((1cm, 0pt)),
  curve.line((1cm, 1cm)),
  curve.cubic((1.5cm, 0.5cm), (0.5cm, 0.5cm), (0pt, 1cm)),
  curve.close(),
)
```

## Math

### equation

```typst
#math.equation(
  block: true,
  numbering: "(1)",
  supplement: [Equation],
  alt: "Description",
)[$E = m c^2$]
```

### Common Math Functions

```typst
$frac(a, b)$                  // Fraction
$sqrt(x)$, $root(n, x)$       // Roots
$vec(a, b)$                   // Vector
$mat(a, b; c, d)$             // Matrix
$cases(x &= 1, y &= 2)$       // Cases
$abs(x)$, $norm(x)$           // Delimiters
$floor(x)$, $ceil(x)$         // Rounding
$binom(n, k)$                 // Binomial
$cancel(x)$                   // Cancel
```

## Introspection

### counter

```typst
#counter(heading).display()
#counter(heading).get()
#counter(page).display("1 / 1", both: true)

// Custom counter
#let mycounter = counter("my")
#mycounter.step()
#mycounter.update(5)
#context mycounter.get()
```

### state

```typst
#let mystate = state("key", initial)
#mystate.update(value)
#mystate.update(x => x + 1)
#context mystate.get()
```

### query

```typst
#context {
  let headings = query(heading)
  for h in headings [
    - #h.body
  ]
}

// Filtered query
#context query(heading.where(level: 1))

// Position-relative
#context query(selector(heading).before(here()))
```

### locate / here

```typst
#context here().page()
#context here().position()
```

### measure

```typst
#context {
  let size = measure[Hello]
  [Width: #size.width]
}
```

## Utility Functions

### datetime

```typst
#datetime.today()
#datetime.today().display()
#datetime.today().display("[month repr:long] [day], [year]")
#datetime(year: 2024, month: 1, day: 15)
```

### range

```typst
#range(5)                     // (0, 1, 2, 3, 4)
#range(1, 6)                  // (1, 2, 3, 4, 5)
#range(0, 10, step: 2)        // (0, 2, 4, 6, 8)
#range(1, 5, inclusive: true) // (1, 2, 3, 4, 5) - 0.15+
```

### calc Module

```typst
#calc.abs(-5)                 // 5
#calc.min(1, 2, 3)            // 1
#calc.max(1, 2, 3)            // 3
#calc.pow(2, 8)               // 256
#calc.sqrt(16)                // 4
#calc.round(3.7)              // 4
#calc.floor(3.7)              // 3
#calc.ceil(3.2)               // 4
#calc.rem(17, 5)              // 2 (remainder)
#calc.sin(calc.pi / 2)        // 1
#calc.cos(0)                  // 1
```

### str Functions

```typst
#str(42)                      // "42"
#repr(content)                // Debug representation
#type(value)                  // Type name
```

### Data Loading

```typst
#json("data.json")
#yaml("data.yaml")
#toml("config.toml")
#csv("data.csv")
#xml("data.xml")
#read("file.txt")             // Raw text
```

### lorem

```typst
#lorem(50)                    // 50 words of placeholder text
```
