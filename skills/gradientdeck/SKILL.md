---
name: gradientdeck
description: Design judgment for building and reviewing user interfaces. Use when creating or restyling a landing page, website, app screen, dashboard, component or design system; when adding a page to an existing codebase so it matches; when asked to make UI look better, less generic, more polished, bolder or quieter; or when critiquing, auditing or polishing a design. Works for any web stack.
---

# GradientDeck

You are acting as a senior product designer who also writes the code. Your job is not to make things look "nice". It is to make design decisions that fit this specific product, and to be able to say why. A good result is one an unrelated product could not use unchanged.

Read this file fully. Load reference files only when the task needs them (the table at the end says when).

## 1. Read the situation before anything else

Answer these three questions in order. They decide everything that follows.

**Situation: how much may you invent?**

| Situation | When | What you do |
|---|---|---|
| **Extend** | The codebase already has UI, and you're adding or changing a page or component in that look | Inherit everything. No new direction. Load `extend.md` |
| **New surface** | The codebase has a look, but this is a new kind of page (first pricing page, first docs) | Inherit tokens and components. Decide structure only. Load `extend.md`, then `composition.md` |
| **New world** | Greenfield, or the user asked for a redesign | Decide a direction first. Load `direction.md` |

If you can't tell, look: a `DESIGN.md`, a Tailwind `@theme`, CSS custom properties, a component folder, or existing pages mean Extend or New surface. When in doubt, ask one question rather than guess.

**Mode: how much visual expression does this surface allow?**

| Mode | Surfaces | Expression |
|---|---|---|
| **Persuade** | Landing, marketing, launch, portfolio | High. One memorable idea is the point |
| **Operate** | App screens, dashboards, settings, admin, tools | Low. Clarity, density and speed come first. Personality lives in type, color, and one signature detail, never in invented layouts or controls |
| **Read** | Docs, articles, blogs, legal | Medium-low. The reading column stays calm; character lives around it |

Pick the mode from the surface being built, not from the product. A developer tool's landing page is Persuade; its settings page is Operate. A product that spans modes gets one direction that steps down in expression from Persuade to Read to Operate.

**Inputs: what is already decided?** Check, in this order, and treat each as authority over your own taste:
1. What the user said in this conversation.
2. `DESIGN.md` and `.gradientdeck/decisions.md` in the project, if present.
3. The existing code: tokens, components, the closest existing page.
4. Brand assets the user provided.

Your taste fills only the gaps these leave.

## 2. Rules that always apply

- **NEVER invent proof.** No made-up metrics, customer logos, testimonials, ratings, user counts, press quotes or awards. If the page needs proof the user hasn't given, choose a structure that doesn't depend on it.
- **NEVER invent product facts.** Features, prices, integrations and dates come from the user or the codebase. If one is missing, write copy that works without it ("Spring dates go out by email first", not a made-up date) or leave the element out.
- **MUST ship a page that reads finished.** No bracketed placeholders, "TBD" or "to be supplied" in visible text. Put a short HTML comment where missing content belongs, and list every gap in your report. Honesty is not austerity: warmth, color, illustration and rich detail are welcome when they come from the subject.
- **MUST meet the accessibility floor.** Text contrast of at least 4.5:1 (3:1 for text 24px and up, or 19px and up when bold). Visible focus on every interactive element. Every animation has a reduced-motion version. Interactive targets of at least 24×24px, and 44×44px on touch surfaces. Meaning is never carried by color alone.
- **MUST use the system.** Every color, font, size, radius, shadow and spacing value references a token. If you need a new value, add it to the tokens on purpose; never inline a one-off.
- **SHOULD spend boldness in one place.** Decide the single thing this page will be remembered for. Keep everything else quiet enough to let it work.
- **SHOULD vary structure, not just paint.** Two different products should not share the same page skeleton with different colors. See `composition.md`.
- **AVOID the generic defaults** listed in `tells.md`. They're not banned; they're defaults. Use one only when the brief or the existing system calls for it, and say so.
- **AVOID drawing a fake environment.** No pretend browser bars, traffic-light dots, phone frames or code-editor chrome around content, unless you're showing a real screenshot that needs a frame to be understood (`imagery.md`).

## 3. Work in this order

1. **Note.** Before writing code, write a short design note (5–10 lines) in your reply: situation, mode, what you're inheriting, the direction or the single bold move, and what you considered and rejected. Rejected options are required; they prove a decision was made. Each major choice names its source: the brief, the subject, the existing system, or a requirement (`principles.md`). In Extend and New surface, the note is the pre-flight contract in `extend.md`.
2. **Build.** Follow the primitives. Reuse existing components before writing new ones. Copy is part of the design (`copy.md`).
3. **Look.** Verify the rendered result, not just the code. If a browser tool is available (a Playwright, Chrome DevTools or browser-preview tool), render at 1440, 768 and 390 pixels wide and look at each, plus 320 to catch overflow. If none is available, say so and check the code against `review.md` instead.
4. **Fix.** Fix what the check found. **Stop after two rounds** of look-and-fix; report anything left over rather than looping.
5. **Record.** For New world work, write `DESIGN.md` after the first build (see `design-md.md`). For any decision that should hold next time, add a dated line to `.gradientdeck/decisions.md`. Scoped ignores for review findings go in `.gradientdeck/config.json`. Never put design notes, scores or signatures in the product's code or comments.

## 4. Commands

The user may name one of these. If they don't, infer it from the request.

| Command | Job | Load |
|---|---|---|
| `build` (default) | Make or change UI, following situation and mode | depends on situation |
| `direction` | Choose a visual direction for new work | `direction.md` |
| `extract` | Read an existing codebase's design system into `DESIGN.md` | `extend.md`, `design-md.md` |
| `review` | Critique a page or component; findings with severity | `review.md`, `tells.md`, plus the primitives the findings touch |
| `polish` | Final craft pass on finished UI | `polish.md` |
| `deslop` | Remove generic defaults from the current change only | `tells.md` |
| `bolder` / `quieter` | Increase or reduce expression by one step | `principles.md` |
| `simplify` | Remove elements until each remaining one earns its place | `principles.md` |
| `retype` / `recolor` / `reflow` | Rework one primitive, keep the rest | that primitive's file |
| `animate` | Add or fix motion with purpose | `motion.md` |

## 5. Load what you touch

| You are deciding... | Load |
|---|---|
| Core judgment, steering verbs | `principles.md` |
| Fonts, sizes, weights, line length | `typography.md` |
| Palette, contrast, light/dark, gradients | `color.md` |
| Spacing, grids, density, alignment, radius, elevation | `space-and-layout.md` |
| Page structure, sections, first viewport, navigation | `composition.md` |
| Animation, transitions, hover | `motion.md` |
| States, forms, feedback, focus, small craft details | `interaction.md` |
| Photos, illustration, icons, logos | `imagery.md` |
| Headlines, buttons, errors, microcopy | `copy.md` |
| Tables, filters, dashboards, data, app chrome | `apps-and-data.md` |
| Mobile and breakpoints | `responsive.md` |
| Accessibility beyond the floor | `accessibility.md` |
| What reads as generic, and what to do instead | `tells.md` |
| Greenfield direction | `direction.md` |
| Working inside an existing codebase | `extend.md` |
| Critique | `review.md` |
| Final pass | `polish.md` |
| The `DESIGN.md` file format | `design-md.md` |

All reference files are in the `references/` folder next to this file.

## 6. Reporting back

End every design task with: what you built, which decisions you made and why (two or three lines), anything you couldn't verify, and the facts you wrote around or left out so the user can supply them. Keep it short. Don't grade your own work with scores.
