# darce.xyz — research index: image loading screens (ASCII)

> Companion to `docs/ux-maps/darce-xyz.uxmap.json` (`map_ref: darce-xyz`,
> screens `research-index`, `research-detail`). Deterministic monospace
> wireframes, ≤70 cols. Rule IDs cite `heuristics-canon/lexicons/*.md`,
> versionless; each ID was read against its rule text.
> Corpus: `heuristics-canon-research/distilled/engineering/` —
> `latency-reduce-delay-in-software-systems.md` (ch-1, ch-6, ch-7, ch-11),
> `designing-data-intensive-applications.md` (ch-1, ch-12),
> `release-it.md` (ch-4, ch-5, ch-10).

## 0. Diagnosis before design

[PERF-16] name the delay component first. Measured on `/research/` (live,
2026-08-30):

| Card | File | Pixels | Bytes | Slot |
| --- | --- | --- | --- | --- |
| agent-memory | `research/dec-29-1977-on-kawara.jpg` | 1600×2387 | 800 K | ~384×288 |
| vsw-process | `work/sis-search-layer.png` | 1040×1049 | 572 K | ~384×288 |
| heuristics-canon | `research/ventriloquist-jasper-johns.jpg` | 646×896 | 168 K | ~384×288 |
| interrogating | `research/swimmers-…-bradford.jpg` | 728×843 | 148 K | ~384×288 |
| economics | `research/stripe-drawing-danica-phelps.jpg` | 598×732 | 52 K | ~384×288 |
| order-book, rotation | `research/*.svg` | vector | 4–8 K | — |

- ~1.74 MB of raster for five 384-px slots. **Transmission dominates**;
  propagation is fixed by the GitHub Pages CDN and cannot be engineered here
  ([PERF-09] geography sets the floor).
- `next.config.js` `images.unoptimized: true` → `next/image` emits a bare
  `<img>`: no `srcset`, so the `sizes` attribute on every card is dead.
- Every card is `loading="lazy"`, including the three above the fold, so the
  LCP image waits for layout before its request even starts.
- GitHub Pages serves `cache-control: max-age=600`; headers are not ours to
  set, so cache life has to come from content-hashed filenames ([RES-08]
  invalidation named up front).
- Budget ([PERC ch-1 thresholds]): at 5 Mbps the grid's images cost ~2.8 s
  (noticeable → "slow"); target ≤ 200 KB total → ~0.3 s, inside the ≤ 1 s
  "instant" band. Verify at p75 LCP, not the mean ([PERF-01]).

## 1. Research index — desktop, first paint

```
+---------------------------------------------------------------------+
| home  work  research  about                          [▪▪] theme     |
|             ‾‾‾‾‾‾‾‾                                                |
+---------------------------------------------------------------------+
| Research                                                            |
|                                                                     |
|  +-------------------+  +-------------------+  +-------------------+|
|  | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ |  | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ |  | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ||
|  | ▒ eager · high  ▒ |  | ▒ eager · high  ▒ |  | ▒ eager · high  ▒ ||  ← row 1
|  | ▒ avif/webp/jpg ▒ |  | ▒ 384w→480w src ▒ |  | ▒ 4:3 css box   ▒ ||    LCP set
|  | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ |  | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ |  | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ||
|  |-------------------|  |-------------------|  |-------------------||
|  | METHOD  REGISTERED|  | NOTE              |  | EXPERIMENT MEASURED||
|  | Heuristics Canon  |  | Agent memory      |  | Order book         ||
|  | subtitle …        |  | subtitle …        |  | subtitle …         ||
|  +-------------------+  +-------------------+  +-------------------+|
|  +-------------------+  +-------------------+  +-------------------+|
|  |                   |  |                   |  |                   ||
|  |   lazy · auto     |  |   lazy · auto     |  |   lazy · auto     ||  ← row 2
|  |   (below fold)    |  |                   |  |                   ||    lazy
|  +-------------------+  +-------------------+  +-------------------+|
- - - - - - - - - - - - - - - - fold - - - - - - - - - - - - - - - - -
```

- Row 1 (`index < 3` in `SectionCards.tsx`): `loading="eager"`,
  `fetchpriority="high"`, `decoding="async"`. Rows 2+: `loading="lazy"`.
- `<picture>`: `source type=image/avif` → `image/webp` → `<img>` fallback
  in the source format. `srcset` at 320/480/640/960/1280 w, capped at the
  original's width; `sizes="(max-width: 768px) 100vw, (max-width: 1024px)
  50vw, 384px"` (grid max 1200 px, three columns, 24 px gaps).
- Intrinsic `width`/`height` come from the manifest; the 4:3 box stays
  CSS-owned (`.imageWrapper aspect-ratio`) so no reflow ([PERC-03] the
  grid reads as one grouping only if cards do not jump).
- `object-position` / `scale` from frontmatter still apply — the crop
  contract (`thumbnail.position`, `thumbnail.scale`) is unchanged.

## 2. Card loading state (any row)

```
+-------------------+        +-------------------+
| ░▒░▒░▒░▒░▒░▒░▒░▒░ |        | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ |
| ▒░▒░▒░▒░▒░▒░▒░▒░▒ |  --->  | ▒  image bytes  ▒ |
| ░▒░▒░▒░▒░▒░▒░▒░▒░ |        | ▒  painted      ▒ |
| ▒░▒░▒░▒░▒░▒░▒░▒░▒ |        | ▒▒▒�▒▒▒▒▒▒▒▒▒▒▒▒▒ |
|-------------------|        |-------------------|
| TYPE   STATUS     |        | TYPE   STATUS     |
| Title             |        | Title             |
+-------------------+        +-------------------+
   t('text') 4px dither         no shift: box is 4:3 before bytes
   already in .imageWrapper      arrive; img has width/height attrs
```

