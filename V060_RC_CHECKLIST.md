# English Shift v0.6.0-rc.1 — Manual RC Checklist

Run the automated gate first:

```powershell
npm run v060:rc
```

Do not commit/push the release candidate if this command fails.

## Android real-device pass

Use normal mode once and debug mode once. Recommended device width: 360–430 px.

- [ ] Fresh/Guide flow: More → How English Shift works → 3 screens → `Start Day 1` opens Day 1 directly.
- [ ] Today: primary CTA starts the actual current Shift; it does not stop on a Day selection screen.
- [ ] Shifts: 8 stores are understandable at a glance; current store is obvious.
- [ ] Store Detail: exactly 6 Days; SELECT and BUILD state for each Day is understandable.
- [ ] SELECT: complete all 3 Activities without returning to the Shift list between questions.
- [ ] SELECT Result: changed customer expression is immediately visible; score and grade appear inline.
- [ ] Shift Complete: `Build today's English` opens BUILD for the same Day.
- [ ] BUILD: Activity 1 → 2 → 3 runs continuously; `BUILD COMPLETE` appears at the end.
- [ ] Today after SELECT: an unfinished BUILD Day can become the recommended action.
- [ ] Review: `NEXT BEST REVIEW` is the first clear action.
- [ ] Review: `Review 5 activities` enters the session directly and returns to Review after completion.
- [ ] Review: ordinary sessions reuse encountered content; `TRANSFER CHALLENGE` only appears when fallback is required.
- [ ] REPAIR LAB opens from Review and preserves existing REPAIR progress.
- [ ] Exam Shift still opens and runs normally after its existing unlock condition.
- [ ] Android Back/browser Back does not reopen completed onboarding unexpectedly and does not trap the user.
- [ ] Repeated tapping on primary/Continue buttons does not create duplicate progression.
- [ ] No horizontal scrolling at 360 px or 430 px.
- [ ] TopBar/store back labels fit without overlapping.
- [ ] Bottom navigation remains usable above Android safe-area/navigation UI.
- [ ] Existing user progress remains present after reload/restart.

## Release decision

If automated checks and all applicable manual items pass:

1. Mark `v0.6.0-rc.1` as PASS.
2. Prepare the final version bump from `0.6.0-rc.1` to `0.6.0`.
3. Run the same automated gate once more.
4. Commit and push only after the final gate passes.
