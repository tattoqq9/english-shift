import {
  canCheckChangedAnswer,
  canRevealBestAnswer,
  reviewRevealScore,
} from '../src/core/learningInteraction.js'

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

assert(canCheckChangedAnswer('', null) === false, 'Empty answer must not be checkable')
assert(canCheckChangedAnswer('a|b', null) === true, 'A first answer must be checkable')
assert(canCheckChangedAnswer('a|b', 'a|b') === false, 'Unchanged answer must not be rechecked')
assert(canCheckChangedAnswer('a|c', 'a|b') === true, 'A revised answer must become checkable')

assert(canRevealBestAnswer(0, 0, 3) === false, 'BUILD answer must not be visible immediately')
assert(canRevealBestAnswer(1, 0, 3) === true, 'One genuine BUILD check must unlock best answer')
assert(canRevealBestAnswer(0, 2, 3) === false, 'BUILD Hint 2 must not reveal the answer yet')
assert(canRevealBestAnswer(0, 3, 3) === true, 'BUILD Hint 3 must unlock best answer without forcing a check')

assert(canRevealBestAnswer(0, 0, 1) === false, 'REPAIR correction must not be visible immediately')
assert(canRevealBestAnswer(1, 0, 1) === true, 'One REPAIR check must unlock correction')
assert(canRevealBestAnswer(0, 1, 1) === true, 'The single REPAIR hint must also unlock correction')

assert(reviewRevealScore(0) === 50, 'Reveal without hints should record review-level score 50')
assert(reviewRevealScore(3) === 35, 'Three hints should record review-level score 35')
assert(reviewRevealScore(99) === 35, 'Reveal score must have a safe floor')

console.log('Learning interaction smoke: PASS')
console.log('one-check=reveal unchanged=recheck-blocked max-hint=reveal review-score=35..50')
