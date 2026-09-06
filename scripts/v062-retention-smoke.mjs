import fs from 'node:fs'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'))
assert(['0.6.2', '0.6.3'].includes(pkg.version), `package version must be 0.6.2/0.6.3, got ${pkg.version}`)
assert(lock.version === pkg.version, `package-lock version must match package version, got ${lock.version}`)
assert(lock.packages?.['']?.version === pkg.version, 'package-lock root package version must match package version')

const retention = fs.readFileSync('src/core/retention.ts', 'utf8')
const habit = fs.readFileSync('src/components/HabitProgressCard.tsx', 'utf8')
const passport = fs.readFileSync('src/components/ShiftPassportStrip.tsx', 'utf8')
const today = fs.readFileSync('src/screens/TodayScreen.tsx', 'utf8')
const review = fs.readFileSync('src/screens/ReviewScreen.tsx', 'utf8')
const shift = fs.readFileSync('src/components/ShiftExperience.tsx', 'utf8')
const build = fs.readFileSync('src/screens/Level2BuildScreen.tsx', 'utf8')
const more = fs.readFileSync('src/screens/MoreScreen.tsx', 'utf8')
const main = fs.readFileSync('src/main.tsx', 'utf8')

assert(retention.includes("english-shift-retention-v1"), 'isolated retention key missing')
assert(retention.includes('WEEKLY_ACTIVE_DAY_TARGET = 5'), '5-day weekly target missing')
assert(habit.includes('WEEKLY RHYTHM'), 'Today weekly rhythm card missing')
assert(habit.includes('Weekly Stamp'), 'weekly reward UI missing')
assert(passport.includes('STORE MASTER'), 'Store Master seal missing')
assert(today.includes('<HabitProgressCard />'), 'Today does not render habit card')
assert(shift.includes("recordRetentionSession('select_shift'"), 'SELECT Shift retention event missing')
assert(build.includes("recordRetentionSession('build_day'"), 'BUILD Day retention event missing')
assert(review.includes("recordRetentionSession('review'"), 'Review retention event missing')
assert(more.includes('v0.6.2 · Habit & Rewards') || more.includes('v0.6.3 · Audio Atmosphere'), 'More version copy missing')
assert(main.includes("./styles/v062/retention.css"), 'v0.6.2 styles import missing')

// Retention is motivational metadata only. It must not be allowed to become
// a second learning-progress or Mastery system.
assert(!retention.includes('MASTERY_STORAGE_KEY'), 'retention must not write Mastery')
assert(!retention.includes('BUILD_PROGRESS_KEY'), 'retention must not write BUILD progress')
assert(!retention.includes('grammarRegistry'), 'retention must not alter Grammar Registry')

console.log('English Shift v0.6.2 Habit & Rewards smoke: PASS')
console.log('Streak · 5-day Weekly Stamp · Store Master seal · isolated retention state')
