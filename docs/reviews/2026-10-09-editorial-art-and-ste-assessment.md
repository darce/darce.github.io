# PORTFOLIO-COPY-01 — editorial art and ASD-STE100 assessment

Date: 2026-10-09. Implementer assessment, using **Canon v0.25.6** from the verified read-only transport. Manifest SHA256: `ce0953e41cf3fc836cf9d8a5a8e7975173d26da8cf178480bfbd1d33bf41cb7d`. The companion content review records source loading, digest checks, matching reasoning cards, exemptions, and blocked build/test verification. This document makes editorial judgments; it does not substitute for the requested independent Claude review.

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

This is a file/CSS/source inspection, not desktop/mobile rendered QA. Browser tooling was unavailable and the static build was blocked by missing dependencies. The coordinator must inspect wrapping, figure completeness, card crops, credit legibility, image failures, and body hierarchy at both widths after a successful build.

## Depiction rows and scope

The selected depiction rows govern the interpretive judgments being drafted in this assessment. The old credit-only alt is not falsely described as already co-voicing a symbolic reading.

| Exact ID and bold rule name | Exact Source cell titles/locators | Application |
| --- | --- | --- |
| ATTRIB-03 — **Words re-author the image** | *Ways of Seeing, ch. 1* + *On Photography* + *Understanding a Photograph, ch. 2* + *Image Music Text, ch. 2* + *The Civil Contract of Photography, ch. 7* | These pairing readings interpret rather than inventory. Mark their bearer as the implementer, keep them out of alt/credit captions, and do not claim a final meaning or artist intention. |
| BOUND-01 — **Assertable set is bounded** | *Ways of Seeing, ch. 1* + *On Photography* + *Regarding the Pain of Others, ch. 8* + *Image Music Text, ch. 3* + *The Civil Contract of Photography, ch. 6* + *Under the Sign of Saturn, §syberbergs-hitler* | Chance procedure, lived time, labour/value, borrowed voice, and routes are not secured by a still alone. Source a production/title fact or mark the association as editorial. Do not certify an entire original work from the supplied reproduction. |

BOUND-02, **Narrowly selective transparency** — *On Photography* + *Regarding the Pain of Others, ch. 3* + *The Civil Contract of Photography, ch. 3* + *Under the Sign of Saturn, §fascinating-fascism* — was inspected but is not an old-caption violation finding: the old text was credit alone. The new alt/caption split and visibly labelled inventory/credit/judgment paragraphs keep the voices separate. A11Y-02, **Alt serves purpose (1.1.1)** — *Web Content Accessibility Guidelines 2.2, SC 1.1.1* — was also inspected; existing nonempty alt means no missing-alt trigger was asserted. Purpose still motivates improving the descriptions. WRIT-26, **Restore a needed attribution** — *The Sense of Style, ch. 2* — keeps artist and Daniel-authored implementation responsibilities distinct.

All matching reasoning cards were opened; CARD-18 applies to bearer/source separation, while the model-role, compression, finite-catalogue and density cards remain inert for these open editorial readings. Their scope/verification dispositions are in the content review. No catalogue model, identity recognition, crop inference or symbolic taxonomy was added.

## ASD-STE100: conditional private-corpus admission

**Recommendation:** admit ASD-STE100 to the private research corpus only after official-source acquisition and grounding. Do not add unverified standard rules now, change either corpus, enforce a sentence-length limit, or label this portfolio STE-compliant.

### What the official sources establish

ASD describes STE as controlled technical writing with writing rules and an approved dictionary. The dictionary controls meanings and grammatical uses; technical nouns and verbs can supply subject-specific terms. Its origins and stated purpose concern understandable maintenance/technical instructions. Those facts support investigating it for procedural writing; they do not supply the full standard's rule text or exceptions. [Official About STE](https://www.asd-ste100.org/about_STE.html).

