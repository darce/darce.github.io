# RESEARCH-REVIEW-01 — article and evidence inventory

Scope: pre-implementation inventory for the seven requested articles. This report records what the current content and source material support;
proposed edits and any unverified author records remain for Sol to judge. No article, UI, test, or manifest files were changed.

Verification refresh: 2026-10-11, in the actual remote worktree
`/home/gate/workbay-sandbox/feature-research-review-01-6db43af5`, branch
`feature/research-review-01`. This lane owns only this report; brief #125's
implementation work is downstream. Historical and refreshed source checks
are labelled separately below.

## Findings that affect implementation

- Only the pilot `visual-search-workbench-screen-reference.mdx` opts into
  `articleLayout: flow`. The seven targets currently use the ordinary layout.
- The pilot’s flow rules in `ProjectDetails.module.scss:199–358` size figures
  intrinsically and float figures/diagrams beside prose; `h2` top rules are disabled there (`:287–291`). Ordinary article headings keep their 2px
  rule (`:379–390`). `ProjectDetails.tsx:41–56` maps `Diagram` to a wide `ArticleFigure`; `Figure` defaults to inset. `ArticleFigure.tsx:22–61`
  uses manifest dimensions to keep the image’s intrinsic ratio.
- **Code-width risk:** the flow selectors include `.source > pre` and
  `.source > section > pre` (`ProjectDetails.module.scss:325–345`) among floated blocks and constrain a float to the space alongside prose. The
  rotation and order-book articles have code lines 81 and 92 columns wide. If either adopts flow, explicitly keep code at full article width and
  preserve every line; do not shorten it or let it wrap in a half-width float.
  Existing base styles also use `pre-wrap` and `break-word` (`:511–524`), so both
  the float constraint and destructive wrapping need attention. Classify by
  actual column extent and available prose space: short blocks may flow; blocks
  around 80 columns need a cleared, full-width row and contained scrolling on
  narrow screens. The exact fence inventory below supplies the inputs.
- The pilot’s query section has a text-plus-SVG desktop row and a wide image
  below it. Its three `SearchWorkflow` SVGs are schematics; the screenshots are application captures. Keep that distinction. `ImageViewer.tsx`
  and its module provide a scrollable, contained image and one accessible Close button; there is no Zoom control to remove or change.
- `stripMdxComponents` protects fenced code and retains `AsciiScreen` content
  and labels, so the current authored examples are available to the text renderer. It does not decide whether a diagram’s grammar is appropriate.
- **Existing diagram export gap:** `scripts/lib/strip-mdx-components.js:26–27`
  drops self-closing `Diagram` tags, including their alternative text and
  captions; `:45–46` also drops unknown paired components. An inline call with
  a labelled `Diagram` returned an empty string. Existing memory, economics,
  and rotation diagrams need meaningful text alternatives in the export, as
  do any new graphics. `test/lib/llm-content.test.ts:41–51` compares body text
  with that same stripper; this check can pass while those alternatives vanish.

## Article-by-article inventory

### `content/research/agent-memory.mdx` (100 lines)

- **Distinct purpose and outline:** describe WorkBay’s record/retrieval/context
  packet architecture, storage and optional semantic index, portability/privacy, and the proposed question of whether retrieved history improves
  work. Keep the system explanation here; the other memory articles have narrower jobs.
- **Visuals / code:** four SVGs — `memory-loop`, `memory-vector`,
  `memory-layers`, `memory-boundary`; no fenced code. Their distinct relations (record lifecycle, vector representation, retrieval paths,
  and data boundary) are useful; they do not need one repeated layout.
- **Evidence to check:** line 82 says “roughly four fifths” of embedded entries
  were review findings. No audit date, row export, denominator, or current citation accompanies it. Retrieve the audit extract or keep the stated
  historical limitation without implying a general distribution. Lines 44 and 66–70 make implementation claims about the local database/schema,
  model fingerprints, no-result categories, and candidate/merge behavior. The article’s `related_prior_work.py` link targets WorkBay `main`;
  the repository README supports the broad record/database and optional-embedding picture, but the linked source page was unavailable in this
  lane. Pin a commit and verify those exact details against that source before treating them as verified.
- **Jargon / diagram guidance:** define “fingerprint,” “provider,” “embedding,”
  and “context packet” briefly where needed. Preserve the four different diagrams; make labels explain which path is optional and what
  crosses the machine boundary.

