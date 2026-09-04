import type { Chapter1Activity, Chapter1Choice, Chapter1Question } from '../core/chapter1.js'
import type { BuildActivity, BuildChapter, BuildChunk } from '../core/build.js'
import type { GrammarKey, GrammarTargetRef } from '../core/grammar.js'
import { chapter1Activities, chapter1Days } from './chapter1.js'
import { chapter2Activities, chapter2Days } from './chapter2.js'
import { chapter3Activities, chapter3Days } from './chapter3.js'
import { chapter4Activities, chapter4Days } from './chapter4.js'
import { chapter5Activities, chapter5Days } from './chapter5.js'
import { chapter6Activities, chapter6Days } from './chapter6.js'
import { chapter7Activities, chapter7Days } from './chapter7.js'
import { chapter8Activities, chapter8Days } from './chapter8.js'
import { grammarTargetsForActivity } from './grammarRuntime.js'
import { grammarRegistry, grammarRegistryByKey } from './grammarRegistry.js'
import { japaneseFor } from './japaneseSupport.js'

const STORE_BY_CHAPTER: Record<BuildChapter, string> = {
  1: 'Convenience Store', 2: 'Clothing Store', 3: 'Sports / Outdoor Store', 4: 'Electronics Store',
  5: 'Restaurant / Café', 6: 'Hotel', 7: 'Department Store', 8: 'International Flagship',
}

const FALLBACK_GRAMMAR: Record<string, GrammarTargetRef[]> = {
  'd6-rush': [{ key: 'BASIC_PREPOSITIONS', role: 'review' }],
  'd24-electronics-rush': [{ key: 'RELATIVE_PRONOUNS', role: 'review' }, { key: 'COMPARISON_BASIC', role: 'review' }],
  'd30-dinner-rush': [{ key: 'QUANTIFIERS', role: 'review' }, { key: 'FUTURE_WILL', role: 'review' }],
  'd36-hotel-rush': [{ key: 'REASON_CONTRAST_CONJUNCTIONS', role: 'review' }, { key: 'MODAL_PERFECT', role: 'review' }],
}

const G12_KEYS = new Set(grammarRegistry.filter((concept) => concept.tier === 'ES-G1' || concept.tier === 'ES-G2').map((concept) => concept.key))

const GRAMMAR_HINT_GROUPS: Array<{ keys: GrammarKey[]; tip: string }> = [
  { keys: ['DO_QUESTIONS','WH_QUESTIONS','HOW_MUCH_MANY','WHICH_CHOICE','WHOSE_POSSESSION','NEGATIVE_QUESTIONS','TAG_QUESTIONS','OR_QUESTIONS'], tip: '疑問文では、疑問詞・助動詞・主語の並びを先に決めると組み立てやすくなります。' },
  { keys: ['PRESENT_PROGRESSIVE','PAST_PROGRESSIVE','PRESENT_PERFECT','PRESENT_PERFECT_PROGRESSIVE','PAST_PERFECT','PAST_PERFECT_PROGRESSIVE','FUTURE_WILL','FUTURE_GOING_TO'], tip: 'いつの出来事かを確認してから、時制を表す助動詞・be動詞・haveを置きましょう。' },
  { keys: ['PASSIVE','MODAL_PERFECT','BE_SUPPOSED_TO','SEEM_APPEAR_TO'], tip: '主語が「する側」か「される側」か、推測・予定・見た目のどれを表すかを先に整理しましょう。' },
  { keys: ['TO_INFINITIVE','GERUND','OBJECT_TO_INFINITIVE','IT_IS_TO','HOW_TO','MAKE_KEEP_LET','SVOO','SVOC'], tip: '動詞の後ろに何を置く型なのかを意識しましょう。動詞ごとの語順がポイントです。' },
  { keys: ['RELATIVE_PRONOUNS','RELATIVE_OBJECT','RELATIVE_ADVERBS','INDIRECT_QUESTIONS','NOUN_CLAUSES','ADJECTIVE_THAT_CLAUSE','REPORTED_SPEECH'], tip: '文の中にもう一つの節が入ります。節の入口と、その中の主語・動詞を分けて考えましょう。' },
  { keys: ['CONDITIONS_BASIC','CONDITIONAL_SECOND_ADVICE','CONDITIONAL_SECOND','CONDITIONAL_THIRD','WISH','AS_IF_THOUGH'], tip: '条件・事実と違う想像・後悔のどれかを見極め、if節と結果側を分けて考えましょう。' },
  { keys: ['COMPARISON_BASIC','COMPARISON_ADVANCED','TOO_ENOUGH','PARTIAL_NEGATION','LIMITED_FREQUENCY_STATE'], tip: '比較する対象と程度を先に決め、than / as ... as / not necessarily などの形を確認しましょう。' },
  { keys: ['POLITE_WOULD_COULD','POLITE_FORMAL_REQUESTS','CAN_PERMISSION','SHOULD','MUST_HAVE_TO','MAY_MIGHT'], tip: '接客の丁寧さと強さを確認し、Could / Would / should / must などの助動詞を最初に選びましょう。' },
]

function grammarLearningTip(grammar: GrammarTargetRef[]) {
  const keys = new Set(grammar.map((ref) => ref.key))
  return GRAMMAR_HINT_GROUPS.find((group) => group.keys.some((key) => keys.has(key)))?.tip
    ?? 'Customerの状況とYOUR INTENTから、まず「何を伝える文か」を一つに絞りましょう。'
}


type BuildTargetOverride = {
  sentence: string
  targetJapanese: string
  response?: string
  responseJa?: string
  grammarTargets: GrammarTargetRef[]
}

/**
 * A small set of Level 2-specific model responses. These are used only when the
 * Level 1 activity teaches a grammar point mainly through the customer's line,
 * while BUILD needs the player to actively construct that grammar themselves.
 */
const TARGET_OVERRIDES: Record<string, BuildTargetOverride> = {
  'd10-fitting-history': {
    sentence: 'Were you trying on size S when you noticed the damage?',
    targetJapanese: '破損に気づいたとき、Sサイズを試着していましたか？',
    grammarTargets: [{ key: 'PAST_PROGRESSIVE', role: 'target' }],
  },
  'd22-how-to-connect': {
    sentence: 'It’s easy to connect. I’ll show you how to do it.',
    targetJapanese: '接続は簡単です。やり方をご案内します。',
    response: 'That looks easy enough.',
    responseJa: 'それなら簡単そうですね。',
    grammarTargets: [{ key: 'IT_IS_TO', role: 'target' }, { key: 'HOW_TO', role: 'target' }],
  },
  'd22-feature-rush': {
    sentence: 'Yes. It gives you access to several extra ports through a single cable.',
    targetJapanese: 'はい。1本のケーブルで複数の追加ポートを使えるようになります。',
    response: 'That’s convenient.',
    responseJa: 'それは便利ですね。',
    grammarTargets: [{ key: 'SVOO', role: 'target' }],
  },
  'd35-breakfast-confirm': {
    sentence: 'Didn’t your confirmation email show the breakfast package?',
    targetJapanese: '確認メールには朝食付きプランと記載されていませんでしたか？',
    response: 'Yes, it did. That’s why I thought breakfast was included.',
    responseJa: 'はい、そう書いてありました。だから朝食込みだと思っていました。',
    grammarTargets: [{ key: 'NEGATIVE_QUESTIONS', role: 'target' }],
  },
  'd35-payment-confirm': {
    sentence: 'You paid the room charge online, didn’t you?',
    targetJapanese: '室料はオンラインでお支払い済みですよね？',
    response: 'Yes. My confirmation says it was paid in full.',
    responseJa: 'はい。確認書には全額支払い済みとあります。',
    grammarTargets: [{ key: 'TAG_QUESTIONS', role: 'target' }],
  },
  'd39-asif-complaint': {
    sentence: 'It looks as if the bag had been used, but let me check the sales record first.',
    targetJapanese: 'そのバッグは使用済みのように見えますが、まず販売記録を確認します。',
    grammarTargets: [{ key: 'AS_IF_THOUGH', role: 'target' }],
  },
  'd41-warranty-policy': {
    sentence: 'The warranty allows us to replace items with manufacturing defects.',
    targetJapanese: 'その保証では、製造上の欠陥がある商品を交換できます。',
    grammarTargets: [{ key: 'INANIMATE_SUBJECT_EFFECT', role: 'target' }],
  },

  'd36-manager-handoff': {
    sentence: 'He prepaid for a king room, but none is available. He has a 7 a.m. meeting nearby, so a distant hotel would be difficult.',
    targetJapanese: 'キングルームは支払い済みですが、空きがありません。朝7時に近くで会議があるため、遠いホテルへの移動は難しいです。',
    grammarTargets: [{ key: 'REASON_CONTRAST_CONJUNCTIONS', role: 'review' }, { key: 'PAST_SIMPLE', role: 'review' }],
  },
  'd41-policy-handoff': {
    sentence: 'She’s outside the return period, but the item is unopened and she has the gift receipt. Could we make an exception for a color exchange?',
    targetJapanese: '返品期限は過ぎていますが、商品は未開封でギフトレシートがあります。色交換として例外対応できますか？',
    grammarTargets: [{ key: 'POLITE_FORMAL_REQUESTS', role: 'review' }, { key: 'PASSIVE', role: 'review' }],
  },
  'd42-manager-handoff': {
    sentence: 'The same fault returned after our repair. She has the receipt and needs the headphones tonight. Could we prioritize a replacement?',
    targetJapanese: '修理後に同じ不具合が再発しました。修理レシートがあり、今夜ヘッドホンが必要です。交換を優先できますか？',
    grammarTargets: [{ key: 'POLITE_FORMAL_REQUESTS', role: 'review' }, { key: 'PAST_SIMPLE', role: 'review' }],
  },
  'd43-taxfree-explain': {
    sentence: 'The unopened items may qualify. However, the opened item cannot. Therefore, I’ll separate the eligible items and check the total.',
    targetJapanese: '未開封の商品は対象になる可能性があります。ただし、開封済みの商品は対象外です。ですので、対象商品を分けて合計を確認します。',
    grammarTargets: [{ key: 'DISCOURSE_CONNECTORS', role: 'target' }, { key: 'MAY_MIGHT', role: 'review' }],
  },
  'd44-pickup-clarify': {
    sentence: 'Let me check whether the item has left the warehouse or already arrived here. Then I can tell you when pickup is available.',
    targetJapanese: '商品が倉庫を出たのか、すでにこちらへ到着したのか確認します。その後、いつ受け取れるかお伝えします。',
    grammarTargets: [{ key: 'NOUN_CLAUSES', role: 'target' }, { key: 'INDIRECT_QUESTIONS', role: 'review' }],
  },
  'd48-final-incident': {
    sentence: 'Order G-4281 was confused with G-4821. If the numbers had been checked first, Grace’s package would have remained at pickup.',
    targetJapanese: '注文G-4281がG-4821と取り違えられました。先に番号を確認していれば、Grace様の荷物は受取場所に残っていたはずです。',
    grammarTargets: [{ key: 'CONDITIONAL_THIRD', role: 'target' }, { key: 'PASSIVE', role: 'review' }, { key: 'PAST_PERFECT', role: 'review' }],
  },
  'd48-final-handoff': {
    sentence: 'The camera shuts down after ten minutes, they have the receipt, and their flight leaves in three hours. Could we check it now and decide on an exchange?',
    targetJapanese: 'カメラは10分で電源が落ち、レシートがあり、飛行機は3時間後です。今すぐ確認して交換を判断できますか？',
    grammarTargets: [{ key: 'POLITE_FORMAL_REQUESTS', role: 'target' }],
  },
}

const GRAMMAR_OVERRIDES: Record<string, GrammarTargetRef[]> = {
  'd22-keeps-cool': [{ key: 'SVOC', role: 'target' }, { key: 'MAKE_KEEP_LET', role: 'review' }],
  'd24-specialist-request': [{ key: 'OBJECT_TO_INFINITIVE', role: 'target' }],
}

function dayFromId(id: string) { const match = id.match(/^d(\d+)/); return match ? Number(match[1]) : 1 }
function activityNoFromIndex(index: number): 1 | 2 | 3 { return ((index % 3) + 1) as 1 | 2 | 3 }
function bestChoice(choices: Chapter1Choice[]) { return choices.find((choice) => choice.quality === 'best') ?? choices[0] }

function detects(sentence: string, key: GrammarKey) {
  const s = sentence.trim()
  const low = s.toLowerCase().replace(/’/g, "'")
  const test = (re: RegExp) => re.test(low)
  switch (key) {
    case 'BASIC_BE': return test(/\b(am|is|are|was|were|'m|'s|'re)\b/)
    case 'DO_QUESTIONS': return test(/^(do|does|did)\b/)
    case 'AFFIRMATIVE_NEGATIVE': return test(/\b(no|not|never|isn't|aren't|wasn't|weren't|don't|doesn't|didn't|can't|cannot|won't|wouldn't|shouldn't|haven't|hasn't|hadn't)\b/)
    case 'PRONOUNS_DEMONSTRATIVES': return test(/\b(this|that|these|those)\b/)
    case 'WH_QUESTIONS': return test(/^(what|where|when|why|who|whose|which|how)\b/)
    case 'HOW_MUCH_MANY': return test(/\bhow (much|many)\b/)
    case 'CAN_PERMISSION': return test(/\bcan(?:not|'t)?\b/)
    case 'IMPERATIVE_PLEASE': return test(/(^|[.!?]\s*)please\b/)
    case 'PRESENT_PROGRESSIVE': return test(/\b(am|is|are|'m|'s|'re)\s+\w+ing\b/)
    case 'THERE_IS_ARE': return test(/\bthere (is|are|was|were)\b/)
    case 'BASIC_PREPOSITIONS': return test(/\b(next to|near|behind|in front of|between|under|across from|on the left|on the right)\b/)
    case 'PAST_SIMPLE': { if (test(/\b(did|was|were|went|saw|came|said|told)\b/)) return true; if (test(/\b(have|has|had)\s+(?:(?:i|you|we|they|he|she|it)\s+)?(?:already\s+|never\s+|ever\s+|just\s+)?(?:bought|noticed|worked|asked|arrived|left|stopped|started|showed|used|paid)\b/)) return false; return test(/\b(bought|noticed|worked|asked|arrived|left|stopped|started|showed|used|paid)\b/) }
    case 'PAST_PROGRESSIVE': return test(/\b(was|were)\s+\w+ing\b/)
    case 'FUTURE_WILL': return test(/\bwill\b|\bwon't\b|\b\w+'ll\b/)
    case 'FUTURE_GOING_TO': return test(/\b(am|is|are|'m|'s|'re)\s+going to\b/)
    case 'COMPARISON_BASIC': return test(/\b(better|worse|lighter|heavier|larger|smaller|cheaper|warmer|colder|easier|harder|faster|slower|best|worst|lightest|heaviest|more|less|most|least)\b|\bas\b[^.?!]{0,30}\bas\b/)
    case 'WHICH_CHOICE': return test(/\bwhich\b/)
    case 'WHOSE_POSSESSION': return test(/\bwhose\b/)
    case 'TO_INFINITIVE': return test(/\bto\s+(?:be|do|go|wear|use|try|buy|check|see|move|bring|show|connect|replace|wait|leave|arrive|pay|keep|avoid|choose|find|make|carry|pack|open|close|help|return|exchange|compare|ask|tell|confirm|review|prioritize|separate|look|run|walk|start|stop)\b/)
    case 'GERUND': return test(/\b(enjoy|mind|avoid|recommend|suggest|keep|finish|consider|prefer)\s+\w+ing\b|\bbeing\s+\w+/)
    case 'TOO_ENOUGH': return test(/\btoo\b|\benough\b/)
    case 'SUBSTITUTION_ONE_OTHER': return test(/\b(one|ones|another|other)\b/)
    case 'PRESENT_PERFECT': return test(/\b(have|has)\s+(?:(?:i|you|we|they|he|she|it)\s+)?(?:already\s+|never\s+|ever\s+|just\s+)?(?:been|used|seen|done|gone|had|made|tried|bought|received|paid|worked|arrived|changed|stopped|asked|shown|taken|left|reached|opened)\b|\b(?:i|you|we|they|he|she|it)('ve|'s)\s+(?:already\s+|never\s+|ever\s+|just\s+)?(?:been|used|seen|done|gone|had|made|tried|bought|received|paid|worked|arrived|changed|stopped|asked|shown|taken|left|reached|opened)\b/)
    case 'PERFECT_ADVERBS': return test(/\b(ever|never|already|yet|just)\b/)
    case 'FOR_SINCE': return test(/\b(for|since)\s+(?:about\s+)?(?:\d+|a|an|the|last|this|april|monday|yesterday|years?|months?|weeks?|days?|hours?|minutes?)\b/)
    case 'PRESENT_PERFECT_PROGRESSIVE': return test(/\b(have|has)\s+(?:(?:i|you|we|they|he|she|it)\s+)?been\s+\w+ing\b|\b(?:i|you|we|they|he|she|it)('ve|'s)\s+been\s+\w+ing\b/)
    case 'SHOULD': return test(/\bshould\b/)
    case 'MUST_HAVE_TO': return test(/\bmust\b|\b(have|has|had) to\b/)
    case 'MAY_MIGHT': return test(/\b(may|might)\b/)
    case 'CONDITIONS_BASIC': return test(/\b(if|unless|when)\b/)
    case 'CONDITIONAL_SECOND_ADVICE': return test(/\bif i were you\b/)
    case 'PASSIVE': return test(/\b(am|is|are|was|were|be|been|being)\s+(?:\w+ed|made|built|sent|sold|shown|given|taken|left|paid|included|charged|prepared|served|assembled|tested|opened|damaged|completed|confirmed|assigned|restored|resold|corrected|secured|arranged)\b/)
    case 'PARTICIPLE_ADJECTIVES': return test(/\b(opened|damaged|broken|included|confirmed|prepaid|reserved|unopened|interested|worried|excited|tired|finished)\b/)
    case 'RELATIVE_PRONOUNS': return test(/\b(who|which|that)\b/)
    case 'RELATIVE_ADVERBS': return test(/\b(where|when)\b/) && !test(/^(where|when)\b/)
    case 'INDIRECT_QUESTIONS': return test(/\b(could you tell me|can you tell me|do you know|may i ask|let me check|could i check|may i check)\b[^.?!]*(what|where|when|which|whether|if|how)/)
    case 'NOUN_CLAUSES': return test(/\b(whether|what|that|if)\b/) && !test(/^if\b/)
    case 'SVOO': return test(/\b(give|gives|gave|show|shows|showed|tell|tells|told|bring|brings|brought|offer|offers|offered|send|sends|sent)\s+(me|you|him|her|us|them)\s+/)
    case 'SVOC': return test(/\b(make|makes|made|keep|keeps|kept|find|finds|found|leave|leaves|left)\s+(it|this|that|them|the\s+\w+)\s+\w+/)
    case 'MAKE_KEEP_LET': return test(/\b(make|makes|made|keep|keeps|kept|let|lets)\b/)
    case 'OBJECT_TO_INFINITIVE': return test(/\b(ask|asks|asked|want|wants|wanted|tell|tells|told|need|needs|needed|allow|allows|allowed|expect|expects|expected)\s+(me|you|him|her|us|them|(?:the|our|your)\s+\w+(?:\s+\w+)?)\s+to\b/)
    case 'IT_IS_TO': return test(/\bit(?: is| was|'s)\s+[^.?!]{0,45}\bto\b/)
    case 'HOW_TO': return test(/\bhow to\b/)
    case 'REASON_CONTRAST_CONJUNCTIONS': return test(/\b(because|so|although|though|while|but|even though)\b/)
    case 'ARTICLES_COUNTABILITY': return test(/\b(a|an|some|any)\b/)
    case 'QUANTIFIERS': return test(/\b(some|any|much|many|few|little|several|a few|a little)\b/)
    case 'POLITE_WOULD_COULD': return test(/\b(would like|could|would|'d)\b/)
    case 'POLITE_FORMAL_REQUESTS': return test(/\b(would you mind|would it be possible|could you please|may i|could you|could i)\b/)
    case 'PAST_PERFECT': return test(/\bhad\s+(?:already\s+|not\s+)?(?:been|\w+ed|made|sent|left|paid|gone|done|had|taken|reached|changed|stayed|followed|selected)\b/)
    case 'REPORTED_SPEECH': return test(/\b(said|says|told|tells|asked|asks)\b/)
    case 'MODAL_PERFECT': return test(/\b(must|may|might|could|can't|cannot|should|would)\s+have\s+(?:been\s+)?\w+/)
    case 'BE_SUPPOSED_TO': return test(/\b(supposed to)\b/)
    case 'SEEM_APPEAR_TO': return test(/\b(seem|seems|seemed|appear|appears|appeared)(?:\s+to|\s+that)\b/)
    case 'NEGATIVE_QUESTIONS': return test(/^(isn't|aren't|wasn't|weren't|don't|doesn't|didn't|haven't|hasn't|hadn't|can't|couldn't|won't|wouldn't|shouldn't)\b/)
    case 'TAG_QUESTIONS': return test(/,\s*(isn't|aren't|wasn't|weren't|don't|doesn't|didn't|haven't|hasn't|hadn't|can't|couldn't|won't|wouldn't|shouldn't|is|are|do|does|did|have|has|had|can|could|will|would|should)\s+\w+\?$/)
    case 'CONDITIONAL_SECOND': return test(/\bif\b[^.?!]*(were|had)\b[^.?!]*(would|could|(?:i|we|you|they|he|she)'d)\b/)
    case 'CONDITIONAL_THIRD': return test(/\bif\b[^.?!]*had\b[^.?!]*(would|could|might)\s+have\b|\b(would|could|might)\s+have\b[^.?!]*\bif\b[^.?!]*had\b/)
    case 'WISH': return test(/\bwish\b/)
    case 'AS_IF_THOUGH': return test(/\bas if\b|\bas though\b/)
    case 'COMPARISON_ADVANCED': return test(/\b(far|slightly|much)\s+(?:more|less|\w+er)\b|\bnot as\b[^.?!]*\bas\b|\btwice\b/)
    case 'PARTIAL_NEGATION': return test(/\bnot (every|all|always|necessarily)\b|\bnot necessarily\b/)
    case 'LIMITED_FREQUENCY_STATE': return test(/\b(no longer|hardly|rarely)\b/)
    case 'INANIMATE_SUBJECT_EFFECT': return test(/\b(allows?|prevents?|enables?)\b/)
    case 'DISCOURSE_CONNECTORS': return test(/\b(however|therefore|otherwise)\b/)
    case 'OR_QUESTIONS': return test(/\bor\b[^?]*\?$/)
    case 'EXCLAMATIONS': return test(/^(what a|what an|how )\b|!$/)
    case 'SVC_LINKING_VERBS': return test(/\b(look|looks|feel|feels|felt|become|becomes|became)\s+(?:too\s+|very\s+|more\s+)?\w+/)
    case 'ADJECTIVE_THAT_CLAUSE': return test(/\b(glad|sure|certain|sorry|afraid|happy|clear)\s+(?:that\s+)?(?:i|you|we|they|he|she|it|the)\b/)
    case 'RELATIVE_OBJECT': return test(/\b(that|which|who|whom)\s+(you|we|i|he|she|they)\s+\w+/)
    case 'PAST_PERFECT_PROGRESSIVE': return test(/\bhad\s+(?:already\s+)?been\s+\w+ing\b/)
    default: return false
  }
}

function detectedGrammar(sentence: string) {
  return [...G12_KEYS].filter((key) => detects(sentence, key))
}

function sourceGrammar(activity: Chapter1Activity) {
  return grammarTargetsForActivity(activity).filter((ref) => G12_KEYS.has(ref.key))
}

function candidateScore(sentence: string, refs: GrammarTargetRef[]) {
  const found = new Set(detectedGrammar(sentence))
  let score = 0
  for (const ref of refs) if (found.has(ref.key)) score += ref.role === 'target' ? 4 : ref.role === 'review' ? 2 : 1
  // Prefer concise model sentences when grammar coverage ties.
  return score * 100 - sentence.split(/\s+/).length
}

function targetFromActivity(activity: Chapter1Activity) {
  const override = TARGET_OVERRIDES[activity.id]
  if (override) return { sentence: override.sentence, response: override.response ?? 'I see. Thank you.' }
  const refs = sourceGrammar(activity)
  if (activity.kind === 'dialogue' || activity.kind === 'checkout') {
    const item = bestChoice(activity.choices)
    return { sentence: item.reviewText ?? item.text, response: item.response }
  }
  if (activity.kind === 'information-hunt' || activity.kind === 'troubleshooting') {
    const candidates = activity.questions.map((item) => ({ sentence: item.text, response: item.response, score: candidateScore(item.text, refs) + (item.value ?? 0) }))
    return candidates.sort((a, b) => b.score - a.score)[0]
  }
  if (activity.kind === 'rapid') {
    const candidates = activity.scenarios.map((scenario) => {
      const item = bestChoice(scenario.choices)
      const sentence = item.reviewText ?? item.text
      return { sentence, response: item.response, score: candidateScore(sentence, refs) }
    })
    return candidates.sort((a, b) => b.score - a.score)[0]
  }
  if (activity.kind === 'staff-coordination') {
    const item = bestChoice(activity.handoffOptions)
    return { sentence: item.reviewText ?? item.text, response: item.response }
  }
  if (activity.kind === 'incident-investigation') {
    const item = activity.conclusions.find((conclusion) => conclusion.correct) ?? activity.conclusions[0]
    return { sentence: item.reviewText ?? item.text, response: 'That matches the evidence.' }
  }
  throw new Error(`Unsupported BUILD source activity: ${activity.id}`)
}

function targetChunkCount(sentence: string) {
  const words = sentence.trim().split(/\s+/).filter(Boolean).length
  if (words <= 4) return Math.min(3, words)
  if (words <= 8) return 3
  if (words <= 13) return 4
  if (words <= 20) return 5
  return 6
}

const BOUNDARY_WORDS = new Set(['and', 'but', 'because', 'so', 'if', 'when', 'while', 'although', 'however', 'therefore', 'otherwise', 'before', 'after', 'unless', 'whether', 'that', 'who', 'which', 'where', 'since', 'then', 'rather'])

function splitIntoChunks(sentence: string) {
  const words = sentence.trim().split(/\s+/).filter(Boolean)
  if (words.length <= 3) return words
  const desired = Math.min(targetChunkCount(sentence), words.length)
  const boundaries: number[] = []
  for (let part = 1; part < desired; part += 1) {
    const ideal = Math.round((words.length * part) / desired)
    let best = ideal; let bestScore = Number.POSITIVE_INFINITY
    for (let candidate = Math.max(1, ideal - 3); candidate <= Math.min(words.length - 1, ideal + 3); candidate += 1) {
      if (boundaries.includes(candidate)) continue
      const previous = words[candidate - 1]
      const next = words[candidate]?.toLowerCase().replace(/^[“'\"]|[,.!?;:]$/g, '')
      let score = Math.abs(candidate - ideal) * 3
      if (/[,.!?;:]$/.test(previous)) score -= 5
      if (BOUNDARY_WORDS.has(next)) score -= 4
      if (candidate > 0 && BOUNDARY_WORDS.has(words[candidate - 1].toLowerCase().replace(/[,.!?;:]$/g, ''))) score -= 2
      if (score < bestScore) { best = candidate; bestScore = score }
    }
    boundaries.push(best)
  }
  const unique = [...new Set(boundaries)].sort((a, b) => a - b)
  const chunks: string[] = []; let start = 0
  for (const boundary of unique) { if (boundary > start) chunks.push(words.slice(start, boundary).join(' ')); start = boundary }
  if (start < words.length) chunks.push(words.slice(start).join(' '))
  return chunks.filter(Boolean)
}

function mutateChunk(text: string, variant: 0 | 1) {
  const replacements: Array<[RegExp, string]> = variant === 0
    ? [[/\bdoes\b/i, 'do'], [/\bdo\b/i, 'does'], [/\bdid\b/i, 'do'], [/\bis\b/i, 'are'], [/\bare\b/i, 'is'], [/\bwas\b/i, 'were'], [/\bwere\b/i, 'was'], [/\bhas\b/i, 'have'], [/\bhave\b/i, 'has'], [/\bhad\b/i, 'have'], [/\bcould\b/i, 'can'], [/\bwould\b/i, 'will'], [/\bshould\b/i, 'must'], [/\bmust\b/i, 'should'], [/\bcan\b/i, 'could'], [/\bmay\b/i, 'might'], [/\bmight\b/i, 'may'], [/\bno longer\b/i, 'not anymore']]
    : [[/\bhas\b/i, 'had'], [/\bhave\b/i, 'had'], [/\bhad\b/i, 'has'], [/\bis\b/i, 'does'], [/\bare\b/i, 'do'], [/\bwill\b/i, 'would'], [/\bwas\b/i, 'is'], [/\bwere\b/i, 'are'], [/\bthan\b/i, 'as'], [/\bas\b/i, 'than'], [/\bto\b/i, ''], [/\bbecause\b/i, 'so'], [/\bunless\b/i, 'if not']]
  for (const [pattern, replacement] of replacements) if (pattern.test(text)) return text.replace(pattern, replacement).replace(/\s+/g, ' ').trim()
  const phraseReplacements: Array<[RegExp, string]> = variant === 0
    ? [[/\bthis\b/i, 'that'], [/\bthese\b/i, 'those'], [/\ba\b/i, 'the'], [/\ban\b/i, 'the'], [/\btoday\b/i, 'yesterday'], [/\bbefore\b/i, 'after'], [/\bafter\b/i, 'before'], [/\bfirst\b/i, 'later'], [/\bmore\b/i, 'less'], [/\blighter\b/i, 'heavier'], [/\bwarmer\b/i, 'cooler'], [/\bwith\b/i, 'without']]
    : [[/\byou\b/i, 'we'], [/\byour\b/i, 'our'], [/\bwe\b/i, 'they'], [/\bour\b/i, 'their'], [/\bI\b/, 'we'], [/\bme\b/i, 'us'], [/\bhere\b/i, 'there'], [/\bnow\b/i, 'later'], [/\bnear\b/i, 'far from'], [/\binside\b/i, 'outside'], [/\bavailable\b/i, 'unavailable'], [/\bopen\b/i, 'closed'], [/\bcan\b/i, 'cannot']]
  for (const [pattern, replacement] of phraseReplacements) if (pattern.test(text)) return text.replace(pattern, replacement)
  const words = text.split(/\s+/)
  const punctuation = text.match(/[,.!?;:]$/)?.[0] ?? ''
  const generic = variant === 0 ? 'right now' : 'later today'
  if (words.length >= 2) return `${generic}${punctuation || '.'}`
  const oneWordAlternates: Record<string, string> = { 'before?': 'after?', 'after?': 'before?', 'yes.': 'no.', 'no.': 'yes.', 'here.': 'there.', 'today.': 'tomorrow.' }
  return oneWordAlternates[text.toLowerCase()] ?? `${generic}${punctuation || '.'}`
}

function makeChunkBank(id: string, parts: string[]): { chunks: BuildChunk[]; targetChunkIds: string[] } {
  const targets = parts.map((text, index) => ({ id: `${id}-c${index + 1}`, text }))
  const targetText = new Set(parts.map((part) => part.toLowerCase()))
  const pickMutation = (variant: 0 | 1, excluded?: string) => {
    const candidates = variant === 0 ? parts : [...parts].reverse()
    for (const part of candidates) {
      const candidate = mutateChunk(part, variant)
      const generic = /^(right now|later today)[,.!?;:]?$/i.test(candidate)
      if (!generic && candidate !== excluded && !targetText.has(candidate.toLowerCase())) return candidate
    }
    const fallback = variant === 0 ? 'right now.' : 'later today.'
    return fallback === excluded ? 'at the moment.' : fallback
  }
  const mutationA = pickMutation(0)
  const mutationB = pickMutation(1, mutationA)
  const distractors: BuildChunk[] = [{ id: `${id}-x1`, text: mutationA, distractor: true }, { id: `${id}-x2`, text: mutationB, distractor: true }]
  const chunks: BuildChunk[] = []
  targets.forEach((target, index) => { if (index === 1) chunks.push(distractors[0]); chunks.push(target); if (index === Math.max(1, targets.length - 2)) chunks.push(distractors[1]) })
  if (!chunks.includes(distractors[0])) chunks.push(distractors[0]); if (!chunks.includes(distractors[1])) chunks.push(distractors[1])
  return { chunks, targetChunkIds: targets.map((item) => item.id) }
}

function slotLabels(sentence: string, count: number, grammar: GrammarTargetRef[]) {
  const keys = new Set(grammar.map((ref) => ref.key)); let labels: string[]
  if (sentence.trim().endsWith('?')) labels = ['QUESTION START', 'SUBJECT / CORE', 'ACTION', 'OBJECT / DETAIL', 'TIME / CONDITION', 'END']
  else if ([...keys].some((key) => ['CONDITIONS_BASIC', 'CONDITIONAL_SECOND', 'CONDITIONAL_SECOND_ADVICE', 'CONDITIONAL_THIRD'].includes(key))) labels = ['CONDITION', 'SUBJECT', 'ACTION', 'RESULT', 'DETAIL', 'END']
  else if (keys.has('REPORTED_SPEECH')) labels = ['REPORT', 'SUBJECT', 'MESSAGE', 'DETAIL', 'TIME', 'END']
  else if (keys.has('PASSIVE')) labels = ['SUBJECT', 'PASSIVE VERB', 'DETAIL', 'REASON / TIME', 'EXTRA', 'END']
  else if (keys.has('DISCOURSE_CONNECTORS')) labels = ['FIRST POINT', 'CONNECTOR', 'NEXT POINT', 'ACTION', 'DETAIL', 'END']
  else labels = ['SUBJECT / TOPIC', 'ACTION', 'OBJECT / COMPLEMENT', 'DETAIL', 'REASON / TIME', 'END']
  return labels.slice(0, count)
}

function grammarForBuild(activity: Chapter1Activity, sentence: string) {
  const targetOverride = TARGET_OVERRIDES[activity.id]
  if (targetOverride) return targetOverride.grammarTargets
  const grammarOverride = GRAMMAR_OVERRIDES[activity.id]
  if (grammarOverride) return grammarOverride
  const refs = sourceGrammar(activity)
  const found = new Set(detectedGrammar(sentence))
  const matched = refs.filter((ref) => found.has(ref.key))
  if (matched.length) return matched.slice(0, 3)
  const detected = [...found].slice(0, 2).map((key): GrammarTargetRef => ({ key, role: 'review' }))
  if (detected.length) return detected
  return FALLBACK_GRAMMAR[activity.id] ?? refs.slice(0, 1)
}

function buildHints(grammar: GrammarTargetRef[], parts: string[], labels: string[]) {
  const first = parts[0]
  const last = parts.at(-1) ?? ''
  const skeleton = labels.map((label) => `[${label}]`).join(' → ')
  const partial = parts.length <= 3
    ? `文頭は “${first}” です。残りのchunkを意味の流れに沿ってつなげましょう。`
    : `“${first}” → ${Array.from({ length: Math.max(1, parts.length - 2) }, () => '___').join(' → ')} → “${last}” の形です。`
  return [
    grammarLearningTip(grammar),
    `文の骨格は ${skeleton} です。各chunkの役割を当てはめてみましょう。`,
    partial,
  ]
}

function responseCopy(kind: Chapter1Activity['kind'], response: string) {
  const translated = japaneseFor(response); if (translated) return { response, responseJa: translated }
  if (kind === 'staff-coordination') return { response: 'Thanks. I can take it from here.', responseJa: 'ありがとう。ここからは私が対応します。' }
  if (kind === 'incident-investigation') return { response: 'That matches the evidence.', responseJa: 'その結論は証拠と一致しています。' }
  return { response: 'I see. Thank you.', responseJa: '分かりました。ありがとうございます。' }
}

function toBuildActivity(activity: Chapter1Activity, globalIndex: number): BuildActivity {
  const chapter = ((Math.floor((dayFromId(activity.id) - 1) / 6) + 1) as BuildChapter)
  const day = dayFromId(activity.id); const activityNo = activityNoFromIndex(globalIndex); const target = targetFromActivity(activity)
  const parts = splitIntoChunks(target.sentence); const bank = makeChunkBank(`build-${activity.id}`, parts); const grammarTargets = grammarForBuild(activity, target.sentence); const override = TARGET_OVERRIDES[activity.id]; const response = override?.response ? { response: override.response, responseJa: override.responseJa ?? japaneseFor(override.response) ?? override.response } : responseCopy(activity.kind, target.response)
  const labels = slotLabels(target.sentence, parts.length, grammarTargets)
  return { id: `build-${activity.id}`, sourceActivityId: activity.id, chapter, day, activityNo, title: activity.title, skill: activity.skill, store: STORE_BY_CHAPTER[chapter], customerName: activity.customer.name, customerOpening: activity.customer.opening, customerOpeningJa: japaneseFor(activity.customer.opening) ?? activity.customer.opening, intentJa: activity.objective, targetSentence: target.sentence, targetJapanese: override?.targetJapanese ?? japaneseFor(target.sentence) ?? target.sentence, customerResponse: response.response, customerResponseJa: response.responseJa, grammarTargets, chunks: bank.chunks, targetChunkIds: bank.targetChunkIds, slotLabels: labels, hintsJa: buildHints(grammarTargets, parts, labels), bestRoute: ['Customerの状況とYOUR INTENTから、返答の目的を一つに絞る。', grammarLearningTip(grammarTargets), `文を${parts.length}個の意味chunkに分けて、英語として自然な順番に並べる。`] }
}

const sourceActivities: Chapter1Activity[] = [...chapter1Activities, ...chapter2Activities, ...chapter3Activities, ...chapter4Activities, ...chapter5Activities, ...chapter6Activities, ...chapter7Activities, ...chapter8Activities]

/** Level 2 mirrors all 144 Level 1 activities one-to-one: recognition → construction. */
export const level2BuildActivities: BuildActivity[] = sourceActivities.map(toBuildActivity)
export const level2BuildById = new Map(level2BuildActivities.map((activity) => [activity.id, activity]))
export const level2BuildValidIds = new Set(level2BuildActivities.map((activity) => activity.id))
export const level2BuildDayMeta = [...chapter1Days, ...chapter2Days, ...chapter3Days, ...chapter4Days, ...chapter5Days, ...chapter6Days, ...chapter7Days, ...chapter8Days].map((day) => ({ day: day.day, title: day.title, subtitle: day.subtitle, gameFocus: day.gameFocus }))
