import type { Chapter1Activity, Chapter1Day } from '../core/chapter1.js'

export const chapter1Days: Chapter1Day[] = [
  {
    day: 1,
    title: 'First Shift',
    subtitle: 'まずは短い接客を確実に。',
    newLanguage: ['be / do', 'affirmative / negative', 'basic service responses'],
    reviewLanguage: [],
    gameFocus: 'Basic service',
    activityIds: ['d1-umbrella', 'd1-bag', 'd1-sale'],
    canDo: ['商品の有無を答える', '袋が必要か確認する', 'セール対象か説明する'],
  },
  {
    day: 2,
    title: 'Find It Fast',
    subtitle: 'where / there is / 前置詞で店内を案内する。',
    newLanguage: ['where', 'there is / are', 'next to / near / behind'],
    reviewLanguage: ['be / do', 'can'],
    gameFocus: 'Information Hunt',
    activityIds: ['d2-restroom', 'd2-snack-hunt', 'd2-atm'],
    canDo: ['場所を説明する', '必要な条件を質問して商品を特定する', '店内設備を案内する'],
  },
  {
    day: 3,
    title: 'Checkout Basics',
    subtitle: '数量・金額・can を使って会計を処理する。',
    newLanguage: ['how much', 'how many', 'can'],
    reviewLanguage: ['this / that', 'basic questions'],
    gameFocus: 'Checkout / Processing',
    activityIds: ['d3-total', 'd3-bags', 'd3-coins'],
    canDo: ['合計金額を伝える', '数量を確認する', '支払い方法について答える'],
  },
  {
    day: 4,
    title: 'What Is Happening?',
    subtitle: '現在進行形と丁寧な案内で、店内の状況に対応する。',
    newLanguage: ['present progressive', 'please + imperative'],
    reviewLanguage: ['where', 'there is / are', 'can'],
    gameFocus: 'Guidance + Micro Events',
    activityIds: ['d4-person-hunt', 'd4-child', 'd4-line'],
    canDo: ['今起きていることを説明する', '人を特徴から特定する', '丁寧に待機をお願いする'],
  },
  {
    day: 5,
    title: 'Payment Trouble',
    subtitle: 'what / why / negative を使ってトラブル原因を切り分ける。',
    newLanguage: ['what / why', 'negative forms', 'problem questions'],
    reviewLanguage: ['can', 'present progressive'],
    gameFocus: 'Troubleshooting',
    activityIds: ['d5-card-fix', 'd5-price-tag', 'd5-receipt'],
    canDo: ['支払いトラブルの原因を質問する', '価格表示の違いを説明する', 'レシートの有無を確認する'],
  },
  {
    day: 6,
    title: 'Busy Shift',
    subtitle: 'Chapter 1総復習。複数の仕事を連続で処理する。',
    newLanguage: [],
    reviewLanguage: ['Chapter 1 all'],
    gameFocus: 'Mixed / Rush',
    activityIds: ['d6-rush', 'd6-hunt', 'd6-fix'],
    canDo: ['基本接客を素早く処理する', '質問で必要情報を絞る', '簡単なトラブルを診断する'],
  },
]

