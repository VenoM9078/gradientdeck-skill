# Composition

How a page is put together: what the first screen does, what order the sections come in, and which skeleton carries them. Structure is the part of a design that two products most often share by accident; decide it, don't inherit it from habit.

## Decide

1. **What is the visitor's first question?** Usually one of: "what is this?", "does it work?", "is it for me?", "what does it cost?". The first viewport answers that one, and nothing else needs to.
2. **What must the first viewport do for this product?**
   - **Show** when the product is visual or easy to grasp on sight (tools, apps, physical goods, portfolios). The real thing, large, early.
   - **Claim** when the value is an idea the visitor must accept first (new category, service, policy). One concrete sentence, set with conviction.
   - **Set a mood** when the product is felt before it's understood (venues, fashion, music, hospitality). One real image or atmosphere, minimal text.
   - **Get to work** when the visitor already knows why they're here (docs, dashboards, search). The content or control itself, no preamble.
3. **What is the argument?** Write the sections as a list of questions the visitor asks in order, each answered by one section. If two sections answer the same question, merge them. If a question has no section, the page has a gap.
4. **Which skeleton fits that argument?** Pick from the vocabulary below, or combine two deliberately.
5. **How does it differ from the last build?** Check the variation axes.

## Page skeletons

| Skeleton | Shape | Fits when |
|---|---|---|
| **Demo-first** | Product UI or live example fills the first screen; text is a caption; sections walk through real use | The product sells itself on sight |
| **Long argument** | A single readable column of claim, evidence, objection, answer; few images | Complex or skeptical buyers; services, policy, technical depth |
| **Index** | A dense, scannable list or grid of items with filters; little intro | Catalogues, directories, templates, collections, changelogs |
| **Single statement** | One screen, one sentence, one action; maybe a short second screen | Waitlists, launches, events, personal sites |
| **Editorial** | Magazine rhythm: varied column widths, pull quotes, large images, chapters | Brands with a story and real material to show |
| **Comparison-led** | Opens with the choice the visitor is making (plans, before/after, us vs the old way) | Pricing pages, migrations, alternatives to an incumbent |
| **Timeline** | Sections ordered by time or process step, visibly sequenced | Processes, histories, onboarding, how something is made |
| **Document** | Looks like a well-set document: headings, numbered sections, footnotes, a contents list | Technical, legal, research or manifesto-like products |
| **Gallery-led** | Images carry the page; text is labels and captions | Photography, architecture, products bought on looks |
| **Tool-as-page** | The page is a working calculator, converter or demo; explanation sits below | Utilities, APIs, anything that can be tried without signing up |

## Variation axes

In New world work, consecutive builds SHOULD differ on at least two of these (the last build is whatever you can see: earlier in the conversation or `.gradientdeck/decisions.md`). Name the two in your design note. In Extend and New surface, inherit instead.

- **First viewport:** show, claim, mood, get to work; full-height vs partial; centered vs asymmetric.
- **Navigation:** top bar, side rail, inline contents list, minimal (logo + one action), none.
- **Section rhythm:** uniform blocks, alternating dense/sparse, one long flow, chapters with breaks.
- **Grid:** single column, two unequal columns, multi-column editorial, full-bleed with insets.
- **Image role:** evidence, atmosphere, explanation, none (see `imagery.md`).
- **Footer:** minimal line, sitemap, closing statement, contact block, none.

## Rules

- SHOULD let every section answer one question, and do one of four jobs: **explain** (what it is, how it works), **prove** (evidence for a claim), **deepen** (detail for people already convinced) or **convert** (the next step). A section that does none of these is cut, however good it looks.
- SHOULD vary section weight to match importance. The most persuasive section gets the most space; supporting detail gets less.
- SHOULD pass the **brand test** in Persuade mode: hide the logo and nav, then look at the first viewport. If it could belong to another company in the same category, the product's identity isn't in it yet; change the content or structure, not the decoration.
- AVOID filling the first viewport to exactly 100vh by default. Let the next section peek in when the page continues, so scrolling feels invited.
- SHOULD place proof next to the claim it supports, not in a separate "testimonials" band. NEVER invent it (see `SKILL.md`).
- SHOULD keep the page as short as the argument. Stop when the questions run out.

### Navigation

- SHOULD size the nav to the site: a five-page site needs no mega-menu; a single page may need only a logo and one action.
- MUST keep navigation reachable by keyboard, with the current page marked by more than color (see `accessibility.md`).
- SHOULD make sticky headers short and only sticky when the page is long enough to need them.
- On mobile, SHOULD keep the primary action visible outside the menu (see `responsive.md`).

### Calls to action

- SHOULD have one primary action per page, repeated where the argument resolves (after the key evidence and at the end), not after every section.
- SHOULD name the actual action (see `copy.md`). One secondary action at most beside it, visibly lower in weight.
- AVOID a closing full-width "Ready to get started?" band by default. End on the strongest evidence or a direct next step.

### Footers

- SHOULD match the footer to what visitors look for at the end: legal and contact for most sites, a sitemap only when there are enough pages to need one.
- AVOID four equal link columns, a newsletter box and social icons as the reflex footer.

## By mode

- **Persuade:** everything above applies. Structure is a primary place to be specific.
- **Operate:** follow app-shell conventions. Navigation in a side rail or top bar, consistent across screens; page title and primary action top of content; content fills the remaining space. Don't invent layouts per screen. See `apps-and-data.md`.
- **Read:** a reading column of 45–75 characters, generous margins, a contents list for long pages (sticky in the margin on wide screens), headings that work as an outline. Character goes in the margins, header and type, not in the column. See `typography.md`.
- **Extend / New surface:** inherit the existing nav, footer and section patterns. Decide only the order and skeleton of the new page (see `extend.md`).

## Generic defaults to catch

- **The default skeleton** (hero, three cards, testimonial, CTA band, footer) → no decision behind the order → write the visitor's questions, then choose a skeleton from the table.
- **Centered full-height hero with headline, subline, two buttons** → see `tells.md` → decide show / claim / mood / get to work first.
- **Every section the same height, padding and layout** → no hierarchy across the page → vary weight by importance.
- **Alternating image-left / image-right rows for every feature** → zig-zag filler → group features by the question they answer; show the few that matter.
- **Same nav and footer on every build** → the frame becomes a signature → choose them along with the skeleton.

## Check

- The first viewport answers one named visitor question, and you can say which.
- Each section maps to one question and one job (explain, prove, deepen, convert); no two answer the same one.
- Persuade: with logo and nav hidden, the first viewport still couldn't belong to a competitor.
- The skeleton is named in the design note, with the two variation axes that differ from the last build.
- One primary action, with a specific label, placed where the argument resolves.
- Nav and footer are sized to the site, keyboard-reachable, with current page marked.
- Operate screens share one shell; Read pages keep the column at 45–75 characters.
