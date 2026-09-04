import { customers } from '../src/data/customers.js'
import { products } from '../src/data/products.js'
import { rankProducts } from '../src/core/catalog.js'
import { calculateEfficiencyBonus, calculateRecommendationResult } from '../src/core/scoring.js'
import { initialRevealedFacts } from '../src/core/information.js'

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

for (const customer of customers) {
  const ranking = rankProducts(customer, products)
  assert(ranking.length === 5, `${customer.name}: expected 5 products`)
  assert(ranking[0].score >= ranking[ranking.length - 1].score, `${customer.name}: ranking order broken`)
  const result = calculateRecommendationResult({
    customer,
    product: ranking[0].product,
    questionCount: customer.optimalQuestionCount,
    revealedFactKeys: initialRevealedFacts(customer),
    bestAvailableScore: ranking[0].score,
  })
  assert(result.match.finalScore >= 0 && result.match.finalScore <= 100, `${customer.name}: match out of range`)
  assert(Math.abs(result.choiceQuality - 100) < 0.001, `${customer.name}: best product should have 100 choice quality`)
  assert(result.efficiencyBonus === 30, `${customer.name}: optimal route should receive +30 efficiency`)
  console.log(`${customer.name.padEnd(8)} best=${ranking[0].product.name.padEnd(16)} fit=${ranking[0].score.toFixed(1)} choice=${result.choiceQuality.toFixed(0)}`)
}

assert(calculateEfficiencyBonus(95, 1, 1) === 30, 'optimal question bonus should be 30')
assert(calculateEfficiencyBonus(95, 2, 1) === 20, 'one extra question bonus should be 20')
assert(calculateEfficiencyBonus(80, 1, 1) === 0, 'poor match must receive no efficiency bonus')
console.log('Core smoke tests passed.')

import { eventMaxPoints, storeEvents } from '../src/data/events.js'

for (const event of storeEvents) {
  assert(event.steps.length === 3, `${event.title}: expected 3 steps`)
  const maxPoints = eventMaxPoints(event)
  assert(maxPoints === 75, `${event.title}: expected max 75 points, got ${maxPoints}`)
  for (const step of event.steps) {
    assert(step.choices.length === 3, `${event.title}/${step.id}: expected 3 choices`)
    assert(step.choices.some((choice) => choice.quality === 'best'), `${event.title}/${step.id}: missing best choice`)
    assert(step.choices.some((choice) => choice.quality === 'poor'), `${event.title}/${step.id}: missing poor choice`)
  }
  console.log(`Event ${event.title.padEnd(20)} triggerAfter=${event.triggerAfterCustomerIndex + 1} max=${maxPoints}`)
}
console.log('Store event smoke tests passed.')

import {
  gameplayPrototypeSummaries,
  incidentInvestigationPrototype,
  informationHuntPrototype,
  recommendationPrototype,
  staffCoordinationPrototype,
  troubleshootingPrototype,
} from '../src/data/gameplayPrototypes.js'

assert(gameplayPrototypeSummaries.length === 5, 'expected five gameplay prototypes')
assert(new Set(gameplayPrototypeSummaries.map((item) => item.id)).size === 5, 'gameplay prototype ids must be unique')
assert(recommendationPrototype.questions.length >= 4, 'recommendation lab needs question choice')
assert(recommendationPrototype.products.some((item) => item.score === 100), 'recommendation lab needs a best product')
assert(informationHuntPrototype.candidates.filter((item) => item.correct).length === 1, 'information hunt must have exactly one correct candidate')
assert(troubleshootingPrototype.solutions.some((item) => item.cause === troubleshootingPrototype.correctCause), 'troubleshooting must include the correct solution')
assert(staffCoordinationPrototype.facts.filter((item) => item.essential).length === staffCoordinationPrototype.maxFacts, 'staff coordination essential facts should match selection budget')
assert(incidentInvestigationPrototype.conclusions.filter((item) => item.correct).length === 1, 'incident lab must have exactly one correct conclusion')
console.log('Gameplay prototype smoke tests passed.')

// v0.1.5 explainable-score assumptions: every prototype must have a 100-point best route.
const recBest = Math.max(...recommendationPrototype.products.map((p) => p.score))
assert(Math.round(recBest * .8) + 20 === 100, 'recommendation best route should reach 100')

