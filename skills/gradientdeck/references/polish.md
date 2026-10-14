# Polish

The final craft pass on UI that already works. Polish changes details, not decisions: if something structural is wrong, that's a review finding (`review.md`), not polish. Done in a fixed order so earlier fixes don't get undone by later ones.

## Rules

- SHOULD change nothing structural: no new sections, no layout changes, no new colours, fonts or components. If you find a structural problem, report it instead.
- SHOULD work through the passes below in order, collect all fixes, apply them as one batch, then verify once (render at 1440, 768 and 390, plus 320 for overflow, if a browser tool is available). One batch, one verify.
- MUST keep every fix on-system: polish values come from existing tokens. A polish pass that adds raw values is creating drift.
- MUST NOT lower any accessibility property while polishing (contrast, focus, target size, reduced motion).
- In Extend, polish only the work in scope. Existing pages' issues go in a list for the user.

## Passes, in order

### 1. Alignment

- Every element aligns to a grid line, an edge or a baseline. Hunt for things off by 1–4px; they look like mistakes (`space-and-layout.md`).
- Optical alignment: icons next to text centred on the x-height or cap height, not the line box; round and pointed shapes (play icons, circles) nudged so they look centred; large headings hung so the letter's edge, not its side bearing, lines up with body text.
- Numbers in tables right-aligned or decimal-aligned; labels and inputs share a left edge.

### 2. Spacing consistency

- The same relationship uses the same gap everywhere: card padding, heading-to-body, section-to-section.
- Spacing between groups is visibly larger than within them.
- Replace near-duplicates (14px next to 16px) with the scale value they were meant to be.

### 3. Type details

- Headings use `text-wrap: balance`; paragraphs use `text-wrap: pretty` to avoid one-word last lines. Check the result; fix stubborn widows with copy, not `&nbsp;` everywhere.
- Ragged right edge doesn't form shapes (steps, wedges) in short text blocks.
- Tabular numerals (`font-variant-numeric: tabular-nums`) wherever numbers stack or update: tables, prices, timers, stats.
- Real punctuation: curly quotes and apostrophes, en dashes for ranges, the multiplication sign for dimensions, ellipsis character. No straight quotes in display text.
- All-caps text gets slightly positive letter-spacing; large display text usually needs slightly negative. Check against `typography.md`.
- No fallback font flashes or faux bold/italic (a weight or style that isn't loaded).

### 4. Colour consistency and contrast

- Every colour maps to a role token; no two near-identical greys doing the same job.
- Re-check contrast on every text-on-surface pair, including placeholder text, disabled text, text on images and both themes if dark mode exists (`color.md`).
- Borders and dividers at one consistent strength.

### 5. States completeness

- Every interactive element has hover, focus-visible, active and disabled styles where they apply; focus is visible on every background.
- Forms have error, success and loading states; lists and tables have empty and loading states (`interaction.md`).
- Loading states don't shift the layout when content arrives.

### 6. Motion details

- Transitions name their properties; no `transition: all`.
- Durations and easing consistent across similar elements; exits faster than entrances.
- Every animation has a `prefers-reduced-motion` alternative (`motion.md`).

### 7. Images

- Crops keep the subject's important part at every breakpoint (`object-position` set on purpose).
- Images sharp at 2× density, not upscaled; sizes and `srcset` sensible.
- One consistent treatment: same radius, same aspect ratios within a set, same colour handling (`imagery.md`).
- Every image has appropriate `alt` text, or empty `alt` if decorative.

### 8. Copy tightening

- Cut words that don't change meaning. Buttons name the action. Error messages say what happened and what to do (`copy.md`).
- Consistent case (sentence or title) and terminology across the page.
- No visible placeholders ("[…]", "TBD", "to be supplied"); every gap is an HTML comment and is listed in your report.
- Read strings your code assembles (button labels, totals, counts) as they render: spaces, plurals, units. "Add mug inash" ships easily.
- Open and close every drawer, modal and menu once; nothing may be stuck open on load.

### 9. Craft floor

- `::selection` colour on-brand and readable.
- `caret-color` set on inputs if the accent supports it.
- Focus ring styled to the system, offset so it doesn't collide with borders.
- Scrollbars: styled only if the design needs it, never hidden on scrollable regions.
- Favicon present; `<title>` and meta description specific to the page; `theme-color` set if the page has a strong surface colour.

### 10. Responsive edges

- No horizontal overflow at 320px. Long words, URLs and numbers wrap or truncate deliberately.
- Tap targets 44×44px on touch layouts; hover-only affordances have a touch equivalent (`responsive.md`).
- Check the awkward widths between breakpoints (around 900–1100px), not only the named ones.

### 11. Performance basics

- No layout shift: images and embeds have dimensions or `aspect-ratio`; fonts use `font-display` and a size-matched fallback.
- Only the font weights actually used are loaded; the main one is preloaded.
- Images below the fold lazy-load; the largest above-the-fold image doesn't.

## Check

- The diff touches only details: no new sections, colours, fonts or components.
- Every value in the diff references a token.
- One batch of fixes, verified once, with the render widths stated in the report.
- Contrast, focus and reduced motion are at least as good as before.
- Structural problems found during polish are listed for the user, not fixed silently.
