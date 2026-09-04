import type { Chapter1Activity } from '../core/chapter1.js'

export type ExamModule = {
  id: string
  number: number
  title: string
  titleJa: string
  subtitle: string
  examFocus: string
  grammarKeys: string[]
  activityIds: string[]
}

export const examModules: ExamModule[] = [
  {
    id: 'compressed-english', number: 1, title: 'Compressed English', titleJa: '圧縮された英文',
    subtitle: '分詞・同格・発展関係詞を、案内や業務連絡の意味としてほどく。', examFocus: '大学受験 + TOEIC Reading',
    grammarKeys: ['PARTICIPIAL_CONSTRUCTIONS', 'APPOSITION', 'RELATIVE_NONRESTRICTIVE', 'RELATIVE_PREPOSITION', 'RELATIVE_WHAT'],
    activityIds: ['exam-m1-notice', 'exam-m1-supplier', 'exam-m1-what-queue'],
  },
  {
    id: 'time-aspect', number: 2, title: 'Time & Aspect', titleJa: '時制・完了の発展',
    subtitle: '未来・完了・受動の組み合わせから、業務の時系列を正確に読む。', examFocus: '大学受験 + TOEIC Reading',
    grammarKeys: ['PERFECT_INFINITIVE', 'FUTURE_PROGRESSIVE', 'FUTURE_PERFECT', 'INFINITIVE_PASSIVE', 'GERUND_PERFECT_PASSIVE'],
    activityIds: ['exam-m2-delivery-records', 'exam-m2-tomorrow-schedule', 'exam-m2-passive-queue'],
  },
  {
    id: 'formal-structures', number: 3, title: 'Formal Structures', titleJa: '強調・倒置・条件表現',
    subtitle: '強調構文・倒置・発展条件文を、規約やフォーマルな案内で処理する。', examFocus: '大学受験重点',
    grammarKeys: ['EMPHASIS_CLEFT', 'INVERSION', 'FORMAL_CONDITIONALS', 'IF_NOT_FOR_WITHOUT'],
    activityIds: ['exam-m3-cleft', 'exam-m3-inversion', 'exam-m3-condition-queue'],
  },
  {
    id: 'verb-patterns', number: 4, title: 'Verb Patterns', titleJa: '動詞構文の発展',
    subtitle: 'used to、助言、使役、知覚動詞をトラブル対応の中で使い分ける。', examFocus: '大学受験 + TOEIC',
    grammarKeys: ['USED_TO', 'HAD_BETTER_OUGHT_TO', 'CAUSATIVE_HAVE_GET_PP', 'PERCEPTION_OBJECT_COMPLEMENT'],
    activityIds: ['exam-m4-used-to', 'exam-m4-repair-advice', 'exam-m4-perception-queue'],
  },
  {
    id: 'comparison-logic', number: 5, title: 'Comparison & Logic', titleJa: '比較・論理の発展',
    subtitle: '比較相関と数量表現を、価格・納期・在庫の判断に結び付ける。', examFocus: '大学受験 + TOEIC',
    grammarKeys: ['COMPARATIVE_CORRELATIVE', 'ADVANCED_QUANTITY_COMPARISON'],
    activityIds: ['exam-m5-earlier', 'exam-m5-quantity', 'exam-m5-comparison-queue'],
  },
  {
    id: 'exam-grammar-sprint', number: 6, title: 'Exam Grammar Sprint', titleJa: '入試・TOEIC文法スプリント',
    subtitle: '一致・品詞・修飾・接続・照応・並列を、短時間で正確に判断する。', examFocus: 'TOEIC Part 5/6 + 大学受験',
    grammarKeys: ['SUBJECT_VERB_AGREEMENT', 'WORD_FORM', 'MODIFIER_PLACEMENT', 'PREPOSITION_CONJUNCTION_CHOICE', 'PRONOUN_REFERENCE', 'PARALLELISM_ELLIPSIS'],
    activityIds: ['exam-m6-form-choice', 'exam-m6-linker-queue', 'exam-m6-handoff'],
  },
]

