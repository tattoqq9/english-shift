import type { BuildActivity, BuildCheck, BuildScore } from './build.js'

type FreeBuildActivity = BuildActivity & {
  acceptedFreeAnswers?: string[]
}

export type FreeBuildDiagnosis = {
  check: BuildCheck
  exact: boolean
  feedback: string
  characterSimilarity: number
  tokenSimilarity: number
  contentCoverage: number
  target: string
}

const EXPANSIONS: Record<string, string[]> = {
  "i'm": ['i', 'am'],
  "you're": ['you', 'are'],
  "we're": ['we', 'are'],
  "they're": ['they', 'are'],
  "i've": ['i', 'have'],
  "you've": ['you', 'have'],
  "we've": ['we', 'have'],
  "they've": ['they', 'have'],
  "i'll": ['i', 'will'],
  "you'll": ['you', 'will'],
  "he'll": ['he', 'will'],
  "she'll": ['she', 'will'],
  "it'll": ['it', 'will'],
  "we'll": ['we', 'will'],
  "they'll": ['they', 'will'],
  "can't": ['can', 'not'],
  "cannot": ['can', 'not'],
  "won't": ['will', 'not'],
  "don't": ['do', 'not'],
  "doesn't": ['does', 'not'],
  "didn't": ['did', 'not'],
  "isn't": ['is', 'not'],
  "aren't": ['are', 'not'],
  "wasn't": ['was', 'not'],
  "weren't": ['were', 'not'],
  "haven't": ['have', 'not'],
  "hasn't": ['has', 'not'],
  "hadn't": ['had', 'not'],
  "couldn't": ['could', 'not'],
  "wouldn't": ['would', 'not'],
  "shouldn't": ['should', 'not'],
  "mustn't": ['must', 'not'],
}

const CONTENT_STOPWORDS = new Set([
  'a', 'an', 'the', 'to', 'of', 'for', 'at', 'in', 'on', 'by', 'with',
  'and', 'or', 'but', 'so', 'as', 'that', 'this', 'it', 'is', 'are',
  'am', 'was', 'were', 'be', 'been', 'being',
])

const MODALS = new Set(['can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must'])

function surfaceTokens(text: string) {
  return text
    .normalize('NFKC')
    .replace(/[’‘‛`´]/g, "'")
    .replace(/[–—−]/g, '-')
    .toLowerCase()
    .replace(/(^|[\s([{])['"]+/g, '$1')
    .replace(/['"]+(?=$|[\s)\]}])/g, '')
    .replace(/[^a-z0-9'\-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

function contextualExpansion(token: string, next?: string): string[] | null {
  if (!["he's", "she's", "it's", "that's", "there's", "what's", "who's"].includes(token)) return null
  const subject = token.slice(0, -2)
  const auxiliary = next === 'been' || next === 'got' || next === 'had' ? 'has' : 'is'
  return [subject, auxiliary]
}

export function freeBuildTokens(text: string) {
  const raw = surfaceTokens(text)
  const result: string[] = []

  raw.forEach((token, index) => {
    const expanded = EXPANSIONS[token] ?? contextualExpansion(token, raw[index + 1])
    if (expanded) result.push(...expanded)
    else result.push(token)
  })

  return result
}

export function normalizeFreeBuildText(text: string) {
  return freeBuildTokens(text).join(' ')
}

export function freeBuildSignature(text: string) {
  return normalizeFreeBuildText(text)
}

export type StandardFreeBuildDecision = {
  eligible: boolean
  risk: number
  words: number
  sentences: number
  clauses: number
  flags: string[]
}

function freeBuildSentenceCount(text: string) {
  const pieces = text.split(/[.!?]+(?=\s|$)/).map((item) => item.trim()).filter(Boolean)
  return Math.max(1, pieces.length)
}

function freeBuildClauseCount(text: string) {
  const matches = text.toLowerCase().match(/\b(and|but|so|because|if|when|while|although|though|whether|that|which|who|where|before|after|until|unless|therefore|however)\b/g)
  return matches?.length ?? 0
}

function freeBuildHasNumberOrCode(text: string) {
  return /\b\d[\d:-]*\b/.test(text) || /\b[A-Z]-?\d{2,}\b/.test(text)
}

function freeBuildOptionalOpening(text: string) {
  return /^(yes|no|okay|sure|of course|i'm sorry|i am sorry|let me|certainly)[,.\s]/i.test(
    text.replace(/[’‘‛`´]/g, "'"),
  )
}

