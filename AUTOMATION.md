# Local production tools — v2.3 (Tagpi baseline)

Policy: WORKFLOW_RULES.md. These Node.js tools prepare and track local production; actual website generation/import must use the existing authorized tool and subscription.

## Read-only checks and exports

~~~text
node scripts/rules-qa.mjs check
node scripts/production.mjs validate path/to/production.json
node scripts/workflow.mjs qa path/to/production.json
node scripts/workflow.mjs plan path/to/production.json
node scripts/workflow.mjs status path/to/production.json
node scripts/workflow.mjs package-check path/to/production.json
node scripts/production.mjs next path/to/production.json
node scripts/production.mjs export-chatgpt-txt path/to/production.json
node scripts/production.mjs export-veo-txt path/to/production.json
node scripts/production.mjs export-veo-csv path/to/production.json
~~~

Save stdout as the requested Markdown/TXT/CSV file. Relative paths resolve from the manifest directory. Exports contain only ready jobs. Mention text does not upload files.

## Record workflow actions

~~~text
node scripts/workflow.mjs authorize production.json authorization.json
node scripts/workflow.mjs claim production.json claim.json
node scripts/workflow.mjs download production.json download.json
node scripts/workflow.mjs review production.json review.json
node scripts/workflow.mjs fail production.json failure.json
node scripts/workflow.mjs retry production.json retry.json
node scripts/workflow.mjs pronunciation production.json pronunciation.json
node scripts/rules-qa.mjs record "Reviewed reason for this policy/template change"
~~~

Action JSON templates are in templates/workflow-actions/. Supply actual human approval, output/review evidence or failure details. Commands lock and atomically replace the selected manifest; they never publish or start a website generation. A claim records a job as running. A repeated claim reports already_running. Preserve/download to the declared path before recording; archive a rejected actual file before retrying. The tracker records three attempts by default; after the configured limit it blocks the item.

## Current v2.3 checks

Uses schemas/episode-v2.3.schema.json and templates/episode.template.json. It verifies current source tiers, distinct ingredients, dedicated scene-image coverage, explicit per-performance and per-shot mapping, exact canonical lines, clean clip filenames, precise internal timing, speaking-image continuity through angle changes, final edit preservation, authorization scope, reviewed media checksums, continuity QA and final-package completeness. New exports anchor actions, cameras, transitions and spoken turns to actual filenames and request a continuous audio performance.

A one-reference source of any supported tier, including 10 seconds, has at least two distinct camera angles. Ingredient count follows actual beats, with 1–3 allowed. See WORKFLOW_RULES.md for action merges, precise timing, voice-over and batch grouping. Camera shots can reuse the SAME ingredient for the SAME line; separate lines/turns and critical reaction/evidence beats have separate images.

The coverage inventory must be reconciled against the actual approved script; the checker cannot infer omitted prose. Lens appropriateness, visible emotion, actual voice/lip sync, audio continuity and image uniqueness require human/media review. Passing JSON checks is not proof that an extension ran successfully or that a generated result is good.

## Legacy compatibility

v2.1 and v2.2 remain readable and preserve their old checks for existing records. It is not current approval for new production. No episode manifest, image or script is automatically migrated. Start new work with v2.3 or deliberately rebuild a legacy record against the approved script, without fabricating approvals. Draft templates intentionally fail validation until filled with real content.

Old direct CSV converters and v2.1 export commands require --legacy-convert for unchanged archived prompt conversion. They do not establish current policy compliance; new batches use v2.3.

Current selected workflow: WORKFLOW_RULES.md (Tagpi credit-optimized v2.3). Use export-veo-txt or export-veo-csv with optional --references 1|2|3 and --duration 4|6|8|10 filters after validation/authorization. Internal timing can be fractional; source tiers remain 4/6/8/10 seconds.
