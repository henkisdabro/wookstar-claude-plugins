# Style patterns (13-18, 25-26, 29-30)

Rewriting guidance for style-level patterns. The index in SKILL.md says which apply.

---

## 13. Em Dash Overuse

**Problem:** LLMs use em dashes (--) more than humans, mimicking "punchy" sales writing, and put them where a human would use a comma, parentheses or a colon. Secondary tell: AI em dashes usually sit inside spaces, which most human em dash users avoid.

**Caveat (2026):** vendors have started suppressing them, notably OpenAI in GPT-5.1. Absence of em dashes is no longer evidence of human authorship - check the other patterns.

**Historical (November 2026):** Wikipedia now files em dashes under historical indicators, dated 2022 to September 2026. Graphite's corpus measurements (September-October 2026) bear this out, relative to pre-ChatGPT human writers: GPT-6 Astra uses em dashes 88% less often, Claude Opus 5.5 over 99% less (Opus 5 had been at about the human rate), and Gemini 4 Argon 38% less. The Economist's July 2026 finding that only Claude still out-dashed human writers predates Opus 5.5. Treat a cluster as era-dating evidence pointing at older text or an older model. It remains binding wherever an author's own rules ban them.

**Why it happened, and why it lingers:** Freeburg (arXiv, March 2026) argues the em dash is Markdown leaking into prose. Told to avoid Markdown, twelve models dropped headers and bullets but kept em dashes (except Llama, which used none), and even explicit bans failed to remove them in some models. So the rate is a fingerprint of a vendor's fine-tuning, not a style choice the model makes.

**Successor tell: thin punctuation.** With em dashes suppressed, punctuation variety has dropped. Wikipedia still tags this "citation needed", but Graphite's data supports one part of it: human writers use exclamation marks over a hundred times as often as current models and break into parenthetical asides far more. Do not flag it alone, but do let a rewrite use a colon, brackets or a dash where a person would.

**Before:**
> The term is primarily promoted by Dutch institutions--not by the people themselves. You don't say "Netherlands, Europe" as an address--yet this mislabeling continues--even in official documents.

**After:**
> The term is primarily promoted by Dutch institutions, not by the people themselves. You don't say "Netherlands, Europe" as an address, yet this mislabeling continues in official documents.

---

## 14. Overuse of Boldface

**Problem:** AI chatbots emphasise phrases in boldface mechanically.

**Before:**
> It blends **OKRs (Objectives and Key Results)**, **KPIs (Key Performance Indicators)**, and visual strategy tools such as the **Business Model Canvas (BMC)** and **Balanced Scorecard (BSC)**.

**After:**
> It blends OKRs, KPIs, and visual strategy tools like the Business Model Canvas and Balanced Scorecard.

---

## 15. Inline-Header Vertical Lists

**Problem:** AI outputs lists where items start with bolded headers followed by colons.

**Before:**
> - **User Experience:** The user experience has been significantly improved with a new interface.
> - **Performance:** Performance has been enhanced through optimized algorithms.
> - **Security:** Security has been strengthened with end-to-end encryption.

**After:**
> The update improves the interface, speeds up load times through optimized algorithms, and adds end-to-end encryption.

---

## 16. Title Case in Headings

**Problem:** AI chatbots capitalise all main words in headings.

**Before:**
> ## Strategic Negotiations And Global Partnerships

**After:**
> ## Strategic negotiations and global partnerships

---

## 17. Emojis

**Problem:** AI chatbots often decorate headings or bullet points with emojis.

**Before:**
> The product launches in Q3
> Key Insight: Users prefer simplicity
> Next Steps: Schedule follow-up meeting

**After:**
> The product launches in Q3. User research showed a preference for simplicity. Next step: schedule a follow-up meeting.

---

## 18. Curly Quotation Marks

**Problem:** ChatGPT and DeepSeek use curly quotes ("\u2026") and curly apostrophes instead of straight quotes ("..."). Note: Word processors and macOS also produce these, so not always AI-specific.

