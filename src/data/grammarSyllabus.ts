import type { GrammarKey } from '../core/grammar.js'

/**
 * Canonical target map by Shift. This is the curriculum layer, separate from
 * the human-facing `newLanguage` strings in chapter data.
 */
export const dayGrammarTargets: Record<number, GrammarKey[]> = {
  1: ['BASIC_BE', 'DO_QUESTIONS', 'AFFIRMATIVE_NEGATIVE', 'PRONOUNS_DEMONSTRATIVES'],
  2: ['WH_QUESTIONS', 'THERE_IS_ARE', 'BASIC_PREPOSITIONS'],
  3: ['HOW_MUCH_MANY', 'CAN_PERMISSION', 'OR_QUESTIONS'],
  4: ['PRESENT_PROGRESSIVE', 'IMPERATIVE_PLEASE'],
  5: ['WH_QUESTIONS', 'AFFIRMATIVE_NEGATIVE'],
  6: [],
  7: ['WHICH_CHOICE', 'WHOSE_POSSESSION', 'SUBSTITUTION_ONE_OTHER'],
  8: ['COMPARISON_BASIC', 'TOO_ENOUGH'],
  9: ['TO_INFINITIVE', 'GERUND'],
  10: ['PAST_SIMPLE', 'PAST_PROGRESSIVE', 'FUTURE_WILL', 'FUTURE_GOING_TO'],
  11: ['SUBSTITUTION_ONE_OTHER', 'REASON_CONTRAST_CONJUNCTIONS'],
  12: ['COMPARISON_BASIC'],
  13: ['PRESENT_PERFECT', 'PERFECT_ADVERBS'],
  14: ['FOR_SINCE', 'PRESENT_PERFECT_PROGRESSIVE'],
  15: ['SHOULD', 'MUST_HAVE_TO'],
  16: ['MAY_MIGHT', 'CONDITIONS_BASIC'],
  17: ['CONDITIONS_BASIC', 'CONDITIONAL_SECOND_ADVICE'],
  18: [],
  19: ['PASSIVE', 'PARTICIPLE_ADJECTIVES'],
  20: ['RELATIVE_PRONOUNS', 'RELATIVE_ADVERBS', 'RELATIVE_OBJECT'],
  21: ['INDIRECT_QUESTIONS'],
  22: ['SVOO', 'SVOC', 'MAKE_KEEP_LET', 'IT_IS_TO', 'HOW_TO'],
  23: ['REASON_CONTRAST_CONJUNCTIONS'],
  24: ['OBJECT_TO_INFINITIVE', 'REPORTED_SPEECH'],
  25: ['ARTICLES_COUNTABILITY', 'OR_QUESTIONS'],
  26: ['QUANTIFIERS'],
  27: ['POLITE_WOULD_COULD', 'POLITE_FORMAL_REQUESTS'],
  28: ['CONDITIONS_BASIC'],
  29: ['SUBSTITUTION_ONE_OTHER', 'NOUN_CLAUSES'],
  30: [],
  31: ['PAST_PERFECT', 'PAST_PERFECT_PROGRESSIVE'],
  32: ['REPORTED_SPEECH'],
  33: ['MODAL_PERFECT'],
  34: ['BE_SUPPOSED_TO', 'SEEM_APPEAR_TO', 'PERFECT_INFINITIVE'],
  35: ['NEGATIVE_QUESTIONS', 'TAG_QUESTIONS'],
  36: [],
  37: ['CONDITIONAL_SECOND'],
  38: ['CONDITIONAL_THIRD'],
  39: ['WISH', 'AS_IF_THOUGH'],
  40: ['COMPARISON_ADVANCED'],
  41: ['PARTIAL_NEGATION', 'LIMITED_FREQUENCY_STATE', 'INANIMATE_SUBJECT_EFFECT'],
  42: [],
  43: ['DISCOURSE_CONNECTORS'],
  44: ['NOUN_CLAUSES', 'APPOSITION'],
  45: ['PARTICIPIAL_CONSTRUCTIONS', 'PAST_PERFECT_PROGRESSIVE'],
  46: ['POLITE_FORMAL_REQUESTS', 'EMPHASIS_CLEFT', 'INVERSION'],
  47: [],
  48: [],
}

/** Explicit overrides are used when legacy free-form labels are ambiguous. */
export const activityGrammarOverrides: Record<string, { target?: GrammarKey[]; review?: GrammarKey[]; exposure?: GrammarKey[] }> = {
  'd45-passport-incident': { exposure: ['PARTICIPIAL_CONSTRUCTIONS'] },
  'd45-delivery-trace': { exposure: ['RELATIVE_ADVERBS'] },
}

/** Non-grammar labels currently mixed into the legacy `grammar` field. */
export const knownCommunicationLabels = new Set([
  'basic adjectives', 'numbers', 'need', 'payment', 'payment confirmation', 'color',
  'ingredient language', 'order language', 'staff handoff', 'policy', 'policy language',
  'time constraints', 'cause/effect', 'comparison', 'formal register', 'formal requests',
  'purpose', 'before / after', 'by the time', 'polite clarification', 'Level 1 mixed', 'LEVEL 1 ALL', 'Chapter 1 review', 'Chapter 2 all',
  'Chapter 4 all', 'Chapter 5 all', 'Chapter 6 all',
])
