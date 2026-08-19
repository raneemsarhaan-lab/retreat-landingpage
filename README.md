# The Strategy Retreat 2026 — landing page

Static landing page for The Strategy Community's invitation-only retreat
(15–17 October 2026, Matarma Bay, Ras Sudr).

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000   # then http://localhost:8000
```

No build step, no dependencies. `index.html` + three files under `assets/`.

```
index.html
assets/css/tokens.css   design tokens (colours, type, spacing)
assets/css/styles.css   all layout and component styles
assets/js/app.js        pillar tabs, FAQ accordion, asset fallbacks
assets/README.md        which media files are still missing, and where they go
```

## Source

Implemented from two Claude Design artboards:

- `R_Landing_Page (Mobile).dc.html` — the named target; drives everything below 900px
- `R_Landing_Page.dc.html` — drives 900px and up

Section order follows the mobile artboard, which is the implement target. The
two artboards order the back half differently (desktop puts Experience after
FAQ and drops Partners entirely); mobile's order is used at every width.

## Deviations from the artboards

Each of these is a deliberate change, listed so it can be reverted:

**Fixed**
- `Regiester` → `Register` on the mobile hero CTA.
- Footer copyright read `© Forefront Cnsulting Group 2026` (mobile) and
  `© Forefront Strategy Group 2026` (desktop). Both are now
  `© Forefront Consulting Group 2026`, matching the body copy's "Powered by
  Forefront Consulting". **Confirm which entity is correct.**
- Canvas-editor drag artifacts removed: hard-coded `width: 387px; height: 240px;
  top: 5px` on the mobile pillar scrim, `width: 1085px; margin-top: -246px;
  top: -167px` on the desktop methodology block, and `height: 163px` on the
  mobile footer (which clipped its own contents). All are now flow layout.
- Mobile hero CTA was 42px tall and the pillar tabs 32px; both now meet the
  44px minimum touch target. The tabs keep their exact visual position — the
  extra hit area is padding pulled back by a negative margin.
- Accommodation carries no Register button, and the closing CTA carries a
  single "Register" rather than the artboards' Request-an-invite plus
  How-to-attend pair. Both apply at every width.
- The accommodation prev/next buttons were inert in the artboards — one image,
  two arrows. Now that four venue photos exist they drive a real scroll-snap
  carousel: swipeable on touch, buttons wrap around, and a live region announces
  "Photo n of 4".
**Desktop-only revisions.**

- The hero headline is "The Strategy Retreat" at both widths now — one line on
  desktop, stacked on mobile via breaks that are hidden above 900px.
- The nav carries mark, sections, "Download PDF" and a Register button.
- A Register tab is pinned to the right edge of the viewport for the whole
  scroll. Desktop content takes a wider right gutter so nothing runs under it —
  the knowledge tabs did before that was added.
- The knowledge tabs are spaced `space-between` so the row fills its column.
- Every editorial block now uses the sticky side-label layout, Leaders and
  Partners included; the artboards had those two as centred headings.
- Section rhythm is compressed: the 100px block padding drops to 48px and the
  media heights and internal gaps come down with it, taking the page from
  7,855px to ~6,530px at 1440x900. Most sections now sit at 0.7-0.85x the
  viewport; Knowledge Pillars stays at 0.95x because its five-point list makes
  the content taller than 3/4 screen on its own.
- Experience is rebuilt as "Hear it from those who were there": an intro beside
  the feature film, then a rail of testimonial films with click-to-play controls
  and position dots. The rail carries any number of films — dots are generated
  from the card count and the row scrolls past three.

**Mobile-only revisions.** Requested after the artboards, and scoped below
900px — desktop keeps the artboard arrangement in every case:

- The top bar is fixed rather than sticky inside the hero, so it stays reachable
  the whole way down, and carries a "Download PDF" link in brand gold beside
  Register.
- The leaders rail carries position dots so the horizontal scroll is
  discoverable; they drive the rail on click and track it on scroll.
- The About stats sit on their own centred row; on desktop they stay in the
  second split's right-hand column.
- In Knowledge Pillars the section title comes before its image.
- In Methodology the diagram precedes the copy, and the two supporting
  paragraphs are dropped entirely; both are unchanged on desktop.
- Section headings take the hero's type — `clamp(2rem, 8.5vw, 2.375rem)` at
  weight 700 rather than 900 — so they scale in step with it at any width. The
  About sub-heads and "Built around three values." keep their smaller sizes,
  since they sit in half-width columns, but share the weight and tracking.
- The three Experience cards fold into tabs: one open at a time, the rest
  collapsed to a title row. The heading row only takes `role="button"` and
  keyboard handling below 900px, so desktop keeps plain headings rather than
  shipping a control that does nothing.
- The two dark-surface logo copies were flattened by `brightness(0) invert(1)`,
  which would erase the gold compass needle. They now point at a dedicated white
  lockup instead.

**Breakpoint rules.** Per the confirmed rule set, mobile and desktop differ in
content, not only layout: the hero headline is "The / Strategy / Retreat"
stacked below 900px and "Step Away. Think Strategically." above it; the
five-point pillars intro list is desktop-only; and the footer collapses to the
brand blurb plus the copyright line, dropping its three link columns. The fuller
FAQ answers and accommodation details from the desktop artboard are used at
every width.

**Links.** Artboard links point at sibling `.dc.html` artboards. Navigation that
has a matching section on this page resolves to an in-page anchor; the rest
point at pages that do not exist yet: `registration.html`,
`speaker-information.html`, `privacy.html`, `contact.html`.

## Content inventory

`content-inventory.csv` lists every piece of copy and every image, video and
document the page asks for — 142 rows across the 13 blocks, with the live text,
the length or dimension each slot expects, a status, and the action needed. It
is generated from the rendered page and the files on disk, so the "current
content" column is what actually ships rather than a transcription. Open it in
Excel or Sheets and filter the Status column to see what is outstanding.

Regenerate it after content changes rather than editing it by hand.

## Reconstructed values

Two things the artboards reference but that were not delivered with them:

- **Design tokens.** The artboards link
  `_ds/the-strategy-community-design-system-…/tokens/*.css`. Those files were
  unavailable, so `assets/css/tokens.css` reconstructs them from literal colours
  that sit next to the token names in the markup (`#F5AE2B` beside
  `var(--gold-500)`, `#0F2C69` beside `var(--navy-900)`), with neutrals chosen
  to clear WCAG AA. `--gold-600` was darkened to #8F6208 for 5.04:1 on the FAQ
  panel background. **Replace this file wholesale when the real tokens arrive** —
  nothing else in the CSS hard-codes a colour.
- **Fonts.** `--font-display` / `--font-body` name no family in the artboards.
  Archivo (display) and Inter (body) stand in via Google Fonts, chosen because
  they cover the 500/700/900 weights the artboards use. Swap both in
  `tokens.css`.

All video and venue photography is in place. Three photo slots had no filename
match in the archives and were assigned by subject — those, and the handful of
assets still outstanding (both logo lockups, the partner logos, the delegate
cutout), are listed in `assets/README.md`.

## Verified

Rendered in headless Chromium at 375 / 768 / 1440px: no horizontal page scroll,
no console or page errors, heading scale matches the artboards at each
breakpoint. Automated checks cover the pillar tablist (click, arrow/Home/End
keys, roving tabindex, `aria-selected`, panel labelling), the FAQ accordion
(exclusive open, toggle closed, `aria-expanded`), 44px minimum touch targets,
and that `prefers-reduced-motion` stops the marquee.

The venue carousel is covered too: next/prev, wraparound, the live-region
count, and 44px buttons.

Not verified here: video playback. The container's Chromium is the Playwright
build, which has no H.264 decoder, so none of the six MP4s can render in this
environment. All are valid `ftypisom` files and play in normal browsers.

## Skills

`.claude/skills/ui-ux-pro-max/` bundles the
[UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) skill
(MIT, v2.13.0) — a searchable local database of styles, palettes, font pairings,
UX guidelines and per-stack guidance.

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "focus visible keyboard" --domain ux
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "responsive layout" --stack html-tailwind
```

See `.claude/skills/ui-ux-pro-max/SKILL.md` for the full workflow.
