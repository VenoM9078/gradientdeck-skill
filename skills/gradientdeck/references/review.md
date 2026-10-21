# Review

How to critique a page or component and verify your own build. Used by the `review` command and by the Look step of every build. A review is a short ranked list of problems with fixes, not an essay and not a score.

## How to look

1. **Render it if you can.** With a browser tool (a Playwright, Chrome DevTools or browser-preview tool), load the page and capture full-page screenshots at 1440, 768 and 390 pixels wide. Check 320 too, for horizontal overflow only. If the user reported a problem at a specific size or device, render that size as well, and re-render it after the fix.
2. **Let it settle.** Wait for web fonts to load (`document.fonts.ready`), for entrance animations to finish and for lazy images to arrive before capturing. Scroll the page once so scroll-triggered content renders.
3. **Distrust the screenshot.** Confirm it isn't blank, half-loaded, showing fallback fonts, a cookie wall or an error overlay. If it is, fix the capture before judging the design.
4. **Read computed values** where the tool allows: font family actually rendered, font sizes, colours (for contrast), element widths (for overflow and line length). Measure; don't estimate from pixels. Counts and values in the report (how many components, which font loaded, what the contrast is) come from the page or the files, never from memory.
5. **Exercise states.** Hover, focus (tab through the page), active, disabled, empty, loading, error.
6. **Stress the content.** Swap in worst cases where you can: a very long name or unbroken word, an empty value, one item and several hundred, a seven-digit number, text 40% longer as if translated. Layouts that only work with ideal content are broken (`interaction.md`).
7. **No browser tool?** Review the code against this file, and say plainly in the report that the result wasn't rendered and which checks that leaves unverified.
8. **Prefer fresh eyes.** If you can start a subagent, give it the rendered page (or the code), the mode and this file, without your design note. A reviewer who didn't make the decisions sees what's actually there. Self-review is the fallback.

## What to check, in order

Order matters: earlier items decide whether later ones are worth fixing.

1. **Specificity.** Could an unrelated product use this page unchanged, with only the name swapped (`principles.md`)? For Persuade pages, also run the brand test on the first viewport (`composition.md`). This is the verdict, and it comes first. In Extend, the question becomes: does it look like the rest of this product?
2. **Hierarchy and composition.** Is the most important thing in each view obvious at 25% zoom? Does the structure fit the content (`composition.md`)? Is boldness spent in one place?
3. **Typography.** Roles distinct, scale steps clear, line length 45–75 characters for body, leading suited to size, no fallback font rendering (`typography.md`).
4. **Colour and contrast.** Palette roles consistent; text meets 4.5:1 (3:1 for large text); meaning never by colour alone (`color.md`).
5. **Space and alignment.** Spacing between groups larger than within; everything aligns to something; values on the scale (`space-and-layout.md`).
6. **Interaction states.** Hover, focus, active, disabled, loading, empty and error exist and are distinguishable (`interaction.md`).
7. **Copy and honesty.** Concrete, in the users' vocabulary (`copy.md`). Any invented metric, logo, testimonial, rating or product fact is P0.
8. **Responsive breakage.** Overflow at 320, collisions, unreadable tables, tap targets on touch layouts (`responsive.md`).
9. **Accessibility floor.** Focus visible, targets 24×24px minimum (44×44px on touch), semantics and labels, reduced motion honoured (`accessibility.md`).
10. **Motion.** Each animation has a purpose, named properties, sensible duration, a reduced-motion version (`motion.md`).
11. **Generic defaults.** Patterns from `tells.md` used without a stated reason.
12. **System drift.** Raw values, off-token colours, near-duplicate components (`extend.md`). If the project has a `DESIGN.md`, turn each of its Don'ts into a check and verify it against the page.

For Operate surfaces, also check density, scanning and data formatting against `apps-and-data.md`.

## Severity

| Level | Meaning | Examples |
|---|---|---|
| P0 | Broken, dishonest or inaccessible. Must fix before shipping | Invented proof, text below contrast floor, no focus indicator, content cut off, page blank on mobile |
| P1 | Clearly hurts the page's job | Generic page that fails the specificity test, no clear primary action, broken hierarchy, missing error state |
| P2 | Noticeable quality problem | Off-scale spacing, inconsistent radii, a tell used without reason, awkward line breaks in headings |
| P3 | Polish | Optical alignment, a widow, a slightly long transition |

## Rules

- NEVER claim you looked at, measured or tested something you didn't. Each finding comes from a rendered screenshot, a computed value or the code, and the report says which checks had no evidence.
- MUST report every P0 you find, even beyond the finding limit.
- SHOULD point at a location for every finding: a selector, component name, or `file:line`.
- SHOULD give a fix for every finding, concrete enough to act on ("raise `--text-muted` to meet 4.5:1 on `--surface`", not "improve contrast").
- SHOULD cap the report at about 10 findings, ranked by severity, then by how much fixing it improves the page.
- SHOULD label opinions as opinions. "The headline is 3.2:1 on its background" is a defect; "the accent feels too warm for the subject" is taste. Prefix taste with "Opinion:" and never rate it above P2.
- SHOULD treat ratified entries in `.gradientdeck/decisions.md` and scoped ignores in `.gradientdeck/config.json` as not-findings (`design-md.md`). Mention a decision only if it now causes a P0.
- Don't give numeric scores, grades or ratings out of ten. They invite gaming and say nothing actionable.
- AVOID findings that are restatements of a rule without a location. If you can't point at it, it isn't a finding.

## Bounded

When reviewing your own build, run at most **two rounds** of look → fix → look (SKILL.md). Each closing look renders every width again, not only the one a fix touched. After the second, stop and report what's left with its severity. Looping more usually trades one problem for another.

## Output format

```
Verdict: <one line: does it do its job, is it specific, is it shippable; rendered at 1440/768/390 or "not rendered: code review only">

| Sev | Where | Problem | Fix |
|---|---|---|---|
| P0 | `.pricing-card .note` | 3.1:1 contrast on surface | Use `--text` token, or darken `--text-muted` |
| P1 | hero (`Hero.tsx:12`) | ... | ... |

Working: <2–3 short lines on what to keep, so the fix round doesn't break it>
Unverified: <anything you couldn't check>
```

## Check

- The verdict line comes first and answers the specificity question.
- Every finding has a severity, a location, a problem and a fix.
- All P0s are listed; total findings around 10 or fewer otherwise.
- Opinions are labelled and no higher than P2.
- The report states whether the page was rendered, and nothing is claimed without evidence.
- Worst-case content and any user-reported size were checked, or listed as unverified.
- No scores anywhere.
