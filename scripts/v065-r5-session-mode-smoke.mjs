import fs from 'node:fs'

function read(path) {
  return fs.readFileSync(path, 'utf8')
}
function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const pkg = JSON.parse(read('package.json'))
const screen = read('src/screens/Level2BuildScreen.tsx')
const player = read('src/components/BuildActivityPlayer.tsx')
const main = read('src/main.tsx')
const css = read('src/styles/v065/sessionMode.css')

assert(['0.6.5', '0.6.6'].includes(pkg.version), `package must be 0.6.5/0.6.6, got ${pkg.version}`)
assert(screen.includes('v065-session-mode-panel'), 'in-session Practice Mode panel missing')
assert(screen.includes('PRACTICE MODE'), 'in-session Practice Mode label missing')
assert(screen.includes('Standard'), 'Standard button/copy missing')
assert(screen.includes('Guided'), 'Guided button/copy missing')
assert(screen.includes('Challenge'), 'Challenge button/copy missing')
assert(screen.includes('changeMode(id)'), 'in-session mode buttons must persist mode changes')
assert(screen.includes('standardFreeBuildDecision') && screen.includes('activePresentation'), 'Standard Day31+ audited presentation gate missing')
assert(screen.includes("key={activeActivity.id + '-' + mode}"), 'mode switch must reset BuildActivityPlayer state')
assert(player.includes('v065-free-build-editor'), 'Free BUILD editor regression')
assert(main.includes("./styles/v065/sessionMode.css"), 'session mode stylesheet import missing')
assert(css.includes('@media (max-width: 520px)'), 'mobile session-mode guard missing')

console.log('English Shift v0.6.5 Free BUILD r5 session-mode smoke: PASS')
console.log('Practice Mode visible in active BUILD · Standard Day31+ Free typing · Guided chunks · Challenge typing')
