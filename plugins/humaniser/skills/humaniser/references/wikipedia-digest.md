# Wikipedia Source Digest

Last fetched: 2026-03-03
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

## Pattern Digest (as of 2026-03-03)

### Content Patterns

| # (Wiki) | # (Skill) | Pattern Name | Key Signals |
|-----------|-----------|--------------|-------------|
| 1 | 1 | Undue emphasis on significance/legacy/broader trends | stands as, testament, pivotal, broader, indelible mark, evolving landscape |
| 2 | 2 | Undue emphasis on notability/attribution/media coverage | independent coverage, social media presence, leading expert, profiled in |
| 3 | 3 | Superficial analyses (-ing endings) | highlighting, ensuring, reflecting, symbolizing, contributing to, showcasing |
| 4 | 4 | Promotional/advertisement-like language | boasts, vibrant, nestled, breathtaking, must-visit, stunning, diverse array |
| 5 | 5 | Vague attributions and overgeneralisation | Experts argue, Industry reports, Some critics argue, Observers have cited |
| 6 | 6 | Outline-like challenges and future prospects | Despite its..., Despite these challenges, Future Outlook |
| 7 | - | Leads treating titles as proper nouns | Wikipedia-specific; not included in skill |
| 8 | - | Vague See Also sections | Wikipedia-specific; not included in skill |

### Language and Grammar Patterns

| # (Wiki) | # (Skill) | Pattern Name | Key Signals |
|-----------|-----------|--------------|-------------|
| 9 | 7 | AI vocabulary words (era-specific) | See era breakdown below |
| 10 | 8 | Copula avoidance (is/are) | serves as, stands as, marks, represents, boasts, features, offers |
| 11 | 9 | Negative parallelisms | Not only...but..., It's not just...it's..., No...no...just... |
| 12 | 10 | Rule of three | three-item lists, triadic structures |
| 13 | 11 | Elegant variation (synonym cycling) | protagonist/main character/central figure/hero cycling |

### Style Patterns

| # (Wiki) | # (Skill) | Pattern Name | Key Signals |
|-----------|-----------|--------------|-------------|
| 14 | 16 | Title Case headings | Every Word Capitalised In Headings |
| 15 | 14 | Overuse of boldface | mechanical bolding of terms |
| 16 | 15 | Inline-header vertical lists | **Header:** description bullet points |
| 17 | 17 | Emoji decoration | emojis on headings and bullet points |
| 18 | 13 | Overuse of em dashes | excessive -- usage for dramatic effect |
| 19 | 25 | Unusual use of tables | small unnecessary tables better as prose |
| 20 | 18 | Curly quotation marks and apostrophes | smart quotes (ChatGPT/DeepSeek trait) |
| 21 | 27 | Subject lines pasted into content | email-style subject lines left in body |
| 22 | 26 | Skipped heading levels | H2 to H4 jumps, accessibility violation |

### Communication Patterns

| # (Wiki) | # (Skill) | Pattern Name | Key Signals |
|-----------|-----------|--------------|-------------|
| 23 | 19 | Collaborative communication artifacts | I hope this helps, Let me know, Here is a... |
| 24 | 20 | Knowledge-cutoff disclaimers | as of [date], based on available information |
| 25 | 28 | Phrasal templates and placeholder text | [Name], 2025-XX-XX, unfilled blanks |

### Skill-Only Patterns (not from Wikipedia)

| # (Skill) | Pattern Name | Key Signals |
|-----------|--------------|-------------|
| 12 | False ranges | from X to Y where X and Y aren't on a scale |
| 21 | Sycophantic tone | Great question!, You're absolutely right! |
| 22 | Filler phrases | In order to, Due to the fact that |
| 23 | Excessive hedging | could potentially possibly |
| 24 | Generic positive conclusions | future looks bright, exciting times |

---

## AI Vocabulary Era Breakdown (as of 2026-03-03)

### 2023 to mid-2024 (GPT-4 era)

Additionally, delve, intricate, meticulous, pivotal, testament, vibrant, enduring, tapestry, garner, underscore, interplay, intricacies

### Mid-2024 to mid-2025 (GPT-4o era)

align with, enhance, emphasizing, fostering, highlighting, showcasing, crucial, key (adjective), landscape (abstract noun)

### Mid-2025 onward (GPT-5 era)

emphasizing, enhance, highlighting, showcasing, plus increased notability-related terms (independent coverage, media outlets)

### Models with distinct traits

- **ChatGPT/DeepSeek**: Curly quotation marks and apostrophes
- **All models**: Rule of three, copula avoidance, negative parallelisms

---

## Key Insights from Wikipedia

- "LLMs use statistical algorithms to guess what should come next. The result tends toward the most statistically likely result that applies to the widest variety of cases."
- AI detection tools have non-trivial error rates; heavy LLM users achieve ~90% accuracy, casual users barely exceed random chance
- Surface-level fixes (removing boldface, correcting markup) may just obscure detection; actual problems require addressing deeper issues
- One study documented a 10% reduction in "is/are" usage in text post-2022
- Not all flagged text is AI-generated; humans sometimes write similarly
