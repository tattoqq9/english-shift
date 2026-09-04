# Visual Situation UI

## Goal

The activity screen should reveal the scene before the player has to parse the English:

1. **Where am I?** — dedicated store Scene Header.
2. **What kind of task is this?** — Activity Type.
3. **What is happening?** — Situation.
4. **Who is speaking?** — Customer identity and portrait.
5. **What did the customer say?** — large Customer Order.
6. **What did I say?** — after selection, a right-side YOU speech bubble.

## Store artwork

Store artwork is no longer used as a faded background behind all UI. Each activity begins with a dedicated image header (roughly 185–230px tall depending on viewport), with only the current store name overlaid. This lets the generated artwork communicate the location without competing with English text.

## Player role

Persistent role labels such as `YOU · Outdoor Store Clerk` and Day-intro `YOUR ROLE` cards are intentionally removed. The campaign premise already establishes the player as staff, while the current store and post-answer YOU bubble provide enough context during play.

## Conversation

Before an answer:

- Customer portrait and name
- Large Customer Order
- No empty YOU panel

After an answer:

- selected English appears on the right as YOU
- customer response appears on the left
- troubleshooting/information histories follow the same side convention
- staff handoff uses YOU → SPECIALIST