const huntTopQuestionValue = [...informationHuntPrototype.questions]
  .sort((a, b) => b.value - a.value)
  .slice(0, informationHuntPrototype.maxQuestions)
  .reduce((sum, q) => sum + q.value, 0)
assert(70 + Math.min(30, huntTopQuestionValue * 4) === 100, 'information hunt best route should reach 100')

const troubleshootingBestEvidence = [...troubleshootingPrototype.questions]
  .sort((a, b) => b.points - a.points)
  .slice(0, troubleshootingPrototype.maxQuestions)
  .reduce((sum, q) => sum + q.points, 0)
assert(troubleshootingBestEvidence > 0, 'troubleshooting best evidence must be positive')
assert(Math.round((troubleshootingBestEvidence / troubleshootingBestEvidence) * 50) + 50 === 100, 'troubleshooting best route should reach 100')

const staffBest = staffCoordinationPrototype.facts.filter((f) => f.essential).length * 20
  + Math.max(...staffCoordinationPrototype.handoffOptions.map((h) => h.points))
  + 10
assert(staffBest === 100, 'staff coordination best route should reach 100')

const incidentTopEvidence = [...incidentInvestigationPrototype.witnesses]
  .sort((a, b) => b.value - a.value)
  .slice(0, incidentInvestigationPrototype.maxInterviews)
  .reduce((sum, w) => sum + w.value, 0)
assert(Math.min(30, incidentTopEvidence * 3) + 70 === 100, 'incident investigation best route should reach 100')
console.log('Explainable score max-route tests passed.')

import { chapter1Activities, chapter1Days, chapter1ActivityById } from '../src/data/chapter1.js'
import { scoreDirectChoice, scoreIncidentInvestigation, scoreInformationHunt, scoreRapid, scoreStaffCoordination, scoreTroubleshooting } from '../src/core/chapter1.js'

assert(chapter1Days.length === 6, 'Chapter 1 should contain six shifts')
assert(new Set(chapter1Days.map((day) => day.day)).size === 6, 'Chapter 1 day numbers must be unique')
assert(chapter1Activities.length === 18, `Chapter 1 should currently contain 18 activities, got ${chapter1Activities.length}`)

for (const day of chapter1Days) {
  assert(day.activityIds.length === 3, `Day ${day.day}: expected three activities in v0.2.0`)
  for (const id of day.activityIds) assert(Boolean(chapter1ActivityById(id)), `Day ${day.day}: missing activity ${id}`)
}

for (const activity of chapter1Activities) {
  let best = 0
  if (activity.kind === 'dialogue' || activity.kind === 'checkout') {
    const choice = [...activity.choices].sort((a, b) => b.points - a.points)[0]
    best = scoreDirectChoice(choice).total
  } else if (activity.kind === 'information-hunt') {
    const asked = [...activity.questions].sort((a, b) => b.value - a.value).slice(0, activity.maxQuestions).map((q) => q.id)
    const target = activity.candidates.find((candidate) => candidate.correct)
    assert(Boolean(target), `${activity.id}: missing correct target`)
    best = scoreInformationHunt(activity, asked, target!.id).total
  } else if (activity.kind === 'troubleshooting') {
    const asked = [...activity.questions]
      .sort((a, b) => (b.points ?? b.value) - (a.points ?? a.value))
      .slice(0, activity.maxQuestions)
      .map((q) => q.id)
    const solution = activity.solutions.find((item) => item.cause === activity.correctCause)
    assert(Boolean(solution), `${activity.id}: missing correct solution`)
    best = scoreTroubleshooting(activity, asked, solution!.id).total
  } else if (activity.kind === 'rapid') {
    const selected = activity.scenarios.map((scenario) => [...scenario.choices].sort((a, b) => b.points - a.points)[0].id)
    best = scoreRapid(activity, selected).total
  } else {
    throw new Error(`${activity.id}: unsupported Chapter 1 activity kind`)
  }
  assert(best === 100, `${activity.id}: best route should score 100, got ${best}`)
}
console.log('Chapter 1 curriculum and max-route tests passed.')

import { chapter2Activities, chapter2Days, chapter2ActivityById } from '../src/data/chapter2.js'

assert(chapter2Days.length === 6, 'Chapter 2 should contain six shifts')
assert(new Set(chapter2Days.map((day) => day.day)).size === 6, 'Chapter 2 day numbers must be unique')
assert(chapter2Days[0].day === 7 && chapter2Days[5].day === 12, 'Chapter 2 should cover Day 7 through Day 12')
assert(chapter2Activities.length === 18, `Chapter 2 should currently contain 18 activities, got ${chapter2Activities.length}`)

