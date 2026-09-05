import fs from 'node:fs'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const lock = fs.existsSync('package-lock.json')
  ? JSON.parse(fs.readFileSync('package-lock.json', 'utf8'))
  : null

assert(pkg.version === '0.6.0', `package version must be 0.6.0, got ${pkg.version}`)
if (lock) {
  assert(lock.version === '0.6.0', `package-lock version must be 0.6.0, got ${lock.version}`)
  if (lock.packages?.['']) {
    assert(lock.packages[''].version === '0.6.0', `package-lock root package version must be 0.6.0, got ${lock.packages[''].version}`)
  }
}

assert(typeof pkg.scripts?.['v060:check'] === 'string', 'v060:check missing')
assert(typeof pkg.scripts?.['v060:rc:smoke'] === 'string', 'v060:rc:smoke missing')
assert(typeof pkg.scripts?.['v060:release'] === 'string', 'v060:release missing')

const more = fs.readFileSync('src/screens/MoreScreen.tsx', 'utf8')
const app = fs.readFileSync('src/App.tsx', 'utf8')
const review = fs.readFileSync('src/screens/ReviewScreen.tsx', 'utf8')
const build = fs.readFileSync('src/screens/Level2BuildScreen.tsx', 'utf8')

assert(more.includes('v0.6.0 · UI/UX Reboot'), 'More screen version copy missing')
assert(app.includes("queueShiftLaunch(1, 1, true, window.sessionStorage)"), 'direct Day 1 onboarding launch missing')
assert(review.includes('NEXT BEST REVIEW'), 'Review Reboot regression')
assert(build.includes('BUILD COMPLETE'), 'BUILD completion regression')

console.log('English Shift v0.6.0 final release smoke: PASS')
console.log('version=0.6.0 · package-lock synced · v0.6 UX contract present')
