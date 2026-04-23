# Communication Patterns (19-21)

Detailed reference for communication-level AI writing patterns. Read the compact summary table in SKILL.md first to identify which patterns apply, then consult this file for rewriting guidance.

---

## 19. Collaborative Communication Artifacts

**Words to watch:** I hope this helps, Of course!, Certainly!, You're absolutely right!, Would you like..., let me know, here is a...

**Problem:** Text meant as chatbot correspondence gets pasted as content.

**Before:**
> Here is an overview of the French Revolution. I hope this helps! Let me know if you'd like me to expand on any section.

**After:**
> The French Revolution began in 1789 when financial crisis and food shortages led to widespread unrest.

---

## 20. Knowledge-Cutoff Disclaimers and Source-Gap Speculation

**Words to watch:** as of [date], Up to my last training update, While specific details are limited/scarce..., not widely available/documented, in the provided/available sources, based on available information, likely exists, probably documented

**Problem:** Two related behaviours: (1) AI disclaimers about incomplete information get left in text; (2) RAG-enabled models speculate about undocumented information as if it probably exists somewhere - pairing hedges with "likely" or "probably" claims about sources that may not exist at all.

**Before (cutoff disclaimer):**
> While specific details about the company's founding are not extensively documented in readily available sources, it appears to have been established sometime in the 1990s.

**After:**
> The company was founded in 1994, according to its registration documents.

**Before (source-gap speculation):**
> While the full details are not available in the provided sources, documentation likely exists within the company's internal records confirming the 1994 founding date.

**After:**
> The company was founded in 1994.

---

## 21. Sycophantic/Servile Tone

**Problem:** Overly positive, people-pleasing language.

**Before:**
> Great question! You're absolutely right that this is a complex topic. That's an excellent point about the economic factors.

**After:**
> The economic factors you mentioned are relevant here.

---

## 27. Subject Lines Pasted into Content

**Problem:** Email-style subject lines or message headers get pasted directly into body text, typically when AI-generated email/message content is used without cleanup.

**Before:**
> Subject: Follow-up on Q3 Budget Discussion
>
> Hi team, I wanted to follow up on our earlier conversation about the Q3 budget allocations.

**After:**
> Hi team, I wanted to follow up on our earlier conversation about the Q3 budget allocations.

---

## 28. Placeholder Text and Templates

**Words to watch:** [Name], [Your Name], [Company], [Date], 2025-XX-XX, [Insert X here]

**Problem:** AI chatbots leave unfilled Mad Libs-style blanks, template markers, or malformed placeholder dates in generated text. These are dead giveaways of unreviewed AI output.

**Before:**
> Dear [Recipient Name], I am writing to express my interest in the [Position Title] role at [Company Name]. With my experience in [Relevant Field], I believe I would be a strong fit.

**After:**
> Dear Sarah, I am writing to express my interest in the Senior Analyst role at Acme Corp. With six years of experience in financial modelling, I believe I would be a strong fit.
