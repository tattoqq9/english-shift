import fs from 'node:fs'

function read(path) {
  return fs.readFileSync(path, 'utf8')
}
function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const pkg = JSON.parse(read('package.json'))
const audio = read('src/core/audioAtmosphere.ts')
const build = read('src/screens/Level2BuildScreen.tsx')
const review = read('src/screens/ReviewScreen.tsx')
const app = read('src/App.tsx')

assert(pkg.version === '0.6.3', `package version must remain 0.6.3, got ${pkg.version}`)
assert(audio.includes("export type AtmosphereMode = 'select' | 'build' | 'review' | 'repair' | 'preview'"), 'adaptive atmosphere modes missing')
assert(audio.includes("build: { gain: 0.72, density: 0.72"), 'BUILD adaptive mix missing')
assert(audio.includes("review: { gain: 0.68, density: 0.52"), 'REVIEW adaptive mix missing')
assert(audio.includes('SLOW_VARIATIONS'), 'slow harmonic variation missing')
assert(audio.includes('scheduleStoreDetail'), 'store detail scheduler missing')
for (let id = 1; id <= 8; id += 1) {
  assert(audio.includes(`case ${id}:`), `store ${id} ambience detail missing`)
}
assert(audio.includes('current.baseGain * 0.22'), 'mode-aware SE ducking missing')
assert(build.includes("startStoreAtmosphere(Math.ceil(day / 6), window.localStorage, 'build')"), 'BUILD mode start missing')
assert(review.includes("startStoreAtmosphere(6, window.localStorage, 'review')"), 'REVIEW quiet atmosphere start missing')
assert(review.includes('stopStoreAtmosphere(180)'), 'REVIEW atmosphere stop missing')
assert(app.includes("next === 'build' ? 'build' : 'select'"), 'auto-launch mode routing missing')

console.log('English Shift v0.6.3 Audio Atmosphere tuning smoke: PASS')
console.log('adaptive mix SELECT/BUILD/REVIEW · 8 sparse non-verbal details · slow variation · mode-aware ducking')
