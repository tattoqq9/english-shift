import type { GrammarTargetRef } from './grammar.js'

export type Chapter1ActivityKind =
  | 'dialogue'
  | 'information-hunt'
  | 'checkout'
  | 'troubleshooting'
  | 'rapid'
  | 'staff-coordination'
  | 'incident-investigation'

export type ChoiceQuality = 'best' | 'good' | 'poor'

export interface Chapter1Customer {
  id: string
  name: string
  roleLabel: string
  opening: string
}

export interface Chapter1Choice {
  id: string
  text: string
  /** Optional fuller model sentence shown in Answer Review instead of the compact in-game choice. */
  reviewText?: string
  response: string
  quality: ChoiceQuality
  points: number
  explanation: string
}

export interface Chapter1Question {
  id: string
  text: string
  response: string
  reveal: string
  value: number
  eliminates?: string[]
  confirms?: string
  points?: number
}

export interface Chapter1Candidate {
  id: string
  name: string
  details: string
  correct?: boolean
}

export interface Chapter1Solution {
  id: string
  text: string
  cause: string
}


export interface Chapter1StaffFact {
  id: string
  text: string
  essential: boolean
}


export interface Chapter1IncidentWitness {
  id: string
  name: string
  role: string
  statement: string
  evidence: string
  value: number
}

export interface Chapter1IncidentConclusion {
  id: string
  text: string
  /** Optional fuller model sentence shown in Answer Review instead of the compact in-game choice. */
  reviewText?: string
  correct: boolean
  explanation: string
}

export interface Chapter1RapidScenario {
  id: string
  customer: string
  line: string
  choices: Chapter1Choice[]
}

export interface Chapter1ActivityBase {
  id: string
  kind: Chapter1ActivityKind
  title: string
  skill: string
  objective: string
  grammar: string[]
  /** Canonical grammar metadata. New activities should prefer this over free-form grammar labels. */
  grammarTargets?: GrammarTargetRef[]
  customer: Chapter1Customer
  bestRoute: string[]
}

export interface Chapter1DialogueActivity extends Chapter1ActivityBase {
  kind: 'dialogue' | 'checkout'
  choices: Chapter1Choice[]
}

export interface Chapter1InformationHuntActivity extends Chapter1ActivityBase {
  kind: 'information-hunt'
  maxQuestions: number
  questions: Chapter1Question[]
  candidates: Chapter1Candidate[]
}

export interface Chapter1TroubleshootingActivity extends Chapter1ActivityBase {
  kind: 'troubleshooting'
  maxQuestions: number
  causes: { id: string; label: string }[]
  questions: Chapter1Question[]
  solutions: Chapter1Solution[]
  correctCause: string
}

export interface Chapter1RapidActivity extends Chapter1ActivityBase {
  kind: 'rapid'
  scenarios: Chapter1RapidScenario[]
}


export interface Chapter1StaffCoordinationActivity extends Chapter1ActivityBase {
  kind: 'staff-coordination'
  maxFacts: number
  facts: Chapter1StaffFact[]
  handoffOptions: Chapter1Choice[]
  factsHeading?: string
  notesHeading?: string
  handoffHeading?: string
  handoffTargetLabel?: string
}


export interface Chapter1IncidentInvestigationActivity extends Chapter1ActivityBase {
  kind: 'incident-investigation'
  maxInterviews: number
  witnesses: Chapter1IncidentWitness[]
  conclusions: Chapter1IncidentConclusion[]
  sourceMode?: 'interviews' | 'records'
  sourceHeading?: string
  sourceActionLabel?: string
  evidenceHeading?: string
}

export type Chapter1Activity =
  | Chapter1DialogueActivity
  | Chapter1InformationHuntActivity
  | Chapter1TroubleshootingActivity
  | Chapter1RapidActivity
  | Chapter1StaffCoordinationActivity
  | Chapter1IncidentInvestigationActivity

export interface Chapter1Day {
  day: number
  title: string
  subtitle: string
  newLanguage: string[]
  reviewLanguage: string[]
  gameFocus: string
  activityIds: string[]
  canDo: string[]
}

export interface Chapter1Result {
  total: number
  breakdown: { label: string; points: number; max: number; explanation: string }[]
  strengths: string[]
  missed: string[]
  nextTime: string[]
}

