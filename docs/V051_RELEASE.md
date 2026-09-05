# English Shift v0.5.1 — Characters & Context

## Release scope

v0.5.1 improves scene clarity without changing scoring or saved-progress schemas.

### Character system

- 11 recurring customers
- 6 expressions per customer
- 66 portrait assets total
- Mia is the visual framing baseline
- New portraits use a consistent shoulder-inclusive composition

### Learning integration

- Level 1 / SELECT uses the recurring cast
- Level 2 / BUILD inherits the exact `customerId` from its Level 1 source activity
- BUILD portrait reactions change with learning feedback
- Rapid / Queue keeps the group-scene header while the active mini-customer receives an individual portrait
- 12 character-aware activities were rewritten with English/Japanese synchronization
- `pendingRewrite` count is 0

### Compatibility

No scoring schema, Mastery schema, Weakness Review schema, or BUILD progress storage key is changed by v0.5.1.

## Final release gate

Run:

```powershell
npm run v051:check
```

The gate first synchronizes `package-lock.json`, runs the v0.5.1 integration smoke test, and then runs the existing complete RC regression suite.

Expected release-smoke summary:

```text
English Shift v0.5.1 release smoke: PASS
Version=0.5.1 · Characters=11 · Expressions=6 · Portraits=66
BUILD customer inheritance=ON · Rapid mini-customer=ON · pendingRewrite=0
Storage schema migration: none
```
