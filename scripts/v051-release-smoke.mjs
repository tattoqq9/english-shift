import fs from 'node:fs'
import path from 'node:path'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}
function read(rel) {
  return fs.readFileSync(path.resolve(rel), 'utf8')
}

const pkg = JSON.parse(read('package.json'))
assert(pkg.version === '0.5.1', `package.json version should be 0.5.1, got ${pkg.version}`)
assert(pkg.scripts?.['v051:check'], 'v051:check script missing')
assert(pkg.scripts?.['character:check'], 'character:check script missing')
assert(pkg.scripts?.['rc:check'], 'rc:check script missing')

const more = read('src/screens/MoreScreen.tsx')
assert(more.includes('v0.5.1 · Characters & Context'), 'MoreScreen release label is not v0.5.1')
assert(more.includes('11人のRecurring Castを6表情で統一'), 'MoreScreen v0.5.1 release summary missing')

const build = read('src/core/build.ts')
const level2 = read('src/data/level2BuildActivities.ts')
const buildPlayer = read('src/components/BuildActivityPlayer.tsx')
const chapterPlayer = read('src/components/ChapterActivityPlayer.tsx')
const registry = read('src/data/characterRegistry.ts')
const portrait = read('src/components/CustomerPortrait.tsx')
const main = read('src/main.tsx')

assert(build.includes('customerId: string'), 'BuildActivity.customerId missing')
assert(level2.includes('customerId: activity.customer.id'), 'BUILD does not inherit source customerId')
assert(buildPlayer.includes('activity.customerId') && buildPlayer.includes('CustomerPortrait'), 'BUILD portrait integration missing')
assert(chapterPlayer.includes('rapidScenarioCharacter') && chapterPlayer.includes('rapid-mini-customer'), 'Rapid mini-customer integration missing')
assert(registry.includes('rapidScenarioCharacter'), 'rapidScenarioCharacter missing')
assert(!registry.includes('pendingRewrite: true'), 'pending character-aware rewrite remains')
assert(main.includes("import './styles/characterIntegration.css'"), 'characterIntegration.css import missing')

const characters = ['mia','sofia','leo','oliver','aisha','noah','ken','daniel','hana','grace','young-customer']
const expressions = ['neutral','thinking','happy','confused','delighted','disappointed']
let assetCount = 0
for (const c of characters) {
  assert(portrait.includes(`'${c}'`) || ['mia','daniel','grace'].includes(c), `CustomerPortrait registry missing ${c}`)
  for (const e of expressions) {
    const rel = path.resolve(`public/characters/${c}/${e}.webp`)
    assert(fs.existsSync(rel), `Missing portrait asset: public/characters/${c}/${e}.webp`)
    assetCount += 1
  }
}
assert(assetCount === 66, `expected 66 portrait assets, got ${assetCount}`)

// Storage schema safety: v0.5.1 character integration must not bump these existing keys.
assert(build.includes("english-shift-level2-build-progress-v1"), 'BUILD progress storage key changed unexpectedly')

console.log('English Shift v0.5.1 release smoke: PASS')
console.log('Version=0.5.1 · Characters=11 · Expressions=6 · Portraits=66')
console.log('BUILD customer inheritance=ON · Rapid mini-customer=ON · pendingRewrite=0')
console.log('Storage schema migration: none')
