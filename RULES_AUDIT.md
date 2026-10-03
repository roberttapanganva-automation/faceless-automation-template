# Page 3 rules audit — 2026-10-01

## 2026-10-01 thumbnail label correction

The user corrected the Fake Marriage Episode 1 thumbnail: it must say `EPISODE 1`, not `BAHAGI 1`, and requested a durable thumbnail creation rule to prevent recurrence. Added WORKFLOW_RULES.md R11: exact approved title and `EPISODE N` mapping, clean image-model artwork followed by deterministic typography, visual verification of each final PNG, and preservation of superseded renders. Corrected the four Fake Marriage episode covers; the full-series label remains `BUONG SERYE`.

> Historical cleanup findings. The legacy tooling gap below was addressed by the later v2.2 implementation. Current status: WORKFLOW_QA_REPORT.md and WORKFLOW_RULES.md.

## Result and scope

Audited root project instructions, state rule flags, provider/automation guides, creative standards, reference blueprints and reusable templates. Consolidated current workflow policy in WORKFLOW_RULES.md. Removed copied universal blocks from operational guides; retained creative catalogues and clearly scoped historical observations. Approved series artifacts, actual media, episode scripts, series status and saved production approvals were not migrated.

Explicit user instructions supplied in this session resolve granular coverage, 2–3 ingredients per 10 seconds, clean clip filenames and exact per-beat/per-line mentions. Other resolutions reconcile project instructions by scope. No policy claim below certifies provider behavior or viral performance.

## Duplicates, overrides and conflicts

| Issue | Previous sources / conflict | Current resolution |
| --- | --- | --- |
| Competing authority ladders | AGENTS, PROJECT_RULES, SOURCE_OF_TRUTH used different precedence and repeated immutable locks | R01; explicit user request first, one canonical workflow policy |
| Repeated universal blocks | AGENTS, project rules, profile, adapter, Veo guide, video guide | One policy in WORKFLOW_RULES; other files own interfaces, examples or phase outputs |
| Shared image across speakers/lines | Adapter shared-frame exception, Veo subclips, Dola template | R04; discrete image per spoken line/turn, critical insert and reaction |
| Conflicting 10-second ingredient counts | User 2–3; state 3–5; AGENTS/template exactly 3; dialogue-only exception 1–2 | R04; 2–3 distinct chronological ingredients; split when coverage exceeds capacity |
| Reference ordinal filename mandate | Image/Veo handoffs required 1st/2nd/3rd Reference | R05; clean Clip Number - Description for new images; preserve exact approved legacy names |
| Image shorthand vs exact mentions | Character DNA and Seedance @1/@2 vs actual filenames | R05; actual filename mention on each beat, transition and spoken line |
| Positional dialogue mappings | Legacy exporter inferred image mapping by turn index | Manual explicit mapping for new handoffs; legacy tool gap documented below |
| Silent generation vs insert length | Strict 4-second generation vs strict 1-second b-roll | R06; 4-second silent source, normally 1-second final evidence insert |
| Fractional vs integer timing | Assembly and templates fractional overlaps/holds vs validator whole seconds | R06; whole-second planned boundaries; observed reference timings remain historical |
| Duration-driven speech vs fixed template | Long-line rules, 10-second subclips and Seedance 30-second autopilot | R06; natural delivery chooses 6/8/10; split longer speech without omitting lines |
| Static camera vs compulsory motion | Static-only speech locks vs mandatory zoom/handheld/single-reference motion | R07; stable speech framing, optional motivated motion; no forced camera action |
| Universal optics | 85mm/f1.8 and 3-layer depth required in every prompt | R07; creative choices by story, evidence and location |
| Timestamp first vs context preamble | Provider wrapper before timing vs zero-preamble mandate | R07; timing first inside scene_direction; scene context inside timed text |
| Timestamp vs ordinal clip prefix | Veo demanded 1st Clip prefix and claimed automatic download order | R07/R09; scene timestamps, clip order in records, actual downloads inspected |
| JSON vs prompt opening character | Entire JSON object cannot start with a timestamp | R07; requirement applies to scene-direction string, transport remains compact JSON |
| Script preservation vs blanket phonetic replacement | Dictionary said replace in scripts; Veo/video said every field; dialog guide duplicated list | R08; canonical script retained; reviewed pronunciation variants only in spoken content |
| Refusal repair vs cache bypass | AGENTS, video guide and learning proposed phrase obfuscation, FlipX/crop and cache guarantees | R08/R09; withdrawn bypass protocol, real content repair and recorded failure |
| Minor safety vs token bans/context guarantees | Old child guard mixed legitimate safety with blanket harmless-word bans, forced daytime wrappers and unverified tray-cache claims | R08; age-appropriate actual content, accurate scene context, no acceptance guarantees |
| Text DNA vs actual scene images | Playbook/script standard text-only lock; Lihim cast copied globally | R03/R04; traits supplement actual images, named cast scoped to its series |
| Repeated approval vs existing authorization | Multiple step gates and sample-only/infinite autopilot template | R09; record existing scope, request changes only when needed, no fabricated flags |
| Delete old references vs retain drafts | Cleanup/replacement instructions conflicted with archive/continuity | R09; retain drafts; deletion requires explicit authorization for identified files |
| Required runtime/scene count | Historical 30s/150s and fixed beat formulas | R02/R03; format per deliverable; creative formulas optional |
| Generated score vs no generated music | Narration/reel reference soundtrack and Seedance synthetic score instructions | R08; diegetic generation audio, requested music in post |
| Stale Page setup and active series | START_HERE named past active work despite registry and saved branding | R02; resume state and registry; Page setup conditional |
| Cross-project handoff | Ako Muna Sana prompt looked like a live Page 3 task | Historical scope banner; use current registry and approved series records |
| Alternate provider autopilot | Seedance2.5, fixed30s, NotifyHuman, two concurrent jobs, silent infinite retries | Retired video template; Dola template is scriptwriting-only; actual tested tools determine capability |
| Quality/viral guarantees | Zero drift, exact cache behavior, perfect voices/attention, viral formula | R10; quality targets require media QA, performance needs actual evidence |
| Template version mismatch | Episode template2.0 vs schema/CLI2.1 | Template2.1; incomplete draft remains intentionally unapproved |
| Template self-contradiction | One shot declared but three shot objects, dialogue_isolated and fractional timing | Omni example rebuilt with matching counts, allowed audio mode, integer timing and explicit mentions |

