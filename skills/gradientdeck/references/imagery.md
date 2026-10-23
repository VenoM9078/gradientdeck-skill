# Imagery

Photographs, screenshots, illustration, icons and logos. Images are the fastest way to make a page specific, and the fastest way to make it interchangeable. Decide what an image is for before choosing one.

## Decide

1. **What role does this image play?**
   - **Evidence:** proves something real (the product's UI, the actual dish, the finished building).
   - **Atmosphere:** sets the feeling of the place or product.
   - **Explanation:** shows how something works (a diagram, an annotated screenshot).
   - **Identity:** says who this is (a founder portrait, the workshop, the logo).
   If it plays none of these, it's filler. Cut it.
2. **What real material exists?** Ask the user once whether they have photos of their own, and check the codebase. Theirs win every slot.
3. **If they have none:** photographs of the subject from the skill's library: `node <skill folder>/scripts/roll.mjs photos "<subject>"` prints matches with ready image code and credits (in New world, the roll's `--photos` prints them). For software, the product's own interface built in HTML leads, and photos set the scene. Type alone only when the page is about words. Drawings are for diagrams and icons, never in a photo's place.
4. **What single treatment will every image share?** One from the roll's list (natural, warm, muted, mono, tint, duotone), chosen to sit in the palette, plus one set of crops, frames and corners.

## Rules

### Real first

- SHOULD use real product screenshots for software: current UI, crisp at 2x, with realistic data that fits the product (real-looking names, plausible values, no lorem ipsum). Crop to the part that makes the point rather than shrinking the whole screen.
- SHOULD use real photography of the actual subject (the place, the people who work there, the object) over generic stock.
- SHOULD prefer a photograph of the actual subject to both a generic image and no image. A page about a place, food, a craft or an event with no photograph reads as a template; a page with off-subject stock reads as filler. Ask of each photo: if it were deleted, would the page lose a fact?

### Honesty

- NEVER present invented people, testimonials, team members or customer logos as real. NEVER use a company's logo without permission or a real relationship (see `SKILL.md`).
- When a real image will come later, fill its slot with a library photo of the subject at its final size, never visible "[Photo: …]" text or an empty tinted panel. List it in your report as a stand-in for the user's own.
- AVOID fake device, browser or editor frames around content (`tells.md`). A real screenshot may get a frame only when it needs one to be understood, and then a plain one. NEVER frame a mockup so it passes for a shipped product. Software with no screenshots: build the product's own interface in HTML, shown working, with realistic example data labelled as an example. That is content, not a mockup.
- NEVER pass off generated images as photographs of real places, products or people.

### Sourcing

- MUST use only the user's images, the project's, or photos the library prints. NEVER an image URL written from memory, and never a stock site (Unsplash, Pexels, Pixabay).
- MUST credit every library photo: one small "Photographs:" line in the footer with each printed credit.

### Art direction

- SHOULD give all photography one treatment: consistent crop ratios, color grade, light and framing. Mixed sources need grading to match, or they read as a collage.
- SHOULD crop with intent: tight crops for detail and texture, wide for place. Pick ratios from a small set and reuse them.
- SHOULD use illustration only when it has a reason (explaining something a photo can't, or a brand that owns an illustrated voice) and one consistent style, made for this product.
- AVOID mixing photography, 3D renders and flat illustration on one page.

### Icons

- SHOULD use the project's icon set if it has one (an icon package in `package.json`, an icons folder, icons imported in nearby components); never add a second. Otherwise pick one set.
- SHOULD use one icon set, one stroke weight, one size grid (for example 16/20/24px), aligned to text.
- SHOULD let icons support labels, not replace them. Icon-only buttons are for universally understood actions (close, search, menu) and MUST have an accessible name (`aria-label` or visually hidden text).
- AVOID emoji or Unicode symbols (arrows, ticks, stars) as interface icons or bullets: they render differently per platform and can't take the system's color or stroke. Allowed when emoji are part of the product's own content or voice.
- AVOID putting icons in colored tiles by default. Use an icon where it speeds recognition (navigation, file types, status), not as decoration above every heading.
- SHOULD give status icons a text equivalent; meaning is never carried by color or shape alone.

### Logos and customer marks

- SHOULD show customer or partner logos only if real and permitted. Display them at an even optical size, in one tone, unlinked unless there's a case study behind them.

## Performance

- SHOULD set `width` and `height` attributes (or `aspect-ratio`) on every image and video so the layout doesn't shift as they load.
- SHOULD serve responsive images with `srcset` and `sizes`, so phones don't download desktop files.
- SHOULD use modern formats (AVIF or WebP with a fallback via `<picture>`) for photographs; SVG for icons, logos and diagrams.
- SHOULD lazy-load images below the fold with `loading="lazy"`. Don't lazy-load the largest image in the first viewport (the LCP image); load it eagerly, and consider `fetchpriority="high"`.
- SHOULD compress: aim for under about 200KB for a full-width photo where quality allows.
- SHOULD give background video a poster image, `muted`, `playsinline`, and pause it under reduced motion (see `motion.md`).

## Alt text

- MUST give every meaningful image alt text that says what the image contributes in context, not what it literally contains ("Invoice list sorted by due date, three overdue" rather than "screenshot").
- MUST give decorative images `alt=""` so screen readers skip them.
- SHOULD keep alt to a sentence; put long explanations in a caption or nearby text. See `accessibility.md`.

## By mode

- **Persuade:** imagery is often the bold move. A page about something physical leads with a photograph, big; one strong image beats several weak ones.
- **Operate:** almost none. Icons and avatars only; empty states may use a small, consistent illustration if the system has one.
- **Read:** images serve the text: diagrams, figures, captions. Full column width or wider, never floated tiny.

## Generic defaults to catch

- **Abstract 3D shapes, isometric scenes, stock "team at laptop" photos** → see `tells.md` → decide the role, then use the real thing or nothing.
- **Fake browser or phone frames** → costume → the real screenshot, cropped to the point.
- **Icon in a rounded tile above every feature** → decoration posing as content → icons only where they aid recognition.
- **Screenshots with lorem ipsum or "John Doe"** → reads as a mockup → realistic data that fits the product.
- **Mixed image styles from different sources** → no art direction → one treatment, graded to match.

## Check

- Each image has a named role (evidence, atmosphere, explanation, identity).
- No invented people, quotes or logos; slots for images still to come look finished and are correctly sized.
- No fake device or browser chrome.
- The project's icon set if it has one, otherwise one set, one stroke weight, on a size grid; no emoji or Unicode symbol icons; icon-only buttons have accessible names.
- Every image has `width`/`height` or `aspect-ratio`; below-fold images lazy-load; the LCP image does not.
- Alt text describes purpose; decorative images have `alt=""`.
- Sources and licences are recorded.
