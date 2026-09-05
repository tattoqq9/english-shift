export type CharacterId =
  | 'mia'
  | 'sofia'
  | 'leo'
  | 'oliver'
  | 'aisha'
  | 'noah'
  | 'ken'
  | 'daniel'
  | 'hana'
  | 'grace'
  | 'young-customer'

export type CharacterSceneKind = 'queue' | 'exam' | 'incident'

export type CharacterProfile = {
  id: CharacterId
  name: string
  age: number | null
  backgroundJa: string
  sceneFitJa: string
}

export type ActivityCharacterPresentation =
  | { presentation: 'character'; characterId: CharacterId; pendingRewrite: boolean }
  | { presentation: 'scene'; sceneKind: CharacterSceneKind; sceneLabel: string }

export const characterProfiles: Record<CharacterId, CharacterProfile> = {
  'mia': { id: 'mia', name: 'Mia', age: 17, backgroundJa: '高校生', sceneFitJa: '日常の買い物・カジュアル場面' },
  'sofia': { id: 'sofia', name: 'Sofia', age: 22, backgroundJa: '大学生', sceneFitJa: '服・カフェ・学習・キャリア準備' },
  'leo': { id: 'leo', name: 'Leo', age: 29, backgroundJa: '動画制作者', sceneFitJa: 'PC・映像・電子機器' },
  'oliver': { id: 'oliver', name: 'Oliver', age: 31, backgroundJa: '長距離移動が多い', sceneFitJa: '空港・旅行・Tax-free・荷物' },
  'aisha': { id: 'aisha', name: 'Aisha', age: 34, backgroundJa: 'ランナー', sceneFitJa: 'ランニング・スポーツ' },
  'noah': { id: 'noah', name: 'Noah', age: 37, backgroundJa: 'キャンプ好き', sceneFitJa: 'キャンプ・ハイキング・Outdoor' },
  'ken': { id: 'ken', name: 'Ken', age: 41, backgroundJa: '通勤・仕事', sceneFitJa: '通勤・仕事用品・会議・法人' },
  'daniel': { id: 'daniel', name: 'Daniel', age: 45, backgroundJa: '保護者・家族の買い物', sceneFitJa: '家族向け購入・ギフト' },
  'hana': { id: 'hana', name: 'Hana', age: 52, backgroundJa: '出張が多い', sceneFitJa: 'Hotel・Business travel・Formal service' },
  'grace': { id: 'grace', name: 'Grace', age: 68, backgroundJa: '日常利用', sceneFitJa: '落ち着いた一般利用・確認・案内' },
  'young-customer': { id: 'young-customer', name: 'Young Customer', age: null, backgroundJa: '迷子・Safety専用', sceneFitJa: '保護者とはぐれた安全対応' },
}

