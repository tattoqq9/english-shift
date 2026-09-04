import type { GrammarKey } from '../core/grammar.js'
import { postgameG3Keys } from './grammarRegistry.js'
import { examModules } from './postgameActivities.js'

export interface PostgameGrammarModule {
  id: string
  title: string
  titleJa: string
  focus: string
  grammarKeys: GrammarKey[]
  examFocus: ('university-entrance' | 'toeic')[]
  activityIds?: string[]
}

/**
 * Post-Level-1 expansion. It is intentionally not a Chapter 9: the player has
 * already finished the story curriculum and now enters an exam-focused mode.
 */
export const esG3Postgame = {
  id: 'exam-shift-advanced',
  title: 'Exam Shift: Advanced',
  titleJa: 'Exam Shift: Advanced — 受験・TOEIC発展',
  unlock: {
    requiredLevel1Shifts: 48,
    requiredLevel1Chapters: 8,
  },
  completionGoal: {
    tier: 'ES-G3' as const,
    requiredCoveragePercent: 100,
  },
  principles: [
    '大学受験向けの構文認識と、TOEIC向けの高速な文法判断を両立する。',
    '文法名を当てるだけでなく、業務文脈・通知・メール・会話で意味を処理する。',
    'Level 1のVisual Grammarを再利用し、UI学習コストを増やさない。',
  ],
  modules: [
    {
      id: 'g3-compressed-english',
      title: 'Compressed English',
      titleJa: '圧縮された英文',
      focus: '分詞構文・同格・非制限関係詞を短い社内文書や案内で処理する。',
      grammarKeys: ['PARTICIPIAL_CONSTRUCTIONS', 'APPOSITION', 'RELATIVE_NONRESTRICTIVE', 'RELATIVE_PREPOSITION', 'RELATIVE_WHAT'],
      examFocus: ['university-entrance', 'toeic'],
    },
    {
      id: 'g3-time-aspect',
      title: 'Time & Aspect',
      titleJa: '時制・完了の発展',
      focus: '未来進行・未来完了・完了不定詞などから時系列を正確に復元する。',
      grammarKeys: ['PERFECT_INFINITIVE', 'FUTURE_PROGRESSIVE', 'FUTURE_PERFECT', 'INFINITIVE_PASSIVE', 'GERUND_PERFECT_PASSIVE'],
      examFocus: ['university-entrance', 'toeic'],
    },
    {
      id: 'g3-formal-structures',
      title: 'Formal Structures',
      titleJa: '強調・倒置・条件表現',
      focus: '大学受験で頻出する構文を、VIP案内・規約・社内通知の意味処理として扱う。',
      grammarKeys: ['EMPHASIS_CLEFT', 'INVERSION', 'FORMAL_CONDITIONALS', 'IF_NOT_FOR_WITHOUT'],
      examFocus: ['university-entrance'],
    },
    {
      id: 'g3-verb-patterns',
      title: 'Verb Patterns',
      titleJa: '動詞構文の発展',
      focus: 'used to、使役・知覚、助言表現を会話・トラブル対応に結び付ける。',
      grammarKeys: ['USED_TO', 'HAD_BETTER_OUGHT_TO', 'CAUSATIVE_HAVE_GET_PP', 'PERCEPTION_OBJECT_COMPLEMENT'],
      examFocus: ['university-entrance', 'toeic'],
    },
    {
      id: 'g3-comparison-logic',
      title: 'Comparison & Logic',
      titleJa: '比較・論理の発展',
      focus: '比較相関・数量比較を、価格・納期・性能比較で高速処理する。',
      grammarKeys: ['COMPARATIVE_CORRELATIVE', 'ADVANCED_QUANTITY_COMPARISON'],
      examFocus: ['university-entrance', 'toeic'],
    },
    {
      id: 'g3-exam-grammar',
      title: 'Exam Grammar Sprint',
      titleJa: 'Part 5 / 入試文法スプリント',
      focus: 'TOEIC Part 5型と大学受験型の短文判断を、接客・メール・社内文書の文脈で処理する。',
      grammarKeys: ['SUBJECT_VERB_AGREEMENT', 'WORD_FORM', 'MODIFIER_PLACEMENT', 'PREPOSITION_CONJUNCTION_CHOICE', 'PRONOUN_REFERENCE', 'PARALLELISM_ELLIPSIS'],
      examFocus: ['university-entrance', 'toeic'],
    },
  ] satisfies PostgameGrammarModule[],
}

const covered = new Set<GrammarKey>(esG3Postgame.modules.flatMap((module) => module.grammarKeys))
export const uncoveredPostgameG3Keys = postgameG3Keys.filter((key) => !covered.has(key))

export const examModuleActivityIds = Object.fromEntries(examModules.map((module) => [module.id, module.activityIds]))
