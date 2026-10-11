# RESEARCH-REVIEW-01 correction slice

This slice implements F1–F5 from the actual read-only adjudication at
`/home/gate/workbay-sandbox/research-adjudication-2ce34cb/review.json`.
It is based on the history-stripped sandbox commit `f455594` on
`feature/research-review-01`. Browser acceptance remains pending the coordinator's
native rerun; these changes do not close the findings by themselves.

## F1 — scoped highlighted-code contrast

Article flow code retains a white plate in both themes and 14px normal code at
the default root size. Plain code explicitly uses `#171920`. Within article
`pre code`, built-in/symbol tokens change from `#e36209` to `#953800`. The full
installed GitHub palette inspection also found diff additions at 4.4756:1 on
`#f0fff4`; their scoped foreground changes to `#1b6b2e`.

Independent sRGB/WCAG calculations over the installed stylesheet, with the
scoped overrides applied, give the following source-palette ratios. This is
not a claim that browser-computed pairs have been measured in this sandbox.

| Token group | Foreground | Ground | Ratio |
| --- | --- | --- | --- |
| Plain code | `#171920` | white | 17.5535 |
| Keyword/type/doctag/template | `#d73a49` | white | 4.5743 |
| Title/class/function | `#6f42c1` | white | 6.5111 |
| Attribute/literal/meta/number/operator/variable/selector | `#005cc5` | white | 6.2929 |
| String/regexp | `#032f62` | white | 13.2338 |
| Built-in/symbol | `#953800` | white | 7.3851 |
| Comment/code/formula | `#6a737d` | white | 4.8151 |
| Name/quote/selector tag or pseudo | `#22863a` | white | 4.6264 |
| Substitution/emphasis/strong | `#24292e` | white | 14.6685 |
| Section | `#005cc5` | white | 6.2929 |
| Bullet | `#735c0f` | white | 6.4285 |
| Addition | `#1b6b2e` | `#f0fff4` | 6.3702 |
| Deletion | `#b31d28` | `#ffeef0` | 6.0004 |

The browser oracle walks every meaningful code text node, including plain
text and nested highlight spans, and checks each actual foreground/ancestor
ground at 4.5:1 in both themes on each configured profile. Axe remains enabled
for the entire document, including navigation, without exclusions.

Decision: Canon v0.25.6 [A11Y-01] **Contrast floors (1.4.3/1.4.11)**
(*Web Content Accessibility Guidelines 2.2*, SC 1.4.3;
*The WebAIM Million*, 2026), B. Source-palette calculations pass; rendered
pair verification is explicitly escalated to the native rerun.

## F2 — keyboard-operable horizontal code scrolling

The focusable `pre` owns horizontal scrolling. Its child `code` has visible
overflow on both axes and max-content width, preserving intrinsic long-line
extent. All authored bytes, preformatted whitespace, four-column tabs, and
the existing 68-column wide-block cutoff remain intact. Home/End move to the
horizontal beginning/end only when the region overflows; Arrow keys retain
native scrolling. Existing authored key handlers are respected.

The browser matrix covers 320px and 768px, plus 200% root text at 320px and
1440px. Overflowing code must be entered through actual Tab navigation;
ArrowRight must increase the focused `pre` offset; End must reach its full
extent and expose the rightmost rendered line endpoint; Home must expose the
final source-line endpoint. Rotation and order-book must actually overflow
at 320px, including normally short intrinsic order-book code. No test assigns
`scrollLeft` to simulate success, and zero overflow cannot satisfy the
keyboard proof. The page-overflow and literal-byte checks remain.

Decision: [A11Y-11] **Keyboard walk (2.1.1/2.1.2/2.4.3/2.4.7)**
(*Web Content Accessibility Guidelines 2.2*, SC 2.1.1), B. Actual browser
keyboard proof is escalated to the native rerun.

## F3 — physical projection and normalized demo coordinates

