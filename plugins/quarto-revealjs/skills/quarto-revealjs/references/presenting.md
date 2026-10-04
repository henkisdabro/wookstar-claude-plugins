# Presenting with Quarto Reveal.js

Speaker tools, navigation, chalkboard, multiplex, and PDF export.

## Table of Contents

- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Speaker View](#speaker-view)
- [Navigation Menu](#navigation-menu)
- [Chalkboard](#chalkboard)
- [Multiplex (Audience Sync)](#multiplex-audience-sync)
- [Print to PDF](#print-to-pdf)
- [Auto-Slide](#auto-slide)
- [Accessibility Features](#accessibility-features)

---

## Keyboard Shortcuts

### Navigation

| Key | Action |
|-----|--------|
| `→` `Space` `N` | Next slide |
| `←` `P` | Previous slide |
| `Alt + →` | Next slide (skip fragments) |
| `Alt + ←` | Previous slide (skip fragments) |
| `Shift + →` | Last slide |
| `Shift + ←` | First slide |
| `Home` | First slide |
| `End` | Last slide |
| `G` | Go to slide (type number, press Enter) |

### View Modes

| Key | Action |
|-----|--------|
| `S` | Speaker view |
| `O` | Overview mode |
| `F` | Fullscreen |
| `R` | Toggle scroll view |
| `E` | Print/PDF mode |
| `Esc` | Exit overview/fullscreen |
| `?` | Show keyboard shortcuts |

### Presentation Control

| Key | Action |
|-----|--------|
| `B` `.` | Blackout screen |
| `V` | Black screen (video pause) |
| `A` | Pause/resume auto-slide |
| `Alt + Click` | Zoom element |

### Chalkboard (when enabled)

| Key | Action |
|-----|--------|
| `C` | Toggle notes canvas |
| `B` | Toggle chalkboard |
| `Backspace` | Reset all drawings |
| `Del` | Clear current slide |
| `X` | Cycle colours forward |
| `Y` | Cycle colours backward |
| `D` | Download drawings |

---

## Speaker View

Access speaker view by pressing `S`. Shows:

- Current slide
- Next slide preview
- Speaker notes
- Elapsed time
- Current time

### Adding Speaker Notes

```markdown
## My Slide

Visible content for audience

::: {.notes}
Only you see this in speaker view.

- Key point to mention
- Remember to pause here
- Transition to next topic
:::
```

### Configuration

```yaml
format:
  revealjs:
    show-notes: false  # true to show notes to everyone
```

---

## Navigation Menu

Access via button (bottom-left) or press `M`.

### Features

- Slide list navigation
- Tools pane:
  - Fullscreen toggle
  - Speaker view access
  - Overview mode
  - PDF export

### Configuration

```yaml
format:
  revealjs:
    menu:
      side: left        # left or right
      width: normal     # normal, wide, third, half, full
      numbers: false    # Show slide numbers
```

### Overview Mode

Press `O` to see thumbnail grid of all slides. Click any slide to jump to it.

### Jump to Slide

Press `G`, type a slide number or ID, press Enter.

```yaml
format:
  revealjs:
    jump-to-slide: true  # Enabled by default
```

---

## Chalkboard

Draw on slides during presentation.

### Enable Chalkboard

```yaml
format:
  revealjs:
    chalkboard: true
```

### Keyboard Controls

| Key | Action |
|-----|--------|
| `C` | Toggle notes canvas (draw over slide) |
| `B` | Toggle chalkboard (blank board) |
| `Backspace` | Reset all drawings |
| `Del` | Clear current slide drawings |
| `X` | Next colour |
| `Y` | Previous colour |
| `D` | Download drawings as JSON |

### Advanced Configuration

```yaml
format:
  revealjs:
    chalkboard:
      theme: chalkboard       # chalkboard or whiteboard
      boardmarker-width: 3    # Marker thickness (notes canvas)
      chalk-width: 4          # Chalk thickness (chalkboard)
      chalk-effect: 1.0       # Chalk texture (0-1)
      src: drawings.json      # Pre-load saved drawings
      read-only: false        # Disable drawing
      buttons: true           # Show drawing buttons
```

### Pre-Loading Drawings

1. Create drawings during practice
2. Press `D` to download JSON file
3. Reference in YAML:

```yaml
format:
  revealjs:
    chalkboard:
      src: my-drawings.json
```

### Important Note

Chalkboard is **incompatible** with `embed-resources: true`. Choose one or the other.

---

## Multiplex (Audience Sync)

Let audience follow your presentation on their devices.

### Quick Setup

```yaml
format:
  revealjs:
    multiplex: true
```

Generates two HTML files:
- `presentation.html` - Audience version (follows your navigation)
- `presentation-speaker.html` - Your control version

### How It Works

1. You open `presentation-speaker.html`
2. Audience opens `presentation.html` (share URL)
3. As you navigate, their view syncs automatically

### Custom Server

`multiplex: true` uses Quarto's default token server (https://multiplex.up.railway.app/). For private/reliable sync:

```yaml
format:
  revealjs:
    multiplex:
      url: 'https://your-server.example.com/'
      id: 'unique-presentation-id'
      secret: 'your-secret-key'
```

### Generating Tokens

When `id` and `secret` are omitted, Quarto fetches them from the server's `/token` endpoint at render time (the default server, or the `url` you set) and reuses the pair on later renders.

---

## Print to PDF

### Method 1: Print Mode (Recommended)

1. Press `E` to enter print mode
2. Press `Ctrl + P` (or `Cmd + P`)
3. Configure print settings:
   - **Destination:** Save as PDF
   - **Layout:** Landscape
   - **Margins:** None
   - **Background graphics:** Enabled
4. Save

### Method 2: URL Parameter

Append `?print-pdf` to your presentation URL:

```
file:///path/to/presentation.html?print-pdf
```

Then use browser print.

### PDF Configuration

```yaml
format:
  revealjs:
    pdf-max-pages-per-slide: 1      # Max pages per slide
    pdf-separate-fragments: true    # Each fragment gets own page
    pdf-page-height-offset: -1      # Height adjustment
```

### Fragment Handling

By default, each fragment step creates a new PDF page. Disable with:

```yaml
format:
  revealjs:
    pdf-separate-fragments: false
```

### Notes in PDF

To include speaker notes in PDF, use:

```yaml
format:
  revealjs:
    show-notes: true
```

---

## Auto-Slide

Automatically advance slides.

### Basic Auto-Slide

```yaml
format:
  revealjs:
    auto-slide: 5000   # 5 seconds per slide
```

### With Loop

```yaml
format:
  revealjs:
    auto-slide: 5000
    loop: true         # Return to start after last slide
```

### User Control

```yaml
format:
  revealjs:
    auto-slide: 5000
    auto-slide-stoppable: true  # Pause on user interaction (default)
```

Press `A` to pause/resume auto-slide.

### Per-Slide Timing

Override timing for specific slides:

```markdown
## Quick Slide {autoslide=2000}

Only shows for 2 seconds

## Slow Slide {autoslide=10000}

Shows for 10 seconds
```

### Disable Auto-Slide for a Slide

```markdown
## Manual Slide {autoslide=0}

Requires manual advance
```

---

## Accessibility Features

### Slide Tone

Audio cue for slide changes (helps visually impaired presenters):

```yaml
format:
  revealjs:
    slide-tone: true
```

Plays a tone that increases in pitch as you progress.

### Keyboard Navigation

Always enabled by default. Ensure:

```yaml
format:
  revealjs:
    keyboard: true
    help: true  # Show shortcuts on ?
```

### Scroll View

Alternative interface using scrolling instead of slides:

```yaml
format:
  revealjs:
    scroll-view: true
```

Or toggle with `R` key. Also accessible via `?view=scroll` URL parameter.

### High Contrast Themes

Use high-contrast themes:

```yaml
format:
  revealjs:
    theme: dark
    syntax-highlighting: a11y  # Accessible syntax highlighting
```

---

## Navigation Controls

### Control Arrows

```yaml
format:
  revealjs:
    controls: true          # true, false, auto
    controls-layout: bottom-right  # bottom-right or edges
    controls-tutorial: true        # Show hints initially
    controls-back-arrows: faded    # faded, hidden, visible
```

### Progress Bar

```yaml
format:
  revealjs:
    progress: true  # Show progress bar at bottom
```

### Slide Numbers

```yaml
format:
  revealjs:
    slide-number: true         # Show slide numbers
    show-slide-number: all     # all, print, or speaker
```

Number formats:
- `true` or `c` - Current slide number
- `c/t` - Current/Total (e.g., "3/10")
- `h/v` - Horizontal/Vertical position
- `h.v` - Horizontal.Vertical

### Browser History

Enable back/forward navigation:

```yaml
format:
  revealjs:
    history: true
    hash: true
    hash-type: title  # title or number
```

---

## Link Previews

Open links in overlay instead of leaving presentation:

```yaml
format:
  revealjs:
    preview-links: auto  # auto, true, false
```

- `auto` - Only in fullscreen mode
- `true` - Always use overlay
- `false` - Normal link behaviour

Per-link control:

```markdown
[Preview this](https://example.com){preview-link="true"}
[Open normally](https://example.com){preview-link="false"}
```
