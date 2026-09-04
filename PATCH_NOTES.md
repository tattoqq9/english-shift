# English Shift v0.4.6 — Level 2 Content Repair Pass

## What changed

### 1. Phrase-aware target chunks

Level 2 target sentences are no longer divided mainly by equal word count. The splitter now avoids cutting after determiners and auxiliaries, respects sentence and clause boundaries, protects common question frames, and gives reviewed Activities explicit teaching chunks where needed.

Examples:

- `I’m calling / a staff member / to help you.`
- `We’re going to / receive more / on Friday.`
- `You paid / the room charge online, / didn’t you?`

Activity IDs and Level 2 progress keys are unchanged.

### 2. Structure Slots based on the actual chunk

Slot labels are now derived from the text and grammar role of each chunk. The Structure Map distinguishes response openings, question frames, question details, auxiliaries, conditions, connectors, tag questions, actions, passive/state chunks and details.

This removes mappings such as `Yes, / you / can.` being described as a generic subject/action/object sequence.

### 3. Contextual distractors

The generic `right now.` / `later today.` fallback has been removed. Short and structurally sensitive Activities use reviewed distractors. Generated distractors are rejected when they contain broken pronoun case, incomplete filler, malformed modal combinations, duplicate target chunks or other mechanical patterns.

### 4. Stronger automated audit

`npm run level2:quality` now checks:

- 144 Activities
- exactly three progressive hints per Activity
- 144 Structure Maps using the reviewed label set
- exactly 288 reviewed/generated distractors
- no generic fallback distractors
- no malformed distractor patterns covered by the audit
- no target chunk crossing a sentence boundary
- no target chunk ending after an article or possessive determiner
- Correct / Almost / Not quite behavior for every Activity
- Japanese diagnostic feedback

### 5. Build hygiene

`*.tsbuildinfo` is ignored so `npm run build` no longer leaves TypeScript build metadata as untracked files.

## Preserved

- Level 1: 48 Shifts / 144 Activities
- Level 2: 48 Days / 144 Activities
- Existing Level 2 progress and Activity IDs
- ES-G1/G2 coverage: 70/70
- Exam Shift ES-G3: 26/26
- Mastery / Weakness Review
- REPAIR LAB: 6 Units / 24 Missions
- FLOW LAB: unchanged / on hold

## Verification

```powershell
npm run level2:quality
npm run core:check
npm run grammar:audit
npm run advanced:check
npm run nav:check
npm run build
```
