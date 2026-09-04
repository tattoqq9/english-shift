import type { Customer } from '../core/types.js'

export const customers: Customer[] = [
  {
    id: 'mia', name: 'Mia', age: 17, roleLabel: '高校生', category: 'earphones', patience: 90,
    openingLine: "I'm looking for earphones I can use while running.", budget: 9000, budgetFlex: .15,
    needs: { weights: { waterResistance: 1, lightWeight: .8, priceValue: .65, durability: .55, soundQuality: .35 } }, optimalQuestionCount: 1,
    facts: [
      { key: 'purpose', label: 'Purpose', value: 'Running', decisionWeight: 2, revealedAtStart: true },
      { key: 'budget', label: 'Budget', value: 'Under ¥9,000', decisionWeight: 2 },
      { key: 'weather', label: 'Priority', value: 'Water resistance', decisionWeight: 5 },
      { key: 'user', label: 'User', value: 'Herself', decisionWeight: 1 },
    ],
    questions: [
      { id: 'mia-rain', text: 'Do you often run in the rain?', response: 'Sometimes, yes. I also sweat a lot, so water resistance would be useful.', reveals: ['weather'], grammarTags: ['WH_QUESTION'], patienceCost: 7 },
      { id: 'mia-budget', text: 'How much are you looking to spend?', response: "Probably under 9,000 yen. I don't want anything too expensive.", reveals: ['budget'], grammarTags: ['WH_QUESTION'], patienceCost: 8 },
      { id: 'mia-user', text: 'Who are they for?', response: "They're for me. I'll mostly use them when I go running.", reveals: ['user'], grammarTags: ['WH_QUESTION'], patienceCost: 8 },
    ],
  },
  {
    id: 'daniel', name: 'Daniel', age: 45, roleLabel: '保護者', category: 'laptop', patience: 84,
    openingLine: "I need a laptop for my daughter. She'll use it at school.", budget: 80000, budgetFlex: .12,
    needs: { weights: { portability: 1, lightWeight: .9, batteryLife: .85, simpleControls: .65, priceValue: .55, performance: .4 } }, optimalQuestionCount: 2,
    facts: [
      { key: 'purpose', label: 'Purpose', value: 'School', decisionWeight: 2, revealedAtStart: true },
      { key: 'budget', label: 'Budget', value: 'Around ¥80,000', decisionWeight: 4 },
      { key: 'age', label: 'User', value: '17-year-old daughter', decisionWeight: 1 },
      { key: 'priority', label: 'Priority', value: 'Light & easy to carry', decisionWeight: 5 },
    ],
    questions: [
      { id: 'daniel-priority', text: 'What is most important to her?', response: 'She carries it to school every day, so she wants something light and easy to carry.', reveals: ['priority'], grammarTags: ['WH_QUESTION'], patienceCost: 7 },
      { id: 'daniel-budget', text: "What's your budget?", response: 'Around 80,000 yen would be ideal.', reveals: ['budget'], grammarTags: ['WH_QUESTION'], patienceCost: 7 },
      { id: 'daniel-age', text: 'How old is your daughter?', response: "She's seventeen. She's in her last year of high school.", reveals: ['age'], grammarTags: ['WH_QUESTION'], patienceCost: 8 },
    ],
  },
  {
    id: 'grace', name: 'Grace', age: 68, roleLabel: '日常利用', category: 'earphones', patience: 78,
    openingLine: "I want something for phone calls and music, but I don't like complicated controls.", budget: 25000, budgetFlex: .1,
    needs: { weights: { simpleControls: 1, callQuality: .95, soundQuality: .45, lightWeight: .35, priceValue: .25 } }, optimalQuestionCount: 0,
    facts: [
      { key: 'purpose', label: 'Purpose', value: 'Calls & music', decisionWeight: 4, revealedAtStart: true },
      { key: 'priority', label: 'Priority', value: 'Simple controls', decisionWeight: 5, revealedAtStart: true },
      { key: 'budget', label: 'Budget', value: 'Under ¥25,000', decisionWeight: 1 },
      { key: 'experience', label: 'Experience', value: 'Not used to wireless devices', decisionWeight: 2 },
    ],
    questions: [
      { id: 'grace-experience', text: 'Have you used wireless headphones before?', response: 'Only once. I found all the small buttons a little confusing.', reveals: ['experience'], grammarTags: ['PRESENT_PERFECT'], patienceCost: 7 },
      { id: 'grace-budget', text: 'How much would you like to spend?', response: "I'd like to keep it under 25,000 yen if possible.", reveals: ['budget'], grammarTags: ['WH_QUESTION', 'POLITE_REQUEST'], patienceCost: 8 },
    ],
  },
  {
    id: 'leo', name: 'Leo', age: 29, roleLabel: '動画制作者', category: 'laptop', patience: 88,
    openingLine: 'I edit 4K videos, and my current laptop is too slow.', budget: 125000, budgetFlex: .08,
    needs: { weights: { performance: 1, screenQuality: .85, durability: .5, batteryLife: .35, priceValue: .25 } }, optimalQuestionCount: 1,
    facts: [
      { key: 'purpose', label: 'Purpose', value: '4K video editing', decisionWeight: 5, revealedAtStart: true },
      { key: 'budget', label: 'Budget', value: 'Up to ¥125,000', decisionWeight: 4 },
      { key: 'mobility', label: 'Priority', value: 'Mostly used at a desk', decisionWeight: 2 },
    ],
    questions: [
      { id: 'leo-budget', text: 'How much are you willing to spend?', response: 'I can go up to about 125,000 yen if it makes editing much faster.', reveals: ['budget'], grammarTags: ['WH_QUESTION'], patienceCost: 6 },
      { id: 'leo-mobility', text: 'Do you carry your laptop around often?', response: 'Not really. I mostly use it at my desk, so weight is not a big problem.', reveals: ['mobility'], grammarTags: ['WH_QUESTION'], patienceCost: 8 },
    ],
  },
  {
    id: 'aisha', name: 'Aisha', age: 34, roleLabel: 'ランナー', category: 'smartwatch', patience: 86,
    openingLine: 'I want a watch for running. I train outside almost every day.', budget: 27000, budgetFlex: .12,
    needs: { weights: { healthTracking: 1, waterResistance: .95, lightWeight: .8, batteryLife: .65, priceValue: .45 } }, optimalQuestionCount: 1,
    facts: [
      { key: 'purpose', label: 'Purpose', value: 'Running', decisionWeight: 4, revealedAtStart: true },
      { key: 'weather', label: 'Priority', value: 'Rain-proof', decisionWeight: 4 },
      { key: 'tracking', label: 'Priority 2', value: 'Detailed fitness tracking', decisionWeight: 5 },
      { key: 'budget', label: 'Budget', value: 'Around ¥27,000', decisionWeight: 2 },
    ],
    questions: [
      { id: 'aisha-tracking', text: 'What would you like to track?', response: "I'd like detailed running data, especially heart rate and workout records.", reveals: ['tracking'], grammarTags: ['WH_QUESTION', 'POLITE_REQUEST'], patienceCost: 6 },
      { id: 'aisha-weather', text: 'Do you run even when it rains?', response: 'Yes. I often train in light rain, so I need something I can wear without worrying.', reveals: ['weather'], grammarTags: ['WH_QUESTION', 'CONJUNCTION'], patienceCost: 7 },
      { id: 'aisha-budget', text: "What's your budget?", response: 'Around 27,000 yen.', reveals: ['budget'], grammarTags: ['WH_QUESTION'], patienceCost: 8 },
    ],
  },
  {
    id: 'ken', name: 'Ken', age: 41, roleLabel: '通勤・仕事', category: 'earphones', patience: 80,
    openingLine: 'I use earphones on the train and take a lot of work calls.', budget: 13000, budgetFlex: .1,
    needs: { weights: { callQuality: 1, simpleControls: .8, lightWeight: .55, soundQuality: .45, priceValue: .35 } }, optimalQuestionCount: 1,
    facts: [
      { key: 'purpose', label: 'Purpose', value: 'Commute & work calls', decisionWeight: 5, revealedAtStart: true },
      { key: 'controls', label: 'Priority', value: 'Easy controls during calls', decisionWeight: 4 },
      { key: 'budget', label: 'Budget', value: 'Around ¥13,000', decisionWeight: 2 },
    ],
    questions: [
      { id: 'ken-controls', text: 'What bothers you about your current earphones?', response: 'The controls are awkward during calls. I want something I can operate quickly.', reveals: ['controls'], grammarTags: ['WH_QUESTION'], patienceCost: 6 },
      { id: 'ken-budget', text: 'How much are you looking to spend?', response: 'Around 13,000 yen would be fine.', reveals: ['budget'], grammarTags: ['WH_QUESTION'], patienceCost: 7 },
    ],
  },
  {
    id: 'sofia', name: 'Sofia', age: 22, roleLabel: '大学生', category: 'laptop', patience: 92,
    openingLine: "I'm a university student. I mainly need a laptop for reports and online classes.", budget: 60000, budgetFlex: .08,
    needs: { weights: { priceValue: 1, simpleControls: .75, portability: .65, batteryLife: .55, performance: .3 } }, optimalQuestionCount: 1,
    facts: [
      { key: 'purpose', label: 'Purpose', value: 'Reports & online classes', decisionWeight: 4, revealedAtStart: true },
      { key: 'budget', label: 'Budget', value: 'Under ¥60,000', decisionWeight: 5 },
      { key: 'gaming', label: 'Heavy use', value: 'No gaming or video editing', decisionWeight: 3 },
    ],
    questions: [
      { id: 'sofia-budget', text: 'How much are you looking to spend?', response: "I'd really like to stay under 60,000 yen.", reveals: ['budget'], grammarTags: ['WH_QUESTION', 'POLITE_REQUEST'], patienceCost: 6 },
      { id: 'sofia-gaming', text: 'Will you use it for gaming or video editing?', response: 'No. I mostly write reports, browse the web, and join online classes.', reveals: ['gaming'], grammarTags: ['MODAL'], patienceCost: 7 },
    ],
  },
  {
    id: 'noah', name: 'Noah', age: 37, roleLabel: 'キャンプ好き', category: 'smartwatch', patience: 79,
    openingLine: 'I go camping for several days at a time, and I hate charging things every night.', budget: 32000, budgetFlex: .1,
    needs: { weights: { batteryLife: 1, durability: .85, waterResistance: .7, simpleControls: .45, healthTracking: .35 } }, optimalQuestionCount: 0,
    facts: [
      { key: 'purpose', label: 'Purpose', value: 'Multi-day camping', decisionWeight: 4, revealedAtStart: true },
      { key: 'priority', label: 'Priority', value: 'Battery life', decisionWeight: 5, revealedAtStart: true },
      { key: 'conditions', label: 'Environment', value: 'Outdoor / wet conditions', decisionWeight: 3 },
    ],
    questions: [
      { id: 'noah-conditions', text: 'Do you use it in wet or rough conditions?', response: 'Yes. It may get wet, and I sometimes knock my gear against rocks.', reveals: ['conditions'], grammarTags: ['MODAL'], patienceCost: 7 },
    ],
  },
  {
    id: 'hana', name: 'Hana', age: 52, roleLabel: '出張が多い', category: 'laptop', patience: 83,
    openingLine: 'I travel for work every week and need a laptop that can survive being carried around a lot.', budget: 95000, budgetFlex: .08,
    needs: { weights: { durability: 1, batteryLife: .85, portability: .6, lightWeight: .45, performance: .5 } }, optimalQuestionCount: 1,
    facts: [
      { key: 'purpose', label: 'Purpose', value: 'Frequent business travel', decisionWeight: 4, revealedAtStart: true },
      { key: 'priority', label: 'Priority', value: 'Durability first', decisionWeight: 5, revealedAtStart: true },
      { key: 'battery', label: 'Secondary need', value: 'Long battery life', decisionWeight: 4 },
      { key: 'budget', label: 'Budget', value: 'Under ¥95,000', decisionWeight: 2 },
    ],
    questions: [
      { id: 'hana-battery', text: 'How important is battery life to you?', response: 'Very important. I often work on trains where I cannot charge it.', reveals: ['battery'], grammarTags: ['WH_QUESTION'], patienceCost: 6 },
      { id: 'hana-budget', text: "What's your budget?", response: 'I would prefer to stay under 95,000 yen.', reveals: ['budget'], grammarTags: ['POLITE_REQUEST'], patienceCost: 8 },
    ],
  },
  {
    id: 'oliver', name: 'Oliver', age: 31, roleLabel: '長距離移動', category: 'earphones', patience: 81,
    openingLine: 'I take long flights several times a month, so I need earphones that last a long time.', budget: 15000, budgetFlex: .08,
    needs: { weights: { batteryLife: 1, soundQuality: .7, durability: .6, lightWeight: .45, priceValue: .3 } }, optimalQuestionCount: 1,
    facts: [
      { key: 'purpose', label: 'Purpose', value: 'Long flights', decisionWeight: 4, revealedAtStart: true },
      { key: 'priority', label: 'Priority', value: 'Battery life', decisionWeight: 5, revealedAtStart: true },
      { key: 'sound', label: 'Secondary need', value: 'Good music quality', decisionWeight: 3 },
      { key: 'budget', label: 'Budget', value: 'Under ¥15,000', decisionWeight: 2 },
    ],
    questions: [
      { id: 'oliver-sound', text: 'What do you usually listen to on the plane?', response: 'Mostly music, so I would like decent sound quality as well.', reveals: ['sound'], grammarTags: ['WH_QUESTION', 'POLITE_REQUEST'], patienceCost: 6 },
      { id: 'oliver-budget', text: 'How much are you looking to spend?', response: 'Up to about 15,000 yen.', reveals: ['budget'], grammarTags: ['WH_QUESTION'], patienceCost: 7 },
    ],
  },
]
