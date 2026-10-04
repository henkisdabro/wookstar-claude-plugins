# Local notes - overrides on top of the upstream rules

Everything in this file is a local addition. The files in `rules/` are Vercel's, copied unchanged, so
a resync overwrites them and leaves this file alone. Where a note and a rule disagree, the note wins.

Checked against react.dev and nextjs.org on 20261004.

## React Compiler

React Compiler is stable (`babel-plugin-react-compiler` 1.0) and opt-in: nothing enables it by
default. It is on when any of these hold:

- `next.config.*` sets `reactCompiler: true` or `reactCompiler: { compilationMode: ... }`
- a Babel, Vite or other build config loads `babel-plugin-react-compiler`
- with `compilationMode: 'annotation'`, only components and hooks marked `'use memo'` are compiled;
  `'use no memo'` opts one out

When the compiler is on for the file in front of you:

- **Write new code without manual memoisation.** The compiler memoises components, values and
  callbacks at least as precisely as hand-written `memo`/`useMemo`/`useCallback`. Treat these rules as
  satisfied by the compiler: `rerender-memo`, `rerender-memo-with-default-value`,
  `rerender-simple-expression-in-memo`, `rendering-hoist-jsx`, and the dependency-juggling parts of
  `rerender-split-combined-hooks`. Reach for `useMemo`/`useCallback` only where you need precise
  control, such as a value that must stay referentially stable for an effect.
- **Leave existing memoisation in place.** React's guidance is that removing it can change the
  compiled output; remove it only with tests covering the component.
- **Keep applying the rules that are about correctness or architecture**, which the compiler does
  not change: `rerender-functional-setstate`, `rerender-no-inline-components`,
  `rerender-derived-state-no-effect`, `rerender-move-effect-to-event`, `advanced-effect-event-deps`,
  and every `async-`, `bundle-`, `server-`, `client-`, `rendering-` and `js-` rule.

When the compiler is off, the memoisation rules apply as written.

Sources: https://react.dev/learn/react-compiler/introduction,
https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler

## Next.js 16 caching

Next.js 16 has two caching models. Check `next.config.*` for `cacheComponents: true` before applying
any server-side caching rule.

**Cache Components on (`cacheComponents: true`):**

- Cache with the `'use cache'` directive at the top of an async function (data-level) or a component,
  layout or page (UI-level), and pair it with `cacheLife(...)`; tag it with `cacheTag(...)` for
  on-demand revalidation. All three come from `next/cache`.
- Uncached async work and runtime APIs (`cookies()`, `headers()`, `searchParams`, dynamic `params`)
  belong inside a `<Suspense>` boundary; the dev overlay flags a **blocking-route** insight when they
  are not. This makes `async-suspense-boundaries` a requirement here rather than an optimisation.
  Push the `await` as deep in the tree as possible so more of the page joins the static shell.
- `Math.random()`, `Date.now()` and `crypto.randomUUID()` need either `await connection()` (from
  `next/server`) plus `<Suspense>`, or `'use cache'` to share one value.
- `'use cache'` results default to a per-instance in-memory store. Before hand-rolling the
  `server-cache-lru` pattern, consider `'use cache: remote'` for a durable shared cache, or
  `'use cache: private'` for data derived from cookies or headers.
- `React.cache()` (`server-cache-react`) still applies for per-request deduplication.

**Previous model (no `cacheComponents`):** `fetch` is not cached by default; opt in per request with
`cache: 'force-cache'` or `next: { revalidate: n }`, and use `unstable_cache` for non-`fetch` work.
`revalidateTag` takes a cache-life profile as its second argument, e.g. `revalidateTag('user', 'max')`.

Sources: https://nextjs.org/docs/app/getting-started/caching,
https://nextjs.org/docs/app/guides/caching-without-cache-components

## Next.js barrel imports (overrides the version header in `bundle-barrel-imports`)

The rule labels `optimizePackageImports` as "Next.js 13.5+". On current Next.js:

- The option lives under `experimental` and the docs still mark it experimental.
- A built-in list is optimised with no config at all, including `lucide-react`, `date-fns`,
  `lodash-es`, `@mui/material`, `@mui/icons-material`, `@headlessui/react`, `@tabler/icons-react`,
  `react-icons/*`, `recharts` and `rxjs`. Add a package to `optimizePackageImports` only when it is
  missing from that list.

Source: https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports
