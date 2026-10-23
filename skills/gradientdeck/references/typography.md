# Typography

Type carries most of a page's voice and nearly all of its usability. Choose faces by procedure, judged on the render, then set them by measurable rules.

## Decide

1. **Inherit.** If the codebase or brand has faces and a scale, use them (`extend.md`). Everything below fills gaps.
2. **Tone.** In a few words, how should the type feel to this audience: warm, exact, plain-spoken, official, playful? The subject's real lettering (labels, signage, manuals) can suggest the tone, but don't copy it as costume: no monospace for a timetable or stencil for a crate unless the content is that thing.
3. **Use.** Which mode (Persuade, Operate, Read), and what is the smallest size text will be read at? Operate faces are chosen for 12–14px; display faces for one headline.
4. **Pair.** Choose the reading face first: legible at body size, with the weights you need (table below). Then a headline face that differs from it in one clear way and suits the tone. In Persuade work, the overused faces in `tells.md` need a reason no other face meets; in Operate and Read, workhorse faces are fine. A face is not better for being unusual either. Write down two pairings.
5. **Roles.** Decide how many faces (one or two, rarely three) and what each one does.
6. **Look.** Before building the page, render the real headline, a paragraph and the main button in both pairings, at desktop and phone width (a throwaway specimen file is enough). Keep the one that reads more easily and feels more like the product. Judge the render, not the name.

## Evaluate a candidate

| Check | What to look at |
|---|---|
| x-height | Tall x-height reads better small; Operate and body text need it. Compare at the same pixel size, not the same name size |
| Width | Narrow faces fit tables and nav; wide ones need shorter lines and more space |
| Contrast | High stroke contrast thins out and breaks up at small sizes and on low-density screens; keep it for display |
| Weights | Body needs regular, medium or semibold, bold, and a true italic if you'll use it. Don't let the browser fake bold or italic (`font-synthesis: none` exposes gaps) |
| Numerals | Tabular and lining figures for data; oldstyle for prose if Read mode wants them. Check via `font-variant-numeric`, not by assuming |
| Language | Glyph coverage for every language the product ships: diacritics, punctuation, other scripts. Test real strings, including names |
| Small sizes | Render 12–14px on a standard-density screen. Distinguish `Il1`, `O0`, `rn/m` |
| License and weight | Web license for self-hosting; WOFF2; total font payload. Each extra weight or style is a request |

Reject a face that fails any check the product depends on, however well it fits the mood.

## Rules

