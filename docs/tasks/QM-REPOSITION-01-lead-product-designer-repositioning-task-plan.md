# Task Plan

> **Metadata**
>
> - **Date**: 2026-08-23 EST
> - **Author**: Claude Fable 5 (orchestrator)
> - **Project**: darce.github.io (darce.xyz)
> - **Task ID**: `QM-REPOSITION-01`
> - **Task Plan Status**: `proposed`
> - **Target Branch**: `feature/qm-reposition-01`
> - **Review Coverage Target**: 2
>
> Anchors verified at commit `9517ffc` (main), 2026-08-23, via codebase-memory-mcp index `Users-daniel-Development-darce.github.io` and direct file reads.
> Source assessment: `agentic/quartermaster_lead_product_designer_resume_portfolio_plan_v2.md` (sections 4, 5, 7, 9, 10, 16).

---

## QM-REPOSITION-01. Reposition darce.xyz as Product Designer & Design Technologist

## Objective

darce.xyz currently classifies Daniel as a front-end engineer before a visitor reaches the design evidence. After this task, the first screen states "Product Designer & Design Technologist for AI and complex systems", the featured work order is Semantic Image Search → PhotoShelter → WorkBay, a Practice page presents Heuristics Canon as applied judgment, and every stale positioning string (masthead, SEO, JSON-LD, llms.txt, footer, About) matches the new identity.

## Intake

- **Scope one-pager**: the assessment document above (§4 "darce.xyz plan" is the scope).
- **Key decisions** (recorded on `MAINT-QM-PLAN`):
  - Nav becomes `home · work · practice · about · résumé`. `/research/*` URLs stay live (deep-link stability, canon NAV-11); `/practice` is a new hub that hosts the Canon essay and links to the research index. The assessment proposed dropping Home and Research; keeping both avoids breaking indexed URLs and the existing sibling/breadcrumb model.
  - SIS case ships as a **text-first case with an explicit media-pending state** until Daniel captures screenshots (canon RLSE-04 / Principle 11: unknown is a designed state). No fabricated screenshots, no adoption or research claims.
  - Design-targeted résumé PDF is authored outside this repo; this task only guarantees the `/resume/` download path and nav entry.
- **Not-Doing**: visual redesign; animation polish; new Figma artifacts; rewriting Apple / MSNBC / Bauhaus / Barbara Beirne cases (P2); the SIS usability study (Gate 3, offline); WorkBay Design Map packaging (separate repo).

## Problem Statement

`content/header/masthead.mdx:subtitle`, `lib/seo.ts:SITE_TITLE`, `lib/seo.ts:SITE_DESCRIPTION`, `lib/seo.ts:personJsonLd.jobTitle`, `scripts/generate-llm-content.js:SITE_DESCRIPTION`, `content/footer/footer.mdx`, `content/about/about.mdx`, `pages/index.tsx` hero paragraph, `pages/about.tsx:aboutPageDescription`, and `pages/work.tsx:workDescription` all say "product engineer / front-end architecture / currently building AltContext". `pages/index.tsx:FEATURED_SLUGS` is `['workbay','photoshelter','apple','msnbc']`. There is no Semantic Image Search case (`content/projects/` has 6 cases, none SIS), no Practice page, and Heuristics Canon is not mentioned anywhere on the site.

## Constraints

- Hard-edge design system stays untouched (CLAUDE.md): no new colours, radii, or shadows; reuse `DitheredCard`, `SectionCards`, `ProjectDetails`.
- Frontmatter for new MDX must pass `lib/schemas.ts:contentItemSchema` (title + subtitle required) — enforced by `test/lib/schemas.test.ts` and build.
- Every metric keeps its existing source context (assessment §10). No new numbers.
- Truth hygiene: SIS is "working independent R&D product"; WorkBay Design Map / Canvas is "private R&D"; AltContext stays only where genuinely current (privacy page telemetry text; one line under Independent Product R&D on About).
- Writing: canon WRIT-02 / WRIT-07 / WRIT-08 (no AI-vocabulary, cap not-X-but-Y pivots).
- `npm run build` runs `scripts/generate-llm-content.js` in `prebuild`; `public/llms*.txt` and sitemap are generated, never hand-edited.