### `content/research/visual-search-workbench-process.mdx` (147 lines)

- **Distinct purpose and outline:** explain why image search can become visual
  exploration, the text/reference-image path, what the Similarity map offers, UMAP’s limits and parameters, the map-to-grid interaction,
  local-processing constraint, and separate retrieval/exploration evaluation questions.
- **Visuals / code:** two application screenshots (`sis-layers-umap`,
  `sis-similarity-search`) plus three `AsciiScreen` fences at lines 32, 62, and 109; their widest lines are 26, 33, and 29 columns
  respectively. The first two describe input/search transitions, not UI arrangements; convert to the pilot’s process SVG grammar or concise
  prose if the ASCII-only rule is intentional. The third is the sole UI wireframe: a map selection linked to the same three images in a grid,
  and may remain as ASCII or use a shared SVG. These blocks do not establish that all seven articles need one diagram type.
- **Evidence verified:** lines 89, 97, and 99 cite the official UMAP explanation,
  clustering guide, and parameter guide. Those pages and the original UMAP paper support the graph-and-layout account, the distinction between
  local structure and displayed distances/density, and the roles of `n_neighbors`/`min_dist`. VIZ-18 is a suitable interpretation check,
  not evidence for the scientific claims.
- **Evidence to check:** line 87’s image-model/embedding implementation claim
  has no model or application source. Lines 135–137 report local processing, bundled models, and an 8 GB Apple Silicon test; the lane has
  no dated test log with OS, app/model version, image count, peak memory, or network trace.  The 0.2.6 release URL in line 137 could not be
  retrieved here. A local review note (`docs/reviews/2026-10-09-portfolio-content-review.md:154`) records a coordinator-verified release date,
  but is not the release artifact. Keep larger-library speed and memory explicitly unmeasured as the article does.
- **Repetition / jargon:** lines 103 and 105 both say the grid lets people
  inspect selected photographs; line 105 mostly restates the prior paragraph.  WRIT-17 applies: “Develop the same thread” (`The Sense of
  Style`, ch. 5).  Retain the paragraph that advances the search loop and trim the rest after Sol checks emphasis. Expand UMAP on first use;
  the article already explains embeddings, weighted graphs, neighbourhood size, and minimum distance.

### `content/research/interrogating-agent-memory.mdx` (85 lines)

- **Distinct purpose and outline:** a field-use guide built around five
  questions: where trouble repeats, whether a fix exists, why a decision was made, what supports completion, and what has failed. Its value
  is the questions a later session can ask, not a second full system description.
- **Visuals / code:** one `memory-window.svg`, explicitly labelled schematic
  rather than the audit sample; no code fences.
- **Evidence to check:** line 45 says “roughly three quarters” of recorded
  reviews in a small project had failed. No project identifier, date, `n`, audit export, or rule for counting a failed review is linked. The
  article correctly says the count does not establish a cause; retain that limit and source the count before reuse.
- **Jargon / cross-link:** explain “semantic retrieval,” “commit,” “static
  output,” and “server rendering” in reader-facing terms. Cross-link to `agent-memory` for mechanics and `economics-of-agent-memory`
  for measurement; avoid repeating their architecture and protocol details.

### `content/research/economics-of-agent-memory.mdx` (107 lines)

- **Distinct purpose and outline:** report a descriptive audit, show why it
  cannot estimate an effect, propose calibration/content/matched-task stages, then state the quality-constrained decision criterion and
  remaining operational definitions. This is a proposal, not a finding that memory saves tokens or money.
- **Visuals / code:** three SVGs (`econ-scale`, `econ-gap`, `econ-design`) and
  one audit table; no code fences. The log-scale comparison, intervention / measurement gap, and staged paired design are different explanatory jobs.
- **Evidence to check:** lines 36–45 report three databases, about 300 tokens
  per compact packet, a median task near 300,000 tokens, a few-thousand to hundreds-of-millions range, about 99% with a written resolution,
  and no audited codebase below 97%. No underlying rows or per-measure sample sizes were found in the repository. Request a dated export,
  `n` and denominator for each statistic, packet/token-count boundary, and worker-lane normalization. The roughly 1:1,000 comparison at line
  53 is arithmetic on those aggregates, not a savings estimate. Line 89’s 20% is a proposed threshold, not an observed effect. The audit
  aggregates have no current article citation or raw evidence link.
