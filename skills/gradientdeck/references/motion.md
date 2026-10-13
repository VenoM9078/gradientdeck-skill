# Motion

When things move, why, and how fast. Good motion explains what happened; bad motion makes the user wait. Most interfaces need less of it than they get.

## Decide

1. **Should this animate at all?** Ask how often the user triggers it.
   - Many times a day (switching tabs, opening a command menu, toggling a row): little or no animation. Speed is the feature.
   - Triggered from the keyboard: none. Keyboard users expect instant results.
   - Occasional (opening a modal, first load, completing a task): animation can help.
   - Rare and meaningful (onboarding, a finished upload, a launch page): room for more.
2. **What is its purpose?** It must have one:
   - **Feedback:** the press registered.
   - **Continuity:** where something came from or went (a panel sliding from its trigger).
   - **State change:** something switched, appeared or was removed.
   - **Attention:** something needs a look now (used rarely).
   - **Explanation:** showing how something works, step by step.
   If you can't name the purpose, don't animate.
3. **Which properties?** Transform and opacity first.
4. **Which duration and easing?** From the tables below.
5. **What happens if it's interrupted, and what's the reduced-motion version?**

## Rules

- SHOULD animate `transform` and `opacity`. AVOID animating `width`, `height`, `top`, `left`, `margin` or `padding`; they trigger layout on every frame. To show size changing, scale or clip instead; if a real height change is unavoidable, keep it to a small, isolated element (for example `grid-template-rows` from `0fr` to `1fr`).
- SHOULD name the properties in every transition. AVOID `transition: all`.
- SHOULD make exits faster than entrances (about 70–80% of the enter duration). Leaving is not something the user waits to watch.
- SHOULD use CSS transitions, not keyframe animations, for UI that can be retriggered mid-way (hover, open/close, toggles). Transitions reverse from where they are; keyframes restart or jump.
- SHOULD animate from the trigger's origin. Popovers and menus scale from the edge nearest their trigger (`transform-origin`), not from the center.
- AVOID scaling from 0. Start entering elements at about 0.95–0.98 scale with opacity 0; nothing in the real world appears from a point.
- SHOULD keep staggers short: 30–80ms between items, and cap the total so the last item starts within about 300ms. Stagger only small groups that arrive together.
- SHOULD gate hover effects behind `@media (hover: hover) and (pointer: fine)` so touch devices don't get stuck hover states.
- SHOULD give each element one hover signal (color, or background, or a small movement), not several at once.
- AVOID scroll-triggered entrances on everything. Use them only where arrival order explains something.
- MUST provide a reduced-motion version (see below). NEVER make content depend on an animation finishing to be readable or usable.
- NEVER autoplay motion lasting more than 5 seconds without a way to pause, stop or hide it.

## Values

**Duration**

| Interaction | Duration |
|---|---|
| Button press, toggle, checkbox | 100–160ms |
| Tooltip, small popover | 150–200ms |
| Dropdown, select menu | 150–250ms |
| Modal, drawer, sheet | 200–400ms (larger travel, longer) |
| Page or route transition | 200–350ms |
| Explanatory or marketing sequence | as long as the explanation needs |

Keep UI responses under about 300ms. Only large surfaces that travel far (drawers, full-screen sheets) go up to about 400ms; anything longer must be explaining something.

**Easing**

| Movement | Easing |
|---|---|
| Entering, appearing, responding to input | ease-out (fast start, gentle stop) |
| Moving between two on-screen positions | ease-in-out |
| Leaving the screen | ease-out or a short ease-in-out; quick |
| Gestures, drag, direct manipulation | a spring, so release carries the gesture's velocity |
| Opacity or color alone | linear or ease is fine |

- AVOID ease-in for UI: it starts slow, which reads as lag.
- AVOID the browser's default `ease` keyword for movement; write a custom curve with a strong ease-out so motion feels decisive.
- AVOID overshoot or bounce on UI state changes (menus, modals, toggles). Overshoot is for physical, gesture-driven or playful moments the subject calls for.

## Reduced motion

Under `@media (prefers-reduced-motion: reduce)`, reduce, don't remove:

- Drop movement: translation, scaling, parallax, zoom, auto-scrolling carousels.
- Keep what carries meaning without movement: opacity fades, color changes, focus changes, progress.
- Shorten what remains. A modal can cross-fade instead of sliding.
- Stop autoplaying video and looping backgrounds, or show a still frame.

## Performance

- SHOULD restrict continuous or frequent animation to compositor-friendly properties (`transform`, `opacity`; `filter` sparingly, and expensive when the area is large, especially blur).
- AVOID animating CSS custom properties that are inherited by large subtrees; every frame recalculates styles for all descendants. Animate the property on the element that uses it.
- SHOULD use `will-change` only on elements about to animate, and remove it after. Applied broadly, it wastes memory and can make things slower.
- SHOULD check animations on a throttled or low-end device. A dropped frame reads as broken, not as slow.
- AVOID scroll-linked effects driven by scroll event handlers; prefer CSS scroll-driven animations or an `IntersectionObserver` for simple reveals.

## By mode

- **Operate:** near zero. Feedback on press, short state transitions, no entrance choreography on screens users open all day.
- **Read:** nearly none in the reading column. Motion lives in navigation and media, if anywhere.
- **Persuade:** room for one considered sequence that explains the product, as the page's bold move if motion is the bold move. Not decoration on every section.

## Generic defaults to catch

- **`transition: all 0.3s ease` everywhere** → no decision about property or speed → name properties; pick duration from the table.
- **Hover scale on every card and button** → see `tells.md` → one hover signal per element, chosen for what the element does.
- **Everything fades up on scroll** → motion as a default → animate only where order or attention matters.
- **Spring bounce on menus and modals** → playful in the wrong place → ease-out, no overshoot.
- **Long entrance choreography on an app screen** → makes frequent users wait every time → cut it.

## Check

- Every animation has a named purpose, and none run on frequent or keyboard-triggered actions.
- Transitions list properties; no `transition: all`; no layout properties animated.
- Durations fall in the table's ranges; UI responses stay under about 300ms (large surfaces up to about 400ms); exits are faster than entrances.
- No ease-in on UI; no overshoot on UI state changes; popovers scale from their trigger.
- Hover styles sit inside `(hover: hover) and (pointer: fine)`.
- With reduced motion on, nothing moves across the screen, and fades and state changes still read.
- Retriggering an open/close mid-way reverses smoothly instead of jumping.
