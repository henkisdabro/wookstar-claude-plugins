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

**Words to watch:** Up to my last training update, as of my last knowledge update, While specific details are limited/scarce..., not widely available/documented/disclosed, in the provided/available sources or search results, based on available information, likely exists, probably documented

**Removed September 2026:** bare "as of [date]" is no longer a signal. Wikipedia dropped it because it is ordinary dating language that humans and templates produce constantly. Only the self-referential versions - "as of my last knowledge update", "up to my last training update" - point at a model.

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

## 34. Procedural Self-Congratulation in Change Summaries

**Words to watch:** refined, enhanced, enriched, streamlined, improved clarity/flow, ensured that X adheres to, in compliance with, revised for tone, preserved/preserving, retained/retaining, avoided/avoiding, aimed to, added verified/sourced content, improved attribution

**Problem:** When a model describes work it has just done - a commit message, a pull request description, a changelog line, a handover note, a "here is what I changed" paragraph - it narrates process virtue in place of substance. It reports that the change was careful rather than saying what changed. A second half of the same habit is volunteering what was *not* done: what it preserved, retained, avoided or was careful about, when nobody raised the question.

This is the fastest-growing section of the Wikipedia source. As of September 2026 it carries four separate subsections on edit summaries alone, because the tell survives even where a model's prose has been edited into shape by a human - the summary of the work is written last and gets least attention.

**Rewrite rule:** name what changed, in the words someone would use to search for it later. Drop every claim about the quality of your own process. If preservation genuinely mattered, say what was preserved and why it was at risk; otherwise cut it.

**Before:**
> Refined the export module for improved clarity and flow, ensuring the implementation adheres to project conventions while preserving existing behaviour and avoiding regressions.

**After:**
> Export now streams rows instead of buffering the whole file. Same output, no longer holds 2GB in memory on the annual report.

**Before:**
> Enhanced the client onboarding documentation with additional detail and improved structure, retaining all original content.

**After:**
> Added the credential handover steps to the onboarding doc. They were only in my head and the last two engagements both stalled on them.

**Note:** ordinary changelog verbs are not the pattern. "Fixed", "added", "removed", "renamed" describe the change. "Refined", "streamlined", "enhanced" describe how the author would like the change to be regarded.

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
