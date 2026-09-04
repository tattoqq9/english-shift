import type { Chapter1Activity, Chapter1Day } from '../core/chapter1.js'

export const chapter5Days: Chapter1Day[] = [
  {
    day: 25,
    title: 'Take the Order',
    subtitle: '可算・不可算名詞と some / any を使い、注文内容を正確に確認する。',
    newLanguage: ['count / non-count nouns', 'some / any', 'articles'],
    reviewLanguage: ['how much / how many', 'basic questions'],
    gameFocus: 'Order Taking',
    activityIds: ['d25-coffee-order', 'd25-lunch-set', 'd25-order-rush'],
    canDo: ['注文の数量と種類を聞き分ける', 'some / any を注文確認で使う', '可算・不可算名詞に合う表現を選ぶ'],
  },
  {
    day: 26,
    title: 'How Much? How Many?',
    subtitle: 'much / many / a few / a little を使い、量や個数を正確に調整する。',
    newLanguage: ['much / many', 'a few / a little'],
    reviewLanguage: ['how much / how many', 'some / any'],
    gameFocus: 'Quantity Control',
    activityIds: ['d26-sugar-amount', 'd26-party-order', 'd26-quantity-rush'],
    canDo: ['量と個数で how much / how many を使い分ける', 'a few / a little の違いを理解する', '客の希望量に合わせて注文を調整する'],
  },
  {
    day: 27,
    title: 'Polite Service',
    subtitle: 'would like / could / would と丁寧な依頼表現を使い、注文・提案・確認を行う。',
    newLanguage: ['would like', 'could / would', 'Would it be possible...', 'adjective + that-clause'],
    reviewLanguage: ['can', 'please'],
    gameFocus: 'Polite Service',
    activityIds: ['d27-would-like', 'd27-offer-dessert', 'd27-polite-rush'],
    canDo: ['I would like... を注文として理解する', 'Could / Would で丁寧に確認する', '接客に合う丁寧さを選ぶ'],
  },
  {
    day: 28,
    title: 'Allergy Check',
    subtitle: 'if / unless と食材表現を使い、アレルギー条件を安全に確認する。',
    newLanguage: ['if / unless', 'ingredient language'],
    reviewLanguage: ['some / any', 'indirect questions'],
    gameFocus: 'Allergy Safety',
    activityIds: ['d28-nut-allergy', 'd28-cross-contact', 'd28-allergy-confirm'],
    canDo: ['アレルギー対象食材を具体的に確認する', 'if / unless で条件を理解する', '安全確認が不十分なとき断定しない'],
  },
  {
    day: 29,
    title: 'Sold Out',
    subtitle: 'another / other / whether / if を使い、品切れ時に条件に合う代案を提示する。',
    newLanguage: ['another / other', 'whether / if clauses'],
    reviewLanguage: ['comparison', 'would like'],
    gameFocus: 'Substitution / Out of Stock',
    activityIds: ['d29-soup-sold-out', 'd29-another-drink', 'd29-soldout-rush'],
    canDo: ['another と other を使い分ける', '代替候補の条件を確認する', '品切れでも客の目的を満たす案を出す'],
  },
  {
    day: 30,
    title: 'Dinner Rush',
    subtitle: 'Chapter 5の注文・数量・丁寧表現・アレルギー・代替対応を混雑時にまとめて使う。',
    newLanguage: ['higher-register polite requests'],
    reviewLanguage: ['Chapter 5 all'],
    gameFocus: 'Rush + Complaint + Handoff',
    activityIds: ['d30-dinner-rush', 'd30-allergy-handoff', 'd30-order-complaint'],
    canDo: ['混雑時でも重要情報を優先する', 'アレルギー情報を厨房へ正確に引き継ぐ', '注文ミスへの謝罪と修正を丁寧に行う'],
  },
]

