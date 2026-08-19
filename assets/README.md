# Assets

Paths below are the ones `index.html` requests. Drop a real file at a listed
path and it appears — no code change needed. Anything still missing renders as a
tinted well (photos) or the alt text (logos); see the fallback block in
`assets/js/app.js`.

## Video — complete

All six clips arrived with filenames matching the design exactly and are
installed as-is:

`methodology-bg.mp4` · `retreat-2025-comprehensive.mp4` · `knowledge-sharing.mp4`
· `mindful-connection.mp4` · `business-case-studies.mp4` ·
`business-case-studies-2.mp4`

`business-case-studies.mp4` and `business-case-studies-2.mp4` are byte-identical;
both names are kept because the design references both.

All are `autoplay loop muted playsinline` and decorative (`aria-hidden`), and
pause when the visitor prefers reduced motion. None has a `poster` — supply a
first-frame still per clip and it can be wired in.

## Venue — complete

`venue-1` … `venue-4.png` drive the accommodation carousel. Ratios differ
(4:3, 4:5, 16:9, 4:3); the slot is 4:3 with `object-fit: cover`, so each is
centre-cropped.

## Photography — installed

| Path | Supplied as | Note |
|---|---|---|
| `photos/retreat-wide-6.png` + `.small.png` | same names | the only stem shipped at two sizes — wired through `srcset` |
| `photos/retreat-wide-4.png` | same name | Pillar 04 |
| `photos/retreat-wide-3.png` | same name | spare; Pillar 02 uses the video the artboards specify |
| `photos/hero-d.png` | `hero-d.small.png` | **640×426 only** — see below |
| `photos/three-days-night.png` | `three-days-night.small.png` | 640×512 |
| `photos/mt-workshop.png` | `mt-room-wide.png` | assigned by subject: the session room with delegates |
| `photos/retreat-4x3-3.png` | `circle-session.small.png` | assigned by subject: floor circle + flipchart, for "shared practice" |
| `photos/retreat-4x3-2.png` | `content-knowledge.small.png` | assigned by subject: speaker addressing the group, for "Leadership Awareness" |

The last three had no filename match in the archives and were chosen by looking
at each image against the slot's copy. **Worth a review** — swapping any of them
is a one-line change.

## Testimonial films

The Experience rail currently reuses `knowledge-sharing.mp4`,
`mindful-connection.mp4` and `business-case-studies-2.mp4` as stand-ins. The
quotes and attributions (Ahmed Hassan, Mariam Ali, Omar Khalil) come from the
supplied reference and read as placeholders — **confirm the real names, roles
and clips before launch.** Adding films needs no code change: drop another
`<li class="quote vplayer">` into `.quotes` and the dots follow.

## Still needed

| Path | Used by | Note |
|---|---|---|
| `cutout-badr.png` | Delegate card 1 | Cut-out portrait on transparent ground, 3:4 |
| `logos/business-belaraby.png` | Partners | 20px tall, transparent |
| `logos/nexus.png` | Partners | 42px tall, transparent |
| `logos/jrny.png` | Partners | 32px tall, transparent |
| `the-strategy-retreat-2026.pdf` | Mobile bar "Download PDF" | The link is wired and waiting on the file |

## Brand — installed

| Path | Used by | Note |
|---|---|---|
| `strategy-community-mark-white.png` | Nav bar, mobile and desktop | the mark alone, cropped from the white lockup — gold needle intact |
| `strategy-community-lockup.png` | Footer, mobile and desktop | the full navy lockup |

**Both are recovered from phone screenshots, not exported files.** The artwork
arrived composited on a black backdrop, so it was un-matted — alpha recovered
from the backdrop and colour un-premultiplied — then cropped. The result is
clean at the sizes used (34–52px tall) and its aspect ratio matches the one
supplied vector-clean lockup to within 0.2%, so nothing is cropped off. Even so,
**replace both with the original PNG or SVG exports when you can**: these top out
at screen resolution and will not scale up.

## Testimonial films

The Experience rail currently reuses `knowledge-sharing.mp4`,
`mindful-connection.mp4` and `business-case-studies-2.mp4` as stand-ins. The
quotes and attributions (Ahmed Hassan, Mariam Ali, Omar Khalil) come from the
supplied reference and read as placeholders — **confirm the real names, roles
and clips before launch.** Adding films needs no code change: drop another
`<li class="quote vplayer">` into `.quotes` and the dots follow.

## Still needed

| Path | Used by | Note |
|---|---|---|
| `cutout-badr.png` | Delegate card 1 | Cut-out portrait on transparent ground, 3:4 |
| `logos/business-belaraby.png` | Partners | 20px tall, transparent |
| `logos/nexus.png` | Partners | 42px tall, transparent |
| `logos/jrny.png` | Partners | 32px tall, transparent |
| `the-strategy-retreat-2026.pdf` | Mobile bar "Download PDF" | The link is wired and waiting on the file |

## Brand mark — installed

The supplied white knockout lockup was cropped to the mark alone (its left
panel, 118×188) and installed two ways:

| Path | Used by | Note |
|---|---|---|
| `strategy-community-mark-white.png` | Mobile bar (34px), desktop nav (32px) | the supplied artwork, cropped — unmodified pixels |
| `strategy-community-mark.png` | Footer (30 / 34px) | **derived**: the same alpha mask recoloured to `--navy-900` for light grounds |

Two things to note. The supplied file is a single-colour knockout, so **neither
carries the gold compass needle** of the full-colour mark — supply a
full-colour PNG and both can be replaced. And the navy version is a mechanical
recolour of your artwork, not an official asset; swap it for the real navy mark
when convenient.

**Hero resolution.** `hero-d.png` is 640×426 but runs full-bleed behind an
850px-tall desktop hero — it will look soft above roughly 900px wide. A ≥1920px
rendition of that frame is the one asset that would visibly improve the page.

## Unused from the archives

`retreat-wide-1/2/5/7/8.png`, `content-cases.small.png`,
`music-session.small.png`, `three-days-workshop.small.png`, and
`three-days-circle.small.png` (byte-identical to `circle-session.small.png`).
Nothing in the design references them — say the word if any belongs in a slot.
