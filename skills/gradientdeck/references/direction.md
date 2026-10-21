# Direction

How to choose a visual direction for New world work: greenfield builds and redesigns. **In New world, this is required before any code.** Skip it in Extend and New surface: the existing system is the direction (`extend.md`).

Left alone, a model builds the first idea it ranks highest, and that idea is the one every other run would build too. So you write the candidates, and a roll decides which one gets built. Then a few dealt worlds push it further.

## 1. Ground in the subject

One line each:
- **Audience:** who arrives, what they already know, what they're afraid of.
- **Job:** the one thing a visitor must understand or do.
- **Action:** the control that does the job, in working form on the first screen (the order form, the install command, the booking slot, the call button). Not a link to it.
- **Scene:** where they are and what's around them when this matters (a 6am queue, a late-night deploy, a tax deadline).
- **Vocabulary:** the words users actually say. Not marketing words.

Then list 8–12 things only this subject has: objects, processes, units, rituals, documents, constraints. "Fast" and "easy" don't count.

## 2. Name the rut

Describe the page this category always ships (palette, type, first screen, imagery) and its predictable opposite (soft and friendly becomes stark and brutal). Rule out both, plus any of the four looks in `tells.md` that this category would land on.

## 3. Write seven candidates

Seven concrete worlds from the audience's life that could lend the page its materials: a printed object, a place, a vehicle, a ritual, a uniform, signage, a broadcast, a craft, a game. Not moods, not style labels.
- Cover at least three material families (paper and print; metal and machinery; textile; built space and signage; food and packaging; screen and broadcast; sport and play).
- At most one comes from the tools the audience uses for this job (a terminal for a developer tool, flour sacks for a bakery). At most one reads the product's name literally.
- Give each one line: its ground color, two or three main colors, where its type comes from, and the one thing it does that nothing else on the list does.
- Give each a reason: how its object carries the job or the action (which of its parts becomes the action, which of its states shows the product's facts). Colors and type are not a reason. A candidate with no honest reason is replaced before the roll, never rescued by it.

Rank them by how strongly the audience would recognise each as theirs.

## 4. Roll

Run the roll from the project folder:

```
node <skill folder>/scripts/roll.mjs --page index --job "<job>" --action "<action>"
  --candidates "<world name>: <reason> | <world name>: <reason> | ..." --mode persuade
```

Pass your seven in ranked order, best first, each with its reason after a colon; the roll refuses to run without them, the job and the action. `--page` names the page (`index`, `pricing`). Use `--mode operate` or `--mode read` for those surfaces. Its output is binding: it names the candidate to build (one of your top three), deals worlds to weigh against it, prints the composition rules for this mode, and saves the plan file (section 6). Follow it. If you can't run Node, build your third-ranked candidate with no dealt worlds, write the plan file's fields yourself, and say so in your report.

## 5. Weigh the dealt worlds

In Operate mode the roll deals no worlds; skip this step. Otherwise, follow the roll's instructions. In short: imagine the product built in each world's system, judge it against your assigned candidate on two things only (does the audience recognise it, is the product clearer), and write a verdict for each in the plan file. A world that wins both becomes the build. Every other world lends one discipline from its system to your direction, never a color, typeface or ornament.

## 6. Fill the plan

The roll saves `.gradientdeck/pages/<page>.md` in the project: the roll's key and pick, the job, the action, your ranked list, and blanks for the thesis, the first screen and one verdict per dealt world. Fill them before code. Rolling the same page again replaces the file whole; the job, action and worlds already dealt carry over. Later edits to the page read it as the page's intent.

The first screen is described spatially, as if to someone drawing it. Copy beside a picture is fine when the picture is this product's own thing, shown working (the order docket, the marked-up proof); a generic card or a centred headline over cards is not. The world carries every section, not just the first: a section that reads as ordinary docs, steps or a card grid in the world's colors has dropped it.

## 7. Present, build, re-roll

- **If you can ask the user,** follow the roll's PRESENT step: show the assigned direction committed, your pick if allowed, any world that won or came close, and the exits (bolder, safer, the category standard). Build what they choose.
- **If you can't ask,** build the assigned direction. End your report with one line offering a bolder or safer re-roll.
- **Before you finish,** render the page and run the `check` command the roll printed. It reads the plan back and lists what to verify on the screenshots. Fix what it finds as part of the taste-test (SKILL.md).
- **When the user asks to re-roll,** run the script again for the same page with `--register bolder` (a dealt world is built outright) or `--register safer` (one of your top three, executed straight). The plan file remembers the worlds already dealt, so none comes back. If they ask for the standard, build the category canon at full craft, measured against two or three real products they'd name. If they say they prefer one register for this product, add a dated line to `.gradientdeck/decisions.md`.

## Committing

- Build the direction you were given, not a safer reading of it. When torn between refined and committed, commit.
- The world shows across the page (its object, its structure, its colors), not as one sticker on a generic page. The ground can still be light and quiet.
- Name a color strategy: restrained, committed (one saturated color over a third of the page), full palette, or drenched. Bold usually means committed or drenched.
- Pick type and color by the procedures in `typography.md` and `color.md`, which end in looking at a render. Common faces and light grounds are allowed; a dark or loud palette, or an odd face, chosen only to look different is a new default, not a fix.
- Missing content never shrinks the idea. Write around missing facts and list them. Proof and product facts are still never invented (SKILL.md).
- Inherit any brand assets, colors or type the user supplied; the direction fills gaps around them.

## Mode limits

| Mode | The direction may set | It leaves alone |
|---|---|---|
| Persuade | Everything: structure, type, color, imagery, one expressive motion moment | Accessibility floor, honesty |
| Read | Type pairing, color, the frame around the reading column, imagery | The column itself (`typography.md`) |
| Operate | Type, palette, density, one signature detail | Layout conventions, controls, navigation (`apps-and-data.md`) |

A product that spans modes gets one direction that steps down: palette roles, type voice and the signature carry through; the structural ideas and expressive motion drop away.

## Check

- The rut and its opposite are named; seven candidates span three material families, each with a reason that carries the job.
- The plan file is filled, and the built candidate is the one the roll named, unless a factual reason is written in it.
- The action sits on the first screen in working form.
- Every section is in the world, not only the first screen.
- Each dealt world has a verdict, and the raises are disciplines, not clothes.
- The first screen shows this product's own thing, not a generic card or a centred headline over cards.
- Type and color were chosen on a render: the pairing beat another one, and the text reads easily at both widths.
- Nothing requires invented proof or product facts.
