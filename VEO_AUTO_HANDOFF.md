# Veo Auto Import Handoff

This handoff is for animation/video generation only. Image creation uses the separate ChatGPT Automation TXT defined in `CHATGPT_AUTOMATION_HANDOFF.md`.

Basis checked 2026-09-09: https://github.com/trgkyle/veo-automation-user-guide
The guide labels itself v3.1.7; the supplied screenshots show v3.4.3. The documented import convention matches the visible UI. Runtime behavior of the installed version has not been tested here.

## Import contract
Use plain TXT with one compact JSON object per prompt and a blank line between prompts. Do not put blank lines inside an object, Markdown fences, headings or an outer JSON array into the import text. JSON.stringify escapes dialogue newlines so they cannot accidentally split a prompt.

CSV alternative: columns clip_id,prompt, one quoted JSON string per prompt cell. Select the prompt column in the extension preview. The clip_id column is local tracking metadata, not a required extension field. Do not import the local export-video queue wrapper.

Commands (stdout; save as UTF-8 TXT/CSV through an approved file-writing workflow):

```
node scripts/production.mjs export-veo-txt path/to/production.json
node scripts/production.mjs export-veo-csv path/to/production.json
```

Both export only ready, authorized video jobs and reuse existing validation. They include clip_id, reference filenames, exact dialogue and shot timing. A name in text does not upload a file.

The prompt exporter includes the WORKFLOW_RULES.md R07 identity and conditional scene population lock in scene_direction and constraints. Before export, specify each beat's visible cast and any required background characters/crowd in its scene direction or shot action. Direct plain-text prompts must carry the same lock; use the no-background-people wording from GOOGLE_FLOW_OMNI_PINOY_DRAMA_ADAPTER.md only when that beat requires none. Verify actual renders for added people as well as identity drift.

## Operator setup
Use the existing Flow project and select Omni Flash, vertical 9:16, and the approved duration supported by the actual interface (planned tiers: 4, 6, 8 or 10 seconds) for each source (not Concat). Begin with one concurrent prompt and one output per prompt for a controlled import test. Inspect the queue count before Run. These are suggested test settings, not verified account settings.

Text to Video suits prompt tests. For production identity references, choose Ingredients to Video or the required frame workflow and supply the actual images. Register/scan characters and confirm matching names if using auto-add character. Match speaker names to configured voices if using auto-add voice. The screenshots show those toggles off; enabling them requires actual configured references. Include approved Flow character names and exact reference filenames in scene_direction; IDs alone may not match.

Save to folder is a subfolder under Chrome's Downloads, not an absolute project path. After download, inspect and record actual output filenames in the episode. Do not assume auto-renaming equals our job IDs.

## Verification boundary
Documented formatting and local serialization tests are complete. Actual extension import, matching of characters/voices, generation and download mapping remain to be tested with a small authorized batch. The repository is a user guide, not inspected extension source code. No installation, setting changes, paid generation or Run action was performed by this handoff.


## Current production policy

Apply WORKFLOW_RULES.md R04–R10 to every prompt string and attachment. Use actual file mentions, preserve approved lines, distinguish source duration from the edit and verify real downloads. Use v2.3 for current coverage and continuous-audio mappings; v2.1 remains legacy-compatible. See AUTOMATION.md. Old ordinal clip prefixes do not guarantee downloaded filenames.

Current selected profile: WORKFLOW_RULES.md (Tagpi credit-optimized v2.3).
