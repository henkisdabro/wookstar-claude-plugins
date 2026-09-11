# Language and Grammar Patterns (7-10, 12, 32; 11 is historical)

Detailed reference for language-level AI writing patterns. Read the compact summary table in SKILL.md first to identify which patterns apply, then consult this file for rewriting guidance.

---

## 7. Overused "AI Vocabulary" Words (Era-Specific)

Different LLM generations favour different words. Recognising the era helps identify the source model.

**2023 to mid-2024 (GPT-4 era):** Additionally, delve, intricate, meticulous, pivotal, testament, vibrant, enduring, tapestry, garner, underscore, interplay, intricacies

**Mid-2024 to mid-2025 (GPT-4o era):** align with, enhance, emphasizing, fostering, highlighting, showcasing, crucial, key (adjective), landscape (abstract noun)

**Mid-2025 onward (GPT-5 era):** emphasizing, enhance, highlighting, showcasing, plus notability-related terms (independent coverage, media outlets)

**Model-specific traits:** Grok overuses "causal", "empirical", "correlate", and continues overusing "underscore" (as of 2026). Grok also favours the "X rather than Y" negative parallelism (see #9). ChatGPT/DeepSeek use curly quotation marks; Gemini/Claude typically avoid them. ChatGPT and Grok lean harder on broader-context framing (see #1) than Gemini and Claude do; Gemini and Claude tend to run shorter.

**All-era high-frequency words:** Additionally, boasts (meaning "has"), bolstered, crucial, deep dive, delve, emphasizing, enduring, enhance, fostering, garner, highlight (verb), interplay, intricate/intricacies, key (adjective), landscape (abstract noun), meticulous/meticulously, pivotal, robust, showcase, tapestry (abstract noun), testament, underscore (verb), valuable, vibrant

**Caution:** a word being overused by AI does not make its synonyms suspect, and context matters - "underscore" can mean a literal underline or incidental music. One or two of these words is coincidence; a cluster of them is the tell.

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
- **(C) "X rather than Y"** - the reversed construction; particularly common in Grok output.

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
