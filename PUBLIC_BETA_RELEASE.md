# English Shift v0.7.0 — Public Beta Release

## Release baseline

Public Beta freezes the learning architecture at the v0.6.6 Selective Free BUILD baseline.

Do not change for release-only work:
- SELECT / BUILD / REPAIR separation
- 162 SELECT activities
- 144 BUILD activities
- 24 REPAIR activities
- 96 Grammar Registry concepts
- Mastery/save schemas
- existing user progress

## Local release gate

```powershell
npm run v070:release
```

## Cloudflare Pages

```text
Production branch: main
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Root directory: /
```

No environment variable is required for normal production.

Do not set:

```text
VITE_DEBUG_UNLOCK_ALL_DAYS=true
```

That variable is only for local/debug validation.

## First deployment check

1. fresh browser shows onboarding
2. Today → SELECT → BUILD works
3. reload preserves progress
4. More → Feedback opens GitHub Issues
5. More → Privacy opens `/privacy.html`
6. sound/music/haptics settings work
7. Customer Book loads
8. Standard selective Free BUILD works
9. browser console has no blocking runtime error
10. debug badge is not visible

## Public assets

- `/manifest.webmanifest`
- `/icon-192.png`
- `/icon-512.png`
- `/apple-touch-icon.png`
- `/og-card.png`

## Final Public Beta URL

https://english-shift.tattoqq9.workers.dev/

Canonical metadata, absolute Open Graph image URLs, and sitemap are pinned to this URL.

If a custom domain is introduced later, replace these canonical URLs in one metadata-only migration.
