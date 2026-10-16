# Direction

How to choose a visual direction for New world work: greenfield builds and redesigns. A direction is a set of linked decisions with one idea underneath, not a mood. Done well, it gives every later choice something to be tested against.

Use it for redesigns, when the user asks for a distinct look, or when a first draft reads generic. A clear, conventional page done well doesn't need a new direction. Skip this file in Extend and New surface: the existing system is the direction (`extend.md`).

## Decide

Work through these in order. Write the answers down; the note at the end is built from them.

1. **Ground in the subject.** Answer in one line each:
   - Audience: who arrives, what they already know, what they're afraid of.
   - Job of the page: the one thing a visitor must understand or do.
   - Material world: the physical places, objects, tools and surfaces the subject lives among (a workshop, a ledger, a field, a lab bench, a stage).
   - Vocabulary: the words users actually say, including jargon and slang. Not marketing words.
2. **Write the subject inventory.** List 8–12 things only this product or subject has: objects, processes, units of measure, rituals, artefacts, textures, sounds, documents, constraints. "Fast" and "easy to use" don't count; every product claims them. If you can't reach 8, ask the user or read the codebase, the docs and any copy they gave you.
3. **Name the rut and its opposite.** Describe what most products in this category look like (palette, type, first screen, imagery). Then describe the predictable rebellion against it (the category is all soft and friendly, so you go stark and brutal). Rule out both. Both come from the category, not the subject.
4. **State the core idea** as one sentence: "X becomes Y", where X is part of the product and Y comes from the inventory or the material world. Then run the swap test: replace the product name with a direct competitor's. If the sentence still fits, it isn't specific yet; go back to the inventory.
5. **Generate three directions** that differ on at least two of these axes:

| Axis | Ask |
|---|---|
| Type voice | Where does the type come from: the subject's signage, documents, tools, era? How much contrast between roles? |
| Color strategy | Neutral-led with one accent, a committed color field, a material-derived palette, or nearly monochrome? (`color.md`) |
| Structure | What's the page's skeleton: a sequence, an index, a single long object, a spread, a tool? (`composition.md`) |
| Image role | Is the image evidence, atmosphere, instruction, or absent? (`imagery.md`) |
| Density | Sparse and slow, or packed and scannable? (`space-and-layout.md`) |

   Two directions that differ only in accent colour or font are one direction. Replace one of them.
6. **Apply the first-instinct rule.** The first direction you thought of is the one most agents would reach for (`principles.md`). Choose it only if it clearly fits the subject better than the other two, and write the reason in a sentence that names what the other two lack.
7. **Write the plan** (format below), then self-check it: if someone gave a similar brief for a different product in this category, would they land here? If yes, change the part that's portable, usually the bold move or the structure.

## Rules

- MUST inherit any brand assets, colors or type the user supplied. Direction work fills gaps around them; it doesn't replace them.
- SHOULD derive every direction from the inventory. Each direction names which inventory items it draws on.
- SHOULD give each direction exactly one bold move (`principles.md`): the thing it will be remembered for. Everything else in the plan supports it.
- SHOULD decide a motion stance up front (none, functional only, or one expressive moment) and keep to it (`motion.md`).
- AVOID directions you could name by a trend ("brutalist", "glassy", "editorial", "retro"). A style label is a rut; describe what the subject contributes instead.
- AVOID the generic defaults in `tells.md` as the bold move. A gradient, glow or bento grid is not an idea.
- NEVER let the direction depend on proof the user hasn't supplied: no plan built around a logo wall, testimonial carousel or stat row you'd have to invent.

## Mode limits expression

The mode decides how far the direction may go. Choose the mode from the surface (SKILL.md), then cap the plan:

| Mode | The direction may set | The direction leaves alone |
|---|---|---|
| Persuade | Everything: structure, type, color, imagery, one expressive motion moment | Accessibility floor, honesty |
| Read | Type pairing, color, the frame around the reading column, imagery | The column itself: measure, size and rhythm stay calm (`typography.md`) |
| Operate | Type, a restrained palette, density, one signature detail | Layout conventions, controls and navigation patterns (`apps-and-data.md`). No invented components |

If one product spans modes (a landing page plus an app), write one direction and state how it steps down for each mode: what carries through (palette roles, type voice, the signature detail) and what drops away (the bold move, expressive motion).

## Choosing with the user

- If the user asked to choose, or the brief is open and the stakes are high (a brand-defining page, a full redesign), present the three directions briefly, 3–4 lines each: core idea, the bold move, what it looks like in one concrete sentence. Recommend one and say why. Then wait.
- Otherwise, choose yourself. Put the chosen direction in the design note and list the two you rejected with one line each on why. Rejected options are required (SKILL.md).
- Don't present more than three. Don't present three that differ only in color.

## The direction note

Keep it compact. It goes in your reply before code (the Note step), and it becomes the seed of `DESIGN.md` after the first build (`design-md.md`).

```
Direction: <name in plain words, not a style label>
Mode: <Persuade | Operate | Read>, stepping down to <...> for <...>
Inventory used: <3–5 items from the subject inventory>
Rut ruled out: <category default>; opposite ruled out: <obvious rebellion>
Thesis: <X becomes Y>  (swap test: passed / why)
Palette: strategy <...>; roles: background, surface, text, muted text, accent, state colors
Type: roles (display, body, data/UI) and where each voice comes from
Structure: the skeleton and the first screen
Bold move: <one thing>
Motion: <none | functional | one expressive moment: what and where>
Rejected: <direction B: why>; <direction C: why>
Self-check: <why a similar brief would not land here>
```

Name roles and strategies here, not final values. Exact tokens are chosen while building and recorded in `DESIGN.md` afterwards, once they've survived contact with the real page.

## Generic defaults to catch

- **A thesis that's an adjective** ("bold and modern", "clean and trustworthy") → no subject in it → rewrite as "X becomes Y" from the inventory.
- **Three directions that are one direction in three colors** → no real choice was made → change structure or density, not paint.
- **The rebellion as the idea** ("everyone is light, so we're dark") → still defined by the category → start from the inventory.
- **The inventory filled with benefits** ("saves time", "secure") → not things → list objects, processes and words.
- **Picking the first direction without a reason** → the default dressed as a choice → write the sentence that says why it beats the other two.

## Check

- A subject inventory of 8–12 items was written, and the note cites the 3–5 the direction draws on, plus a named rut and a named opposite.
- The thesis fails the swap test with a direct competitor.
- The three directions differ on at least two named axes.
- There is exactly one bold move, and it comes from the inventory.
- The plan respects the mode cap in the table above.
- Two rejected directions are listed, each with a reason.
- Nothing in the plan requires invented proof or product facts.
