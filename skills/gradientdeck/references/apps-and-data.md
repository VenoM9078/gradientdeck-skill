# Apps and data

Operate mode in depth: app shells, tables, filters, forms, dashboards and settings. Here people come back daily to get work done, so speed, predictability and density beat expression. Personality lives in type, color and one signature detail (see `principles.md`), never in reinvented controls.

## Decide

1. **What are the three most frequent tasks on this screen?** They get the primary positions; everything else goes one level down.
2. **How often, and how expert, are the users?** Daily experts want density and shortcuts; occasional users want labels, space and guidance.
3. **What decision does this data support?** A dashboard or table exists to answer a question. Write the question before choosing a component.
4. **What already exists?** Inherit the shell, table and form patterns of the codebase (see `extend.md`). Never introduce a second table style.

## Rules

### App shell

- SHOULD follow convention: primary navigation in a left sidebar (many sections, or sections that grow) or a top bar (five or fewer stable sections). Account and settings sit at a far end of the nav.
- Every page SHOULD have a header with the page title, an optional one-line context, and the primary action at the end of the header row. One primary action per page; others are secondary or in an overflow menu.
- The current location MUST be indicated by more than color (weight, a marker, `aria-current="page"`).
- Keep the shell stable: nav, header height and action positions don't move between pages.

### Density

- Choose density from task and frequency, not taste: monitoring and bulk editing → compact; occasional review → comfortable. Offer a density toggle only when both audiences really exist.
- Density changes row height and padding, never text below the readable minimum or targets below 24×24px.

### Tables

- Text columns align left; numbers align right with tabular numerals (`font-variant-numeric: tabular-nums`) so digits line up; headers align with their column's content.
- Keep units and precision consistent within a column; put the unit in the header, not in every cell.
- Header row SHOULD be sticky in any table taller than the viewport. The first column (the row's identity) SHOULD be sticky when the table scrolls sideways.
- Row height: around 28–36px compact, 40–48px comfortable (`space-and-layout.md`), taller only when rows hold two lines or avatars. Pick one per table.
- Use either thin dividers or zebra striping, not both. Dividers suit most tables; zebra helps wide tables with many columns where the eye tracks across.
- Truncate long text with an ellipsis only where the full value is available on hover and on keyboard focus (title alone is not keyboard-accessible), or in the row detail. Never truncate numbers, IDs or amounts.
- Sortable headers are buttons with a visible sort indicator on the active column and `aria-sort` on its header cell.
- Selection: a checkbox column with a header checkbox for select-all (with an indeterminate state), and a bulk action bar showing the count ("3 selected") that replaces or sits over the table toolbar.
- Row states: loading uses skeleton rows of the real row height; an empty table shows the empty state inside the table frame (see `copy.md`); a failed load shows the error and a retry in place. Row actions on hover MUST also be reachable by keyboard and on touch.

### Filters and search

- Active filters MUST be visible as removable chips or a summary line, with a "Clear all". A hidden active filter makes the data look wrong.
- Show the result count, and update it as filters change. Show per-option counts when they help people avoid empty results.
- Search SHOULD filter as you type (debounced) for local data; for slow queries, search on Enter and show progress.
- Filter and sort state SHOULD live in the URL so views can be shared and survive reload.

### Forms in apps

- Group related fields under short headings; order them as the user thinks about the task, not as the database stores them.
- Inline edit suits single values edited often (a name, a status). Use a form or panel when several fields must change together or need validation across fields.
- Pick one save model per surface and make it obvious. **Autosave**: show "Saving…" then "Saved", and never also show a Save button. **Explicit save**: a Save button, a visible unsaved-changes indicator, and a warning before leaving with unsaved changes.

### Dashboards

- Start from the decisions users make ("Which accounts need attention today?"), then show the data that answers each one. Don't start from a row of KPI cards.
- A single number needs context to mean anything: comparison to a previous period or a target, and the time range.
- Choose the chart by the question:

| Question | Chart |
|---|---|
| Compare categories | Bar, sorted by value, horizontal if labels are long |
| Trend over time | Line; bars for few discrete periods |
| Part of a whole | Stacked bar or a single 100% bar; pie only for 2–4 slices |
| Distribution | Histogram, box plot, dot/strip plot |
| Relationship | Scatter |

- Label lines and bars directly at their ends instead of a distant legend when there are few series. Start bar axes at zero. Show units and time range.
- Color: categorical palettes for unordered categories (keep to a handful you can tell apart), sequential (one hue, light to dark) for ordered magnitude, diverging (two hues around a meaningful midpoint) for above/below a reference.
- NEVER rely on color alone to separate series or states: add labels, patterns, markers or position. Distinguish series by lightness as well as hue, so they survive color-vision deficiency and grayscale.
- Every chart has a text alternative: a summary sentence or an accessible data table.

### Settings

- Group by what users are trying to change, with a clear heading per group. Long settings use a section nav.
- Each setting: label, one line on what it affects, current value visible. Toggles apply immediately; grouped fields share one save.

### Destructive actions

- Prefer undo over confirmation for reversible actions ("Archived. Undo").
- Confirm only what can't be undone. The dialog names the object and the consequence ("Delete project 'Atlas'? 214 files will be removed permanently."), and the confirm button repeats the verb ("Delete project"). For high-stakes deletes, ask the user to type the name.
- Destructive buttons use the danger color plus a clear label; never the default focus in the dialog.

### Keyboard, command palette, notifications

- Offer shortcuts for frequent actions and show them in menus and tooltips. Don't override browser or assistive-technology shortcuts. Single-key shortcuts MUST be possible to turn off or remap, or work only when the relevant element has focus (WCAG 2.1.4).
- A command palette suits apps with many actions or objects; it searches both, shows shortcuts beside results, and opens with no animation, because keyboard-triggered UI should appear instantly (see `motion.md`).
- Notifications: confirm in place where the change is visible; use a toast only for background results or undo; reserve banners for persistent system state; never interrupt with a modal for information.

## Generic defaults to catch

- **A row of four gradient stat cards with icons and "+12%" badges** → the default dashboard opening, often with invented numbers → start from decisions; show context; NEVER invent figures.
- **Donut charts for everything** → hard to compare → pick the chart from the question table.
- **Centered numbers in tables, no tabular numerals** → digits don't line up → right-align with tabular numerals.
- **Every action as a primary button** → no hierarchy → one primary per page.
- **Rainbow chart palettes** → color without meaning → categorical, sequential or diverging on purpose.
- **Custom-styled dropdowns, toggles and date pickers** → novelty where people expect convention → native or established components.

## Check

- [ ] One primary action per page, in the header row.
- [ ] Numbers right-aligned with tabular numerals; text left-aligned.
- [ ] Long tables have sticky headers; truncated cells reveal the full value on hover and focus.
- [ ] Active filters visible with counts and "Clear all"; state in the URL.
- [ ] Empty, loading and error states exist for every table and chart.
- [ ] Each dashboard element answers a written question; each number has context.
- [ ] No chart relies on color alone; few series are labelled directly.
- [ ] Irreversible actions confirm with the object named; reversible ones offer undo.
- [ ] One save model per surface, clearly signalled.
