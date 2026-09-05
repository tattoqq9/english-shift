# v0.5.1 Phase 3 — Character Assets Integration

This patch builds on the already-tested v0.5.1 Character Foundation.

## Adds

- 8 approved new character portrait sets:
  - Sofia
  - Leo
  - Oliver
  - Aisha
  - Noah
  - Ken
  - Hana
  - Young Customer
- 6 expressions per character:
  - neutral
  - thinking
  - happy
  - confused
  - delighted
  - disappointed
- 48 new WebP assets total.
- `CustomerPortrait` now recognizes all 11 illustrated characters (existing Mia / Daniel / Grace + new 8).
- `character:assets` verifies all 66 portrait files exist (11 characters × 6 expressions).
- `character:check` now checks both assignment logic and physical portrait assets.

## Intentionally deferred

- Level 2 BUILD portrait UI
- the 12 character-aware English/Japanese rewrites
- scenario-level portraits inside Rapid / Queue activities

Those are kept out of this patch so the new visual assets can be verified independently on Android before copy and learning-content changes are introduced.
