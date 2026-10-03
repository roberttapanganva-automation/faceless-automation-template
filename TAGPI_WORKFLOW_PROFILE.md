# Tagpi workflow profile — Unified into WORKFLOW_RULES.md

> Scope: Reference

The Tagpi-tagping Bahay credit-optimized workflow profile has been fully merged into the canonical rulebook: [WORKFLOW_RULES.md](WORKFLOW_RULES.md).

## Unified canonical workflow

Per the user's directive, the Tagpi workflow rules are now directly consolidated inside [WORKFLOW_RULES.md](WORKFLOW_RULES.md) to maintain a single authoritative source of truth and eliminate rule contradictions:

1. **Beat-Based Ingredients (R04)**: Ingredient count follows actual narrative beats rather than arbitrary duration quotas. Sources (including 10-second sources) may use 1 dedicated ingredient for a continuous performance, or 2–3 ingredients for distinct chronological beats.
2. **One Image, Multiple Angles (R07)**: Every 1-reference source plans at least two distinct camera angles while maintaining identical character identity, wardrobe, lighting, blocking, and screen axis.
3. **Continuous Audio (R08)**: Visual angle transitions must maintain ONE uninterrupted audio performance without restarting, repeating, muting, fading, or clipping dialogue.
4. **Action & Prefix Merging (R06)**: Compatible consecutive visual actions merge into a 4-second source; action setups (such as entry or prop-drop) merge into 6/8/10-second spoken sources.
5. **Voice-Over Mapping (R08)**: Offscreen dialogue explicitly maps the speaking character and the visible listening character, keeping visible mouths closed (`visible_mouths_closed: true`).
6. **Standard Image Folder Delivery (R09)**: All generated scene images are saved straight into the episode's `images/` directory and root duration folders (`4seconds/`, `6seconds/`, `8seconds/`, `10seconds/`).
7. **Clean Video Import Batches (R09)**: Video automation import files are strictly separated by reference count (`veo-auto-1ref-<tier>-batch.txt`, `veo-auto-2ref-<tier>-batch.txt`), eliminating redundant duration-only batch files.
8. **Technical Schema v2.3**: Manifests use schema v2.3 with `tagpi_credit_optimized`.

Refer directly to [WORKFLOW_RULES.md](WORKFLOW_RULES.md) for full authoritative production policy and requirements.
