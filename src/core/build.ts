import type { GrammarTargetRef } from './grammar.js'

export type BuildChapter = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type BuildMode = 'standard' | 'guided' | 'challenge'
export type BuildPresentation = 'guided' | 'semi' | 'free'
export type BuildCheck = 'correct' | 'almost' | 'not_quite'

export interface BuildDiagnosis {
  check: BuildCheck
  feedback: string
  missingTargetIds: string[]
  misplacedTargetIds: string[]
  distractorIds: string[]
  sequenceRatio: number
}

export interface BuildChunk {
  id: string
  text: string
  distractor?: boolean
}

export interface BuildActivity {
  id: string
  sourceActivityId: string
  chapter: BuildChapter
  day: number
  activityNo: 1 | 2 | 3
  title: string
  skill: string
  store: string
  customerId: string
  customerName: string
  customerOpening: string
  customerOpeningJa: string
  intentJa: string
  targetSentence: string
  targetJapanese: string
  customerResponse: string
  customerResponseJa: string
  grammarTargets: GrammarTargetRef[]
  chunks: BuildChunk[]
  targetChunkIds: string[]
  slotLabels?: string[]
  hintsJa?: string[]
  bestRoute: string[]
}

export interface BuildScore {
  score: number
  exact: boolean
  check: BuildCheck
  attempts: number
  hintsUsed: number
  correctPrefix: number
  targetCount: number
  distractorsUsed: number
  feedback: string
}

export const BUILD_MODE_KEY = 'english-shift-level2-build-mode-v1'

export function readBuildMode(storage?: Pick<Storage, 'getItem'>): BuildMode {
  if (!storage) return 'standard'
  const value = storage.getItem(BUILD_MODE_KEY)
  return value === 'guided' || value === 'challenge' ? value : 'standard'
}

export function saveBuildMode(mode: BuildMode, storage?: Pick<Storage, 'setItem'>) {
  storage?.setItem(BUILD_MODE_KEY, mode)
}

export function buildPresentation(mode: BuildMode, missionIndex: number, explicitDay?: number): BuildPresentation {
  if (mode === 'guided') return 'guided'
  if (mode === 'challenge') return 'free'
  const day = explicitDay ?? Math.floor(Math.max(0, missionIndex) / 3) + 1
  if (day <= 12) return 'guided'
  if (day <= 30) return 'semi'
  return 'free'
}

export function assembleBuildSentence(activity: BuildActivity, selectedChunkIds: string[]) {
  const text = selectedChunkIds
    .map((id) => activity.chunks.find((chunk) => chunk.id === id)?.text ?? '')
    .filter(Boolean)
    .join(' ')
  return text
    .replace(/\s+([,.!?;:])/g, '$1')
    .replace(/\s+'s\b/g, "'s")
    .replace(/\s+n’t\b/g, 'n’t')
    .replace(/\s+/g, ' ')
    .trim()
}

export function isBuildCorrect(activity: BuildActivity, selectedChunkIds: string[]) {
  return selectedChunkIds.length === activity.targetChunkIds.length
    && selectedChunkIds.every((id, index) => id === activity.targetChunkIds[index])
}

export function buildCorrectPrefix(activity: BuildActivity, selectedChunkIds: string[]) {
  let count = 0
  while (count < selectedChunkIds.length && count < activity.targetChunkIds.length && selectedChunkIds[count] === activity.targetChunkIds[count]) count += 1
  return count
}

function sameTargetSet(activity: BuildActivity, selectedChunkIds: string[]) {
  if (selectedChunkIds.length !== activity.targetChunkIds.length) return false
  return activity.targetChunkIds.every((id) => selectedChunkIds.includes(id))
}

function longestCommonSubsequenceLength(a: string[], b: string[]) {
  const dp = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0))
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }
  return dp[a.length][b.length]
}