/**
 * Standard mode uses Free typing only when the audited target is suitable for
 * exact, deterministic production on mobile. HIGH-risk responses fall back to
 * Semi-guided chunks. Challenge mode intentionally ignores this gate.
 */
export function standardFreeBuildDecision(activity: BuildActivity): StandardFreeBuildDecision {
  const words = freeBuildTokens(activity.targetSentence).length
  const sentences = freeBuildSentenceCount(activity.targetSentence)
  const clauses = freeBuildClauseCount(activity.targetSentence)
  const flags: string[] = []
  let risk = 0

  if (words >= 24) { risk += 4; flags.push('very-long>=24w') }
  else if (words >= 18) { risk += 2; flags.push('long>=18w') }

  if (sentences >= 3) { risk += 5; flags.push('3+-sentences') }
  else if (sentences === 2) { risk += 3; flags.push('multi-sentence') }

  if (clauses >= 3) { risk += 2; flags.push('3+-clause-markers') }
  else if (clauses === 2) { risk += 1; flags.push('2-clause-markers') }

  if (freeBuildHasNumberOrCode(activity.targetSentence)) { risk += 2; flags.push('number/code') }
  if (/[;:]/.test(activity.targetSentence)) { risk += 1; flags.push('semicolon/colon') }
  if (freeBuildOptionalOpening(activity.targetSentence)) { risk += 1; flags.push('optional-opening') }

  const hasTargetGrammar = activity.grammarTargets.some((ref) => ref.role === 'target')
  if (!hasTargetGrammar) { risk += 1; flags.push('no-explicit-target-grammar') }

  return { eligible: risk < 5, risk, words, sentences, clauses, flags }
}

function levenshtein<T>(left: T[], right: T[]) {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index)
  const current = Array<number>(right.length + 1).fill(0)

  for (let i = 1; i <= left.length; i += 1) {
    current[0] = i
    for (let j = 1; j <= right.length; j += 1) {
      const substitution = previous[j - 1] + (left[i - 1] === right[j - 1] ? 0 : 1)
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        substitution,
      )
    }
    for (let j = 0; j <= right.length; j += 1) previous[j] = current[j]
  }

  return previous[right.length]
}

function similarityFromDistance(distance: number, maxLength: number) {
  if (maxLength <= 0) return distance === 0 ? 1 : 0
  return Math.max(0, 1 - distance / maxLength)
}

function characterSimilarity(left: string, right: string) {
  const a = [...left]
  const b = [...right]
  return similarityFromDistance(levenshtein(a, b), Math.max(a.length, b.length))
}

function tokenSimilarity(left: string[], right: string[]) {
  return similarityFromDistance(levenshtein(left, right), Math.max(left.length, right.length))
}

function wordSimilarity(left: string, right: string) {
  if (left === right) return 1
  return characterSimilarity(left, right)
}

function coverageAgainst(targetTokens: string[], answerTokens: string[]) {
  const targetContent = targetTokens.filter((token) => !CONTENT_STOPWORDS.has(token))
  const basis = targetContent.length ? targetContent : targetTokens
  if (!basis.length) return answerTokens.length ? 0 : 1

  const remaining = [...answerTokens]
  let matched = 0

  for (const target of basis) {
    let bestIndex = -1
    let bestScore = 0
    remaining.forEach((candidate, index) => {
      const score = wordSimilarity(target, candidate)
      if (score > bestScore) {
        bestScore = score
        bestIndex = index
      }
    })
    const threshold = target.length <= 3 ? 1 : target.length <= 5 ? 0.8 : 0.74
    if (bestIndex >= 0 && bestScore >= threshold) {
      matched += 1
      remaining.splice(bestIndex, 1)
    }
  }

  return matched / basis.length
}

