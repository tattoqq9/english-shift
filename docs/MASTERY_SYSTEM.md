# Player Mastery System — v0.3.14

## Goal

Separate **curriculum coverage** (the app contains and targets a grammar concept) from **player mastery** (this player can use/recognize it reliably).

## Storage

`english-shift-grammar-mastery-v1`

This key is independent from all Chapter progress and Exam Shift progress keys.

## Recorded per GrammarKey

- attempts
- successfulAttempts (activity score >= 82)
- totalScore / bestScore
- hintedAttempts / totalHints
- targetAttempts / reviewAttempts / exposureAttempts
- lastSeenAt / lastActivityId

One concept is counted at most once per completed activity. If one activity annotates the same concept with multiple roles, the strongest role is used:

`target > review > exposure`

## Mastery score

Performance base:

- average score: 60%
- successful-attempt rate: 25%
- hint-free rate: 15%

Then a repetition confidence multiplier is applied:

- first attempt: 78% confidence
- second attempt: 89% confidence
- third+ attempt: up to 100%

This prevents one lucky/perfect attempt from being displayed as full mastery.

## Bands

- Learning
- Developing
- Strong
- Mastered

`Mastered` requires at least two attempts plus stable successful performance.

## UI

The Mastery screen prioritizes actionability:

1. Overall / Practiced / Mastered / Needs Review
2. ES-G1 / ES-G2 / ES-G3 personal mastery
3. Next Review weak concepts
4. Strengths
5. Collapsible all-concept detail list

## Historical data

Existing v0.3.13 and earlier completion data is not backfilled because old day-level records do not contain enough activity-level grammar/hint information to reconstruct accurate mastery. Replaying activities from v0.3.14 onward builds precise personal data.