export function diagnoseBuild(activity: BuildActivity, selectedChunkIds: string[]): BuildDiagnosis {
  if (isBuildCorrect(activity, selectedChunkIds)) return { check: 'correct', feedback: '正解です。意味と語順の両方が、この状況に合っています。', missingTargetIds: [], misplacedTargetIds: [], distractorIds: [], sequenceRatio: 1 }

  const targetSet = new Set(activity.targetChunkIds)
  const selectedTargets = selectedChunkIds.filter((id) => targetSet.has(id))
  const distractorIds = selectedChunkIds.filter((id) => activity.chunks.find((chunk) => chunk.id === id)?.distractor)
  const missingTargetIds = activity.targetChunkIds.filter((id) => !selectedChunkIds.includes(id))
  const lcs = longestCommonSubsequenceLength(selectedTargets, activity.targetChunkIds)
  const sequenceRatio = activity.targetChunkIds.length ? lcs / activity.targetChunkIds.length : 0
  const misplacedTargetIds = selectedTargets.filter((id, index) => activity.targetChunkIds[index] !== id)

  if (!distractorIds.length && sameTargetSet(activity, selectedChunkIds)) {
    return { check: 'almost', feedback: '必要なフレーズはすべて揃っています。あとは語順だけを見直してみましょう。', missingTargetIds, misplacedTargetIds, distractorIds, sequenceRatio }
  }
  if (!distractorIds.length && missingTargetIds.length <= 1 && sequenceRatio >= 0.6) {
    return { check: 'almost', feedback: missingTargetIds.length ? 'かなり近いです。語順はほぼ合っています。足りない意味のまとまりがないか確認しましょう。' : 'かなり近いです。意味のまとまり同士の順番を確認しましょう。', missingTargetIds, misplacedTargetIds, distractorIds, sequenceRatio }
  }
  if (distractorIds.length) return { check: 'not_quite', feedback: 'この返答では使わないフレーズが含まれています。YOUR INTENTに必要な意味だけを残してみましょう。', missingTargetIds, misplacedTargetIds, distractorIds, sequenceRatio }
  if (missingTargetIds.length) return { check: 'not_quite', feedback: `必要な意味のまとまりがあと${missingTargetIds.length}個あります。CustomerとYOUR INTENTをもう一度確認しましょう。`, missingTargetIds, misplacedTargetIds, distractorIds, sequenceRatio }
  return { check: 'not_quite', feedback: 'まだ少し違います。英語の語順と、各chunkの役割を見直してみましょう。', missingTargetIds, misplacedTargetIds, distractorIds, sequenceRatio }
}

export function classifyBuild(activity: BuildActivity, selectedChunkIds: string[]): BuildCheck {
  return diagnoseBuild(activity, selectedChunkIds).check
}

export function scoreBuild(activity: BuildActivity, selectedChunkIds: string[], attempts: number, hintsUsed: number, revealed = false): BuildScore {
  const exact = isBuildCorrect(activity, selectedChunkIds)
  const diagnosis = diagnoseBuild(activity, selectedChunkIds)
  const check = diagnosis.check
  const correctPrefix = buildCorrectPrefix(activity, selectedChunkIds)
  const distractorsUsed = selectedChunkIds.filter((id) => activity.chunks.find((chunk) => chunk.id === id)?.distractor).length
  const targetCount = activity.targetChunkIds.length

  if (revealed) {
    return {
      score: Math.max(30, 50 - hintsUsed * 5), exact: false, check: 'not_quite', attempts, hintsUsed,
      correctPrefix, targetCount, distractorsUsed,
      feedback: '正解例を確認しました。少し時間を空けて、もう一度自力で組み立ててみましょう。',
    }
  }

  if (exact) {
    const attemptPenalty = Math.max(0, attempts - 1) * 5
    const hintPenalty = hintsUsed * 5
    return {
      score: Math.max(70, 100 - attemptPenalty - hintPenalty), exact: true, check: 'correct', attempts, hintsUsed,
      correctPrefix, targetCount, distractorsUsed,
      feedback: '正解です。意味と語順の両方が、この状況に合っています。',
    }
  }

  const selectedTargets = selectedChunkIds.filter((id) => activity.targetChunkIds.includes(id)).length
  const feedback = diagnosis.feedback

  const structure = targetCount ? Math.round((diagnosis.sequenceRatio) * 45) : 0
  const inclusion = targetCount ? Math.round((selectedTargets / targetCount) * 35) : 0
  const clean = Math.max(0, 20 - distractorsUsed * 10)
  return {
    score: Math.max(0, Math.min(85, structure + inclusion + clean)), exact: false, check, attempts, hintsUsed,
    correctPrefix, targetCount, distractorsUsed, feedback,
  }
}

export interface BuildProgress {
  version: 1
  completedIds: string[]
  bestScores: Record<string, number>
}

export const BUILD_PROGRESS_KEY = 'english-shift-level2-build-progress-v1'

export function emptyBuildProgress(): BuildProgress {
  return { version: 1, completedIds: [], bestScores: {} }
}

export function readBuildProgress(storage?: Pick<Storage, 'getItem'>): BuildProgress {
  if (!storage) return emptyBuildProgress()
  try {
    const raw = storage.getItem(BUILD_PROGRESS_KEY)
    if (!raw) return emptyBuildProgress()
    const parsed = JSON.parse(raw) as Partial<BuildProgress>
    return {
      version: 1,
      completedIds: Array.isArray(parsed.completedIds) ? parsed.completedIds.filter((id): id is string => typeof id === 'string') : [],
      bestScores: parsed.bestScores && typeof parsed.bestScores === 'object' ? parsed.bestScores as Record<string, number> : {},
    }
  } catch {
    return emptyBuildProgress()
  }
}

export function saveBuildResult(progress: BuildProgress, activityId: string, score: number): BuildProgress {
  return {
    version: 1,
    completedIds: [...new Set([...progress.completedIds, activityId])],
    bestScores: { ...progress.bestScores, [activityId]: Math.max(progress.bestScores[activityId] ?? 0, score) },
  }
}
