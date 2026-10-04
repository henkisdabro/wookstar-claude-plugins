# Quarto Reveal.js Theming Reference

Complete guide to customising the appearance of Reveal.js presentations using SCSS.

## Table of Contents

- [Built-in Themes](#built-in-themes)
- [Basic Customisation](#basic-customisation)
- [Creating Custom Themes](#creating-custom-themes)
- [SCSS Variables Reference](#scss-variables-reference)
- [CSS Rules](#css-rules)
- [Common Customisations](#common-customisations)

---

## Built-in Themes

| Theme | Description |
|-------|-------------|
| `default` | Clean white background, dark text |
| `dark` | Dark background, light text |
| `simple` | Minimal white theme |
| `serif` | Serif fonts, traditional look |
| `night` | Black background |
| `moon` | Dark blue background |
| `sky` | Light blue gradient |
| `beige` | Warm beige tones |
| `blood` | Dark red accent |
| `dracula` | Popular dark colour scheme |
| `league` | Grey background |
| `solarized` | Solarized colour scheme |

```yaml
format:
  revealjs:
    theme: dark
```

## Basic Customisation

Layer a custom SCSS file on top of a built-in theme:

```yaml
format:
  revealjs:
    theme: [default, custom.scss]
```

**custom.scss:**
```scss
/*-- scss:defaults --*/
$body-bg: #1a1a2e;
$body-color: #eaeaea;
$link-color: #00d4ff;

/*-- scss:rules --*/
.reveal .slide h1 {
  text-transform: uppercase;
}
```

## Creating Custom Themes

### File Structure

Custom themes require two sections marked with special comments:

```scss
/*-- scss:defaults --*/
// Variable definitions go here
// These set values BEFORE the theme compiles

/*-- scss:rules --*/
// CSS rules go here
// These override AFTER the theme compiles
```

### Inheritance

Custom themes automatically inherit from the `default` theme. Override only what you need.

### The `!default` Flag

Use `!default` to allow variables to be overridden:

```scss
/*-- scss:defaults --*/
$primary-color: #2a76dd !default;
```

---

## SCSS Variables Reference

### Colours

| Variable | Default | Description |
|----------|---------|-------------|
| `$body-bg` | `#fff` | Slide background |
| `$body-color` | `#222` | Main text colour |
| `$text-muted` | `lighten($body-color, 50%)` | Muted text |
| `$link-color` | `#2a76dd` | Link colour |
| `$link-color-hover` | `lighten($link-color, 15%)` | Link hover |
| `$selection-bg` | `lighten($link-color, 25%)` | Text selection background |
| `$selection-color` | `$body-bg` | Text selection colour |

### Dark/Light Background Colours

For slides with different backgrounds:

| Variable | Default | Description |
|----------|---------|-------------|
| `$light-bg-text-color` | `#222` | Text on light backgrounds |
| `$light-bg-link-color` | `#2a76dd` | Links on light backgrounds |
| `$light-bg-code-color` | `#4758ab` | Code on light backgrounds |
| `$dark-bg-text-color` | `#fff` | Text on dark backgrounds |
| `$dark-bg-link-color` | `#42affa` | Links on dark backgrounds |
| `$dark-bg-code-color` | `#ffa07a` | Code on dark backgrounds |

### Typography

| Variable | Default | Description |
|----------|---------|-------------|
| `$font-family-sans-serif` | `"Source Sans Pro", Helvetica, sans-serif` | Main font |
| `$font-family-monospace` | `monospace` | Code font |
| `$presentation-font-size-root` | `40px` | Base font size |
| `$presentation-font-smaller` | `0.7` | Smaller text ratio |
| `$presentation-line-height` | `1.3` | Line height |

### Headings

| Variable | Default | Description |
|----------|---------|-------------|
| `$presentation-heading-font` | `$font-family-sans-serif` | Heading font |
| `$presentation-heading-color` | `$body-color` | Heading colour |
| `$presentation-heading-line-height` | `1.2` | Heading line height |
| `$presentation-heading-letter-spacing` | `normal` | Letter spacing |
| `$presentation-heading-text-transform` | `none` | Text transform |
| `$presentation-heading-text-shadow` | `none` | Text shadow |
| `$presentation-heading-font-weight` | `600` | Font weight |
| `$presentation-h1-font-size` | `2.5em` | H1 size |
| `$presentation-h2-font-size` | `1.6em` | H2 size |
| `$presentation-h3-font-size` | `1.3em` | H3 size |
| `$presentation-h4-font-size` | `1em` | H4 size |
| `$presentation-h1-text-shadow` | `none` | H1 shadow |

### Code Blocks

| Variable | Default | Description |
|----------|---------|-------------|
| `$code-block-bg` | `$body-bg` | Code block background |
| `$code-block-border-color` | `lighten($body-color, 60%)` | Code block border |
| `$code-block-font-size` | `0.55em` | Code block text size |
| `$code-color` | `var(--quarto-hl-fu-color)` | Inline code colour |
| `$code-bg` | `transparent` | Inline code background |

### Layout

| Variable | Default | Description |
|----------|---------|-------------|
| `$border-color` | `lighten($body-color, 30%)` | General border |
| `$border-width` | `1px` | Border width |
| `$border-radius` | `3px` | Border radius |
| `$presentation-block-margin` | `12px` | Block element margin |
| `$presentation-slide-text-align` | `left` | Slide text alignment |
| `$presentation-title-slide-text-align` | `center` | Title slide alignment |

### Callouts

| Variable | Default | Description |
|----------|---------|-------------|
| `$callout-border-width` | `0.3rem` | Left border width |
| `$callout-border-scale` | `0%` | Border colour shift |
| `$callout-icon-scale` | `10%` | Icon colour shift |
| `$callout-margin-top` | `1rem` | Top margin |
| `$callout-margin-bottom` | `1rem` | Bottom margin |
| `$callout-color-note` | `#0d6efd` | Note callout colour |
| `$callout-color-tip` | `#198754` | Tip callout colour |
| `$callout-color-caution` | `#fd7e14` | Caution callout colour |
| `$callout-color-warning` | `#ffc107` | Warning callout colour |
| `$callout-color-important` | `#dc3545` | Important callout colour |

### Tabsets

| Variable | Default | Description |
|----------|---------|-------------|
| `$tabset-border-color` | `$code-block-border-color` | Tab border colour |

---

## CSS Rules

CSS rules in the `/*-- scss:rules --*/` section typically need the `.reveal .slide` prefix:

```scss
/*-- scss:rules --*/

// Target all slides
.reveal .slide {
  background: linear-gradient(to bottom, #1a1a2e, #16213e);
}

// Target specific elements
.reveal .slide h2 {
  border-bottom: 2px solid $link-color;
  padding-bottom: 0.3em;
}

// Target blockquotes
.reveal .slide blockquote {
  border-left: 3px solid $text-muted;
  padding-left: 0.5em;
  font-style: italic;
}

// Target code blocks
.reveal .slide pre code {
  max-height: 500px;
}

// Target tables
.reveal .slide table {
  font-size: 0.8em;
}
```

---

## Common Customisations

### Corporate Branding

```scss
/*-- scss:defaults --*/
$brand-primary: #003366;
$brand-secondary: #ff6600;

$body-bg: #ffffff;
$body-color: #333333;
$link-color: $brand-primary;

$presentation-heading-color: $brand-primary;
$presentation-heading-font: "Arial", sans-serif;

/*-- scss:rules --*/
.reveal .slide h1,
.reveal .slide h2 {
  border-bottom: 3px solid $brand-secondary;
  padding-bottom: 0.2em;
}
```

### Dark Theme

```scss
/*-- scss:defaults --*/
$body-bg: #1e1e2e;
$body-color: #cdd6f4;
$link-color: #89b4fa;
$link-color-hover: #b4befe;

$code-block-bg: #313244;
$code-block-border-color: #45475a;

$presentation-heading-color: #cba6f7;

/*-- scss:rules --*/
.reveal .slide {
  background: linear-gradient(135deg, #1e1e2e 0%, #181825 100%);
}
```

### Custom Fonts

```scss
/*-- scss:defaults --*/
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Fira+Code&display=swap');

$font-family-sans-serif: "Inter", sans-serif;
$font-family-monospace: "Fira Code", monospace;
$presentation-heading-font: "Inter", sans-serif;
$presentation-heading-font-weight: 700;
```

### Gradient Backgrounds

```scss
/*-- scss:rules --*/
.reveal .slide {
  background: linear-gradient(to bottom right, #667eea, #764ba2);
}

// Ensure text is readable
.reveal .slide,
.reveal .slide h1,
.reveal .slide h2,
.reveal .slide h3 {
  color: #ffffff;
}
```

### Title Slide Styling

```scss
/*-- scss:rules --*/
.reveal .slide.title-slide {
  background: url('hero-bg.jpg') center center / cover;
}

.reveal .slide.title-slide h1 {
  font-size: 3em;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}
```

### Table Styling

```scss
/*-- scss:rules --*/
.reveal .slide table {
  border-collapse: collapse;
  width: 100%;
}

.reveal .slide table th {
  background: $link-color;
  color: white;
  padding: 0.5em;
}

.reveal .slide table td {
  border: 1px solid $border-color;
  padding: 0.4em;
}

.reveal .slide table tr:nth-child(even) {
  background: lighten($body-bg, 5%);
}
```

---

## Complete Custom Theme Example

**my-theme.scss:**
```scss
/*-- scss:defaults --*/

// Colours
$brand-primary: #2563eb;
$brand-accent: #f59e0b;

$body-bg: #f8fafc;
$body-color: #1e293b;
$link-color: $brand-primary;
$link-color-hover: darken($brand-primary, 10%);

// Typography
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=JetBrains+Mono&display=swap');

$font-family-sans-serif: "Plus Jakarta Sans", sans-serif;
$font-family-monospace: "JetBrains Mono", monospace;
$presentation-font-size-root: 38px;

// Headings
$presentation-heading-font: "Plus Jakarta Sans", sans-serif;
$presentation-heading-color: $brand-primary;
$presentation-heading-font-weight: 700;

// Code
$code-block-bg: #1e293b;
$code-block-border-color: transparent;

/*-- scss:rules --*/

// Slide backgrounds
.reveal .slide {
  background: linear-gradient(180deg, $body-bg 0%, #e2e8f0 100%);
}

// Heading underlines
.reveal .slide h2 {
  border-bottom: 3px solid $brand-accent;
  padding-bottom: 0.3em;
  margin-bottom: 0.8em;
}

// Code blocks with dark theme
.reveal .slide pre code {
  color: #e2e8f0;
  border-radius: 8px;
  padding: 1em;
}

// Blockquotes
.reveal .slide blockquote {
  background: rgba($brand-primary, 0.1);
  border-left: 4px solid $brand-primary;
  padding: 1em;
  border-radius: 0 8px 8px 0;
}

// Links
.reveal .slide a {
  text-decoration: underline;
  text-underline-offset: 3px;
}

// Title slide
.reveal .slide.title-slide {
  background: linear-gradient(135deg, $brand-primary 0%, darken($brand-primary, 20%) 100%);
}

.reveal .slide.title-slide h1,
.reveal .slide.title-slide .subtitle,
.reveal .slide.title-slide .author,
.reveal .slide.title-slide .date {
  color: white;
}
```

**Usage:**
```yaml
format:
  revealjs:
    theme: my-theme.scss
```
