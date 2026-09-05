# About page and masthead hierarchy review

Scope: `/about/` and the shared masthead. Local source: `~/Development/heuristics-canon-research`, consulted 2026-09-05. This is a heuristic assessment, not a usability study or an engagement measurement.

## Decision

Remove About's card frames, shadows and category badges. Use a continuous article with descriptive headings, bounded line length, section spacing and explicit links. Preserve navigational cards in the portfolio index: those cards actually lead to separate projects. In the masthead, keep the role above a smaller, lighter practice line.

## Observations and applicable rules

| Observed condition | Canon rule | Change |
| --- | --- | --- |
| Role and practice text share one size and weight | LAY-01: establish dominant and subordinate information | Separate spans; retain role size and set practices one size/weight level lower |
| Every biography section has a border and dithered shadow | LAY-06: hierarchy through weight, size and position | Remove frames and shadows; retain meaningful heading hierarchy |
| Static biography and email action share the project-card idiom | PERC-02, INT-01: appearance should agree with meaning and action | Ordinary prose sections; visibly linked email text |
| Generic badges duplicate or weakly qualify the headings | Principle 5: rank substance before styling | Let descriptive headings carry the section purpose |
| Removing the grid creates longer lines | TYPE-01, TYPE-02, TYPE-03 | Cap prose at 68ch; 1rem body text with 1.75 leading |
| Borders previously supplied grouping | UI-03: more space between groups than within | Larger section-heading gaps than paragraph gaps |

Rule locations: `lexicons/design-aesthetics.md` (LAY, TYPE), `lexicons/interaction-ux.md` (PERC, INT), `lexicons/engineering.md` (UI), and `PRINCIPLES.md` (principles 5 and 10). Sources include *Asymmetric Typography*, *The Elements of Typographic Style Applied to the Web*, *Designing with the Mind in Mind*, *Designing Interfaces*, and *Refactoring UI*; see the corpus `SOURCES.md` for rule-specific provenance.

`reasoning/perceived-enforced-boundaries.md` (CARD-12) applies to the correspondence between perceived card affordances and actual link behavior. Its security and data-boundary branches do not apply to this biography layout.

## Requested engineering distillations

The DDIA, Latency and Release It! distillations address data correctness, measured delay, and operational failure. This change adds no data pipeline, remote operation or reliability boundary, so those rules do not justify a visual preference here. In particular, reduced visual clutter is not evidence of reduced system latency. CARD-21's hard length-cap context and CARD-30's description-scorecard context also do not apply.

## Verification and limits

Check the rendered heading order, case-study links, email action, absence of boxed biography sections, typography hierarchy, image loading, and horizontal overflow at desktop and mobile widths in both themes. The expected benefit is a clearer reading order with fewer redundant labels. Whether it improves comprehension or engagement requires observation or measurement with readers.
