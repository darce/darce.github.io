# Portfolio design tokens

`portfolio.tokens.json` is the source for shared spacing, breakpoints, rail sizing, and article typography. It follows the [Design Tokens Format Module 2025.10](https://www.designtokens.org/tr/2025.10/format/): typed tokens, inherited group types, and curly-brace aliases.

Run `npm run tokens` after editing it. Development, checks, tests, and builds also generate `styles/generated/_portfolio-tokens.scss`. Commit the JSON and generated Sass together. Existing Sass names in `spacing.scss`, `typography.scss`, and `breakpoints.module.scss` remain the public API; browser checks consume the same typed JSON.

DTCG dimensions allow `px` and `rem`. Viewport shares, figure shares, character counts, and unitless leading are numeric tokens. Web styles convert the rail share with `* 100vw`, the figure share with `* 100%`, and the monospaced reading measure with `* 1ch`. CSS functions and responsive conditions stay in the consuming styles rather than being encoded as invalid dimension values.

The exporter validates the dimension and number types used by this file, inherited types, alias targets, alias type agreement, cycles, and Sass name collisions. It is a portfolio-specific exporter, not an implementation of every DTCG token type. Palette and motion tokens retain their existing Sass sources.

The article occupies the full available content canvas. The reading-measure token limits standalone prose and summary paragraphs; it does not constrain the article, media, tables, or diagrams. Paragraphs inside a figure group use the available wrapping space.

The shared article renderer supports `<Figure src="image.png" alt="…" caption="…">explanatory prose</Figure>`. Inset figures occupy half the full article canvas, alternate right/left with the article gallery, and wrap their explanation when the article container is sufficiently wide. Use `layout="wide"` for evidence whose details require the full canvas, `side="left"` or `side="right"` for a deliberate placement, and `inspectable` for a link to the original image. Supply intrinsic `width` and `height` for local images absent from the responsive image manifest. Narrow containers stack figures in the same reading order. Responsive image `sizes="auto, 100vw"` uses the rendered image width where supported and a conservative viewport fallback, independent of the prose measure.
