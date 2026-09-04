import type { GrammarConcept, GrammarKey } from '../core/grammar.js'

const BOTH = ['university-entrance', 'toeic'] as const
const UNI = ['university-entrance'] as const

function concept(
  key: GrammarKey,
  label: string,
  labelJa: string,
  tier: GrammarConcept['tier'],
  options: Partial<Omit<GrammarConcept, 'key' | 'label' | 'labelJa' | 'tier' | 'audiences'>> & {
    audiences?: GrammarConcept['audiences']
  } = {},
): GrammarConcept {
  return {
    key,
    label,
    labelJa,
    tier,
    audiences: options.audiences ?? [...BOTH],
    level1Expected: options.level1Expected ?? tier !== 'ES-G3',
    postgameExpected: options.postgameExpected ?? tier === 'ES-G3',
    minimumTargets: options.minimumTargets ?? 1,
    minimumReviews: options.minimumReviews ?? 0,
    note: options.note,
  }
}

/**
 * English Shift Grammar Standard.
 * ES-G1 = foundation needed before exam-focused work.
 * ES-G2 = standard high-school / practical grammar Level 1 should complete.
 * ES-G3 = advanced entrance-exam / TOEIC grammar completed in postgame.
 */
export const grammarRegistry: GrammarConcept[] = [
  concept('BASIC_BE', 'be verbs / basic predicates', 'be動詞・基本述語', 'ES-G1'),
  concept('DO_QUESTIONS', 'lexical verbs + do questions', '一般動詞・do疑問文', 'ES-G1'),
  concept('AFFIRMATIVE_NEGATIVE', 'affirmative / negative forms', '肯定文・否定文', 'ES-G1'),
  concept('PRONOUNS_DEMONSTRATIVES', 'pronouns / demonstratives', '代名詞・指示語', 'ES-G1'),
  concept('WH_QUESTIONS', 'WH questions', '疑問詞疑問文', 'ES-G1'),
  concept('HOW_MUCH_MANY', 'how much / how many', 'how much / how many', 'ES-G1'),
  concept('CAN_PERMISSION', 'can / cannot', 'can / cannot', 'ES-G1'),
  concept('IMPERATIVE_PLEASE', 'imperative + please', '命令文 + please', 'ES-G1'),
  concept('PRESENT_PROGRESSIVE', 'present progressive', '現在進行形', 'ES-G1'),
  concept('THERE_IS_ARE', 'there is / are', 'there is / are', 'ES-G1'),
  concept('BASIC_PREPOSITIONS', 'basic prepositions', '基本前置詞', 'ES-G1'),
  concept('PAST_SIMPLE', 'past simple', '過去形', 'ES-G1'),
  concept('PAST_PROGRESSIVE', 'past progressive', '過去進行形', 'ES-G1', { note: 'v0.3.6 gap: needs a direct target activity.' }),
  concept('FUTURE_WILL', 'will', 'will', 'ES-G1'),
  concept('FUTURE_GOING_TO', 'be going to', 'be going to', 'ES-G1'),
  concept('COMPARISON_BASIC', 'comparative / superlative / as...as', '比較級・最上級・as...as', 'ES-G1'),
  concept('WHICH_CHOICE', 'which', 'which', 'ES-G1'),
  concept('WHOSE_POSSESSION', 'whose', 'whose・所有関係', 'ES-G1', { note: 'v0.3.6 gap.' }),
  concept('TO_INFINITIVE', 'to-infinitive', 'to不定詞', 'ES-G1'),
  concept('GERUND', 'gerund', '動名詞', 'ES-G1'),
  concept('TOO_ENOUGH', 'too / enough', 'too / enough', 'ES-G1'),
  concept('SUBSTITUTION_ONE_OTHER', 'one / ones / another / other', 'one / ones / another / other', 'ES-G1'),
  concept('PRESENT_PERFECT', 'present perfect', '現在完了', 'ES-G1'),
  concept('PERFECT_ADVERBS', 'ever / never / already / yet', 'ever / never / already / yet', 'ES-G1'),
  concept('FOR_SINCE', 'for / since', 'for / since', 'ES-G1'),
  concept('PRESENT_PERFECT_PROGRESSIVE', 'present perfect progressive', '現在完了進行形', 'ES-G1'),
  concept('SHOULD', 'should', 'should', 'ES-G1'),
  concept('MUST_HAVE_TO', 'must / have to', 'must / have to', 'ES-G1'),
  concept('MAY_MIGHT', 'may / might', 'may / might', 'ES-G1'),
  concept('CONDITIONS_BASIC', 'if / when / unless', 'if / when / unless', 'ES-G1'),
  concept('CONDITIONAL_SECOND_ADVICE', 'If I were you...', 'If I were you...', 'ES-G1'),
  concept('PASSIVE', 'passive voice', '受動態', 'ES-G1'),
  concept('PARTICIPLE_ADJECTIVES', 'participle adjectives', '分詞の形容詞用法', 'ES-G1'),
  concept('RELATIVE_PRONOUNS', 'relative pronouns who/which/that', '関係代名詞 who/which/that', 'ES-G1'),
  concept('RELATIVE_ADVERBS', 'relative adverbs where/when', '関係副詞 where/when', 'ES-G2', { note: 'v0.3.6 only weak exposure.' }),
  concept('INDIRECT_QUESTIONS', 'indirect questions', '間接疑問', 'ES-G2'),
  concept('NOUN_CLAUSES', 'noun clauses', '名詞節 that/what/whether/if', 'ES-G2'),
  concept('SVOO', 'SVOO', '第4文型 SVOO', 'ES-G1', { note: 'v0.3.6 gap; SVOC is covered.' }),
  concept('SVOC', 'SVOC', '第5文型 SVOC', 'ES-G1'),
  concept('MAKE_KEEP_LET', 'make / keep / let', 'make / keep / let', 'ES-G2'),
  concept('OBJECT_TO_INFINITIVE', 'object + to-infinitive', '目的語 + to不定詞', 'ES-G2'),
  concept('IT_IS_TO', 'It is ... to ...', '形式主語 It is ... to ...', 'ES-G1', { note: 'v0.3.6 gap.' }),
  concept('HOW_TO', 'how to', 'how to', 'ES-G1'),
  concept('REASON_CONTRAST_CONJUNCTIONS', 'because / so / although / while', '理由・結果・逆接・同時', 'ES-G1'),
  concept('ARTICLES_COUNTABILITY', 'articles + count/non-count nouns', '冠詞・可算/不可算名詞', 'ES-G1'),
  concept('QUANTIFIERS', 'some / any / much / many / few / little', '数量表現', 'ES-G1'),
  concept('POLITE_WOULD_COULD', 'would like / could / would', 'would like / could / would', 'ES-G1'),
  concept('POLITE_FORMAL_REQUESTS', 'Would you mind / Would it be possible', 'Would you mind / Would it be possible', 'ES-G2', { note: 'v0.3.6 gap.' }),
  concept('PAST_PERFECT', 'past perfect', '過去完了', 'ES-G2'),
  concept('REPORTED_SPEECH', 'reported speech', '話法・伝聞', 'ES-G2'),
  concept('MODAL_PERFECT', 'modal + have + p.p.', '助動詞 + have + 過去分詞', 'ES-G2'),
  concept('BE_SUPPOSED_TO', 'be supposed to', 'be supposed to', 'ES-G2'),
  concept('SEEM_APPEAR_TO', 'seem / appear + infinitive', 'seem / appear + 不定詞', 'ES-G2'),
  concept('PERFECT_INFINITIVE', 'perfect infinitive', '完了不定詞 to have + p.p.', 'ES-G3', { level1Expected: false, note: 'Postgame target; Level 1 may preview it.' }),
  concept('NEGATIVE_QUESTIONS', 'negative questions', '否定疑問文', 'ES-G2'),
  concept('TAG_QUESTIONS', 'tag questions', '付加疑問文', 'ES-G2'),
  concept('CONDITIONAL_SECOND', 'second conditional', '仮定法過去', 'ES-G2'),
  concept('CONDITIONAL_THIRD', 'third conditional', '仮定法過去完了', 'ES-G2'),
  concept('WISH', 'wish', 'wish', 'ES-G2'),
  concept('AS_IF_THOUGH', 'as if / as though', 'as if / as though', 'ES-G2'),
  concept('COMPARISON_ADVANCED', 'advanced comparison', '発展比較', 'ES-G2'),
  concept('PARTIAL_NEGATION', 'partial negation', '部分否定', 'ES-G2'),
  concept('LIMITED_FREQUENCY_STATE', 'no longer / hardly / rarely', 'no longer / hardly / rarely', 'ES-G2', { note: 'v0.3.6 gap.' }),
  concept('INANIMATE_SUBJECT_EFFECT', 'allow / prevent / enable', '無生物主語 allow/prevent/enable', 'ES-G2'),
  concept('DISCOURSE_CONNECTORS', 'however / therefore / otherwise', '談話接続 however/therefore/otherwise', 'ES-G2'),
  concept('OR_QUESTIONS', 'or questions', 'orを含む疑問文', 'ES-G1', { note: 'Needs explicit targeting rather than incidental use.' }),
  concept('EXCLAMATIONS', 'What/How exclamations', '基本感嘆文', 'ES-G1'),
  concept('SVC_LINKING_VERBS', 'look / feel / become + complement', 'SVC: look/feel/become + C', 'ES-G1'),
  concept('ADJECTIVE_THAT_CLAUSE', 'be + adjective + that-clause', 'be + 形容詞 + that節', 'ES-G2'),
  concept('RELATIVE_OBJECT', 'object relative pronouns', '目的格の関係代名詞', 'ES-G2'),
  concept('PAST_PERFECT_PROGRESSIVE', 'past perfect progressive', '過去完了進行形', 'ES-G2'),

  // ES-G3: unlocked after Level 1. Aim for 100% through postgame exam-focused challenges.
  concept('PARTICIPIAL_CONSTRUCTIONS', 'participial constructions', '分詞構文', 'ES-G3', { minimumTargets: 2, audiences: [...BOTH] }),
  concept('APPOSITION', 'apposition / explanatory noun phrases', '同格・説明的名詞句', 'ES-G3'),
  concept('EMPHASIS_CLEFT', 'cleft / emphasis', '強調構文 It is/was ... that ...', 'ES-G3'),
  concept('INVERSION', 'inversion', '倒置', 'ES-G3', { audiences: [...UNI] }),
  concept('RELATIVE_NONRESTRICTIVE', 'nonrestrictive relatives', '関係詞の非制限用法', 'ES-G3'),
  concept('RELATIVE_PREPOSITION', 'preposition + relative pronoun', '前置詞 + 関係代名詞', 'ES-G3', { audiences: [...UNI] }),
  concept('RELATIVE_WHAT', 'relative what', '関係代名詞 what', 'ES-G3'),
  concept('FUTURE_PROGRESSIVE', 'future progressive', '未来進行形', 'ES-G3'),
  concept('FUTURE_PERFECT', 'future perfect', '未来完了', 'ES-G3'),
  concept('INFINITIVE_PASSIVE', 'passive infinitive', '受動態の不定詞', 'ES-G3'),
  concept('GERUND_PERFECT_PASSIVE', 'perfect/passive gerund', '完了・受動の動名詞', 'ES-G3', { audiences: [...UNI] }),
  concept('USED_TO', 'used to', 'used to', 'ES-G3'),
  concept('HAD_BETTER_OUGHT_TO', 'had better / ought to', 'had better / ought to', 'ES-G3'),
  concept('CAUSATIVE_HAVE_GET_PP', 'have/get + O + p.p.', 'have/get + O + 過去分詞', 'ES-G3'),
  concept('PERCEPTION_OBJECT_COMPLEMENT', 'see/hear + O + V/-ing', '知覚動詞 + O + 原形/-ing', 'ES-G3'),
  concept('FORMAL_CONDITIONALS', 'were to / should conditionals', 'were to / should 条件節', 'ES-G3', { audiences: [...UNI] }),
  concept('IF_NOT_FOR_WITHOUT', 'if it were not for / without', 'if it were not for / without', 'ES-G3', { audiences: [...UNI] }),
  concept('COMPARATIVE_CORRELATIVE', 'the + comparative, the + comparative', 'the 比較級, the 比較級', 'ES-G3'),
  concept('ADVANCED_QUANTITY_COMPARISON', 'advanced quantity/comparison expressions', 'no more than / as ... as possible 等', 'ES-G3'),
  concept('SUBJECT_VERB_AGREEMENT', 'subject-verb agreement', '主語・動詞の一致', 'ES-G3', { audiences: [...BOTH] }),
  concept('WORD_FORM', 'word form / parts of speech', '品詞・語形選択', 'ES-G3', { audiences: [...BOTH] }),
  concept('MODIFIER_PLACEMENT', 'modifier placement', '修飾語の位置', 'ES-G3', { audiences: [...BOTH] }),
  concept('PREPOSITION_CONJUNCTION_CHOICE', 'preposition / conjunction choice', '前置詞・接続詞の選択', 'ES-G3', { audiences: [...BOTH] }),
  concept('PRONOUN_REFERENCE', 'pronoun reference', '代名詞の照応', 'ES-G3', { audiences: [...BOTH] }),
  concept('PARALLELISM_ELLIPSIS', 'parallelism / ellipsis', '並列・省略', 'ES-G3', { audiences: [...BOTH] }),
]

