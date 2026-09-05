import fs from 'node:fs'
import path from 'node:path'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}
function read(rel) {
  return fs.readFileSync(path.resolve(rel), 'utf8')
}

const app = read('src/App.tsx')
const onboarding = read('src/screens/OnboardingScreen.tsx')
const more = read('src/screens/MoreScreen.tsx')
const nav = read('src/components/PrimaryNav.tsx')
const topbar = read('src/components/TopBar.tsx')
const main = read('src/main.tsx')
const polish = read('src/styles/v060/finalPolish.css')
const review = read('src/screens/ReviewScreen.tsx')
const build = read('src/screens/Level2BuildScreen.tsx')

assert((onboarding.match(/kind: '(welcome|loop|navigation)',/g) || []).length === 3, 'Onboarding must have exactly 3 steps')
assert(onboarding.includes('Start Day 1'), 'Onboarding direct Day 1 CTA missing')
assert(onboarding.includes('SELECTを終えると同じDayのBUILD'), 'Current SELECT→BUILD flow missing from guide')
assert(onboarding.includes('Todayは今やること'), 'Current 3-place navigation guidance missing')

assert(app.includes("queueShiftLaunch(1, 1, true, window.sessionStorage)"), 'Onboarding must direct-launch Day 1')
assert(nav.includes("label: 'Shifts'"), 'Shifts nav label missing')
assert(!nav.includes("label: 'Journey'"), 'Old Journey label reintroduced')
assert(topbar.includes("parentLabel: 'All Shifts'"), 'Store detail back label should be All Shifts')
assert(topbar.includes("home: 'Today'"), 'TopBar hub location labels missing')

assert(more.includes('Optional tools'), 'More hierarchy not simplified')
assert(more.includes('How English Shift works'), 'Guide route missing')
assert(more.includes('RC prep'), 'v0.6.0 status copy missing')
assert(!more.includes('Phase 1'), 'stale Phase 1 copy remains in More')

assert(main.includes("./styles/v060/finalPolish.css"), 'finalPolish.css import missing')
assert(polish.includes('@media (max-width: 430px)'), '430px Android audit rules missing')
assert(polish.includes('@media (max-width: 360px)'), '360px Android audit rules missing')

assert(review.includes('NEXT BEST REVIEW'), 'Phase 3 Review regression')
assert(build.includes('1 Day = 3 BUILD Activities'), 'Phase 2 BUILD session regression')

console.log('English Shift v0.6.0 Phase 4 First-run & Final UX Polish smoke: PASS')
console.log('Onboarding=3 steps · final CTA=direct Day 1 · More=Help/Labs/About')
console.log('Visible Journey copy=removed · 360/430px shell guards=present · Phase 2/3 flows preserved')
