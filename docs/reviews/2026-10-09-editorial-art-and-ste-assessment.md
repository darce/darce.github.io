# PORTFOLIO-COPY-01 — editorial art and ASD-STE100 assessment

Date: 2026-10-09; correction pass: 2026-10-10. Implementer assessment, using **Canon v0.25.6** from the verified read-only transport. Manifest SHA256: `ce0953e41cf3fc836cf9d8a5a8e7975173d26da8cf178480bfbd1d33bf41cb7d`. The companion content review records source loading, digest checks, matching reasoning cards, exemptions, historical dependency failures and resolved coordinator verification. The supplied Opus review is conditional_pass; this bounded correction addresses its findings without claiming a new independent verdict. Correction-pass remote check and all 217 tests passed; Webpack production export passed after the default Turbopack build stalled. The content review records those distinct outcomes.

## Purpose and precedent

Daniel's stated purpose is to place independent art and writing together so their proximity can prompt associations. The art need not literally illustrate the interface or prove an argument. The useful editorial test is whether the pairing opens a productive reading while leaving the artwork and text distinguishable.

The accessible record for Solange Brand's [“Un parti pris”](https://www.monde-diplomatique.fr/2002/09/BRAND/9405) identifies a September 2002 article, page 27. The [“Regards panoramiques” double-pages index](https://www.monde-diplomatique.fr/diplo/doubles-pages/) presents artworks alongside articles. These are brief factual precedent notes, each below the supplied 25-word derivation limit. The judgments below are my own; they do not paraphrase the essays, attribute an association to an artist, or claim experimentally demonstrated interference effects.

## Direct image inspection and pairing decisions

All five actual local files were opened with `view_image`. Their bytes and pairings remain unchanged. Each thumbnail and masthead now has concise visible-feature alt; the entire existing artist/title/date/material/institution/credit string moved into optional `caption`. A source-level comparison confirms all ten credit strings match their prior alt exactly. This preserves existing attribution, but is not independent catalogue or licence verification.

### Arp / WorkBay

File: `public/images/arp-collage-squares-laws-of-chance-1916.jpg`.

Visible inventory: rough-edged blue and off-white rectangular pieces sit at intervals on grey paper. The paper field and spaces between pieces remain visible. New alt: “Blue and white rough-edged rectangles spaced across a grey paper background.”

Retained credit: Jean (Hans) Arp, *Untitled (Collage with Squares Arranged According to the Laws of Chance)*, 1916–17; torn-and-pasted paper on paper; Museum of Modern Art, New York; existing public-domain credit.

**Editorial judgment — implementer:** the named chance procedure and the visibly maintained arrangement can sit usefully beside WorkBay's effort to preserve decisions between discontinuous sessions. That is a tension a reader may explore, not proof that the collage depicts software state, that its visible arrangement was accidental, or that Arp intended this association. The title supplies the chance reference; the pixels alone do not establish the procedure.

Keep the art in the article's introductory position. Make Daniel's work inspectable through the existing `workbay-journey.svg` immediately after the opening task example, and `workbay-uxmap.svg` beside the UX-map workflow. These diagrams explain the implementation in their own figures; they do not replace or interpret the Arp image. The article distinguishes the public workflow instructions from the companion Design Canvas implementation outside the public mirror.

### Kawara / project memory

File: `public/images/research/dec-29-1977-on-kawara.jpg`.

Visible inventory: a red canvas carries the white date “DEC. 29, 1977”; beneath it is an open box holding a newspaper front page. The box/newspaper is part of the supplied image and should not disappear from the description. New alt: “A red canvas reads ‘DEC. 29, 1977’ in white, above a box holding a newspaper front page.” The frontmatter uses double quotation marks around the visible date.

Retained credit: On Kawara, *DEC. 29, 1977*, “Thursday,” from the *Today* series, 1966–2013; acrylic on canvas, existing dimensions/institution; © One Million Years Foundation.

**Editorial judgment — implementer:** a dated record beside an article about persistent project records can raise the difference between the stored mark and the lived time it names. The painting/newspaper arrangement does not demonstrate how a coding memory works or secure a claim about how Kawara experienced that day. Retain that openness instead of making the date into a database metaphor in the caption.

