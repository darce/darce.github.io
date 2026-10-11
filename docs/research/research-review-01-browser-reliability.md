# RESEARCH-REVIEW-01 browser harness reliability

This harness-only slice starts from history-stripped checkout `04c98e5` and
uses the immutable native evidence in
`/home/gate/workbay-sandbox/research-evidence-0e0a981` (author source `0e0a981`).
That run recorded 48 passes, 8 intentional skips, 7 unexpected results and
zero flaky results. It remains a failed run; this change does not close F1–F5.

## Causes and corrections

- The recorded article image loop polled readiness without bringing lazy
  images into view. Capture preparation subsequently added viewport visits;
  a shared helper now scrolls and decodes each image before functional image
  assertions, captures and paired geometry. Decode errors fail the case, and
  complete/nonzero intrinsic dimensions remain required.
- The rotation case combined both themes, full-document accessibility,
  token checks and screenshots in 30 seconds. Completed rotation axe calls
  in the preserved traces took roughly 3.3–6.2 seconds; the later calls were
  interrupted by the case deadline, without returned contrast violations.
  Functional cases now cover one article/theme/profile each. Separate
  capture cases retain all seven articles, both themes, all three profiles,
  full pages, first code blocks, workflow figures and the required rotation
  projection. Existing pilot layout and both-theme viewer captures remain.
- The keyboard case combined 28 article/viewport/text-size combinations.
  Each combination now has its own 30-second case, selected once in the
  desktop project by `research.config.ts`. Tab traversal starts at navigation
  once per case and continues through source-ordered code blocks, instead of
  restarting for every block. Every overflowing code example must have its
  tab stop and pass real Tab/ArrowRight/End/Home and terminal-glyph checks.
  Semantically labelled ASCII illustrations retain their existing prose
  alternative and intentionally absent code tab stops. The 200% setting is
  root-font text resize, not browser zoom.
- The paired parent rectangle was read before child image scrolling, while
  child rectangles were read afterward. All pair, child and image rectangles,
  intrinsic dimensions and row/column gaps now come from one synchronous
  `evaluate` after decoding. Standalone float checks and paired flex/wrap,
  source order, captions, intrinsic size, aspect ratio and containment remain.

Full-document axe, 4.5:1 token/text and 3:1 control contrast, transient and
settled theme agreement, literal fence bytes/order, full-width long code and
page-overflow checks remain. No timeout increase, retries, production edits
or essential-check exclusions were added.

Decisions retain Canon v0.25.6 [A11Y-01] **Contrast floors**
(*WCAG 2.2*, SC 1.4.3), [A11Y-11] **Keyboard walk** (*WCAG 2.2*, SC 2.1.1),
and [LAY-24] **Content-and-frame grid** (*Thinking with Type*, ch. 3).
Rendered verification is escalated to the coordinator's native rerun.
The pinned manifest SHA and all 53 listed file digests were verified; no
reasoning card lists those retained IDs. Graph tools were unavailable after
tool discovery, so exact source and trace reads supplied the evidence.

## Verification and remaining native QA

- Installed 1,060 exact-lock packages with
  `npm ci --offline --ignore-scripts --cache .task-state/npm-cache`, using an
  ignored copy of the read-only donor cache.
- `npm test -- test/lib/llm-content.test.ts test/lib/design-tokens.test.ts test/components/projectImageCaptions.test.tsx`:
  **39 passed in 3 files**.
- `npm run typecheck:test`: passed.
- `npm exec -- eslint test/browser/article-flow.spec.ts test/browser/editorial-layout.spec.ts test/browser/research.config.ts test/support/browser.ts`:
  passed after the final harness edit.
- Playwright `--list --reporter=json` for the three assigned browser specs:
  passed. A Node assertion over that listing verified 151 invocations,
  including 42 functional article cases, 42 capture cases and 28 explicit
  desktop-project viewport cases, with 30-second budgets and zero retries.
  An initial listing validator queried retries at the wrong JSON level;
  the corrected project-level check passed. Listing does not launch a browser.
- `node test/support/verify-research-export.ts` initially could not run because
  this checkout lacked `out/`. `npm exec -- next build --webpack` then passed
  with 24 static pages; export verification passed on rerun for all seven
  articles and the pilot query row/full-width image. The direct build used
  existing generated assets and left production sources unchanged. Existing
  workspace-root and module-type inference warnings remain.
- `git diff --check`: passed. Only the six lane-owned paths have changes.

The coordinator must run the following, then inspect the complete captures
and any failures:

```sh
npm run test:browser -- --config test/browser/research.config.ts test/browser/article-flow.spec.ts test/browser/editorial-layout.spec.ts test/browser/workflow-graphics.spec.ts --workers 2 --retries 0 --reporter=json
```

Browser launch is known to
be blocked by this sandbox's EPERM boundary; no native browser result or
product finding resolution is claimed here.
