import type { GrammarTargetRef } from './grammar.js'
import type { StorageLike } from './mastery.js'

export type RepairActivity = {
  id: string
  unitId: string
  focusJa: string
  hintJa: string
  title: string
  store: string
  customerContext: string
  customerContextJa: string
  before: string[]
  brokenIndex: number
  replacementChoices: string[]
  correctReplacement: string
  correctedSentence: string
  correctedJapanese: string
  explanationJa: string
  grammarTargets: GrammarTargetRef[]
}

export type FlowStep = {
  id: string
  label: string
  labelJa: string
  response: string
  responseJa: string
}

export type FlowActivity = {
  id: string
  title: string
  store: string
  customerOpening: string
  customerOpeningJa: string
  goalJa: string
  steps: FlowStep[]
  targetStepIds: string[]
  resultJa: string
  grammarTargets: GrammarTargetRef[]
}

export type AdvancedProgress = {
  version: 1
  repairCompleted: string[]
  flowCompleted: string[]
  repairBest: Record<string, number>
  flowBest: Record<string, number>
}

export const ADVANCED_PROGRESS_KEY = 'english-shift-advanced-training-progress-v1'

export function emptyAdvancedProgress(): AdvancedProgress {
  return { version: 1, repairCompleted: [], flowCompleted: [], repairBest: {}, flowBest: {} }
}

export function readAdvancedProgress(storage?: StorageLike): AdvancedProgress {
  if (!storage) return emptyAdvancedProgress()
  try {
    const raw = storage.getItem(ADVANCED_PROGRESS_KEY)
    if (!raw) return emptyAdvancedProgress()
    const parsed = JSON.parse(raw) as Partial<AdvancedProgress>
    return {
      version: 1,
      repairCompleted: Array.isArray(parsed.repairCompleted) ? parsed.repairCompleted.filter((id): id is string => typeof id === 'string') : [],
      flowCompleted: Array.isArray(parsed.flowCompleted) ? parsed.flowCompleted.filter((id): id is string => typeof id === 'string') : [],
      repairBest: parsed.repairBest && typeof parsed.repairBest === 'object' ? parsed.repairBest as Record<string, number> : {},
      flowBest: parsed.flowBest && typeof parsed.flowBest === 'object' ? parsed.flowBest as Record<string, number> : {},
    }
  } catch {
    return emptyAdvancedProgress()
  }
}

export function saveRepairResult(progress: AdvancedProgress, id: string, score: number): AdvancedProgress {
  return {
    ...progress,
    repairCompleted: [...new Set([...progress.repairCompleted, id])],
    repairBest: { ...progress.repairBest, [id]: Math.max(progress.repairBest[id] ?? 0, score) },
  }
}

export function saveFlowResult(progress: AdvancedProgress, id: string, score: number): AdvancedProgress {
  return {
    ...progress,
    flowCompleted: [...new Set([...progress.flowCompleted, id])],
    flowBest: { ...progress.flowBest, [id]: Math.max(progress.flowBest[id] ?? 0, score) },
  }
}

export function isRepairCorrect(activity: RepairActivity, replacement: string | null) {
  return replacement === activity.correctReplacement
}

export function scoreRepair(activity: RepairActivity, replacement: string | null, attempts: number, hintsUsed: number) {
  const correct = isRepairCorrect(activity, replacement)
  if (!correct) return { score: 0, correct: false, feedbackJa: 'まだ違います。どの表現が不自然なのか、もう一度比べてみましょう。' }
  return {
    score: Math.max(70, 100 - Math.max(0, attempts - 1) * 5 - hintsUsed * 5),
    correct: true,
    feedbackJa: '修正できました。元の文と比べて、何が変わったか確認しましょう。',
  }
}

export function isFlowCorrect(activity: FlowActivity, selectedIds: string[]) {
  return selectedIds.length === activity.targetStepIds.length && selectedIds.every((id, index) => id === activity.targetStepIds[index])
}

export function scoreFlow(activity: FlowActivity, selectedIds: string[], attempts: number, hintsUsed: number) {
  const correct = isFlowCorrect(activity, selectedIds)
  if (correct) return {
    score: Math.max(70, 100 - Math.max(0, attempts - 1) * 5 - hintsUsed * 5),
    correct: true,
    feedbackJa: '自然な接客フローです。内容だけでなく、伝える順番も適切です。',
  }
  const selectedTargetCount = selectedIds.filter((id) => activity.targetStepIds.includes(id)).length
  const wrong = selectedIds.length - selectedTargetCount
  return {
    score: Math.max(0, 45 + selectedTargetCount * 12 - wrong * 10),
    correct: false,
    feedbackJa: selectedTargetCount === activity.targetStepIds.length
      ? '必要な対応は揃っています。お客様が受け取りやすい順番を考えてみましょう。'
      : '必要な対応がまだ足りないか、不要な対応が含まれています。',
  }
}
