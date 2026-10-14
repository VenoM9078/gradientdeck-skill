# Benchmark

Measures whether the skill makes an agent's UI work better, by running the same tasks with and without it.

- **Arm A:** no skill. **Arm B:** the skill, installed with the real installer.
- Same model, effort, tools and prompt in both arms. Each task runs 3 times per arm.
- Runs use an isolated Claude Code profile, so no user-level skills, plugins or settings leak in.
- Round 1 gives both arms file tools only (no shell, browser or web), so it measures judgment, not tooling.

## Tasks (`tasks.json`)

- 10 **greenfield** briefs (static sites), 5 **extend** tasks on real codebases (a Next.js site and a Vite admin dashboard), 3 **redesign** tasks on deliberately generic fixtures (`fixtures/`).
- Tasks marked `holdout` are never looked at while improving the skill. Their results show whether improvements generalize.
- Briefs supply facts but no testimonials or metrics, so invented proof is measurable.

## Setup (once)

1. Bases live in `E:/gd-bench/bases/` (override with `GD_BENCH_ROOT`):
   - `gradientdeck/`: a snapshot of the website without docs or marketing, with `node_modules` as a junction to the site's install.
   - `admin/`: an open-source shadcn admin dashboard, with dependencies installed.
2. Log the benchmark profile in once:
   ```powershell
   $env:CLAUDE_CONFIG_DIR = "E:\gd-bench\.claude-home"
   claude      # then /login, then /exit
   ```

## A round

```bash
node bench/run.mjs --round r1            # 108 agent runs (resumable; skips finished runs)
node bench/check.mjs --round=r1          # render + measure every run
node bench/pairs.mjs --round=r1          # blind A/B pairs + hidden key
# agent judge: a fresh subagent follows judge-agent.md and writes judgments-agent.json
node bench/judge-server.mjs --round=r1 --judge=you   # human judging page on localhost
node bench/report.mjs --round=r1         # scorecard → report.md
node bench/clean.mjs <round> [task]      # safe delete (removes junctions first)
```

Never delete run folders with `rm -rf`: workspaces contain junctions to the shared `node_modules`.

## What's measured

- **Blind preference** (agent judge and human), overall and on holdout tasks.
- **Generic defaults** from computed styles: purple-blue gradients, gradient text, centered full-height hero, eyebrow labels, emoji as UI, identical card rows, `transition: all`.
- **Honesty:** numbers on the page that the brief didn't supply, testimonial-like quotes.
- **Craft:** text contrast failures, horizontal overflow at 390px.
- **Codebase tasks:** raw color values, arbitrary Tailwind values and inline styles added vs. existing components and tokens used.
- **Convergence:** how often the same headline font, accent hue, background and hero layout repeat across greenfield runs.
- **Cost and time** per run, and whether the skill triggered.