function modalSequence(tokens: string[]) {
  return tokens.filter((token) => MODALS.has(token))
}

function modalMismatch(target: string[], answer: string[]) {
  const targetModals = modalSequence(target)
  const answerModals = modalSequence(answer)

  if (!targetModals.length && !answerModals.length) return false
  if (targetModals.length !== answerModals.length) return true

  return targetModals.some((modal, index) => modal !== answerModals[index])
}

function negationMismatch(target: string[], answer: string[]) {
  return target.includes('not') !== answer.includes('not')
}

function longestExactPrefix(target: string[], answer: string[]) {
  let index = 0
  while (index < target.length && index < answer.length && target[index] === answer[index]) index += 1
  return index
}

function acceptedTargets(activity: FreeBuildActivity) {
  return [
    activity.targetSentence,
    ...(activity.acceptedFreeAnswers ?? []),
  ].filter((value, index, values) => value.trim() && values.indexOf(value) === index)
}

function diagnoseAgainst(target: string, input: string): FreeBuildDiagnosis {
  const targetSignature = normalizeFreeBuildText(target)
  const answerSignature = normalizeFreeBuildText(input)
  const targetTokens = freeBuildTokens(target)
  const answerTokens = freeBuildTokens(input)

  if (!answerSignature) {
    return {
      check: 'not_quite',
      exact: false,
      feedback: '英文を入力してからチェックしましょう。',
      characterSimilarity: 0,
      tokenSimilarity: 0,
      contentCoverage: 0,
      target,
    }
  }

  if (answerSignature === targetSignature) {
    return {
      check: 'correct',
      exact: true,
      feedback: '正解です。自分で英文を組み立てられています。',
      characterSimilarity: 1,
      tokenSimilarity: 1,
      contentCoverage: 1,
      target,
    }
  }

  const charScore = characterSimilarity(targetSignature, answerSignature)
  const tokenScore = tokenSimilarity(targetTokens, answerTokens)
  const coverage = coverageAgainst(targetTokens, answerTokens)

  if (negationMismatch(targetTokens, answerTokens)) {
    return {
      check: 'not_quite',
      exact: false,
      feedback: '肯定・否定の意味が変わっています。not / n’t の有無を確認しましょう。',
      characterSimilarity: charScore,
      tokenSimilarity: tokenScore,
      contentCoverage: coverage,
      target,
    }
  }

  if (modalMismatch(targetTokens, answerTokens)) {
    return {
      check: 'not_quite',
      exact: false,
      feedback: '依頼・可能・義務などのニュアンスを作る助動詞が違います。Customerへの伝え方を確認しましょう。',
      characterSimilarity: charScore,
      tokenSimilarity: tokenScore,
      contentCoverage: coverage,
      target,
    }
  }

  const lengthRatio = answerTokens.length / Math.max(1, targetTokens.length)
  const almost =
    (charScore >= 0.91 && lengthRatio >= 0.72 && lengthRatio <= 1.28)
    || (tokenScore >= 0.84 && coverage >= 0.82 && lengthRatio >= 0.72 && lengthRatio <= 1.28)
    || (charScore >= 0.84 && coverage >= 0.9 && lengthRatio >= 0.78 && lengthRatio <= 1.22)

  if (almost) {
    let feedback = 'かなり近いです。スペル、語形、冠詞・前置詞などの短い語を見直してみましょう。'
    if (lengthRatio < 0.88) feedback = 'かなり近いです。必要な語が1つ前後抜けていないか確認しましょう。'
    else if (lengthRatio > 1.14) feedback = 'かなり近いです。意味に不要な語が混ざっていないか確認しましょう。'
    else if (coverage >= 0.84 && tokenScore < 0.84) feedback = '使っている語はかなり近いです。英語の語順をもう一度確認しましょう。'

    return {
      check: 'almost',
      exact: false,
      feedback,
      characterSimilarity: charScore,
      tokenSimilarity: tokenScore,
      contentCoverage: coverage,
      target,
    }
  }

  if (lengthRatio < 0.68) {
    return {
      check: 'not_quite',
      exact: false,
      feedback: '返答に必要な意味がまだ足りません。YOUR INTENTとHintを見て、伝える内容を追加しましょう。',
      characterSimilarity: charScore,
      tokenSimilarity: tokenScore,
      contentCoverage: coverage,
      target,
    }
  }

  if (lengthRatio > 1.35) {
    return {
      check: 'not_quite',
      exact: false,
      feedback: '返答に不要な語が多く含まれています。YOUR INTENTに必要な内容へ絞りましょう。',
      characterSimilarity: charScore,
      tokenSimilarity: tokenScore,
      contentCoverage: coverage,
      target,
    }
  }

  return {
    check: 'not_quite',
    exact: false,
    feedback: coverage >= 0.68
      ? '必要な語はいくつか入っています。語順と文法の形を見直して、Customerへ自然に伝わる一文にしましょう。'
      : 'YOUR INTENTに必要な意味と文法の形をもう一度確認しましょう。Hintを使って骨格から作り直せます。',
    characterSimilarity: charScore,
    tokenSimilarity: tokenScore,
    contentCoverage: coverage,
    target,
  }
}

