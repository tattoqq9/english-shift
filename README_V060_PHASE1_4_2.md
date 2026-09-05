# v0.6.0 Phase 1.4.2 — Result Score Inline Hotfix

Result reaction card refinement.

Changes:
- score and grade are now horizontal: `100  S`
- removes the vertical score/grade stack
- reduces unused vertical space
- slightly reduces Result portrait/card height on mobile
- keeps the character reaction visible at the top of Result

Apply with:

```powershell
.\apply-patch.ps1 `
  "$env:USERPROFILE\Downloads\english-shift-v060-phase1_4_2-result-score-inline-hotfix.zip" `
  -RunChecks

npm run v060:check
npm run dev:debug
```