export const chapter1Activities: Chapter1Activity[] = [
  {
    id: 'd1-umbrella', kind: 'dialogue', title: 'Do you sell umbrellas?', skill: 'Basic response',
    objective: '傘の売り場を短く自然に案内する。', grammar: ['do question', 'there / location'],
    customer: { id: 'mia', name: 'Mia', roleLabel: '雨が降り始めた', opening: 'Excuse me. Do you sell umbrellas?' },
    bestRoute: ['Yes / No を正しく返す', '必要なら場所を1文で追加する'],
    choices: [
      { id: 'd1u-best', text: 'Yes, we do. They’re near the entrance.', response: 'Great, thank you!', quality: 'best', points: 100, explanation: 'Do you...? に Yes, we do. と答え、売り場も同時に案内しています。' },
      { id: 'd1u-good', text: 'Yes. Near the entrance.', response: 'Okay, thanks.', quality: 'good', points: 75, explanation: '意味は十分通じますが、完全な文にするとより自然です。' },
      { id: 'd1u-poor', text: 'Yes, we are.', response: 'Sorry... you are?', quality: 'poor', points: 25, explanation: 'Do you sell...? への短答は Yes, we do. が自然です。' },
    ],
  },
  {
    id: 'd1-bag', kind: 'checkout', title: 'A bag?', skill: 'Checkout', objective: '袋が必要か確認する。',
    grammar: ['do question', 'need'], customer: { id: 'grace', name: 'Grace', roleLabel: '会計中', opening: 'I only have these two items.' },
    bestRoute: ['会計に必要な確認だけをする', 'Do you need...? を使う'],
    choices: [
      { id: 'd1b-best', text: 'Do you need a bag?', response: 'No, thank you. I have one.', quality: 'best', points: 100, explanation: '短く実用的な確認で、接客目的に直接つながります。' },
      { id: 'd1b-good', text: 'Would you like a bag?', response: 'No, thank you.', quality: 'good', points: 90, explanation: '非常に自然ですが、このChapterでは Do you need...? を中心に扱います。' },
      { id: 'd1b-poor', text: 'You need a bag.', response: 'No, I don’t.', quality: 'poor', points: 35, explanation: '客の希望を確認せず断定しています。疑問文で確認しましょう。' },
    ],
  },
  {
    id: 'd1-sale', kind: 'dialogue', title: 'Is this on sale?', skill: 'Status explanation', objective: 'セール対象外であることを説明する。',
    grammar: ['be question', 'negative', 'this / that'], grammarTargets: [{ key: 'PRONOUNS_DEMONSTRATIVES', role: 'target' }], customer: { id: 'daniel', name: 'Daniel', roleLabel: '値札を確認中', opening: 'Is this coffee on sale today?' },
    bestRoute: ['be動詞の質問へ自然に返す', '必要な追加情報だけ伝える'],
    choices: [
      { id: 'd1s-best', text: 'No, this one isn’t. That tea is on sale today.', response: 'I see. I’ll look at that one.', quality: 'best', points: 100, explanation: 'this one / that を使って、目の前の商品を混同せずに示しています。' },
      { id: 'd1s-good', text: 'No. Not today.', response: 'Okay.', quality: 'good', points: 75, explanation: '通じますが、No, it isn’t. の形を使うとより明確です。' },
      { id: 'd1s-poor', text: 'Yes, it isn’t.', response: 'Is it on sale or not?', quality: 'poor', points: 15, explanation: 'Yes と isn’t が矛盾しています。' },
    ],
  },
  {
    id: 'd2-restroom', kind: 'dialogue', title: 'Where is the restroom?', skill: 'Directions', objective: '前置詞を使って場所を案内する。',
    grammar: ['where', 'next to'], customer: { id: 'grace', name: 'Grace', roleLabel: '店内案内', opening: 'Excuse me. Where is the restroom?' },
    bestRoute: ['場所を1文で答える', '目印との位置関係を使う'],
    choices: [
      { id: 'd2r-best', text: 'It’s next to the ATM, near the entrance.', response: 'Thank you. I see it now.', quality: 'best', points: 100, explanation: 'next to と near を使って、迷いにくい案内になっています。' },
      { id: 'd2r-good', text: 'It’s over there.', response: 'Over there? Okay, thank you.', quality: 'good', points: 65, explanation: '通じる可能性はありますが、画面上では指差し情報がないため具体性が不足します。' },
      { id: 'd2r-poor', text: 'There are restroom.', response: 'Sorry, where?', quality: 'poor', points: 25, explanation: '存在だけでなく場所を伝える必要があります。' },
    ],
  },
  {
    id: 'd2-snack-hunt', kind: 'information-hunt', title: 'Find the snack', skill: 'Information Hunt',
    objective: '質問2回以内で、客が探している商品を4候補から特定する。', grammar: ['what', 'where', 'basic adjectives'],
    customer: { id: 'mia', name: 'Mia', roleLabel: '昨日見たお菓子を探している', opening: 'I saw a small snack here yesterday, but I forgot the name.' },
    bestRoute: ['形または売り場を聞く', '色/価格より候補を大きく減らす情報を優先する', '候補表と照合する'],
    maxQuestions: 2,
    questions: [
      { id: 'd2h-place', text: 'Where did you see it?', response: 'It was next to the bottled tea.', reveal: 'Next to bottled tea', value: 5 },
      { id: 'd2h-shape', text: 'What did the package look like?', response: 'It was a small red bag.', reveal: 'Small red bag', value: 5 },
      { id: 'd2h-price', text: 'How much was it?', response: 'Maybe around 180 yen.', reveal: 'Around ¥180', value: 3 },
      { id: 'd2h-brand', text: 'Do you remember the brand?', response: 'No, sorry.', reveal: 'Brand unknown', value: 1 },
    ],
    candidates: [
      { id: 'd2h-a', name: 'Mini Rice Crackers', details: 'Small red bag · next to bottled tea · ¥178', correct: true },
      { id: 'd2h-b', name: 'Potato Chips', details: 'Large red bag · snack aisle · ¥188' },
      { id: 'd2h-c', name: 'Seaweed Crisps', details: 'Small green bag · next to bottled tea · ¥178' },
      { id: 'd2h-d', name: 'Chocolate Bites', details: 'Small red box · checkout shelf · ¥198' },
    ],
  },
  {
    id: 'd2-atm', kind: 'dialogue', title: 'ATM directions', skill: 'Directions', objective: 'there is を使って設備の場所を説明する。',
    grammar: ['there is', 'behind'], customer: { id: 'daniel', name: 'Daniel', roleLabel: '現金を引き出したい', opening: 'Is there an ATM in this store?' },
    bestRoute: ['Yes, there is. / No, there isn’t. で答える', '場所を追加する'],
    choices: [
      { id: 'd2a-best', text: 'Yes, there is. It’s behind the ticket machine.', response: 'Perfect, thanks.', quality: 'best', points: 100, explanation: '存在と場所を一度に答えています。' },
      { id: 'd2a-good', text: 'Yes. Behind the ticket machine.', response: 'Thanks.', quality: 'good', points: 80, explanation: '意味は十分ですが、Yes, there is. を使うと今回の学習目標により合います。' },
      { id: 'd2a-poor', text: 'Yes, it is ATM.', response: 'Where is it?', quality: 'poor', points: 30, explanation: 'Is there...? には there is を使う方が自然です。' },
    ],
  },
  {
    id: 'd3-total', kind: 'checkout', title: 'Tell the total', skill: 'Checkout', objective: '合計金額を正確に伝える。',
    grammar: ['how much', 'numbers'], customer: { id: 'grace', name: 'Grace', roleLabel: '会計', opening: 'How much is it altogether?' },
    bestRoute: ['合計を確認する', '短く金額を伝える'],
    choices: [
      { id: 'd3t-best', text: 'It’s 680 yen altogether.', response: 'Here you are.', quality: 'best', points: 100, explanation: '金額と altogether を使って明確に答えています。' },
      { id: 'd3t-good', text: '680 yen.', response: 'Okay.', quality: 'good', points: 85, explanation: '接客では十分通じますが、完全な文も練習できます。' },
      { id: 'd3t-poor', text: 'It has 680 yen.', response: 'Sorry?', quality: 'poor', points: 25, explanation: '価格を伝えるときは It’s 680 yen. が自然です。' },
    ],
  },
  {
    id: 'd3-bags', kind: 'checkout', title: 'One bag or two?', skill: 'Quantity', objective: 'or疑問文を使って必要な袋の数を具体的に確認する。',
    grammar: ['how many', 'can', 'or question'], grammarTargets: [{ key: 'OR_QUESTIONS', role: 'target' }], customer: { id: 'mia', name: 'Mia', roleLabel: '袋の枚数を確認中', opening: 'Can I get some bags, please?' },
    bestRoute: ['数量が不明なら確認する', 'How many...? を使う'],
    choices: [
      { id: 'd3b-best', text: 'Of course. Do you need one bag or two?', response: 'Two, please.', quality: 'best', points: 100, explanation: 'orで具体的な選択肢を示し、短時間で必要数を確認しています。' },
      { id: 'd3b-good', text: 'How many?', response: 'Two, please.', quality: 'good', points: 80, explanation: '通じますが、接客としては少し短すぎます。' },
      { id: 'd3b-poor', text: 'You can get five bags.', response: 'I only need two.', quality: 'poor', points: 35, explanation: '数量を決めつけず、客に確認する必要があります。' },
    ],
  },
  {
    id: 'd3-coins', kind: 'dialogue', title: 'Can I pay with coins?', skill: 'Payment', objective: '支払い可否をcanで答える。',
    grammar: ['can', 'payment'], customer: { id: 'daniel', name: 'Daniel', roleLabel: '支払い方法', opening: 'Can I pay with these coins?' },
    bestRoute: ['Can I...? に can で自然に答える', '必要なら条件を追加する'],
    choices: [
      { id: 'd3c-best', text: 'Yes, you can.', response: 'Great.', quality: 'best', points: 100, explanation: 'Can I...? に対する明確で自然な返答です。' },
      { id: 'd3c-good', text: 'Yes, that’s okay.', response: 'Thanks.', quality: 'good', points: 90, explanation: '自然な表現ですが、今回は can の応答練習です。' },
      { id: 'd3c-poor', text: 'Yes, I can.', response: 'You can?', quality: 'poor', points: 30, explanation: '客が支払えるかを聞いているため、主語は you です。' },
    ],
  },
  {
    id: 'd4-person-hunt', kind: 'information-hunt', title: 'Find the staff member', skill: 'Information Hunt',
    objective: '現在の見た目・位置を質問して、探している店員を特定する。', grammar: ['present progressive', 'where'],
    customer: { id: 'grace', name: 'Grace', roleLabel: 'さっき対応した店員を探している', opening: 'I’m looking for the staff member who helped me a minute ago.' },
    bestRoute: ['現在の服装/行動を聞く', '場所情報を組み合わせる', '候補を特定する'], maxQuestions: 2,
    questions: [
      { id: 'd4p-doing', text: 'What is the staff member doing now?', response: 'He is stocking drinks.', reveal: 'Stocking drinks', value: 5 },
      { id: 'd4p-where', text: 'Where did you see him?', response: 'Near the refrigerator.', reveal: 'Near refrigerator', value: 4 },
      { id: 'd4p-shirt', text: 'What is he wearing?', response: 'A blue apron.', reveal: 'Blue apron', value: 3 },
      { id: 'd4p-age', text: 'How old is he?', response: 'I’m not sure.', reveal: 'Age unknown', value: 1 },
    ],
    candidates: [
      { id: 'd4p-a', name: 'Alex', details: 'Blue apron · stocking drinks · near refrigerator', correct: true },
      { id: 'd4p-b', name: 'Ben', details: 'Blue apron · working register · front counter' },
      { id: 'd4p-c', name: 'Chris', details: 'Green apron · stocking drinks · snack aisle' },
      { id: 'd4p-d', name: 'Dylan', details: 'Blue apron · cleaning floor · entrance' },
    ],
  },
  {
    id: 'd4-child', kind: 'dialogue', title: 'Lost child', skill: 'Guidance', objective: '子どもに丁寧に待つようお願いする。',
    grammar: ['please + imperative', 'present progressive'], customer: { id: 'mia', name: 'Young customer', roleLabel: '保護者とはぐれた', opening: 'I can’t find my mother.' },
    bestRoute: ['安心させる', 'その場で待つよう丁寧に伝える'],
    choices: [
      { id: 'd4c-best', text: 'Please wait here. I’m calling a staff member to help you.', response: 'Okay.', quality: 'best', points: 100, explanation: '待機指示と、今行っている対応を現在進行形で説明しています。' },
      { id: 'd4c-good', text: 'Wait here, please.', response: 'Okay.', quality: 'good', points: 80, explanation: '適切ですが、何をするのか伝えるとより安心できます。' },
      { id: 'd4c-poor', text: 'Go look outside.', response: 'Outside?', quality: 'poor', points: 10, explanation: '安全上も不適切で、店員としての対応目的を満たしていません。' },
    ],
  },
  {
    id: 'd4-line', kind: 'dialogue', title: 'The line is growing', skill: 'Current situation', objective: '混雑状況を説明し、別レジを案内する。',
    grammar: ['present progressive', 'please'], customer: { id: 'daniel', name: 'Daniel', roleLabel: '混雑中', opening: 'Why is everyone waiting here?' },
    bestRoute: ['今起きている状況を説明する', '次の行動を案内する'],
    choices: [
      { id: 'd4l-best', text: 'This register is restarting. Please use the register on the left.', response: 'Got it, thanks.', quality: 'best', points: 100, explanation: '現在の状況と代替行動を明確に伝えています。' },
      { id: 'd4l-good', text: 'This register has a problem. Please wait.', response: 'How long?', quality: 'good', points: 65, explanation: '状況は伝わりますが、利用可能な別レジがあるなら案内した方が効率的です。' },
      { id: 'd4l-poor', text: 'Everyone is waiting.', response: 'Yes, but why?', quality: 'poor', points: 25, explanation: '見れば分かる状況を繰り返しており、原因や次の行動を説明していません。' },
    ],
  },
  {
    id: 'd5-card-fix', kind: 'troubleshooting', title: 'Card payment error', skill: 'Troubleshooting',
    objective: '質問2回以内で決済エラーの原因を切り分け、正しい対処を選ぶ。', grammar: ['what / why', 'negative', 'can'],
    customer: { id: 'daniel', name: 'Daniel', roleLabel: 'カード決済エラー', opening: 'My card isn’t working at this terminal.' },
    bestRoute: ['他の支払いでカード自体が使えるか確認する', '挿入/タッチ方法を確認する', '原因に合うActionを選ぶ'], maxQuestions: 2,
    causes: [
      { id: 'card-dead', label: 'Card itself is unusable' },
      { id: 'contactless', label: 'Contactless is unavailable for this card' },
      { id: 'terminal', label: 'Terminal is broken' },
      { id: 'limit', label: 'Purchase limit reached' },
    ],
    questions: [
      { id: 'd5f-other', text: 'Did the card work anywhere else today?', response: 'Yes. I used it at a café ten minutes ago.', reveal: 'Card worked elsewhere', value: 5, eliminates: ['card-dead', 'limit'], points: 15 },
      { id: 'd5f-method', text: 'Are you trying to use contactless payment?', response: 'Yes. I’m tapping the card.', reveal: 'Using contactless', value: 5, confirms: 'contactless', points: 20 },
      { id: 'd5f-color', text: 'What color is the card?', response: 'Blue.', reveal: 'Blue card', value: 1, points: 2 },
      { id: 'd5f-amount', text: 'How much is the purchase?', response: 'About 1,200 yen.', reveal: '¥1,200', value: 2, eliminates: ['limit'], points: 5 },
    ],
    solutions: [
      { id: 'd5f-insert', text: 'Please insert the card instead of tapping it.', cause: 'contactless' },
      { id: 'd5f-cash', text: 'The card cannot be used anywhere. Please pay cash.', cause: 'card-dead' },
      { id: 'd5f-terminal', text: 'Close the store because the terminal is broken.', cause: 'terminal' },
      { id: 'd5f-limit', text: 'Reduce the purchase amount.', cause: 'limit' },
    ],
    correctCause: 'contactless',
  },
  {
    id: 'd5-price-tag', kind: 'dialogue', title: 'Wrong price tag', skill: 'Problem handling', objective: '表示価格とレジ価格が違うことを確認し、調べると伝える。',
    grammar: ['what', 'negative'], customer: { id: 'grace', name: 'Grace', roleLabel: '価格表示の違い', opening: 'The shelf says 198 yen, but the register says 248 yen.' },
    bestRoute: ['問題を否定しない', '確認する行動を伝える'],
    choices: [
      { id: 'd5p-best', text: 'I’m sorry. Let me check the price tag for you.', response: 'Thank you.', quality: 'best', points: 100, explanation: '客の情報を受け止め、確認行動を明確にしています。' },
      { id: 'd5p-good', text: 'The register says 248 yen.', response: 'Yes, but the shelf says 198.', quality: 'good', points: 55, explanation: '事実を繰り返しているだけで、解決行動がありません。' },
      { id: 'd5p-poor', text: 'No, the shelf is not wrong.', response: 'Could you please check?', quality: 'poor', points: 20, explanation: '確認前に客の指摘を否定しています。' },
    ],
  },
  {
    id: 'd5-receipt', kind: 'checkout', title: 'No receipt?', skill: 'Return processing', objective: 'レシートの有無を確認する。',
    grammar: ['do question', 'negative'], customer: { id: 'mia', name: 'Mia', roleLabel: '返品相談', opening: 'I want to return this drink. I bought it this morning.' },
    bestRoute: ['返品処理に必要な情報を確認する', 'Do you have...? を使う'],
    choices: [
      { id: 'd5r-best', text: 'Do you have the receipt?', response: 'Yes, it’s right here.', quality: 'best', points: 100, explanation: '返品処理に必要な情報を最短で確認しています。' },
      { id: 'd5r-good', text: 'When did you buy it?', response: 'This morning.', quality: 'good', points: 65, explanation: '情報としては有用ですが、客がすでに this morning と伝えています。' },
      { id: 'd5r-poor', text: 'You cannot return it.', response: 'Why not?', quality: 'poor', points: 20, explanation: '必要情報を確認せずに返品不可と判断しています。' },
    ],
  },
  {
    id: 'd6-rush', kind: 'rapid', title: 'Morning Rush', skill: 'Rush', objective: '4件の短い接客を連続で処理する。',
    grammar: ['Chapter 1 review'], customer: { id: 'mia', name: 'Rush queue', roleLabel: '連続対応', opening: 'Four customers are waiting. Keep the line moving without losing accuracy.' },
    bestRoute: ['客の目的を1つずつ捉える', '短く自然な回答を選ぶ', '余計な情報を足しすぎない'],
    scenarios: [
      { id: 'r1', customer: 'Customer 1', line: 'Where is the ATM?', choices: [
        { id: 'r1a', text: 'It’s behind the ticket machine.', response: 'Thanks!', quality: 'best', points: 25, explanation: '場所を直接答えています。' },
        { id: 'r1b', text: 'Yes, there is.', response: 'Where?', quality: 'good', points: 12, explanation: '存在だけで場所を答えていません。' },
        { id: 'r1c', text: 'I use the ATM.', response: 'Sorry?', quality: 'poor', points: 0, explanation: '客の質問に答えていません。' },
      ]},
      { id: 'r2', customer: 'Customer 2', line: 'Can I pay with coins?', choices: [
        { id: 'r2a', text: 'Yes, you can.', response: 'Great.', quality: 'best', points: 25, explanation: 'can の質問へ適切に答えています。' },
        { id: 'r2b', text: 'Yes, I can.', response: 'You can?', quality: 'poor', points: 5, explanation: '主語が違います。' },
        { id: 'r2c', text: 'Coins are round.', response: '...Okay.', quality: 'poor', points: 0, explanation: '質問意図と無関係です。' },
      ]},
      { id: 'r3', customer: 'Customer 3', line: 'Do you sell umbrellas?', choices: [
        { id: 'r3a', text: 'Yes, we do. They’re near the entrance.', response: 'Thank you.', quality: 'best', points: 25, explanation: '有無と場所を短く伝えています。' },
        { id: 'r3b', text: 'Yes, we are.', response: 'Sorry?', quality: 'poor', points: 5, explanation: 'Do you...? への短答が不自然です。' },
        { id: 'r3c', text: 'Maybe.', response: 'Maybe?', quality: 'poor', points: 0, explanation: '在庫を把握している場面では曖昧すぎます。' },
      ]},
      { id: 'r4', customer: 'Customer 4', line: 'I can’t find my mother.', choices: [
        { id: 'r4a', text: 'Please wait here. I’ll get help.', response: 'Okay.', quality: 'best', points: 25, explanation: '安全な待機と対応を伝えています。' },
        { id: 'r4b', text: 'Go outside.', response: 'Outside?', quality: 'poor', points: 0, explanation: '安全上不適切です。' },
        { id: 'r4c', text: 'Your mother is busy.', response: 'Where is she?', quality: 'poor', points: 2, explanation: '根拠のない情報です。' },
      ]},
    ],
  },
  {
    id: 'd6-hunt', kind: 'information-hunt', title: 'Find the pickup item', skill: 'Information Hunt', objective: '忙しい中でも2質問で受取商品を特定する。',
    grammar: ['where', 'what', 'how much'], customer: { id: 'grace', name: 'Grace', roleLabel: '受取商品を探している', opening: 'My husband asked me to pick up a drink, but I only remember a few things.' },
    bestRoute: ['商品の種類/場所を優先して聞く', '2条件を組み合わせる', '候補を確定する'], maxQuestions: 2,
    questions: [
      { id: 'd6h-kind', text: 'What kind of drink is it?', response: 'It’s tea, not coffee or juice.', reveal: 'Tea', value: 5 },
      { id: 'd6h-place', text: 'Where did he say it was?', response: 'On the top shelf of the refrigerator.', reveal: 'Top shelf', value: 5 },
      { id: 'd6h-price', text: 'How much is it?', response: 'Around 160 yen, I think.', reveal: 'Around ¥160', value: 3 },
      { id: 'd6h-color', text: 'What color is the label?', response: 'I don’t remember.', reveal: 'Color unknown', value: 1 },
    ],
    candidates: [
      { id: 'd6h-a', name: 'Green Tea 600ml', details: 'Tea · top shelf · ¥158', correct: true },
      { id: 'd6h-b', name: 'Milk Tea 500ml', details: 'Tea · middle shelf · ¥168' },
      { id: 'd6h-c', name: 'Black Coffee', details: 'Coffee · top shelf · ¥158' },
      { id: 'd6h-d', name: 'Apple Juice', details: 'Juice · top shelf · ¥168' },
    ],
  },
  {
    id: 'd6-fix', kind: 'troubleshooting', title: 'Self-checkout stuck', skill: 'Troubleshooting', objective: '2質問でセルフレジが進まない理由を特定する。',
    grammar: ['what / why', 'negative', 'present progressive'], customer: { id: 'daniel', name: 'Daniel', roleLabel: 'セルフレジ', opening: 'The self-checkout isn’t letting me pay.' },
    bestRoute: ['画面が何を求めているか確認する', '未処理の操作を特定する', '対応Actionを選ぶ'], maxQuestions: 2,
    causes: [
      { id: 'bag', label: 'Bag confirmation not finished' },
      { id: 'scan', label: 'Item not scanned' },
      { id: 'cash', label: 'Cash unavailable' },
      { id: 'broken', label: 'Machine failure' },
    ],
    questions: [
      { id: 'd6f-screen', text: 'What is the screen showing?', response: 'It says, “Please confirm your bag.”', reveal: 'Bag confirmation message', value: 5, confirms: 'bag', points: 20 },
      { id: 'd6f-items', text: 'Are all your items on the screen?', response: 'Yes, all three items are there.', reveal: 'All items scanned', value: 4, eliminates: ['scan'], points: 12 },
      { id: 'd6f-cash', text: 'Are you paying with cash?', response: 'No, by card.', reveal: 'Card payment', value: 2, eliminates: ['cash'], points: 5 },
      { id: 'd6f-time', text: 'What time is it?', response: 'About nine thirty.', reveal: '9:30', value: 0, points: 0 },
    ],
    solutions: [
      { id: 'd6f-confirm', text: 'Please confirm whether you are using a bag.', cause: 'bag' },
      { id: 'd6f-rescan', text: 'Scan every item again.', cause: 'scan' },
      { id: 'd6f-cashdesk', text: 'Move to a cash-only machine.', cause: 'cash' },
      { id: 'd6f-close', text: 'Turn the machine off immediately.', cause: 'broken' },
    ],
    correctCause: 'bag',
  },
]

export function chapter1ActivityById(id: string) {
  return chapter1Activities.find((activity) => activity.id === id)
}
