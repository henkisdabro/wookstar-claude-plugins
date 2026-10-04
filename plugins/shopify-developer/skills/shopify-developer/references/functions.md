# Shopify Functions

Functions are the only way to customise backend commerce logic. Shopify Scripts stopped executing on 30 June 2026 (editing closed on 15 April 2026), so any store still relying on a Script has lost that behaviour - rebuild it as a Function rather than debugging the Script.

A Function is a WebAssembly module inside an app. Shopify runs it at a fixed point in cart/checkout with a JSON input you shape through a GraphQL input query, and it returns JSON operations. No network access, no state between runs.

## Function APIs

| API | Replaces in Scripts terms | Typical use |
|-----|---------------------------|-------------|
| Discount | Line item and shipping Scripts | Product, order and delivery discounts from one function |
| Cart Transform | - | Bundles: expand, merge or update cart lines |
| Cart and Checkout Validation | - | Block checkout with an error (quantity rules, B2B rules) |
| Delivery Customization | Shipping Scripts (hide/rename/reorder) | Hide, rename or reorder delivery options |
| Payment Customization | Payment Scripts | Hide, rename or reorder payment methods |
| Fulfillment Constraints | - | Force items to ship together or from certain locations |
| Order Routing (location rules) | - | Rank locations for fulfilment |
| Pickup Point / Local Pickup Delivery Option Generators | - | Generate pickup options |

Targets, input fields and output operations differ per API and per version: fetch the API's schema through the Dev MCP or <https://shopify.dev/docs/api/functions> before writing the input query or the output. The older separate Product, Order and Shipping Discount APIs are superseded by the single Discount API - port them when touching them.

## Limits that shape the code

Fixed: compiled binary 256 kB, linear memory 10,000 kB, stack 512 kB, logs 1 kB. Per run (scaled for carts up to 200 lines): 11 million instructions, 128 kB input, 20 kB output. Check <https://shopify.dev/docs/api/functions> if a limit error appears - Shopify adjusts them.

- **Rust** is Shopify's strong recommendation; JavaScript/TypeScript (compiled with Javy) works but burns instructions fast on large carts.
- Instruction count scales with cart size - test with a 200-line cart, not a 3-line one.
- Keep the input query minimal: input size counts, and every field adds parsing work.
- Configuration comes from a metafield on the function owner (discount, customisation) declared as an input variable - never hardcode merchant values.

## Workflow

1. `shopify app generate extension` and choose the Function API template and language. This writes `shopify.extension.toml`, the input query (`*.graphql`), the run source and `schema.graphql`.
2. Set `api_version` in `shopify.extension.toml` to the latest stable (<https://shopify.dev/docs/api/usage/versioning>), then `shopify app function schema` to refresh `schema.graphql` and `shopify app function typegen` for typed input.
3. Write the input query, validate it against the schema (Dev MCP), then the logic.
4. Test locally: `shopify app function run` with a JSON input file, and `shopify app function replay` to rerun real executions captured during `shopify app dev`.
5. `shopify app deploy`, then activate it in the admin (a discount, or the delivery/payment customisation settings) - deployment alone does not switch it on.

Done when `function run` passes on a large-cart fixture and the instruction count in the output is comfortably under the limit.

## Migrating from a retired Script

1. Recover what the Script did - the Script Editor source if the merchant exported it, otherwise the observed checkout behaviour and the merchant's description.
2. Map each Script to the Function API in the table above; one Script may become several Functions (for example a discount plus a delivery customisation).
3. Move hardcoded values (tags, thresholds, codes) into the function's configuration metafield.
4. Functions run on every channel that uses checkout (online store, headless, B2B), where Scripts ran on the online store only - confirm the merchant wants that reach.
