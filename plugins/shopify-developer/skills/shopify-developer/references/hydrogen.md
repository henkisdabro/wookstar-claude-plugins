# Hydrogen

Hydrogen is Shopify's headless storefront framework: React Router 7 in framework mode, the Storefront and Customer Account APIs, and Oxygen hosting. Releases are versioned by Storefront API quarter (`YYYY.M.patch`); check the installed `@shopify/hydrogen` version and the [changelog](https://github.com/Shopify/hydrogen/blob/main/packages/hydrogen/CHANGELOG.md) before changing anything.

A framework-agnostic "next Hydrogen" exists as an early developer preview (the `preview` branch of the Shopify/hydrogen repo). It is not production-ready - build on the stable React Router package unless the user explicitly opts into the preview.

## Upgrading

Run `npx shopify hydrogen upgrade` inside the project; it steps through each release and prints the required code changes. Each quarterly release bumps the Storefront and Customer Account API versions, so read that quarter's API changelog too.

### 2026.4 breaking changes

- **Storefront API proxy is always on.** `proxyStandardRoutes` was removed from `createRequestHandler`, and the handler throws if the load context has no `storefront` instance. Delete the option and make sure the context passed to `getLoadContext` (the skeleton's `createHydrogenRouterContext`) supplies `storefront`.
- **Backend consent mode is the default.** The Customer Privacy API now uses server-set cookies through the Storefront API proxy instead of the legacy JavaScript `_tracking_consent` cookie. Custom consent banners and any code reading `_tracking_consent` must move to the `customerPrivacy` API.
- **The proxy is load-bearing for analytics.** From 2026.4.6, consent and analytics require the same-origin proxy that Hydrogen's `createRequestHandler` (from `@shopify/hydrogen` or `@shopify/hydrogen/oxygen`) provides. A `server.ts` still on the deprecated `@shopify/remix-oxygen` handler, or a custom server without the proxy, loses consent: analytics stay off and the privacy banner never shows. `consent.sameDomainForStorefrontApi` is now ignored (treated as `true`).
- Deprecated no-ops to remove: `Analytics.Provider` `cookieDomain`, and `useShopifyCookies` options `hasUserConsent`, `domain`, `ignoreDeprecatedCookies`. The `_shopify_y` and `_shopify_s` cookies are no longer created.
- Storefront API: JSON metafield writes are capped at 128 KB from 2026-04; cart mutations return `MERCHANDISE_LINE_TRANSFORMERS_RUN_ERROR` when a Cart Transform Function fails.

Source: <https://shopify.dev/changelog/hydrogen-april-2026-release>.

## Getting started

```bash
npm create @shopify/hydrogen@latest   # skeleton template, TypeScript, Vite
npx shopify hydrogen link             # connect to a store's Hydrogen channel
npx shopify hydrogen dev              # local dev on MiniOxygen
```

Project shape (skeleton): `app/root.tsx`, `app/routes/` (flat-file routes such as `products.$handle.tsx`), `app/lib/context.ts` (builds the Hydrogen context: `storefront`, `customerAccount`, `cart`, `session`), `server.ts` (Oxygen worker entry calling `createRequestHandler`), `react-router.config.ts`, `vite.config.ts`.

### Environment variables

```bash
# .env
SESSION_SECRET=your-secret
PUBLIC_STOREFRONT_API_TOKEN=your-public-token
PUBLIC_STORE_DOMAIN=your-store.myshopify.com

# Optional: for authenticated Storefront API
PRIVATE_STOREFRONT_API_TOKEN=your-private-token
```

## Routing

Hydrogen uses React Router 7 file-based routing:

| File | URL | Description |
|------|-----|-------------|
| `routes/_index.tsx` | `/` | Homepage |
| `routes/products.$handle.tsx` | `/products/snowboard` | Product page |
| `routes/collections.$handle.tsx` | `/collections/winter` | Collection page |
| `routes/collections._index.tsx` | `/collections` | Collections list |
| `routes/cart.tsx` | `/cart` | Cart page |
| `routes/search.tsx` | `/search` | Search results |
| `routes/pages.$handle.tsx` | `/pages/about` | CMS pages |
| `routes/account.tsx` | `/account` | Customer account (layout) |
| `routes/account.orders.$id.tsx` | `/account/orders/123` | Order detail |

## Data Loading

### Loader pattern (server-side data fetching)

```tsx
import { useLoaderData, type LoaderFunctionArgs } from 'react-router';

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { storefront } = context;

  const { product } = await storefront.query(PRODUCT_QUERY, {
    variables: { handle: params.handle },
  });

  if (!product) {
    throw new Response('Product not found', { status: 404 });
  }

  return { product };
}

export default function ProductPage() {
  const { product } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <ProductPrice price={product.priceRange.minVariantPrice} />
    </div>
  );
}

const PRODUCT_QUERY = `#graphql
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        nodes {
          url
          altText
          width
          height
        }
      }
      variants(first: 100) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;
