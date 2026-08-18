# Assets

Paths below are exactly the ones `index.html` requests. Drop a real file at a
listed path and it appears — no code change needed. Until then the page renders
a tinted well (photos/video) or the alt text (logos) instead of a broken image;
see the fallback block in `assets/js/app.js`.

## Delivered

| Path | Source file | Used by |
|---|---|---|
| `video/methodology-bg.mp4` | `0_Above_Abstract_1280x720.mp4` | Methodology band background |
| `video/retreat-2025-comprehensive.mp4` | `Retreat_2025_1_1_1.mp4` | Experience — "Comprehensive Experience" |

Both mappings are inferred from the filenames — the abstract clip to the
abstract background slot, the 2025 clip to the panel captioned "The Strategy
Retreat 2025". Swap them if the intent was the other way round.

## Missing — photography

| Path | Used by | Rendered size / crop |
|---|---|---|
| `photos/hero-d.png` | Hero backdrop | Full-bleed, ≥1920×1080, focal point centred |
| `strategy-community-mark.png` | Mobile bar, desktop nav, footer | Transparent PNG; drawn at 26 / 32 / 34 px tall. Nav copies are inverted to white via CSS filter |
| `cutout-badr.png` | Delegate card 1 | 3:4 portrait crop |
| `photos/retreat-wide-6.png` | About — "Three days" | 220 px tall (mobile) / 280 px (desktop), cover |
| `photos/three-days-night.png` | About — "Real-world knowledge" | 220 px / 300 px, cover |
| `photos/retreat-4x3-3.png` | Knowledge Pillars intro | 200 px / 280 px, cover |
| `photos/mt-workshop.png` | Pillar 01, FAQ aside, closing CTA background | 16:10; also full-bleed behind the CTA at 45% opacity |
| `photos/retreat-4x3-2.png` | Pillar 03 | 16:10 |
| `photos/retreat-wide-4.png` | Pillar 04 | 16:10 |
| `venue/venue-2.png` | Accommodation | 4:3 |
| `logos/business-belaraby.png` | Partners | 20 px tall, transparent |
| `logos/nexus.png` | Partners | 42 px tall, transparent |
| `logos/jrny.png` | Partners | 32 px tall, transparent |

Delegate cards 2–4 (Islam Saadany, Ahmed Sherien Korayem, Ahmed Bayoumi) have
no image in the artboards either — they are drawn as flat wells with the name
plate over them. Add an `<img>` inside `.delegate__media` to fill them.

## Missing — video

| Path | Used by |
|---|---|
| `video/business-case-studies.mp4` | Knowledge Pillars, tab 02 |
| `video/knowledge-sharing.mp4` | Experience card 1 |
| `video/mindful-connection.mp4` | Experience card 2 |
| `video/business-case-studies-2.mp4` | Experience card 3 |

All ambient clips are `autoplay loop muted playsinline` and decorative
(`aria-hidden`). They are paused when the visitor prefers reduced motion. Add a
`poster` attribute when supplying each clip so the first frame shows before the
video decodes.