export const activityCharacterPresentation: Record<string, ActivityCharacterPresentation> = {
  'd1-umbrella': { presentation: 'character', characterId: 'mia', pendingRewrite: false },
  'd1-bag': { presentation: 'character', characterId: 'noah', pendingRewrite: false },
  'd1-sale': { presentation: 'character', characterId: 'daniel', pendingRewrite: false },
  'd2-restroom': { presentation: 'character', characterId: 'grace', pendingRewrite: false },
  'd2-snack-hunt': { presentation: 'character', characterId: 'mia', pendingRewrite: false },
  'd2-atm': { presentation: 'character', characterId: 'aisha', pendingRewrite: false },
  'd3-total': { presentation: 'character', characterId: 'noah', pendingRewrite: false },
  'd3-bags': { presentation: 'character', characterId: 'mia', pendingRewrite: false },
  'd3-coins': { presentation: 'character', characterId: 'aisha', pendingRewrite: false },
  'd4-person-hunt': { presentation: 'character', characterId: 'aisha', pendingRewrite: false },
  'd4-child': { presentation: 'character', characterId: 'young-customer', pendingRewrite: false },
  'd4-line': { presentation: 'character', characterId: 'noah', pendingRewrite: false },
  'd5-card-fix': { presentation: 'character', characterId: 'ken', pendingRewrite: false },
  'd5-price-tag': { presentation: 'character', characterId: 'aisha', pendingRewrite: false },
  'd5-receipt': { presentation: 'character', characterId: 'mia', pendingRewrite: false },
  'd6-rush': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd6-hunt': { presentation: 'character', characterId: 'grace', pendingRewrite: false },
  'd6-fix': { presentation: 'character', characterId: 'aisha', pendingRewrite: false },
  'd7-shirt-hunt': { presentation: 'character', characterId: 'sofia', pendingRewrite: false },
  'd7-which-jacket': { presentation: 'character', characterId: 'sofia', pendingRewrite: false },
  'd7-socks': { presentation: 'character', characterId: 'daniel', pendingRewrite: false },
  'd8-jacket-recommend': { presentation: 'character', characterId: 'ken', pendingRewrite: false },
  'd8-shoes-fit': { presentation: 'character', characterId: 'sofia', pendingRewrite: false },
  'd8-comparison-rush': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd9-work-shirt': { presentation: 'character', characterId: 'sofia', pendingRewrite: false },
  'd9-weekend-style': { presentation: 'character', characterId: 'mia', pendingRewrite: false },
  'd9-purpose-rush': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd10-purchase-hunt': { presentation: 'character', characterId: 'mia', pendingRewrite: false },
  'd10-stock-arrival': { presentation: 'character', characterId: 'mia', pendingRewrite: false },
  'd10-fitting-history': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd11-exchange-fix': { presentation: 'character', characterId: 'sofia', pendingRewrite: false },
  'd11-other-size': { presentation: 'character', characterId: 'mia', pendingRewrite: false },
  'd11-exchange-hunt': { presentation: 'character', characterId: 'mia', pendingRewrite: false },
  'd12-best-outfit': { presentation: 'character', characterId: 'sofia', pendingRewrite: false },
  'd12-as-as': { presentation: 'character', characterId: 'sofia', pendingRewrite: false },
  'd12-style-rush': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd13-trail-experience': { presentation: 'character', characterId: 'aisha', pendingRewrite: false },
  'd13-ever-used': { presentation: 'character', characterId: 'noah', pendingRewrite: false },
  'd13-experience-rush': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd14-running-profile': { presentation: 'character', characterId: 'aisha', pendingRewrite: false },
  'd14-since-when': { presentation: 'character', characterId: 'noah', pendingRewrite: false },
  'd14-duration-rush': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd15-hiking-advice': { presentation: 'character', characterId: 'noah', pendingRewrite: false },
  'd15-must-have': { presentation: 'character', characterId: 'aisha', pendingRewrite: false },
  'd15-safety-rush': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd16-rainy-run': { presentation: 'character', characterId: 'aisha', pendingRewrite: false },
  'd16-if-weather': { presentation: 'character', characterId: 'noah', pendingRewrite: false },
  'd16-condition-hunt': { presentation: 'character', characterId: 'noah', pendingRewrite: false },
  'd17-wet-boots': { presentation: 'character', characterId: 'noah', pendingRewrite: false },
  'd17-unless': { presentation: 'character', characterId: 'aisha', pendingRewrite: false },
  'd17-if-i-were-you': { presentation: 'character', characterId: 'noah', pendingRewrite: false },
  'd18-expedition-kit': { presentation: 'character', characterId: 'noah', pendingRewrite: false },
  'd18-experience-diagnosis': { presentation: 'character', characterId: 'noah', pendingRewrite: false },
  'd18-expedition-rush': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd19-made-designed': { presentation: 'character', characterId: 'leo', pendingRewrite: false },
  'd19-damaged-opened': { presentation: 'character', characterId: 'grace', pendingRewrite: false },
  'd19-passive-rush': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd20-laptop-that': { presentation: 'character', characterId: 'leo', pendingRewrite: false },
  'd20-device-which': { presentation: 'character', characterId: 'leo', pendingRewrite: false },
  'd20-relative-rush': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd21-what-use-for': { presentation: 'character', characterId: 'leo', pendingRewrite: false },
  'd21-could-you-tell': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd21-indirect-hunt': { presentation: 'character', characterId: 'leo', pendingRewrite: false },
  'd22-keeps-cool': { presentation: 'character', characterId: 'leo', pendingRewrite: false },
  'd22-how-to-connect': { presentation: 'character', characterId: 'leo', pendingRewrite: false },
  'd22-feature-rush': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd23-headphones-pairing': { presentation: 'character', characterId: 'leo', pendingRewrite: false },
  'd23-although-battery': { presentation: 'character', characterId: 'leo', pendingRewrite: false },
  'd23-trouble-rush': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd24-repair-handoff': { presentation: 'character', characterId: 'leo', pendingRewrite: false },
  'd24-specialist-request': { presentation: 'character', characterId: 'daniel', pendingRewrite: false },
  'd24-electronics-rush': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd25-coffee-order': { presentation: 'character', characterId: 'sofia', pendingRewrite: false },
  'd25-lunch-set': { presentation: 'character', characterId: 'daniel', pendingRewrite: false },
  'd25-order-rush': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd26-sugar-amount': { presentation: 'character', characterId: 'grace', pendingRewrite: false },
  'd26-party-order': { presentation: 'character', characterId: 'mia', pendingRewrite: false },
  'd26-quantity-rush': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd27-would-like': { presentation: 'character', characterId: 'sofia', pendingRewrite: false },
  'd27-offer-dessert': { presentation: 'character', characterId: 'grace', pendingRewrite: false },
  'd27-polite-rush': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd28-nut-allergy': { presentation: 'character', characterId: 'mia', pendingRewrite: false },
  'd28-cross-contact': { presentation: 'character', characterId: 'daniel', pendingRewrite: false },
  'd28-allergy-confirm': { presentation: 'character', characterId: 'sofia', pendingRewrite: false },
  'd29-soup-sold-out': { presentation: 'character', characterId: 'grace', pendingRewrite: false },
  'd29-another-drink': { presentation: 'character', characterId: 'daniel', pendingRewrite: false },
  'd29-soldout-rush': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd30-dinner-rush': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd30-allergy-handoff': { presentation: 'character', characterId: 'mia', pendingRewrite: false },
  'd30-order-complaint': { presentation: 'character', characterId: 'daniel', pendingRewrite: false },
  'd31-room-change': { presentation: 'character', characterId: 'hana', pendingRewrite: false },
  'd31-breakfast-history': { presentation: 'character', characterId: 'hana', pendingRewrite: false },
  'd31-timeline-rush': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd32-late-checkin': { presentation: 'character', characterId: 'hana', pendingRewrite: false },
  'd32-housekeeping-message': { presentation: 'character', characterId: 'hana', pendingRewrite: false },
  'd32-handoff-rush': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd33-luggage-incident': { presentation: 'character', characterId: 'oliver', pendingRewrite: false },
  'd33-room-key-deduction': { presentation: 'character', characterId: 'hana', pendingRewrite: false },
  'd33-inference-rush': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd34-airport-shuttle': { presentation: 'character', characterId: 'oliver', pendingRewrite: false },
  'd34-room-cleaning': { presentation: 'character', characterId: 'hana', pendingRewrite: false },
  'd34-service-diagnosis': { presentation: 'character', characterId: 'hana', pendingRewrite: false },
  'd35-breakfast-confirm': { presentation: 'character', characterId: 'hana', pendingRewrite: false },
  'd35-payment-confirm': { presentation: 'character', characterId: 'hana', pendingRewrite: false },
  'd35-confirmation-rush': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd36-overbooking-incident': { presentation: 'scene', sceneKind: 'incident', sceneLabel: 'Incident Case' },
  'd36-manager-handoff': { presentation: 'character', characterId: 'ken', pendingRewrite: false },
  'd36-hotel-rush': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd37-soldout-coat': { presentation: 'character', characterId: 'daniel', pendingRewrite: false },
  'd37-gift-alternative': { presentation: 'character', characterId: 'daniel', pendingRewrite: false },
  'd37-alternative-queue': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd38-giftwrap-incident': { presentation: 'character', characterId: 'daniel', pendingRewrite: false },
  'd38-return-deadline': { presentation: 'character', characterId: 'daniel', pendingRewrite: false },
  'd38-counterfactual-queue': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd39-wish-size': { presentation: 'character', characterId: 'sofia', pendingRewrite: false },
  'd39-asif-complaint': { presentation: 'character', characterId: 'aisha', pendingRewrite: false },
  'd39-regret-queue': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd40-watch-compare': { presentation: 'character', characterId: 'ken', pendingRewrite: false },
  'd40-bag-comparison': { presentation: 'character', characterId: 'ken', pendingRewrite: false },
  'd40-premium-queue': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd41-sale-return': { presentation: 'character', characterId: 'sofia', pendingRewrite: false },
  'd41-warranty-policy': { presentation: 'character', characterId: 'ken', pendingRewrite: false },
  'd41-policy-handoff': { presentation: 'character', characterId: 'grace', pendingRewrite: false },
  'd42-vip-incident': { presentation: 'character', characterId: 'daniel', pendingRewrite: false },
  'd42-manager-handoff': { presentation: 'character', characterId: 'hana', pendingRewrite: false },
  'd42-manager-queue': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd43-taxfree-explain': { presentation: 'character', characterId: 'oliver', pendingRewrite: false },
  'd43-pickup-route': { presentation: 'character', characterId: 'oliver', pendingRewrite: false },
  'd43-connector-queue': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd44-vip-briefing': { presentation: 'character', characterId: 'hana', pendingRewrite: false },
  'd44-pickup-clarify': { presentation: 'character', characterId: 'aisha', pendingRewrite: false },
  'd44-briefing-queue': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd45-passport-incident': { presentation: 'character', characterId: 'oliver', pendingRewrite: false },
  'd45-delivery-trace': { presentation: 'character', characterId: 'grace', pendingRewrite: false },
  'd45-investigation-queue': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd46-vip-exception': { presentation: 'character', characterId: 'oliver', pendingRewrite: false },
  'd46-private-shopping': { presentation: 'character', characterId: 'ken', pendingRewrite: false },
  'd46-formal-handoff': { presentation: 'character', characterId: 'hana', pendingRewrite: false },
  'd47-crossstore-hunt': { presentation: 'character', characterId: 'oliver', pendingRewrite: false },
  'd47-device-troubleshoot': { presentation: 'character', characterId: 'oliver', pendingRewrite: false },
  'd47-gauntlet-queue': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'd48-final-incident': { presentation: 'character', characterId: 'grace', pendingRewrite: false },
  'd48-final-handoff': { presentation: 'character', characterId: 'oliver', pendingRewrite: false },
  'd48-final-queue': { presentation: 'scene', sceneKind: 'queue', sceneLabel: 'Queue / Rush' },
  'exam-m1-notice': { presentation: 'character', characterId: 'grace', pendingRewrite: false },
  'exam-m1-supplier': { presentation: 'character', characterId: 'oliver', pendingRewrite: false },
  'exam-m1-what-queue': { presentation: 'scene', sceneKind: 'exam', sceneLabel: 'Exam Sprint' },
  'exam-m2-delivery-records': { presentation: 'character', characterId: 'oliver', pendingRewrite: false },
  'exam-m2-tomorrow-schedule': { presentation: 'character', characterId: 'ken', pendingRewrite: false },
  'exam-m2-passive-queue': { presentation: 'scene', sceneKind: 'exam', sceneLabel: 'Exam Sprint' },
  'exam-m3-cleft': { presentation: 'character', characterId: 'ken', pendingRewrite: false },
  'exam-m3-inversion': { presentation: 'character', characterId: 'ken', pendingRewrite: false },
  'exam-m3-condition-queue': { presentation: 'scene', sceneKind: 'exam', sceneLabel: 'Exam Sprint' },
  'exam-m4-used-to': { presentation: 'character', characterId: 'grace', pendingRewrite: false },
  'exam-m4-repair-advice': { presentation: 'character', characterId: 'leo', pendingRewrite: false },
  'exam-m4-perception-queue': { presentation: 'scene', sceneKind: 'exam', sceneLabel: 'Exam Sprint' },
  'exam-m5-earlier': { presentation: 'character', characterId: 'oliver', pendingRewrite: false },
  'exam-m5-quantity': { presentation: 'character', characterId: 'grace', pendingRewrite: false },
  'exam-m5-comparison-queue': { presentation: 'scene', sceneKind: 'exam', sceneLabel: 'Exam Sprint' },
  'exam-m6-form-choice': { presentation: 'character', characterId: 'ken', pendingRewrite: false },
  'exam-m6-linker-queue': { presentation: 'scene', sceneKind: 'exam', sceneLabel: 'Exam Sprint' },
  'exam-m6-handoff': { presentation: 'character', characterId: 'ken', pendingRewrite: false },
}

