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

## Still needed

| Path | Used by | Note |
|---|---|---|
| `strategy-community-mark-white.png` | Mobile bar, desktop nav | The white lockup with the gold needle intact. Drawn 26px (mobile) / 32px (desktop) tall |
| `strategy-community-mark.png` | Footer | The navy lockup. Drawn 30 / 34px tall |
| `cutout-badr.png` | Delegate card 1 | Cut-out portrait on transparent ground, 3:4 |
| `logos/business-belaraby.png` | Partners | 20px tall, transparent |
| `logos/nexus.png` | Partners | 42px tall, transparent |
| `logos/jrny.png` | Partners | 32px tall, transparent |

Both lockups were pasted into the conversation as images rather than uploaded as
files, so there was nothing on disk to install.

**Hero resolution.** `hero-d.png` is 640×426 but runs full-bleed behind an
850px-tall desktop hero — it will look soft above roughly 900px wide. A ≥1920px
rendition of that frame is the one asset that would visibly improve the page.

## Unused from the archives

`retreat-wide-1/2/5/7/8.png`, `content-cases.small.png`,
`music-session.small.png`, `three-days-workshop.small.png`, and
`three-days-circle.small.png` (byte-identical to `circle-session.small.png`).
Nothing in the design references them — say the word if any belongs in a slot.
