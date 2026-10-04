# Typst Accessibility Reference

Guide to creating accessible documents with Typst that work for all readers and Assistive Technology (AT).

## Why Accessibility Matters

Accessible documents can be used by:
- Screen reader users
- Users who reflow content on small screens
- Users who convert to other formats (HTML, ePub)
- AI systems summarising content
- Print-on-paper readers
- Anyone with temporary or permanent disabilities

## Core Principles

### 1. Use Semantic Elements

Use Typst's built-in elements rather than manual styling:

```typst
// ❌ Don't do this
#text(size: 16pt, weight: "bold")[Heading]

// ✅ Do this
= Heading
```

### 2. Maintain Reading Order

Content should be read in logical order regardless of visual layout.

### 3. Provide Text Alternatives

Images and equations need descriptions for non-visual access.

### 4. Ensure Sufficient Contrast

Text must be readable against its background.

## Semantic Markup

### Use Built-in Elements

| Instead of... | Use... |
|---------------|--------|
| `#text(style: "italic")[...]` | `_emphasis_` or `#emph[...]` |
| `#text(weight: "bold")[...]` | `*strong*` or `#strong[...]` |
| Manual numbering | `+ numbered list` |
| Custom bullets | `- bullet list` |
| `#text(size: 16pt)[Title]` | `= Heading` |
| Manual bibliography | `#bibliography("refs.bib")` |
| "See page 5" | `@label` references |

### Style with Show Rules

Customise appearance while preserving semantics:

```typst
// Change heading appearance but keep semantics
#show heading: set text(fill: navy)

// Custom strong appearance
#show strong: set text(
  weight: "black",
  fill: blue,
)
```

### Document Structure

```typst
// Set document metadata (required for PDF/UA)
#set document(
  title: [Document Title],
  author: "Author Name",
)

// Set language (required for screen readers)
#set text(lang: "en")

// Use heading hierarchy
= Chapter
== Section
=== Subsection
```

## Reading Order

### Visual vs Logical Order

Screen readers follow document structure, not visual layout:

```typst
// These are read in source order, regardless of float position
= Introduction
#figure(
  image("diagram.svg"),
  caption: [Overview diagram],
  placement: top,    // Floats visually, but read in order
)

This text follows the figure in reading order.
```

### Multi-Column Layout

```typst
#set page(columns: 2)

// Content flows left column first, then right
// AT reads in this order
```

### Complex Layouts

For complex positioning, ensure logical flow:

```typst
#grid(
  columns: 2,
  // First column (read first)
  [Main content...],
  // Second column (read second)
  [Sidebar content...],
)
```

## Textual Representations

### Image Alt Text

```typst
#figure(
  image("chart.png"),
  caption: [Sales growth 2023-2024],
  alt: "Bar chart showing sales increasing from 100 units in Q1 2023 to 450 units in Q4 2024, with steady quarterly growth.",
)
```

### Equation Alt Text

```typst
#math.equation(
  alt: "E equals m c squared, where E is energy, m is mass, and c is the speed of light",
  block: true,
  $ E = m c^2 $,
)
```

In HTML export (0.15+), equations become MathML automatically - semantics are preserved for screen readers without extra work.

### Decorative Images

Mark purely decorative images as artifacts:

```typst
#pdf.artifact(image("decoration.png"))
```

## Artifacts

Artifacts are elements hidden from AT - purely decorative or navigational content:

### Automatic Artifacts

Typst automatically marks as artifacts:
- Page headers and footers
- Page numbers
- Hyphens from automatic hyphenation
- Shapes from `visualize` module (rect, circle, etc.)

### Manual Artifacts

```typst
// Mark decorative content as artifact
#pdf.artifact[
  #image("decorative-border.png")
]

// Watermark
#set page(background: pdf.artifact(
  place(center + horizon, text(60pt, fill: gray.lighten(80%))[DRAFT])
))
```

