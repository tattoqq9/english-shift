# Level 2 BUILD Quality & Feedback — v0.4.6

## Goal

Level 2 is no longer judged only by content count or grammar coverage. v0.4.6 treats BUILD as a production-learning loop:

`Build → Check → Diagnose → Revise → Optional Hint → Answer Review`

## Check states

- **Correct / 正解** — exact target chunk order.
- **Almost / あと少し** — the required chunks are all present but the order is wrong, or one required chunk is missing while most of the sequence is already correct.
- **Not quite / もう一度** — distractor use, substantial missing meaning, or a larger structural mismatch.

The sentence can be checked even when it is wrong. Hint is never required before checking.

## Progressive hints

Each BUILD Activity has exactly three hints:

1. **Concept hint** — explains what to think about without revealing chunks.
2. **Structure hint** — shows the sentence-role skeleton.
3. **Partial-position hint** — reveals only the beginning/end anchor, not the full answer.

`Show best answer` appears after three checks or all three hint stages.

## Content repair pass

v0.4.6 replaces equal-width word splitting with phrase-aware chunking. The generator now protects determiners, prepositions, auxiliaries, question frames, sentence boundaries and common multiword grammar frames. Activities that need especially clear teaching units use reviewed chunk overrides.

Structure Slot labels are derived from the actual chunk instead of being assigned only by position. Labels now distinguish question frames, question details, auxiliaries, conditions, connectors, response openings, tag questions, actions and passive/state chunks.

Distractors no longer fall back to generic time phrases. Short or structurally sensitive Activities use reviewed contextual distractors, while generated distractors must pass filters for incomplete fragments, broken pronoun case, malformed modal combinations and other mechanical errors.

## BUILD Answer Review

The result screen now separates:

- YOUR LAST TRY (when different from the target)
- BEST RESPONSE + Japanese
- STRUCTURE MAP (slot role → target chunk)
- WHY? (grammar focus + learning route)
- CUSTOMER response

## Automated quality audit

`npm run level2:quality` validates all 144 Activities for:

- three distinct progressive hints
- no hint containing the full target answer
- slot count = target chunk count
- target chunks <= 8 words
- target response <= 30 words
- at least two unique distractors
- no distractor equal to a target chunk
- exactly two contextual distractors per Activity
- generic fallback and low-quality malformed patterns blocked
- target chunks do not cross sentence boundaries or end after a determiner
- Structure Map labels use the reviewed label set and match Hint 2
- wrong-order correct chunks => Almost
- distractor use => Not quite
- Japanese diagnostic feedback
