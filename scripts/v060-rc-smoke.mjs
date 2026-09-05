import fs from 'node:fs'
import path from 'node:path'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}
function read(rel) {
  return fs.readFileSync(path.resolve(rel), 'utf8')
}
function exists(rel) {
  return fs.existsSync(path.resolve(rel))
}

const pkg = JSON.parse(read('package.json'))
const app = read('src/App.tsx')
const nav = read('src/components/PrimaryNav.tsx')
const topbar = read('src/components/TopBar.tsx')
const today = read('src/screens/TodayScreen.tsx')
const shifts = read('src/screens/JourneyScreen.tsx')
const store = read('src/components/StoreShiftMap.tsx')
const shiftExperience = read('src/components/ShiftExperience.tsx')
const activityPlayer = read('src/components/ChapterActivityPlayer.tsx')
const buildScreen = read('src/screens/Level2BuildScreen.tsx')
const reviewScreen = read('src/screens/ReviewScreen.tsx')
const reviewRuntime = read('src/data/reviewRuntime.ts')
const onboarding = read('src/screens/OnboardingScreen.tsx')
const more = read('src/screens/MoreScreen.tsx')
const main = read('src/main.tsx')
const shiftCss = read('src/styles/v060/shiftExperience.css')
const finalCss = read('src/styles/v060/finalPolish.css')

assert(pkg.version === '0.6.0-rc.1' || pkg.version === '0.6.0', `package version must be 0.6.0-rc.1 or 0.6.0, got ${pkg.version}`)
assert(typeof pkg.scripts?.['v060:check'] === 'string', 'v060:check script missing')
assert(typeof pkg.scripts?.['v060:rc'] === 'string', 'v060:rc script missing')

// Primary IA contract.
for (const label of ['Today', 'Shifts', 'Review', 'More']) {
  assert(nav.includes(`label: '${label}'`), `Primary nav label missing: ${label}`)
}
assert(!nav.includes("label: 'Journey'"), 'Visible Journey nav label returned')
assert(topbar.includes("home: 'Today'"), 'Today location label missing')
assert(topbar.includes("parentLabel: 'All Shifts'"), 'Store-detail back target must be All Shifts')

// First-run contract.
assert((onboarding.match(/kind: '(welcome|loop|navigation)',/g) || []).length === 3, 'Onboarding must stay at exactly 3 steps')
assert(onboarding.includes('Start Day 1'), 'Onboarding final CTA must be Start Day 1')
assert(app.includes("queueShiftLaunch(1, 1, true, window.sessionStorage)"), 'Onboarding must direct-launch Day 1')

// Today / Shifts contract.
assert(today.includes('recommendedBuildDay'), 'Today must recommend unfinished BUILD for a completed SELECT Day')
assert(shifts.includes('ALL SHIFTS'), 'Shifts overview missing')
assert(shifts.includes('v060-shifts-store-row'), '8-store route UI missing')
assert(store.includes('SELECT → BUILD'), 'Store Detail must show paired SELECT → BUILD status')
assert(store.includes('onBuildDay'), 'Store Detail BUILD launch callback missing')

// SELECT Result / character feedback contract.
assert(activityPlayer.includes("document.querySelector('.chapter-result-reaction')"), 'Activity Result must scroll to character reaction')
assert(activityPlayer.includes('className="chapter-result-reaction"'), 'Character reaction Result block missing')
assert(activityPlayer.includes('emotion={reaction.emotion}'), 'Score-dependent Result expression missing')
assert(shiftCss.includes('.chapter-result-reaction-score'), 'Result score layout missing')
assert(shiftCss.includes('display: flex'), 'Result score + grade inline layout regression')
assert(shiftExperience.includes("Build today's English"), 'SELECT → BUILD bridge CTA missing')

// BUILD Day session contract.
assert(!buildScreen.includes('Complete Level 1 to unlock BUILD.'), 'Old global BUILD gate returned')
assert(buildScreen.includes('1 Day = 3 BUILD Activities'), 'Day-scoped BUILD description missing')
assert(buildScreen.includes('setActivityIndex((index) => index + 1)'), 'BUILD must continue through the 3 activities')
assert(buildScreen.includes('BUILD COMPLETE'), 'BUILD Day completion screen missing')

// Review contract.
assert(reviewScreen.includes('NEXT BEST REVIEW'), 'Action-first Review hero missing')
assert(reviewScreen.includes('Review {plan.items.length || 5} activities'), 'Direct Review CTA missing')
assert(reviewScreen.includes('REPAIR LAB'), 'REPAIR route missing from Review')
assert(reviewScreen.includes('Advanced mastery details'), '96-concept details route missing')
assert(reviewRuntime.includes('encounteredReviewActivityCandidates'), 'Progress-aware candidate filter missing')
assert(reviewRuntime.includes('transferChallenge'), 'Transfer Challenge fallback marker missing')
assert(reviewRuntime.includes('readBuildProgress'), 'BUILD progress guard missing')
assert(reviewRuntime.includes('readAdvancedProgress'), 'REPAIR progress guard missing')

// Phase 4 / mobile contract.
assert(more.includes('Optional tools'), 'More simplification missing')
assert(more.includes('v0.6.0 · UI/UX Reboot'), 'v0.6.0 About copy missing')
assert(finalCss.includes('@media (max-width: 430px)'), '430px Android guard missing')
assert(finalCss.includes('@media (max-width: 360px)'), '360px Android guard missing')
assert(finalCss.includes('overflow-x: hidden'), 'Global horizontal-overflow guard missing')

// All v0.6 CSS layers should remain loaded.
for (const css of [
  './styles/v060/shell.css',
  './styles/v060/today.css',
  './styles/v060/journey.css',
  './styles/v060/review.css',
  './styles/v060/storeDetail.css',
  './styles/v060/shiftExperience.css',
  './styles/v060/unifiedFlow.css',
  './styles/v060/finalPolish.css',
]) {
  assert(main.includes(css), `v0.6 stylesheet import missing: ${css}`)
}

// Chapter bridge contract.
for (let chapter = 1; chapter <= 8; chapter += 1) {
  const file = `src/screens/Chapter${chapter}Screen.tsx`
  assert(exists(file), `Chapter file missing: ${file}`)
  const screen = read(file)
  assert(screen.includes('StoreShiftMap'), `Chapter ${chapter}: Store Detail regression`)
  assert(screen.includes('ShiftDayResult'), `Chapter ${chapter}: Shift Result regression`)
  assert(screen.includes('readShiftLaunch'), `Chapter ${chapter}: Today direct-start regression`)
  assert(screen.includes('queueBuildDayLaunch'), `Chapter ${chapter}: SELECT→BUILD bridge regression`)
  assert(screen.includes('onBuildDay='), `Chapter ${chapter}: Store BUILD callback regression`)
  assert(screen.includes('onBuild='), `Chapter ${chapter}: Result BUILD callback regression`)
}

console.log('English Shift v0.6.0 RC UI/UX contract: PASS')
console.log('IA=Today/Shifts/Review/More · Onboarding=3-step direct Day1')
console.log('SELECT→BUILD=paired · BUILD=3-activity Day session · Review=progress-aware')
console.log('Character Result=visible reaction + inline score/grade · Android guards=360/430px')
