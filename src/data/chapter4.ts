import type { Chapter1Activity, Chapter1Day } from '../core/chapter1.js'

export const chapter4Days: Chapter1Day[] = [
  {
    day: 19,
    title: 'How Is It Made?',
    subtitle: '受動態と分詞形容詞で、商品の製造・状態・特徴を説明する。',
    newLanguage: ['passive voice', 'participle adjectives'],
    reviewLanguage: ['comparative', 'present perfect'],
    gameFocus: 'Product Explanation',
    activityIds: ['d19-made-designed', 'd19-damaged-opened', 'd19-passive-rush'],
    canDo: ['be + past participle で商品の製造や設計を説明する', 'damaged / refurbished など状態を表す語を理解する', '能動態と受動態の視点の違いを読み取る'],
  },
  {
    day: 20,
    title: 'Find the Exact Model',
    subtitle: 'who / which / that / where と目的格の関係詞で、人・商品・場所を正確に特定する。',
    newLanguage: ['relative pronouns', 'who / which / that', 'object relatives', 'where'],
    reviewLanguage: ['which', 'comparative'],
    gameFocus: 'Specification Hunt',
    activityIds: ['d20-laptop-that', 'd20-device-which', 'd20-relative-rush'],
    canDo: ['that / which で商品条件をつなげる', 'who で対象となる利用者を説明する', '複数条件から該当商品を特定する'],
  },
  {
    day: 21,
    title: 'Ask More Politely',
    subtitle: 'Could you tell me... などの間接疑問で、用途や問題を丁寧に聞き出す。',
    newLanguage: ['indirect questions'],
    reviewLanguage: ['WH questions', 'present perfect'],
    gameFocus: 'Polite Diagnosis',
    activityIds: ['d21-what-use-for', 'd21-could-you-tell', 'd21-indirect-hunt'],
    canDo: ['Could you tell me... で丁寧に質問する', '間接疑問では語順が平叙文になることを理解する', '用途や症状を必要な順番で聞き出す'],
  },
  {
    day: 22,
    title: 'Explain What It Does',
    subtitle: 'make / keep / let / SVOO / It is ... to / how to で、機能と操作を説明する。',
    newLanguage: ['make / keep / let', 'SVOO', 'It is ... to', 'how to', 'SVOC'],
    reviewLanguage: ['to-infinitive', 'passive voice'],
    gameFocus: 'Feature Explanation',
    activityIds: ['d22-keeps-cool', 'd22-how-to-connect', 'd22-feature-rush'],
    canDo: ['keep + object + adjective で機能を説明する', 'make / let の意味の違いを理解する', 'how to で操作方法を案内する'],
  },
  {
    day: 23,
    title: 'Technical Trouble',
    subtitle: 'because / although / while を読み分け、症状と原因を整理して故障対応する。',
    newLanguage: ['because / although / while'],
    reviewLanguage: ['present perfect', 'passive voice', 'indirect questions'],
    gameFocus: 'Technical Troubleshooting',
    activityIds: ['d23-headphones-pairing', 'd23-although-battery', 'd23-trouble-rush'],
    canDo: ['because で理由を説明する', 'although で予想と反する状況を理解する', '診断質問で原因候補を減らし、対処を選ぶ'],
  },
  {
    day: 24,
    title: 'Specialist Handoff',
    subtitle: 'Chapter 4の情報を整理し、専門スタッフへ必要事項だけを英語で引き継ぐ。',
    newLanguage: ['tell / want + object + to', 'staff handoff'],
    reviewLanguage: ['Chapter 4 all'],
    gameFocus: 'Staff Coordination + Mixed Shift',
    activityIds: ['d24-repair-handoff', 'd24-specialist-request', 'd24-electronics-rush'],
    canDo: ['重要情報と不要情報を区別する', '症状・用途・期限を短く引き継ぐ', 'Chapter 4の英語を複数の家電接客で使う'],
  },
]

