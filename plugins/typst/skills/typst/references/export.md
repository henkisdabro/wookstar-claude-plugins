# Typst Export Reference

Guide to exporting Typst documents to PDF, HTML, PNG, and SVG formats.

## PDF Export (Default)

PDF is the default export format and the most feature-rich.

### Basic Export

```bash
typst compile document.typ                    # Creates document.pdf
typst compile document.typ output.pdf         # Custom output name
```

### Document Metadata

```typst
#set document(
  title: [Document Title],
  author: ("Author One", "Author Two"),
  date: datetime.today(),
  keywords: ("typst", "document", "report"),
)
```

### PDF Standards

Standards are selected at export time via the CLI flag `--pdf-standard` (or the checkbox in the web app) - they are not set inside the document:

```bash
typst compile --pdf-standard a-3b document.typ
typst compile --pdf-standard ua-1 document.typ

# 0.15+: target multiple compatible standards at once (comma-separated)
typst compile --pdf-standard a-2a,ua-1 document.typ
```

#### PDF/A (Archival)

Available PDF/A levels:
- `a-1a`, `a-1b` - PDF/A-1 (earliest, most compatible)
- `a-2a`, `a-2b`, `a-2u` - PDF/A-2 (adds transparency, layers)
- `a-3a`, `a-3b`, `a-3u` - PDF/A-3 (adds file attachments)
- `a-4`, `a-4e`, `a-4f` - PDF/A-4 (latest standard)

The 'a' suffix requires tagged/accessible PDFs. The 'b' suffix is visual-only. The 'u' suffix requires Unicode. Plain PDF versions (`1.4` through `2.0`) can also be pinned with the same flag.

#### PDF/UA (Accessibility)

PDF/UA-1 (`--pdf-standard ua-1`) ensures accessibility compliance:
- Requires tagged PDF structure
- All content must be accessible or marked as artifact
- Document title required
- Language must be specified

```typst
// In-document prerequisites for a UA-1 export
#set document(title: [Accessible Document])
#set text(lang: "en")
```

### Font Embedding

Fonts are automatically embedded. All glyphs used are included in the PDF.

### PDF Features

```typst
// Links
#link("https://typst.app")[Visit Typst]
#link(<section>)[Go to section]

// Outlines (bookmarks) - automatic from headings
#outline()

// Cross-references
See @fig:diagram for details.
```

## HTML Export (Experimental)

HTML export produces semantic HTML5 documents.

### Enable HTML Export

```bash
typst compile --features html document.typ document.html
```

### Target Detection

```typst
// Different behaviour per export format
// (target() works without the html feature flag since 0.15)
#if target() == "html" [
  HTML-specific content
] else [
  PDF-specific content
]
```

### HTML Considerations

- Semantic elements preserve meaning (headings, lists, figures)
- Equations export as MathML automatically (0.15+) - selectable, screen-reader friendly
- Layout may differ from PDF (no pages)
- Output is minified by default (0.15+); pass `--pretty` for readable HTML
- The root `<html>` element carries the `lang` from `#set text(lang: ...)`

### Typed HTML API

```typst
// Generic element with attributes
#html.elem("nav", attrs: (class: "menu"))[...]

// Typed shorthands exist for standard elements
#html.div[Block content]
#html.span[Inline content]

// script/style accept strings only (0.15+), not content blocks
#html.style("a { color: red }")
#html.script("console.log(1)")

// Render a Typst layout as embedded SVG where HTML cannot express it
#html.frame(block[...])
```

Since 0.15, `box` brings block-level content inline and `block` makes inline content block-level in HTML export - use them to control paragraph grouping. HTML elements like `<div>` are "neutral" and no longer force surrounding text into `<p>` tags; only block-level Typst elements do.

## PNG Export

Rasterised output suitable for embedding or sharing.

### Basic PNG Export

```bash
typst compile document.typ output.png
```

### Multi-Page PNG

Each page becomes a separate file:

```bash
typst compile document.typ output-{n}.png    # output-1.png, output-2.png, etc.
```

### Resolution (PPI)

```bash
typst compile --ppi 300 document.typ output.png
```

Default is 144 PPI. Use higher values (300-600) for print quality.

### Transparent Background

```typst
#set page(fill: none)
```

## SVG Export

Vector output suitable for scalable graphics.

### Basic SVG Export

```bash
typst compile document.typ output.svg
```

### Multi-Page SVG

