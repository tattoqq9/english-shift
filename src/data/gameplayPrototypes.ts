export type GameplayPrototypeId =
  | 'recommendation'
  | 'information-hunt'
  | 'troubleshooting'
  | 'staff-coordination'
  | 'incident-investigation'

export interface GameplayPrototypeSummary {
  id: GameplayPrototypeId
  title: string
  shortTitle: string
  subtitle: string
  skill: string
  icon: string
}

export const gameplayPrototypeSummaries: GameplayPrototypeSummary[] = [
  {
    id: 'recommendation',
    title: 'Recommendation',
    shortTitle: 'Recommend',
    subtitle: '必要な情報だけを聞き、客に最適な商品を選ぶ。',
    skill: 'Needs → Questions → Product',
    icon: '★',
  },
  {
    id: 'information-hunt',
    title: 'Information Hunt',
    shortTitle: 'Find',
    subtitle: '限られた質問回数で、客が探している商品を特定する。',
    skill: 'Question efficiency',
    icon: '?',
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    shortTitle: 'Fix',
    subtitle: '症状を聞き、原因候補を消してから対処法を選ぶ。',
    skill: 'Diagnosis',
    icon: '⚙',
  },
  {
    id: 'staff-coordination',
    title: 'Staff Coordination',
    shortTitle: 'Relay',
    subtitle: '客から得た情報を整理し、必要な内容だけを同僚へ引き継ぐ。',
    skill: 'Information relay',
    icon: '↗',
  },
  {
    id: 'incident-investigation',
    title: 'Incident Investigation',
    shortTitle: 'Investigate',
    subtitle: '限られた聞き込みから証言を集め、出来事を推理する。',
    skill: 'Evidence → Inference',
    icon: '⌕',
  },
]

export const recommendationPrototype = {
  customer: {
    id: 'mia',
    name: 'Mia',
    roleLabel: '放課後の買い物',
    opening: "I need a drink for my younger brother after soccer practice. He doesn't like anything too sweet.",
  },
  maxQuestions: 2,
  questions: [
    {
      id: 'rec-budget',
      text: 'How much would you like to spend?',
      response: 'Around 300 yen is fine.',
      reveals: 'Budget: around ¥300',
      value: 2,
    },
    {
      id: 'rec-purpose',
      text: 'Is it for after exercise?',
      response: 'Yes. He drinks it right after soccer practice.',
      reveals: 'Use: after exercise',
      value: 1,
    },
    {
      id: 'rec-sweetness',
      text: 'Does he prefer something with less sugar?',
      response: "Yes, definitely. He doesn't like very sweet drinks.",
      reveals: 'Priority: not too sweet',
      value: 4,
    },
    {
      id: 'rec-age',
      text: 'How old is your brother?',
      response: "He's fourteen.",
      reveals: 'User: 14 years old',
      value: 1,
    },
  ],
  products: [
    { id: 'rec-water', name: 'Mineral Water', price: '¥140', note: 'No sugar · no electrolytes', score: 77 },
    { id: 'rec-sports', name: 'Light Sports Water', price: '¥180', note: 'Low sugar · electrolytes', score: 100 },
    { id: 'rec-energy', name: 'Energy Charge', price: '¥260', note: 'Very sweet · high caffeine', score: 30 },
    { id: 'rec-soda', name: 'Orange Soda', price: '¥170', note: 'Sweet · carbonated', score: 42 },
  ],
}

export const informationHuntPrototype = {
  customer: {
    id: 'grace',
    name: 'Grace',
    roleLabel: '昨日見た商品を探している',
    opening: 'I saw a small phone charger here yesterday. It had two ports, but I forgot the name.',
  },
  maxQuestions: 2,
  questions: [
    { id: 'hunt-color', text: 'What color was it?', response: 'It was black.', revealKey: 'Black', value: 2 },
    { id: 'hunt-port', text: 'Were both ports USB-C?', response: 'Yes, both of them were USB-C.', revealKey: '2× USB-C', value: 5 },
    { id: 'hunt-price', text: 'Do you remember the price?', response: 'I think it was around 2,500 yen.', revealKey: 'Around ¥2,500', value: 4 },
    { id: 'hunt-cable', text: 'Did it come with a cable?', response: "No, I don't think it did.", revealKey: 'No cable', value: 2 },
  ],
  candidates: [
    { id: 'hunt-a', name: 'Pocket Dual C', details: 'Black · 2× USB-C · ¥2,480 · no cable', correct: true },
    { id: 'hunt-b', name: 'Quick C+A', details: 'Black · USB-C + USB-A · ¥2,380 · no cable', correct: false },
    { id: 'hunt-c', name: 'Mini Dual C', details: 'White · 2× USB-C · ¥2,580 · cable included', correct: false },
    { id: 'hunt-d', name: 'Travel Duo', details: 'Black · 2× USB-C · ¥3,980 · cable included', correct: false },
  ],
}

