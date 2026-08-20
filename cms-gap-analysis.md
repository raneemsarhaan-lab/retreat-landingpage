# Gap analysis — this landing page against the existing `page-home` CMS

Compares the page on `claude/ui-ux-pro-max-skill-05cqwr` against the Payload schema
described in the 20 Aug handover (`c83b37a` on `claude/landing-page`).

Everything below is derived from the handover text plus this repo. Where the handover
does not say, it is marked **(unverified)** — check the field definitions before acting.

---

## 1. What already fits

More than expected. Do not rebuild these:

| Their CMS | This page | 
|---|---|
| `navigation` global — "nav labels, the CTA, **the side tab**, the brochure PDF" | The floating Register tab and the Download PDF link both already have a home |
| `hero.marqueeWord` + `marqueeDuration` (+ trailing-space warning) | Same mechanism, same trailing-space dependency |
| `hero.scrimNote` | This page keeps the hero scrim for the same contrast reason |
| `experience.quotesLabel` | The mobile-only "Real stories from the retreat" rail label |
| `experience.featureFilm` / `featurePoster` / `featureTitle` / `featureSub` | Exact match to the feature card |
| `methodology.coreLabel` | "Lifetime Experience", the gold words at the diagram's centre |
| `finalCta` has only `primary*` | This page dropped the secondary button, so the group already matches |
| `csuite-outcomes`, `home-stats`, `stay-rows`, `venue-photos`, `faq-entries`, `values`, `methodology-nodes`, `content-pillars`, `partners`, `leaders`, `testimonials` | Every repeating list on this page has a collection already |
| Media `poster` required on films, `defaultAlt`, approval + provenance | Covers this page's needs; better than what this repo has |
| Hand-drawn 24-viewBox outline icons, never a library | This page's icons are exactly that |

---

## 2. Blocking — the page will not render correctly until these are resolved

**2.1 The testimonial consent gate empties the rail.**
All four `testimonials` rows sit at `consent: unconfirmed`, so the rail renders empty —
"the rule working, not a bug". This page's Experience block assumes at least one card: the
rail, the dots and the mobile peek all derive from the count, and an empty rail leaves a
labelled, dotted, empty band. **Decide the zero-state** — hide the whole rail, or keep the
feature film and drop the rail — and build it. Nothing in this repo handles it today.

**2.2 Empty content is a hard failure.**
`page.tsx` reads across 41 accesses with no optional chaining, deliberately. Every field
this page adds (§3) must be filled before deploy or `/retreat` 500s, exactly as it does now
with 27 of 34 fields empty.

**2.3 The hero headline breaks by breakpoint, not by content.**
Their model is `{ lines: [{text}], accent, accentOnOwnLine }` — line breaks are content.
This page renders "The Strategy Retreat" as **three stacked lines below 900px and one line
above it**. That cannot be expressed as a fixed `lines[]` array. Either the renderer gains a
breakpoint rule, or the design gives up the mobile stack. **This needs a decision, not a
field.**

**2.4 Kohinoor has no weight 900.**
This page's type scale uses **900 in 13 rules and 700 in 19**. Their headings already render
Bold because the kit lacks 900, and the fallback metric overrides are known-wrong for
v2.000. Adopt `src/styles/tokens.css` and delete this repo's reconstructed
`assets/css/tokens.css` — it was inferred from the artboards and is superseded. Expect the
display type to sit differently; re-check the heading rhythm afterwards.

---

## 3. New fields required

| Where | Field | Why |
|---|---|---|
| `content-pillars` | **Short label** (≤12 chars) alongside the full label | Mobile tabs read "Strategy / Case Studies / Leadership / Skills"; desktop reads the full names. Two fields, not one **(unverified — the collection may already carry both)** |
| `stay-rows` | **Second value line** | Three of the four facts break across two lines ("Breakfast, lunch, dinner" / "Beverages not included"). Model as two fields, never one string with a `<br>` |
| `methodology-nodes` | **Two label lines** | Each node sets on two lines ("Sharing" / "Knowledge"). Same reasoning **(unverified — may already use the `lines[]` heading shape)** |
| `partners` | **Display height** per logo | The wall draws logos at 20 / 42 / 32px to optically balance them. Either a per-row field, or normalise in CSS and drop the idea |
| `testimonials` | **Film aspect or orientation** | Media stores `width`/`height` for images only — "sharp cannot read them off an MP4". This page's cards are landscape while the current films are 720×1280 vertical, so they crop hard. Either store the aspect or enforce one on upload |
| `experience` | **Feature film aspect** | The feature box is locked to 16:9 to match the current file. A different aspect is a CSS change, not a content change — enforce on upload or make it a field |
| Every image field | Nothing new — but note **9 of 20 images here are decorative** and correctly take an empty alt. The model needs a "decorative" toggle rather than a forced value |

---

## 4. Structural differences

**4.1 Partners and Accommodation are swapped.**
This page runs … Experience → **Partners** → Accommodation → FAQ.
The CMS group order runs … Experience → **Accommodation** → Partners → Location → FAQ.
Pick one. The group order in the admin is also the editor's mental model of the page, so
they should agree.

**4.2 There is no map section here.**
Their `location` group has a `visible` toggle that "switches the whole section off". This
page has no map block at all. Either set `visible: false`, or the section needs designing —
it is not in any artboard supplied for this work.

**4.3 `date-strip` overlaps the hero.**
Their `date-strip` global is "the date/venue strip under each banner". On this page the date
and venue live **inside** the hero as a glass card, not as a strip beneath it. Confirm which
the home page should use, or the two will both render.

**4.4 `leadersRail` and `editorial` stay dead.**
This page does not revive either group. They remain dead fields until Phase 6 deletes them.

**4.5 Six fields render at one breakpoint only.**
The five pillar outcome bullets, the two methodology paragraphs, the three footer link
columns, the mobile rail label and the FAQ side photo. The CMS has no notion of breakpoint
visibility, so an editor can write copy that never appears anywhere. Put it in the field
help — this is the cheapest fix on the list and the easiest to forget.

---

## 5. Components to build (behaviour, not content)

These exist in this repo and have no CMS representation, by design — the CMS supplies items,
the component decides behaviour:

- Position dots on the leaders rail and the reflections rail, generated from the item count
  and mapped to **scroll progress**, not card offsets
- The venue carousel — prev/next, wraparound, a live-region "Photo n of 4"
- Knowledge-pillar tablist — arrow/Home/End keys, roving tabindex
- FAQ accordion — one open at a time, `aria-expanded`
- Click-to-play films, one at a time, unmuted on demand
- `prefers-reduced-motion` honoured across the marquee, both rails and the carousel

---

## 6. Carried over from the handover, unchanged by this page

- **Captions.** The films here play with speech and have none, exactly as flagged. A deaf
  visitor gets the quotation, not the film.
- **Photography.** ~25 assets never delivered there; the same gap here, itemised in
  `content-inventory.csv`.
- **Gold as punctuation only.** This page references gold in **26 CSS rules** — play
  buttons, quote marks, names, rules, dots, tab underline, stat values, fact labels. Worth a
  deliberate pass against that brand rule before it ships.
- **Record conflicts, never silently resolve them.** This build resolved several without a
  §9 entry: the footer entity name (the two artboards disagreed), the hero headline change,
  and roughly a dozen artboard deviations listed in this repo's `README.md`. They should be
  written up rather than inherited silently.
