# Hydrogen

Hydrogen (`@shopify/hydrogen`) is Shopify's headless storefront toolkit. There are two lines under the same package name, and they share almost no API - find out which one the project is on before changing anything:

| `@shopify/hydrogen` in `package.json` | Line | Docs |
|----------------------------------------|------|------|
| `2026.10.x` or later | Current Hydrogen: a framework-agnostic library you add to your own app (generally available since 14 October 2026) | <https://shopify.dev/docs/storefronts/hydrogen>, API reference <https://shopify.dev/docs/api/hydrogen/2026-10> |
| `2026.4.x` or earlier | Legacy Hydrogen: a React Router 7 (earlier, Remix) framework with its own CLI and Vite plugin | <https://shopify.dev/docs/storefronts/headless/legacy>, source on the repo's `2026-04` branch |

Existing legacy storefronts keep working and Shopify still ships `2026.4.x` patches, so do not migrate unless the user asks. A caret range such as `^2026.4.0` can resolve to `2026.10`, which breaks a legacy project (the `hydrogen()` Vite plugin throws) - pin legacy projects with a tilde range, `~2026.4.0`.

Versions follow the Storefront API quarter (`YYYY.M.patch`). Changelog: <https://github.com/Shopify/hydrogen/blob/main/packages/hydrogen/CHANGELOG.md>.

## Current Hydrogen (2026.10+)

The app owns its server entry, router and build; Hydrogen supplies the commerce pieces. It needs Node.js 22.12+ or 24.

```bash
npx @shopify/hydrogen@latest setup    # install the package and copy Hydrogen's agent skills; offers the React Router template in an empty directory
npx @shopify/hydrogen skills sync     # after every Hydrogen upgrade
npx @shopify/hydrogen skills check    # CI: exits non-zero when the skills are stale
```

**Hydrogen ships its own agent skills** (`hydrogen-setup`, `hydrogen-storefront-client`, `hydrogen-request-handlers`, `hydrogen-cart-ui`, `hydrogen-customer-account`, `hydrogen-analytics`, `hydrogen-oxygen`, `migrate-to-hydrogen-2026-10` and others), copied into `.claude/skills` and `.agents/skills` and matched to the installed version. Follow those for API detail rather than this file; what follows is orientation only.

