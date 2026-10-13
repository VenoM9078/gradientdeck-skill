# Space and layout

Space is how a page says what belongs together and what matters. Grouping, rhythm and density are decided here; page structure lives in `composition.md`.

## Decide

1. **Inherit.** Use the existing spacing scale, grid and container widths (`extend.md`). Add a step only on purpose.
2. **Density.** From the mode: Operate dense, Read calm around a fixed column, Persuade generous and varied.
3. **Scale.** Base unit and a limited set of steps.
4. **Grid.** Column count and gutters from the content, then where (if anywhere) you break it.
5. **Rhythm.** Which sections are related (closer) and which are chapter breaks (further apart).

## Rules

- **SHOULD use one base unit** (4px or 8px) and a scale of 8–12 named steps that grow roughly geometrically (see Values). Every margin, padding and gap is a step. No one-off values.
- **SHOULD make relationships visible.** Space within a group is clearly smaller than space between groups, at least about 1.5–2×. A label sits closer to its field than to the next field; a heading sits closer to its own text than to the section above. If the gaps are equal, the grouping is invisible.
- **SHOULD group with space and alignment before borders, backgrounds or cards.** Add a container only for a real boundary (`tells.md`: cards inside cards).
- **SHOULD set density by mode:**
  - Operate: smaller steps, compact rows, more data per screen. Offer a density setting when users differ (power users vs occasional). Touch surfaces keep 44×44px targets even when dense.
  - Read: generous space around a calm column; spacing inside the text follows the type (paragraph spacing in `em`).
  - Persuade: large steps between sections, tight grouping within them. Contrast of space is part of the hierarchy.
- **SHOULD derive the grid from content.** 12 columns divides flexibly; 4–6 is often enough. Gutters come from the scale. Use CSS Grid for two-dimensional layout and `gap` instead of margins between siblings.
- **SHOULD break the grid deliberately, once.** A full-bleed image, an element hanging into the margin, an oversized figure: one per view, aligned to something even as it breaks. Accidental offsets of a few pixels look like mistakes (`principles.md`).
- **SHOULD align every element to a shared edge.** Prefer start-alignment for text-heavy content; center only short, standalone blocks. Align numbers right in tables, text left.
- **SHOULD optically adjust where geometry lies.** Icons next to text, play triangles in circles and round shapes next to square ones need small nudges to look aligned.
- **SHOULD constrain containers by content, not by habit.** Reading text: 45–75ch. Forms: one column, roughly 30–40rem. Dashboards and tables may use the full width. Center the container with `margin-inline: auto` and give it fluid side padding (`padding-inline: clamp(…)`), so content never touches the viewport edge.
- **SHOULD vary section spacing on purpose.** Related sections sit closer; a change of subject gets a larger gap or a surface change. Identical padding on every section produces a monotonous scroll where nothing groups.
- **SHOULD treat whitespace as structure.** Empty space separates, frames and points. Don't fill a gap because it is empty; ask what the space is doing.
- **SHOULD use asymmetry where it helps the eye move**: an offset headline, unequal columns (for example 5/7 or 4/8), a weighted side. Symmetry is fine when the content is truly paired.
- **SHOULD keep elevation scarce.** Two or three levels: page, raised surface (rarely needed), floating (menus, popovers, dialogs, toasts). Shadow only what actually floats above the page. Keep `z-index` values as named tokens per layer, not ad hoc numbers.
- **SHOULD treat radius as a token set of two or three values**, chosen from the subject's objects and the direction, not left at the framework default. Nested corners stay concentric: inner radius ≈ outer radius minus the padding between them.
- **SHOULD use logical properties** (`margin-inline`, `padding-block`, `inset-inline-start`) so layouts survive right-to-left languages.
- **MUST keep reflow working.** Content fits a 320 CSS px wide viewport without horizontal scrolling (data tables and maps excepted), and spacing tokens may shrink at narrow widths but never to zero between groups (`responsive.md`).

## Values

| Measure | Range |
|---|---|
| Base unit | 4px or 8px |
| Example scale (4px base) | 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 |
| Between-group : within-group gap | at least about 1.5–2 : 1 |
| Reading column | 45–75ch |
| Single-column form | about 30–40rem |
| Operate row height, compact | 28–36px |
| Operate row height, comfortable | 40–48px |
| Touch target minimum | 44×44px |
| Pointer target minimum | 24×24px |
| Persuade section gap, desktop | roughly 64–160px, varied by relationship |
| Elevation levels | 2–3 |

The example scale shows the shape (dense at the small end, wider jumps at the large end), not a required set.

## Generic defaults to catch

Card and grid tells are in `tells.md` (identical card rows, bento by default, borders around everything). Also catch:

- **The same section padding everywhere** (`py-24` on every block) → rhythm with no meaning → vary by relationship.
- **One gap value for everything** (`gap-6` at every level) → grouping disappears → within-group smaller, between-group larger.
- **Everything centered in one fixed-width container** → no axis, no tension → choose alignment per block; let some things bleed or offset.
- **Equal padding on all cards regardless of content** → the box decides, not the content → size padding to what's inside.
- **Shadows on every surface** → elevation as decoration → shadow only floating layers.
- **Content touching the viewport edge on mobile, or huge empty margins on wide screens** → container not designed → fluid side padding, max-width from content.
- **Arbitrary values** (`mt-[13px]`) → bypasses the system → use a step or add one deliberately.

## Check

- Every spacing value in the code maps to a scale token.
- Squint test: groups are visible from spacing alone; between-group gaps are clearly larger than within-group gaps.
- Labels sit closer to their fields, headings closer to their content, than to neighbours.
- Section gaps differ where the relationship differs.
- Every element aligns to a grid line or shared edge; any grid break is single and intentional.
- Reading text stays within 45–75ch; forms are one comfortable column.
- Shadows appear only on floating layers; at most three elevation levels.
- No horizontal scroll at 320px wide; no content flush to the viewport edge.
- Operate screens show more content per screen than a Persuade page would, without targets dropping below 24px (44px on touch).
