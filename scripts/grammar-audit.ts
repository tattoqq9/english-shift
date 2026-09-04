import type { Chapter1Activity, Chapter1Day } from '../src/core/chapter1.js'
import type { GrammarCoverageEntry, GrammarKey, GrammarRole, GrammarStatus, GrammarTier } from '../src/core/grammar.js'
import { grammarRegistry, grammarRegistryByKey, resolveLegacyGrammarLabel } from '../src/data/grammarRegistry.js'
import { activityGrammarOverrides, dayGrammarTargets, knownCommunicationLabels } from '../src/data/grammarSyllabus.js'
import { chapter1Activities, chapter1Days } from '../src/data/chapter1.js'
import { chapter2Activities, chapter2Days } from '../src/data/chapter2.js'
import { chapter3Activities, chapter3Days } from '../src/data/chapter3.js'
import { chapter4Activities, chapter4Days } from '../src/data/chapter4.js'
import { chapter5Activities, chapter5Days } from '../src/data/chapter5.js'
import { chapter6Activities, chapter6Days } from '../src/data/chapter6.js'
import { chapter7Activities, chapter7Days } from '../src/data/chapter7.js'
import { chapter8Activities, chapter8Days } from '../src/data/chapter8.js'
import { examActivities, examModules } from '../src/data/postgameActivities.js'

interface Annotation {
  activityId: string
  day: number
  key: GrammarKey
  role: GrammarRole
  source: 'explicit' | 'legacy'
}

const allActivities: Chapter1Activity[] = [
  ...chapter1Activities, ...chapter2Activities, ...chapter3Activities, ...chapter4Activities,
  ...chapter5Activities, ...chapter6Activities, ...chapter7Activities, ...chapter8Activities,
]
const allDays: Chapter1Day[] = [
  ...chapter1Days, ...chapter2Days, ...chapter3Days, ...chapter4Days,
  ...chapter5Days, ...chapter6Days, ...chapter7Days, ...chapter8Days,
]
const dayByActivityId = new Map<string, number>()
for (const day of allDays) for (const id of day.activityIds) dayByActivityId.set(id, day.day)

const annotations: Annotation[] = []
const unknownLegacyLabels = new Set<string>()
const communicationLabels = new Set<string>()

function overrideRole(activityId: string, key: GrammarKey): GrammarRole | undefined {
  const item = activityGrammarOverrides[activityId]
  if (!item) return undefined
  if (item.target?.includes(key)) return 'target'
  if (item.review?.includes(key)) return 'review'
  if (item.exposure?.includes(key)) return 'exposure'
  return undefined
}

for (const activity of allActivities) {
  const day = dayByActivityId.get(activity.id)
  if (!day) throw new Error(`No day mapping for ${activity.id}`)
  const seen = new Set<GrammarKey>()

  if (activity.grammarTargets?.length) {
    for (const item of activity.grammarTargets) {
      annotations.push({ activityId: activity.id, day, key: item.key, role: item.role, source: 'explicit' })
      seen.add(item.key)
    }
  }

  for (const label of activity.grammar) {
    const mapped = resolveLegacyGrammarLabel(label)
    if (mapped.length === 0) {
      if (knownCommunicationLabels.has(label)) communicationLabels.add(label)
      else unknownLegacyLabels.add(label)
      continue
    }
    for (const key of mapped) {
      if (seen.has(key)) continue
      const explicitRole = overrideRole(activity.id, key)
      const role = explicitRole ?? (dayGrammarTargets[day]?.includes(key) ? 'target' : 'review')
      annotations.push({ activityId: activity.id, day, key, role, source: 'legacy' })
      seen.add(key)
    }
  }
}

function statusFor(key: GrammarKey, targetCount: number, reviewCount: number, exposureCount: number): GrammarStatus {
  const concept = grammarRegistryByKey.get(key)!
  const total = targetCount + reviewCount + exposureCount
  if (!concept.level1Expected) return total > 0 ? 'preview' : 'missing'
  const targetOk = targetCount >= concept.minimumTargets
  const reviewOk = reviewCount >= concept.minimumReviews
  if (targetOk && reviewOk) return 'complete'
  return total > 0 ? 'partial' : 'missing'
}

