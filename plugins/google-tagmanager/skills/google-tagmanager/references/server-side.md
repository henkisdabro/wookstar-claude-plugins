# Server-Side Tagging (sGTM)

**Sources**:

- <https://developers.google.com/tag-platform/tag-manager/server-side/intro>
- <https://developers.google.com/tag-platform/tag-manager/server-side/cloud-run-setup-guide>
- <https://developers.google.com/tag-platform/tag-manager/server-side/custom-domain>

## How it fits together

A **server container** runs on a **tagging server** you host. The browser (or app) sends measurement requests to that server instead of straight to vendors; the server container decides what to forward and where.

```
Browser (web container / gtag.js)
   |  HTTPS request to your tagging server
   v
Tagging server --> Client claims the request --> builds event data
                                                     |
                                    Tags fire on triggers (event name, etc.)
                                                     v
                                     GA4, Google Ads, Meta CAPI, ...
```

- **Clients** are adapters: each inspects incoming requests, *claims* the ones it understands (the GA4 client claims GA4 `/g/collect` hits), turns them into event data, and returns the response to the browser. Exactly one client claims each request.
- **Tags** work as in a web container: they fire on triggers evaluated against the event data a client produced, and send it onward.
- **Transformations** allow, exclude or augment event parameters before tags see them - the place to strip PII centrally.
- New server containers come with a GA4 client and GA4 tag type preinstalled.

## Setup steps

1. In GTM, create a container of type **Server**. Copy the **Container Config** string it shows.
2. Provision hosting (see below), giving it the Container Config. Two services run: a **tagging server** for live traffic and a **preview server** for Preview mode.
3. Map a first-party custom domain to the tagging server (see below), then set the container's **Server container URL** in Container Settings.
4. In the web container's **Google tag**, add the configuration parameter `server_container_url` with the custom domain URL (gtag.js equivalent: `gtag('config', 'G-XXXXXXXXXX', { server_container_url: 'https://metrics.example.com' })`).
5. In the server container, keep the GA4 client and add a **Google Analytics: GA4** tag triggered by the client's events (for example, Client Name equals GA4).
6. Run Preview in both containers and confirm the server container shows incoming requests, the GA4 client claiming them, and the GA4 tag firing. Then confirm hits in GA4 DebugView.

Done when Preview in the server container shows the GA4 tag firing for a page view sent from the site via the custom domain.

## Hosting

| Option | Notes |
|--------|-------|
| Google Cloud Run (Google's recommended path) | Provision automatically from GTM or manually. Image `gcr.io/cloud-tagging-10302018/gtm-cloud-image:stable`, configured by env vars `CONTAINER_CONFIG`, `RUN_AS_PREVIEW_SERVER` (preview service) and `PREVIEW_SERVER_URL` (tagging service). Production guidance: minimum 2 instances to avoid data loss, autoscale to around 10. Google estimates roughly USD 45/month per always-on instance - check the pricing calculator. |
| Managed hosts (Stape and similar) | Third-party providers that run the tagging server for you: paste the Container Config into their dashboard and they handle scaling, domain mapping and extras such as custom script loaders. |
| Manual / other cloud | Run the same container image on your own infrastructure. |

## First-party custom domain

Use a custom domain before going to production - the default `*.run.app` (or vendor) domain can only set JavaScript cookies, while a first-party domain lets the server set HTTP cookies.

| Option | Example | Setup |
|--------|---------|-------|
| Subdomain | `https://metrics.example.com` | DNS record pointing at the tagging server |
| Same origin (path) | `https://www.example.com/metrics` | CDN or load balancer forwards the path to the tagging server |

## Consent

The GA4 client reads the consent state the Google tag sends with each request, and Google tags in the server container honour it. Consent still has to be set correctly in the web container - see the Consent Mode section of SKILL.md.

## Debugging

Server-container Preview opens its own Tag Assistant view listing each incoming request, which client claimed it, the event data, and outgoing HTTP requests from tags. See <https://developers.google.com/tag-platform/tag-manager/server-side/debug>.