- **Interpretation verified:** lines 57–67 explicitly identify the mismatch
  between packet receipt and task-token instrumentation. Lines 71–99 present matched runs and quality margins as uncompleted protocol. Current
  UXR-01 and EXP-01 links point to Canon `main`; their use is forward-looking design guidance and does not validate the audit or trial. Keep
  that distinction.
- **Jargon:** gloss “token,” A/A calibration, base commit, blinded scoring,
  and acceptable quality margin when first used. Preserve that unsuccessful runs count toward total task cost.

### `content/research/heuristics-canon.mdx` (85 lines)

- **Distinct purpose and outline:** show the chain from a recorded finding to a
  rule, a checked product change, and an evaluation. It should explain how rules focus a critique, not re-explain VSW’s complete map/grid
  interaction or claim that Canon improves review quality.
- **Visuals / code:** no embedded diagram or fenced code. The VSW map/grid
  example is enough to ground the two rule examples.
- **Evidence to check:** lines 49 and 51 use VIZ-15 and VIZ-18 accurately as
  distinct checks: recognition across views and limits on interpreting a UMAP projection. Both links currently target `main`; pin them
  to v0.25.6. The local pinned source confirms exact row titles and source cells: VIZ-15 “Coordinate multiple views” (`Visualization
  Analysis and Design (Munzner)`); VIZ-18 “A topology-preserving projection is not a metric map” (`UMAP: Uniform Manifold Approximation
  and Projection`). These rules guide design review and do not prove user benefit or UMAP behavior.
- Lines 67 and 69 give field anecdotes (~40 code sites / about a third false
  positives; a failure only in a constructed input). No linked review record, source commit, or test input was available; request those
  artifacts or keep them explicitly as unverified examples. Line 77’s consumer-guide link also points to `main`; pin its version.
- **Jargon / cross-link:** define “lexicon,” “trigger,” and “false positive.”
  Keep a short Canon example and link to the process article for the visual workflow; do not duplicate its explanation of map and grid roles.

### `content/research/rotation-matrices.mdx` (372 lines)

- **Distinct purpose and outline:** teach 3D rotation and projection through
  explicit matrices, composition order, a live cube, and a complete rendering implementation. It is the one deep code/tutorial article in this set.
- **Visuals / code:** interactive Cube plus ten SVGs (two sign convention,
  apply/axes, five composition/order steps, and two perspective illustrations).  Eight code fences at lines 64, 80, 97, 123, 178, 221, 244,
  and 270 have maximum line widths 71, 71, 71, 78, 55, 81, 76, and 92 columns. Preserve the full source; if flow is applied, these code blocks
  need width classification rather than a blanket float. The near-80 and
  92-column blocks need full article width; the 55-column sequence may flow
  where the copy has sufficient room. Composition drawings may be simplified to the starting state and final outcomes for both orders, but retain the
  sign convention/axes and perspective views that explain separate concepts.
- **Evidence checked:** the displayed matrix order, projection equations, and
  code were compared with `lib/matrixTransformations.ts` and `Cube.tsx`; the local implementation uses the same column-vector order and
  projective scale. The initial inventory opened only the secondary Wikipedia
  reference; the refresh adds an author-provided rotation reference below.
  No performance claim should be inferred; the article says it has no GPU measurement.
- **Refresh calculation findings:** despite its name, `scaleXYZ` scales only
  x and y (`lib/matrixTransformations.ts:107–113`, article `:320–325`), retaining
  z for inverse-depth projection. Explain this as display scaling, not uniform
  three-dimensional scaling. The denominator is singular at the eye plane
  `z = eyeDistance`, not at the screen plane `z = 0`; qualify the warning at
  article `:236`. Executing the actual TypeScript implementation confirmed the
  three 90-degree rotation signs, unchanged z under scaling, and infinity at
  `z = d`. The cube uses `d = 10` with initial coordinates ±0.5
  (`Cube.tsx:29–37,47–54`), so its displayed configuration stays away from that
  singularity. A primary rotation reference was opened during this refresh;
  see the source ledger below.
