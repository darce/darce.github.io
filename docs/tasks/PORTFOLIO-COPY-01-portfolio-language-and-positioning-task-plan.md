# PORTFOLIO-COPY-01. Portfolio language and front-end positioning

> **Date**: 2026-10-09 18:55 EDT
> **Author**: Codex coordinator
> **Project**: darce.github.io
> **Task ID**: PORTFOLIO-COPY-01
> **Task Plan Status**: completed
> **Target Branch**: `feature/portfolio-copy-01`
> **Review Coverage Target**: 1

## Objective

Publish a portfolio that presents Daniel Arcé as a Senior Front-End Developer & Design Technologist. Rewrite the public copy around the work and the decisions behind it, review every section and article against the pinned Heuristics Canon, and preserve the intentional editorial use of modern art.

## Problem Statement

The masthead, metadata, and About closing position Daniel primarily for product-design jobs, although his strongest employment evidence is production front-end development. Project and research prose often repeats qualifications, announces its structure, or discusses the review process before explaining the work. Artwork credits currently double as image descriptions, which gives neither purpose a clear home.

## Constraints

- Leave all résumé source files, downloads, and résumé-page copy unchanged.
- Use Codex **remote `gpt-6.1-sol`, `xhigh`** for implementation and Claude **remote `claude-opus-5-5`, `high`** for the independent adversarial review. Do not substitute a backend, model, or effort silently.
- Read the immutable local canon at `/Users/daniel/Development/heuristics-canon-current`; cite the version from its manifest, currently **0.25.6**. Never edit that copy or use the maintainer's publish checkout as a source. A remote copy must match the pinned snapshot and manifest digest.
- Use research distillations and the original corpus at `/Users/daniel/Development/heuristics-canon-research` as requested context, with source and locator checks. Do not edit or publish the private research corpus in this task.
- Preserve actual historical job titles. Do not turn front-end experience into an invented history of full-stack product ownership, design employment, discovery, user research, adoption, or measured outcomes.
- Keep existing mathematics, code examples, live demonstrations, release facts, image sources, and accurate qualifications. Changes to the presentation must not change the technical argument.
- Treat artwork as editorial counterpoint. Do not require literal correspondence to the article, invent artist intentions, or explain away the reader's possible associations.
- Generate no fake screenshots or historical exhibition photographs. Required assets go in an actionable backlog.
- The user has authorized implementation, GitHub publication, and updating the live site. Use the existing Pages deployment workflow.

## Workflow Principles

- Lead with the object, action, or decision the reader needs to understand. Keep technical terms stable and explain unfamiliar terms where needed.
- Diagnose a reader problem before changing a sound sentence. Avoid mechanical bans on sentence length, contrast, lists, or punctuation.
- Place qualifications beside the claim they limit, once. Goals, implemented capability, release status, and observed benefit are separate claims.
- A canon citation records the rule and its trigger; it does not establish a professional credential or demonstrate that a product was evaluated with users.
- The implementation agent owns code and copy changes. The coordinator owns planning, acceptance, independent verification, and deployment.

## Terminology

- **Front-end positioning**: production interface development remains the professional foundation; interaction design, accessibility, and prototyping explain the distinctive practice.
- **Editorial counterpoint**: an artwork and a text remain independent while their proximity can prompt associations. An association is an editorial reading, not proof of an artist's intention or a demonstrated cognitive effect.
- **Language review**: a human editing pass for meaning, structure, specificity, and rhythm. It is not an AI-authorship detector or a claim of ASD-STE100 conformance.

## Current State Analysis

Code anchors were checked at `8ee8bf4866aa0bbe23b97af62e7b0866d81b9b30` on 2026-10-09 using the codebase-memory graph.

