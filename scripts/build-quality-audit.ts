import { diagnoseBuild, assembleBuildSentence } from '../src/core/build.js'
import { level2BuildActivities } from '../src/data/level2BuildActivities.js'

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

const suspicious = [
  /^(right now|later today|at the moment)[.!?]?$/i,
  /\b(could|would|should|must|can|may|might|will) to\b/i,
  /\b(could|would|should|must|can|may|might) (has|had)\b/i,
  /\bif not of\b/i,
  /\bnot longer\b/i,
  /\bfor to\b/i,
  /\bthe (?:the|a|an)\b/i,
  /\b(for|to|with|without|from|at|in|on|by|about|of) (i|we|he|she|they)\b/i,
  /\b(bring|give|tell|show|ask|help|replace) (i|we|he|she|they)\b/i,
  /\b(do|does|did) (on|in|at|available|unavailable|possible|restarting)\b/i,
  /\b(this|that) two\b/i,
  /\b(we|they|he|she)['’]m\b/i,
  /\bcannot['’]t\b/i,
  /\[(?:missing|fallback) distractor/i,
]

const incompleteChunkTail = /\b(a|an|the|my|your|our|their|his|her|its)\s*[,.!?;:]?$/i
const internalSentenceBreak = /[.!?;][”']?\s+\S/
const allowedSlotLabels = new Set([
  'RESPONSE / OPENING', 'CONNECTOR', 'CONDITION / TIME', 'TAG QUESTION', 'QUESTION WORD / FRAME',
  'QUESTION FRAME', 'SUBJECT', 'AUXILIARY / VERB', 'ACTION', 'DETAIL', 'DETAIL / END', 'REPORT',
  'PASSIVE / STATE', 'QUESTION CORE', 'QUESTION DETAIL / END', 'SUBJECT / CORE', 'CORE MESSAGE',
])

let longestSentence = 0
let longestChunk = 0
let almostChecks = 0
let notQuiteChecks = 0
let structureMaps = 0
let distractorChecks = 0

for (const activity of level2BuildActivities) {
  const targetChunks = activity.targetChunkIds.map((id) => activity.chunks.find((chunk) => chunk.id === id)!)
  const distractors = activity.chunks.filter((chunk) => chunk.distractor)
  const targetTexts = new Set(targetChunks.map((chunk) => chunk.text.toLowerCase()))
  const distractorTexts = distractors.map((chunk) => chunk.text.toLowerCase())

  assert(activity.hintsJa?.length === 3, `${activity.id}: expected exactly 3 progressive hints`)
  assert(new Set(activity.hintsJa).size === 3, `${activity.id}: hints should be distinct`)
  assert(!activity.hintsJa.some((hint) => hint.includes(activity.targetSentence)), `${activity.id}: a hint reveals the full answer`)
  assert(activity.slotLabels?.length === activity.targetChunkIds.length, `${activity.id}: slot labels must match target chunk count`)
  assert(activity.slotLabels.every((label) => allowedSlotLabels.has(label)), `${activity.id}: unknown or generic slot label`)
  assert(activity.slotLabels.every((label) => activity.hintsJa![1].includes(`[${label}]`)), `${activity.id}: Hint 2 must mirror the Structure Map labels`)
  structureMaps += 1
  assert(distractors.length === 2, `${activity.id}: expected exactly two reviewed distractors`)
  assert(new Set(distractorTexts).size === distractorTexts.length, `${activity.id}: duplicate distractor text`)

  for (const chunk of targetChunks) {
    const words = chunk.text.trim().split(/\s+/).filter(Boolean).length
    longestChunk = Math.max(longestChunk, words)
    assert(words <= 8, `${activity.id}: target chunk too long (${words} words): ${chunk.text}`)
    assert(!incompleteChunkTail.test(chunk.text), `${activity.id}: target chunk ends mid-phrase: ${chunk.text}`)
    assert(!internalSentenceBreak.test(chunk.text), `${activity.id}: target chunk crosses a sentence boundary: ${chunk.text}`)
  }
  for (const chunk of distractors) {
    assert(!targetTexts.has(chunk.text.toLowerCase()), `${activity.id}: distractor duplicates target chunk: ${chunk.text}`)
    for (const pattern of suspicious) assert(!pattern.test(chunk.text), `${activity.id}: low-quality distractor “${chunk.text}” matched ${pattern}`)
    distractorChecks += 1
  }

  const sentenceWords = activity.targetSentence.trim().split(/\s+/).filter(Boolean).length
  longestSentence = Math.max(longestSentence, sentenceWords)
  assert(sentenceWords <= 30, `${activity.id}: model response is too long (${sentenceWords} words)`)
  assert(assembleBuildSentence(activity, activity.targetChunkIds) === activity.targetSentence, `${activity.id}: target assembly mismatch`)

  const swapped = [...activity.targetChunkIds]
  ;[swapped[0], swapped[1]] = [swapped[1], swapped[0]]
  const almost = diagnoseBuild(activity, swapped)
  assert(almost.check === 'almost', `${activity.id}: correct chunks in wrong order should be Almost`)
  assert(/[ぁ-んァ-ヶ一-龯]/.test(almost.feedback), `${activity.id}: Almost feedback should be Japanese`) 
  almostChecks += 1

  const distractorTrial = [activity.targetChunkIds[0], distractors[0].id]
  const notQuite = diagnoseBuild(activity, distractorTrial)
  assert(notQuite.check === 'not_quite', `${activity.id}: distractor use should be Not quite`)
  assert(/[ぁ-んァ-ヶ一-龯]/.test(notQuite.feedback), `${activity.id}: Not quite feedback should be Japanese`)
  notQuiteChecks += 1
}

console.log(`Level 2 quality audit PASS · activities=${level2BuildActivities.length} · progressive-hints=3/3 · structure-maps=${structureMaps} · reviewed-distractors=${distractorChecks} · longest-response=${longestSentence} words · longest-chunk=${longestChunk} words · almost=${almostChecks} · not-quite=${notQuiteChecks}`)