- **Jargon / repetition:** the article defines column vectors, active
  right-handed rotations, and eye-relative depth; retain those explanations.  It first teaches small implementations and later repeats them
  in a complete listing. That may be a deliberate tutorial reference; ask Sol whether to consolidate, but do not truncate code or assume it
  belongs in a half-width inset. Explain homogeneous coordinates/perspective divide before relying on them for readers without graphics coursework.

### `content/research/order-book.mdx` (168 lines)

- **Distinct purpose and outline:** interactive explanation of resting bids /
  asks, displayed depth, spread, imbalance arithmetic, and market/limit order execution. The embedded live component is its primary diagram;
  do not add an ASCII picture just to match another article.
- **Visuals / code:** live `<OrderBook />` plus three code fences at lines 72,
  86, and 99, with maximum widths 46, 71, and 92 columns. The component shows tables, a depth chart, and metrics. Its source thumbnail is not
  a second authored diagram.
- **Evidence verified:** Binance’s official Partial Book Depth Stream docs
  specify 5/10/20 levels and 100/1000ms update speeds; `useOrderBook.ts` subscribes to `@depth20@100ms`. The docs also confirm each level is a
  `[price, quantity]` pair. The SEC’s general market/limit order descriptions are about securities, not crypto execution; use Binance-specific
  execution documentation or mark the section as a simplified general model; the article’s Binance citation covers stream format, not
  execution claims.
- **Corrections to check against UI:** frontmatter line 9 and body line 31 say
  “top 20”/“top 20 levels”; the table renders 10 (`OrderTables.tsx:28–32`), depth chart 15 (`DepthChart.tsx:29–35`), and metrics can
  use the 20-level stream. Distinguish received stream depth from each displayed view. Article line 103 correctly says an empty-book ratio is
  undefined, but `OrderBookMetrics.tsx:126–136` displays zero for empty/zero denominator; explain the UI’s loading/empty convention. Line
  79 calls 1,500 “units” at price 2.35 “in the quote currency”; Binance’s pair order means quantity is base-asset units and price
  is quote per base. Label the example units and values as illustrative, or source a real snapshot. “Live” / “near current” is runtime
  state and was not established from a static article review.
- **Execution boundary:** article `:152–160` should make available liquidity
  and order conditions explicit. Binance's primary order and time-in-force
  documentation was opened during this refresh: a market order can partially
  fill and expire; an unfilled limit remainder stays on the book only when its
  conditions permit. The current statement “any unfilled portion that rests”
  is conditional already; preserve that qualification rather than suggesting
  every limit remainder rests. `OrderTables.tsx:48,70` and
  `DepthChart.tsx:59,63` prefix prices with `$`; article units should specify
  USDT per base asset rather than equating USDT with USD. The inline imbalance
  card uses a zero sentinel, while `OrderBookView.tsx:43` calculates the raw
  ratio; do not describe the sentinel as a mathematical result or a universal
  component convention.
- **Jargon:** define WebSocket, JSON, BTC/USDT, base and quote asset, and
  “partial fill” for readers new to exchanges. Explain that displayed orders can change before execution; avoid implying the visible book
  predicts price.

## Exact fenced-block inventory

Ranges include both fences; body counts exclude them. Columns count Unicode
code points including indentation. No tabs occur; nothing was truncated.

| Article | Fence lines | Kind | Body lines | Maximum columns | Widest source line |
| --- | --- | --- | ---: | ---: | ---: |
| visual-search-workbench-process | 32–42 | workflow schematic | 9 | 26 | 37 |
| visual-search-workbench-process | 62–72 | workflow schematic | 9 | 33 | 71 |
| visual-search-workbench-process | 109–127 | actual map/grid UI arrangement schematic | 17 | 29 | 111 |
| rotation-matrices | 64–73 | TypeScript, X rotation | 8 | 71 | 65 |
| rotation-matrices | 80–89 | TypeScript, Y rotation | 8 | 71 | 81 |
| rotation-matrices | 97–106 | TypeScript, Z rotation | 8 | 71 | 98 |
| rotation-matrices | 123–135 | TypeScript, matrix/vertex multiplication | 11 | 78 | 124 |
| rotation-matrices | 178–193 | TypeScript, transformation sequence | 14 | 55 | 190 |
| rotation-matrices | 221–235 | TypeScript, perspective projection | 13 | 81 | 222 |
| rotation-matrices | 244–260 | JSX rendering example | 15 | 76 | 250 |
| rotation-matrices | 270–371 | transformation functions and JSX reference | 100 | 92 | 304 |
| order-book | 72–77 | illustrative JSON payload | 4 | 46 | 74 |
| order-book | 86–89 | TypeScript, volume sums | 2 | 71 | 87 |
| order-book | 99–101 | TypeScript, imbalance formula | 1 | 92 | 100 |

