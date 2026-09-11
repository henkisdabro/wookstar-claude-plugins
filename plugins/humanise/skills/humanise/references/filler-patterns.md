# Filler and Hedging Patterns (22-24, 31)

Detailed reference for filler and hedging AI writing patterns. Read the compact summary table in SKILL.md first to identify which patterns apply, then consult this file for rewriting guidance.

---

## 22. Filler Phrases

**Before -> After:**

- "In order to achieve this goal" -> "To achieve this"
- "Due to the fact that it was raining" -> "Because it was raining"
- "At this point in time" -> "Now"
- "In the event that you need help" -> "If you need help"
- "The system has the ability to process" -> "The system can process"
- "It is important to note that the data shows" -> "The data shows"

---

## 23. Excessive Hedging

**Problem:** Over-qualifying statements.

**Before:**
> It could potentially possibly be argued that the policy might have some effect on outcomes.

**After:**
> The policy may affect outcomes.

---

## 24. Generic Positive Conclusions

**Problem:** Vague upbeat endings.

**Before:**
> The future looks bright for the company. Exciting times lie ahead as they continue their journey toward excellence. This represents a major step in the right direction.

**After:**
> The company plans to open two more locations next year.

---

## 31. Didactic Disclaimers and Section Summaries (2022-2024 era)

**Words to watch:** it's important/critical/crucial to note/remember/consider, worth noting, may vary, In summary, In conclusion, Overall

**Problem:** Older models lectured an imagined reader mid-paragraph, then closed every section with a recap nobody asked for. Wikipedia now files both as historical indicators - rare in current output, but still all over text drafted in 2023-24 and anything copied from an older document. Treat their presence as a strong tell and a licence to cut hard.

**Before:**
> The emergence of these informal groups reflects a growing recognition of interconnected urban issues. However, it's important to note that these caucuses operate outside the formal structure and their influence may vary. In summary, they represent a notable development in local governance.

**After:**
> These informal caucuses sit outside the formal structure, so how much sway they hold varies by district.

**Related historical tells:** refusal boilerplate ("as an AI language model", "I cannot offer medical advice, but"), and text that stops mid-sentence where a generation limit hit.

---

## 33. Announced Significance and Announced Plain Speech

**Words to watch:** and this matters / and it matters / and that matters, and the reason matters, which matters because, this is the important part, the key point here is, what makes this significant, I'll state this plainly, said plainly, to put it plainly, put plainly, worth saying plainly, stating plainly, worth telling you plainly, worth knowing, worth noting, let me be blunt, to be direct with you

**Problem:** Two halves of one habit. The first announces that a point is significant instead of making the point and letting the reader decide. The second announces plain speech instead of just speaking plainly. Both attach a label to a sentence that should have carried its own weight, and both are load-bearing tells: a human who finds something important tends to lead with it, not to preface it with a claim about its importance.

Announcing bluntness is the same move as announcing significance. "I'll be honest with you" is not honesty, it is a frame around honesty. Genuinely direct writing skips the frame. Repeated across a document, these prefixes read as a writer negotiating with the reader for attention rather than earning it.

**Rewrite rule:** State the point. The reader decides whether it matters. Where a point genuinely needs emphasis, earn it structurally - put the important thing first in the sentence, or give it its own line or paragraph - never with a label attached to it.

**Before:**
> And worth saying plainly: Eventbrite is a third party, so you will not get an exact match to their booking count. This matters because it sets expectations early.

**After:**
> Eventbrite is a third party, so you will not get an exact match to their booking count.

**Before:**
> Three things worth knowing. The first is that the snippets are not connected to anything.

**After:**
> The snippets are not connected to anything.

**This bans the announcement, not the content.** Flagging a real risk, cost or consequence is often required, and the pulse guidance asks for stance and opinion. Both survive: state the risk, state the consequence, hold the opinion. What goes is the prefix claiming that what follows is important, blunt or plain.

> Not: "And this matters, because the tracking breaks whenever someone edits a button."
> But: "The tracking breaks whenever someone edits a button."

**Author-instruction note:** where a project's own writing rules ban these phrases outright (a `CLAUDE.md` or house style guide often carries such a list), that ban outranks this skill's judgement and applies to every file and every chat reply, not only to text passed through the humaniser.
