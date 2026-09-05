# English Shift v0.5.1 — Phase 4 Content Integration

This phase connects the approved recurring cast to the remaining learning surfaces without changing scoring or saved-data schemas.

## Included

- Level 2 BUILD inherits `customerId` from its exact Level 1 source activity.
- BUILD displays the same Customer portrait and reacts to Almost / Not quite / success / reveal states.
- The 12 copy-sensitive activities receive synchronized English/Japanese rewrites and now use their final recurring character.
- Rapid / Queue keeps the activity-level scene icon, while each active mini-customer receives a real recurring-character portrait.
- Character foundation checks now require zero pending rewrites.
- New integration smoke verifies 144/144 BUILD identity inheritance, 12/12 rewrite completion, Japanese coverage, and Rapid mini-customer routing.

## Not changed

- Activity IDs
- Correct-answer IDs
- Scoring
- Grammar targets
- Mastery formulas
- Weakness Review rules
- LocalStorage keys or schemas
- Progress migration
- Final 48 portrait assets already approved in Phase 3

## Validation

```powershell
npm run character:check
npm run build:check
npm run rc:check
npm run dev:debug
```

Android spot checks:

1. Open a normal SELECT activity with a new recurring character.
2. Open the matching Level 2 BUILD activity and confirm the same portrait/name.
3. In BUILD, make one wrong answer: portrait should become Confused; Almost should become Thinking.
4. Complete a BUILD activity correctly: portrait should become Happy/Delighted.
5. Open a Rapid / Queue activity: header stays the group Scene icon, but the current mini-customer shows a real portrait and name.
6. Spot-check rewritten activities: Day 13 Activity 2 (Noah), Day 21 Activity 3 (Leo), Day 26 Activity 2 (Mia), Day 46 Activity 1 (Oliver).
