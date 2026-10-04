# Typst Syntax Reference

Complete syntax reference for Typst's three modes: Markup, Math, and Code.

## Modes Overview

Typst has three syntactical modes:

| Mode | Default Context | Switch To |
|------|-----------------|-----------|
| **Markup** | Document start | `[...]` from code |
| **Math** | Inside `$...$` | `$...$` from markup/code |
| **Code** | After `#` | `#...` from markup, `{...}` block |

## Markup Mode

### Text Formatting

| Syntax | Element | Example |
|--------|---------|---------|
| `*text*` | Strong/bold | `*important*` |
| `_text_` | Emphasis/italic | `_emphasized_` |
| `` `code` `` | Raw/inline code | `` `print()` `` |
| `"quoted"` | Smart quotes | `"Hello"` |
| `'quoted'` | Smart quotes | `'Hi'` |

### Document Structure

| Syntax | Element | Example |
|--------|---------|---------|
| `= Title` | Level 1 heading | `= Introduction` |
| `== Title` | Level 2 heading | `== Background` |
| `=== Title` | Level 3 heading | `=== Details` |
| Blank line | Paragraph break | |
| `\` | Line break | `Line 1 \ Line 2` |

### Lists

```typst
// Bullet list
- First item
- Second item
  - Nested item

// Numbered list
+ First
+ Second
  + Nested

// Term list (definition list)
/ Term: Definition
/ Another: Its definition
```

### Links and References

```typst
https://example.com           // Auto-detected URL
#link("url")[text]            // Custom link text
<my-label>                    // Define label
@my-label                     // Reference label
@bib-key                      // Citation
```

### Special Characters

| Syntax | Result | Description |
|--------|--------|-------------|
| `~` | Non-breaking space | |
| `---` | Em dash (U+2014) | |
| `--` | En dash (–) | |
| `-?` | Soft hyphen | |
| `...` | Ellipsis (…) | |
| `\#` | Literal # | Escape |
| `\*` | Literal * | Escape |
| `\_` | Literal _ | Escape |
| `\u{1F600}` | Unicode 😀 | Hex codepoint |

### Raw Text and Code Blocks

````typst
// Inline raw
`print("hello")`

// Block raw (3+ backticks)
```
Multi-line
raw text
```

// With syntax highlighting
```python
def hello():
    print("Hello")
```
````

## Math Mode

Enter math mode with `$...$`. Block equations use spaces: `$ x^2 $`.

### Basic Syntax

| Syntax | Result | Description |
|--------|--------|-------------|
| `$x$` | Inline math | No spaces |
| `$ x $` | Block math | Spaces at edges |
| `x_i` | Subscript | |
| `x^2` | Superscript | |
| `x_i^2` | Both | Subscript binds tighter |
| `(a+b)/c` | Fraction | Auto-detected |
| `a/b` | Fraction | Simple form |
| `\` | Line break | In block math |
| `&` | Alignment point | For multi-line |

### Functions in Math

```typst
$frac(a, b)$              // Explicit fraction
$sqrt(x)$                 // Square root
$root(n, x)$              // nth root
$vec(a, b, c)$            // Column vector
$mat(1, 2; 3, 4)$         // Matrix (semicolon = new row)
$cases(x &= 1, y &= 2)$   // Cases
$abs(x)$, $norm(x)$       // Absolute value, norm
$floor(x)$, $ceil(x)$     // Floor, ceiling
```

### Symbols

```typst
// Greek letters
$alpha$, $beta$, $gamma$, $delta$, $epsilon$
$Alpha$, $Beta$, $Gamma$, $Delta$

// Operators
$sum$, $product$, $integral$
$lim$, $max$, $min$, $sup$, $inf$

// Relations
$=$, $!=$, $<$, $>$, $<=$, $>=$
$approx$, $equiv$, $subset$, $supset$

// Arrows
$arrow$, $arrow.r$, $arrow.l$, $arrow.double$
$=>$, $<=>$, $|->$

// Sets
$NN$, $ZZ$, $QQ$, $RR$, $CC$  // Number sets
$in$, $subset$, $union$, $inter$
$emptyset$, $forall$, $exists$

// Misc
$infinity$, $pi$, $partial$, $nabla$
$dot$, $times$, $div$
```

### Text in Math

```typst
$x "is positive"$         // Quoted = text mode
$x quad "where" quad y$   // quad = large space
$f(x) = cases(
  1 &"if" x > 0,
  0 &"otherwise"
)$
```

### Styling in Math

```typst
$bold(x)$                 // Bold
$italic(x)$               // Italic (default for letters)
$upright(x)$              // Upright/roman
$cal(A)$                  // Calligraphic
$bb(R)$                   // Blackboard bold
$frak(A)$                 // Fraktur
$serif(x)$, $sans(x)$     // Font variants
$mono(x)$                 // Monospace
```

## Code Mode

### Entering Code Mode

```typst
// Single expression in markup
#let x = 5