- `content/header/masthead.mdx` uses Product Designer & Design Technologist; `lib/seo.ts:SITE_TITLE` and `personJsonLd` repeat the old positioning.
- `pages/index.tsx:Landing` contains the homepage introduction and hard-coded featured-project descriptions; `FEATURED_SLUGS` controls their order.
- `content/about/about.mdx` closes with interest in senior and lead product-design roles. Its production development and accessibility history supports a different emphasis.
- `components/features/ProjectDetails/ProjectDetails.tsx:ProjectDetails` uses `metadata.masthead.alt` and each `image.alt` for both the image description and visible caption.
- `types/index.ts:MetaImage`, `lib/schemas.ts:metaImageSchema`, and `lib/markdownUtils.ts:normalizeMetaData` do not preserve a separate image caption. The existing normalization helpers should be extended rather than duplicated.
- AltContext's first project link points to authenticated WordPress administration. Its public signed-out guide is `https://demo.altcontext.com/guide/`.
- VSW is downloadable at 0.2.6; the existing captures show 0.2.0. The release repository is not an application-source repository.
- Texting Syria is absent as a substantial project case. Daniel confirms that Liam Maloney supplied photographs, text, and translations, and Daniel implemented the entire experience end to end.

## Target Outcome

The masthead reads **Senior Front-End Developer & Design Technologist**. A proposed homepage opening is: “I build accessible interfaces and working prototypes. My work spans media products, photo archives, and tools for finding and describing images.” The final wording may change during editing, while retaining that factual scope.

The About page explains the established front-end practice, the interaction decisions made through implementation, and the more recent independent applications. Its closing states interest in front-end development and design-technology roles, with Toronto as the base and openness to New York City. It must not imply US work authorization.

Professional work appears early enough to substantiate the title. PhotoShelter and MSNBC stay prominent; independent products show current work and increasing technical breadth. Texting Syria adds a distinct example of implementing an exhibition experience without claiming a formal product-design post.

All articles get a substantive language review. The prose should sound like someone explaining work they know: specific choices and consequences, useful examples, varied sentences, and limits stated where they matter. Research articles remain explanatory essays rather than job-application copy.

## Context Loading

- This plan, repository `AGENTS.md`, and applicable WorkBay rules.
- Canon `AGENTS.md`, `meta/release-manifest.json`, fired lexicon rows, their Source cells, relevant PRINCIPLES siblings, and all matching reasoning cards as instructed by the canon.
- Initial writing candidates: WRIT-03, WRIT-26, WRIT-37, WRIT-70, WRIT-71. Apply only when the actual trigger fires. For art, inspect A11Y-02, ATTRIB-03, and BOUND-01; an existing alt is not automatically a missing-alt violation.
- Relevant research material: Pinker, *The Sense of Style*, chapters 2, 3, and 5; Garner on plain writing; Cagan, *INSPIRED*, original chapter 11 on product designers; Frost on development and design; Godbolt on front-end systems. Verify any locator used in the report against the supplied original material. Treat `AIWritingTropes.md` as provisional editorial hypotheses, not evidence of AI authorship.
- Official ASD-STE100 material at `https://www.asd-ste100.org/`, especially its current About and downloads pages. Do not treat an unofficial rules clone as the standard.
- WorkBay task reference `PORTFOLIO-COPY-01`; planning review is recorded under `MAINT-PORTFOLIO-COPY-20261009`.
- No new runtime dependency requires external API documentation.

## Contract and Boundary Impact

| Boundary | Owner | Current contract | Expected change | Compatibility | Verification |
| --- | --- | --- | --- | --- | --- |
| MDX image metadata to rendered article | This site | `MetaImage`, `metaImageSchema`, `normalizeMetaData` | Optional `caption` distinct from `alt` | Existing images without a caption retain their visible caption | Normalization and rendering fixtures, static export |
| Site to AltContext | External application | First project link | Public `/guide/` destination | No API or application change | Signed-out navigation |
| Repository to GitHub Pages | Existing deploy workflow | `out/` static export on main | Updated content and routes | Preserve workflow and URLs | Successful Actions run and live checks |

## Proposed Solution

### Section and article decisions

