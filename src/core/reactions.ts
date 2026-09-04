export type CustomerEmotion =
  | 'neutral'
  | 'thinking'
  | 'happy'
  | 'confused'
  | 'delighted'
  | 'disappointed'

export type CustomerMotion = 'idle' | 'nod' | 'tilt' | 'pop' | 'shake'

export type CustomerReaction = {
  emotion: CustomerEmotion
  motion: CustomerMotion
}

export function reactionForQuestion(informationGain: number): CustomerReaction {
  if (informationGain >= 4) return { emotion: 'happy', motion: 'nod' }
  if (informationGain >= 2) return { emotion: 'thinking', motion: 'tilt' }
  return { emotion: 'confused', motion: 'shake' }
}

export function reactionForRecommendation(choiceQuality: number): CustomerReaction {
  if (choiceQuality >= 98) return { emotion: 'delighted', motion: 'pop' }
  if (choiceQuality >= 90) return { emotion: 'happy', motion: 'nod' }
  if (choiceQuality >= 75) return { emotion: 'thinking', motion: 'tilt' }
  return { emotion: 'disappointed', motion: 'shake' }
}

export function customerResultLine(choiceQuality: number): string {
  if (choiceQuality >= 98) return "That sounds perfect! It's exactly what I was looking for."
  if (choiceQuality >= 90) return 'That sounds good. I think this will work well for me.'
  if (choiceQuality >= 75) return "I see. That could work, but I'd like to think about it."
  return "I'm not sure that's what I need. I was looking for something a little different."
}