## Tooling gap retained deliberately

The user requested rule cleanup and conflict checking. Existing production.mjs and episode-v2.schema.json remain legacy v2.1 tools; their numeric reference rules and positional audio mapping are not upgraded here. The new rulebook cannot make those checks enforce current policy. AUTOMATION.md now labels the exact differences and requires reviewed manual handoffs for unsupported jobs. Passing legacy validation is insufficient for new production QA. A future versioned upgrade should add the 4-second tier, 2–3 references for all 10-second sources, explicit line mappings and dedicated-scene checks with compatibility tests.

Structural tools also mandate POV/b-roll in every manifest even when not motivated by a deliverable. That is another legacy constraint, not a creative command to add unrelated footage. Provider interface availability and attachment limits need actual verification during a production batch.

## Preserved reference material

Camera descriptions, slang banks, optional story examples and observed reference timelines remain available. Scope banners explicitly supersede old technical mandates. PRODUCTION_LEARNING is a historical log; the unsubstantiated cache-bypass instructions were removed from active text. CHARACTER_DNA_TOKENS applies to Lihim ng Kapatid only. No historical asset filename was changed.

## Recovery and change record

Original snapshot: D:/Faceless Automation Content - Page 3/.rule-cleanup-backups/2026-10-01-1790797738432. The snapshot includes backup-manifest.json with original SHA-256 hashes. Restore individual rule files deliberately; never restore project-state.json wholesale over newer production progress.

Changed files: PAGE_SETUP.md, AGENTS.md, AUTOMATION.md, CAMERA_SHOTS_AND_ANGLE_CHOICES.md, CHARACTER_DNA_TOKENS.md, CHATGPT_AUTOMATION_HANDOFF.md, CHATGPT_HANDOFF_PROMPT.md, CINEMATIC_NARRATION_REEL_BLUEPRINT.md, CLIP_ASSEMBLY_TRANSITION_STANDARD.md, DOLA_PHONETIC_DICTIONARY.md, DRAMA_PLAYBOOK.md, GOOGLE_FLOW_OMNI_PINOY_DRAMA_ADAPTER.md, PINOY_DRAMA_AUTOMATION_PROFILE.md, PRODUCTION_LEARNING.md, PROJECT_RULES.md, SCRIPTWRITING_STANDARD.md, SHORT_DRAMA_EXAMPLE_BANK.md, SOURCE_OF_TRUTH.md, START_HERE.md, TAGALOG_DIALOGUE_STANDARD.md, VEO_AUTO_HANDOFF.md, VIDEO_GENERATION_WORKFLOW_STANDARD.md, VIRAL_REEL_REVERSE_ENGINEERING_BLUEPRINT.md, WORKFLOW_RULES.md, project-state.json, templates/dola-autopilot.template.txt, templates/episode.template.json, templates/omni-prompt.template.json, templates/seedance-30s-scene.template.md, RULES_AUDIT.md.

## Verification

Parsed both edited JSON templates and project-state.json. The 15 existing local tests passed. Compared the 11 scripts/schema/test files against the snapshot: unchanged. Other top-level state fields were unchanged except series records, which received concurrent production updates; the cleanup reread and retained those records rather than restoring the old snapshot. Only workflow metadata and rule flags were changed by the cleanup. Rechecked active writing checklists for obsolete one-image, text-only DNA and blanket phonetic mandates; removed those remaining copies. These checks verify the cleanup and legacy compatibility, not provider runtime behavior.

Latest replacement AGENTS instructions received during cleanup: the three universal image/filename/mention rules remain authoritative. Removed the superseded session RTK include from the Page 3 entry point. No series/media migration was performed.
