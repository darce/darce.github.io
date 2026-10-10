# PhotoShelter layout audit and shared portfolio proposal

Reviewed 2026-10-10. Target: [PhotoShelter case study](https://darce.xyz/projects/photoshelter/). Authority: **Heuristics Canon v0.25.6**, as named in the pinned release manifest; all 53 manifested files matched their hashes. Published rows came from that read-only release, with the research repository's distillations and extracted original literature checked separately.

**Correction following owner review:** the first implementation incorrectly capped the whole article at 72ch. At a 1920px viewport, that reduced a 1464px content canvas to about 691px and left about 773px unused on the right. TYPE-01 concerns prose line length; it does not justify constraining every image, diagram, and table to that measure. The original column-wide recommendation is withdrawn. Passing tests established the implemented geometry, not the suitability of that design decision. The proposal is reproduced in the user-facing conversation; printing the file in a tool output did not make it visibly available there.

## Recommendation

Keep the article at the **full available content width**. Adopt the proposed half-width image treatment as an **inset figure with an adjacent explanation**, alternating right, left, right through the gallery and article. Limit standalone prose paragraphs to a readable measure, while media, diagrams, tables, and figure groups retain the full canvas. Wrap only when both the desktop layout and the actual article container have enough space; stack figures on narrower screens and when enlarged reader text leaves insufficient space. This is a contextual application of the canon, not a numerical prescription from the books.

For PhotoShelter, the static menu image opens on the right, keyboard-navigation GIF sits on the left, and mouse-to-keyboard GIF sits on the right. Each body GIF is grouped with the paragraph explaining its behaviour. A section heading starts below the preceding figure. Captions describe the evidence, and each GIF offers **View full size** because reduced interface text is harder to inspect. Images retain their full proportions.

At 1440px, the original article was 864px wide, approximately 90 Geist Mono characters per line at 16px. The requested first body GIF occupied the entire 864px and was about 602px tall. With the token-based navigation rail, the corrected article canvas is **984px**, and each inset is **492px**, half that full canvas. At 1920px, the canvas is **1464px**, with **732px** insets. The **72ch** limit (about 691px with this font) applies to standalone prose and summary paragraphs, not to the article container. Paragraphs inside figure groups use the available wrapping space: about 49 characters beside an inset at 1440px and 74 at 1920px. Ordinary prose remains at 16px, with unitless leading of 1.65 rather than a fixed 28.8px.

## Findings and decisions

| Observed condition | Proposed improvement | Canon v0.25.6 basis and source |
| --- | --- | --- |
| Long desktop lines and large GIFs separate evidence from its explanation. | Cap standalone prose paragraphs at 72ch; balance the shorter measure with 1.65 leading. Keep the article canvas full width. | **TYPE-01 Measure cap**, **TYPE-02 Readability stool** — Richard Rutter, *Web Typography*, § designing-paragraphs-line-length. |
| A prose measure was incorrectly applied to the entire media and article container. | Separate the reading measure from the full canvas; let supporting figures and complex evidence use the space their roles need. | **LAY-38 Zone by hierarchy** — Timothy Samara, *Making and Breaking the Grid*, ch. 1. |
| Repeated full-width screenshots dominate the first section. | Use alternating half-width insets for these compact demonstrations; retain a wide option for complex evidence. | **LAY-38 Zone by hierarchy**, **LAY-44 Storyboard the cadence** — Timothy Samara, *Making and Breaking the Grid*, ch. 1. |
| Floating a picture without grouping its prose can let a later picture start beside the previous explanation. | Put each inset and explanation in a flow-root group. Clear genuine section boundaries; keep DOM order linear. | **LAY-37 Protect manuscript continuity** — Samara, ch. 1; **A11Y-07 Programmatic structure (1.3.1/1.3.2/2.4.6)** — WCAG 2.2, SC 1.3.1. |
| A desktop breakpoint alone does not guarantee usable wrap width. | Require a 42rem article container as well as the desktop layout. Stack below this threshold and allow reader enlargement to trigger reflow. | **TYPE-13 Em-based type response** — Rutter, § responsive-paragraphs; **LAY-42 Build outward from mobile** — Samara, ch. 1; **A11Y-08 Reflow and resize (1.4.4/1.4.10/1.4.12)** — WCAG 2.2, SC 1.4.4. |
| Captions lack a shared semantic role, and heading spacing does little to mark section transitions. | Use figure/figcaption, 0.875rem captions with 1.5 leading and full opacity, plus 48px above / 12px below subsection headings. | **PERC-09 Hierarchy for scanners** — Steve Krug, *Don't Make Me Think, Revisited*, ch. 3; **LAY-38 Zone by hierarchy** — Samara, ch. 1. |
| A minimum 450px / 35% navigation rail competes with the reading column. | Use a shared rail minimum, viewport share, and maximum; let the remaining track shrink with `minmax(0, 1fr)`. | **LAY-36 Inventory before closure**, **LAY-38 Zone by hierarchy** — Samara, ch. 1. |

The temporary prose strip beside an inset is about 33 characters wide at the minimum wrapping size. That is useful for short evidence-linked explanations, but should not become the measure for the entire essay. The 42rem threshold, bounded figure groups, and wide option are the countermeasures. Alternation supplies cadence; a complex chart, detailed interface comparison, or essential small labels can still warrant a wide figure. Cropping or blindly shrinking every image would defeat the evidence.

Rutter's original discusses the 45–75-character range as accumulated practice and qualifies it with screen studies: longer lines can be read faster while shorter lines can be preferred. Printed p. 25 demonstrates a maximum width on the paragraph itself. His approximate 38em assumes a different average character width. For this monospaced face, 72ch expresses the intended character count directly; it is a deliberate translation rather than a literal adoption of 38em. Neither this source nor the retained layout rules mandate a universal figure ratio or a smaller article canvas. These choices still need reader observation to establish a preference, beyond geometric and accessibility checks. On exceptionally wide displays, the prose beside a half-width figure can exceed the usual reading range; that remains a contextual tradeoff of retaining the full canvas and the requested half-width relationship.

## Original literature and distilled corpus

The published rows above are in `heuristics-canon-v0.25.6/lexicons/design-aesthetics.md`, `interaction-ux.md`, and `accessibility.md`. No matching principle or reasoning card was applied after checking their rule references.

| Work | Distilled material inspected | Original text checked |
| --- | --- | --- |
| Richard Rutter, *Web Typography* (Ampersand Type, 2017) | `distilled/design/web-typography.md`, measure / responsive paragraphs / layout rhythm / functional typography. | Extracted `design/web-typography.txt`, printed pp. 21–25, the size–measure–leading relationship, qualifications on line-length research, and paragraph-scoped maximum width. The distillation's predecessor-repository pointer was used to locate this original. |
| Timothy Samara, *Making and Breaking the Grid*, 3rd ed. (Rockport/Quarto, 2023) | `distilled/design/samara-making-and-breaking-the-grid.md`, manuscript grid, material inventory, image proportions, responsive order, cadence. | Extracted `design/samara-making-and-breaking-the-grid.txt`, ch. 1: manuscript continuity (lines 435–449), inventory and constraints (657–678), functional distinctions and shared column increments (699–770), image proportions and responsive structure (867–908). |
| Steve Krug, *Don't Make Me Think, Revisited*, 3rd ed. (New Riders, 2014) | `distilled/interaction/dont-make-me-think-krug.md`, ch. 3. | Extracted `interaction/dont-make-me-think-krug.txt`, ch. 3, visual hierarchy and distinct page areas (lines 803–852). |

Responsive checks follow the mechanisms in W3C's guidance on [reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [text spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html), and [resizing text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html). These checks are evidence for the changed presentation, not a claim of a complete WCAG audit.

## Semantic prior art

The repository handoff store contained no concept embeddings. Rather than treating that empty store as proof that no prior art existed, a read-only local retrieval pass used the already pinned **gte-base-en-v1.5 int8 ONNX** model and tokenizer. It embedded **1,008 passages from 41 documents**: repository reviews and design assessments, the design distillations, and Krug's interaction distillation. Two queries covered image wrapping / alternation / inspection and prose measure / leading / captions / rhythm. Scores below are cosine similarity, not evidence-strength ratings.

| Retrieved passage | Cosine | Use after reading the passage |
| --- | --- | --- |
| Samara distillation, “Fit responsive structure to screen and content order,” line 256 | 0.5539 | Carry image order through the single-column layout and preserve responsive alignments. |
| Samara distillation, “Derive dimensions from imagery,” line 200 | 0.4920 | Preserve complete image proportions and support useful placement sizes rather than cropping into a universal box. |
| Rutter distillation, “Measure (start here),” line 102 | 0.6652 | Cap sustained reading length and retain the original's qualifications on the numeric range. |
| Rutter distillation, “Functional (UI chrome, captions, microcopy),” line 370 | 0.5794 | Make caption hierarchy legible without fading essential evidence. |
| Repository [navigation and card assessment](../../agentic/assessment/navigation-rework.md), “Both sites share,” line 69 | 0.5874 | Preserve the portfolio's hard edges and use spacing and type weight to organize the content. Its OKPalette/Heerich observations are existing internal prior art, not a new external site audit. |

The highest image-query hit was a draft candidate-row section (0.5578). It served as a discovery pointer; published v0.25.6 rows and checked originals supplied the actual authority. Other retrieved works were not adopted solely because of ranking.

## Shared design tokens and propagation

The source is [`design-tokens/portfolio.tokens.json`](../../design-tokens/portfolio.tokens.json), using the [DTCG Format Module 2025.10](https://www.designtokens.org/tr/2025.10/format/). Dimensions use the permitted `px`/`rem` object representation. Ratios, character counts, and unitless leading are number tokens. Group type inheritance and a gutter alias preserve the relationship to shared spacing.

| Design decision | Token | Value / web interpretation |
| --- | --- | --- |
| Navigation rail | `layout.rail.minimum`, `viewport-share`, `maximum` | 18rem / 0.28 × 100vw / 24rem inside `clamp()` |
| Standalone prose width | `article.measure-characters` | 72 × 1ch; article canvas remains unconstrained by this token |
| Insets | `article.inset.minimum-container`, `width-share`, `gutter` | 42rem / 0.5 × full canvas width / alias of `spacing.large` |
| Body and caption leading | `typography.body.line-height`, `typography.caption.line-height` | 1.65 / 1.5 |
| Caption size | `typography.caption.size` | 0.875rem |

The web exporter generates Sass before development, checking, testing, and building. Existing Sass spacing, breakpoint, and typography names delegate to this source, so consumers keep a stable API. Browser assertions consume the same JSON. Image `sizes="auto, 100vw"` follows the actual rendered size where supported, with a conservative viewport fallback rather than one derived from prose length. Palette and motion tokens retain their existing sources; this is a bounded migration, not a claim that every portfolio token has been converted.

The shared `ProjectDetails` renderer applies the paragraph reading cap, full article canvas, title and section rhythm, caption treatment, and alternating gallery figures to project and research detail pages. MDX authors can use `Figure` for explanatory prose, opt into `layout="wide"` for the full canvas, or override `side` when the evidence needs a specific placement. Existing diagrams, paired comparisons, and ASCII drawings retain their own structures. Text exports retain the image, caption, and explanation when the JSX wrapper is removed.

## Verification

The correction's failing browser case reproduced the published width regression: **691.1875px actual versus 1464px available** at a 1920px viewport. Revised shared checks require the article to fill its available canvas, keep standalone paragraphs within the reading range, and place the right-side inset at the actual canvas edge. They cover PhotoShelter, MSNBC, and WorkBay. Existing checks retain actual text-line geometry alongside both alternating GIFs, correct figure widths and sides, loaded evidence, and headings below their figure groups. The reflow matrix covers 320, 768, 1024, 1440, and 1920px with enlarged root text and user text-spacing overrides.

The first publication passed `npm run check`, 136 unit tests, and 48 browser checks, but its shared measure test asserted a narrow article container. Those results did not validate the mistaken canvas reduction. The correction passes `npm run check` (no errors; six existing warnings), **136 unit tests in 22 files**, the complete production export, and **48 browser checks**, including both themes, accessibility, navigation, image loading, source metadata, and intact ASCII drawings. Visual review covered 390px mobile, 1440px desktop in both themes, and 1920px desktop. Measured canvases and insets are 984px / 492px at 1440px, 1464px / 732px at 1920px, and 342px / 342px stacked at 390px. The deployed commit is recorded with the correction's publication receipt.
