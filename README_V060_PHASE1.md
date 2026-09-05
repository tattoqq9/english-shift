# English Shift v0.6.0 Phase 1 — App Shell Rebuild

This patch replaces the v0.5.1 hub shell with the first v0.6.0 UX structure:

- Home route -> Today
- Learn route -> Journey
- Mastery route -> Review
- More -> simplified secondary tools
- existing detailed Mastery preserved as `masteryDetails`
- new Today / Journey / Review visual hierarchy
- new mobile bottom navigation
- new contextual detail header
- v0.6.0 isolated design-token/style layer

Not changed in Phase 1:

- curriculum content
- scoring
- Mastery math
- saved progress schema
- character assets
- BUILD unlock model
- activity player UI

After applying, run:

```powershell
npm run v060:check
npm run dev:debug
```

Android acceptance for Phase 1:

1. Today / Journey / Review / More are visually distinct.
2. The bottom navigation clearly shows the current hub.
3. Entering a Chapter hides the bottom navigation and shows a contextual back button.
4. Android Back still moves through app history safely.
5. Review -> Advanced mastery details still opens the existing v0.5.1 Mastery screen.
6. Existing course data and progress remain intact.
