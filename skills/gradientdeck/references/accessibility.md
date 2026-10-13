# Accessibility

The floor in SKILL.md (contrast, visible focus, reduced motion, target size, color never alone) is the minimum. This file is how to build so the whole interface works with a keyboard, a screen reader, zoom, high-contrast modes and reduced motion. Accessibility rules are `MUST` and `NEVER` in every mode. Criteria numbers refer to WCAG 2.2.

## Decide

1. **What is each element, semantically?** A button, a link, a heading, a list, a form field. Choose the native element first; style it second.
2. **How does a keyboard user move through this?** Walk the tab order before styling focus.
3. **What changes without a page load?** Each async update, error and dialog needs focus or announcement handling.

## Rules

### Semantic HTML first

- MUST use landmarks: one `<main>`, plus `<header>`, `<nav>`, `<footer>`, `<aside>` where they apply. Label multiple navs (`aria-label="Primary"`).
- MUST have one `<h1>` per page and headings in order without skipped levels. Heading level follows structure, not font size; style any level to look as needed.
- Buttons do things (`<button>`); links go places (`<a href>`). NEVER put a click handler on a `<div>` or `<span>`. An `<a>` without `href` is not focusable.
- Lists of things are `<ul>`/`<ol>`; tabular data is a `<table>` with `<th scope>` and a caption or accessible name (1.3.1).
- Set `lang` on `<html>` (3.1.1) and on passages in another language (3.1.2).
- DOM order MUST match visual reading order (1.3.2, 2.4.3). Don't rearrange with CSS `order`, grid placement or absolute positioning in a way that changes meaning.

### Keyboard

- Everything operable by pointer MUST be operable by keyboard (2.1.1), with no keyboard traps (2.1.2).
- Tab order follows reading order. Don't use positive `tabindex`; use `tabindex="0"` only to make custom widgets focusable and `-1` for elements you focus by script.
- Focus MUST be visible (2.4.7) and not hidden behind sticky headers or footers (2.4.11). Style with `:focus-visible`; the indicator needs 3:1 contrast against its surroundings and should be at least a 2px outline. Never remove outlines without a replacement.
- Content-heavy pages and pages with long nav SHOULD have a skip link to `<main>` as the first focusable element, visible on focus (2.4.1).
- Composite widgets (tabs, menus, listboxes, grids) use one tab stop and arrow keys inside, following established keyboard patterns for that widget.
- Dragging MUST have a single-pointer alternative, such as move buttons or a menu (2.5.7).

### Focus management

