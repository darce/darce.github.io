# darce.xyz — repositioning screens (ASCII)

> Companion to `docs/ux-maps/darce-xyz.uxmap.json` (`map_ref: darce-xyz`).
> Positioning: Product Designer & Design Technologist for AI and complex systems.
> Deterministic monospace wireframes, ≤70 cols. Rule IDs cite
> `heuristics-canon/lexicons/*.md`, versionless; every ID below was grepped.
> Fixed decisions: nav = home · work · practice · about · résumé; featured =
> semantic-image-search → photoshelter → workbay; SIS screenshots not captured
> (`media_pending` is a designed state, not a gap).

## 1. Home — hero + featured list (desktop)

```
+---------------------------------------------------------------------+
| skip to main content (focus only)                                   |
+-----------------------------------------------------+---------------+
| DANIEL ARCÉ                                         |   [cube]      |
| product designer & design technologist              |               |
+-----------------------------------------------------+---------------+
| home  work  practice  about  résumé ↗          [▪▪] theme           |
| ‾‾‾‾                                                                |
+---------------------------------------------------------------------+
|                                                                     |
|  +-----------+   Product Designer &                                 |
|  | headshot  |   Design Technologist                     (h1)       |
|  | dithered  |   for AI and complex systems              (subhead)  |
|  +-----------+                                                      |
|                  +----------------+                                 |
|                  | Get in touch → |  DitheredCard · mailto          |
|                  +----------------+                                 |
|                                                                     |
|  Selected work                                            (h2)      |
|  +---------------------------------------------------------------+  |
|  | 01  Semantic image search             design lead · 2025-26   |  |
|  |     [ thumb: screenshot pending ]                             |  |
|  |     Finding photos when the index is incomplete and the       |  |
|  |     model can be wrong.                                       |  |
|  +---------------------------------------------------------------+  |
|  | 02  PhotoShelter                      front-end arch · 2022   |  |
|  |     [ thumb ]  Design-system migration at scale.              |  |
|  +---------------------------------------------------------------+  |
|  | 03  WorkBay                           design tech · 2025      |  |
|  |     [ thumb ]  Agent harness with inspectable judgment.       |  |
|  +---------------------------------------------------------------+  |
|  View all projects →                                                |
+---------------------------------------------------------------------+
```

Interactivity
- Hover: card border → coral (`t('border')`), dithered shadow stays; "Get in touch" same.
- Focus: 2px visible ring on cards, CTA, nav; skip link appears at top-left on first Tab.
- Keyboard: Tab order skip → masthead → nav (5) → toggle → CTA → cards 1-3 → view all.
- Theme: paper/terminal canvas; headshot dither and pending thumb use `inactiveBg`, both appearances.
- `media_pending` thumb: labelled text box in the same aspect ratio, `alt` says "screenshot pending".

Canon check
- [RLSE-04] pending-thumb is a designed state with copy, not a blank slot.
- [WRIT-02] / [WRIT-07] subhead and card blurbs: plain words, ≤1 not-X-but-Y pivot.
- [PROD-01] each blurb names a behaviour outcome, not a feature list.
- [A11Y-07] h1 → h2 "Selected work" → card h3s; markup mirrors the visual order.
- [A11Y-20] résumé ↗ marks the PDF context change before activation.
- [COL-02] coral hover proofed on the dithered headshot ground, not only paper.

## 2. Nav bar — five items, active state

```
+---------------------------------------------------------------------+
| home    work    practice    about    résumé ↗            [▪▪]       |
|         ‾‾‾‾                                             [▪▪]       |
|         (active: weight 600 + surface fill, no colour)              |
+---------------------------------------------------------------------+
  hover  : 2px coral underline slides in under the item
  focus  : 2px ring, offset 2px, same on both themes
  current: aria-current="page"; weight + selected surface carry place
  résumé : href="/resume/" → PDF; ↗ glyph = leaves the HTML site
  research: not in nav; /research/* deep links stay live
```

Interactivity
- Hover: coral underline; no fill change (accent thrift).
- Focus: ring on the anchor, not the li; visible in dark theme against terminal.
- Keyboard: Tab across five items; Enter activates; arrow keys not needed (native list).
- Theme: selected surface = `surface` token; ink = `text`; underline = `border`.

