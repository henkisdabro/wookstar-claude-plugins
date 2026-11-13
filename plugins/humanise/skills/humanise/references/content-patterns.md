# Content patterns (1-6, 35)

Rewriting guidance for content-level patterns. The index in SKILL.md says which apply.

**Evidence note (Wikipedia, 10 November 2026):** #1, #2 and #5 now carry "outdated examples" banners on Wikipedia - none of their examples is from 2026, and editors are asking for current ones before deciding whether to move them to historical. Treat them as weaker evidence than the 2026 patterns. #2 and #35 are also strongest in encyclopedic and biographical writing: Graphite's 2026 web-article corpus found no skew at all for the notability phrasing, so outside bios and profiles expect to see them rarely.

---

## 1. Undue Emphasis on Significance, Legacy, and Broader Trends

**Words to watch:** stands/serves as, is a testament/reminder, a vital/significant/crucial/pivotal/key role/moment, underscores/highlights its importance/significance, reflects broader, symbolizing its ongoing/enduring/lasting, contributing to the, setting the stage for, marking/shaping the, represents/marks a shift, key turning point, evolving landscape, focal point, indelible mark, deeply rooted

**Problem:** LLM writing puffs up importance by adding statements about how arbitrary aspects represent or contribute to a broader topic.

**Before:**
> The Statistical Institute of Catalonia was officially established in 1989, marking a pivotal moment in the evolution of regional statistics in Spain. This initiative was part of a broader movement across Spain to decentralize administrative functions and enhance regional governance.

**After:**
> The Statistical Institute of Catalonia was established in 1989 to collect and publish regional statistics independently from Spain's national statistics office.

---

## 2. Undue Emphasis on Notability and Media Coverage

**Words to watch:** independent coverage, local/regional/national media outlets, trade publications, cited/featured/profiled in, has also been mentioned in, documented in, written by a leading expert

**Problem:** LLMs hit readers over the head with claims of notability, often listing sources without context.

**What separates this from an ordinary press release** (Wikipedia sharpened this in August 2026, because the pattern was being over-applied): humans have cited news clippings for promotional purposes forever. The tell is that the attention lands on **characteristics of the sources themselves** - what they contain, whether they are easy or hard to find, and how they classify against the wider media landscape - rather than on what the sources actually said. A model asked to write for a publication often echoes that publication's own editorial criteria back at the reader, as though the justification for including the text had been pasted into the text.

**Structural sign:** a section headed "Awards and recognition" (or just "Recognition"). People write legacy and impact sections too, but that exact heading is close to ubiquitous in AI-drafted biographies and company profiles - Wikipedia's datasets show it far more common than in human writing, even against articles already tagged as promotional. A heading is not enough on its own; pair it with the source-characteristic tell above.

**Sub-pattern - online presence (fading):** "maintains an active social media presence", "a strong digital presence". Wikipedia split this into its own subsection in November 2026, and an editor noted they had not seen it in a while; it is flagged for a move to historical. Cut it where you find it, but expect it in 2024-25 text rather than fresh output.

**Before:**
> Her views have been cited in The New York Times, BBC, Financial Times, and The Hindu. She maintains an active social media presence with over 500,000 followers.

**After:**
> In a 2024 New York Times interview, she argued that AI regulation should focus on outcomes rather than methods.

---

## 3. Superficial Analyses with -ing Endings

**Words to watch:** highlighting/underscoring/emphasizing..., ensuring..., reflecting/symbolizing..., contributing to..., cultivating/fostering..., encompassing..., showcasing...

**Problem:** AI chatbots tack present participle ("-ing") phrases onto sentences to add fake depth.

**Evidence:** Reinhart et al. (PNAS, 2025) measured instruction-tuned models using present participial clauses at two to five times the human rate, across genres. It is one of the most robust grammatical tells, and it survives vocabulary changes between model versions.

**Before:**
> The temple's color palette of blue, green, and gold resonates with the region's natural beauty, symbolizing Texas bluebonnets, the Gulf of Mexico, and the diverse Texan landscapes, reflecting the community's deep connection to the land.

**After:**
> The temple uses blue, green, and gold colors. The architect said these were chosen to reference local bluebonnets and the Gulf coast.

---

## 4. Promotional and Advertisement-like Language

**Words to watch:** boasts a, vibrant, rich (figurative), profound, enhancing its, showcasing, exemplifies, commitment to, natural beauty, nestled, in the heart of, groundbreaking (figurative), renowned, breathtaking, must-visit, stunning

**Era (Wikipedia, November 2026):** moved to historical indicators, dated 2023-2025. The blatant press-release tone became less common from around 2024 and is no longer common in newer LLM output unless the user asks for it. Newer text can still be promotional in what it includes, such as a focus on awards, without the prose reading that way.

**Problem:** Older LLMs had serious problems keeping a neutral tone, especially for "cultural heritage" topics.

**Before:**
> Nestled within the breathtaking region of Gonder in Ethiopia, Alamata Raya Kobo stands as a vibrant town with a rich cultural heritage and stunning natural beauty.

**After:**
> Alamata Raya Kobo is a town in the Gonder region of Ethiopia, known for its weekly market and 18th-century church.

---

## 5. Vague Attributions and Weasel Words

**Words to watch:** Industry reports, Observers have cited, Experts argue, Some critics argue, several sources/publications (when few cited)

**Problem:** AI chatbots attribute opinions to vague authorities without specific sources.

**Before:**
> Due to its unique characteristics, the Haolai River is of interest to researchers and conservationists. Experts believe it plays a crucial role in the regional ecosystem.

**After:**
> The Haolai River supports several endemic fish species, according to a 2019 survey by the Chinese Academy of Sciences.

---

## 6. Outline-like "Challenges and Future Prospects" Sections

**Words to watch:** Despite its... faces several challenges..., Despite these challenges, Challenges and Legacy, Future Outlook

**Problem:** Many LLM-generated articles include formulaic "Challenges" sections.

**Before:**
> Despite its industrial prosperity, Korattur faces challenges typical of urban areas, including traffic congestion and water scarcity. Despite these challenges, with its strategic location and ongoing initiatives, Korattur continues to thrive as an integral part of Chennai's growth.

**After:**
> Traffic congestion increased after 2015 when three new IT parks opened. The municipal corporation began a stormwater drainage project in 2022 to address recurring floods.

---

## 35. Undue Emphasis on Identification by Primary or Tertiary Sources

**Words to watch:** [databases/records/listings/filings/materials] identify/list/describe [subject] as, was identified by [source] as [fact], is listed in, his/her professional profile lists

**Problem:** Where a subject appears in a primary or tertiary source (an official website, a database, a historical record), AI text over-stresses that the source exists and what it says, usually in a stilted, formulaic way. The attention lands on how the source *identifies* the subject when the fact could simply be stated. Wikipedia split this from #2 in November 2026, says it became common from 2026, and as of 10 November lists it among the most common signs of newly generated text.

**It also hits news sources.** The Wikipedia talk page (November 2026) separates this "emphasis on attribution" from #2's "emphasis on notability": the sentence attributes a mundane fact the writer could just state, whatever the source's prestige - "Reuters reported on Farah's work in 2021, describing him as a Somali-Dutch film producer". The test: delete the attribution and see whether a normal sentence remains ("Farah is a Somali-Dutch film producer"). If it does, the attribution was the tell. Editors there judge this the stronger signal of the two.

**Before:**
> Her personal website identifies her as a retired civil servant.

**After:**
> She is a retired civil servant, according to her website.

