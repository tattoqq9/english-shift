import fs from 'node:fs'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'))
assert(pkg.version === '0.6.3', `package version must be 0.6.3, got ${pkg.version}`)
assert(lock.version === '0.6.3', `package-lock version must be 0.6.3, got ${lock.version}`)
assert(lock.packages?.['']?.version === '0.6.3', 'package-lock root package version must be 0.6.3')

const atmosphere = fs.readFileSync('src/core/audioAtmosphere.ts', 'utf8')
const gameFeel = fs.readFileSync('src/core/gameFeel.ts', 'utf8')
const more = fs.readFileSync('src/screens/MoreScreen.tsx', 'utf8')
const shift = fs.readFileSync('src/components/ShiftExperience.tsx', 'utf8')
const build = fs.readFileSync('src/screens/Level2BuildScreen.tsx', 'utf8')
const app = fs.readFileSync('src/App.tsx', 'utf8')
const main = fs.readFileSync('src/main.tsx', 'utf8')

assert(atmosphere.includes('STORE_AUDIO_PROFILES'), 'store audio profiles missing')
for (let id = 1; id <= 8; id += 1) {
  assert(atmosphere.includes(`  ${id}: {`), `store audio profile ${id} missing`)
}
assert(atmosphere.includes('startStoreAtmosphere'), 'startStoreAtmosphere missing')
assert(atmosphere.includes('stopStoreAtmosphere'), 'stopStoreAtmosphere missing')
assert(atmosphere.includes('duckStoreAtmosphere'), 'SE ducking hook missing')
assert(atmosphere.includes('visibilitychange'), 'background-tab audio handling missing')
assert(gameFeel.includes('music: boolean'), 'Music setting type missing')
assert(gameFeel.includes('music: true'), 'Music default missing')
assert(gameFeel.includes('duckStoreAtmosphere'), 'Game Feel does not duck atmosphere around SE')
assert(more.includes('Music & ambience'), 'Music toggle missing in More')
assert(more.includes('Preview store atmosphere'), 'audio preview control missing')
assert(more.includes('v0.6.3 · Audio Atmosphere'), 'v0.6.3 version copy missing')
assert(shift.includes('startStoreAtmosphere(chapterId'), 'SELECT Shift atmosphere start missing')
assert(shift.includes('stopStoreAtmosphere'), 'SELECT Shift atmosphere stop missing')
assert(build.includes('startStoreAtmosphere(Math.ceil(day / 6)'), 'BUILD atmosphere start missing')
assert(build.includes('stopStoreAtmosphere'), 'BUILD atmosphere stop missing')
assert(app.includes('queuedAtmosphereStore'), 'auto-start atmosphere routing missing')
assert(app.includes('stopStoreAtmosphere'), 'navigation stop hook missing')
assert(main.includes("./styles/v063/audioAtmosphere.css"), 'v0.6.3 audio UI styles import missing')

const files = fs.readdirSync('.', { recursive: true }).map(String)
assert(!files.some((name) => /\.(mp3|wav|ogg|m4a|aac)$/i.test(name)), 'v0.6.3 must not add external audio assets')

// Audio atmosphere is presentation-only and must not become a learning state.
for (const forbidden of ['MASTERY_STORAGE_KEY', 'BUILD_PROGRESS_KEY', 'grammarRegistry', 'recordMasteryAttempt']) {
  assert(!atmosphere.includes(forbidden), `audio atmosphere must not reference ${forbidden}`)
}

console.log('English Shift v0.6.3 Audio Atmosphere smoke: PASS')
console.log('8 procedural store themes · subtle ambience · SE ducking · Music toggle · no external audio assets')
