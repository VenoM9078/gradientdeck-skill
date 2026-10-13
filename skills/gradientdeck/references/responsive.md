# Responsive

Design for the content, not for named devices. A layout should hold at any width, from a narrow phone to a wide monitor, and most breakage comes from a few mechanical mistakes you can check in the code.

## Decide

1. **Which width do most users have?** Check analytics or the context: consumer and Persuade pages are often mostly phone; Operate tools are often mostly desktop. Design that width first.
2. **Mobile-first or desktop-first CSS?** SHOULD write mobile-first (`min-width` queries) for content sites and Persuade pages, where the small layout is the simple one. A dense Operate tool may start from desktop and decide, per screen, what the small version is for. Either way, decide; don't just shrink the desktop.
3. **What does each screen do on a phone?** Sometimes the same task; sometimes a subset (review and approve, not bulk edit). Decide the task, then the layout.
4. **Where does the layout break?** Widen and narrow the window slowly. Put a breakpoint where the content stops working (line too long, columns too cramped), not at device widths.

## Rules

### Layout

- Small screens SHOULD use a single column. Side-by-side only when both items stay readable.
- Reflow order MUST keep meaning: the visual order on mobile matches the source order. Don't reorder with `order` or grid placement in a way that makes keyboard and screen-reader order differ from what people see.
- NEVER hide content people need on mobile. Collapse it (disclosure, tabs) instead of removing it. Hide only true decoration.
- Use intrinsic layouts where they fit (`flex-wrap`, `grid-template-columns: repeat(auto-fit, minmax(min(100%, <size>), 1fr))`) so fewer breakpoints are needed. Container queries suit components that appear in containers of different widths.
- Line length still applies at every width: body text 45–75 characters per line; cap the measure on wide screens rather than letting text run edge to edge.

### Touch

- Targets MUST be at least 44×44px on touch surfaces (and at least 24×24px everywhere; see SKILL.md). Extend the hit area with padding or a pseudo-element if the visual is smaller.
- Leave at least 8px between adjacent touch targets so a miss doesn't hit the neighbour.
- Hover-only interactions MUST have a touch and keyboard equivalent: menus open on tap and focus, tooltip content is reachable without hover, row actions are visible or in a menu. Scope hover styles with `@media (hover: hover) and (pointer: fine)`.
- Primary actions on phone screens SHOULD sit within thumb reach (lower half) when the screen is task-focused.

### Type

- Scale display sizes fluidly with `clamp()` whose preferred value mixes `rem` and `vw`, so text still responds to browser zoom (`typography.md`).
- Body text SHOULD stay around 16px or more on phones; reduce the scale ratio between heading levels on small screens rather than shrinking body text.
- Form inputs SHOULD use at least 16px font size on mobile; smaller text makes iOS Safari zoom the page on focus. NEVER disable zoom (`maximum-scale=1`, `user-scalable=no`) to avoid it (1.4.4).

### Navigation

- Five or fewer destinations can stay visible on phones (a short top bar or a bottom bar). More go behind a clearly labelled menu button; the current section stays visible.
- A collapsed menu is a disclosure: a button with `aria-expanded`, focus moves into it, Escape closes it.

### Mechanical rules

- Flex and grid children that hold long content (code, URLs, tables, long names) SHOULD be allowed to shrink: `min-width: 0` on flex items, `minmax(0, 1fr)` instead of `1fr` in grid tracks. Without it, the default minimum is the content width and the child overflows.
- Prevent sideways page scroll with `overflow-x: clip` on the root or page wrapper, not `overflow-x: hidden`; `hidden` creates a scroll container and breaks `position: sticky` inside it. Fix the overflowing element too; clipping is the safety net, not the fix.
- Long words, URLs and user-generated strings wrap: `overflow-wrap: anywhere` (or `break-word`) on containers that can receive them.
- Buttons and short labels SHOULD NOT wrap onto two lines. Shorten the label, or let buttons stack full width on small screens; don't force `nowrap` where it will overflow at 320px.
- Images and video: `max-width: 100%; height: auto`, with `width` and `height` attributes (or `aspect-ratio`) so they keep their proportions and don't shift layout while loading. Use `object-fit: cover` only where cropping is acceptable.
- Full-height sections use `100svh` (stable, smallest viewport) or `100dvh` (tracks browser toolbars) instead of `100vh`, which is taller than the visible area on mobile browsers. Put `100vh` first as a fallback. Prefer `min-height` to `height` so content can grow.
- Respect safe areas on notched devices: add `viewport-fit=cover` to the viewport meta, then pad fixed and edge-to-edge elements with `env(safe-area-inset-*)`.
- Sticky elements stack: a sticky sub-header or table header uses `top` equal to the sticky nav's height (a shared custom property), so it sits under the nav instead of behind it. Anchor targets need `scroll-margin-top` for the same reason.

### Tables on small screens

- Either let the table scroll sideways inside a wrapper (`overflow-x: auto`) with a visible cue that more columns exist (a cut-off column or an edge shadow) and a sticky first column, or reformat each row as a stacked card of label–value pairs. Choose cards when users read one record at a time; scrolling when they compare across rows.
- A scrollable wrapper needs `tabindex="0"`, a `role="region"` and an accessible name so keyboard users can scroll it.

## Values

| Check width | Why |
|---|---|
| 320px | Narrowest common phone and the WCAG reflow width; nothing may scroll sideways |
| 390px | Typical current phone |
| 768px | Tablet portrait and small laptop windows; where two-column layouts first appear |
| 1440px | Common desktop; check line length and maximum widths |

## Generic defaults to catch

- **Breakpoints copied from a framework, unrelated to the content** → layout breaks between them → set breakpoints where this content breaks.
- **Desktop layout squeezed into narrow columns** → unreadable → decide the small layout on purpose.
- **Hamburger menu at every width** → hides navigation that would fit → show the nav when it fits.
- **`overflow-x: hidden` on body to hide a bug** → breaks sticky, hides the real overflow → find the element, fix it, use `clip`.
- **`height: 100vh` hero** → content cut off under mobile browser chrome → `min-height: 100svh`.
- **Hover cards and tooltips with no tap equivalent** → content unreachable on touch.

## Check

- [ ] No horizontal scroll at 320, 390, 768 or 1440px.
- [ ] Mobile reading order matches source order; nothing essential hidden.
- [ ] Touch targets ≥44×44px with space between them.
- [ ] Inputs ≥16px on mobile; zoom not disabled.
- [ ] Long URLs, names and code wrap or scroll inside their box.
- [ ] Buttons don't wrap to two lines at 320px.
- [ ] Full-height sections use `svh`/`dvh` with a fallback; fixed elements respect safe areas.
- [ ] Sticky elements sit under the nav; hover-only content has a touch and keyboard path.
- [ ] Wide tables scroll with a visible cue and keyboard access, or reformat.
