---
name: humanise
description: Humanise text by removing AI writing patterns so it reads as human-written. Use when the user asks to humanise, de-AI or de-slop a draft, says it reads like a robot or like ChatGPT wrote it, or wants a press-release voice given a pulse. Applies 34 patterns from Wikipedia's "Signs of AI writing". For grammar-only proofreading or spell checking, edit normally instead.
allowed-tools: Read, Write, Edit, Grep, Glob, AskUserQuestion
---

# Humaniser: remove AI writing patterns

Based on Wikipedia's "Signs of AI writing", maintained by WikiProject AI Cleanup. Last checked against the Wikipedia source: 2026-09-09.

> Removing AI patterns is table stakes. The job is giving the text a **pulse**.

## Process

1. Calibrate on the author's voice if a sample is available (see Voice calibration)
2. Scan all 34 patterns (see Pattern summary)
3. Read the reference file for every pattern found
4. Rewrite each flagged section, replacing the pattern with pulse
5. Audit that draft against the two questions below, answering both in writing
6. Revise into a final version that addresses both answers
7. Return the final text, the audit answers, and a footnote listing the patterns fixed

### The audit questions

Ask these of your own draft, in these words:

1. **"What makes the text below so obviously AI generated?"** Assume it still is, and go find the reason. Asking whether it "sounds human" is a vibe check, and a draft always passes its own vibe check. This question does not let it.
2. **"Does the rewrite state any fact, name, number, date, quote or citation that is not in the source?"** See Never invent facts.

## Never invent facts

The rewrite carries every claim from the source and adds none of its own. No fact, name, number, date, quote or citation appears in the output unless it was in the input or the user supplied it.

The rest of this skill pushes the other way, which is why the rule is here: pattern #5 flags vague attributions and pulse asks for specific detail, so the tempting move is to turn "the fee increase reflects the expanded scope" into "the 12% fee increase reflects the expanded scope". That number is invented, and it is invented in the documents that can least afford it. Trade vagueness for specificity only when the specific comes from the source or the user. Where a sentence needs detail it does not have, ask for it or write the plain version.

A fabrication is a defect even when it reads more human than the vague original.

**Opinions and reactions are voice, not facts.** Stance, uncertainty, mixed feelings and rhythm are yours to add. Claims are not. Fiction is the exception: there, invented detail is the job.

## Voice calibration

If the author's own writing is available, read it before rewriting anything. A sample can come from the user pasting one, or from pointing at a folder of their previous work. Where there is a folder, read two or three pieces from the same genre as the text being edited. A client email and a blog post are not the same voice.

Take from the sample: sentence lengths, vocabulary level, how paragraphs open, punctuation habits, recurring phrases, and how they get from one idea to the next. Match those habits rather than merely deleting patterns. Keep casual words casual and deliberate quirks intact.

**A sample outranks every pattern rule here, including the em dash rule in #13.** If the author uses em dashes, match their frequency. If they open paragraphs with "So," keep it. A tell is only a tell in writing that is not theirs.

## Pulse

Sterile, voiceless writing is as obvious as slop, so removing patterns is only half the work.

**Add pulse only where the content and the author call for it** - blog posts, essays, opinion, personal writing, most internal notes. For encyclopedic, technical, legal, regulatory or reference text, neutral and plain *is* the human voice, and stance injected there is its own tell. A calibration sample settles it: write the register the author writes.

**Have opinions.** React to facts rather than only reporting them. "I genuinely don't know how to feel about this" beats a neutral list of pros and cons.

**Vary the rhythm.** Short punchy sentences. Then longer ones that take their time getting where they're going.

**Acknowledge complexity.** Real people hold mixed feelings. "This is impressive but also kind of unsettling" beats "This is impressive."

**Use "I" where it fits.** First person is honest, not unprofessional. "I keep coming back to..." signals a real person thinking.

**Let some mess in.** Tangents, asides, humour and half-formed thoughts are human. Perfect structure reads as algorithmic.

**Be specific about feelings.** Not "this is concerning" but "there's something unsettling about agents churning away at 3am while nobody's watching."

### Signs of human writing (put these back)

Wikipedia documents the inverse list: constructions people use freely and LLMs avoid while chasing a formal, neutral register. Restoring these does more for a text than deleting AI vocabulary does.

- **Plain is/has phrases** - "there is a", "it has a". The copula is not a weakness.
- **Short, ordinary verbs** - wrote (not authored), moved (not relocated), used (not utilised), tried (not attempted), died (not passed away).
- **Superlative or definitive statements** - "one of the best", "the only", "was the first". LLMs hedge these into mush.
- **Hedging qualifiers and intensifiers** - very, perhaps, tends to. Sparingly, but they are human.
- **The occasional wordy construction** - "as a result of", "in order to", "a part of", "the fact that".

That last one cuts against pattern #22, and both are true: filler reads as padding, while stripping every wordy construction to a clipped minimum is itself a tell. Trim the phrases doing no work and leave the ones carrying the rhythm of a person talking.

### Before (a press release with no pulse):

> The experiment produced interesting results. The agents generated 3 million lines of code. Some developers were impressed while others were skeptical. The implications remain unclear.

### After:

> I genuinely don't know how to feel about this one. 3 million lines of code, generated while the humans presumably slept. Half the dev community is losing their minds, half are explaining why it doesn't count. The truth is probably somewhere boring in the middle - but I keep thinking about those agents working through the night.

---

## Pattern summary

Identify patterns here, then read the linked reference for rewriting guidance and before/after examples.

### Content patterns ([detailed reference](references/content-patterns.md))

