# What's New in Typst 0.15

Curated from the official changelogs (https://typst.app/docs/changelog/0.15.0/, https://typst.app/docs/changelog/0.15.1/) and the codex 0.3.0 symbol changelog. Everything marked "verified" compiled against typst 0.15. If migrating from 0.13 or older, also check those releases' migration guides - 0.15 removes APIs they only deprecated.

## Highlights

- Variable font support: standard axes (`ital`, `slnt`, `wght`, `wdth`, `opsz`) follow `text` weight/stretch/style/size automatically; custom axes via `#set text(variations: (AXIS: value))` (verified)
- HTML export renders equations as MathML out of the box (verified) - selectable, screen-reader friendly
- Bundle export (experimental, `--features bundle`): one project, many output files (HTML pages, PDFs, PNGs, SVGs, raw assets)
- Multiple bibliographies per document (`target` and `group` parameters on `bibliography`)
- Multiple PDF standards per export: `--pdf-standard a-2a,ua-1` (verified)
- New `within` selector for scoped introspection: `selector(strong).within(heading)` - works in `query()`, not yet in show rules (verified)
- New `divider` element for stylable thematic breaks: `#divider()` (verified)
- Spot colours for offset printing (`color` gained a `spot` constructor)
- New file `path` type: `path("a.txt")` resolves relative to the defining file, passable across package boundaries (verified)
- `typst eval "expr"` CLI subcommand supersedes `typst query` (verified)
- Layout convergence failures now emit detailed diagnostics (element counts per iteration)
- Two long-standing list layout issues fixed: marker baseline alignment and centring against full width

## Breaking changes

| Change | Migration |
|--------|-----------|
| `path` shape element removed | Use `curve` with `curve.move`/`curve.line`/`curve.quad`/`curve.cubic`/`curve.close` (verified) |
| `pattern` type removed | Use `tiling` |
| `pdf.embed` removed | Use `pdf.attach` |
| `cbor/csv/json/toml/xml/yaml.decode` and `image.decode` removed | Pass bytes to the top-level function, e.g. `json(bytes)` |
| Removed symbols: `sect` (and variants), `plus.circle`, `times.circle`, `angle.l`, `angle.r`, `diff`, `planck.reduce`, and other long-deprecated names (full list in codex 0.3.0 changelog) | `inter`, `plus.o`, `times.o`, `chevron.l`, `chevron.r`, `partial`, `planck` (verified: `inter`, `inter.big`, `plus.o`, `times.o`, `times.o.big`, `chevron.l/r`) |
| Backslashes in file paths rejected | Forward slashes on every platform; non-Unicode CLI paths also unsupported |
| Baselines retained in more of the layout engine | Boxes with insets, blocks in equations, and list items now baseline-align automatically - remove manual counter-adjustments |
| HTML: `box`/`block` purpose realigned | `box` brings block content inline, `block` forces block-level; single children get a CSS `display` instead of a wrapper element |
| HTML: paragraph grouping rules changed | HTML elements are "neutral" and no longer force adjacent inline content into `<p>`; only block-level Typst elements do. Package authors should wrap block-level HTML components in `block` |
| `html.script`/`html.style` accept strings only | Use `"..."` or a raw block's `.text` field |
| SVG export no longer emits `typst-*` class attributes | Update style sheets that targeted `typst-frame` etc. |
| HTML/SVG/PDF output minified by default | `--pretty` flag (or web app checkbox) to pretty-print (verified) |
| Variable-font name suffixes trimmed | "Inter Variable"/"Var"/"VF" all select as `font: "Inter"` |
| `--timings` requires an explicit file name | Was `record-{n}.json` by default |
| Math: `lr`/`stretch` size ratios resolve against the base glyph, not display-sized glyphs | Increase configured sizes for display-style delimiters if output shrank |
| Math: `class` applies to its direct body only, not recursively | Re-wrap inner pieces if you relied on recursion |
| Math: more delimiters callable as functions (e.g. `chevron.l(x)`) | Previously rendered literal parentheses; output changes |
| `array.slice`/`str` constructor/`text.features` validate strictly | Passing both `end` and `count` to slice errors; invalid feature tags error |

## Deprecations (warn now, error later)

- Ambiguous raw language tags (parsing change coming next version - compiler suggests fixes)
- Arabic-numeral fallback for numbering systems without zero
- Renamed citation styles: `vancouver` is now `nlm-citation-sequence`, `vancouver-superscript` is now `nlm-citation-sequence-superscript`, `council-of-science-editors` is now `cse-citation-sequence-brackets-8th-edition`, `council-of-science-editors-author-date` is now `cse-name-year`, `mla-8` superseded by `mla`
- Renamed symbols: `gt.tri` to `gt.closed`, `lt.tri` to `lt.closed`, `join` to `bowtie.big`, `tack.r.double` to `tack.rr` (and mirrored variants)
- Undocumented array forms of `enum` and `terms` items

## Notable additions

- `dictionary.map(v => ...)` and `.filter(v => ...)` - closures receive values, keys preserved (verified); also on `arguments`, whose named values now support field access
- `range(start, end, inclusive: true)` (verified)
- `calc.asinh`, `calc.acosh`, `calc.atanh`, `calc.erf`; `int.min`/`int.max` constants; deterministic cross-platform floats
- `int("ff", base: 16)` - parse strings in any base
- `datetime.today(offset: duration)` - sub-hour timezone offsets
- `counter.display(at: <label>)` - counter value at another location (verified)
- `page(bleed: 3mm)` (verified); `list(marker-align: ...)` (verified); weak fractional spacing `#v(1fr, weak: true)` (verified)
- `xml` namespaces support; friendlier JSON BOM errors
- New Computer Modern 8.1.0: default calligraphic letterforms changed; restore with `#show math.equation: set text(stylistic-set: 6)` (verified)
- Math: `text.stroke` respected by fraction/root/under-over lines; cramped-style spacing now matches TeX
- PDF: labelled headings become named destinations even when unreferenced; more specific `pdf.artifact` kinds
- CLI: lazy font discovery, Adobe Creative Cloud fonts detected, `typst fonts --variants` shows file paths and variation axes, colourised `--help`, compacter tracebacks
- Docs available as a print PDF: https://github.com/typst/typst/releases/download/v0.15.0/typst-documentation.pdf

## 0.15.1 patch (July 2026)

Bug fixes only: New Computer Modern 8.1.1 (regular math weight now honours stylistic set 6), `lr` alignment points and `op` vertical alignment regressions fixed, gaps in multi-page lists with vertical `marker-align` fixed, `typst eval` exits with code 1 on evaluation failure.

## Not documented here on purpose

Bundle `document`/`asset` element constructor signatures - experimental and unverified locally. Check https://typst.app/docs/reference/bundle/ before using.
