# English Shift v0.4.8 — First Onboarding

## Goal

Introduce the learning loop without adding another complex feature surface.

1. SELECT — recognize correct English in Level 1.
2. BUILD — construct the response in Level 2.
3. MASTERY — compare SELECT / BUILD / REPAIR and review the weakest ability.

## First-run policy

- A fresh browser profile sees the onboarding once.
- Finish and Skip both persist completion.
- A browser with any existing `english-shift-*` localStorage data is treated as an existing learner and is not interrupted after updating from v0.4.7.
- More → Getting Started can replay the tutorial at any time without resetting learning progress.
- Starting the tutorial never writes chapter, BUILD, Exam, REPAIR, FLOW, or Mastery progress.

## Android acceptance

- No horizontal scrolling at common portrait widths.
- Back / Next / Start buttons remain at least 48px high (52px on narrow screens).
- Safe-area insets are respected.
- Four onboarding screens fit compactly; short-height devices may use normal vertical scrolling rather than clipping content.
- Existing v0.4.7 progress launches directly to the existing Home screen.
