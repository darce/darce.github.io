# RESEARCH-REVIEW-01 factual QA

Date: 2026-10-11. This report records the non-browser checks run in the
research-verification lane and the immutable native browser evidence. It does
not adjudicate article claims or approve the page and accessibility results.

## Source binding

The native evidence at `/home/gate/workbay-sandbox/research-evidence-496b7e6`
records source commit `496b7e6fe1ffdf28d6cba9287e478817011f5144` and source tree
`d13fb17cc350b205f23055ff6567770c89d93fe0`. The history-stripped checkout used
here has synthetic `HEAD` `0deb02574146a6e7eda16eb9261fe2a1e45311df`, but
`git rev-parse HEAD^{tree}` is exactly `d13fb17cc350b205f23055ff6567770c89d93fe0`.
The browser evidence is therefore bound to the same tracked source tree.

## Native browser results

`summary.json` records the three authored specs (`article-flow.spec.ts`,
`editorial-layout.spec.ts`, `workflow-graphics.spec.ts`) across desktop, tablet,
and mobile projects: **46 passed, 8 intentionally skipped desktop-only cases,
6 failed, 0 flaky**. The command recorded in that artifact was
`npm run test:browser -- --config test/browser/research.config.ts test/browser/article-flow.spec.ts test/browser/editorial-layout.spec.ts test/browser/workflow-graphics.spec.ts --workers 2 --reporter=json`.

The six failing invocations and their reported consequences are:

- `article-flow.spec.ts` — `agent-memory retains complete evidence, source
  order and accessible diagrams in both themes`, tablet: axe reports
  `color-contrast` on `a[aria-label="home"]`, `a[aria-label="work"]`,
  `a[href$="research/"]`, and `a[aria-label="about"]` (`#202020` on
  `#2c2e34`, ratio 1.2; expected 4.5:1). The theme audit fails.
- `article-flow.spec.ts` — `order-book retains complete evidence, source order
  and accessible diagrams in both themes`, mobile: axe reports
  `scrollable-region-focusable` on `.language-json`,
  `pre[data-code-columns="71"] > .language-typescript`, and
  `pre[data-code-columns="92"] > .language-typescript`. The accessibility
  assertion fails because these scrollable regions are not focusable.
- `article-flow.spec.ts` — `rotation-matrices retains complete evidence, source
  order and accessible diagrams in both themes`, desktop and tablet: axe reports
  `color-contrast` on `.hljs-built_in` tokens in TypeScript blocks with
  `data-code-columns` 55, 71, 76, 78, 81, and 92 (`#e36209` on `#ffffff`,
  ratio 3.48; expected 4.5:1). The theme audit fails in both projects.
- The same `rotation-matrices` test, mobile: the same contrast finding is
  reported along with `scrollable-region-focusable` on eight TypeScript code
  blocks (columns 55, 71, 71, 71, 76, 78, 81, and 92). Both accessibility
  checks fail.
- `editorial-layout.spec.ts` — `work and research images share continuous inset
  or wide figure layouts`, desktop: on `/research/rotation-matrices/`, the first
  inset figure (captioned “θ measured left from +x”) was expected to have CSS
  `float: right`; computed `float` was `none`. The layout assertion fails.

These are records of test output, not a judgment on whether the page or
expectation should change. Article-flow failures stop the remaining checks for
their affected page; in particular, rotation-matrices does not reach its
per-theme screenshot calls. The evidence directory contains 12 article PNGs
for economics-of-agent-memory and
visual-search-workbench-process only; it has no page PNGs for the other scoped
articles, the screen-reference pilot, or the shared viewer. The native test
totals do not establish full browser or accessibility conformance.

## PNG inspection

Opened these immutable full-page captures with `view_image`:

- `/home/gate/workbay-sandbox/research-evidence-496b7e6/test-results/article-flow-economics-of--2809d-ble-diagrams-in-both-themes-desktop/economics-of-agent-memory-desktop-dark.png`
- `/home/gate/workbay-sandbox/research-evidence-496b7e6/test-results/article-flow-economics-of--2809d-ble-diagrams-in-both-themes-mobile/economics-of-agent-memory-mobile-dark.png`
- `/home/gate/workbay-sandbox/research-evidence-496b7e6/test-results/article-flow-visual-search-76ede-ble-diagrams-in-both-themes-tablet/visual-search-workbench-process-tablet-light.png`

The opened captures show article text and the expected embedded figures/screens;
no missing large media or obvious cut-off content was apparent at the image-fit
scale. The full-page images are reduced substantially in the viewer, so this
inspection does not establish small-label legibility or cover other pages,
viewports, or themes.

## Non-browser verification

- `npm ci --ignore-scripts --offline --cache .task-state/npm-cache` — passed;
  1,060 packages installed from the provided cache.
- `npm test -- test/lib/llm-content.test.ts test/lib/design-tokens.test.ts test/components/projectImageCaptions.test.tsx` — passed, **3 files / 38 tests**. Its pretest regenerated tokens, image variants, and text exports with `--skip-sitemap`.
- `npm run typecheck` — passed.
- `npm run typecheck:test` — passed.
- `npm run lint` — passed with **0 errors and 6 baseline warnings**, all in
  untouched files: two alt-text warnings in `components/common/ResponsiveImage/ResponsiveImage.tsx`, one React effect warning in `components/composite/Nav/Nav.tsx`, two React effect warnings in `components/features/OrderBook/useOrderBook.ts`, and one React effect warning in `contexts/ThemeContext.tsx`.
- `timeout 180s npm run build -- --webpack` — passed and exported the scoped
  research routes and pilot. Next emitted a workspace-root inference warning
  because it selected `/home/gate/package-lock.json` despite the lane lockfile.
- `node test/support/verify-research-export.ts` — passed. It confirmed the
  export for all seven articles and the pilot. Literal code/UI block counts were
  0 agent-memory, 1 visual-search-workbench-process, 0
  interrogating-agent-memory, 0 economics-of-agent-memory, 0 heuristics-canon,
  8 rotation-matrices, and 3 order-book; it also confirmed the pilot query row
  and wide evidence ordering.

The default build regenerated sitemap `lastmod` values using the fallback build
date because this checkout lacks source history. The generated sitemap was
restored byte-for-byte afterward. No package, lockfile, production, prose, or
test files were changed in this lane.

## FILES_OPENED

- `docs/research/research-review-01-implementation.md`;
  `docs/research/research-review-01-inventory.md`.
- Native evidence: `summary.json`, `browser-results.json`,
  `test-results/.last-run.json`, the editorial failure's `error-context.md`,
  and the PNGs listed above.
- `test/browser/article-flow.spec.ts`, `test/browser/editorial-layout.spec.ts`,
  `test/browser/workflow-graphics.spec.ts`, `test/browser/research.config.ts`,
  `test/support/content.ts`, `scripts/generate-image-variants.js`,
  `package.json`, and `public/sitemap.xml`.
