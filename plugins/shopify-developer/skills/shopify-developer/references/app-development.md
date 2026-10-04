# App Development

New apps start from Shopify's React Router template. Remix and React Router merged at React Router 7, and `@shopify/shopify-app-remix` lives on only for existing Remix apps - migrate them with the template's [Upgrading from Remix](https://github.com/Shopify/shopify-app-template-react-router/wiki/Upgrading-from-Remix) guide.

## Scaffold and run

```bash
shopify app init --template=https://github.com/Shopify/shopify-app-template-react-router
shopify app dev        # tunnel, dev store install, extension hot reload
shopify app deploy     # releases a new app version with config and extensions
```

Install the CLI per project (`pnpm add -D @shopify/cli`) or globally - `shopify version` confirms it. `shopify app dev` writes the dev URL into the app config; treat it as throwaway.

## Layout of the template

| Path | Role |
|------|------|
| `shopify.app.toml` | App config: `client_id`, scopes, webhooks, app proxy, URLs. Multiple environments use `shopify.app.<name>.toml` and `shopify app config use` |
| `app/shopify.server.ts` | `shopifyApp({...})` from `@shopify/shopify-app-react-router/server`; exports `authenticate`, `unauthenticated`, `login` |
| `app/routes/app.tsx` | Embedded shell: `<AppProvider>` from `@shopify/shopify-app-react-router/react`, `<s-app-nav>`, plus the `ErrorBoundary` and `headers` exports that must stay |
| `app/routes/app.*.tsx` | Admin pages. Each loader/action starts with `await authenticate.admin(request)` |
| `app/routes/webhooks.*.tsx` | Webhook handlers via `authenticate.webhook(request)` |
| `extensions/` | One folder per extension, each with `shopify.extension.toml` |

`apiVersion` in `shopify.server.ts` is an `ApiVersion` enum member - pick the latest stable from <https://shopify.dev/docs/api/usage/versioning> and keep it in step with `[webhooks] api_version` in the TOML.

## Route pattern

```tsx
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useFetcher, useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const res = await admin.graphql(`#graphql
    query { products(first: 10) { nodes { id title status } } }`);
  const { data } = await res.json();
  return { products: data.products.nodes };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  // run the mutation, then return its userErrors to the page
};

export default function Products() {
  const { products } = useLoaderData<typeof loader>();
  return (
    <s-page heading="Products">
      <s-section>
        {products.map((p) => <s-paragraph key={p.id}>{p.title}</s-paragraph>)}
      </s-section>
    </s-page>
  );
}
```

- The `#graphql` tag lets codegen and the Dev MCP validator find the query.
- Return `userErrors` from mutations to the UI; a 200 response does not mean the mutation succeeded.
- Toasts, modals, save bar and navigation come from App Bridge (`useAppBridge()` from `@shopify/app-bridge-react`), not from the component library.

## Admin UI: Polaris web components

Polaris React (`@shopify/polaris`) is deprecated on npm and no longer maintained. The admin UI is built from Polaris web components - `s-` prefixed custom elements (`<s-page>`, `<s-section>`, `<s-button>`, `<s-text-field>`, `<s-app-nav>`) that work in React JSX or plain HTML. The same `s-` components are used in admin, checkout and customer account UI extensions. Look up a component's attributes and slots in the Dev MCP or <https://shopify.dev/docs/api/app-home/polaris-web-components> rather than guessing - many map loosely, not one-to-one, from old Polaris React props.

## Extensions

Generate with `shopify app generate extension` and pick the type. The main families:

| Family | Where it shows | Notes |
|--------|----------------|-------|
| Theme app extension | App blocks and embeds in Online Store themes | Liquid + assets, no theme file edits; merchant adds via the theme editor |
| Checkout / Thank you / Order status UI extensions | Checkout and post-purchase pages | Replace `checkout.liquid` customisations |
| Customer account UI extensions | New customer accounts | |
| Admin UI extensions (actions, blocks, print actions) | Admin resource pages | |
| Shopify Functions | Backend logic in checkout | See [functions.md](functions.md) |

Theme app extension blocks use `"target": "section"` (app block) or `"body"`/`"head"` (app embed) in their `{% schema %}`. Reach the app from a storefront through an app proxy (`[app_proxy]` in `shopify.app.toml`) and verify the proxy `signature` query parameter server-side before trusting it.

## Webhooks

Declare them in `shopify.app.toml`; the CLI syncs subscriptions on deploy, so code-side registration is only for shop-specific topics.

```toml
[webhooks]
api_version = "<latest stable>"

  [[webhooks.subscriptions]]
  topics = ["app/uninstalled"]
  uri = "/webhooks/app/uninstalled"
```

`authenticate.webhook(request)` verifies the HMAC and returns `{ topic, shop, payload }`. Delete the shop's sessions on `app/uninstalled`. HMAC and retry gotchas are in [api.md](api.md).

## Before submitting to the App Store

- Scopes are the minimum the features need; optional scopes are requested at runtime.
- Mandatory privacy webhooks (`customers/data_request`, `customers/redact`, `shop/redact`) are handled.
- Session storage is persistent in production (the template's Prisma adapter, or another `@shopify/shopify-app-session-storage-*` package).
- Billing goes through the Billing API, not an external processor.
