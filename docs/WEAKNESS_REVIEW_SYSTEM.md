# Weakness Review System — v0.3.15

## Goal

Turn Grammar Mastery from a passive dashboard into an actionable learning loop:

```text
Needs Review
  -> detect weak canonical grammar keys
  -> find related activities from Level 1 + Exam Shift
  -> build a compact 3–5 activity session
  -> replay without changing Chapter / Exam progress
  -> update Mastery automatically
```

## Selection rules

The review planner uses only grammar concepts that the learner has already practiced and that currently meet the `Needs Review` condition:

- Mastery below 75%, or
- Japanese hints have been used and Mastery is below 85%.

Unseen grammar is not treated as a weakness. New coverage remains the job of Level 1 / Exam Shift progression.

Candidate activities are ranked by:

1. lower Mastery (larger deficit),
2. `target` grammar over `review` over `exposure`,
3. coverage of more currently weak concepts,
4. avoiding the exact activity that most recently produced the weak result when an alternative exists.

The planner uses the existing 162 activities. No new content is required for a review session.

## Progress isolation

Review Session mounts `ChapterActivityPlayer` directly. Therefore:

- Grammar Mastery is updated normally.
- Chapter completedDays / best scores are not changed.
- Exam Shift completedModules / best scores are not changed.

This keeps learning analytics separate from campaign progression.

## UI

The Mastery `NEXT REVIEW` panel shows a `Review Weak Points` action. Starting it displays:

- review progress,
- the current activity,
- focus grammar chips,
- the normal Visual Grammar + Japanese translation UI.

At the end, the player sees:

- session average,
- activity count,
- Japanese hint count,
- before -> after Mastery for the focused grammar concepts.
