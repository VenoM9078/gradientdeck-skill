# Direction

How to choose a visual direction for New world work: greenfield builds and redesigns. **In New world, this is required before any code.** Skip it in Extend and New surface: the existing system is the direction (`extend.md`).

Left alone, a model builds its top-ranked idea, the one every other run would build too. So you write the candidates, a roll picks one, and dealt worlds push it further.

## 1. Ground in the subject

One line each:
- **Audience:** who arrives, what they already know, what they're afraid of.
- **Job:** the one thing a visitor must understand or do.
- **Action:** the control that does the job, in working form on the first screen (the order form, the install command, the booking slot, the call button). Not a link to it.
- **Scene:** where they are and what's around them when this matters (a 6am queue, a late-night deploy, a tax deadline).
- **Vocabulary:** the words users actually say. Not marketing words.

Then list 8–12 things only this subject has: objects, processes, units, rituals, documents, constraints. "Fast" and "easy" don't count.

## 2. Name the rut

Describe the page this category always ships (palette, type, first screen, imagery) and its predictable opposite (soft and friendly becomes stark and brutal). Rule out both. The test: if someone could guess your look from the category alone, or from the category plus what you avoided, you're still in the rut. Dodging the dark software look by dressing a software product as an old paper object is the predictable opposite, not an escape. A look from `tells.md` is fine when this product's facts reshape it.

## 3. Write seven candidates

Seven concrete worlds the audience knows by heart that could lend the page its materials. Their world includes what they read on screens, not only what they hold: a printed object, a place, a ritual, signage, a broadcast, a craft, a game, and also an interface they admire, a notation, a data graphic, an identity program, a named school of design. A nameable system is as concrete as an object; a mood ("clean", "premium") is not.
- Cover at least three material families (paper and print; metal and machinery; textile; built space and signage; food and packaging; screen and broadcast; sport and play; interface and notation; light, signal and motion).
- At most one comes from the tools the audience operates for this job (a terminal for a developer tool, flour sacks for a bakery). Interfaces and graphics they admire elsewhere don't count as that one. At most one reads the product's name literally.
- Give each one line: its ground color, two or three main colors, where its type comes from, and the one thing it does that nothing else on the list does.
- Give each a reason: how it carries the job or the action, and where the product is seen working on its first screen (which part becomes the action, which state shows the product's facts). Colors and type are not a reason.
- Every candidate must already be a page you could finish well, since the roll may land on any of your top three. One that couldn't is replaced before the roll, never rescued by it.

Rank them by how strongly the audience would recognise each as theirs.

## 4. Roll

Run the roll from the project folder:

```
node <skill folder>/scripts/roll.mjs --page index --job "<job>" --action "<action>"
  --candidates "<world name>: <reason and first screen> | ..." --mode persuade
  --photos "<thing to show> | <thing to show>"
```

Pass your seven, best first, each with its reason after a colon. `--page` names the page (`index`, `pricing`). Use `--mode operate` or `--mode read` for those surfaces. `--photos` names what its photographs show (or `none: <reason>`). Its output is binding: the candidate to build, worlds to weigh against it, this mode's rules, matching photographs, and the plan file (section 6). Without Node, build your third-ranked candidate with no dealt worlds, write the plan file yourself, and say so.

## 5. Weigh the dealt worlds

In Operate mode the roll deals no worlds; skip this step. Otherwise, follow the roll's instructions. In short: imagine the product built in each world's system, judge it against your assigned candidate on two things only (does the audience recognise it, is the product clearer), and write a verdict for each in the plan file. A world that wins both becomes the build. Every other world lends one discipline from its system to your direction, never a color, typeface or ornament.

## 6. Fill the plan

The roll saves `.gradientdeck/pages/<page>.md` in the project: the roll's key and pick, the job, the action, your ranked list, and blanks to fill before code: thesis, first screen, type and color, the page's own system, the story section by section, the signature moment, the example content you authored, and one verdict per dealt world. Its Finish line says when the page is done. Rolling the page again replaces it; job, action and dealt worlds carry over. Later edits read it as the page's intent.

The first screen is described spatially, as if to someone drawing it. Copy beside a picture is fine when the picture is this product's own thing, shown working (the order docket, the marked-up proof, the editor mid-task); a generic card or a centred headline over cards is not. When the world is an object, the page is built as that object. When it's an interface, a notation or a system of light and motion, the page is built around the product's own interface shown working, and the world sets its type, surfaces, how states change and one signature visual. The world carries every section, not just the first: a section that reads as ordinary docs, steps or a card grid in the world's colors has dropped it.

## 7. Present, build, re-roll

- **If you can ask the user,** follow the roll's PRESENT step: show the assigned direction committed, your pick if allowed, any world that won or came close, and the exits (bolder, safer, the category standard). Build what they choose.
- **If you can't ask,** build the assigned direction. End your report with one line offering a bolder or safer re-roll.
- **Before you finish,** render the page and run the roll's `check` command; fix what it lists as part of the taste-test (SKILL.md).
- **When the user asks to re-roll,** run the script again for the same page with `--register bolder` (a dealt world is built outright) or `--register safer` (one of your top three, executed straight). Worlds already dealt don't come back. If they ask for the standard, build the category canon at full craft, measured against two or three real products they'd name. If they say they prefer one register for this product, add a dated line to `.gradientdeck/decisions.md`.

## Committing

- Build the direction you were given, not a safer reading of it. When torn between refined and committed, commit.
- The world shows across the page (its object, its structure, its colors), not as one sticker on a generic page. The ground can still be light and quiet.
- Name a color strategy: restrained, committed (one saturated color over a third of the page), full palette, or drenched. Bold usually means committed or drenched.
- Pick type and color by the procedures in `typography.md` and `color.md`, which end in looking at a render. A face on the overused list in `tells.md` needs a written reason no other face meets; the subject's cliche is not one. A dark or loud palette chosen only to look different is a new default, not a fix.
- Missing content never shrinks the idea or drops a section. Author demonstration content (a demo's entries and data, sample names, example images) at full quality and label it as an example; dropping a bold idea because its demo content doesn't exist yet is timidity, not honesty. Claims and product facts are still never invented (SKILL.md).

## Mode limits

| Mode | The direction may set | It leaves alone |
|---|---|---|
| Persuade | Everything: structure, type, color, imagery, one expressive motion moment | Accessibility floor, honesty |
| Read | Type pairing, color, the frame around the reading column, imagery | The column itself (`typography.md`) |
| Operate | Type, palette, density, one signature detail | Layout conventions, controls, navigation (`apps-and-data.md`) |

A product that spans modes gets one direction that steps down: palette roles, type voice and the signature carry through; the structural ideas and expressive motion drop away.

## Check

- The rut and its opposite are named; seven candidates span three material families, each with a reason that carries the job and names its first screen.
- The plan file is filled, and the built candidate is the one the roll named, unless a factual reason is written in it.
- The action sits on the first screen in working form.
- Every section is in the world, not only the first screen.
- Each dealt world has a verdict, and the raises are disciplines, not clothes.
- The first screen shows this product's own thing, not a generic card or a centred headline over cards.
- Type and color were chosen on a render: the pairing beat another one, and the text reads easily at both widths.
- Nothing requires invented proof or product facts.
