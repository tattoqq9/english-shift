# v0.5.1 Character & Scene Clarity — Phase 2 Foundation

This patch is an intermediate, low-risk foundation for the v0.5.1 character update.

## Included

- Central `characterRegistry.ts` with the complete 162-activity final allocation plan.
- 10 recurring customers + `Young Customer`.
- Planned recurring distribution: 12 each, except Leo 11.
- 42 non-person activities classified as Queue / Exam / Incident scenes.
- Startup `characterRuntime.ts` that applies safe character remaps to Level 1 + Exam Shift.
- Queue / Rush / Exam / Incident activities no longer reuse Mia/Daniel/Grace as a fake person portrait.
- `CustomerPortrait` renders scene icons for scene IDs.
- New characters intentionally use the existing letter fallback until their real six-expression WebP assets are added.
- 12 copy-sensitive activities are marked `pendingRewrite` and keep their current character in this foundation patch.
- `npm run character:check`.

## Not included yet

- New portrait assets for Sofia, Leo, Oliver, Aisha, Noah, Ken, Hana, Young Customer.
- The 12 synchronized English/Japanese copy rewrites.
- Scenario-level portraits inside Rapid / Queue.
- `customerId` portrait rendering in Level 2 BUILD.

These are the next v0.5.1 phases. Keeping them separate prevents broken Japanese translation help or character/copy contradictions while the asset set is still incomplete.

## Important invariants

This phase does not change:

- Grammar coverage
- Correct-answer logic
- Scoring
- Mastery formulas
- Weakness Review rules
- Saved-data schemas
- 48-Day structure
- Level 1 = 144
- Level 2 BUILD = 144
- Exam Shift = 18
- REPAIR = 24

## Validation

Run:

```powershell
npm run character:check
npm run rc:check
npm run dev:debug
```

Android spot checks:

1. Regular activities show newly assigned names with fallback initials where art is not available.
2. Existing Mia / Daniel / Grace illustrations still render normally where retained.
3. `d4-child` shows `Young Customer` rather than Mia.
4. Rapid / Queue headers show a group scene icon rather than a fake customer portrait.
5. Exam Queue shows a document scene icon.
6. `d36-overbooking-incident` shows an incident icon rather than Mia.
7. Pending rewrite examples such as `d13-ever-used` still retain their old character for now.
8. No progress, Mastery, onboarding, Android Back, or BUILD behavior regresses.
