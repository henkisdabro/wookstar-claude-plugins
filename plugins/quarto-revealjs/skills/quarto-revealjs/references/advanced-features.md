# Advanced Quarto Reveal.js Features

Fragments, auto-animate, absolute positioning, and other advanced techniques.

## Table of Contents

- [Fragments](#fragments)
- [Auto-Animate](#auto-animate)
- [Absolute Positioning](#absolute-positioning)
- [Layout Helpers](#layout-helpers)
- [Backgrounds](#backgrounds)
- [Slide Visibility](#slide-visibility)
- [Custom CSS Classes](#custom-css-classes)

---

## Fragments

Fragments reveal content incrementally within a slide.

### Basic Fragment

```markdown
::: {.fragment}
This appears when you advance
:::
```

### Fragment Effects

| Class | Effect |
|-------|--------|
| `.fragment` | Fade in (default) |
| `.fragment .fade-out` | Fade out |
| `.fragment .fade-up` | Slide up while fading in |
| `.fragment .fade-down` | Slide down while fading in |
| `.fragment .fade-left` | Slide left while fading in |
| `.fragment .fade-right` | Slide right while fading in |
| `.fragment .fade-in-then-out` | Fade in, then out on next step |
| `.fragment .fade-in-then-semi-out` | Fade in, then semi-transparent |
| `.fragment .grow` | Grow in size |
| `.fragment .shrink` | Shrink in size |
| `.fragment .strike` | Strike through |
| `.fragment .highlight-red` | Turn red |
| `.fragment .highlight-green` | Turn green |
| `.fragment .highlight-blue` | Turn blue |
| `.fragment .highlight-current-red` | Red only while current |
| `.fragment .highlight-current-green` | Green only while current |
| `.fragment .highlight-current-blue` | Blue only while current |

### Usage Examples

```markdown
## Effects Demo

::: {.fragment .fade-in}
First I appear
:::

::: {.fragment .highlight-red}
Then I turn red
:::

::: {.fragment .fade-out}
Then I disappear
:::
```

### Fragment Ordering

Control order with `fragment-index`:

```markdown
::: {.fragment fragment-index=3}
Third (despite position)
:::

::: {.fragment fragment-index=1}
First
:::

::: {.fragment fragment-index=2}
Second
:::
```

### Nested Fragments

Apply multiple effects sequentially:

```markdown
::: {.fragment .fade-in}
::: {.fragment .highlight-red}
::: {.fragment .fade-out}
Fades in, turns red, then fades out
:::
:::
:::
```

### Fragments on Lists

```markdown
::: {.incremental}
- First point
- Second point
- Third point
:::
```

Or use inline fragments:

```markdown
- [First point]{.fragment}
- [Second point]{.fragment}
- [Third point]{.fragment}
```

---

## Auto-Animate

Automatically animate changes between consecutive slides.

### Basic Auto-Animate

Add `auto-animate=true` to consecutive slides:

```markdown
## {auto-animate=true}

::: {style="margin-top: 100px;"}
Animating content
:::

## {auto-animate=true}

::: {style="margin-top: 200px; font-size: 2em; color: red;"}
Animating content
:::
```

### Element Matching with data-id

Explicitly pair elements:

```markdown
## {auto-animate=true}

::: {data-id="box" style="background: blue; width: 100px; height: 100px;"}
:::

## {auto-animate=true}

::: {data-id="box" style="background: red; width: 300px; height: 150px;"}
:::
```

### Code Animation

Animate code changes:

````markdown
## {auto-animate=true}

```python
def greet():
    print("Hello")
```

## {auto-animate=true}

```python
def greet(name):
    print(f"Hello, {name}!")
```
````

### Animation Settings

**Global settings:**
```yaml
format:
  revealjs:
    auto-animate-easing: ease-in-out
    auto-animate-duration: 0.8
    auto-animate-unmatched: false
```

**Per-slide settings:**
```markdown
## {auto-animate=true auto-animate-easing="ease-out" auto-animate-duration="0.5"}
```

**Per-element delay:**
```markdown
::: {data-id="box" auto-animate-delay="0.2"}
Delayed animation
:::
```

### Animatable Properties

These CSS properties animate:
- `opacity`
- `color`, `background-color`, `border-color`
- `transform`
- `width`, `height`
- `margin`, `padding`
- `font-size`
- `line-height`
- `letter-spacing`
- `border-width`, `border-radius`

---

## Absolute Positioning

Place elements at specific coordinates.

### Basic Positioning

```markdown
![](image.png){.absolute top=100 left=50}
```

### Available Attributes

| Attribute | Description |
|-----------|-------------|
| `top` | Distance from top (px or CSS units) |
| `left` | Distance from left |
| `bottom` | Distance from bottom |
| `right` | Distance from right |
| `width` | Element width |
| `height` | Element height |

### Examples

```markdown
## Positioned Elements

![Logo](logo.png){.absolute top=10 right=10 width="100"}

![Main](hero.png){.absolute top=200 left=0 width="400" height="300"}

::: {.absolute bottom=50 left=50}
Caption text here
:::
```

### Layered Images

```markdown
## Layered Composition

![Background](bg.png){.absolute top=0 left=0 width="100%"}
![Foreground](fg.png){.absolute top=100 left=200}
![Overlay](overlay.png){.absolute top=50 right=50}
```

---

## Layout Helpers

### Stacked Elements

Centre and layer elements on top of each other:

```markdown
::: {.r-stack}
![](image1.png){.fragment}
![](image2.png){.fragment}
![](image3.png){.fragment}
:::
```

### Fit Text

Scale text to fill the slide width:

```markdown
::: {.r-fit-text}
BIG TEXT
:::
```

### Stretch

Make an element fill remaining vertical space:

```markdown
## Slide Title

![](image.png){.r-stretch}

Footer text
```

### Centre Slide

Vertically centre all content:

```markdown
## Centred Slide {.center}

This content is vertically centred
```

### Smaller Text

Reduce font size for dense content:

```markdown
## Dense Content {.smaller}

Lots of text that needs to fit...
```

### Scrollable Content

Enable scrolling for overflow:

```markdown
## Long Content {.scrollable}

Very long content that scrolls...
```

---

## Backgrounds

### Colour Backgrounds

```markdown
## Dark Slide {background-color="#1a1a2e"}

## Branded Slide {background-color="navy"}
```

### Gradient Backgrounds

```markdown
## Gradient {background-gradient="linear-gradient(to bottom, #283b95, #17b2c3)"}

## Radial {background-gradient="radial-gradient(circle, #ff6b6b, #4ecdc4)"}
```

### Image Backgrounds

```markdown
## Hero Slide {background-image="hero.jpg"}

## Tiled {background-image="pattern.png" background-size="100px" background-repeat="repeat"}

## Faded {background-image="photo.jpg" background-opacity="0.3"}
```

**Background image attributes:**
- `background-image` - Image URL
- `background-size` - `cover`, `contain`, or dimensions
- `background-position` - `center`, `top left`, etc.
- `background-repeat` - `repeat`, `no-repeat`
- `background-opacity` - 0 to 1

### Video Backgrounds

```markdown
## Video Slide {background-video="video.mp4" background-video-loop="true" background-video-muted="true"}
```

### IFrame Backgrounds

```markdown
## Web Content {background-iframe="https://example.com" background-interactive="true"}
```

### Title Slide Background

```yaml
title-slide-attributes:
  data-background-image: "hero.jpg"
  data-background-size: cover
  data-background-opacity: "0.7"
```

---

## Slide Visibility

### Hidden Slides

Skip a slide during presentation:

```markdown
## Hidden Slide {visibility="hidden"}

This slide won't show
```

### Uncounted Slides

Show but don't count in numbering:

```markdown
## Bonus Content {visibility="uncounted"}

Not counted in slide numbers
```

---

## Custom CSS Classes

### Define Custom Classes

In your SCSS theme:

```scss
/*-- scss:rules --*/
.reveal .slide .highlight-box {
  background: #ffeb3b;
  padding: 1em;
  border-radius: 8px;
}

.reveal .slide .warning {
  color: #d32f2f;
  font-weight: bold;
}
```

### Use Custom Classes

```markdown
::: {.highlight-box}
Important information here
:::

[Warning message]{.warning}
```

### Per-Slide Classes

```markdown
## Special Slide {.custom-class}
```

---

## Combining Techniques

### Animated Build-Up

```markdown
## Building a Diagram {auto-animate=true}

::: {data-id="box1" .absolute top=200 left=100 style="background: blue; width: 100px; height: 100px;"}
A
:::

## Building a Diagram {auto-animate=true}

::: {data-id="box1" .absolute top=200 left=100 style="background: blue; width: 100px; height: 100px;"}
A
:::

::: {data-id="box2" .absolute top=200 left=300 style="background: green; width: 100px; height: 100px;"}
B
:::

## Building a Diagram {auto-animate=true}

::: {data-id="box1" .absolute top=200 left=100 style="background: blue; width: 100px; height: 100px;"}
A
:::

::: {data-id="box2" .absolute top=200 left=300 style="background: green; width: 100px; height: 100px;"}
B
:::

::: {data-id="arrow" .absolute top=230 left=200 style="font-size: 2em;"}
→
:::
```

### Reveal with Background Change

```markdown
## Light Start {background-color="white"}

::: {.fragment}
Content appears
:::

## Dark Transition {background-color="#1a1a2e" .fragment}

Content on dark background
```