const coverage: GrammarCoverageEntry[] = grammarRegistry.map((concept) => {
  const rows = annotations.filter((row) => row.key === concept.key)
  const targetCount = rows.filter((row) => row.role === 'target').length
  const reviewCount = rows.filter((row) => row.role === 'review').length
  const exposureCount = rows.filter((row) => row.role === 'exposure').length
  const days = rows.map((row) => row.day)
  return {
    key: concept.key,
    tier: concept.tier,
    targetCount,
    reviewCount,
    exposureCount,
    firstDay: days.length ? Math.min(...days) : undefined,
    lastDay: days.length ? Math.max(...days) : undefined,
    status: statusFor(concept.key, targetCount, reviewCount, exposureCount),
  }
})

const tiers: GrammarTier[] = ['ES-G1', 'ES-G2', 'ES-G3']
const tierSummary = Object.fromEntries(tiers.map((tier) => {
  const concepts = grammarRegistry.filter((item) => item.tier === tier)
  const rows = coverage.filter((item) => item.tier === tier)
  const expected = concepts.filter((item) => item.level1Expected)
  const expectedKeys = new Set(expected.map((item) => item.key))
  const complete = rows.filter((item) => expectedKeys.has(item.key) && item.status === 'complete').length
  const partial = rows.filter((item) => expectedKeys.has(item.key) && item.status === 'partial').length
  const missing = rows.filter((item) => expectedKeys.has(item.key) && item.status === 'missing').length
  const preview = rows.filter((item) => item.status === 'preview').length
  const touched = rows.filter((item) => item.targetCount + item.reviewCount + item.exposureCount > 0).length
  return [tier, { total: concepts.length, expected: expected.length, complete, partial, missing, preview, touched }]
}))

const noReview = coverage.filter((row) => {
  const concept = grammarRegistryByKey.get(row.key)!
  return concept.level1Expected && row.targetCount > 0 && row.reviewCount === 0
})

const report = {
  version: '0.4.2',
  generatedAt: new Date().toISOString(),
  activities: allActivities.length,
  shifts: allDays.length,
  registryConcepts: grammarRegistry.length,
  annotations: annotations.length,
  tierSummary,
  coverage,
  unknownLegacyLabels: [...unknownLegacyLabels].sort(),
  communicationLabels: [...communicationLabels].sort(),
  targetWithoutReview: noReview.map((item) => item.key),
}

function pct(a: number, b: number) { return b ? `${((a / b) * 100).toFixed(1)}%` : '—' }
const md: string[] = []
md.push('# English Shift Grammar Audit — v0.4.3')
md.push('')
md.push(`- Activities: **${allActivities.length}**`)
md.push(`- Shifts: **${allDays.length}**`)
md.push(`- Canonical concepts: **${grammarRegistry.length}**`)
md.push(`- Canonical annotations inferred/declared: **${annotations.length}**`)
md.push('')
md.push('## Tier summary')
md.push('')
md.push('|Tier|Registry|Level 1 expected|Complete|Partial|Missing|Current coverage|Preview/touched|')
md.push('|---|---:|---:|---:|---:|---:|---:|---:|')
for (const tier of tiers) {
  const s = tierSummary[tier] as { total: number; expected: number; complete: number; partial: number; missing: number; preview: number; touched: number }
  md.push(`|${tier}|${s.total}|${s.expected}|${s.complete}|${s.partial}|${s.missing}|${pct(s.complete, s.expected)}|${tier === 'ES-G3' ? s.touched : s.preview}|`)
}
md.push('')
md.push('## Gaps / partial targets')
md.push('')
md.push('|Key|Tier|Status|Target|Review|Exposure|First Day|Note|')
md.push('|---|---|---|---:|---:|---:|---:|---|')
for (const row of coverage.filter((item) => item.status === 'missing' || item.status === 'partial')) {
  const c = grammarRegistryByKey.get(row.key)!
  if (!c.level1Expected && c.tier === 'ES-G3') continue
  md.push(`|${row.key}|${row.tier}|${row.status}|${row.targetCount}|${row.reviewCount}|${row.exposureCount}|${row.firstDay ?? ''}|${c.note ?? ''}|`)
}
md.push('')
md.push('## ES-G3 postgame')
md.push('')
const g3 = coverage.filter((item) => item.tier === 'ES-G3')
md.push(`Level 1 currently touches **${g3.filter((item) => item.targetCount + item.reviewCount + item.exposureCount > 0).length}/${g3.length}** ES-G3 concepts. Postgame target is **100%**.`)
md.push('')
md.push('|Key|Current status|Current occurrences|Audience|')
md.push('|---|---|---:|---|')
for (const row of g3) {
  const c = grammarRegistryByKey.get(row.key)!
  md.push(`|${row.key}|${row.status}|${row.targetCount + row.reviewCount + row.exposureCount}|${c.audiences.join(', ')}|`)
}
md.push('')
md.push('## Migration warnings')
md.push('')
md.push(`Legacy free-form labels not yet classified: **${unknownLegacyLabels.size}**`)
for (const label of [...unknownLegacyLabels].sort()) md.push(`- \`${label}\``)
md.push('')
md.push(`Grammar targets with no later/current review annotation: **${noReview.length}**`)
for (const row of noReview) md.push(`- \`${row.key}\``)
md.push('')
md.push('> Coverage means the concept has a deliberate target activity. Review density is reported separately and will become stricter before Level 2.')