Canon check
- [A11Y-07] `<nav aria-label="Primary">` + list; active item exposed with `aria-current`.
- [A11Y-06] active state is weight + surface, never hue alone.
- [A11Y-20] the résumé item is the only nav link that changes context (PDF) and says so.
- [NAV-11] /research/* remains addressable even though it left the nav.
- [COL-09] one accent (coral) and only on hover.

## 3. SIS case detail — top (hero, at-a-glance, journey strip)

```
+------------------+--------------------------------------------------+
| WORK             | Semantic image search                    (h1)    |
| > semantic-image | Finding photos when the index is incomplete      |
|   -search  ◄     | and the model can be wrong.              (thesis)|
|   photoshelter   |                                                  |
|   workbay        | +----------------------------------------------+ |
|   ...            | |  [ SCREENSHOT PENDING ]                      | |
|                  | |  results grid, query "harbour at dusk"       | |
|                  | |  16:9 · captured when build stabilises       | |
|                  | +----------------------------------------------+ |
|                  |                                                  |
|                  | At a glance                              (h2)    |
|                  | +-------------+--------------------------------+ |
|                  | | role        | design lead + front-end        | |
|                  | | span        | 2025 – 2026                    | |
|                  | | stack       | CLIP embeddings · local index  | |
|                  | | users       | photographers, archivists      | |
|                  | | status      | experimental, in daily use     | |
|                  | +-------------+--------------------------------+ |
|                  |                                                  |
|                  | Core journey                             (h2)    |
|                  | +--------+ +--------+ +--------+ +--------+     |
|                  | | pick   |>| index  |>| query  |>| open   |     |
|                  | | folder | | (bg)   | | + rank | | + act  |     |
|                  | | [pend] | | [pend] | | [pend] | | [pend] |     |
|                  | +--------+ +--------+ +--------+ +--------+     |
|                  |  step 1/4 shown; strip stays visible on scroll   |
+------------------+--------------------------------------------------+
```

Interactivity
- Hover: sibling menu item → link colour; journey step → coral border, caption expands.
- Focus: journey steps are buttons (Enter opens step figure in place); menu links keyboardable.
- Keyboard: skip → nav → menu → article headings reachable via landmarks; swipe has prev/next cards.
- Theme: pending boxes use `inactiveBg` + `text`; table rules hairline `text` at low alpha.
- `media_pending`: every figure slot renders a labelled box with its intended caption.

Canon check
- [RLSE-04] `media_pending` is enumerated and designed for hero and all four journey steps.
- [VIZ-17] opening a journey step keeps the four-step strip in view (focus + context).
- [A11Y-07] at-a-glance is a real `<table>` with `<th scope="row">`.
- [STRAT-20] thesis names the obstacle (incomplete index, fallible model) before the method.
- [HAI-01] "experimental, in daily use" status is backed by evidence in the evaluation zone.
- [A11Y-15] swipe between siblings has the prev/next card alternative.

## 4. "Designing for incomplete truth" — six states side by side

```
+---------------------------------------------------------------------+
| Designing for incomplete truth                              (h2)    |
| What the UI says when it cannot say "here are your photos".         |
+-----------+-----------+-----------+-----------+-----------+---------+
| no folder | no        | model     | partial   | unavail.  | experi- |
|           | matches   | unavail.  | library   | volume    | mental  |
+-----------+-----------+-----------+-----------+-----------+---------+
| [pend]    | [pend]    | [pend]    | [pend]    | [pend]    | [pend]  |
| ····      | ····      | ····      | ····      | ····      | ····    |
+-----------+-----------+-----------+-----------+-----------+---------+
| EVIDENCE  | 0 of 1.2k | model     | 412/1.2k  | drive     | ranked  |
| no path   | scored    | load      | indexed   | "Chimay"  | by a    |
| chosen    | > 0.2     | failed    | (34%)     | not       | model   |
|           |           | (ENOENT)  |           | mounted   | v0.3    |
+-----------+-----------+-----------+-----------+-----------+---------+
| COPY      | "Nothing  | "Search   | "Showing  | "Volume   | "Beta   |
| "Pick a   | close     | is off:   | results   | is off-   | ranking |
| folder to | enough    | the model | from 34%  | line;     | — check |
| index."   | to that." | didn't    | of your   | 803 items | before  |
|           |           | load."    | library." | hidden."  | trust." |
+-----------+-----------+-----------+-----------+-----------+---------+
| ACTION    | Loosen    | Retry ·   | Keep      | Reconnect | Report  |
| Choose    | query ·   | browse    | indexing  | · show    | a miss  |
| folder    | browse    | by folder | · show %  | cached    |         |
+-----------+-----------+-----------+-----------+-----------+---------+
| ICON+TEXT | ⌀ + text  | ⚠ + text  | ◔ + %     | ⏏ + text  | β label |
+-----------+-----------+-----------+-----------+-----------+---------+
  rows: screenshot (pending) / evidence / copy / recovery / signal channel
  mobile: same table, columns become stacked cards in this order
```

Interactivity
- Hover: column header → coral top rule; cell text unchanged.
- Focus: each column is a `<section>`; headings in tab order via landmark nav, no traps.
- Keyboard: table is static; recovery actions are shown as copy, not live buttons.
- Theme: no colour per state; icon + label + text carry state on both grounds.
- `media_pending`: screenshot row shows a labelled text card per state (never empty).

Canon check
- [RLSE-04] six non-happy states are enumerated with copy and a recovery action each.
- [HAI-01] the EVIDENCE row shows the observation that produced each label.
- [HAI-09] "experimental" carries "check before trust" and links to the evaluation section.
- [A11Y-06] state signal is icon + label + copy; survives greyscale.
- [A11Y-07] comparison uses `<table>` with column `<th>`; row headers named.
- [WRIT-02] copy uses spoken words ("didn't load", "off-line"), no "leverage/robust".

## 5. Practice page

```
+---------------------------------------------------------------------+
| home  work  practice  about  résumé ↗                    [▪▪]       |
|             ‾‾‾‾‾‾‾‾                                                |
+---------------------------------------------------------------------+
| Practice                                                    (h1)    |
| Shipped UI hides the judgment that made it. This page shows the     |
| judgment: a rule set I can be checked against.                      |
| ------------------------------------------------------------------- |
| Heuristics Canon — making product and engineering                   |
| judgment inspectable                                        (h2)    |
|                                                                     |
|   Why a canon · How a rule is written · Trigger → rule → question   |
|   Example: [RLSE-04] Undesigned state is a bug — applied to the     |
|   semantic-image-search states above.                               |
|   ... (MDX essay; unclassed links → coral hover)                    |
| ------------------------------------------------------------------- |
| +-------------------------------+  +-----------------------------+  |
| | Research index →              |  | Get in touch →              |  |
| | order-book · rotation matrices|  | mailto                      |  |
| +-------------------------------+  +-----------------------------+  |
+---------------------------------------------------------------------+
```

Interactivity
- Hover: DitheredCards → coral border; inline rule-ID links → coral.
- Focus: ring on cards and inline links; heading anchors keyboardable.
- Keyboard: landmarks main/nav; essay h2/h3 give a rotor outline.
- Theme: essay text `text`, rules hairline; cards `surface` inner.

Canon check
- [STRAT-20] intro names the obstacle (invisible judgment) before the method.
- [WRIT-07] intro contains one pivot at most; audit the essay for stacked ones.
- [NAV-11] research link is the single in-site route to `/research` — deep links still work.
- [A11Y-07] h1 Practice → h2 essay → h3 sections; no skipped level.
- [HAI-09] a claim that judgment is "inspectable" is backed by citable rule IDs, not asserted.

## 6. Mobile home with sub-nav

```
+-------------------------------------+
| skip to main content (focus only)   |
+-------------------------------------+
| DANIEL ARCÉ                         |
| product designer & design technol.  |
+-------------------------------------+
| home  work  practice  about  résumé↗|
| ‾‾‾‾                          [▪▪]  |
+-------------------------------------+
| +---------+                         |
| | headshot|  Product Designer &     |
| | dither  |  Design Technologist    |
| +---------+  for AI and complex     |
|              systems                |
|                                     |
| +---------------------------------+ |
| | Get in touch →                  | |
| +---------------------------------+ |
|                                     |
| Selected work                       |
| +---------------------------------+ |  full-bleed:
| | 01 Semantic image search        | |  margin -24px
| |    [ screenshot pending ]       | |  padding 24px
| |    Finding photos when the      | |
| |    index is incomplete...       | |
| +---------------------------------+ |
| | 02 PhotoShelter                 | |
| +---------------------------------+ |
| | 03 WorkBay                      | |
| +---------------------------------+ |
| View all projects →                 |
+-------------------------------------+
| sub-nav (detail pages only):        |
| +---------------+ +---------------+ |
| | ← Previous    | |        Next → | |
| +---------------+ +---------------+ |
+-------------------------------------+
```

Interactivity
- Hover: n/a on touch; active state uses same coral border on tap.
- Focus: cube is `pointer-events: none`; focus ring on cards at 320px not clipped by full-bleed.
- Keyboard/AT: swipe (`useSwipeNav`) on detail pages has prev/next cards; nav wraps to two lines if needed.
- Theme: toggle stays reachable in the nav row at 320px.

Canon check
- [A11Y-15] swipe has a visible single-pointer alternative (prev/next cards).
- [A11Y-13] nothing sticky obscures focus; sub-nav is in-flow at the bottom.
- [A11Y-29] visual card order 1-3 matches DOM and focus order.
- [RLSE-04] first/last sibling → empty sub-nav card is designed (hidden, not blank).
- [COL-09] one accent on tap; no filled nav pills at small widths.

## Critique findings

CLI: `workbay-canvas-mcp ux-map critique` (mcp-workbay-canvas) run on a schema-projected copy
(site-native states mapped to the CLI enum, zone notes stripped). Manual pass against the
canon rule IDs cited above.

| Severity | Rule | Screen / zone | Fix |
| --- | --- | --- | --- |
| medium | [RLSE-04] | landing, practice, about, privacy, site-shell (CLI) | CLI sees only `default` (dark/focus states are projected). Add `first_time`/`error` only if real; otherwise accept — static pages. |
| medium | [RLSE-04] | resume (exit, CLI) | PDF 404 / blocked-download has no designed state; add fallback copy on the `/resume/` route. |
| medium | [RLSE-04] | project-detail / z-sis-thesis, z-sis-journey, z-sis-incomplete-truth | `media_pending` is modelled; implementation must render a labelled placeholder box, not skip the figure. |
| medium | [A11Y-20] | site-shell / z-primary-nav "résumé" | Nav link changes context to a PDF; add the ↗ glyph and `aria-label="Résumé (PDF)"`. |
| medium | [NAV-11] | practice / z-practice-research-link | /research left the nav; only one in-site link remains. Add a research link from about or the work index. |
| medium | [HAI-09] | project-detail / z-sis-evaluation | "experimental, in daily use" is a trust claim; the evaluation section must publish what was measured and the external-user gap. |
| low | [A11Y-06] | project-detail / z-sis-incomplete-truth | Keep icon + label + copy per state; do not introduce per-state colour when screenshots land. |
| low | [A11Y-07] | project-detail / z-sis-glance | At-a-glance must be `<table>`/`<dl>`, not styled divs. |
| low | [WRIT-07] | landing / z-hero-positioning; practice / z-practice-intro | Subhead and practice intro each carry one not-X-but-Y pivot; do not add more in the essay. |
| low | [VIZ-17] | project-detail / z-sis-journey | Journey step detail should open in place; the four-step strip must stay visible. |
| low | [COL-02] | landing / z-featured pending thumb | Proof the pending placeholder on both paper and terminal grounds. |
| info | [PROD-01] | landing / z-featured | Card blurbs name outcomes; keep when copy is finalised. |
| info | [HAI-01] | project-detail / z-sis-incomplete-truth | Evidence row present in the design; keep it when screenshots replace text cards. |
