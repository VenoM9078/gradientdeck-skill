# Craft

The floor every page must clear, whatever its direction. Read this immediately before writing or editing UI code, including small changes. The direction and the brand decide what the page is; this file decides whether it's well made. A brand's or user's explicit choice overrides a line here; your own habit doesn't.

Each line is a check on the rendered result, not an intention. Check them on your screenshots at 1440 and 390, all in one pass.

## Type

- SHOULD choose the body face first: easy to read at 16px, with regular, bold and italic. Then a headline face that differs from it in one clear way (structure, width or texture) and suits the tone. Two families at most; a third only for code or figures.
- AVOID condensed or monospace faces as the page's voice. Monospace is for code, data and values; condensed is for tight data or a single short display line.
- AVOID all-caps headings longer than three or four words. Capitals slow reading and turn loud at size.
- SHOULD size the largest heading to the message: at 1440 it stays under about 6rem and wraps to at most four lines. If it's bigger, the page is shouting.
- SHOULD keep a clear scale: each heading level differs from the next by size, and by weight where useful. Body text at least 16px (13–14px only in dense Operate UI), running text 45–75 characters per line.
- AVOID a small spaced-out label above every heading. Keep one only where it says something the heading doesn't.

## Color

- SHOULD name the strategy before choosing colors (restrained, committed, full palette, drenched; `color.md`) and keep to it across the page.
- SHOULD give the page one accent, used for the main action, the current selection and states. If three things compete for the eye, quiet two of them.
- SHOULD tint neutrals slightly toward the palette; grays, borders and dark surfaces belong to it.
- SHOULD choose light or dark from where the page is used (`color.md`), never to look different.
- MUST meet contrast: 4.5:1 for text, 3:1 for large text, including muted text and text on color.

## Space, boxes and borders

- SHOULD group with space and alignment first. A border, fill or shadow marks a real boundary, never decoration.
- AVOID boxes inside boxes. Inside a section, at most one level of bordered or filled container; content inside it is separated by space or a single rule.
- AVOID borders and fills on every element at once. Pick one way to separate surfaces and use it consistently (`space-and-layout.md`).
- SHOULD make the space between groups clearly larger than the space within them, about 1.5–2×, and leave a section room to breathe. Cramped reads cheap; space is not waste.
- SHOULD keep one container width and shared edges, so sections line up.

## By mode

- **Persuade:** one bold move, spent in one place (a color field, a scale jump, the page's object). Everything around it stays calm so the move reads. Commitment shows in palette and structure, not in making everything big.
- **Operate:** standard layout and controls (`apps-and-data.md`). One family, or one plus a face for figures. Restrained palette: neutrals carry the screen, the accent marks actions, selection and state only. Rows and tables over cards; a card holds one thing. The direction shows in type, palette and one small signature detail, never in the layout. No illustrations in the working area.
- **Read:** the column stays calm: 60–75 characters, body 16–20px, generous leading. The usual docs frame (sidebar, on-page contents) stays. Character lives in the frame and the headings, never in the text column.

## Verify before you finish

- At 390, nothing is cramped: no box inside a box, tap targets at least 44px, text not squeezed into narrow columns.
- The largest heading is under about 6rem at 1440 and no more than four lines.
- Two font families at most (plus one for code or figures), each with a job you can name.
- One accent leads the eye; nothing else shouts.
- Every border or box marks a real boundary.