| Section or article | Proposed revision and evidence boundary |
| --- | --- |
| Masthead, homepage, metadata, generated LLM text | Use the front-end title consistently. Name accessible interfaces and prototypes; replace broad product-design claims. Review featured order and descriptive labels. |
| About | Explain production front-end depth and code-based interaction work. Give the independent products proportionate space. State front-end/design-technology role interest and openness to NYC. |
| Work index | Use clear group descriptions that distinguish professional delivery from independent projects without treating stages as ranks. Include Texting Syria. |
| Research index | Introduce the subjects directly. Remove repeated “this article asks” framing. Describe experimental status accurately. |
| Footer, contact/navigation, privacy and error pages | Review public text for consistency and clarity; change only genuine language or positioning problems. Leave résumé surfaces untouched. |
| PhotoShelter | Lead with the production interface and accessibility responsibility. Explain keyboard behavior across Web Components and Shadow DOM. Preserve the internal nature of the roughly 30% effort estimate and contracts-at-risk context of $9.2M ARR. Identify mentoring of four developers and collaboration with the Chief Architect accurately. |
| MSNBC | Make the proposed collapsible panels and continuous video experience concrete. State the implemented surface, the internal team and vendor collaboration, and actual delivery responsibility. Preserve historical technologies and capture dates. |
| Apple | Describe responsive implementation from the design team's specifications and build automation. Remove unsupported novelty or causal-performance claims. Keep the historical role accurate. |
| Barbara Beirne | Distinguish recovery of the Flash material in 2023 from the Web Components rebuild in 2026. Explain the photographer's presentation needs and keyboard interaction. Keep the dated testimonial as a quote and do not make it validate the later rebuild. |
| Bauhaus Dances | Explain Debra McCall's material, Daniel's visual treatment and implementation, and the film's presentation. Avoid invented performance measurements. |
| Visual Search Workbench | Lead with the query, selection, and linked-view experience. Explain one actual implementation decision documented in the existing material. Keep 0.2.6 maintenance and local-processing limits precise; preserve the older-capture label and experimental cutout status. No outside-user study is claimed. |
| AltContext | Explain the editor's review and stored result before stack details. Keep face suggestions subject to review. Link to the public guide. Preserve in-development status, hosting/data-flow facts, and the lack of editor/blind-reader evaluation. |
| WorkBay | Explain the developer task and persistent record with a concrete example. Describe use in Daniel's own practice; keep wider adoption and measured savings unclaimed. Surface existing actual workflow proof near the opening while retaining the Arp counterpoint. |
| Texting Syria (new) | Add a compact case based on verified existing references and Daniel's ownership statement. Credit Liam Maloney's photographs, text, and translations. Do not invent message timing, languages, stop behavior, visitors' responses, research, metrics, or UI captures. If imagery cannot be sourced now, publish a useful text case using supported metadata and list needed assets. |
| Agent memory | Explain records, retrieval, and the context sent to an agent in ordinary language before introducing specialized terms. Keep stale decisions and external-provider privacy boundaries clear. |
| Economics of agent memory | Separate the database audit, the measurement gap, and the proposed experiment. Keep the 20% saving as a target, not a result. Do not imply external preregistration; review the visible experimental badge accordingly. |
| Heuristics Canon | Explain a review from an artifact through a sourced criterion to a revision. Avoid presenting citations, source count, or tools as product-validation evidence. |
| Interrogating agent memory | Keep the five actual query examples; give them a clear purpose and remove repeated announcements and recaps. Preserve limitations of lexical retrieval. |
| Order book | Explain what the live bid/ask display shows and what it cannot establish about trader intention. Preserve the demonstration, code, and actual feed contract. |
| Rotation matrices | Improve the explanatory sequence and examples while preserving every formula and code fragment's meaning. Do not claim keyboard accessibility that the existing mouse interaction does not supply. |
| VSW process | Explain the visual-search and projection decisions without overstating what a projection preserves or what user outcomes have been measured. Keep implemented and proposed evaluation separate. |
| VSW screen reference | Label captures and schematics accurately. Give readable descriptions of controls and states; do not relabel 0.2.0 captures as 0.2.6. |

### Artwork and captions

Keep all five existing modern-art pairings: Arp/WorkBay, Kawara/agent memory, Phelps/economics, Johns/Canon, and Bradford/querying memory. Give the images concise descriptions of visible features in `alt` and preserve attribution in an optional `caption`. Descriptions must not turn an editorial association into a claim about the artist's intention. Do not add repeated disclaimers or captions that settle the interpretation. Review full-image presentation, crops, credit accuracy, and the prominence of actual product evidence.

