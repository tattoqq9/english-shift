# English Shift Grammar System — v0.3.7

## Goal

English Shift targets two main learner groups:

- Japanese high-school students preparing for university entrance exams
- TOEIC Listening & Reading test takers

The game therefore needs two kinds of strength at the same time:

1. **communicative grammar** — understand a customer, ask useful questions, explain, infer and hand off information;
2. **exam grammar** — recognize tense, clause structure, modifiers, word forms and formal constructions quickly and accurately.

The project now uses the **English Shift Grammar Standard (ES-G)**.

## ES-G tiers

### ES-G1 — Foundation
Core grammar that must be automatic before exam-focused work. Level 1 should reach 100% deliberate coverage.

### ES-G2 — High-school Standard
Standard high-school structures and practical sentence patterns. Level 1 should also reach 100% deliberate coverage.

### ES-G3 — Advanced / Exam
Advanced university-entrance and TOEIC-oriented grammar. Level 1 may preview some items, but 100% completion is a **post-Level-1 goal**.

## Data model

Legacy activities keep:

```ts
grammar: ['present perfect', 'ever / never']
```

New activities may add canonical metadata:

```ts
grammarTargets: [
  { key: 'PRESENT_PERFECT', role: 'target' },
  { key: 'PERFECT_ADVERBS', role: 'target' },
]
```

Roles:

- `target`: the activity deliberately teaches/tests the structure;
- `review`: the structure is reused after introduction;
- `exposure`: it appears for recognition but is not yet required for production.

The audit tool migrates old free-form labels through `resolveLegacyGrammarLabel()` so the existing 144 activities do not need to be rewritten at once.

## Audit command

```powershell
npm run grammar:audit
```

The command checks:

- 48 Shift / 144 Activity integrity
- canonical registry uniqueness
- ES-G1 / G2 / G3 coverage
- target/review/exposure counts
- first/last appearance
- unclassified legacy labels
- targets that have not yet been reviewed

Coverage gaps do not fail the command yet. Structural errors do.

## Why this matters

Before v0.3.7, `grammar` mixed grammar, vocabulary and gameplay metadata and contained 162 different free-form labels. That made questions such as “Have we taught past progressive?” expensive to answer reliably.

Atomic canonical keys solve the composite-item problem. For example:

- `PAST_SIMPLE`
- `PAST_PROGRESSIVE`

are separate concepts even if an old curriculum row said “past simple / past progressive”.

Likewise:

- `WHICH_CHOICE` / `WHOSE_POSSESSION`
- `SVOO` / `SVOC`
- `IT_IS_TO` / `HOW_TO`
- `SEEM_APPEAR_TO` / `PERFECT_INFINITIVE`

are audited independently.

## Next milestone

Before Level 2, edit the existing 48 Shifts so:

- ES-G1 deliberate coverage = 100%
- ES-G2 deliberate coverage = 100%
- important concepts have at least one later review

Do not create Chapter 9 merely to hold missing grammar. Integrate the missing structures into existing Days where the situation naturally supports them.