for (const day of chapter2Days) {
  assert(day.activityIds.length === 3, `Day ${day.day}: expected three activities in v0.2.1`)
  for (const id of day.activityIds) assert(Boolean(chapter2ActivityById(id)), `Day ${day.day}: missing activity ${id}`)
}

for (const activity of chapter2Activities) {
  let best = 0
  if (activity.kind === 'dialogue' || activity.kind === 'checkout') {
    const choice = [...activity.choices].sort((a, b) => b.points - a.points)[0]
    best = scoreDirectChoice(choice).total
  } else if (activity.kind === 'information-hunt') {
    const asked = [...activity.questions].sort((a, b) => b.value - a.value).slice(0, activity.maxQuestions).map((q) => q.id)
    const target = activity.candidates.find((candidate) => candidate.correct)
    assert(Boolean(target), `${activity.id}: missing correct target`)
    best = scoreInformationHunt(activity, asked, target!.id).total
  } else if (activity.kind === 'troubleshooting') {
    const asked = [...activity.questions]
      .sort((a, b) => (b.points ?? b.value) - (a.points ?? a.value))
      .slice(0, activity.maxQuestions)
      .map((q) => q.id)
    const solution = activity.solutions.find((item) => item.cause === activity.correctCause)
    assert(Boolean(solution), `${activity.id}: missing correct solution`)
    best = scoreTroubleshooting(activity, asked, solution!.id).total
  } else if (activity.kind === 'rapid') {
    const selected = activity.scenarios.map((scenario) => [...scenario.choices].sort((a, b) => b.points - a.points)[0].id)
    best = scoreRapid(activity, selected).total
  } else {
    throw new Error(`${activity.id}: unsupported Chapter 2 activity kind`)
  }
  assert(best === 100, `${activity.id}: best route should score 100, got ${best}`)
}
console.log('Chapter 2 curriculum and max-route tests passed.')


import { chapter3Activities, chapter3Days, chapter3ActivityById } from '../src/data/chapter3.js'

assert(chapter3Days.length === 6, 'Chapter 3 should contain six shifts')
assert(new Set(chapter3Days.map((day) => day.day)).size === 6, 'Chapter 3 day numbers must be unique')
assert(chapter3Days[0].day === 13 && chapter3Days[5].day === 18, 'Chapter 3 should cover Day 13 through Day 18')
assert(chapter3Activities.length === 18, `Chapter 3 should currently contain 18 activities, got ${chapter3Activities.length}`)

for (const day of chapter3Days) {
  assert(day.activityIds.length === 3, `Day ${day.day}: expected three activities in v0.2.3`)
  for (const id of day.activityIds) assert(Boolean(chapter3ActivityById(id)), `Day ${day.day}: missing activity ${id}`)
}

for (const activity of chapter3Activities) {
  let best = 0
  if (activity.kind === 'dialogue' || activity.kind === 'checkout') {
    const choice = [...activity.choices].sort((a, b) => b.points - a.points)[0]
    best = scoreDirectChoice(choice).total
  } else if (activity.kind === 'information-hunt') {
    const asked = [...activity.questions].sort((a, b) => b.value - a.value).slice(0, activity.maxQuestions).map((q) => q.id)
    const target = activity.candidates.find((candidate) => candidate.correct)
    assert(Boolean(target), `${activity.id}: missing correct target`)
    best = scoreInformationHunt(activity, asked, target!.id).total
  } else if (activity.kind === 'troubleshooting') {
    const asked = [...activity.questions]
      .sort((a, b) => (b.points ?? b.value) - (a.points ?? a.value))
      .slice(0, activity.maxQuestions)
      .map((q) => q.id)
    const solution = activity.solutions.find((item) => item.cause === activity.correctCause)
    assert(Boolean(solution), `${activity.id}: missing correct solution`)
    best = scoreTroubleshooting(activity, asked, solution!.id).total
  } else if (activity.kind === 'rapid') {
    const selected = activity.scenarios.map((scenario) => [...scenario.choices].sort((a, b) => b.points - a.points)[0].id)
    best = scoreRapid(activity, selected).total
  } else {
    throw new Error(`${activity.id}: unsupported Chapter 3 activity kind`)
  }
  assert(best === 100, `${activity.id}: best route should score 100, got ${best}`)
}
console.log('Chapter 3 curriculum and max-route tests passed.')