- **Entry points:** `@shopify/hydrogen` (framework-independent core: Storefront client, `gql()`, request handlers, caching, `formatMoney()`, analytics, cart/product/collection/search stores), `@shopify/hydrogen/react` and `/vue` (bindings such as `createCartComponents()`, `createProductComponents()`, `ShopifyScripts`, `ShopPayButton`), `@shopify/hydrogen/customer-account`, `@shopify/hydrogen/vite` (`localHttps()`; the `hydrogen()` export remains only to throw), `@shopify/hydrogen/ts-plugin` (flags unknown fields in `gql()` queries).
- **Frameworks:** React Router (Shopify's starter, deployable to Oxygen from the admin) and Next.js (Vercel Shop) have starters; Nuxt, Astro, SvelteKit and SolidStart have examples only.
- **Request flow:** a root middleware builds one request context (`createShopifyRequestContext`), creates the client (`createStorefrontClient`), returns the response of `handleShopifyRoutes()` if it gives one (Storefront API proxy, `/api/cart`, checkout and cart permalinks, account login), otherwise calls the router, runs `handleShopifyRedirects()` on a 404, and finishes with `requestContext.applyResponseHeaders()`. Creating a second request context makes `handleShopifyRoutes()` throw; leaving out `applyResponseHeaders()` or `routeTemplates` fails silently.
- **Queries:** `storefrontClient.graphql()` with queries wrapped in `gql()`; cache with `Cache.long()`, `Cache.short()`, `Cache.none()` or `Cache()`.
- **Cart and analytics need `ShopifyScripts`** in the root layout (`renderShopifyScriptTags()` outside React and Vue). Cart forms post to `/api/cart` and work before JavaScript loads. Publish analytics events to `window.Shopify.analytics` yourself; add custom destinations with `analytics.addDestination()`.
- **Hosting:** Oxygen, Node.js, Cloudflare Workers, Deno or Vercel - the core uses only web platform APIs. Deploy to Oxygen with `shopify hydrogen deploy --assets-dir dist/client --worker-dir dist/server`.

### Migrating legacy to 2026.10

Run the `migrate-to-hydrogen-2026-10` skill (installed by `hydrogen skills sync`) alongside the guide at <https://shopify.dev/docs/storefronts/hydrogen/migrate>. `shopify hydrogen upgrade` only moves between legacy versions. Pages and routes stay; the commerce code is replaced:

| Legacy | 2026.10 |
|--------|---------|
| `shopify hydrogen dev` / `build`, `hydrogen()` Vite plugin | `vite dev` / `react-router build`; `localHttps()` and `...oxygen()` before `reactRouter()` |
| `createHydrogenContext()`, `createRequestHandler()`, `hydrogenRoutes()` | Root middleware with `handleShopifyRoutes()` (middleware must be enabled - `future.v8_middleware: true` on React Router 7) |
| `context.storefront.query()` | `context.get(storefrontClientContext).graphql()` - the context is your own `createContext()`; returns `{data, errors}`, and nothing is cached unless you pass `cache` |
| `CacheLong()`, `CacheShort()`, `CacheNone()`, `CacheCustom()` | `Cache.long()`, `Cache.short()`, `Cache.none()`, `Cache()` |
| `context.cart`, `createCartHandler()` | `createCartServerHandlers()` at `/api/cart` |
| `CartForm`, `useOptimisticCart()` | `useCartForm()` and the cart store |
| `VariantSelector`, `useOptimisticVariant()` | `useProductForm()` and the product store |
| `Analytics.Provider`, `useAnalytics()`, `getShopAnalytics()` | `ShopifyScripts` and `window.Shopify.analytics` |
| `Image`, `MediaFile`, `Money` | Your own `<img>`; `formatMoney()` |
| `Pagination`, `getPaginationVariables()` | Collection store |
| `Seo`, `getSeoMeta()`, `getSitemap()`, `getSitemapIndex()` | React Router `meta` export and your own sitemap queries |
| `ShopPayButton` from `@shopify/hydrogen` | From `@shopify/hydrogen/react` or `/vue` |
| `Video`, `ExternalVideo`, `ModelViewer`, `RichText`, `Script`, `parseMetafield()`, `parseGid()` | No replacement - your own code |

Migrate features in the guide's order (Markets, then customer accounts, then analytics with consent), delete route files for paths Hydrogen now owns (`/api/cart`, `/checkout`, cart permalinks, `/account/login`) and keep a catch-all route (`$.tsx`), because middleware runs only for matched routes. Customer login needs HTTPS locally (`npm run dev:https`, served at `https://local.tryhydrogen.dev:5173`). The Storefront and Customer Account APIs move to `2026-10` at the same time; in the Customer Account API, `Order.shippingTitle` and `Customer.lastIncompleteCheckout` are removed and `territoryCode` is deprecated for `countryCode`.

Done when `npm run typecheck` and `npm run build` pass and cart, variant selection, customer login and analytics events work in `vite dev`.

## Legacy Hydrogen (2026.4.x and earlier)

Everything below applies only to the legacy line, and the samples follow the `2026-04` branch's `templates/skeleton`. Move between legacy releases with `npx shopify hydrogen upgrade`, which writes the upgrade instructions for the target release to a file under `.hydrogen/`.

### 2026.4 breaking changes

- **Storefront API proxy is always on.** `proxyStandardRoutes` was removed from `createRequestHandler`, and the handler throws if the load context has no `storefront` instance. Delete the option and make sure the context passed to `getLoadContext` (the skeleton's `createHydrogenRouterContext`) supplies `storefront`.
- **Backend consent mode is the default.** The Customer Privacy API uses server-set cookies through the Storefront API proxy instead of the JavaScript `_tracking_consent` cookie. Custom consent banners and any code reading `_tracking_consent` must move to the `customerPrivacy` API.
- **The proxy is load-bearing for analytics.** From 2026.4.6, consent and analytics require the same-origin proxy that Hydrogen's `createRequestHandler` (from `@shopify/hydrogen` or `@shopify/hydrogen/oxygen`) provides. A `server.ts` still on the deprecated `@shopify/remix-oxygen` handler, or a custom server without the proxy, loses consent: analytics stay off and the privacy banner never shows. `consent.sameDomainForStorefrontApi` is ignored (treated as `true`).
- No-ops to remove (2026.4.6): `Analytics.Provider` `cookieDomain`, and `useShopifyCookies` options `hasUserConsent`, `domain`, `ignoreDeprecatedCookies`. The `_shopify_y` and `_shopify_s` cookies are no longer created.
- Storefront API: JSON metafield writes are capped at 128 KB from 2026-04; cart mutations return `MERCHANDISE_LINE_TRANSFORMERS_RUN_ERROR` when a Cart Transform Function fails.

Source: <https://github.com/Shopify/hydrogen/blob/2026-04/packages/hydrogen/CHANGELOG.md>.

### Getting started

```bash
npm create @shopify/hydrogen@latest   # legacy skeleton; new projects should use the 2026.10 setup above
npx shopify hydrogen link             # connect to a store's Hydrogen storefront
npx shopify hydrogen env pull         # write the storefront's variables to .env
npx shopify hydrogen dev              # local dev on MiniOxygen
```

Project shape (skeleton): `app/root.tsx`, `app/routes.ts` (`hydrogenRoutes([...(await flatRoutes())])`), `app/routes/` (flat-file routes such as `products.$handle.tsx`), `app/lib/context.ts` (calls `createHydrogenContext()`, which builds `storefront`, `customerAccount`, `cart` and `session`), `server.ts` (Oxygen worker entry calling `createRequestHandler` and `storefrontRedirect`), `react-router.config.ts` (`hydrogenPreset()`), `vite.config.ts`.

#### Environment variables

`createHydrogenContext()` reads these from `env`:

```bash
# .env
SESSION_SECRET=your-secret
PUBLIC_STORE_DOMAIN=your-store.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=your-public-token
PRIVATE_STOREFRONT_API_TOKEN=your-private-token
PUBLIC_STOREFRONT_ID=your-storefront-id
# Customer accounts
PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID=your-client-id
```

### Routing

Routes are React Router 7 flat-file routes, loaded by `flatRoutes()` from `@react-router/fs-routes`:

| File | URL | Description |
|------|-----|-------------|
| `routes/_index.tsx` | `/` | Homepage |
| `routes/products.$handle.tsx` | `/products/snowboard` | Product page |
| `routes/collections.$handle.tsx` | `/collections/winter` | Collection page |
| `routes/collections._index.tsx` | `/collections` | Collections list |
| `routes/cart.tsx` | `/cart` | Cart page and cart action |
| `routes/search.tsx` | `/search` | Search results |
| `routes/pages.$handle.tsx` | `/pages/about` | CMS pages |
| `routes/account.tsx` | `/account` | Customer account (layout) |
| `routes/account.orders.$id.tsx` | `/account/orders/123` | Order detail |
| `routes/$.tsx` | anything else | Catch-all 404 |

### Data Loading

Loaders read the Storefront API through `context.storefront`. The skeleton types route arguments with the generated `Route.LoaderArgs` (`import type {Route} from './+types/products.$handle'`); `LoaderFunctionArgs` from `react-router` also works.

```tsx
import { useLoaderData } from 'react-router';
import { Money } from '@shopify/hydrogen';
import type { Route } from './+types/products.$handle';

export async function loader({ params, context }: Route.LoaderArgs) {
  const { storefront } = context;

  const { product } = await storefront.query(PRODUCT_QUERY, {
    variables: { handle: params.handle },
  });

  if (!product?.id) {
    throw new Response(null, { status: 404 });
  }

  return { product };
}

export default function Product() {
  const { product } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>{product.title}</h1>
      <Money data={product.priceRange.minVariantPrice} />
    </div>
  );
}

const PRODUCT_QUERY = `#graphql
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
    }
  }
