# GTM CLI (owntag/gtm-cli)

[owntag/gtm-cli](https://github.com/owntag/gtm-cli) is an open-source (MIT) command-line client for the Tag Manager API v2 - a third party, not Google. It covers accounts, containers, workspaces, tags, triggers, variables, folders, environments, versions, user permissions and server-side resources, and prints JSON an agent can parse.

**Last Updated**: 2026-11-13

## Install

Check first: `command -v gtm && gtm --version`. If it is missing, show the user the command and let them choose - both write outside the project.

```bash
npm install -g @owntag/gtm-cli        # pin a release in CI: @owntag/gtm-cli@<version>
# or the project's installer (macOS, Linux, WSL):
curl -fsSL https://raw.githubusercontent.com/owntag/gtm-cli/main/install.sh | bash
```

Native Windows is unsupported; use WSL. `gtm upgrade --check` reports a newer release.

## Authenticate

| Situation | Command |
|---|---|
| A person at a terminal | `gtm auth login` - opens a browser for Google sign-in; the user completes it |
| CI, or the organisation's own Google Cloud project and quota | `gtm auth login --service-account <key.json>`, or export `GOOGLE_APPLICATION_CREDENTIALS`. The service account needs access to the GTM container |

`gtm auth status` shows the active method and account. Credentials are stored in `~/.config/gtm-cli/credentials.json`.

## Defaults

`gtm config setup` stores a default account, container and workspace, so later commands need no ID flags. `gtm config set outputFormat json` makes JSON the default output.

## Commands

Every resource follows `gtm <resource> <list|get|create|update|delete>`; `gtm <resource> --help` is the authority on flags.

```bash
gtm accounts list
gtm containers list --account-id <id>
gtm workspaces status                 # pending changes in the workspace
gtm tags list
gtm tags get --tag-id <id>
gtm tags create --name "GA4 - form_submit" --type gaawe --config '<json>'
gtm tags revert --tag-id <id>         # undo an unpublished workspace change
gtm built-in-variables enable --types "pageUrl,pagePath"
gtm gtag-configs list                 # Shared settings of an optimised container (workspace level)
gtm destinations list                 # linked Destinations (container level - takes no workspace ID)
gtm versions create --name "<name>" --notes "<notes>"
gtm versions publish --version-id <id>
```

The `--config` JSON is the API's resource body, as documented in Google's [Tag Manager API v2 reference](https://developers.google.com/tag-platform/tag-manager/api/v2). Read an existing resource with `get` and copy its shape instead of composing one from memory. Type codes worth knowing: `googtag` (Google tag, parameter `tagId`), `gaawe` (GA4 Event), `html` (Custom HTML), `v` (Data Layer Variable, parameters `name` and `dataLayerVersion`). Which container model the tag list reveals is in [optimised-container.md](optimised-container.md).

## Changing a live container

Reads are free. Before `delete`, `versions publish`, `user-permissions` changes or anything with `--force`: state the account, container and workspace and what will change, and wait for the user's approval. Work in a named workspace, check `gtm workspaces status`, and publish as a separate, approved step.