import { chapter4Activities, chapter4Days, chapter4ActivityById } from '../src/data/chapter4.js'

assert(chapter4Days.length === 6, 'Chapter 4 should contain six shifts')
assert(new Set(chapter4Days.map((day) => day.day)).size === 6, 'Chapter 4 day numbers must be unique')
assert(chapter4Days[0].day === 19 && chapter4Days[5].day === 24, 'Chapter 4 should cover Day 19 through Day 24')
assert(chapter4Activities.length === 18, `Chapter 4 should currently contain 18 activities, got ${chapter4Activities.length}`)

for (const day of chapter4Days) {
  assert(day.activityIds.length === 3, `Day ${day.day}: expected three activities in v0.2.5`)
  for (const id of day.activityIds) assert(Boolean(chapter4ActivityById(id)), `Day ${day.day}: missing activity ${id}`)
}

for (const activity of chapter4Activities) {
  let best = 0
  if (activity.kind === 'dialogue' || activity.kind === 'checkout') {
    const choice = [...activity.choices].sort((a, b) => b.points - a.points)[0]
    best = scoreDirectChoice(choice).total
  } else if (activity.kind === 'information-hunt') {
    const asked = [...activity.questions].sort((a, b) => b.value - a.value).slice(0, activity.maxQuestions).map((q) => q.id)
    const target = activity.candidates.find((candidate) => candidate.correct)
    assert(Boolean(target), `${activity.id}: missing correct target`)
    best = scoreInformationHunt(activity, asked, target!.id).total
  } else if (activity.kind === 'troubleshooting') {
    const asked = [...activity.questions]
      .sort((a, b) => (b.points ?? b.value) - (a.points ?? a.value))
      .slice(0, activity.maxQuestions)
      .map((q) => q.id)
    const solution = activity.solutions.find((item) => item.cause === activity.correctCause)
    assert(Boolean(solution), `${activity.id}: missing correct solution`)
    best = scoreTroubleshooting(activity, asked, solution!.id).total
  } else if (activity.kind === 'rapid') {
    const selected = activity.scenarios.map((scenario) => [...scenario.choices].sort((a, b) => b.points - a.points)[0].id)
    best = scoreRapid(activity, selected).total
  } else if (activity.kind === 'staff-coordination') {
    const facts = activity.facts.filter((item) => item.essential).map((item) => item.id)
    const handoff = [...activity.handoffOptions].sort((a, b) => b.points - a.points)[0]
    best = scoreStaffCoordination(activity, facts, handoff.id).total
  } else {
    throw new Error(`${activity.id}: unsupported Chapter 4 activity kind`)
  }
  assert(best === 100, `${activity.id}: best route should score 100, got ${best}`)
}
console.log('Chapter 4 curriculum and max-route tests passed.')


import { chapter5Activities, chapter5Days, chapter5ActivityById } from '../src/data/chapter5.js'

assert(chapter5Days.length === 6, 'Chapter 5 should contain six shifts')
assert(new Set(chapter5Days.map((day) => day.day)).size === 6, 'Chapter 5 day numbers must be unique')
assert(chapter5Days[0].day === 25 && chapter5Days[5].day === 30, 'Chapter 5 should cover Day 25 through Day 30')
assert(chapter5Activities.length === 18, `Chapter 5 should currently contain 18 activities, got ${chapter5Activities.length}`)

for (const day of chapter5Days) {
  assert(day.activityIds.length === 3, `Day ${day.day}: expected three activities in v0.3.2`)
  for (const id of day.activityIds) assert(Boolean(chapter5ActivityById(id)), `Day ${day.day}: missing activity ${id}`)
}

