# v0.6.0 Phase 1.4.1 — Result Layout Hotfix

Fixes the Android/mobile Result reaction card introduced in Phase 1.4.

Changes:
- keeps portrait / reaction copy / score on one row
- removes the mobile second score row that created excessive blank space
- reduces Result-only grade badge size
- reduces Result portrait size
- hides redundant helper copy inside the reaction card
- preserves the score-based portrait expression and animation

Apply with the existing `apply-patch.ps1`, then run:

```powershell
npm run v060:check
npm run dev:debug
```