## Workflow Principles

- Evidence ordering before polish (assessment STRAT-19 kernel): copy and order changes land before any styling.
- One owner per file per slice (decomposition below is conflict-free by construction).
- TDD: each slice starts with a red vitest test pinned by `make slice-start`.
- Offload only mechanical slices; hero/thesis copy and the SIS narrative are judgment work — copy is given verbatim in the brief or written inline by the orchestrator.

## Terminology

- **Positioning**: masthead subtitle + hero title/subhead + SEO strings that state Daniel's identity.
- **Case**: an MDX file under `content/projects/` rendered by `pages/[section]/[slug].tsx` through `ProjectDetails`.
- **Practice page**: `/practice`, a static page presenting Heuristics Canon and linking to `/research/`.
- **Media-pending state**: an explicitly rendered note in the SIS case stating screenshots are not yet published, listing the screens that will appear.

## Current State Analysis

- Works: MDX pipeline (`lib/getMdxContent.ts:getMdxIndexContent`, `sortByIndex` on `metaData.index`), nav (`lib/routes.ts:NAV_ITEMS`, `resolveNavPath`), a11y tests, `/resume/` PDF handoff (`pages/resume.tsx:RESUME_PDF`).
- Drifting: all positioning strings (Problem Statement). `SITE_DESCRIPTION` is duplicated in `lib/seo.ts` and `scripts/generate-llm-content.js` (CommonJS; cannot import the TS module) — both must change together.
- Misleading: `test/lib/routes.test.ts` "contains home, work, research, and about" pins the old nav; `test/a11y/pages.a11y.test.tsx` skip-link fixture lists Work/Research/About (raw HTML fixture; should mirror the new nav).
- "Workstate" drift named in assessment §10: **not present** in this repo (grep: no matches); item already satisfied.
- SIS repo (`~/Development/semantic-image-search`) has UX maps and ASCII screens but **no product screenshots**. Media capture is an operator action outside this task.

## Target Outcome

A visitor who reads only the first screen can repeat "Product Designer & Design Technologist for AI and complex systems" (Gate 1 exit). Featured cards read SIS → PhotoShelter → WorkBay with the assessment's blurbs. `/projects/semantic-image-search/` renders the impact-first case with the "designing for incomplete truth" section and a media-pending note. `/practice/` renders the Canon essay with three applied SIS examples and a `Trigger → Rule → Check question → Source` strip. `/resume/` is reachable from the nav. `public/llms.txt`, `<title>`, meta description, OpenGraph and JSON-LD carry the new identity. `npm test` and `npx next build` pass.

## Context Loading

- Rules: `docs/workbay/rules/development-workflow.md`, `docs/workbay/rules/heuristics-canon.md`, `CLAUDE.md`.
- UX map: `docs/ux-maps/darce-xyz.uxmap.json`, `docs/ux-maps/darce-xyz-reposition-screens.md` (ASCII targets + critique).
- Source assessment §4, §5, §7, §9.
- Handoff/MCP: task `QM-REPOSITION-01`; planning findings on `MAINT-QM-PLAN`.
- External docs: none.

## Contract and Boundary Impact

| Boundary | Owner | Current Contract | Expected Change | Compatibility Needed? | Verification |
| --- | --- | --- | --- | --- | --- |
| MDX frontmatter | `lib/schemas.ts:sectionSchemas` | zod schemas per section | add `practice: contentItemSchema` | no (new section) | `test/lib/schemas.test.ts` |
| Public URLs | Next Pages Router | `/`, `/work`, `/research/*`, `/projects/*`, `/about`, `/resume` | add `/practice` and `/projects/semantic-image-search`; nothing removed | yes — no URL removed | `test/lib/routes.test.ts`, `out/` listing |
| llms.txt / sitemap | `scripts/generate-llm-content.js` | generated from content + `STATIC_PAGES` | new description + `/practice/` entry | no | diff of `public/llms.txt` after build |

