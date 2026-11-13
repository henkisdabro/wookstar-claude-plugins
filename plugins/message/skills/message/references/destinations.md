# Destinations: what each composer accepts

The reference behind the destination registry (`scripts/client/destinations.js`).
For each destination it records:

- what the composer really supports
- whether typed markup converts on send, or only rich paste works
- the length limit and how it is counted
- the compose URL, if there is one

**Checked 2026-11-13** against each platform's own help or developer docs (sources are
listed per section). **unknown** means no primary source settled it. The registry then
takes the safe choice: plain text, and an "about" label on the counter.

## Shared conclusions

- **Typed markup that converts on send** is the only "markup" we emit: WhatsApp, Slack,
  Telegram, Discord, Teams (desktop and web), Reddit (Markdown editor), YouTube comments.
- **Menu-only or no formatting** gets plain text: Signal, iMessage, Messenger, X,
  LinkedIn, Facebook, Instagram, Threads, Bluesky, Mastodon, TikTok. We never fake
  formatting with Unicode "bold" letters, which break search and screen readers.
- **Rich HTML paste**: Gmail, desktop mail clients (Outlook, Apple Mail, Thunderbird).
  Teams and Slack also take rich paste, but their markup path is documented, so the
  registry uses that.

## Email

### Gmail

- **Composer:** rich HTML paste.
- **This skill:** the Gmail transform (`scripts/transform-gmail.ts`) rewrites the HTML into
  Gmail's own compose structure (unchanged by the registry).
- **Compose URL:** `https://mail.google.com/mail/?view=cm&to=&su=&cc=&bcc=`. It cannot
  carry an HTML body.
