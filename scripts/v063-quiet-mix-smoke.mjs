import fs from 'node:fs'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const audio = fs.readFileSync('src/core/audioAtmosphere.ts', 'utf8')
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))

assert(pkg.version === '0.6.3', `package version must remain 0.6.3, got ${pkg.version}`)

const checks = [
  ["SELECT", "select: { gain: 0.72, density: 0.80, detail: 0.75"],
  ["BUILD", "build: { gain: 0.55, density: 0.58, detail: 0.48"],
  ["REVIEW", "review: { gain: 0.48, density: 0.42, detail: 0.30"],
  ["REPAIR", "repair: { gain: 0.62, density: 0.65, detail: 0.55"],
  ["PREVIEW", "preview: { gain: 1, density: 1, detail: 1"],
]

for (const [label, token] of checks) {
  assert(audio.includes(token), `${label} Quiet Mix missing`)
}

assert(audio.includes('current.baseGain * 0.22'), 'SE ducking must remain mode-aware')
assert(audio.includes('scheduleStoreDetail'), 'store ambience details must remain enabled')
assert(audio.includes('SLOW_VARIATIONS'), 'slow variation must remain enabled')

console.log('English Shift v0.6.3 Quiet Mix smoke: PASS')
console.log('SELECT=0.72 · BUILD=0.55 · REPAIR=0.62 · REVIEW=0.48 · preview reference=1.00')
