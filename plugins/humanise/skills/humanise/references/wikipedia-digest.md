# Wikipedia Source Digest

Last fetched: 2026-05-15
Source: https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing
Maintained by: WikiProject AI Cleanup

This file is a structured digest of the Wikipedia article used to build this skill. When updating the skill, fetch the latest Wikipedia article and compare against this digest to identify changes.

## How to Update

1. Fetch the latest article:
   ```
   WebFetch https://markdown.new/https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing
   ```
2. Compare the fetched content against this digest below
3. Look for: new patterns, removed patterns, renamed patterns, updated keywords, new examples, new model-era information
4. Update the relevant reference files and this digest

---

## Pattern Digest (as of 2026-04-15)

### Content Patterns

| # (Wiki) | # (Skill) | Pattern Name | Key Signals |
|-----------|-----------|--------------|-------------|
| 5 | 1 | Undue emphasis on significance/legacy/broader trends | stands as, testament, pivotal, broader, indelible mark, evolving landscape |
| 6 | 2 | Undue emphasis on notability/attribution/media coverage | independent coverage, music/business/tech outlets, profiled in, social media presence, leading expert |
| 7 | 3 | Superficial analyses (-ing endings) | highlighting, ensuring, reflecting, symbolizing, contributing to, showcasing, valuable insights, align/resonate with |
| 8 | 4 | Promotional/advertisement-like language | boasts, vibrant, nestled, featuring, diverse array, showcasing, exemplifies, commitment to |
| 10 | 5 | Vague attributions and overgeneralisation | Experts argue, Industry reports, Some critics argue, Observers have cited |
| 11 | 6 | Outline-like challenges and future prospects | Despite its..., Despite these challenges, Future Outlook |
| 12 | - | Leads treating titles as proper nouns | Wikipedia-specific; not included in skill |

Note: Wiki section 9 ("Vague See Also sections") appears to have been removed from the article since the 2026-03-03 snapshot. It was Wikipedia-specific and was never included in the skill.

### Language and Grammar Patterns

| # (Wiki) | # (Skill) | Pattern Name | Key Signals |
|-----------|-----------|--------------|-------------|
| 14 | 7 | AI vocabulary words (era-specific) | See era breakdown below |
| 15 | 8 | Copula avoidance (is/are) | serves as, stands as, marks, represents, boasts, features, offers |
| 16 | 9 | Negative parallelisms | Not only...but..., It's not just...it's..., No...no...just... |
| 19 | 10 | Rule of three | three-item lists, triadic structures |
| 20 | 11 | Elegant variation (synonym cycling) | protagonist/main character/central figure/hero cycling |

### Style Patterns

| # (Wiki) | # (Skill) | Pattern Name | Key Signals |
|-----------|-----------|--------------|-------------|
| 22 | 16 | Title Case headings | Every Word Capitalised In Headings |
| 23 | 14 | Overuse of boldface | mechanical bolding of terms |
| 24 | 15 | Inline-header vertical lists | **Header:** description bullet points |
| 25 | 17 | Emoji decoration | emojis on headings and bullet points |
| 26 | 13 | Overuse of em dashes | excessive -- usage for dramatic effect |
| 27 | 25 | Unusual use of tables | small unnecessary tables better as prose |
| 28 | 18 | Curly quotation marks and apostrophes | smart quotes (ChatGPT/DeepSeek trait; Gemini/Claude avoid) |
| 29 | 27 | Subject lines pasted into content | email-style subject lines left in body |
| 30 | 26 | Skipped heading levels | H2 to H4 jumps, accessibility violation |
| 31 | 29 | Thematic breaks before headings | `----` horizontal rules inserted before every heading, Markdown artifact |

### Communication Patterns

| # (Wiki) | # (Skill) | Pattern Name | Key Signals |
|-----------|-----------|--------------|-------------|
| 32 | 19 | Collaborative communication artifacts | I hope this helps, Let me know, Here is a... |
| 33 | 20 | Knowledge-cutoff disclaimers | as of [date], based on available information |
| 34 | 28 | Phrasal templates and placeholder text | [Name], 2025-XX-XX, unfilled blanks |

### Skill-Only Patterns (not from Wikipedia)

| # (Skill) | Pattern Name | Key Signals |
|-----------|--------------|-------------|
| 12 | False ranges | from X to Y where X and Y aren't on a scale |
| 21 | Sycophantic tone | Great question!, You're absolutely right! |
| 22 | Filler phrases | In order to, Due to the fact that |
| 23 | Excessive hedging | could potentially possibly |
| 24 | Generic positive conclusions | future looks bright, exciting times |

---

## AI Vocabulary Era Breakdown (as of 2026-05-15)

### 2023 to mid-2024 (GPT-4 era)

Additionally, boasts, bolstered, crucial, delve, emphasizing, enduring, garner, intricate/intricacies, interplay, key, landscape, meticulous/meticulously, pivotal, underscore, tapestry, testament, valuable, vibrant

### Mid-2024 to mid-2025 (GPT-4o era)

align with, bolstered, crucial, emphasizing, enhance, enduring, fostering, highlighting, pivotal, showcasing, underscore, vibrant

### Mid-2025 onward (GPT-5 era)

emphasizing, enhance, highlighting, showcasing, robust, plus increased notability-related terms (independent coverage, media outlets)

### Models with distinct traits

- **ChatGPT/DeepSeek**: Curly quotation marks and apostrophes
- **Gemini/Claude**: Typically avoid curly quotes
- **ChatGPT (GPT-5.1+)**: Attempted suppression of em dash overuse; em dash tell now weaker for newer ChatGPT output
- **All models**: Rule of three, copula avoidance, negative parallelisms