## Proposed Solution

Seven slices as a DAG. Wave 1 (`s1 s2 s4 s5`) runs fully in parallel (disjoint ownership). Wave 2 (`s3 s6`) depends on wave 1. `s7` is the site-wide sweep and build.

```
s1 positioning ─┐            ┌─ s6 practice+nav ─┐
s2 sis-case ────┼─ s3 home ──┤                   ├─ s7 sweep+build
s4 workbay ─────┤            │                   │
s5 photoshelter─┘────────────┘───────────────────┘
```

## Files and Surfaces to Change

| Surface | File | Symbol / Function | Change |
| --- | --- | --- | --- |
| content | `content/header/masthead.mdx` | `subtitle` | `Product Designer & Design Technologist` |
| seo | `lib/seo.ts` | `SITE_TITLE`, `SITE_DESCRIPTION`, `personJsonLd.jobTitle`, `personJsonLd.knowsAbout`, `personJsonLd.sameAs` | new identity; jobTitle `Product Designer & Design Technologist`; knowsAbout adds Interaction design, Human-AI interaction, Design systems; drop altcontext from sameAs |
| tooling | `scripts/generate-llm-content.js` | `SITE_DESCRIPTION`, `STATIC_PAGES` | mirror `lib/seo.ts`; add `/practice/` (priority 0.8) |
| content | `content/about/about.mdx` | body | assessment §4 About narrative; AltContext one line under "Independent product R&D" |
| content | `content/footer/footer.mdx` | body | drop "Currently building … AltContext"; new one-liner |
| pages | `pages/about.tsx` | `aboutPageDescription` | new copy |
| pages | `pages/work.tsx` | `workDescription` | new copy |
| tests | `test/lib/seo.test.ts` `(new)` | — | pins SITE_TITLE/DESCRIPTION/jobTitle; asserts "Product Engineer"/"Front-End Architecture" absent |
| content | `content/projects/semantic-image-search.mdx` `(new)` | frontmatter `index: 1`, `year: 2026`, `title`, `subtitle`, `description`, `details`, `tags` (no `links` until repo is public) | assessment §5 structure |
| tests | `test/content/semantic-image-search.test.ts` `(new)` | — | frontmatter passes `contentItemSchema`; body has six incomplete-truth states + "pending" note; no `validated|adoption|users love|seamless|leverage` |
| pages | `pages/index.tsx` | `FEATURED_SLUGS`, `FEATURED_METRICS`, hero `<p className={styles.positioning}>` | `['semantic-image-search','photoshelter','workbay']`; §4 blurbs; new title + subhead |
| tests | `test/pages/featured.test.ts` `(new)` | — | imports exported `FEATURED_SLUGS`/`FEATURED_METRICS`; pins order; every slug has a blurb and an MDX file |
| content | `content/projects/workbay.mdx` | frontmatter `index: 15`, `description`, `details`, `tags`; body | assessment §7: new opening, lifecycle strip, three product decisions, private Design Map boundary, technical detail second; ≤60% of current words |
| content | `content/projects/photoshelter.mdx` | frontmatter `title`, `subtitle`, `description`, `details`; body order | R&D prototyping first, then accessibility, then team adoption (assessment §2.2) |
| content | `content/practice/heuristics-canon.mdx` `(new)` | frontmatter `title`, `subtitle`, `links` | assessment §9 hero + mechanism strip + three SIS examples |
| pages | `pages/practice.tsx` `(new)` | `PracticePage`, `getStaticProps` | mirror `pages/about.tsx` (MDXRemote + Layout + Head); link to `/research/` |
| lib | `lib/schemas.ts` | `sectionSchemas` | add `practice: contentItemSchema` |
| lib | `lib/routes.ts` | `NavItem`, `NAV_ITEMS`, `resolveNavPath` | `[home, work, practice, about, résumé→/resume]`; résumé item carries `ariaLabel: 'Résumé (PDF)'` (critique A11Y-20) rendered by `Nav.tsx`; `/practice*` and `/research*` → `/practice`; `/resume/` → `/resume` |
| tests | `test/lib/routes.test.ts` | `NAV_ITEMS`, `resolveNavPath` blocks | new labels; `/research/order-book` → `/practice`; `/resume` → `/resume` |
| tests | `test/a11y/pages.a11y.test.tsx` | skip-link fixture nav | mirror new labels |
| docs | `docs/ux-maps/darce-xyz.uxmap.json`, `docs/ux-maps/darce-xyz-reposition-screens.md` | — | authored in planning; s7 verifies `code_ref`s resolve |

