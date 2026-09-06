import fs from 'node:fs'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'))
const main = fs.readFileSync('src/main.tsx', 'utf8')
const player = fs.readFileSync('src/components/BuildActivityPlayer.tsx', 'utf8')
const css = fs.readFileSync('src/styles/v062/buildReadability.css', 'utf8')

assert(['0.6.1', '0.6.2', '0.6.3'].includes(pkg.version), `unexpected package version ${pkg.version}`)
assert(lock.version === pkg.version, `package-lock version ${lock.version} must match package version ${pkg.version}`)
assert(lock.packages?.['']?.version === pkg.version, 'package-lock root package version must match package version')
assert(main.includes("import './styles/v062/buildReadability.css'"), 'BUILD readability CSS import missing')
assert(player.includes('build-opening-card build-opening-card-readable'), 'dedicated readable class missing')
assert(player.includes('build-opening-speaker'), 'CUSTOMER SAYS DOM label missing')
assert(player.includes('CUSTOMER SAYS'), 'CUSTOMER SAYS visible label missing')
assert(css.includes('.build-opening-card.build-opening-card-readable'), 'high-specificity readable selector missing')
assert(css.includes('background: linear-gradient(145deg, #fffef9 0%, #fff5e4 100%) !important'), 'light speech surface override missing')
assert(css.includes('color: #27241f !important'), 'dark readable text override missing')

const importLines = main.split(/\r?\n/).filter((line) => line.startsWith("import './styles/"))
assert(importLines.at(-1) === "import './styles/v062/buildReadability.css'", 'readability CSS must be the last stylesheet import')

console.log('English Shift v0.6.2a-r3 BUILD readability smoke: PASS')
console.log(`Version metadata synchronized at ${pkg.version}.`)
console.log('Dedicated DOM class + final stylesheet + forced light surface verified.')
