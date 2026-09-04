import type { Customer, MatchBreakdown, Product, RecommendationResult } from './types.js'

const clamp01 = (value: number) => Math.max(0, Math.min(1, value))
const clamp100 = (value: number) => Math.max(0, Math.min(100, value))

export function calculateNeedFit(customer: Customer, product: Product): number {
  const entries = Object.entries(customer.needs.weights)
  let weightedFit = 0
  let totalWeight = 0

  for (const [key, rawWeight] of entries) {
    const weight = rawWeight ?? 0
    if (weight <= 0) continue
    const feature = product.features[key as keyof typeof product.features] ?? 0
    weightedFit += clamp01(feature) * weight
    totalWeight += weight
  }

  return totalWeight === 0 ? 0 : (weightedFit / totalWeight) * 100
}

export function calculateBudgetPenalty(customer: Customer, product: Product): number {
  if (product.price <= customer.budget) return 0

  const hardLimit = customer.budget * (1 + customer.budgetFlex)
  if (product.price >= hardLimit) return 45

  const overRatio = (product.price - customer.budget) / customer.budget
  const flex = Math.max(customer.budgetFlex, 0.01)
  return Math.min(45, (overRatio / flex) * 35)
}

export function calculateMatch(customer: Customer, product: Product): MatchBreakdown {
  const needFit = calculateNeedFit(customer, product)
  const budgetPenalty = calculateBudgetPenalty(customer, product)
  return {
    needFit,
    budgetPenalty,
    finalScore: clamp100(needFit - budgetPenalty),
  }
}

export function calculateEfficiencyBonus(
  matchScore: number,
  questionCount: number,
  optimalQuestionCount: number,
): number {
  if (matchScore < 90) return 0
  const extraQuestions = Math.max(0, questionCount - optimalQuestionCount)
  return Math.max(0, 30 - extraQuestions * 10)
}

export function calculateInformationBonus(
  customer: Customer,
  revealedFactKeys: ReadonlySet<string>,
): number {
  const weight = customer.facts
    .filter((fact) => revealedFactKeys.has(fact.key))
    .reduce((sum, fact) => sum + fact.decisionWeight, 0)

  return Math.min(15, Math.round(weight * 2))
}

export function calculateRecommendationResult(args: {
  customer: Customer
  product: Product
  questionCount: number
  revealedFactKeys: ReadonlySet<string>
  bestAvailableScore: number
}): RecommendationResult {
  const match = calculateMatch(args.customer, args.product)
  const choiceQuality = args.bestAvailableScore <= 0
    ? 0
    : clamp100((match.finalScore / args.bestAvailableScore) * 100)
  const matchPoints = Math.round(choiceQuality)
  const efficiencyBonus = calculateEfficiencyBonus(
    choiceQuality,
    args.questionCount,
    args.customer.optimalQuestionCount,
  )
  const informationBonus = calculateInformationBonus(args.customer, args.revealedFactKeys)
  const trustDelta = match.finalScore >= 90 ? 12 : match.finalScore >= 70 ? 3 : -12

  return {
    match,
    choiceQuality,
    matchPoints,
    efficiencyBonus,
    informationBonus,
    totalPoints: matchPoints + efficiencyBonus + informationBonus,
    trustDelta,
  }
}
