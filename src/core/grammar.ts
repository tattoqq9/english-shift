export type GrammarTier = 'ES-G1' | 'ES-G2' | 'ES-G3'
export type GrammarRole = 'target' | 'review' | 'exposure'
export type GrammarAudience = 'university-entrance' | 'toeic'
export type GrammarStatus = 'complete' | 'partial' | 'missing' | 'preview'

export type GrammarKey =
  | 'BASIC_BE'
  | 'DO_QUESTIONS'
  | 'AFFIRMATIVE_NEGATIVE'
  | 'PRONOUNS_DEMONSTRATIVES'
  | 'WH_QUESTIONS'
  | 'HOW_MUCH_MANY'
  | 'CAN_PERMISSION'
  | 'IMPERATIVE_PLEASE'
  | 'PRESENT_PROGRESSIVE'
  | 'THERE_IS_ARE'
  | 'BASIC_PREPOSITIONS'
  | 'PAST_SIMPLE'
  | 'PAST_PROGRESSIVE'
  | 'FUTURE_WILL'
  | 'FUTURE_GOING_TO'
  | 'COMPARISON_BASIC'
  | 'WHICH_CHOICE'
  | 'WHOSE_POSSESSION'
  | 'TO_INFINITIVE'
  | 'GERUND'
  | 'TOO_ENOUGH'
  | 'SUBSTITUTION_ONE_OTHER'
  | 'PRESENT_PERFECT'
  | 'PERFECT_ADVERBS'
  | 'FOR_SINCE'
  | 'PRESENT_PERFECT_PROGRESSIVE'
  | 'SHOULD'
  | 'MUST_HAVE_TO'
  | 'MAY_MIGHT'
  | 'CONDITIONS_BASIC'
  | 'CONDITIONAL_SECOND_ADVICE'
  | 'PASSIVE'
  | 'PARTICIPLE_ADJECTIVES'
  | 'RELATIVE_PRONOUNS'
  | 'RELATIVE_ADVERBS'
  | 'INDIRECT_QUESTIONS'
  | 'NOUN_CLAUSES'
  | 'SVOO'
  | 'SVOC'
  | 'MAKE_KEEP_LET'
  | 'OBJECT_TO_INFINITIVE'
  | 'IT_IS_TO'
  | 'HOW_TO'
  | 'REASON_CONTRAST_CONJUNCTIONS'
  | 'ARTICLES_COUNTABILITY'
  | 'QUANTIFIERS'
  | 'POLITE_WOULD_COULD'
  | 'POLITE_FORMAL_REQUESTS'
  | 'PAST_PERFECT'
  | 'REPORTED_SPEECH'
  | 'MODAL_PERFECT'
  | 'BE_SUPPOSED_TO'
  | 'SEEM_APPEAR_TO'
  | 'PERFECT_INFINITIVE'
  | 'NEGATIVE_QUESTIONS'
  | 'TAG_QUESTIONS'
  | 'CONDITIONAL_SECOND'
  | 'CONDITIONAL_THIRD'
  | 'WISH'
  | 'AS_IF_THOUGH'
  | 'COMPARISON_ADVANCED'
  | 'PARTIAL_NEGATION'
  | 'LIMITED_FREQUENCY_STATE'
  | 'INANIMATE_SUBJECT_EFFECT'
  | 'PARTICIPIAL_CONSTRUCTIONS'
  | 'APPOSITION'
  | 'EMPHASIS_CLEFT'
  | 'INVERSION'
  | 'DISCOURSE_CONNECTORS'
  | 'OR_QUESTIONS'
  | 'EXCLAMATIONS'
  | 'SVC_LINKING_VERBS'
  | 'ADJECTIVE_THAT_CLAUSE'
  | 'RELATIVE_OBJECT'
  | 'PAST_PERFECT_PROGRESSIVE'
  | 'RELATIVE_NONRESTRICTIVE'
  | 'RELATIVE_PREPOSITION'
  | 'RELATIVE_WHAT'
  | 'FUTURE_PROGRESSIVE'
  | 'FUTURE_PERFECT'
  | 'INFINITIVE_PASSIVE'
  | 'GERUND_PERFECT_PASSIVE'
  | 'USED_TO'
  | 'HAD_BETTER_OUGHT_TO'
  | 'CAUSATIVE_HAVE_GET_PP'
  | 'PERCEPTION_OBJECT_COMPLEMENT'
  | 'FORMAL_CONDITIONALS'
  | 'IF_NOT_FOR_WITHOUT'
  | 'COMPARATIVE_CORRELATIVE'
  | 'ADVANCED_QUANTITY_COMPARISON'
  | 'SUBJECT_VERB_AGREEMENT'
  | 'WORD_FORM'
  | 'MODIFIER_PLACEMENT'
  | 'PREPOSITION_CONJUNCTION_CHOICE'
  | 'PRONOUN_REFERENCE'
  | 'PARALLELISM_ELLIPSIS'

export interface GrammarTargetRef {
  key: GrammarKey
  role: GrammarRole
}

export interface GrammarConcept {
  key: GrammarKey
  label: string
  labelJa: string
  tier: GrammarTier
  audiences: GrammarAudience[]
  level1Expected: boolean
  postgameExpected: boolean
  minimumTargets: number
  minimumReviews: number
  note?: string
}

export interface GrammarCoverageEntry {
  key: GrammarKey
  tier: GrammarTier
  targetCount: number
  reviewCount: number
  exposureCount: number
  firstDay?: number
  lastDay?: number
  status: GrammarStatus
}
