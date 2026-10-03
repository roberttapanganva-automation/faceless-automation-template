# Page 3 workflow implementation and QA — 2026-10-01

> Earlier v2.2 report. The user subsequently adopted Tagpi as the current source of workflow rules. The finding that Tagpi one-reference 10-second sources conflict with policy is withdrawn. Current profile and QA: TAGPI_WORKFLOW_PROFILE.md and TAGPI_WORKFLOW_QA.md.

Current policy: WORKFLOW_RULES.md. Authorized scope: recommendations 1–16, treating “1415” as 14 and 15, plus multishot camera coverage from one reference without interrupting audio.

## Implemented recommendations

| Number | Implementation |
| --- | --- |
| 1 | One canonical WORKFLOW_RULES.md with phase-specific guides referencing it |
| 2 | Historical/reference scopes retained; prior RULES_AUDIT now explicitly marked historical |
| 3 | RULE_CHANGELOG.md plus hashed revision snapshots and reasons in .workflow/rule-changes.jsonl |
| 4 | rules-qa.mjs checks document links, copied operational paragraphs, known conflicting mandates, schema/template agreement and reviewed-baseline drift |
| 5 | Current v2.2 validator and schema support 4/6/8/10 seconds, with 2–3 distinct ingredients for every 10-second source |
| 6 | Explicit beat_id, reference_id, speaker, canonical line and timed audio.lines; no positional inference for current dialogue |
| 7 | Complete declared script-beat inventory; dedicated image IDs/paths/bytes, critical reaction/evidence coverage and final-edit preservation |
| 8 | Clean clip filenames and clip-number agreement; exported actions, cameras, transitions and speech use exact filename mentions |
| 9 | Whole-second source/shot/dialogue/edit timing, correct tiers, full spoken intervals, audio bridge duration/order and no repeated source audio |
| 10 | workflow plan exports the script-to-image sheet with exact line, speaker, emotion, wardrobe, blocking/light, image and status |
| 11 | Content scope hashes reuse unchanged batch authorization and flag changed scope; actual human evidence required |
| 12 | Atomic locked manifest updates, idempotent running claims, actual download paths/hashes and reviewed completion records |
| 13 | Failure reasons/history, three attempts by default, configurable limit 1–10, blocked state and retained rejected-file archives |
| 14 | Eleven continuity/media QA fields in review action templates; actual output and matching checksum/specification required for completion |
| 15 | Pronunciation records require actual audio sample, provider, canonical/spoken forms and review; approved variants need meaning-preservation evidence |
| 16 | Final-package check requires actual movie/cover/caption and requested music/branding, recorded runtime, full QA, review and scoped publication authorization |

## One reference, multiple angles

- One dedicated scene image supports at least two explicitly named distinct camera angles for the SAME line/beat in a 4/6/8-second multishot source.
- A visual cut cannot switch the ingredient during that speaking interval. Every angle/transition is anchored to the same actual file mention.
- Exported prompts request ONE continuous voice performance: no restart, repeat, fade, mute or interruption at an angle cut.
- Separate dialogue lines/turns, critical evidence and punch reactions still need separate images. Ten-second sources still need 2–3 ingredients.
- Actual generated audio, angle plausibility and lip sync must pass media review. A prompt cannot guarantee provider behavior.

## QA results

44 automated tests passed, including legacy compatibility and the new lifecycle. Covered authorization invalidation, one-reference angle rules, wrong speaker/image/line, missing critical beats, copied frames, clipped/repeated speech, review checksums, retry/archive behavior, concurrent updates, pronunciation evidence, publication completeness and guarded historical converters.

Additional CLI smoke checks passed for examples/v2.2/production.json: validation, planning-sheet output and saved-state status. The example correctly remains unauthorized and produces no media. Current static rule QA reports no errors; it retains a warning that semantic and actual-media review are still required.

The follow-up QA found and fixed:

1. Different filenames could conceal identical scene-image bytes.
2. A final trim could retain the line while dropping a critical reaction.
3. Starting a job could collide with an existing output file.
4. Publication still expected an obsolete duplicate final-review field.
5. Old direct CSV converters could bypass current validation; they now require explicit archival-conversion intent. Current batches use v2.2.

## Active-series findings requiring production reconciliation

Read-only scan: .workflow/active-series-qa.json. None of the six active series had a v2.2 production manifest at scan time. Existing scripts, media, plain prompts and approvals were preserved rather than automatically migrated or reapproved.

| Active series | Current-record action before using the upgraded workflow |
| --- | --- |
| Ang Bawi ng Tagapagmana | Reconcile its actual approved script/reference map into a v2.2 inventory |
| Pekeng Kasal | Reconcile existing scene-reference manifests and dialogue against v2.2 |
| Pirma ni Tatay | Reconcile actual scene-image results, current script and approval evidence |
| Kwento ng Isang Single Mother | Build the inventory and jobs for the selected next episode |
| Nilunok ang Dangal sa Mansyon | Build the inventory and jobs for the selected next episode |
| Tagpi-tagping Bahay | Reconcile both older handoff variants; its one-reference E001 10-second batch contains Clips 1, 2 and 13 and conflicts with current 2–3-ingredient coverage |

For Tagpi-tagping Bahay, the same three 10-second sources also appear in the combined one-reference handoff; those are duplicate representations, not six additional sources. Older one-reference 4/6/8-second prompts also need two-angle and continuous-audio review before reuse. Current tools cannot certify plain legacy prompts as complete coverage. Preserve exact approved script content and actual legacy filenames during deliberate reconciliation; do not invent approvals.

## Practical verification limits

Local tooling is implemented and tested. This work did not run an authenticated generation extension, create real images/videos, verify the installed provider's duration/attachment options, assemble a real movie or publish. Those actions require the actual selected episode and its existing authorization. Coverage inventory must be checked against the full approved script; fields marked pass must reflect actual media review. Final duration is a reviewed recorded value, not an automatically measured video stream.

## Recovery and usage

Original workflow snapshot: D:/Faceless Automation Content - Page 3/.workflow-backups/2026-10-01-1790800097845/manifest.json. It contains pre-upgrade file hashes and corresponding copies. Restore individual files deliberately; do not replace live project-state or production progress with an old snapshot.

Use WORKFLOW_QUICKSTART.md and AUTOMATION.md. New work starts from templates/episode.template.json (v2.2). Run rules-qa check after workflow edits; record the reviewed reason for a new baseline. Legacy v2.1 records remain compatible for historical checks/conversion, with no automatic series migration.