## Related Files

| File | Note |
| --- | --- |
| `components/features/ProjectDetails/ProjectDetails.tsx` | renders case MDX; no change expected |
| `components/composite/Nav/Nav.tsx` + `Nav.module.scss` | consumes `NAV_ITEMS`; 5 items must fit mobile width |
| `styles/landingPage.module.scss` | `.positioning` reused for subhead; a title class may be needed |
| `pages/[section]/[slug].tsx` | `ContentSection` union is `'projects' | 'research'`; practice is a single page, not a section |
| `pages/privacy.tsx` | keeps AltContext telemetry text (still true) |

## Verification Strategy

- Deterministic tests (scoped per slice; never the full suite in a lane `TEST_CMD`):
  - `npx vitest run test/lib/seo.test.ts`
  - `npx vitest run test/content/semantic-image-search.test.ts`
  - `npx vitest run test/pages/featured.test.ts`
  - `npx vitest run test/lib/routes.test.ts test/a11y/pages.a11y.test.tsx test/lib/schemas.test.ts`
- Full gate (s7 only): `npm test && npm run typecheck && npx next build`
- Contract/fixture: `grep -rn -i "product engineer\|front-end architecture\|currently building" content lib pages scripts public/llms*.txt` returns only `pages/privacy.tsx` hits, if any.
- Manual: `npm run dev`; view `/`, `/practice/`, `/projects/semantic-image-search/` in light and dark; keyboard-tab the nav.

## Slice Delivery

### s1: Positioning strings

**Goal**: every identity string outside `pages/index.tsx` says Product Designer & Design Technologist.

Files/functions: `content/header/masthead.mdx:subtitle`; `lib/seo.ts:SITE_TITLE,SITE_DESCRIPTION,personJsonLd`; `scripts/generate-llm-content.js:SITE_DESCRIPTION`; `content/about/about.mdx`; `content/footer/footer.mdx`; `pages/about.tsx:aboutPageDescription`; `pages/work.tsx:workDescription`; `test/lib/seo.test.ts (new)`.

Copy (verbatim):
- masthead subtitle: `Product Designer & Design Technologist`
- SITE_TITLE: `Daniel Arcé — Product Designer & Design Technologist for AI and complex systems`
- SITE_DESCRIPTION: `Product designer and design technologist with 14+ years shipping user-facing software across media, enterprise SaaS, and AI products. Interaction design, accessibility, and working software for data-rich systems.`
- footer: `Product designer and design technologist. 14+ years shipping user-facing software for Apple, MSNBC, PhotoShelter, and independent AI products.`
- About: assessment §4 "About page" narrative; four bullets (SIS, PhotoShelter R&D + accessibility, MSNBC prototyping, Heuristics Canon); AltContext one line under independent R&D.

Proof: `npx vitest run test/lib/seo.test.ts` green; `node scripts/generate-llm-content.js && head -3 public/llms.txt` shows new description.

### s2: Semantic Image Search case (text-first, media-pending)

**Goal**: `/projects/semantic-image-search/` renders the assessment §5 case.

Files: `content/projects/semantic-image-search.mdx (new)`; `test/content/semantic-image-search.test.ts (new)`.

