# Chapter 4 Implementation — Electronics Store

Version: v0.2.5

## Scope

Chapter 4 covers **Day 19–24** and unlocks after Chapter 3 Day 18.

The chapter shifts toward handling denser technical English: product specifications, polite diagnostic questions, feature explanations, troubleshooting, and information handoff to specialist staff.

| Day | Theme | Main language | Game focus |
|---:|---|---|---|
| 19 | How Is It Made? | passive voice / participle adjectives | Product Explanation |
| 20 | Find the Exact Model | who / which / that | Specification Hunt |
| 21 | Ask More Politely | indirect questions | Polite Diagnosis |
| 22 | Explain What It Does | make / keep / let / how to | Feature Explanation |
| 23 | Technical Trouble | because / although / while | Technical Troubleshooting |
| 24 | Specialist Handoff | ask/tell + object + to / Chapter 4 review | Staff Coordination + Mixed Shift |

## Content volume

- 6 shifts
- 3 activities per shift
- 18 activities total
- Chapter activity types:
  - dialogue
  - checkout/guidance
  - information hunt
  - troubleshooting
  - rapid response
  - **staff coordination (new in v0.2.5)**

## Staff Coordination

The player reads a customer's English description, selects only the facts that matter to the next specialist, then chooses the clearest English handoff.

Scoring:

- Key Information: 60
- Handoff Clarity: 30
- Concision: 10

The best route reaches 100 points. Selecting irrelevant facts consumes limited handoff slots and lowers the score.

Answer Review shows:

- the player's handoff sentence
- the best handoff sentence
- the three key facts that should have been selected

## Learning support

The existing v0.2.2–0.2.4 support remains standard:

- activity type icon/badge
- optional Japanese before answering
- per-choice/per-question translation
- Japanese translation for Staff Coordination fact cards
- automatic Japanese review after answering
- Language Review
- collapsed Answer Review
- Japanese hint count with no score penalty

## Progress storage

`localStorage` key:

```text
english-shift-chapter4-progress-v1
```

Chapter 4 unlock condition:

```text
english-shift-chapter3-progress-v1 contains Day 18
```

## Validation

`npm run core:check` validates:

- Days 19–24 exist and are unique
- every day references three valid activities
- all 18 Chapter 4 best routes reach 100 points
- Staff Coordination best route reaches 100 points
- Japanese learning-support coverage for Chapters 1–4
- pre-existing core, event, Game Lab, and Chapter 1–3 tests still pass
