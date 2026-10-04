# Quarto Reveal.js YAML Options Reference

Complete reference for all YAML frontmatter options in Quarto Reveal.js presentations.

## Table of Contents

- [Document Metadata](#document-metadata)
- [Slide Configuration](#slide-configuration)
- [Slide Content](#slide-content)
- [Themes and Styling](#themes-and-styling)
- [Transitions and Animation](#transitions-and-animation)
- [Navigation](#navigation)
- [Code Display](#code-display)
- [Media](#media)
- [Slide Layout](#slide-layout)
- [Print and Export](#print-and-export)
- [Advanced Options](#advanced-options)

---

## Document Metadata

```yaml
title: "Presentation Title"
subtitle: "Optional Subtitle"
author: "Author Name"           # or list: ["Author 1", "Author 2"]
institute: "Organisation"       # Author affiliation
date: today                     # or "2026-01-19" or date-format string
date-format: "D MMMM YYYY"      # Custom date formatting
```

## Slide Configuration

```yaml
format:
  revealjs:
    # Slide numbering
    slide-number: true          # true, false, or format string
    show-slide-number: all      # all, print, speaker

    # Slide structure
    slide-level: 2              # Heading level that creates slides (0-6)
    center: false               # Vertical centering of slide content

    # Title slide
    center-title-slide: true    # Center title slide content
    title-slide-style: pandoc   # pandoc or custom
    title-slide-attributes:     # Custom title slide styling
      data-background-image: "bg.png"
      data-background-size: contain
      data-background-opacity: "0.5"
```

**Slide number formats:**
- `true` - Show slide number
- `c` - Current slide only
- `c/t` - Current/Total (e.g., "3/10")
- `h/v` - Horizontal/Vertical
- `h.v` - Horizontal.Vertical

## Slide Content

```yaml
format:
  revealjs:
    # Branding
    logo: logo.png              # Logo image (bottom right)
    footer: "Footer text"       # Footer on all slides

    # Text sizing
    smaller: false              # Use smaller default font
    scrollable: false           # Allow vertical scrolling

    # Lists
    incremental: false          # Reveal list items one by one

    # Speaker notes
    show-notes: false           # Make speaker notes visible

    # Direction
    rtl: false                  # Right-to-left text
```

## Themes and Styling

```yaml
format:
  revealjs:
    # Built-in themes
    theme: default              # Theme name or SCSS file
    # Options: default, dark, simple, serif, night, moon, sky,
    #          beige, blood, dracula, league, solarized

    # Custom themes
    theme: [default, custom.scss]  # Layer custom on built-in
    theme: mytheme.scss            # Fully custom theme

    # Additional CSS
    css: [styles.css]           # Extra stylesheets

    # Syntax highlighting
    syntax-highlighting: github     # Code highlighting theme
    # Options: pygments, tango, espresso, zenburn, kate, monochrome,
    #          breezedark, haddock, dracula, monokai, nord, solarized,
    #          github, a11y, arrow, atom-one, ayu, breeze, gruvbox
```

## Transitions and Animation

```yaml
format:
  revealjs:
    # Slide transitions
    transition: slide           # none, fade, slide, convex, concave, zoom
    transition-speed: default   # default, fast, slow
    background-transition: fade # Transition for backgrounds

    # Fragments (incremental reveal)
    fragments: true             # Enable/disable fragments globally

    # Auto-animate
    auto-animate: true          # Animate between similar slides
    auto-animate-easing: ease   # CSS easing function
    auto-animate-duration: 1.0  # Animation duration in seconds
    auto-animate-unmatched: true # Animate unmatched elements
```

## Navigation

```yaml
format:
  revealjs:
    # Controls
    controls: auto              # true, false, auto
    controls-layout: bottom-right  # edges, bottom-right
    controls-tutorial: true     # Show control hints
    controls-back-arrows: faded # faded, hidden, visible

    # Progress and history
    progress: true              # Show progress bar
    history: true               # Browser back/forward navigation
    hash: true                  # Current slide in URL hash
    hash-type: title            # title or number

    # Navigation modes
    navigation-mode: linear     # linear, vertical, grid
    touch: true                 # Touch navigation
    keyboard: true              # Keyboard shortcuts
    mouse-wheel: false          # Mouse wheel navigation

    # Auto-advance
    auto-slide: 0               # Milliseconds (0 = disabled)
    auto-slide-stoppable: true  # Stop on user input
    loop: false                 # Loop back to start
    shuffle: false              # Randomise slide order

    # Jump to slide
    jump-to-slide: true         # Enable G key jump

    # Scroll view
    scroll-view: false          # Scrolling instead of slides

    # Cursor
    hide-inactive-cursor: true  # Hide cursor when inactive
    hide-cursor-time: 5000      # Milliseconds before hiding

    # Misc
    pause: true                 # Allow blackout/pause
    help: true                  # Show help on ? key
```

## Code Display

```yaml
format:
  revealjs:
    # Code blocks
    code-fold: false            # false, true, show
    code-summary: "Code"        # Text for folded code
    code-overflow: scroll       # scroll, wrap
    code-line-numbers: false    # true, false, or highlight string
    code-copy: hover            # true, false, hover
    code-block-height: 500px    # Maximum height
    code-block-bg: true         # Background colour
    code-block-border-left: true # Left border

    # Code linking (knitr only)
    code-link: false            # Link functions to docs

    # Annotations
    code-annotations: below     # below, hover, select
```

## Media

```yaml
format:
  revealjs:
    # Links
    preview-links: auto         # true, false, auto

    # Media playback
    auto-play-media: null       # null, true, false
    preload-iframes: null       # null, true, false

    # Performance
    view-distance: 3            # Slides to pre-load
    mobile-view-distance: 2     # Mobile pre-load range

    # Parallax background
    parallax-background-image: "bg.png"
    parallax-background-size: "2100px 900px"
    parallax-background-horizontal: 200  # Pixels per slide
    parallax-background-vertical: 50
```

## Slide Layout

```yaml
format:
  revealjs:
    # Dimensions
    width: 1050                 # Presentation width (pixels or %)
    height: 700                 # Presentation height
    margin: 0.1                 # Empty space factor (0-1)
    min-scale: 0.2              # Minimum content scale
    max-scale: 2.0              # Maximum content scale

    # Layout
    center: false               # Vertical centering
    disable-layout: false       # Disable scaling/centering
    auto-stretch: true          # Auto-stretch single images

    # Captions
    fig-cap-location: bottom    # top, bottom, margin
    tbl-cap-location: top       # top, bottom, margin
```

## Print and Export

```yaml
format:
  revealjs:
    # PDF settings
    pdf-max-pages-per-slide: 1  # Max pages per slide
    pdf-separate-fragments: true # Each fragment on own page
    pdf-page-height-offset: -1  # Height adjustment

    # Self-contained output
    embed-resources: false      # Embed all assets in HTML
    # Note: Incompatible with chalkboard plugin
```

## Advanced Options

### Slide Tools

```yaml
format:
  revealjs:
    # Overview mode
    overview: true              # Enable O key overview

    # Navigation menu
    menu:
      side: left                # left, right
      width: normal             # normal, wide, third, half, full
      numbers: false            # Show slide numbers

    # Chalkboard drawing
    chalkboard: true            # Enable drawing
    # Or detailed config:
    chalkboard:
      theme: chalkboard         # chalkboard, whiteboard
      boardmarker-width: 3
      chalk-width: 4
      chalk-effect: 1.0
      src: drawings.json        # Pre-load drawings

    # Multiplex (audience sync)
    multiplex: true             # Enable multiplexing
    # Or with custom server:
    multiplex:
      url: 'https://server.example.com/'
      id: 'presentation-id'
      secret: 'presenter-secret'

    # Slide tone (accessibility)
    slide-tone: false           # Audio cue on slide change
```

### Execution Options (for code cells)

```yaml
execute:
  eval: true                    # Run code
  echo: true                    # Show source code
  output: true                  # Show results
  warning: true                 # Show warnings
  error: false                  # Stop on errors
  include: true                 # Include in output
  cache: false                  # Cache results
  freeze: auto                  # Reuse previous output
```

### Code Output Location

```yaml
# Per code block:
#| output-location: fragment    # fragment, slide, column, column-fragment
```

---

## Example: Full Configuration

```yaml
---
title: "Complete Example"
subtitle: "All Features Demo"
author: "Your Name"
date: today
format:
  revealjs:
    theme: [default, custom.scss]
    logo: logo.png
    footer: "Company Name | 2026"
    slide-number: c/t
    show-slide-number: all

    transition: fade
    transition-speed: fast

    incremental: false
    scrollable: true
    smaller: false
    center: false

    controls: true
    progress: true
    history: true
    hash-type: title

    chalkboard: true
    menu: true

    syntax-highlighting: github
    code-line-numbers: true
    code-copy: hover
    code-overflow: scroll

    width: 1280
    height: 720
    margin: 0.1

execute:
  echo: true
  warning: false
---
```