export const chapter5Activities: Chapter1Activity[] = [
  {
    id: 'd25-coffee-order', kind: 'dialogue', title: 'Coffee with milk', skill: 'Order Taking',
    objective: '飲み物の注文で some / any を自然に使う。', grammar: ['some / any', 'non-count nouns'],
    customer: { id: 'mia', name: 'Mia', roleLabel: 'コーヒーを注文したい', opening: 'Can I have a coffee with some milk, but no sugar?' },
    bestRoute: ['coffeeを注文として認識する', 'milkは少量必要', 'sugarは不要と確認する'],
    choices: [
      { id: 'd25c-best', text: 'Of course. A coffee with some milk and no sugar.', response: 'Yes, exactly. Thank you.', quality: 'best', points: 100, explanation: '必要なmilkと不要なsugarを正確に復唱しています。' },
      { id: 'd25c-good', text: 'Sure. A coffee with milk.', response: 'And no sugar, please.', quality: 'good', points: 82, explanation: '主要注文は合っていますが、no sugar の条件を確認できていません。' },
      { id: 'd25c-poor', text: 'Would you like any sugar?', response: 'No, I just said no sugar.', quality: 'poor', points: 40, explanation: 'すでに明示された条件を再質問しており、注文処理が非効率です。' },
    ],
  },
  {
    id: 'd25-lunch-set', kind: 'information-hunt', title: 'Build the lunch set', skill: 'Order Information Hunt',
    objective: 'セット注文の不足情報を少ない質問で確認する。', grammar: ['articles', 'some / any', 'count nouns'],
    customer: { id: 'daniel', name: 'Daniel', roleLabel: 'ランチセットを注文したい', opening: 'I’ll have the lunch set, please. I know I want chicken, but I haven’t decided on the drink or side.' },
    bestRoute: ['drinkを確認する', 'sideを確認する', '指定された組合せを選ぶ'], maxQuestions: 2,
    questions: [
      { id: 'd25l-drink', text: 'Which drink would you like with the set?', response: 'Iced tea, please.', reveal: 'Drink: iced tea', value: 5 },
      { id: 'd25l-side', text: 'Would you like fries or a salad as your side?', response: 'A salad, please.', reveal: 'Side: salad', value: 5 },
      { id: 'd25l-chicken', text: 'Would you like chicken?', response: 'Yes. I already said chicken.', reveal: 'Main: chicken', value: 1 },
      { id: 'd25l-seat', text: 'Where are you sitting?', response: 'Near the window.', reveal: 'Seat: window', value: 1 },
    ],
    candidates: [
      { id: 'd25l-a', name: 'Chicken + Salad + Iced Tea', details: 'chicken · salad · iced tea', correct: true },
      { id: 'd25l-b', name: 'Chicken + Fries + Iced Tea', details: 'chicken · fries · iced tea' },
      { id: 'd25l-c', name: 'Chicken + Salad + Coffee', details: 'chicken · salad · coffee' },
      { id: 'd25l-d', name: 'Fish + Salad + Iced Tea', details: 'fish · salad · iced tea' },
    ],
  },
  {
    id: 'd25-order-rush', kind: 'rapid', title: 'Three quick orders', skill: 'Order Rush',
    objective: '可算・不可算名詞と数量表現を連続して処理する。', grammar: ['count / non-count nouns', 'some / any'],
    customer: { id: 'grace', name: 'Lunch rush', roleLabel: '3件の注文が続く', opening: 'Three customers are ready to order at the same time.' },
    bestRoute: ['数量表現に注目する', '注文条件を省略しない', '客の言い方に合う返答を選ぶ'],
    scenarios: [
      { id: 'd25r-1', customer: 'Customer 1', line: 'Could I get two sandwiches and some water?', choices: [
        { id: 'd25r1-best', text: 'Certainly. Two sandwiches and some water.', response: 'That’s right.', quality: 'best', points: 100, explanation: 'sandwiches と water の数量表現を正確に復唱しています。' },
        { id: 'd25r1-good', text: 'Certainly. Two sandwiches and water.', response: 'Yes.', quality: 'good', points: 88, explanation: '意味は十分通じますが、some の情報を保持した方が学習上明確です。' },
        { id: 'd25r1-poor', text: 'Certainly. Two water and a sandwich.', response: 'No, that’s not my order.', quality: 'poor', points: 20, explanation: '個数と品目を取り違えています。' },
      ]},
      { id: 'd25r-2', customer: 'Customer 2', line: 'I don’t want any onions on the burger.', choices: [
        { id: 'd25r2-best', text: 'No onions on the burger. Got it.', response: 'Thanks.', quality: 'best', points: 100, explanation: '否定条件をそのまま確認できています。' },
        { id: 'd25r2-good', text: 'You don’t want onions.', response: 'Right.', quality: 'good', points: 90, explanation: '意味は合っていますが、burgerへの条件だと明示するとより正確です。' },
        { id: 'd25r2-poor', text: 'Would you like some onions?', response: 'No.', quality: 'poor', points: 25, explanation: '明示された不要条件を逆に質問しています。' },
      ]},
      { id: 'd25r-3', customer: 'Customer 3', line: 'Do you have any soup left?', choices: [
        { id: 'd25r3-best', text: 'Yes. We still have some tomato soup.', response: 'Great. I’ll have that.', quality: 'best', points: 100, explanation: 'any で聞かれた在庫に some で自然に答えています。' },
        { id: 'd25r3-good', text: 'Yes. We have tomato soup.', response: 'Okay.', quality: 'good', points: 90, explanation: '十分自然ですが、some / any の練習としては情報が少なめです。' },
        { id: 'd25r3-poor', text: 'No. We have some soup.', response: 'So... do you have soup?', quality: 'poor', points: 15, explanation: 'Yes/Noの内容が矛盾しています。' },
      ]},
    ],
  },
  {
    id: 'd26-sugar-amount', kind: 'dialogue', title: 'Just a little sugar', skill: 'Quantity Clarification',
    objective: 'a little / a few を適切に使い分ける。', grammar: ['a little / a few'],
    customer: { id: 'grace', name: 'Grace', roleLabel: '紅茶の砂糖を少量にしたい', opening: 'Could you put just a little sugar in my tea?' },
    bestRoute: ['sugarは不可算名詞と判断する', 'a little を使う', '少量であることを確認する'],
    choices: [
      { id: 'd26s-best', text: 'Of course. Just a little sugar.', response: 'Perfect.', quality: 'best', points: 100, explanation: '不可算名詞 sugar に a little を使っています。' },
      { id: 'd26s-good', text: 'Of course. Not much sugar.', response: 'That’s fine.', quality: 'good', points: 88, explanation: '意味は適切ですが、今回のターゲット表現 a little を使っていません。' },
      { id: 'd26s-poor', text: 'Of course. Just a few sugar.', response: 'A few?', quality: 'poor', points: 35, explanation: 'a few は数えられる複数名詞に使います。' },
    ],
  },
  {
    id: 'd26-party-order', kind: 'information-hunt', title: 'Snacks for six people', skill: 'Quantity Hunt',
    objective: '人数と希望量を確認し、適切なパーティー注文を選ぶ。', grammar: ['how many', 'how much', 'a few'],
    customer: { id: 'daniel', name: 'Daniel', roleLabel: '6人分の軽食を注文したい', opening: 'I need some snacks and drinks for a small meeting.' },
    bestRoute: ['人数を確認する', '飲み物の本数を確認する', '必要量に合うセットを選ぶ'], maxQuestions: 2,
    questions: [
      { id: 'd26p-people', text: 'How many people is the meeting for?', response: 'Six people.', reveal: 'People: 6', value: 5 },
      { id: 'd26p-drinks', text: 'How many bottles of water would you like?', response: 'Eight bottles would be enough.', reveal: 'Water: 8 bottles', value: 5 },
      { id: 'd26p-time', text: 'What time is the meeting?', response: 'At three.', reveal: 'Meeting: 3 p.m.', value: 1 },
      { id: 'd26p-room', text: 'Which room is it in?', response: 'Room B.', reveal: 'Room B', value: 1 },
    ],
    candidates: [
      { id: 'd26p-a', name: 'Meeting Set A', details: '6 snack portions · 8 waters', correct: true },
      { id: 'd26p-b', name: 'Meeting Set B', details: '4 snack portions · 8 waters' },
      { id: 'd26p-c', name: 'Meeting Set C', details: '6 snack portions · 4 waters' },
      { id: 'd26p-d', name: 'Large Set', details: '12 snack portions · 12 waters' },
    ],
  },
  {
    id: 'd26-quantity-rush', kind: 'rapid', title: 'Quantity counter', skill: 'Quantity Rush',
    objective: 'much / many / a few / a little を素早く判断する。', grammar: ['much / many', 'a few / a little'],
    customer: { id: 'mia', name: 'Counter rush', roleLabel: '量についての質問が続く', opening: 'Three customers ask about quantities and portions.' },
    bestRoute: ['数えられるか判断する', '量か個数か判断する', '適切な数量語を使う'],
    scenarios: [
      { id: 'd26r-1', customer: 'Customer 1', line: 'How many cookies come with the set?', choices: [
        { id: 'd26r1-best', text: 'It comes with a few cookies — three in total.', response: 'Great.', quality: 'best', points: 100, explanation: '数えられるcookiesに a few を使い、具体数も示しています。' },
        { id: 'd26r1-good', text: 'It comes with three cookies.', response: 'Thanks.', quality: 'good', points: 92, explanation: '正確ですが、a few の練習要素はありません。' },
        { id: 'd26r1-poor', text: 'It comes with a little cookies.', response: 'Sorry?', quality: 'poor', points: 30, explanation: 'cookies は可算複数なので a few が適切です。' },
      ]},
      { id: 'd26r-2', customer: 'Customer 2', line: 'Is there much cream in this pasta?', choices: [
        { id: 'd26r2-best', text: 'No. It only has a little cream.', response: 'Good. That works for me.', quality: 'best', points: 100, explanation: '不可算名詞creamに a little を使っています。' },
        { id: 'd26r2-good', text: 'No. It does not have much cream.', response: 'Okay.', quality: 'good', points: 92, explanation: '質問に直接対応した自然な表現です。' },
        { id: 'd26r2-poor', text: 'No. It has a few cream.', response: 'A few cream?', quality: 'poor', points: 30, explanation: 'cream は不可算名詞です。' },
      ]},
      { id: 'd26r-3', customer: 'Customer 3', line: 'How much rice comes with the curry?', choices: [
        { id: 'd26r3-best', text: 'About 200 grams. We can give you a little less if you prefer.', response: '200 grams is fine.', quality: 'best', points: 100, explanation: '不可算のriceを量として扱い、調整案も示しています。' },
        { id: 'd26r3-good', text: 'About 200 grams.', response: 'Okay.', quality: 'good', points: 90, explanation: '必要情報には正確に答えています。' },
        { id: 'd26r3-poor', text: 'About many rice.', response: 'How much?', quality: 'poor', points: 20, explanation: 'riceにmanyは使いません。' },
      ]},
    ],
  },
  {
    id: 'd27-would-like', kind: 'dialogue', title: 'I would like...', skill: 'Polite Order',
    objective: 'would like を注文表現として理解して自然に受ける。', grammar: ['would like'],
    customer: { id: 'mia', name: 'Mia', roleLabel: '丁寧に注文している', opening: 'I would like the grilled chicken sandwich, please.' },
    bestRoute: ['would likeを希望として理解する', '注文品を確認する', '自然に注文を受ける'],
    choices: [
      { id: 'd27w-best', text: 'Certainly. One grilled chicken sandwich.', response: 'Yes, please.', quality: 'best', points: 100, explanation: '丁寧な注文を簡潔に確認しています。' },
      { id: 'd27w-good', text: 'You want the grilled chicken sandwich, right?', response: 'Yes.', quality: 'good', points: 82, explanation: '意味は正しいですが、接客として少し直接的です。' },
      { id: 'd27w-poor', text: 'Why would you like it?', response: 'I just want to order it.', quality: 'poor', points: 30, explanation: 'would like を仮定の would と取り違えています。' },
    ],
  },
  {
    id: 'd27-offer-dessert', kind: 'dialogue', title: 'Offer a dessert', skill: 'Polite Offer',
    objective: 'be + adjective + 補文とWould you like...? で自然に追加提案する。', grammar: ['adjective + that-clause', 'would', 'polite offers'], grammarTargets: [{ key: 'ADJECTIVE_THAT_CLAUSE', role: 'target' }],
    customer: { id: 'grace', name: 'Grace', roleLabel: '食後の追加注文を考えている', opening: 'That was delicious. I think I’m done.' },
    bestRoute: ['食事終了を理解する', '押しつけずに提案する', 'Would you like...? を使う'],
    choices: [
      { id: 'd27o-best', text: 'I’m glad you enjoyed it. Would you like to see the dessert menu?', response: 'Yes, please. I might have something small.', quality: 'best', points: 100, explanation: 'be + adjective + 補文で感想を受け止めてから、丁寧な追加提案へ進んでいます。thatは会話では省略できます。' },
      { id: 'd27o-good', text: 'Do you want dessert?', response: 'Maybe. What do you have?', quality: 'good', points: 80, explanation: '意味は通じますが、接客では Would you like...? の方が丁寧です。' },
      { id: 'd27o-poor', text: 'You should order dessert.', response: 'I’m not sure I want one.', quality: 'poor', points: 35, explanation: '助言のshouldは押しつけが強く、追加提案に不向きです。' },
    ],
  },
  {
    id: 'd27-polite-rush', kind: 'rapid', title: 'Polite service rush', skill: 'Polite Service Rush',
    objective: 'could / would / Would it be possible...? を使う丁寧な接客を素早く選ぶ。', grammar: ['could / would', 'would like', 'formal requests'], grammarTargets: [{ key: 'POLITE_FORMAL_REQUESTS', role: 'target' }],
    customer: { id: 'daniel', name: 'Service rush', roleLabel: '丁寧な対応が3件続く', opening: 'Three customers need quick but polite service.' },
    bestRoute: ['依頼と提案を区別する', '丁寧な助動詞を使う', '目的を明確にする'],
    scenarios: [
      { id: 'd27r-1', customer: 'Customer 1', line: 'Could I have another glass of water?', choices: [
        { id: 'd27r1-best', text: 'Of course. I’ll bring you another glass.', response: 'Thank you.', quality: 'best', points: 100, explanation: '依頼を理解し、即座に対応を約束しています。' },
        { id: 'd27r1-good', text: 'Yes, you can.', response: 'Could you bring it?', quality: 'good', points: 65, explanation: '許可として解釈し、実際のサービス行動が抜けています。' },
        { id: 'd27r1-poor', text: 'No, you could not.', response: 'Why not?', quality: 'poor', points: 15, explanation: '通常の追加水の依頼を不自然に拒否しています。' },
      ]},
      { id: 'd27r-2', customer: 'Customer 2', line: 'What would you recommend for dessert?', choices: [
        { id: 'd27r2-best', text: 'If you like chocolate, I’d recommend the chocolate tart.', response: 'That sounds good.', quality: 'best', points: 100, explanation: '条件付きで自然にrecommendしています。' },
        { id: 'd27r2-good', text: 'The chocolate tart is popular.', response: 'Okay.', quality: 'good', points: 85, explanation: '役立つ情報ですが、客の好みとの接続が弱いです。' },
        { id: 'd27r2-poor', text: 'You must order the chocolate tart.', response: 'Must?', quality: 'poor', points: 20, explanation: 'must は推薦には強すぎます。' },
      ]},
      { id: 'd27r-3', customer: 'Customer 3', line: 'Would it be possible to move to a quieter table?', choices: [
        { id: 'd27r3-best', text: 'Certainly. Would a table near the back be okay?', response: 'Yes, that would be great.', quality: 'best', points: 100, explanation: '希望を理解し、丁寧に具体案を確認しています。' },
        { id: 'd27r3-good', text: 'There is a quieter table near the back.', response: 'Can I sit there?', quality: 'good', points: 82, explanation: '情報は正しいですが、席変更の確認まで進んでいません。' },
        { id: 'd27r3-poor', text: 'You are quiet.', response: 'I mean the table area.', quality: 'poor', points: 10, explanation: 'quieter が場所の条件だと理解できていません。' },
      ]},
    ],
  },
  {
    id: 'd28-nut-allergy', kind: 'information-hunt', title: 'Nut allergy', skill: 'Allergy Information Hunt',
    objective: 'アレルギー条件を具体化し、安全なメニューを特定する。', grammar: ['if', 'ingredient language'],
    customer: { id: 'mia', name: 'Mia', roleLabel: 'ナッツアレルギーがある', opening: 'I have a nut allergy. I need something that does not contain nuts.' },
    bestRoute: ['ピーナッツだけか全ナッツか確認する', 'cross-contactの許容可否を確認する', '安全条件を満たすメニューを選ぶ'], maxQuestions: 2,
    questions: [
      { id: 'd28n-type', text: 'Are you allergic to all nuts, including almonds and walnuts?', response: 'Yes. I need to avoid all nuts.', reveal: 'Avoid all nuts', value: 5 },
      { id: 'd28n-contact', text: 'Do you also need to avoid food prepared on shared equipment?', response: 'Yes. Even cross-contact could be dangerous for me.', reveal: 'Must avoid shared equipment', value: 5 },
      { id: 'd28n-spicy', text: 'Do you like spicy food?', response: 'A little, but that is not the main issue.', reveal: 'Spice low priority', value: 1 },
      { id: 'd28n-drink', text: 'Would you like a drink?', response: 'Later, thanks.', reveal: 'Drink undecided', value: 1 },
    ],
    candidates: [
      { id: 'd28n-a', name: 'Rice Bowl', details: 'no nuts · separate prep area · verified ingredients', correct: true },
      { id: 'd28n-b', name: 'Green Salad', details: 'no nuts in recipe · prepared beside walnut salad' },
      { id: 'd28n-c', name: 'Chicken Curry', details: 'contains cashew paste' },
      { id: 'd28n-d', name: 'Cookie Plate', details: 'may contain almond traces' },
    ],
  },
  {
    id: 'd28-cross-contact', kind: 'troubleshooting', title: 'Shared equipment risk', skill: 'Allergy Safety Troubleshooting',
    objective: 'アレルギー客の条件と調理環境を照合して安全判断する。', grammar: ['if / unless', 'ingredient language'],
    customer: { id: 'daniel', name: 'Daniel', roleLabel: '甲殻類アレルギーがある', opening: 'I’m allergic to shrimp. The fries look safe, but I’m worried about the fryer.' },
    bestRoute: ['shared fryerか確認する', '反応の重さを確認する', '安全な別調理品を提案する'], maxQuestions: 2,
    causes: [
      { id: 'shared-fryer', label: 'Fries share oil with shrimp' },
      { id: 'shrimp-ingredient', label: 'Shrimp is an ingredient in the fries' },
      { id: 'safe-separate', label: 'Fries use a dedicated fryer' },
    ],
    questions: [
      { id: 'd28x-fryer', text: 'Do you need to avoid food cooked in the same oil as shrimp?', response: 'Yes. I can have a serious reaction from cross-contact.', reveal: 'Cross-contact is unsafe', value: 5, confirms: 'shared-fryer' },
      { id: 'd28x-kitchen', text: 'Are the fries cooked in a separate fryer?', response: 'The kitchen says they share the fryer with fried shrimp.', reveal: 'Shared fryer confirmed', value: 5, confirms: 'shared-fryer' },
      { id: 'd28x-size', text: 'Would you like a large portion?', response: 'Size does not matter if it is not safe.', reveal: 'Portion irrelevant', value: 1 },
      { id: 'd28x-salt', text: 'Would you like extra salt?', response: 'No preference.', reveal: 'Salt irrelevant', value: 1 },
    ],
    solutions: [
      { id: 'd28x-safe', text: 'Avoid the shared fryer and offer a side prepared on separate equipment.', cause: 'shared-fryer' },
      { id: 'd28x-fries', text: 'Serve the fries because shrimp is not listed as an ingredient.', cause: 'shrimp-ingredient' },
      { id: 'd28x-more', text: 'Serve a larger portion of the same fries.', cause: 'safe-separate' },
    ],
    correctCause: 'shared-fryer',
  },
  {
    id: 'd28-allergy-confirm', kind: 'dialogue', title: 'Do not overpromise', skill: 'Allergy Safety',
    objective: '安全確認できていないとき、断定せず確認を取る。', grammar: ['if', 'polite clarification'],
    customer: { id: 'grace', name: 'Grace', roleLabel: 'ソースの乳製品を確認したい', opening: 'Does this sauce contain any dairy? I’m allergic to milk.' },
    bestRoute: ['アレルギーを重要条件と認識する', '不確実なら断定しない', 'ingredient listまたは厨房へ確認する'],
    choices: [
      { id: 'd28a-best', text: 'I’m not completely sure, so I’ll check the ingredient list and ask the kitchen before you order.', response: 'Thank you. I appreciate that.', quality: 'best', points: 100, explanation: '安全上重要な不確実性を認め、確認してから案内しています。' },
      { id: 'd28a-good', text: 'I think it is dairy-free, but let me confirm.', response: 'Please do.', quality: 'good', points: 82, explanation: '最終的に確認しますが、アレルギー場面では推測を先に述べない方が安全です。' },
      { id: 'd28a-poor', text: 'It should be fine.', response: 'Are you sure?', quality: 'poor', points: 20, explanation: '根拠のない安全断定は避けるべきです。' },
    ],
  },
  {
    id: 'd29-soup-sold-out', kind: 'information-hunt', title: 'The soup is sold out', skill: 'Alternative Hunt',
    objective: '品切れ商品で客が重視していた条件を確認し、代替品を選ぶ。', grammar: ['another / other', 'whether / if'],
    customer: { id: 'grace', name: 'Grace', roleLabel: '売り切れの野菜スープの代わりを探している', opening: 'Oh, the vegetable soup is sold out. I wanted something warm and light.' },
    bestRoute: ['warmが必須か確認する', 'vegetarian条件を確認する', '条件を満たす代替を選ぶ'], maxQuestions: 2,
    questions: [
      { id: 'd29s-warm', text: 'Would you like another warm dish, or would a cold option be okay?', response: 'I’d really prefer something warm.', reveal: 'Must be warm', value: 5 },
      { id: 'd29s-veg', text: 'Do you need the other option to be vegetarian too?', response: 'Yes, please. I don’t eat meat.', reveal: 'Must be vegetarian', value: 5 },
      { id: 'd29s-color', text: 'What color was the soup?', response: 'I’m not sure.', reveal: 'Color irrelevant', value: 1 },
      { id: 'd29s-table', text: 'Which table are you at?', response: 'Table five.', reveal: 'Table 5', value: 1 },
    ],
    candidates: [
      { id: 'd29s-a', name: 'Warm Tomato Stew', details: 'warm · vegetarian · light portion', correct: true },
      { id: 'd29s-b', name: 'Chicken Soup', details: 'warm · contains chicken · light' },
      { id: 'd29s-c', name: 'Garden Salad', details: 'cold · vegetarian · light' },
      { id: 'd29s-d', name: 'Cheese Pasta', details: 'warm · vegetarian · heavy' },
    ],
  },
  {
    id: 'd29-another-drink', kind: 'dialogue', title: 'Another drink?', skill: 'Alternative Service',
    objective: 'another / other を使って追加・別種類を区別する。', grammar: ['another / other'],
    customer: { id: 'daniel', name: 'Daniel', roleLabel: '同じ飲み物をもう一杯ほしい', opening: 'This lemonade is great. Could I have another one?' },
    bestRoute: ['another oneを同じ種類の追加1つと理解する', '注文を確認する', '余計な変更を加えない'],
    choices: [
      { id: 'd29d-best', text: 'Of course. I’ll bring you another lemonade.', response: 'Thanks.', quality: 'best', points: 100, explanation: 'another = 同種のもう1つ、と正確に理解しています。' },
      { id: 'd29d-good', text: 'Would you like another lemonade?', response: 'Yes, please.', quality: 'good', points: 84, explanation: '正しいですが、すでに明確な注文を再確認しています。' },
      { id: 'd29d-poor', text: 'Which other drinks do you want?', response: 'No, I want another lemonade.', quality: 'poor', points: 35, explanation: 'another と other の意味を取り違えています。' },
    ],
  },
  {
    id: 'd29-soldout-rush', kind: 'rapid', title: 'Sold-out rush', skill: 'Out of Stock Rush',
    objective: '品切れ時にanother / other / whetherを使って代替対応する。', grammar: ['another / other', 'whether / if'],
    customer: { id: 'mia', name: 'Sold-out rush', roleLabel: '3つの品切れ対応が続く', opening: 'Several popular items sell out during the evening rush.' },
    bestRoute: ['客の必須条件を残す', '同種追加と別種類を区別する', '代替可能か丁寧に確認する'],
    scenarios: [
      { id: 'd29r-1', customer: 'Customer 1', line: 'The salmon sandwich is sold out? Do you have any other fish options?', choices: [
        { id: 'd29r1-best', text: 'Yes. We have a tuna sandwich and a grilled fish plate.', response: 'I’ll take the tuna sandwich.', quality: 'best', points: 100, explanation: 'other fish options に対して複数の別候補を提示しています。' },
        { id: 'd29r1-good', text: 'We have a tuna sandwich.', response: 'That works.', quality: 'good', points: 90, explanation: '十分な代案ですが、複数候補を求めるニュアンスには一部だけ対応しています。' },
        { id: 'd29r1-poor', text: 'I’ll bring you another salmon sandwich.', response: 'But you said it was sold out.', quality: 'poor', points: 15, explanation: '売り切れの商品をanotherで追加できることにしています。' },
      ]},
      { id: 'd29r-2', customer: 'Customer 2', line: 'Can you tell me whether the mushroom pasta is still available?', choices: [
        { id: 'd29r2-best', text: 'Yes. It is still available.', response: 'Great, I’ll order it.', quality: 'best', points: 100, explanation: 'whether以下の確認内容へ直接答えています。' },
        { id: 'd29r2-good', text: 'We have mushroom pasta.', response: 'Good.', quality: 'good', points: 92, explanation: '意味は同じで十分自然です。' },
        { id: 'd29r2-poor', text: 'Whether is available.', response: 'Sorry?', quality: 'poor', points: 20, explanation: 'whether節の構造を回答文に誤って持ち込んでいます。' },
      ]},
      { id: 'd29r-3', customer: 'Customer 3', line: 'If the cheesecake is gone, I’ll have something chocolate instead.', choices: [
        { id: 'd29r3-best', text: 'The cheesecake is sold out, but we have a chocolate tart and chocolate ice cream.', response: 'I’ll take the tart.', quality: 'best', points: 100, explanation: 'if条件が成立したので、客のchocolate条件を満たす代案を出しています。' },
        { id: 'd29r3-good', text: 'The cheesecake is sold out. Would you like chocolate tart?', response: 'Yes.', quality: 'good', points: 92, explanation: '条件を満たす良い代案です。' },
        { id: 'd29r3-poor', text: 'The cheesecake is sold out. Would you like fruit salad?', response: 'I wanted something chocolate.', quality: 'poor', points: 35, explanation: '客が明示した代替条件を無視しています。' },
      ]},
    ],
  },
  {
    id: 'd30-dinner-rush', kind: 'rapid', title: 'Dinner rush', skill: 'Dinner Rush',
    objective: 'Chapter 5の表現を混雑時に連続して使う。', grammar: ['Chapter 5 all'],
    customer: { id: 'mia', name: 'Dinner rush', roleLabel: '閉店前の注文が集中', opening: 'The café is full, and three tables need help at once.' },
    bestRoute: ['注文条件を省略しない', '安全条件を最優先する', '丁寧でも簡潔に対応する'],
    scenarios: [
      { id: 'd30r-1', customer: 'Table 2', line: 'Could we have a few more forks, please?', choices: [
        { id: 'd30r1-best', text: 'Of course. I’ll bring you a few more forks.', response: 'Thank you.', quality: 'best', points: 100, explanation: '可算複数forksと丁寧な依頼の両方に自然に対応しています。' },
        { id: 'd30r1-good', text: 'Sure. I’ll bring more forks.', response: 'Thanks.', quality: 'good', points: 90, explanation: '自然ですが、a fewの数量感は保持していません。' },
        { id: 'd30r1-poor', text: 'I’ll bring a little forks.', response: 'A little?', quality: 'poor', points: 25, explanation: 'forksにはa fewを使います。' },
      ]},
      { id: 'd30r-2', customer: 'Table 5', line: 'I have a severe sesame allergy. Is this dressing safe?', choices: [
        { id: 'd30r2-best', text: 'I’ll check the ingredients and confirm with the kitchen before I tell you it is safe.', response: 'Thank you.', quality: 'best', points: 100, explanation: '重いアレルギーで安全確認を最優先しています。' },
        { id: 'd30r2-good', text: 'I think it is safe, but I’ll check.', response: 'Please check first.', quality: 'good', points: 70, explanation: '確認はしますが、推測による安全表現は避けるべきです。' },
        { id: 'd30r2-poor', text: 'It is probably fine.', response: 'Probably?', quality: 'poor', points: 10, explanation: '重大な安全条件に対して不確かな断定をしています。' },
      ]},
      { id: 'd30r-3', customer: 'Table 7', line: 'The iced tea is sold out? Could I have another cold drink without caffeine?', choices: [
        { id: 'd30r3-best', text: 'Yes. We have sparkling water and lemonade, and both are caffeine-free.', response: 'Lemonade, please.', quality: 'best', points: 100, explanation: 'cold / caffeine-freeの条件を保った複数代案を提示しています。' },
        { id: 'd30r3-good', text: 'We have lemonade.', response: 'Is it caffeine-free?', quality: 'good', points: 75, explanation: '代案は適切ですが、重要条件を先に確認できていません。' },
        { id: 'd30r3-poor', text: 'Would you like hot coffee?', response: 'No, I said cold and caffeine-free.', quality: 'poor', points: 10, explanation: '客の2つの条件を両方無視しています。' },
      ]},
    ],
  },
  {
    id: 'd30-allergy-handoff', kind: 'staff-coordination', title: 'Tell the kitchen', skill: 'Kitchen Handoff',
    objective: 'アレルギー客の重要情報を厨房へ簡潔かつ正確に引き継ぐ。', grammar: ['staff handoff', 'if / ingredient language'],
    customer: { id: 'grace', name: 'Grace', roleLabel: '卵アレルギーの注文を安全に通したい', opening: 'I’m allergic to eggs. I ordered the grilled fish without sauce, and I need the kitchen to use clean utensils because cross-contact is a problem for me.' },
    bestRoute: ['egg allergyを選ぶ', '注文品と変更を選ぶ', 'clean utensils / cross-contactを選ぶ', '3情報を含むhandoffを選ぶ'],
    maxFacts: 3,
    facts: [
      { id: 'd30f-allergy', text: 'Severe egg allergy', essential: true },
      { id: 'd30f-order', text: 'Grilled fish without sauce', essential: true },
      { id: 'd30f-contact', text: 'Needs clean utensils to avoid cross-contact', essential: true },
      { id: 'd30f-seat', text: 'Sitting near the window', essential: false },
      { id: 'd30f-drink', text: 'Drinking water', essential: false },
      { id: 'd30f-time', text: 'Arrived ten minutes ago', essential: false },
    ],
    handoffOptions: [
      { id: 'd30h-best', text: 'Table four has a severe egg allergy. The grilled fish must be served without sauce and prepared with clean utensils to avoid cross-contact.', response: 'Understood. We’ll prepare it separately.', quality: 'best', points: 30, explanation: 'アレルギー・注文変更・cross-contact対策の3点を明確に伝えています。' },
      { id: 'd30h-good', text: 'The customer ordered grilled fish and has an allergy.', response: 'Which allergy, and do we need special preparation?', quality: 'good', points: 16, explanation: '重要情報が不足し、厨房側に再確認が必要です。' },
      { id: 'd30h-poor', text: 'The customer near the window needs fish.', response: 'Anything else we need to know?', quality: 'poor', points: 4, explanation: '安全上重要な情報が伝わっていません。' },
    ],
  },
  {
    id: 'd30-order-complaint', kind: 'dialogue', title: 'Wrong side dish', skill: 'Complaint Recovery',
    objective: '注文ミスに対して謝罪し、正しい修正を丁寧に提示する。', grammar: ['would / could', 'order language'],
    customer: { id: 'daniel', name: 'Daniel', roleLabel: '注文と違うサイドが届いた', opening: 'Excuse me. I ordered a salad, but this came with fries.' },
    bestRoute: ['注文ミスを認識する', '謝罪する', '正しい品へ交換する行動を伝える'],
    choices: [
      { id: 'd30c-best', text: 'I’m sorry about that. I’ll replace the fries with the salad you ordered right away.', response: 'Thank you.', quality: 'best', points: 100, explanation: '謝罪・問題確認・具体的修正を一度に伝えています。' },
      { id: 'd30c-good', text: 'I’m sorry. Would you like me to bring a salad?', response: 'Yes, please.', quality: 'good', points: 85, explanation: '丁寧ですが、本来注文済みのsaladなので確認なしで修正してもよい場面です。' },
      { id: 'd30c-poor', text: 'Fries are good too.', response: 'But that is not what I ordered.', quality: 'poor', points: 15, explanation: '注文ミスを解決せず、客に受け入れを求めています。' },
    ],
  },
]

export function chapter5ActivityById(id: string) {
  return chapter5Activities.find((activity) => activity.id === id)
}
