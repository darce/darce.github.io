# RESEARCH-REVIEW-01 keyboard oracle correction

The serial native evidence for source HEAD `2002d3841525b99cf3bd57398ae5840f4d8b422b`
in `/home/gate/workbay-sandbox/research-targeted-2002d38` reproduces four
order-book failures at the old `article-flow.spec.ts:337`. Each assertion
incorrectly requires the final source character to fit after Home:

| Viewport / root-font size | Required right edge ≤ | Actual right edge |
| --- | ---: | ---: |
| 320px / 100% | 297 | 634.53125 |
| 768px / 100% | 745 | 811.46875 |
| 320px / 200% | 297 | 1232.953125 |
| 1440px / 200% | 1393 | 1773.953125 |

The serial runs reach the preceding Tab, native ArrowRight, End maximum-extent,
longest rendered line terminal-glyph, and Home-offset-zero checks. The source
contains long final lines; Home exposes their beginning. The 200% cases resize
the root font; they do not exercise browser zoom.

`keyboardScrollToLineEnd` now measures the first non-whitespace source glyph at
Home. It measures the final non-whitespace source glyph at Home, then End if
necessary. If neither position exposes that glyph, at most 100 real arrow
presses, each with a 100ms key duration, move toward its measured bounds. The
final character must satisfy both viewport edges within the existing 1px
tolerance, and the scroller must retain focus. Exhausting the traversal fails
the geometry assertions. A final Home restores offset zero.

Real source-ordered Tab entry, native ArrowRight movement, End maximum extent,
and the longest rendered line's terminal-glyph proof remain mandatory. There
are no added skips, retries, timeout changes, test scroll-offset assignments,
or glyph `scrollIntoView` calls. The existing scroller viewport visit remains.
Production code, MDX, layout, literal fenced bytes/order, single-scroller
checks, theme/contrast audits, document-overflow checks, wide-code
classification, and the existing ASCII illustration exception are unchanged.

The read-only canon v0.25.6 accessibility lexicon matches its release-manifest
SHA-256. [A11Y-11] **Keyboard walk**
([WCAG 2.2 SC 2.1.1](https://www.w3.org/TR/WCAG22/#keyboard), canon
`lexicons/accessibility.md#a11y-11`) informs retaining real keyboard proof;
native verification of the corrected oracle is pending. [A11Y-01]
**Contrast floors** (same canon lexicon, `#a11y-01`) has no new color-change
trigger in this slice; existing 4.5:1 code/theme audits remain intact. Graph
tools were unavailable, so discovery used exact source/evidence reads.

Executed in this lane on 2026-10-11:

- `npm test -- test/lib/llm-content.test.ts test/lib/design-tokens.test.ts test/components/projectImageCaptions.test.tsx` — 39 tests passed in 3 files;
  its normal pretest generated tokens, image variants, and LLM content.
- `npm run typecheck:test` — passed.
- `npx --no-install eslint test/browser/article-flow.spec.ts` — passed.
- `npm run test:browser -- --config test/browser/research.config.ts test/browser/article-flow.spec.ts test/browser/editorial-layout.spec.ts test/browser/workflow-graphics.spec.ts --list`
  — 151 cases in 3 files, including all four order-book viewport cases;
  listing only, not a native pass.
- `git diff --check` — passed.

Dependencies were installed with `npm ci --offline --ignore-scripts --cache .npm`
using this lane's ignored copy of the supplied read-only donor cache. Native
browser execution is reserved for the coordinator because the browser sandbox
failure is already established; no browser launch was attempted here.

Historical evidence remains red: the complete native run in
`/home/gate/workbay-sandbox/research-evidence-2002d38-v2` has 151 cases,
136 passes, 6 skips, and 9 unexpected failures, with all 42 capture cases
passing and 84 PNGs. Its five deadline failures pass in the serial rerun; the
four oracle failures above persist there. This correction does not claim a
new native pass, erase that evidence, or replace the coordinator's independent
final review.
