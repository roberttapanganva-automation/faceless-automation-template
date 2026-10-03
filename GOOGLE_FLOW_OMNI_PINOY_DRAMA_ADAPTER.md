# Google Flow / Omni Flash prompt adapter

Policy: WORKFLOW_RULES.md R04–R10. This adapter explains prompt mapping; model fidelity must be checked in actual renders.

## Mapping

Upload approved scene ingredients. Use their exact filenames without .png in @mentions. Each spoken line has a dedicated image; each shot beat and camera transition names its corresponding image explicitly. Do not use @1, a character's name alone or chronological list position as a substitute for an exact file mention.

## Plain-text example — one spoken line and a silent reaction

Apply the identity and scene population lock in WORKFLOW_RULES.md R07 to direct Flow prompts and JSON handoffs. Explicitly describe the visible cast for each beat. For a beat without background people, use: "Maintain the exact character in @Clip X - Exact Image Name: same face, age, skin tone, hair, body proportions, wardrobe and accessories throughout all motion and cuts. Do not replace, duplicate or morph this character. No additional characters, extras, bystanders, crowd, silhouettes, blurred people, reflections of people or anyone behind the speaking person." Replace the mention with the actual filename. If the approved beat requires supporting characters or a crowd, replace that exclusion with their explicit identities or descriptions, positions and actions, and request no unrequested people.

This is a structure example; replace the line and files with approved story content. It does not prescribe a universal shot pattern.

~~~text
[0.00-8.00s] @Clip 1 - Mother Confronts Son At Kitchen Table: stable close-up, face and mouth visible, approved kitchen wardrobe and lighting. Mother says exactly: “Bakit mo itinago sa akin?” @Clip 1 - Mother Confronts Son At Kitchen Table anchors that spoken line. Cut at 8s from @Clip 1 - Mother Confronts Son At Kitchen Table to @Clip 1 - Son Realizes Mother Knows.
[8.00-10.00s] @Clip 1 - Son Realizes Mother Knows: silent shocked reaction, lips closed, same kitchen continuity. @Clip 1 - Son Realizes Mother Knows anchors the settled ending. Mother alone is visible during her close-up; Son alone is visible during his reaction. Preserve each character's exact face, age, skin tone, hair, body proportions, wardrobe and accessories from their respective @mentioned image across motion and cuts. Do not replace, duplicate or morph either character. Neither beat requires background people: no additional characters, extras, bystanders, crowd, silhouettes, blurred people, reflections of people or anyone behind the visible character. Clear approved dialogue and diegetic ambience only; no generated music, titles, subtitles or watermark.
~~~

For JSON handoffs, place timed directions inside scene_direction and preserve exact reference mappings in shots and audio lines. For TXT/CSV transport, follow VEO_AUTO_HANDOFF.md. Review identity, timing, speech, emotion, continuity and actual attachments before accepting a render. Prompt wording cannot guarantee zero morphing or automatic download naming.

## One ingredient, two angles

Use templates/omni-prompt.template.json for a 6-second example with one dedicated speaking image and two distinct camera angles. Both angles keep the same line-specific identity and the same uninterrupted audio performance. Current Tagpi sources may use one reference even at 10 seconds; keep at least two angles and continuous audio. This changes camera coverage, not the per-line ingredient requirement.

Selected profile and merge/timing/voice-over details: WORKFLOW_RULES.md (unified Tagpi profile).