- **SHOULD pair by role, not by contrast in everything.** Two faces need one clear difference (structure, width or texture) and shared proportions (similar x-height, compatible widths). If you can't state what each face is for, use one face with weight and size contrast.
- **SHOULD limit sizes.** Operate: 5–7 sizes. Read: 5–6. Persuade: 6–8, with one or two display sizes. Each size is a token; no one-off sizes.
- **SHOULD choose the ratio from the mode** (table below). A small ratio with many steps reads as indecisive; a large ratio in Operate wastes space.
- **SHOULD keep body text at least 16px** in Read and Persuade. Operate may set dense UI text at 13–14px when the face has a tall x-height and contrast passes.
- **SHOULD set line length to 45–75ch** for running text (`max-inline-size: 65ch` on the text block, not the page). Captions and UI labels can be shorter.
- **SHOULD tighten large type, loosen small caps.** Display sizes usually need negative tracking; all-caps and small caps need positive tracking. Body text stays at 0. Set tracking in `em` so it scales with size.
- **SHOULD set line height inversely to size:** looser for body, tighter for headings. Use unitless values so they scale.
- **SHOULD use weight steps a reader can see.** Adjacent hierarchy levels differ by at least 200 in weight or a clear size step; 400 vs 500 alone reads as a mistake.
- **SHOULD use tabular figures** (`font-variant-numeric: tabular-nums`) wherever numbers align or change in place: tables, prices in lists, timers, counters, financial values.
- **SHOULD balance headings, polish paragraphs.** `text-wrap: balance` for headings and short blocks (browsers only balance a few lines, so don't rely on it for long text); `text-wrap: pretty` for body to avoid a lone last word. Both are progressive enhancement; the layout must work without them.
- **SHOULD hyphenate only narrow justified or narrow-column text**, with `hyphens: auto` and a correct `lang` attribute on `<html>` (hyphenation dictionaries depend on it). Don't justify text in narrow columns without hyphenation.
- **SHOULD let long strings break.** URLs, emails and IDs get `overflow-wrap: anywhere` (or `break-word`) in containers that can be narrow.
- **MUST keep fluid type zoomable.** With `clamp()`, the preferred value mixes `rem` and `vw` (for example `clamp(2rem, 1.2rem + 3vw, 4rem)`). A `vw`-only value doesn't grow with browser zoom and fails text resizing to 200%.
- **SHOULD scale display sizes fluidly and keep body sizes nearly fixed.** Large headings may span 1.5–2.5× between narrow and wide viewports; body text changes by a pixel or two at most.
- **SHOULD prevent layout shift from font loading.** Self-host WOFF2, preload only the one or two files used above the fold, use `font-display: swap` (or `optional` where a late font swap is worse than the fallback), and tune a local fallback with `size-adjust`, `ascent-override`, `descent-override` and `line-gap-override` so it occupies the same space.
- **SHOULD subset** with `unicode-range` when a face covers scripts the page doesn't use.
- **SHOULD prefer variable fonts** when you need three or more weights or widths: one file, intermediate weights for fine hierarchy, and an optical-size axis where the face has one (`font-optical-sizing: auto` is the default; don't turn it off). Set weight with `font-weight`, not `font-variation-settings`, so inheritance and fallbacks still work.
- **MUST keep lowered-emphasis text above the contrast floor.** Muted gray is a hierarchy level, not an exemption (`color.md`).

## Values

| Measure | Range |
|---|---|
| Scale ratio, Operate | 1.125–1.2 |
| Scale ratio, Read | 1.2–1.25 |
| Scale ratio, Persuade | 1.25–1.5, display steps may jump further |
| Line length, running text | 45–75ch (about 65 ideal) |
| Line height, body | 1.4–1.6 (longer lines want the upper end) |
| Line height, headings | 1.0–1.25 |
| Line height, dense UI | 1.25–1.45 |
| Tracking, display (40px+) | −0.01 to −0.03em |
| Tracking, all-caps / small caps | +0.04 to +0.12em |
| Tracking, body | 0 |
| Paragraph spacing | 0.75–1.25em, or one line-height |

These are ranges for optical adjustment; check the actual face, since x-height and spacing vary a lot between faces.

## Generic defaults to catch

Type-level tells are in `tells.md` (one sans for everything, the neighbour swap, eyebrow labels, emphasis words, costume monospace). Also catch:

- **The framework's default stack or default scale left untouched** → no decision was made → run the Decide steps; build a scale from the mode's ratio.
- **Headings bolder but not larger, or larger but not bolder, at every level** → flat hierarchy → each level differs clearly from its neighbours by size and, where useful, weight.
- **Light weights (100–300) for body or small text** → thin strokes read as lower contrast than the measured ratio → light weights only at display sizes.
- **Positive tracking on big headlines, or none on caps** → backwards → tighten large, loosen caps.
- **Full-width paragraphs on wide screens** → 120+ characters per line → constrain the text block.
- **Centered multi-line body text** → hard to scan → left-align (start-align) anything longer than three lines.
- **Loading five weights "just in case"** → slow and shifty → load only the styles the tokens use.

## Check

- Every face and size on the page maps to a token; no stray sizes.
- You can say what each face does, and which other pairing it beat on the render.
- Running text measures 45–75 characters per line at 1440 and 390 wide.
- Body is at least 16px (13–14px only in dense Operate UI), line height in range.
- Numbers in tables, prices and counters use tabular figures; columns of numbers align.
- Headings have no single-word last lines; long URLs don't overflow on 390px.
- Zooming to 200% enlarges all text, including fluid headings.
- No visible jump when web fonts load on a cold cache (throttle to check); no faux bold or italic.
- Every language the product ships renders without fallback glyphs.
