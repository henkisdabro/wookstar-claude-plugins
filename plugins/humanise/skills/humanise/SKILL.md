---
name: humanise
description: Humanise text by removing AI writing patterns so it reads as human-written. Use when the user asks to humanise, de-AI or de-slop a draft, says it reads like a robot or like ChatGPT wrote it, or wants a press-release voice given a pulse. Applies 39 patterns from Wikipedia's "Signs of AI writing" and 2025-26 corpus studies of model tells. Do NOT use for grammar-only proofreading or spell checking - edit normally; or for translating text - translate directly.
metadata:
  sources-checked: "2026-11-11"
---

# Humaniser: remove AI writing patterns

> Removing AI patterns is table stakes. The job is giving the text a **pulse**.

## Where to look

| When | Read |
|---|---|
| A sample of the author's writing exists, or the text needs stance and rhythm | [voice-and-pulse.md](references/voice-and-pulse.md) |
| A pattern from the index below is present | the reference file named in its row |
| You want a worked before/after of a whole passage | [full-example.md](references/full-example.md) |
| You need the evidence behind a pattern, or which model produces it | [sources.md](references/sources.md) |
| Maintaining the skill: syncing Wikipedia, testing | [wikipedia-digest.md](references/wikipedia-digest.md), [evals.md](references/evals.md) |

## Process

1. Calibrate on the author's voice when a sample or stored profile exists.
2. Scan the text against every row of the pattern index.
3. Read the reference file for every pattern found.
4. Rewrite each flagged section, replacing the pattern with pulse where the register allows it.
5. Audit that draft against the two questions below, answering both in writing.
6. Revise into a final version that addresses both answers.
7. Return the final text, the audit answers, and a footnote listing the patterns fixed by number.

Done means every index row was checked, and both audit answers are written down.

### The audit questions

Ask these of your own draft, in these words:

1. **"What makes the text below so obviously AI generated?"** Assume it still is, and go find the reason. Asking whether it "sounds human" is a vibe check, and a draft always passes its own vibe check.
2. **"Does the rewrite state any fact, name, number, date, quote or citation that is not in the source?"**

## Never invent facts

The rewrite carries every claim from the source and adds none. No fact, name, number, date, quote or citation appears in the output unless it was in the input or the user supplied it.

The rest of this skill pulls the other way: #5 flags vague attributions and pulse asks for detail, so the tempting move is to turn "the fee increase reflects the expanded scope" into "the 12% fee increase reflects the expanded scope". That number is invented. Trade vagueness for specificity only when the specific comes from the source or the user; otherwise ask for it, or write the plain version. A fabrication is a defect even when it reads more human than the vague original.

Opinions, stance, uncertainty and rhythm are voice, and yours to add. Claims are not. Fiction is the exception: there, invented detail is the job.

## Clusters, not single hits

One or two matches anywhere is coincidence. Clusters are the signal. Never rewrite on these alone: perfect grammar, formal or academic prose, a "bland" tone, mixed registers, a lone transition word (Additionally, Notably), missing or well-formatted citations.

Tells are model- and version-specific: most of one model's tells are absent from the next version's ([sources.md](references/sources.md)). Patterns marked *historical* date a text to an older model; their absence proves nothing.

**An author's own sample outranks every pattern here**, including #13. A tell is only a tell in writing that is not theirs.

## Pattern index

### Content - [content-patterns.md](references/content-patterns.md)

| # | Pattern | Key signals |
|---|---------|-------------|
| 1 | Inflated significance and legacy | stands as, testament, pivotal, broader trends, indelible mark |
| 2 | Inflated notability and media coverage | featured in [outlets], independent coverage, active social media presence |
| 3 | Superficial -ing analyses | highlighting..., ensuring..., reflecting..., showcasing... |
| 4 | Promotional language (*historical*, 2023-25) | boasts, vibrant, nestled, breathtaking, stunning |
| 5 | Vague attributions | Experts argue, Industry reports, Some critics argue |
| 6 | Formulaic challenges sections | Despite its..., Despite these challenges, Future Outlook |
| 35 | Emphasis on identification by sources (2026) | [source] identifies/lists/describes X as, Reuters reported..., describing him as |