Frontmatter: `index: 1`, `year: 2026`, `title: 'Semantic Image Search: Local-First AI Photo Search & Exploration'`, `subtitle: 'Independent product R&D · macOS'`, `description: 'A native macOS product for semantic photo search and visual exploration that keeps gallery processing on-device and makes incomplete data explicit.'`, `details:` two sentences, `tags: [Product Design, Interaction Design, Human-AI Interaction, SwiftUI, Core ML, Accessibility]`. No `thumbnail`/`images` until media exists.

UX-map critique (`docs/ux-maps/darce-xyz-reposition-screens.md`): render `media_pending` as labelled placeholder blocks in place of each figure (RLSE-04), never skip the figure slot; at-a-glance uses a real `<table>` (A11Y-07); one not-X-but-Y pivot max (WRIT-07).

Body in order: hero thesis; "At a glance" table (Role / Stage / Platform / Core jobs / AI / Constraint / Trust boundary / Accessibility / Research status); Problem; Product principles (5); Core journey strip; **Designing for incomplete truth** (six states: no folder, no matches, model unavailable, partial library, unavailable volume, experimental — each: what the user sees / why not a generic error); Data-rich exploration (Similarity / Places / Timeline: question each answers, selection carry-over, coverage counts, zoom keeps context); Evaluation (Technical / Interaction-expert / External-user: "not yet run — next open evidence gap"); three `failure → user consequence → design decision → verification` stories; Outcome and limits; final `> Screens: pending.` block listing the eight screens from assessment §2.1.

Proof: test asserts frontmatter validates, six state names and the pending note are present, forbidden words absent.

### s3: Homepage hero and featured order

**Goal**: first screen states the new identity; cards read SIS → PhotoShelter → WorkBay.

Files: `pages/index.tsx:FEATURED_SLUGS,FEATURED_METRICS,hero`; `test/pages/featured.test.ts (new)`; `styles/landingPage.module.scss` only if a title class is needed.

Copy: title `Product Designer & Design Technologist for AI and complex systems`; subhead `I turn ambiguous, data-rich systems into products people can understand and trust — from early product hypotheses through interaction design, validation, and working software.`; credibility line `14+ years · Apple · MSNBC · PhotoShelter`. Blurbs = assessment §4 featured-work quotes.

Proof: `npx vitest run test/pages/featured.test.ts` green; manual light/dark check.

### s4: WorkBay case revision

**Goal**: shorten and reorder `content/projects/workbay.mdx` per assessment §7.

Changes: frontmatter `index: 15`, `description` = §7 opening; body = opening → `Plan → Task → Work → Review → Findings → Gate → Merge` strip → three product decisions → one short "Design Map (private R&D)" paragraph with explicit private boundary → compressed technical detail → repo link. No user counts or productivity claims.

Proof: `wc -w` ≤ 60% of current; `npx vitest run test/lib/schemas.test.ts`; "private" appears next to "Design Map".

### s5: PhotoShelter reframe

**Goal**: case reads as product risk reduction + complex-system design + business consequence.

Changes: title `PhotoShelter: Product R&D & Accessibility at Enterprise Scale`; subtitle `Enterprise DAM · 80,000+ users`; description/details lead with the R&D prototype (~30% downstream reduction) then $9.2M ARR; body order R&D → Accessibility → Team adoption; tags add `Product R&D`, `Prototyping`.

Proof: schemas test green; first `##` heading is R&D.

### s6: Practice page and nav

**Goal**: `/practice/` exists; nav is `home · work · practice · about · résumé`.

Files: `content/practice/heuristics-canon.mdx (new)`; `pages/practice.tsx (new)`; `lib/schemas.ts:sectionSchemas`; `lib/routes.ts:NAV_ITEMS,resolveNavPath`; `test/lib/routes.test.ts`; `test/a11y/pages.a11y.test.tsx`; `scripts/generate-llm-content.js:STATIC_PAGES` (add `/practice/`; after s1 lands).

