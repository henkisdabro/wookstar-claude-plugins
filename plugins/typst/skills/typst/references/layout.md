# Typst Layout Reference

Complete guide to page setup, positioning, and layout functions in Typst.

## Page Setup

### Basic Page Configuration

```typst
#set page(
  paper: "a4",                 // Paper size
  margin: 2.5cm,               // All margins
  numbering: "1",              // Page numbering
)
```

### Paper Sizes

Standard sizes: `"a0"` through `"a10"`, `"b0"` through `"b10"`, `"c0"` through `"c10"`, `"us-letter"`, `"us-legal"`, `"us-executive"`.

```typst
// Custom size
#set page(width: 15cm, height: 20cm)

// Landscape (flip dimensions)
#set page(paper: "a4", flipped: true)

// Bleed margins for professional printing (0.15+)
#set page(bleed: 3mm)
```

### Margins

```typst
// Single value for all
#set page(margin: 2cm)

// Individual margins
#set page(margin: (
  top: 3cm,
  bottom: 2.5cm,
  left: 2cm,
  right: 2cm,
))

// Shorthand for symmetric
#set page(margin: (x: 2cm, y: 3cm))

// Book margins (inside/outside for binding)
#set page(margin: (
  inside: 2.5cm,
  outside: 2cm,
  top: 3cm,
  bottom: 2.5cm,
))
```

### Headers and Footers

```typst
// Simple header
#set page(header: [My Document])

// Aligned header
#set page(header: align(right)[Page Header])

// Context-aware header (page number)
#set page(header: context [
  Page #counter(page).display()
])

// Different header after first page
#set page(header: context {
  if counter(page).get().first() > 1 [
    My Document #h(1fr) Page #counter(page).display()
  ]
})

// Footer with page numbers
#set page(footer: context {
  align(center)[#counter(page).display("1")]
})

// Header/footer spacing
#set page(
  header-ascent: 30%,          // Space above header
  footer-descent: 30%,         // Space below footer
)
```

### Page Numbering

```typst
// Arabic numerals
#set page(numbering: "1")

// Roman numerals
#set page(numbering: "i")

// With prefix/suffix
#set page(numbering: "- 1 -")

// Current and total
#set page(numbering: "1 / 1")

// Custom function
#set page(numbering: (..nums) => {
  let page = nums.pos().first()
  if page > 1 { [Page #page] }
})
```

### Page Background and Fill

```typst
// Background colour
#set page(fill: rgb("#f5f5f5"))

// Transparent (for PNG/SVG export)
#set page(fill: none)

// Background image/content
#set page(background: place(
  center + horizon,
  image("watermark.png", width: 50%),
))

// Foreground (over content)
#set page(foreground: place(
  top + right,
  text(red)[DRAFT],
))
```

## Columns

### Page-Level Columns

```typst
#set page(columns: 2)

// With gutter (space between)
#set page(columns: 2)
#set columns(gutter: 1cm)

// Column break
Content in first column.
#colbreak()
Content in second column.
```

### Column Function

```typst
// Columns within content
#columns(2)[
  First column content.
  #colbreak()
  Second column content.
]

// With gutter
#columns(3, gutter: 1.5em)[
  Three column layout with custom gutter.
]
```

### Spanning Columns

```typst
#set page(columns: 2)

// Full-width element
#place(
  top + center,
  float: true,
  scope: "parent",     // Escape column layout
)[
  #align(center, text(17pt)[*Title*])
]

= Section
Content flows in columns...
```

## Alignment

### Basic Alignment

```typst
#align(left)[Left aligned]
#align(center)[Centered]
#align(right)[Right aligned]
#align(top)[Top aligned]
#align(bottom)[Bottom aligned]
#align(horizon)[Vertically centered]
```

### Combined Alignment

```typst
#align(center + horizon)[Centered both ways]
#align(right + top)[Top right]
#align(left + bottom)[Bottom left]
```

### Block Alignment

```typst
// Set default alignment
#set align(center)

Content is now centered by default.

// Temporarily override
#align(left)[This is left-aligned.]
```

## Spacing

### Vertical Space

```typst
#v(1cm)                        // Fixed vertical space
#v(1em)                        // Font-relative space
#v(1fr)                        // Fractional (fills available)

// Weak spacing (collapses with other space)
#v(1em, weak: true)
#v(1fr, weak: true)            // Weak + fractional together (0.15+)
```

### Horizontal Space

```typst
#h(1cm)                        // Fixed horizontal space
#h(1fr)                        // Fill remaining space

// Common pattern: push to edges
#h(1fr) Centered #h(1fr)
Left #h(1fr) Right
```

### Paragraph Spacing

```typst
#set par(
  spacing: 1.2em,              // Between paragraphs
  leading: 0.65em,             // Between lines
  first-line-indent: 1em,      // First line indent
)
```

## Boxes and Blocks

### Box (Inline Container)

```typst
#box[Inline content]

// With dimensions
#box(width: 5cm, height: 2cm)[Content]

// Filled box
#box(
  fill: blue.lighten(80%),
  inset: 5pt,
  radius: 3pt,
)[Styled box]

// Baseline alignment
#box(baseline: 50%)[Raised text]

// 0.15+: a box with an inset aligns its first line's baseline with the
// surrounding text automatically - manual baseline nudges from older
// versions may need removing
#box(inset: 0.3em, stroke: 1pt)[aligned]
```