for (const activity of chapter5Activities) {
  let best = 0
  if (activity.kind === 'dialogue' || activity.kind === 'checkout') {
    const choice = [...activity.choices].sort((a, b) => b.points - a.points)[0]
    best = scoreDirectChoice(choice).total
  } else if (activity.kind === 'information-hunt') {
    const asked = [...activity.questions].sort((a, b) => b.value - a.value).slice(0, activity.maxQuestions).map((q) => q.id)
    const target = activity.candidates.find((candidate) => candidate.correct)
    assert(Boolean(target), `${activity.id}: missing correct target`)
    best = scoreInformationHunt(activity, asked, target!.id).total
  } else if (activity.kind === 'troubleshooting') {
    const asked = [...activity.questions].sort((a, b) => (b.points ?? b.value) - (a.points ?? a.value)).slice(0, activity.maxQuestions).map((q) => q.id)
    const solution = activity.solutions.find((item) => item.cause === activity.correctCause)
    assert(Boolean(solution), `${activity.id}: missing correct solution`)
    best = scoreTroubleshooting(activity, asked, solution!.id).total
  } else if (activity.kind === 'rapid') {
    const selected = activity.scenarios.map((scenario) => [...scenario.choices].sort((a, b) => b.points - a.points)[0].id)
    best = scoreRapid(activity, selected).total
  } else if (activity.kind === 'staff-coordination') {
    const facts = activity.facts.filter((item) => item.essential).map((item) => item.id)
    const handoff = [...activity.handoffOptions].sort((a, b) => b.points - a.points)[0]
    best = scoreStaffCoordination(activity, facts, handoff.id).total
  } else {
    throw new Error(`${activity.id}: unsupported Chapter 5 activity kind`)
  }
  assert(best === 100, `${activity.id}: best route should score 100, got ${best}`)
}
console.log('Chapter 5 curriculum and max-route tests passed.')



import { chapter6Activities, chapter6Days, chapter6ActivityById } from '../src/data/chapter6.js'

assert(chapter6Days.length === 6, 'Chapter 6 should contain six shifts')
assert(new Set(chapter6Days.map((day) => day.day)).size === 6, 'Chapter 6 day numbers must be unique')
assert(chapter6Days[0].day === 31 && chapter6Days[5].day === 36, 'Chapter 6 should cover Day 31 through Day 36')
assert(chapter6Activities.length === 18, `Chapter 6 should currently contain 18 activities, got ${chapter6Activities.length}`)

for (const day of chapter6Days) {
  assert(day.activityIds.length === 3, `Day ${day.day}: expected three activities in v0.3.3`)
  for (const id of day.activityIds) assert(Boolean(chapter6ActivityById(id)), `Day ${day.day}: missing activity ${id}`)
}

for (const activity of chapter6Activities) {
  let best = 0
  if (activity.kind === 'dialogue' || activity.kind === 'checkout') {
    const choice = [...activity.choices].sort((a, b) => b.points - a.points)[0]
    best = scoreDirectChoice(choice).total
  } else if (activity.kind === 'information-hunt') {
    const asked = [...activity.questions].sort((a, b) => b.value - a.value).slice(0, activity.maxQuestions).map((q) => q.id)
    const target = activity.candidates.find((candidate) => candidate.correct)
    assert(Boolean(target), `${activity.id}: missing correct target`)
    best = scoreInformationHunt(activity, asked, target!.id).total
  } else if (activity.kind === 'troubleshooting') {
    const asked = [...activity.questions].sort((a, b) => (b.points ?? b.value) - (a.points ?? a.value)).slice(0, activity.maxQuestions).map((q) => q.id)
    const solution = activity.solutions.find((item) => item.cause === activity.correctCause)
    assert(Boolean(solution), `${activity.id}: missing correct solution`)
    best = scoreTroubleshooting(activity, asked, solution!.id).total
  } else if (activity.kind === 'rapid') {
    const selected = activity.scenarios.map((scenario) => [...scenario.choices].sort((a, b) => b.points - a.points)[0].id)
    best = scoreRapid(activity, selected).total
  } else if (activity.kind === 'staff-coordination') {
    const facts = activity.facts.filter((item) => item.essential).map((item) => item.id)
    const handoff = [...activity.handoffOptions].sort((a, b) => b.points - a.points)[0]
    best = scoreStaffCoordination(activity, facts, handoff.id).total
  } else if (activity.kind === 'incident-investigation') {
    const witnesses = [...activity.witnesses].sort((a, b) => b.value - a.value).slice(0, activity.maxInterviews).map((w) => w.id)
    const conclusion = activity.conclusions.find((item) => item.correct)
    assert(Boolean(conclusion), `${activity.id}: missing correct conclusion`)
    best = scoreIncidentInvestigation(activity, witnesses, conclusion!.id).total
  } else {
    throw new Error(`${activity.id}: unsupported Chapter 6 activity kind`)
  }
  assert(best === 100, `${activity.id}: best route should score 100, got ${best}`)
}
console.log('Chapter 6 curriculum and max-route tests passed.')