export const chapter4Activities: Chapter1Activity[] = [
  {
    id: 'd19-made-designed', kind: 'dialogue', title: 'Where is it made?', skill: 'Product Explanation',
    objective: '受動態を使って商品の製造情報を自然に説明する。', grammar: ['passive voice'],
    customer: { id: 'daniel', name: 'Daniel', roleLabel: 'ノートPCの製造情報を確認したい', opening: 'I like this laptop. Where is it made?' },
    bestRoute: ['商品を主語にする', 'be + past participle を使う', '製造場所を簡潔に伝える'],
    choices: [
      { id: 'd19m-best', text: 'It is made in Taiwan and tested before shipping.', response: 'Thanks. That answers my question.', quality: 'best', points: 100, explanation: '商品を主語にして is made / tested と受動態で自然に説明しています。' },
      { id: 'd19m-good', text: 'They make it in Taiwan.', response: 'Okay, I understand.', quality: 'good', points: 82, explanation: '意味は通じますが、誰が製造するかより商品情報を説明する場面では受動態が自然です。' },
      { id: 'd19m-poor', text: 'It made in Taiwan.', response: 'Do you mean it is made there?', quality: 'poor', points: 35, explanation: '受動態には be 動詞が必要です。' },
    ],
  },
  {
    id: 'd19-damaged-opened', kind: 'information-hunt', title: 'New, opened, or damaged?', skill: 'Condition Hunt',
    objective: '商品の状態を表す語を確認し、客の希望に合う在庫を選ぶ。', grammar: ['participle adjectives', 'passive voice'],
    customer: { id: 'grace', name: 'Grace', roleLabel: '展示品でもよいが傷は避けたい', opening: 'I don’t mind an opened box, but I don’t want a damaged product.' },
    bestRoute: ['開封済みが許容されることを確認する', '傷や破損の有無を確認する', 'opened but undamaged の商品を選ぶ'], maxQuestions: 2,
    questions: [
      { id: 'd19c-opened', text: 'Is an opened package okay if the product has not been used?', response: 'Yes, that is fine.', reveal: 'Opened package is acceptable', value: 5 },
      { id: 'd19c-damage', text: 'Would you accept a small scratch on the case?', response: 'No. I want one without any damage.', reveal: 'No scratches or damage', value: 5 },
      { id: 'd19c-color', text: 'Do you prefer a white box?', response: 'The box color does not matter.', reveal: 'Box color irrelevant', value: 1 },
      { id: 'd19c-brand', text: 'Have you bought this brand before?', response: 'Yes, once.', reveal: 'Has used brand before', value: 2 },
    ],
    candidates: [
      { id: 'd19c-a', name: 'Open Box A', details: 'opened · unused · no scratches · 8% off', correct: true },
      { id: 'd19c-b', name: 'Display B', details: 'used for display · small scratch · 15% off' },
      { id: 'd19c-c', name: 'Damaged Box C', details: 'sealed product · damaged outer case' },
      { id: 'd19c-d', name: 'Refurbished D', details: 'repaired and tested · visible wear' },
    ],
  },
  {
    id: 'd19-passive-rush', kind: 'rapid', title: 'Passive voice counter', skill: 'Product Explanation Rush',
    objective: '製造・配送・修理に関する受動態を素早く理解して返答する。', grammar: ['passive voice', 'participle adjectives'],
    customer: { id: 'mia', name: 'Rush customers', roleLabel: '商品状態の質問が続く', opening: 'Three customers have quick questions about how products are made, shipped, and repaired.' },
    bestRoute: ['商品が動作を受ける場面を見抜く', 'be + past participle を選ぶ', '状態を表す分詞形容詞にも注目する'],
    scenarios: [
      { id: 'd19r-1', customer: 'Customer 1', line: 'Is this phone assembled in Japan?', choices: [
        { id: 'd19r1-best', text: 'Yes. It is assembled in Japan.', response: 'Great, thanks.', quality: 'best', points: 100, explanation: '質問の受動態に合わせて自然に答えています。' },
        { id: 'd19r1-good', text: 'Yes. They assemble it in Japan.', response: 'Okay.', quality: 'good', points: 82, explanation: '意味は通じますが、商品説明では受動態の方が焦点が一致します。' },
        { id: 'd19r1-poor', text: 'Yes. It assemble in Japan.', response: 'Sorry?', quality: 'poor', points: 30, explanation: '受動態の be 動詞と過去分詞が不足しています。' },
      ]},
      { id: 'd19r-2', customer: 'Customer 2', line: 'The box was damaged during delivery.', choices: [
        { id: 'd19r2-best', text: 'I’m sorry. We can check whether the product inside was damaged too.', response: 'Please do.', quality: 'best', points: 100, explanation: 'damaged の状態を理解し、必要な確認へ進めています。' },
        { id: 'd19r2-good', text: 'The delivery damaged the box.', response: 'Yes, I think so.', quality: 'good', points: 75, explanation: '意味は近いですが、客が求めている次の対応には進んでいません。' },
        { id: 'd19r2-poor', text: 'The box is delivering now.', response: 'No, it already arrived.', quality: 'poor', points: 15, explanation: '過去の破損を現在進行中の配送と取り違えています。' },
      ]},
      { id: 'd19r-3', customer: 'Customer 3', line: 'Has this laptop been refurbished?', choices: [
        { id: 'd19r3-best', text: 'No. This one is new and has not been refurbished.', response: 'Good to know.', quality: 'best', points: 100, explanation: '現在完了受動態の質問に内容・形とも対応しています。' },
        { id: 'd19r3-good', text: 'No. It is a new laptop.', response: 'Okay.', quality: 'good', points: 80, explanation: '意味は伝わりますが、refurbished かどうかへの直接回答が弱いです。' },
        { id: 'd19r3-poor', text: 'No. It refurbishes a laptop.', response: 'What does?', quality: 'poor', points: 15, explanation: '商品が修理する側のような文になっています。' },
      ]},
    ],
  },
  {
    id: 'd20-laptop-that', kind: 'information-hunt', title: 'A laptop that fits the job', skill: 'Specification Hunt',
    objective: '客が挙げる複数条件をつなげて、仕事用ノートPCを特定する。', grammar: ['relative pronouns', 'that / which'],
    customer: { id: 'mia', name: 'Mia', roleLabel: '毎日持ち運ぶ仕事用PCを探している', opening: 'I need a laptop that is light enough to carry every day and that can run two external displays.' },
    bestRoute: ['持ち運び条件の上限を確認する', '外部ディスプレイ要件を確認する', '両方を満たすモデルを選ぶ'], maxQuestions: 2,
    questions: [
      { id: 'd20l-weight', text: 'How light does it need to be?', response: 'Around 1.3 kilograms or less would be ideal.', reveal: 'Weight ≤ 1.3 kg', value: 5 },
      { id: 'd20l-display', text: 'Do you need to connect two external displays at the same time?', response: 'Yes. I use two monitors at my desk.', reveal: 'Needs dual external display support', value: 5 },
      { id: 'd20l-color', text: 'Which color do you prefer?', response: 'Any color is fine.', reveal: 'Color irrelevant', value: 1 },
      { id: 'd20l-games', text: 'Do you play games on weekends?', response: 'Not really.', reveal: 'Gaming not important', value: 2 },
    ],
    candidates: [
      { id: 'd20l-a', name: 'WorkLite 13', details: '1.18 kg · dual display · 12h battery', correct: true },
      { id: 'd20l-b', name: 'SlimBook Air', details: '1.09 kg · one external display only · 14h battery' },
      { id: 'd20l-c', name: 'Creator 15', details: '1.85 kg · dual display · powerful GPU' },
      { id: 'd20l-d', name: 'Budget 14', details: '1.45 kg · dual display · low price' },
    ],
  },
  {
    id: 'd20-device-which', kind: 'dialogue', title: 'Which device can do that?', skill: 'Relative Clause Clarification',
    objective: '関係代名詞を使って、条件を満たす商品を自然に説明する。', grammar: ['which / that'],
    customer: { id: 'daniel', name: 'Daniel', roleLabel: '旅行用充電器を探している', opening: 'I want a charger that can charge my laptop and phone at the same time.' },
    bestRoute: ['charger を先行詞にする', 'that can... で必要機能を説明する', '商品を特定して提案する'],
    choices: [
      { id: 'd20d-best', text: 'This is the charger that can power both devices at the same time.', response: 'That’s exactly what I need.', quality: 'best', points: 100, explanation: 'charger を that 以下で限定し、必要な機能を自然につないでいます。' },
      { id: 'd20d-good', text: 'This charger can power both devices at the same time.', response: 'Sounds good.', quality: 'good', points: 90, explanation: '十分自然ですが、今回の学習目標である関係代名詞は使っていません。' },
      { id: 'd20d-poor', text: 'This is the charger who can power both devices.', response: 'Who?', quality: 'poor', points: 35, explanation: '物には who ではなく that / which を使います。' },
    ],
  },
  {
    id: 'd20-relative-rush', kind: 'rapid', title: 'Who, which, that, or where?', skill: 'Specification Rush',
    objective: '主格・目的格の関係詞とwhereを使い分け、対象と場所を説明する。', grammar: ['who / which / that', 'object relative', 'relative where'], grammarTargets: [{ key: 'RELATIVE_OBJECT', role: 'target' }, { key: 'RELATIVE_ADVERBS', role: 'target' }],
    customer: { id: 'grace', name: 'Rush customers', roleLabel: '条件指定が続く', opening: 'Three customers describe the person or device they need.' },
    bestRoute: ['人なら who を優先する', '物なら which / that を使う', '後ろの情報が何を限定しているかを見る'],
    scenarios: [
      { id: 'd20r-1', customer: 'Customer 1', line: 'I need the headphones that you showed me yesterday.', choices: [
        { id: 'd20r1-best', text: 'These are the headphones that you asked about yesterday.', response: 'Yes, those are the ones.', quality: 'best', points: 100, explanation: 'thatが関係節内のasked aboutの目的語になる目的格用法です。' },
        { id: 'd20r1-good', text: 'These headphones have strong noise canceling.', response: 'Okay.', quality: 'good', points: 85, explanation: '意味は正しいですが、関係節を使った説明ではありません。' },
        { id: 'd20r1-poor', text: 'These are the headphones who block noise.', response: 'Who?', quality: 'poor', points: 30, explanation: '物に who は使いません。' },
      ]},
      { id: 'd20r-2', customer: 'Customer 2', line: 'I’m buying a tablet for my father, who is new to touch screens.', choices: [
        { id: 'd20r2-best', text: 'Then I’d recommend a model that is easy for first-time users.', response: 'That would help.', quality: 'best', points: 100, explanation: 'who が father を説明していることを読み、初心者向け商品へつなげています。' },
        { id: 'd20r2-good', text: 'Your father is new to touch screens.', response: 'Yes.', quality: 'good', points: 65, explanation: '情報を復唱しただけで提案に進んでいません。' },
        { id: 'd20r2-poor', text: 'The tablet who is your father is easy.', response: 'What?', quality: 'poor', points: 10, explanation: '先行詞と関係節の関係が崩れています。' },
      ]},
      { id: 'd20r-3', customer: 'Customer 3', line: 'Which desk handles laptop repairs?', choices: [
        { id: 'd20r3-best', text: 'This is the desk where we handle laptop repairs.', response: 'I’ll go there now.', quality: 'best', points: 100, explanation: 'whereでdeskという場所を説明し、修理受付を特定しています。' },
        { id: 'd20r3-good', text: 'This model works on glass surfaces.', response: 'Thanks.', quality: 'good', points: 88, explanation: '自然な回答ですが、関係代名詞の練習としては一段簡単です。' },
        { id: 'd20r3-poor', text: 'This is the model who works on glass.', response: 'Who works?', quality: 'poor', points: 25, explanation: '物に who を使っています。' },
      ]},
    ],
  },
  {
    id: 'd21-what-use-for', kind: 'dialogue', title: 'What will you use it for?', skill: 'Polite Clarification',
    objective: '間接疑問を使い、客の用途を丁寧に確認する。', grammar: ['indirect questions'],
    customer: { id: 'grace', name: 'Grace', roleLabel: 'タブレットを探しているが用途が不明', opening: 'I’d like a tablet, but I’m not sure which one to choose.' },
    bestRoute: ['用途が不足情報だと判断する', 'Could you tell me... で丁寧に聞く', '間接疑問では what you will use... の語順にする'],
    choices: [
      { id: 'd21u-best', text: 'Could you tell me what you’ll use it for?', response: 'Mostly reading, video calls, and some web browsing.', quality: 'best', points: 100, explanation: '丁寧な導入＋平叙文語順の間接疑問になっています。' },
      { id: 'd21u-good', text: 'What will you use it for?', response: 'Mostly reading and video calls.', quality: 'good', points: 88, explanation: '直接疑問として自然ですが、今回の丁寧な間接疑問の目標は使っていません。' },
      { id: 'd21u-poor', text: 'Could you tell me what will you use it for?', response: 'I understand, but that sounds a little unusual.', quality: 'poor', points: 55, explanation: '間接疑問では what you will use it for の語順です。' },
    ],
  },
  {
    id: 'd21-could-you-tell', kind: 'rapid', title: 'Indirect question desk', skill: 'Polite Question Rush',
    objective: '直接疑問と間接疑問の語順を見分ける。', grammar: ['indirect questions'],
    customer: { id: 'daniel', name: 'Rush customers', roleLabel: '丁寧な質問が必要', opening: 'Three customers need help, and you want to ask for details politely.' },
    bestRoute: ['Could you tell me / Do you know の後を平叙文語順にする', '疑問詞を残す', '必要情報を具体的に聞く'],
    scenarios: [
      { id: 'd21r-1', customer: 'Customer 1', line: 'My laptop sometimes shuts down.', choices: [
        { id: 'd21r1-best', text: 'Could you tell me when it usually shuts down?', response: 'Usually when I start a video call.', quality: 'best', points: 100, explanation: 'when + it usually shuts down の平叙文語順です。' },
        { id: 'd21r1-good', text: 'When does it usually shut down?', response: 'During video calls.', quality: 'good', points: 88, explanation: '直接疑問として正しいですが、間接疑問の練習にはなっていません。' },
        { id: 'd21r1-poor', text: 'Could you tell me when does it usually shut down?', response: 'During video calls.', quality: 'poor', points: 55, explanation: '間接疑問の中では does it ではなく it ... の語順です。' },
      ]},
      { id: 'd21r-2', customer: 'Customer 2', line: 'I need to pick up an online order.', choices: [
        { id: 'd21r2-best', text: 'Could you tell me what your order number is?', response: 'It’s 4821.', quality: 'best', points: 100, explanation: 'what your order number is が正しい間接疑問の語順です。' },
        { id: 'd21r2-good', text: 'What is your order number?', response: '4821.', quality: 'good', points: 90, explanation: '直接疑問として自然ですが、丁寧さを一段上げられます。' },
        { id: 'd21r2-poor', text: 'Could you tell me what is your order number?', response: 'It’s 4821.', quality: 'poor', points: 55, explanation: '間接疑問では your order number is の語順になります。' },
      ]},
      { id: 'd21r-3', customer: 'Customer 3', line: 'This smartwatch will not sync.', choices: [
        { id: 'd21r3-best', text: 'Could you tell me which phone you’re using?', response: 'An Android phone.', quality: 'best', points: 100, explanation: 'which phone you’re using と自然に情報を聞けています。' },
        { id: 'd21r3-good', text: 'Which phone are you using?', response: 'Android.', quality: 'good', points: 88, explanation: '直接疑問として正しいです。' },
        { id: 'd21r3-poor', text: 'Could you tell me which phone are you using?', response: 'Android.', quality: 'poor', points: 55, explanation: '間接疑問では are you using の倒置を戻します。' },
      ]},
    ],
  },
  {
    id: 'd21-indirect-hunt', kind: 'information-hunt', title: 'What is causing the slowdown?', skill: 'Polite Diagnosis Hunt',
    objective: '丁寧な質問を2つ使い、ノートPCの利用状況から適切なモデルを特定する。', grammar: ['indirect questions', 'present perfect'],
    customer: { id: 'mia', name: 'Mia', roleLabel: 'オンライン授業でPCが重い', opening: 'My current laptop gets slow during online classes, so I’m thinking about replacing it.' },
    bestRoute: ['何を同時に使うか聞く', 'メモリ不足の兆候を確認する', '用途に十分なメモリのモデルを選ぶ'], maxQuestions: 2,
    questions: [
      { id: 'd21h-apps', text: 'Could you tell me which apps you usually have open during class?', response: 'Video calls, a browser with many tabs, and a note-taking app.', reveal: 'Heavy multitasking during class', value: 5 },
      { id: 'd21h-memory', text: 'Do you know how much memory your current laptop has?', response: 'It has 8 GB of memory.', reveal: 'Current RAM: 8 GB', value: 5 },
      { id: 'd21h-color', text: 'Could you tell me which color you like?', response: 'I don’t really care.', reveal: 'Color irrelevant', value: 1 },
      { id: 'd21h-age', text: 'Could you tell me when you bought your mouse?', response: 'About a year ago.', reveal: 'Mouse age irrelevant', value: 1 },
    ],
    candidates: [
      { id: 'd21h-a', name: 'Study 16', details: '16 GB RAM · efficient CPU · good webcam', correct: true },
      { id: 'd21h-b', name: 'Basic 8', details: '8 GB RAM · low price · basic use' },
      { id: 'd21h-c', name: 'Gaming Max', details: '32 GB RAM · heavy GPU · expensive and heavy' },
      { id: 'd21h-d', name: 'Mini 8', details: '8 GB RAM · compact · weak multitasking' },
    ],
  },
  {
    id: 'd22-keeps-cool', kind: 'dialogue', title: 'What does this feature do?', skill: 'Feature Explanation',
    objective: 'keep + object + adjective を使って冷却機能を説明する。', grammar: ['keep + O + C', 'SVOC'],
    customer: { id: 'daniel', name: 'Daniel', roleLabel: 'PCの冷却機能を知りたい', opening: 'What does this larger cooling system actually do?' },
    bestRoute: ['機能の効果を説明する', 'keep + the processor + cool を使う', '高負荷時という条件も伝える'],
    choices: [
      { id: 'd22k-best', text: 'It keeps the processor cooler when the laptop is under heavy load.', response: 'That makes sense.', quality: 'best', points: 100, explanation: 'keep + object + adjective で「〜を…な状態に保つ」を自然に説明しています。' },
      { id: 'd22k-good', text: 'It cools the processor when the laptop is busy.', response: 'Okay, I understand.', quality: 'good', points: 90, explanation: '意味は十分自然ですが、今回の keep + O + C の形は使っていません。' },
      { id: 'd22k-poor', text: 'It keeps cool the processor.', response: 'You mean it keeps the processor cool?', quality: 'poor', points: 45, explanation: 'keep + object + adjective の語順にします。' },
    ],
  },
  {
    id: 'd22-how-to-connect', kind: 'checkout', title: 'Show me how to connect it', skill: 'Setup Guidance',
    objective: 'It is ... to と how to を使って、Bluetooth機器の基本設定を案内する。', grammar: ['It is ... to', 'how to', 'imperative review'], grammarTargets: [{ key: 'IT_IS_TO', role: 'target' }],
    customer: { id: 'grace', name: 'Grace', roleLabel: '新しいスピーカーの接続が不安', opening: 'I bought this speaker, but I’m not sure how to connect it to my phone.' },
    bestRoute: ['how to の内容を理解する', '設定画面→Bluetooth→機器選択の順で案内する', '短く具体的に説明する'],
    choices: [
      { id: 'd22h-best', text: 'It’s easy to connect. I’ll show you how. Open your Bluetooth settings, then select the speaker from the list.', response: 'That looks easy enough.', quality: 'best', points: 100, explanation: 'It is + adjective + to不定詞で難易度を示し、how toの手順へつないでいます。' },
      { id: 'd22h-good', text: 'Open Bluetooth settings and select the speaker.', response: 'Okay, thanks.', quality: 'good', points: 90, explanation: '操作案内として十分ですが、how to の学習表現は使っていません。' },
      { id: 'd22h-poor', text: 'I show you how connect it.', response: 'Could you show me?', quality: 'poor', points: 45, explanation: 'how to connect の to が必要です。' },
    ],
  },
  {
    id: 'd22-feature-rush', kind: 'rapid', title: 'Make, keep, let, or give?', skill: 'Feature Explanation Rush',
    objective: 'make / keep / let とSVOOを使い分けて商品機能を説明する。', grammar: ['make / keep / let', 'SVOO'], grammarTargets: [{ key: 'SVOO', role: 'target' }],
    customer: { id: 'mia', name: 'Rush customers', roleLabel: '機能説明が続く', opening: 'Three customers ask what different features actually do.' },
    bestRoute: ['状態維持なら keep を考える', '何かを可能にするなら let を考える', '結果を生じさせる make との違いを見る'],
    scenarios: [
      { id: 'd22r-1', customer: 'Customer 1', line: 'What does the eye-comfort mode do?', choices: [
        { id: 'd22r1-best', text: 'It makes the screen easier on your eyes in the evening.', response: 'That sounds useful.', quality: 'best', points: 100, explanation: 'make + object + adjective で画面の状態変化を説明しています。' },
        { id: 'd22r1-good', text: 'It reduces blue light in the evening.', response: 'Okay.', quality: 'good', points: 90, explanation: '内容は正しいですが、make の構文は使っていません。' },
        { id: 'd22r1-poor', text: 'It makes easier the screen.', response: 'Sorry?', quality: 'poor', points: 35, explanation: 'make + object + adjective の語順です。' },
      ]},
      { id: 'd22r-2', customer: 'Customer 2', line: 'Why does this case have raised edges?', choices: [
        { id: 'd22r2-best', text: 'They keep the screen from touching the table.', response: 'I see.', quality: 'best', points: 100, explanation: 'keep + object + from -ing で、画面がテーブルに触れない状態を表しています。' },
        { id: 'd22r2-good', text: 'They protect the screen when you put the phone down.', response: 'Got it.', quality: 'good', points: 90, explanation: '説明は正しいですが、keep の構文は使っていません。' },
        { id: 'd22r2-poor', text: 'They keep away the table the screen.', response: 'What do you mean?', quality: 'poor', points: 25, explanation: '目的語と補語の配置が崩れています。' },
      ]},
      { id: 'd22r-3', customer: 'Customer 3', line: 'Can I connect all my devices through this hub using just one cable?', choices: [
        { id: 'd22r3-best', text: 'Yes. It gives you access to several extra ports through a single cable.', response: 'That’s convenient.', quality: 'best', points: 100, explanation: 'give + 人 + 物のSVOOで、利用者に得られる機能を簡潔に説明しています。' },
        { id: 'd22r3-good', text: 'Yes. You can connect several devices with it.', response: 'Great.', quality: 'good', points: 90, explanation: '意味は正しいですが、let の構文は使っていません。' },
        { id: 'd22r3-poor', text: 'It lets you to connect several devices.', response: 'I understand.', quality: 'poor', points: 60, explanation: 'let の後は to を付けず原形を使います。' },
      ]},
    ],
  },
  {
    id: 'd23-headphones-pairing', kind: 'troubleshooting', title: 'Headphones will not reconnect', skill: 'Technical Troubleshooting',
    objective: '限られた2質問でBluetooth接続不良の原因を特定し、正しい対処を選ぶ。', grammar: ['present perfect', 'because / although'],
    customer: { id: 'mia', name: 'Mia', roleLabel: 'ワイヤレスイヤホンが再接続できない', opening: 'My earbuds turn on, but they won’t reconnect to my phone although they worked yesterday.' },
    bestRoute: ['直前に別端末へ接続したか確認する', 'Bluetoothが有効か確認する', '古いpairing情報を削除して再接続する'], maxQuestions: 2,
    causes: [
      { id: 'd23c-pairing', label: 'Old pairing conflict' },
      { id: 'd23c-bluetooth', label: 'Bluetooth is off' },
      { id: 'd23c-battery', label: 'Battery is empty' },
      { id: 'd23c-hardware', label: 'Hardware failure' },
    ],
    questions: [
      { id: 'd23q-other', text: 'Have you connected the earbuds to another device recently?', response: 'Yes. I connected them to my tablet last night.', reveal: 'Recently connected to another device', value: 5, points: 5, confirms: 'd23c-pairing', eliminates: ['d23c-hardware'] },
      { id: 'd23q-bt', text: 'Is Bluetooth turned on on your phone?', response: 'Yes, it is on.', reveal: 'Phone Bluetooth is on', value: 5, points: 5, eliminates: ['d23c-bluetooth'] },
      { id: 'd23q-charge', text: 'Are the earbuds charged?', response: 'Yes. They are at about 80%.', reveal: 'Battery is not empty', value: 3, points: 3, eliminates: ['d23c-battery'] },
      { id: 'd23q-color', text: 'What color are the earbuds?', response: 'Black.', reveal: 'Color irrelevant', value: 0, points: 0 },
    ],
    solutions: [
      { id: 'd23s-pair', text: 'Forget the old connection on both devices and pair the earbuds with the phone again.', cause: 'd23c-pairing' },
      { id: 'd23s-bt', text: 'Turn Bluetooth on.', cause: 'd23c-bluetooth' },
      { id: 'd23s-charge', text: 'Charge the earbuds for two hours.', cause: 'd23c-battery' },
      { id: 'd23s-replace', text: 'Replace the earbuds immediately.', cause: 'd23c-hardware' },
    ],
    correctCause: 'd23c-pairing',
  },
  {
    id: 'd23-although-battery', kind: 'dialogue', title: 'Although the battery is full...', skill: 'Cause & Contrast Clarification',
    objective: 'although と because の役割を区別して、症状を正しく要約する。', grammar: ['although', 'because'],
    customer: { id: 'daniel', name: 'Daniel', roleLabel: 'タブレットが突然落ちる', opening: 'The tablet sometimes turns off although the battery is still above 60%.' },
    bestRoute: ['although が逆接だと理解する', 'バッテリー残量が高いのに落ちることを把握する', '単純な電池切れと決めつけない'],
    choices: [
      { id: 'd23a-best', text: 'So it turns off even though the battery still has plenty of charge.', response: 'Yes, exactly.', quality: 'best', points: 100, explanation: 'although の逆接関係を正しく言い換えています。' },
      { id: 'd23a-good', text: 'So it turns off while the battery is above 60%.', response: 'Yes.', quality: 'good', points: 78, explanation: '同時性は表せますが、「残量があるのに」という逆接が弱くなります。' },
      { id: 'd23a-poor', text: 'So it turns off because the battery is empty.', response: 'No, the battery is not empty.', quality: 'poor', points: 20, explanation: 'although を because と逆に解釈しています。' },
    ],
  },
  {
    id: 'd23-trouble-rush', kind: 'rapid', title: 'Because, although, while', skill: 'Technical Language Rush',
    objective: '原因・逆接・同時進行を素早く読み分ける。', grammar: ['because / although / while'],
    customer: { id: 'grace', name: 'Rush customers', roleLabel: '故障説明が続く', opening: 'Three customers describe technical problems using different connectors.' },
    bestRoute: ['because=理由', 'although=逆接', 'while=同時進行/対比を文脈で判断する'],
    scenarios: [
      { id: 'd23r-1', customer: 'Customer 1', line: 'The phone is getting hot because a game is running in the background.', choices: [
        { id: 'd23r1-best', text: 'Let’s close the background game and check the temperature again.', response: 'Okay.', quality: 'best', points: 100, explanation: 'because 以下を原因として正しく利用しています。' },
        { id: 'd23r1-good', text: 'The phone is hot while a game is running.', response: 'Yes.', quality: 'good', points: 70, explanation: '同時性は表しますが、明示された原因関係を弱めています。' },
        { id: 'd23r1-poor', text: 'The game is running although the phone is cold.', response: 'No, the phone is hot.', quality: 'poor', points: 15, explanation: '元の因果関係を失っています。' },
      ]},
      { id: 'd23r-2', customer: 'Customer 2', line: 'Although I updated the app, it still crashes.', choices: [
        { id: 'd23r2-best', text: 'So the update did not solve the crash.', response: 'Right.', quality: 'best', points: 100, explanation: '「更新したのに直らない」という逆接を正しく読み取っています。' },
        { id: 'd23r2-good', text: 'You updated the app and it still crashes.', response: 'Yes.', quality: 'good', points: 85, explanation: '意味は近いですが、although の期待に反する関係が薄れます。' },
        { id: 'd23r2-poor', text: 'The app crashes because you did not update it.', response: 'But I did update it.', quality: 'poor', points: 10, explanation: '発言内容と反対です。' },
      ]},
      { id: 'd23r-3', customer: 'Customer 3', line: 'The screen flickers while I lower the brightness.', choices: [
        { id: 'd23r3-best', text: 'Does the flickering stop when you raise the brightness again?', response: 'Yes, it does.', quality: 'best', points: 100, explanation: 'while が示す状況を利用して条件を切り分けています。' },
        { id: 'd23r3-good', text: 'The screen flickers at low brightness.', response: 'Yes.', quality: 'good', points: 82, explanation: '正しく要約していますが、診断を一歩進められます。' },
        { id: 'd23r3-poor', text: 'The screen flickers because the battery is empty.', response: 'The battery is full.', quality: 'poor', points: 15, explanation: '発言にない原因を作っています。' },
      ]},
    ],
  },
  {
    id: 'd24-repair-handoff', kind: 'staff-coordination', title: 'Tell the repair specialist', skill: 'Staff Coordination',
    objective: '修理担当がすぐ判断できる重要情報を3つに絞り、英語で引き継ぐ。', grammar: ['reported information', 'tell / say review'],
    customer: { id: 'grace', name: 'Grace', roleLabel: 'タブレット修理の相談', opening: 'I bought this tablet last week. The screen flickers below 30% brightness. I need it for a business trip tomorrow, and I have the receipt with me.' },
    bestRoute: ['症状を選ぶ', '期限を選ぶ', 'receiptを選ぶ', '3情報を含む簡潔なhandoffを選ぶ'],
    maxFacts: 3,
    facts: [
      { id: 'd24f-date', text: 'Bought last week', essential: false },
      { id: 'd24f-symptom', text: 'Screen flickers below 30% brightness', essential: true },
      { id: 'd24f-deadline', text: 'Needs it for a business trip tomorrow', essential: true },
      { id: 'd24f-receipt', text: 'Has the receipt', essential: true },
      { id: 'd24f-color', text: 'Tablet is silver', essential: false },
      { id: 'd24f-counter', text: 'Customer is at the electronics counter', essential: false },
    ],
    handoffOptions: [
      { id: 'd24h-best', text: 'She says the screen flickers below 30% brightness, she needs the tablet tomorrow, and she has the receipt.', response: 'Got it. I’ll check the display issue and the service options first.', quality: 'best', points: 30, explanation: '症状・期限・手続きに必要なreceiptを簡潔にまとめています。' },
      { id: 'd24h-good', text: 'She bought the tablet last week and says there is a screen problem.', response: 'Okay. Do we know when she needs it and whether she has proof of purchase?', quality: 'good', points: 18, explanation: '症状は伝わりますが、期限とreceiptが抜けています。' },
      { id: 'd24h-poor', text: 'A customer has a silver tablet. Can you look at it?', response: 'What is wrong with it?', quality: 'poor', points: 5, explanation: '色は伝えていますが、担当者の判断に必要な症状・期限・receiptがありません。' },
    ],
  },
  {
    id: 'd24-specialist-request', kind: 'dialogue', title: 'Ask the specialist to check it', skill: 'Staff Request',
    objective: 'want / ask + object + to を使って、専門スタッフに具体的な作業を依頼する。', grammar: ['ask + object + to', 'want + object + to'],
    customer: { id: 'daniel', name: 'Daniel', roleLabel: 'データ移行も含めて相談したい', opening: 'I’m buying a new phone, but I’m worried about moving my photos and messages.' },
    bestRoute: ['必要作業がデータ移行だと判断する', '専門スタッフへ依頼する', 'ask + person + to + verb を使う'],
    choices: [
      { id: 'd24s-best', text: 'I’ll ask our setup specialist to explain the data-transfer options.', response: 'Thank you. That would help a lot.', quality: 'best', points: 100, explanation: 'ask + person + to + verb で担当者への依頼を自然に表しています。' },
      { id: 'd24s-good', text: 'Our setup specialist can explain the data-transfer options.', response: 'Could I talk to them?', quality: 'good', points: 85, explanation: '内容は正しいですが、実際に引き継ぐ行動まで明示していません。' },
      { id: 'd24s-poor', text: 'I’ll ask our specialist explain the options.', response: 'Okay...', quality: 'poor', points: 50, explanation: 'ask + person + to explain の to が必要です。' },
    ],
  },
  {
    id: 'd24-electronics-rush', kind: 'rapid', title: 'Electronics closing rush', skill: 'Electronics Rush',
    objective: 'Chapter 4の受動態・関係節・間接疑問・機能説明を連続して使う。', grammar: ['Chapter 4 all'],
    customer: { id: 'mia', name: 'Closing rush', roleLabel: '閉店前の3件を対応', opening: 'Three final customers arrive at the electronics counter just before closing.' },
    bestRoute: ['商品説明では受動態を読む', '条件指定では関係節を読む', '不足情報は丁寧な間接疑問で確認する'],
    scenarios: [
      { id: 'd24r-1', customer: 'Customer 1', line: 'I need a webcam that works well in a dark room.', choices: [
        { id: 'd24r1-best', text: 'This is the model that has the best low-light performance.', response: 'Great. I’ll take a look.', quality: 'best', points: 100, explanation: 'that 節で客の条件に対応する商品を特定しています。' },
        { id: 'd24r1-good', text: 'This model works well in dark rooms.', response: 'Thanks.', quality: 'good', points: 90, explanation: '十分正しいですが、関係節の練習としては一段簡単です。' },
        { id: 'd24r1-poor', text: 'This is the model who works in a dark room.', response: 'Who?', quality: 'poor', points: 25, explanation: '物に who は使いません。' },
      ]},
      { id: 'd24r-2', customer: 'Customer 2', line: 'Was this phone repaired before it was put on sale?', choices: [
        { id: 'd24r2-best', text: 'Yes. It was refurbished, tested, and then put back on sale.', response: 'Thanks for explaining.', quality: 'best', points: 100, explanation: '受動態で商品の処理履歴を順序よく説明しています。' },
        { id: 'd24r2-good', text: 'Yes. The store repaired and tested it.', response: 'Okay.', quality: 'good', points: 85, explanation: '能動態でも意味は通じますが、商品の履歴に焦点を当てるなら受動態が自然です。' },
        { id: 'd24r2-poor', text: 'Yes. It repaired the store.', response: 'The phone repaired the store?', quality: 'poor', points: 10, explanation: '動作の受け手と行い手が逆になっています。' },
      ]},
      { id: 'd24r-3', customer: 'Customer 3', line: 'My new monitor looks blurry, but only when I connect it to my laptop.', choices: [
        { id: 'd24r3-best', text: 'Could you tell me which cable you’re using?', response: 'An old HDMI cable.', quality: 'best', points: 100, explanation: '条件が接続時だけなので、ケーブルという高情報価値の要因を丁寧に確認しています。' },
        { id: 'd24r3-good', text: 'Which cable are you using?', response: 'An old HDMI cable.', quality: 'good', points: 90, explanation: '直接疑問として正しく、診断にも有効です。' },
        { id: 'd24r3-poor', text: 'Could you tell me which cable are you using?', response: 'An old HDMI cable.', quality: 'poor', points: 55, explanation: '間接疑問では which cable you’re using の語順です。' },
      ]},
    ],
  },
]

export function chapter4ActivityById(id: string) {
  return chapter4Activities.find((activity) => activity.id === id)
}
