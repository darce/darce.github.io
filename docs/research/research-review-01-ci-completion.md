# RESEARCH-REVIEW-01: narrow CI completion

Baseline: `33501cf16fa5540a35eb2139953df35df174334a`, CI `38128647206`
(233 browser passes, 6 intentional skips, 4 failures). Evidence read:
`/home/gate/workbay-sandbox/research-ci-33501cf-failure-evidence`, including
all four actual trace archives, error contexts, and the failed-job log.
The embedded test sources in all four traces exactly match the mounted
sandbox baseline (`bf612519edfdaed7d92e66e274a7255317cb5fc8`, history stripped).

## Boundaries and corrections

- **ASCII selector (finding 190):** all three profile traces select
  `figure[role="img"] >> nth=0 >> pre`. Resolved DOM snapshots show two SVG
  workflow figures (zero `pre` descendants each), followed by the one authored
  `AsciiScreen` (one `pre`). The role alone does not identify ASCII. In
  `test/browser/portfolio.spec.ts`, select image figures containing `pre`, require
  their count to equal the independently read authored `AsciiScreen` count,
  and match every authored alternative in source order. Keep the nonempty count,
  accessible-name, whitespace, ink, and contrast assertions; run them in both
  themes. A missing drawing/pre or changed alternative must still fail. Existing
  SVG workflow and literal code/glyph checks remain intact.
- **Viewer unlock observation (finding 191):** the mobile trace records Escape
  at 52618.104 ms, dialog-role count zero at 52623.697 ms, opener focus at
  52627.654 ms, then overflow `hidden` at 52630.353 ms. Resolved snapshots through
  52630.834 ms still contain the closed native `<dialog>` and locked body.
  Role count zero therefore did not establish React unmount or effect cleanup;
  native focus restoration also precedes that completion boundary. The source
  restores the captured overflow during `useEffect` cleanup. The trace ends
  before observing eventual restoration and does not establish a persistent
  product lock. In `test/browser/editorial-layout.spec.ts`, poll for the exact
  original overflow after Escape, icon Close in both themes, and Close after
  text resize. A persistent lock still fails the default assertion deadline.
  No fixed sleeps, timeout increases, skips, or test retries were added, and
  `ImageViewer.tsx` is unchanged.

## Review contract

Canon v0.25.6: all 53 manifest-listed digests verified; targeted source fallback
used because graph tools are unavailable. [DBG-02] **Facts and observation before
mechanism** (Debugging: The 9 Indispensable Rules; Modern Software Engineering,
ch. 7) supports the trace-led boundary diagnosis. Relevant accessibility
contracts remain guarded: [A11Y-01] **Contrast floors (1.4.3/1.4.11)** (Web Content
Accessibility Guidelines 2.2, SC 1.4.3; The WebAIM Million, 2026) retains measured
ASCII contrast in both themes; [A11Y-11] **Keyboard walk
(2.1.1/2.1.2/2.4.3/2.4.7)** (Web Content Accessibility Guidelines 2.2, SC 2.1.1)
retains Enter, Space, Escape, focus containment, and focus return assertions.
No new colors or interactive widget are introduced.

The source-authored count defines coverage independently of the rendered
selector. Disconfirmers for native review: any authored ASCII figure is omitted,
or overflow remains different from its original value through the polling
deadline. Either result blocks acceptance; do not weaken the assertion.

## Verification

- `npm test -- test/lib/llm-content.test.ts test/components/projectImageCaptions.test.tsx`:
  2 files / 36 tests pass.
- `npm run typecheck:test`: final run passes. The first run preceded completion
  of the unit command's image generation and reported the missing generated
  manifest; rerun after generation succeeds.
- `npx eslint test/browser/portfolio.spec.ts test/browser/editorial-layout.spec.ts components/common/ImageViewer/ImageViewer.tsx`:
  pass.
- `npx playwright test --list`: 243 cases in 4 files; no browser launched.
- `git diff --check`: pass; only the two test files and this note changed.

Native browser execution remains pending in the coordinator's environment;
the supplied brief establishes sandbox browser EPERM, so no launch or bypass
was attempted. The coordinator must rerun the four original failures and viewer
dismissal routes in both themes, then obtain the independent Sol MAX STANDARD
adjudication. This slice does not resolve findings, authorize merge/publication,
or claim the earlier native 151-case run covered `portfolio.spec.ts`.