import { chapter7Activities, chapter7Days, chapter7ActivityById } from '../src/data/chapter7.js'

assert(chapter7Days.length === 6, 'Chapter 7 should contain six shifts')
assert(new Set(chapter7Days.map((day) => day.day)).size === 6, 'Chapter 7 day numbers must be unique')
assert(chapter7Days[0].day === 37 && chapter7Days[5].day === 42, 'Chapter 7 should cover Day 37 through Day 42')
assert(chapter7Activities.length === 18, `Chapter 7 should currently contain 18 activities, got ${chapter7Activities.length}`)

for (const day of chapter7Days) {
  assert(day.activityIds.length === 3, `Day ${day.day}: expected three activities in v0.3.5`)
  for (const id of day.activityIds) assert(Boolean(chapter7ActivityById(id)), `Day ${day.day}: missing activity ${id}`)
}

for (const activity of chapter7Activities) {
  let best = 0
  if (activity.kind === 'dialogue' || activity.kind === 'checkout') {
    const choice = [...activity.choices].sort((a, b) => b.points - a.points)[0]
    best = scoreDirectChoice(choice).total
  } else if (activity.kind === 'information-hunt') {
    const asked = [...activity.questions].sort((a, b) => b.value - a.value).slice(0, activity.maxQuestions).map((q) => q.id)
    const target = activity.candidates.find((candidate) => candidate.correct)
    assert(Boolean(target), `${activity.id}: missing correct target`)
    best = scoreInformationHunt(activity, asked, target!.id).total
  } else if (activity.kind === 'troubleshooting') {
    const asked = [...activity.questions].sort((a, b) => (b.points ?? b.value) - (a.points ?? a.value)).slice(0, activity.maxQuestions).map((q) => q.id)
    const solution = activity.solutions.find((item) => item.cause === activity.correctCause)
    assert(Boolean(solution), `${activity.id}: missing correct solution`)
    best = scoreTroubleshooting(activity, asked, solution!.id).total
  } else if (activity.kind === 'rapid') {
    const selected = activity.scenarios.map((scenario) => [...scenario.choices].sort((a, b) => b.points - a.points)[0].id)
    best = scoreRapid(activity, selected).total
  } else if (activity.kind === 'staff-coordination') {
    const facts = activity.facts.filter((item) => item.essential).map((item) => item.id)
    const handoff = [...activity.handoffOptions].sort((a, b) => b.points - a.points)[0]
    best = scoreStaffCoordination(activity, facts, handoff.id).total
  } else if (activity.kind === 'incident-investigation') {
    const witnesses = [...activity.witnesses].sort((a, b) => b.value - a.value).slice(0, activity.maxInterviews).map((w) => w.id)
    const conclusion = activity.conclusions.find((item) => item.correct)
    assert(Boolean(conclusion), `${activity.id}: missing correct conclusion`)
    best = scoreIncidentInvestigation(activity, witnesses, conclusion!.id).total
  } else {
    throw new Error(`${activity.id}: unsupported Chapter 7 activity kind`)
  }
  assert(best === 100, `${activity.id}: best route should score 100, got ${best}`)
}
console.log('Chapter 7 curriculum and max-route tests passed.')



import { chapter8Activities, chapter8Days, chapter8ActivityById } from '../src/data/chapter8.js'

assert(chapter8Days.length === 6, 'Chapter 8 should contain six shifts')
assert(new Set(chapter8Days.map((day) => day.day)).size === 6, 'Chapter 8 day numbers must be unique')
assert(chapter8Days[0].day === 43 && chapter8Days[5].day === 48, 'Chapter 8 should cover Day 43 through Day 48')
assert(chapter8Activities.length === 18, `Chapter 8 should currently contain 18 activities, got ${chapter8Activities.length}`)

for (const day of chapter8Days) {
  assert(day.activityIds.length === 3, `Day ${day.day}: expected three activities in v0.3.6`)
  for (const id of day.activityIds) assert(Boolean(chapter8ActivityById(id)), `Day ${day.day}: missing activity ${id}`)
}

