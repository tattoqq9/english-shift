import {
  diagnoseFreeBuild,
  freeBuildSignature,
  normalizeFreeBuildText,
  scoreFreeBuild,
} from '../src/core/freeBuild.js'
import { level2BuildActivities } from '../src/data/level2BuildActivities.js'

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

const sample = level2BuildActivities.find((activity) => activity.day === 31)
  ?? level2BuildActivities[0]
assert(Boolean(sample), 'Level 2 sample activity missing')

assert(
  normalizeFreeBuildText("I'm ready.") === normalizeFreeBuildText('I am ready'),
  'contraction/case/punctuation normalization failed',
)
assert(
  freeBuildSignature('  Could you help me? ') === freeBuildSignature('could you help me'),
  'signature normalization failed',
)

const target = sample.targetSentence
const exact = scoreFreeBuild(sample, target.toUpperCase(), 1, 0)
assert(exact.exact === true, 'case-only difference must be Correct')
assert(exact.check === 'correct', 'exact target must be Correct')
assert(exact.score === 100, 'first try exact target must score 100')

const punctuation = scoreFreeBuild(sample, `${target.replace(/[.!?]+$/g, '')}!!!`, 1, 0)
assert(punctuation.exact === true, 'terminal punctuation difference must be Correct')

// Create deterministic diagnostic samples rather than depending on a specific curriculum sentence.
const diagnosticActivity = {
  ...sample,
  targetSentence: "Could you tell me whether this model is available?",
}

const contractionActivity = {
  ...sample,
  targetSentence: "I'm sorry, but we don't have that size.",
}
assert(
  scoreFreeBuild(contractionActivity, 'I am sorry but we do not have that size', 1, 0).exact === true,
  'common contractions must be equivalently Correct',
)

const typo = diagnoseFreeBuild(
  diagnosticActivity,
  'Could you tell me wheter this model is available?',
)
assert(typo.check === 'almost', `single typo should be Almost, got ${typo.check}`)

const missing = diagnoseFreeBuild(
  diagnosticActivity,
  'Could you tell me this model available?',
)
assert(missing.check !== 'correct', 'missing grammar words must not be Correct')

const negationActivity = {
  ...sample,
  targetSentence: 'You do not need to pay today.',
}
const negation = diagnoseFreeBuild(
  negationActivity,
  'You need to pay today.',
)
assert(negation.check === 'not_quite', 'negation reversal must be Not quite')
assert(negation.feedback.includes('肯定・否定'), 'negation-specific feedback missing')

const modalActivity = {
  ...sample,
  targetSentence: 'Could you wait here for a moment?',
}
const modal = diagnoseFreeBuild(
  modalActivity,
  'Should you wait here for a moment?',
)
assert(modal.check === 'not_quite', 'modal meaning change must be Not quite')

const revealed = scoreFreeBuild(sample, '', 1, 2, true)
assert(revealed.score === 40, `revealed score should preserve BUILD policy, got ${revealed.score}`)
assert(revealed.exact === false, 'revealed answer must not be exact success')

console.log('English Shift v0.6.5 Free BUILD core smoke: PASS')
console.log('normalization · contractions · conservative Correct · typo Almost · negation/modal Not quite · reveal policy')
