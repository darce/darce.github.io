# RESEARCH-REVIEW-01 implementation audit

Lane: research-implementation. Review date: 2026-10-11. This implements the
fresh assignment; the inherited inventory-only objective is superseded.
The inventory is evidence collection, not an authoritative finding or a fresh
verification result. All seven articles were read and revised.

## Product changes and ownership

All seven opt into `articleLayout: flow` and group sections into intrinsic
flow containers. Prose retains the existing reading measure. Headings use
spacing and type hierarchy without the repeated top rule. Sections containing
long code, tables, or explicitly wide evidence use the article canvas.

- **agent-memory** owns record/index/retrieval/packet mechanics. Defines a text
  fingerprint and distinguishes an embedding service from a missing candidate.
  The broad database architecture has a primary project link; exact retrieval
  status/enforcement claims become safeguards to check, rather than unverified
  deployed guarantees (`content/research/agent-memory.mdx:81`). The historical
  four-fifths observation retains the author's account and identifies missing
  provenance. The embedding explanation cites Sentence-BERT without attributing
  that model or its benchmark to WorkBay (`:68`). Retains four distinct SVG
  relations: session continuity, similarity candidates, retrieval paths, and
  data boundaries. Their native dimensions now govern placement.
- **interrogating-agent-memory** owns inspection questions, rather than repeating
  the architecture. Explains semantic retrieval and verdict/commit terminology,
  qualifies the three-quarters audit observation (`:55`), and distinguishes a
  second model's review from a guarantee of correctness. Retains the schematic
  record-window SVG, explicitly not an audit sample.
- **economics-of-agent-memory** owns audit assumptions and the proposed comparison.
  Preserves the reported figures while identifying absent dates, row extracts,
  and sample sizes (`:43`). The mean-packet/median-task division is an aggregate
  ratio, not matched overhead or measured savings (`:63`). Defines tokens,
  quality margin, sample-size procedure, full task accounting, unsuccessful
  attempts, and the separation of token totals from monetary costs. The existing
  badge remains “evaluation proposed”; no completed/externally registered trial
  is implied. The scale SVG now has an actual log10 token axis and correctly
  positioned 300/300,000 markers, without fabricated task-range endpoints. The
  mismatch panels and proposed trial stages retain distinct grammars.
- **visual-search-workbench-process** owns rationale and method limits; the pilot
  retains current screen/control reference ownership. Replaces the two workflow
  ASCII blocks with the existing visual-search-specific entry/state SVGs (`:33`,
  `:54`); retains the actual map/grid UI wireframe (`:94`). Both evidence screenshots
  explicitly take wide rows (`:35`, `:56`). Removes the repeated grid explanation,
  expands UMAP, and distinguishes author-reported release details from verified
  method facts. No user-study or peak-memory result is invented.
- **heuristics-canon** owns judgment and traceability. Names release v0.25.6,
  explains B/S/J, cites exact VIZ rule names and their Source titles at use time
  (`:46`, `:60`, `:62`), and describes an inspectable finding and subsequent check
  rather than repeating project cases. Retains the false-positive field example
  with its missing review date/adjudication record (`:86`). Digest validity is
  distinguished from correctness; citation counts are not a quality measurement.
- **rotation-matrices** retains its independent teaching purpose and all eight
  fences, including the complete reference. Defines radians/column vectors at
  first use, links the author-provided Modern Robotics explanation, and gives a
  quarter-turn example (`:53`, `:137`). Corrects the projection boundary to the
  eye plane z=d (`:293`) and describes the consolidated code as a simplified
  equivalent, with x/y-only `scaleXYZ` and separately situated JSX (`:329`).
  Keeps geometric diagrams and the interactive cube; the larger final comparison
  and perspective construction have wide rows. Paired figures use intrinsic
  flexible placement rather than mandatory identical half-width slots.
- **order-book** distinguishes the 20 received levels from 10 table/15 chart levels
  (`:36`), defines WebSocket and base/quote assets, identifies invented JSON
  quantities as BASE units and prices as USDT/BASE (`:84`, `:93`), and separates
  mathematical undefined imbalance from the inline card's zero sentinel (`:117`).
  Adds available-liquidity, partial-fill, and time-in-force conditions (`:165`).
  The dollar-sign currency shorthand remains an explicitly described limitation
  of the unowned market components. Retains the live demonstration and real code.

## Renderer and export defects verified

`ArticleCode.tsx:7` measures literal text across nested highlight spans; tabs
advance to four-column stops. It never changes the child code. A 68-column lower
bound includes the 71/78/81/92-column examples as wide; the 46/55-column examples
can use intrinsic width when the container leaves room for prose. This is a
content-based choice, independent of language or block height. Long blocks clear
floats and take the full canvas (`ProjectDetails.module.scss:394`). All code keeps
`white-space: pre`, its readable font size and every byte; horizontal scrolling
stays inside the block. Math display overflow is also contained (`:229`).

