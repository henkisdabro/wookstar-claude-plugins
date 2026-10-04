# Debugging

Find the symptom, apply the check. Every fix ends with the original symptom gone in the same context it appeared (same template, same market, same theme editor state).

## Tools worth reaching for

| Tool | For |
|------|-----|
| `shopify theme dev` | Local preview with hot reload; Liquid errors render inline in the page as `Liquid error (sections/x.liquid line 12): ...` |
| `shopify theme check` | Static lint: unknown filters, missing assets, deprecated tags, performance anti-patterns. Run before anything else |
| `shopify theme console` | Liquid REPL against a real store - evaluate `{{ product | json }}` without editing files |
| Shopify Theme Inspector for Chrome | Liquid render profiling (flame graph per section/snippet) |
| `shopify-ai-toolkit` / `@shopify/dev-mcp` | Validate a GraphQL query or Liquid snippet against the live schema |
| `shopify app function run` / `replay` | Re-run a Function with real input |
| `X-Shopify-API-Version` response header | Confirms which API version actually served the request |

Dump a value while debugging with `<script>console.log({{ product | json }})</script>` or `<pre>{{ section.settings | json }}</pre>`, and remove it before shipping.

## Liquid

| Symptom | Cause and fix |
|---------|---------------|
| Output is blank, no error | The object is nil in this context (`product` on a collection template, a deleted metafield, a setting never saved). Guard with `{% if %}` or `default:`. Liquid fails silently on nil property access |
| `Liquid error: ... Unknown filter` | Typo or a filter from another Liquid dialect (`format_money` is `money`). Check [liquid-filters.md](liquid-filters.md) |
| `{% section %}` errors inside a section file | Sections cannot render other sections. Use `{% render %}` for a snippet, or add the section through the JSON template |
| Variable missing inside a snippet | `{% render %}` has an isolated scope - pass every value as a parameter (`{% render 'card', product: product %}`). Old `{% include %}` code leaked parent scope; converting to `render` exposes it |
| `Liquid error: Memory limits exceeded` / slow render | Nested loops over large collections or `all_products`. Paginate, limit, or move to a section rendered on demand |
| Image URL broken or wrong size | `img_url` is deprecated; use `image_url: width: N` and `image_tag` |
| Money shows 1999 instead of $19.99 | Prices are integers in the minor unit; pipe through `money` |

## Theme editor

| Symptom | Cause and fix |
|---------|---------------|
| Section missing from "Add section" | Schema lacks `presets`, or `enabled_on`/`disabled_on` excludes this template |
| Setting changes do nothing | Markup hardcodes the value instead of reading `section.settings.<id>`, or the setting `id` was renamed (saved values live in the JSON template under the old id) |
| Clicking a block does not select it | Block wrapper lacks `{{ block.shopify_attributes }}` |
| JavaScript stops working after an edit in the editor | The editor re-renders sections without a page load. Re-initialise on `shopify:section:load` and clean up on `shopify:section:unload` |
| Schema saves rejected | Invalid JSON in `{% schema %}` (trailing comma) or a `default` that fails the setting type's validation |

## Theme cart (Ajax API)

| Symptom | Cause and fix |
|---------|---------------|
| `/cart/add.js` returns 404 or 422 "Cannot find variant" | Sent a product ID; `id` must be the variant ID |
| 422 with a `description` | Sold out, over a quantity rule, or a Cart Transform/validation Function refused it. Show `description` to the shopper |
| Cart icon or drawer stale after add | Request the sections in the same call (`sections` param) and swap the returned HTML; a separate `/cart.js` fetch races |
| Wrong locale or currency after a cart call | Calls used `/cart/...` instead of `window.Shopify.routes.root + 'cart/...'` |
| `SyntaxError: Unexpected token <` | The endpoint returned an HTML page (bad path, password page, redirect), not JSON |

## GraphQL APIs

| Symptom | Cause and fix |
|---------|---------------|
| 200 response, but nothing changed | Read the mutation's `userErrors` - input was rejected |
| `errors[].extensions.code: THROTTLED` | Over the cost budget. Read `extensions.cost.throttleStatus`, wait for restore, reduce `first:` on nested connections |
| `ACCESS_DENIED` or 403 | Missing scope. Add it in `shopify.app.toml`, deploy, and have the merchant re-approve |
| 401 / `UNAUTHENTICATED` | Wrong header (`X-Shopify-Access-Token` for Admin, `X-Shopify-Storefront-Access-Token` for Storefront) or a revoked/expired token |
| `Field 'x' doesn't exist on type 'Y'` | Field renamed or removed in this version, or never existed. Validate with the Dev MCP against the version you request |
| Behaviour changed with no code change | Your pinned version was retired and Shopify fell forward. Compare `X-Shopify-API-Version` with what you sent |

## Webhooks

| Symptom | Cause and fix |
|---------|---------------|
| HMAC never matches | Hashing re-serialised JSON. Use the raw body bytes, the app's client secret, base64 HMAC-SHA256, and `crypto.timingSafeEqual` |
| Duplicate processing | Shopify delivers at least once. Deduplicate on `X-Shopify-Webhook-Id` |
| Deliveries stop | Endpoint was slow or erroring and the subscription failed out. Return 200 fast, queue the work, check delivery metrics in the app's dashboard |
| Payload shape unexpected | `[webhooks] api_version` in `shopify.app.toml` differs from the version the code was written against |

```javascript
import crypto from 'node:crypto';

export function verifyShopifyWebhook(rawBody, hmacHeader, secret) {
  const digest = crypto.createHmac('sha256', secret).update(rawBody).digest();
  const received = Buffer.from(hmacHeader ?? '', 'base64');
  return received.length === digest.length && crypto.timingSafeEqual(digest, received);
}
```

In the React Router app template, `authenticate.webhook(request)` does this for you.

## Hydrogen

| Symptom | Cause and fix |
|---------|---------------|
| Request handler throws about a missing `storefront` | 2026.4+ requires a `storefront` instance in the load context. See [hydrogen.md](hydrogen.md) |
| Privacy banner missing, analytics silent | The server is not using Hydrogen's `createRequestHandler` (for example the old `@shopify/remix-oxygen` one), so the Storefront API proxy and consent never load |
| Customer Account login fails locally | OAuth needs the `*.tryhydrogen.dev` tunnel: `npx shopify hydrogen dev --customer-account-push` |
