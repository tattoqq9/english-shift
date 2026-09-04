# Level 2 BUILD Quality & Feedback — v0.4.5

## Goal

Level 2 is no longer judged only by content count or grammar coverage. v0.4.5 treats BUILD as a production-learning loop:

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
- low-quality malformed distractor patterns blocked
- wrong-order correct chunks => Almost
- distractor use => Not quite
- Japanese diagnostic feedback

