# Research Review 01 QA corrections: factual evidence record

This is a factual QA record and capture-preparation change. It does not adjudicate or close findings F1–F5. The immutable native browser gate remains red.

## Source and run binding

The immutable evidence at `/home/gate/workbay-sandbox/research-evidence-0e0a981` records the original author source commit `0e0a981f74adf940ff62155dccbb4a5e1d3385b7` and source tree `885bd66a58976ed342a88bc6642ecd106d2bd220`. Its history-stripped native checkout head is `04ed8addeb18e467bf7ad236c330ad28c069e25c`. This lane's history-stripped base commit is `cf84c20e5aeaa01bc73f56e45f73c199bff3e77f`, with the same base tree `885bd66a58976ed342a88bc6642ecd106d2bd220`. The author commit, native checkout head, and lane base commit are distinct identities; the tree hash is the source-content binding.

The prior immutable run at `/home/gate/workbay-sandbox/research-evidence-496b7e6` records author commit `496b7e6fe1ffdf28d6cba9287e478817011f5144` and tree `d13fb17cc350b205f23055ff6567770c89d93fe0`.

For the newer evidence, `summary.json` records `npm run build -- --webpack` exit 0 in 40.468 s, `node test/support/verify-research-export.ts` exit 0 in 2.480 s, and this native browser command exit 1 in 305.451 s:

```sh
npm run test:browser -- --config test/browser/research.config.ts test/browser/article-flow.spec.ts test/browser/editorial-layout.spec.ts test/browser/workflow-graphics.spec.ts --workers 2 --retries 0 --reporter=json
```

The reporter JSON in `browser-stdout.log` contains 63 invocations across `mobile`, `tablet`, and `desktop`: **48 passed, 8 skipped, 7 unexpected (4 timed out and 3 failed), 0 flaky**. Reporter duration is 303,986 ms. The summary's browser exit code is 1. The older immutable reporter records 46 passed, 8 skipped, 6 unexpected, and 0 flaky.

## Seven unexpected results in the newer native run

All paths below are within `/home/gate/workbay-sandbox/research-evidence-0e0a981/test-results`. Each result has an `error-context.md` and `trace.zip` in its listed result directory. The named test source location is the declaration; the assertion or awaited operation column identifies the recorded failure site.

| Profile and test | Recorded site and values | Actual reporter error |
| --- | --- | --- |
| `mobile` — `rotation-matrices retains complete evidence, source order and accessible diagrams in both themes` | `test/browser/article-flow.spec.ts:224:47`, called from line 224 in the image loop; test declaration line 179. The poll condition was `image.complete && image.naturalWidth > 0` and required `true`. No boolean result was recorded. | Test timeout at 30,000 ms; the final locator error says the target page/context/browser was closed while evaluating the image. Artifacts: `article-flow-rotation-matr-42202-ble-diagrams-in-both-themes-mobile/{error-context.md,trace.zip}`. |
| `tablet` — same rotation-matrices article test | `test/support/browser.ts:13:44` inside `auditBrowser`, called at `test/browser/article-flow.spec.ts:192`; test declaration line 179. The pending operation was `axe.run(document, ...)`; no axe result or violation values were returned. | Test timeout at 30,000 ms while awaiting `page.evaluate`. Artifacts: `article-flow-rotation-matr-42202-ble-diagrams-in-both-themes-tablet/{error-context.md,trace.zip}`. |
| `desktop` — same rotation-matrices article test | `test/support/browser.ts:13:44` inside `auditBrowser`, called at `test/browser/article-flow.spec.ts:192`; test declaration line 179. The pending operation was `axe.run(document, ...)`; no axe result or violation values were returned. | Test timeout at 30,000 ms while awaiting `page.evaluate`. Artifacts: `article-flow-rotation-matr-42202-ble-diagrams-in-both-themes-desktop/{error-context.md,trace.zip}`. |
| `desktop` — `seven research articles contain overflow at mobile and 200% text sizes` | `test/browser/article-flow.spec.ts:246:51` in `keyboardScrollToLineEnd`, called from line 317; test declaration line 301. The target resolved as visible `pre.nth(4)` with `data-code-columns="55"` and `data-code-layout="intrinsic"`; the operation waiting for an active-element boolean did not return one. | Test timeout at 30,000 ms during `locator.evaluate`. No later ArrowRight, End, or Home result was recorded for this target. The error-context DOM snapshot is the “3D Without Canvas or WebGL” article. Artifacts: `article-flow-seven-researc-9f792-t-mobile-and-200-text-sizes-desktop/{error-context.md,trace.zip}`. |
| `mobile` — `work and research images share continuous inset or wide figure layouts` | `test/browser/editorial-layout.spec.ts:80:31`. The check required child `box.y >= pairBox.y - 1`; expected `>= 2344.40625`, received `186.40625`. | `toBeGreaterThanOrEqual` failed. Artifacts: `editorial-layout-work-and--a887c-nset-or-wide-figure-layouts-mobile/{error-context.md,trace.zip}`. |
| `tablet` — same editorial-layout test | `test/browser/editorial-layout.spec.ts:80:31`. The check required child `box.y >= pairBox.y - 1`; expected `>= 1590.671875`, received `185.671875`. | `toBeGreaterThanOrEqual` failed. Artifacts: `editorial-layout-work-and--a887c-nset-or-wide-figure-layouts-tablet/{error-context.md,trace.zip}`. |
| `desktop` — same editorial-layout test | `test/browser/editorial-layout.spec.ts:80:31`. The check required child `box.y >= pairBox.y - 1`; expected `>= 1791.3125`, received `186.3125`. | `toBeGreaterThanOrEqual` failed. Artifacts: `editorial-layout-work-and--a887c-nset-or-wide-figure-layouts-desktop/{error-context.md,trace.zip}`. |

