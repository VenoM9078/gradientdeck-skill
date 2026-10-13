# Authoring guide

How the skill's files are written. Every file in `skills/gradientdeck/` follows this. If you change the skill, read this first.

## What this skill is

Design judgment for a coding agent. It teaches decisions, not looks. The agent should leave every task able to say **why** each visual choice fits this product, and the result should be something an unrelated product couldn't use unchanged.

## The four laws

1. **Procedures, never picks.** Don't recommend a named typeface, a hex palette, a layout template or a "use X instead of Y" swap. Every published pick becomes the next thing every agent reaches for. Describe how to choose: what to look at, what to test, what to reject. Exact values are fine for things that are physics or convention (durations, contrast ratios, touch targets, line length), not taste.
2. **Context decides.** Almost no rule is universal. Scope each rule to a mode (Persuade, Operate, Read), a situation (Extend, New surface, New world) or a genre, and say when it doesn't apply. "Never" is reserved for honesty and accessibility.
3. **Inherit before you invent.** An existing codebase, DESIGN.md or brand is the authority. The skill's taste applies where the product hasn't decided yet.
4. **Every rule must be checkable.** If a reviewer can't verify it by looking at the code or the rendered page, rewrite it until they can. "Make it feel premium" is not a rule. "Body text sits at 45–75 characters per line" is.

## Voice

- Plain, direct sentences. Second person ("you"), imperative for rules.
- Specific over general. Numbers where numbers exist.
- No hype words, no filler, no motivational asides. No "elevate", "seamless", "stunning", "delightful", "modern and clean".
- Short paragraphs. Bullets for lists of checks. Tables for value ranges and decision gates.
- No emoji. No ALL CAPS shouting except the `MUST` / `NEVER` keywords defined below.

## Rule keywords

- `MUST`: always, in every mode. Used only for honesty, accessibility and inheritance.
- `SHOULD`: the default; break it only with a stated reason.
- `AVOID`: a default that reads as generic. Allowed when the brief or the product's established system calls for it, and the reason is stated.
- `NEVER`: honesty and accessibility only.

## File shape

Each reference file covers one primitive or one workflow:

```
# <Primitive>

One or two sentences: what this primitive decides and why it matters.

## Decide          ← the ordered questions to answer before writing code
## Rules           ← short, checkable, keyword-tagged, scoped to mode/situation
## Values          ← tables of ranges (only physics/convention, never taste picks)
## Generic defaults to catch   ← patterns that read as AI/template output, why, and the procedure that replaces them
## Check           ← a short list a reviewer can verify on the rendered page
```

Not every section is needed in every file. Keep the order.

## Size budgets

| File | Budget |
|---|---|
| `SKILL.md` | ≤ 3,000 tokens (≈ 12,000 characters) |
| Any reference | ≤ 2,300 tokens (≈ 9,000 characters) |

`npm test` enforces these. If a file is over, cut, don't split into more files.

## Things that are banned in the skill's own files

- Named typefaces, foundries, or palettes as recommendations. (Naming a face only to describe a generic default is allowed, sparingly.)
- Brand names used as style targets ("make it look like ...").
- Mentions of other skills, prompts or tools for design.
- Examples or snippets that themselves break a rule elsewhere in the skill.
- Anything that tells the agent to fetch remote instructions.
