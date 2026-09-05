import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

const characters = ['mia', 'sofia', 'leo', 'oliver', 'aisha', 'noah', 'ken', 'daniel', 'hana', 'grace', 'young-customer']
const expressions = ['neutral', 'thinking', 'happy', 'confused', 'delighted', 'disappointed']

let checked = 0
for (const character of characters) {
  for (const expression of expressions) {
    const path = join('public', 'characters', character, `${expression}.webp`)
    if (!existsSync(path)) throw new Error(`Missing character asset: ${path}`)
    if (statSync(path).size < 1000) throw new Error(`Character asset looks invalid: ${path}`)
    checked += 1
  }
}

if (checked !== 66) throw new Error(`Expected 66 portrait assets, found ${checked}`)
console.log('Character assets smoke: PASS')
console.log(`characters=${characters.length} expressions=${expressions.length} assets=${checked}`)
