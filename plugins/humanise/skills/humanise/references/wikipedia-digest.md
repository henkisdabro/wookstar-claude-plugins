# Wikipedia Source Digest

Last fetched: 2026-09-09
Last checked: 2026-09-09 (six changes applied - see below)
Previously fetched: 2026-08-21, 2026-08-02
Source: https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing
Maintained by: WikiProject AI Cleanup

This file is a structured digest of the Wikipedia article used to build this skill. When updating the skill, fetch the latest Wikipedia article and compare against this digest to identify changes.

## How to Update

1. Fetch the latest article as raw wikitext (WebFetch's summariser drops the words-to-watch boxes, so pull the source and read it directly):
   ```
   curl -sL "https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing?action=raw" -o wiki.txt
   grep -n "^=" wiki.txt          # section list
   grep -n "Words to watch" wiki.txt
   ```
   Faster route when the last-checked date is recent: diff that revision against current and read only what moved.
   ```
   UA="humanise-skill-sync/1.0"
   curl -s -A "$UA" "https://en.wikipedia.org/w/api.php?action=query&prop=revisions&titles=Wikipedia:Signs_of_AI_writing&rvlimit=30&rvprop=ids|timestamp|comment|size&format=json"
   curl -s -A "$UA" "https://en.wikipedia.org/w/api.php?action=compare&fromrev=<REVID>&torelative=cur&prop=diff&format=json"
   ```
   The API needs a User-Agent header or it returns 403. Never strip `<ref>` tags with a
   non-greedy regex before reading a section: `<ref name="x"/>` opens a match that runs to
   the next `</ref>`, silently eating the bullets in between and inventing a mangled list.
2. Compare the fetched content against this digest below
3. Look for: new patterns, removed patterns, renamed patterns, updated keywords, new examples, new model-era information
4. Update the relevant reference files and this digest

---

## Pattern Digest (as of 2026-09-09)

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
| 15 | 8 | Copula avoidance (is/are) | serves as, stands as, marks, functions as, operates as, represents, boasts, features, maintains, offers, refers to |
| new | 32 | Vague expression of connection or association | in connection with/to, connected with/to, in association with, associated with (WP:AICONNECT, added 2026-08-19; sits between copula avoidance and negative parallelisms) |
| 16 | 9 | Negative parallelisms (3 subtypes) | (A) Not just X but also Y, (B) Not X, but Y, (C) X rather than Y (Grok); also runs across sentence boundaries via "however" |
| 19 | 10 | Rule of three | three-item lists, triadic structures |

### Style Patterns

| # (Wiki) | # (Skill) | Pattern Name | Key Signals |
|-----------|-----------|--------------|-------------|
| 22 | 16 | Title Case headings | Every Word Capitalised In Headings |
| 23 | 14 | Overuse of boldface | mechanical bolding of terms |
| 24 | 15 | Inline-header vertical lists | **Header:** description bullet points |
| 25 | 17 | Emoji decoration | emojis on headings and bullet points |
| 26 | 13 | Overuse of em dashes | excessive -- usage for dramatic effect. **Tagged by Wikipedia 2026-09 for possible demotion to Historical indicators** |
| 27 | 25 | Unusual use of tables | small minimally formatted tables better as prose; also Markdown table syntax nested inside another markup's table. Strengthened 2026-09 from "in rare cases" |
| 28 | 18 | Curly quotation marks and apostrophes | smart quotes (ChatGPT/DeepSeek trait; Gemini/Claude avoid) |
| 29 | 27 | Subject lines pasted into content | email-style subject lines left in body |
| 30 | 26 | Skipped heading levels | H2 to H4 jumps, accessibility violation |
| 31 | 29 | Thematic breaks before headings | `----` horizontal rules inserted before every heading, Markdown artifact |

### Markup Patterns (Wiki section "Markup")

| Wiki subsection | # (Skill) | Pattern Name | Key Signals |
|-----------------|-----------|--------------|-------------|
| Use of Markdown | 30 | Markdown surviving into a non-Markdown destination | `## Heading`, `**bold**`, ` ```wikitext ` fences |
| Internal formatting and reference markup bugs | 30 | Leaked chatbot citation artifacts | ChatGPT: contentReference, oaicite/oai_citation, turn0search0/turn0image0, `Example+1`, attributableIndex JSON, utm_source=chatgpt.com. Gemini: `[cite: 1]`, `[span_1](start_span)`. Grok: grok_card, grok_render_citation_card_json. DeepSeek: lenticular brackets, daggers. Perplexity: attached_file, ppl-ai-file-upload. Unclassified: `:::writing` |
| Broken wikitext | - | Wikipedia-specific; not included in skill |

### Communication Patterns

| # (Wiki) | # (Skill) | Pattern Name | Key Signals |
|-----------|-----------|--------------|-------------|
| 32 | 19 | Collaborative communication artifacts | I hope this helps, Let me know, Here is a... |
| 33 | 20 | Knowledge-cutoff disclaimers | as of my last knowledge update, based on available information. Bare *as of [date]* removed by Wikipedia 2026-09 |
| 34 | 28 | Phrasal templates and placeholder text | [Name], 2025-XX-XX, unfilled blanks |
| Edit summaries (4 subsections) | 34 | Procedural self-congratulation in change summaries | refined, streamlined, enhanced, ensured adherence to, preserved, retained, avoided, improved clarity and flow. Generalised from Wikipedia edit summaries to commit messages, PR descriptions, changelogs |

### Historical Indicators (Wiki section "Historical indicators")

| Wiki subsection | # (Skill) | Pattern Name | Key Signals |
|-----------------|-----------|--------------|-------------|
| Didactic disclaimers (Nov 2022-2024) | 31 | Didactic disclaimers | it's important/critical/crucial to note/remember/consider, worth noting, may vary |
| Section summaries | 31 | Section summaries | In summary, In conclusion, Overall |
| Prompt refusal | 31 (noted) | Refusal boilerplate | as an AI language model, I cannot offer medical advice but |
| Abrupt cut offs | 31 (noted) | Generation-limit truncation | text stops mid-sentence |
| Outdated access-date parameters | - | Wikipedia-specific; not included in skill |
| Lexical diversity/elegant variation | 11 | Synonym cycling | Demoted from "Language and grammar" to historical on 2026-08-18 - modern models no longer carry a repetition penalty. Wikipedia's own caveat: non-native speakers avoid repetition too (Italian schooling teaches it) |

### Signs of Human Writing (Wiki section "Signs of human writing")

Captured in SKILL.md under "Signs of human writing (put these back)". Empirically more common in human text than AI text: simple is/has phrases; plain verbs over stiff synonyms (wrote/authored, moved/relocated, used/utilized, tried/attempted, died/passed away); superlative or definitive statements (one of the best, is the only, was the first); hedging qualifiers and intensifiers (very, perhaps, tends to); isolated wordy constructions (as a result of, in order to, all of the, a part of, the fact that).

Note the deliberate tension with skill #22 - Wikipedia lists wordy constructions as a human tell while #22 trims them. SKILL.md carries the reconciliation.

### Ineffective Indicators (Wiki section "Ineffective indicators")

Captured in SKILL.md under "Weak signals - never rewrite on these alone": perfect grammar; mixed casual/formal register; "bland" or "robotic" prose; "fancy"/academic/formal prose; transition words in isolation; unsourced content; bizarre wikitext; correct wikitext.

### Skill-Only Patterns (not from Wikipedia)

| # (Skill) | Pattern Name | Key Signals |
|-----------|--------------|-------------|
| 12 | False ranges | from X to Y where X and Y aren't on a scale |
| 21 | Sycophantic tone | Great question!, You're absolutely right! |
| 22 | Filler phrases | In order to, Due to the fact that |
| 23 | Excessive hedging | could potentially possibly |
| 24 | Generic positive conclusions | future looks bright, exciting times |

---

## AI Vocabulary Era Breakdown (as of 2026-08-02)

### 2023 to mid-2024 (GPT-4 era)

Additionally, boasts, bolstered, crucial, delve, emphasizing, enduring, garner, intricate/intricacies, interplay, key, landscape, meticulous/meticulously, pivotal, underscore, tapestry, testament, valuable, vibrant

### Mid-2024 to mid-2025 (GPT-4o era)

align with, bolstered, crucial, emphasizing, enhance, enduring, fostering, highlighting, pivotal, showcasing, underscore, vibrant

### Mid-2025 onward (GPT-5 era)

emphasizing, enhance, highlighting, showcasing, plus increased notability-related terms (independent coverage, media outlets)

### Full words-to-watch box (superset of the era lists)

Additionally (especially sentence-initial), align with, boasts (meaning "has"), bolstered, crucial, **deep dive**, delve, emphasizing, enduring, enhance, fostering, garner, highlight (as a verb), interplay, intricate/intricacies, key (as an adjective), landscape (as an abstract noun), meticulous/meticulously, pivotal, **robust**, showcase, tapestry (as an abstract noun), testament, underscore (as a verb), valuable, vibrant

(`robust` added since the 2026-07-12 sync; `deep dive` added since the 2026-08-02 sync; `highlight` and `showcase` are listed as bare verbs, not only the -ing forms.)

### Models with distinct traits

- **ChatGPT/DeepSeek**: Curly quotation marks and apostrophes
- **Gemini/Claude**: Typically avoid curly quotes
- **Grok**: Overuses "causal", "empirical", "correlate"; still overusing "underscore" as of 2026; favours the "X rather than Y" negative parallelism (subtype C)
- **Comment/discussion tell**: overuse of "concrete" ("concrete evidence", "concrete examples") in AI-detection debates
- **All models**: Rule of three, copula avoidance, negative parallelisms
- **Idiolect**: ChatGPT and Grok lean into broader-context framing; Gemini and Claude run more concise. ChatGPT is likely the most-used chatbot for Wikipedia edits.
- **Em dash suppression**: OpenAI GPT-5.1 (Nov 2025) actively suppresses em dashes, so their absence proves nothing

---

## Changes from 2026-08-21 to 2026-09-09

Article checked at revision 1373840632 (2026-09-08T06:40Z) against baseline revision 1370524124
(2026-08-21T16:50Z). Article grew 214,687 to 220,401 bytes across roughly 50 edits, the large
majority of which are presentation churn: the maintainers converted most example blocks from
`{{collapse top}}`/`{{ctop}}` to `{{cot|bg=#ffffff}}`/`{{cob}}` and stripped `expand=yes`. No
section was added or removed from the pattern tree apart from two Wikipedia-only edit-summary
subsections. Six portable changes, all applied:

1. **Em dash overuse tagged for possible demotion.** A September 2026 maintenance banner on the
   section reads that if more recent examples cannot be found it should probably move to
   Historical indicators, "as it seems to be less common in current LLM output". Recorded as a
   weakening-tell caveat on skill pattern **#13**, alongside the existing GPT-5.1 suppression
   note. Not demoted in the skill yet - Wikipedia has not moved it either. A house rule banning
   em dashes in an author's own writing is unaffected; that is a style rule, not a detector.
2. **Unusual use of tables strengthened.** "In rare cases, some AIs may create unnecessary small
   tables" became "Some AIs create small, minimally formatted tables". A new line was also added:
   models attempt Markdown table formatting inside wikitables, "which will render as a more
   obvious garbled mess". Both applied to skill pattern **#25**; the nested-markup artefact is a
   hard tell in any non-Markdown destination.
3. **Rule of three gained a context rule.** New sentence: the sign is stronger where most people
   would not bother with stylistic flourishes, naming edit summaries as the example. Generalised
   on skill pattern **#10** to commit messages, chat replies, subject lines and status updates.
4. **Canned notability clarified** (2026-08-27, "clarification pass on AIATTR since people are
   getting this wrong too"). The distinguishing feature is that attention falls on characteristics
   of the sources themselves - contents, findability, classification against the media landscape -
   not on what the sources said; and the model echoes the destination's own inclusion criteria back
   into the text. Words to watch gained *cited/featured in* beside *profiled in*, and *trade
   publications*. Applied to skill pattern **#2**.
5. **Bare "as of [date]" removed** from the knowledge-cutoff words-to-watch box. It was already
   footnoted as not unique to chatbots; Wikipedia has now dropped it outright. Removed from skill
   pattern **#20**, keeping the self-referential forms, with a note explaining the removal so it
   does not get re-added.
6. **New skill pattern #34, procedural self-congratulation in change summaries.** Generalised from
   the Wikipedia "Edit summaries" tree, which is the fastest-growing part of the article - four
   subsections now, and all three of their words-to-watch boxes were expanded during this window
   (*refined, enhanced, enriched, streamlined, clarity, flow* added to the policy-adherence box;
   *avoided/avoiding, ensured/ensuring, aimed/aiming to* to the preserved/retained box; *added
   verified ...* and *with independent/secondary/third-party/peer-reviewed sources* to the citation
   box). One subsection was renamed to "...'avoided' mistakes, and other procedural statements" and
   another added ("Overemphasis on parameter/template names and markup idiosyncracies"). The
   portable form is a model describing its own work by process virtue rather than substance, which
   lands in commit messages, PR descriptions, changelogs and handover notes. Skill count moves 33
   to 34.

Considered and not adopted:

- **"Use of Markdown" reframed** (2026-08-27): the claim that LLMs are poor at wikitext was
  softened to LLMs defaulting to Markdown because it is the more common markup in their data and
  for their users. Wikitext-specific reasoning; the skill's #30 already covers Markdown surviving
  into a non-Markdown destination and needed no change.
- **Vague expression of connection rewritten** (2026-09-02, "a better way to explain this"). The
  substance is unchanged but the new explanation is clearer, working from matched pairs. Skill
  pattern **#32** gained the paired-form table; the definition itself was already correct.
- **New AI vocabulary example** from a June 2024 revision to *Howdy Modi*. No word list changed;
  all 17 words-to-watch boxes are otherwise identical apart from the changes listed above.
- Wikipedia-only additions: canned user pages, permissions gaming, DOIs leading to unrelated
  articles, AfC submission statements, comment-specific indicators.

"Ineffective indicators", "Signs of human writing" (all five Syntax constructions), "Historical
indicators", "Differences between LLMs" and "Pro-authoritarian bias" are byte-identical to the
2026-08-21 baseline.

---

## Changes from 2026-08-05 to 2026-08-21

Article checked at revision current on 2026-08-21 (latest edit 2026-08-20T23:13Z). Three portable
changes, all applied:

1. **New indicator: "Vague expression of connection or association"** (WP:AICONNECT / WP:AIASSOCIATION),
   added under "Language and grammar" on 2026-08-19 by EmoryNB. Words to watch: *in connection with/to*,
   *connected with/to*, *in association with*, *associated with*. Newer models reach for indirect
   constructions instead of *of*, *for*, *by*, or naming the relationship outright (worked with, used in,
   caused by). Often clusters with promotional language and AI vocabulary ("widely associated"). Wikipedia
   is explicit that the indirection alone is not enough - abundance plus other signs is. Added as skill
   pattern **#32** in language-patterns.md; skill count moves 31 to 32.
2. **"Lexical diversity/elegant variation" demoted to "Historical indicators"** (2026-08-18, Closed Limelike
   Curves: "No longer common - modern models don't need repetition avoidance"). Skill pattern **#11** re-tagged
   as historical alongside #31, with Wikipedia's non-native-speaker caveat carried across.
3. **AI vocabulary box gained `deep dive`** (sourced to The Economist, July 2026). Era lists themselves
   unchanged. Added to the superset in language-patterns.md #7.

Considered and not adopted:

- **"Biases in content" / "Pro-authoritarian bias"** (new subsection under Miscellaneous, 2026-08-20). A
  content-verification indicator, not a rewriting pattern - the skill's no-fabrication rule already forbids
  touching what a text claims. Noted in SKILL.md under weak signals as a flag-back-to-author case.
- Presentation churn only: negative-parallelism highlighting, collapsing of the superficial-analyses and
  canned-notability examples, condensed search-link list under "Comment-specific indicators".

Section tree otherwise unchanged: "Ineffective indicators" still lists the same eight weak signals, and the
"Syntax" list under "Signs of human writing" still holds all five inverse constructions.

---

## Check on 2026-08-05 (no skill changes)

Article checked at revision 1367370457 (2026-08-02) against current. Three edits since, none
carrying a portable pattern:

1. **"+Pangram" under AI detection tools** - adds another detector to the caveats section. The
   skill does not recommend detectors, and the caveat that they misfire is already carried.
2. **Age-of-text tooling under "Signs of human writing"** (2026-08-04) - a paragraph on Who Wrote
   That and WikiBlame for finding the revision that introduced a block of text. Wikipedia-specific:
   it reads edit history, not prose, so it cannot apply to arbitrary text.
3. Indexability and vandalism-revert churn on 2026-08-03. No content.

Section tree otherwise identical to the 2026-08-02 digest: 31 skill patterns still map cleanly,
"Ineffective indicators" still lists the eight weak signals (the skill carries the five that are
not wikitext-specific), and the "Syntax" list under "Signs of human writing" still holds all five
inverse constructions.

---

## Changes from 2026-07-12 to 2026-08-02

1. **AI vocabulary box gained `robust`**; `highlight` and `showcase` are now listed as plain verbs alongside the -ing forms. Era lists themselves unchanged. Added to language-patterns.md #7.
2. **Copula avoidance expanded** (Wiki 3.2): words-to-watch now includes ''functions as'', ''operates as'', ''maintains'', ''refers to''. Wikipedia also documents subtler career-verb dodges - "ventured into politics as a candidate" for "was a candidate", "began his career as" for "was" - and notes "refers to" in lead sentences describes the term rather than the subject. Updated language-patterns.md #8.
3. **Negative parallelism subtype A renamed** "Not just X, but also Y" (was "Not only X but also Y"), and Wikipedia now shows the construction running across sentence boundaries with "however" doing the work of the "not". Updated skill #9.
4. **Em dashes**: two additions - AI em dashes are typically space-surrounded (contrary to typographic norms), and GPT-5.1 suppresses them, so absence is not evidence of human authorship. Updated style-patterns.md #13.
5. **NEW skill pattern #30 - leaked chatbot markup and citation artifacts** (Wiki section "Markup", incl. per-model subsections). Model-specific artifacts that survive copy-paste: ChatGPT contentReference/oaicite/turn0search0/attributableIndex/utm_source=chatgpt.com, Gemini [cite: 1] and start_span, Grok grok_card, DeepSeek lenticular brackets, Perplexity ppl-ai-file-upload, and `:::writing`. Unambiguous proof of AI origin. Added to style-patterns.md and SKILL.md.
6. **NEW skill pattern #31 - didactic disclaimers and section summaries** (Wiki "Historical indicators"). "It's important to note", "worth noting", "may vary", "In summary/In conclusion/Overall", plus refusal boilerplate and mid-sentence cut-offs. Era-tagged 2022-2024 but still common in older source documents. Added to filler-patterns.md.
7. **NEW SKILL.md section "Signs of human writing (put these back)"** from the Wiki section of the same name - the inverse list (plain copulas, short verbs, superlatives, intensifiers, some wordy constructions). Includes an explicit reconciliation with skill #22, which trims the same wordy constructions.
8. **NEW SKILL.md section "Weak signals - never rewrite on these alone"** from Wiki "Ineffective indicators", to cut false positives on human writing.
9. **Model idiolect note added**: ChatGPT/Grok favour broader-context framing; Gemini/Claude are more concise.
10. **Update procedure changed** to fetch raw wikitext via curl - the WebFetch summariser was dropping the words-to-watch boxes, which is where most of the year's deltas landed.

---

## Changes from 2026-04-23 to 2026-07-12

1. **Negative parallelisms now three subtypes** (Wiki 3.3.1-3.3.3): a third subtype **"X rather than Y"** (the reversed construction) has been added alongside "Not only X but also Y" and "Not X, but Y". Wikipedia flags "X rather than Y" as particularly common in Grok output. Updated skill #9 in SKILL.md and language-patterns.md.
2. **New model-specific traits: Grok**: overuses "causal", "empirical", "correlate", and continues overusing "underscore" as of 2026. Added to language-patterns.md #7 and the model-traits list here.
3. **Comment/discussion tell**: overuse of "concrete" ("concrete evidence/examples") in AI-detection debates. Noted here; not added as a client-copy pattern (out of scope for humanising deliverables).
4. **Emoji-as-formatting (4.5), unusual tables (4.6), thematic breaks before headings (4.9) re-confirmed** as explicit Wikipedia sections. The 2026-04-23 note treated their absence as extraction uncertainty; the current article lists all three, so the corresponding skill patterns (#17, #25, #29) are Wikipedia-backed, not skill-only.
5. **Em dash and curly-quote shortcuts** now have dedicated Wikipedia shortcuts (WP:AIDASH, WP:AICURLY) - no content change to the patterns themselves.
6. **No changes** to AI vocabulary word lists or era breakdowns.

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