export const grammarRegistryByKey = new Map(grammarRegistry.map((item) => [item.key, item]))

export const postgameG3Keys = grammarRegistry.filter((item) => item.tier === 'ES-G3').map((item) => item.key)

/**
 * Converts legacy human-readable labels into atomic canonical keys.
 * The old field mixes grammar, vocabulary and activity metadata; labels that
 * are not grammar intentionally return an empty list.
 */
export function resolveLegacyGrammarLabel(label: string): GrammarKey[] {
  const x = label.trim().toLowerCase().replace(/’/g, "'").replace(/can’t/g, "can't")
  const out = new Set<GrammarKey>()
  const add = (...keys: GrammarKey[]) => keys.forEach((key) => out.add(key))

  // Order matters: advanced/perfect forms before basic modal/tense rules.
  if (/must have|might have|can't have|cannot have|could have|modal \+ have|modal perfect/.test(x)) add('MODAL_PERFECT')
  if (/if \.\.\. had \+ p\.p\.|if you had|would have|counterfactual/.test(x)) add('CONDITIONAL_THIRD')
  if (/wish/.test(x)) add('WISH')
  if (/as if|as though/.test(x)) add('AS_IF_THOUGH')

  if (/present perfect progressive/.test(x)) add('PRESENT_PERFECT_PROGRESSIVE')
  if (/past perfect progressive/.test(x)) add('PAST_PERFECT_PROGRESSIVE')
  if (/past perfect/.test(x)) add('PAST_PERFECT')
  if (/present perfect/.test(x)) add('PRESENT_PERFECT')
  if (/present progressive/.test(x)) add('PRESENT_PROGRESSIVE')
  if (/past progressive/.test(x)) add('PAST_PROGRESSIVE')
  if (/past simple|past \/ past perfect/.test(x)) add('PAST_SIMPLE')
  if (/be going to/.test(x)) add('FUTURE_GOING_TO')
  if (/^will$/.test(x)) add('FUTURE_WILL')

  if (/ever \/ never/.test(x)) add('PERFECT_ADVERBS')
  if (/for \/ since/.test(x)) add('FOR_SINCE')

  if (/be question/.test(x)) add('BASIC_BE')
  if (/do question/.test(x)) add('DO_QUESTIONS')
  if (/^negative$|what \/ why.*negative|do question.*negative|be question.*negative/.test(x)) add('AFFIRMATIVE_NEGATIVE')
  if (/^what$|^where$|^when$|what \/ why/.test(x)) add('WH_QUESTIONS')
  if (/how much/.test(x)) add('HOW_MUCH_MANY')
  if (/how many/.test(x)) add('HOW_MUCH_MANY')
  if (/^can$|can,? payment/.test(x)) add('CAN_PERMISSION')
  if (/please \+ imperative|^please$|imperative review/.test(x)) add('IMPERATIVE_PLEASE')
  if (/there is|there \/ location/.test(x)) add('THERE_IS_ARE')
  if (/behind|next to/.test(x)) add('BASIC_PREPOSITIONS')

  if (/^comparative$|^superlative$|as \.\.\. as/.test(x)) add('COMPARISON_BASIC')
  if (/far \/ slightly|far more|^slightly$|not as \.\.\. as|advanced comparison/.test(x)) add('COMPARISON_ADVANCED')
  if (/^which$/.test(x)) add('WHICH_CHOICE')
  if (/this \/ that|demonstrative/.test(x)) add('PRONOUNS_DEMONSTRATIVES')
  if (/^whose$|possession/.test(x)) add('WHOSE_POSSESSION')
  if (/or question/.test(x)) add('OR_QUESTIONS')
  if (/what a\.\.\.|exclamation/.test(x)) add('EXCLAMATIONS')
  if (/feel \+ adjective|look \+ adjective|become \+ adjective/.test(x)) add('SVC_LINKING_VERBS')
  if (/one \/ ones|^one$|another|other/.test(x)) add('SUBSTITUTION_ONE_OTHER')
  if (/to-infinitive/.test(x)) add('TO_INFINITIVE')
  if (/^gerund$/.test(x)) add('GERUND')
  if (/too|enough/.test(x)) add('TOO_ENOUGH')

  if (/^should$/.test(x)) add('SHOULD')
  if (/must \/ have to|^have to$/.test(x)) add('MUST_HAVE_TO')
  if (/may \/ might/.test(x)) add('MAY_MIGHT')
  if (/if \/ when|if \/ unless|if \/ ingredient language|^unless$|^if$|^conditionals$/.test(x)) add('CONDITIONS_BASIC')
  if (/if i were/.test(x)) add('CONDITIONAL_SECOND_ADVICE', 'CONDITIONAL_SECOND')
  if (/if we had/.test(x)) add('CONDITIONAL_SECOND')
  if (/^subjunctive$/.test(x)) add('CONDITIONAL_SECOND')

  if (/passive voice/.test(x)) add('PASSIVE')
  if (/participle adjectives/.test(x)) add('PARTICIPLE_ADJECTIVES')
  if (/relative pronouns|who \/ which \/ that|which \/ that|that \/ which/.test(x)) add('RELATIVE_PRONOUNS')
  if (/object relative/.test(x)) add('RELATIVE_OBJECT')
  if (/where clause|relative where/.test(x)) add('RELATIVE_ADVERBS')
  if (/indirect question/.test(x)) add('INDIRECT_QUESTIONS')
  if (/noun clauses|that clauses|whether \/ what clause|whether \/ if/.test(x)) add('NOUN_CLAUSES')
  if (/^svoo$/.test(x)) add('SVOO')
  if (/^svoc$|keep \+ o \+ c/.test(x)) add('SVOC')
  if (/make \/ keep \/ let|keep \+ o \+ c/.test(x)) add('MAKE_KEEP_LET')
  if (/ask \+ object \+ to|want \+ object \+ to/.test(x)) add('OBJECT_TO_INFINITIVE')
  if (/it is \.\.\. to/.test(x)) add('IT_IS_TO')
  if (/how to/.test(x)) add('HOW_TO')
  if (/because|although|while|because \/ so/.test(x)) add('REASON_CONTRAST_CONJUNCTIONS')

  if (/articles|count \/ non-count nouns|count nouns|non-count nouns/.test(x)) add('ARTICLES_COUNTABILITY')
  if (/some \/ any|much \/ many|a few|a little/.test(x)) add('QUANTIFIERS')
  if (/would like|could \/ would|would \/ could|polite offers|^would$|would prefer/.test(x)) add('POLITE_WOULD_COULD')
  if (/formal requests|would it be possible|would you mind/.test(x)) add('POLITE_FORMAL_REQUESTS')
  if (/adjective \+ that-clause/.test(x)) add('ADJECTIVE_THAT_CLAUSE')

  if (/reported speech|reported information|say \/ tell \/ ask|say \/ ask|tell \/ say review/.test(x)) add('REPORTED_SPEECH')
  if (/be supposed to/.test(x)) add('BE_SUPPOSED_TO')
  if (/seem \/ appear to|^seem to$/.test(x)) add('SEEM_APPEAR_TO')
  if (/negative questions/.test(x)) add('NEGATIVE_QUESTIONS')
  if (/tag questions/.test(x)) add('TAG_QUESTIONS')

  if (/partial negation|not always|not necessarily/.test(x)) add('PARTIAL_NEGATION')
  if (/no longer|hardly|rarely/.test(x)) add('LIMITED_FREQUENCY_STATE')
  if (/allow \/ prevent/.test(x)) add('INANIMATE_SUBJECT_EFFECT')
  if (/participial phrase recognition/.test(x)) add('PARTICIPIAL_CONSTRUCTIONS')
  if (/however|therefore|otherwise/.test(x)) add('DISCOURSE_CONNECTORS')

  return [...out]
}
