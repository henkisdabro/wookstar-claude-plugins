---
name: react-best-practices
description: Comprehensive React and Next.js performance optimisation guide with 40+ rules for eliminating waterfalls, optimising bundles, and improving rendering. Use when optimising React or Next.js apps, reviewing performance, refactoring components, hunting wasteful re-renders, reducing bundle size, debugging client/server data-fetching, or tightening rendering paths. Do NOT use for non-React frameworks (Vue, Svelte, Solid, Angular), React Native, or general JavaScript performance unrelated to React.
---

# React Best Practices - Performance Optimisation

Comprehensive performance optimisation guide for React and Next.js applications with 40+ rules organised by impact level. Designed to help developers eliminate performance bottlenecks and follow best practices.

## Quick reference

### Critical priorities

1. **Defer await until needed** - Move awaits into branches where they're used
2. **Use Promise.all()** - Parallelize independent async operations
3. **Avoid barrel imports** - Import directly from source files
4. **Dynamic imports** - Lazy-load heavy components
5. **Strategic Suspense** - Stream content while showing layout

### Common patterns

**Parallel data fetching:**
```typescript
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])
```

**Direct imports:**
```tsx
// ❌ Loads entire library
import { Check } from 'lucide-react'

// ✅ Loads only what you need
import Check from 'lucide-react/dist/esm/icons/check'
```

**Dynamic components:**
```tsx
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(
  () => import('./monaco-editor'),
  { ssr: false }
)
```

## Using the guidelines

The guidelines live in the references folder at two depths - pick the one that fits the task:

- **[references/react-performance-guidelines.md](references/react-performance-guidelines.md)**: the complete guide with all rules, code examples, and impact analysis. Read this for a full review or audit.
- **[references/rules/](references/rules/)**: one file per rule, named `<category>-<rule>.md` (e.g. `async-parallel.md`, `bundle-barrel-imports.md`). Read individual files when working on a specific problem - the category pointers below map each rule to its file.

Each rule includes:
- Incorrect/correct code comparisons
- Specific impact metrics
- When to apply the optimisation
- Real-world examples

## Categories overview

### 1. Eliminating Waterfalls (CRITICAL)
Waterfalls are the #1 performance killer. Each sequential await adds full network latency. Rules: `references/rules/async-*.md`
- Defer await until needed - [async-defer-await.md](references/rules/async-defer-await.md)
- Dependency-based parallelization - [async-dependencies.md](references/rules/async-dependencies.md)
- Prevent waterfall chains in API routes - [async-api-routes.md](references/rules/async-api-routes.md)
- Promise.all() for independent operations - [async-parallel.md](references/rules/async-parallel.md)
- Strategic Suspense boundaries - [async-suspense-boundaries.md](references/rules/async-suspense-boundaries.md)

### 2. Bundle Size Optimisation (CRITICAL)
Reducing initial bundle size improves Time to Interactive and Largest Contentful Paint. Rules: `references/rules/bundle-*.md`
- Avoid barrel file imports - [bundle-barrel-imports.md](references/rules/bundle-barrel-imports.md)
- Conditional module loading - [bundle-conditional.md](references/rules/bundle-conditional.md)
- Defer non-critical third-party libraries - [bundle-defer-third-party.md](references/rules/bundle-defer-third-party.md)
- Dynamic imports for heavy components - [bundle-dynamic-imports.md](references/rules/bundle-dynamic-imports.md)
- Preload based on user intent - [bundle-preload.md](references/rules/bundle-preload.md)

### 3. Server-Side Performance (HIGH)
Optimise server-side rendering and data fetching. Rules: `references/rules/server-*.md`
- Cross-request LRU caching - [server-cache-lru.md](references/rules/server-cache-lru.md)
- Minimize serialization at RSC boundaries - [server-serialization.md](references/rules/server-serialization.md)
- Parallel data fetching with component composition - [server-parallel-fetching.md](references/rules/server-parallel-fetching.md)
- Per-request deduplication with React.cache() - [server-cache-react.md](references/rules/server-cache-react.md)

### 4. Client-Side Data Fetching (MEDIUM-HIGH)
Automatic deduplication and efficient data fetching patterns. Rules: `references/rules/client-*.md`
- Deduplicate global event listeners - [client-event-listeners.md](references/rules/client-event-listeners.md)
- Use SWR for automatic deduplication - [client-swr-dedup.md](references/rules/client-swr-dedup.md)

### 5. Re-render Optimisation (MEDIUM)
Reduce unnecessary re-renders to minimize wasted computation. Rules: `references/rules/rerender-*.md`
- Defer state reads to usage point - [rerender-defer-reads.md](references/rules/rerender-defer-reads.md)
- Extract to memoized components - [rerender-memo.md](references/rules/rerender-memo.md)
- Narrow effect dependencies - [rerender-dependencies.md](references/rules/rerender-dependencies.md)
- Subscribe to derived state - [rerender-derived-state.md](references/rules/rerender-derived-state.md)
- Use lazy state initialization - [rerender-lazy-state-init.md](references/rules/rerender-lazy-state-init.md)
- Use transitions for non-urgent updates - [rerender-transitions.md](references/rules/rerender-transitions.md)