```

### Action pattern (form submissions)

```tsx
import { type ActionFunctionArgs } from 'react-router';

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const variantId = formData.get('variantId') as string;
  const quantity = parseInt(formData.get('quantity') as string) || 1;

  const { cart } = context;

  const result = await cart.addLines([
    { merchandiseId: variantId, quantity },
  ]);

  return { cart: result.cart };
}
```

## Storefront API Client

Hydrogen provides a typed Storefront API client:

```tsx
// app/lib/storefront.ts - automatically configured

// Usage in loaders:
export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront } = context;

  // Simple query
  const { products } = await storefront.query(PRODUCTS_QUERY, {
    variables: { first: 10 },
  });

  // With cache control
  const { collection } = await storefront.query(COLLECTION_QUERY, {
    variables: { handle: 'winter' },
    cache: storefront.CacheLong(),  // Cache for 1 hour
  });

  return { products, collection };
}
```

### Cache strategies

```tsx
// Built-in cache strategies
storefront.CacheNone()     // no-store
storefront.CacheShort()    // max-age 1s, stale-while-revalidate 9s (the default for queries)
storefront.CacheLong()     // max-age 1h, stale-while-revalidate 23h
storefront.CacheCustom({
  mode: 'public',
  maxAge: 60,              // seconds
  staleWhileRevalidate: 300,
})
```

## Cart Operations

Hydrogen provides a cart API abstraction:

```tsx
// In loaders/actions, use context.cart
export async function action({ request, context }: ActionFunctionArgs) {
  const { cart } = context;
  const formData = await request.formData();

  switch (formData.get('action')) {
    case 'add':
      return cart.addLines([{
        merchandiseId: formData.get('variantId') as string,
        quantity: 1,
      }]);

    case 'update':
      return cart.updateLines([{
        id: formData.get('lineId') as string,
        quantity: parseInt(formData.get('quantity') as string),
      }]);

    case 'remove':
      return cart.removeLines([
        formData.get('lineId') as string,
      ]);

    case 'updateNote':
      return cart.updateNote(
        formData.get('note') as string,
      );

    default:
      throw new Error('Unknown cart action');
  }
}
```

### Cart component

```tsx
import { useFetcher } from 'react-router';
import { CartLineQuantity, CartLinePrice, Money } from '@shopify/hydrogen';

function AddToCartButton({ variantId }: { variantId: string }) {
  const fetcher = useFetcher();
  const isAdding = fetcher.state !== 'idle';

  return (
    <fetcher.Form method="post" action="/cart">
      <input type="hidden" name="action" value="add" />
      <input type="hidden" name="variantId" value={variantId} />
      <button type="submit" disabled={isAdding}>
        {isAdding ? 'Adding...' : 'Add to Cart'}
      </button>
    </fetcher.Form>
  );
}
```

## Hydrogen Components

Built-in components for common e-commerce patterns:

```tsx
import {
  Image,
  Money,
  ShopPayButton,
  Video,
  ExternalVideo,
  ModelViewer,
  MediaFile,
  CartLineQuantity,
  CartLinePrice,
} from '@shopify/hydrogen';

// Optimised image with CDN sizing
<Image
  data={product.images.nodes[0]}
  sizes="(min-width: 768px) 50vw, 100vw"
  aspectRatio="1/1"
/>

// Formatted price
<Money data={product.priceRange.minVariantPrice} />

// Shop Pay button
<ShopPayButton
  variantIds={[selectedVariant.id]}
  storeDomain={shop.primaryDomain.url}
/>
```

## SEO

```tsx
// In root.tsx or individual routes
import { getSeoMeta } from '@shopify/hydrogen';

export const meta = ({ data }) => {
  return getSeoMeta({
    title: data.product.title,
    description: data.product.description,
    url: `https://store.com/products/${data.product.handle}`,
    image: data.product.images.nodes[0]?.url,
  });
};
```

## Deployment

```bash
npx shopify hydrogen deploy      # build and deploy to Oxygen
npx shopify hydrogen env pull    # sync Oxygen environment variables into .env
```

Oxygen is the default host. Self-hosting on another worker or Node runtime is possible, but the server must still use Hydrogen's `createRequestHandler` so the Storefront API proxy, consent and analytics keep working (see 2026.4 above).

The skeleton's `vite.config.ts` registers `hydrogen()`, `oxygen()` (from `@shopify/mini-oxygen/vite`) and `reactRouter()` - keep all three when adding plugins such as Tailwind.

## Practices

1. Pick a cache strategy per query: `CacheLong()` for catalogue data that changes rarely, the default `CacheShort()` otherwise; never cache customer or cart data.
2. For non-critical data, return the un-awaited promise from the loader and render it with `<Suspense>` and `<Await>` - React Router 7 has no `defer()`.
3. Colocate each GraphQL query with its route and run `npx shopify hydrogen codegen` for typed results.
4. Use `getSeoMeta` on public routes and Hydrogen's `Image` and `Money` components.
5. Keep analytics behind `Analytics.Provider` and the Customer Privacy API; do not set tracking cookies yourself.
