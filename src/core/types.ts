export type GrammarTag =
  | 'WH_QUESTION'
  | 'COMPARATIVE'
  | 'MODAL'
  | 'PRESENT_PERFECT'
  | 'CONJUNCTION'
  | 'POLITE_REQUEST'
  | 'PAST_SIMPLE'
  | 'PASSIVE'
  | 'CONDITIONAL'
  | 'INDIRECT_QUESTION'
  | 'PRESENT_PERFECT_CONTINUOUS'
  | 'MODAL_PERFECT'

export type NeedKey =
  | 'priceValue'
  | 'waterResistance'
  | 'lightWeight'
  | 'soundQuality'
  | 'simpleControls'
  | 'callQuality'
  | 'batteryLife'
  | 'performance'
  | 'portability'
  | 'durability'
  | 'screenQuality'
  | 'healthTracking'

export interface NeedProfile {
  weights: Partial<Record<NeedKey, number>>
}

export interface Product {
  id: string
  category: 'earphones' | 'laptop' | 'smartwatch'
  name: string
  price: number
  description: string
  features: Partial<Record<NeedKey, number>>
}

export interface CustomerFact {
  key: string
  label: string
  value: string
  decisionWeight: number
  revealedAtStart?: boolean
}

export interface CustomerQuestion {
  id: string
  text: string
  response: string
  reveals: string[]
  grammarTags: GrammarTag[]
  patienceCost: number
}

export interface Customer {
  id: string
  name: string
  age: number
  category: Product['category']
  roleLabel: string
  openingLine: string
  patience: number
  budget: number
  budgetFlex: number
  needs: NeedProfile
  facts: CustomerFact[]
  questions: CustomerQuestion[]
  optimalQuestionCount: number
}

export interface MatchBreakdown {
  needFit: number
  budgetPenalty: number
  finalScore: number
}

export interface RecommendationResult {
  match: MatchBreakdown
  choiceQuality: number
  matchPoints: number
  efficiencyBonus: number
  informationBonus: number
  totalPoints: number
  trustDelta: number
}