export const examActivities: Chapter1Activity[] = [
  {
    id: 'exam-m1-notice', kind: 'dialogue', title: 'Read the opening notice', skill: 'Exam Reading',
    objective: '分詞句と同格表現から、施設と開始時期を正確に読み取る。', grammar: ['participial constructions', 'apposition'],
    grammarTargets: [{ key: 'PARTICIPIAL_CONSTRUCTIONS', role: 'target' }, { key: 'APPOSITION', role: 'target' }],
    customer: { id: 'grace', name: 'Grace', roleLabel: '案内文を確認しているお客様', opening: 'The notice says, “Opening next Monday, the Sky Lounge, our new members-only area, will serve breakfast from 7 a.m.” What does that tell me?' },
    bestRoute: ['Opening next Monday の主語を確認する', '同格でSky Loungeの説明を確認する', '開始日と施設を結び付ける'],
    choices: [
      { id: 'm1n-best', text: 'The Sky Lounge is the new members-only area, and it opens next Monday.', response: 'Got it. I’ll come next week.', quality: 'best', points: 100, explanation: '分詞句と同格の両方を正しく解釈しています。' },
      { id: 'm1n-good', text: 'Breakfast starts at 7 a.m. in a members-only area.', response: 'Okay, but when does the lounge open?', quality: 'good', points: 78, explanation: '一部は正しいですが、Opening next Monday の情報が抜けています。' },
      { id: 'm1n-poor', text: 'The members-only area is closing next Monday.', response: 'Closing? I thought it was new.', quality: 'poor', points: 15, explanation: 'Opening を closing と逆に解釈しています。' },
    ],
  },
  {
    id: 'exam-m1-supplier', kind: 'information-hunt', title: 'Follow the relative clauses', skill: 'Reference Hunt',
    objective: '非制限用法と前置詞＋関係代名詞から、人と取引先の関係を特定する。', grammar: ['nonrestrictive relative clauses', 'preposition + relative pronoun'],
    grammarTargets: [{ key: 'RELATIVE_NONRESTRICTIVE', role: 'target' }, { key: 'RELATIVE_PREPOSITION', role: 'target' }],
    customer: { id: 'daniel', name: 'Daniel', roleLabel: '海外注文の担当者を探している', opening: 'I need Ms. Lee, who handled my overseas order, and the supplier from whom she received the revised invoice.' },
    bestRoute: ['Ms. Leeの役割を確認する', 'from whom の先行詞を確認する', '正しい連絡先を特定する'], maxQuestions: 2,
    questions: [
      { id: 'm1s-q1', text: 'Was Ms. Lee the person who handled your overseas order?', response: 'Yes. She handled the order from the start.', reveal: 'Ms. Lee = order handler', value: 5 },
      { id: 'm1s-q2', text: 'Do you need the supplier that sent Ms. Lee the revised invoice?', response: 'Exactly. I need both contacts.', reveal: 'Supplier → revised invoice → Ms. Lee', value: 5 },
      { id: 'm1s-q3', text: 'What color was the invoice?', response: 'White.', reveal: 'Invoice color', value: 0 },
      { id: 'm1s-q4', text: 'Did you visit the store yesterday?', response: 'No.', reveal: 'Visit history', value: 0 },
    ],
    candidates: [
      { id: 'm1s-a', name: 'Ms. Lee + her invoice supplier', details: 'Order handler + supplier that sent the revised invoice', correct: true },
      { id: 'm1s-b', name: 'Ms. Lee + the customer’s bank', details: 'Bank is not mentioned' },
      { id: 'm1s-c', name: 'Any overseas supplier', details: 'Too broad' },
    ],
  },
  {
    id: 'exam-m1-what-queue', kind: 'rapid', title: 'What-clause quick reads', skill: 'Exam Sprint',
    objective: '関係代名詞whatを「〜するもの・こと」として素早く意味処理する。', grammar: ['relative what'],
    grammarTargets: [{ key: 'RELATIVE_WHAT', role: 'target' }, { key: 'PARTICIPIAL_CONSTRUCTIONS', role: 'target' }],
    customer: { id: 'mia', name: 'Exam Queue', roleLabel: '短文を連続処理する', opening: 'Read each sentence and choose the meaning that fits the situation.' },
    bestRoute: ['what節を名詞のまとまりとして取る', '不足情報を補わない', '文脈に合う意味を選ぶ'],
    scenarios: [
      { id: 'm1w-1', customer: 'Notice 1', line: 'What the customer needs most is a replacement before Friday.', choices: [
        { id: 'm1w1-best', text: 'The top priority is getting a replacement before Friday.', response: 'Correct.', quality: 'best', points: 100, explanation: 'what節全体が主語です。' },
        { id: 'm1w1-good', text: 'The customer replaced something last Friday.', response: 'That changes the time relationship.', quality: 'good', points: 35, explanation: 'before Fridayを過去の出来事として誤読しています。' },
        { id: 'm1w1-poor', text: 'The customer does not need a replacement.', response: 'That is the opposite meaning.', quality: 'poor', points: 5, explanation: '意味が逆です。' },
      ]},
      { id: 'm1w-2', customer: 'Notice 2', line: 'Please send us what you received from the courier.', choices: [
        { id: 'm1w2-best', text: 'Send the item or information that the courier gave you.', response: 'Correct.', quality: 'best', points: 100, explanation: 'what = the thing(s) that の意味です。' },
        { id: 'm1w2-good', text: 'Send the courier to us.', response: 'The sentence asks for what was received, not the person.', quality: 'good', points: 30, explanation: '目的語を人と取り違えています。' },
        { id: 'm1w2-poor', text: 'Do not send anything.', response: 'That is not what the message says.', quality: 'poor', points: 5, explanation: '内容が逆です。' },
      ]},
      { id: 'm1w-3', customer: 'Notice 3', line: 'What surprised the manager was the speed of the response.', choices: [
        { id: 'm1w3-best', text: 'The manager was surprised by how quickly they responded.', response: 'Correct.', quality: 'best', points: 100, explanation: 'what節が「managerを驚かせたこと」を表します。' },
        { id: 'm1w3-good', text: 'The manager gave a slow response.', response: 'The sentence does not say that.', quality: 'good', points: 30, explanation: '主語と内容を取り違えています。' },
        { id: 'm1w3-poor', text: 'The response did not surprise anyone.', response: 'That is the opposite meaning.', quality: 'poor', points: 5, explanation: '意味が逆です。' },
      ]},
      { id: 'm1w-4', customer: 'Notice 4', line: 'Having reviewed the order, the manager approved what the customer requested.', choices: [
        { id: 'm1w4-best', text: 'After reviewing the order, the manager approved the customer’s request.', response: 'Correct.', quality: 'best', points: 100, explanation: 'Having reviewed が先行する完了した行為、what節が承認対象を表します。' },
        { id: 'm1w4-good', text: 'The customer reviewed the order after the approval.', response: 'The sequence and subject are different.', quality: 'good', points: 25, explanation: '分詞構文の主語と時系列を誤読しています。' },
        { id: 'm1w4-poor', text: 'The manager rejected the customer’s request.', response: 'The sentence says approved.', quality: 'poor', points: 5, explanation: '意味が逆です。' },
      ]},
    ],
  },

  {
    id: 'exam-m2-delivery-records', kind: 'incident-investigation', title: 'Delivery timeline', skill: 'Timeline Deduction',
    objective: '完了不定詞と未来完了から配送時系列を復元する。', grammar: ['perfect infinitive', 'future perfect'],
    grammarTargets: [{ key: 'PERFECT_INFINITIVE', role: 'target' }, { key: 'FUTURE_PERFECT', role: 'target' }],
    customer: { id: 'grace', name: 'Grace', roleLabel: '配送状況を確認している', opening: 'The tracking page says the courier appears to have left the warehouse, and the package will have reached the local depot by 5 p.m. What can we conclude?' },
    bestRoute: ['appears to have leftを過去の推定として読む', 'will have reachedを未来時点までの完了として読む', '現在と5時時点を分ける'],
    maxInterviews: 2, sourceMode: 'records', sourceHeading: 'TRACKING RECORDS', sourceActionLabel: 'Check record', evidenceHeading: 'TIMELINE',
    witnesses: [
      { id: 'm2d-r1', name: 'Tracking update', role: '12:10', statement: 'The courier appears to have left the warehouse.', evidence: 'Departure probably happened before 12:10.', value: 5 },
      { id: 'm2d-r2', name: 'Route estimate', role: 'ETA', statement: 'The package will have reached the local depot by 5 p.m.', evidence: 'Depot arrival should be complete by 5 p.m.', value: 5 },
      { id: 'm2d-r3', name: 'Weather note', role: 'Info', statement: 'The temperature is 24°C.', evidence: 'Weather is not decisive.', value: 0 },
    ],
    conclusions: [
      { id: 'm2d-best', text: 'It likely left already and should reach the depot by 5.', correct: true, explanation: '完了不定詞と未来完了の時間関係を正しく読めています。' },
      { id: 'm2d-w1', text: 'It will leave the warehouse at 5.', correct: false, explanation: '5時はdepots到着の期限で、出発時刻ではありません。' },
      { id: 'm2d-w2', text: 'It definitely reached the depot before noon.', correct: false, explanation: 'その事実は記録から確定できません。' },
    ],
  },
  {
    id: 'exam-m2-tomorrow-schedule', kind: 'dialogue', title: 'Tomorrow at three', skill: 'Schedule Reading',
    objective: '未来進行形から、未来の特定時点で進行中の予定を読む。', grammar: ['future progressive'],
    grammarTargets: [{ key: 'FUTURE_PROGRESSIVE', role: 'target' }],
    customer: { id: 'daniel', name: 'Daniel', roleLabel: '明日の予約を変更したい', opening: 'I’ll be meeting a client at three tomorrow. Could I move my fitting appointment to four?' },
    bestRoute: ['will be meetingを3時に進行中の予定として読む', '重ならない4時を確認する', '変更可否を回答する'],
    choices: [
      { id: 'm2t-best', text: 'Yes. Your client meeting is at three, so I can move the fitting to four.', response: 'Perfect. Thank you.', quality: 'best', points: 100, explanation: '未来進行形の予定を正しく踏まえています。' },
      { id: 'm2t-good', text: 'I can move it to three.', response: 'That is when I’ll be meeting my client.', quality: 'good', points: 35, explanation: '予定が重なります。' },
      { id: 'm2t-poor', text: 'You already met the client yesterday.', response: 'No, the meeting is tomorrow.', quality: 'poor', points: 5, explanation: '未来の予定を過去として誤読しています。' },
    ],
  },
  {
    id: 'exam-m2-passive-queue', kind: 'rapid', title: 'Passive-form sprint', skill: 'Exam Sprint',
    objective: '不定詞の受動態と完了・受動の動名詞を意味で区別する。', grammar: ['passive infinitive', 'perfect/passive gerund'],
    grammarTargets: [{ key: 'INFINITIVE_PASSIVE', role: 'target' }, { key: 'GERUND_PERFECT_PASSIVE', role: 'target' }],
    customer: { id: 'mia', name: 'Exam Queue', roleLabel: '業務英文を連続処理する', opening: 'Choose the interpretation that matches each sentence.' },
    bestRoute: ['to be + p.p.を受動として取る', 'having been + p.p.を過去の受動経験として取る', '時系列を崩さない'],
    scenarios: [
      { id: 'm2p-1', customer: 'Email 1', line: 'The form needs to be approved before payment.', choices: [
        { id: 'm2p1-best', text: 'Someone must approve the form before payment.', response: 'Correct.', quality: 'best', points: 100, explanation: 'to be approvedは受動です。' },
        { id: 'm2p1-good', text: 'The form must approve the payment.', response: 'The form is not the person doing the approving.', quality: 'good', points: 25, explanation: '能動・受動を逆にしています。' },
        { id: 'm2p1-poor', text: 'Payment must happen before approval.', response: 'The order is reversed.', quality: 'poor', points: 5, explanation: 'beforeの関係が逆です。' },
      ]},
      { id: 'm2p-2', customer: 'Email 2', line: 'She complained about having been charged twice.', choices: [
        { id: 'm2p2-best', text: 'She says she was charged twice before she complained.', response: 'Correct.', quality: 'best', points: 100, explanation: 'having been chargedは完了＋受動の動名詞です。' },
        { id: 'm2p2-good', text: 'She charged someone twice.', response: 'She was the person charged.', quality: 'good', points: 25, explanation: '受動関係を逆にしています。' },
        { id: 'm2p2-poor', text: 'She has not complained yet.', response: 'The complaint already happened.', quality: 'poor', points: 5, explanation: '時系列が逆です。' },
      ]},
      { id: 'm2p-3', customer: 'Email 3', line: 'The revised schedule is expected to be announced today.', choices: [
        { id: 'm2p3-best', text: 'People expect someone to announce the revised schedule today.', response: 'Correct.', quality: 'best', points: 100, explanation: 'to be announcedは受動の不定詞です。' },
        { id: 'm2p3-good', text: 'The schedule will announce something.', response: 'The schedule receives the action.', quality: 'good', points: 25, explanation: '主語の役割を逆にしています。' },
        { id: 'm2p3-poor', text: 'The announcement happened last week.', response: 'The sentence says today.', quality: 'poor', points: 5, explanation: '時間が違います。' },
      ]},
    ],
  },

  {
    id: 'exam-m3-cleft', kind: 'dialogue', title: 'What caused the error?', skill: 'Formal Reading',
    objective: 'It is/was ... that の強調構文から、強調されている原因を特定する。', grammar: ['cleft emphasis'],
    grammarTargets: [{ key: 'EMPHASIS_CLEFT', role: 'target' }],
    customer: { id: 'grace', name: 'Grace', roleLabel: '請求ミスの説明を読んでいる', opening: 'The report says, “It was the outdated billing address that caused the payment to fail.” What caused the problem?' },
    bestRoute: ['It was ... that の強調部分を見る', '原因をbilling addressに限定する', '結果payment failureと分ける'],
    choices: [
      { id: 'm3c-best', text: 'The outdated billing address caused the payment failure.', response: 'That makes sense.', quality: 'best', points: 100, explanation: '強調されている原因を正しく特定しています。' },
      { id: 'm3c-good', text: 'The payment failure changed the billing address.', response: 'That reverses the cause and result.', quality: 'good', points: 25, explanation: '因果関係が逆です。' },
      { id: 'm3c-poor', text: 'The report says the address was correct.', response: 'No, it says the address was outdated.', quality: 'poor', points: 5, explanation: '内容が逆です。' },
    ],
  },
  {
    id: 'exam-m3-inversion', kind: 'dialogue', title: 'Only after...', skill: 'Formal Reading',
    objective: '否定・限定表現による倒置を通常語順へ戻して意味を取る。', grammar: ['inversion'],
    grammarTargets: [{ key: 'INVERSION', role: 'target' }],
    customer: { id: 'daniel', name: 'Daniel', roleLabel: '社内報告を確認している', opening: 'The memo says, “Only after the manager arrived did the team reopen the counter.” When did they reopen it?' },
    bestRoute: ['Only after以下を条件として読む', 'did the team reopenを通常語順へ戻す', 'manager arrivalの後と判断する'],
    choices: [
      { id: 'm3i-best', text: 'They reopened the counter after the manager arrived.', response: 'Right. That is the sequence.', quality: 'best', points: 100, explanation: '倒置を正しい時系列へ戻しています。' },
      { id: 'm3i-good', text: 'They reopened it before the manager arrived.', response: 'The memo says only after.', quality: 'good', points: 20, explanation: '時系列が逆です。' },
      { id: 'm3i-poor', text: 'The counter never reopened.', response: 'It did reopen.', quality: 'poor', points: 5, explanation: '内容が違います。' },
    ],
  },
  {
    id: 'exam-m3-condition-queue', kind: 'rapid', title: 'Formal condition sprint', skill: 'Condition Sprint',
    objective: 'should / were to 条件節と without / if it were not for を意味で処理する。', grammar: ['formal conditionals', 'if it were not for / without'],
    grammarTargets: [{ key: 'FORMAL_CONDITIONALS', role: 'target' }, { key: 'IF_NOT_FOR_WITHOUT', role: 'target' }],
    customer: { id: 'mia', name: 'Exam Queue', roleLabel: '規約英文を連続処理する', opening: 'Choose the practical meaning of each formal condition.' },
    bestRoute: ['Shouldをifとして読む', 'Were ... toを仮定として読む', 'withoutを条件の欠如として読む'],
    scenarios: [
      { id: 'm3f-1', customer: 'Policy 1', line: 'Should you need further assistance, contact the service desk.', choices: [
        { id: 'm3f1-best', text: 'If you need more help, contact the service desk.', response: 'Correct.', quality: 'best', points: 100, explanation: 'Should you need = If you should need のフォーマルな条件表現です。' },
        { id: 'm3f1-good', text: 'You must contact the desk even if you need no help.', response: 'That is too strong.', quality: 'good', points: 25, explanation: '条件を無視しています。' },
        { id: 'm3f1-poor', text: 'The desk cannot provide assistance.', response: 'That is the opposite.', quality: 'poor', points: 5, explanation: '意味が逆です。' },
      ]},
      { id: 'm3f-2', customer: 'Policy 2', line: 'Were the shipment to arrive late, we would contact you immediately.', choices: [
        { id: 'm3f2-best', text: 'If the shipment arrived late, we would contact you.', response: 'Correct.', quality: 'best', points: 100, explanation: 'Were ... to はフォーマルな仮定条件です。' },
        { id: 'm3f2-good', text: 'The shipment has definitely arrived late.', response: 'It is hypothetical, not confirmed.', quality: 'good', points: 25, explanation: '仮定を事実として読んでいます。' },
        { id: 'm3f2-poor', text: 'We would never contact you.', response: 'That is the opposite.', quality: 'poor', points: 5, explanation: '意味が逆です。' },
      ]},
      { id: 'm3f-3', customer: 'Policy 3', line: 'Without your receipt, we could not verify the purchase date.', choices: [
        { id: 'm3f3-best', text: 'The receipt makes it possible to verify the purchase date.', response: 'Correct.', quality: 'best', points: 100, explanation: 'withoutは「もし〜がなければ」に相当します。' },
        { id: 'm3f3-good', text: 'The receipt prevents us from checking the date.', response: 'The relationship is reversed.', quality: 'good', points: 25, explanation: '因果関係が逆です。' },
        { id: 'm3f3-poor', text: 'The purchase date is never checked.', response: 'That is not stated.', quality: 'poor', points: 5, explanation: '過度な一般化です。' },
      ]},
    ],
  },

  {
    id: 'exam-m4-used-to', kind: 'dialogue', title: 'Old process, new process', skill: 'Verb Pattern Reading',
    objective: 'used to から以前の習慣・状態と現在を区別する。', grammar: ['used to'],
    grammarTargets: [{ key: 'USED_TO', role: 'target' }],
    customer: { id: 'grace', name: 'Grace', roleLabel: '以前の手続きを覚えている', opening: 'I used to collect online orders at the first-floor register. Is that still where I go?' },
    bestRoute: ['used toを過去の習慣として読む', '現在も同じとは限らないと判断する', '現在の受取場所を案内する'],
    choices: [
      { id: 'm4u-best', text: 'That was the old process. Online pickup is now on Level 2.', response: 'Thanks. I’ll go to Level 2.', quality: 'best', points: 100, explanation: 'used toが現在との対比を含むことを踏まえています。' },
      { id: 'm4u-good', text: 'Yes. “Used to” means the process is still the same.', response: 'I thought it might have changed.', quality: 'good', points: 20, explanation: 'used toを現在継続と誤解しています。' },
      { id: 'm4u-poor', text: 'You never collected orders on the first floor.', response: 'I did in the past.', quality: 'poor', points: 5, explanation: '過去の事実を否定しています。' },
    ],
  },
  {
    id: 'exam-m4-repair-advice', kind: 'dialogue', title: 'Repair advice', skill: 'Service Advice',
    objective: 'had better / ought to と have + O + p.p. を修理提案として理解する。', grammar: ['had better / ought to', 'have + object + past participle'],
    grammarTargets: [{ key: 'HAD_BETTER_OUGHT_TO', role: 'target' }, { key: 'CAUSATIVE_HAVE_GET_PP', role: 'target' }],
    customer: { id: 'daniel', name: 'Daniel', roleLabel: '膨らんだバッテリーを持ち込んだ', opening: 'The battery is swollen, but the phone still works. Can I keep using it for a few days?' },
    bestRoute: ['安全上の強い助言を出す', 'have the battery replacedを交換サービスとして使う', '本人が交換作業をする意味にしない'],
    choices: [
      { id: 'm4r-best', text: 'You’d better stop using it and have the battery replaced as soon as possible.', response: 'Understood. Please arrange the replacement.', quality: 'best', points: 100, explanation: '強い助言と使役構文を自然に組み合わせています。' },
      { id: 'm4r-good', text: 'You ought to keep using it until it stops completely.', response: 'That does not sound safe.', quality: 'good', points: 15, explanation: '安全上不適切です。' },
      { id: 'm4r-poor', text: 'You had better replace another customer’s battery.', response: 'I’m asking about my phone.', quality: 'poor', points: 5, explanation: '目的語の関係が誤っています。' },
    ],
  },
  {
    id: 'exam-m4-perception-queue', kind: 'rapid', title: 'See / hear + object', skill: 'Verb Pattern Sprint',
    objective: '知覚動詞＋O＋原形/-ingから、行為全体と進行中の場面を読み分ける。', grammar: ['perception verb + object + complement'],
    grammarTargets: [{ key: 'PERCEPTION_OBJECT_COMPLEMENT', role: 'target' }],
    customer: { id: 'mia', name: 'Exam Queue', roleLabel: '状況報告を連続処理する', opening: 'Read what each staff member observed.' },
    bestRoute: ['原形は行為全体として読む', '-ingは進行中の場面として読む', '観察者と行為者を分ける'],
    scenarios: [
      { id: 'm4p-1', customer: 'Report 1', line: 'I saw the courier leave the building.', choices: [
        { id: 'm4p1-best', text: 'The speaker saw the courier’s departure.', response: 'Correct.', quality: 'best', points: 100, explanation: 'see + O + 原形で行為全体を表します。' },
        { id: 'm4p1-good', text: 'The courier saw the speaker leave.', response: 'The roles are reversed.', quality: 'good', points: 25, explanation: '観察者と行為者が逆です。' },
        { id: 'm4p1-poor', text: 'Nobody left the building.', response: 'That contradicts the report.', quality: 'poor', points: 5, explanation: '内容が逆です。' },
      ]},
      { id: 'm4p-2', customer: 'Report 2', line: 'We heard someone knocking on the service door.', choices: [
        { id: 'm4p2-best', text: 'They heard the knocking while it was happening.', response: 'Correct.', quality: 'best', points: 100, explanation: 'hear + O + -ingで進行中の行為を捉えます。' },
        { id: 'm4p2-good', text: 'They knocked on the door themselves.', response: 'Someone else was knocking.', quality: 'good', points: 25, explanation: '行為者が違います。' },
        { id: 'm4p2-poor', text: 'The door made no sound.', response: 'That contradicts the report.', quality: 'poor', points: 5, explanation: '内容が逆です。' },
      ]},
      { id: 'm4p-3', customer: 'Report 3', line: 'The manager watched the technician test the replacement unit.', choices: [
        { id: 'm4p3-best', text: 'The manager observed the technician perform the test.', response: 'Correct.', quality: 'best', points: 100, explanation: 'watch + O + 原形の関係です。' },
        { id: 'm4p3-good', text: 'The technician watched the manager test it.', response: 'The roles are reversed.', quality: 'good', points: 25, explanation: '観察者と行為者が逆です。' },
        { id: 'm4p3-poor', text: 'No test took place.', response: 'The sentence says a test occurred.', quality: 'poor', points: 5, explanation: '内容が逆です。' },
      ]},
    ],
  },

  {
    id: 'exam-m5-earlier', kind: 'dialogue', title: 'The earlier, the better', skill: 'Comparison Logic',
    objective: 'the + 比較級, the + 比較級 の相関関係を納期判断に使う。', grammar: ['comparative correlative'],
    grammarTargets: [{ key: 'COMPARATIVE_CORRELATIVE', role: 'target' }],
    customer: { id: 'daniel', name: 'Daniel', roleLabel: '週末までの配送を希望している', opening: 'The delivery note says, “The earlier you place the order, the more likely we are to deliver by Saturday.” What should I do?' },
    bestRoute: ['2つの比較が連動していると読む', '早い注文ほど確率が上がると判断する', '注文時期の助言へつなげる'],
    choices: [
      { id: 'm5e-best', text: 'Place the order as early as possible to improve the chance of Saturday delivery.', response: 'I’ll order now.', quality: 'best', points: 100, explanation: '比較相関を実際の行動へ正しく変換しています。' },
      { id: 'm5e-good', text: 'Wait as long as possible before ordering.', response: 'Wouldn’t that reduce the chance?', quality: 'good', points: 15, explanation: '相関関係を逆にしています。' },
      { id: 'm5e-poor', text: 'The order date has no effect on delivery.', response: 'The note says it does.', quality: 'poor', points: 5, explanation: '文の中心情報を無視しています。' },
    ],
  },
  {
    id: 'exam-m5-quantity', kind: 'dialogue', title: 'No more than...', skill: 'Quantity Logic',
    objective: 'no more than / as ... as possible などの数量・程度表現を正確に読む。', grammar: ['advanced quantity comparison'],
    grammarTargets: [{ key: 'ADVANCED_QUANTITY_COMPARISON', role: 'target' }],
    customer: { id: 'grace', name: 'Grace', roleLabel: '手荷物サービスを確認している', opening: 'The service guide says I can store no more than two bags and should collect them as early as possible. What does that mean?' },
    bestRoute: ['no more thanを上限として読む', 'as early as possibleを可能な限り早くと読む', '数量と推奨を分ける'],
    choices: [
      { id: 'm5q-best', text: 'You can store at most two bags, and you should collect them as early as you can.', response: 'Thanks. I only have two.', quality: 'best', points: 100, explanation: '上限と程度表現を正しく読めています。' },
      { id: 'm5q-good', text: 'You must store more than two bags.', response: 'I only have two bags.', quality: 'good', points: 10, explanation: 'no more thanの意味が逆です。' },
      { id: 'm5q-poor', text: 'You may leave any number of bags for as long as you want.', response: 'That does not match the guide.', quality: 'poor', points: 5, explanation: '両方の条件を無視しています。' },
    ],
  },
  {
    id: 'exam-m5-comparison-queue', kind: 'rapid', title: 'Comparison speed round', skill: 'Comparison Sprint',
    objective: '比較相関・数量表現を短い業務判断へ素早く変換する。', grammar: ['comparative correlative', 'advanced quantity comparison'],
    grammarTargets: [{ key: 'COMPARATIVE_CORRELATIVE', role: 'review' }, { key: 'ADVANCED_QUANTITY_COMPARISON', role: 'review' }],
    customer: { id: 'mia', name: 'Exam Queue', roleLabel: '比較表現を連続処理する', opening: 'Choose the practical meaning of each comparison.' },
    bestRoute: ['比較の方向を見る', '上限・下限を混同しない', '実際の行動へ言い換える'],
    scenarios: [
      { id: 'm5c-1', customer: 'Rule 1', line: 'The longer the repair takes, the more expensive the labor becomes.', choices: [
        { id: 'm5c1-best', text: 'Longer repairs tend to cost more in labor.', response: 'Correct.', quality: 'best', points: 100, explanation: '2つの比較が同方向に連動します。' },
        { id: 'm5c1-good', text: 'Longer repairs always cost less.', response: 'The direction is reversed.', quality: 'good', points: 15, explanation: '比較方向が逆です。' },
        { id: 'm5c1-poor', text: 'Repair time and labor cost are unrelated.', response: 'The sentence says they are related.', quality: 'poor', points: 5, explanation: '相関を無視しています。' },
      ]},
      { id: 'm5c-2', customer: 'Rule 2', line: 'Please bring no fewer than two forms of identification.', choices: [
        { id: 'm5c2-best', text: 'Bring at least two forms of identification.', response: 'Correct.', quality: 'best', points: 100, explanation: 'no fewer than = at leastです。' },
        { id: 'm5c2-good', text: 'Bring at most two forms of identification.', response: 'That reverses the limit.', quality: 'good', points: 15, explanation: '上限と下限が逆です。' },
        { id: 'm5c2-poor', text: 'Identification is not required.', response: 'It is required.', quality: 'poor', points: 5, explanation: '条件を無視しています。' },
      ]},
      { id: 'm5c-3', customer: 'Rule 3', line: 'Please respond as promptly as possible.', choices: [
        { id: 'm5c3-best', text: 'Respond as soon as you reasonably can.', response: 'Correct.', quality: 'best', points: 100, explanation: 'as ... as possibleの程度表現です。' },
        { id: 'm5c3-good', text: 'Delay the response as long as possible.', response: 'That is the opposite.', quality: 'good', points: 15, explanation: '意味が逆です。' },
        { id: 'm5c3-poor', text: 'A response is optional.', response: 'The message asks for a response.', quality: 'poor', points: 5, explanation: '依頼を無視しています。' },
      ]},
    ],
  },

  {
    id: 'exam-m6-form-choice', kind: 'dialogue', title: 'Agreement and word form', skill: 'Part 5 Sprint',
    objective: '主語と動詞の一致、品詞・語形を文脈から判断する。', grammar: ['subject-verb agreement', 'word form'],
    grammarTargets: [{ key: 'SUBJECT_VERB_AGREEMENT', role: 'target' }, { key: 'WORD_FORM', role: 'target' }],
    customer: { id: 'grace', name: 'Grace', roleLabel: '社内メールを校正している', opening: 'Which sentence is correct for the staff e-mail?' },
    bestRoute: ['主語を特定する', '必要な品詞を確認する', '意味と文法の両方が成立する文を選ぶ'],
    choices: [
      { id: 'm6f-best', text: 'The list of approved suppliers is updated regularly.', response: 'Yes. I’ll use that sentence.', quality: 'best', points: 100, explanation: '主語はlistなのでis、updatedを修飾する副詞regularlyも適切です。' },
      { id: 'm6f-good', text: 'The list of approved suppliers are updated regular.', response: 'Something sounds wrong there.', quality: 'good', points: 20, explanation: '主語・動詞の一致と品詞の両方に誤りがあります。' },
      { id: 'm6f-poor', text: 'The list of approved suppliers be update regularity.', response: 'That is not grammatical.', quality: 'poor', points: 5, explanation: '動詞形と品詞が不適切です。' },
    ],
  },
  {
    id: 'exam-m6-linker-queue', kind: 'rapid', title: 'Modifier and linker sprint', skill: 'Part 5 / 6 Sprint',
    objective: '修飾語の位置と前置詞・接続詞を短文・メール文脈で判断する。', grammar: ['modifier placement', 'preposition / conjunction choice'],
    grammarTargets: [{ key: 'MODIFIER_PLACEMENT', role: 'target' }, { key: 'PREPOSITION_CONJUNCTION_CHOICE', role: 'target' }],
    customer: { id: 'mia', name: 'Exam Queue', roleLabel: 'メール文を連続校正する', opening: 'Choose the sentence that reads naturally and accurately.' },
    bestRoute: ['修飾先の近くに語を置く', '後ろが名詞か節かを確認する', '文全体の論理関係を見る'],
    scenarios: [
      { id: 'm6l-1', customer: 'Email 1', line: 'Which version is best?', choices: [
        { id: 'm6l1-best', text: 'Please review the attached invoice carefully before approving it.', response: 'Correct.', quality: 'best', points: 100, explanation: 'carefullyがreviewを自然に修飾します。' },
        { id: 'm6l1-good', text: 'Please carefully the attached invoice review before approving it.', response: 'The word order is not natural.', quality: 'good', points: 20, explanation: '修飾語と動詞の配置が崩れています。' },
        { id: 'm6l1-poor', text: 'Please the attached carefully approving invoice.', response: 'That is not grammatical.', quality: 'poor', points: 5, explanation: '語順が成立していません。' },
      ]},
      { id: 'm6l-2', customer: 'Email 2', line: '___ the store closes at eight, the repair desk stops accepting devices at seven.', choices: [
        { id: 'm6l2-best', text: 'Although', response: 'Correct.', quality: 'best', points: 100, explanation: '後ろが節で、逆接関係なのでAlthoughが適切です。' },
        { id: 'm6l2-good', text: 'Despite', response: 'Despite needs a noun phrase here, not a full clause.', quality: 'good', points: 25, explanation: '前置詞と接続詞の区別が必要です。' },
        { id: 'm6l2-poor', text: 'During', response: 'That does not express the contrast.', quality: 'poor', points: 5, explanation: '意味関係が違います。' },
      ]},
      { id: 'm6l-3', customer: 'Email 3', line: 'The shipment was delayed ___ a customs inspection.', choices: [
        { id: 'm6l3-best', text: 'because of', response: 'Correct.', quality: 'best', points: 100, explanation: '後ろが名詞句なのでbecause ofが適切です。' },
        { id: 'm6l3-good', text: 'because', response: 'Because needs a clause after it.', quality: 'good', points: 25, explanation: '接続詞の後には節が必要です。' },
        { id: 'm6l3-poor', text: 'although', response: 'That would require a clause and a contrast.', quality: 'poor', points: 5, explanation: '文法・意味の両方が合いません。' },
      ]},
    ],
  },
  {
    id: 'exam-m6-handoff', kind: 'staff-coordination', title: 'Reference and parallelism', skill: 'Document Handoff',
    objective: '代名詞の照応を明確にし、並列構造をそろえて情報を引き継ぐ。', grammar: ['pronoun reference', 'parallelism / ellipsis'],
    grammarTargets: [{ key: 'PRONOUN_REFERENCE', role: 'target' }, { key: 'PARALLELISM_ELLIPSIS', role: 'target' }],
    customer: { id: 'daniel', name: 'Daniel', roleLabel: '法人注文の変更を依頼している', opening: 'Our buyer told the supplier that the order was urgent, but they did not say whether “they” meant the buyer or the supplier. We also need to confirm the quantity, delivery date, and whether the invoice can be revised.' },
    bestRoute: ['曖昧なtheyを解消する', '数量・納期・請求書を並列に整理する', 'Managerが判断できる情報だけ渡す'],
    maxFacts: 3, factsHeading: 'DOCUMENT NOTES', notesHeading: 'SELECTED FACTS', handoffHeading: 'STAFF → MANAGER', handoffTargetLabel: 'MANAGER',
    facts: [
      { id: 'm6h-f1', text: '“They” is ambiguous: buyer or supplier', essential: true },
      { id: 'm6h-f2', text: 'Confirm quantity and delivery date', essential: true },
      { id: 'm6h-f3', text: 'Confirm whether the invoice can be revised', essential: true },
      { id: 'm6h-f4', text: 'The buyer’s office has blue chairs', essential: false },
      { id: 'm6h-f5', text: 'The supplier’s logo is green', essential: false },
    ],
    handoffOptions: [
      { id: 'm6h-best', text: 'Please clarify who “they” refers to, confirm the quantity and delivery date, and check whether the invoice can be revised.', response: 'Clear. I’ll confirm those three points.', quality: 'best', points: 100, explanation: '照応を明確にし、3つの確認事項を並列にそろえています。' },
      { id: 'm6h-good', text: 'Please clarify “they” and check the order.', response: 'Which order details should I check?', quality: 'good', points: 65, explanation: '照応は改善しますが、必要な並列情報が不足しています。' },
      { id: 'm6h-poor', text: 'Please ask them about it and everything else.', response: 'That is still ambiguous.', quality: 'poor', points: 10, explanation: '代名詞も情報構造も曖昧なままです。' },
    ],
  },
]

export function examActivityById(id: string) {
  return examActivities.find((activity) => activity.id === id)
}