The current official downloads page identifies **Issue 9, January 2025**, and directs readers to a request form for an official copy. The official homepage points to the same standard/resources. No form was submitted and no person was contacted. No official full copy was supplied to this session; an indexed search result is not an acquired, checksummed and inspected standard. [Official downloads](https://www.asd-ste100.org/STE_downloads.html), [official homepage](https://www.asd-ste100.org/).

The downloads page separately links STEMG's *Simplified Technical English and Artificial Intelligence* white paper. It warns that plausible, authoritative-looking AI text is not verified conformance and keeps the standard as the primary reference. The user-supplied **June 2026** PDF was read with `pdftotext`; its SHA256 is `678819db12b1c8900076341822232e49b45bdc060f243aa1b5c33cb94fba2df3`. Page 1 states the standard takes priority and disclaims endorsement of tools; page 2 discusses reliability, terminology, traceability and human oversight; page 3 gives recommended controls/accountability. This is a three-page guidance paper, not Issue 9 or a source of replacement rules. [Official downloads and white-paper link](https://www.asd-ste100.org/STE_downloads.html).

The initial direct About/download fetches were unreliable (including 403); the official-domain indexed pages supplied the overview/download facts. The local white paper supplied its own page-specific evidence. No unofficial GitHub clone, web summary, or unverified 20/25-word rule was used as rule authority.

### Fit and overlap — editorial assessment

STE is a promising additional source for steps such as installation, inspection, maintenance, recovery, or a narrowly specified operational procedure: ambiguity about the object, action, condition or sequence can lead to doing the wrong thing. An approved dictionary is a substantive contract that requires acquisition, domain terminology handling and knowledgeable review; it is not merely “use short sentences.”

The portfolio also contains explanatory essays, mathematical derivations, historical attribution, uncertainty and independent-art readings. Turning those genres into maintenance instructions could remove a needed relationship or qualification and flatten their thought. Keep controlled-language work trigger-bounded to actual procedures; consider a practice guide separately from its explanatory case study. Neither this review nor the absent full standard establishes that every essay should use a fixed vocabulary.

| Existing canon mechanism examined | Likely overlap to test after acquisition | Boundary / possible additional value |
| --- | --- | --- |
| WRIT-03 — **Name the concrete referent**, *The Sense of Style, ch. 3* | Identifying the object/action a procedural step concerns | Approved terms and their allowed senses may add a more formal procedure-specific constraint. An ordinary explanatory abstraction is not automatically prohibited. |
| WRIT-06 — **Repeat the precise term**, *The Sense of Style, ch. 5* | Stable names when several components/referents are active | A verified dictionary may govern meanings/parts of speech, beyond consistent naming. Do not impose that contract on art interpretation or all public copy. |
| WRIT-71 — **Unpack private knowledge**, *The Sense of Style, ch. 3* | Reader comprehension and needed technical explanation | Procedure audiences may need conditions/order rather than an essay's conceptual development. Exact STE provisions remain unverified. |

CARD-22's named-domain lookup check, linked to WRIT-06 above, supports consulting the actual standard before adopting a vocabulary. Its finite-runtime-catalogue contract remains inert here: an LLM's plausible reconstruction is not the acquired dictionary.

These are deduplication hypotheses, not verified STE rule mappings. The row sources remain Pinker's; they were not retroactively attributed to ASD. STE may contribute a documented procedure/dictionary contract while adding little to general advice already grounded in the writing lexicon.

### Admission conditions and owner handoff

1. The research-corpus owner acquires an official copy through an official channel outside this task. Record publisher/issue/date, acquisition URL/date and any use restrictions. Do not promote a clone as authority.
2. Verify **Issue 9, January 2025** on the document itself. Record the exact file SHA256 and extraction-tool/version/checksum. No full-standard checksum is available from this session.
3. Extract the standard without losing dictionary layout, exceptions, part-of-speech labels, approved senses or cross-references. Preserve page/section/rule/dictionary-entry locators and compare a representative sample against the original PDF.
4. Read prospective rules and their exceptions in context. Ground each proposed distillation in exact rule/entry and page locators; distinguish mandatory provisions, examples and guidance. Keep the separate AI white paper in a separate source record.
5. Deduplicate by **trigger, action, audience and verification**, not by shared words such as “clear.” Prefer adding bounded support to an existing mechanism over creating near-duplicate rules. Where the controlled dictionary adds a distinct obligation, specify the procedural trigger, terminology owner and conformance review needed.
6. Review procedures against the acquired source, with knowledgeable human oversight. Mark essays/editorial art as outside an imposed controlled-language contract unless an explicit later brief changes their purpose. Do not advertise compliance from a surface edit, a readability score, or an AI assertion.
7. Only after those checks should the owner decide admission to the **private research corpus**. Any later published-canon change is a separate review/release task. No corpus content was modified here.

## Outstanding evidence

The asset backlog prioritises current VSW captures, AltContext editor/practice states, PhotoShelter keyboard evidence, Texting Syria exhibition/phone records, current Catch production evidence, and catalogue/credit provenance for all five art files. Catalogue verification should establish whether a reproduction is complete or a detail, title/date/material/institution/credit accuracy, and permitted source attribution. This task preserves the existing material and records the gaps; it does not fabricate assets or claim permissions that were not inspected.
