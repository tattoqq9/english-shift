# English Shift v0.4.5 — Level 2 Quality & Feedback Pass

## What changed

### 1. Correct / Almost / Not quite diagnosis

BUILD now compares target-chunk inclusion and sequence similarity rather than relying mainly on a correct-prefix rule.

- Correct: exact target order
- Almost: required chunks are present but reordered, or the sentence is structurally very close
- Not quite: distractor use, missing meaning, or larger structural mismatch

Feedback is Japanese and explains what kind of revision to make without revealing the answer.

### 2. Three-stage optional hints

Every Level 2 Activity now receives exactly three progressive hints:

1. thinking / grammar concept
2. sentence-role skeleton
3. partial chunk-position anchor

The full answer is never included in a hint. `Show best answer` is available after repeated checks or all three hints.

### 3. BUILD-specific Answer Review

Results now show:

- YOUR LAST TRY when it differs from the model
- BEST RESPONSE + Japanese
- STRUCTURE MAP
- WHY? grammar / construction points
- Customer follow-up

### 4. Distractor quality pass

The previous fallback that could mechanically reverse words has been removed. Distractor generation now prioritizes plausible learner confusions such as auxiliary choice, agreement, demonstratives, time/preposition contrasts and other local contrasts; a neutral semantic distractor is used only when no useful local mutation exists.

### 5. Full Level 2 quality audit

New command:

```powershell
npm run level2:quality
```

The audit checks all 144 Activities for progressive hints, sentence/chunk length, distractor uniqueness and malformed patterns, Japanese feedback, and Correct/Almost/Not quite behavior.

## Preserved

- Level 1: 48 Shifts / 144 Activities
- Level 2: 48 Days / 144 Activities
- ES-G1/G2 Level 2 coverage: 70/70
- Exam Shift ES-G3: 26/26
- Mastery / Weakness Review
- REPAIR LAB: 6 Units / 24 Missions
- FLOW LAB: unchanged / on hold
- Home / Learn / Mastery / More navigation
