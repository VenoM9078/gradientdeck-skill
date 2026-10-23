# Craft

The floor every page must clear, whatever its direction. Read this immediately before writing or editing UI code, including small changes. The direction and the brand decide what the page is; this file decides whether it's well made. A brand's or user's explicit choice overrides a line here; your own habit doesn't.

Each line is a check on the rendered result, not an intention. Check them on your screenshots at 1440 and 390, all in one pass. With every line met, spend everything else on the committed idea; when torn between refined and committed, commit.

## Type

- SHOULD choose the body face first: easy to read at 16px, with regular, bold and italic. Then a headline face that differs from it in one clear way (structure, width or texture) and suits the tone. Two families at most; a third only for code or figures. In Persuade work, a face on the overused list in `tells.md` needs a reason in the plan no other face meets.
- AVOID condensed or monospace faces as the page's voice. Monospace is for code, data and values; condensed is for tight data or a single short display line.
- AVOID all-caps headings longer than three or four words. Capitals slow reading and turn loud at size.
- SHOULD size the largest heading to the message: at 1440 it stays under about 6rem and wraps to at most four lines. If it's bigger, the page is shouting.
- SHOULD keep a clear scale: each heading level differs from the next by size, and by weight where useful. Body text at least 16px (13–14px only in dense Operate UI), running text 45–75 characters per line.

## Color

- SHOULD name the strategy before choosing colors (restrained, committed, full palette, drenched; `color.md`) and keep to it across the page.
- SHOULD give the page one accent, used for the main action, the current selection and states. If three things compete for the eye, quiet two of them.
- SHOULD tint neutrals slightly toward the palette; grays, borders and dark surfaces belong to it. Secondary text on color is tinted from that color, never plain gray.
- SHOULD choose light or dark from where the page is used (`color.md`), never to look different.
- MUST meet contrast: 4.5:1 for text, 3:1 for large text, including muted text and text on color.

## Space, boxes and borders

- SHOULD group with space and alignment first. A border, fill or shadow marks a real boundary, never decoration.
- AVOID boxes inside boxes. Inside a section, at most one level of bordered or filled container; content inside it is separated by space or a single rule. The exception is the product's own interface shown working: its panels nest as the real product's do.
- AVOID borders and fills on every element at once. Pick one way to separate surfaces and use it consistently (`space-and-layout.md`).
- SHOULD make the space between groups clearly larger than the space within them, about 1.5–2×, and leave a section room to breathe. Cramped reads cheap; space is not waste.
- SHOULD keep one container width and shared edges, so sections line up.

## Finish values

Defaults for the details models leave at browser settings. The world or brand overrides any of them on purpose.

| Detail | Default |
|---|---|
| Corners | One radius family. Cards and panels about 8–16px, controls the same or smaller, full pills only for small controls and tags |
| Shadows | An offset and a soft blur (blur at least twice the offset), tinted toward the ground. Never a zero-offset colored halo. One elevation method: border or shadow, not both |
| Borders | 1px. On dark grounds a hairline a few steps lighter than the surface |
| Space around headings | About twice as much space above a heading as below it |
| Line height | Display 1.0–1.15, headings 1.15–1.3, body 1.5–1.7 |
| Display tracking | −0.01 to −0.03em for large sizes; never tighter than −0.04em. Small caps and labels get slight positive tracking |
| Section spacing (Persuade) | About 96–160px between sections at 1440, 56–96px at 390 |
| Buttons | Horizontal padding about 1.5–2× the vertical; at least 44px tall on touch |
| Weights | Two or three per family, each with a job |

## Web material and finish

The web has its own materials: light, geometry, motion and layered surfaces. They are as valid as paper or metal when they come from what the product does.

- SHOULD build the technique the direction names (canvas, SVG geometry, animated lines, a shader, view transitions), not a static picture of it. Drive it from the product's behaviour or data. Its first frame reads on its own; reduced motion shows that frame still.
- SHOULD draw with exact geometry: crisp shapes, diagrams, lines and grids you can specify. AVOID sketchy SVG scenes that imitate illustration, and grids or stripes with nothing measured under them.
- SHOULD give light one source and a falloff: a gradient or glow starts where something happens (the output, the active state) and fades. Two light sources compete.
- SHOULD show depth on dark grounds by lightness: each raised surface a step lighter.
- SHOULD spend motion on one authored moment and on state changes: 150–300ms, ease-out, from an already visible state. Blur, mask and clip-path are material too, not just fades.
- SHOULD theme what the browser draws: text selection, caret, scrollbars, focus ring, link underline offset, and tabular figures in numbers that line up. It's the cheapest sign a page was built, not assembled.

## Refuse

Defaults that mark a page as generated. The brief's own words can earn any of them back; your habit can't.

- A small spaced-out label (eyebrow) above headings. The heading carries itself.
- A row of same-size cards, each an icon tile, a title and two lines, as the page's structure.
- Section numbers (01 / 02 / 03) on content that isn't a sequence.
- Gradient text; glass and blur as decoration; a thick colored border on one side of cards.
- Monospace as "technical" costume; emoji or Unicode symbols as icons.
- Sketch-style SVG scenes standing in for real illustration or a photograph.
- A page about a place, food, a craft or an event with no photograph of it.

## By mode

- **Persuade: the visitor gets it, wants it and acts.** One idea owns the page, and one bold move is spent in one place (a color field, a scale jump, the page's object, the signature moment); around it, things stay calm so the move reads. Pace the scroll: vary density, scale, imagery and quiet inside one system; a dense passage earns a quiet one, no two neighbouring sections share a shape, and the page ends on a real close with the action in working form.
- **Operate: the task gets done fast, every day.** Standard layout and controls (`apps-and-data.md`). One family, or one plus a face for figures. Restrained palette: neutrals carry the screen, the accent marks actions, selection and state only. Rows and tables over cards; a card holds one thing. Character lives in precise details: type, palette, states and one small signature, never the layout. No illustrations in the working area.
- **Read: the reader understands and stays.** The column stays calm: 60–75 characters, body 16–20px, generous leading. The usual docs frame (sidebar, on-page contents) stays. Character lives in the frame, the headings and the imagery, never in the text column.

## Verify before you finish

- At 390, nothing is cramped: no box inside a box, tap targets at least 44px, text not squeezed into narrow columns.
- The largest heading is under about 6rem at 1440 and no more than four lines.
- Two font families at most (plus one for code or figures), each with a job you can name.
- One accent leads the eye; nothing else shouts.
- Every border or box marks a real boundary; corners, shadows and spacing follow the finish values or a stated reason.
- Neighbouring sections differ in shape and density, and the page ends on a real close.
- Any glow, gradient or animated visual has a source in the product, and the product's interface, if shown, works.
- Selection, focus and scrollbars belong to the palette. Nothing from the Refuse list is left.
