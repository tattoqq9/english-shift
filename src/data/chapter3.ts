import type { Chapter1Activity, Chapter1Day } from '../core/chapter1.js'

export const chapter3Days: Chapter1Day[] = [
  {
    day: 13,
    title: 'Previous Experience',
    subtitle: '現在完了と ever / never で、客の経験を聞いて商品を選ぶ。',
    newLanguage: ['present perfect', 'ever / never'],
    reviewLanguage: ['past simple', 'comparative'],
    gameFocus: 'Experience + Recommendation',
    activityIds: ['d13-trail-experience', 'd13-ever-used', 'd13-experience-rush'],
    canDo: ['過去から今につながる経験を聞く', 'ever / never で経験の有無を確認する', '経験レベルに合う商品を薦める'],
  },
  {
    day: 14,
    title: 'How Long?',
    subtitle: 'for / since と現在完了進行形で、継続期間を判断材料にする。',
    newLanguage: ['for / since', 'present perfect progressive'],
    reviewLanguage: ['present perfect', 'how long'],
    gameFocus: 'Duration + Customer Profile',
    activityIds: ['d14-running-profile', 'd14-since-when', 'd14-duration-rush'],
    canDo: ['How long...? で継続期間を聞く', 'for と since を使い分ける', '継続期間から客の経験レベルを推測する'],
  },
  {
    day: 15,
    title: 'Advice & Rules',
    subtitle: 'should / must / have to で、助言と安全上の必要条件を区別する。',
    newLanguage: ['should', 'must / have to'],
    reviewLanguage: ['comparative', 'too / enough'],
    gameFocus: 'Advice + Safety Judgment',
    activityIds: ['d15-hiking-advice', 'd15-must-have', 'd15-safety-rush'],
    canDo: ['should で助言する', 'must / have to で必要条件を伝える', 'おすすめと安全上の義務を区別する'],
  },
  {
    day: 16,
    title: 'Weather & Conditions',
    subtitle: 'may / might / if / when で、不確実な条件を含めて推薦する。',
    newLanguage: ['may / might', 'if / when'],
    reviewLanguage: ['should', 'present perfect'],
    gameFocus: 'Conditional Recommendation',
    activityIds: ['d16-rainy-run', 'd16-if-weather', 'd16-condition-hunt'],
    canDo: ['may / might で可能性を表す', 'if で条件付きの提案をする', '天候や使用環境に合わせて商品を選ぶ'],
  },
  {
    day: 17,
    title: 'Outdoor Trouble',
    subtitle: 'unless / If I were... を使って、トラブル時の条件と代替案を考える。',
    newLanguage: ['unless', 'If I were...'],
    reviewLanguage: ['if / when', 'should / must'],
    gameFocus: 'Troubleshooting + Hypothetical Advice',
    activityIds: ['d17-wet-boots', 'd17-unless', 'd17-if-i-were-you'],
    canDo: ['unless で「〜しない限り」を理解する', '原因候補を英語で切り分ける', 'If I were you... で柔らかく助言する'],
  },
  {
    day: 18,
    title: 'Expedition Shift',
    subtitle: 'Chapter 1〜3の質問・比較・経験・条件表現をまとめて使う。',
    newLanguage: [],
    reviewLanguage: ['Chapter 1–3 all'],
    gameFocus: 'Mixed Expedition Challenge',
    activityIds: ['d18-expedition-kit', 'd18-experience-diagnosis', 'd18-expedition-rush'],
    canDo: ['経験・天候・用途をまとめて聞く', '複数条件から安全な商品を選ぶ', 'Chapter 1〜3の英語を連続した接客で使う'],
  },
]

