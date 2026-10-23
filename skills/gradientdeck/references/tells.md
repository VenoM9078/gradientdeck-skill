# Generic defaults ("tells")

Patterns that make a page read as template or AI output. None is banned; each is a **default**, what you reach for when nothing about the product was considered. Use one when the subject or the existing system calls for it, and say why in your design note.

Genre conventions are not tells: a shop with product cards, a developer tool with a terminal session, docs with a sidebar. A convention turns into a tell when it's filler, careless, or doesn't fit the subject.

The looks and fonts in the first two sections are common because they work. They are allowed. What reads as generated is a page that is only one of them, with nothing on it that belongs to this product. Swapping one for its opposite just to look different makes a worse page, and becomes the next default.

## Looks every model reaches for

Four complete looks every model reaches for. Use one when it suits the product, and make the page specific through its content, its object and its finish.

- **Warm cream ground, a high-contrast serif display, a terracotta or rust accent.** The default for anything handmade, local or "artisan": bakeries, coffee, ceramics, wellness, books.
- **Near-black ground with one neon accent** (acid green, electric blue, hot orange), usually with monospace labels. The default for developer tools, AI and anything "technical". Its cheap version is the tell: unsourced glow, mono costume, no product on screen. Precise type, layered dark surfaces and the product's interface shown working are craft, not this look.
- **The broadsheet**: hairline rules, zero radius, dense columns, an italic serif and tracked small caps or monospace. The default "serious" alternative to the two above.
- **Flat saturated blocks with hard offset shadows** and a condensed display face. The default "playful" alternative.

## Fonts every model reaches for

Fraunces, Playfair Display, Cormorant, Lora, Crimson, Newsreader, EB Garamond, DM Serif, Syne, Space Grotesk, Space Mono, IBM Plex (all three), JetBrains Mono as decoration, Inter or Geist as a display face, DM Sans, Outfit, Manrope, Plus Jakarta Sans, Instrument Sans and Instrument Serif. Good faces, and fine as workhorses in Operate and Read. In Persuade work on a new world, reaching for one means you stopped looking: use it only with a reason in the plan no other face meets. The subject's cliche (books want a serif, tech wants mono) is not that reason. Then render two pairings (`typography.md`).

For the rest: what it looks like → why it reads as generic → what to do instead → when it's fine.

## Color and surface

- **Purple-to-blue or cyan-to-magenta gradients** (backgrounds, buttons, text) → the single most common AI palette; it signals "no decision" → derive color from the subject's material world (see `color.md`) → fine when the brand already owns those colors.
- **Gradient-filled headlines** (`background-clip: text`) → decoration standing in for an idea; often hurts legibility → let size, weight and layout carry the headline; if color must carry it, use one solid committed color → fine for a single display word in an established brand system, with contrast checked at every point of the gradient.
- **Light with no source**: soft blobs and aurora behind the hero, a zero-offset colored halo around cards and buttons → atmosphere standing in for an idea → give light a source and a falloff: the product's output, a state change, a signal moving through the page → fine as the one bold move when it comes from what the product does, or in an atmospheric genre (music, nightlife, games).
- **Pure #000 or #fff as the base, or neutral gray everywhere** → unconsidered → tint neutrals toward the brand hue → fine when the system already uses true neutrals.
- **Drab out of caution**: greige everything, flat surfaces, no imagery, chosen to avoid looking generated → reads lifeless, and people pick the warmer page → restraint means one bold move, not none.
- **Visible placeholders** ("[Photo: to be supplied]", "TBD", "email to be confirmed") → reads unfinished → write around missing facts; author demo content and label it as an example; list both in your report.
- **Glass as decoration** (frosted cards over gradients) → use translucency only where something real sits behind it.
- **A hairline border plus a wide, soft shadow on every card** → two boundaries doing one job → pick one way to separate surfaces and keep to it.

## Type

- **One sans-serif for everything, at default weights** → no voice → choose type by procedure (`typography.md`), with real contrast between roles.
- **A small all-caps label above every heading** ("FEATURES", "HOW IT WORKS") → template chrome → use it only where it adds information the heading doesn't; most headings need nothing above them.
- **An italic or colored "emphasis word" in every headline** → a formula → if a headline needs emphasis, rewrite it.
- **Monospace labels and metadata strings ("v2.0 · 2026 · open source", "DESIGN · BUILD · SHIP", "WORD — fragment") for flavour** → costume → monospace only for real code, data or values; labels as plain words.
- **Oversized display headlines with extreme negative letter-spacing** → "impact" by default; letters collide → size display type to the message, and tighten only as much as the face needs (`typography.md`).

## Layout and composition

- **Centered hero, full viewport height, headline + subline + two buttons** → the default first screen → decide what the visitor must see first for this product (see `composition.md`); often it's the product itself, a real image or a concrete statement, laid out asymmetrically.
- **Hero → three feature cards → testimonial → CTA → footer** → the default skeleton → keep the sections the reader needs, in the order they need them, and make each one specific to the product (`composition.md`).
- **A row of three identical cards, each with an icon in a rounded tile, a bold title and two lines** → filler that looks like content → if features matter, show them (screenshot, demo, example); if they don't, cut them; vary weight when items differ in importance.
- **Cards inside cards; borders around everything; a thick colored left border on cards** → boxes as decoration → use space and alignment to group; a border or surface change should mark a real boundary.
- **Bento grid of mismatched tiles** as a default feature layout → fine only when the tiles hold real, varied content of different importance.
- **Numbered section markers (01 / 02 / 03) on content that isn't a sequence** → borrowed structure → number only real steps, ranks or chapters.
- **Stat row of big numbers** ("10k+ users · 99.9% uptime") → usually invented → NEVER invent numbers; real figures with sources, or no row.

## Interaction and motion

- **`transition: all` and hover-scale on every card and button** → motion without purpose → name the animated properties, one hover signal per element (`motion.md`).
- **Bounce or overshoot easing on UI state changes** → playful in the wrong place → reserve springs for direct manipulation; use ease-out for UI.
- **Everything fades up on scroll** → motion as a default → animate only what benefits from attention or continuity.
- **An arrow (→) on every link and button** → decoration posing as direction → an arrow only where it means "go somewhere" or "next".

## Imagery and content

- **Emoji as icons or bullet points** → unfinished → use one consistent icon set, or no icons.
- **Fake browser windows, phone frames and traffic-light dots** around content → costume → show the real thing → fine: a terminal block with the actual commands, or the product's own interface built in HTML, shown working with realistic example data labelled as an example.
- **Abstract 3D shapes, isometric illustrations and stock "team at laptop" photos** → interchangeable imagery → use the product's own interface or a library photo of the subject.
- **Invented social proof**: logo walls of companies that aren't customers, made-up testimonials, "trusted by thousands" → dishonest and recognisable → NEVER; choose a structure that doesn't need proof, and tell the user what proof would help.

## Copy

- **Hype words** ("revolutionize", "supercharge", "unlock", "seamless", "next-generation", "all-in-one") → say what the product does, concretely.
- **"Not just X, but Y" and "X meets Y" constructions; triplets of adjectives** → formulas → write the specific claim.
- **"Get started" / "Learn more" as the only calls to action** → name the actual action ("Create your first invoice").
- **Heavy em-dash rhythm and rhetorical questions as headlines** → recognisable generated cadence → plain statements.

## Don't create new tells

Replacing one default with another is the most common failure. Signs: a "distinctive" choice you've seen often lately; your last three builds share a font, palette or structure; a choice feels safe-but-tasteful rather than right. Go back to the subject and choose from there.