The real seven-article renderer test found that a client-only OrderBookProvider
hid the article's code and explanation from static HTML. Its socket starts in an
effect, so a normal server-rendered provider preserves those children while the
interactive chart remains client-loaded (`ProjectDetails.tsx:9`, `:29`). No market
implementation or socket lifecycle file was edited. ASCII illustrations keep a
single accessible alternative without focusable hidden code descendants.

Existing Diagram/DiagramPair alternatives and captions were dropped by the generic
component stripper. `scripts/lib/strip-mdx-components.js:12` now preserves them;
fence protection continues to preserve literal angle brackets and JSX. No unrelated
graphic semantics were added to SearchWorkflow. New process diagrams use its
existing alternatives, which are already preserved in the text export.

SVG plates retain authored label scale through a contained scrollable image viewport
on narrow canvases, rather than shrinking explanatory labels into tiny text
(`ProjectDetails.module.scss:416`). Captions/alternatives remain outside that viewport,
and the existing viewer can inspect the entire plate. The viewer's Close icon and
pilot's query-copy/diagram row plus wide screenshot were retained.

`package.json:9` limits test-only generation with `--skip-sitemap`. Both text exports
still regenerate; default generation/prebuild still writes the history-derived
sitemap (`scripts/generate-llm-content.js:204`). The isolated fixture verifies fresh
text, repeated-generation equality, unchanged sitemap bytes in test mode, and sitemap
generation in default mode. Incidental build-date sitemap differences in this
history-stripped clone were restored, never committed.

## Primary evidence checked in this session

