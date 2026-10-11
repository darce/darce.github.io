# RESEARCH-REVIEW-01 horizontal keyboard motion

Native evidence for source `0d140e8617db47efcdc681f0954e4cd609043fba`
in `/home/gate/workbay-sandbox/research-evidence-0d140e8` remains red:
all four order-book keyboard cases failed after successful Tab, ArrowRight,
End maximum-extent and longest-line terminal-glyph checks. Home ended at
38px, 39px and 38px for 320/100%, 768/100% and 1440/200%, respectively.
At 320/200%, Home briefly reached zero before the first glyph moved left
to 8px, below its required 23px bound. These percentages are root-font
text resize, not browser zoom. The prior build and export passed.

The read-only `research-keyboard-diagnostic-0d140e8/stdout.json` trajectories
show rapid ArrowRight → End → Home returning from zero to final offsets
32/32/32/6px in the four viewports. Waiting for the native arrow animation
to finish (40/40/40/8px) leaves subsequent Home at zero throughout the
samples. The separate `research-keyboard-instant-diagnostic-0d140e8/stdout.json`
substituted-handler experiment still ends at 35/36/32/6px when only Home/End
use `behavior: 'instant'`. Both experiments use programmatic focus and are
causal diagnostics, not source-ordered Tab or production validation.

`ArticleCode` now prevents default unmodified horizontal ArrowLeft/ArrowRight
scrolling and applies one immediate 40px step per keydown, clamped by the
browser to the available extent. Home and End use the same immediate scroll
API. Preventing the arrow animation at its origin makes the last horizontal
command determine the position; changing only the endpoint API was insufficient.
The existing caller handler, `defaultPrevented`, modifier and overflow guards
remain. Tab and vertical keys retain native behavior.

The existing browser helper enters each scroller through actual source-ordered
Tab input. It now checks immediate ArrowRight movement, ArrowLeft reversal,
another ArrowRight, End maximum extent and Home zero without eventual-position
polling. Longest-line terminal-glyph and first-glyph Home bounds remain exact
within the existing 1px geometry tolerance. The prior final-source-glyph
correction remains: measure Home, then End if needed, then at most 100 real
arrow presses toward the glyph. Each command is measured without the former
100ms key duration. Exhaustion still fails both final-glyph bounds; focus must
remain on the pre, and a final Home must immediately restore zero. Tests never
assign scroll offsets or move a glyph with `scrollIntoView`.

The single accessible pre, literal source bytes/order, illustration exception,
68-column classification, unwrapped/untruncated code and font sizes remain
intact. Article/MDX/CSS/theme/viewer/export files are untouched. Existing
sole-scroller, page-overflow, both-theme 4.5:1 contrast, seven-article capture
and three-profile coverage remain in the same suite.

Canon v0.25.6: all 53 release-manifest file digests match. [A11Y-11]
**Keyboard walk (2.1.1/2.1.2/2.4.3/2.4.7)** (Web Content Accessibility
Guidelines 2.2, SC 2.1.1; `lexicons/accessibility.md#a11y-11`) supports keeping
real keyboard entry and traversal. No reasoning card lists this ID.
[A11Y-01] **Contrast floors (1.4.3/1.4.11)** (Web Content Accessibility
Guidelines 2.2, SC 1.4.3 + The WebAIM Million, 2026) has no new color-change
trigger; the existing contrast audits remain. Graph tools were unavailable,
so discovery used exact source and evidence files.

Lane checks on 2026-10-11:

- `npm test -- test/lib/llm-content.test.ts test/lib/design-tokens.test.ts test/components/projectImageCaptions.test.tsx`: 39 tests passed across 3 files, including normal pretest generation.
- `npm run typecheck:test`: passed after pretest generated the image manifest; the earlier invocation failed on that missing generated file.
- `npx --no-install eslint components/features/ProjectDetails/ArticleCode.tsx test/browser/article-flow.spec.ts`: passed.
- `npm run test:browser -- --config test/browser/research.config.ts test/browser/article-flow.spec.ts test/browser/editorial-layout.spec.ts test/browser/workflow-graphics.spec.ts --list`: 151 cases in 3 files, including all four order-book cases; listing only.
- `git diff --check`: passed.

The prompt's unvalidated runner notice was raised for clarification; the current
`pyproject.toml` already declares `npm` in `runner_commands`, satisfying its
specified remedy without any settings edit. Dependencies came from an own,
ignored `.npm` copy of the supplied read-only donor via
`npm ci --offline --ignore-scripts --cache .npm`. This is a package-less Node
lane, so Python package import-origin checks do not apply.

Native validation of this production handler and final independent adjudication
remain coordinator work. No browser launch was attempted in the established
EPERM sandbox; the historical native failures and diagnostic evidence are
unchanged. This slice does not claim a new native pass.