export function gradeFromPercent(percent: number) {
  if (percent >= 95) return 'S' as const
  if (percent >= 82) return 'A' as const
  if (percent >= 65) return 'B' as const
  return 'C' as const
}

export function scoreDirectChoice(choice: Chapter1Choice): Chapter1Result {
  const total = Math.max(0, Math.min(100, choice.points))
  return {
    total,
    breakdown: [{
      label: 'Response Quality',
      points: total,
      max: 100,
      explanation: choice.explanation,
    }],
    strengths: choice.quality === 'best'
      ? ['状況に合う自然な英語を選び、仕事上の目的も達成しました。']
      : choice.quality === 'good'
        ? ['意味は通じ、仕事も進められる回答です。']
        : [],
    missed: choice.quality === 'best' ? [] : [choice.explanation],
    nextTime: choice.quality === 'best'
      ? ['同じ表現を別の客でも素早く見つける。']
      : ['「文法的に見えるか」だけでなく、店員として何を伝える必要があるかを先に考える。'],
  }
}

export function scoreInformationHunt(
  activity: Chapter1InformationHuntActivity,
  askedIds: string[],
  selectedId: string,
): Chapter1Result {
  const selected = activity.candidates.find((item) => item.id === selectedId)
  const correct = activity.candidates.find((item) => item.correct)
  const selectedQuestions = askedIds
    .map((id) => activity.questions.find((q) => q.id === id))
    .filter((item): item is Chapter1Question => Boolean(item))
  const value = selectedQuestions.reduce((sum, q) => sum + q.value, 0)
  const maxValue = [...activity.questions]
    .sort((a, b) => b.value - a.value)
    .slice(0, activity.maxQuestions)
    .reduce((sum, q) => sum + q.value, 0)
  const accuracyPoints = selected?.correct ? 70 : 0
  const questionPoints = maxValue > 0 ? Math.round((value / maxValue) * 30) : 0
  const total = Math.min(100, accuracyPoints + questionPoints)
  const lowValue = selectedQuestions.filter((q) => q.value <= 2)
  const missedHigh = activity.questions.filter((q) => !askedIds.includes(q.id) && q.value >= 4)

  return {
    total,
    breakdown: [
      {
        label: 'Target Accuracy',
        points: accuracyPoints,
        max: 70,
        explanation: selected?.correct
          ? `${selected.name} を正しく特定しました。`
          : `選んだ候補は ${selected?.name ?? '未選択'}。正解は ${correct?.name ?? '不明'} でした。`,
      },
      {
        label: 'Question Quality',
        points: questionPoints,
        max: 30,
        explanation: `質問の情報価値 ${value}/${maxValue} を30点満点へ換算しています。`,
      },
    ],
    strengths: [
      ...(selected?.correct ? ['集めた情報を候補表と正しく照合できました。'] : []),
      ...selectedQuestions.filter((q) => q.value >= 4).map((q) => `「${q.text}」は候補を大きく絞る質問でした。`),
    ],
    missed: [
      ...lowValue.map((q) => `「${q.text}」は質問枠に対する情報量が少なめでした。`),
      ...missedHigh.map((q) => `「${q.text}」を使うと、より少ない推測で判断できます。`),
      ...(!selected?.correct ? [`最終候補は ${correct?.name ?? ''} です。`] : []),
    ],
    nextTime: [
      '候補同士の差が最も大きい条件を先に質問する。',
      '答えを聞いたら、すぐ候補表のどれが消えるか確認する。',
    ],
  }
}

