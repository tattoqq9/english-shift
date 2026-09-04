import { emptyAdvancedProgress, isFlowCorrect, isRepairCorrect, saveFlowResult, saveRepairResult, scoreFlow, scoreRepair } from '../src/core/advanced.js'
import { flowActivities, repairActivities, repairUnits } from '../src/data/advancedTrainingActivities.js'

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message) }

assert(repairUnits.length === 6, `Expected 6 Repair units, got ${repairUnits.length}`)
assert(repairActivities.length === 24, `Expected 24 Repair missions, got ${repairActivities.length}`)
assert(flowActivities.length === 3, `Expected 3 Flow foundation missions, got ${flowActivities.length}`)
assert(new Set([...repairActivities.map((x) => x.id), ...flowActivities.map((x) => x.id)]).size === 27, 'Advanced activity ids must be unique')

for (const unit of repairUnits) {
  const missions = repairActivities.filter((activity) => activity.unitId === unit.id)
  assert(missions.length === 4, `${unit.id}: expected 4 Repair missions, got ${missions.length}`)
}

for (const activity of repairActivities) {
  assert(repairUnits.some((unit) => unit.id === activity.unitId), `${activity.id}: unknown Repair unit ${activity.unitId}`)
  assert(activity.focusJa.trim().length > 0, `${activity.id}: focusJa required`)
  assert(activity.hintJa.trim().length > 0, `${activity.id}: hintJa required`)
  assert(activity.replacementChoices.includes(activity.correctReplacement), `${activity.id}: correct replacement must be selectable`)
  assert(isRepairCorrect(activity, activity.correctReplacement), `${activity.id}: repair correct answer failed`)
  const perfect = scoreRepair(activity, activity.correctReplacement, 1, 0)
  assert(perfect.correct && perfect.score === 100, `${activity.id}: first-try repair should score 100`)
  const broken = activity.before[activity.brokenIndex]
  assert(broken !== activity.correctReplacement, `${activity.id}: broken part must differ from correction`)
  assert(activity.correctedSentence.length > 0 && activity.explanationJa.length > 0, `${activity.id}: answer review required`)
}
for (const activity of flowActivities) {
  assert(activity.targetStepIds.length === 3, `${activity.id}: expected 3-step best flow`)
  assert(isFlowCorrect(activity, activity.targetStepIds), `${activity.id}: target flow should be correct`)
  const perfect = scoreFlow(activity, activity.targetStepIds, 1, 0)
  assert(perfect.correct && perfect.score === 100, `${activity.id}: first-try flow should score 100`)
}

let progress = emptyAdvancedProgress()
progress = saveRepairResult(progress, repairActivities[0].id, 81)
progress = saveRepairResult(progress, repairActivities[0].id, 94)
progress = saveFlowResult(progress, flowActivities[0].id, 89)
assert(progress.repairCompleted.length === 1 && progress.repairBest[repairActivities[0].id] === 94, 'Repair progress / best score broken')
assert(progress.flowCompleted.length === 1 && progress.flowBest[flowActivities[0].id] === 89, 'Flow progress broken')
console.log(`Advanced smoke PASS · RepairUnits=${repairUnits.length} · Repair=${repairActivities.length} · Flow=${flowActivities.length} · first-try-best=100`)