The nearby memory-loop diagram explains the actual record/retrieval mechanism. The reader can distinguish that authored evidence from the artwork without a repeated disclaimer. Do not crop the introductory image to the red canvas and silently discard the box; any later intentional detail needs an explicit detail label and corresponding alt.

### Danica Phelps / economics

File: `public/images/research/stripe-drawing-danica-phelps.jpg`.

Visible inventory: looping grey lines overlap a car drawing; handwritten numbers appear near the lower right; two rows of red, dark and pale stripes run below. New alt describes those features, rather than an economic conclusion.

Retained credit: Danica Phelps, existing “stripe drawing” title, 2013; graphite and watercolor on paper; © Danica Phelps. This generic title and its provenance need catalogue confirmation; no new precise catalogue title or transaction interpretation was invented.

**Editorial judgment — implementer:** the accumulating lines, numbers and stripe marks can invite attention to traces of labour and value beside the audit and proposed comparison. The image does not prove that each mark represents a particular payment, establish the artist's accounting procedure, or demonstrate WorkBay savings. Keeping the title/credit separate from alt allows that association without naming a measured return the article does not possess.

The audit table, instrumentation-gap diagram, and proposed A/A/paired design carry the argument's evidence. The visible badge now says “Evidence: evaluation proposed.” The 20% reduction remains a proposed criterion. The artwork remains introductory counterpoint rather than a data visualization relabelled with the audit's numbers.

### Jasper Johns / Canon

File: `public/images/research/ventriloquist-jasper-johns.jpg`.

Visible inventory: vessels hang amid coloured lines; two stacked flag patterns sit beside them; a black-and-white rectangular image appears above. New alt inventories these visible elements without calling them a borrowed voice.

Retained credit: Jasper Johns, *Ventriloquist*, 1986; lithograph with chalk additions, proof before the edition; Museum of Modern Art, gift of the artist; © Jasper Johns / Licensed by VAGA at Artists Rights Society (ARS), NY.

**Editorial judgment — implementer:** the title and layered motifs permit a reading about mediated or borrowed voice alongside a collection that cites other writers. That reading belongs to this editorial placement, not to the visible inventory or a proven statement of Johns's intent. It can also raise a useful question for the text: does a cited rule support the reviewer's reasoning, or merely stand in for it?

The trigger/action/question example, VSW coordination example, and false-positive field observations make Daniel's review practice inspectable in prose. No diagram is needed to replace Johns. The retained “proof before the edition” information is a production/catalogue claim carried by the existing credit record, not something inferred from the image or a claim that this file contains every part of the original print.

### Katherine Bradford / interrogating memory

File: `public/images/research/swimmers-under-orange-moon-katherine-bradford.jpg`.

Visible inventory: five loosely painted figures occupy turquoise water beneath a dark, speckled sky and an orange moon. Their orientations vary. New alt describes the visible figures, colour field and moon.

Retained credit: Katherine Bradford, *Swimmers Under Orange Moon*, 2025; acrylic on canvas, existing dimensions; Whitney Museum of American Art, gift of Avo Samuelian and Hector Manuel Gonzalez; © Katherine Bradford.

**Editorial judgment — implementer:** figures sharing a field without a single obvious route can sit beside the different ways Daniel questions a project record. This is an open association. It should not be closed into “five figures = five queries,” a common goal, a coordinated group, or a biography of the pictured figures. The alt's count describes what is visible; it does not assign each person a section of the essay.

Retain the complete supplied introductory image. The schematic record-window diagram belongs with the first question and explicitly says its rows are schematic rather than the audit sample. The text keeps all five query examples, so the pairing does not carry the explanatory burden.

## Full image, detail, placement, and attribution

The existing ProjectDetails masthead renders intrinsic proportions with `width: 100%`, `height: auto`, and `object-fit: contain`. Its desktop column is at most half the lede; at the existing tablet/mobile breakpoint it occupies the available width above metadata. No fixed-height art crop was added. The thumbnail/card path uses cover framing and existing position/scale; a card can therefore crop the view. Clicking through reaches the introductory source image and full existing credit.

“Full supplied image” means the bytes inspected here, not a newly established catalogue claim that every original work is uncropped. No supplied art file was documented as a detail. Do not add an invented detail label; catalogue comparison and crop history belong in the backlog. A future known detail must be labelled as such. Kawara particularly needs the box/newspaper retained in the article, and Phelps needs the lower stripe field visible.