for (const activity of chapter8Activities) {
  let best = 0
  if (activity.kind === 'dialogue' || activity.kind === 'checkout') {
    const choice = [...activity.choices].sort((a, b) => b.points - a.points)[0]
    best = scoreDirectChoice(choice).total
  } else if (activity.kind === 'information-hunt') {
    const asked = [...activity.questions].sort((a, b) => b.value - a.value).slice(0, activity.maxQuestions).map((q) => q.id)
    const target = activity.candidates.find((candidate) => candidate.correct)
    assert(Boolean(target), `${activity.id}: missing correct target`)
    best = scoreInformationHunt(activity, asked, target!.id).total
  } else if (activity.kind === 'troubleshooting') {
    const asked = [...activity.questions].sort((a, b) => (b.points ?? b.value) - (a.points ?? a.value)).slice(0, activity.maxQuestions).map((q) => q.id)
    const solution = activity.solutions.find((item) => item.cause === activity.correctCause)
    assert(Boolean(solution), `${activity.id}: missing correct solution`)
    best = scoreTroubleshooting(activity, asked, solution!.id).total
  } else if (activity.kind === 'rapid') {
    const selected = activity.scenarios.map((scenario) => [...scenario.choices].sort((a, b) => b.points - a.points)[0].id)
    best = scoreRapid(activity, selected).total
  } else if (activity.kind === 'staff-coordination') {
    const facts = activity.facts.filter((item) => item.essential).map((item) => item.id)
    const handoff = [...activity.handoffOptions].sort((a, b) => b.points - a.points)[0]
    best = scoreStaffCoordination(activity, facts, handoff.id).total
  } else if (activity.kind === 'incident-investigation') {
    const witnesses = [...activity.witnesses].sort((a, b) => b.value - a.value).slice(0, activity.maxInterviews).map((w) => w.id)
    const conclusion = activity.conclusions.find((item) => item.correct)
    assert(Boolean(conclusion), `${activity.id}: missing correct conclusion`)
    best = scoreIncidentInvestigation(activity, witnesses, conclusion!.id).total
  } else {
    throw new Error(`${activity.id}: unsupported Chapter 8 activity kind`)
  }
  assert(best === 100, `${activity.id}: best route should score 100, got ${best}`)
}
console.log('Chapter 8 curriculum and max-route tests passed.')

import { japaneseFor } from '../src/data/japaneseSupport.js'
import { examActivities, examModules, examActivityById } from '../src/data/postgameActivities.js'

function assertActivityJapanese(activity: import('../src/core/chapter1.js').Chapter1Activity) {
  assert(Boolean(japaneseFor(activity.customer.opening)), `${activity.id}: missing Japanese for customer opening`)
  if (activity.kind === 'dialogue' || activity.kind === 'checkout') {
    for (const choice of activity.choices) assert(Boolean(japaneseFor(choice.text)), `${activity.id}/${choice.id}: missing Japanese choice`)
  } else if (activity.kind === 'information-hunt') {
    for (const question of activity.questions) assert(Boolean(japaneseFor(question.text)), `${activity.id}/${question.id}: missing Japanese question`)
  } else if (activity.kind === 'troubleshooting') {
    for (const question of activity.questions) assert(Boolean(japaneseFor(question.text)), `${activity.id}/${question.id}: missing Japanese question`)
    for (const solution of activity.solutions) assert(Boolean(japaneseFor(solution.text)), `${activity.id}/${solution.id}: missing Japanese solution`)
  } else if (activity.kind === 'rapid') {
    for (const scenario of activity.scenarios) {
      assert(Boolean(japaneseFor(scenario.line)), `${activity.id}/${scenario.id}: missing Japanese scenario line`)
      for (const choice of scenario.choices) assert(Boolean(japaneseFor(choice.text)), `${activity.id}/${choice.id}: missing Japanese rapid choice`)
    }
  } else if (activity.kind === 'staff-coordination') {
    for (const fact of activity.facts) assert(Boolean(japaneseFor(fact.text)), `${activity.id}/${fact.id}: missing Japanese fact`)
    for (const handoff of activity.handoffOptions) assert(Boolean(japaneseFor(handoff.text)), `${activity.id}/${handoff.id}: missing Japanese handoff`)
  } else if (activity.kind === 'incident-investigation') {
    for (const witness of activity.witnesses) assert(Boolean(japaneseFor(witness.statement)), `${activity.id}/${witness.id}: missing Japanese witness statement`)
    for (const conclusion of activity.conclusions) assert(Boolean(japaneseFor(conclusion.text)), `${activity.id}/${conclusion.id}: missing Japanese conclusion`)
  }
}

