# Language and grammar patterns (7-12, 32, 36-39)

Rewriting guidance for language-level patterns. The index in SKILL.md says which apply. Sources and figures are in [sources.md](sources.md).

---

## 7. Overused "AI Vocabulary" Words and Stock Phrases (Era- and Model-Specific)

Different LLM generations favour different words. Recognising the era helps identify the source model. The 2023-24 list is the best-evidenced: Kobak et al. (Science Advances, 2025) found hundreds of excess words in PubMed abstracts after ChatGPT, "delves" chief among them, and Juzek and Ward (COLING 2025) trace the overuse to learning from human feedback rather than to training data. The same studies show these words fading as models change, so the old list now dates a text more than it detects one.

**2023 to mid-2024 (GPT-4 era):** Additionally, delve, intricate, meticulous, pivotal, testament, vibrant, enduring, tapestry, garner, underscore, interplay, intricacies

**Mid-2024 to mid-2025 (GPT-4o era):** align with, enhance, emphasizing, fostering, highlighting, showcasing, crucial, key (adjective), landscape (abstract noun)

**Mid-2025 onward (GPT-5 era):** emphasizing, enhance, highlighting, showcasing, plus notability-related terms (independent coverage, media outlets)

**2026 (current models).** Wikipedia has no 2026 vocabulary examples yet (it flagged the gap on 10 November 2026). The best current evidence is Graphite's corpus study (September-October 2026), which compared 10,000 pre-ChatGPT web articles with articles on the same topics from each model. The classic list is fading - the strength of eleven well-known tells fell 21-50% across model families - and new words have replaced it. Every figure is a multiple of the human rate:

- **Evaluative adjectives that rate rather than describe.** GPT-6 Astra: dependable (59x), practical (26x), meaningful (13x). Claude Opus 5/5.5: deliberate (26x), steady (6-11x), thoughtful (9x). Gemini: profound (25x), immense (22x), incredibly (18x). Fix by saying what the thing does: "dependable" becomes "has not gone down this year", if the source says so.
- **Formulaic transitions.** Astra: another dimension, together these. Claude: what comes next, looking ahead the, adds another layer, in practice. Gemini: furthermore (in 45% of Gemini 4 Argon articles), additionally, ultimately this, conversely.
- **Stock phrases (Gemini 4 Argon, October 2026).** fast-paced world, half the battle, bridges the gap, crystal clear, heavy lifting, gold standard - 10-70x the human rate, despite Google's claim that the model "skips clichés".
- **Marketing verbs are fading in GPT models** (payoff, unlock, elevate, amplify, streamline, boost, leverage: 73% lower in Astra than GPT-4.1). Their presence now points at an older model or a deliberate sales voice.

