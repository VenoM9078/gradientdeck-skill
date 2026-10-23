# Interaction

How the interface responds: states, focus, forms, feedback, and the small details that make UI feel built rather than assembled. A component isn't designed until every state it can be in is designed.

## Decide

1. **Which states can this element be in?** List them before styling the default.
2. **What does each state need to tell the user?** Can I use this? Did it register? Is it working? Did it work? Why not?
3. **Where does the result of an action appear?** In place, if at all possible.
4. **What does this look like with no data, slow data, and failed data?**

## States

Every interactive element SHOULD define each state that applies:

| State | Must communicate | Notes |
|---|---|---|
| Default | This is interactive, and what it does | Affordance comes from shape, color and label, not from hover |
| Hover | You're on it | Pointer devices only; a subtle change; never the only signal of interactivity |
| Focus-visible | Keyboard focus is here | See focus rules below |
| Active / pressed | The press registered | Immediate; a darker fill, slight inset or small scale-down (about 0.97) |
| Disabled | Not available now | Keep it legible; explain why nearby when it isn't obvious; prefer leaving it enabled and explaining on submit |
| Loading | Working on it | Keep the element's size; swap label for a spinner or progress inside it; block double submits |
| Selected / current | This one is chosen | Use more than color: weight, an indicator, a check, `aria-selected` / `aria-current` |
| Error | Something is wrong here | Text and an icon or border, not color alone |

## Focus

The MUSTs (visible on every element, 3:1 contrast, order, focus return) are in `accessibility.md`. Craft on top of them:

- SHOULD use `:focus-visible`, so mouse clicks don't show rings but keyboard focus always does.
- SHOULD prefer an outline with `outline-offset`: it stays visible on any background; a ring that matches the button fill doesn't.
- SHOULD make focus appear instantly, without transition.

## Forms

- MUST give every field a visible label. NEVER use placeholder text as the label; it vanishes on input and usually fails contrast.
- SHOULD place labels above fields for scanning and long labels.
- SHOULD validate on blur or on submit, not on every keystroke. Once a field is in error, re-validate as the user types so the error clears as soon as it's fixed.
- MUST show errors next to the field they belong to, in text, linked with `aria-describedby`. On submit with errors, move focus to the first invalid field or to a summary that links to each one.
- SHOULD write errors that say how to fix it (see `copy.md`).
- SHOULD mark whichever is rarer, required or optional, and say so in text, not with an unexplained asterisk alone.
- SHOULD use the right `type` (`email`, `tel`, `url`, `number` only for true quantities), `inputmode` for numeric codes, and `autocomplete` tokens (`email`, `name`, `street-address`, `one-time-code`, `new-password`, `current-password`).
- SHOULD keep everything the user typed when showing errors; don't clear the form.
- SHOULD keep the submit button enabled and explain what's missing when pressed, rather than leaving a disabled button with no reason.

## Feedback

- SHOULD show the result where the action happened: the row updates, the item appears in the list, the toggle flips.
- SHOULD use optimistic updates for actions that almost always succeed and are cheap to reverse; roll back visibly and say so if they fail.
- SHOULD use a toast only for outcomes not otherwise visible (a background job finished, something happened off-screen) or to offer undo. AVOID toasts confirming what the user can already see.
- SHOULD prefer undo over confirmation dialogs for reversible actions. Confirm only destructive, irreversible ones, and name the consequence in the button ("Delete 3 files").
- SHOULD acknowledge input within about 100ms. If an action takes longer than about 1 second, show progress.

## Empty, loading and error states

- **Empty:** SHOULD say what will appear here and offer the action that fills it. Distinguish "nothing yet" from "no results for this filter" (offer to clear filters).
- **Loading:** SHOULD use skeletons shaped like the real content when layout is known, and a spinner for short, unknown-shape waits. Show nothing for the first ~300ms to avoid flashes on fast responses. SHOULD reserve space so content arriving doesn't shift the layout.
- **Error:** SHOULD say what failed, whether data was lost, and what to do (retry, contact). Keep the rest of the page usable; fail the smallest region possible.

## Worst-case content

Design with real content, then break it on purpose. SHOULD check every component that shows user or product data against:

- A very long name, title or email, and an unbroken string (a URL, a token): it wraps or truncates with the full value available, never overflows.
- A one-character value and an empty value: the layout holds, and empty reads as intentional (a dash, "None", or the empty state).
- One item, and several hundred: lists paginate or virtualize; grids don't leave a lonely orphan card looking broken.
- Large numbers (a seven-digit count, a long currency amount, a negative value): formatted, aligned, not clipped.
- Text about 40% longer, as in many translations: buttons and labels grow or wrap without collisions.
- Missing images and avatars: a deliberate fallback, not a broken icon.

Placeholder content written to fit the layout perfectly hides all of these. If you control the sample data, include at least one worst case on the page while building.

## Affordance

- SHOULD make links look like links in running text: underlined or otherwise distinct beyond color.
- SHOULD make buttons look like buttons: a filled or outlined shape, a verb label. Use `<button>` for actions and `<a>` for navigation.
- NEVER make non-interactive things look clickable (hover effects or pointer cursors on static cards, underlined text that isn't a link). Honesty applies to controls too.
- SHOULD make the whole card clickable only when it leads to one place, and then keep a real link inside it.

## The craft floor

Small details that show the interface was finished. Tie each to the system's tokens.

- `::selection` colored from the palette, with readable contrast.
- `caret-color` set to the accent in inputs.
- `accent-color` on native checkboxes, radios, range inputs and progress bars, so they match without being rebuilt.
- `font-variant-numeric: tabular-nums` on numbers that change or line up (counters, prices in tables, timers).
- `cursor: pointer` on custom interactive elements that behave like links; `not-allowed` or default on disabled ones.
- Scrollbars styled (`scrollbar-color`, `scrollbar-width`) only inside custom scroll areas where the default clashes; leave the page scrollbar alone.
- On touch: `touch-action: manipulation` on controls to avoid double-tap zoom delays; `-webkit-tap-highlight-color` set to transparent only when you provide your own pressed state.
- `text-wrap: balance` on short headings, so lines break evenly (see `typography.md`).

## Generic defaults to catch

- **Only default and hover styled** → focus, pressed, loading and disabled forgotten → list states first, design each.
- **`outline: none` with nothing in its place** → breaks keyboard use → `:focus-visible` with a contrasting outline.
- **Placeholder-as-label forms** → looks minimal, fails users → visible labels.
- **A toast for every save** → noise → show the result in place.
- **A centered spinner for everything** → layout jumps when content lands → skeletons with reserved space.
- **Empty states with a generic illustration and "Nothing here"** → says nothing → explain and offer the action.

## Check

- Tab through the page: every interactive element shows a high-contrast focus ring, in visual order.
- Each control has pressed, disabled and (if async) loading states; loading keeps the control's size.
- Every field has a visible label, correct `type` and `autocomplete`; errors appear beside fields in text.
- Empty, loading and error states exist for every data view; no layout shift when data arrives.
- No toast duplicates something visible on screen.
- Links in text are distinguishable without color; nothing static has hover or pointer styling.
- Selection, caret, native controls and changing numbers are styled from tokens.
- Data components survive long, empty, huge and translated content without overflow or collisions.
