# Typst Tables Reference

Complete guide to creating and styling tables in Typst.

## Basic Tables

### Simple Table

```typst
#table(
  columns: 3,
  [Name], [Age], [City],
  [Alice], [30], [London],
  [Bob], [25], [Paris],
)
```

### Column Specification

```typst
// Auto-sized columns
#table(columns: 3, ...)

// Fixed widths
#table(columns: (3cm, 5cm, 4cm), ...)

// Fractional (proportional)
#table(columns: (1fr, 2fr, 1fr), ...)

// Auto-fit to content
#table(columns: (auto, auto, auto), ...)

// Mixed
#table(columns: (auto, 1fr, 3cm), ...)
```

### Row Configuration

```typst
#table(
  columns: 2,
  rows: (auto, 1fr, 2cm),     // Specific row heights
  ...
)
```

## Table Styling

### Cell Padding (Inset)

```typst
#table(
  columns: 3,
  inset: 10pt,                 // All sides
  ...
)

// Different horizontal/vertical
#table(
  columns: 3,
  inset: (x: 8pt, y: 4pt),
  ...
)

// Per-side
#table(
  columns: 3,
  inset: (left: 10pt, right: 10pt, top: 5pt, bottom: 5pt),
  ...
)
```

### Strokes (Borders)

```typst
// Simple stroke
#table(
  columns: 3,
  stroke: 1pt,
  ...
)

// Colored stroke
#table(
  columns: 3,
  stroke: 1pt + gray,
  ...
)

// No stroke
#table(
  columns: 3,
  stroke: none,
  ...
)

// Complex stroke function
#table(
  columns: 3,
  stroke: (x, y) => {
    if y == 0 { (bottom: 2pt) }        // Header bottom
    else if y > 0 { (bottom: 0.5pt) }  // Row separators
  },
  ...
)
```

### Cell Fill (Background)

```typst
// All cells
#table(
  columns: 3,
  fill: blue.lighten(90%),
  ...
)

// Alternating rows
#table(
  columns: 3,
  fill: (x, y) => if calc.odd(y) { gray.lighten(90%) },
  ...
)

// Header row different
#table(
  columns: 3,
  fill: (x, y) => if y == 0 { blue.lighten(80%) },
  ...
)

// Checkerboard
#table(
  columns: 3,
  fill: (x, y) => if calc.odd(x + y) { gray.lighten(80%) },
  ...
)
```

### Alignment

```typst
// All cells
#table(
  columns: 3,
  align: center,
  ...
)

// Per-column
#table(
  columns: 3,
  align: (left, center, right),
  ...
)

// Function-based
#table(
  columns: 3,
  align: (x, y) => {
    if x == 0 { left }         // First column left
    else if y == 0 { center }  // Header centered
    else { right }             // Data right
  },
  ...
)
```

## Cell Functions

### Header Cells

```typst
#table(
  columns: 3,
  table.header(
    [Name], [Age], [City],
  ),
  [Alice], [30], [London],
  [Bob], [25], [Paris],
)
```

### Footer Cells

```typst
#table(
  columns: 3,
  table.header([Item], [Price], [Qty]),
  [Apple], [$1], [5],
  [Banana], [$2], [3],
  table.footer([Total], [], [$11]),
)
```

### Cell Spanning

```typst
// Column span
#table(
  columns: 3,
  table.cell(colspan: 3)[Full Width Header],
  [A], [B], [C],
)

// Row span
#table(
  columns: 3,
  table.cell(rowspan: 2)[Spans 2 rows], [B1], [C1],
  [B2], [C2],
)

// Both
#table(
  columns: 3,
  table.cell(colspan: 2, rowspan: 2)[Large cell],
  [Top right],
  [Bottom right],
)
```

### Individual Cell Styling

```typst
#table(
  columns: 3,
  [Normal],
  table.cell(fill: red.lighten(80%))[Highlighted],
  table.cell(align: right)[Right],
)

// Full styling
table.cell(
  fill: blue.lighten(90%),
  align: center,
  inset: 15pt,
  stroke: 2pt + blue,
)[Styled Cell]
```

## Horizontal and Vertical Lines

```typst
#table(
  columns: 3,
  [A], [B], [C],
  table.hline(),              // Horizontal line
  [D], [E], [F],
)

#table(
  columns: 3,
  [A], table.vline(), [B], [C],
  [D], [E], [F],
)

// Styled lines
table.hline(stroke: 2pt + red)
table.vline(stroke: blue, start: 1, end: 3)
```

## Table Styling with Show Rules

### Style Header Row

```typst
#show table.cell.where(y: 0): set text(weight: "bold")

#table(
  columns: 3,
  [Name], [Age], [City],
  [Alice], [30], [London],
)
```

### Style First Column

```typst
#show table.cell.where(x: 0): set text(style: "italic")
```

