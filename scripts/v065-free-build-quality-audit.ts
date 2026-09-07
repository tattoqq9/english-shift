import { freeBuildTokens, scoreFreeBuild } from '../src/core/freeBuild.js'
import { level2BuildActivities } from '../src/data/level2BuildActivities.js'

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'

type AuditRow = {
  id: string
  day: number
  activityNo: number
  title: string
  words: number
  sentences: number
  clauses: number
  standardFree: boolean
  risk: number
  level: RiskLevel
  flags: string[]
}

const contractions: Array<[RegExp, string]> = [
  [/\bI'm\b/gi, 'I am'],
  [/\byou're\b/gi, 'you are'],
  [/\bwe're\b/gi, 'we are'],
  [/\bthey're\b/gi, 'they are'],
  [/\bI've\b/gi, 'I have'],
  [/\byou've\b/gi, 'you have'],
  [/\bwe've\b/gi, 'we have'],
  [/\bthey've\b/gi, 'they have'],
  [/\bI'll\b/gi, 'I will'],
  [/\byou'll\b/gi, 'you will'],
  [/\bhe'll\b/gi, 'he will'],
  [/\bshe'll\b/gi, 'she will'],
  [/\bit'll\b/gi, 'it will'],
  [/\bwe'll\b/gi, 'we will'],
  [/\bthey'll\b/gi, 'they will'],
  [/\bcan't\b/gi, 'can not'],
  [/\bwon't\b/gi, 'will not'],
  [/\bdon't\b/gi, 'do not'],
  [/\bdoesn't\b/gi, 'does not'],
  [/\bdidn't\b/gi, 'did not'],
  [/\bisn't\b/gi, 'is not'],
  [/\baren't\b/gi, 'are not'],
  [/\bwasn't\b/gi, 'was not'],
  [/\bweren't\b/gi, 'were not'],
  [/\bhaven't\b/gi, 'have not'],
  [/\bhasn't\b/gi, 'has not'],
  [/\bhadn't\b/gi, 'had not'],
  [/\bcouldn't\b/gi, 'could not'],
  [/\bwouldn't\b/gi, 'would not'],
  [/\bshouldn't\b/gi, 'should not'],
  [/\bmustn't\b/gi, 'must not'],
]

const MODALS = new Set(['can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must'])

function expandKnownContractions(text: string) {
  let result = text.replace(/[’‘‛`´]/g, "'")
  for (const [pattern, replacement] of contractions) result = result.replace(pattern, replacement)
  return result
}

function punctuationInsensitiveVariant(text: string) {
  return text
    .toUpperCase()
    .replace(/[.!?,;:]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function typoVariant(text: string) {
  const matches = [...text.matchAll(/[A-Za-z]{5,}/g)]
  const candidate = matches.sort((a, b) => (b[0]?.length ?? 0) - (a[0]?.length ?? 0))[0]
  if (!candidate || candidate.index == null) return null
  const word = candidate[0]
  const offset = Math.max(1, Math.min(word.length - 2, Math.floor(word.length / 2)))
  const current = word[offset].toLowerCase()
  const replacement = current === 'x' ? 'z' : 'x'
  const mutated = word.slice(0, offset) + replacement + word.slice(offset + 1)
  return text.slice(0, candidate.index) + mutated + text.slice(candidate.index + word.length)
}

function sentenceCount(text: string) {
  const pieces = text.split(/[.!?]+(?=\s|$)/).map((item) => item.trim()).filter(Boolean)
  return Math.max(1, pieces.length)
}

function clauseCount(text: string) {
  const matches = text.toLowerCase().match(/\b(and|but|so|because|if|when|while|although|though|whether|that|which|who|where|before|after|until|unless|therefore|however)\b/g)
  return matches?.length ?? 0
}

function containsNumberOrCode(text: string) {
  return /\b\d[\d:-]*\b/.test(text) || /\b[A-Z]-?\d{2,}\b/.test(text)
}

function optionalDiscourseOpening(text: string) {
  return /^(yes|no|okay|sure|of course|i'm sorry|i am sorry|let me|certainly)[,.\s]/i.test(
    text.replace(/[’‘‛`´]/g, "'"),
  )
}

function riskFor(activity: (typeof level2BuildActivities)[number]): AuditRow {
  const words = freeBuildTokens(activity.targetSentence).length
  const sentences = sentenceCount(activity.targetSentence)
  const clauses = clauseCount(activity.targetSentence)
  const flags: string[] = []
  let risk = 0

  if (words >= 24) { risk += 4; flags.push('very-long>=24w') }
  else if (words >= 18) { risk += 2; flags.push('long>=18w') }

  if (sentences >= 3) { risk += 5; flags.push('3+-sentences') }
  else if (sentences === 2) { risk += 3; flags.push('multi-sentence') }

  if (clauses >= 3) { risk += 2; flags.push('3+-clause-markers') }
  else if (clauses === 2) { risk += 1; flags.push('2-clause-markers') }

  if (containsNumberOrCode(activity.targetSentence)) { risk += 2; flags.push('number/code') }
  if (/[;:]/.test(activity.targetSentence)) { risk += 1; flags.push('semicolon/colon') }
  if (optionalDiscourseOpening(activity.targetSentence)) { risk += 1; flags.push('optional-opening') }

  const hasTargetGrammar = activity.grammarTargets.some((ref) => ref.role === 'target')
  if (!hasTargetGrammar) { risk += 1; flags.push('no-explicit-target-grammar') }

  const level: RiskLevel = risk >= 5 ? 'HIGH' : risk >= 3 ? 'MEDIUM' : 'LOW'

  return {
    id: activity.id,
    day: activity.day,
    activityNo: activity.activityNo,
    title: activity.title,
    words,
    sentences,
    clauses,
    standardFree: activity.day >= 31,
    risk,
    level,
    flags,
  }
}

assert(level2BuildActivities.length === 144, `Expected 144 BUILD activities, got ${level2BuildActivities.length}`)

const standardFreeActivities = level2BuildActivities.filter((activity) => activity.day >= 31)
assert(standardFreeActivities.length === 54, `Expected 54 Standard Free BUILD activities (Day31-48), got ${standardFreeActivities.length}`)

let exactCorrect = 0
let punctuationCorrect = 0
let contractionCases = 0
let contractionCorrect = 0
let typoCases = 0
let typoAlmost = 0
let typoNotCorrect = 0
let emptySafe = 0
let negationCases = 0
let negationSafe = 0
let modalCases = 0
let modalSafe = 0

for (const activity of level2BuildActivities) {
  const target = activity.targetSentence

  const exact = scoreFreeBuild(activity, target, 1, 0)
  assert(exact.exact && exact.check === 'correct', `${activity.id}: target sentence must be Correct`)
  exactCorrect += 1

  const punctuationVariant = punctuationInsensitiveVariant(target)
  const punctuation = scoreFreeBuild(activity, punctuationVariant, 1, 0)
  assert(punctuation.exact && punctuation.check === 'correct', `${activity.id}: case/punctuation-only variant must be Correct`)
  punctuationCorrect += 1

  const expanded = expandKnownContractions(target)
  if (expanded !== target.replace(/[’‘‛`´]/g, "'")) {
    contractionCases += 1
    const contraction = scoreFreeBuild(activity, expanded, 1, 0)
    assert(contraction.exact && contraction.check === 'correct', `${activity.id}: known contraction expansion must be Correct`)
    contractionCorrect += 1
  }

  const typo = typoVariant(target)
  if (typo && typo !== target) {
    typoCases += 1
    const result = scoreFreeBuild(activity, typo, 1, 0)
    assert(!result.exact && result.check !== 'correct', `${activity.id}: one-letter typo must never be Correct`)
    typoNotCorrect += 1
    if (result.check === 'almost') typoAlmost += 1
  }

  const empty = scoreFreeBuild(activity, '', 1, 0)
  assert(!empty.exact && empty.check !== 'correct', `${activity.id}: empty input must not be Correct`)
  emptySafe += 1

  const normalizedTokens = freeBuildTokens(target)

  if (normalizedTokens.includes('not')) {
    negationCases += 1
    const withoutNot = normalizedTokens.filter((token) => token !== 'not').join(' ')
    const result = scoreFreeBuild(activity, withoutNot, 1, 0)
    assert(!result.exact && result.check === 'not_quite', `${activity.id}: negation reversal must be Not quite`)
    negationSafe += 1
  }

  const targetModals = [...new Set(normalizedTokens.filter((token) => MODALS.has(token)))]
  if (targetModals.length === 1) {
    modalCases += 1
    const original = targetModals[0]
    const replacement = original === 'should' ? 'could' : 'should'
    let changed = false
    const variant = normalizedTokens.map((token) => {
      if (!changed && token === original) {
        changed = true
        return replacement
      }
      return token
    }).join(' ')
    const result = scoreFreeBuild(activity, variant, 1, 0)
    assert(!result.exact && result.check === 'not_quite', `${activity.id}: modal meaning change must be Not quite`)
    modalSafe += 1
  }
}

const rows = level2BuildActivities.map(riskFor)
const high = rows.filter((row) => row.level === 'HIGH')
const medium = rows.filter((row) => row.level === 'MEDIUM')
const low = rows.filter((row) => row.level === 'LOW')
const standardHigh = high.filter((row) => row.standardFree)
const standardMedium = medium.filter((row) => row.standardFree)
const challengeOnlyHigh = high.filter((row) => !row.standardFree)

const typoAlmostRate = typoCases ? Math.round((typoAlmost / typoCases) * 100) : 100

console.log('')
console.log('=== English Shift v0.6.5 Free BUILD Quality Audit ===')
console.log(`Activities                 : ${level2BuildActivities.length}`)
console.log(`Standard Free (Day31-48)   : ${standardFreeActivities.length}`)
console.log(`Challenge-only Free (1-30) : ${level2BuildActivities.length - standardFreeActivities.length}`)
console.log('')
console.log('Deterministic scoring safety')
console.log(`  target -> Correct              ${exactCorrect}/${level2BuildActivities.length}`)
console.log(`  case/punctuation -> Correct    ${punctuationCorrect}/${level2BuildActivities.length}`)
console.log(`  contraction equivalence        ${contractionCorrect}/${contractionCases}`)
console.log(`  typo never -> Correct          ${typoNotCorrect}/${typoCases}`)
console.log(`  typo -> Almost coverage        ${typoAlmost}/${typoCases} (${typoAlmostRate}%)`)
console.log(`  empty input safe               ${emptySafe}/${level2BuildActivities.length}`)
console.log(`  negation reversal -> Not quite ${negationSafe}/${negationCases}`)
console.log(`  modal change -> Not quite      ${modalSafe}/${modalCases}`)
console.log('')
console.log('Free-typing content risk')
console.log(`  HIGH   ${high.length}  (Standard Free: ${standardHigh.length}, Challenge-only: ${challengeOnlyHigh.length})`)
console.log(`  MEDIUM ${medium.length}  (Standard Free: ${standardMedium.length})`)
console.log(`  LOW    ${low.length}`)
const standardDefaultFree = rows.filter((row) => row.standardFree && row.risk < 5)
const standardDefaultAssisted = rows.filter((row) => row.standardFree && row.risk >= 5)
console.log('')
console.log('v0.6.6 Standard default policy')
console.log(`  Free typing               ${standardDefaultFree.length}/54`)
console.log(`  Semi-guided complex       ${standardDefaultAssisted.length}/54`)

console.log('')
console.log('Priority manual review (HIGH first, then MEDIUM; max 40)')
console.log('risk | scope | activity | words | flags | title')

const priority = [...rows]
  .filter((row) => row.level !== 'LOW')
  .sort((a, b) => b.risk - a.risk || Number(b.standardFree) - Number(a.standardFree) || a.day - b.day || a.activityNo - b.activityNo)
  .slice(0, 40)

for (const row of priority) {
  const scope = row.standardFree ? 'STANDARD' : 'CHALLENGE'
  console.log(
    `${String(row.risk).padStart(2)} | ${scope.padEnd(9)} | Day ${String(row.day).padStart(2)} A${row.activityNo} ${row.id} | ${String(row.words).padStart(2)}w | ${row.flags.join(', ') || '-'} | ${row.title}`,
  )
}

console.log('')
console.log('Interpretation')
console.log('- HIGH: manually review whether one fixed model answer is too strict for free typing; add only curated alternatives if needed.')
console.log('- MEDIUM: spot-check on Android and inspect likely natural paraphrases.')
console.log('- LOW: deterministic scorer is structurally suitable; still keep curriculum review.')
console.log('- Risk flags are review signals, not automatic content errors.')
console.log('')
console.log('Free BUILD Quality Audit: PASS')
