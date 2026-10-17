# GradientDeck

[![npm](https://img.shields.io/npm/v/gradientdeck)](https://www.npmjs.com/package/gradientdeck) [![license](https://img.shields.io/npm/l/gradientdeck)](LICENSE)

Design judgment for coding agents.

Ask an agent to build a landing page and you usually get the same page: centered hero, purple gradient, three cards with icons in rounded squares, a row of made-up stats. Ask it to add a page to your app and it often ignores the components and tokens you already have.

GradientDeck is an Agent Skill that changes how your agent makes those decisions. It doesn't hand it a template or a palette. It teaches it to read the situation first, inherit what your project has already decided, make one deliberate choice where there's room for one, and check the rendered result before calling it done.

```bash
npx gradientdeck install
```

The installer puts the skill in `.claude/skills` for Claude Code and in the shared `.agents/skills` folder, which Codex, Cursor, GitHub Copilot, OpenCode and most other agents that support Agent Skills read.

## What it does

**It reads the situation before writing code.** Is this an existing codebase you're extending, a new kind of page in an existing look, or something new? Is it a marketing page, an app screen or documentation? Those answers decide how much the agent is allowed to invent. A settings page gets very little. A launch page gets one bold idea.

**It inherits before it invents.** In an existing project, your tokens, components and nearest similar page are the authority. The agent reuses them, says what it's adding and why, and flags design problems instead of quietly redesigning around them.

**It catches generic defaults.** The patterns that make a page look generated are written down, along with why they read that way and what to do instead. None of them are banned outright; the agent can use one when your brand or brief calls for it, and it has to say so.

**It never invents proof.** No fake customer logos, testimonials, ratings or "10,000+ teams" stats. If a page needs a fact you haven't supplied, it writes around the gap and tells you what to fill in, so the page still reads finished.

**It checks its work.** If your agent has a browser tool, it renders the page at desktop, tablet and phone widths and fixes what it finds, in at most two rounds. If it doesn't, it reviews the code and tells you it couldn't look.

**It stays small.** The main file is about 2,000 tokens. Reference files on typography, color, layout, motion, copy and the rest load only when the task touches them.

## Using it

You don't need special commands. Ask for UI the way you normally would and the skill kicks in. You can also name a command:

| Ask for | What happens |
|---|---|
| `build` | Make or change UI (the default) |
| `direction` | Choose a visual direction for something new |
| `extract` | Read your existing design system into a `DESIGN.md` |
| `review` | A critique with findings ranked by severity |
| `polish` | A final pass on finished UI |
| `deslop` | Remove generic defaults from the current change |
| `bolder`, `quieter`, `simplify` | Turn expression up or down by one step |
| `retype`, `recolor`, `reflow`, `animate` | Rework one part, leave the rest |

## Files it keeps in your project

- `DESIGN.md`: your design system as tokens plus the reasons behind them. Written after the first new design, or extracted from existing code.
- `.gradientdeck/decisions.md`: dated design decisions, so the next task doesn't undo them.

Nothing is ever written into your product's code as a signature or comment.

## Installer commands

```bash
npx gradientdeck install            # into this project (inside a git repo) or your home folder
npx gradientdeck install --global   # for every project
npx gradientdeck update             # replace an older copy
npx gradientdeck uninstall          # remove only what GradientDeck installed
npx gradientdeck doctor             # where it's installed, and whether it's current
npx gradientdeck install --dry-run  # show what would change
```

The installer has no dependencies, makes no network requests and collects nothing.

## Contributing

Read [AUTHORING.md](https://github.com/VenoM9078/gradientdeck-skill/blob/main/AUTHORING.md) before changing the skill. The short version: describe how to choose, never what to choose; scope every rule to a context; make every rule checkable. `npm test` checks size budgets and a few content rules.

## License

MIT. Made by [GradientDeck](https://gradientdeck.com).