export function diagnoseFreeBuild(activity: BuildActivity, input: string): FreeBuildDiagnosis {
  const diagnoses = acceptedTargets(activity as FreeBuildActivity).map((target) => diagnoseAgainst(target, input))
  const exact = diagnoses.find((item) => item.exact)
  if (exact) return exact

  return diagnoses.sort((left, right) => {
    const leftScore = left.characterSimilarity * 0.35 + left.tokenSimilarity * 0.4 + left.contentCoverage * 0.25
    const rightScore = right.characterSimilarity * 0.35 + right.tokenSimilarity * 0.4 + right.contentCoverage * 0.25
    return rightScore - leftScore
  })[0]
}

export function scoreFreeBuild(
  activity: BuildActivity,
  input: string,
  attempts: number,
  hintsUsed: number,
  revealed = false,
): BuildScore {
  const diagnosis = diagnoseFreeBuild(activity, input)
  const targetTokens = freeBuildTokens(diagnosis.target)
  const answerTokens = freeBuildTokens(input)
  const correctPrefix = longestExactPrefix(targetTokens, answerTokens)

  if (revealed) {
    return {
      score: Math.max(30, 50 - hintsUsed * 5),
      exact: false,
      check: 'not_quite',
      attempts,
      hintsUsed,
      correctPrefix,
      targetCount: targetTokens.length,
      distractorsUsed: 0,
      feedback: '正解例を確認しました。少し時間を空けて、次はキーボードだけで自力で作ってみましょう。',
    }
  }

  if (diagnosis.exact) {
    const attemptPenalty = Math.max(0, attempts - 1) * 5
    const hintPenalty = hintsUsed * 5
    return {
      score: Math.max(70, 100 - attemptPenalty - hintPenalty),
      exact: true,
      check: 'correct',
      attempts,
      hintsUsed,
      correctPrefix,
      targetCount: targetTokens.length,
      distractorsUsed: 0,
      feedback: diagnosis.feedback,
    }
  }

  const weighted = Math.round(
    diagnosis.characterSimilarity * 25
    + diagnosis.tokenSimilarity * 40
    + diagnosis.contentCoverage * 35,
  )
  const ceiling = diagnosis.check === 'almost' ? 85 : 72

  return {
    score: Math.max(0, Math.min(ceiling, weighted)),
    exact: false,
    check: diagnosis.check,
    attempts,
    hintsUsed,
    correctPrefix,
    targetCount: targetTokens.length,
    distractorsUsed: 0,
    feedback: diagnosis.feedback,
  }
}
