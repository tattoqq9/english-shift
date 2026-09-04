# English Shift Grammar Audit Snapshot — v0.3.7

Base: v0.3.6 Level 1 content (48 Shifts / 144 Activities), migrated through the v0.3.7 canonical Grammar Registry.

## Current result

- ES-G1: **37 / 45 complete = 82.2%**
- ES-G2: **19 / 25 complete = 76.0%**
- ES-G3: **1 / 26 currently touched**; Level 1 is not expected to complete ES-G3
- Unclassified legacy grammar labels: **0**
- Target concepts with no review annotation yet: **28**

## ES-G1 gaps

- `PRONOUNS_DEMONSTRATIVES` — migration metadata needs explicit annotation even though examples exist
- `PAST_PROGRESSIVE`
- `WHOSE_POSSESSION`
- `SVOO`
- `IT_IS_TO`
- `OR_QUESTIONS`
- `EXCLAMATIONS`
- `SVC_LINKING_VERBS`

## ES-G2 gaps

- `RELATIVE_ADVERBS` — partial / exposure only
- `POLITE_FORMAL_REQUESTS`
- `LIMITED_FREQUENCY_STATE`
- `ADJECTIVE_THAT_CLAUSE`
- `RELATIVE_OBJECT`
- `PAST_PERFECT_PROGRESSIVE`

## Interpretation

This audit is stricter than the earlier 62-row human checklist because composite rows have been split into atomic skills. That is intentional. A learner should not receive credit for “past simple / past progressive” if only past simple has a deliberate target activity.

Next content milestone: integrate these ES-G1/G2 gaps into existing Days, then re-run `npm run grammar:audit` until both tiers reach 100%.