// Code block
#{
  let a = 1
  let b = 2
  a + b
}

// In function arguments (automatically code)
#text(size: 12pt, font: "Arial")
```

### Variables and Bindings

```typst
#let name = "Typst"
#let count = 42
#let ratio = 50%
#let size = 12pt
#let color = rgb("#ff0000")
#let items = (1, 2, 3)
#let dict = (key: "value", num: 5)
#let greeting = [Hello, *world*!]
```

### Data Types

| Type | Example | Description |
|------|---------|-------------|
| `none` | `none` | Absence of value |
| `auto` | `auto` | Automatic value |
| `bool` | `true`, `false` | Boolean |
| `int` | `42`, `0xff` | Integer |
| `float` | `3.14`, `1e-5` | Floating point |
| `str` | `"hello"` | String |
| `content` | `[Hello]` | Markup content |
| `array` | `(1, 2, 3)` | Ordered collection |
| `dictionary` | `(a: 1, b: 2)` | Key-value pairs |
| `length` | `12pt`, `1em`, `2cm` | Physical length |
| `ratio` | `50%` | Percentage |
| `relative` | `50% + 1cm` | Combined |
| `fraction` | `1fr` | Fractional |
| `color` | `red`, `rgb(...)` | Colour |
| `function` | `x => x + 1` | Function |
| `path` | `path("img.png")` | File path, resolves relative to its defining file (0.15+) |

### Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `+`, `-`, `*`, `/` | Arithmetic | `1 + 2` |
| `==`, `!=` | Equality | `x == 5` |
| `<`, `>`, `<=`, `>=` | Comparison | `x < 10` |
| `and`, `or`, `not` | Logical | `a and b` |
| `in`, `not in` | Membership | `"a" in dict` |
| `=` | Assignment | `x = 5` |
| `+=`, `-=` | Compound assign | `x += 1` |

### Control Flow

```typst
// Conditional
#if condition {
  [True branch]
} else if other {
  [Other branch]
} else {
  [False branch]
}

// For loop
#for item in items [
  Item: #item \
]

#for (key, value) in dict [
  #key: #value \
]

// While loop
#{
  let i = 0
  while i < 5 {
    [#i ]
    i += 1
  }
}

// Break and continue
#for x in range(10) {
  if x == 5 { break }
  if calc.rem(x, 2) == 0 { continue }
  [#x ]
}
```

### Functions

```typst
// Define function
#let greet(name) = [Hello, #name!]

// With default argument
#let greet(name, excited: false) = {
  let punct = if excited { "!" } else { "." }
  [Hello, #name#punct]
}

// Call function
#greet("World")
#greet("Typst", excited: true)

// Anonymous function
#let double = x => x * 2
#range(5).map(x => x * x)

// Rest arguments
#let sum(..nums) = {
  nums.pos().fold(0, (a, b) => a + b)
}
```

### Methods

```typst
// String methods
#"hello".len()              // 5
#"hello".contains("ell")    // true
#"hello".starts-with("he")  // true
#"hello".replace("l", "L")  // heLLo
#"a,b,c".split(",")         // ("a", "b", "c")

// Array methods
#(1, 2, 3).len()            // 3
#(1, 2, 3).first()          // 1
#(1, 2, 3).last()           // 3
#(1, 2, 3).at(1)            // 2
#(1, 2, 3).map(x => x * 2)  // (2, 4, 6)
#(1, 2, 3).filter(x => x > 1) // (2, 3)
#(1, 2, 3).fold(0, (a, b) => a + b) // 6
#(1, 2, 3).join(", ")       // "1, 2, 3"
#(1, 2, 3).rev()            // (3, 2, 1)
#(1, 2, 3).sorted()         // (1, 2, 3)

// Dictionary methods
#(a: 1, b: 2).keys()        // ("a", "b")
#(a: 1, b: 2).values()      // (1, 2)
#(a: 1, b: 2).pairs()       // (("a", 1), ("b", 2))
#(a: 1, b: 2).at("a")       // 1
#(a: 1, b: 2).map(v => v * 2)   // (a: 2, b: 4) - values only, 0.15+
#(a: 1, b: 2).filter(v => v > 1) // (b: 2) - values only, 0.15+
```

### Modules

```typst
// Import entire module
#import "utils.typ"
#utils.my-function()

// Import specific items
#import "utils.typ": my-function, my-variable

// Import with alias
#import "utils.typ": my-function as mf

// Import all
#import "utils.typ": *

// Include (insert content)
#include "chapter.typ"

// Package import
#import "@preview/package:1.0.0": item
```

## Comments

```typst
// Single line comment

/* Multi-line
   comment */

/* Comments /* can */ nest */
```

## Identifiers

Valid identifier names:
- Start with letter or underscore
- Contain letters, numbers, hyphens, underscores
- Case-sensitive
- Kebab-case recommended: `my-variable`

```typst
#let valid-name = 1
#let _private = 2
#let αβγ = 3        // Unicode allowed
```