Copy: assessment §9 hero + description; mechanism strip `Trigger → Rule → Check question → Source`; three applied SIS examples (Principle 11 → partial-library caveat; VIZ-17 → viewpoint preserved across Explore tabs; status/a11y → async states visible and announced); "Selected research" links to `/research/`; link to `https://github.com/darce/heuristics-canon`.

Proof: `npx vitest run test/lib/routes.test.ts test/a11y/pages.a11y.test.tsx test/lib/schemas.test.ts` green; `/practice/` in `out/` after build.

### s7: Consistency sweep and build

**Goal**: no stale positioning anywhere; build green; UX map `code_ref`s resolve.

Proof: grep from Verification Strategy; `npm test && npm run typecheck && npx next build`; every `code_ref` in `docs/ux-maps/darce-xyz.uxmap.json` exists on disk; regenerated `public/llms*.txt` + sitemap committed.

## Decomposition

```json
{
  "version": 1,
  "items": [
    {"id": "s1", "title": "positioning strings", "independent": true,
     "owns": ["content/header/masthead.mdx", "lib/seo.ts", "scripts/generate-llm-content.js", "content/about/about.mdx", "content/footer/footer.mdx", "pages/about.tsx", "pages/work.tsx", "test/lib/seo.test.ts"],
     "depends": [], "blast": "none"},
    {"id": "s2", "title": "semantic image search case (text-first, media-pending)", "independent": true,
     "owns": ["content/projects/semantic-image-search.mdx", "test/content/semantic-image-search.test.ts"],
     "depends": [], "blast": "none"},
    {"id": "s3", "title": "homepage hero + featured order", "independent": false,
     "owns": ["pages/index.tsx", "styles/landingPage.module.scss", "test/pages/featured.test.ts"],
     "depends": ["s2"], "blast": "none"},
    {"id": "s4", "title": "workbay case revision", "independent": true,
     "owns": ["content/projects/workbay.mdx"], "depends": [], "blast": "none"},
    {"id": "s5", "title": "photoshelter reframe", "independent": true,
     "owns": ["content/projects/photoshelter.mdx"], "depends": [], "blast": "none"},
    {"id": "s6", "title": "practice page + nav", "independent": false,
     "owns": ["content/practice/heuristics-canon.mdx", "pages/practice.tsx", "lib/schemas.ts", "lib/routes.ts", "test/lib/routes.test.ts", "test/a11y/pages.a11y.test.tsx"],
     "depends": ["s1"], "blast": "none"},
    {"id": "s7", "title": "consistency sweep + full build", "independent": false,
     "owns": ["public/llms.txt", "public/llms-full.txt", "public/sitemap.xml"],
     "depends": ["s1", "s2", "s3", "s4", "s5", "s6"], "blast": "full",
     "anchors": ["SITE_DESCRIPTION", "FEATURED_SLUGS", "NAV_ITEMS", "sectionSchemas"]}
  ]
}
```

Note: `s6` also edits `scripts/generate-llm-content.js:STATIC_PAGES` (owned by `s1`); it is sequenced after `s1` via `depends`, and is not `independent`, so the prefix rule holds.

## Lane Decomposition (Multi-Agent)

| Lane ID | Owned Paths | Upstream | Required Tests |
| --- | --- | --- | --- |
| `lane-s1` | `s1.owns` | none | `npm ci && npx vitest run test/lib/seo.test.ts` |
| `lane-s2` | `s2.owns` | none | `npm ci && npx vitest run test/content/semantic-image-search.test.ts` |
| `lane-s4` | `content/projects/workbay.mdx` | none | `npm ci && npx vitest run test/lib/schemas.test.ts` |
| `lane-s5` | `content/projects/photoshelter.mdx` | none | `npm ci && npx vitest run test/lib/schemas.test.ts` |
| `lane-s3` | `s3.owns` | `lane-s1` merged | `npm ci && npx vitest run test/pages/featured.test.ts` |
| `lane-s6` | `s6.owns` | `lane-s1` merged | `npm ci && npx vitest run test/lib/routes.test.ts test/a11y/pages.a11y.test.tsx test/lib/schemas.test.ts` |
| orchestrator | `s7` | all | `npm test && npm run typecheck && npx next build` |

