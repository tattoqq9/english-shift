import type { Customer, CustomerQuestion } from './types.js'

export function questionInformationGain(
  customer: Customer,
  question: CustomerQuestion,
  revealedFactKeys: ReadonlySet<string>,
): number {
  return question.reveals.reduce((sum, key) => {
    if (revealedFactKeys.has(key)) return sum
    const fact = customer.facts.find((item) => item.key === key)
    return sum + (fact?.decisionWeight ?? 0)
  }, 0)
}

export function initialRevealedFacts(customer: Customer): Set<string> {
  return new Set(
    customer.facts.filter((fact) => fact.revealedAtStart).map((fact) => fact.key),
  )
}