- The wait state is the existing dithered checkerboard on `.imageWrapper`
  (`repeating-conic-gradient` in `t('text')`). Nothing new to design; the
  state was already there, just never named ([A11Y-24] every state
  enumerated; [RLSE-04] no state ships that was never designed).
- No spinner: sub-second at the target budget, under the [INT-08] ~1 s
  threshold for progress feedback.
- No blur-up LQIP: it would double the request count for a wait that
  should be < 300 ms, and a soft blur fights the hard-edge system.

## 3. Card media error state

```
+-------------------+
| ▓░▓░▓░▓░▓░▓░▓░▓░▓ |   .placeholder: t('link') dither,
| ░▓░▓░▓░▓░▓░▓░▓░▓░ |   t('border') on card hover
| ▓░▓░▓░▓░▓░▓░▓░▓░▓ |
| ░▓░▓░▓░▓░▓░▓░▓░▓░ |   alt text still read by AT (img stays in DOM
|-------------------|   with alt; only the src failed)
| TYPE   STATUS     |
| Title             |
+-------------------+
```

- `ResponsiveImage` falls back to the plain `<img src="/images/<src>">`
  when the manifest has no entry (dev before `npm run images`, or a new
  asset not yet generated). A missing derived variant never blanks a card
  ([RES-13] degradation path named; Release It! ch-5 Fail Fast is for
  the build, not the reader).
- Build-time failure is loud: a source raster sharp cannot read fails
  `prebuild`, so the deploy fails rather than shipping a hole.

## 4. Research index — mobile (≤ 768 px)

```
+-----------------------------+
| ≡  DANIEL ARCÉ     [▪▪]     |
+-----------------------------+
| ‹  Research  ›              |
+-----------------------------+
| +-------------------------+ |
| | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ | |  16:9 box; 100vw → 480w/640w
| | ▒ eager · high        ▒ | |  variant on a 390-px phone at 2×
| | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ | |
| |-------------------------| |
| | METHOD  REGISTERED      | |
| | Heuristics Canon        | |
| +-------------------------+ |
| +-------------------------+ |
| |      lazy · auto        | |  only card 1 is eager on mobile —
| |                         | |  cards 2+ sit below the fold
| +-------------------------+ |
```

- Eager count is a single constant (`EAGER_CARDS = 3`); on mobile the
  second and third eager cards cost ~2 extra small requests up front,
  which is cheaper than a viewport-width switch in markup. Revisit only if
  the mobile p75 LCP says otherwise ([PERF-01]).
- Swipe between siblings (`useSwipeNav`) is unchanged; images are not on
  the gesture path.

## 5. Research exhibit — masthead

```
+---------------------------------------------------------------------+
| ‹ prev            Agent memory over durable state            next › |
+---------------------------------+-----------------------------------+
| METHOD  REGISTERED              |  +-----------------------------+  |
|                                 |  | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ |  |
| lede …                          |  | ▒ eager · high · 50vw     ▒ |  |
|                                 |  | ▒ 640w/960w, not 1600w    ▒ |  |
|                                 |  | ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ |  |
|                                 |  | On Kawara, DEC. 29, 1977 …  |  |
|                                 |  +-----------------------------+  |
| body …                          |  links · details                  |
+---------------------------------+-----------------------------------+
```

- The masthead is the LCP element of every research detail page and today
  reuses the index thumbnail's full-size file. Same `ResponsiveImage`,
  `priority` on, `sizes="(max-width: 1024px) 100vw, 640px"`.
- Caption is the alt text, so the credit survives a failed image.

## 6. Flow — first visit to `/research/`

```
request /research/  ──►  HTML (static)  ──►  CSS · fonts
                                           │
          row-1 <picture> ×3 (eager, high) ─┤  ≤ ~60 KB each, avif
          rows-2+ (lazy) ─── on scroll ─────┘
                                           ▼
                             LCP = first painted row-1 image
```

- Derived, not authored: `public/images/**` originals stay the source of
  truth; `public/images/_gen/**` and `lib/generated/image-manifest.json`
  are rebuilt by `prebuild` from a content hash ([STOR-07] precompute is
  an optimization, not the source; [FLOW-06] rebuild from source, never
  hand-patch; [DATA-14] one writer). Both outputs are gitignored.
- Steady state ([RES-07]): the generator prunes `_gen` files whose source
  hash no longer exists, so renamed assets do not accumulate.
- Prefetch ([latency ch-11]) is deliberately not added for sibling
  exhibits: pattern-based prefetch of 3–6 mastheads would pollute the
  600-second cache for a click that may never come.

## Validation steps (run after merge, in this order)

1. `npm run build` — must regenerate `_gen` + manifest; fail loudly on a
   bad source ([RES-13]).
2. `grep -c '<picture' out/research/index.html` ≥ 5; first three `<img>`
   carry `loading="eager"` + `fetchpriority="high"`; later ones `lazy`.
3. Sum of bytes for the row-1 avif variants at 480 w ≤ 200 KB total.
4. Lighthouse mobile, 3 runs, report the p75-ish middle run LCP for
   `/research/` and `/research/agent-memory/` before vs after
   ([PERF-01]).
5. Dark theme + hover: the dither placeholder colours still meet
   [A11Y-01] contrast against the card surface (unchanged tokens).
