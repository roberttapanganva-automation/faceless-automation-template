# Workflow rule changes

Current policy: WORKFLOW_RULES.md.

## 2026-10-02 — Reference identity and conditional background population lock

Per the user's request, every Veo/Google Flow prompt explicitly maintains each character from its scene reference and excludes added background people when the approved beat requires none. Scenes requiring another character or a crowd retain explicitly specified staging. R07 owns this condition; R10 includes visible-cast/background review. Updated the Flow adapter, Veo/video handoff guides, JSON prompt template and production exporter so the lock appears in both plain directions and structured constraints. Existing episode files and media were not rewritten by this workflow update.

## 2026-10-02 — Tagpi workflow profile merged into unified WORKFLOW_RULES.md

Per the user's directive, the Tagpi credit-optimized workflow baseline is now directly consolidated into `WORKFLOW_RULES.md` as the single canonical source of truth to eliminate redundant files and prevent rule contradictions.

- Fully codified beat-based ingredients (R04), one-image multi-angle requirements (R07), continuous audio and voice-over mapping (R08), visual action & prefix merging (R06), and schema v2.3 into `WORKFLOW_RULES.md`.
- Codified standard image folder placement: all generated scene images save straight to the episode root's `images/` directory and root `4seconds/`, `6seconds/`, `8seconds/`, `10seconds/` duration folders (R09).
- Codified clean video import batch standard: video automation files are strictly reference-based (`1ref` and `2ref` batches and plain reference prompts), eliminating redundant duration-only batch files (`veo-auto-4s-batch.txt`, etc.) (R09).
- Preserved `TAGPI_WORKFLOW_PROFILE.md` as a clean compatibility reference pointer linking to `WORKFLOW_RULES.md`.

## 2026-10-01 — user adopts latest Tagpi workflow (v2.3)

The user corrected the source of authority: use the newest rules from Tagpi-tagping Bahay. The previous v2.2 QA incorrectly classified one-reference 10-second Tagpi batches as obsolete. That finding is withdrawn.

- Adopted beat-based 1/2/3 ingredients, including one-reference 10-second sources with at least two angles and continuous audio.
- Adopted compatible action/action and action-prefix/dialogue merges, delivery-based tier selection, exact internal fractional timing and explicit offscreen voice/listener mapping.
- Accepted the Tagpi chronological reference-label filename convention alongside clean descriptive filenames; exact mentions remain required.
- Retained authorization, real output tracking, retry/archive, continuity/voice review and publication checks.
- Preserved v2.2/v2.1 behavior for their historical records; no series artifacts or approvals were silently rewritten.
- Current selected profile: WORKFLOW_RULES.md (unified Tagpi credit-optimized profile). Generated syllable estimates and provider guarantees are not treated as measured facts.

## 2026-10-01 — v2.2 implementation

Authorized by the user's selection of recommendations 1–16 (1415 interpreted as 14 and 15), plus one-reference multishot angles with uninterrupted audio.

- Retained the consolidated rulebook and historical/reference scopes.
- Added at least two distinct camera angles for one-reference 4/6/8-second sources, while retaining distinct images per line/turn/critical beat and 2–3 ingredients for 10-second sources.
- Added current manifest version, explicit beat inventory, line mappings, timing/coverage QA and clean-file checks.
- Added scope-bound batch approvals, idempotent claims, download tracking, checksum-backed reviews, retry limits and retained drafts.
- Added continuity QA, pronunciation evidence records, script-to-image plan export and publication-package checks.
- Added static rule conflict/drift checks and machine-readable revision history in .workflow/rule-changes.jsonl.
- Restricted old direct CSV converters and v2.1 exports to explicitly selected archival conversion; current production uses validated v2.2 exports.
- Existing v2.1 records and approved series artifacts are not migrated automatically.

Previous conflict report: RULES_AUDIT.md. Current implementation/QA: WORKFLOW_QA_REPORT.md. Future edits: run rules-qa check, review its findings, then record a reason for the new baseline. A clean static report does not replace semantic or media review.
