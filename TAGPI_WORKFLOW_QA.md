# Tagpi workflow adoption QA — 2026-10-01

Current authority: WORKFLOW_RULES.md (incorporating the unified Tagpi baseline). The user selected the latest Tagpi-Tagping Bahay workflow as the Page 3 baseline. New manifests use v2.3 with `tagpi_credit_optimized`.

## Source and corrections

Reviewed Tagpi E001's current image-reference map, storyboard and duration/reference-count batches. The optimized episode describes 14 source clips, 19 ingredients and 104 seconds. These are episode-specific counts, not universal targets.

- Removed the duration-only requirement for two or three references on every 10-second source. One dedicated image can cover one continuous performance, including 10 seconds.
- Retained the user's additional requirement: every one-reference source must plan at least two distinct camera angles and one uninterrupted audio performance.
- Adopted compatible visual/action-prefix merges, delivery-based 4/6/8/10-second tiers, precise internal timing, explicit offscreen-speaker/listener mapping, and a reason for longer silent holds.
- Accepted Tagpi's ordinal reference filenames while preserving exact filename mentions and rejecting technical scene codes.
- Added ingredient-count and duration export filters. Distinct critical beats still require dedicated coverage.

## Verification

All 55 automated tests passed. Coverage includes legacy version compatibility, one-reference 10-second sources, distinct angles, fractional timing, offscreen dialogue, exact filename mentions, export filtering, approval invalidation, file checksums, safe retries and preservation of complete dialogue through edits.

`node scripts/workflow.mjs qa examples/v2.3/production.json` passes. This is a synthetic planning example with no generated media or production approvals.

The project state selects the current profile. Earlier quota-related findings are withdrawn; the historical v2.2 QA report remains available as an audit record.

## Remaining production checks

The original series scripts, prompts and media were preserved. Existing Tagpi one-reference prompts still need explicit two-angle instructions and continuous-audio review before generation. Adopting their workflow does not certify those prompts or clips automatically.

Syllable-rate estimates are planning aids. Actual delivery speed, pronunciation, identity consistency and uninterrupted audio must be checked on real media. No provider execution or media generation was performed during this rules update.

Pre-adoption backup: `.workflow-backups/tagpi-adoption-1790802491503/`.