- [Sentence-BERT](https://arxiv.org/abs/1908.10084), Reimers and Gurevych's abstract:
  sentence embeddings compared by cosine similarity. No WorkBay model/quality claim.
- [WorkBay persistence description](https://github.com/darce/workbay#what-persists-exactly):
  local SQLite record and broad stored evidence. This is a moving README, not a pinned
  implementation snapshot. The exact linked retrieval module was unavailable; current
  fingerprints/status categories/merge enforcement were not independently established.
- UMAP authors' [method explanation](https://umap-learn.readthedocs.io/en/latest/how_umap_works.html),
  [clustering limits](https://umap-learn.readthedocs.io/en/latest/clustering.html), and
  [parameter guide](https://umap-learn.readthedocs.io/en/latest/parameters.html):
  neighbourhood graph/layout, density distortions/artificial splits, n_neighbors/min_dist.
  These establish method limits, not VSW retrieval or exploration quality.
- [Binance partial depth streams](https://developers.binance.com/docs/binance-spot-api-docs/web-socket-streams#partial-book-depth-streams):
  5/10/20 levels, 100/1000 ms options, price/quantity tuples.
  [New order](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/trading-endpoints#new-order-trade):
  base-asset quantity versus quote-asset spending.
  [Time-in-force/order status](https://developers.binance.com/docs/binance-spot-api-docs/enums#time-in-force-timeinforce):
  GTC/IOC/FOK and partial-fill expiry. Local component reads confirm received/table/chart
  depths and the inline zero sentinel. No successful live-market connection is claimed.
- Lynch and Park's [Modern Robotics rotation-matrix lesson](https://modernrobotics.northwestern.edu/nu-gm-book-resource/3-2-1-rotation-matrices-part-1-of-2/):
  right-handed orthonormal rotation conventions. Executing the actual local TypeScript
  module confirms Rx(+π/2): +y→+z, Ry: +x→−z, Rz: +x→+y, and squared-length preservation.
  For d=4, x=2 projects to .5 at z=0 and 1 at z=2; z=d is singular.
  Direct calculation confirms 300/300000=.001 and 500/4100=.121951… (12.20%).
- The VSW v0.2.6 release page was unavailable. Its changes and the 8 GB test remain
  author-reported. No audit extract was supplied or found; dates/denominators were not
  invented and observations were not deleted merely to shorten the articles.

## Canon v0.25.6 disposition

Read the provisioned read-only `/home/gate/workbay-sandbox/heuristics-canon-v0.25.6`.
Read AGENTS.md completely. Independently verified manifest SHA-256
`ce0953e41cf3fc836cf9d8a5a8e7975173d26da8cf178480bfbd1d33bf41cb7d` and all 53 listed
lexicon/docs/reasoning/source digests. The explicit pin supersedes generic v0.25.3 advice.

Routed prose through WRIT/CLM, UI through TYPE/LAY/VIZ/A11Y, and evaluation claims
through UXR/EXP. Kept full triggered rows, not a whole-canon checklist. Source titles
and locators below are exactly those printed in the release rows, not invented book
locations or a claim to have read the original books.

- [TYPE-01] **Measure cap** (*Web Typography (Richard Rutter)*, § designing-paragraphs-line-length),
  B: retained prose measure and type-unit container guard. Actual responsive measures
  still need browser verification; escalated with the environment blocker.
- [LAY-06] **Hierarchy without ornament** (*Asymmetric Typography (Jan Tschichold)*,
  § decorative-typography), S: removed repeated heading rules while retaining type/spacing.
- [LAY-24] **Content-and-frame grid** (*Thinking with Type*, ch. 3), S: intrinsic
  evidence/short code, full-width long code, responsive section sizing and flexible pairs.
  Geometry checks exist; browser execution is escalated, not claimed satisfied.
- [A11Y-01] **Contrast floors (1.4.3/1.4.11)** (*Web Content Accessibility Guidelines 2.2*,
  SC 1.4.3; *The WebAIM Million*, 2026), B: plate ink/paper pairs measure 17.55:1
  (#171920), 8.58:1 (#464c5c), and 4.90:1 (#d9253f) on white. Browser checks across
  both themes remain escalated; these calculations are not whole-page conformance.
- [A11Y-02] **Alt serves purpose (1.1.1)** (*Web Content Accessibility Guidelines 2.2*,
  SC 1.1.1), B: diagrams retain meaningful alternatives/captions in HTML and text;
  static-renderer tests check them. No inaccessible-content exemption is claimed.
- [WRIT-17] **Develop the same thread** (*The Sense of Style*, ch. 5), S: removed the
  repeated process-grid explanation and preserved distinct memory-article ownership.
- [WRIT-26] **Restore a needed attribution** (*The Sense of Style*, ch. 2), B:
  audit/release/practice observations name their author and missing evidence.
- [WRIT-71] **Unpack private knowledge** (*The Sense of Style*, ch. 3), S:
  consequential jargon and missing numerical inferences now have definitions/examples.
- [WRIT-40] **Deduplicate** (*Legal Writing in Plain English*, ch. 1), B: screened the
  rotation reference. Its distinct purpose is a consolidated readable implementation;
  the teaching fragments and full reference are retained explicitly for those separate
  uses. No code was tail-cut or replaced with ellipses to obtain brevity.
- [VIZ-15] **Coordinate multiple views** (*Visualization Analysis and Design (Munzner)*),
  S: the explanatory selection uses the same lettered objects across views. This is a
  schematic traceability check, not a verdict on the running VSW interface.
- [VIZ-18] **A topology-preserving projection is not a metric map** (*UMAP: Uniform
  Manifold Approximation and Projection*), J: primary docs support the bounded map
  interpretation. No distance/density claim is inferred from the displayed projection.
- [UXR-01] **Match claim to validation level** (*Visualization Analysis and Design
  (Munzner)*; *Spatial Semiotics and Spatial Mental Models*, ch. 3), B: implementation,
  field observation, proposed evaluation and measured effect remain distinct.
- [EXP-01] **Base-rate idea failure** (*Trustworthy Online Controlled Experiments*,
  ch. 1), J: proposed controlled comparison and explicit lower-trust observations;
  no success conclusion or empirically validated Canon is claimed.

Checked PRINCIPLES siblings for the retained contrast, attribution and evaluation
rows: COL-04's value-first hierarchy, GRPH-14's walkable lineage and TEST-03/FORE-05's
pre-commit evidence/local baseline. These are mechanism checks, not extra votes.
Read every card listing a kept ID, in slug order: attribute-claims-to-their-bearer;
bounded-role-lets-a-small-model-be-safe; compression-is-selection-not-truncation;
constrained-domains-have-solved-it; evidence-before-commitment; signal-density-not-length.
Applied their verification sections where triggered. Claim bearers and purpose-fit
alternatives were inspected; completion evidence is recorded below. Model-tier,
audio-timing/hard-budget and length-biased bake-off triggers do not fire for this
human-readable article revision. No named exemption or original-source claim is
invented. Outstanding B/S visual verification is explicitly escalated below.

## Verification and external blocker

Offline install: `npm ci --ignore-scripts --offline --cache .task-state/npm-cache`
succeeded (1,060 packages); package-lock unchanged. Python is only the lane-managed
interpreter for the SVG generator. pyproject declares no importable Python package,
so unrelated import-origin probes were skipped.

RED before production changes:

- Exact scoped command exposed missing renderer width attributes; code bytes were
  present but every layout classification was null.
- The same scoped paths with `npm --ignore-scripts test -- ...` exposed lost diagram
  alternatives and test generation changing the canonical sitemap. An initial run
  also encountered the not-yet-generated image manifest and subprocess EPERM; those
  tooling failures were not called behavioral RED. The fixture subsequently runs
  the actual generator in a VM with deterministic git dates.
- Expanded seven-article coverage then exposed zero rendered order-book code blocks
  behind the client-only provider. Fixed through server-rendered provider registration.

GREEN: exact scoped command
`npm test -- test/lib/llm-content.test.ts test/lib/design-tokens.test.ts test/components/projectImageCaptions.test.tsx`
passes **3 files / 38 tests**. Includes near-80 columns, nested highlighting, tab
extent, literal JSX, source order, all seven server-rendered articles, correct SVG
root dimensions, alternatives/captions, export parity and generator idempotence.
Both public text exports regenerated; llms.txt is unchanged because its indexed
summaries did not change. All 12 remaining fenced code/UI examples are preserved.

Production webpack export succeeded, including all seven URLs and the pilot.
`node test/support/verify-research-export.ts` independently checks built HTML
against authored code bytes/order/alternatives and checks the pilot's query row and
wide screenshot. Frontend/test types pass; lint has zero errors and six warnings
in untouched ResponsiveImage, Nav, useOrderBook and ThemeContext files. Default
Turbopack compilation stalled and was interrupted; supported webpack compilation
and static export were used instead. No runtime/control files were changed.

Browser spec now covers the seven URLs, complete code, wide/short geometry,
responsive no-overflow, scroll-end reachability, source order, image ratios,
alternatives, headings, light/dark axe checks, mobile/200% text, and representative
screenshots, alongside retained pilot/viewer checks. Test types compile.

**External blocker:** Playwright 1.64 requests missing Chromium revision 1248.
The existing arm64 revision 1243 launches but crashes on sandbox socket operations.
Even the built-output test server fails with `listen EPERM 127.0.0.1:4347`.
`npm run test:browser -- --config test/browser/research.config.ts test/browser/article-flow.spec.ts --project desktop --workers 1 --max-failures 1`
therefore cannot execute browser assertions. The config supports an explicitly
provisioned executable without changing the lockfile, and sets the correct server
working directory. Request a native runner with allowed local sockets and the
lockfile-matched browser. Run all three browser projects plus the existing viewer
check there before approval. No browser pass, page screenshots, mobile visual
inspection or overall accessibility conformance is claimed.

Native-scale SVG inspection was performed via temporary PNG renders:
`/tmp/research-econ-scale.png`, `/tmp/research-memory-layers.png`, and
`/tmp/research-rotation-perspective.png`. It found and corrected colliding aggregate
labels in the new scale plate. These are **diagram inspections, not page previews**.
The exported pages are at `out/research/<slug>/index.html`. Browser screenshot
locations, once the blocked checks run, are `test-results/**/<slug>-<project>-<theme>.png`;
no such successful captures currently exist.

## FILES_OPENED / final touched files

Opened all seven scoped MDX articles, pilot screen reference; ProjectDetails,
ArticleFigure, SearchWorkflow, ResponsiveImage; OrderBookMetrics, OrderBookView,
useOrderBook, useWebSocket, OrderTables, DepthChart; lib getMdxContent, markdownUtils,
schemas, matrixTransformations, imageManifest, researchEvidenceLabels; package.json,
pyproject, .gitignore, next config; memory/economics SVG generators and relevant
rotation generator/assets; strip/content/image generators; inventory; scoped unit
files, matrix tests, browser article/editorial/workflow specs, browser support and
Playwright config. Codebase-memory SKILL.md was read; graph tools are unavailable.
Used direct source reads/rg. Canon reads are documented above; no canon file changed.

Touched:

- `content/research/agent-memory.mdx`
- `content/research/visual-search-workbench-process.mdx`
- `content/research/interrogating-agent-memory.mdx`
- `content/research/economics-of-agent-memory.mdx`
- `content/research/heuristics-canon.mdx`
- `content/research/rotation-matrices.mdx`
- `content/research/order-book.mdx`
- `components/features/ProjectDetails/ArticleCode.tsx`
- `components/features/ProjectDetails/ProjectDetails.tsx`
- `components/features/ProjectDetails/ProjectDetails.module.scss`
- `scripts/lib/strip-mdx-components.js`
- `scripts/generate-llm-content.js`
- `scripts/generate-econ-diagrams.py`
- `public/images/research/econ-scale.svg`
- `public/llms-full.txt`
- `package.json`
- `test/components/projectImageCaptions.test.tsx`
- `test/lib/llm-content.test.ts`
- `test/browser/article-flow.spec.ts`
- `test/browser/research.config.ts`
- `test/support/verify-research-export.ts`
- `docs/research/research-review-01-implementation.md`

No sibling-lane path, dependency version, pinned Canon, viewer control, pilot MDX,
or lifecycle helper changed. Product/verification commits are preserved for review;
no merge, publication or root task-state transition was performed.
