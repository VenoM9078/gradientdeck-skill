# Principles

The judgment underneath every other file. When a specific rule doesn't cover the case, decide from these.

## The specificity test

Before you call anything finished, ask: **could an unrelated product use this page unchanged, with only the name swapped?** If yes, it is generic, however polished it looks. Specific design comes from the subject: its audience, the material world it lives in, the words its users actually use, the job the page has to do. Average design comes from the medium: what websites usually look like.

Run the test on the direction before you build, and again on the rendered result.

## Every choice has a source

Each major choice (typeface, palette strategy, page structure, the bold move, the image approach) must trace to one of four sources:

1. **The brief:** something the user said or supplied.
2. **The subject:** an item from the subject inventory (`direction.md`) or the product's real content.
3. **The existing system:** tokens, components or pages already in the codebase (`extend.md`).
4. **A requirement:** accessibility, platform convention or a technical constraint.

A choice that traces to none of these is a default wearing a disguise. Find it a source or replace it with one that has one. Name the source for each major choice in the design note; one short clause each is enough.

## Hierarchy

- One thing per view is the most important. Decide what it is, then make it unmistakable using **one or two** of size, weight, color, position and space. Using all five at once flattens hierarchy again.
- Each level should differ clearly from the next. If two levels look almost the same, merge them or separate them further.
- Read the page with your eyes half-closed (or at 25% zoom). The order you notice things in should be the order that matters.

## Contrast is how attention moves

Contrast of size, weight, value, color, density and space directs the eye. A page where everything has the same contrast has no hierarchy. Quiet areas are what make loud areas work: you SHOULD leave most of the page calm so the important part can be loud.

## Proximity, alignment, repetition

- Things that belong together sit closer to each other than to anything else. Spacing between groups is larger than spacing within them, visibly.
- Every element aligns to something: a grid line, an edge, a baseline. Elements that are almost aligned look like mistakes.
- Repeat decisions. The same kind of thing looks the same everywhere. Variation should mean something.

## Restraint

- One idea per page, committed everywhere. The idea can set the palette, the type and the structure of the whole page; what stays single is the stunt (a striking type treatment, an unusual layout move, a distinctive image). Two or three stunts at once compete and read as noise.
- Every element earns its place. For each section, card, icon, divider, badge and animation, ask what breaks if it's removed. If nothing breaks, remove it.
- Decoration without a job is the fastest way to look generated. Gradients, glows, blobs, grain, icons in tiles and section dividers all need a reason that comes from the subject.
- Restraint is not drabness. A page with no color, no depth and no imagery doesn't look considered; it looks unfinished. Keep the warmth and richness the subject offers.

## Consistency beats novelty in Operate mode

On working screens, users learn the interface. Familiar controls, predictable placement and consistent states are what make it feel good. Express personality through type, color and one signature detail, not through custom controls or rearranged conventions.

## Honesty

Design that implies something false is broken design, however it looks. No invented numbers, logos or quotes. No controls that look clickable but aren't. No progress that isn't real. No "limited time" urgency that isn't true.

## The first idea is spent

Your first instinct for any visual choice (the first typeface that comes to mind, the first palette, the first layout) is probably the most common one, which makes it the most generic. Treat it as a reference point, not an answer. Generate alternatives, then choose the one that best fits the subject, which may still be the first one, but now it's a choice with a reason.

## Commit

In New world work, the softened version of a direction is the most common failure: the idea shows up in the hero and the rest of the page turns back into the category default. Build the direction you chose, at full strength. When torn between refined and committed, commit. If the user wants it safer, they'll say so, and the re-roll offer at the end of every New world build gives them the door (`direction.md`).

## Steering verbs

When the user asks for one of these, change by **one step** and keep everything else.

| Verb | What actually changes |
|---|---|
| `bolder` | Raise contrast on the one hero element: larger scale jump, heavier weight or a committed color field. Remove a competing element. Don't add decoration. |
| `quieter` | Lower saturation and the number of colors in use, reduce the scale jump, remove one ornament, increase space. Keep the one idea; turn its volume down. |
| `simplify` | Remove elements until each remaining one has a job. Merge sections that say the same thing. Fewer type sizes, fewer colors, fewer borders. |
| `more premium` | Usually means more restraint and better craft, not more effects: tighter type, more space, fewer colors, better images, crisper details. Say this back to the user. |
| `more fun` / `more playful` | Find play in the subject (its objects, its language), not in generic bounce and confetti. One playful move, not ten. |
| `more modern` | Ask what feels dated to them. Usually: heavy shadows, crowded layouts, browser defaults. Fix those, then raise the finish (`craft.md`, Web material and finish): precise type spacing, layered surfaces, light with a source, motion that shows state. No effects without a source. |

If a request is vague ("make it pop"), state your interpretation in one line, then make the change.
