import type { Chapter1Activity, Chapter1Day } from '../core/chapter1.js'

export const chapter2Days: Chapter1Day[] = [
  {
    day: 7,
    title: 'Find the Right One',
    subtitle: 'which / whose / one / ones で、商品と持ち主を正確に特定する。',
    newLanguage: ['which', 'whose', 'one / ones', 'size / color questions'],
    reviewLanguage: ['what / where', 'basic questions'],
    gameFocus: 'Product identification',
    activityIds: ['d7-shirt-hunt', 'd7-which-jacket', 'd7-socks'],
    canDo: ['複数候補から欲しい商品を特定する', 'which を使って選択肢を確認する', 'one / ones で同種の商品を指す'],
  },
  {
    day: 8,
    title: 'Better Fit',
    subtitle: '比較級と too / enough で、客により合う服を選ぶ。',
    newLanguage: ['comparative', 'too', 'enough'],
    reviewLanguage: ['which', 'one / ones', 'how much'],
    gameFocus: 'Comparison + Recommendation',
    activityIds: ['d8-jacket-recommend', 'd8-shoes-fit', 'd8-comparison-rush'],
    canDo: ['2つの商品を比較する', 'too / enough でサイズや適性を説明する', '条件に合う商品を薦める'],
  },
  {
    day: 9,
    title: 'What Is It For?',
    subtitle: 'to不定詞・動名詞で、用途や好みを聞き出す。',
    newLanguage: ['to-infinitive', 'gerund'],
    reviewLanguage: ['comparative', 'which'],
    gameFocus: 'Hidden Need',
    activityIds: ['d9-work-shirt', 'd9-weekend-style', 'd9-purpose-rush'],
    canDo: ['服を使う目的を確認する', '好みの活動から商品を絞る', '用途と商品特徴を結びつける'],
  },
  {
    day: 10,
    title: 'Yesterday and Tomorrow',
    subtitle: '過去形・過去進行形と will / be going to で、出来事の最中と予定を扱う。',
    newLanguage: ['past simple', 'past progressive', 'will', 'be going to'],
    reviewLanguage: ['when / where', 'to-infinitive'],
    gameFocus: 'History + Stock',
    activityIds: ['d10-purchase-hunt', 'd10-stock-arrival', 'd10-fitting-history'],
    canDo: ['いつ買ったか確認する', '入荷予定を説明する', '過去の出来事と今後の予定を区別する'],
  },
  {
    day: 11,
    title: 'Exchange Counter',
    subtitle: 'another / other / because / so で交換理由と代替案を整理する。',
    newLanguage: ['another / other', 'because / so'],
    reviewLanguage: ['past simple', 'comparative', 'too / enough'],
    gameFocus: 'Exchange + Troubleshooting',
    activityIds: ['d11-exchange-fix', 'd11-other-size', 'd11-exchange-hunt'],
    canDo: ['交換理由を切り分ける', '別サイズ・別商品を提案する', '理由と結果を because / so でつなぐ'],
  },
  {
    day: 12,
    title: 'Style Challenge',
    subtitle: '最上級・as ... as とChapter 2の表現をまとめて使う。',
    newLanguage: ['superlative', 'as ... as'],
    reviewLanguage: ['Chapter 2 all'],
    gameFocus: 'Mixed Recommendation',
    activityIds: ['d12-best-outfit', 'd12-as-as', 'd12-style-rush'],
    canDo: ['3商品以上を比較して最適解を選ぶ', '同程度の特徴を as ... as で説明する', '服屋の一連の接客を連続で処理する'],
  },
]

