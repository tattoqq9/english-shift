/**
 * Interaction policy shared by BUILD and REPAIR.
 *
 * A learner should not have to resubmit an unchanged answer just to unlock help.
 * After one genuine check, they can either revise, ask for support, or reveal the
 * model answer. A no-attempt reveal is also allowed after all available hints.
 */
export function canCheckChangedAnswer(currentSignature: string, lastCheckedSignature: string | null) {
  return currentSignature.length > 0 && currentSignature !== lastCheckedSignature
}

export function canRevealBestAnswer(attempts: number, hintsUsed: number, maxHints: number) {
  return attempts > 0 || (maxHints > 0 && hintsUsed >= maxHints)
}

export function reviewRevealScore(hintsUsed: number) {
  return Math.max(35, 50 - Math.max(0, hintsUsed) * 5)
}