` as const;
```

`storefront.query()` adds the request's `country` and `language` from `i18n` when the query declares those variables. Queries are typed by `npx shopify hydrogen codegen` (the skeleton's `dev` and `build` scripts pass `--codegen`).

#### Cache strategies

Every `storefront.query()` is cached. With no `cache` option the default strategy applies: `public, max-age=1, stale-while-revalidate=86399`.

```tsx
const { collection } = await storefront.query(COLLECTION_QUERY, {
  variables: { handle: 'winter' },
  cache: storefront.CacheLong(),
});

storefront.CacheNone()     // no-store
storefront.CacheShort()    // public, max-age=1, stale-while-revalidate=9
storefront.CacheLong()     // public, max-age=3600, stale-while-revalidate=82800
storefront.CacheCustom({
  mode: 'public',
  maxAge: 60,              // seconds
  staleWhileRevalidate: 300,
})
```

The four functions are also exported from `@shopify/hydrogen`. Pass `CacheNone()` on any query that returns customer data, and set a private `Cache-Control` on that route's response. Caching guide: <https://shopify.dev/docs/storefronts/headless/legacy/hydrogen/caching>.

### Cart Operations

The cart lives on `context.cart`. Forms are rendered with `CartForm`, which posts to the `/cart` route; that route's action decodes the submission with `CartForm.getFormInput()`. Cut down from the skeleton's `app/routes/cart.tsx`:

