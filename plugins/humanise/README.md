# Humanise

Remove AI tell-tales from text. Detects and eliminates 34 patterns of AI-generated writing including inflated language, promotional tone, AI vocabulary, vague expressions of connection, em dash overuse, filler phrases, sycophantic tone, placeholder text, formulaic structure, thematic breaks and leaked chatbot citation artifacts.

Based on Wikipedia's "Signs of AI writing" guide maintained by WikiProject AI Cleanup. Last checked against the source: 2026-08-21.

## Skills

- **humanise** - Identifies and removes AI writing patterns from text, replacing them with natural, human-sounding alternatives while preserving meaning and intended tone.

## Usage

Invoke with: "humanise this", "make this sound less AI", "remove AI patterns", "de-AI this text", "make this more natural".

The skill:

1. Calibrates on a sample of the author's own writing, when one is available
2. Scans for all 34 patterns
3. Reads detailed reference files for found patterns
4. Rewrites flagged sections (replaces with voice, not just removes)
5. Audits its own draft for remaining AI tells and for invented facts
6. Returns the final text with the audit answers and a footnote of patterns fixed

## What makes it different

**It knows what human writing looks like, not just what AI writing looks like.** Wikipedia documents an inverse list of constructions people use freely and models avoid: plain "is" and "has", short ordinary verbs, definitive statements, the occasional wordy phrase. The skill restores those rather than only deleting tells, because prose stripped to a clipped minimum is its own giveaway.

**It refuses to rewrite on weak signals.** Perfect grammar, formal tone, a mix of registers and transition words in isolation are all listed as ineffective indicators. One match is coincidence; clusters are the signal. Blanket bans on em dashes or passive voice produce a second, differently recognisable kind of slop.

**It will not invent facts.** The rewrite carries every claim from the source and adds none of its own. Turning a vague sentence into a specific one is allowed only when the specific came from the source or the user, which matters most in the documents where fabrication does real damage.

**A voice sample outranks the rules.** If the author uses em dashes, the skill keeps them. A tell is only a tell in writing that is not theirs.