console.log('=== English Shift Grammar Audit v0.4.6 ===')
console.log(`Activities=${allActivities.length} Shifts=${allDays.length} Registry=${grammarRegistry.length}`)
for (const tier of tiers) {
  const s = tierSummary[tier] as { total: number; expected: number; complete: number; partial: number; missing: number; touched: number }
  console.log(`${tier}: complete ${s.complete}/${s.expected} (${pct(s.complete, s.expected)}) partial=${s.partial} missing=${s.missing} touched=${s.touched}/${s.total}`)
}
console.log(`Unclassified legacy labels: ${unknownLegacyLabels.size}`)
for (const label of [...unknownLegacyLabels].sort()) console.log(`  ? ${label}`)
console.log(`Targets without review: ${noReview.length}`)
if (noReview.length) console.log(`No-review keys: ${noReview.map((item) => item.key).join(', ')}`)
for (const tier of ['ES-G1', 'ES-G2'] as const) {
  const gaps = coverage.filter((row) => row.tier === tier && row.status !== 'complete')
  if (gaps.length) console.log(`${tier} gaps: ${gaps.map((row) => `${row.key}:${row.status}`).join(', ')}`)
}

// v0.3.8 completion milestone: Level 1 keeps 144 activities and requires ES-G1/G2 100% target coverage.
if (allActivities.length !== 144) throw new Error(`Expected 144 Level 1 activities, got ${allActivities.length}`)
if (allDays.length !== 48) throw new Error(`Expected 48 shifts, got ${allDays.length}`)
if (new Set(grammarRegistry.map((item) => item.key)).size !== grammarRegistry.length) throw new Error('Duplicate grammar keys')
for (const tier of ['ES-G1', 'ES-G2'] as const) {
  const summary = tierSummary[tier] as { expected: number; complete: number; partial: number; missing: number }
  if (summary.complete !== summary.expected || summary.partial !== 0 || summary.missing !== 0) {
    throw new Error(`${tier} must be 100% complete in v0.3.8`)
  }
}


const postgameTargets = new Map<GrammarKey, number>()
for (const activity of examActivities) {
  for (const ref of activity.grammarTargets ?? []) {
    if (ref.role === 'target') postgameTargets.set(ref.key, (postgameTargets.get(ref.key) ?? 0) + 1)
  }
}
const postgameExpected = grammarRegistry.filter((item) => item.tier === 'ES-G3' && item.postgameExpected)
const postgameComplete = postgameExpected.filter((item) => (postgameTargets.get(item.key) ?? 0) >= item.minimumTargets)
const postgameMissing = postgameExpected.filter((item) => !postgameComplete.includes(item))
console.log(`ES-G3 Postgame: complete ${postgameComplete.length}/${postgameExpected.length} (${pct(postgameComplete.length, postgameExpected.length)}) modules=${examModules.length} activities=${examActivities.length}`)
if (postgameMissing.length) console.log(`ES-G3 postgame gaps: ${postgameMissing.map((item) => item.key).join(', ')}`)
if (postgameComplete.length !== postgameExpected.length) throw new Error('ES-G3 Postgame must target 100% of expected concepts')
if (examModules.length !== 6 || examActivities.length !== 18) throw new Error('Exam Shift expected 6 modules / 18 activities')
