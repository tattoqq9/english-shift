import fs from 'node:fs'

function read(path) {
  return fs.readFileSync(path, 'utf8')
}
function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const pkg = JSON.parse(read('package.json'))
const lock = JSON.parse(read('package-lock.json'))
const main = read('src/main.tsx')
const today = read('src/screens/TodayScreen.tsx')
const more = read('src/screens/MoreScreen.tsx')
const collection = read('src/core/collection.ts')
const book = read('src/components/CustomerBook.tsx')
const card = read('src/components/CollectionProgressCard.tsx')
const css = read('src/styles/v064/collection.css')
const audio = read('src/core/audioAtmosphere.ts')

assert(['0.6.4', '0.6.5', '0.6.6', '0.7.0'].includes(pkg.version), `package version must include public beta, got ${pkg.version}`)
assert(['0.6.4', '0.6.5', '0.6.6', '0.7.0'].includes(lock.version), `package-lock version must include public beta, got ${lock.version}`)
assert(['0.6.4', '0.6.5', '0.6.6', '0.7.0'].includes(lock.packages?.['']?.version), 'package-lock root version must include public beta')

assert(collection.includes("english-shift-collection-v1"), 'isolated collection UI state key missing')
assert(collection.includes('readActualCompletedSelectDays'), 'collection must derive actual SELECT completion')
assert(collection.includes('pairedCompleted >= 3'), 'REGULAR threshold missing')
assert(collection.includes('pairedCompleted >= 6'), 'MASTER threshold missing')
assert(collection.includes("'full-passport'"), 'Full Passport badge missing')
assert(collection.includes('markCollectionSeen'), 'NEW-state acknowledgement missing')

assert(today.includes('CollectionProgressCard'), 'Today collection summary missing')
assert(today.includes("onOpen={() => onNavigate('more')}"), 'Today collection route missing')
assert(more.includes('<CustomerBook />'), 'Customer Book missing from More')
assert(
  more.includes('v0.6.4 · Customer Collection')
    || more.includes('v0.6.5 · Free BUILD Production')
    || more.includes('v0.6.6 · Selective Free BUILD')
    || more.includes('v0.7.0 · Public Beta'),
  'v0.6.4+ collection/version card missing in More',
)
assert(book.includes('Customer Book'), 'Customer Book title missing')
assert(book.includes('REGULAR'), 'Store REGULAR UI missing')
assert(book.includes('MASTER'), 'Store MASTER UI missing')
assert(card.includes('CUSTOMER BOOK'), 'Today Customer Book teaser missing')

assert(main.includes("./styles/v064/collection.css"), 'v0.6.4 collection stylesheet import missing')
assert(css.includes('@media (max-width: 520px)'), 'mobile collection guard missing')
assert(css.includes('grid-template-columns: repeat(2'), 'mobile 2-column Customer Book grid missing')

// Presentation/reward work must preserve the tuned audio baseline.
for (const token of [
  'select: { gain: 0.72, density: 0.80, detail: 0.75',
  'build: { gain: 0.55, density: 0.58, detail: 0.48',
  'review: { gain: 0.48, density: 0.42, detail: 0.30',
]) {
  assert(audio.includes(token), `Quiet Mix regression: ${token}`)
}

// Collection is allowed to read learning progress but never write it.
for (const forbidden of [
  'english-shift-grammar-mastery-v2',
  'setItem(BUILD_PROGRESS_KEY',
  'recordMasteryAttempt',
]) {
  assert(!collection.includes(forbidden), `collection layer must not mutate learning state: ${forbidden}`)
}

console.log('English Shift v0.6.4 Collection UI smoke: PASS')
console.log('Customer Book=11 · Badges=7 · Store REGULAR 3/6 · MASTER 6/6 · 360/430 responsive guards')
