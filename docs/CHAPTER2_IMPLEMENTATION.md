# Chapter 2 Implementation — Clothing Store

Version: v0.2.1

## Scope

Chapter 2 adds Day 7–12 to the Level 1 SELECT campaign.

- Day 7 — which / one / ones
- Day 8 — comparative / too / enough
- Day 9 — to-infinitive / gerund
- Day 10 — past simple / will / be going to
- Day 11 — another / other / because / so
- Day 12 — superlative / as ... as + Chapter review

Each day currently contains three activities, matching Chapter 1's test density.

## Game-loop distribution

Chapter 2 deliberately mixes:

- direct customer-service choices
- information-hunt / recommendation
- rapid response
- exchange troubleshooting

The clothing-store layer focuses on size, color, fit, purpose, comparison, stock, purchase history, and exchange rather than repeating convenience-store tasks.

## Progression

Chapter 2 is locked until Chapter 1 Day 6 has been completed.

Progress is stored separately:

- Chapter 1: `english-shift-chapter1-progress-v1`
- Chapter 2: `english-shift-chapter2-progress-v1`

Completing Day 7 unlocks Day 8, continuing through Day 12.

## Validation

`npm run core:check` validates:

- six Chapter 2 days
- Day 7 through Day 12 ordering
- three activities per day
- all activity references exist
- exactly 18 Chapter 2 activities
- every activity has a route that reaches 100/100