| # | Pattern | Key Signals |
|---|---------|-------------|
| 1 | Inflated significance/legacy | stands as, testament, pivotal, broader, indelible mark |
| 2 | Inflated notability | independent coverage, social media presence, leading expert |
| 3 | Superficial -ing analyses | highlighting..., ensuring..., reflecting..., showcasing..., valuable insights, align/resonate with |
| 4 | Promotional language | boasts, vibrant, nestled, breathtaking, featuring, diverse array, stunning |
| 5 | Vague attributions | Experts argue, Industry reports, Some critics argue |
| 6 | Formulaic challenges sections | Despite its..., Despite these challenges, Future Outlook |

### Language and grammar patterns ([detailed reference](references/language-patterns.md))

| # | Pattern | Key Signals |
|---|---------|-------------|
| 7 | AI vocabulary words (era-specific) | 2023: delve, tapestry, bolstered; 2024: align with, fostering, pivotal; 2025+: enhance, showcasing |
| 8 | Copula avoidance | serves as, stands as, boasts, features, offers [a] |
| 9 | Negative parallelisms (three subtypes) | "Not only...but also..." / "It's not X, it's Y" / "X rather than Y" (Grok) |
| 10 | Rule of three | three-item lists forced into every sentence |
| 12 | False ranges | from X to Y where X and Y aren't on a scale |
| 32 | Vague expression of connection | associated with, in connection with, in association with, connected to |
| 11 | Synonym cycling (pre-2025 era) | protagonist/main character/central figure/hero cycling |

### Style patterns ([detailed reference](references/style-patterns.md))

| # | Pattern | Key Signals |
|---|---------|-------------|
| 13 | Em dash overuse | excessive -- usage for dramatic effect (weakening as a tell; see reference) |
| 14 | Boldface overuse | mechanical **bolding** of terms |
| 15 | Inline-header lists | **Header:** description bullet points |
| 16 | Title Case headings | Every Word Capitalised In Headings |
| 17 | Emoji decoration | emojis on headings and bullet points |
| 18 | Curly quotation marks | “smart quotes” instead of "straight quotes" (ChatGPT/DeepSeek, not Gemini/Claude) |
| 25 | Unusual tables | small unnecessary tables better suited to prose |
| 26 | Skipped heading levels | jumping from H2 to H4, violating heading hierarchy |
| 29 | Thematic breaks before headings | `----` horizontal rules inserted before every heading |
| 30 | Leaked chatbot markup and citation artifacts | oaicite, contentReference, turn0search0, [cite: 1], start_span, grok_card, ppl-ai-file-upload, utm_source=chatgpt.com |

### Communication patterns ([detailed reference](references/communication-patterns.md))

| # | Pattern | Key Signals |
|---|---------|-------------|
| 19 | Chat artifacts | I hope this helps, Let me know, Here is a... |
| 20 | Knowledge-cutoff disclaimers | as of my last knowledge update, based on available information (bare "as of [date]" dropped Sept 2026) |
| 21 | Sycophantic tone | Great question!, You're absolutely right! |
| 27 | Subject lines pasted into content | email-style subject lines left in body text |
| 28 | Placeholder text and templates | [Name], 2025-XX-XX, unfilled Mad Libs blanks |
| 34 | Procedural self-congratulation in change summaries | refined, streamlined, enhanced, ensured adherence to, preserved, avoided, improved clarity and flow |

### Filler and hedging ([detailed reference](references/filler-patterns.md))

| # | Pattern | Key Signals |
|---|---------|-------------|
| 22 | Filler phrases | In order to, Due to the fact that, At this point in time |
| 23 | Excessive hedging | could potentially possibly, might have some effect |
| 24 | Generic positive conclusions | future looks bright, exciting times, journey toward excellence |
| 31 | Didactic disclaimers and section summaries (2022-24 era) | it's important to note, worth noting, may vary, In summary, In conclusion, Overall |
| 33 | Announced significance and announced plain speech | and this matters, which matters because, said/stated plainly, to put it plainly, worth saying plainly, worth knowing, let me be blunt |

Pattern 33 is **non-negotiable where an author's own rules ban it** - see the author-instruction note in the reference; it then applies to every reply and every file, not only to text being humanised.

Patterns 11 and 31 are **historical**: Wikipedia files them as tells of older models, so they mark text drafted in 2023-24 or lifted from an older document rather than anything a current model just produced.

---

## When not to use

- Text already clearly human-written - humanising human writing adds its own artificiality
- Grammar or spell-check requests - edit normally instead
- Formal legal, medical or regulatory text, where plain precision outranks voice
- Code comments and technical documentation - different register, different rules

### Weak signals - never rewrite on these alone

Wikipedia lists these as ineffective indicators. Treating them as tells produces false positives and mangles good human writing:

- Perfect grammar, or "fancy", academic or formal prose
- "Bland" or "robotic" tone on its own
- A mix of casual and formal register in the same piece
- Transition words in isolation (Additionally, Consequently, Notably)
- Missing citations, or conversely well-formatted ones

One or two matches anywhere in this skill is coincidence. Clusters are the signal.

Wikipedia also documents a pro-authoritarian slant in model output as a possible indicator. That is a fact-checking concern, not a rewriting one - this skill never changes what a text claims, so a suspect claim gets flagged back to the author rather than rewritten.

---

## Further reference

| File | Contents |
|------|----------|
| [full-example.md](references/full-example.md) | Full walkthrough with annotated changes, plus the Wikipedia source |
| [wikipedia-digest.md](references/wikipedia-digest.md) | Structured digest of the Wikipedia source, for diffing future syncs |
| [evals.md](references/evals.md) | Eval suite: trigger tests, negative tests, pattern detection cases, quality rubric |