### Block (Block-Level Container)

```typst
#block[Block content]

// With spacing
#block(above: 1em, below: 1em)[Spaced block]

// Styled block
#block(
  fill: gray.lighten(80%),
  inset: 10pt,
  radius: 4pt,
  stroke: 1pt,
)[Styled block]

// Breakable setting (for page breaks)
#block(breakable: false)[Keep together]
```

### Rect (Visible Box)

```typst
#rect[Simple rectangle]

// Styled rectangle
#rect(
  width: 100%,
  height: 3cm,
  fill: blue.lighten(90%),
  stroke: 2pt + blue,
  radius: 10pt,
  inset: 15pt,
)[Content inside]
```

## Grid Layout

### Basic Grid

```typst
#grid(
  columns: (1fr, 1fr),         // Two equal columns
  [Cell 1], [Cell 2],
  [Cell 3], [Cell 4],
)
```

### Column Sizing

```typst
// Fixed widths
#grid(columns: (3cm, 5cm), ...)

// Auto-sized
#grid(columns: (auto, auto), ...)

// Fractional (proportional)
#grid(columns: (1fr, 2fr), ...)  // 1/3 and 2/3

// Mixed
#grid(columns: (auto, 1fr, 2cm), ...)

// Shorthand for N equal columns
#grid(columns: 3, ...)         // Three auto columns
```

### Row Configuration

```typst
#grid(
  columns: 2,
  rows: (auto, 1fr, 2cm),      // Row heights
  row-gutter: 10pt,            // Space between rows
  column-gutter: 10pt,         // Space between columns
  gutter: 10pt,                // Both at once
  ...
)
```

### Grid Styling

```typst
#grid(
  columns: 2,
  inset: 10pt,                 // Cell padding
  align: center,               // Cell alignment
  fill: (x, y) => if calc.odd(y) { gray.lighten(80%) },
  stroke: 1pt,
  [A], [B],
  [C], [D],
)
```

### Grid Cell Spanning

```typst
#grid(
  columns: 3,
  [A], [B], [C],
  grid.cell(colspan: 2)[Spans 2 columns], [D],
  grid.cell(rowspan: 2)[Spans 2 rows], [E], [F],
  [G], [H],
)
```

## Stack Layout

### Vertical Stack

```typst
#stack(
  dir: ttb,                    // Top to bottom (default)
  spacing: 1em,
  [First],
  [Second],
  [Third],
)
```

### Horizontal Stack

```typst
#stack(
  dir: ltr,                    // Left to right
  spacing: 1em,
  [One], [Two], [Three],
)
```

## Place (Absolute Positioning)

### Basic Placement

```typst
#place(top + right)[Top right corner]
#place(center + horizon)[Centered on page]
#place(bottom + left)[Bottom left]
```

### Float Placement

```typst
// Float to top/bottom, reserving space
#place(
  top,
  float: true,
)[Floats to top, content flows around]

// Scope: column vs page
#set page(columns: 2)
#place(
  top,
  float: true,
  scope: "parent",             // Span all columns
)[Full-width floated content]
```

### Positioned Elements

```typst
// Offset from anchor
#place(
  dx: 1cm,
  dy: -0.5cm,
)[Offset content]

// Clearance (space from other content)
#place(
  top,
  float: true,
  clearance: 1em,
)[With clearance below]
```

## Page Breaks

```typst
#pagebreak()                   // Force page break

// Weak break (only if not at page start)
#pagebreak(weak: true)

// Go to even/odd page
#pagebreak(to: "even")
#pagebreak(to: "odd")
```

## One-Off Page Changes

```typst
// Single landscape page
#page(flipped: true)[
  Wide content here...
]

// Single page with different margins
#page(margin: 1cm)[
  Tight margins for this page only.
]
```

## Rotate and Scale

```typst
// Rotate content
#rotate(45deg)[Rotated 45 degrees]

// Rotate with reflow (affects layout)
#rotate(90deg, reflow: true)[
  This content is sideways and the layout adjusts.
]

// Scale content
#scale(x: 150%, y: 150%)[Enlarged]
#scale(50%)[Shrunk to half]
```

## Measure Content

```typst
// Get dimensions of content
#context {
  let size = measure[Hello World]
  [Width: #size.width, Height: #size.height]
}
```

## Common Layout Patterns

### Title Page

```typst
#page(numbering: none, margin: 2cm)[
  #v(1fr)
  #align(center)[
    #text(24pt, weight: "bold")[Document Title]
    #v(1em)
    #text(14pt)[Author Name]
    #v(1em)
    #datetime.today().display()
  ]
  #v(1fr)
]
```

### Two-Column with Full-Width Header

```typst
#set page(columns: 2)

#place(
  top + center,
  float: true,
  scope: "parent",
  clearance: 2em,
)[
  #align(center)[
    #text(20pt, weight: "bold")[Article Title]
    #v(0.5em)
    Author Name
  ]
]

= Introduction
Content in two columns...
```

### Sidebar Layout

```typst
#grid(
  columns: (1fr, 3fr),
  gutter: 1em,
  [
    #set text(size: 9pt)
    *Sidebar* \
    Navigation \
    Links
  ],
  [
    = Main Content
    Article text here...
  ],
)
```
