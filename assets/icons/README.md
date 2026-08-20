# Icons

Every icon on the page, one file each. All hand-drawn on a 24x24 grid — no icon
library is used anywhere in this build, and none should be introduced.

## How they are drawn

- `viewBox="0 0 24 24"`, no fixed pixel size baked in beyond a 24x24 default.
- Outline icons: `fill="none"`, `stroke="currentColor"`, `stroke-width="1.7"`,
  round caps and joins. Two are solid instead (`sparkle`, `play`) and use
  `fill="currentColor"`.
- `currentColor` throughout, so colour comes from the CSS `color` of whatever
  contains the icon. On the page they render gold (`--gold-500`, #F5AE2B) or
  navy (`--navy-900`, #0F2C69) depending on the section.

The page itself inlines these same paths rather than linking these files —
inline SVG is what lets `currentColor` and the tab hover states work. These
files are the shareable source of truth for the same set.

## Colour variants for handover

The files in the root of this folder use `currentColor` and are the source.
Two fixed-colour copies sit alongside them for anyone working outside the
codebase:

| Folder | Contents |
| --- | --- |
| `orange/` | 19 SVG, colour hard-coded to `#F5AE2B` |
| `white/` | 19 SVG, colour hard-coded to `#FFFFFF` |
| `png/orange/`, `png/white/` | the same, rasterised to 512×512 PNG on a transparent background |

White is for navy and photographic grounds only. The white PNGs look blank
in a file browser — the background is transparent, not white.

Regenerate all four folders, and the handover zip, with:

```
python3 tools/build-icon-bundle.py
```

## The set

| File | Used for |
| --- | --- |
| `location-pin.svg` | Hero — date and venue card |
| `target.svg` | Delegates — outcome 1, reflect on strategic direction |
| `document-lines.svg` | Delegates — outcome 2, learn from real cases |
| `pencil.svg` | Delegates — outcome 3, return with practical tools |
| `moon.svg` | Delegates — outcome 4, rewind and recharge |
| `star.svg` | Delegates — outcome 5, reconnect with curiosity |
| `podium.svg` | Pillars tab — Strategy Knowledge |
| `briefcase.svg` | Pillars tab — Business Case Studies |
| `person.svg` | Pillars tab — Leadership Awareness; Values — Humbleness |
| `sun.svg` | Pillars tab — Strategic Essential Skills |
| `open-book.svg` | Methodology node — Sharing Knowledge |
| `people.svg` | Methodology node — Building Connections; Experience rail label |
| `growth-swoosh.svg` | Methodology node — Staying Grounded |
| `sparkle.svg` | Methodology core — Lifetime Experience |
| `heart.svg` | Values — Generosity |
| `compass.svg` | Values — Openness |
| `play.svg` | Every film — play button |
| `arrow-left.svg` | Venue carousel — previous photo |
| `arrow-right.svg` | Venue carousel — next photo |

19 icons.