- Dialogs: use `<dialog>` with `showModal()` where possible (it makes the page inert and closes on Escape). On open, move focus to the first meaningful control or the dialog heading; keep focus inside while open; on close, return focus to the element that opened it.
- Menus and popovers: Escape closes and returns focus to the trigger. The trigger has `aria-expanded`.
- After deleting an item or changing route in a single-page app, move focus somewhere sensible (the next item, the new page's `<h1>`), never to `<body>`.

### Accessible names

- Every control MUST have an accessible name (4.1.2). Prefer visible text: a `<label for>` for fields, button text for buttons.
- Use `aria-label` only when there is no visible text, such as icon-only buttons (`aria-label="Close"`). Icon-only buttons SHOULD also have a tooltip for sighted users.
- When there is visible text, the accessible name MUST contain it, ideally starting with it (2.5.3), so voice users can say what they see.
- Decorative icons get `aria-hidden="true"`; inline SVGs that convey meaning get a title or name.

### ARIA

- No ARIA is better than bad ARIA. A native element already has the right role, states and keyboard behaviour; use it before adding roles.
- ARIA changes what is announced, not behaviour. If you add `role="button"`, you also owe focusability, Enter and Space handling, and a name.
- Never put `aria-hidden="true"` on anything focusable. Keep states in sync (`aria-expanded`, `aria-selected`, `aria-pressed`, `aria-current`).

### Images and alt text

- Informative images: alt text that says what the image communicates in context, not "image of". Decorative images: `alt=""`.
- Images of text are avoided; when unavoidable, the alt contains the text. Charts need a text summary or a data table.

### Forms

- Every field has a visible, programmatically associated label (3.3.2). Placeholder is not a label.
- Group related controls (radio sets, address blocks) with `<fieldset>` and `<legend>`.
- Errors: identify the field and describe the problem in text (3.3.1) with a suggestion where possible (3.3.3). Link the message with `aria-describedby`, set `aria-invalid="true"` on the field, and on submit move focus to an error summary that links to each field (or to the first invalid field on a short form).
- Use correct `type` and `autocomplete` values so browsers and password managers can fill fields; don't ask for the same information twice in one process (3.3.7). Never block paste into password or code fields (3.3.8).

### Live regions

- Status messages that appear without focus moving (saved, results count, upload progress) MUST be announced (4.1.3): put them in a region with `role="status"` or `aria-live="polite"` that exists in the DOM before the message is inserted.
- Use `role="alert"` (assertive) only for urgent errors. Don't announce every keystroke; debounce.

### Color and contrast

- Text MUST meet the floor: 4.5:1, or 3:1 for large text (1.4.3). Check text over images and gradients at the worst point.
- Non-text elements people need to see (field borders, icons that carry meaning, chart marks, focus indicators, control states) MUST have 3:1 against adjacent colors (1.4.11).
- Color MUST NOT be the only signal (1.4.1): errors get an icon and text; links in body text get an underline or another non-color cue.

### Motion and flashing

- Honour `prefers-reduced-motion: reduce`: replace movement, parallax and auto-playing animation with fades or no animation (see `motion.md`).
- NEVER flash anything more than three times in any one-second period (2.3.1).
- Auto-moving content that lasts more than five seconds (carousels, tickers) MUST have pause (2.2.2).

### Zoom and reflow

- Text MUST resize to 200% without loss (1.4.4); content MUST reflow at 320 CSS px wide (equivalent to 400% zoom at 1280px) without two-dimensional scrolling, except for content that needs it, such as data tables and maps (1.4.10). Use `rem` for type and avoid fixed heights on text containers.
- Layout MUST survive user text spacing overrides (1.4.12): no clipped text when line height, letter spacing or word spacing increase.
- Hover and focus content (tooltips, popovers) must be dismissible with Escape, hoverable, and stay until dismissed (1.4.13).

### Target size

- Targets MUST be at least 24×24 CSS px, or have enough spacing that a 24px circle on each doesn't overlap another (2.5.8, AA). Inline links in text are exempt. Use 44×44px on touch surfaces (see `responsive.md`).

### Contrast modes

- Respect `forced-colors: active`: don't convey state only with background or box-shadow (they are removed); use borders or outlines, which take system colors. If a custom focus style uses `box-shadow`, add `outline: 2px solid transparent` too; forced-colors mode removes the shadow but paints the outline in a system color.
- Optionally strengthen borders and muted text under `prefers-contrast: more`.

## Generic defaults to catch

- **`outline: none` with no replacement** → keyboard users lose their place → `:focus-visible` style with 3:1 contrast.
- **Div buttons and icon buttons with no name** → silent or unreachable → `<button>` with text or `aria-label`.
- **Light gray placeholder as the only label** → fails contrast and vanishes → visible label.
- **ARIA roles sprinkled on native elements** → redundant or conflicting → remove them.
- **Modal that doesn't trap or return focus** → users tab into the page behind.

## Check

- [ ] Landmarks present; one `<h1>`; headings in order; `lang` set.
- [ ] Every interactive element reachable and operable by Tab, Enter, Space, Escape and arrows where expected.
- [ ] Focus always visible, never hidden under sticky elements.
- [ ] Dialogs move focus in, contain it, close on Escape and return focus.
- [ ] Every control has a name containing its visible label.
- [ ] Field errors are linked with `aria-describedby` and `aria-invalid`; async status announced politely.
- [ ] Text 4.5:1 (large 3:1); UI parts and focus indicators 3:1; nothing by color alone.
- [ ] Reduced motion honoured; nothing flashes more than three times a second.
- [ ] Page works at 320 CSS px and 200% text; targets ≥24×24px.
- [ ] Visual order matches DOM order.
