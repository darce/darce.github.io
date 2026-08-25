# darce.xyz — repositioning screens (ASCII)

> Companion to `docs/ux-maps/darce-xyz.uxmap.json` (`map_ref: darce-xyz`).
> Positioning: **Design Technologist** — AI products · complex systems ·
> accessible interaction.
> Deterministic monospace wireframes, ≤70 cols. Rule IDs cite
> `heuristics-canon/lexicons/*.md`, versionless; each ID was read against its
> rule text — presence in the lexicon is not support for the claim it is cited for.
> Fixed decisions (QM v3, 2026-08-25): nav = home · work · research · about;
> featured = semantic-image-search → photoshelter → workbay → **msnbc**;
> **no Practice section** — the canon lives in the Research index and is cited
> inside the cases where it changed a decision ([NAV-05]); SIS screenshots not
> captured (`media_pending` is a designed state, not a gap).

## Superseded by this revision

The previous revision modelled a `/practice` hub and a three-card featured list
under a "Product Designer & Design Technologist" masthead. All three are
reversed here:

| Was | Now | Why |
| --- | --- | --- |
| `Product Designer & Design Technologist` | `Design Technologist` | [STRAT-11] do not average opposed goods — a stacked headline reads as unresolved positioning |
| `/practice` hub in content, demoted from nav | route deleted | [NAV-05] Practice dual-homes with Work and Research; a reviewer should not have to guess where the canon files |
| 3 featured cards | 4 (msnbc added) | MSNBC carries the design-technologist title continuity the identity claim rests on |

## 1. Home — hero + featured list (desktop)

```
+---------------------------------------------------------------------+
| skip to main content (focus only)                                   |
+-----------------------------------------------------+---------------+
| DANIEL ARCÉ                                         |   [cube]      |
| design technologist                                 |               |
+-----------------------------------------------------+---------------+
| home  work  research  about            [▪▪] theme                   |
| ‾‾‾‾                                                                |
+---------------------------------------------------------------------+
|                                                                     |
|  +-----------+   Design Technologist                     (h1)       |
|  | headshot  |                                                      |
|  | dithered  |   I design and build AI and data-rich     (hero)     |
|  +-----------+   products where interaction,                        |
|                  accessibility, and implementation                  |
|                  have to be solved together.                        |
|                                                                     |
|                  +----------------+                                 |
|                  | Get in touch → |  DitheredCard · mailto          |
|                  +----------------+                                 |
|                                                                     |
|  Selected work                                            (h2)      |
|  +---------------------------------------------------------------+  |
|  | 01  Semantic image search        independent R&D · 2025-26    |  |
|  |     [ thumb: screenshot pending ]                             |  |
|  |     Local-first AI photo search and exploration. On-device    |  |
|  |     processing; explicit states for incomplete data.          |  |
|  +---------------------------------------------------------------+  |
|  | 02  PhotoShelter                      product R&D · 2022-24   |  |
|  |     [ thumb ]  Workflow prototyping that exposed integration  |  |
|  |     constraints early; accessibility tied to $9.2M ARR.       |  |
|  +---------------------------------------------------------------+  |
|  | 03  WorkBay                           design tech · 2025-26   |  |
|  |     [ thumb ]  Durable workflow and interaction state for     |  |
|  |     coding agents.                                            |  |
|  +---------------------------------------------------------------+  |
|  | 04  MSNBC                       design technology · 2014-16   |  |
|  |     [ thumb ]  Working prototypes and reusable components     |  |
|  |     for a live-video product on a six-month deadline.         |  |
|  +---------------------------------------------------------------+  |
|  View all projects →                                                |
+---------------------------------------------------------------------+
```

Interactivity
- Hover: card border → coral (`t('border')`), dithered shadow stays; CTA same.
- Focus: 2px visible ring on cards, CTA, nav; skip link appears top-left on first Tab.
- Keyboard: Tab order skip → masthead → nav (4) → toggle → CTA → cards 1-4 → view all.
- Theme: paper/terminal canvas; headshot dither and pending thumb use `inactiveBg`, both appearances.
- `media_pending` thumb: labelled text box in the same aspect ratio, `alt` says "screenshot pending".

