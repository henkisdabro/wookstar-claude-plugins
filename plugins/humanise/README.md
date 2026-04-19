# Humanise

Remove AI tell-tales from text. Detects and eliminates 29 patterns of AI-generated writing including inflated language, promotional tone, AI vocabulary, em dash overuse, filler phrases, sycophantic tone, placeholder text, formulaic structure, and thematic breaks.

Based on Wikipedia's "Signs of AI writing" guide maintained by WikiProject AI Cleanup. Last synced: 2026-04-18.

## Skills

- **humanise** - Identifies and removes AI writing patterns from text, replacing them with natural, human-sounding alternatives while preserving meaning and intended tone.

## Usage

Invoke with: "humanise this", "make this sound less AI", "remove AI patterns", "de-AI this text", "make this more natural".

The skill:

1. Scans for all 29 patterns
2. Reads detailed reference files for found patterns
3. Rewrites flagged sections (replaces with voice, not just removes)
4. Returns humanised text with a brief footnote of patterns fixed
