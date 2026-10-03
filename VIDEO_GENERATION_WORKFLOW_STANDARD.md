# Video generation workflow and directory guide

Policy: WORKFLOW_RULES.md R04–R10. This guide owns directory examples and handoff procedure, not another rule hierarchy.

## Directory layout for new episodes

~~~text
episode/
  episode-script.md
  production.json
  reference-images/
    masters/
    4seconds/
    6seconds/
    8seconds/
    10seconds/
  prompts/
    chatgpt-automation.txt
    veo-auto-4s-batch.txt
    veo-auto-6s-batch.txt
    veo-auto-8s-batch.txt
    veo-auto-10s-batch.txt
  videos/
  edit/
~~~

Preserve existing approved layouts; output paths and exact filenames in the manifest remain the lookup source. Use only populated batch files.

## Operator sequence

Read the approved script and storyboard. Separate identity masters from scene ingredients; map every spoken line, critical insert and reaction to a discrete scene image. Select source duration under R06. Populate the corresponding duration folder with approved ingredients and build a clip-to-image mapping.

Export image creation using CHATGPT_AUTOMATION_HANDOFF.md. After reviewing actual images, prepare direct Flow prompts or the Veo Auto format. Verify actual available duration and attachment capacity; split scenes when required coverage exceeds a source's capacity. Supply actual attachments, check queue count and the authorized scope, then review and record downloaded outputs.

Camera choices come from the storyboard, not an automatic motion preset. Refusals and pronunciation issues follow R08. Account limits and interruptions follow R09. Editing follows CLIP_ASSEMBLY_TRANSITION_STANDARD.md.

Before video handoff, apply WORKFLOW_RULES.md R07: explicitly lock each character to the corresponding @mentioned scene image, declare each beat's visible cast and required background population, and exclude extra people when none are required. Scenes requiring a crowd or another character retain their explicitly approved staging. Inspect generated footage for both identity continuity and unwanted background people.

New manifests use v2.3 and explicit mappings. The legacy v2.1 exporter remains compatible with existing records; use AUTOMATION.md for current checks and workflow commands.

Current selected profile: WORKFLOW_RULES.md (Tagpi credit-optimized v2.3).