export const CHARACTER_ASSIGNMENT_EXPECTED = {
  total: 162,
  recurring: 119,
  youngCustomer: 1,
  scenes: 42,
} as const

export const RECURRING_CHARACTER_IDS: CharacterId[] = [
  'mia', 'sofia', 'leo', 'oliver', 'aisha', 'noah', 'ken', 'daniel', 'hana', 'grace',
]

export function characterProfile(id: CharacterId) {
  return characterProfiles[id]
}

export function characterPresentationForActivity(activityId: string) {
  return activityCharacterPresentation[activityId]
}


const RAPID_CHARACTER_POOLS: Record<number, CharacterId[]> = {
  1: ['mia', 'grace', 'daniel', 'ken'],
  2: ['sofia', 'mia', 'daniel', 'hana'],
  3: ['aisha', 'noah', 'daniel', 'sofia'],
  4: ['leo', 'ken', 'grace', 'sofia'],
  5: ['mia', 'sofia', 'grace', 'daniel'],
  6: ['oliver', 'hana', 'grace', 'ken'],
  7: ['daniel', 'hana', 'sofia', 'grace'],
  8: ['oliver', 'ken', 'hana', 'leo'],
  9: ['grace', 'ken', 'oliver', 'hana'],
}

function chapterForPresentation(activityId: string) {
  if (activityId.startsWith('exam-')) return 9
  const day = Number(activityId.match(/^d(\d+)/)?.[1] ?? 1)
  return Math.min(8, Math.max(1, Math.floor((day - 1) / 6) + 1))
}

/** A stable, chapter-appropriate face for each Rapid / Queue mini-customer. */
export function rapidScenarioCharacter(activityId: string, scenarioIndex: number) {
  const pool = RAPID_CHARACTER_POOLS[chapterForPresentation(activityId)] ?? RAPID_CHARACTER_POOLS[8]
  return characterProfile(pool[Math.max(0, scenarioIndex) % pool.length])
}