The article convention is eye world `z=d`, screen world `z=0`, objects at
negative world `z`. The plate's third coordinate is positive eye-relative
depth `D=d−z`, not world `z`. Its axis is now labelled **depth**. The physical
screen multiplier is `d/D`; dividing physical screen coordinates by `d`
gives the demo multiplier `1/D`. The long brace now covers the whole
eye-to-near-object segment rather than the screen-to-object gap. The equation,
caption, alternative, adjacent explanation and generated llms export agree.

Independent calculations for the specified scene (`d=1.38`, object height
`0.78`) are:

| Quantity | Near | Far |
| --- | --- | --- |
| World z | −0.92 | −2.05 |
| Eye-relative depth D | 2.30 | 3.43 |
| Original lateral coordinate | 0.56 | −0.60 |
| Physical multiplier d/D | 0.600000000000 | 0.402332361516 |
| Physical screen height | 0.468000000000 | 0.313819241983 |
| Physical screen lateral coordinate | 0.336000000000 | −0.241399416910 |
| Normalized height | 0.339130434783 | 0.227405247813 |
| Normalized lateral coordinate | 0.243478260870 | −0.174927113703 |
| SVG top point | (267.25504, 128.70928) | (224.619867, 124.254239) |
| SVG bottom point | (267.25504, 189.8488) | (224.619867, 165.251585) |
| SVG projected height | 61.13952 | 40.997346 |

The plate camera maps `(height,lateral,depth)` to
`(70+142*(0.88*depth+0.52*lateral),
250+142*(-0.92*height-0.38*depth+0.30*lateral))`.
The full near-depth brace has expected SVG delta `(287.408,−124.108)`;
the generated rounded delta is `(287.4,−124.1)`. The new scoped component
regression independently checks both near/far top and bottom dots, projected
heights, normalization, the whole-depth brace, and the physical equation.
It imports neither the generator nor the demo projection module.

Regeneration actually used Python 3.12.7 from the managed lane `.venv`, the
stdlib-only canonical generator, and only its owned projection output:

```sh
lane_root="$(git rev-parse --show-toplevel)" || exit 1
resolved_python="$lane_root/.venv/bin/python"
test -x "$resolved_python" || exit 1
"$resolved_python" - <<'PY'
import runpy
from pathlib import Path
module = runpy.run_path('scripts/generate-rotation-diagrams.py')
Path('public/images/research/rotation-f-projection.svg').write_text(module['f_projection']())
PY
```

The resulting SVG is 577×452. Its bytes were compared with a fresh canonical
function invocation. Independent stdlib SVG-coordinate assertions passed.
`sharp` rasterized the final SVG to `/tmp/research-projection-corrected.png`,
which was inspected visually: labels and both braces are visible. This is
local raster inspection, not native browser evidence.

Decision: [WRIT-71] **Unpack private knowledge** (*The Sense of Style*, ch. 3),
S. The explicit coordinate mapping and normalization explanation supply the
missing inference; the independent calculations support the geometry.

## F4 — coordinated theme rendering and honest audit timing

Radix's installed root Theme synchronizes its appearance prop through an
effect. The custom theme wrapper now derives its appearance from Radix's
effective context, and updates the body ground in a layout effect before
paint. This preserves mounted article state instead of remounting the theme
tree. Navigation sets its foreground and background from the same scoped
palette. Global link-ink and body-ground fades are removed. Navigation retains
underline-width motion, and the theme control retains its lift, while their
theme colors and control stroke switch without interpolation.

`changeTheme` samples real navigation text/background and theme-control
stroke/background pairs before clicking and on animation frames through
completion. Every text sample must meet 4.5:1; control strokes must meet 3:1.
Body, custom and Radix appearances must agree in every sampled frame.
Steady audits wait for the requested effective appearances, relevant active
color/background transitions, and two animation frames. Waiting is accompanied
by the product correction and transition sampling, not used to hide a transient
failure. Both switch directions and preference persistence across reload have
a browser regression. No contrast floor is lowered and Nav is not excluded.