export const chapter2Activities: Chapter1Activity[] = [
  {
    id: 'd7-shirt-hunt', kind: 'information-hunt', title: 'Which shirt was it?', skill: 'Information Hunt',
    objective: '質問2回以内で、客が昨日見たシャツを特定する。', grammar: ['which', 'one / ones'],
    customer: { id: 'grace', name: 'Grace', roleLabel: '昨日見たシャツを探している', opening: 'I saw a shirt here yesterday, but I can’t remember which one it was.' },
    bestRoute: ['色ではなく形の差が大きい条件を聞く', '袖の長さを確認する', '候補表から1着を特定する'], maxQuestions: 2,
    questions: [
      { id: 'd7s-sleeve', text: 'Was it the one with short sleeves?', response: 'No. It had long sleeves.', reveal: 'Long sleeves', value: 5 },
      { id: 'd7s-pattern', text: 'Which pattern did it have?', response: 'It had thin blue stripes.', reveal: 'Thin blue stripes', value: 5 },
      { id: 'd7s-price', text: 'How much was it?', response: 'I think it was around 3,000 yen.', reveal: 'Around ¥3,000', value: 3 },
      { id: 'd7s-button', text: 'Did it have buttons?', response: 'Yes, I think so.', reveal: 'Has buttons', value: 1 },
    ],
    candidates: [
      { id: 'd7s-a', name: 'Harbor Stripe Shirt', details: 'Long sleeves · thin blue stripes · ¥2,980', correct: true },
      { id: 'd7s-b', name: 'Coast Stripe Tee', details: 'Short sleeves · thin blue stripes · ¥2,480' },
      { id: 'd7s-c', name: 'Office Blue Shirt', details: 'Long sleeves · solid blue · ¥2,980' },
      { id: 'd7s-d', name: 'Wide Stripe Shirt', details: 'Long sleeves · wide navy stripes · ¥3,480' },
    ],
  },
  {
    id: 'd7-which-jacket', kind: 'dialogue', title: 'Which one?', skill: 'Choice clarification', objective: '2着のどちらを試したいか確認する。',
    grammar: ['which', 'one'], customer: { id: 'mia', name: 'Mia', roleLabel: 'ジャケットを比較中', opening: 'I like both jackets. I’m not sure.' },
    bestRoute: ['選択肢が複数あることを認識する', 'Which one...? で選択を確認する'],
    choices: [
      { id: 'd7j-best', text: 'Which one do you want to try first?', response: 'The black one, please.', quality: 'best', points: 100, explanation: '複数候補から1つを選ぶ場面なので which one が自然です。' },
      { id: 'd7j-good', text: 'What jacket do you want?', response: 'Maybe the black one.', quality: 'good', points: 75, explanation: '意味は通じますが、目の前の2択なら Which one...? の方が明確です。' },
      { id: 'd7j-poor', text: 'Where is the jacket?', response: 'They’re both here.', quality: 'poor', points: 20, explanation: '場所ではなく、どちらを選ぶかを確認する必要があります。' },
    ],
  },
  {
    id: 'd7-socks', kind: 'checkout', title: 'Whose pickup bag?', skill: 'Possession check', objective: 'whoseを使って取り置き商品の持ち主を確認する。',
    grammar: ['whose', 'possession'], grammarTargets: [{ key: 'WHOSE_POSSESSION', role: 'target' }], customer: { id: 'daniel', name: 'Daniel', roleLabel: '受取カウンター', opening: 'I ordered black socks, but there are two pickup bags here.' },
    bestRoute: ['受取袋が複数あることを確認する', 'whoseで持ち主を質問する'],
    choices: [
      { id: 'd7o-best', text: 'Whose name is on this pickup bag?', response: 'Mine. That must be my bag.', quality: 'best', points: 100, explanation: 'whoseで受取袋に書かれた名前の持ち主を尋ね、所有関係を確認しています。' },
      { id: 'd7o-good', text: 'Which pickup bag is yours?', response: 'This one.', quality: 'good', points: 90, explanation: '十分自然ですが、今回は所有関係をwhoseで尋ねる練習です。' },
      { id: 'd7o-poor', text: 'Who pickup bag is this?', response: 'Do you mean whose bag?', quality: 'poor', points: 30, explanation: '所有を尋ねるときはwhoではなくwhoseを使います。' },
    ],
  },
  {
    id: 'd8-jacket-recommend', kind: 'information-hunt', title: 'A lighter jacket', skill: 'Recommendation',
    objective: '条件を2つ聞き、4着から最適なジャケットを薦める。', grammar: ['comparative', 'too / enough'],
    customer: { id: 'daniel', name: 'Daniel', roleLabel: '通勤用ジャケットを探している', opening: 'I need a jacket for commuting. My current one is too heavy.' },
    bestRoute: ['重さ以外の重要条件を聞く', '雨への対応を確認する', '軽さと防水性を両立する商品を選ぶ'], maxQuestions: 2,
    questions: [
      { id: 'd8j-rain', text: 'Do you need something more water-resistant?', response: 'Yes. I often walk in the rain.', reveal: 'Needs water resistance', value: 5 },
      { id: 'd8j-warm', text: 'How warm does it need to be?', response: 'Warm enough for early spring is fine.', reveal: 'Moderate warmth is enough', value: 5 },
      { id: 'd8j-color', text: 'Which color do you prefer?', response: 'Dark colors are fine.', reveal: 'Dark color preferred', value: 2 },
      { id: 'd8j-budget', text: 'How much would you like to spend?', response: 'Under 12,000 yen.', reveal: 'Budget under ¥12,000', value: 3 },
    ],
    candidates: [
      { id: 'd8j-a', name: 'Metro Shell', details: '¥9,800 · lightest · water-resistant · moderate warmth', correct: true },
      { id: 'd8j-b', name: 'Heavy Wool Coat', details: '¥11,800 · heaviest · warmest · poor in rain' },
      { id: 'd8j-c', name: 'City Hoodie', details: '¥6,900 · lighter · not water-resistant · low warmth' },
      { id: 'd8j-d', name: 'Storm Pro', details: '¥14,800 · light · most water-resistant · warm' },
    ],
  },
  {
    id: 'd8-shoes-fit', kind: 'dialogue', title: 'Too tight', skill: 'Fit judgment', objective: 'too / enough を使って試着結果に対応する。',
    grammar: ['too', 'enough', 'feel + adjective'], grammarTargets: [{ key: 'SVC_LINKING_VERBS', role: 'target' }], customer: { id: 'mia', name: 'Mia', roleLabel: '靴を試着中', opening: 'These shoes feel tight around my toes.' },
    bestRoute: ['tight が問題だと理解する', 'too tight と言い換え、別サイズを提案する'],
    choices: [
      { id: 'd8s-best', text: 'They feel too tight around the toes. Let’s try a larger size.', response: 'Yes, please.', quality: 'best', points: 100, explanation: 'feel + adjectiveで履き心地を表し、too tightという問題から解決へ進めています。' },
      { id: 'd8s-good', text: 'They are not big enough.', response: 'Right. Can I try another size?', quality: 'good', points: 85, explanation: '意味は合っていますが、客の表現に合わせて too tight と返すとより自然です。' },
      { id: 'd8s-poor', text: 'They are the cheapest shoes.', response: 'But they hurt.', quality: 'poor', points: 15, explanation: '価格比較は今の問題であるフィット感を解決しません。' },
    ],
  },
  {
    id: 'd8-comparison-rush', kind: 'rapid', title: 'Compare quickly', skill: 'Comparison Rush', objective: '3人の比較質問へ素早く答える。',
    grammar: ['comparative', 'too / enough'], customer: { id: 'grace', name: 'Rush customers', roleLabel: '比較質問が連続', opening: 'Three customers need quick comparisons.' },
    bestRoute: ['比較対象を確認する', 'than を使う', 'too / enough は適性判断に使う'],
    scenarios: [
      { id: 'd8r-1', customer: 'Customer 1', line: 'Is this coat lighter than the gray one?', choices: [
        { id: 'd8r1-best', text: 'Yes. This one is about 300 grams lighter.', response: 'Great.', quality: 'best', points: 100, explanation: 'lighter than の比較を数値とともに明確にしています。' },
        { id: 'd8r1-good', text: 'Yes, it is light.', response: 'Okay.', quality: 'good', points: 70, explanation: '軽いことは伝わりますが、比較対象との関係が弱いです。' },
        { id: 'd8r1-poor', text: 'Yes, it is the lightest.', response: 'Of all the coats?', quality: 'poor', points: 35, explanation: '2商品の比較なのに最上級へ変えています。' },
      ]},
      { id: 'd8r-2', customer: 'Customer 2', line: 'This belt is too long for me.', choices: [
        { id: 'd8r2-best', text: 'I can show you a shorter one.', response: 'Please.', quality: 'best', points: 100, explanation: 'too long という問題に対して shorter を使った代替案です。' },
        { id: 'd8r2-good', text: 'This belt is long.', response: 'Yes, too long.', quality: 'good', points: 55, explanation: '問題を繰り返すだけで解決案がありません。' },
        { id: 'd8r2-poor', text: 'You need a longer one.', response: 'Longer?', quality: 'poor', points: 10, explanation: '問題と逆方向の比較をしています。' },
      ]},
      { id: 'd8r-3', customer: 'Customer 3', line: 'Is this sweater warm enough for winter?', choices: [
        { id: 'd8r3-best', text: 'For mild winter days, yes. For very cold days, this thicker one is warmer.', response: 'That helps.', quality: 'best', points: 100, explanation: 'enough を条件付きで判断し、比較級で代替案も示しています。' },
        { id: 'd8r3-good', text: 'Yes, it is warm.', response: 'Even below zero?', quality: 'good', points: 65, explanation: '用途条件を限定せず断定しています。' },
        { id: 'd8r3-poor', text: 'It is too warm for winter.', response: 'Too warm?', quality: 'poor', points: 20, explanation: '客の懸念と逆の意味です。' },
      ]},
    ],
  },
  {
    id: 'd9-work-shirt', kind: 'information-hunt', title: 'Something to wear at work', skill: 'Hidden Need',
    objective: '用途を聞き、仕事用として最適なシャツを選ぶ。', grammar: ['to-infinitive', 'gerund'],
    customer: { id: 'grace', name: 'Grace', roleLabel: '新しい仕事用の服を探している', opening: 'I need something to wear at my new office.' },
    bestRoute: ['仕事中の活動を聞く', '手入れの優先度を聞く', '用途に合う商品を選ぶ'], maxQuestions: 2,
    questions: [
      { id: 'd9w-move', text: 'Do you need to move around a lot at work?', response: 'Yes. I spend a lot of time walking between rooms.', reveal: 'Needs easy movement', value: 5 },
      { id: 'd9w-care', text: 'Do you mind ironing shirts?', response: 'I dislike ironing, so easy care would be great.', reveal: 'Prefers easy care', value: 5 },
      { id: 'd9w-color', text: 'Which color do you like?', response: 'Blue or white is fine.', reveal: 'Blue or white', value: 2 },
      { id: 'd9w-price', text: 'What is your budget?', response: 'Around 5,000 yen.', reveal: 'Around ¥5,000', value: 3 },
    ],
    candidates: [
      { id: 'd9w-a', name: 'Flex Easy-Care Shirt', details: '¥4,800 · stretch · wrinkle-resistant · office style', correct: true },
      { id: 'd9w-b', name: 'Formal Cotton Shirt', details: '¥4,900 · rigid · needs ironing · formal style' },
      { id: 'd9w-c', name: 'Weekend Linen Shirt', details: '¥5,200 · breathable · wrinkles easily · casual' },
      { id: 'd9w-d', name: 'Relax Tee', details: '¥2,900 · stretch · easy care · very casual' },
    ],
  },
  {
    id: 'd9-weekend-style', kind: 'dialogue', title: 'What do you enjoy doing?', skill: 'Preference', objective: '動名詞で好みを理解し、用途に合う方向へ会話を進める。',
    grammar: ['gerund'], customer: { id: 'mia', name: 'Mia', roleLabel: '週末用の服を探している', opening: 'I want something comfortable for weekends.' },
    bestRoute: ['好みの活動を聞く', '動名詞を使う自然な質問を選ぶ'],
    choices: [
      { id: 'd9g-best', text: 'What do you enjoy doing on weekends?', response: 'I enjoy walking around the city and visiting cafés.', quality: 'best', points: 100, explanation: 'enjoy + doing で活動の好みを自然に聞いています。' },
      { id: 'd9g-good', text: 'What do you do on weekends?', response: 'Mostly walking and going to cafés.', quality: 'good', points: 90, explanation: '十分自然ですが、今回は gerund を含む表現を練習できます。' },
      { id: 'd9g-poor', text: 'What do you enjoy to do?', response: 'Sorry?', quality: 'poor', points: 25, explanation: 'enjoy の後は通常 gerund（doing）を使います。' },
    ],
  },
  {
    id: 'd9-purpose-rush', kind: 'rapid', title: 'Purpose check', skill: 'Purpose Rush', objective: 'to不定詞と動名詞を、用途・好みに応じて使い分ける。',
    grammar: ['to-infinitive', 'gerund'], customer: { id: 'daniel', name: 'Three shoppers', roleLabel: '用途確認', opening: 'Match the response to each customer’s purpose.' },
    bestRoute: ['need + to-infinitive', 'enjoy + gerund', 'something to + verb を区別する'],
    scenarios: [
      { id: 'd9r-1', customer: 'Customer 1', line: 'I need a shirt for a job interview.', choices: [
        { id: 'd9r1-best', text: 'Let me show you something to wear with a suit.', response: 'Perfect.', quality: 'best', points: 100, explanation: 'something to wear で用途を自然に表しています。' },
        { id: 'd9r1-good', text: 'Let me show you a formal shirt.', response: 'Thanks.', quality: 'good', points: 85, explanation: '正しいですが、to不定詞による用途表現は使っていません。' },
        { id: 'd9r1-poor', text: 'Let me show you something wearing.', response: 'Something wearing?', quality: 'poor', points: 25, explanation: 'この用途では something to wear が自然です。' },
      ]},
      { id: 'd9r-2', customer: 'Customer 2', line: 'I enjoy hiking every weekend.', choices: [
        { id: 'd9r2-best', text: 'Then you may prefer clothing that is easy to move in.', response: 'Exactly.', quality: 'best', points: 100, explanation: 'enjoy hiking という活動から必要な特徴を判断しています。' },
        { id: 'd9r2-good', text: 'You hike.', response: 'Yes.', quality: 'good', points: 55, explanation: '情報を繰り返すだけで推薦へ進んでいません。' },
        { id: 'd9r2-poor', text: 'You enjoy to hike.', response: 'I enjoy hiking, yes.', quality: 'poor', points: 30, explanation: 'enjoy の後は hiking が自然です。' },
      ]},
      { id: 'd9r-3', customer: 'Customer 3', line: 'I’m looking for shoes to wear at a wedding.', choices: [
        { id: 'd9r3-best', text: 'Do you need them to stand for several hours?', response: 'Yes, comfort is important.', quality: 'best', points: 100, explanation: 'さらに具体的な用途を to-infinitive で確認しています。' },
        { id: 'd9r3-good', text: 'Do you want comfortable shoes?', response: 'Yes.', quality: 'good', points: 80, explanation: '適切ですが、用途の具体化が弱いです。' },
        { id: 'd9r3-poor', text: 'Do you enjoy wedding?', response: 'The wedding?', quality: 'poor', points: 20, explanation: '客が必要としているのは好みではなく用途確認です。' },
      ]},
    ],
  },
  {
    id: 'd10-purchase-hunt', kind: 'information-hunt', title: 'Find the purchase', skill: 'Purchase history',
    objective: '過去の購入情報から、交換対象の商品記録を特定する。', grammar: ['past simple', 'when'],
    customer: { id: 'daniel', name: 'Daniel', roleLabel: '購入記録を確認したい', opening: 'I bought a pair of pants here last week, but I don’t have the receipt with me.' },
    bestRoute: ['購入日を聞く', '支払い/商品特徴など記録を大きく絞る情報を聞く', '購入記録を特定する'], maxQuestions: 2,
    questions: [
      { id: 'd10p-day', text: 'When did you buy them?', response: 'Last Thursday, in the evening.', reveal: 'Thursday evening', value: 5 },
      { id: 'd10p-card', text: 'How did you pay?', response: 'I paid by card.', reveal: 'Paid by card', value: 4 },
      { id: 'd10p-color', text: 'What color were they?', response: 'Dark navy.', reveal: 'Dark navy', value: 3 },
      { id: 'd10p-bag', text: 'Did you take a shopping bag?', response: 'I don’t remember.', reveal: 'Bag unknown', value: 1 },
    ],
    candidates: [
      { id: 'd10p-a', name: 'Order #1842', details: 'Thursday 18:42 · navy pants · card · ¥6,900', correct: true },
      { id: 'd10p-b', name: 'Order #1810', details: 'Thursday 12:05 · black pants · cash · ¥6,900' },
      { id: 'd10p-c', name: 'Order #1870', details: 'Friday 18:20 · navy pants · card · ¥7,900' },
      { id: 'd10p-d', name: 'Order #1755', details: 'Tuesday 19:10 · navy pants · card · ¥6,900' },
    ],
  },
  {
    id: 'd10-stock-arrival', kind: 'dialogue', title: 'When will it arrive?', skill: 'Future stock', objective: '入荷予定を will / be going to で伝える。',
    grammar: ['will', 'be going to'], customer: { id: 'grace', name: 'Grace', roleLabel: '欲しいサイズが在庫切れ', opening: 'Do you know when size M will be back in stock?' },
    bestRoute: ['確定している入荷予定を確認する', '未来の予定を明確に伝える'],
    choices: [
      { id: 'd10s-best', text: 'We’re going to receive more on Friday.', response: 'Great. I’ll come back then.', quality: 'best', points: 100, explanation: '予定されている入荷を be going to で自然に説明しています。' },
      { id: 'd10s-good', text: 'More will arrive on Friday.', response: 'Thank you.', quality: 'good', points: 95, explanation: 'will でも自然で明確です。' },
      { id: 'd10s-poor', text: 'More arrived on Friday.', response: 'It already arrived?', quality: 'poor', points: 25, explanation: '未来の予定なのに過去形になっています。' },
    ],
  },
  {
    id: 'd10-fitting-history', kind: 'rapid', title: 'Past or future?', skill: 'Timeline Rush', objective: '過去の出来事と今後の予定を素早く区別する。',
    grammar: ['past simple', 'past progressive', 'will', 'be going to'], grammarTargets: [{ key: 'PAST_PROGRESSIVE', role: 'target' }], customer: { id: 'mia', name: 'Fitting room customers', roleLabel: '時系列対応', opening: 'Three customers mention yesterday and tomorrow.' },
    bestRoute: ['過去の時刻語を見つける', '未来の予定語を見つける', '時制を合わせる'],
    scenarios: [
      { id: 'd10r-1', customer: 'Customer 1', line: 'I was trying this jacket on yesterday when I noticed the sleeve was torn.', choices: [
        { id: 'd10r1-best', text: 'Were you trying on size S when you noticed the damage?', response: 'Yes. I was trying on size S.', quality: 'best', points: 100, explanation: '継続中の試着をwas/were + -ingで表し、途中で起きた出来事と区別しています。' },
        { id: 'd10r1-good', text: 'Which size do you try?', response: 'Yesterday? Size S.', quality: 'good', points: 55, explanation: '意味は推測できますが、過去の出来事なので過去形が必要です。' },
        { id: 'd10r1-poor', text: 'Which size will you try yesterday?', response: 'Yesterday?', quality: 'poor', points: 10, explanation: 'yesterday と will が矛盾しています。' },
      ]},
      { id: 'd10r-2', customer: 'Customer 2', line: 'I’m going to a party tomorrow.', choices: [
        { id: 'd10r2-best', text: 'Then I’ll show you our party dresses.', response: 'Thanks.', quality: 'best', points: 100, explanation: '客の未来予定に対して、その場の申し出を will で返しています。' },
        { id: 'd10r2-good', text: 'You went to a party.', response: 'No, tomorrow.', quality: 'good', points: 30, explanation: '未来の予定を過去として処理しています。' },
        { id: 'd10r2-poor', text: 'You are going yesterday.', response: 'Tomorrow.', quality: 'poor', points: 10, explanation: '時刻語と時制が一致していません。' },
      ]},
      { id: 'd10r-3', customer: 'Customer 3', line: 'The clerk said more shirts are coming this afternoon.', choices: [
        { id: 'd10r3-best', text: 'Yes. They’re going to arrive around three.', response: 'I’ll wait.', quality: 'best', points: 100, explanation: '予定されている近い未来を自然に説明しています。' },
        { id: 'd10r3-good', text: 'They will arrive today.', response: 'Around what time?', quality: 'good', points: 80, explanation: '正しいですが、客が知りたい時間情報が不足しています。' },
        { id: 'd10r3-poor', text: 'They arrived tomorrow.', response: 'Tomorrow?', quality: 'poor', points: 10, explanation: '過去形と未来の時刻語が矛盾します。' },
      ]},
    ],
  },
  {
    id: 'd11-exchange-fix', kind: 'troubleshooting', title: 'Why does it need exchanging?', skill: 'Exchange diagnosis',
    objective: '質問2回で交換理由を切り分け、適切な代替案を選ぶ。', grammar: ['because / so', 'another / other'],
    customer: { id: 'mia', name: 'Mia', roleLabel: '昨日買ったスカートを交換したい', opening: 'I bought this skirt yesterday, but I want to exchange it.' },
    bestRoute: ['サイズ問題か商品不良かを切り分ける', '別サイズが必要か確認する', '原因に合う交換案を選ぶ'], maxQuestions: 2,
    causes: [
      { id: 'too-small', label: 'Size is too small' },
      { id: 'too-large', label: 'Size is too large' },
      { id: 'defect', label: 'Product is damaged' },
      { id: 'style', label: 'Customer changed preference' },
    ],
    questions: [
      { id: 'd11e-fit', text: 'Is the size the problem?', response: 'Yes. It’s too small around the waist.', reveal: 'Too small at waist', value: 5, confirms: 'too-small', points: 20 },
      { id: 'd11e-damage', text: 'Is anything damaged?', response: 'No, it’s in perfect condition.', reveal: 'No damage', value: 5, eliminates: ['defect'], points: 15 },
      { id: 'd11e-color', text: 'Do you still like the color?', response: 'Yes, I like the color.', reveal: 'Color is fine', value: 2, eliminates: ['style'], points: 5 },
      { id: 'd11e-weather', text: 'Was it raining yesterday?', response: 'No.', reveal: 'Weather irrelevant', value: 0, points: 0 },
    ],
    solutions: [
      { id: 'd11e-larger', text: 'Let’s try another one in a larger size.', cause: 'too-small' },
      { id: 'd11e-smaller', text: 'Let’s try another one in a smaller size.', cause: 'too-large' },
      { id: 'd11e-refund', text: 'This item is damaged, so we need to inspect it.', cause: 'defect' },
      { id: 'd11e-style', text: 'Let me show you some other styles.', cause: 'style' },
    ],
    correctCause: 'too-small',
  },
  {
    id: 'd11-other-size', kind: 'dialogue', title: 'Another size', skill: 'Alternative', objective: 'another / other を使って別サイズを提案する。',
    grammar: ['another', 'other'], customer: { id: 'daniel', name: 'Daniel', roleLabel: 'サイズMが合わなかった', opening: 'Size M is a little too small.' },
    bestRoute: ['同じ商品で別サイズなら another を使う', '比較級 larger も復習する'],
    choices: [
      { id: 'd11o-best', text: 'Do you want to try another one in a larger size?', response: 'Yes, size L please.', quality: 'best', points: 100, explanation: '同じ種類の別の1着を another one で表しています。' },
      { id: 'd11o-good', text: 'Do you want to try size L?', response: 'Yes.', quality: 'good', points: 90, explanation: '十分自然ですが、another の練習機会です。' },
      { id: 'd11o-poor', text: 'Do you want to try other one?', response: 'Another one?', quality: 'poor', points: 30, explanation: '単数の「もう1つ」は another one が自然です。' },
    ],
  },
  {
    id: 'd11-exchange-hunt', kind: 'information-hunt', title: 'Find another option', skill: 'Alternative Hunt',
    objective: '交換理由から、元商品とは違う最適な代替商品を選ぶ。', grammar: ['other', 'because / so', 'comparative'],
    customer: { id: 'grace', name: 'Grace', roleLabel: '別のパンツへ交換したい', opening: 'These pants are comfortable, but they wrinkle too easily, so I want a different pair.' },
    bestRoute: ['現在商品の問題を具体化する', '新しい商品の用途を確認する', 'しわになりにくい別商品を選ぶ'], maxQuestions: 2,
    questions: [
      { id: 'd11h-care', text: 'Do you want something easier to care for?', response: 'Yes. I want pants that don’t need ironing.', reveal: 'Needs easy care', value: 5 },
      { id: 'd11h-work', text: 'Are you going to wear them for work?', response: 'Yes, mostly for work.', reveal: 'For work', value: 5 },
      { id: 'd11h-color', text: 'Do you want another color?', response: 'The same navy color is fine.', reveal: 'Navy is fine', value: 2 },
      { id: 'd11h-price', text: 'Was the old pair expensive?', response: 'About 7,000 yen.', reveal: 'Old price about ¥7,000', value: 2 },
    ],
    candidates: [
      { id: 'd11h-a', name: 'Easy-Care Office Pants', details: '¥7,200 · wrinkle-resistant · navy · work style', correct: true },
      { id: 'd11h-b', name: 'Soft Linen Pants', details: '¥6,800 · wrinkles easily · navy · casual' },
      { id: 'd11h-c', name: 'Travel Joggers', details: '¥6,900 · wrinkle-resistant · black · very casual' },
      { id: 'd11h-d', name: 'Formal Wool Pants', details: '¥9,800 · needs dry cleaning · navy · formal' },
    ],
  },
  {
    id: 'd12-best-outfit', kind: 'information-hunt', title: 'The best outfit', skill: 'Final Recommendation',
    objective: '2つの質問で条件を集め、4つのコーデから最適なものを選ぶ。', grammar: ['superlative', 'comparative', 'to-infinitive'],
    customer: { id: 'mia', name: 'Mia', roleLabel: '初めての会社説明会', opening: 'I need an outfit for a company information session. I want to look professional, but I’ll be walking a lot.' },
    bestRoute: ['フォーマル度を確認する', '歩きやすさ/快適さの優先度を確認する', '条件を最も多く満たす組み合わせを選ぶ'], maxQuestions: 2,
    questions: [
      { id: 'd12b-formal', text: 'How formal does it need to be?', response: 'Professional, but not as formal as a job interview.', reveal: 'Professional, not interview-level formal', value: 5 },
      { id: 'd12b-walk', text: 'Will you be walking for a long time?', response: 'Yes, probably for several hours.', reveal: 'Needs comfort for long walking', value: 5 },
      { id: 'd12b-color', text: 'Which color do you like best?', response: 'Navy is my favorite.', reveal: 'Prefers navy', value: 2 },
      { id: 'd12b-budget', text: 'What is your budget?', response: 'Up to 18,000 yen.', reveal: 'Budget ≤ ¥18,000', value: 3 },
    ],
    candidates: [
      { id: 'd12b-a', name: 'Smart Comfort Set', details: '¥16,800 · professional · flexible pants · comfortable shoes', correct: true },
      { id: 'd12b-b', name: 'Interview Formal Set', details: '¥17,800 · most formal · stiff shoes · less comfortable' },
      { id: 'd12b-c', name: 'Weekend Casual Set', details: '¥12,800 · most comfortable · too casual' },
      { id: 'd12b-d', name: 'Premium Business Set', details: '¥24,000 · professional · comfortable · over budget' },
    ],
  },
  {
    id: 'd12-as-as', kind: 'dialogue', title: 'As light as the other one', skill: 'Equal comparison', objective: 'as ... as を使った比較を理解して答える。',
    grammar: ['as ... as'], customer: { id: 'daniel', name: 'Daniel', roleLabel: '2着のジャケットを比較', opening: 'Is this jacket as light as the gray one?' },
    bestRoute: ['同程度かどうかを答える', 'as light as の構造を維持する'],
    choices: [
      { id: 'd12a-best', text: 'Yes. It’s about as light as the gray one, but it’s warmer.', response: 'That sounds better for me.', quality: 'best', points: 100, explanation: '同程度の軽さを as light as で表し、差分の暖かさも説明しています。' },
      { id: 'd12a-good', text: 'Yes. They are almost the same weight.', response: 'Good.', quality: 'good', points: 90, explanation: '意味は同じですが、今回は as ... as を使う練習です。' },
      { id: 'd12a-poor', text: 'Yes. This is the lighter as the gray one.', response: 'Sorry?', quality: 'poor', points: 20, explanation: '比較級 lighter と as ... as を混ぜています。' },
    ],
  },
  {
    id: 'd12-style-rush', kind: 'rapid', title: 'Style Challenge Rush', skill: 'Chapter Review', objective: 'Chapter 2の主要表現と基本感嘆文を3連続で使い分ける。',
    grammar: ['Chapter 2 all', 'What a...'], grammarTargets: [{ key: 'EXCLAMATIONS', role: 'target' }], customer: { id: 'grace', name: 'Closing-time customers', roleLabel: 'Chapter 2 Final', opening: 'Three final customers arrive before closing.' },
    bestRoute: ['選択・比較・用途・時制を状況に合わせる', '最も仕事を前へ進める表現を選ぶ'],
    scenarios: [
      { id: 'd12r-1', customer: 'Customer 1', line: 'I finally found a jacket that is light enough for my trip and fits my budget.', choices: [
        { id: 'd12r1-best', text: 'What a great find! This one is light, easy to pack, and within your budget.', response: 'I’ll take it.', quality: 'best', points: 100, explanation: 'What a + adjective + nounで自然な感嘆を示し、客の条件も確認しています。' },
        { id: 'd12r1-good', text: 'This one is nice.', response: 'Is it lighter?', quality: 'good', points: 45, explanation: '客の最重要条件である lighter に答えていません。' },
        { id: 'd12r1-poor', text: 'This is the heaviest one.', response: 'That’s the opposite of what I need.', quality: 'poor', points: 5, explanation: '客の条件と反対の商品特徴を薦めています。' },
      ]},
      { id: 'd12r-2', customer: 'Customer 2', line: 'I bought this yesterday, but it’s too large.', choices: [
        { id: 'd12r2-best', text: 'Let’s try another one in a smaller size.', response: 'Yes, please.', quality: 'best', points: 100, explanation: '過去の購入を理解し、another + smaller で交換へ進めています。' },
        { id: 'd12r2-good', text: 'This one is large.', response: 'Yes, too large.', quality: 'good', points: 50, explanation: '問題を繰り返すだけで解決へ進みません。' },
        { id: 'd12r2-poor', text: 'Let’s try a larger one.', response: 'Larger?', quality: 'poor', points: 10, explanation: '必要な方向と逆です。' },
      ]},
      { id: 'd12r-3', customer: 'Customer 3', line: 'Which of these three coats is the warmest?', choices: [
        { id: 'd12r3-best', text: 'The Alpine Coat is the warmest, but the Metro Coat is lighter.', response: 'I’ll compare those two.', quality: 'best', points: 100, explanation: '3着以上の比較に最上級を使い、別軸の比較級も追加しています。' },
        { id: 'd12r3-good', text: 'The Alpine Coat is warmer.', response: 'Warmer than which one?', quality: 'good', points: 65, explanation: '3着の中で一番を聞かれているので warmest がより明確です。' },
        { id: 'd12r3-poor', text: 'All three are the warmest.', response: 'All three?', quality: 'poor', points: 15, explanation: '最上級の比較対象を適切に扱えていません。' },
      ]},
    ],
  },
]

export function chapter2ActivityById(id: string) {
  return chapter2Activities.find((activity) => activity.id === id)
}