Product evidence is a different class of image: PhotoShelter's keyboard GIF/menu, MSNBC's dated interface capture, older VSW captures and labelled schematics, and the existing WorkBay diagrams. PhotoShelter/MSNBC now lead the homepage and professional Work group. WorkBay's first mechanism diagram appears after two opening paragraphs. This moves work proof earlier without displacing independent art. Modern-art captions do not explain a settled metaphor, and repeated “not a screenshot” captions were not added.

The initial remote pass inspected files/CSS/source only and had dependency-blocked builds. Coordinator verification subsequently passed check, all 217 tests and normal build/export on the reviewed source tree: 46 desktop/mobile route checks returned HTTP 200 without page errors, broken images or overflow. The five artwork figures were inspected with credits fully visible. These are supplied rendered-QA receipts, not remote browser runs or catalogue/rights verification. Preview analytics CORS from localhost leaves live-origin behavior as a deployment gate.

## Depiction rows and scope

The selected depiction rows govern the interpretive judgments being drafted in this assessment. The old credit-only alt is not falsely described as already co-voicing a symbolic reading.

| Exact ID and bold rule name | Exact Source cell titles/locators | Application |
| --- | --- | --- |
| ATTRIB-03 — **Words re-author the image** | *Ways of Seeing, ch. 1* + *On Photography* + *Understanding a Photograph, ch. 2* + *Image Music Text, ch. 2* + *The Civil Contract of Photography, ch. 7* | These pairing readings interpret rather than inventory. Mark their bearer as the implementer, keep them out of alt/credit captions, and do not claim a final meaning or artist intention. |
| BOUND-01 — **Assertable set is bounded** | *Ways of Seeing, ch. 1* + *On Photography* + *Regarding the Pain of Others, ch. 8* + *Image Music Text, ch. 3* + *The Civil Contract of Photography, ch. 6* + *Under the Sign of Saturn, §syberbergs-hitler* | Chance procedure, lived time, labour/value, borrowed voice, and routes are not secured by a still alone. Source a production/title fact or mark the association as editorial. Do not certify an entire original work from the supplied reproduction. |

BOUND-02, **Narrowly selective transparency** — *On Photography* + *Regarding the Pain of Others, ch. 3* + *The Civil Contract of Photography, ch. 3* + *Under the Sign of Saturn, §fascinating-fascism* — was inspected but is not an old-caption violation finding: the old text was credit alone. The new alt/caption split and visibly labelled inventory/credit/judgment paragraphs keep the voices separate. A11Y-02, **Alt serves purpose (1.1.1)** — *Web Content Accessibility Guidelines 2.2, SC 1.1.1* — was also inspected; existing nonempty alt means no missing-alt trigger was asserted. Purpose still motivates improving the descriptions. WRIT-26, **Restore a needed attribution** — *The Sense of Style, ch. 2* — keeps artist and Daniel-authored implementation responsibilities distinct.

All matching reasoning cards were opened; CARD-18 applies to bearer/source separation, while the model-role, compression, finite-catalogue and density cards remain inert for these open editorial readings. Their scope/verification dispositions are in the content review. No catalogue model, identity recognition, crop inference or symbolic taxonomy was added.

## ASD-STE100: scoped private-corpus intake recommendation

**Recommendation — implementer:** worth admitting to private RESEARCH for technical procedures after normal provenance, permission and overlap checks. Acquisition is complete; no corpus edit is authorized here. Essay editing, art interpretation and full conformance assessment have different purposes.

### Official sources inspected