Decision: [A11Y-01] **Contrast floors (1.4.3/1.4.11)**
(*Web Content Accessibility Guidelines 2.2*, SC 1.4.3;
*The WebAIM Million*, 2026), B. Both transient and settled browser measurements
are escalated to the native rerun. The original observation is not restated
as a proven persistent dark-navigation palette defect.

## F5 — object-specific layout oracle

DiagramPair has a semantic `data-diagram-pair` marker. The layout test retains
standalone-inset float assertions and separately checks paired figures using
their existing flex/wrap layout. It verifies source alternatives in authored
order, native image dimensions and aspect ratios, captions, figure containment,
and shared-row versus wrapped-row geometry from the actual frame and intrinsic
sizes. Paired children still have `float:none`; no product float change was
made to satisfy the old invalid oracle.

Decision: [LAY-24] **Content-and-frame grid** (*Thinking with Type*, ch. 3), S.
The test distinguishes content objects and their containing frame; actual
browser layout proof is escalated to the native rerun.

## Verification and remaining proof

Graph-first discovery was attempted through available tool metadata and the
codebase-memory skill. No graph tools were exposed, so direct reads were used.
The specified read-only Canon v0.25.6 manifest hash is
`ce0953e41cf3fc836cf9d8a5a8e7975173d26da8cf178480bfbd1d33bf41cb7d`;
all 53 listed file digests were verified. No reasoning card lists the four
retained IDs. The brief's older generic v0.25.3 pointer was superseded by its
explicit v0.25.6 pin. This Node repository's Python stub has `package=false`;
no unrelated package import-origin probe applies.

Commands actually executed:

- Copied the exact-lock read-only dependency donor into ignored
  `.task-state/npm-cache`; `npm ci --ignore-scripts --offline --cache .task-state/npm-cache`
  installed 1060 packages successfully.
- Managed lane Python stdlib manifest/digest checks, canonical projection
  regeneration and independent SVG calculations: passed.
- `node` stdin sRGB calculation over every installed GitHub token color group:
  first identified the failing addition pair; final corrected palette passed.
- `node` stdin `sharp` rasterization: passed; final raster viewed.
- `npm test -- test/lib/llm-content.test.ts test/lib/design-tokens.test.ts test/components/projectImageCaptions.test.tsx`:
  **39 tests passed in 3 files**, with the normal pretest `--skip-sitemap` path;
  a final rerun after all production/test edits passed the same 39 tests.
- Initial `npm run typecheck:test` and `npm run typecheck` ran before image
  generation completed and failed on the absent generated image manifest.
  Both were rerun after generation and **passed**.
- `npm run lint`: **passed, 0 errors / 6 existing warnings**; rerun after final
  production/test edits produced the same result.
- `timeout 180s npm run build -- --webpack`: **passed**, with 24 static pages
  generated. Next reported its existing multi-lockfile workspace-root warning.
  The build's synthetic sitemap dates were restored from the exact prebuild
  snapshot; the sitemap has no remaining diff.
- `node test/support/verify-research-export.ts`: **passed** for all seven
  research articles and the pilot query row/full-width image. Rotation's eight
  and order-book's three fenced blocks retain every byte and source order.
  Node emitted its module-type inference warning; exit status was zero.
- `git diff --check`: passed.
- `node` stdin Playwright `chromium.launch({headless:true})`: **blocked**.
  Installed Chromium headless shell 1248 aborted in `sandbox_host_linux.cc:41`
  with `shutdown: Operation not permitted (1)` / SIGTRAP. No browser suite was
  run and no browser QA pass is claimed.

The coordinator must run the committed browser oracles on the native host,
including all three profiles, both themes, actual keyboard scrolling, paired
layout and transition frames. Keep the existing workflow-graphics and full
document accessibility checks. Native browser proof is the remaining blocking
acceptance evidence for F1/F2/F4/F5, and native visual confirmation for F3.
