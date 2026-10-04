# Code Blocks in Quarto Reveal.js

Syntax highlighting, line numbers, executable code, and code animations.

## Table of Contents

- [Basic Code Blocks](#basic-code-blocks)
- [Syntax Highlighting](#syntax-highlighting)
- [Line Numbers and Highlighting](#line-numbers-and-highlighting)
- [Code Block Appearance](#code-block-appearance)
- [Executable Code](#executable-code)
- [Code Output Location](#code-output-location)
- [Code Animation](#code-animation)
- [Code Annotations](#code-annotations)

---

## Basic Code Blocks

### Static Code Block

````markdown
```python
def hello():
    print("Hello, World!")
```
````

### With Language Specification

````markdown
```{.python}
def hello():
    print("Hello, World!")
```
````

### Filename Display

````markdown
```{.python filename="app.py"}
def hello():
    print("Hello, World!")
```
````

Displays "app.py" as a header above the code.

---

## Syntax Highlighting

### Available Themes

**Adaptive themes** (auto light/dark):
- `a11y`, `arrow`, `atom-one`, `ayu`, `breeze`, `github`, `gruvbox`

**Standard themes:**
- `pygments`, `tango`, `espresso`, `zenburn`, `kate`, `monochrome`, `breezedark`, `haddock`

**Extended themes:**
- `dracula`, `monokai`, `nord`, `oblivion`, `printing`, `radical`, `solarized`, `vim-dark`

### Configuration

```yaml
format:
  revealjs:
    syntax-highlighting: github
```

### Adaptive Theme (Light/Dark)

```yaml
format:
  revealjs:
    syntax-highlighting:
      light: github
      dark: github-dark
```

### Custom Theme File

```yaml
format:
  revealjs:
    syntax-highlighting: custom.theme
```

---

## Line Numbers and Highlighting

### Enable Line Numbers

**Global:**
```yaml
format:
  revealjs:
    code-line-numbers: true
```

**Per block:**
````markdown
```{.python code-line-numbers="true"}
line 1
line 2
line 3
```
````

### Highlight Specific Lines

````markdown
```{.python code-line-numbers="2-3"}
line 1
line 2 - highlighted
line 3 - highlighted
line 4
```
````

### Highlight Patterns

| Pattern | Result |
|---------|--------|
| `"2"` | Line 2 only |
| `"2-4"` | Lines 2 through 4 |
| `"2,5"` | Lines 2 and 5 |
| `"2-4,6"` | Lines 2-4 and 6 |
| `"|2|4"` | Progressive: none → line 2 → line 4 |
| `"1|2-3|5"` | Progressive: line 1 → lines 2-3 → line 5 |

### Progressive Highlighting (Animation)

Reveal highlighted lines step by step:

````markdown
```{.python code-line-numbers="|1|3-4|6"}
import pandas as pd

df = pd.read_csv("data.csv")
df = df.dropna()

result = df.groupby("category").sum()
```
````

Steps:
1. No highlighting (show all code)
2. Highlight line 1
3. Highlight lines 3-4
4. Highlight line 6

---

## Code Block Appearance

### Overflow Handling

```yaml
format:
  revealjs:
    code-overflow: scroll  # scroll (default) or wrap
```

Per block:
````markdown
```{.python code-overflow="wrap"}
very_long_line_that_would_normally_scroll_but_now_wraps_to_the_next_line
```
````

### Maximum Height

```yaml
format:
  revealjs:
    code-block-height: 500px
```

### Background and Border

```yaml
format:
  revealjs:
    code-block-bg: true              # Grey background
    code-block-border-left: true     # Left border
    code-block-border-left: "#3498db"  # Custom colour
```

### Copy Button

```yaml
format:
  revealjs:
    code-copy: hover  # true, false, hover (default)
```

### Font Size in Theme

```scss
/*-- scss:defaults --*/
$code-block-font-size: 0.6em;  # Default is 0.55em
```

---

## Executable Code

Run code and display output in slides.

### Python with Jupyter

```yaml
---
title: "Code Demo"
format: revealjs
jupyter: python3
---
```

````markdown
```{python}
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
plt.plot(x, np.sin(x))
plt.show()
```
````

### R with Knitr

```yaml
---
title: "Code Demo"
format: revealjs
---
```

````markdown
```{r}
library(ggplot2)
ggplot(mtcars, aes(wt, mpg)) + geom_point()
```
````

### Show/Hide Source Code

**Hide code, show output:**
````markdown
```{python}
#| echo: false
print("Only output shows")
```
````

**Show code, hide output:**
````markdown
```{python}
#| output: false
x = 1 + 1
```
````

**Show both:**
````markdown
```{python}
#| echo: true
print("Both code and output")
```
````

### Global Execution Options

```yaml
execute:
  echo: true       # Show source code
  eval: true       # Run code
  output: true     # Show output
  warning: false   # Hide warnings
  error: false     # Stop on errors
```

---

## Code Output Location

Control where output appears relative to code.

### Options

| Value | Description |
|-------|-------------|
| `default` | Below the code |
| `fragment` | Below, but delayed (click to reveal) |
| `slide` | On the next slide |
| `column` | Side by side with code |
| `column-fragment` | Side by side, delayed |

### Usage

````markdown
```{python}
#| output-location: column
import matplotlib.pyplot as plt
plt.plot([1, 2, 3], [1, 4, 9])
plt.show()
```
````

### Column Layout Example

````markdown
```{python}
#| output-location: column
#| code-line-numbers: true

# Data processing
data = [1, 2, 3, 4, 5]
squared = [x**2 for x in data]
print(squared)
```
````

Shows code on left, output on right.

### Fragment Output

````markdown
```{python}
#| output-location: fragment

# Click to reveal output
print("Surprise!")
```
````

---

## Code Animation

Animate code changes between slides using auto-animate.

### Basic Code Animation

````markdown
## {auto-animate=true}

```python
# Step 1
x = 1
```

## {auto-animate=true}

```python
# Step 1
x = 1
# Step 2
y = 2
```

## {auto-animate=true}

```python
# Step 1
x = 1
# Step 2
y = 2
# Step 3
z = x + y
```
````

### Highlight + Animate

````markdown
## {auto-animate=true}

```{.python code-line-numbers="1"}
def process(data):
    return data
```

## {auto-animate=true}

```{.python code-line-numbers="2-3"}
def process(data):
    cleaned = data.strip()
    return cleaned
```
````

---

## Code Annotations

Add numbered explanations to code lines.

### Basic Annotations

````markdown
```python
import pandas as pd  # <1>

df = pd.read_csv("data.csv")  # <2>
df = df.dropna()  # <3>
```

1. Import the pandas library
2. Load data from CSV file
3. Remove rows with missing values
````

### Annotation Styles

```yaml
format:
  revealjs:
    code-annotations: below  # below, hover, select
```

| Style | Behaviour |
|-------|-----------|
| `below` | Annotations shown below code |
| `hover` | Show annotation on hover |
| `select` | Click to show annotation |

### Annotation Example

````markdown
```{.python code-annotations="hover"}
def calculate_total(items):  # <1>
    total = 0  # <2>
    for item in items:  # <3>
        total += item.price  # <4>
    return total  # <5>
```

1. Function takes a list of items
2. Initialise running total
3. Iterate through each item
4. Add item price to total
5. Return the final sum
````

---

## Code Folding

Collapse code blocks by default.

```yaml
format:
  revealjs:
    code-fold: true
    code-summary: "Show code"
```

Per block:
````markdown
```{python}
#| code-fold: true
#| code-summary: "Expand to see implementation"

def complex_function():
    # Long implementation...
    pass
```
````

Options:
- `false` - No folding (default)
- `true` - Collapsed by default
- `show` - Expanded with fold option

---

## Complete Example

```yaml
---
title: "Code Presentation"
format:
  revealjs:
    theme: dark
    syntax-highlighting: monokai
    code-line-numbers: true
    code-copy: hover
    code-overflow: scroll
    code-block-height: 400px
    code-annotations: hover
jupyter: python3
execute:
  echo: true
  warning: false
---
```

````markdown
## Data Analysis

```{python}
#| output-location: column
#| code-line-numbers: "|1-2|4-5|7"

import pandas as pd  # <1>
import matplotlib.pyplot as plt

df = pd.read_csv("sales.csv")  # <2>
df = df.dropna()

df.plot(kind="bar")  # <3>
plt.show()
```

1. Import required libraries
2. Load and clean data
3. Create visualisation
````
