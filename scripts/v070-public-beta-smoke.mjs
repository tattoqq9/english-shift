import fs from 'node:fs'

function read(path) { return fs.readFileSync(path, 'utf8') }
function assert(condition, message) { if (!condition) throw new Error(message) }

const pkg = JSON.parse(read('package.json'))
const lock = JSON.parse(read('package-lock.json'))
const manifest = JSON.parse(read('public/manifest.webmanifest'))
const index = read('index.html')
const more = read('src/screens/MoreScreen.tsx')
const onboarding = read('src/screens/OnboardingScreen.tsx')
const main = read('src/main.tsx')
const runtime = read('src/runtimeMode.ts')
const privacy = read('public/privacy.html')
const releaseDoc = read('PUBLIC_BETA_RELEASE.md')

assert(pkg.version === '0.7.0', `package must be 0.7.0, got ${pkg.version}`)
assert(lock.version === '0.7.0', `package-lock must be 0.7.0, got ${lock.version}`)
assert(lock.packages?.['']?.version === '0.7.0', 'package-lock root must be 0.7.0')
assert(manifest.name === 'English Shift', 'manifest app name missing')
assert(manifest.display === 'standalone', 'manifest standalone display missing')
assert(manifest.icons?.some((icon) => icon.sizes === '192x192'), '192px icon missing from manifest')
assert(manifest.icons?.some((icon) => icon.sizes === '512x512'), '512px icon missing from manifest')

for (const file of [
  'public/icon-192.png','public/icon-512.png','public/apple-touch-icon.png',
  'public/og-card.png','public/privacy.html','public/robots.txt',
]) assert(fs.existsSync(file), `public release asset missing: ${file}`)

for (const token of [
  'rel="manifest"','apple-touch-icon','og:title','og:description','og:image',
  'twitter:card','English Shift | 英文法を使う接客ゲーム',
]) assert(index.includes(token), `public metadata missing: ${token}`)

assert(more.includes('PUBLIC BETA'), 'Public Beta section missing from More')
assert(more.includes('Feedback'), 'Feedback route missing')
assert(more.includes('github.com/tattoqq9/english-shift/issues/new'), 'GitHub feedback URL missing')
assert(more.includes('/privacy.html'), 'Privacy link missing')
assert(more.includes('v0.7.0 · Public Beta'), 'v0.7.0 More version card missing')
assert(onboarding.includes('PUBLIC BETA'), 'Public Beta label missing from onboarding')
assert(onboarding.includes('進捗はこのブラウザに保存'), 'local saved-data onboarding notice missing')
assert(main.includes("./styles/v070/publicBeta.css"), 'v0.7.0 stylesheet import missing')
assert(privacy.includes('localStorage'), 'privacy page must explain browser-local progress')
assert(privacy.includes('2026-09-07'), 'privacy update date missing')
assert(releaseDoc.includes('npm run build'), 'Cloudflare build command missing')
assert(releaseDoc.includes('dist'), 'Cloudflare output directory missing')
assert(releaseDoc.includes('VITE_DEBUG_UNLOCK_ALL_DAYS'), 'production debug warning missing')
assert(runtime.includes("VITE_DEBUG_UNLOCK_ALL_DAYS === 'true'"), 'debug mode must remain opt-in only')

console.log('English Shift v0.7.0 Public Beta web smoke: PASS')
console.log('manifest · icons · metadata · Public Beta notice · Feedback · Privacy · Cloudflare release guide · debug opt-in')
