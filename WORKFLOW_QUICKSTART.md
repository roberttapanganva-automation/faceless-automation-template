> Location: run these commands from D:/Drama Content Hub/workflow/. From the hub root, use tools/workflow.mjs and tools/production.mjs with manifest paths relative to that root. Series content is shared under ../series/.

# Using the Page 3 workflow

Policy: WORKFLOW_RULES.md. Start new work with templates/episode.template.json (v2.3). Do not copy approval flags from another episode.

1. Read the actual approved script and list every spoken turn, critical reaction and evidence insert in script_beats. Reconcile this inventory against the script and record the review. For offscreen speech, record its actual speaker and the visible listener separately. Give each beat a dedicated scene image, emotion, wardrobe, blocking and lighting.
2. Define jobs, explicit audio.lines and shot reference_id/angle fields. A one-reference source, including 10 seconds uses at least two distinct angles; the same line's ingredient stays in use through its speaking interval. Ingredient count follows actual chronological beats; see WORKFLOW_RULES.md. Split excess beats into additional clips.
3. Build edit rows with approved precise trims. To bridge another source's full speech over an insert, supply audio_source, audio_in and audio_out for that row. Those times must match the visual row's length and keep the original audio order. No approved line or critical evidence/reaction may disappear.
4. Run production validate and workflow qa. Export workflow plan to a Markdown sheet for review. A check verifies declared coverage; it cannot discover a line omitted from the inventory.
5. Record actual batch authorization using workflow authorize and an action-data JSON file. Unchanged scope reuses approval. Changed content/files invalidate relevant approval hashes.
6. Claim a ready item before using the actual authorized generation tool. The claim tracks state; it does not open a browser or generate media. Create its declared destination folder, copy the actual download to the exact declared filename, then record download.
7. Compare the media to the mapped beat and complete all continuity QA fields. Record review with evidence. A failed image/video goes through fail and retry; move a rejected actual file to the retained draft archive before retrying. Existing files are never overwritten by a new claim.
8. Generate/review video only after its ingredients are reviewed. Check the actual audio across every angle cut. Prompt instructions are not proof of uninterrupted speech.
9. Assemble the final movie. Populate final_package with movie, cover, caption, requested music/branding, actual runtime, complete QA and review evidence. Run package-check before recording actual publication authorization.
10. Check rules after any workflow edit; record the reviewed reason in rules-qa's history. Use WORKFLOW_QA_REPORT.md to see remaining media/provider checks.

## Commands to try safely

~~~text
node scripts/production.mjs validate examples/v2.3/production.json
node scripts/workflow.mjs plan examples/v2.3/production.json
node scripts/workflow.mjs status examples/v2.3/production.json
node scripts/rules-qa.mjs check
~~~

For a current one-reference 10-second example use examples/v2.3/production.json. The older v2.2 example has no approved batches and no generated files. Its valid six-second structure demonstrates one image, two camera angles and one audio line; status correctly requests authorization. Production action JSON formats live under templates/workflow-actions/. See AUTOMATION.md for all commands.

The current default is the Tagpi v2.3 profile. New one-reference 10-second sources, offscreen voice-over and merged fractional action prefixes are valid with explicit planning and uninterrupted audio.
