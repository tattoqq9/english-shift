# English Shift v0.5.0 — Release Candidate

## Goal

v0.5.0 freezes the current learning design and verifies that the product is internally consistent before release. This pass adds no new learning mode, curriculum branch, scoring rule, or storage schema.

Release baseline:

- Level 1 · SELECT: 48 Shifts / 144 Activities
- Level 2 · BUILD: 48 Days / 144 Activities, one-to-one with Level 1
- Exam Shift · ES-G3: 6 Modules / 18 Activities
- Grammar Registry: 96 concepts total
  - ES-G1/G2: 70
  - ES-G3: 26
- REPAIR LAB: 6 Units / 24 Activities
- FLOW LAB: 3 optional foundation activities
- Weakness Review candidates: 330
  - SELECT: 162
  - BUILD: 144
  - REPAIR: 24

## Automated release gate

Run:

```powershell
npm run rc:check
```

The gate performs, in order:

1. package-lock root version sync
2. full TypeScript typecheck
3. existing core regression suite
4. v0.5.0 aggregate Release Candidate invariant check
5. Level 2 BUILD correctness smoke
6. navigation/progress smoke
7. Advanced Training smoke
8. Level 2 content-quality audit
9. grammar coverage audit
10. production build

Any failure blocks the RC. Do not push v0.5.0 as release-ready until this command is green and the Android matrix below has passed.

## RC invariants added in v0.5.0

`release-candidate-smoke.ts` checks cross-feature relationships that individual subsystem tests do not fully protect:

- all eight Level 1 chapters still form exactly Days 1–48
- every Level 1 day still contains exactly three activities
- SELECT catalog remains exactly Level 1 + Exam Shift
- every Level 1 activity has exactly one BUILD counterpart
- BUILD remains 3 activities/day and 18/chapter
- grammar inventory stays at 70 ES-G1/G2 + 26 ES-G3
- Weakness Review remains exactly SELECT 162 + BUILD 144 + REPAIR 24
- FLOW never leaks into the measured SELECT / BUILD / REPAIR review pool
- major persistent storage domains remain uniquely namespaced

## Android RC matrix

Use the normal saved-data device first. Do not clear progress before the upgrade test.

| Area | Representative test | PASS condition |
|---|---|---|
| Upgrade | Launch existing v0.4.9 data | Home opens; previous Level 1 / BUILD / Mastery / REPAIR progress remains |
| Home | Continue Learning | Correct next route opens |
| Learn | Open Chapters 1 and 8 | Navigation and progress display remain correct |
| Level 1 SELECT | One Direct/choice activity | Whole answer card selects except the `訳` control |
| Level 1 Investigate | Ask/diagnose flow | question budget and answer selection work |
| Level 1 Handoff/Queue | one multi-step activity | selection, submit and result remain usable |
| Level 1 boundary | Day 48 | final Level 1 activity can complete without layout break |
| BUILD Guided | Day 1 or 12 | slots, Hint, Check, Answer Review work |
| BUILD Semi | Day 13 or 30 | chunk assembly and retry work |
| BUILD Free | Day 31 or 48 | free assembly, long wrapping and retry work |
| BUILD rescue | submit one wrong answer | `See best answer` appears below normal actions; unchanged answer cannot be rechecked |
| Mastery | open a practiced grammar | SELECT / BUILD / REPAIR remain separate |
| Weakness Review | start one generated review | selected activity matches the displayed weak ability |
| REPAIR | one wrong repair | Hint is one-use; `See correction` appears in the lower rescue zone |
| Exam Shift | one module | ES-G3 activity completes and records progress |
| Onboarding replay | More → Getting Started → Skip | returns to More without altering progress |
| Android Back | Home → Learn → Chapter → Back | returns Chapter → Learn → Home rather than exiting unexpectedly |
| Long text | BUILD + Answer Review | no horizontal scrolling |
| Bottom UI | gesture-navigation device | bottom controls clear the safe area |

## Fresh-profile check

After the existing-data upgrade test, use a separate browser profile/incognito context or another origin to test a truly fresh profile:

- onboarding appears once
- Skip does not reopen it automatically
- Start Level 1 opens Chapter 1
- returning later opens the normal app rather than onboarding again

## Release decision

v0.5.0 can be marked Release Candidate PASS only when:

- `npm run rc:check` passes
- existing-data Android test passes
- fresh-profile onboarding test passes
- no P0/P1 usability or data-loss defect remains

Minor copy or cosmetic issues may be deferred only if they do not affect comprehension, answer selection, navigation, saved progress, or scoring.