export const troubleshootingPrototype = {
  customer: {
    id: 'daniel',
    name: 'Daniel',
    roleLabel: '接続トラブル',
    opening: "My wireless earphones won't connect to my phone anymore.",
  },
  maxQuestions: 2,
  causes: [
    { id: 'battery', label: 'Battery is empty' },
    { id: 'bluetooth', label: 'Bluetooth is off' },
    { id: 'pairing', label: 'Old pairing is blocking connection' },
    { id: 'hardware', label: 'Hardware failure' },
  ],
  questions: [
    {
      id: 'fix-light',
      text: 'Do the earphones turn on normally?',
      response: 'Yes. The light comes on, and the battery is almost full.',
      eliminates: ['battery'],
      points: 12,
    },
    {
      id: 'fix-bluetooth',
      text: 'Is Bluetooth turned on?',
      response: 'Yes. My phone can see other Bluetooth devices.',
      eliminates: ['bluetooth'],
      points: 12,
    },
    {
      id: 'fix-history',
      text: 'Have you connected them to another phone recently?',
      response: 'Yes. I used them with my work phone yesterday.',
      eliminates: ['hardware'],
      confirms: 'pairing',
      points: 22,
    },
    {
      id: 'fix-drop',
      text: 'Did you drop them?',
      response: "No, I haven't dropped them.",
      eliminates: ['hardware'],
      points: 7,
    },
  ],
  solutions: [
    { id: 'fix-charge', text: 'Charge the earphones for an hour.', cause: 'battery' },
    { id: 'fix-enable', text: 'Turn Bluetooth on.', cause: 'bluetooth' },
    { id: 'fix-repair', text: 'Forget the old connection and pair them again.', cause: 'pairing' },
    { id: 'fix-return', text: 'Replace the earphones immediately.', cause: 'hardware' },
  ],
  correctCause: 'pairing',
}

export const staffCoordinationPrototype = {
  customer: {
    id: 'hana',
    name: 'Hana',
    roleLabel: '修理担当への引き継ぎ',
    opening: 'I bought this tablet on Monday. The screen flickers when the brightness is below 30%. I need it for work tomorrow, and I still have the receipt.',
  },
  maxFacts: 3,
  facts: [
    { id: 'relay-date', text: 'Bought on Monday', essential: false },
    { id: 'relay-symptom', text: 'Screen flickers below 30% brightness', essential: true },
    { id: 'relay-deadline', text: 'Needs it for work tomorrow', essential: true },
    { id: 'relay-receipt', text: 'Has the receipt', essential: true },
    { id: 'relay-color', text: 'Tablet is dark gray', essential: false },
    { id: 'relay-store', text: 'Customer is standing at this counter', essential: false },
  ],
  handoffOptions: [
    {
      id: 'relay-best',
      text: 'She says the screen flickers at low brightness, she needs the tablet tomorrow, and she has the receipt.',
      quality: 'best' as const,
      points: 30,
    },
    {
      id: 'relay-good',
      text: 'She bought a tablet on Monday and says there is a screen problem.',
      quality: 'good' as const,
      points: 18,
    },
    {
      id: 'relay-poor',
      text: 'A customer has a tablet. Can you deal with it?',
      quality: 'poor' as const,
      points: 4,
    },
  ],
}

export const incidentInvestigationPrototype = {
  title: 'The Missing Shopping Bag',
  opening: 'A customer says one shopping bag disappeared from the pickup counter. Interview two people, then decide what most likely happened.',
  maxInterviews: 2,
  witnesses: [
    {
      id: 'witness-customer',
      name: 'Customer',
      role: 'Bag owner',
      statement: 'I put my bag beside the counter at 6:10. When I came back a few minutes later, it was gone.',
      evidence: '6:10 · Bag left beside counter',
      value: 2,
    },
    {
      id: 'witness-staff',
      name: 'Alex',
      role: 'Staff',
      statement: 'At about 6:12, I saw a man pick up two very similar shopping bags. He looked surprised when he noticed both handles in his hand.',
      evidence: '6:12 · Man picked up two similar bags',
      value: 5,
    },
    {
      id: 'witness-security',
      name: 'Security',
      role: 'Entrance desk',
      statement: 'A man came back at 6:15 and gave us a bag. He said he had taken it by mistake.',
      evidence: '6:15 · Bag returned to security',
      value: 5,
    },
    {
      id: 'witness-cashier',
      name: 'Cashier',
      role: 'Register',
      statement: 'The store was busy around six o’clock. I did not see what happened at the pickup counter.',
      evidence: 'No direct evidence',
      value: 0,
    },
  ],
  conclusions: [
    { id: 'incident-mistake', text: 'A customer probably took the similar bag by mistake and returned it.', correct: true },
    { id: 'incident-theft', text: 'Someone intentionally stole the bag and escaped.', correct: false },
    { id: 'incident-staff', text: 'A staff member moved the bag to another counter.', correct: false },
  ],
}
