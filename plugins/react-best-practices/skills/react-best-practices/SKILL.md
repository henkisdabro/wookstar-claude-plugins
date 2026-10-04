---
name: react-best-practices
description: React and Next.js performance rules from Vercel Engineering, ranked by impact, with local overrides for React Compiler and Next.js 16 caching. Use when writing or refactoring React components, reviewing a React or Next.js codebase for performance, fixing async data-fetching waterfalls, shrinking a JavaScript bundle, hunting wasteful re-renders, choosing a Next.js server caching pattern, or fixing a hydration mismatch. Do NOT use for Vue, Svelte, Solid or Angular code - follow that framework's docs; React Native - use React Native docs; browser or end-to-end testing of a web app - use Anthropic's webapp-testing skill; Shopify themes - use shopify-developer.
license: MIT
paths:
  - "**/*.tsx"
  - "**/*.jsx"
  - "**/next.config.*"
---

# React best practices

Vercel's React and Next.js performance rules, one file per rule in `rules/`, ranked by impact.
`local-notes.md` holds local overrides that win over any rule they contradict.

## Steps

### 1. Read the stack

Check `package.json` and `next.config.*` for:

- the `react` and `next` versions in use
- React Compiler: `reactCompiler` in `next.config.*`, or `babel-plugin-react-compiler` in a build config
- Next.js Cache Components: `cacheComponents: true` in `next.config.*`

When React Compiler is on, or the project uses Next.js, read [local-notes.md](local-notes.md) before
step 2 - it says which memoisation rules the compiler makes redundant and how Next.js 16 caching
changes the `server-` and `async-` rules.

Done when you can state the React version, whether Next.js is present, and whether React Compiler and
Cache Components are each on or off.

### 2. Read the rules for the categories in play

Pick the categories the task touches from the index below. For a review or audit, take all eight in
priority order. Open `rules/<rule-id>.md` for each rule you apply or check - the index line is a
summary, and the file carries the incorrect and correct code and the conditions for applying it.

Done when every rule file in the chosen categories has been read.

### 3. Apply or report

When writing code, apply the rules as you go. When reviewing, report each finding as: rule id, file and
line, impact level, and the fix. Work from CRITICAL down, so waterfalls and bundle size come before
re-render and micro-optimisations.

Done when every finding names a rule id, and every chosen category has been checked against the code.

## Rule index

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Eliminating waterfalls | CRITICAL | `async-` |
| 2 | Bundle size | CRITICAL | `bundle-` |
| 3 | Server-side performance | HIGH | `server-` |
| 4 | Client-side data fetching | MEDIUM-HIGH | `client-` |
| 5 | Re-render optimisation | MEDIUM | `rerender-` |
| 6 | Rendering performance | MEDIUM | `rendering-` |
| 7 | JavaScript performance | LOW-MEDIUM | `js-` |
| 8 | Advanced patterns | LOW | `advanced-` |

### 1. Eliminating waterfalls (CRITICAL)

- `async-cheap-condition-before-await` - Check cheap sync conditions before awaiting flags or remote values
- `async-defer-await` - Move await into branches where actually used
- `async-parallel` - Use Promise.all() for independent operations
- `async-dependencies` - Use better-all for partial dependencies
- `async-api-routes` - Start promises early, await late in API routes
- `async-suspense-boundaries` - Use Suspense to stream content

### 2. Bundle size (CRITICAL)

- `bundle-barrel-imports` - Import directly, avoid barrel files
- `bundle-analyzable-paths` - Prefer statically analysable import and file-system paths
- `bundle-dynamic-imports` - Use next/dynamic for heavy components
- `bundle-defer-third-party` - Load analytics and logging after hydration
- `bundle-conditional` - Load modules only when the feature is activated
- `bundle-preload` - Preload on hover or focus for perceived speed

### 3. Server-side performance (HIGH)

