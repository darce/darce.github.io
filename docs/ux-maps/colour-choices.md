# Colour choices for remote validation

Validate these hex + role assignments against heuristics-canon (stable IDs, latest, no version pin) and the distilled/ corpus in `/Users/daniel/Development/heuristics-canon-research/distilled/design/`. Do **not** implement. Do **not** change fonts.

Cite [heuristics canon](https://github.com/darce/heuristics-canon) by rule ID at use time.

## Constraint

darce.xyz (Next.js portfolio). Apply ADLC (https://www.agenticlifecycle.ai/) **field + hierarchy**, keep darce **fonts** and **orange/royal-blue highlights**.

UX inventory: `docs/ux-maps/darce-xyz.uxmap.json`.

## Proposed mapping

| Role | Light | Dark | Source |
| --- | --- | --- | --- |
| canvas | `#e7eaef` rec-paper | `#1c1d21` terminal | ADLC |
| surface | `#f2f4f7` rec-paper-raised | `#2c2e34` | ADLC |
| masthead | `#dde1e8` rec-paper-sunk | `#1c1d21` | ADLC; **not** terminal on light (large-area COL-12) |
| text / header | `#171920` rec-ink | `#cbcdd2` | ADLC |
| inactive | `#dde1e8` | `#2f3137` | ADLC |
| link | `#3c00f7` electric ultramarine | `#6ab5db` sky | **keep darce** |
| border / hover | `#d9253f` coral | `#d9253f` | **keep darce** |

Not imported: ADLC `--rec-link #17627f`, `--rec-pass*`, `--rec-fail*`, `--rec-gate*`, `#78bd65`, `#e5cd52`.

## Measured contrast

| Pair | Ratio | Floor |
| --- | --- | --- |
| #171920 on #e7eaef | 14.56 | AA text |
| #3c00f7 on #e7eaef | 6.87 | AA text |
| #d9253f on #e7eaef | 4.06 | AA-large / hover text; not body |
| #cbcdd2 on #1c1d21 | 10.59 | AA text |
| #6ab5db on #1c1d21 | 7.41 | AA text |
| #d9253f on #1c1d21 | 3.44 | 1.4.11 non-text 3:1; not body text |

## Local COL / A11Y pass (attack this)

- COL-01 concept-first: cool record paper + terminal dark; identity accents remain coral + royal blue.
- COL-03 roles: field dominant, ink support, two accents, cool neutrals. One identity anchor for *hue family of the field* (cool grey-blue), not the accents.
- COL-04 value architecture: ink vs paper / terminal-ink vs terminal survive greyscale. Accents are chroma, not hierarchy.
- COL-05 temperature-biased neutrals: cool paper, not warm parchment, not #808080.
- COL-09 thrift: do not add ADLC green/yellow.
- COL-12 area-proportion: light masthead is sunk paper, not #1c1d21, because the marquee is a large field.
- COL-16 mid-tone: coral held on both grounds (3.44 dark is the tightest pair — non-text only).
- A11Y-01: body pairs ≥4.5; coral not used as small body text.
- A11Y-06: OrderBook bid/ask stays Radix green/red; not folded into site accents.
- IDNT-05 / LAY-10: Radix `accentColor=cyan` `radius=medium` is an unchosen second system — flag, do not silently restyle exhibits this pass.
- TYPE locked: GeistMono + Roboto Flex unchanged.

## Identity anchor (COL-03)

Royal-blue link family is the single identity hue (`#3c00f7` / `#6ab5db`). Coral is the sparse structural/action accent, not a second identity colour and not hover text.

## Codex 5.6 medium

Remote `codex exec -m gpt-5.6-sol --reasoning-effort medium` returned `accept-with-edits`. Block HC-COLOUR-01 applied: coral no longer recolours hover text. Full payload: `colour-validation-codex.json`.

## Ask

1. Confirm or refuse each hex/role against COL/A11Y/LAY/IDNT and the distilled files `colour-theory-cianci.md`, `interaction-of-color.md`, `asymmetric-typography.md`, `refactoring-ui.md` (only where those distillations own a cited ID).
2. Name any pair that fails a named rule, with the disconfirming condition.
3. Verdict: `accept` | `accept-with-edits` | `refuse`. If edits, give replacement hexes that still satisfy the operator locks (fonts; coral; royal blue).
4. Cite rule IDs. No colour-psychology. No new accent hues.

Return a short structured findings list only.
