# Color

Color sets mood before anything is read, and it carries state, emphasis and meaning. Choose how much color the page uses first, then which colors, then build them as a system.

## Decide

1. **Inherit.** Existing brand colors and tokens win (`extend.md`). Extend their ramps; don't replace them.
2. **Strategy.** Pick one of the four below for this surface's mode.
3. **Source.** List the colors of the subject's world: its objects, places, materials, the light it is used in, and for software its interface, states, signals and output. Pick from that list, not from what websites usually look like.
4. **Light or dark.** Decide from where and when the product is used (rules below), not from taste. Light grounds, warm off-whites included, are fine when the scene suits them; dark is never a way to look different.
5. **Build.** Ramps in OKLCH, tinted neutrals, semantic colors, tokens.
6. **Look.** Render the first screen and check it as a visitor would: a calm ground, text that reads easily, and one accent the eye goes to first. If the colors fight or shout, quiet them before adding anything.

## Strategy

| Strategy | What it is | Fits |
|---|---|---|
| **Restrained** | Tinted neutrals carry the page; one accent marks actions and state, under roughly 10% of the area | Operate by default; Read; Persuade when the content (photos, product) brings the color |
| **Committed** | One brand hue owns large surfaces (a header field, a section, the primary surfaces) plus neutrals | Persuade; Read for a brand with a strong owned color; Operate only in chrome (sidebar, header), never behind data |
| **Full palette** | Several hues, each with a fixed role (categories, products, characters, chart series) | When the subject has real categories, or the genre is plural (children's, food, events, editorial). Every hue needs a job |
| **Drenched** | One hue floods the whole view; text and surfaces are tones of that hue | Persuade only. Not for Operate or long Read |

AVOID mixing strategies within one surface. If you can't name the strategy, the page has none.

## Rules

- **SHOULD build ramps in OKLCH.** Its lightness channel is perceptually even, so equal L steps look like equal steps across hues, and changing L keeps the hue stable, which HSL does not (HSL yellow and blue at the same "lightness" look nothing alike).
- **SHOULD step lightness, not chroma, to make a ramp**, with 9–12 steps from near-white to near-black. Reduce chroma toward both ends: very light and very dark colors can't hold high chroma inside sRGB, and out-of-gamut values get clipped or mapped by the browser, often shifting hue. Check each step is in sRGB gamut; offer wider-gamut values only inside `@media (color-gamut: p3)`.
- **SHOULD tint neutrals toward the brand hue** with very low chroma (about 0.005–0.02). Grays, borders and dark surfaces then belong to the palette. Keep the tint consistent across the whole neutral ramp.
- **SHOULD ration the accent.** It marks the primary action, current selection, focus and key data, nothing decorative. One primary action per view. If everything is accented, nothing is.
- **SHOULD derive semantic colors in the same system.** Success, warning, danger and info get their own ramps at similar lightness and chroma to the brand ramp, so they sit in the palette rather than looking pasted in. If the brand hue is close to a semantic hue (a red brand, a green brand), separate them by hue shift, lightness and an icon or label, and never use the brand color for a destructive action.
- **NEVER carry meaning by color alone.** Pair status colors with text, icons or patterns; charts get labels or markers.
- **SHOULD choose light or dark from physical context.** Dim environments, long sessions at night, media and imaging, control rooms and terminals favour dark. Bright offices, outdoors, print-adjacent and long-form reading favour light. When both are supported, follow `prefers-color-scheme` and offer a manual switch.
- **Dark mode is a second design, not an inversion:**
  - SHOULD use a tinted, near-black base, not `#000`; pure black with white text smears on many displays.
  - SHOULD show elevation by lightness: raised surfaces are lighter. Shadows barely read on dark.
  - SHOULD lower chroma of large colored areas and accents compared to light mode; saturated color on dark vibrates.
  - SHOULD keep body text slightly below full white.
  - MUST re-check every contrast pair; ratios don't survive inversion.
  - SHOULD set `color-scheme` so form controls and scrollbars match.
- **MUST meet contrast** (table below) for text in every state, including placeholders, muted text, text on images and text on every point of a gradient. Disabled controls are exempt, but must still look disabled, not invisible.
- **Gradients need a purpose:** a light source, depth, a material, a transition between two real states. When used:
  - SHOULD stay same-hue or analogous (neighbouring hues). Distant hues need an intermediate stop.
  - SHOULD interpolate in a perceptual space: `linear-gradient(in oklch, …)` keeps chroma but can swing through unexpected hues between distant colors; `in oklab` takes the straight path with no hue swing, but can dip toward gray between near-complements. The default sRGB interpolation often produces a muddy middle.
  - SHOULD check banding on large, low-contrast gradients; a subtle noise layer or more stops fixes it.
- **MUST use tokens.** Two layers: primitive ramps (`--blue-600`) and semantic roles (`--color-surface`, `--color-text-muted`, `--color-accent`, `--color-danger`, `--color-border`). Components reference roles only; themes remap roles to different primitives.

## Values

| Pair | Minimum (WCAG 2.x AA) |
|---|---|
| Body and small text | 4.5:1 |
| Large text (24px+, or 19px+ bold) | 3:1 |
| UI component boundaries, focus indicators, icons that carry meaning, chart marks | 3:1 against adjacent colors |
| Enhanced (AAA) body text | 7:1 |

| OKLCH | Range |
|---|---|
| L | 0 to 1 (0% to 100%) |
| C | 0 up to about 0.37; most sRGB colors sit under 0.25 |
| H | 0–360 degrees |
| Neutral tint chroma | about 0.005–0.02 |

Contrast ratios are computed from relative luminance, not from OKLCH L; always measure the final pair.

## Generic defaults to catch

Palette tells live in `tells.md` (purple-blue gradients, glows, untinted neutrals, the safe "tasteful" palette, glass). Also catch:

- **The framework's default palette used as the brand** → recognisable instantly → build ramps from your source colors.
- **Accent on headings, icons, links, borders and buttons at once** → no hierarchy → ration it.
- **Semantic colors at full saturation next to a muted brand** → they shout → match lightness and chroma to the system.
- **Dark mode made by inverting light mode** → wrong elevation, harsh contrast → design it per the dark-mode rules.
- **Muted gray text that fails 4.5:1** → the most common contrast failure → darken until it passes.
- **Colored shadows and glows to add "depth"** → decoration → depth from lightness and layering; glow only where light has a source in the product.

## Check

- You can name the strategy and the subject source of each hue.
- Every color in the code is a token; components use role tokens only.
- One primary accent per view; it marks action or state, not decoration.
- All text pairs meet 4.5:1 (3:1 large); UI boundaries and focus meet 3:1, in light and dark.
- Status is readable in grayscale (icon or label present).
- Neutrals carry a consistent tint; no stray pure grays.
- Dark mode: no `#000` base, raised surfaces lighter, accents less saturated, form controls themed.
- Gradients have a stated purpose, a declared interpolation space, and no muddy or banded middle.
