# Tampermonkey Version Numbering

Rules for script version comparison and update detection.

---

## Overview

The `@version` tag determines:
- Whether updates are available
- Version comparison in the script list
- Update check eligibility (required for auto-updates)

```javascript
// @version 1.0.0
```

---

## Version Comparison Rules

Tampermonkey compares versions segment by segment. Higher = newer.

### Basic Numeric Versions

```
1.0 < 1.1 < 1.2 < 2.0
1.9 < 1.10 < 1.11
1.0.0 < 1.0.1 < 1.1.0
```

**Note:** `1.9 < 1.10` (numeric comparison, not string)

### Equivalent Versions

These are considered equal:

```
1 == 1. == 1.0 == 1.0.0
1.1 == 1.1.0 == 1.1.00
16.4 == 16.04
```

### Pre-release Tags

Pre-release versions are **lower** than their release counterparts:

```
1.0-alpha < 1.0-beta < 1.0
1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0
1.10.0-alpha < 1.10.0
```

### Alpha vs Release Order

```
Alpha-v1 < Alpha-v2 < Alpha-v10 < Beta < 1.0
0.5pre3 < 0.5preliminary < 0.6pre4
```

---

## Complete Version Hierarchy

From lowest to highest:

```
Alpha-v1
Alpha-v2
Alpha-v10
Beta
0.5pre3
0.5preliminary
0.6pre4
0.6pre5
0.7pre4
0.7pre10
1.-1
1 == 1. == 1.0 == 1.0.0
1.1a
1.1aa
1.1ab
1.1b
1.1c
1.1.-1
1.1 == 1.1.0 == 1.1.00
1.1.1.1.1
1.1.1.1.2
1.1.1.1
1.10.0-alpha
1.10 == 1.10.0
1.11.0-0.3.7
1.11.0-alpha
1.11.0-alpha.1
1.11.0-alpha+1
1.12+1 == 1.12+1.0
1.12+1.1 == 1.12+1.1.0
1.12+2
1.12+2.1
1.12+3
1.12+4
1.12
2.0
16.4 == 16.04
2023-08-17.alpha
2023-08-17
2023-08-17_14-04 == 2023-08-17_14-04.0
2023-08-17+alpha
2023-09-11_14-0
```

---

## Recommended Version Formats

### Semantic Versioning (Recommended)

```javascript
// Major.Minor.Patch
// @version 1.0.0    // Initial release
// @version 1.0.1    // Bug fix
// @version 1.1.0    // New feature
// @version 2.0.0    // Breaking change
```

### With Pre-release Tags

```javascript
// @version 1.0.0-alpha
// @version 1.0.0-alpha.1
// @version 1.0.0-beta
// @version 1.0.0-rc.1
// @version 1.0.0
```

### Date-Based Versions

```javascript
// @version 2024-01-15
// @version 2024-01-15.1    // Second release same day
// @version 2024-01-16
```

### Date-Time Based

```javascript
// @version 2024-01-15_14-30
// @version 2024-01-15_16-45
```

---

## Best Practices

### 1. Always Increment

```javascript
// WRONG - same version won't trigger update
// @version 1.0.0  →  @version 1.0.0

// CORRECT
// @version 1.0.0  →  @version 1.0.1
```

### 2. Use Three Segments

```javascript
// GOOD - clear and standard
// @version 1.0.0

// ACCEPTABLE - but less clear
// @version 1.0
// @version 1
```

### 3. Pre-release for Testing

```javascript
// Development versions
// @version 1.1.0-dev
// @version 1.1.0-alpha
// @version 1.1.0-beta

// Release
// @version 1.1.0
```

### 4. Build Metadata

Use `+` for build info (doesn't affect comparison order):

```javascript
// @version 1.0.0+build.123
// @version 1.0.0+20240115
```

---

## Update Checking

### Requirements for Auto-Update

1. **@version** must be present
2. **@updateURL** should point to a meta file
3. **@downloadURL** should point to the script file

```javascript
// @version      1.0.0
// @updateURL    https://example.com/script.meta.js
// @downloadURL  https://example.com/script.user.js
```

### Disabling Updates

```javascript
// @downloadURL  none
```

### Update Check Logic

1. Tampermonkey fetches the @updateURL
2. Parses the @version from the meta file
3. Compares with installed @version
4. If remote > local, downloads from @downloadURL

---

## Common Mistakes

### 1. String vs Numeric Comparison

```javascript
// WRONG assumption: "1.9" > "1.10" (as strings)
// CORRECT: 1.9 < 1.10 (numeric comparison)
```

### 2. Forgetting to Increment

```javascript
// Users won't get update if version stays same
// Always increment, even for small fixes
```

### 3. Invalid Characters

```javascript
// AVOID special characters in version
// @version 1.0.0-final!     // May cause issues
// @version 1.0.0-final      // OK
```

### 4. Skipping Versions

```javascript
// This is fine - no need for sequential versions
// @version 1.0.0  →  @version 2.0.0
```

---

## Version Display

The version appears in:
- Tampermonkey dashboard
- Script editor header
- Update notifications
- Browser extension popup

Keep it readable and meaningful for users.
