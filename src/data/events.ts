import type { GrammarTag } from '../core/types.js'

export type StoreEventType = 'RETURN' | 'STOCKOUT' | 'COMPLAINT'
export type EventChoiceQuality = 'best' | 'good' | 'poor'

export interface EventChoice {
  id: string
  text: string
  response: string
  feedback: string
  points: number
  trustDelta: number
  quality: EventChoiceQuality
  grammarTags: GrammarTag[]
}

export interface EventStep {
  id: string
  instruction: string
  choices: EventChoice[]
}

export interface StoreEvent {
  id: string
  type: StoreEventType
  title: string
  subtitle: string
  customerId: string
  customerName: string
  roleLabel: string
  openingLine: string
  triggerAfterCustomerIndex: number
  steps: EventStep[]
  grammarFocus: GrammarTag[]
}

export const storeEvents: StoreEvent[] = [
  {
    id: 'return-headphones',
    type: 'RETURN',
    title: 'Return Trouble',
    subtitle: 'A customer comes back with a product that stopped working.',
    customerId: 'riley-return',
    customerName: 'Riley',
    roleLabel: '返品対応',
    openingLine: 'I bought these headphones yesterday, but the left side stopped working this morning.',
    triggerAfterCustomerIndex: 1,
    grammarFocus: ['PRESENT_PERFECT', 'POLITE_REQUEST', 'PAST_SIMPLE', 'CONJUNCTION'],
    steps: [
      {
        id: 'return-investigate',
        instruction: 'まず状況を確認してください。',
        choices: [
          {
            id: 'return-investigate-best',
            text: "I'm sorry about that. Have you tried reconnecting them?",
            response: "Yes, I have. I reconnected them twice, but the left side still doesn't work.",
            feedback: '謝意を示しつつ、現在完了で「これまで試したこと」を確認できています。',
            points: 25,
            trustDelta: 5,
            quality: 'best',
            grammarTags: ['PRESENT_PERFECT', 'POLITE_REQUEST'],
          },
          {
            id: 'return-investigate-good',
            text: 'When did the problem start?',
            response: 'This morning. It was working normally last night.',
            feedback: '故障時点を確認できています。原因切り分けとして有効です。',
            points: 18,
            trustDelta: 2,
            quality: 'good',
            grammarTags: ['WH_QUESTION', 'PAST_SIMPLE'],
          },
          {
            id: 'return-investigate-poor',
            text: 'You should buy a new pair.',
            response: 'But I only bought these yesterday. I was hoping you could help me with this pair.',
            feedback: '原因や保証条件を確認する前に買い替えを勧めてしまっています。',
            points: 0,
            trustDelta: -8,
            quality: 'poor',
            grammarTags: ['MODAL'],
          },
        ],
      },
      {
        id: 'return-receipt',
        instruction: '返品・交換条件を確認してください。',
        choices: [
          {
            id: 'return-receipt-best',
            text: 'Do you happen to have the receipt with you?',
            response: 'Yes, I do. Here it is.',
            feedback: '直接的すぎない丁寧な確認で、必要な証拠を取得できました。',
            points: 25,
            trustDelta: 4,
            quality: 'best',
            grammarTags: ['POLITE_REQUEST'],
          },
          {
            id: 'return-receipt-good',
            text: 'Can I see your receipt?',
            response: 'Sure. I have it right here.',
            feedback: '十分自然で実用的な確認です。',
            points: 20,
            trustDelta: 2,
            quality: 'good',
            grammarTags: ['MODAL'],
          },
          {
            id: 'return-receipt-poor',
            text: 'No receipt, no return.',
            response: "I do have the receipt. You didn't need to say it like that.",
            feedback: '条件を確認する前に断定し、接客態度でもTrustを落としています。',
            points: 0,
            trustDelta: -9,
            quality: 'poor',
            grammarTags: [],
          },
        ],
      },
      {
        id: 'return-resolution',
        instruction: '最後に解決策を提案してください。',
        choices: [
          {
            id: 'return-resolution-best',
            text: 'Since you bought them yesterday, we can replace them after a quick check.',
            response: 'That would be great. Thank you for helping me.',
            feedback: '理由と解決策を接続詞で明確につなげています。',
            points: 25,
            trustDelta: 6,
            quality: 'best',
            grammarTags: ['CONJUNCTION', 'MODAL'],
          },
          {
            id: 'return-resolution-good',
            text: 'We can probably exchange them for another pair.',
            response: 'Okay, that works for me.',
            feedback: '解決策は適切ですが、条件や次の手順を少し足すとさらに良いです。',
            points: 18,
            trustDelta: 3,
            quality: 'good',
            grammarTags: ['MODAL'],
          },
          {
            id: 'return-resolution-poor',
            text: "There's nothing I can do.",
            response: "Really? I bought them here yesterday, and I have the receipt.",
            feedback: '確認済みの情報を活用せず、解決可能なケースを拒否しています。',
            points: 0,
            trustDelta: -12,
            quality: 'poor',
            grammarTags: [],
          },
        ],
      },
    ],
  },
  {
    id: 'stockout-laptop',
    type: 'STOCKOUT',
    title: 'Out of Stock',
    subtitle: 'The exact model the customer wants is unavailable today.',
    customerId: 'emma-stockout',
    customerName: 'Emma',
    roleLabel: '在庫切れ対応',
    openingLine: "I'd like the SchoolBook Air, please. I need it for a class project.",
    triggerAfterCustomerIndex: 4,
    grammarFocus: ['POLITE_REQUEST', 'WH_QUESTION', 'COMPARATIVE', 'CONDITIONAL'],
    steps: [
      {
        id: 'stockout-inform',
        instruction: '在庫切れを伝えてください。',
        choices: [
          {
            id: 'stockout-inform-best',
            text: "I'm sorry, but that model is currently out of stock.",
            response: 'Oh, I see. Do you know when it will be available again?',
            feedback: '謝罪と事実を簡潔に伝えています。',
            points: 25,
            trustDelta: 4,
            quality: 'best',
            grammarTags: ['POLITE_REQUEST'],
          },
          {
            id: 'stockout-inform-good',
            text: "We don't have that model today.",
            response: 'Okay. Is there another option?',
            feedback: '意味は十分通じますが、ワンクッションあるとより接客らしくなります。',
            points: 18,
            trustDelta: 1,
            quality: 'good',
            grammarTags: [],
          },
          {
            id: 'stockout-inform-poor',
            text: 'Sold out. Pick something else.',
            response: "That's a little abrupt. I wanted that model for a reason.",
            feedback: '情報は伝わりますが、命令的でTrustを大きく損ないます。',
            points: 0,
            trustDelta: -10,
            quality: 'poor',
            grammarTags: [],
          },
        ],
      },
      {
        id: 'stockout-need',
        instruction: '代替案を出す前に、緊急度を確認してください。',
        choices: [
          {
            id: 'stockout-need-best',
            text: 'When do you need the laptop?',
            response: 'I need it by tomorrow evening. My presentation is the day after tomorrow.',
            feedback: '代替商品か入荷待ちかを判断するための重要情報を取得しました。',
            points: 25,
            trustDelta: 4,
            quality: 'best',
            grammarTags: ['WH_QUESTION'],
          },
          {
            id: 'stockout-need-good',
            text: 'Would you like to wait for the next shipment?',
            response: "Maybe, but I need the laptop very soon. I'm not sure I can wait.",
            feedback: '選択肢を提示できていますが、先に必要日を聞く方が効率的です。',
            points: 17,
            trustDelta: 2,
            quality: 'good',
            grammarTags: ['POLITE_REQUEST'],
          },
          {
            id: 'stockout-need-poor',
            text: 'Can you come back next week?',
            response: "Next week is too late. I need it for a presentation this week.",
            feedback: '客の期限を確認せずに店側の都合を提案しています。',
            points: 3,
            trustDelta: -5,
            quality: 'poor',
            grammarTags: ['MODAL'],
          },
        ],
      },
      {
        id: 'stockout-alternative',
        instruction: '客の期限を踏まえて代替案を提案してください。',
        choices: [
          {
            id: 'stockout-alternative-best',
            text: 'If you need it by tomorrow, I can show you a similar model that is slightly heavier but within your budget.',
            response: "Yes, please. If it's similar and within my budget, I'd like to see it.",
            feedback: 'if条件と比較級を使い、客の制約に沿った代替案を提示しています。',
            points: 25,
            trustDelta: 6,
            quality: 'best',
            grammarTags: ['CONDITIONAL', 'COMPARATIVE', 'POLITE_REQUEST'],
          },
          {
            id: 'stockout-alternative-good',
            text: 'I can show you another laptop at a similar price.',
            response: 'Sure. What is different about it?',
            feedback: '代替案として有効です。差分まで先に説明できるとさらに良いです。',
            points: 18,
            trustDelta: 3,
            quality: 'good',
            grammarTags: ['MODAL', 'COMPARATIVE'],
          },
          {
            id: 'stockout-alternative-poor',
            text: 'This more expensive model is better, so you should buy it.',
            response: "I don't want to spend that much. I just need something for school.",
            feedback: '客の予算・用途より高価格商品を優先してしまっています。',
            points: 0,
            trustDelta: -10,
            quality: 'poor',
            grammarTags: ['COMPARATIVE', 'MODAL'],
          },
        ],
      },
    ],
  },
  {
    id: 'delivery-complaint',
    type: 'COMPLAINT',
    title: 'Delivery Complaint',
    subtitle: 'An angry customer asks why a delivery has not arrived.',
    customerId: 'victor-complaint',
    customerName: 'Victor',
    roleLabel: 'クレーム対応',
    openingLine: "I've been waiting for my delivery for five days, and nobody has told me what happened.",
    triggerAfterCustomerIndex: 7,
    grammarFocus: ['PRESENT_PERFECT_CONTINUOUS', 'INDIRECT_QUESTION', 'PASSIVE', 'CONDITIONAL'],
    steps: [
      {
        id: 'complaint-first-response',
        instruction: 'まず最初の一言を選んでください。',
        choices: [
          {
            id: 'complaint-first-best',
            text: "I'm sorry you've had to wait. Let me check your order right away.",
            response: 'Thank you. I just want to know where it is.',
            feedback: '相手の不満を受け止め、すぐ調査する意思を示しています。',
            points: 25,
            trustDelta: 6,
            quality: 'best',
            grammarTags: ['PRESENT_PERFECT', 'POLITE_REQUEST'],
          },
          {
            id: 'complaint-first-good',
            text: 'Let me check the delivery status for you.',
            response: 'Okay. Please check it.',
            feedback: '実務上は有効ですが、最初に謝意を示すとより良いです。',
            points: 18,
            trustDelta: 2,
            quality: 'good',
            grammarTags: ['POLITE_REQUEST'],
          },
          {
            id: 'complaint-first-poor',
            text: "It's probably the delivery company's fault.",
            response: "I ordered it from your store. I need you to help me figure this out.",
            feedback: '調査前に責任転嫁してしまい、Trustを大きく落とします。',
            points: 0,
            trustDelta: -12,
            quality: 'poor',
            grammarTags: [],
          },
        ],
      },
      {
        id: 'complaint-clarify',
        instruction: '配送予定日を丁寧に確認してください。',
        choices: [
          {
            id: 'complaint-clarify-best',
            text: 'Could you tell me when it was supposed to arrive?',
            response: 'It was supposed to arrive three days ago.',
            feedback: '間接疑問を使った丁寧な確認です。',
            points: 25,
            trustDelta: 4,
            quality: 'best',
            grammarTags: ['INDIRECT_QUESTION', 'POLITE_REQUEST', 'PASSIVE'],
          },
          {
            id: 'complaint-clarify-good',
            text: 'When was it supposed to arrive?',
            response: 'Three days ago.',
            feedback: '自然で正確です。クレーム対応ではより丁寧な形も選べます。',
            points: 20,
            trustDelta: 2,
            quality: 'good',
            grammarTags: ['WH_QUESTION', 'PASSIVE'],
          },
          {
            id: 'complaint-clarify-poor',
            text: 'Are you sure it is late?',
            response: 'Yes. The confirmation email says it should have arrived three days ago.',
            feedback: '相手の申告を疑う形になっており、必要情報も十分に取れていません。',
            points: 3,
            trustDelta: -6,
            quality: 'poor',
            grammarTags: ['MODAL_PERFECT'],
          },
        ],
      },
      {
        id: 'complaint-resolution',
        instruction: '調査結果を踏まえて解決策を伝えてください。',
        choices: [
          {
            id: 'complaint-resolution-best',
            text: "It appears to have been delayed. If it doesn't arrive tomorrow, we'll send a replacement at no extra cost.",
            response: 'That sounds fair. Thank you for giving me a clear plan.',
            feedback: '受動態と条件文を使い、現状と次の対応を明確にしています。',
            points: 25,
            trustDelta: 7,
            quality: 'best',
            grammarTags: ['PASSIVE', 'CONDITIONAL', 'MODAL_PERFECT'],
          },
          {
            id: 'complaint-resolution-good',
            text: "It's delayed, but we can send another one if necessary.",
            response: 'Okay. Please let me know what happens tomorrow.',
            feedback: '解決策はありますが、条件と期限を明確にすると安心感が増します。',
            points: 18,
            trustDelta: 3,
            quality: 'good',
            grammarTags: ['PASSIVE', 'CONDITIONAL', 'MODAL'],
          },
          {
            id: 'complaint-resolution-poor',
            text: 'Please wait a few more days.',
            response: "I've already been waiting for five days. I need a real solution.",
            feedback: '客の不満の中心を解決せず、追加の待機だけを要求しています。',
            points: 0,
            trustDelta: -12,
            quality: 'poor',
            grammarTags: ['POLITE_REQUEST'],
          },
        ],
      },
    ],
  },
]

export function eventAfterCustomer(customerIndex: number): StoreEvent | undefined {
  return storeEvents.find((event) => event.triggerAfterCustomerIndex === customerIndex)
}

export function eventMaxPoints(event: StoreEvent): number {
  return event.steps.reduce((sum, step) => sum + Math.max(...step.choices.map((choice) => choice.points)), 0)
}
