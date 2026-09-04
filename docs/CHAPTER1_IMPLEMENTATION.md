# Chapter 1 Implementation — v0.2.0

## Goal

Level 1 / Chapter 1 "Convenience Store" を6 Shiftの小キャンペーンとして実装する。
Level 2/3にはまだ進まず、SELECT方式だけでゲームとして成立するかを確認する。

## Progression

- Day 1: First Shift — be/do, affirmative/negative, basic service
- Day 2: Find It Fast — where, there is/are, prepositions, Information Hunt
- Day 3: Checkout Basics — how much/how many/can, checkout processing
- Day 4: What Is Happening? — present progressive, please + imperative, guidance
- Day 5: Payment Trouble — what/why, negative forms, Troubleshooting
- Day 6: Busy Shift — Chapter 1 mixed review / Rush

## Current density

- 3 activities per Shift
- 18 total activities

This is intentionally smaller than the final target of 5–7 customer encounters per Shift.
First validate pacing, cognitive load, and variety on Android. Add encounters only after playtesting.

## Gameplay types used

- Dialogue / service response
- Checkout / processing
- Information Hunt
- Troubleshooting
- Rush

## Progress persistence

Browser localStorage key:

`english-shift-chapter1-progress-v1`

Stores:

- completedDays
- best score per Day

Days unlock sequentially. Replaying a completed Day keeps the better score.

## Scoring rule

Every activity is normalized to 100 points.
Automated core tests verify that the theoretical best route of all 18 activities reaches 100.

## Next playtest questions

1. Is 3 activities per Day too short, or a good first mobile session?
2. Does each Day feel different enough?
3. Is the amount of result feedback still too high during campaign play?
4. Does Day 6 feel like a real chapter exam rather than more of the same?
5. Which Day should receive the first repeat customer / micro-event expansion?