### ASD-STE100 assessment

Produce a source-admission recommendation, not an invented compliance claim. Assess the official current issue, intended audience, rules/dictionary distinction, and applicability to procedures versus essays. Compare proposed additions with existing writing rules. State what cannot be grounded without the official standard and how to obtain, checksum, extract, and evaluate that source before admitting rule text to the research corpus. Leave both research and published canon unchanged.

## Files and Surfaces to Change

| File | Symbol or surface | Change |
| --- | --- | --- |
| `content/header/masthead.mdx` | Frontmatter `subtitle` | New title and supporting line |
| `content/about/about.mdx` | Article and frontmatter | Experience, role interest, language |
| `content/footer/footer.mdx` | Footer copy | Review and correct if needed |
| `pages/index.tsx` | `Landing`, `FEATURED_SLUGS`, `FEATURED_METRICS`, `FEATURED_TITLES` | Opening and featured presentation |
| `pages/work.tsx` | `Work`, `GROUPS` | Index introduction and project grouping |
| `pages/research/index.tsx` | `Research`, `GROUPS` | Index introduction and research descriptions |
| `lib/seo.ts` | `SITE_TITLE`, `personJsonLd` | Consistent title and truthful skills |
| `lib/siteMeta.json` | `description` | Shared description |
| `scripts/generate-llm-content.js` | `SITE_DESCRIPTION` | Check generated description consistency |
| `types/index.ts` | `MetaImage` | Optional caption |
| `lib/schemas.ts` | `metaImageSchema` | Validate optional caption |
| `lib/markdownUtils.ts` | `normalizeMetaData` and existing image helpers | Preserve optional caption |
| `components/features/ProjectDetails/ProjectDetails.tsx` | `ProjectDetails` | Render caption separately, preserving legacy fallback |
| `lib/researchEvidenceLabels.ts` | `formatResearchBadge` | Inspect proposal labeling; change only if actual current label misleads |
| `content/projects/{altcontext,apple,barbarabeirne,bauhausdances,msnbc,photoshelter,visual-search-workbench,workbay}.mdx` | Frontmatter and article bodies | All eight project language reviews |
| `content/projects/texting-syria.mdx` | New case | Verified end-to-end exhibition implementation |
| `content/research/{agent-memory,economics-of-agent-memory,heuristics-canon,interrogating-agent-memory,order-book,rotation-matrices,visual-search-workbench-process,visual-search-workbench-screen-reference}.mdx` | Frontmatter and article bodies | All eight research language reviews |
| `test/` | Targeted caption/schema fixtures, new if necessary | Compatibility and rendering proof |
| `docs/reviews/2026-10-09-portfolio-content-review.md` | New review report | Every public section/article, defect, repair, evidence, canon trigger and exact source locator |
| `docs/reviews/2026-10-09-editorial-art-and-ste-assessment.md` | New assessment | Per-pairing art critique and grounded STE source-admission recommendation |
| `docs/assets/portfolio-asset-backlog.md` | New asset list | Prioritized asset, purpose, provenance/owner, acceptance condition |

## Related Files

| File | Note |
| --- | --- |
| `.github/workflows/deploy-frontend.yml` | Existing check, build, and Pages deployment |
| `components/features/PortfolioGroups/` | Existing index rendering; reuse unless a demonstrated copy defect requires adjustment |
| `components/common/ResponsiveImage/` | Existing responsive image presentation; no new image framework |
| `content/resume/` and résumé downloads | Protected scope; compare against the base commit |

## Verification Strategy

- Run `npm run check` and `npm run build` after the final changes. Inspect static-export warnings and generated metadata, not only the exit code.
- Add or extend meaningful focused fixtures for optional-caption preservation and old-image fallback; run those tests. Do not add tests that merely snapshot the rewritten prose.
- Inspect rendered homepage, About, Work, new Texting Syria route, all project/research articles, and art captions at desktop and narrow mobile widths. Verify masthead wrapping, complete artwork presentation, article hierarchy, and absence of broken assets.
- Test the AltContext guide signed out. Check all newly added references.
- Compare résumé-related paths with the base: no changes.
- Independently review the diff with Claude remote Opus 5.5 high, using the same pinned canon and ownership facts. Resolve substantive findings through the requested Codex remote implementation lane, then verify the reviewed commit.
- Push the completed main branch, await the existing Pages workflow, and inspect the live title, About, project routes, and metadata on `https://darce.xyz/`.