## Tables

### Header Rows

Always mark header rows:

```typst
#table(
  columns: 3,
  table.header(
    [Name], [Age], [City],    // Marked as header
  ),
  [Alice], [30], [London],
  [Bob], [25], [Paris],
)
```

### Complex Tables

For complex table structures:

```typst
#table(
  columns: 4,
  // Row headers in first column
  table.cell(rowspan: 2)[Category A],
  [Sub 1], [100], [200],
  [Sub 2], [150], [250],
)
```

## Figures and Captions

### Proper Figure Usage

```typst
#figure(
  image("diagram.svg", width: 80%),
  caption: [System architecture overview],
  alt: "Detailed description of the diagram for screen readers",
) <fig:architecture>

See @fig:architecture for the system design.
```

### Figure Supplements

```typst
#set figure(supplement: [Figure])  // "Figure 1" prefix

// For tables
#figure(
  table(...),
  caption: [Data summary],
  supplement: [Table],
)
```

## Colour and Contrast

### Minimum Contrast

Ensure text is readable:
- Normal text: 4.5:1 contrast ratio
- Large text (18pt+): 3:1 contrast ratio

```typst
// ❌ Low contrast
#text(fill: gray.lighten(60%))[Hard to read]

// ✅ Sufficient contrast
#text(fill: gray.darken(40%))[Readable text]
```

### Don't Rely on Colour Alone

```typst
// ❌ Colour-only distinction
#text(fill: red)[Error] vs #text(fill: green)[Success]

// ✅ Multiple cues
#text(fill: red)[✗ Error] vs #text(fill: green)[✓ Success]
```

## Language Settings

### Document Language

```typst
#set text(lang: "en")           // English
#set text(lang: "de")           // German
#set text(lang: "zh")           // Chinese
```

### Mixed Languages

```typst
#set text(lang: "en")

Most text is English.

#text(lang: "de")[
  Dieser Absatz ist auf Deutsch.
]

Back to English.
```

### Language for Accessibility

Language settings affect:
- Screen reader pronunciation
- Hyphenation rules
- Smart quotes style
- Date/number formatting

## Links

### Descriptive Link Text

```typst
// ❌ Unclear link
Click #link("https://typst.app")[here] for more info.

// ✅ Descriptive link
Visit the #link("https://typst.app")[Typst documentation] for more info.
```

### Internal Links

```typst
= Introduction <intro>

See the @intro for background.
```

## PDF/UA Compliance

For full accessibility compliance:

```typst
// Required in-document settings
#set document(title: [Document Title])
#set text(lang: "en")

// Use semantic elements throughout
// Provide alt text for images and equations
// Mark decorative content as artifacts
```

Then export with the standard selected on the CLI (not in the document):

```bash
typst compile --pdf-standard ua-1 document.typ

# 0.15+: archival AND accessible in one file
typst compile --pdf-standard a-2a,ua-1 document.typ
```

### Checklist for PDF/UA

- [ ] Document has title
- [ ] Language is set
- [ ] Headings use proper hierarchy
- [ ] Lists use semantic markup
- [ ] Images have alt text
- [ ] Tables have headers
- [ ] Links are descriptive
- [ ] Decorations are artifacts
- [ ] Sufficient colour contrast

## Testing Accessibility

### Manual Testing

1. Read document with screen reader (NVDA, VoiceOver)
2. Check heading navigation works
3. Verify table headers are announced
4. Confirm images have descriptions

### PDF Accessibility Checkers

- Adobe Acrobat Pro accessibility checker
- PAC (PDF Accessibility Checker)
- axesPDF

### Common Issues

| Issue | Solution |
|-------|----------|
| Unlabeled image | Add `alt` parameter |
| Missing language | Set `#set text(lang: "en")` |
| No document title | Set `#set document(title: [...])` |
| Untagged content | Use semantic elements |
| Low contrast | Increase colour difference |
