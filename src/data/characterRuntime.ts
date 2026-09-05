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
import { japaneseByEnglish } from './japaneseSupport.js'
import {
  activityCharacterPresentation,
  characterProfile,
  CHARACTER_ASSIGNMENT_EXPECTED,
} from './characterRegistry.js'

const allCharacterRuntimeActivities: Chapter1Activity[] = [
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

const byId = new Map(allCharacterRuntimeActivities.map((activity) => [activity.id, activity]))
let copyApplied = false
let applied = false

function sceneId(kind: 'queue' | 'exam' | 'incident') {
  return `scene-${kind}`
}

function requireActivity(id: string) {
  const activity = byId.get(id)
  if (!activity) throw new Error(`Character content rewrite activity not found: ${id}`)
  return activity
}

function registerJapanese(english: string, japanese: string) {
  japaneseByEnglish[english] = japanese
}

/**
 * v0.5.1 Phase 4 synchronized copy pass.
 *
 * These 12 activities were intentionally held back during the character
 * foundation pass because their original copy implied a different age,
 * occupation, experience level, or pronoun. Rewrites preserve grammar targets,
 * correct-answer IDs, scoring, and saved-data IDs while aligning the situation
 * with the final recurring cast.
 */
export function applyCharacterContentRewrites() {
  if (copyApplied) return

  {
    const activity = requireActivity('d13-trail-experience')
    activity.customer.roleLabel = 'ロードラン経験はあるがトレイルは初めて'
    activity.customer.opening = 'I run on roads regularly, but I’m going trail running next month and I’ve never bought trail shoes before.'
    registerJapanese(activity.customer.opening, '普段はロードを走っていますが、来月初めてトレイルランをする予定で、トレイルシューズを買ったことはありません。')
  }

  {
    const activity = requireActivity('d13-ever-used')
    activity.customer.roleLabel = 'キャンプ経験はあるがポータブルバーナーは初めて'
    activity.customer.opening = 'I camp fairly often, but I usually cook at sites with shared facilities. I’ve never owned a camping stove.'
    registerJapanese(activity.customer.opening, 'キャンプにはよく行きますが、普段は共同設備のある場所で料理しています。キャンプ用バーナーを自分で持ったことはありません。')
  }

  {
    const activity = requireActivity('d17-if-i-were-you')
    activity.customer.roleLabel = '春夏キャンプ経験はあるが冬キャンプは初めて'
    activity.customer.opening = 'I camp a lot in spring and summer, but I’ve never camped in winter. I’m thinking about using my thin summer sleeping bag.'
    registerJapanese(activity.customer.opening, '春と夏はよくキャンプしますが、冬キャンプは一度もありません。薄い夏用の寝袋を使おうかと思っています。')
  }

  {
    const activity = requireActivity('d18-expedition-kit')
    activity.objective = '経験・天候・用途から重要な2条件を集め、季節に合う1泊装備セットを選ぶ。'
    activity.customer.roleLabel = '寒い季節の1泊ハイキングを計画中'
    activity.customer.opening = 'I’ve done several overnight hikes in warm weather, but this is my first one in a colder season.'
    activity.bestRoute = ['夜間の最低気温を聞く', '雨の可能性を聞く', '経験を踏まえて季節条件に合う安全なセットを選ぶ']
    if (activity.kind === 'information-hunt') {
      const target = activity.candidates.find((candidate) => candidate.id === 'd18k-a')
      if (target) {
        target.name = 'Reliable Overnight Kit'
        target.details = '10°C-rated bag + rain shell + simple 2-person tent · easy, reliable setup'
      }
    }
    registerJapanese(activity.customer.opening, '暖かい時期の1泊ハイキングは何度か経験していますが、寒い季節に行くのは今回が初めてです。')
  }

  {
    const activity = requireActivity('d20-laptop-that')
    activity.customer.roleLabel = '撮影現場へ持ち出すサブPCを探している'
    activity.customer.opening = 'I edit most projects on my desktop, but I need a laptop that is light enough to carry to shoots and that can run two external displays at my desk.'
    registerJapanese(activity.customer.opening, '編集作業の多くはデスクトップで行いますが、撮影現場へ持ち運べる軽さがあり、デスクでは外部ディスプレイを2台使えるノートPCが必要です。')
  }

  {
    const activity = requireActivity('d20-device-which')
    activity.customer.roleLabel = '撮影用機器をまとめて充電したい'
    activity.customer.opening = 'On shoots I carry a laptop and a phone, so I want a charger that can charge both at the same time.'
    registerJapanese(activity.customer.opening, '撮影ではノートPCとスマートフォンを持ち歩くので、両方を同時に充電できる充電器が欲しいです。')
  }

  {
    const activity = requireActivity('d21-indirect-hunt')
    activity.objective = '丁寧な質問を2つ使い、オンライン打ち合わせ時のPC利用状況から適切なモデルを特定する。'
    activity.customer.roleLabel = 'オンライン打ち合わせ中にPCが重くなる'
    activity.customer.opening = 'My current laptop gets slow during online client review calls, so I’m thinking about replacing it.'
    if (activity.kind === 'information-hunt') {
      const apps = activity.questions.find((question) => question.id === 'd21h-apps')
      if (apps) apps.text = 'Could you tell me which apps you usually have open during client calls?'
      const target = activity.candidates.find((candidate) => candidate.id === 'd21h-a')
      if (target) target.name = 'Work 16'
    }
    registerJapanese(activity.customer.opening, 'オンラインでクライアントとレビュー打ち合わせをしていると、今のノートPCが重くなるので買い替えを考えています。')
    registerJapanese('Could you tell me which apps you usually have open during client calls?', 'クライアントとの通話中、普段どのアプリを開いているか教えていただけますか？')
  }

  {
    const activity = requireActivity('d22-how-to-connect')
    activity.customer.roleLabel = '撮影先で使う新しいスピーカーの接続方法を確認'
    activity.customer.opening = 'I use Bluetooth gear for shoots, but this new speaker pairs differently. I’m not sure how to connect it to my phone.'
    registerJapanese(activity.customer.opening, '撮影ではBluetooth機器を使っていますが、この新しいスピーカーは接続方法が少し違います。スマートフォンへのつなぎ方が分かりません。')
  }

  {
    const activity = requireActivity('d24-repair-handoff')
    activity.customer.roleLabel = '撮影用タブレットの修理を相談している'
    activity.customer.opening = 'I use this tablet on shoots. The screen flickers below 30% brightness, I need it for a shoot tomorrow, and I have the receipt with me.'
    if (activity.kind === 'staff-coordination') {
      const deadline = activity.facts.find((fact) => fact.id === 'd24f-deadline')
      if (deadline) deadline.text = 'Needs it for a shoot tomorrow'
      const best = activity.handoffOptions.find((choice) => choice.id === 'd24h-best')
      if (best) best.text = 'He says the screen flickers below 30% brightness, he needs the tablet tomorrow, and he has the receipt.'
      const good = activity.handoffOptions.find((choice) => choice.id === 'd24h-good')
      if (good) good.text = 'He bought the tablet last week and says there is a screen problem.'
    }
    registerJapanese(activity.customer.opening, 'このタブレットは撮影で使っています。画面の明るさを30%未満にするとちらつき、明日の撮影で必要です。レシートも持っています。')
    registerJapanese('Needs it for a shoot tomorrow', '明日の撮影で必要')
    registerJapanese('He says the screen flickers below 30% brightness, he needs the tablet tomorrow, and he has the receipt.', '画面の明るさが30%未満だとちらつき、明日タブレットが必要で、レシートも持っているとのことです。')
    registerJapanese('He bought the tablet last week and says there is a screen problem.', '先週タブレットを購入し、画面に問題があるとのことです。')
  }

  {
    const activity = requireActivity('d26-party-order')
    activity.customer.roleLabel = '6人のstudy group用に軽食を注文したい'
    activity.customer.opening = 'I need some snacks and drinks for a study group meeting.'
    registerJapanese(activity.customer.opening, '勉強会用に軽食と飲み物が必要です。')
  }

  {
    const activity = requireActivity('d38-giftwrap-incident')
    activity.customer.roleLabel = '娘への贈り物が包装されないまま渡された'
    activity.customer.opening = 'I paid for gift wrapping for a present for my daughter, but when I picked it up, it was still in the regular shopping bag.'
    registerJapanese(activity.customer.opening, '娘への贈り物としてギフト包装代を支払ったのですが、受け取ったときは普通のショッピングバッグのままでした。')
  }

  {
    const activity = requireActivity('d46-vip-exception')
    activity.customer.roleLabel = 'フライト遅延で閉店後受取の相談をしている'
    activity.customer.opening = 'My flight lands later than expected, and I may reach the store after closing. My assistant says VIP members sometimes receive special pickup arrangements. Could you keep the store open thirty minutes late so I can collect my purchase?'
    registerJapanese(activity.customer.opening, '飛行機の到着が予定より遅く、閉店後に着くかもしれません。アシスタントから、VIP会員には特別な受取対応がある場合もあると聞きました。商品を受け取るため、30分だけ閉店を遅らせてもらえますか？')
  }

  copyApplied = true
}

/**
 * Applies final v0.5.1 character/scene presentation after the synchronized copy
 * rewrite. This remains an in-memory presentation layer, so activity IDs,
 * scoring, Mastery, Weakness Review, and storage schemas remain unchanged.
 */
export function applyCharacterRuntime() {
  if (applied) return
  if (allCharacterRuntimeActivities.length !== CHARACTER_ASSIGNMENT_EXPECTED.total) {
    throw new Error(`Character runtime expected ${CHARACTER_ASSIGNMENT_EXPECTED.total} activities, found ${allCharacterRuntimeActivities.length}.`)
  }

  applyCharacterContentRewrites()

  for (const activity of allCharacterRuntimeActivities) {
    const assignment = activityCharacterPresentation[activity.id]
    if (!assignment) throw new Error(`Missing character assignment: ${activity.id}`)

    if (assignment.presentation === 'scene') {
      activity.customer.id = sceneId(assignment.sceneKind)
      activity.customer.name = assignment.sceneLabel
      continue
    }

    if (assignment.pendingRewrite) {
      throw new Error(`Character rewrite is still pending after Phase 4: ${activity.id}`)
    }

    const profile = characterProfile(assignment.characterId)
    activity.customer.id = profile.id
    activity.customer.name = profile.name
  }

  applied = true
}

export function characterRuntimeActivities() {
  return allCharacterRuntimeActivities
}

applyCharacterRuntime()