for (const activity of [...chapter1Activities, ...chapter2Activities, ...chapter3Activities, ...chapter4Activities, ...chapter5Activities, ...chapter6Activities, ...chapter7Activities, ...chapter8Activities, ...examActivities]) assertActivityJapanese(activity)
console.log('Level 1 + Exam Shift Japanese support coverage tests passed.')

import { grammarRegistry } from '../src/data/grammarRegistry.js'
import { uncoveredPostgameG3Keys } from '../src/data/postgameGrammar.js'

assert(new Set(grammarRegistry.map((item) => item.key)).size === grammarRegistry.length, 'Grammar Registry keys must be unique')
assert(grammarRegistry.filter((item) => item.tier === 'ES-G1').length > 0, 'ES-G1 registry must not be empty')
assert(grammarRegistry.filter((item) => item.tier === 'ES-G2').length > 0, 'ES-G2 registry must not be empty')
assert(grammarRegistry.filter((item) => item.tier === 'ES-G3').length > 0, 'ES-G3 registry must not be empty')
assert(uncoveredPostgameG3Keys.length === 0, `Postgame plan does not cover ES-G3 keys: ${uncoveredPostgameG3Keys.join(', ')}`)
console.log('Grammar Registry and ES-G3 postgame coverage tests passed.')


assert(examModules.length === 6, `Exam Shift should contain 6 modules, got ${examModules.length}`)
assert(examActivities.length === 18, `Exam Shift should contain 18 activities, got ${examActivities.length}`)
for (const module of examModules) {
  assert(module.activityIds.length === 3, `${module.id}: expected 3 activities`)
  for (const id of module.activityIds) assert(Boolean(examActivityById(id)), `${module.id}: missing activity ${id}`)
}
for (const activity of examActivities) {
  let best = 0
  if (activity.kind === 'dialogue' || activity.kind === 'checkout') {
    const choice = [...activity.choices].sort((a, b) => b.points - a.points)[0]
    best = scoreDirectChoice(choice).total
  } else if (activity.kind === 'information-hunt') {
    const asked = [...activity.questions].sort((a, b) => b.value - a.value).slice(0, activity.maxQuestions).map((q) => q.id)
    const target = activity.candidates.find((candidate) => candidate.correct)
    assert(Boolean(target), `${activity.id}: missing correct target`)
    best = scoreInformationHunt(activity, asked, target!.id).total
  } else if (activity.kind === 'rapid') {
    const selected = activity.scenarios.map((scenario) => [...scenario.choices].sort((a, b) => b.points - a.points)[0].id)
    best = scoreRapid(activity, selected).total
  } else if (activity.kind === 'staff-coordination') {
    const facts = activity.facts.filter((item) => item.essential).map((item) => item.id)
    const handoff = [...activity.handoffOptions].sort((a, b) => b.points - a.points)[0]
    best = scoreStaffCoordination(activity, facts, handoff.id).total
  } else if (activity.kind === 'incident-investigation') {
    const witnesses = [...activity.witnesses].sort((a, b) => b.value - a.value).slice(0, activity.maxInterviews).map((item) => item.id)
    const conclusion = activity.conclusions.find((item) => item.correct)
    assert(Boolean(conclusion), `${activity.id}: missing correct conclusion`)
    best = scoreIncidentInvestigation(activity, witnesses, conclusion!.id).total
  } else if (activity.kind === 'troubleshooting') {
    const asked = [...activity.questions].sort((a, b) => (b.points ?? b.value) - (a.points ?? a.value)).slice(0, activity.maxQuestions).map((q) => q.id)
    const solution = activity.solutions.find((item) => item.cause === activity.correctCause)
    assert(Boolean(solution), `${activity.id}: missing correct solution`)
    best = scoreTroubleshooting(activity, asked, solution!.id).total
  }
  assert(best === 100, `${activity.id}: best route should score 100, got ${best}`)
}
const g3TargetKeys = new Set(examActivities.flatMap((activity) => activity.grammarTargets?.filter((item) => item.role === 'target').map((item) => item.key) ?? []))
const allG3Keys = grammarRegistry.filter((item) => item.tier === 'ES-G3' && item.postgameExpected).map((item) => item.key)
assert(allG3Keys.every((key) => g3TargetKeys.has(key)), `Exam Shift missing ES-G3 target keys: ${allG3Keys.filter((key) => !g3TargetKeys.has(key)).join(', ')}`)
console.log('Exam Shift 6 modules / 18 activities / ES-G3 26-key target tests passed.')
