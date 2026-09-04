# Chapter 6 Implementation — Hotel

Version: v0.3.3

## Days

- Day 31 — Reservation History: past perfect, timeline reconstruction
- Day 32 — Staff Handoff: reported speech, say / tell / ask
- Day 33 — Missing Luggage: modal perfect, evidence deduction, Incident Investigation
- Day 34 — Expected Service: be supposed to, seem / appear, service diagnosis
- Day 35 — Confirm the Details: negative questions, tag questions
- Day 36 — Overbooking Night: integrated incident investigation, manager handoff, final hotel rush

## New campaign activity type: Incident Investigation

The Game Lab incident loop is promoted into the campaign as a reusable data-driven activity.

Flow:

1. Guest reports a problem.
2. Player may interview a limited number of witnesses/staff.
3. Each interview reveals an English statement and a timeline/evidence clue.
4. Player selects the most likely conclusion.
5. Score = Evidence Selection (30) + Inference (70).
6. Answer Review shows the best conclusion and the highest-value witnesses.

Best-route scoring is normalized so the best available evidence + correct conclusion reaches 100.

## Learning support

Chapter 6 inherits the standard v0.3.x UI:

- Hotel Scene Header
- activity type + situation
- customer portrait/name + full-width order
- optional Japanese hints before answering
- Language Review after answering
- collapsed Answer Review
- Japanese hint counts without score penalty

Incident witnesses and conclusion choices also have Japanese support.
