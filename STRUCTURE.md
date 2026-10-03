# Project Structure

```text
pages/<page-slug>/
  page.json
  brand-kit.md
  branding-prompts.md
  assets/

series/<series-slug>/
  series-bible.md
  continuity.md
  characters/
  locations/
  episodes/E001/
    script.md
    storyboard.md
    production.json
    images/
    chatgpt-automation.txt
    videos/
    omni-prompts.md
    edit-plan.md
    learning.md

templates/
  brand-kit.template.md
  series-bible.template.md
  continuity.template.md
  episode.template.json
  omni-prompt.template.json
  seedance-30s-scene.template.md
  dola-autopilot.template.txt

schemas/
  episode-v2.schema.json

scripts/
  production.mjs
  chatgpt-automation-format.mjs
  veo-auto-format.mjs
```

Files:
- Root rules: PROJECT_RULES.md, TAGALOG_DIALOGUE_STANDARD.md, SCRIPTWRITING_STANDARD.md, DRAMA_PLAYBOOK.md, CHARACTER_DNA_TOKENS.md, DOLA_PHONETIC_DICTIONARY.md, SHORT_DRAMA_EXAMPLE_BANK.md, PINOY_DRAMA_AUTOMATION_PROFILE.md, GOOGLE_FLOW_OMNI_PINOY_DRAMA_ADAPTER.md, CLIP_ASSEMBLY_TRANSITION_STANDARD.md, CAMERA_SHOTS_AND_ANGLE_CHOICES.md, CHATGPT_AUTOMATION_HANDOFF.md, VEO_AUTO_HANDOFF.md, AUTOMATION.md, PRODUCTION_LEARNING.md, AGENTS.md.
- Project state: project-state.json.
- Setup guide: PAGE_SETUP.md.


## Current series organization — 2026-10-01

Read `SERIES_STATUS.md` and `series/series-registry.json` before resuming a series. Finished/posted series are in `series/completed/<slug>/`; paused series are in `series/postponed/<slug>/`; only active series stay at `series/<slug>/`. The latest user-confirmed status takes precedence over older progress notes above.