export const chapter3Activities: Chapter1Activity[] = [
  {
    id: 'd13-trail-experience', kind: 'information-hunt', title: 'First trail shoes?', skill: 'Experience Hunt',
    objective: '経験と使用環境を2問で確認し、最適なトレイルシューズを選ぶ。', grammar: ['present perfect', 'ever / never'],
    customer: { id: 'mia', name: 'Mia', roleLabel: '初めてのトレイルランを計画中', opening: 'I’m going trail running next month, but I’m not sure what kind of shoes I need.' },
    bestRoute: ['トレイル経験の有無を聞く', '走る路面を確認する', '初心者向けで安定性の高い商品を選ぶ'], maxQuestions: 2,
    questions: [
      { id: 'd13t-exp', text: 'Have you ever used trail shoes before?', response: 'No, I’ve never used them.', reveal: 'First pair of trail shoes', value: 5 },
      { id: 'd13t-ground', text: 'What kind of trails are you going to run on?', response: 'Mostly easy forest trails with some wet ground.', reveal: 'Easy trails · sometimes wet', value: 5 },
      { id: 'd13t-color', text: 'Which color do you prefer?', response: 'Any dark color is fine.', reveal: 'Dark color preferred', value: 1 },
      { id: 'd13t-price', text: 'How much would you like to spend?', response: 'Around 12,000 yen.', reveal: 'Budget around ¥12,000', value: 3 },
    ],
    candidates: [
      { id: 'd13t-a', name: 'Trail Start', details: '¥10,800 · stable · good grip · beginner-friendly', correct: true },
      { id: 'd13t-b', name: 'Race Peak', details: '¥15,800 · very light · aggressive grip · expert fit' },
      { id: 'd13t-c', name: 'Road Flex', details: '¥9,800 · road running · weak grip on wet trails' },
      { id: 'd13t-d', name: 'Mountain Armor', details: '¥14,500 · very stiff · heavy · technical terrain' },
    ],
  },
  {
    id: 'd13-ever-used', kind: 'dialogue', title: 'Have you used one before?', skill: 'Experience clarification', objective: '現在完了を使って、過去の経験が今の選択に関係するか確認する。',
    grammar: ['present perfect'], customer: { id: 'daniel', name: 'Daniel', roleLabel: 'キャンプ用バーナーを見ている', opening: 'There are a lot of camping stoves here. I don’t know which type is easiest to use.' },
    bestRoute: ['今までの使用経験を確認する', '現在までの経験なので present perfect を使う'],
    choices: [
      { id: 'd13e-best', text: 'Have you used a camping stove before?', response: 'No, I haven’t. This will be my first one.', quality: 'best', points: 100, explanation: '現在までの経験を聞くので Have you used...? が自然です。' },
      { id: 'd13e-good', text: 'Did you use a camping stove last year?', response: 'No, but I didn’t go camping last year.', quality: 'good', points: 70, explanation: '特定の過去を聞いており、一般的な経験の確認としては範囲が狭いです。' },
      { id: 'd13e-poor', text: 'Are you using a camping stove now?', response: 'No. I’m shopping for one.', quality: 'poor', points: 20, explanation: '今している動作ではなく、これまでの経験を確認する必要があります。' },
    ],
  },
  {
    id: 'd13-experience-rush', kind: 'rapid', title: 'Experience check', skill: 'Experience Rush', objective: '3人の経験に関する発言へ適切に返答する。',
    grammar: ['present perfect', 'ever / never'], customer: { id: 'grace', name: 'Rush customers', roleLabel: '経験確認が続く', opening: 'Three customers need equipment that matches their experience.' },
    bestRoute: ['経験を示す時間表現に注目する', 'ever / never と present perfect を見分ける', '経験に応じて次の質問へつなげる'],
    scenarios: [
      { id: 'd13r-1', customer: 'Customer 1', line: 'I’ve never gone hiking alone before.', choices: [
        { id: 'd13r1-best', text: 'Then you should start with an easy, well-marked trail.', response: 'That sounds safer.', quality: 'best', points: 100, explanation: 'never から未経験だと判断し、安全な初心者向け助言へつなげています。' },
        { id: 'd13r1-good', text: 'When did you hike alone?', response: 'I said I’ve never done it.', quality: 'good', points: 55, explanation: 'never を見落として、存在しない経験の時点を聞いています。' },
        { id: 'd13r1-poor', text: 'You are hiking alone now.', response: 'No, I’m not.', quality: 'poor', points: 10, explanation: '現在進行中の話へ取り違えています。' },
      ]},
      { id: 'd13r-2', customer: 'Customer 2', line: 'I’ve used trekking poles many times.', choices: [
        { id: 'd13r2-best', text: 'Great. Then we can compare the lighter models.', response: 'Yes, I know how to use them.', quality: 'best', points: 100, explanation: '十分な経験があることを読み取り、比較へ進めています。' },
        { id: 'd13r2-good', text: 'Have you ever used trekking poles?', response: 'Yes, many times.', quality: 'good', points: 65, explanation: 'すでに答えが含まれているため、同じ情報を再確認しています。' },
        { id: 'd13r2-poor', text: 'You have never used them.', response: 'No, I have.', quality: 'poor', points: 10, explanation: '発言内容と逆です。' },
      ]},
      { id: 'd13r-3', customer: 'Customer 3', line: 'Have you ever sold this kind of tent before?', choices: [
        { id: 'd13r3-best', text: 'Yes, I have. It’s popular with first-time campers.', response: 'Good to know.', quality: 'best', points: 100, explanation: 'Have you ever...? に present perfect の短答で自然に返しています。' },
        { id: 'd13r3-good', text: 'Yes, I did yesterday.', response: 'Okay.', quality: 'good', points: 70, explanation: '意味は通じますが、一般的な経験への返答としては Yes, I have. がより対応しています。' },
        { id: 'd13r3-poor', text: 'Yes, I am.', response: 'You are?', quality: 'poor', points: 15, explanation: '現在完了の質問に be 動詞で答えています。' },
      ]},
    ],
  },
  {
    id: 'd14-running-profile', kind: 'information-hunt', title: 'How long have you been running?', skill: 'Customer Profile Hunt',
    objective: '継続期間と距離を聞き、ランナーの経験レベルに合うシューズを選ぶ。', grammar: ['for / since', 'present perfect progressive'],
    customer: { id: 'mia', name: 'Mia', roleLabel: 'ランニングシューズを買い替えたい', opening: 'I’ve been running regularly, and I want to replace my old shoes.' },
    bestRoute: ['継続期間を聞く', '普段の距離を確認する', '経験と距離に合うモデルを選ぶ'], maxQuestions: 2,
    questions: [
      { id: 'd14p-long', text: 'How long have you been running regularly?', response: 'For about eight months.', reveal: 'Running for 8 months', value: 5 },
      { id: 'd14p-distance', text: 'How far do you usually run?', response: 'About five kilometers, three times a week.', reveal: '5 km · three times a week', value: 5 },
      { id: 'd14p-start', text: 'When did you buy your first running shirt?', response: 'Last spring.', reveal: 'Bought shirt last spring', value: 1 },
      { id: 'd14p-color', text: 'Do you like bright colors?', response: 'Either is fine.', reveal: 'No strong color preference', value: 1 },
    ],
    candidates: [
      { id: 'd14p-a', name: 'Daily Flow', details: 'balanced cushioning · 5–10 km training · developing runner', correct: true },
      { id: 'd14p-b', name: 'Carbon Race', details: 'race-focused · advanced pacing · expensive' },
      { id: 'd14p-c', name: 'Walk Soft', details: 'walking-first · low running stability' },
      { id: 'd14p-d', name: 'Ultra Max', details: '30 km+ long-distance · heavy cushioning' },
    ],
  },
  {
    id: 'd14-since-when', kind: 'dialogue', title: 'For or since?', skill: 'Duration clarification', objective: 'for と since を使い分けて、継続期間を確認する。',
    grammar: ['for / since'], customer: { id: 'grace', name: 'Grace', roleLabel: 'ウォーキングを続けている', opening: 'I started walking every morning in April, and I still do it every day.' },
    bestRoute: ['開始時点 April に注目する', 'since + 開始時点を使う'],
    choices: [
      { id: 'd14s-best', text: 'So you’ve been walking every morning since April.', response: 'Yes, exactly.', quality: 'best', points: 100, explanation: 'April は開始時点なので since が適切です。' },
      { id: 'd14s-good', text: 'So you’ve been walking every morning for several months.', response: 'Yes.', quality: 'good', points: 90, explanation: '期間を表す for でも正しいですが、発言にある April を使うなら since がより直接的です。' },
      { id: 'd14s-poor', text: 'So you walked every morning since April.', response: 'I’m still doing it now.', quality: 'poor', points: 35, explanation: '今も続いているため、単純過去だけでは継続性が弱くなります。' },
    ],
  },
  {
    id: 'd14-duration-rush', kind: 'rapid', title: 'Duration signals', skill: 'Duration Rush', objective: 'for / since / how long を3つの会話で使い分ける。',
    grammar: ['for / since', 'present perfect progressive'], customer: { id: 'daniel', name: 'Rush customers', roleLabel: '継続期間の質問が続く', opening: 'Three customers describe activities that started in the past and continue now.' },
    bestRoute: ['期間なら for', '開始時点なら since', '期間を聞くなら How long...?'],
    scenarios: [
      { id: 'd14r-1', customer: 'Customer 1', line: 'I’ve had these hiking boots for six years.', choices: [
        { id: 'd14r1-best', text: 'Six years is a long time. How is the sole now?', response: 'It’s getting worn down.', quality: 'best', points: 100, explanation: 'for six years という継続期間を理解し、現在の状態確認へ進めています。' },
        { id: 'd14r1-good', text: 'When did you have them?', response: 'I’ve had them for six years.', quality: 'good', points: 55, explanation: 'すでに期間が示されているため、情報が重複します。' },
        { id: 'd14r1-poor', text: 'You bought them tomorrow.', response: 'No.', quality: 'poor', points: 5, explanation: '時間関係が一致していません。' },
      ]},
      { id: 'd14r-2', customer: 'Customer 2', line: 'I’ve been cycling since I was in high school.', choices: [
        { id: 'd14r2-best', text: 'So you’ve been cycling for many years.', response: 'Yes, for a long time.', quality: 'best', points: 100, explanation: 'since + 開始点を、for + 期間へ自然に言い換えています。' },
        { id: 'd14r2-good', text: 'So you started cycling in high school.', response: 'Yes.', quality: 'good', points: 85, explanation: '意味は正しいですが、現在まで続く点は弱くなります。' },
        { id: 'd14r2-poor', text: 'You stopped cycling in high school.', response: 'No, I still cycle.', quality: 'poor', points: 10, explanation: '継続中という意味と逆です。' },
      ]},
      { id: 'd14r-3', customer: 'Customer 3', line: 'I started climbing two months ago.', choices: [
        { id: 'd14r3-best', text: 'How long have you been climbing?', response: 'For two months.', quality: 'best', points: 100, explanation: '継続期間を確認する定番の How long have you been...? です。' },
        { id: 'd14r3-good', text: 'When did you start climbing?', response: 'Two months ago.', quality: 'good', points: 80, explanation: '正しい質問ですが、今回は継続期間の表現を直接練習できます。' },
        { id: 'd14r3-poor', text: 'How long are you climbing yesterday?', response: 'Sorry?', quality: 'poor', points: 10, explanation: '時制と時間表現が不自然です。' },
      ]},
    ],
  },
  {
    id: 'd15-hiking-advice', kind: 'dialogue', title: 'What should I bring?', skill: 'Advice', objective: '客の予定に対して should を使った適切な助言を選ぶ。',
    grammar: ['should'], customer: { id: 'mia', name: 'Mia', roleLabel: '日帰りハイキングの準備中', opening: 'I’m going on a day hike this weekend. The forecast says it may get colder in the afternoon.' },
    bestRoute: ['気温低下の可能性を理解する', 'should で持っていく物を助言する'],
    choices: [
      { id: 'd15a-best', text: 'You should bring a light extra layer.', response: 'Good idea. I’ll pack one.', quality: 'best', points: 100, explanation: '義務ではなく実用的な助言なので should が適切です。' },
      { id: 'd15a-good', text: 'You have to buy the most expensive jacket.', response: 'Do I really have to?', quality: 'good', points: 45, explanation: '必要以上に強い義務表現で、商品選択も根拠がありません。' },
      { id: 'd15a-poor', text: 'You should leave all warm clothes at home.', response: 'That sounds risky.', quality: 'poor', points: 10, explanation: '天候条件と逆の助言です。' },
    ],
  },
  {
    id: 'd15-must-have', kind: 'information-hunt', title: 'Required equipment', skill: 'Safety Judgment', objective: '活動条件を聞き、安全上必須の装備を選ぶ。', grammar: ['must / have to', 'should'],
    customer: { id: 'daniel', name: 'Daniel', roleLabel: 'レンタル施設のクライミングへ行く', opening: 'I’m going indoor climbing for the first time. The gym gave me a list of rules, but I’m not sure what I need to bring.' },
    bestRoute: ['施設で貸し出される物を確認する', '必須条件を確認する', 'must と should を区別する'], maxQuestions: 2,
    questions: [
      { id: 'd15m-rule', text: 'What do you have to wear at the gym?', response: 'They said I have to wear climbing shoes.', reveal: 'Climbing shoes required', value: 5 },
      { id: 'd15m-rent', text: 'Can you rent a helmet there?', response: 'Yes. Helmets are available for free.', reveal: 'Helmet can be rented', value: 5 },
      { id: 'd15m-color', text: 'What color is the gym wall?', response: 'I don’t know.', reveal: 'Unknown wall color', value: 1 },
      { id: 'd15m-time', text: 'What time are you going?', response: 'Around noon.', reveal: 'Going around noon', value: 1 },
    ],
    candidates: [
      { id: 'd15m-a', name: 'Climbing Shoes', details: 'Required by gym · must wear', correct: true },
      { id: 'd15m-b', name: 'Premium Helmet', details: 'Helpful, but free rental is available' },
      { id: 'd15m-c', name: 'Rain Jacket', details: 'Indoor activity · not required' },
      { id: 'd15m-d', name: 'Trekking Poles', details: 'Not used for indoor climbing' },
    ],
  },
  {
    id: 'd15-safety-rush', kind: 'rapid', title: 'Advice or requirement?', skill: 'Safety Rush', objective: 'should と must / have to の強さを使い分ける。',
    grammar: ['should', 'must / have to'], customer: { id: 'grace', name: 'Rush customers', roleLabel: '安全に関する質問が続く', opening: 'Three customers ask whether something is advice or a requirement.' },
    bestRoute: ['おすすめは should', '規則・安全上必須なら must / have to', '文脈の強さを判断する'],
    scenarios: [
      { id: 'd15r-1', customer: 'Customer 1', line: 'The race rules say every runner needs a number bib.', choices: [
        { id: 'd15r1-best', text: 'You have to wear your number bib during the race.', response: 'Got it.', quality: 'best', points: 100, explanation: '大会規則なので have to が適切です。' },
        { id: 'd15r1-good', text: 'You should probably wear it.', response: 'Is it optional?', quality: 'good', points: 55, explanation: '規則なのに任意の助言のように聞こえます。' },
        { id: 'd15r1-poor', text: 'You must not wear it.', response: 'But the rules say I need it.', quality: 'poor', points: 5, explanation: '規則と逆です。' },
      ]},
      { id: 'd15r-2', customer: 'Customer 2', line: 'My feet sometimes get cold when I camp in autumn.', choices: [
        { id: 'd15r2-best', text: 'You should bring an extra pair of warm socks.', response: 'I will.', quality: 'best', points: 100, explanation: '一般的な助言なので should が自然です。' },
        { id: 'd15r2-good', text: 'You must buy these socks.', response: 'Is that a rule?', quality: 'good', points: 45, explanation: '店員の助言としては強すぎます。' },
        { id: 'd15r2-poor', text: 'You should bring wet socks.', response: 'No, thanks.', quality: 'poor', points: 5, explanation: '安全・快適性の面で不適切です。' },
      ]},
      { id: 'd15r-3', customer: 'Customer 3', line: 'The park says visitors must carry out all their trash.', choices: [
        { id: 'd15r3-best', text: 'Yes. You must take your trash home with you.', response: 'Understood.', quality: 'best', points: 100, explanation: '公園の明確なルールなので must が合います。' },
        { id: 'd15r3-good', text: 'You should take it home if you want.', response: 'I think it’s required.', quality: 'good', points: 50, explanation: '義務を任意の助言へ弱めています。' },
        { id: 'd15r3-poor', text: 'You can leave it on the trail.', response: 'That doesn’t sound right.', quality: 'poor', points: 5, explanation: 'ルールと逆です。' },
      ]},
    ],
  },
  {
    id: 'd16-rainy-run', kind: 'information-hunt', title: 'What if it rains?', skill: 'Conditional Recommendation',
    objective: '天候と使用頻度を聞き、条件に合うランニングジャケットを選ぶ。', grammar: ['may / might', 'if / when'],
    customer: { id: 'mia', name: 'Mia', roleLabel: '雨の日にも走りたい', opening: 'I usually run outside, and I might keep running even when the weather is bad.' },
    bestRoute: ['雨の中でも走るか確認する', '気温条件を確認する', '防水性と通気性を両立する商品を選ぶ'], maxQuestions: 2,
    questions: [
      { id: 'd16w-rain', text: 'If it rains, will you still run outside?', response: 'Yes, but I stop when the rain is very heavy.', reveal: 'Runs in light/moderate rain', value: 5 },
      { id: 'd16w-temp', text: 'What temperatures do you usually run in?', response: 'Mostly between 10 and 20 degrees.', reveal: 'Mild temperatures', value: 5 },
      { id: 'd16w-color', text: 'Do you prefer blue or black?', response: 'Black, maybe.', reveal: 'Black preferred', value: 1 },
      { id: 'd16w-pocket', text: 'Do you need many pockets?', response: 'One pocket is enough.', reveal: 'One pocket enough', value: 2 },
    ],
    candidates: [
      { id: 'd16w-a', name: 'Rain Pace Shell', details: 'water-resistant · breathable · mild weather · light', correct: true },
      { id: 'd16w-b', name: 'Winter Shield', details: 'very warm · waterproof · too hot for 10–20°C' },
      { id: 'd16w-c', name: 'Dry Tee', details: 'very breathable · not rain-resistant' },
      { id: 'd16w-d', name: 'City Parka', details: 'water-resistant · heavy · low running mobility' },
    ],
  },
  {
    id: 'd16-if-weather', kind: 'dialogue', title: 'If the weather changes', skill: 'Condition clarification', objective: 'if を使って、条件が変わる場合の提案をする。',
    grammar: ['if', 'may / might'], customer: { id: 'daniel', name: 'Daniel', roleLabel: 'キャンプの天候を心配している', opening: 'The forecast is uncertain. It may rain at night, but the daytime should be dry.' },
    bestRoute: ['雨は確定ではないと理解する', 'if で条件付きの準備を提案する'],
    choices: [
      { id: 'd16i-best', text: 'If it rains at night, you’ll want a waterproof tent cover.', response: 'I’ll add one to my kit.', quality: 'best', points: 100, explanation: '不確実な未来条件に if を使い、必要な対策へつなげています。' },
      { id: 'd16i-good', text: 'It will definitely rain all day.', response: 'The forecast doesn’t say that.', quality: 'good', points: 35, explanation: 'may で示された不確実性を definite に変えてしまっています。' },
      { id: 'd16i-poor', text: 'If it rained yesterday, buy a tent cover tomorrow.', response: 'I’m asking about this trip.', quality: 'poor', points: 15, explanation: '今回の未来条件と時間関係が合っていません。' },
    ],
  },
  {
    id: 'd16-condition-hunt', kind: 'information-hunt', title: 'Mountain weather', skill: 'Condition Hunt',
    objective: '予想される条件を2つ集め、最適なレイヤリングを選ぶ。', grammar: ['may / might', 'if / when'],
    customer: { id: 'grace', name: 'Grace', roleLabel: '標高の高い場所へ旅行する', opening: 'I’ll be walking at a high elevation. The weather might change quickly.' },
    bestRoute: ['最低気温の可能性を聞く', '雨の可能性を聞く', '変化に対応できる重ね着を選ぶ'], maxQuestions: 2,
    questions: [
      { id: 'd16c-cold', text: 'How cold might it get?', response: 'It may drop to around five degrees.', reveal: 'May drop to 5°C', value: 5 },
      { id: 'd16c-rain', text: 'Is rain possible?', response: 'Yes. There may be short showers.', reveal: 'Possible short showers', value: 5 },
      { id: 'd16c-photo', text: 'Are you taking a camera?', response: 'Yes, probably.', reveal: 'May carry camera', value: 1 },
      { id: 'd16c-lunch', text: 'What will you eat for lunch?', response: 'I haven’t decided.', reveal: 'Lunch undecided', value: 1 },
    ],
    candidates: [
      { id: 'd16c-a', name: '3-Layer Set', details: 'base layer + warm midlayer + light rain shell', correct: true },
      { id: 'd16c-b', name: 'Single Cotton Tee', details: 'no warmth · poor when wet' },
      { id: 'd16c-c', name: 'Heavy Down Only', details: 'warm but hard to adjust · poor in showers' },
      { id: 'd16c-d', name: 'Beach Windbreaker', details: 'light wind only · insufficient warmth' },
    ],
  },
  {
    id: 'd17-wet-boots', kind: 'troubleshooting', title: 'Wet boots', skill: 'Outdoor Troubleshooting',
    objective: 'ブーツ内部が濡れる原因を2問で切り分け、適切な対処を選ぶ。', grammar: ['unless', 'if / when'],
    customer: { id: 'daniel', name: 'Daniel', roleLabel: '雨の日のハイキング後に相談', opening: 'My hiking boots got wet inside even though the rain wasn’t very heavy.' },
    bestRoute: ['水が上から入った可能性を確認する', '防水膜の状態を確認する', '原因に合う対処を選ぶ'], maxQuestions: 2,
    causes: [
      { id: 'top-entry', label: 'Water entered from the top' },
      { id: 'membrane-damage', label: 'Waterproof membrane is damaged' },
      { id: 'wrong-size', label: 'Boots are the wrong size' },
      { id: 'lace-color', label: 'Lace color problem' },
    ],
    questions: [
      { id: 'd17b-pants', text: 'Were your rain pants covering the top of the boots?', response: 'No. Water was running down my socks.', reveal: 'Boot tops were exposed', value: 5, points: 5, confirms: 'top-entry', eliminates: ['wrong-size', 'lace-color'] },
      { id: 'd17b-puddle', text: 'Did water come through the sides when you stepped in puddles?', response: 'No. The sides stayed dry.', reveal: 'Membrane likely intact', value: 5, points: 5, eliminates: ['membrane-damage'] },
      { id: 'd17b-size', text: 'Are the boots too small?', response: 'No, the fit is comfortable.', reveal: 'Fit is fine', value: 2, points: 2, eliminates: ['wrong-size'] },
      { id: 'd17b-laces', text: 'What color are the laces?', response: 'Brown.', reveal: 'Brown laces', value: 1, points: 1, eliminates: ['lace-color'] },
    ],
    solutions: [
      { id: 'd17b-a', text: 'Keep your rain pants over the boot openings so water cannot run inside.', cause: 'top-entry' },
      { id: 'd17b-b', text: 'Replace the boots because the waterproof membrane is broken.', cause: 'membrane-damage' },
      { id: 'd17b-c', text: 'Buy a smaller pair of boots.', cause: 'wrong-size' },
      { id: 'd17b-d', text: 'Change the laces to a different color.', cause: 'lace-color' },
    ],
    correctCause: 'top-entry',
  },
  {
    id: 'd17-unless', kind: 'dialogue', title: 'Unless the rain gets worse', skill: 'Condition judgment', objective: 'unless の意味を理解して、予定を正しく判断する。',
    grammar: ['unless'], customer: { id: 'mia', name: 'Mia', roleLabel: 'ランニングイベント前', opening: 'The organizer said the event will continue unless the rain gets much worse.' },
    bestRoute: ['unless = if ... not と捉える', '雨が大幅に悪化しない限り開催と判断する'],
    choices: [
      { id: 'd17u-best', text: 'So the event will continue if the rain does not get much worse.', response: 'Right. I’ll prepare for rain.', quality: 'best', points: 100, explanation: 'unless を if ... not に正しく言い換えています。' },
      { id: 'd17u-good', text: 'So the event will stop if there is any rain.', response: 'No, only if it gets much worse.', quality: 'good', points: 40, explanation: '条件を強くしすぎています。' },
      { id: 'd17u-poor', text: 'So the event already ended yesterday.', response: 'No, it’s this weekend.', quality: 'poor', points: 10, explanation: '条件文の意味と時間がどちらも合いません。' },
    ],
  },
  {
    id: 'd17-if-i-were-you', kind: 'dialogue', title: 'If I were you', skill: 'Hypothetical Advice', objective: 'If I were you... を使った柔らかい助言を選ぶ。',
    grammar: ['If I were...'], customer: { id: 'grace', name: 'Grace', roleLabel: '初めて冬キャンプへ行く', opening: 'I’ve never camped in winter before. I’m thinking about using my thin summer sleeping bag.' },
    bestRoute: ['冬キャンプ未経験と薄い寝袋のリスクを認識する', 'If I were you... でより暖かい装備を助言する'],
    choices: [
      { id: 'd17h-best', text: 'If I were you, I’d choose a sleeping bag rated for colder temperatures.', response: 'That makes sense.', quality: 'best', points: 100, explanation: '相手の立場を仮定して、押しつけすぎない助言をしています。' },
      { id: 'd17h-good', text: 'You must buy the most expensive sleeping bag.', response: 'Is the most expensive one necessary?', quality: 'good', points: 45, explanation: '助言として強すぎ、価格と安全性能も同一ではありません。' },
      { id: 'd17h-poor', text: 'If I am you, I use the summer bag.', response: 'I’m worried it won’t be warm enough.', quality: 'poor', points: 15, explanation: '仮定表現が不自然で、助言内容もリスクを無視しています。' },
    ],
  },
  {
    id: 'd18-expedition-kit', kind: 'information-hunt', title: 'Build the expedition kit', skill: 'Mixed Recommendation',
    objective: '経験・天候・用途から重要な2条件を集め、最適な装備セットを選ぶ。', grammar: ['present perfect', 'should', 'if / when'],
    customer: { id: 'mia', name: 'Mia', roleLabel: '初めての1泊ハイキング', opening: 'I’m planning my first overnight hike. I’ve done several day hikes, but I’ve never stayed outside overnight.' },
    bestRoute: ['夜間の最低気温を聞く', '雨の可能性を聞く', '初泊でも扱いやすい安全なセットを選ぶ'], maxQuestions: 2,
    questions: [
      { id: 'd18k-temp', text: 'How cold might it get at night?', response: 'Around eight degrees, according to the forecast.', reveal: 'Night low around 8°C', value: 5 },
      { id: 'd18k-rain', text: 'Is rain possible during the trip?', response: 'Yes. There might be rain on the second morning.', reveal: 'Possible rain', value: 5 },
      { id: 'd18k-color', text: 'What color backpack do you like?', response: 'Green would be nice.', reveal: 'Green preferred', value: 1 },
      { id: 'd18k-snack', text: 'What snacks will you bring?', response: 'Probably energy bars.', reveal: 'Energy bars', value: 1 },
    ],
    candidates: [
      { id: 'd18k-a', name: 'Starter Overnight Kit', details: '10°C-rated bag + rain shell + simple 2-person tent · beginner-friendly', correct: true },
      { id: 'd18k-b', name: 'Summer Picnic Kit', details: 'thin blanket + no rain cover · warm dry weather only' },
      { id: 'd18k-c', name: 'Alpine Winter Kit', details: '−15°C gear · very heavy · unnecessary for forecast' },
      { id: 'd18k-d', name: 'Ultralight Expert Kit', details: 'minimal shelter · advanced setup · low margin for error' },
    ],
  },
  {
    id: 'd18-experience-diagnosis', kind: 'troubleshooting', title: 'Why are my knees hurting?', skill: 'Experience Diagnosis',
    objective: '歩行条件と装備から原因を切り分け、安全な次の行動を選ぶ。', grammar: ['present perfect', 'should', 'have to'],
    customer: { id: 'daniel', name: 'Daniel', roleLabel: '長い下り坂で膝が痛くなった', opening: 'My knees started hurting on my last hike. I’ve never had that problem on short walks.' },
    bestRoute: ['長い下りで悪化するか確認する', '荷物重量を確認する', '負荷を減らす対策を選ぶ'], maxQuestions: 2,
    causes: [
      { id: 'downhill-load', label: 'High downhill load' },
      { id: 'heavy-pack', label: 'Pack is too heavy' },
      { id: 'shoe-color', label: 'Shoe color' },
      { id: 'phone-battery', label: 'Phone battery' },
    ],
    questions: [
      { id: 'd18d-down', text: 'Did the pain get worse on long downhill sections?', response: 'Yes, especially near the end of the descent.', reveal: 'Worse on long descents', value: 5, points: 5, confirms: 'downhill-load', eliminates: ['shoe-color', 'phone-battery'] },
      { id: 'd18d-pack', text: 'How heavy was your backpack?', response: 'About twelve kilograms, which felt heavy for me.', reveal: '12 kg pack', value: 5, points: 5, eliminates: ['shoe-color', 'phone-battery'] },
      { id: 'd18d-color', text: 'What color were your shoes?', response: 'Blue.', reveal: 'Blue shoes', value: 1, points: 1, eliminates: ['shoe-color'] },
      { id: 'd18d-phone', text: 'Was your phone fully charged?', response: 'Yes.', reveal: 'Phone charged', value: 1, points: 1, eliminates: ['phone-battery'] },
    ],
    solutions: [
      { id: 'd18d-a', text: 'You should reduce your pack weight and use trekking poles on long descents.', cause: 'downhill-load' },
      { id: 'd18d-b', text: 'You have to buy shoes in a different color.', cause: 'shoe-color' },
      { id: 'd18d-c', text: 'You should carry a second phone battery.', cause: 'phone-battery' },
      { id: 'd18d-d', text: 'You should add more weight to your backpack.', cause: 'heavy-pack' },
    ],
    correctCause: 'downhill-load',
  },
  {
    id: 'd18-expedition-rush', kind: 'rapid', title: 'Expedition desk', skill: 'Expedition Rush', objective: 'Chapter 1〜3の表現を使い、3人へ連続対応する。',
    grammar: ['present perfect', 'comparative', 'should', 'if / unless'], customer: { id: 'grace', name: 'Final customers', roleLabel: '遠征前の相談が集中', opening: 'Three customers arrive just before the outdoor desk closes.' },
    bestRoute: ['各客の経験・条件を読む', '必要なら比較や助言を使う', '条件表現を正確に解釈する'],
    scenarios: [
      { id: 'd18r-1', customer: 'Customer 1', line: 'I’ve never used a hydration pack before. Is this one easy to clean?', choices: [
        { id: 'd18r1-best', text: 'Yes. This model is easier to clean, so it’s a good first option.', response: 'Great. That sounds manageable.', quality: 'best', points: 100, explanation: '未経験という情報と比較級を結びつけ、初心者向け理由まで説明しています。' },
        { id: 'd18r1-good', text: 'This is a hydration pack.', response: 'I know. Is it easy to clean?', quality: 'good', points: 45, explanation: '商品名を繰り返すだけで質問へ答えていません。' },
        { id: 'd18r1-poor', text: 'You have used it many times.', response: 'No, I haven’t.', quality: 'poor', points: 10, explanation: 'never と逆の意味です。' },
      ]},
      { id: 'd18r-2', customer: 'Customer 2', line: 'If the wind gets stronger, should I use the larger tent?', choices: [
        { id: 'd18r2-best', text: 'Not necessarily. You should choose the tent with better wind stability.', response: 'That makes sense.', quality: 'best', points: 100, explanation: '大きさではなく条件に関係する性能を基準に助言しています。' },
        { id: 'd18r2-good', text: 'Yes, larger is always better.', response: 'Even in strong wind?', quality: 'good', points: 35, explanation: '条件と性能の関係を単純化しすぎています。' },
        { id: 'd18r2-poor', text: 'If the wind gets stronger, use no tent.', response: 'That sounds unsafe.', quality: 'poor', points: 5, explanation: '安全性を損なう回答です。' },
      ]},
      { id: 'd18r-3', customer: 'Customer 3', line: 'The guide said we’ll continue unless there is lightning.', choices: [
        { id: 'd18r3-best', text: 'Right. The trip continues if there is no lightning.', response: 'Exactly.', quality: 'best', points: 100, explanation: 'unless を if ... not に正しく言い換えています。' },
        { id: 'd18r3-good', text: 'The trip stops unless there is lightning.', response: 'I think that means the opposite.', quality: 'good', points: 25, explanation: 'unless の論理関係を逆にしています。' },
        { id: 'd18r3-poor', text: 'Lightning happened yesterday.', response: 'We’re talking about tomorrow.', quality: 'poor', points: 5, explanation: '未来条件を過去の出来事へ変えています。' },
      ]},
    ],
  },
]

const chapter3ActivityMap = new Map(chapter3Activities.map((activity) => [activity.id, activity]))

export function chapter3ActivityById(id: string): Chapter1Activity | undefined {
  return chapter3ActivityMap.get(id)
}
