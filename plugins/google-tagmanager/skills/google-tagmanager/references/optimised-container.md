# The optimised container

Since 2026-10-12 a web container can be on one of two models, and advice that is right for one is wrong for the other. Statements marked **(observed)** come from practitioner field notes on live containers in late 2026 and are not in Google's documentation; everything else is from Google's help centre or release notes (Sources, below).

## The two models

| | Legacy | Optimised |
|---|---|---|
| How a Google product is loaded | A **Google tag** per product, which loads gtag.js | A **Destination tag** per Destination; the container sends data directly, with no extra gtag.js |
| Where collection settings live | In each product's Google tag settings screen, outside the container | In the container's **Settings** tab (Shared settings), inherited by every Destination |
| Ad-click cookies | Google tag or Conversion Linker | The Destination tag; a Conversion Linker is not needed where a matching Destination tag loads on every page |
| Event tags (GA4 Event, Ads conversion, Floodlight) | Unchanged | Unchanged - existing event tags and triggers are kept |
| Product users' access to the container | Granted user by user | **External account links**, created by the wizard with Read access by default |

- Destinations are GA4 web data streams, Google Ads accounts, Floodlight configurations and Merchant Center conversion sources (`MC-` ID).
- Nothing is migrated automatically. Legacy containers keep working, and a user with Edit, Approve or Publish permission chooses when to optimise.
- A Destination tag fires on **Initialization - All Pages** by default and sends a page view for its Destination automatically.
- The Settings tab holds: automatic event detection, configure your domains, user-provided data capabilities, internal traffic, unwanted referrals, session timeout, cookie settings, consent mode override and default consent settings. A setting can be overridden for one Destination in its Destination tag. Settings carried by a Google tag are not overridden by these.
- Automatic event detection covers page views (cannot be turned off), history-change page views, scrolls, outbound clicks, form interactions, video engagement and file downloads.
- Adding an event tag for a Destination that has neither a Destination tag nor a Google tag provisions a Destination tag automatically. Since April 2025, a container with Google Ads or Floodlight tags and no connected Destination tag loads a Google tag first by itself.
- External account links are permissions: they are not versioned, and are managed under Admin > External Account Links.

## Telling which model a container is on

Read the tag list (API, `gtm` CLI, MCP server or an exported container JSON) **(observed)**:

| Tags present | Model |
|---|---|
| Destination tags (API types `dest_ga`, `dest_aw`, `dest_dc`) and no `googtag` | Optimised |
| `googtag` and no Destination tag | Legacy |
| Both | Mixed - usually a half-finished migration; say so |
| Neither | No Google loader in the container; check for gtag.js on the page |

- In the UI, the Settings tab lists each Google destination with an **Optimized** column.
- Shared settings appear in a workspace as `gtagConfig` entities, identified by type and not by name **(observed)**. Types seen: `ogt_auto_events`, `ogt_1p_data_v2` (user-provided data), `ogt_ip_mark` (internal traffic), `ogt_cross_domain`, `ogt_referral_exclusion`, `ogt_session_timeout`, `ogt_cookie_settings`, `ogt_consent_defaults`, `ogt_dma`. An absent Shared setting is at Google's default, not off **(observed)**.
- A legacy Google tag's own settings are not readable through the Tag Manager API **(observed)** - on a legacy container, ask the user for the Google tag settings screen instead of assuming defaults.
- The `gtm` CLI reads these with `gtm gtag-configs list` (workspace level) and `gtm destinations list` (container level).

## Migration checklist

Migrating is a deliberate, measurement-affecting decision. The aim is that no count changes.

**Before**

- Record a baseline: counts of each automatic event and each key event or conversion over a comparable period.
- Note every Google tag, its tag ID, its triggers, and its Google tag settings - especially automatic event detection, user-provided data, internal traffic and configured domains.
- List every other source of `gtag()` on the site (a CMS plugin or hard-coded gtag.js). It will keep collecting after the migration.
- Check which GA4 Event tags already send a name automatic detection also produces (`page_view`, `form_submit`, `scroll`).

**During** - the wizard

