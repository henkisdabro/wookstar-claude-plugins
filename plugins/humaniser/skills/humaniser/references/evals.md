# Humaniser Skill: Eval Test Suite

## Section A: Trigger Tests (should activate)

These phrases should activate the humaniser skill.

| # | Input phrase | Expected verdict |
|---|-------------|-----------------|
| 1 | "Humanise this" | YES - direct trigger |
| 2 | "Make this sound less AI" | YES - direct trigger |
| 3 | "This reads like a robot wrote it" | YES - direct trigger |
| 4 | "De-AI this text" | YES - direct trigger |
| 5 | "Can you clean up this ChatGPT output?" | YES - paraphrased trigger |
| 6 | "This sounds like it was written by an AI, fix it" | YES - paraphrased trigger |
| 7 | "Make this more human" | YES - paraphrased trigger |
| 8 | "Remove the AI slop from this" | YES - direct trigger |
| 9 | "This draft is too formal and stilted, rewrite it" | YES - implied (stilted = AI patterns) |
| 10 | "It sounds like a press release - can you give it a voice?" | YES - implied (soulless/AI tone) |

---

## Section B: Negative Trigger Tests (should NOT activate)

These phrases should NOT activate the humaniser skill.

| # | Input phrase | Expected verdict |
|---|-------------|-----------------|
| 1 | "Proofread this for grammar" | NO - grammar check only |
| 2 | "Check my spelling" | NO - spell check only |
| 3 | "Is this email too long?" | NO - structural question |
| 4 | "Translate this to French" | NO - translation task |
| 5 | "Summarise this article" | NO - summarisation task |
| 6 | "Fix the typo in paragraph two" | NO - targeted edit, not humanising |
| 7 | "Is this good?" | NO - evaluation request, not rewriting |

---

## Section C: Pattern Detection Test Cases

For each test paragraph, the known AI patterns are listed. A correct output must fix all flagged
patterns and inject voice.

---

### C1: Content patterns

**Input:**

> The exhibition stands as a testament to the city's vibrant cultural heritage. It highlights the
> community's enduring commitment to the arts, showcasing works that reflect a pivotal moment in the
> region's history. Despite the challenges faced during the pandemic, the museum has emerged stronger,
> with a future outlook that promises exciting new exhibitions. Experts argue that the collection
> represents a new era of civic pride.

**Patterns flagged:**

- #1 Inflated significance: "stands as a testament", "pivotal moment"
- #3 Superficial -ing analyses: "highlights", "showcasing", "reflecting"
- #4 Promotional language: "vibrant cultural heritage", "enduring commitment"
- #5 Vague attribution: "Experts argue"
- #6 Formulaic challenges: "Despite the challenges faced...", "future outlook"

**Good output characteristics:**

- Removes "stands as", "testament", "vibrant", "pivotal"
- Attributes claims specifically or cuts them
- Drops the challenges/future outlook boilerplate
- Has an actual opinion about the exhibition

---

### C2: Language and grammar patterns

**Input:**

> This platform not only enables seamless collaboration but also fosters a sense of belonging among
> its users. It serves as a bridge between teams, offering a suite of tools that enhance productivity,
> streamline workflows, and facilitate communication. Users can tap into a wealth of resources,
> aligning their goals with the platform's comprehensive feature set.

**Patterns flagged:**

- #7 AI vocabulary: "seamless", "fosters", "enhance", "facilitate", "aligning", "comprehensive"
- #8 Copula avoidance: "serves as", "offers"
- #9 Negative parallelism: "not only...but also"
- #10 Rule of three: "enhance productivity, streamline workflows, and facilitate communication"
- #12 False range: "a suite of tools" (not a scale)

**Good output characteristics:**

- Concrete verbs replace abstract nominalisations
- No "not only...but also"
- Rule of three broken up or collapsed to one real claim
- "serves as a bridge" rewritten to a direct statement

---

### C3: Style patterns

**Input:**

> ## The Transformative Power Of Community Events
>
> **Key benefits:** Events bring people together.
> **Social impact:** Communities become stronger.
> **Future potential:** The possibilities are endless.
>
> These gatherings represent an exciting journey toward excellence - a new beginning for civic
> engagement.

**Patterns flagged:**

- #13 Em dash: "- a new beginning" used for dramatic effect
- #14 Boldface overuse: mechanical bolding of every list item
- #15 Inline-header lists: "**Key benefits:**", "**Social impact:**" etc.
- #16 Title Case: "The Transformative Power Of Community Events"
- #24 Generic positive conclusion: "journey toward excellence", "possibilities are endless"

**Good output characteristics:**

- Heading in sentence case
- List items written as prose or real bullet points without fake bold headers
- Em dash replaced or restructured
- Ending has a concrete takeaway, not a vague uplift

---

### C4: Communication patterns

**Input:**

> I hope this finds you well! Great question - I'd be happy to help. As of my last update in January
> 2024, the current approach involves reviewing [Name]'s proposal carefully. Let me know if you need
> anything else!

**Patterns flagged:**

- #19 Chat artifacts: "I hope this finds you well!", "Let me know if you need anything else!"
- #20 Knowledge-cutoff disclaimer: "As of my last update in January 2024"
- #21 Sycophantic tone: "Great question!", "I'd be happy to help"
- #28 Placeholder text: "[Name]"

**Good output characteristics:**

- Opens with the actual content
- No sycophancy openers
- Cuts the disclaimer or rewrites as a factual caveat
- Placeholder flagged and removed or labelled clearly

---

### C5: Filler and hedging patterns

**Input:**

> In order to fully understand this issue, it is important to note that the results could potentially
> possibly indicate a shift in consumer behaviour. Due to the fact that data collection was limited,
> we might have some effect on the overall outcome. At this point in time, the future looks bright,
> and this represents an exciting journey toward excellence.

**Patterns flagged:**

- #22 Filler phrases: "In order to", "Due to the fact that", "At this point in time", "it is
  important to note that"
- #23 Excessive hedging: "could potentially possibly", "might have some effect"
- #24 Generic positive conclusion: "future looks bright", "exciting journey toward excellence"

**Good output characteristics:**

- "In order to" → "To"
- "Due to the fact that" → "Because"
- "could potentially possibly indicate" → "suggest" or "point to"
- Ending replaced with a concrete statement or honest uncertainty

---

## Section D: Quality Scoring Rubric

Use this rubric to evaluate humaniser output quality. All five criteria must pass for a correct
output.

| Criterion | Pass | Fail |
|-----------|------|------|
| **Pattern removal** | All flagged patterns fixed | One or more flagged patterns remain unchanged |
| **Voice injection** | Has rhythm variation + at least one opinion or specific detail | Still reads like cleaned-up AI - neutral, even, flat |
| **Meaning preserved** | Core message intact | Meaning changed or key information dropped |
| **Over-editing** | Original tone and intent recognisable | Completely rewritten in a different voice |
| **Readability** | Sounds natural when read aloud | Sounds awkward, stilted, or overly casual |

### Scoring

- **5/5 pass**: Correct output
- **4/5 pass**: Acceptable - note the failed criterion
- **3/5 or below**: Needs revision - return to the relevant pattern reference files

---

## Maintenance

- Add new test cases when new AI patterns are identified
- Update Section A triggers if new activation phrases are observed in practice
- Re-run Section C tests after any changes to pattern reference files