export function scoreTroubleshooting(
  activity: Chapter1TroubleshootingActivity,
  askedIds: string[],
  solutionId: string,
): Chapter1Result {
  const selectedQuestions = askedIds
    .map((id) => activity.questions.find((q) => q.id === id))
    .filter((item): item is Chapter1Question => Boolean(item))
  const evidence = selectedQuestions.reduce((sum, q) => sum + (q.points ?? q.value), 0)
  const bestEvidence = [...activity.questions]
    .sort((a, b) => (b.points ?? b.value) - (a.points ?? a.value))
    .slice(0, activity.maxQuestions)
    .reduce((sum, q) => sum + (q.points ?? q.value), 0)
  const evidencePoints = bestEvidence > 0 ? Math.round((evidence / bestEvidence) * 50) : 0
  const solution = activity.solutions.find((item) => item.id === solutionId)
  const solutionCorrect = solution?.cause === activity.correctCause
  const actionPoints = solutionCorrect ? 50 : 0
  const confirmed = selectedQuestions.some((q) => q.confirms === activity.correctCause)

  return {
    total: Math.min(100, evidencePoints + actionPoints),
    breakdown: [
      {
        label: 'Diagnosis Evidence',
        points: evidencePoints,
        max: 50,
        explanation: `診断質問から得た証拠量 ${evidence}/${bestEvidence} を50点満点へ換算しています。`,
      },
      {
        label: 'Action',
        points: actionPoints,
        max: 50,
        explanation: solutionCorrect
          ? '原因に合う対処を選べました。'
          : '選んだ対処は今回の原因と一致していません。',
      },
    ],
    strengths: [
      ...(confirmed ? ['原因を直接示す証拠を引き出せました。'] : []),
      ...(solutionCorrect ? ['診断結果と対処法が一致しています。'] : []),
    ],
    missed: [
      ...(!confirmed ? ['原因を直接確認できる質問を使わず、推測が残りました。'] : []),
      ...(!solutionCorrect ? ['原因を特定してから、その原因に対応するActionを選ぶ必要があります。'] : []),
    ],
    nextTime: [
      '症状を聞く質問より、原因候補を消せる質問を優先する。',
      '最後のActionは、集めた証拠と矛盾していないか確認する。',
    ],
  }
}

export function scoreStaffCoordination(
  activity: Chapter1StaffCoordinationActivity,
  selectedFactIds: string[],
  handoffId: string,
): Chapter1Result {
  const selectedFacts = activity.facts.filter((item) => selectedFactIds.includes(item.id))
  const essentialSelected = selectedFacts.filter((item) => item.essential).length
  const nonEssentialSelected = selectedFacts.filter((item) => !item.essential).length
  const totalEssential = activity.facts.filter((item) => item.essential).length
  const factMax = 60
  const perEssential = totalEssential > 0 ? factMax / totalEssential : 0
  const factPoints = Math.max(0, Math.min(factMax, Math.round(essentialSelected * perEssential - nonEssentialSelected * 8)))
  const handoff = activity.handoffOptions.find((item) => item.id === handoffId)
  const handoffBestRaw = Math.max(...activity.handoffOptions.map((item) => item.points), 1)
  const handoffPoints = handoff ? Math.round((handoff.points / handoffBestRaw) * 30) : 0
  const concisionPoints = selectedFactIds.length === activity.maxFacts && essentialSelected === totalEssential && nonEssentialSelected === 0 ? 10 : 0
  const missedEssential = activity.facts.filter((item) => item.essential && !selectedFactIds.includes(item.id))

  return {
    total: Math.min(100, factPoints + handoffPoints + concisionPoints),
    breakdown: [
      {
        label: 'Key Information',
        points: factPoints,
        max: 60,
        explanation: `次の担当者の判断に必要な情報を ${essentialSelected}/${totalEssential} 件選びました。不要情報 ${nonEssentialSelected} 件は減点されます。`,
      },
      {
        label: 'Handoff Clarity',
        points: handoffPoints,
        max: 30,
        explanation: handoff?.explanation ?? '引継ぎ文が選ばれていません。',
      },
      {
        label: 'Concision',
        points: concisionPoints,
        max: 10,
        explanation: concisionPoints === 10 ? '限られたメモ枠を必要情報だけで使えました。' : '必要情報だけに絞り込めると満点です。',
      },
    ],
    strengths: [
      ...selectedFacts.filter((item) => item.essential).map((item) => `「${item.text}」は引継ぎに必要な情報です。`),
      ...(handoff?.quality === 'best' ? ['重要情報を自然な一文へ圧縮して伝えられました。'] : []),
    ],
    missed: [
      ...missedEssential.map((item) => `重要情報「${item.text}」を引き継げていません。`),
      ...selectedFacts.filter((item) => !item.essential).map((item) => `「${item.text}」は今回の専門スタッフの判断には優先度が低い情報です。`),
      ...(handoff && handoff.quality !== 'best' ? [handoff.explanation] : []),
    ],
    nextTime: [
      '次の担当者が何を判断する必要があるかを先に考える。',
      '症状・用途・期限・手続き条件など、判断を変える情報を優先する。',
      'メモで選んだ重要情報が、最終の英語引継ぎにも入っているか確認する。',
    ],
  }
}


