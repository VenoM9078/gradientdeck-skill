# Extend

How to work inside an existing codebase: Extend (adding to a look that already exists) and New surface (a new kind of page in that look). The existing system is the authority (`principles.md`, SKILL.md inputs). Your job is to make new work indistinguishable from the best existing work, not to improve the system while nobody's looking.

## Decide

Inventory before you write a line. Spend the time; it's cheaper than undoing a drifted page.

1. **Find the tokens.** Look, in roughly this order:
   - `DESIGN.md` and `.gradientdeck/decisions.md` (`design-md.md`).
   - Tailwind v4 `@theme` blocks in CSS, or `tailwind.config.*` (`theme.extend`).
   - CSS custom properties on `:root`, `[data-theme]` or `.dark`.
   - CSS-in-JS theme objects (a `theme.ts`, a styled-system or emotion theme provider).
   - Design-token JSON or YAML (a `tokens/` folder, a build step that emits CSS variables).
2. **Find the components.** A `components/` or `ui/` folder, a `components.json` (copied-in primitives), a component-library theme (MUI, Chakra or similar `createTheme`/`extendTheme`), Storybook stories if present. Note which components exist, their variants and their props.
3. **Find the nearest sibling.** The existing page most similar to what you're building (same mode, similar content). It is your template for spacing, heading levels, section rhythm, container widths and how components are combined.
4. **Measure what's used, not just what's declared.** Search the code for actual values: spacing classes or values, radii, font sizes, weights, colours, shadows. Count frequency. The de facto scale is the set of values used often; a declared token nobody uses is not part of the system. Note outliers and drift (near-duplicate greys, a stray radius), but don't "fix" them unless asked.
5. **Note conventions.** File layout, component naming, class style (utility classes, CSS modules, styled components), how variants are expressed, how icons are imported, how copy is written (sentence case or title case, tone).

## Pre-flight contract

Before building, state this in your design note (it replaces the direction for Extend and New surface):

```
Situation: Extend | New surface    Mode: <...>
Template: <nearest sibling page/file>
Reusing: <tokens, components, patterns>
New: <each new token/component/variant, and why nothing existing fits>
Not touching: <files, global styles, shared components you'll leave alone>
Flags: <existing problems noticed, reported separately>
```

## Rules

- MUST use existing tokens. Semantic tokens (text, surface, accent, border) before raw scale steps; never raw values. If no token fits, add one to the token source on purpose and list it under New.
- MUST keep global CSS append-only. Don't edit or reorder existing global rules, resets or base styles; add scoped rules after them.
- MUST NOT add a dependency (UI library, icon set, font, animation library) without asking.
- SHOULD reach for, in this order: an existing component as-is → a composition of existing components → an existing variant → a new variant on an existing component → a new component. Overrides (one-off class or style props fighting the component) come last and need a reason.
- SHOULD match the sibling's structure: same container, same heading scale, same section spacing, same way of handling empty and loading states.
- SHOULD match conventions exactly: file names, export style, prop names, class ordering, copy tone. New code should look like the same team wrote it.
- SHOULD place any new component where existing ones live, built the way they're built.
- AVOID importing your own taste. The generic defaults in `tells.md` still apply to what you add, but if the existing system already uses one of them, it's the system: match it and mention it in Flags if it hurts.
- AVOID "while I'm here" fixes. Drift, inconsistent spacing, weak contrast or an outdated pattern in existing code go in Flags, not in the diff, unless the user asked for cleanup.
- NEVER ship an accessibility failure because the existing system has it. If inheriting a token would fail contrast or focus visibility, fix it locally for your work, and flag the source.

## New surface

The look is inherited; only structure is yours.

- Inherit tokens, components and voice completely, exactly as in Extend.
- Decide the structure for this new kind of page using `composition.md` (and `apps-and-data.md` for Operate surfaces). The sibling still sets container widths, spacing rhythm and heading levels even if its content is different.
- If the page genuinely needs something the system lacks (a pricing table, a comparison grid, a docs sidebar), build it from existing tokens and the closest existing component's anatomy. List it under New.
- Don't introduce a second visual language for the new page. If it needs more expression (a first marketing page in an app-only codebase), raise the expression through layout and content, not new colours or fonts, and say so in the note. If the user wants a new look, that's New world: load `direction.md`.

## The `extract` command

Write `DESIGN.md` from the code, in the format in `design-md.md`.

1. Run steps 1–5 above.
2. Record tokens as they're used: the de facto scale, not every declared value. Map raw values to semantic roles where usage makes the role clear (the colour on every body paragraph is the text colour).
3. Mark provenance and confidence for each token: where it came from (file and token name, or "inferred from usage, N occurrences") and high / medium / low confidence. Low means the role is a guess.
4. Write the prose sections from what the code does, not from what you'd prefer. Put drift and conflicts in a short "Open questions" list at the end, for the user to decide.
5. Note the mode for each main route (marketing pages Persuade, app routes Operate, docs Read).
6. Don't change any code during `extract`.

## Generic defaults to catch

- **A new button or card that duplicates an existing one** → the system forks → search for the component first; extend with a variant.
- **Raw values in new code** (`#3b4252`, `13px`, `rounded-[7px]`) → instant drift → map to the nearest token or add one deliberately.
- **A new page that's "better" than its siblings** (different spacing, new font size, new shadow) → reads as a different product → match the sibling, flag what you'd change.
- **A quiet global refactor** (renamed tokens, changed base font size) inside a feature change → breaks pages you didn't look at → separate change, with permission.
- **Fresh decoration on an inherited page** (a gradient section, a glow) → your taste overriding theirs → only if the system already does it.

## Check

- Every colour, size, radius, shadow and spacing value in the diff references a token.
- No new dependency; global CSS changes are additions only.
- Each new component, variant or token is listed with a reason.
- Side by side with the sibling at 1440 and 390, the new page looks like the same product.
- Existing problems are reported in Flags, not silently changed.
- After `extract`: every token in `DESIGN.md` has a source and a confidence.