The timeout rows record where the browser run stopped; they do not establish why the operation did not finish. The three geometry rows record the test's comparison and returned values; they do not by themselves identify a product cause.

## Earlier observations and later check status

The original run's reporter and error contexts contain these observations:

- **F1 / contrast:** The rotation-matrices code audit reported `#e36209` on `#ffffff` at **3.48:1** against the **4.5:1** expected floor for 27 `.hljs-built_in` tokens per rotation profile in mobile, tablet, and desktop (the original Max report's count). The tablet `agent-memory` audit reported four primary-navigation text nodes (`home`, `work`, `research`, `about`) at **1.2:1**, foreground `#202020`, background `#2c2e34`, with 4.5:1 expected.
- **F2 / keyboard scrolling:** The original mobile `order-book` audit reported `scrollable-region-focusable` on `.language-json` and two TypeScript code regions: “Element should have focusable content” and “Element should be focusable”. That audit failed before later article checks in that invocation.
- **F4 / theme observations:** The `agent-memory` 1.2:1 navigation readings above are the original settled audit's recorded values. In the newer reporter, the existing “theme switching preserves the preference and article across both directions and reload” case passed in all three profiles. That case calls the transient frame sampler and settled theme wait; its JSON result contains no sampled frame count or per-frame ratios. The rotation article produced light PNGs for all three profiles; the desktop and tablet cases later timed out in `auditBrowser`, while mobile timed out in the subsequent image-readiness loop. No full dark rotation PNG was produced in those three result directories.
- **F5 / standalone versus paired layout:** The original desktop editorial test expected the first inset figure's CSS float to be `right` and received `none` at `test/browser/editorial-layout.spec.ts:45`; the original Max report identifies that rotation figure as a `DiagramPair` child, not a standalone inset. The newer test excludes figures inside `[data-diagram-pair]` from that standalone loop and checks pairs separately; its three current failures are the child/pair `y` comparisons listed above. The reporter does not adjudicate whether those values indicate a test or product defect.
- **F3 / projection visuals:** The inspected newer full-page rotation captures show the article and its diagrams at full-page scale. The evidence does not include a dedicated element capture of the revised `rotation-f-projection.svg`. Full-page viewing is not sufficient to assess SVG clipping or small-label legibility.

In the newer JSON, no unexpected result is a `color-contrast` violation. The complete `agent-memory` article case passed for all three profiles. The rotation mobile case progressed beyond its audit and code-contrast steps before the image-readiness timeout; desktop and tablet completed their light-theme screenshot path but did not return a dark-theme axe result. This records the executed steps, not an all-article/all-theme contrast clearance.

The original five findings remain open for the orchestrator's review. This QA report neither resolves nor reclassifies them.

## Native PNG and trace inspection

I viewed all 15 PNGs present in the newer immutable evidence tree:

- `/home/gate/workbay-sandbox/research-evidence-0e0a981/test-results/article-flow-visual-search-76ede-ble-diagrams-in-both-themes-mobile/visual-search-workbench-process-mobile-light.png`
- `/home/gate/workbay-sandbox/research-evidence-0e0a981/test-results/article-flow-visual-search-76ede-ble-diagrams-in-both-themes-mobile/visual-search-workbench-process-mobile-dark.png`
- `/home/gate/workbay-sandbox/research-evidence-0e0a981/test-results/article-flow-visual-search-76ede-ble-diagrams-in-both-themes-tablet/visual-search-workbench-process-tablet-light.png`
- `/home/gate/workbay-sandbox/research-evidence-0e0a981/test-results/article-flow-visual-search-76ede-ble-diagrams-in-both-themes-tablet/visual-search-workbench-process-tablet-dark.png`
- `/home/gate/workbay-sandbox/research-evidence-0e0a981/test-results/article-flow-visual-search-76ede-ble-diagrams-in-both-themes-desktop/visual-search-workbench-process-desktop-light.png`
- `/home/gate/workbay-sandbox/research-evidence-0e0a981/test-results/article-flow-visual-search-76ede-ble-diagrams-in-both-themes-desktop/visual-search-workbench-process-desktop-dark.png`
- `/home/gate/workbay-sandbox/research-evidence-0e0a981/test-results/article-flow-economics-of--2809d-ble-diagrams-in-both-themes-mobile/economics-of-agent-memory-mobile-light.png`
- `/home/gate/workbay-sandbox/research-evidence-0e0a981/test-results/article-flow-economics-of--2809d-ble-diagrams-in-both-themes-mobile/economics-of-agent-memory-mobile-dark.png`
- `/home/gate/workbay-sandbox/research-evidence-0e0a981/test-results/article-flow-economics-of--2809d-ble-diagrams-in-both-themes-tablet/economics-of-agent-memory-tablet-light.png`
- `/home/gate/workbay-sandbox/research-evidence-0e0a981/test-results/article-flow-economics-of--2809d-ble-diagrams-in-both-themes-tablet/economics-of-agent-memory-tablet-dark.png`
- `/home/gate/workbay-sandbox/research-evidence-0e0a981/test-results/article-flow-economics-of--2809d-ble-diagrams-in-both-themes-desktop/economics-of-agent-memory-desktop-light.png`
- `/home/gate/workbay-sandbox/research-evidence-0e0a981/test-results/article-flow-economics-of--2809d-ble-diagrams-in-both-themes-desktop/economics-of-agent-memory-desktop-dark.png`
- `/home/gate/workbay-sandbox/research-evidence-0e0a981/test-results/article-flow-rotation-matr-42202-ble-diagrams-in-both-themes-mobile/rotation-matrices-mobile-light.png`
- `/home/gate/workbay-sandbox/research-evidence-0e0a981/test-results/article-flow-rotation-matr-42202-ble-diagrams-in-both-themes-tablet/rotation-matrices-tablet-light.png`
- `/home/gate/workbay-sandbox/research-evidence-0e0a981/test-results/article-flow-rotation-matr-42202-ble-diagrams-in-both-themes-desktop/rotation-matrices-desktop-light.png`

I also viewed the last embedded screencast JPEG in each of the seven failure traces, extracted for inspection as `/tmp/qa-rotation-mobile-last.jpeg`, `/tmp/qa-rotation-tablet-last.jpeg`, `/tmp/qa-rotation-desktop-last.jpeg`, `/tmp/qa-keyboard-last.jpeg`, `/tmp/qa-layout-last.jpeg`, `/tmp/qa-layout-tablet-last.jpeg`, and `/tmp/qa-layout-desktop-last.jpeg`. These are viewport frames around the recorded failure states, not new test results. The full-page PNGs are very tall and were rendered at reduced fit-to-view size (the desktop visual-search PNG is 1408 × 7036); code and SVG labels are too small at that display scale for a legibility conclusion.

The newer immutable run contains no captures for four article slugs (`agent-memory`, `interrogating-agent-memory`, `heuristics-canon`, and `order-book`), no dark rotation captures, no pilot/viewer dialog captures, and no dedicated readable code or projection element captures.

## Capture preparation in this lane

Only the existing capture/attachment flow in `test/browser/article-flow.spec.ts` was extended. Before the unchanged per-theme checks, it now waits for body, custom, and Radix theme attributes to agree, waits for color/background transitions and two animation frames, decodes article images after scrolling them into view, then restores the page to the top. The existing article loop writes full-page `flow` captures for all seven `researchSlugs`, both themes, and each configured `mobile`, `tablet`, and `desktop` profile. It also writes a first-code-block viewport capture when a code block exists, each workflow-figure element, and the rotation projection image when present. The existing screen-reference test now captures the open image viewer in both themes for each profile after decoding its image.

These are capture instructions for a future native browser run, not new native evidence. No article, style, component, assertion, threshold, keyboard sequence, source-order check, or overflow check was changed. The existing 200% test is a root-font-size/style resize at its configured viewport; it is not browser zoom.

## Lane verification and remaining proof

- `npm ci --ignore-scripts --offline --cache .task-state/npm-cache`: completed from the copied exact-lock donor cache; 1,060 packages installed. The donor cache was not modified.
- `npm test -- test/lib/llm-content.test.ts test/lib/design-tokens.test.ts test/components/projectImageCaptions.test.tsx`: **39 tests passed in 3 files**.
- `npm run typecheck:test`: passed (exit 0).
- `git diff --check`: recorded after the final report edit.

The native browser command above was read from immutable evidence and was not rerun in this sandbox. The new screenshot code has therefore not produced native captures yet. Native rerun and inspection of the resulting full seven-article/theme/profile matrix, viewer captures, code/projection element captures, accessibility checks, keyboard scrolling, pair geometry, and F3 SVG labels remain unverified. No browser pass or publication claim is made.