Canon check
- [RLSE-04] pending-thumb is a designed state with copy, not a blank slot.
- [WRIT-02] hero copy: no *leverage / robust / seamless / utilize*.
- [WRIT-07] hero and all four blurbs carry **zero** not-X-but-Y pivots — budget unspent, keep it that way.
- [PROD-01] each blurb names a behaviour outcome, not a feature list.
- [A11Y-07] h1 → h2 "Selected work" → card h3s; markup mirrors the visual order.
- [COL-02] coral hover proofed on the dithered headshot ground, not only paper.
- [A11Y-29] visual card order 01-04 matches DOM and focus order.

Open question for the operator
- The hero drops the "for AI and complex systems" subhead the previous revision
  carried. If the subhead returns, it belongs in metadata or the hero body, not
  the h1 — a two-clause h1 re-creates the stacked headline [STRAT-11] rejects.

## 2. Nav bar — four items, active state

```
+---------------------------------------------------------------------+
| home    work    research    about                        [▪▪]       |
|         ‾‾‾‾                                             [▪▪]       |
|         (active: weight 600 + surface fill, no colour)              |
+---------------------------------------------------------------------+
  hover  : 2px coral underline slides in under the item
  focus  : 2px ring, offset 2px, same on both themes
  current: aria-current="page"; weight + selected surface carry place
  résumé : NOT in nav; reached from the About close and the home footer area
  research: in nav; /research/* deep links also round-trip standalone
  practice: route deleted — no nav entry, no content link, no resolveNavPath branch
```

Interactivity
- Hover: coral underline; no fill change (accent thrift).
- Focus: ring on the anchor, not the li; visible in dark theme against terminal.
- Keyboard: Tab across four items; Enter activates; arrow keys not needed (native list).
- Theme: selected surface = `surface` token; ink = `text`; underline = `border`.