```tsx
import { data, type HeadersFunction } from 'react-router';
import { CartForm, type CartQueryDataReturn } from '@shopify/hydrogen';
import type { Route } from './+types/cart';

export const headers: HeadersFunction = ({ actionHeaders }) => actionHeaders;

export async function action({ request, context }: Route.ActionArgs) {
  const { cart } = context;
  const formData = await request.formData();
  const { action, inputs } = CartForm.getFormInput(formData);

  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  // Persist the cart ID cookie - without this a new cart is lost on the next request
  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(cartId) : new Headers();
  const { cart: cartResult, errors, warnings } = result;

  return data({ cart: cartResult, errors, warnings }, { headers });
}

export async function loader({ context }: Route.LoaderArgs) {
  return await context.cart.get();
}
```

`context.cart` also has `updateDiscountCodes()`, `addGiftCardCodes()`, `removeGiftCardCodes()`, `updateBuyerIdentity()` and `updateNote()`, each with a matching `CartForm.ACTIONS` entry.

#### Add to cart button

```tsx
import { type FetcherWithComponents } from 'react-router';
import { CartForm, type OptimisticCartLineInput } from '@shopify/hydrogen';

function AddToCartButton({ lines }: { lines: Array<OptimisticCartLineInput> }) {
  return (
    <CartForm route="/cart" inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <button type="submit" disabled={fetcher.state !== 'idle'}>
          Add to cart
        </button>
      )}
    </CartForm>
  );
}

// <AddToCartButton lines={[{ merchandiseId: selectedVariant.id, quantity: 1 }]} />
```

### Hydrogen Components

```tsx
import { Image, Money, ShopPayButton } from '@shopify/hydrogen';

// Optimised image with CDN sizing
<Image
  data={product.images.nodes[0]}
  sizes="(min-width: 768px) 50vw, 100vw"
  aspectRatio="1/1"
/>

// Formatted price
<Money data={product.priceRange.minVariantPrice} />

// Shop Pay button - storeDomain is the bare domain, such as your-store.myshopify.com
<ShopPayButton
  variantIds={[selectedVariant.id]}
  storeDomain={storeDomain}
/>
```

`Video`, `ExternalVideo`, `ModelViewer` and `MediaFile` come from the same package. API reference for the legacy line: <https://shopify.dev/docs/api/hydrogen/2026-04>.

### SEO

```tsx
import { getSeoMeta } from '@shopify/hydrogen';
import type { Route } from './+types/products.$handle';

export const meta: Route.MetaFunction = ({ data }) => {
  return getSeoMeta({
    title: data?.product.title,
    description: data?.product.description,
    url: `https://store.com/products/${data?.product.handle}`,
    media: data?.product.images.nodes[0]?.url,
  });
};
```

`getSeoMeta()` takes any number of SEO objects, so a route can merge the root's with its own. The skeleton itself returns plain React Router `meta` descriptors and does not call it.

### Deployment

```bash
npx shopify hydrogen deploy      # build and deploy to Oxygen
npx shopify hydrogen env pull    # sync Oxygen environment variables into .env
```

Oxygen is the default host. Self-hosting on another worker or Node runtime is possible, but the server must still use Hydrogen's `createRequestHandler` so the Storefront API proxy, consent and analytics keep working (see 2026.4 above).

The skeleton's `vite.config.ts` registers `hydrogen()` (from `@shopify/hydrogen/vite`), `oxygen()` (from `@shopify/mini-oxygen/vite`) and `reactRouter()` - keep all three when adding plugins such as Tailwind.

### Practices

1. Pick a cache strategy per query: `CacheLong()` for catalogue data that changes rarely, the default otherwise, and `CacheNone()` for anything customer-specific.
2. For non-critical data, return the un-awaited promise from the loader and render it with `<Suspense>` and `<Await>` - React Router 7 has no `defer()`.
3. Colocate each GraphQL query with its route and run `npx shopify hydrogen codegen` for typed results.
4. Use Hydrogen's `Image` and `Money` components rather than hand-built markup.
5. Keep analytics behind `Analytics.Provider` and the Customer Privacy API; do not set tracking cookies yourself.
