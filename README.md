# English Shift v0.6.0

**English Shift** is a game-based English learning app built around customer-service scenarios.

Instead of treating grammar as a list of isolated rules, the app trains three different abilities:

- **SELECT** — recognize appropriate English
- **BUILD** — construct the English yourself
- **REPAIR** — find and fix broken English

The current release, **v0.6.0**, is a full UI/UX reboot focused on making the learning path clear from the first screen.

---

## Learning loop

```text
Today
  ↓
SELECT
見分ける
  ↓
BUILD
作る
  ↓
Review / REPAIR
弱点を直す
  ↓
Next Shift
```

A Shift is designed as a short learning session.

```text
1 Shift
├─ SELECT Activity 1
├─ SELECT Activity 2
├─ SELECT Activity 3
│
└─ BUILD for the same Day
   ├─ BUILD Activity 1
   ├─ BUILD Activity 2
   └─ BUILD Activity 3
```

SELECT and BUILD are paired by Day, so learners can move directly from recognition to production while the same context is still fresh.

---

## Main navigation

### Today

Shows the single most useful action to do next.

Typical flow:

```text
Current SELECT Shift
→ unfinished BUILD for the same Day
→ Review when a weakness needs attention
```

### Shifts

The full learning route.

- 8 stores
- 48 Shifts
- 6 Shifts per store
- SELECT / BUILD progress visible for each Day
- completed Shifts can be replayed

### Review

An action-first weakness review screen.

- shows **Next Best Review**
- tracks SELECT / BUILD / REPAIR separately
- builds short review sessions from measured weaknesses
- normally reuses already encountered content
- uses a clearly labeled **Transfer Challenge** only when needed
- provides access to REPAIR LAB
- keeps the detailed 96-concept Mastery view available as secondary information

### More

Optional tools and information.

- Getting Started guide
- Game Lab
- FLOW LAB
- curriculum information
- version information

---

## Learning architecture

| Area | Purpose | Current scope |
|---|---|---:|
| Level 1 · SELECT | Recognize meaning, grammar, and appropriate responses | 144 Activities |
| Exam Shift · SELECT | University entrance / TOEIC advanced grammar | 18 Activities |
| Level 2 · BUILD | Construct English from the same 48-Day curriculum | 144 Activities |
| REPAIR LAB | Diagnose and fix unnatural or incorrect English | 24 Activities |
| FLOW LAB | Conversation-flow prototype | 3 Activities |

### Total SELECT

```text
Level 1 SELECT  144
Exam SELECT      18
-------------------
Total           162
```

---

## Grammar coverage

English Shift uses a canonical **96-concept grammar registry**.

```text
ES-G1   45 concepts
ES-G2   25 concepts
ES-G3   26 concepts
-------------------
Total   96 concepts
```

Level 1 covers ES-G1 / ES-G2.

Exam Shift adds ES-G3 for university entrance examinations and TOEIC-oriented advanced grammar.

BUILD reuses the Level 1 curriculum as production practice rather than introducing an unrelated second course.

---

## Level 2 · BUILD

Level 2 contains:

- 8 Chapters
- 48 Days
- 144 BUILD Activities
- 70 / 70 ES-G1 + ES-G2 concepts
- Standard / Guided / Challenge modes
- progressive 3-stage hints
- Structure Maps
- contextual distractors
- `Correct / Almost / Not quite` feedback
- Answer Review

### BUILD feedback loop

```text
Build your sentence
      ↓
Check my sentence
      ↓
Correct / Almost / Not quite
      ↓
Revise
      ↓
Hint 1 → Hint 2 → Hint 3
      ↓
Best answer if needed
      ↓
Answer Review
```

Hints remain optional.

---

## Result feedback

Activity results are designed to keep the customer reaction visible.

The recurring cast changes expression according to the score, and the result card keeps the character reaction, score, and grade together so feedback is visible without unnecessary scrolling.

The current character system contains:

- 11 recurring / special characters
- 6 expressions per character
- 66 character assets

---

## First-run experience

New users see a short 3-step guide:

```text
1. Try one Shift
2. SELECT → BUILD → Review
3. Today / Shifts / Review
```

The final **Start Day 1** button launches the first Shift directly instead of sending the learner through another selection screen.

---

## Tech stack

- React
- TypeScript
- Vite
- Zustand
- browser `localStorage` / `sessionStorage` for progress and navigation state

The current app does not require a server-side LLM for normal learning gameplay.

---

## Getting started

Requirements:

- Node.js 22+
- npm

Install dependencies:

```powershell
npm install
```

Start development mode:

```powershell
npm run dev
```

Open on the local network:

```powershell
npm run dev:lan
```

---

## Debug mode

To unlock all learning routes for development and Android verification:

```powershell
npm run dev:debug
```

Debug mode changes route availability for testing; it does not automatically rewrite saved learning progress.

---

## Validation

The main v0.6.0 release gate is:

```powershell
npm run v060:release
```

It includes the v0.6 UI/UX contract checks together with the existing full release checks.

Key validation targets include:

- TypeScript typecheck
- core smoke tests
- 48 Shift / 144 Level 1 Activity contract
- 162 SELECT Activities
- 144 BUILD Activities
- 24 REPAIR Activities
- 3 FLOW Activities
- 96 grammar concepts
- 330 weakness-review candidates
- navigation regression checks
- Level 2 quality audit
- character integration / 66 character assets
- production Vite build

Useful individual checks:

```powershell
npm run v060:check
npm run core:check
npm run level2:quality
npm run grammar:audit
npm run nav:check
npm run advanced:check
npm run character:check
npm run build
```

---

## v0.6.0 UI/UX Reboot

The v0.6.0 release reorganized the application around one clear question per screen:

```text
Today   = What should I do now?
Shifts  = Which Shift do I want to play?
Review  = What should I improve?
More    = Optional tools and information
```

Major changes include:

- new Today / Shifts / Review / More information architecture
- 8-store Shifts route
- 6-Day Store Detail screens
- paired SELECT / BUILD progress
- direct SELECT → same-Day BUILD flow
- continuous 3-Activity BUILD sessions
- redesigned Shift Intro and Shift Complete screens
- score-dependent character reactions in Activity Result
- action-first Review
- progress-aware weakness review
- REPAIR LAB integration into Review
- simplified 3-screen onboarding
- direct Day 1 first-run launch
- Android-first layout polish for 360–430 px widths

---

## Roadmap

The next major learning-design target is deeper **free production** in BUILD.

Current BUILD is chunk-based. A future step is to let learners produce more of the sentence themselves while keeping:

- Almost / Not quite feedback
- progressive hints
- grammar-aware Answer Review
- mobile-friendly input
- offline / low-cost operation

---

## Status

**v0.6.0 — released**

The v0.6.0 UI/UX reboot, automated release gate, production build, and Android real-device verification have passed.
