# Debug launch mode

English Shift v0.3.9 adds a development-only launch mode that unlocks all 48 Days without changing completion state, scores, or stored progress.

## Normal mode

```powershell
npm run dev:lan
```

or the existing command:

```powershell
npx vite --host 0.0.0.0
```

Days continue to unlock sequentially inside each Chapter.

## Debug mode

```powershell
npm run dev:debug
```

Debug mode sets `VITE_DEBUG_UNLOCK_ALL_DAYS=true` via `.env.debug` and unlocks every Day in Chapters 1–8 from the start.

A small `DEBUG · ALL DAYS UNLOCKED` badge is shown so debug mode cannot be confused with normal gameplay.

## Important behavior

- Does not mark Days as completed.
- Does not fabricate scores.
- Does not reset or overwrite localStorage progress.
- Completing a Day in debug mode saves that Day normally.
- Returning to normal mode restores sequential Day locking based on actual saved progress.
