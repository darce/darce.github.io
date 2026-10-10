# PhotoShelter layout audit and shared portfolio proposal

Reviewed 2026-10-10. Target: [PhotoShelter case study](https://darce.xyz/projects/photoshelter/). Authority: **Heuristics Canon v0.25.6**, as named in the pinned release manifest; all 53 manifested files matched their hashes. Published rows came from that read-only release, with the research repository's distillations and extracted original literature checked separately.

## Recommendation

Adopt the proposed half-width image treatment as an **inset figure with an adjacent explanation**, alternating right, left, right through the gallery and article. Preserve one continuous prose column. Wrap only when both the desktop layout and the actual article container have enough space; stack figures on narrower screens and when enlarged reader text leaves insufficient space. This is a contextual application of the canon, not a numerical prescription from the books.

For PhotoShelter, the static menu image opens on the right, keyboard-navigation GIF sits on the left, and mouse-to-keyboard GIF sits on the right. Each body GIF is grouped with the paragraph explaining its behaviour. A section heading starts below the preceding figure. Captions describe the evidence, and each GIF offers **View full size** because reduced interface text is harder to inspect. Images retain their full proportions.

At 1440px, the original article was 864px wide, approximately 90 Geist Mono characters per line at 16px. The requested first body GIF occupied the entire 864px and was about 602px tall. The revised reading column is capped at **72ch** (about 691px with this font); the inset is **50% of that column**, about 346px wide and 241px tall. This is half the revised column, rather than an exact 432px half of the former column. Ordinary prose remains at 16px, with unitless leading of 1.65 rather than a fixed 28.8px.

## Findings and decisions

| Observed condition | Proposed improvement | Canon v0.25.6 basis and source |
| --- | --- | --- |
| Long desktop lines and large GIFs separate evidence from its explanation. | Cap sustained prose at 72ch; balance the shorter measure with 1.65 leading. | **TYPE-01 Measure cap**, **TYPE-02 Readability stool** — Richard Rutter, *Web Typography*, § designing-paragraphs-line-length. |
| Repeated full-width screenshots dominate the first section. | Use alternating half-width insets for these compact demonstrations; retain a wide option for complex evidence. | **LAY-38 Zone by hierarchy**, **LAY-44 Storyboard the cadence** — Timothy Samara, *Making and Breaking the Grid*, ch. 1. |
| Floating a picture without grouping its prose can let a later picture start beside the previous explanation. | Put each inset and explanation in a flow-root group. Clear genuine section boundaries; keep DOM order linear. | **LAY-37 Protect manuscript continuity** — Samara, ch. 1; **A11Y-07 Programmatic structure (1.3.1/1.3.2/2.4.6)** — WCAG 2.2, SC 1.3.1. |
| A desktop breakpoint alone does not guarantee usable wrap width. | Require a 42rem article container as well as the desktop layout. Stack below this threshold and allow reader enlargement to trigger reflow. | **TYPE-13 Em-based type response** — Rutter, § responsive-paragraphs; **LAY-42 Build outward from mobile** — Samara, ch. 1; **A11Y-08 Reflow and resize (1.4.4/1.4.10/1.4.12)** — WCAG 2.2, SC 1.4.4. |
| Captions lack a shared semantic role, and heading spacing does little to mark section transitions. | Use figure/figcaption, 0.875rem captions with 1.5 leading and full opacity, plus 48px above / 12px below subsection headings. | **PERC-09 Hierarchy for scanners** — Steve Krug, *Don't Make Me Think, Revisited*, ch. 3; **LAY-38 Zone by hierarchy** — Samara, ch. 1. |
| A minimum 450px / 35% navigation rail competes with the reading column. | Use a shared rail minimum, viewport share, and maximum; let the remaining track shrink with `minmax(0, 1fr)`. | **LAY-36 Inventory before closure**, **LAY-38 Zone by hierarchy** — Samara, ch. 1. |

The temporary prose strip beside an inset is about 33 characters wide at the minimum wrapping size. That is useful for short evidence-linked explanations, but should not become the measure for the entire essay. The 42rem threshold, bounded figure groups, and wide option are the countermeasures. Alternation supplies cadence; a complex chart, detailed interface comparison, or essential small labels can still warrant a wide figure. Cropping or blindly shrinking every image would defeat the evidence.

Rutter's original discusses the 45–75-character range as accumulated practice and qualifies it with screen studies: longer lines can be read faster while shorter lines can be preferred. His approximate 38em assumes a different average character width. For this monospaced face, 72ch expresses the intended character count directly; it is a deliberate translation rather than a literal adoption of 38em. These choices still need reader observation to establish a preference, beyond geometric and accessibility checks.

## Original literature and distilled corpus

The published rows above are in `heuristics-canon-v0.25.6/lexicons/design-aesthetics.md`, `interaction-ux.md`, and `accessibility.md`. No matching principle or reasoning card was applied after checking their rule references.

| Work | Distilled material inspected | Original text checked |
| --- | --- | --- |
| Richard Rutter, *Web Typography* (Ampersand Type, 2017) | `distilled/design/web-typography.md`, measure / responsive paragraphs / layout rhythm / functional typography. | Extracted `design/web-typography.txt`, printed pp. 21–25, the size–measure–leading relationship and qualifications on line-length research. The distillation's predecessor-repository pointer was used to locate this original. |
| Timothy Samara, *Making and Breaking the Grid*, 3rd ed. (Rockport/Quarto, 2023) | `distilled/design/samara-making-and-breaking-the-grid.md`, manuscript grid, material inventory, image proportions, responsive order, cadence. | Extracted `design/samara-making-and-breaking-the-grid.txt`, ch. 1: manuscript continuity (lines 435–449), inventory and constraints (657–678), image proportions and responsive structure (867–908). |
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
| Sustained reading width | `article.measure-characters` | 72 × 1ch |
| Insets | `article.inset.minimum-container`, `width-share`, `gutter` | 42rem / 0.5 × 100% / alias of `spacing.large` |
| Body and caption leading | `typography.body.line-height`, `typography.caption.line-height` | 1.65 / 1.5 |
| Caption size | `typography.caption.size` | 0.875rem |

The web exporter generates Sass before development, checking, testing, and building. Existing Sass spacing, breakpoint, and typography names delegate to this source, so consumers keep a stable API. Image `sizes` and browser assertions consume the same JSON. Palette and motion tokens retain their existing sources; this is a bounded migration, not a claim that every portfolio token has been converted.

The shared `ProjectDetails` renderer applies the reading cap, title and section rhythm, caption treatment, and alternating gallery figures to project and research detail pages. MDX authors can use `Figure` for explanatory prose, opt into `layout="wide"`, or override `side` when the evidence needs a specific placement. Existing diagrams, paired comparisons, and ASCII drawings retain their own structures. Text exports retain the image, caption, and explanation when the JSX wrapper is removed.

## Verification

The failing browser case reproduced the original oversized presentation before implementation. Browser checks then confirmed actual text-line geometry alongside both alternating GIFs, correct figure widths and sides, loaded evidence, and headings below their figure groups. Shared measure checks cover PhotoShelter, MSNBC, and WorkBay. The reflow matrix covers 320, 768, 1024, and 1440px with enlarged root text and user text-spacing overrides.

Validation passed before publication: `npm run check` (no errors; six existing warnings), **136 unit tests in 22 files**, a complete production export, and **48 browser checks** across mobile, tablet, and desktop. The browser suite also checks both themes, accessibility, navigation, image loading, source metadata, and intact ASCII drawings. Full-page visual inspection covered 390px mobile and 1440px desktop in light mode, 1440px dark mode, and 1920px desktop. The deployed commit is recorded with the publication receipt.
