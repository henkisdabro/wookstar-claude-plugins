# GA CLI (google-analytics-cli)

[daidalytics/google-analytics-cli](https://github.com/daidalytics/google-analytics-cli) is an open-source command-line client for the GA4 Admin and Data APIs - a third party, not Google. Unlike the bundled read-only MCP server it can also **change** configuration: properties, data streams, custom dimensions and metrics, key events, audiences and more. The command is `ga`.

**Last Updated**: 2026-11-13

## Install

Check first: `command -v ga && ga --version`. If it is missing, show the user the command and let them choose - it installs outside the project.

```bash
uv tool install google-analytics-cli
# or
pipx install google-analytics-cli
```

`ga upgrade --check` reports a newer release.

## Authenticate

| Situation | Command |
|---|---|
| A person at a terminal | `ga auth login` - browser OAuth with the user's **own** Google Cloud OAuth client: a Desktop-app `client_secret.json` in `~/.config/ga-cli/`, or `GA_CLI_CLIENT_ID` and `GA_CLI_CLIENT_SECRET`. `ga auth setup` walks through creating it |
| CI or automation | `ga auth login --service-account <key.json>`, or export `GOOGLE_APPLICATION_CREDENTIALS` |

`ga auth status` shows the active method and account. `ga config setup` stores a default account and property; `ga --profile <name> ...` keeps one client's credentials and defaults apart from another's.

## Commands

`ga agent guide` prints the tool's own quick reference for agents and `ga --describe` prints a JSON Schema of every command - read those rather than guessing flags. Output is JSON when piped; `--output compact` returns IDs and names only (tab-separated rows for report commands).

```bash
ga accounts list
ga properties list --account-id <id>
ga custom-dimensions list --property-id <id>
ga reports metadata                       # metrics and dimensions available on the property
ga reports check-compatibility ...        # is this metric and dimension pair valid?
ga reports run -m sessions,totalUsers -d date --start-date 7daysAgo
```

## Changing a property

Every create, update and delete accepts `--dry-run`, which prints the exact API request without sending it. Run the dry run, show the user the request and the property it targets, and send it only after they approve. Leave `--yes` off, so the tool's own confirmation prompt stays in place. `ga config set allowed_property_ids <ids>` (or `allowed_account_ids`) limits which properties the CLI may touch - suggest it when the user works across several clients.
