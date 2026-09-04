# Chapter 3 Implementation — Sports / Outdoor Store

Version: v0.2.3

## Scope

Chapter 3 covers **Day 13–18** and unlocks after Chapter 2 Day 12.

The chapter shifts from simple product comparison toward reading a customer's **experience, duration, safety constraints, and environmental conditions**.

| Day | Theme | Main language | Game focus |
|---:|---|---|---|
| 13 | Previous Experience | present perfect / ever / never | Experience + Recommendation |
| 14 | How Long? | for / since / present perfect progressive | Duration + Customer Profile |
| 15 | Advice & Rules | should / must / have to | Advice + Safety Judgment |
| 16 | Weather & Conditions | may / might / if / when | Conditional Recommendation |
| 17 | Outdoor Trouble | unless / If I were... | Troubleshooting + Hypothetical Advice |
| 18 | Expedition Shift | Chapter 1–3 review | Mixed Expedition Challenge |

## Content volume

- 6 shifts
- 3 activities per shift
- 18 activities total
- Existing SELECT-mode activity engine reused:
  - dialogue
  - information hunt
  - troubleshooting
  - rapid response

## Chapter-specific design goals

1. **Experience becomes a hidden variable.**
   A product may be suitable for an experienced customer but poor for a beginner.
2. **Questions reveal a customer profile, not just product preferences.**
   Duration, frequency, terrain, weather, and safety constraints affect decisions.
3. **Advice and requirements are separated.**
   `should` is not treated as equivalent to `must / have to`.
4. **Conditions matter.**
   Recommendations change with rain, temperature, wind, and future possibilities.
5. **Day 18 integrates Chapters 1–3.**
   The final shift mixes experience, comparison, advice, conditions, and troubleshooting.

## Learning support

v0.2.2 learning support is retained:

- activity-type icon/badge
- optional Japanese before answering
- per-choice translation button
- automatic Japanese review after answering
- Language Review
- Japanese-hint counter with no score penalty

All Chapter 3 target English strings used in openings/questions/choices/actions are covered by the Japanese-support test.

## Progress storage

`localStorage` key:

```text
english-shift-chapter3-progress-v1
```

Stored values:

- completed days
- best score per day
- last Japanese hint count
- best/minimum Japanese hint count

## Validation

`npm run core:check` validates:

- Days 13–18 exist and are unique
- each day references exactly three valid activities
- all 18 best routes can reach 100 points
- Chapter 1/2/3 Japanese learning-support coverage
