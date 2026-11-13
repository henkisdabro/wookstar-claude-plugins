# Sources and model eras

Evidence behind the patterns, and which models produce which tells. Read when you need to justify a flag, date a text, or update the skill. Last checked 2026-11-11.

## Primary sources

| Source | What it is | Supports |
|---|---|---|
| [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing), with its [Style](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing/Style) and [Markup](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing/Markup) subpages | Field guide kept by WikiProject AI Cleanup, built from thousands of real examples. Strongest on encyclopedic and biographical text | Most of #1-35; the historical/era labels; signs of human writing; ineffective indicators |
| [Graphite, "AI Tells"](https://graphite.io/five-percent/research/ai-tells) (16 September 2026), [Opus 5.5 update](https://graphite.io/five-percent/research/ai-tells-opus-5-5-update) (1 October 2026), [Gemini 4 Argon update](https://graphite.io/five-percent/research/ai-tells-gemini-4-argon-update) (21 October 2026) | 10,000 pre-ChatGPT web articles against articles on the same topics from each of up to eleven models. Data downloadable under a Creative Commons licence. A company report, not peer-reviewed; web articles only, so chat replies and edit summaries are not covered | 2026 vocabulary (#7), corrective framing (#9, #20), #33, #36-39, em dash rates (#13), human-side signs |
| [Anthropic, Prompting Claude Fable 5.1](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1) | Vendor guidance naming "mannered prose" and denser prose as known habits of its own model | #36, #39 |
| [Reinhart et al., "Do LLMs write like humans?", PNAS 2025](https://www.pnas.org/doi/10.1073/pnas.2422455122) | Biber-feature comparison of human and model text across genres | #3 (participial clauses 2-5x), #39 (nominalisations 1.5-2x), instruction tuning as the cause |
| [Kobak et al., "Delving into LLM-assisted writing in biomedical publications through excess vocabulary", Science Advances 2025](https://www.science.org/doi/10.1126/sciadv.adt3813) | Excess-word analysis of 15 million PubMed abstracts, 2010-2024 | #7 (2023-24 vocabulary); [word list](https://github.com/berenslab/llm-excess-vocab) |
| [Juzek and Ward, "Why Does ChatGPT 'Delve' So Much?", COLING 2025](https://arxiv.org/abs/2412.11385) | Traces lexical overuse to learning from human feedback | #7 (why the words exist, and why they shift between versions) |
| [Freeburg, "The Last Fingerprint: How Markdown Training Shapes LLM Prose", arXiv 2026](https://arxiv.org/abs/2603.27006) | Suppression experiment across twelve models | #13 (em dash as Markdown leakage and fine-tuning fingerprint) |
| [Russell, Karpinska and Iyyer, ACL 2025](https://aclanthology.org/2025.acl-long.267/) | People who use ChatGPT heavily detect AI text accurately; they key on vocabulary, formulaic structure and lack of originality | The skill's premise: clusters of style tells are detectable |
| [The Economist, "How to spot AI writing" (30 July 2026)](https://www.economist.com/culture/2026/07/30/how-to-spot-ai-writing) | Paywalled; cited by Wikipedia | #10, #13 (its em dash finding now predates Opus 5.5) |

## What the 2026 evidence changes

- **Tells move between versions; they do not go away.** 65% of Graphite's tells belong to one model family, and 55-72% change between consecutive versions of a family. Opus 5.5 still has 2,548 tells, only 4% fewer than Opus 5. A word list keyed to one model misses the next.
- **The classic list is fading.** The strength of eleven well-known tells (delve, landscape and similar) fell 21-50% across families. Their presence now dates a text more than it detects one.
- **Structural tells outlast vocabulary.** Corrective framing (#9, #20), announced significance (#33), participial clauses (#3) and low variation in sentence length all persist across versions, and corrective framing is still rising in GPT models.
- **Closer to human is not the same as human.** Claude's word distribution moved 19% closer to human writing from Opus 5 to 5.5, while GPT-6 Astra moved 8% further away than GPT-5.6 Sol.

## Model fingerprints (late 2026)

| Family | Leans towards | Has dropped |
|---|---|---|
| GPT (GPT-5.6 Sol, GPT-6 Astra) | Corrective framing (#9, #20), hedging with "may" (#23), evaluative adjectives (dependable, practical), "matters because" (#33), trade-off denial (#37) | Em dashes (88% below human), marketing verbs (unlock, elevate, streamline) |
| Claude (Opus 5, Opus 5.5) | "less like X, more like Y" and "rather than merely" (#9), superlative framing (#38), mannered prose (#36), "this matters" (#33), concrete-sounding numbers and timeframes (twenty minutes, a dozen) | Em dashes (Opus 5.5: over 99% below Opus 5), hype words (groundbreaking, paramount), "is genuinely" |
| Gemini (3.1 Pro, 4 Argon) | Intensifiers (#38), formal transitions (furthermore, additionally), stock phrases, mannered prose (highest of the three), `<mark>` and `[cite: n]` markup (#30) | Contractions (3.1 Pro); em dashes mostly (Argon 38% below human, but five times Astra's rate) |
| Grok | causal, empirical, correlate, underscore; "X rather than Y" | - |

The concrete-numbers drift in Claude is worth knowing for the never-invent rule: a model that likes "twenty minutes" and "a dozen" will happily produce them without a source.

## Softened or removed

- **Pro-authoritarian bias** - removed from Wikipedia on 10 November 2026 after talk-page agreement that it cannot tell writing from model output. Gone from this skill.
- **Online presence ("active social media presence")** - split out and tagged outdated on Wikipedia; flagged for a move to historical (#2).
- **#1, #2, #5, #7, #8** - Wikipedia tagged their examples as outdated (none from 2026) on 10 November 2026. Still valid, but weaker evidence than the 2026 patterns.
- **Superlatives and intensifiers as signs of human writing** - qualified, because Claude and Gemini now overuse them (#38).
- **Em dashes** - Opus 5.5 removes the last major model that still out-dashed human writers.

## Watching, not adopted

Raised on the Wikipedia talk page in October-November 2026 but not yet in the article or measured elsewhere. Do not flag on these:

- Teaser framing: "and here's the crazy part", "this is the part they don't tell you about", "something nobody expected". Seen in video narration, rare in written text so far. Overlaps #33.
- Abstract-noun evasion: summarising a concrete dispute as "a disputed authorship claim" or "a typical source-attribution disclaimer", one level more abstract than a person would put it. Suspected Claude habit, anecdotal.