- `server-auth-actions` - Authenticate server actions like API routes
- `server-cache-react` - Use React.cache() for per-request deduplication
- `server-cache-lru` - Use an LRU cache for cross-request caching
- `server-dedup-props` - Avoid duplicate serialisation in RSC props
- `server-hoist-static-io` - Hoist static I/O (fonts, logos) to module level
- `server-no-shared-module-state` - Avoid module-level mutable request state in RSC/SSR
- `server-serialization` - Minimise data passed to client components
- `server-parallel-fetching` - Restructure components to parallelise fetches
- `server-parallel-nested-fetching` - Chain nested fetches per item in Promise.all
- `server-after-nonblocking` - Use after() for non-blocking operations

### 4. Client-side data fetching (MEDIUM-HIGH)

- `client-swr-dedup` - Use SWR for automatic request deduplication
- `client-event-listeners` - Deduplicate global event listeners
- `client-passive-event-listeners` - Use passive listeners for scroll
- `client-localstorage-schema` - Version and minimise localStorage data

### 5. Re-render optimisation (MEDIUM)

- `rerender-defer-reads` - Skip subscribing to state used only in callbacks
- `rerender-memo` - Extract expensive work into memoised components
- `rerender-memo-with-default-value` - Hoist default non-primitive props
- `rerender-dependencies` - Use primitive dependencies in effects
- `rerender-derived-state` - Subscribe to derived booleans, not raw values
- `rerender-derived-state-no-effect` - Derive state during render, not in effects
- `rerender-functional-setstate` - Use functional setState for stable callbacks
- `rerender-lazy-state-init` - Pass a function to useState for expensive values
- `rerender-simple-expression-in-memo` - Leave simple primitive expressions out of useMemo
- `rerender-split-combined-hooks` - Split hooks with independent dependencies
- `rerender-move-effect-to-event` - Put interaction logic in event handlers
- `rerender-transitions` - Use startTransition for non-urgent updates
- `rerender-use-deferred-value` - Defer expensive renders to keep input responsive
- `rerender-use-ref-transient-values` - Use refs for transient, frequently changing values
- `rerender-no-inline-components` - Define components at module level, not inside other components

### 6. Rendering performance (MEDIUM)

- `rendering-animate-svg-wrapper` - Animate a div wrapper, not the SVG element
- `rendering-content-visibility` - Use content-visibility for long lists
- `rendering-hoist-jsx` - Extract static JSX outside components
- `rendering-svg-precision` - Reduce SVG coordinate precision
- `rendering-hydration-no-flicker` - Use an inline script for client-only data
- `rendering-hydration-suppress-warning` - Suppress expected mismatches
- `rendering-activity` - Use the Activity component for show/hide
- `rendering-conditional-render` - Use a ternary, not &&, for conditionals
- `rendering-usetransition-loading` - Prefer useTransition for loading state
- `rendering-resource-hints` - Use React DOM resource hints for preloading
- `rendering-script-defer-async` - Use defer or async on script tags

### 7. JavaScript performance (LOW-MEDIUM)

- `js-batch-dom-css` - Group CSS changes via classes or cssText
- `js-index-maps` - Build a Map for repeated lookups
- `js-cache-property-access` - Cache object properties in loops
- `js-cache-function-results` - Cache function results in a module-level Map
- `js-cache-storage` - Cache localStorage/sessionStorage reads
- `js-combine-iterations` - Combine multiple filter/map passes into one loop
- `js-length-check-first` - Check array length before an expensive comparison
- `js-early-exit` - Return early from functions
- `js-hoist-regexp` - Hoist RegExp creation outside loops
- `js-min-max-loop` - Use a loop for min/max instead of sort
- `js-set-map-lookups` - Use Set/Map for O(1) lookups
- `js-tosorted-immutable` - Use toSorted() for immutability
- `js-flatmap-filter` - Use flatMap to map and filter in one pass
- `js-request-idle-callback` - Defer non-critical work to browser idle time

### 8. Advanced patterns (LOW)

- `advanced-effect-event-deps` - Keep `useEffectEvent` results out of effect deps
- `advanced-event-handler-refs` - Store event handlers in refs
- `advanced-init-once` - Initialise the app once per app load
- `advanced-use-latest` - useLatest for stable callback refs