### 6. Rendering Performance (MEDIUM)
Optimise the browser rendering process. Rules: `references/rules/rendering-*.md`
- Animate SVG wrapper instead of SVG element - [rendering-animate-svg-wrapper.md](references/rules/rendering-animate-svg-wrapper.md)
- CSS content-visibility for long lists - [rendering-content-visibility.md](references/rules/rendering-content-visibility.md)
- Hoist static JSX elements - [rendering-hoist-jsx.md](references/rules/rendering-hoist-jsx.md)
- Optimise SVG precision - [rendering-svg-precision.md](references/rules/rendering-svg-precision.md)
- Prevent hydration mismatch without flickering - [rendering-hydration-no-flicker.md](references/rules/rendering-hydration-no-flicker.md)
- Use Activity component for show/hide - [rendering-activity.md](references/rules/rendering-activity.md)
- Use explicit conditional rendering - [rendering-conditional-render.md](references/rules/rendering-conditional-render.md)

### 7. JavaScript Performance (LOW-MEDIUM)
Micro-optimisations for hot paths. Rules: `references/rules/js-*.md`
- Batch DOM CSS changes - [js-batch-dom-css.md](references/rules/js-batch-dom-css.md)
- Build index maps for repeated lookups - [js-index-maps.md](references/rules/js-index-maps.md)
- Cache property access in loops - [js-cache-property-access.md](references/rules/js-cache-property-access.md)
- Cache repeated function calls - [js-cache-function-results.md](references/rules/js-cache-function-results.md)
- Cache storage API calls - [js-cache-storage.md](references/rules/js-cache-storage.md)
- Combine multiple array iterations - [js-combine-iterations.md](references/rules/js-combine-iterations.md)
- Early length check for array comparisons - [js-length-check-first.md](references/rules/js-length-check-first.md)
- Early return from functions - [js-early-exit.md](references/rules/js-early-exit.md)
- Hoist RegExp creation - [js-hoist-regexp.md](references/rules/js-hoist-regexp.md)
- Use loop for min/max instead of sort - [js-min-max-loop.md](references/rules/js-min-max-loop.md)
- Use Set/Map for O(1) lookups - [js-set-map-lookups.md](references/rules/js-set-map-lookups.md)
- Use toSorted() instead of sort() - [js-tosorted-immutable.md](references/rules/js-tosorted-immutable.md)

### 8. Advanced Patterns (LOW)
Specialized techniques for edge cases. Rules: `references/rules/advanced-*.md`
- Store event handlers in refs - [advanced-event-handler-refs.md](references/rules/advanced-event-handler-refs.md)
- useLatest for stable callback refs - [advanced-use-latest.md](references/rules/advanced-use-latest.md)

## Implementation approach

When optimising a React application:

1. **Profile first**: Use React DevTools Profiler and browser performance tools to identify bottlenecks
2. **Focus on critical paths**: Start with eliminating waterfalls and reducing bundle size
3. **Measure impact**: Verify improvements with metrics (LCP, TTI, FID)
4. **Apply incrementally**: Don't over-optimise prematurely
5. **Test thoroughly**: Ensure optimisations don't break functionality

## Key metrics to track

- **Time to Interactive (TTI)**: When page becomes fully interactive
- **Largest Contentful Paint (LCP)**: When main content is visible
- **First Input Delay (FID)**: Responsiveness to user interactions
- **Cumulative Layout Shift (CLS)**: Visual stability
- **Bundle size**: Initial JavaScript payload
- **Server response time**: TTFB for server-rendered content

## Common pitfalls to avoid

❌ **Don't:**
- Use barrel imports from large libraries
- Block parallel operations with sequential awaits
- Re-render entire trees when only part needs updating
- Load analytics/tracking in the critical path
- Mutate arrays with .sort() instead of .toSorted()
- Create RegExp or heavy objects inside render

✅ **Do:**
- Import directly from source files
- Use Promise.all() for independent operations
- Memoize expensive components
- Lazy-load non-critical code
- Use immutable array methods
- Hoist static objects outside components

## Resources

- [React Documentation](https://react.dev)
- [Next.js Documentation](https://nextjs.org)
- [SWR Documentation](https://swr.vercel.app)
- [Vercel Bundle Optimisation](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
- [Vercel Dashboard Performance](https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast)
- [better-all Library](https://github.com/shuding/better-all)
- [node-lru-cache](https://github.com/isaacs/node-lru-cache)

## Version history

**v0.1.0** (January 2026)
- Initial release from Vercel Engineering
- 40+ performance rules across 8 categories
- Comprehensive code examples and impact analysis