export function scoreIncidentInvestigation(
  activity: Chapter1IncidentInvestigationActivity,
  interviewIds: string[],
  conclusionId: string,
): Chapter1Result {
  const selectedWitnesses = interviewIds
    .map((id) => activity.witnesses.find((witness) => witness.id === id))
    .filter((item): item is Chapter1IncidentWitness => Boolean(item))
  const evidenceValue = selectedWitnesses.reduce((sum, witness) => sum + witness.value, 0)
  const bestEvidenceValue = [...activity.witnesses]
    .sort((a, b) => b.value - a.value)
    .slice(0, activity.maxInterviews)
    .reduce((sum, witness) => sum + witness.value, 0)
  const evidencePoints = bestEvidenceValue > 0 ? Math.round((evidenceValue / bestEvidenceValue) * 30) : 0
  const conclusion = activity.conclusions.find((item) => item.id === conclusionId)
  const correct = activity.conclusions.find((item) => item.correct)
  const inferencePoints = conclusion?.correct ? 70 : 0
  const missedCritical = activity.witnesses.filter((witness) => !interviewIds.includes(witness.id) && witness.value >= 5)
  const lowValue = selectedWitnesses.filter((witness) => witness.value <= 1)

  return {
    total: Math.min(100, evidencePoints + inferencePoints),
    breakdown: [
      {
        label: 'Evidence Selection',
        points: evidencePoints,
        max: 30,
        explanation: `選んだ証言の証拠価値 ${evidenceValue}/${bestEvidenceValue} を30点満点へ換算しています。`,
      },
      {
        label: 'Inference',
        points: inferencePoints,
        max: 70,
        explanation: conclusion?.correct
          ? '収集した証拠と最終結論が一致しています。'
          : `選んだ結論は証拠と十分に一致しません。最も妥当なのは「${correct?.text ?? ''}」です。`,
      },
    ],
    strengths: [
      ...selectedWitnesses.filter((witness) => witness.value >= 5).map((witness) => `${witness.name} の証言は時系列や原因を直接支える重要証拠です。`),
      ...(conclusion?.correct ? ['証拠の強さに合う結論を選べました。'] : []),
    ],
    missed: [
      ...missedCritical.map((witness) => `${witness.name} の重要証言を聞き逃しました。`),
      ...lowValue.map((witness) => `${witness.name} の証言は限られた聞き込み枠に対する情報量が少なめでした。`),
      ...(!conclusion?.correct ? ['最終結論を、最も強い証拠2つが同時に説明できるか確認してください。'] : []),
    ],
    nextTime: [
      '時系列の空白を直接埋める人物から聞く。',
      '「見た事実」と「推測」を区別して結論を選ぶ。',
    ],
  }
}

export function scoreRapid(
  activity: Chapter1RapidActivity,
  selectedChoiceIds: string[],
): Chapter1Result {
  const maxPerScenario = activity.scenarios.map((scenario) => Math.max(...scenario.choices.map((choice) => choice.points)))
  const max = maxPerScenario.reduce((sum, value) => sum + value, 0)
  const chosen = activity.scenarios.map((scenario, index) => scenario.choices.find((choice) => choice.id === selectedChoiceIds[index]))
  const raw = chosen.reduce((sum, choice) => sum + (choice?.points ?? 0), 0)
  const total = max > 0 ? Math.round((raw / max) * 100) : 0
  const poor = chosen.filter((choice) => choice && choice.quality !== 'best')

  return {
    total,
    breakdown: [{
      label: 'Rush Accuracy',
      points: total,
      max: 100,
      explanation: `${activity.scenarios.length}件の連続対応で、最善回答にどれだけ近かったかを評価しています。`,
    }],
    strengths: chosen.filter((choice) => choice?.quality === 'best').map((choice) => `「${choice?.text}」は適切な即時対応でした。`),
    missed: poor.map((choice) => choice?.explanation ?? '').filter(Boolean),
    nextTime: ['急いでいても、客が求めている行動を一度頭の中で言語化してから回答する。'],
  }
}