**Model-specific traits:** 65% of the tells Graphite found belong to one model family, and between consecutive versions of one family 55-72% of tells change. Grok overuses "causal", "empirical", "correlate", and continues overusing "underscore" (as of 2026). Grok favours the "X rather than Y" negative parallelism (see #9), though since September 2026 Wikipedia records it in ChatGPT and Claude output too. ChatGPT/DeepSeek use curly quotation marks; Gemini/Claude typically avoid them. ChatGPT and Grok lean harder on broader-context framing (see #1) than Gemini and Claude do; Gemini and Claude tend to run shorter.

**All-era high-frequency words:** Additionally, boasts (meaning "has"), bolstered, crucial, deep dive, delve, emphasizing, enduring, enhance, fostering, garner, highlight (verb), interplay, intricate/intricacies, key (adjective), landscape (abstract noun), meticulous/meticulously, pivotal, robust, showcase, tapestry (abstract noun), testament, underscore (verb), valuable, vibrant

**Caution:** no word list is ever finished, and a list keyed to one model misses the next. A word being overused by AI does not make its synonyms suspect, and context matters - "underscore" can mean a literal underline or incidental music. One or two of these words is coincidence; a cluster of them is the tell.

**Problem:** These words appear far more frequently in post-2023 text. They often co-occur, and specific clusters can fingerprint the model generation used.

**Before:**
> Additionally, a distinctive feature of Somali cuisine is the incorporation of camel meat. An enduring testament to Italian colonial influence is the widespread adoption of pasta in the local culinary landscape, showcasing how these dishes have integrated into the traditional diet.

**After:**
> Somali cuisine also includes camel meat, which is considered a delicacy. Pasta dishes, introduced during Italian colonization, remain common, especially in the south.

---

## 8. Avoidance of "is"/"are" (Copula Avoidance)

**Words to watch:** serves as/stands as/marks/functions as/operates as/represents [a], boasts/features/maintains/offers [a], refers to

**Problem:** LLMs substitute elaborate constructions for simple copulas. Newer output does it in less obvious ways too, swapping a plain "was" for a career verb: "ventured into politics as a candidate" for "was a candidate", "began his career as" for "was". In opening sentences the dodge is often "refers to", which describes the term rather than the thing.

**Before:**
> Gallery 825 serves as LAAA's exhibition space for contemporary art. The gallery features four separate spaces and boasts over 3,000 square feet.

**After:**
> Gallery 825 is LAAA's exhibition space for contemporary art. The gallery has four rooms totaling 3,000 square feet.

---

## 9. Negative Parallelisms

**Problem:** Constructions that define something by first negating an alternative are overused. Wikipedia documents three subtypes:

- **(A) "Not just X, but also Y"** - additive: "Not only ... but ...", "It is not just ..., it's ...".
- **(B) "Not X, but Y"** - corrective, denying the first characteristic outright: "It's not X, it's Y", "no ..., no ..., just ...".
- **(C) "X rather than Y"** - the reversed construction, which Wikipedia now heads "Y rather than X" to match (B). Particularly common in Grok output, and since September 2026 also documented in ChatGPT and Claude output. Its 2026 variant is a usage disclaimer - "should be treated as religious tradition rather than as an archaeological explanation" - covered under #20.

- **(D) "Less like X, more like Y"** and **"is more than a X, it is Y"** - the comparative form, now Claude's signature. Graphite (2026) found "less like a _ and more like" at 105x the human rate in Claude Opus 5, rising with each Claude version, and "is more than a _ it" at 98x in Opus 5.5. Gemini's equivalent is "is not just a _ it is" (153x).

**This is now the most-measured tell of current models.** Graphite calls it corrective framing: GPT-6 Astra talks about what things are not twelve times as often as human writers, the rate keeps rising across GPT versions ("the _ is not simply" 576x, "rather than relying" 187x, "not simply" 157x), and Claude Opus 5 uses "rather than merely" at 160x. Older tells fade between versions; this one has grown.

It also runs across sentence boundaries, where the second sentence quietly corrects the first: "He hailed from the esteemed Duse family, renowned for their theatrical legacy. Eugenio's life, however, took a path that intertwined both personal ambition and familial complexities." Look for a "however" or "rather" doing the same work as the "not".

**Before:**
> It's not just about the beat riding under the vocals; it's part of the aggression and atmosphere. It's not merely a song, it's a statement. The track works through texture rather than melody.

**After:**
> The heavy beat adds to the aggressive tone. The track leans on texture over melody.

---

## 10. Rule of Three Overuse

**Problem:** LLMs force ideas into groups of three to appear comprehensive.

**Stronger where nobody would bother.** The signal counts for much more in throwaway contexts than in polished prose - a commit message, a chat reply, a subject line, a one-line status update. A person dashing off a note does not reach for a triad; a model does it everywhere at the same rate.

**Before:**
> The event features keynote sessions, panel discussions, and networking opportunities. Attendees can expect innovation, inspiration, and industry insights.

**After:**
> The event includes talks and panels. There's also time for informal networking between sessions.

---

## 11. Elegant Variation (Synonym Cycling) - historical, pre-2025 output

**Problem:** Older models carried a repetition penalty meant to stop them reusing a word, so they cycled through synonyms for the same referent instead. Wikipedia moved this to historical indicators on 18 August 2026: current models no longer need repetition avoidance, so cycling is now rare in fresh output. It still marks text drafted in 2023-24, or copied from an older document.

**Caution:** this is the weakest of the historical tells on its own. Writers taught to avoid repetition - Italian schooling teaches it explicitly - vary their nouns for reasons that have nothing to do with a model. Only act on it inside a cluster.

**Before:**
> The protagonist faces many challenges. The main character must overcome obstacles. The central figure eventually triumphs. The hero returns home.

**After:**
> The protagonist faces many challenges but eventually triumphs and returns home.

---

## 12. False Ranges

**Problem:** LLMs use "from X to Y" constructions where X and Y aren't on a meaningful scale.

**Before:**
> Our journey through the universe has taken us from the singularity of the Big Bang to the grand cosmic web, from the birth and death of stars to the enigmatic dance of dark matter.

**After:**
> The book covers the Big Bang, star formation, and current theories about dark matter.

---

## 32. Vague Expression of Connection or Association

**Words to watch:** in connection with/to, connected with/to, in association with, associated with

**Problem:** Where a plain preposition would state the relationship, newer models reach for an indirect construction that abstracts it away. "Associated with" hides whether the person founded the thing, played in it, taught there or was merely photographed next to it - and the model often does not know, so the vagueness is load-bearing. It clusters with promotional buzzspeak and AI vocabulary ("widely associated", "particularly associated"). Fix it by naming the actual relationship, or by using *of*, *for*, *by*, "worked with", "used in", "caused by".

**The shape of it**, in matched pairs. The left column is what a person writes; the right is the model refusing to commit to a verb:

| Direct | Vague |
|---|---|
| In 2017 she was chief executive of ExampleCorp | In 2017 sources identified her as being associated with leadership at ExampleCorp |
| He taught physics at Example University | He was connected with physics education at Example University |
| The council funded the restoration | The restoration has been associated with council funding |

**Caution:** the construction is legitimate where the connection genuinely is loose or disputed, and in legal or forensic register where "in connection with" is the correct term of art. Abundance is the tell, not a single use.

**Before:**
> He is associated with the Rajhans Orchestra, a multicultural ensemble. He later became associated with musical education in Knokke-Heist. The concerts were organised in connection with celebrations of the 50th anniversary of Pakistan.

**After:**
> He founded the Rajhans Orchestra, a multicultural ensemble. He went on to teach violin, viola and chamber music in Knokke-Heist. The concerts marked the 50th anniversary of Pakistan's independence.

---

## 36. Mannered Prose (2026)

**Words to watch:** metaphors standing in for a literal phrase - a dial worth turning, earns its keep, does the heavy lifting, the load-bearing part, moves the needle, sits at the heart of, threads the needle

**Problem:** Anthropic's prompting guidance for Claude Fable 5.1 (2026) names this anti-pattern and defines it: "Mannered prose substitutes metaphor and flourish for direct statement. Instead of 'a parameter worth varying,' the mannered writer produces 'a dial worth turning.' Instead of 'this point still matters,' they write 'this point earns its keep.'" The phrase is there to display the writer, not to carry the idea, and the metaphor drags in connotations nobody chose. Graphite scored it across models in 2026: Gemini 4 Argon about 2.9 times the human level, Claude Opus 5 about 2.5, Opus 5.5 about 1.6, GPT-6 Astra about 1.2.

**Rewrite rule:** when a literal phrase is available, use it.

**Caution:** a metaphor the author coined, or a figure of speech that is ordinary in the field, is not the pattern. The tell is a stream of small flourishes where plain words were available.

**Before:**
> Caching is the quiet workhorse here: it does the heavy lifting so the API can breathe, and the TTL is the dial worth turning.

**After:**
> Caching takes most of the load off the API. The TTL is the setting worth tuning.

---

## 37. Trade-off Denial (2026)

**Words to watch:** without sacrificing, without losing, without compromising, without requiring, without giving up, all while

**Problem:** The text promises a benefit and in the same breath denies that it costs anything. Graphite (2026) found this across all three current model families: "without requiring" at 70x the human rate in GPT-6 Astra, "without sacrificing" 4-8x and "without losing" 5-22x across GPT, Claude and Gemini. Real trade-offs exist, so the phrase is usually either untrue or untested.

**Rewrite rule:** state the benefit. If the source names the cost, state that too. If the source says there is no cost, keep the claim but attribute it.

**Before:**
> The new pipeline cuts build times in half without sacrificing reliability or requiring any changes to existing workflows.

**After:**
> The new pipeline halves build times. Existing workflows run unchanged.

---

## 38. Intensifiers and Superlative Framing (2026, Claude and Gemini)

**Words to watch:** single most, arguably the most, the most powerful, every single, enormously, is genuinely, incredibly, absolutely (essential), remarkably, fantastic, drastically, unmatched

**Problem:** Model families differ here, which is why this is a recent addition. Graphite (2026) found Claude Opus 5 framing things as unusually important or extreme: "single most" and "arguably the most" never appeared in GPT-6 Astra's articles, and "every single" ran at 112 times Astra's rate. Opus 5.5 dropped "is genuinely" (Opus 5 used it 26 times as often) but uses "the most powerful" 24 times as often as Astra. Gemini uses intensifiers at 13 times the human rate, and Gemini 4 Argon adds fantastic, incredible and drastically. GPT models go the other way and hedge (#23).

**Conflict to manage:** Wikipedia lists superlatives and intensifiers among the signs of *human* writing, because older models hedged them away. Both are true for different models. A superlative that states a checkable fact from the source ("the only bridge across the river") is human. One that ranks for emphasis ("the single most important step") is the tell.

**Before:**
> Indexing is arguably the single most important optimisation, and it makes an enormously noticeable difference on every single query.

**After:**
> Indexing is the biggest win, and it speeds up every query.

---

## 39. Dense, Noun-Heavy Prose

**Words to watch:** nominalisations where a verb would do (the implementation of, the reduction of, provides an enhancement to), stacked noun phrases, long sentences, few paragraph breaks

**Problem:** Reinhart et al. (PNAS, 2025) found instruction-tuned models write in an informationally dense, noun-heavy style, using nominalisations at 1.5-2 times the human rate, and argue that instruction tuning is what limits their range. Anthropic's guidance for Claude Fable 5.1 (2026) reports the same drift in a current model: prose denser than its predecessor's, sentences running longer, fewer paragraph breaks. AI sentences also vary less in length than human ones (Graphite, 2026), so the density is uniform.

**Rewrite rule:** turn nominalisations back into verbs, split sentences that carry more than one claim, and break paragraphs where the topic turns.

**Before:**
> The implementation of the new caching layer resulted in a significant reduction in database load and an improvement in response-time consistency for high-traffic endpoints during periods of peak demand.

**After:**
> The new caching layer cut database load. The busiest endpoints now respond in steady time, even at peak.