Merge order: wave 1 `lane-s1`, `lane-s2`, `lane-s4`, `lane-s5` (any order); wave 2 `lane-s3`, `lane-s6`; then `s7` inline.

Orchestration mode: remote lanes on `0xalpha-remote` (operator request) via `/offload --agent 0xalpha-remote --effort high --token-budget <N>`; requires `WORKBAY_REMOTE_GATE_HOST` and a provisioned `~/.config/0xalpha/env` on the VM. No fallback: if the probe fails, stop and report. Merge gate per lane: `/wb-review-slice` with one local Claude reviewer plus remote reviewers citing the canon; findings recorded under `QM-REPOSITION-01`.

---

## Consolidated Checklist

## Context and Ownership

- [ ] Loaded `CLAUDE.md`, `docs/workbay/rules/development-workflow.md`, the UX map, and assessment §4/§5/§7/§9.
- [ ] No `ctx7` needed (no new dependencies).
- [ ] URL boundary recorded: nothing removed; `/practice` and `/projects/semantic-image-search` added.

### Checklist for s1: Positioning strings

- [ ] Write `test/lib/seo.test.ts` (red).
- [ ] Update `lib/seo.ts` and `scripts/generate-llm-content.js` together.
- [ ] Update masthead, footer, About MDX, `pages/about.tsx`, `pages/work.tsx`.
- [ ] `npx vitest run test/lib/seo.test.ts` green; llms.txt head shows new description.

### Checklist for s2: SIS case

- [ ] Write `test/content/semantic-image-search.test.ts` (red).
- [ ] Author the MDX per §5 with the media-pending block.
- [ ] Test green; route renders in build.

### Checklist for s3: Homepage

- [ ] Export `FEATURED_SLUGS`, `FEATURED_METRICS`; write `test/pages/featured.test.ts` (red).
- [ ] Replace hero copy; set order and blurbs.
- [ ] Test green; light/dark manual check.

### Checklist for s4: WorkBay case

- [ ] Rewrite per §7; private Design Map boundary explicit; ≤60% words.
- [ ] Schemas test green.

### Checklist for s5: PhotoShelter

- [ ] Reorder and retitle per §2.2.
- [ ] Schemas test green.

### Checklist for s6: Practice + nav

- [ ] Update `test/lib/routes.test.ts` and a11y fixture (red).
- [ ] Add `practice` schema, page, MDX; update `NAV_ITEMS`/`resolveNavPath`; add `/practice/` to `STATIC_PAGES`.
- [ ] Tests green; `/practice/` in build output; mobile nav fits.

### Checklist for s7: Sweep

- [ ] Stale-string grep clean (privacy page excepted).
- [ ] `npm test && npm run typecheck && npx next build` green; llms/sitemap regenerated and committed.
- [ ] UX map `code_ref`s resolve.

## Review Readiness

- [ ] URL boundary evidence: `out/` contains all old routes plus the two new ones.
- [ ] Manual light/dark check captured for `/`, `/practice/`, SIS case.
- [ ] Handoff decisions recorded: nav decision, media-pending decision, résumé-PDF boundary.

## Stretch Goals

- [ ] SIS media (8 screenshots + 60–90 s loop) captured by the operator and added to the case — replaces the media-pending block.
- [ ] Bauhaus Dances promoted in `/work` ordering as visual-craft evidence.

## Success Criteria

- [ ] First screen of `/` states the new identity; masthead, `<title>`, meta, OG, JSON-LD, llms.txt agree.
- [ ] Featured order SIS → PhotoShelter → WorkBay with §4 blurbs.
- [ ] `/projects/semantic-image-search/` and `/practice/` render; nav has five items including résumé.
- [ ] No stale positioning strings outside `pages/privacy.tsx`.
- [ ] `npm test`, `npm run typecheck`, `npx next build` pass.
