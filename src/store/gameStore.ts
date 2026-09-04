import { create } from 'zustand'
import { customers } from '../data/customers'
import { products } from '../data/products'
import { eventAfterCustomer, eventMaxPoints as calculateEventMaxPoints, storeEvents, type EventChoiceQuality } from '../data/events'
import { bestProductForCustomer, productsForCustomer, rankProducts } from '../core/catalog'
import { initialRevealedFacts, questionInformationGain } from '../core/information'
import { calculateRecommendationResult } from '../core/scoring'
import type { GrammarTag, RecommendationResult } from '../core/types'
import { reactionForQuestion, reactionForRecommendation, type CustomerEmotion, type CustomerMotion } from '../core/reactions'

export type ConversationMessage = {
  speaker: 'customer' | 'player'
  text: string
}

export type EventHistoryItem = {
  stepId: string
  instruction: string
  choiceId: string
  choiceText: string
  feedback: string
  points: number
  maxPoints: number
  quality: EventChoiceQuality
  grammarTags: GrammarTag[]
}

export type StoreEventResult = {
  points: number
  maxPoints: number
  percent: number
  grade: 'S' | 'A' | 'B' | 'C'
}

type GameState = {
  customerIndex: number
  score: number
  trust: number
  patience: number
  selectedProductId: string | null
  askedQuestionIds: string[]
  revealedFactKeys: string[]
  conversation: ConversationMessage[]
  result: RecommendationResult | null
  customerEmotion: CustomerEmotion
  customerMotion: CustomerMotion
  reactionTick: number
  finished: boolean

  activeEventId: string | null
  eventStepIndex: number
  eventConversation: ConversationMessage[]
  eventPoints: number
  eventMaxPoints: number
  eventHistory: EventHistoryItem[]
  eventResult: StoreEventResult | null
  eventEmotion: CustomerEmotion
  eventMotion: CustomerMotion
  eventReactionTick: number
  completedEventIds: string[]

  selectProduct: (productId: string) => void
  askQuestion: (questionId: string) => void
  recommend: () => void
  nextCustomer: () => void
  chooseEventChoice: (choiceId: string) => void
  finishEvent: () => void
  restart: () => void
}

function makeCustomerState(index: number) {
  const customer = customers[index]
  return {
    patience: customer.patience,
    selectedProductId: null as string | null,
    askedQuestionIds: [] as string[],
    revealedFactKeys: [...initialRevealedFacts(customer)],
    conversation: [{ speaker: 'customer' as const, text: customer.openingLine }],
    result: null as RecommendationResult | null,
    customerEmotion: 'neutral' as CustomerEmotion,
    customerMotion: 'idle' as CustomerMotion,
    reactionTick: 0,
  }
}

function emptyEventState() {
  return {
    activeEventId: null as string | null,
    eventStepIndex: 0,
    eventConversation: [] as ConversationMessage[],
    eventPoints: 0,
    eventMaxPoints: 0,
    eventHistory: [] as EventHistoryItem[],
    eventResult: null as StoreEventResult | null,
    eventEmotion: 'neutral' as CustomerEmotion,
    eventMotion: 'idle' as CustomerMotion,
    eventReactionTick: 0,
  }
}

function reactionForEventChoice(quality: EventChoiceQuality) {
  if (quality === 'best') return { emotion: 'happy' as CustomerEmotion, motion: 'nod' as CustomerMotion }
  if (quality === 'good') return { emotion: 'thinking' as CustomerEmotion, motion: 'tilt' as CustomerMotion }
  return { emotion: 'disappointed' as CustomerEmotion, motion: 'shake' as CustomerMotion }
}


function reactionForEventResult(grade: StoreEventResult['grade']) {
  if (grade === 'S') return { emotion: 'delighted' as CustomerEmotion, motion: 'pop' as CustomerMotion }
  if (grade === 'A') return { emotion: 'happy' as CustomerEmotion, motion: 'nod' as CustomerMotion }
  if (grade === 'B') return { emotion: 'thinking' as CustomerEmotion, motion: 'tilt' as CustomerMotion }
  return { emotion: 'disappointed' as CustomerEmotion, motion: 'shake' as CustomerMotion }
}

function eventGrade(percent: number): StoreEventResult['grade'] {
  if (percent >= 96) return 'S'
  if (percent >= 78) return 'A'
  if (percent >= 55) return 'B'
  return 'C'
}

