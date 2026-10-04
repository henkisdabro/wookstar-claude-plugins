# Typst Math Reference

Complete guide to mathematical typesetting in Typst.

## Basic Math Mode

### Inline vs Block

```typst
// Inline math (no spaces)
The equation $E = m c^2$ describes mass-energy equivalence.

// Block math (spaces at edges)
$ E = m c^2 $

// Block math takes full width and centers
```

### Variables and Letters

- Single letters render as-is: `$x$` → _x_
- Multiple letters are interpreted as functions/symbols: `$sin$` → sin
- For multi-letter variables, use quotes: `$"mass"$` → mass

```typst
$x y = x times y$              // xy with implied multiplication
$"total" = x + y$              // "total" as text
$pi r^2$                       // pi is a symbol, r is variable
```

## Subscripts and Superscripts

```typst
$x^2$                          // Superscript
$x_i$                          // Subscript
$x_i^2$                        // Both (subscript binds tighter)
$x^2_i$                        // Same result
$x_(i+1)$                      // Grouped subscript
$x^(n+1)$                      // Grouped superscript
$x_1^2, x_2^2, ..., x_n^2$     // Multiple terms
```

### Limits on Large Operators

```typst
// Limits appear below/above in block mode
$ sum_(i=0)^n x_i $
$ integral_0^infinity f(x) dif x $
$ product_(k=1)^n k $

// Force limits position
$ limits(sum)_(i=0)^n $        // Force below/above
$ scripts(sum)_(i=0)^n $       // Force as super/subscript
```

## Fractions

```typst
$a/b$                          // Simple fraction
$(a+b)/(c+d)$                  // Grouped fraction
$frac(a, b)$                   // Explicit fraction function
$frac(a+b, c+d)$               // No parens needed in function

// Nested fractions
$frac(1, 1 + frac(1, 2))$

// Continued fractions
$ 1 + frac(1, 2 + frac(1, 3 + frac(1, 4))) $
```

## Roots

```typst
$sqrt(x)$                      // Square root
$sqrt(a^2 + b^2)$              // With expression
$root(3, x)$                   // Cube root
$root(n, x)$                   // nth root
$root(4, a^2 + b^2)$           // 4th root of expression
```

## Matrices and Vectors

```typst
// Vector (column)
$vec(a, b, c)$

// Vector with custom delimiter
$vec(delim: "[", a, b, c)$

// Matrix (semicolon = new row)
$mat(1, 2; 3, 4)$

// Matrix with delimiters
$mat(delim: "[", 1, 2; 3, 4)$
$mat(delim: "|", a, b; c, d)$   // Determinant style

// Augmented matrix
$mat(augment: #2, 1, 2, 3; 4, 5, 6)$

// Row vector
$mat(1, 2, 3)$

// Large matrices
$mat(
  1, 2, 3;
  4, 5, 6;
  7, 8, 9;
)$
```

## Brackets and Delimiters

```typst
// Auto-scaling (default)
$(a/b)$                        // Parentheses scale
$[a/b]$                        // Brackets scale
${a/b}$                        // Braces scale (escape needed)
$lr(|a/b|)$                    // Absolute value

// Manual sizing
$lr((a/b), size: #50%)$
// 0.15+: size resolves relative to the inner content's height only
// (delimiters excluded) - display-sized glyphs may need larger targets

// Common delimiters
$abs(x)$                       // |x|
$norm(x)$                      // ||x||
$floor(x)$                     // ⌊x⌋
$ceil(x)$                      // ⌈x⌉
$round(x)$                     // ⌊x⌉ nearest-integer brackets

// Prevent scaling (escape)
$\{x\}$                        // Literal braces, no scaling

// Mixed delimiters with lr
$lr([0, 1))$                   // Half-open interval
```

## Alignment and Multi-line

```typst
// Multi-line with alignment
$ x &= a + b \
    &= c + d $

// Multiple alignment points
$ x &= 1 &quad& "first" \
  y &= 2 && "second" $

// Cases
$f(x) = cases(
  1 &"if" x > 0,
  0 &"if" x = 0,
  -1 &"if" x < 0,
)$

// Numbered equations (with equation element)
#set math.equation(numbering: "(1)")
$ E = m c^2 $
```

## Greek Letters

### Lowercase

| Symbol | Typst | Symbol | Typst |
|--------|-------|--------|-------|
| α | `alpha` | ν | `nu` |
| β | `beta` | ξ | `xi` |
| γ | `gamma` | ο | `omicron` |
| δ | `delta` | π | `pi` |
| ε | `epsilon` | ρ | `rho` |
| ζ | `zeta` | σ | `sigma` |
| η | `eta` | τ | `tau` |
| θ | `theta` | υ | `upsilon` |
| ι | `iota` | φ | `phi` |
| κ | `kappa` | χ | `chi` |
| λ | `lambda` | ψ | `psi` |
| μ | `mu` | ω | `omega` |

### Uppercase

| Symbol | Typst | Symbol | Typst |
|--------|-------|--------|-------|
| Γ | `Gamma` | Σ | `Sigma` |
| Δ | `Delta` | Υ | `Upsilon` |
| Θ | `Theta` | Φ | `Phi` |
| Λ | `Lambda` | Ψ | `Psi` |
| Ξ | `Xi` | Ω | `Omega` |
| Π | `Pi` | | |

### Variants

```typst
$phi.alt$                      // φ variant
$epsilon.alt$                  // ε variant
$theta.alt$                    // θ variant
```

## Operators

### Binary Operators

| Symbol | Typst | Description |
|--------|-------|-------------|
| + | `+` | Plus |
| − | `-` | Minus |
| × | `times` | Times |
| ÷ | `div` | Division |
| · | `dot` | Dot product |
| ∘ | `compose` | Composition |
| ⊗ | `times.o` | Tensor product |
| ⊕ | `plus.o` | Direct sum |

