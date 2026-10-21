# DESIGN.md

The file that records a product's design system so the next task, and the next agent, inherits it instead of reinventing it. Also covers the two small files beside it: `.gradientdeck/decisions.md` and `.gradientdeck/config.json`.

## The format

`DESIGN.md` sits at the project root. It has two parts:

1. **YAML frontmatter of tokens.** Groups: `colors`, `typography`, `rounded`, `spacing`, and `components`. Components reference other tokens with `{path.to.token}` instead of repeating values, so a change in one place carries through.
2. **Prose sections**, in this order: Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts.

**Tokens are normative; prose explains why.** If the two disagree, the tokens win and the prose is out of date: fix it. Prose says what each role is for, when to use it, and what was rejected, so a later agent can extend the system without guessing.

## Rules

- MUST treat an existing `DESIGN.md` as authority over your own taste (SKILL.md inputs). Change it only when the user asks, or when a decision you've made with them supersedes it, and say so in your report.
- SHOULD write `DESIGN.md` **after the first build** in New world work, not before. A rulebook written before anything exists gets defended against the real page; one written after records what survived. Seed it from the page's plan in `.gradientdeck/pages/` (`direction.md`).
- SHOULD write it for existing code via the `extract` command (`extend.md`), recording the de facto system, not an idealised one.
- SHOULD name tokens by role (`ink`, `surface`, `accent`, `danger`), not by appearance (`blue-500`, `dark-grey`). Raw scales can exist beneath roles; components reference roles.
- SHOULD record provenance for each token group or token: `decided` (chosen in direction work, with the reason in prose) or `extracted` (found in code, with source and confidence).
- SHOULD record the mode for each main route or route group (Persuade, Operate, Read), so the next task knows how much expression it may use.
- SHOULD keep it current: when a build adds or changes a token or component on purpose, update `DESIGN.md` in the same change.
- AVOID prose that restates values ("the accent is a blue"). Explain the role and the reason.
- AVOID a Do's and Don'ts list of generic advice. Each line should be specific to this system and checkable ("Accent fills only the primary action per view", not "use colour wisely").
- Don't put design notes, scores or signatures in the product's code or comments; they belong here or in the decisions log (SKILL.md).

## Example skeleton

Placeholders only. Replace every name and value with what the product actually uses.

```markdown
---
provenance: decided            # or: extracted (from <files>)
modes:
  "/": persuade
  "/app/*": operate
  "/docs/*": read
colors:
  ink: "<value>"               # primary text
  ink-muted: "<value>"         # secondary text, meets 4.5:1 on surface
  surface: "<value>"
  surface-raised: "<value>"
  accent: "<value>"
  danger: "<value>"
typography:
  display: { family: "<family>", weight: <n>, tracking: "<value>" }
  body: { family: "<family>", size: "<value>", leading: <n> }
  data: { family: "<family>", features: "tabular-nums" }
  scale: ["<step>", "<step>", "<step>", "<step>"]
rounded:
  sm: "<value>"
  md: "<value>"
spacing:
  scale: ["<step>", "<step>", "<step>", "<step>", "<step>"]
components:
  button-primary:
    background: "{colors.accent}"
    text: "{colors.surface}"
    radius: "{rounded.sm}"
    padding: "{spacing.scale.1} {spacing.scale.3}"
  card:
    background: "{colors.surface-raised}"
    radius: "{rounded.md}"
---

## Overview
What the product is, who uses it, the core idea in one sentence, the one bold move.

## Colors
Each role and when it's used. Strategy. Contrast pairs checked. What was rejected.

## Typography
Each role and where its voice comes from. Scale logic. Line length.

## Layout
Grid, containers, spacing rhythm, density per mode.

## Elevation & Depth
How layers are separated (surface steps, borders, shadows) and the limits.

## Shapes
Radii and why; icon style.

## Components
Each component, its variants, its states, and the tokens it uses.

## Do's and Don'ts
- Do: <specific, checkable rule for this system>
- Don't: <specific thing that breaks this system>
```

For extracted files, add a source and confidence comment to each token (`# from tokens.css --text-primary, high` or `# inferred from usage, 41 occurrences, medium`) and an "Open questions" list after Do's and Don'ts for drift the user should resolve.

## `.gradientdeck/decisions.md`

A log of design decisions that should hold next time. One dated line each, with the reason:

```
2026-03-02  Tables stay at 13px body on /app: users scan hundreds of rows; density over comfort.
2026-03-09  No illustrations on marketing pages: rejected as interchangeable; product screenshots only.
```

- SHOULD add a line whenever the user settles a question, or you make a choice that a later task might otherwise reverse.
- SHOULD append, never rewrite history. A reversed decision gets a new dated line that says what it supersedes.
- Ratified decisions are not findings: `review.md` doesn't report them, unless one now causes a P0 (an accessibility or honesty failure), which always gets reported.

## `.gradientdeck/pages/<page>.md`

The plan for one New world page, saved by the direction roll and filled in by you (`direction.md`). It is a snapshot, not a log: rolling that page again replaces the whole file, carrying over only the job, the action and the worlds already dealt.

- SHOULD read it before changing that page later, as the page's intent. Changing the page's direction means a new roll, not editing the plan to match drift.
- Commit it with `decisions.md`; it is how the next agent knows why the page looks the way it does.
- NEVER copy it into the page, and keep `.gradientdeck/` out of what gets deployed if the site is served from the project folder.

## `.gradientdeck/config.json`

Project settings for the skill. Its main job is scoped ignores: telling reviews to skip a check where the project has a reason.

```json
{
  "ignore": [
    {
      "rule": "<check or tell name>",
      "scope": "<route, file glob or selector>",
      "reason": "<why this is right for this product>"
    }
  ]
}
```

- Every ignore is scoped to a route, file pattern or selector. A global ignore turns a check off for work nobody has looked at yet.
- Every ignore carries a reason. Treat an ignore with no scope or no reason as absent.
- NEVER accept an ignore for the accessibility floor or for invented proof. Those can't be configured away.

## Check

- Frontmatter parses as YAML; every `{reference}` resolves to a defined token.
- Prose sections are present and in order.
- Every token has provenance; extracted tokens have source and confidence.
- Each main route has a mode.
- Decisions are dated, one line each, with a reason.
- Every ignore in config has a scope and a reason, and none touches accessibility or honesty.