### New word: robust (added 2026-05-15)

"Robust" added to Wikipedia's main AI vocabulary words-to-watch list, appearing in the GPT-5 era alongside "enhance", "highlighting", "showcasing".

### WP:CONCRETE note (added 2026-05-15)

When AI chatbots respond to AI-detection allegations, they characteristically use "concrete" as an adjective: "no concrete evidence", "please provide concrete examples". Not a general writing tell - specific to defensive AI responses.

---

## Changes from 2026-04-23 to 2026-05-15

1. **New AI vocabulary word: "robust"** - Added to Wikipedia's main words-to-watch list. Appearing in GPT-5 era text alongside enhance/highlighting/showcasing. Added to skill language-patterns.md Pattern #7 all-era list.
2. **WP:CONCRETE defensive usage** - Wikipedia documents that AI chatbots use "concrete" characteristically when defending against AI-detection allegations ("no concrete evidence"). Not a general writing tell. Added as note to language-patterns.md Pattern #7.
3. **GPT-5.1 em dash suppression** - Wikipedia notes OpenAI's GPT-5.1 attempted to suppress em dash overuse. Pattern #13 now less reliable for newer ChatGPT output; use in combination with other indicators. Added to style-patterns.md.
4. **Pattern #3 sub-pattern: "generated debate"** - Wikipedia now explicitly documents AI claiming things "generated debate", "prompted broader reflection", "shaped emerging policy discussions" - synthetic impact claims not limited to -ing endings. Added to content-patterns.md.
5. **Historical indicators section (new)** - Wikipedia added a section for patterns now uncommon in newer models: didactic disclaimers ("it's important to note", "worth noting", "may vary") and section summaries ("In summary", "In conclusion", "Overall"). Added to filler-patterns.md with historical context.
6. **New Wikipedia-only sections (NOT added to skill)** - Wikipedia now has dedicated sections for: Markup (wikitext/Markdown artifacts, turn0search0, oaicite tags), Citations (broken links, invalid DOIs/ISBNs), Miscellaneous (edit summary tells, permissions gaming), and expanded AI-written comments indicators (wikilawyering, canned quality emphasis). These are Wikipedia-specific and not relevant to general text humanising.
7. **Notability pattern expanded** - New examples: "strong digital presence", "actively shares updates and events". Skill pattern #2 already covers this adequately.
8. **"Signs of human writing" section added** - Wikipedia now documents what DOESN'T indicate AI: perfect grammar, formal prose, transition words in isolation, unsourced content. Not added to skill (already covered by "When NOT to Use").

## Changes from 2026-04-18 to 2026-04-23

1. **Pattern #20 expanded to "Knowledge-Cutoff Disclaimers and Source-Gap Speculation"**: Wikipedia now documents a second behaviour alongside cutoff disclaimers - RAG-enabled models speculate about undocumented information as if it "likely" exists somewhere. New signals: `not widely available/documented`, `in the provided/available sources`, `likely exists`, `probably documented`. Updated communication-patterns.md with new before/after example.
2. **Article renumbered**: Wikipedia restructured to 22 sections (content 1-7, language 8-13, style 14-20, communication 21-22). Four patterns previously documented (emoji decoration, em dash overuse, subject lines in content, placeholder text) are no longer explicitly present - treated as extraction uncertainty rather than confirmed removals; retained as skill-only patterns.
3. **No changes** to AI vocabulary word lists or era breakdowns.

## Changes from 2026-04-15 to 2026-04-18

1. **Negative parallelisms now documented as two distinct subtypes** (Wiki patterns 10 and 11): Previously one pattern, now explicitly split into (A) "Not only X but also Y" and (B) "Not X, not Y, just Z". Updated skill #9 in SKILL.md and language-patterns.md with both subtypes and separate examples.
2. **No changes** to AI vocabulary word lists, other existing patterns, or model-specific traits.

## Changes from 2026-03-23 to 2026-04-15

1. **New pattern: Thematic breaks before headings** (Wiki section 31, skill #29): AI chatbots insert `----` horizontal rules before every heading, a Markdown artifact from chat output. Added to style-patterns.md and SKILL.md.
2. **No changes** to AI vocabulary word lists, other existing patterns, or model-specific traits.

## Changes from 2026-03-03 to 2026-03-23

1. **AI vocabulary GPT-4 era expanded**: Added boasts, bolstered, crucial, emphasizing, key, landscape, meticulously
2. **AI vocabulary GPT-4o era reshuffled**: Added bolstered, enduring, pivotal, underscore, vibrant; removed key/landscape (moved to GPT-4 era)
3. **Superficial analyses**: Added "valuable insights" and "align/resonate with" to words to watch
4. **Notability**: Added "music/business/tech outlets" and "profiled in" to words to watch
5. **Promotional language**: Added "featuring" and "diverse array" to words to watch
6. **Curly quotes**: Now explicitly notes Gemini/Claude typically avoid them (previously only mentioned ChatGPT/DeepSeek as users)
7. **Vague See Also**: Section appears removed from Wikipedia article (was already excluded from skill)

---

## Key Insights from Wikipedia

- "LLMs use statistical algorithms to guess what should come next. The result tends toward the most statistically likely result that applies to the widest variety of cases."
- AI detection tools have non-trivial error rates; heavy LLM users achieve ~90% accuracy, casual users barely exceed random chance
- Surface-level fixes (removing boldface, correcting markup) may just obscure detection; actual problems require addressing deeper issues
- One study documented a 10% reduction in "is/are" usage in text post-2022
- Not all flagged text is AI-generated; humans sometimes write similarly