```bash
typst compile document.typ output-{n}.svg
```

### SVG Considerations

- Text converted to paths (not selectable)
- Infinite scalability
- Larger file sizes for complex documents
- Good for diagrams and logos
- Minified by default (0.15+); `--pretty` to pretty-print. The `typst-frame`/`typst-doc`/`typst-text` class attributes are no longer emitted - style sheets that relied on them need updating

## Bundle Export (Experimental, 0.15+)

Enable with `--features bundle` (or `TYPST_FEATURES=bundle`). A single project can emit multiple output files - any combination of HTML pages, PDFs, PNGs, SVGs, and raw assets - via the constructable `document` element (with `path` and `format` parameters) and the `asset` element for verbatim byte output. The `within` selector scopes introspection to one document in the bundle. API is experimental and may change; check https://typst.app/docs/reference/bundle/ for current element signatures.

## Export Comparison

| Feature | PDF | HTML | PNG | SVG |
|---------|-----|------|-----|-----|
| Multi-page | Single file | Single file | Multiple files | Multiple files |
| Selectable text | Yes | Yes | No | No (paths) |
| Accessible | Yes (tagged) | Yes (semantic) | No | No |
| Scalable | Vector | Responsive | No (raster) | Yes (vector) |
| Interactive | Limited | Full | No | No |
| File attachments | PDF/A-3+ | Link only | No | No |
| Colour profiles | sRGB embedded | Device | Device | Device |

## CLI Options

### Compilation Options

```bash
# Watch mode (recompile on change)
typst watch document.typ

# Specify output format
typst compile document.typ --format pdf
typst compile document.typ --format png
typst compile document.typ --format svg

# Set root directory
typst compile --root ./project document.typ

# Add font paths
typst compile --font-path ./fonts document.typ

# Set input variables
typst compile --input version=1.0 document.typ

# Human-readable output (PDF/HTML/SVG are minified by default since 0.15)
typst compile --pretty document.typ
```

### Evaluating Expressions (0.15+)

```bash
# Evaluate a Typst code expression from the CLI (supersedes typst query)
typst eval "1 + 1"
typst eval "range(1, 5, inclusive: true)"
```

### Accessing CLI Inputs

```typst
// Access variables passed via --input
#sys.inputs.at("version", default: "unknown")

// Test whether an input was provided (dictionaries have no .has() method)
#if "version" in sys.inputs [Versioned build]
```

## Optimising Output

### PDF Size Reduction

```typst
// Use fewer fonts
#set text(font: "Linux Libertine")  // Single font family

// Avoid unnecessary images
// Compress images before including

// Use vector graphics where possible
#image("diagram.svg")  // Instead of PNG
```

### PNG Quality

```typst
// Higher PPI for print
// typst compile --ppi 300

// Lower PPI for web
// typst compile --ppi 144

// Transparent for overlays
#set page(fill: none)
```

### HTML Accessibility

```typst
// Always set language
#set text(lang: "en")

// Use semantic elements
= Heading          // Not #text(size: 16pt)[Heading]

// Provide alt text for images
#figure(
  image("photo.jpg"),
  caption: [Photo description],
  alt: "Detailed description for screen readers",
)

// Alt text for equations
#math.equation(
  alt: "E equals m c squared",
  $ E = m c^2 $,
)
```

## Troubleshooting

### Missing Fonts

If fonts don't appear correctly:
1. Install font system-wide
2. Use `--font-path` to specify location
3. Verify font name spelling
4. Omit style suffixes from family names - Typst trims "Bold", "Condensed", and (0.15+) "Variable"/"Var"/"VF", so a font named "Inter Variable" is selected as `font: "Inter"` with weight/stretch parameters
5. `typst fonts --variants` lists detected families with file paths and variation axes; Adobe Creative Cloud fonts are discovered as system fonts (0.15+)

Variable fonts (0.15+): the standard axes follow `weight`, `stretch`, `style`, and `size` automatically; custom axes go through `#set text(variations: (AXIS: value))`.

### Large PDF Files

Causes and fixes:
- Embedded images: compress before including
- Many fonts: reduce font variety
- Complex vector graphics: simplify or rasterise

### HTML Rendering Differences

- Layout is reflowable, not fixed
- Page concepts don't exist
- Some positioning may differ
- Test in target browsers

### PNG Quality Issues

- Increase PPI for higher quality
- Use SVG instead for scalability
- Verify source images are high resolution