The other four articles have no fences: total 14, comprising 11 code examples
and three drawings. Keep the intentional 100-line reference complete.
The 55-column sequence and 46-column payload may flow with readable prose;
height and language alone must not decide width.

## Source-of-truth and generator boundaries

- `lib/markdownUtils.ts:102–145` normalizes frontmatter and validates it;
  `lib/schemas.ts:32` accepts `articleLayout: flow`. The pilot demonstrates
  the supported authored opt-in, not a need for a metadata contract change.
- The bounded search of `scripts/` found readers of the research MDX and no
  writer for the seven article files. Treat these MDX files as authored source;
  this is a scoped discovery result, not proof about external authoring tools.
- Memory/window assets have their source in
  `scripts/generate-memory-diagrams.py`; economics assets in
  `scripts/generate-econ-diagrams.py`; rotation assets in
  `scripts/generate-rotation-diagrams.py`. A changed generated SVG must also
  be reflected in its generator. Their fixed white backgrounds and fixed
  label sizes warrant visual inspection in both site themes; no browser
  contrast or mobile-legibility verdict was established in this lane.
- `scripts/generate-llm-content.js:188–199` reads the authored content and
  writes `public/llms.txt`, `public/llms-full.txt`, and `public/sitemap.xml`.
  The scoped test command invokes this generator through `pretest`; generated
  export parity is not independent evidence that every diagram was preserved.

## Cross-article ownership and diagram grammar

- `agent-memory` owns record, index, retrieval, and packet mechanics;
  `interrogating-agent-memory` owns the practical questions to ask of retained history; `economics-of-agent-memory` owns the audit and proposed
  measurement protocol. Keep their existing links and avoid repeating full definitions.
- `visual-search-workbench-process` owns why visual exploration differs from
  retrieval and method limits. The pilot `visual-search-workbench-screen-reference.mdx` owns concrete screens, control states, and capture/version
  labels. Both mention text search, Find similar, map, and grid; let the pilot document exact interaction and the process article explain
  rationale. Keep the Canon’s map/grid example short and focused on VIZ-15/VIZ-18.
- Use diagram grammar to match the relation: process/state SVGs for transitions,
  map/grid wireframes for a UI arrangement, architecture diagrams for data paths, paired scales and stages for the economics protocol, and
  the interactive visual for the order book. The current ASCII blocks are all in the VSW process article, but only its third block is a UI
  arrangement. The articles do not call for one shared diagram type.
- Apply WRIT-17 only to the repeated grid explanation at process lines 103–105;
  do not remove a definition just because it recurs in a separate article with a different reader task. WRIT-71 “Unpack private knowledge”
  (`The Sense of Style`, ch. 3) is a useful check for the jargon list above.

## Pinned Canon review

- Read-only source: heuristics-canon v0.25.6, release manifest schema
  `heuristics-canon/release@5`; SHA-256 of `meta/release-manifest.json` is `ce0953e41cf3fc836cf9d8a5a8e7975173d26da8cf178480bfbd1d33bf41cb7d`.
  Verified all 53 manifest-listed files (12 lexicons, 6 docs, 35 reasoning files); no digest failures.
- Routed prose/docs through WRIT + CLM as `AGENTS.md` directs; screened CLM-01–06,
  and none fires: the articles discuss research and an educational market-data demo without making a regulated-domain product-capability claim or
  describing a privacy policy/terms promise. Consulted full rows WRIT-17, WRIT-71, VIZ-15, VIZ-18. Checked every card listing the kept WRIT-17
  ID: CARD-21 `compression-is-selection-not-truncation` and CARD-30 `signal-density-not-length`; their hard-budget and scorecard/bake-off
  triggers do not fire for this editorial inventory. No principle listed a kept ID. No card lists were present for the other consulted rows.