### Relations

| Symbol | Typst | Description |
|--------|-------|-------------|
| = | `=` | Equals |
| ≠ | `!=` or `eq.not` | Not equal |
| < | `<` | Less than |
| > | `>` | Greater than |
| ≤ | `<=` or `lt.eq` | Less or equal |
| ≥ | `>=` or `gt.eq` | Greater or equal |
| ≈ | `approx` | Approximately |
| ∼ | `tilde` | Similar |
| ≡ | `equiv` | Equivalent |
| ∝ | `prop` | Proportional |
| ≺ | `prec` | Precedes |
| ≻ | `succ` | Succeeds |

### Set Operations

| Symbol | Typst | Description |
|--------|-------|-------------|
| ∈ | `in` | Element of |
| ∉ | `in.not` | Not element |
| ⊂ | `subset` | Subset |
| ⊃ | `supset` | Superset |
| ⊆ | `subset.eq` | Subset or equal |
| ⊇ | `supset.eq` | Superset or equal |
| ∪ | `union` | Union |
| ∩ | `inter` | Intersection |
| ∖ | `without` | Set minus |
| ∅ | `emptyset` | Empty set |

### Logic

| Symbol | Typst | Description |
|--------|-------|-------------|
| ∧ | `and` | Logical and |
| ∨ | `or` | Logical or |
| ¬ | `not` | Negation |
| ∀ | `forall` | For all |
| ∃ | `exists` | Exists |
| ⊤ | `top` | True |
| ⊥ | `bot` | False |
| ⊢ | `tack.r` | Turnstile |

## Big Operators

```typst
$sum$, $product$, $integral$
$sum_(i=1)^n$, $product_(k=1)^n$
$integral_a^b$, $integral.double$, $integral.triple$
$union.big$, $inter.big$
$plus.big$, $times.big$
```

## Arrows

```typst
// Basic arrows
$arrow$, $arrow.r$, $arrow.l$
$arrow.t$, $arrow.b$           // Up, down
$arrow.double$                 // Double shaft
$arrow.long$                   // Long arrow

// Special arrows
$=>$                           // Implies
$<=>$                          // If and only if
$|->$                          // Maps to
$arrow.hook$                   // Hooked arrow
$arrow.squiggly$               // Squiggly
$arrow.dashed$                 // Dashed

// Arrow as accent
$arrow(A B)$                   // Arrow over AB
```

## Accents and Decorations

```typst
$hat(x)$                       // x̂
$tilde(x)$                     // x̃
$macron(x)$                    // x̄ (overline)
$dot(x)$                       // ẋ
$dot.double(x)$                // ẍ
$acute(x)$                     // x́
$grave(x)$                     // x̀
$breve(x)$                     // x̆
$vec(x)$                       // x⃗
$overline(x y)$                // Overline multiple
$underline(x y)$               // Underline

// Braces over/under
$overbrace(1 + 2 + ... + n)^("n terms")$
$underbrace(1 + 2 + ... + n)_("n terms")$
$overbracket(...)$, $underbracket(...)$
```

## Number Sets

```typst
$NN$                           // Natural numbers ℕ
$ZZ$                           // Integers ℤ
$QQ$                           // Rationals ℚ
$RR$                           // Real numbers ℝ
$CC$                           // Complex numbers ℂ
```

## Calculus

```typst
$dif x$                        // Differential
$partial f$                    // Partial derivative
$nabla f$                      // Gradient
$Delta x$                      // Difference

// Derivatives
$frac(dif y, dif x)$
$frac(partial f, partial x)$
$frac(partial^2 f, partial x^2)$

// Integrals
$integral_a^b f(x) dif x$
$integral.double_D f(x,y) dif A$
$integral.cont f(z) dif z$     // Contour integral
```

## Spacing

```typst
$a b$                          // Normal space (multiplication)
$a thin b$                     // Thin space
$a med b$                      // Medium space
$a thick b$                    // Thick space
$a quad b$                     // Quad space
$a wide b$                     // Wide space
$a#h(1em)b$                    // Custom space
```

## Text in Math

```typst
$x "is positive"$              // Text mode
$f(x) = cases(
  0 &"if" x < 0,
  1 &"otherwise"
)$

$lim_(n -> infinity)$          // Use arrow symbol
$max{x, y}$                    // max is recognized
```

## Styling

```typst
// Weight and style
$bold(x)$                      // Bold
$italic(x)$                    // Italic
$upright(x)$                   // Upright (roman)
$bold(italic(x))$              // Bold italic

// Font variants
$cal(A)$                       // Calligraphic 𝒜
$bb(R)$                        // Blackboard bold ℝ
$frak(A)$                      // Fraktur 𝔄
$mono(x)$                      // Monospace
$sans(x)$                      // Sans-serif
$serif(x)$                     // Serif

// Typst 0.15 changed the default calligraphic letterforms (New Computer
// Modern Math 8.1.0). Restore the pre-0.15 style with:
#show math.equation: set text(stylistic-set: 6)

// Size variants (in context)
$display(frac(a,b))$           // Display size
$inline(frac(a,b))$            // Inline size
$script(frac(a,b))$            // Script size
$sscript(frac(a,b))$           // Scriptscript size
```

## Equation Numbering

```typst
#set math.equation(numbering: "(1)")

$ E = m c^2 $ <eq:einstein>

Equation @eq:einstein shows...

// Custom numbering by section
#set math.equation(numbering: num => {
  let h = counter(heading).get()
  numbering("(1.1)", ..h, num)
})
```

## Accessibility

Provide alternative text for equations:

```typst
#math.equation(
  alt: "E equals m c squared",
  block: true,
  $ E = m c^2 $,
)
```