### Language - [language-patterns.md](references/language-patterns.md)

| # | Pattern | Key signals |
|---|---------|-------------|
| 7 | AI vocabulary and stock phrases (by era and model) | 2023-24: delve, tapestry; 2026: dependable, meaningful, deliberate, steady, furthermore, fast-paced world |
| 8 | Copula avoidance | serves as, stands as, boasts, features, refers to |
| 9 | Negative parallelisms and corrective framing | not just X but Y, it's not X it's Y, X rather than Y, less like X and more like Y |
| 10 | Rule of three | three-item lists in every sentence |
| 11 | Synonym cycling (*historical*) | protagonist / main character / central figure |
| 12 | False ranges | from X to Y where X and Y share no scale |
| 32 | Vague connection | associated with, in connection with, connected to |
| 36 | Mannered prose (2026) | metaphor in place of a literal phrase: a dial worth turning, earns its keep |
| 37 | Trade-off denial (2026) | without sacrificing, without losing, without compromising, without requiring |
| 38 | Intensifiers and superlatives (2026, Claude and Gemini) | single most, arguably the most, every single, genuinely, incredibly, absolutely |
| 39 | Dense, noun-heavy prose | nominalisations, long sentences, few paragraph breaks |

### Style - [style-patterns.md](references/style-patterns.md)

| # | Pattern | Key signals |
|---|---------|-------------|
| 13 | Em dashes (*historical*, 2022-Sept 2026) | dashes for drama; current models have nearly stopped |
| 14 | Boldface overuse | mechanical **bolding** |
| 15 | Inline-header lists | **Header:** description bullets |
| 16 | Title Case headings | Every Word Capitalised |
| 17 | Emoji decoration | emojis on headings and bullets |
| 18 | Curly quotation marks | “smart quotes” (ChatGPT, DeepSeek) |
| 25 | Unusual tables | small tables better as prose |
| 26 | Skipped heading levels | H2 straight to H4 |
| 29 | Thematic breaks before headings | `---` before every heading |
| 30 | Leaked chatbot markup | oaicite, turn0search0, [cite: 1], `<mark>`, utm_source=chatgpt.com |

### Communication - [communication-patterns.md](references/communication-patterns.md)

| # | Pattern | Key signals |
|---|---------|-------------|
| 19 | Chat artefacts | I hope this helps, Let me know, Here is a..., verify ... before publishing |
| 20 | Hedging disclaimers | not widely documented, should be treated as X rather than Y, does not by itself establish |
| 21 | Sycophantic tone | Great question!, You're absolutely right! |
| 27 | Subject lines pasted into content | Subject: ... left in the body |
| 28 | Placeholder text | [Name], 2025-XX-XX, example.com citations |
| 34 | Procedural self-congratulation in change summaries | refined, streamlined, ensured adherence, preserved, avoided |

### Filler and hedging - [filler-patterns.md](references/filler-patterns.md)

| # | Pattern | Key signals |
|---|---------|-------------|
| 22 | Filler phrases | In order to, Due to the fact that |
| 23 | Excessive hedging | could potentially, may provide, not necessarily |
| 24 | Generic positive conclusions | future looks bright, exciting times |
| 31 | Didactic disclaimers and recaps (*historical*) | it's important to note, In summary, Overall |
| 33 | Announced significance and plain speech | this matters, matters because, why X matters, to put it plainly |

#33 is **non-negotiable where an author's own rules ban it**: it then applies to every reply and file, not only to text being humanised.

## When not to use

- Text already clearly human-written: humanising it adds its own artificiality.
- Grammar or spelling requests: edit normally.
- Legal, medical, regulatory or reference text, and code comments: plain precision outranks voice, so remove patterns but add no stance.