- The task's explicit v0.25.6 override takes precedence over generic v0.25.3
  guidance. Rechecked `/home/gate/workbay-sandbox/heuristics-canon-v0.25.6`;
  the initial source was `/home/gate/.workbay/reference/portfolio-copy-01/canon`.
  Both the manifest hash and all 53 listed digests match the provisioned copy.
- **Report disposition:** no B rule retained. S recommendations
  [WRIT-17] **Develop the same thread** (*The Sense of Style*,
  ch. 5) and [WRIT-71] **Unpack private knowledge** (*The Sense of Style*, ch. 3)
  are addressed by distinct article ownership and named reader knowledge gaps;
  article corrections remain downstream. The two cards' verification sections
  were read; their own triggers do not fire. [VIZ-15] **Coordinate multiple
  views** (*Visualization Analysis and Design (Munzner)*) is consulted, not a
  running-UI verdict. [VIZ-18] **A topology-preserving projection is not a metric
  map** (*UMAP: Uniform Manifold Approximation and Projection*) is a contextual
  J judgment supported by primary docs: avoid metric claims from map spacing.
  No exemptions or empirical validation are claimed.

## Sources opened and evidence limits

The initial inventory recorded UMAP docs and the [original paper](https://arxiv.org/abs/1802.03426),
Binance stream docs, WorkBay README, and the Canon repository. It also opened
SEC Investor.gov [Types of Orders](https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders)
(securities, not crypto-specific) and Wikipedia's rotation article (secondary,
not primary evidence). Its retrieval-module and VSW release opens failed.
That historical record is not a claim of fresh verification; the checked
sources and remaining gaps follow.

### Sources actually rechecked on 2026-10-11