- Start from the banner on the container Overview: **Review details** when all Google tags share settings, **Get started** when they conflict. It is also reachable from the Settings tab.
- Use the wizard, not the API. It carries each Google tag's own settings into Shared settings, which an API-only migration cannot do **(observed)**.
- When two Google tags with different settings feed one Destination, the wizard asks which settings win. Check what the losing tag carried, for example `send_page_view: false` **(observed)**.
- Check destination IDs where test and production accounts have similar names.
- **Preview changes**, then **Add to workspace**. Nothing is live until **Submit**.

**After** - before publishing

- Which workspace holds the changes - a new one or the Default Workspace **(observed)**.
- Every Google tag became a Destination tag on the right Destination; a Google tag left behind makes the container mixed **(observed)**.
- The automatic event detection Shared setting matches the old Google tag setting. It does not follow GA4 Enhanced measurement; the two are separate switches, and a disagreement doubles or drops `scroll`, `form_start`, `form_submit` and outbound clicks **(observed)**.
- User-provided data: it may arrive with automatic detection switched on **(observed)**.
- Internal traffic rules: they may not have been carried across **(observed)**.
- An External account link exists for each Destination, at the access level intended.
- Pause the Conversion Linker in the migration version instead of deleting it; remove it after a real paid click has converted **(observed)**.
- Run Preview: each Destination tag fires on Initialization, and each page sends one page view per Destination.
- After publishing, compare against the baseline for several days. To back out, undo the workspace changes, or publish the previous version.

## The install snippet (2026)

Google's install page now gives a head-only snippet. Sites on the previous two-part snippet do not need to retag.

```html
<!-- Google Tag Manager -->
<script async src="https://www.googletagmanager.com/gtm.js?id=GTM-XXXXXXX"></script>
<script>
window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());
</script>
<!-- End Google Tag Manager -->
```

What changes with it **(observed, except where a source is named)**:

- No `{'gtm.start': ..., event: 'gtm.js'}` object is pushed to `dataLayer`. Code that scans `window.dataLayer` for it breaks. Tag Manager still names its page-load event `gtm.js`, so triggers on it are unaffected.
- `gtag()` is defined by the snippet. That does not make the page a gtag.js install.
- There is no `<noscript>` iframe. Check that nothing, such as a Search Console verification, depends on it.
- A renamed data layer needs `&l=NAME` on the `src` and the inline block edited to push to `NAME`.
- A Content Security Policy using `strict-dynamic` needs the nonce on both script elements.
- The Tag Manager API's snippet endpoint was still returning the previous snippet in early November 2026.
- New snippets carry no `gtag('config')` command (Google). Since 2026-10-08, `gtm.js` snippets initialise on container load regardless of `gtag('config')`, and any such call reaches the container as a `gtag.config` event - wildcard Custom Event triggers fire on it (Google release notes).
- After a publish, browsers can hold the previous `gtm.js` for about 15 minutes.

Containers migrated from a standalone Google tag (loaded under a `G-`, `AW-`, `DC-` or `GT-` ID on the `/gtag/js` path) have a **Support gtag('config') initialization events** checkbox on the Initialization trigger; unchecking it is a measurement-affecting change. See the legacy `gtag('config')` page below.

## Sources

- Release notes (2026-10-12, 2026-10-08, 2026-07-09, 2025-03-10): <https://support.google.com/tagmanager/answer/4620708>
- Optimize your Google Tag Manager container: <https://support.google.com/tagmanager/answer/16659369>
- Destination and destination tags: <https://support.google.com/tagmanager/answer/12324388>
- Your container and Google destinations (Settings tab, External account links): <https://support.google.com/tagmanager/answer/17326492>
- Updates to Google tag and Google Tag Manager: <https://support.google.com/tagmanager/answer/17079602>
- Conversion linker: <https://support.google.com/tagmanager/answer/7549390>
- Install a web container: <https://support.google.com/tagmanager/answer/14847097>
- Manage tagging behaviour using the container ID: <https://support.google.com/tagmanager/answer/17070049>
- Manage legacy `gtag('config')` behaviour: <https://support.google.com/tagmanager/answer/18411054>
- Google tag settings (automatic event detection): <https://support.google.com/tagmanager/answer/12131703>
