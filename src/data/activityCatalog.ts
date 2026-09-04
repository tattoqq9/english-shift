import type { Chapter1Activity } from '../core/chapter1.js'
import { chapter1Activities } from './chapter1.js'
import { chapter2Activities } from './chapter2.js'
import { chapter3Activities } from './chapter3.js'
import { chapter4Activities } from './chapter4.js'
import { chapter5Activities } from './chapter5.js'
import { chapter6Activities } from './chapter6.js'
import { chapter7Activities } from './chapter7.js'
import { chapter8Activities } from './chapter8.js'
import { examActivities } from './postgameActivities.js'

export const allLearningActivities: Chapter1Activity[] = [
  ...chapter1Activities,
  ...chapter2Activities,
  ...chapter3Activities,
  ...chapter4Activities,
  ...chapter5Activities,
  ...chapter6Activities,
  ...chapter7Activities,
  ...chapter8Activities,
  ...examActivities,
]

const activityMap = new Map(allLearningActivities.map((activity) => [activity.id, activity]))

export function learningActivityById(id: string) {
  return activityMap.get(id)
}