- **Limit:** none worth counting.
- **Icon:** neutral envelope glyph plus the name. Google's branding rules forbid using a
  modified Google logo and generally need permission for brand features.
  [Google brand rules](https://about.google/brand-resource-center/rules/),
  [Workspace branding](https://developers.google.com/workspace/marketplace/terms/branding)

### Outlook / Apple Mail / Thunderbird (Rich Text)

- **Composer:** rich HTML paste. The Outlook (Word) engine strips `<style>`, so every
  element carries inline styles (`scripts/transform-outlook.ts`).
- **Compose URL:** `mailto:`, which cannot carry HTML.
- **Limit:** none.
- **Source:** behaviour established in this skill's own tests and earlier work, not
  re-researched.

## Messaging

### WhatsApp

- **Typed markup** ([format your messages](https://faq.whatsapp.com/539178204879377/)):
  - `*bold*`, `_italic_`, `~strike~`
  - ```` ```monospace``` ````, `` `inline code` ``
  - `> ` quote
  - `* ` or `- ` bulleted list, `1. ` numbered list
- **Not supported:** headings, links (URLs auto-link), tables.
- **Newlines:** literal.
- **Compose URL:** `https://wa.me/?text=<urlencoded>` (pick a contact), or
  `whatsapp://send?text=` (app). [Click to chat](https://faq.whatsapp.com/5913398998672934)
- **Limit:** unknown (no primary source). No counter.
- **Tables:** a padded monospace grid while the table fits `TABLE_WIDTH_BUDGET`, stacked
  rows beyond it (`references/whatsapp-formatting.md`).

### Slack

- **Composer:** WYSIWYG toolbar with bold, italic, underline, strike, code, quote, code
  block and lists. Typed mrkdwn converts as you type:
  - `*bold*`, `_italic_`, `~strike~`
  - `` `code` ``, ```` ``` ```` blocks
  - `>` quote
  - Lists via `- ` / `1. `
- **Not supported:** headings, tables, masked links typed by hand (links are made through
  the UI).
- **Sources:** [Format your messages](https://slack.com/help/articles/202288908-Format-your-messages-in-Slack),
  [formatting reference](https://api.slack.com/reference/surfaces/formatting)
- **Limit:** the API truncates at 40,000 characters and recommends 4,000 or fewer.
  [Truncating long messages](https://docs.slack.dev/changelog/2018-truncating-really-long-messages/)
  The composer's own limit is unknown, so the counter shows "about 40,000".
- **Compose URL:** none for prefilled text. `slack://open` opens the app only, which is
  what Open uses.

### Telegram

- **Typed markup in apps** is the "old-school" set shown in Telegram's own UI hint:
  - `**bold**`, `__italic__`, `~~strike~~`
  - `` `mono` ``, ```` ``` ```` blocks
  - `||spoiler||`
  - `[text](url)`
  - [UI string](https://translations.telegram.org/chinese-ancient/android_x/settings/EditMarkdownHint2)
- **Entities available:** bold, italic, underline, strike, spoiler, blockquote, code, pre,
  text link. [Message entities](https://core.telegram.org/api/entities)
- **Beware:** the Bot API's MarkdownV2 uses a *different* syntax (`*bold*`, `_italic_`,
  `__underline__`). That is for bots only.
- **Not supported:** headings, tables, lists (no list entity, so `- ` stays literal
  text).
- **Typed markup on mobile:** unknown whether it converts on every client. Desktop and
  Android show the hint.
- **Limit:** 4,096 characters per message, counted after entity parsing.
  [sendMessage](https://core.telegram.org/bots/api#sendmessage)
- **Compose URL:** `tg://msg?text=` (unknown on desktop; Open launches the app).

### Discord

- **Markdown** ([Markdown Text 101](https://support.discord.com/hc/en-us/articles/210298617)):
  - `**bold**`, `*italic*`, `__underline__`, `~~strike~~`
  - `` `code` ``, ```` ``` ```` blocks
  - `> ` quote
  - `#`, `##`, `###` headings, `-#` subtext
  - `- ` / `* ` lists, nested with two spaces
  - `[text](url)` masked links
  - `||spoiler||`
- **Not supported:** tables.
- **Limit:** 2,000 characters; 4,000 with Nitro.
  [Sending messages](https://support.discord.com/hc/en-us/articles/360034632292),
  [account caps](https://support.discord.com/hc/en-us/articles/33694251638295)
- **Compose URL:** none (`discord://` opens the app).

### Microsoft Teams

- **Typed Markdown on desktop and web, with live preview**
  ([Use Markdown in Teams](https://support.microsoft.com/en-us/teams/chat/use-markdown-formatting-in-microsoft-teams)):
  - `**bold**`, `_italic_`, `~~strike~~`
  - Lists, links, `` `code` ``, ```` ``` ```` blocks
  - Headings, `>` quotes
- **Mobile:** views Markdown messages but cannot write them.
- **Rich HTML paste works,** including tables, so the registry uses the Rich Text payload.
- **Limit:** unknown (no primary source for the user composer).
- **Compose URL:** `msteams:` deep links need a recipient; Open is not offered.

### Signal

- **Formatting:** bold, italic, strike, monospace and spoiler, **applied from a selection
  menu or shortcuts**. Typed markup is not documented to convert.
  [Text formatting](https://support.signal.org/hc/en-us/articles/6325622209178-Text-Formatting)
- **Registry:** plain text.
- **Limit:** unknown.
- **Compose URL:** none.

### iMessage

- **Formatting:** bold, italic, underline and strike from the Text Format menu (iOS 18,
  macOS 15 and later). Recipients on older systems get plain text. Typed markup does not
  convert.
  [Format text (iPhone)](https://support.apple.com/guide/iphone/iphe5c5af4d4/ios),
  [Mac](https://support.apple.com/guide/messages/format-and-animate-text-icht7316c157/mac)
- **Registry:** plain text.
- **Limit:** none practical.
- **Compose URL:** `sms:&body=` behaviour on macOS is unknown, so Open is not offered.

### Messenger

- **Formatting in the composer:** unknown (no primary help source found).
- **Registry:** plain text.
- **Limit:** the Send API takes text under 2,000 characters.
  [Send API](https://developers.facebook.com/docs/messenger-platform/reference/send-api/)
  The app composer limit is unknown, so the counter shows "about 2,000".
- **Compose URL:** none.

## Social

### X

- **Formatting:** plain text only.
- **Counting** uses twitter-text config v3, which X's docs point to.
  [Config](https://raw.githubusercontent.com/twitter/twitter-text/master/config/v3.json),
  [counting characters](https://docs.x.com/fundamentals/counting-characters)
  - `maxWeightedTweetLength` 280, `scale` 100, `defaultWeight` 200,
    `transformedURLLength` 23.
  - Weight-100 ranges: U+0000-10FF, U+2000-200D, U+2010-201F, U+2032-2037.
  - Every emoji counts 2. The text is NFC-normalised first.
- **Account tiers** (the registry's `tiers` on the X row; Free is the default):
  - **Free: 280** weighted characters per post, the `maxWeightedTweetLength` above. A longer
    post is split into a numbered thread (below). X's help on threads: post the first, then
    "+" to add each further post.
    [Create a thread](https://help.x.com/en/using-x/create-a-thread)
  - **Premium: 25,000** characters ("longer posts"). Only Premium subscribers can create
    them; everyone can read them. A mention after the first 280 characters notifies no one,
    and a longer post cannot be scheduled.
    [About X Premium](https://help.x.com/en/using-x/x-premium)
  - How X weights characters inside a Premium longer post is not documented; the counter
    applies the same v3 weighting against 25,000 (unknown beyond that).
- **Threads in the preview:** `splitThread()` (`scripts/client/thread.js`) splits at
  paragraph, then line, then sentence, then word boundaries, and between graphemes only as
  a last resort. A URL is one word, so it is never split. Each part ends with ` i/n` (space,
  part number, slash, total), and the part's weight *including* that suffix stays within
  the limit. When the total gains a digit (9 to 10 posts) the split is re-planned with the
  wider suffix.
- **Compose URL:** `https://x.com/intent/tweet?text=`.
  [Web intent](https://docs.x.com/x-for-websites/post-button/guides/web-intent)

### LinkedIn

- **Formatting:** plain text. No native formatting is documented in the help centre.
- **Limit:** 3,000 characters per post.
  [Post and share updates](https://www.linkedin.com/help/linkedin/answer/a528176)
- **Compose URL:** the only documented share link, `share-offsite/?url=`, shares a URL
  and cannot prefill text, so Open is not offered.

### Facebook

- **Formatting:** plain text for profile posts. Group-post formatting exists only in some
  groups (unknown scope).
- **Limit:** unknown. The commonly quoted 63,206 was not found in a primary source, so
  there is no counter.
- **Compose URL:** none for text.

### Instagram

- **Formatting:** plain text.
- **Limit:** caption 2,200 characters, 30 hashtags, 20 @ tags.
  [IG User Media](https://developers.facebook.com/documentation/instagram-platform/instagram-graph-api/reference/ig-user/media)
- **Compose URL:** none.

### Threads

- **Formatting:** plain text.
- **Limit:** 500 characters (emoji count as their UTF-8 byte length per the API docs;
  the app's own counting is unknown, so the counter shows "about 500"). Text attachments
  allow 10,000.
  [Threads posts](https://developers.facebook.com/docs/threads/posts/)
- **Compose URL:** `https://www.threads.com/intent/post?text=`.
  [Web intents](https://developers.facebook.com/documentation/threads/threads-web-intents.md)
- **Thread:** a post over 500 is split the same way as X Free (`thread: true` on the row).

### Bluesky

- **Formatting:** plain text. Links and mentions become facets automatically, with no
  markup. [Rich text](https://docs.bsky.app/docs/advanced-guides/post-richtext)
- **Limit:** 300 grapheme clusters.
- **Compose URL:** `https://bsky.app/intent/compose?text=`.
  [Intent links](https://docs.bsky.app/docs/advanced-guides/intent-links)
- **Thread:** a post over 300 graphemes is split the same way as X Free (`thread: true` on the row).

### Mastodon

- **Formatting:** plain text on standard Mastodon.
- **Limit:** 500 characters by default. URLs count 23, and a mention counts only its
  username part. [Posting](https://docs.joinmastodon.org/user/posting/)
  Servers and forks can change the limit, so the counter shows "about 500".
- **Compose URL:** it is per server (`https://<server>/share?text=`), so Open is not
  offered.
- **Thread:** a post over 500 is split the same way as X Free (`thread: true` on the row).

### Reddit

- **Two editors:** Rich Text (the default) and Markdown.
- **Markdown editor:**
  - `**bold**`, `*italic*`, `~~strike~~`
  - `` `code` ``, code blocks
  - `>` quote
  - Lists, nested lists, headings
  - `[text](url)` links
  - Tables
  - `>!spoiler!<`, `^superscript`
- **Old Reddit** needs two trailing spaces for a hard line break.
- **Mobile:** the legacy Markdown editor is being retired there.
  [Formatting Guide](https://support.reddithelp.com/hc/en-us/articles/360043033952-Formatting-Guide)
- **Registry:** Reddit Markdown, with single newlines written as two trailing spaces.
- **Limit:** unknown (no primary source reachable; reddit.com refuses automated fetches).
- **Compose URL:** none without a subreddit.

### TikTok

- **Formatting:** plain text.
- **Limit:** unknown (no primary source found), so there is no counter.
- **Compose URL:** none.

### YouTube

- **Comments:** typed `*bold*`, `_italic_` and `-strike-`.
  [Post comments](https://support.google.com/youtube/answer/6000964)
- **Descriptions:** formatting through the editor, not typed markup. 5,000 characters
  (the API counts bytes).
  [Video descriptions](https://support.google.com/youtube/answer/12948449)
- **Registry:** the "YouTube" destination targets the description, so it gets plain text
  and a 5,000 counter.
- **Comment limit:** unknown.
- **Compose URL:** none.

## Generic

### Plain text

No markup at all (`references/plaintext-formatting.md`).

### Markdown

The fragment body as clean GFM: headings, emphasis, lists, quotes, code and links kept,
and tables as GFM pipe tables. Frontmatter is left out.
