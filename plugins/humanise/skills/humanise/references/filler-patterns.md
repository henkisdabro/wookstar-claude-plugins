# Filler and Hedging Patterns (22-24)

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

## Historical Patterns (2022-2024, now less common)

These appeared in older LLM output and are rarer now, but still worth flagging when found.

### Didactic Disclaimers

**Words to watch:** *it's important/critical/crucial to note/remember/consider*, *worth noting*, *may vary*, *it is essential to understand that*

Older models (~2023) prefaced statements with safety or variance disclaimers, especially for topics varying by location or involving controversy.

**Before:**
> However, it's important to note that these groups operate outside the formal structure and their influence may vary.

**After:**
> These groups operate outside the formal structure and have limited influence on policy.

### Section Summaries

**Words to watch:** *In summary*, *In conclusion*, *Overall*, *To summarise*, *To recap*

Older LLMs ended paragraphs and sections by restating what they just said.

**Before:**
> In conclusion, the report highlights three main findings: rising costs, declining enrollment, and faculty retention issues. Overall, these factors present significant challenges.

**After:**
> Costs are rising, enrollment is falling, and faculty are leaving - a combination that puts several departments at risk.
