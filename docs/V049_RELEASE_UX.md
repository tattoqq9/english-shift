# English Shift v0.4.9 — Release UX / Android Polish + Learning Interaction

## Scope

This pass intentionally avoids adding a new learning mode. It hardens the existing v0.4.8 product for mobile release testing and removes interaction friction found during Android use.

- Browser / Android Back follows in-app navigation history instead of leaving detail screens abruptly.
- Finishing or skipping onboarding replaces the tutorial history entry so Back does not immediately reopen it.
- Safe-area padding is added for gesture navigation and display cutouts.
- Long English sentences, Japanese translations, grammar labels, and review text wrap without horizontal overflow.
- Main actions receive a consistent mobile touch target without enlarging every BUILD chunk or grammar chip.
- Home / Learn copy is simplified around SELECT → BUILD → REPAIR / MASTERY.
- FLOW LAB is labeled optional instead of being presented as a required progression step.

## Choice-card interaction

The English response and its translation area are visually one answer card, so they now behave as one tap target.

- Tapping the English text selects the answer.
- Tapping card whitespace or the revealed Japanese translation also selects the answer.
- The small `訳 / 日本語を見る` button remains an independent translation control and never selects the answer by itself.
- Disabled answer cards remain disabled while the translation control can still be used.

## BUILD support policy

The old `3 Checks or Hint 3 → Show best answer` unlock is removed.

1. The learner first constructs an answer, or uses hints if they cannot begin.
2. A correct Check goes directly to the result.
3. After the first incorrect Check, the learner can choose among revising, another Hint, or `See best answer`.
4. The same unchanged answer cannot be checked repeatedly; changing the assembled response re-enables Check.
5. Hint 1 → 2 → 3 remains progressive. Hint 3 also unlocks `See best answer` even if the learner could not produce an initial answer.
6. Revealing the answer records a REVIEW-level score rather than a normal success score.
7. Check count is kept in the result for reflection, but removed from the live workbench so the task does not feel like an unlock counter.
8. `See best answer` is placed below the normal Clear / Hint / Check controls, behind a small divider, so it reads as the next rescue stage rather than a peer action.

## REPAIR support policy

REPAIR uses the same principle with its single available hint.

- The Hint can be used once only.
- One incorrect Check unlocks `See correction`.
- Using the single Hint also unlocks `See correction` without forcing a guess.
- Re-checking an unchanged replacement is blocked.
- Revealed corrections finish as REVIEW, with a lower recorded score, while still showing the corrected sentence and explanation.
- `See correction` uses the same lower rescue zone as BUILD so the interaction hierarchy is consistent.

## Storage policy

No learning-storage key or schema is changed in v0.4.9. Existing chapter, BUILD, Exam, Advanced Training, Mastery, and onboarding data remain untouched.

## Android acceptance

1. Home → Learn → Chapter → browser/Android Back returns to Learn, then Home.
2. More → Getting Started → Skip returns to More and Back does not reopen onboarding immediately.
3. On a SELECT card, tapping below the English text selects it; tapping `訳` only opens/closes translation.
4. BUILD: one wrong Check immediately exposes `See best answer`; unchanged answers cannot be Check-spammed. `See best answer` appears below the normal action row.
5. BUILD: Hint 3 can expose the answer even with no submitted sentence.
6. REPAIR: Hint is one-use; one wrong Check or the Hint exposes `See correction`.
7. Long BUILD / Answer Review text wraps without horizontal scrolling.
8. Bottom navigation clears gesture-navigation safe area.
9. Existing progress is unchanged after update.

## Package version consistency

The repository's existing `package-lock.json` still identifies the root package as 0.4.6. Run `npm run version:sync` once after applying this patch; it updates only the root package version fields to match `package.json` (0.4.9) and does not change dependency versions.
