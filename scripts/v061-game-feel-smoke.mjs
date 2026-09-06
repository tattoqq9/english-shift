import fs from 'node:fs'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'))

assert(['0.6.1', '0.6.2', '0.6.3'].includes(pkg.version), `package version must be 0.6.1/0.6.2/0.6.3, got ${pkg.version}`)
assert(lock.version === pkg.version, `package-lock version must match package version, got ${lock.version}`)
assert(lock.packages?.['']?.version === pkg.version, 'package-lock root package version must match package version')

const gameFeel = fs.readFileSync('src/core/gameFeel.ts', 'utf8')
const passport = fs.readFileSync('src/components/ShiftPassportStrip.tsx', 'utf8')
const more = fs.readFileSync('src/screens/MoreScreen.tsx', 'utf8')
const shift = fs.readFileSync('src/components/ShiftExperience.tsx', 'utf8')
const buildPlayer = fs.readFileSync('src/components/BuildActivityPlayer.tsx', 'utf8')
const buildScreen = fs.readFileSync('src/screens/Level2BuildScreen.tsx', 'utf8')
const main = fs.readFileSync('src/main.tsx', 'utf8')

assert(gameFeel.includes("english-shift-game-feel-v1"), 'game feel settings key missing')
assert(gameFeel.includes("soundFx: true"), 'Sound FX default missing')
assert(gameFeel.includes("haptics: true"), 'Haptics default missing')
assert(passport.includes('SHIFT PASSPORT'), 'Shift Passport UI missing')
assert(more.includes('GAME FEEL'), 'More > Game Feel settings missing')
assert(more.includes('Sound effects'), 'Sound effects toggle missing')
assert(more.includes('Haptics'), 'Haptics toggle missing')
assert(more.includes('Celebration animation'), 'Celebration animation toggle missing')
assert(shift.includes("playGameFeel('shift_complete'"), 'Shift completion feedback missing')
assert(buildPlayer.includes('playGameFeel(result.check'), 'BUILD Correct/Almost/Not quite feedback missing')
assert(buildScreen.includes("playGameFeel('build_complete'"), 'BUILD completion feedback missing')
assert(main.includes("./styles/v061/gameFeel.css"), 'v0.6.1 styles import missing')

// Regression guard: v0.6.1 must add a presentation/settings layer only.
assert(!gameFeel.includes('MASTERY_STORAGE_KEY'), 'game feel layer must not write Mastery')
assert(!gameFeel.includes('BUILD_PROGRESS_KEY'), 'game feel layer must not write BUILD progress')
assert(!gameFeel.includes('grammarRegistry'), 'game feel layer must not alter Grammar Registry')

console.log('English Shift v0.6.1 Game Feel foundation smoke: PASS')
console.log('SFX · haptics · celebration settings · Shift Passport · no learning-schema changes')