The original [ASD-STE100 Issue 9 PDF](https://www.asd-ste100.org/assets/files/ASD-STE100_ISSUE9.pdf), dated **15 January 2025**, has **434 pages**; author: ASD STEMG. Its SHA256 matches `STE-SOURCE-UPDATE.txt`: `d1f4ea9e7cd6e46b47aa9057209f99e78c0e9cfc4e27a5b07895b05c1a166431`. The downloads-page request form is not the only access route. The staged PDF and text were inspected; a fresh Poppler `pdftotext` 24.02.0 layout extraction exactly matched the staged text (SHA256 `a216fe199bd6e9c77fc743dfe6dc081ee5f245adcb115ed6ca1aa45ee50fa3f5`). No PDF, extraction or dictionary is published here.

The unnumbered copyright notice (PDF page 2) distinguishes listed usage categories from broader reproduction permission; a public URL does not establish redistribution rights. The source controls technical writing and approved word meanings/grammatical uses, while allowing subject-specific technical terms.

Selected contexts below were read with their examples and exceptions. Locators are **printed folios**, not PDF viewer page numbers; these are concise paraphrases, with no verbatim rule quotation.

| Rule / printed locator | Scoped summary |
| --- | --- |
| 1.11, p. 1-1-13 | Use one technical noun for the same item. |
| 3.6, pp. 1-3-5–6 | Use active voice; the descriptive-passive exception requires an unknown agent. |
| 4.2, p. 1-4-3 | Preserve complete sentence parts and write contractions in full. |
| 5.1, pp. 1-5-1–2; 6.3, p. 1-6-4 | Procedural sentences: 20 words; descriptive sentences: 25. Informational notes in procedures use the descriptive limit. |
| 5.3, p. 1-5-3; 5.4, p. 1-5-4 | Give command-form instructions; put a necessary condition before the command. |
| 6.2, pp. 1-6-2–4; 9.4, p. 1-9-8 | Connect ideas through stable key terms; repeat equivalent instructions consistently when context and meaning match. |

The formal contractions and 20/25-word provisions belong to STE technical writing, not universal essay requirements. This review neither establishes STE conformance nor detects AI authorship.

The coordinator acquired ASD STEMG’s [*ASD-STE100 Simplified Technical English and Artificial Intelligence* white paper](https://www.asd-ste100.org/assets/files/WhitePaper-ASD-STE100_and_AI.pdf) directly from ASD; it was not a user-owned supplied document. **June 2026**, three pages, SHA256 `678819db12b1c8900076341822232e49b45bdc060f243aa1b5c33cb94fba2df3`. Its p. 1 prioritises the standard and disclaims tool endorsement; pp. 2–3 discuss reliability, traceability and human oversight. It is guidance, separate from the original standard’s rules.

### Overlap and intake — independent editorial judgment

| Existing Canon v0.25.6 mechanism | Overlap judgment | Possible distinct intake value |
| --- | --- | --- |
| WRIT-03 — **Name the concrete referent**, *The Sense of Style, ch. 3* | Much general clarity advice already has support. | A bounded procedural terminology contract needs its own audience and reviewer. |
| WRIT-06 — **Repeat the precise term**, *The Sense of Style, ch. 5* | Strong overlap with the inspected terminology/cohesion contexts. | Dictionary senses and parts of speech can add precision beyond consistent naming. |
| WRIT-71 — **Unpack private knowledge**, *The Sense of Style, ch. 3* | Both concern what the intended reader needs to understand. | Procedure grammar and condition/action dependencies deserve separate verification. |

These are deduplication judgments, not new canon rules or retroactive ASD attribution of Pinker’s mechanisms. Prioritise installation, maintenance and recovery instructions; keep explanatory essays, derivations and editorial art outside an imposed controlled-language contract. Do not import a wholesale dictionary or treat a practice guide’s procedural surface as the entire case study’s genre.

1. Record the acquired official source’s provenance, issue/date, URL, checksums and applicable permission before intake. Public availability is not permission to republish it.
2. Preserve rule/entry/printed-page locators, dictionary layout and exceptions; compare prospective distillations against the PDF. Keep the AI guidance in a separate source record.
3. Deduplicate by trigger, action, audience and verification. Review any genuinely new procedural obligation with a knowledgeable human before admission. Published-canon release work remains separate.

## Outstanding evidence

Current VSW captures, AltContext WordPress editor/stored-text evidence, PhotoShelter keyboard records, Texting Syria exhibition/implementation records, permissioned Catch contribution records from August 2024–February 2025, and catalogue/credit provenance remain optional evidence work in the backlog. A current Catch surface must be tied to Daniel’s contribution. Desktop/mobile route and five-figure QA, plus signed-out guide apply/undo, are completed coordinator checks. Reader/editor studies and catalogue/rights verification remain distinct; none is inferred from those checks.
