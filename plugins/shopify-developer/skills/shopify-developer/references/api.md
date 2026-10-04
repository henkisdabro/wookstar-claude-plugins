# Shopify APIs - orientation

Field names and argument shapes change every quarter. Look them up and validate with the `shopify-ai-toolkit` plugin or `@shopify/dev-mcp` (see SKILL.md), not from this file. This file holds what the schema does not tell you.

## Which API

| API | Use for | Auth |
|-----|---------|------|
| GraphQL Admin | Anything an app or back-office script does to store data | Access token in `X-Shopify-Access-Token` (never `Authorization: Bearer`) |
| Storefront (GraphQL) | Headless storefronts, Hydrogen | Public token in `X-Shopify-Storefront-Access-Token` for the browser; private token server-side only |
| Customer Account (GraphQL) | Logged-in customer: orders, addresses, profile | OAuth customer access token, not a Storefront token |
| Ajax cart API | Cart changes from theme JavaScript | Same-origin session, no token |
| REST Admin | Legacy only. Write new work in GraphQL | - |

Endpoint shape - always substitute the version, never hardcode one from memory:

```
POST https://{shop}.myshopify.com/admin/api/{version}/graphql.json
POST https://{shop}.myshopify.com/api/{version}/graphql.json
```

## Versioning

- Quarterly releases (`YYYY-01/04/07/10`), each supported at least 12 months. Latest stable: <https://shopify.dev/docs/api/usage/versioning>.
- A retired version is not an error: Shopify falls forward to the oldest supported version. Compare the `X-Shopify-API-Version` response header with what you requested to catch it.
- `shopify.app.toml` `[webhooks] api_version` sets the payload shape of webhooks independently of the version the app's code queries.

## GraphQL gotchas

- **Two error channels.** Top-level `errors` means the query itself failed (syntax, auth, throttling). Mutations that ran but rejected input return HTTP 200 with a `userErrors` array on the payload. Check both, every time.
- **Cost, not request count.** The Admin API rate-limits by calculated query cost in a leaky bucket; bucket size and restore rate depend on the merchant's plan. Read `extensions.cost` (`requestedQueryCost`, `actualQueryCost`, `throttleStatus`) from the response and back off on a `THROTTLED` error code. Connection size drives cost - `first: 250` on a nested connection multiplies quickly.
- **Limits.** `first`/`last` max 250; input arrays max 250 items; pagination stops at 25,000 objects. Paginate with `pageInfo { hasNextPage endCursor }` and `after:`.
- **Large exports** belong in bulk operations (`bulkOperationRunQuery`), not paginated loops.
- **IDs are GIDs** (`gid://shopify/Product/123`). Theme Liquid and webhook payloads give numeric IDs; convert before querying.
- **Storefront API buyer traffic is not rate-limited** the way Admin is; bot and checkout throttles apply instead.

## Webhooks

- Verify `X-Shopify-Hmac-Sha256` against the **raw request body** with the app's client secret. Re-serialising parsed JSON changes the bytes and the HMAC fails. Compare with `crypto.timingSafeEqual`.
- Respond 200 within a few seconds and do the work asynchronously; slow responses count as failures, Shopify retries, and a subscription that keeps failing can be removed.
- Deliveries can arrive more than once and out of order: deduplicate on `X-Shopify-Webhook-Id` and use `X-Shopify-Triggered-At` / `updated_at` for ordering.
- Declare app webhooks in `shopify.app.toml`; the CLI syncs them on deploy. Mandatory privacy topics (`customers/data_request`, `customers/redact`, `shop/redact`) are required for public apps.

## Ajax cart API (themes)

Theme-only, same-origin, returns JSON. Amounts are in the store currency's minor unit (cents).

| Call | Body | Notes |
|------|------|-------|
| `GET /cart.js` | - | Full cart |
| `POST /cart/add.js` | `{ items: [{ id: variantId, quantity, properties }] }` | `id` is the **variant** ID, not the product ID |
| `POST /cart/change.js` | `{ id: lineKey, quantity }` or `{ line: n, quantity }` | `line` is 1-based; `quantity: 0` removes. Prefer the line `key` - indexes shift when lines merge |
| `POST /cart/update.js` | `{ updates: {...}, attributes: {...}, note }` | Bulk quantities, cart attributes, note |
| `POST /cart/clear.js` | - | Empties the cart |

```javascript
const res = await fetch(window.Shopify.routes.root + 'cart/add.js', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] }),
});
if (!res.ok) {
  const { description } = await res.json(); // e.g. sold out, quantity limit
  throw new Error(description);
}
```

- Use `window.Shopify.routes.root` so the call keeps the market/locale prefix.
- Add `sections: 'cart-drawer,cart-icon-bubble'` to the body to get re-rendered section HTML back in the same response (Section Rendering API) instead of a second fetch.
- A 422 means the request was understood but refused (out of stock, over a quantity rule); show `description` to the shopper.