export const useGameStore = create<GameState>((set, get) => ({
  customerIndex: 0,
  score: 0,
  trust: 50,
  finished: false,
  completedEventIds: [],
  ...makeCustomerState(0),
  ...emptyEventState(),

  selectProduct: (productId) => set({ selectedProductId: productId }),

  askQuestion: (questionId) => {
    const state = get()
    if (state.activeEventId || state.result || state.askedQuestionIds.includes(questionId)) return

    const customer = customers[state.customerIndex]
    const question = customer.questions.find((item) => item.id === questionId)
    if (!question) return

    const revealedBefore = new Set(state.revealedFactKeys)
    const informationGain = questionInformationGain(customer, question, revealedBefore)
    const reaction = reactionForQuestion(informationGain)
    const revealed = new Set(revealedBefore)
    question.reveals.forEach((key) => revealed.add(key))

    set({
      askedQuestionIds: [...state.askedQuestionIds, questionId],
      revealedFactKeys: [...revealed],
      patience: Math.max(0, state.patience - question.patienceCost),
      conversation: [
        ...state.conversation,
        { speaker: 'player', text: question.text },
        { speaker: 'customer', text: question.response },
      ],
      customerEmotion: reaction.emotion,
      customerMotion: reaction.motion,
      reactionTick: state.reactionTick + 1,
    })
  },

  recommend: () => {
    const state = get()
    if (state.activeEventId || !state.selectedProductId || state.result) return

    const customer = customers[state.customerIndex]
    const product = products.find((item) => item.id === state.selectedProductId)
    if (!product) return

    const result = calculateRecommendationResult({
      customer,
      product,
      questionCount: state.askedQuestionIds.length,
      revealedFactKeys: new Set(state.revealedFactKeys),
      bestAvailableScore: rankProducts(customer, products)[0]?.score ?? 0,
    })

    const reaction = reactionForRecommendation(result.choiceQuality)

    set({
      result,
      score: state.score + result.totalPoints,
      trust: Math.max(0, Math.min(100, state.trust + result.trustDelta)),
      customerEmotion: reaction.emotion,
      customerMotion: reaction.motion,
      reactionTick: state.reactionTick + 1,
    })
  },

  nextCustomer: () => {
    const state = get()
    if (state.activeEventId) return

    const scheduledEvent = eventAfterCustomer(state.customerIndex)
    if (scheduledEvent && !state.completedEventIds.includes(scheduledEvent.id)) {
      set({
        activeEventId: scheduledEvent.id,
        eventStepIndex: 0,
        eventConversation: [{ speaker: 'customer', text: scheduledEvent.openingLine }],
        eventPoints: 0,
        eventMaxPoints: calculateEventMaxPoints(scheduledEvent),
        eventHistory: [],
        eventResult: null,
        eventEmotion: 'neutral',
        eventMotion: 'idle',
        eventReactionTick: 0,
      })
      return
    }

    const nextIndex = state.customerIndex + 1
    if (nextIndex >= customers.length) {
      set({ finished: true })
      return
    }
    set({ customerIndex: nextIndex, ...makeCustomerState(nextIndex) })
  },

  chooseEventChoice: (choiceId) => {
    const state = get()
    if (!state.activeEventId || state.eventResult) return

    const event = storeEvents.find((item) => item.id === state.activeEventId)
    if (!event) return
    const step = event.steps[state.eventStepIndex]
    if (!step) return
    const choice = step.choices.find((item) => item.id === choiceId)
    if (!choice) return

    const maxForStep = Math.max(...step.choices.map((item) => item.points))
    const nextPoints = state.eventPoints + choice.points
    const nextHistory: EventHistoryItem[] = [
      ...state.eventHistory,
      {
        stepId: step.id,
        instruction: step.instruction,
        choiceId: choice.id,
        choiceText: choice.text,
        feedback: choice.feedback,
        points: choice.points,
        maxPoints: maxForStep,
        quality: choice.quality,
        grammarTags: choice.grammarTags,
      },
    ]
    const choiceReaction = reactionForEventChoice(choice.quality)
    const nextStepIndex = state.eventStepIndex + 1
    const completed = nextStepIndex >= event.steps.length
    const percent = state.eventMaxPoints > 0 ? (nextPoints / state.eventMaxPoints) * 100 : 0
    const grade = eventGrade(percent)
    const finalReaction = completed ? reactionForEventResult(grade) : choiceReaction

    set({
      eventConversation: [
        ...state.eventConversation,
        { speaker: 'player', text: choice.text },
        { speaker: 'customer', text: choice.response },
      ],
      eventPoints: nextPoints,
      eventHistory: nextHistory,
      eventStepIndex: completed ? state.eventStepIndex : nextStepIndex,
      eventResult: completed
        ? { points: nextPoints, maxPoints: state.eventMaxPoints, percent, grade }
        : null,
      score: state.score + choice.points,
      trust: Math.max(0, Math.min(100, state.trust + choice.trustDelta)),
      eventEmotion: finalReaction.emotion,
      eventMotion: finalReaction.motion,
      eventReactionTick: state.eventReactionTick + 1,
    })
  },

  finishEvent: () => {
    const state = get()
    if (!state.activeEventId || !state.eventResult) return

    const completedEventIds = state.completedEventIds.includes(state.activeEventId)
      ? state.completedEventIds
      : [...state.completedEventIds, state.activeEventId]
    const nextIndex = state.customerIndex + 1

    if (nextIndex >= customers.length) {
      set({
        completedEventIds,
        finished: true,
        ...emptyEventState(),
      })
      return
    }

    set({
      completedEventIds,
      customerIndex: nextIndex,
      ...makeCustomerState(nextIndex),
      ...emptyEventState(),
    })
  },

  restart: () => set({
    customerIndex: 0,
    score: 0,
    trust: 50,
    finished: false,
    completedEventIds: [],
    ...makeCustomerState(0),
    ...emptyEventState(),
  }),
}))

export function currentCustomer() {
  return customers[useGameStore.getState().customerIndex]
}

export function currentProducts() {
  return productsForCustomer(currentCustomer(), products)
}

export function currentBestProduct() {
  return bestProductForCustomer(currentCustomer(), products)
}

export function currentStoreEvent() {
  const id = useGameStore.getState().activeEventId
  return id ? storeEvents.find((event) => event.id === id) : undefined
}