### Complex Table Styling

```typst
// Professional table style
#let professional-table(..args) = {
  set table(
    stroke: none,
    inset: (x: 8pt, y: 6pt),
    align: (x, _) => if x == 0 { left } else { right },
  )
  show table.cell.where(y: 0): set text(weight: "bold")
  show table.cell.where(y: 0): it => {
    set text(fill: white)
    rect(fill: navy, inset: 0pt, outset: (x: 8pt, y: 6pt), it)
  }

  table(..args)
}

#professional-table(
  columns: 4,
  [Product], [Q1], [Q2], [Q3],
  [Widgets], [100], [150], [200],
  [Gadgets], [80], [120], [180],
)
```

## Styling Header Cells

`show table.header: it => { set text(...); upper(it) }` does not reliably restyle header content: a `set` rule inside a transformational show rule only affects content created in that scope, not the content passed in as `it`.

```typst
// Does NOT restyle the header text
show table.header: it => {
  set text(size: 8pt, fill: gray)
  upper(it)
}
```

Style the cells explicitly with a helper instead. The same helper works for the label column of a key-value table:

```typst
#let hdr(content) = text(size: 8pt, weight: "bold", fill: gray.darken(40%))[#upper(content)]

#table(
  columns: 3,
  table.header(hdr[Name], hdr[Role], hdr[City]),
  [Alice], [Engineer], [London],
)

#table(
  columns: (auto, 1fr),
  fill: (x, _) => if x == 0 { gray.lighten(90%) },
  hdr[Name], [Example],
  hdr[Date], [2026-01-01],
)
```

## Common Table Patterns

### Data Table

```typst
#table(
  columns: 4,
  align: (left, right, right, right),
  fill: (_, y) => if calc.odd(y) { gray.lighten(90%) },
  stroke: (x: none, y: 0.5pt + gray),
  inset: (x: 10pt, y: 6pt),

  table.header(
    [*Product*], [*Q1*], [*Q2*], [*Q3*],
  ),
  [Widgets], [100], [150], [200],
  [Gadgets], [80], [120], [180],
  [Gizmos], [50], [75], [100],
)
```

### Comparison Table

```typst
#table(
  columns: (1fr, 1fr, 1fr),
  align: center,
  stroke: 1pt + gray,

  table.cell(fill: gray.lighten(70%))[Feature],
  table.cell(fill: blue.lighten(80%))[Basic],
  table.cell(fill: green.lighten(80%))[Premium],

  [Storage], [10 GB], [100 GB],
  [Support], [Email], [24/7 Phone],
  [Price], [\$10/mo], [\$50/mo],
)
```

### Schedule Table

```typst
#table(
  columns: (auto, 1fr, 1fr, 1fr, 1fr, 1fr),
  align: center,
  inset: 8pt,

  [], [Mon], [Tue], [Wed], [Thu], [Fri],
  [9:00], [Math], [Eng], [Math], [Sci], [Art],
  [10:00], [Eng], [Math], [Eng], [Math], [PE],
  [11:00], table.cell(colspan: 5)[Break],
  [12:00], [Sci], [Art], [Sci], [Eng], [Math],
)
```

### Invoice Table

```typst
#table(
  columns: (3fr, 1fr, 1fr, 1fr),
  align: (left, right, right, right),
  stroke: none,

  table.header(
    table.cell(fill: navy, text(white)[*Description*]),
    table.cell(fill: navy, text(white)[*Qty*]),
    table.cell(fill: navy, text(white)[*Price*]),
    table.cell(fill: navy, text(white)[*Total*]),
  ),

  [Item A], [2], [\$50], [\$100],
  [Item B], [3], [\$100], [\$300],
  table.hline(),
  table.cell(colspan: 3, align: right)[*Subtotal*], [\$400],
  table.cell(colspan: 3, align: right)[*Tax*], [\$40],
  table.hline(stroke: 2pt),
  table.cell(colspan: 3, align: right)[*Total*], [*\$440*],
)
```

## Tables in Figures

```typst
#figure(
  table(
    columns: 3,
    [A], [B], [C],
    [1], [2], [3],
  ),
  caption: [Sample data from experiment],
) <tbl:sample>

As shown in @tbl:sample, the results...
```

## Generating Tables from Data

```typst
// From array
#let data = (
  ("Alice", 30, "London"),
  ("Bob", 25, "Paris"),
  ("Carol", 35, "Berlin"),
)

#table(
  columns: 3,
  [Name], [Age], [City],
  ..data.flatten(),
)

// From dictionary array
#let items = (
  (name: "Alice", age: 30),
  (name: "Bob", age: 25),
)

#table(
  columns: 2,
  [Name], [Age],
  ..items.map(i => (i.name, str(i.age))).flatten(),
)
```
