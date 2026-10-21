# Generic defaults ("tells")

Patterns that make a page read as template or AI output. None is banned; each is a **default**, and defaults are what you reach for when nothing about the product has been considered. Use one only when the subject or the existing system calls for it, and say why in your design note.

Genre conventions are not tells: a shop with product cards, a developer tool with a terminal session, docs with a sidebar. A convention turns into a tell when it's filler, careless, or doesn't fit the subject.

The looks and fonts in the first two sections are common because they work. They are allowed. What reads as generated is a page that is only one of them, with nothing on it that belongs to this product. Swapping one for a loud or odd alternative just to look different makes a worse page.

## Looks every model reaches for

Four complete looks every model reaches for. Use one when it suits the product, and make the page specific through its content, its object and its finish.

- **Warm cream ground, a high-contrast serif display, a terracotta or rust accent.** The default for anything handmade, local or "artisan": bakeries, coffee, ceramics, wellness, books.
- **Near-black ground with one neon accent** (acid green, electric blue, hot orange), usually with monospace labels. The default for developer tools, AI and anything "technical".
- **The broadsheet**: hairline rules, zero radius, dense columns, an italic serif and tracked small caps or monospace. The default "serious" alternative to the two above.
- **Flat saturated blocks with hard offset shadows** and a condensed display face. The default "playful" alternative.

## Fonts every model reaches for

Fraunces, Playfair Display, Cormorant, Lora, Crimson, Newsreader, EB Garamond, DM Serif, Syne, Space Grotesk, Space Mono, IBM Plex (all three), JetBrains Mono as decoration, Inter or Geist as a display face, DM Sans, Outfit, Manrope, Plus Jakarta Sans, Instrument Sans and Instrument Serif. These are good faces, and fine to use. Pick type by rendering two pairings and keeping the better one (`typography.md`), not by avoiding names.

For the rest: what it looks like → why it reads as generic → what to do instead → when it's fine.

## Color and surface

- **Purple-to-blue or cyan-to-magenta gradients** (backgrounds, buttons, text) → the single most common AI palette; it signals "no decision" → derive color from the subject's material world (see `color.md`) → fine when the brand already owns those colors.
- **Gradient-filled headlines** (`background-clip: text`) → decoration standing in for an idea; often hurts legibility → let size, weight and layout carry the headline; if color must carry it, use one solid committed color → fine for a single display word in an established brand system, with contrast checked at every point of the gradient.
- **Glows, soft blobs, aurora backgrounds** behind the hero → atmosphere with no source → if the page needs atmosphere, take it from the subject (a photograph, a texture, a material) → fine in a genuinely atmospheric genre (music, nightlife, games) when it's the one bold move.
- **Pure #000 or #fff as the base, or neutral gray everywhere** → untinted neutrals look unconsidered → tint neutrals slightly toward the brand hue → fine when the product's system already uses true neutrals.
- **Drab out of caution**: greige everything, flat surfaces, no imagery, chosen to avoid looking generated → reads lifeless and unfinished, and people pick the warmer page → restraint means one bold move, not none; give the page color, depth and imagery that come from the subject.
- **Visible placeholders** ("[Photo: to be supplied]", "TBD", "email to be confirmed") → the page reads unfinished to every visitor → write copy that works without the fact, leave the element out, or draw the subject; note the gap in a comment and in your report.
- **Glassmorphism on everything** (frosted cards over gradients) → effect without a reason → use translucency only where something real sits behind it.
- **A hairline border plus a wide, soft shadow on every card** → two boundaries doing one job, now a common generated finish → pick one way to separate the surface (border, tint or shadow) and use it consistently.

## Type