**Before:**
> He said \u201cthe project is on track\u201d but others disagreed.

**After:**
> He said "the project is on track" but others disagreed.

---

## 25. Unusual Use of Tables

**Problem:** AI chatbots output small, minimally formatted tables for data that would read better as prose or as a summary box. The table adds formatting overhead without improving readability. Wikipedia strengthened this in September 2026, dropping its earlier "in rare cases" framing - it is now common rather than occasional.

**Related artefact:** models also attempt Markdown table syntax *inside* a table written in another markup, producing a visibly garbled mess of pipes and dashes. In any environment that is not Markdown, that mix is a hard tell rather than a stylistic one.

**Before:**
> | Feature | Status |
> |---------|--------|
> | Dark mode | Available |
> | Export | Available |
> | Collaboration | Coming soon |

**After:**
> The app supports dark mode and export. Collaboration features are planned for a future release.

---

## 26. Skipped Heading Levels

**Problem:** AI chatbots jump from one heading level directly to a level two or more below (e.g., H2 to H4), skipping intermediate levels. This violates accessibility standards and creates inconsistent document structure.

**Before:**
> ## Main Section
> #### Subsection Detail

**After:**
> ## Main Section
> ### Subsection Detail

---

## 29. Thematic Breaks Before Headings

**Problem:** AI chatbots insert a horizontal rule (`---` or `----`) before every heading, a habit carried over from chat-window Markdown rendering. Humans use a rule sparingly, if at all.

**Before:**
> Some claims suggest the term derives from French, but early records do not support this.
>
> ---
>
> ## History
>
> The practice predates the colonial period.
>
> ---
>
> ## Form and construction

**After:**
> Some claims suggest the term derives from French, but early records do not support this.
>
> ## History
>
> The practice predates the colonial period.
>
> ## Form and construction

---

## 30. Leaked Chatbot Markup and Citation Artifacts

**Problem:** Text pasted straight out of a chat window carries the tool's internal citation and formatting code. Unlike the other patterns this one is not a style judgement - it is proof of origin, and it is embarrassing in a client deliverable. Search for these strings before sending anything that was drafted in a chat UI.

**What to grep for, by tool:**

| Tool | Artifacts |
|------|-----------|
| ChatGPT | `:contentReference[oaicite:0]{index=0}`, `oai_citation`, `turn0search0` / `turn0image0` / `turn0news0` / `turn0file0` (often wrapped in invisible private-use Unicode), trailing `Example+1` or `Wikipedia+1` source stubs, JSON tails like `({"attribution":{"attributableIndex":"1009-1"}})`, and `?utm_source=chatgpt.com` on every link |
| Gemini | `[cite: 1]`, `[cite: 3, 12, 13]`, `[span_1](start_span)`, text wrapped in `<mark>...</mark>` (shows as highlighting; a leftover of the "Double-check response" feature, added to Wikipedia October 2026) |
| Grok | `grok_card`, `grok_render_citation_card_json` |
| DeepSeek | lenticular brackets around citation numbers, dagger symbols |
| Perplexity | `attached_file`, `ppl-ai-file-upload` |
| Unclassified | `:::writing` fences |

**Also from the same family:** Markdown syntax surviving into a destination that does not render it (`## Heading`, `**bold**` in plain-text email, ``` ```wikitext ``` fences), and superscript reference numbers left dangling mid-sentence.

**Before:**
> The agency has worked with over 1,000 client accounts across healthcare and real estate[cite: 19, 20, 21]. Growth accelerated after 2024 :contentReference[oaicite:16]{index=16}.

**After:**
> The agency has worked with more than 1,000 client accounts, mostly in healthcare and real estate. Growth picked up after 2024.

**Fix:** strip the artifact, then verify the underlying claim. These markers stand in for sources the model may have invented, so the sentence they decorate is the one most worth checking.
