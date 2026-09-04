# English Shift v0.4.6

This version completes the **Level 2 · BUILD content repair pass** after the first quality and feedback implementation.

## Learning architecture

- Level 1 · SELECT — recognize appropriate English
- Level 2 · BUILD — construct the English yourself
- Exam Shift — university entrance / TOEIC advanced grammar and information processing
- Advanced · REPAIR LAB — diagnose and fix broken English
- Advanced · FLOW LAB — prototype retained on hold

## Level 2 · BUILD

- 8 Chapters / 48 Days / **144 BUILD Activities**
- ES-G1 + ES-G2 **70/70** through sentence construction
- Standard / Guided / Challenge modes
- phrase-aware chunks and contextual distractors
- chunk-specific Structure Maps

### v0.4.6 learning loop and content repair

```text
Build your sentence
      ↓
Check my sentence
      ↓
Correct / Almost / Not quite
      ↓
Revise freely
      ↓
Hint 1 → Hint 2 → Hint 3 (optional)
      ↓
Show best answer (last resort)
      ↓
BUILD Answer Review
```

An imperfect sentence can always be checked after at least one chunk is selected. Hint is optional.

### Progressive hints

- Hint 1: concept / thinking direction
- Hint 2: sentence structure skeleton
- Hint 3: partial position anchor

### Answer Review

The result screen shows the learner's last try when relevant, the best response, Japanese translation, a structure map, grammar focus, and why the response works.

## Debug

```powershell
npm run dev:debug
```

## Validation

```powershell
npm run level2:audit
npm run level2:quality
npm run core:check
npm run grammar:audit
npm run nav:check
npm run advanced:check
```
