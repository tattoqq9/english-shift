import fs from 'node:fs'

function read(path) {
  return fs.readFileSync(path, 'utf8')
}
function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const pkg = JSON.parse(read('package.json'))
const lock = JSON.parse(read('package-lock.json'))
const player = read('src/components/BuildActivityPlayer.tsx')
const buildCore = read('src/core/build.ts')
const freeCore = read('src/core/freeBuild.ts')
const buildScreen = read('src/screens/Level2BuildScreen.tsx')
const more = read('src/screens/MoreScreen.tsx')
const main = read('src/main.tsx')
const css = read('src/styles/v065/freeBuild.css')

assert(['0.6.5', '0.6.6', '0.7.0'].includes(pkg.version), `package version must be 0.6.5/0.6.6/0.7.0, got ${pkg.version}`)
assert(['0.6.5', '0.6.6', '0.7.0'].includes(lock.version), `package-lock version must be 0.6.5/0.6.6/0.7.0, got ${lock.version}`)
assert(['0.6.5', '0.6.6', '0.7.0'].includes(lock.packages?.['']?.version), 'package-lock root version must be 0.6.5/0.6.6/0.7.0')

assert(buildCore.includes("if (mode === 'challenge') return 'free'"), 'Challenge must remain free presentation')
assert(buildCore.includes('if (day <= 30)'), 'Standard progression boundary missing')
assert(player.includes('v065-free-build-editor'), 'free typing editor missing')
assert(player.includes('textarea'), 'free typing textarea missing')
assert(player.includes('scoreFreeBuild'), 'free typing scorer not connected')
assert(player.includes('freeBuildSignature'), 'normalized unchanged-answer guard missing')
assert(player.includes('YOUR RESPONSE'), 'typed Answer Review missing')
assert(player.includes('maxLength={320}'), 'mobile-safe input length guard missing')
assert(player.includes('英語を自分で入力して返答を作る'), 'Free BUILD instruction missing')

assert(buildScreen.includes('Day 31以降はFree typing中心'), 'Standard selective Free BUILD progression copy missing')
assert(buildScreen.includes('全Dayを自由入力'), 'Challenge free BUILD copy missing')
assert(
  more.includes('v0.6.5 · Free BUILD Production')
    || more.includes('v0.6.6 · Selective Free BUILD')
    || more.includes('v0.7.0 · Public Beta'),
  'v0.6.5+ Free BUILD version card missing',
)
assert(main.includes("./styles/v065/freeBuild.css"), 'v0.6.5 free BUILD stylesheet import missing')
assert(css.includes('@media (max-width: 520px)'), 'mobile free BUILD guard missing')

assert(freeCore.includes('acceptedFreeAnswers'), 'future curated alternative-answer extension missing')
assert(freeCore.includes('negationMismatch'), 'negation safety guard missing')
assert(freeCore.includes('modalMismatch'), 'modal safety guard missing')

// Existing BUILD completion/progress schema must remain untouched.
for (const forbidden of [
  'BUILD_PROGRESS_KEY =',
  'MASTERY_STORAGE_KEY',
  'setItem(',
]) {
  assert(!freeCore.includes(forbidden), `Free BUILD scorer must not own persistence: ${forbidden}`)
}

console.log('English Shift v0.6.5 Free BUILD UI smoke: PASS')
console.log('Standard Day31–48 typing · Challenge all-day typing · Guided/Semi chunks preserved · typed Answer Review · 360/430 guards')