Canon check
- [A11Y-07] `<nav aria-label="Daniel Arcé">` + list; active item carries `aria-current="page"`.
- [A11Y-06] active state is weight + surface, never hue alone.
- [NAV-05] four categories are MECE once Practice is gone; the canon has one home (Research).
- [NAV-11] /research/* deep links round-trip: the URL alone restores the article.
- [COL-09] one accent (coral) and only on hover.
- [REF-25] `resolveNavPath` must lose its `/practice` **and** `/resume` branches in the
  same change — neither can ever match a `NAV_ITEMS.href`, so both are dead returns.
  Leaving them is the visible-neglect signal the rule names.

## 3. SIS case — sections 1-4 (hero, at a glance, problem, core journey)

```
+------------------+--------------------------------------------------+
| WORK             | Semantic Image Search                    (h1)    |
| > semantic-image | How do you make local AI search useful when      |
|   -search  ◄     | the system cannot assume the library is          |
|   photoshelter   | complete?                                (deck)  |
|   workbay        |                                                  |
|   msnbc          | +----------------------------------------------+ |
|   ...            | |  [ SCREENSHOT PENDING ]              (§1)    | |
|                  | |  results grid, query "harbour at dusk"       | |
|                  | |  16:9 · captured when build stabilises       | |
|                  | +----------------------------------------------+ |
|                  |                                                  |
|                  | At a glance                          (h2, §2)    |
|                  | +-------------+--------------------------------+ |
|                  | | role        | product + interaction design,  | |
|                  | |             | architecture, implementation   | |
|                  | | platform    | macOS                          | |
|                  | | stage       | working independent R&D        | |
|                  | | core jobs   | search · inspect · explore     | |
|                  | | constraint  | local inference, modest Apple  | |
|                  | |             | Silicon                        | |
|                  | | trust       | gallery processing stays       | |
|                  | | boundary    | on-device                      | |
|                  | | research    | expert/adversarial review done;| |
|                  | | status      | external-user testing open     | |
|                  | +-------------+--------------------------------+ |
|                  |                                                  |
|                  | Problem                              (h2, §3)    |
|                  | Photo libraries contain more meaning than        |
|                  | filenames and folders expose, but cloud search   |
|                  | creates a privacy boundary and local models      |
|                  | introduce their own limits...                    |
|                  |                                                  |
|                  | Core journey                         (h2, §4)    |
|                  | +--------+ +--------+ +--------+ +--------+     |
|                  | | choose |>| index  |>| search |>| inspect|     |
|                  | | folder | | (bg)   | | by     | | + ex-  |     |
|                  | |        | |        | | meaning| | plore  |     |
|                  | | [pend] | | [pend] | | [pend] | | [pend] |     |
|                  | +--------+ +--------+ +--------+ +--------+     |
|                  |  strip stays visible on scroll                   |
+------------------+--------------------------------------------------+
```

Interactivity
- Hover: sibling menu item → link colour; journey step → coral border, caption expands.
- Focus: journey steps are buttons (Enter opens step figure in place); menu links keyboardable.
- Keyboard: skip → nav → menu → article headings reachable via landmarks; swipe has prev/next cards.
- Theme: pending boxes use `inactiveBg` + `text`; table rules hairline `text` at low alpha.
- `media_pending`: every figure slot renders a labelled box with its intended caption.

Canon check
- [RLSE-04] `media_pending` enumerated and designed for hero and all four journey steps.
- [VIZ-17] opening a journey step keeps the four-step strip in view (focus + context).
- [A11Y-07] at-a-glance is a real `<table>` with `<th scope="row">`, not styled divs.
- [STRAT-20] the deck names the obstacle (an incomplete library) before any method.
- [A11Y-15] swipe between siblings has the prev/next card alternative.
- [WRIT-44] *fix the cause, not the phrase* — "research status" narrows the claim by
  splitting expert review from user testing, rather than swapping a synonym for "validated".

## 4. SIS §5 — "Designing incomplete truth", seven states

```
+---------------------------------------------------------------------+
| Designing incomplete truth                            (h2, §5)      |
| "No result" is not the same state as "I cannot currently see        |
| the whole library."                                                 |
+----------+---------+---------+---------+---------+---------+--------+
| first run| indexing| no      | model   | partial | source  | experi-|
| no folder|         | matches | unavail.| library | revoked | mental |
+----------+---------+---------+---------+---------+---------+--------+
| [pend]   | [pend]  | [pend]  | [pend]  | [pend]  | [pend]  | [pend] |
+----------+---------+---------+---------+---------+---------+--------+
| EVIDENCE | 412/1.2k| 0 of    | model   | 412/1.2k| volume  | ranked |
| no path  | scored  | 1.2k    | load    | indexed | "Chimay"| by     |
| chosen   | (34%)   | > 0.2   | failed  | (34%)   | not     | model  |
|          |         |         | (ENOENT)|/ 803   | mounted | v0.3   |
|          |         |         |         | hidden  |         |        |
+----------+---------+---------+---------+---------+---------+--------+
| COPY     | "Still  | "Nothing| "Search | "Showing| "Volume | "Beta  |
| "Pick a  | indexing| close   | is off: | results | is off- | rank-  |
| folder   | — 34%   | enough  | the     | from 34%| line;   | ing —  |
| to       | so far."| to      | model   | of your | 803     | check  |
| index."  |         | that."  | didn't  | library"| items   | before |
|          |         |         | load."  |         | hidden."| trust."|
+----------+---------+---------+---------+---------+---------+--------+
| ACTION   | Keep    | Loosen  | Retry · | Show %  | Recon-  | Report |
| Choose   | working | query · | browse  | · keep  | nect ·  | a miss |
| folder   | · show %| browse  | by      | indexing| show    |        |
|          |         |         | folder  |         | cached  |        |
+----------+---------+---------+---------+---------+---------+--------+
| SIGNAL   | ⌀+text  | ◔ + %   | ⌀+text  | ⚠+text  | ◔ + %   | ⏏+text |
+----------+---------+---------+---------+---------+---------+--------+
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
- [RLSE-04] seven non-happy states enumerated with copy and a recovery action each.
- [CAL-02] *unknown is a valid result* — "partial library" and "source revoked" are
  designed abstentions, not error styling on an empty grid. **This is the rule the
  pending-media decision actually turned on; cite it by ID in the prose.**
- [API-06] empty match is a successful query — "no matches" is not an error state.
- [HAI-01] the EVIDENCE row shows the observation that produced each label.
- [HAI-09] "experimental" carries "check before trust" and links to §7 Evaluation.
- [A11Y-06] state signal is icon + label + copy; survives greyscale.
- [A11Y-07] comparison uses `<table>` with column `<th>`; row headers named.
- [WRIT-02] copy uses spoken words ("didn't load", "off-line").

## 5. SIS §6-§9 — explore, evaluation, what changed, evidence gap

```
+---------------------------------------------------------------------+
| Similarity · Places · Timeline                       (h2, §6)       |
| Three answers to three different questions.                         |
| +---------------+ +---------------+ +---------------+               |
| | Similarity    | | Places        | | Timeline      |               |
| | "more like    | | "where was    | | "when did     |               |
| |  this one"    | |  this taken"  | |  this happen" |               |
| | [pend]        | | [pend]        | | [pend]        |               |
| +---------------+ +---------------+ +---------------+               |
|  selection persists across tabs; coverage indicator per view        |
| ------------------------------------------------------------------- |
| Evaluation                                           (h2, §7)       |
| +-------------------------+---------------------------------------+ |
| | Technical evidence      | runtime, local network boundary,      | |
| |                         | model packaging/licensing, tests      | |
| +-------------------------+---------------------------------------+ |
| | Interaction /           | accessibility review, adversarial     | |
| | accessibility review    | critique, state-map review, defects   | |
| +-------------------------+---------------------------------------+ |
| | External usability      | NOT YET RUN — planned sessions        | |
| | evidence                | (designed empty state, not omitted)   | |
| +-------------------------+---------------------------------------+ |
| ------------------------------------------------------------------- |
| What changed                                         (h2, §8)       |
|  · viewpoint preserved across Explore tabs                          |
|  · partial-library caveat surfaced instead of silent truncation     |
|  · retry/cancel for stalled reads                                   |
|  · Timeline range/zoom correction                                   |
|  · map antimeridian behaviour                                       |
|  · stale Timeline selection cleared after axis-identity change      |
| ------------------------------------------------------------------- |
| Current evidence gap                                 (h2, §9)       |
| The next evidence gap is external usability. The product has been   |
| reviewed against implementation, accessibility, and adversarial     |
| criteria; it still needs observed task performance with people      |
| who did not build it.                                               |
+---------------------------------------------------------------------+
```

Interactivity
- Hover: explore cards → coral border; evaluation table rows inert.
- Focus: three explore cards are in tab order; §9 has no controls.
- Keyboard: h2 landmarks give a rotor outline for §6→§9.
- Theme: the "NOT YET RUN" cell uses `inactiveBg` + text, never red.

Canon check
- [HAI-09] *trustworthy ≠ trusted* — §7 publishes component evidence and names the
  gap rather than asserting the product is trustworthy.
- [RLSE-04] the empty external-evidence row is a designed state, not a missing row.
- [WRIT-28] *concrete effect + named source, or omit* — "validated" does not appear;
  each row names the method that produced its evidence.
- [WRIT-06] one stable term per Explore view — Similarity/Places/Timeline never
  drift into synonyms across §6, §8, and the card copy.
- [A11Y-07] §6 cards are h3 under the §6 h2; no skipped level.

## 6. Research index — three items, canon gets its home

```
+---------------------------------------------------------------------+
| home  work  research  about                    [▪▪]                 |
|                ‾‾‾‾‾‾‾‾                                             |
+---------------------------------------------------------------------+
| Research                                                    (h1)    |
| ------------------------------------------------------------------- |
| +---------------------------------------------------------------+  |
| | Heuristics Canon                                        (h2)  |  |
| | Source-linked decision rules for product and                  |  |
| | engineering review                                            |  |
| |                                                               |  |
| | A working research corpus that turns recurring product,       |  |
| | interaction, accessibility, AI, and engineering decisions     |  |
| | into checkable rules with stable IDs and source provenance.   |  |
| |                                          github.com/darce/… ↗ |  |
| +---------------------------------------------------------------+  |
| | Order book visualization                                (h2)  |  |
| +---------------------------------------------------------------+  |
| | Rotation matrices                                       (h2)  |  |
| +---------------------------------------------------------------+  |
+---------------------------------------------------------------------+
  meta description must stop saying the section is only "order book
  visualization, 3D rotation matrices, and front-end engineering
  experiments" — that is now false on its face.
```

Interactivity
- Hover: card → coral border; the external link gets the global `href^="http"` NE arrow.
- Focus: ring on each card; the canon card's outbound link is a distinct stop.
- Keyboard: three cards in DOM order; no interstitial.
- Theme: external-arrow glyph inherits `text`, not accent.

Canon check
- [NAV-05] one home for the canon. This card is it; there is no competing `/practice`.
- [WRIT-41] the GitHub URL resolves — that is the whole point of the item.
- [A11Y-04] the outbound link's accessible name says where it goes ("Heuristics Canon
  on GitHub"), not "here" or a bare arrow.
- [REF-26] the research meta description and this card state one fact; if they can
  drift, bind them to a single source rather than hand-syncing.

## 7. About — v3

```
+---------------------------------------------------------------------+
| Hello, I'm Daniel Arcé.                                     (h2)    |
| +-----------+                                                       |
| | headshot  |  I'm a design technologist. I work on products        |
| | dithered  |  where the interaction model and the technical        |
| +-----------+  model are hard to separate...                        |
|                                                                     |
|  · career line — engineering depth as implementation advantage      |
|  · PhotoShelter — 80,000+ users, $9.2M ARR, ~30% less downstream    |
|  · recent independent work — SIS, WorkBay                           |
|  · Heuristics Canon → github.com/darce/heuristics-canon ↗          |
|  · close — what he's looking for                                    |
|                                                                     |
|  Get in touch · Résumé                                              |
|  ‾‾‾‾‾‾‾‾‾‾‾‾   ‾‾‾‾‾‾                                              |
|  mailto         /resume/  ← the ONLY inbound link to the PDF        |
|                                                                     |
|  Portrait by Liam Maloney ↗                                         |
+---------------------------------------------------------------------+
```

Interactivity
- Hover: inline links → coral; external links carry the NE arrow.
- Focus: ring on each inline link; portrait credit is a normal link, not a caption.
- Keyboard: reading order = visual order; no aside interleaving.

Canon check
- [A11Y-04] **this screen closes the standing A11Y-04 finding**: `/resume/` had zero
  inbound links sitewide. The About close links it and names it. If that link is cut,
  the finding reopens.
- [WRIT-41] the canon link resolves to the public repo; no unverifiable reference.
- [WRIT-17] each paragraph adds evidence rather than restating the identity claim.
- [WRIT-02] no *leverage / robust / seamless / utilize* in the v3 prose.
- **Citation caveat:** the QM plan cites [WRIT-40] for "no duplicated thesis between
  Home, About, and case intros". WRIT-40's stated trigger is duplication *within one
  piece*. Cross-page thesis repetition is a real risk worth checking, but WRIT-40 is
  not the rule that governs it — do not cite it that way in shipped copy.
- Removed: the AltContext sentence. It describes work that is not the current focus.

## 8. Mobile home with sub-nav

```
+-------------------------------------+
| skip to main content (focus only)   |
+-------------------------------------+
| DANIEL ARCÉ                         |
| design technologist                 |
+-------------------------------------+
| home  work  research  about         |
| ‾‾‾‾                          [▪▪]  |
+-------------------------------------+
| +---------+                         |
| | headshot|  Design Technologist    |
| | dither  |                         |
| +---------+  I design and build AI  |
|              and data-rich products |
|              where interaction,     |
|              accessibility, and     |
|              implementation have to |
|              be solved together.    |
|                                     |
| +---------------------------------+ |
| | Get in touch →                  | |
| +---------------------------------+ |
|                                     |
| Selected work                       |
| +---------------------------------+ |  full-bleed:
| | 01 Semantic image search        | |  margin -24px
| |    [ screenshot pending ]       | |  padding 24px
| +---------------------------------+ |
| | 02 PhotoShelter                 | |
| +---------------------------------+ |
| | 03 WorkBay                      | |
| +---------------------------------+ |
| | 04 MSNBC                        | |
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
- [A11Y-29] visual card order 01-04 matches DOM and focus order.
- [RLSE-04] first/last sibling → empty sub-nav card is designed (hidden, not blank).
- [COL-09] one accent on tap; no filled nav pills at small widths.
- [A11Y-08] the four-card list reflows at 320px/200% without 2-D scroll. Note the
  rule **exempts 2-D-essential content**, which is why the §4/§5 state tables are
  allowed to scroll horizontally rather than being forced to stack.

## Critique findings

Manual pass against the canon rule IDs cited above; every ID was read against its
rule text in `heuristics-canon` @ `a5f47c6` before being cited here.

| Severity | Rule | Screen / zone | Fix |
| --- | --- | --- | --- |
| high | [A11Y-04] | about (§7) | `/resume/` still has zero inbound links until the About close ships. The v3 close is the fix; do not land About without it. |
| high | [A11Y-02] | SIS §4/§5, workbay case | The 8 ```text ASCII diagrams have no text equivalent. `Diagram` (`ProjectDetails.tsx:38-51`) carries `alt` for `<img>` only. Each fence needs prose stating what a non-seeing reader must get — **not** `pre-wrap`; reflow-safe ≠ comprehension-safe. |
| high | [A11Y-23] + [TEST-06] | test/a11y/* | The suite renders hand-written fixtures, not the real `Layout`/`Nav`/page components — `landmarks.a11y.test.tsx` builds its own `<header><nav>` markup. A proxy that can diverge certifies zero; bind the suite to the shipped components. |
| medium | [NAV-05] | site shell | `/practice` deleted. Verify no orphan remains: `pages/practice.tsx`, `content/practice/`, `styles/practicePage.module.scss`, the About link, the `schemas.ts` section registration, and the `resolveNavPath` branch. |
| medium | [REF-25] + [REF-12] | `lib/routes.ts`, `Nav.tsx` | `resolveNavPath`'s `/practice` and `/resume` branches can never match a `NAV_ITEMS.href`; `NavItem.ariaLabel` has zero setters. One deletion closes three findings. |
| medium | [HAI-09] | SIS §7 | "experimental, in daily use" is a trust claim; §7 must publish what was measured and name the external-user gap as not-yet-run. |
| medium | [RLSE-04] | resume (exit) | PDF 404 / blocked-download still has no designed state on `/resume/`. The route is a 0-second meta-refresh with one fallback anchor. |
| medium | [CAL-02] | SIS §5 | The pending-media decision turned on *unknown is a valid result*. Cite the ID in prose — the page currently claims the canon "runs on real decisions" with no resolvable ID anywhere in `content/**`. |
| medium | [ARCH-02] | workbay case | Same claim, same gap: the cross-agent write boundary is [ARCH-02] *"Which one service owns writes, and how do others submit changes?"* Cite it or drop the claim. |
| low | [REF-26] | `lib/seo.ts`, `pages/research/index.tsx` | The research description exists as one fact in two formats with nothing binding them. In sync today; the gate is what's missing. |
| low | [WRIT-06] | SIS §6, §8 | Keep one stable term per Explore view; watch for synonym drift between the card copy and "What changed". |
| low | [A11Y-06] | SIS §5 | Keep icon + label + copy per state; do not introduce per-state colour when screenshots land. |
| low | [A11Y-07] | SIS §2 | At-a-glance must be `<table>`/`<dl>`, not styled divs. |
| low | [VIZ-17] | SIS §4 | Journey step detail should open in place; the four-step strip must stay visible. |
| low | [COL-02] | landing pending thumb | Proof the pending placeholder on both paper and terminal grounds. |
| info | [WRIT-07] | landing hero | The v3 hero spends zero not-X-but-Y pivots. Budget is one per page — keep it unspent. |
| info | [PROD-01] | landing featured | Card blurbs name outcomes; keep when copy is finalised. |
| info | [HAI-01] | SIS §5 | Evidence row present in the design; keep it when screenshots replace text cards. |
