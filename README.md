# Faceless Drama Page Starter Template

Production-ready starter template for launching, managing, and automating faceless vertical drama Facebook pages and episodic short-video series.

Equipped with the canonical **Tagpi Credit-Optimized Workflow (v2.3)**, cinematography standards, prompt automation templates, dialogue rules, reverse-engineering frameworks, and automated QA suites.

---

## 📁 Workspace Structure

```text
Faceless Automation Content - Template/
├── pages/                             # Facebook page profiles & branding kits
│   └── <page-slug>/
│       ├── page.json                  # Page metadata & configuration
│       ├── brand-kit.md               # Visual tone, color palette & typography
│       ├── branding-prompts.md        # Profile & cover generation prompts
│       └── assets/                    # Approved avatars, banners & watermarks
│
├── series/                            # Episodic drama shows & storylines
│   └── <series-slug>/
│       ├── series-bible.md            # Lore, world rules, logline & character cast
│       ├── continuity.md              # 180° axis, wardrobe, & clip chaining log
│       ├── characters/                # 4-view model reference character sheets
│       ├── locations/                 # Setting & environment reference prompts
│       ├── props/                     # Story props & visual tokens
│       └── episodes/<episode-id>/     # Scripts, storyboards, manifests & renders
│
├── reverse engineer/                  # Viral short drama deconstruction & blueprints
│   ├── REVERSE_ENGINEERING_ANALYSIS.md
│   ├── GIGIL_STORIES_REVERSE_ENGINEERING_AND_ARTSTYLE_GUIDE.md
│   ├── AUTO_CHATGPT_IMAGE_PROMPT_PLAIN_ENGLISH.md
│   └── VIDEO_7_ANALYSIS_AND_TAGALOG_SCRIPT.md
│
├── templates/                         # Reusable prompt & metadata templates
│   ├── brand-kit.template.md
│   ├── continuity.template.md
│   ├── character-sheet.template.md
│   ├── series-bible.template.md
│   ├── seedance-30s-scene.template.md
│   ├── dola-autopilot.template.txt
│   ├── episode.template.json
│   ├── omni-prompt.template.json
│   ├── page.template.json
│   └── workflow-actions/
│
├── schemas/                           # Strict JSON schemas for manifest validation
│   ├── episode-v2.schema.json
│   ├── episode-v2.2.schema.json
│   └── episode-v2.3.schema.json
│
├── scripts/                           # Production automation, exporters & QA tools
│   ├── workflow.mjs                   # Main CLI entry point
│   ├── production.mjs                 # Batch generation & pipeline runner
│   ├── rules-qa.mjs                   # Static rule drift & conflict checker
│   ├── export-tagpi-csv.mjs           # Tagpi CSV exporter
│   ├── export-veo-csv-e001.mjs        # Veo batch exporter
│   ├── chatgpt-automation-format.mjs  # ChatGPT image prompt formatter
│   └── veo-auto-format.mjs            # Veo prompt formatter
│
├── tests/                             # Automated test suite (56 tests)
├── examples/                          # Reference manifest implementations (v2.2 & v2.3)
├── .workflow/                         # Rule change ledger & baseline configs
│
├── assets/                            # Brand assets & reference evidence (.gitkeep)
├── bgm/                               # Background music tracks (.gitkeep)
├── sound fx/                          # Foley & sound effects (.gitkeep)
├── reference-evidence/                # Visual benchmarks (.gitkeep)
├── scratch/                           # Draft notes & experimental scratchpads (.gitkeep)
│
├── WORKFLOW_RULES.md                  # Unified Tagpi credit-optimized master rulebook (v2.3)
├── SCRIPTWRITING_STANDARD.md          # 7-beat episodic scriptwriting standard
├── CAMERA_SHOTS_AND_ANGLE_CHOICES.md  # Vertical cinematography & camera angles
├── DRAMA_PLAYBOOK.md                  # Counterpoint betrayal & hook mechanics
├── AUTOMATION.md                      # End-to-end automation handoff protocols
├── PAGE_SETUP.md                      # Step-by-step Facebook page setup guide
├── TAGALOG_DIALOGUE_STANDARD.md       # Natural Tagalog dialogue & pacing rules
├── DOLA_PHONETIC_DICTIONARY.md        # AI voice synthesis phonetic spelling guide
├── CHARACTER_DNA_TOKENS.md            # Consistent character visual DNA tokens
└── project-state.json                 # Project state tracker & configuration
```

---

## ⚡ Quickstart: Launching a New Page & Series

### 1. Facebook Page Setup
1. Consult [PAGE_SETUP.md](PAGE_SETUP.md) for step-by-step guidance.
2. Initialize `pages/<page-slug>/` using `templates/page.template.json` and `templates/brand-kit.template.md`.
3. Update `project-state.json` with the active page slug and genre settings.

### 2. Series Creation
1. Create a show folder under `series/<series-slug>/`.
2. Copy `templates/series-bible.template.md` to `series/<series-slug>/series-bible.md`.
3. Copy `templates/continuity.template.md` to `series/<series-slug>/continuity.md`.
4. Establish 4-view character sheets in `series/<series-slug>/characters/`.

### 3. Episode Scripting & Production
1. Write the episode following `SCRIPTWRITING_STANDARD.md` and `DRAMA_PLAYBOOK.md`.
2. Configure scene prompts and shot durations in `episode.template.json` (Schema v2.3).
3. Validate and export batches:
   ```powershell
   # Validate rule consistency
   node scripts/rules-qa.mjs check

   # Run automated test suite
   node --test tests/*.test.mjs
   ```

---

## 🛡️ Core Rules & Standards

* **Platform & Format:** 9:16 vertical video optimized for mobile retention.
* **Manifest Profile:** `tagpi_credit_optimized` (Schema v2.3).
* **Cinematography:** Multi-angle coverage for 1-reference shots, strict 180° axis preservation, and distinct camera angles per speaking turn.
* **Audio & Dialogue:** Uninterrupted spoken lines, closed-mouth listeners during offscreen speech, and phonetically verified synthesis.

Consult [WORKFLOW_RULES.md](WORKFLOW_RULES.md) for complete details.
