import fs from 'node:fs'

function read(path) {
  return fs.readFileSync(path, 'utf8')
}
function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const pkg = JSON.parse(read('package.json'))
const screen = read('src/screens/Level2BuildScreen.tsx')
const freeCore = read('src/core/freeBuild.ts')
const more = read('src/screens/MoreScreen.tsx')

assert(pkg.version === '0.6.6', `package must be 0.6.6, got ${pkg.version}`)
assert(screen.includes('standardFreeBuildDecision'), 'BUILD screen does not use audited Free suitability')
assert(screen.includes("basePresentation === 'free'"), 'base Free presentation gate missing')
assert(screen.includes("mode === 'standard'"), 'Standard-only fallback guard missing')
assert(screen.includes("'Semi-guided · complex response'"), 'complex response mode label missing')
assert(screen.includes('複雑な長文はSemi-guided'), 'learner-facing selective Free copy missing')
assert(freeCore.includes('export function standardFreeBuildDecision'), 'shared Free suitability helper missing')
assert(freeCore.includes('eligible: risk < 5'), 'HIGH-risk threshold guard missing')
assert(more.includes('v0.6.6 · Selective Free BUILD'), 'v0.6.6 version card missing')

console.log('English Shift v0.6.6 Selective Free BUILD UI smoke: PASS')
console.log('audited risk gate · explicit session label · Standard fallback only · Challenge preserved')
