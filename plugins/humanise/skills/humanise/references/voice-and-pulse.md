# Voice and pulse

Read before rewriting when a sample of the author's writing exists, or when the text is a register that wants a person behind it.

## Voice calibration

If the author's own writing is available, read it before rewriting anything. It can arrive pasted into the conversation, as an uploaded file, or as a folder of previous work. Where there are several pieces, read two or three from the same genre as the text being edited: a client email and a blog post are not the same voice.

Take from the sample: sentence lengths, vocabulary level, how paragraphs open, punctuation habits, recurring phrases, and how they get from one idea to the next. Match those habits rather than merely deleting patterns. Keep casual words casual and deliberate quirks intact.

**A sample outranks every pattern rule, including the em dash rule in #13.** If the author uses em dashes, match their frequency. If they open paragraphs with "So," keep it.

**A stored voice profile counts as a sample.** Where one exists for this author and genre, read it before drafting. A profile is strongest when built from a piece the author wrote alongside a draft they rejected, so keep the rejected version and note what changed.

To keep one, save it as a file in this directory named for the author and genre (`<author>-<genre>-voice.md`) and list it here.

## Pulse

Sterile, voiceless writing is as obvious as slop, so removing patterns is only half the work.

**Add pulse only where the content and the author call for it** - blog posts, essays, opinion, personal writing, most internal notes. For encyclopedic, technical, legal, regulatory or reference text, neutral and plain *is* the human voice, and stance injected there is its own tell. A calibration sample settles it: write the register the author writes.

- **Have opinions.** React to facts rather than only reporting them. "I don't know how to feel about this" beats a neutral list of pros and cons.
- **Vary the rhythm.** Short sentences. Then longer ones that take their time getting where they're going. Low variation in sentence length is one of the features that most separates model text from human text in Graphite's 2026 corpus.
- **Acknowledge complexity.** "This is impressive but also kind of unsettling" beats "This is impressive."
- **Use "I" and "you" where they fit.** First person and direct address are among the strongest markers of human web writing.
- **Let some mess in.** Tangents, asides in brackets, humour and half-formed thoughts are human. Perfect structure reads as algorithmic.
- **Be specific about feelings.** Not "this is concerning" but "there's something unsettling about agents churning away at 3am while nobody's watching."

### Signs of human writing (put these back)

Constructions people use freely and current models avoid. Restoring them does more for a text than deleting AI vocabulary does. Sources: Wikipedia's "Signs of human writing" section, and the human-side tells in Graphite's 2026 corpus study ([sources.md](sources.md)).

- **Plain is/has phrases** - "there is a", "it has a". The copula is not a weakness.
- **Short, ordinary verbs** - wrote (not authored), moved (not relocated), used (not utilised), tried (not attempted), died (not passed away).
- **Contractions** - it's, don't, isn't, we've. Gemini models have nearly stopped using them.
- **Casual qualifiers** - pretty, sort of, kind of. Hedges like perhaps and tends to, used sparingly.
- **Small anecdotes and personal reference** - "he said", "years ago", "last year", "my favourite".
- **Exclamation marks and parenthetical asides** - human writers use exclamation marks over a hundred times as often as current models, and break into brackets far more often. One, where the author would, not a scattering.
- **The occasional wordy construction** - "as a result of", "in order to", "the fact that".
- **A plain superlative, where the source supports it** - "the only", "was the first". Wikipedia lists definitive statements as human. Graphite finds Claude and Gemini now overuse superlative and intensifier framing (#38), so this one only counts when it is a factual claim, not emphasis.

The wordy-construction point cuts against #22, and both are true: filler reads as padding, while stripping every wordy construction to a clipped minimum is itself a tell. Trim the phrases doing no work and leave the ones carrying the rhythm of a person talking.

### Before (a press release with no pulse)

> The experiment produced interesting results. The agents generated 3 million lines of code. Some developers were impressed while others were skeptical. The implications remain unclear.

### After

> I don't know how to feel about this one. 3 million lines of code, generated while the humans presumably slept. Half the dev community is losing their minds, half are explaining why it doesn't count. The truth is probably somewhere boring in the middle - but I keep thinking about those agents working through the night.