- Official UMAP [How UMAP Works](https://umap-learn.readthedocs.io/en/latest/how_umap_works.html)
  supports the neighbourhood graph/layout explanation;
  [Clustering](https://umap-learn.readthedocs.io/en/latest/clustering.html)
  warns about density distortion and artificial splits;
  [Parameters](https://umap-learn.readthedocs.io/en/latest/parameters.html),
  sections `n_neighbors` and `min_dist`, supports neighbourhood/packing
  descriptions. These verify UMAP, not VSW's model choice or search quality.
- [Binance Spot WebSocket Streams](https://developers.binance.com/docs/binance-spot-api-docs/web-socket-streams#partial-book-depth-streams),
  *Partial Book Depth Streams*, confirms available levels, update speeds,
  and price/quantity tuples. [Spot trading endpoints](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/trading-endpoints#new-order-trade),
  *New order*, distinguishes base-asset `quantity` and quote-asset
  `quoteOrderQty`. [ENUM definitions](https://developers.binance.com/docs/binance-spot-api-docs/enums#time-in-force-timeinforce),
  *Time in force* and *Order status*, supplies GTC/IOC/FOK conditions and
  partially filled/expired cases. This checks the limits of the simplified
  execution explanation; it is not a live matching-engine or latency test.
- Kevin Lynch and Frank Park's author-provided [Modern Robotics §3.2.1,
  Rotation Matrices, Part 1](https://modernrobotics.northwestern.edu/nu-gm-book-resource/3-2-1-rotation-matrices-part-1-of-2/)
  supports orthonormal, right-handed rotation conventions. The perspective
  formula and numerical checks here rely on the local implementation and
  direct calculation, not that page or Wikipedia.
- [WorkBay README](https://github.com/darce/workbay#what-persists-exactly),
  *What persists, exactly*, supports local SQLite state and the broad record
  model. It remains a moving source. Opening the exact
  [retrieval module](https://github.com/darce/workbay/blob/main/packages/mcp-workbay-handoff/src/workbay_handoff_mcp/embeddings/related_prior_work.py)
  and [VSW v0.2.6 release](https://github.com/darce/visual-search-workbench/releases/tag/v0.2.6)
  again returned errors; provider status categories,
  source fingerprints, candidate/merge guarantees, bundled model identity,
  and release-specific assertions remain unverified in this lane. No dates
  or source commits were invented to fill that gap.
- No audit row export was supplied or located in the bounded article/source
  review; percentages and token aggregates remain author-reported without
  reproducible denominators. Calculation confirms `300 / 300000 = 0.001` and
  `(2300 − 1800) / (2300 + 1800) = 0.121951…` (12.20%), not the audit's
  measurement validity or memory savings. The 20% target is proposed.

## FILES_OPENED

Refresh reads (full articles; selected relevant implementation ranges):

- `content/research/{agent-memory,visual-search-workbench-process,interrogating-agent-memory,economics-of-agent-memory,heuristics-canon,rotation-matrices,order-book,visual-search-workbench-screen-reference}.mdx`.
- `components/features/ProjectDetails/{ProjectDetails.tsx,ProjectDetails.module.scss,ArticleFigure.tsx}`;
  `components/common/{ImageViewer/ImageViewer.tsx,Cube/Cube.tsx}`;
  `components/features/OrderBook/{useOrderBook.ts,OrderBookView.tsx,OrderBookMetrics.tsx,components/OrderTables.tsx,components/DepthChart.tsx,components/MetricsCards.tsx}`.
- `lib/{matrixTransformations.ts,markdownUtils.ts,schemas.ts}`;
  `scripts/{lib/strip-mdx-components.js,generate-llm-content.js,generate-memory-diagrams.py,generate-econ-diagrams.py,generate-rotation-diagrams.py}`;
  `test/lib/llm-content.test.ts`, `package.json`, `pyproject.toml`, `.gitignore`,
  and this report. Skill: `/home/gate/.codex/skills/codebase-memory/SKILL.md`.
- Canon `/home/gate/workbay-sandbox/heuristics-canon-v0.25.6`: full `AGENTS.md`,
  triggered full rows from writing/interaction-ux, CLM-01–06 from
  business-marketing, relevant `PRINCIPLES.md`/`SOURCES.md` entries, both
  reasoning cards named above, and all manifest-listed bytes for digest checks.

Initial-inventory reads remain recorded in commit
`3b6185305cc8002942780fe6eb1968e94d119852`; they are not fresh browser inspection.

## Commands and verification status

### Initial inventory history (superseded dependency/policy status)

- Read the `codebase-memory` skill and checked for its graph tools; none were
  available in this lane. Used `rg` and direct source reads as the fallback.
- A Node SHA-256 check matched the pinned Canon manifest and all 53 listed
  files. Ran `wc -l` on the eight MDX files (100, 147, 85, 107, 85, 372, 168, and 131 lines respectively) and an `awk` fence-width inventory;
  widths are recorded above. Initial `git status --short --branch` was clean on `feature/research-review-01`.
- Ran the required `npm ci --ignore-scripts` once. It failed before install:
  `EAI_AGAIN` resolving `registry.npmjs.org` while fetching `playwright-core-1.64.0.tgz`.
- The initial report did not run its scoped command. Its claim that npm was
  unapproved was incorrect: `pyproject.toml:11–13` explicitly declares npm/make
  runners and the npx selecting wrapper. Assignment #26 records a later
  off-box attempt failing `MODULE_NOT_FOUND` for image generation; this is
  dependency failure evidence, not a content-test assertion failure or a RED
  test created for implementation.

### Refresh verification

- Asked for a usable command as the reporting contract requires. Dependency
  brief #125 supplies the approved scoped command; the tracked declaration
  confirms npm is permitted despite the stale hint.
- Installed the provided public dependency cache with
  `npm ci --ignore-scripts --offline --cache .task-state/npm-cache`: succeeded,
  1,060 packages installed, lockfile unchanged; no network install or upgrade.
- Reran the manifest/digest and exact fence-width checks in Node. Executed
  the actual matrix module using TypeScript transpilation, confirming the
  axis signs, inverse-depth examples, x/y-only scale and `z = d` singularity;
  also checked the order-book percentage and packet/task ratio above.
- Scoped test command:
  `npm test -- test/lib/llm-content.test.ts test/lib/design-tokens.test.ts test/components/projectImageCaptions.test.tsx`.
  **GREEN: 3 test files, 28 tests passed**, exit 0. The normal prerequisites
  generated tokens, 375 image-variant files from 38 sources, and text exports.
  Only sitemap fallback dates differed in this history-stripped sandbox;
  restored that incidental change. Renderer RED/GREEN tests remain downstream.
- `pyproject.toml:1–9` declares no Python package, so Python import-origin
  checks do not apply. No alternate interpreter or suite was used.
- Build, typecheck, lint, browser previews and seven-page responsive/zoom checks
  remain downstream under brief #125. Only the allowed lane suite ran; no
  preview or visual pass is claimed.