- **One sans-serif for everything, at default weights** → no voice → choose type by procedure (`typography.md`), with real contrast between roles.
- **A small all-caps label above every heading** ("FEATURES", "HOW IT WORKS") → template chrome → use it only where it adds information the heading doesn't; most headings need nothing above them.
- **An italic or colored "emphasis word" in every headline** → a formula → if a headline needs emphasis, rewrite it.
- **Monospace labels and metadata strings ("v2.0 · 2026 · open source", "DESIGN · BUILD · SHIP", "WORD — fragment") for flavour** → borrowed technical and editorial costume → use monospace only for actual code, data or values; write labels as plain words.
- **Oversized display headlines with extreme negative letter-spacing** → "impact" by default; letters start to collide and the size rarely matches the content → size display type to the layout and the message, and tighten only as much as the face needs at that size (`typography.md`).

## Layout and composition

- **Centered hero, full viewport height, headline + subline + two buttons** → the default first screen → decide what the visitor must see first for this product (see `composition.md`); often it's the product itself, a real image or a concrete statement, laid out asymmetrically.
- **Hero → three feature cards → testimonial → CTA → footer** → the default skeleton → keep the sections the reader needs, in the order they need them, and make each one specific to the product (`composition.md`).
- **A row of three identical cards, each with an icon in a rounded tile, a bold title and two lines** → filler that looks like content → if features matter, show them (screenshot, demo, example); if they don't, cut them; vary weight when items differ in importance.
- **Cards inside cards; borders around everything; a thick colored left border on cards** → boxes as decoration → use space and alignment to group; a border or surface change should mark a real boundary.
- **Bento grid of mismatched tiles** as a default feature layout → fine only when the tiles hold real, varied content of different importance.
- **Numbered section markers (01 / 02 / 03) on content that isn't a sequence** → borrowed structure → number only real steps, ranks or chapters.
- **Stat row of big numbers** ("10k+ users · 99.9% uptime · 24/7 support") → usually invented or meaningless → NEVER invent numbers; use real figures with sources, or remove the row.

## Interaction and motion

- **`transition: all` and hover-scale on every card and button** → motion without purpose → name the animated properties, one hover signal per element (`motion.md`).
- **Bounce or overshoot easing on UI state changes** → playful in the wrong place → reserve springs for direct manipulation; use ease-out for UI.
- **Everything fades up on scroll** → motion as a default → animate only what benefits from attention or continuity.
- **Toasts for actions the user can already see happened** → noise → show the result in place.
- **An arrow (→) on every link and button** → decoration posing as direction → use an arrow only where it means "go somewhere" or "next", not on every call to action.
- **Zoom-on-hover for every image** → motion with no meaning → reserve it for images that actually open larger.

## Imagery and content

- **Emoji as icons or bullet points** → unfinished → use one consistent icon set, or no icons.
- **Fake browser windows, phone frames and editor chrome** around content → costume → show the real thing, or a real screenshot → fine: a terminal block showing the actual commands and output.
- **Abstract 3D shapes, isometric illustrations and stock "team at laptop" photos** → interchangeable imagery → use real product screenshots, real photography of the subject, or no image.
- **Invented social proof**: logo walls of companies that aren't customers, made-up testimonials, "trusted by thousands" → dishonest and recognisable → NEVER; choose a structure that doesn't need proof, and tell the user what proof would help.

## Copy

- **Hype words** ("revolutionize", "supercharge", "unlock", "seamless", "next-generation", "all-in-one") → say what the product does, concretely.
- **"Not just X, but Y" and "X meets Y" constructions; triplets of adjectives** → formulas → write the specific claim.
- **"Get started" / "Learn more" as the only calls to action** → name the actual action ("Create your first invoice").
- **Heavy em-dash rhythm and rhetorical questions as headlines** → recognisable generated cadence → plain statements.

## Don't create new tells

Replacing one default with another is the most common failure. Signs you're doing it: you're reaching for a "distinctive" choice you've seen often lately; your last three builds share a font, palette or structure; a choice feels safe-but-tasteful rather than right for this subject. When you notice it, go back to the subject and choose from there.
