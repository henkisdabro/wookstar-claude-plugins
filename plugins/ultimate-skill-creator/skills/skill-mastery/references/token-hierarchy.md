# Token Hierarchy Deep Dive

Understanding how Claude loads and processes skills is critical for efficient design.

## The Three-Level Loading Model

### Level 1: Metadata (Always Loaded)

**Cost:** ~100 tokens per skill
**When:** Every conversation startup
**What:** Only `name` and `description` from YAML frontmatter

```yaml
---
name: pdf-processing
description: Extract text from PDFs. Use when working with PDF files.
---
```

**Implication:** You want many skills? Keep descriptions concise. 50 skills × 100 tokens = 5,000 tokens at startup.

### Level 2: SKILL.md Body (On Trigger)

**Cost:** ~1,500-5,000 tokens (aim for <2,000)
**When:** After Claude selects the skill based on description match
**What:** Full markdown content of SKILL.md

**Implication:** This is where core guidance lives. Make it count but keep it lean.

### Level 3: Bundled Resources (On-Demand)

**Cost:** Unlimited potential, but zero until accessed
**When:** Claude reads a referenced file
**What:** scripts/, references/, assets/

**Implication:** Put detailed docs, schemas, examples here. They cost nothing until needed.

## Selection Mechanism

**Critical insight:** Claude uses **pure LLM reasoning** to select skills.

There is:
- No embedding similarity search
- No keyword matching algorithm
- No classifier model

Claude literally reads all descriptions and uses natural language understanding to decide relevance.

**What this means:**
- Vague descriptions = skill never triggers
- Specific trigger phrases = reliable activation
- Description quality is THE critical factor

## Token Budget Strategy

### For a Project with 20 Skills

```
Startup overhead:     20 × 100 = 2,000 tokens (unavoidable)
Active skill:         ~2,000 tokens (SKILL.md body)
Reference files:      ~5,000 tokens (only if accessed)
Conversation:         Remaining context window

Total for one skill usage: ~9,000 tokens
```

### Optimisation Strategies

1. **Front-load essentials in SKILL.md**
   - Quick start that covers 80% of use cases
   - Only reference files for advanced features

2. **Keep references shallow**
   - SKILL.md -> reference.md (one level)
   - Never: SKILL.md -> overview.md -> details.md

3. **Use grep hints for large references**
   ```markdown
   ## Schema reference
   See [schema.md](references/schema.md)

   Quick lookup: `grep -i "column_name" references/schema.md`
   ```

4. **Scripts execute, not load**
   ```markdown
   # This loads script content (~500 tokens)
   See scripts/validate.py for implementation details

   # This executes without loading (~50 tokens output)
   Run: python scripts/validate.py input.pdf
   ```

## Practical Examples

### Token-Efficient Skill (~1,500 tokens active)

```
skill/
├── SKILL.md (800 words core)
└── references/
    ├── api.md (full API, loaded only when needed)
    └── examples.md (working code, loaded only when needed)
```

### Token-Heavy Skill (~5,000 tokens active) - Avoid

```
skill/
└── SKILL.md (3,000 words, everything inline)
```

### Optimal Structure

```markdown
# In SKILL.md

## Quick start (always loaded)
[80% of use cases covered in 500 words]

## Advanced features (pointers only)
- **Forms**: See [FORMS.md](references/FORMS.md)
- **API**: See [API.md](references/API.md)

## Quick search (for large references)
grep -i "topic" references/
```

## Measuring Token Impact

1. **Check skill loading:** `claude --debug` shows what loads
2. **Count SKILL.md:** ~4 characters = 1 token (rough estimate)
3. **Test with fresh context:** Does skill work without reference files?

## Summary

| Level | Tokens | Optimisation |
|-------|--------|--------------|
| Metadata | ~100 fixed | Concise descriptions |
| SKILL.md | ~1,500-2,000 target | 80% coverage, pointers to rest |
| References | 0 until accessed | Large docs, schemas, examples |
| Scripts | Output only | Execute don't load |
