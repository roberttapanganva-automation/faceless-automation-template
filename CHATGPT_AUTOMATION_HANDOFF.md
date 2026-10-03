# ChatGPT Automation Image Import Handoff

ChatGPT Automation is the TXT handoff for **image creation only**. It does not generate video, animate images, submit Omni Flash jobs, or replace the Veo Auto workflow.

## Import contract

Create `chatgpt-automation.txt` with one compact JSON object per image prompt and one blank line between objects. Do not use Markdown fences, headings, an outer JSON array, or blank lines inside an object.

Each object contains:

- `image_id`: internal tracking ID;
- `output_filename`: exact intended image filename;
- `aspect_ratio`: `9:16` for scene references;
- `prompt`: the complete ChatGPT image-creation prompt;
- `reference_files`: exact filenames of approved character, location, prop, or continuity references that must be attached.

Scene filenames and granular coverage follow WORKFLOW_RULES.md R04–R05. New files use Clip X - Clean Description.png; existing approved files retain their actual names.

## Export command

```text
node scripts/production.mjs export-chatgpt-txt path/to/production.json
```

The command exports only ready and authorized planned image jobs from a reviewed v2.3 manifest (legacy v2.1 remains compatible). Save stdout as UTF-8 `chatgpt-automation.txt` through an approved file-writing workflow.

## Workflow boundary

1. Approve the script, storyboard, declared image queue, filenames, and prompts.
2. Export `chatgpt-automation.txt`.
3. Import the TXT into ChatGPT Automation for image creation only.
4. Supply every listed reference file; names in the TXT do not upload attachments automatically.
5. Review each actual image for identity, wardrobe, props, location, lighting, hands, text artifacts, and continuity.
6. Record actual output paths and approval evidence.
7. Only after required scene images are approved, prepare the separate Veo Auto TXT for animation/video generation.

Import formatting is locally tested. Authenticated website operation, attachment upload, paid generation, download mapping, and unattended execution are not implied.

Current selected profile: WORKFLOW_RULES.md (Tagpi credit-optimized v2.3).