## Slice Delivery

### Slice 1: Positioning, article copy, and caption compatibility

**Goal**: Make the whole portfolio readable and consistent with the established practice.

Files/functions: the public-copy, metadata, image-contract, and targeted-test surfaces listed above.

Changes: implement the section matrix; add the sourced Texting Syria case; preserve technical demonstrations and facts; separate captions from descriptions without breaking existing content.

Proof: check, build, targeted caption tests, rendered desktop/mobile inspection, and unchanged résumé diff.

### Slice 2: Review records and asset preparation

**Goal**: Make the editing decisions and remaining evidence needs inspectable.

Files: the three new report/backlog paths above.

Changes: document each article's actual language repairs and fired canon rules; critique artwork on its intended terms; recommend conditional STE admission with source limitations; list real assets needed to substantiate the practice.

Proof: coverage of all section-matrix rows; accurate pinned-release citations and primary web links; no fabricated assets, canon edits, or unverified standard rules.

### Slice 3: Independent review and publication

**Goal**: Deploy the independently reviewed portfolio.

Surfaces: requested remote review lane, Git history, GitHub Pages workflow, and live site.

Changes: resolve review findings, finish the task using the existing branch lifecycle, publish, and verify the live output.

Proof: no unresolved substantive findings, successful required checks, successful deployment, and inspected live routes.

## Consolidated Checklist

### Context and ownership

- [x] Load the authoritative repository rules, pinned canon, source distillations, and task state.
- [x] Confirm the exact requested remote models and efforts; transport the matching canon snapshot.
- [x] Keep résumé and corpus paths unchanged.

### Slice 1

- [x] Update masthead, homepage, About, index descriptions, metadata, and generated text.
- [x] Review and improve all eight project articles and all eight research articles.
- [x] Add the verified Texting Syria case and public AltContext guide link.
- [x] Add optional image-caption preservation and rendering with backward compatibility.
- [x] Run focused tests, check, build, and rendered layout/link inspection.

### Slice 2

- [x] Complete the section-by-section review ledger with actual defects and remedies.
- [x] Complete the art and STE assessment using primary sources and explicit evidence limits.
- [x] Create a prioritized asset backlog with verifiable acceptance conditions.

### Slice 3

- [x] Run the requested independent Claude remote review and resolve substantive findings.
- [x] Complete branch readiness and closure gates, merge, and publish.
- [x] Verify the live site and record deployment evidence.

## Review Readiness

- [x] The optional-caption contract has validation, normalization, and rendering proof.
- [x] The review covers every section and article, including claims retained rather than rewritten.
- [x] The handoff records checks, model provenance, remaining asset needs, and deployment status.

## Success Criteria

- [x] darce.xyz consistently presents the front-end/development foundation and design-technologist practice.
- [x] All public articles have been reviewed for specificity, explanatory structure, and repetitive prose.
- [x] The intentional art pairings remain, with useful image descriptions and proper visible attribution.
- [x] Texting Syria's end-to-end implementation is represented accurately.
- [x] The requested remote implementation and independent review have verifiable model/effort provenance.
- [x] The asset backlog and scoped STE admission assessment are delivered, without changing résumés or either canon corpus.
- [x] The live Pages deployment contains the reviewed changes.

## Publication record

The [GitHub Pages deployment](https://github.com/darce/darce.github.io/actions/runs/38010234259) succeeded for `792dac403c7b9b6cc0eef67c6bd39e029dbd0b02` on 2026-10-10 UTC. Live verification at darce.xyz passed all 46 desktop/mobile route checks, including the new title, About Person metadata, Texting Syria, corrected VSW/order-book text, images and captions. Browser analytics requests returned HTTP 202.

Implementation and source-review receipts remain in WorkBay and the coordinator’s task-state artifacts. The content review, art/STE assessment and asset backlog are committed in this repository. Résumé files and both source corpora remain unchanged.
