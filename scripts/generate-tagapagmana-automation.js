const fs = require('fs');
const path = require('path');

const epDir = 'D:/Drama Content Hub/series/active/ang-tunay-na-tagapagmana/episodes/E001';

const clips = [
  {
    id: '01',
    tier: 4,
    refName: 'Clip 01 - 1st Reference - Ancestral Sala With Framed Portrait',
    charRefs: ['ancestral-portrait-identity.png', 'noel-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still, not a casting sheet, diptych, collage or split screen. Scene: Wide master interior of rustic ancestral living room with aged dark mahogany walls and capiz shell windows. On a polished console table sits the framed portrait of Lolo Tomas and Lola Elena flanked by fresh white lilies and a small flickering candle. In the deep background, Noel in his plain white t-shirt quietly wipes the dining table with a damp cloth. Soft morning sunlight filters through windows. Realistic atmospheric haze, natural skin tones, no text, no watermark.',
    veoDirection: 'In the ancestral living room, camera executes a slow, reverent push-in toward the ornate framed portrait of Lolo Tomas and Lola Elena on the console table. In the deep background, Noel in his plain white t-shirt gently wipes the wooden table. Character Consistency Lock: Preserves Noel identity and the exact ancestral portrait 100%. 35mm f/2.8 lens, natural morning interior lighting, audio is strictly diegetic room ambience and birds chirping outside only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '02',
    tier: 10,
    refName: 'Clip 02 - 1st Reference - Vivian Slams Table Demanding Sale',
    charRefs: ['vivian-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Dedicated dialogue portrait: Tita Vivian standing beside the dark mahogany dining table, slamming her right hand onto the yellowed sketch plan of the farm. Sharp high cheekbones, cold piercing hooded dark eyes, sneering mouth parted speaking fiercely. Emerald-green silk blouse, high-waisted beige slacks, chunky polished gold hoop earrings, gold chain necklace, styled layered black bob with auburn streaks. Natural skin texture, dramatic indoor lighting, no text, no watermark.',
    veoDirection: 'At the dining table, camera executes a tight motivated push-in toward Tita Vivian as she slams her right hand onto the sketch plan of the five-hectare land. Her facial performance is cold, arrogant, and commanding: lips move in synchronized timing to her spoken words in an authoritative mature Filipina voice: "Ako ang panganay kaya ako ang masusunod! Ibebenta natin nang buo itong limang ektarya sa housing developer para tig tatlong milyon tayo!". Character Consistency Lock: Vivian matches her reference image 100%, strictly preserving her emerald-green silk blouse, gold hoop earrings, styled bob, and aristocratic sneer. 85mm f/1.8 lens, audio is strictly clear spoken dialogue and table slam sound only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '03',
    tier: 8,
    refName: 'Clip 03 - 1st Reference - Hector Demands Quick Cash',
    charRefs: ['hector-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Dedicated dialogue shot: Tito Hector leaning forward aggressively across the wooden table, slamming his palm down. Weathered olive-tan skin, prominent dark under-eye bags, hollowed temples, sharp aquiline nose, tense patchy stubble along jawline. Unbuttoned tropical leaf printed resort shirt over black tank top, cargo shorts, worn leather watch. Raw desperate gambling stress in his eyes, speaking angrily. Natural indoor lighting, no text, no watermark.',
    veoDirection: 'Across the wooden table, camera executes a dynamic whip pan to Tito Hector leaning forward aggressively, slamming his heavy palm onto the wood. His dark eye bags twitch with gambling stress as his lips move in sharp synchronization to his spoken words in a raspy, pressured Filipino male voice: "Matagal pa iyang developer Vivian! Kailangan ko ng pera ngayon din! Hatiin na natin ang lupa para maibenta ko agad ang parte ko!". Character Consistency Lock: Hector matches his reference image 100%, strictly preserving his unbuttoned tropical shirt, black tank top, aquiline nose, and stressed stubble. 50mm f/2.0 lens, audio is strictly clear spoken dialogue and hand slap sound only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '04',
    tier: 8,
    refName: 'Clip 04 - 1st Reference - Grace Demands Ancestral House',
    charRefs: ['grace-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Dedicated dialogue shot: Tita Grace tilting her chin haughtily, rolling her sharp cat-like eyes. Smooth radiant light-kayumanggi complexion, high dramatic arched eyebrows, contoured cheekbones, full glossy rose-pink lips parted mid-sentence. Sleeveless pastel-pink tailored linen jumpsuit with slim belt, oversized tortoiseshell sunglasses perched on voluminous wavy ash-brown hair, crimson red manicured nails gesturing dismissively. Natural indoor lighting, no text, no watermark.',
    veoDirection: 'In the dining room, camera executes a slow subtle pull-out framing Tita Grace as she crosses her arms and rolls her eyes haughtily, gesturing with her crimson manicured nails. Her lips move in perfect synchronization to her spoken line delivered in a sassy, entitled Filipina socialite voice: "Wala kayong pakialam sa halaga ng bahay na ito! Sa akin dapat mapunta ang ancestral house dahil ako ang paboritong anak ni Tatay!". Character Consistency Lock: Grace matches her reference image 100%, strictly preserving her pastel-pink jumpsuit, sunglasses on head, wavy ash-brown hair, and dramatic brows. 85mm f/1.8 lens, audio is strictly clear spoken dialogue only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '05',
    tier: 6,
    refName: 'Clip 05 - 1st Reference - Noel Drops Cleaning Rag Stepping Forward',
    charRefs: ['noel-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Low-angle medium shot: Noel stepping into the foreground, dropping his damp cloth onto the wooden table with quiet solemnity. Warm golden-kayumanggi complexion, expressive resilient dark brown eyes filled with grief and rising outrage, clean sculpted jawline tight with emotion. Plain crisp white crewneck t-shirt, relaxed faded blue denim jeans. Short neat black hair with clean side part. Natural studio-quality cinematic drama lighting, no text, no watermark.',
    veoDirection: 'Stepping from the shadows of the living room, camera executes a slow low-angle tilt-up as Noel drops his damp cleaning cloth onto the wooden table with a quiet thud. His jaw clenches and his eyes burn with righteous grief as his lips move in synchronized timing to his spoken line in a firm, sorrowful young Filipino voice: "Apatnapung araw pa lamang ang nakalipas mula noong ilibing sina Lolo at Lola!". Character Consistency Lock: Noel matches his reference image 100%, strictly preserving his white t-shirt, blue jeans, and heartfelt expression. 50mm f/1.8 lens, audio is strictly clear spoken dialogue and cloth drop sound only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '06',
    tier: 10,
    refName: 'Clip 06 - 1st Reference - Noel Confronts Siblings Greed',
    charRefs: ['noel-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Tight emotional dialogue portrait: Noel looking directly ahead with fierce moral conviction, red-rimmed dark brown eyes glistening with tears of indignation, jaw tight, mouth open mid-speech. Crisp white t-shirt, natural skin texture with subtle forehead sweat, clean side-parted black hair. Intimate shallow depth of field, softly blurred rustic ancestral room behind him, no text, no watermark.',
    veoDirection: 'In close-up, camera executes an intimate handheld micro-push toward Noel as he steps directly toward his aunts and uncle. His eyes glisten with painful tears of indignation, his chin held high, lips moving in perfect synchronization to his spoken words delivered in a trembling yet powerful young Filipino voice: "Hindi pa nga natatapos ang dasal para sa kanila, pero nagpapatayan na kayo sa perang hindi naman ninyo pinaghirapan!". Character Consistency Lock: Noel matches his reference image 100%, strictly preserving his white t-shirt, natural skin texture, and expressive eyes. 85mm f/1.8 lens, audio is strictly clear spoken dialogue only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '07A',
    tier: 8,
    refName: 'Clip 07A - 1st Reference - Vivian and Hector Glaring at Noel',
    charRefs: ['vivian-identity.png', 'hector-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Two-shot: Vivian screen-left in emerald-green blouse pointing an aggressive index finger, and Hector screen-right in unbuttoned tropical shirt stepping forward menacingly. Both glaring down at Noel offscreen with sneers and flared nostrils. Natural atmospheric indoor lighting, shallow depth of field, sharp character details, no text, no watermark.',
    veoDirection: 'At the dining table, camera executes an aggressive two-shot framing Vivian and Hector as they turn menacingly toward Noel. Vivian points a manicured finger while Hector steps forward intimidatingly, lips moving in rapid synchronized succession to their spoken lines in harsh, sharp Filipino voices: Vivian snaps, "Hoy Noel! Huwag kang makialam sa usapan ng mga lehitimong anak!", immediately followed by Hector shouting, "Sino ka ba para pangaralan kami ha?! Ampon ka lang ng pamilyang ito!". Character Consistency Lock: Vivian and Hector match their reference images 100%. 50mm f/2.0 lens, audio is strictly clear spoken dialogue only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '07B',
    tier: 6,
    refName: 'Clip 07B - 1st Reference - Grace Sneering at Noel',
    charRefs: ['grace-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Over-the-shoulder shot behind Noel looking at Tita Grace. Grace stands in her pastel-pink jumpsuit, arms crossed across her chest, tilting her head with supreme condescension, lips curled in an ugly mocking sneer mid-speech. Natural indoor lighting, softly blurred shoulder of Noel in foreground, sharp focus on Grace, no text, no watermark.',
    veoDirection: 'Over Noel\'s shoulder, camera holds a sharp medium close-up of Tita Grace as she crosses her arms, looking down at Noel with cold condescension. Her lips move in sharp synchronization to her spoken line delivered in a venomous, dismissive Filipina voice: "Palamunin ka lang dito noon pa! Wala kang karapatan sa kahit isang metro ng lupang ito!". Character Consistency Lock: Grace matches her reference image 100%, strictly preserving her pastel-pink jumpsuit, wavy hair, sunglasses, and cat-eye sneer. 85mm f/1.8 lens, audio is strictly clear spoken dialogue only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '08',
    tier: 10,
    refName: 'Clip 08 - 1st Reference - Noel Explodes with Hospital Truth Part 1',
    charRefs: ['noel-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Tight emotional confrontation close-up: Noel stepping forward, veins on his neck slightly taut with righteous fury, eyes blazing through tears, lips parted delivering an explosive accusation. Crisp white t-shirt, clean black hair, warm golden-kayumanggi skin, natural pore details. Warm indoor room lighting, razor-sharp focus, no text, no watermark.',
    veoDirection: 'In close-up, camera executes a sudden sharp push-in to Noel as he refuses to back down, his chest heaving with righteous anger. His lips move in fierce, passionate synchronization to his spoken words delivered in a cracking, emotionally charged young Filipino voice: "Wala akong karapatan?! Noong nagkukumahog akong maghanap ng pambayad sa ospital, nasaan kayong tatlo?!". Character Consistency Lock: Noel matches his reference image 100%, strictly preserving his white t-shirt, facial features, and intense emotion. 85mm f/1.8 lens, audio is strictly clear spoken dialogue only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '09',
    tier: 10,
    refName: 'Clip 09 - 1st Reference - Noel Calls Out Sibling Neglect Part 2',
    charRefs: ['noel-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Medium shot: Noel pointing firmly at Vivian, then Hector, then Grace in the room. His posture is unyielding, eyes locked on them with moral superiority. White t-shirt, blue jeans, natural lighting casting dramatic shadows on wooden walls, no text, no watermark.',
    veoDirection: 'In medium shot, camera executes a steady tracking move as Noel gestures directly at each sibling one by one. His lips move in flawless synchronization to his rapid, searing spoken accusations in a ringing Filipino voice: "Vivian, binabaan mo ako ng telepono! Hector, nagtago ka dahil ayaw mong mag ambag! Grace, nagbakasyon ka sa ibang bansa habang naghihingalo ang nanay mo! Ang kakapal ng mukha ninyong mag agawan ngayon!". Character Consistency Lock: Noel matches his reference image 100%. 50mm f/1.8 lens, audio is strictly clear spoken dialogue only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '10',
    tier: 4,
    refName: 'Clip 10 - 1st Reference - Hector Hurls Luggage to Porch Yard',
    charRefs: ['hector-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Action impact still: Exterior porch. Hector in his unbuttoned tropical shirt and cargo shorts angrily heaving an old brown duffel bag and battered cardboard box over the porch railing. The luggage flies mid-air toward the dusty gravel yard below. Dramatic afternoon sunlight, motion blur on luggage, sharp focus on Hector\'s furious sneering face, no text, no watermark.',
    veoDirection: 'On the exterior porch, camera executes a rapid downward tracking whip as Hector aggressively hurls Noel\'s old duffel bag and cardboard box over the wooden railing. The bag slams hard onto the dusty gravel yard below, sending up a puff of dust. Character Consistency Lock: Hector matches his reference image 100%, strictly preserving his tropical shirt, black tank top, and angry weathered face. 35mm f/2.8 lens, audio is strictly the heavy diegetic thud and clatter of luggage hitting the dirt only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '11',
    tier: 6,
    refName: 'Clip 11 - 1st Reference - Hector Threatens Noel Pointing Out',
    charRefs: ['hector-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Low-angle medium close-up: Hector standing on the porch doorway, aggressively jabbing his right thumb toward the road outside. Sweat glistening on his temples, dark eye bags prominent, mouth open mid-shout. Unbuttoned tropical shirt, black tank top, worn leather watch. Natural exterior daylight, no text, no watermark.',
    veoDirection: 'In low-angle medium close-up, camera frames Hector as he aggressively jabs his thumb toward the road outside, sweat on his forehead. His lips move in tight synchronization to his harsh, threatening spoken line in a rough Filipino voice: "Aba at sumusobra ka na! Lumayas ka na rito bago pa kita kaladkarin palabas!". Character Consistency Lock: Hector matches his reference image 100%. 50mm f/2.0 lens, audio is strictly clear spoken dialogue only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '12',
    tier: 6,
    refName: 'Clip 12 - 1st Reference - Grace Waves Fan Dismissively',
    charRefs: ['grace-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Medium shot: Grace standing on the porch, holding an elegant hand fan, fanning herself with an amused, haughty smirk. Pastel-pink jumpsuit, sunglasses on head, red manicured nails, glossy pink lips parted speaking coldly. Soft outdoor bokeh background of trees, no text, no watermark.',
    veoDirection: 'On the wooden porch, camera executes a smooth slow push on Grace as she fans herself with light, dismissive strokes, a cruel smirk playing on her lips. Her lips move in synchronized timing to her haughty spoken line in an icy Filipina voice: "Magsimula ka nang maglakad Noel. Bawal ang hampaslupa sa magiging modernong subdivision namin!". Character Consistency Lock: Grace matches her reference image 100%. 85mm f/1.8 lens, audio is strictly clear spoken dialogue and gentle fan flutter sound only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '13',
    tier: 8,
    refName: 'Clip 13 - 1st Reference - Vivian Slams Waiver Form to Noel',
    charRefs: ['vivian-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Over-the-shoulder shot behind Noel looking at Tita Vivian thrusting a legal waiver document and ballpen right at his chest. Vivian\'s eyes are narrowed with calculating malice, lips moving as she dictates terms. Emerald-green blouse, gold earrings, natural indoor lighting, no text, no watermark.',
    veoDirection: 'Over Noel\'s shoulder, camera tracks Vivian thrusting the white waiver form and a black ballpen directly at Noel\'s chest. Her cold eyes bore into him as her lips move in sharp synchronization to her spoken line in an arrogant, demanding Filipina voice: "Pirmahan mo itong waiver na patunay na wala kang habol sa lupa, at aabutan ka namin ng pamasahe!". Character Consistency Lock: Vivian matches her reference image 100%. 50mm f/1.8 lens, audio is strictly clear spoken dialogue and paper rustle only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '14',
    tier: 10,
    refName: 'Clip 14 - 1st Reference - Noel Tears Waiver into Pieces',
    charRefs: ['noel-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Macro insert transitioning to medium close-up: Noel\'s hands cleanly tearing the printed waiver paper in two, then four pieces, letting the shreds flutter to the wooden floor. Cut to Noel looking up with cold steel in his eyes, jaw firm, white t-shirt, clean side part, dramatic indoor lighting, no text, no watermark.',
    veoDirection: 'In close-up, camera frames Noel taking the paper document, staring Vivian dead in the eyes, and deliberately ripping it cleanly in half and then into quarters with a sharp tearing sound. As the paper scraps flutter to the floorboards, Noel speaks with chilling, unshakeable dignity in a clear young Filipino voice: "Kahit mamatay ako sa hirap, hinding hindi ko ibebenta ang dangal ko sa inyo.". Character Consistency Lock: Noel matches his reference image 100%. 50mm f/1.8 lens, audio is strictly paper rip sound and clear spoken dialogue only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '15',
    tier: 6,
    refName: 'Clip 15 - 1st Reference - Noel Clutches Wooden Box of Keepsakes',
    charRefs: ['noel-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Emotional resonance shot: Noel kneeling by his scattered belongings on the ground, carefully picking up a small antique wooden box. Inside the box rest a silver rosary and a thick bundle of pharmacy receipts. Noel holds it close to his heart, looking up with quiet resilience. Warm afternoon rim lighting, soft background, no text, no watermark.',
    veoDirection: 'In low-angle medium close-up, camera slowly creeps in as Noel stands up from the yard holding his small antique wooden box close against his chest. Voice-Over Lock: Noel\'s mouth remains completely closed; he takes a quiet, resolved breath looking toward the gate. Character Consistency Lock: Noel matches his reference image 100%, strictly preserving his white t-shirt and calm dignity. 85mm f/1.8 lens, audio is strictly quiet outdoor breeze and gentle rustling leaves only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '16',
    tier: 4,
    refName: 'Clip 16 - 1st Reference - Black Sedan Arrives at Ancestral Gate',
    charRefs: [],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Cinematic establishing arrival: A sleek dignified black sedan pulls up along the dusty unpaved provincial road directly in front of the rustic wooden gate of the ancestral house. The car driver door and passenger door swing open smoothly. Bright tropical afternoon light, lush banana and coconut trees framing the driveway, no text, no watermark.',
    veoDirection: 'Outside the wooden gate, camera captures the sleek black sedan coming to a gentle halt. The passenger door opens smoothly with a solid mechanical click. Character Consistency Lock: Preserves the authentic provincial setting. 35mm f/2.8 lens, audio is strictly car engine purr, gravel crunch, and car door click only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '17',
    tier: 6,
    refName: 'Clip 17 - 1st Reference - Vivian Smiles Greedily Seeing Car',
    charRefs: ['vivian-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Medium shot: Vivian standing on the porch railing, squinting toward the arriving black car, her face breaking into a wide, triumphant, greedy smile. Smoothing her emerald-green blouse and adjusting her gold necklace, lips parted speaking excitedly. Warm daylight, sharp character details, no text, no watermark.',
    veoDirection: 'On the wooden porch, camera executes a quick push on Vivian as she spots the black sedan, her cynical face instantly morphing into an ecstatic, greedy grin. Smoothing down her emerald blouse, her lips move in rapid synchronization to her excited spoken line in a delighted mature Filipina voice: "Ayan na si Atty Mendoza! Tamang tama para maipamahagi na ang titulo sa ating tatlo!". Character Consistency Lock: Vivian matches her reference image 100%. 85mm f/1.8 lens, audio is strictly clear spoken dialogue only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '18',
    tier: 6,
    refName: 'Clip 18 - 1st Reference - Atty Mendoza Enters with Barangay Captain',
    charRefs: ['atty-mendoza-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Authoritative entrance: Atty. Mendoza in his pristine cream Piña-Organza Barong Tagalog carrying a thick dark-brown leather legal portfolio under his arm, stepping onto the wooden porch. Beside him walks the Punong Barangay in an official formal polo. Stern, dignified, unsmiling facial expression, salt-and-pepper hair slicked back. Sharp realistic lighting, no text, no watermark.',
    veoDirection: 'Ascending the porch stairs, camera executes a steady low-angle tracking shot as Atty. Mendoza, stately in his embroidered Barong Tagalog, walks forward with the Punong Barangay. His leather legal folder is tucked securely under his arm, his expression solemn and commanding. Character Consistency Lock: Atty. Mendoza matches his reference image 100%. 50mm f/2.0 lens, audio is strictly firm footsteps on wood and ambient outdoor sounds only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '19',
    tier: 6,
    refName: 'Clip 19 - 1st Reference - Hector Rushes to Atty Mendoza',
    charRefs: ['hector-identity.png', 'atty-mendoza-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Two-shot: Hector eagerly rushing up into Atty. Mendoza\'s personal space, gesturing with open desperate hands. Hector in his open tropical shirt and cargo shorts, Atty. Mendoza standing tall and stoic in his Barong Tagalog holding his leather portfolio. Indoor-outdoor porch lighting, shallow depth of field, no text, no watermark.',
    veoDirection: 'On the porch threshold, camera frames Hector as he hurries right in front of Atty. Mendoza, waving his hands in frantic eagerness. His lips move in fast synchronization to his anxious spoken question in a raspy, hurried Filipino voice: "Atty Mendoza, pirmahan na ba agad ng bentahan?!". Character Consistency Lock: Hector and Atty. Mendoza match their reference images 100%. 50mm f/1.8 lens, audio is strictly clear spoken dialogue only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '20',
    tier: 6,
    refName: 'Clip 20 - 1st Reference - Grace Pushes Forward for House',
    charRefs: ['grace-identity.png', 'atty-mendoza-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Medium two-shot: Grace stepping in front of Hector, flashing a sugary, manipulative smile at Atty. Mendoza, lightly touching the lawyer\'s sleeve with her red manicured hand. Pastel-pink jumpsuit, sunglasses on wavy hair, Atty. Mendoza looking at her with cold judicial detachment. Sharp focus, no text, no watermark.',
    veoDirection: 'In medium two-shot, camera captures Grace pushing past Hector to reach Atty. Mendoza\'s arm, offering a sugary, entitled smile. Her lips move in synchronized timing to her wheedling spoken line in a polished Filipina voice: "Atty, tiyakin ninyong sa akin nakapangalan ang bahay ha!". Character Consistency Lock: Grace and Atty. Mendoza match their reference images 100%. 50mm f/1.8 lens, audio is strictly clear spoken dialogue only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '21',
    tier: 8,
    refName: 'Clip 21 - 1st Reference - Atty Mendoza Commands Silence',
    charRefs: ['atty-mendoza-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Dedicated close-up: Atty. Mendoza raising a firm commanding right hand, his wise dark eyes stern with judicial authority. Traditional Piña Barong Tagalog, clean square jawline, slicked-back salt-and-pepper hair, lips parted mid-sentence reprimanding the room. Deep natural lighting, shallow depth of field, no text, no watermark.',
    veoDirection: 'In close-up, camera holds on Atty. Mendoza as he raises a single, firm hand to halt the siblings\' chatter. His gaze cuts through them like steel, lips moving in authoritative synchronization to his stern spoken words in a deep, commanding Filipino male voice: "Tumahimik kayong tatlo. Nakakahiya ang kaingayan ninyo sa buong kalsada.". Character Consistency Lock: Atty. Mendoza matches his reference image 100%. 85mm f/1.8 lens, audio is strictly clear spoken dialogue only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '22',
    tier: 10,
    refName: 'Clip 22 - 1st Reference - Atty Mendoza Drops Bombshell Part 1',
    charRefs: ['atty-mendoza-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Medium shot: Atty. Mendoza unzipping his dark-brown leather legal portfolio and producing a thick official legal document with red ribbon and notary dry seal. Behind him, the Punong Barangay stands solemn. Dignified Barong Tagalog, warm indoor lighting, sharp photographic details, no text, no watermark.',
    veoDirection: 'In the ancestral dining room, camera executes a slow creeping push on Atty. Mendoza as he unzips his leather portfolio and reveals the official notarized document. His lips move in deliberate, measured synchronization to his monumental spoken announcement in a solemn Filipino voice: "Walang lupang paghahatian ninyong tatlo. Bago pumanaw si Don Tomas at Donya Elena, legal na naisalin ang buong limang ektarya at itong ancestral house sa pamamagitan ng Deed of Donation...". Character Consistency Lock: Atty. Mendoza matches his reference image 100%. 50mm f/1.8 lens, audio is strictly clear spoken dialogue and paper sliding sound only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '23',
    tier: 8,
    refName: 'Clip 23 - 1st Reference - Atty Mendoza Hands Title to Noel',
    charRefs: ['atty-mendoza-identity.png', 'noel-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Dramatic two-shot: Atty. Mendoza walking past the gaping siblings, stopping directly before Noel, and placing the official blue-bordered Transfer Certificate of Title (TCT) into Noel\'s hands. Atty. Mendoza bows slightly with high respect; Noel looks at the document with stunned awe. White t-shirt, embroidered Barong, natural lighting, no text, no watermark.',
    veoDirection: 'In dramatic two-shot, camera tracks Atty. Mendoza walking deliberately past the three frozen siblings directly to Noel. He places the official registered Land Title squarely into Noel\'s hands with a respectful nod, his lips moving in crisp synchronization to his climactic spoken line in a ringing voice: "...at ang nag iisang may ari na nakatala rito ay si Noel Rivera!". Character Consistency Lock: Atty. Mendoza and Noel match their reference images 100%. 50mm f/1.8 lens, audio is strictly clear spoken dialogue and title paper rustle only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '24',
    tier: 6,
    refName: 'Clip 24 - 1st Reference - Three Siblings Extreme Shock Freeze',
    charRefs: ['vivian-identity.png', 'hector-identity.png', 'grace-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Group reaction freeze: Vivian (left), Hector (center), and Grace (right) standing side-by-side in absolute, paralyzing horror and disbelief. Vivian\'s mouth hangs agape, Hector\'s eyes bulge with pale sweat on his forehead, Grace clutches her chest with gasping shock. Emerald blouse, tropical shirt, pink jumpsuit. Sharp cinematic indoor lighting, no text, no watermark.',
    veoDirection: 'In wide horizontal group staging, camera execute a slow creeping dolly-in on Vivian, Hector, and Grace frozen side-by-side in catastrophic shock. Vivian\'s jaw is completely dropped, Hector\'s hands tremble uselessly, and Grace gasps with her purse slipping from her arm. Voice-Over Lock: All three mouths are frozen in wordless shock, eyes bulging. Character Consistency Lock: All three siblings match their reference images 100%. 35mm f/2.0 lens, audio is strictly a deep sub-bass cinematic heartbeat impact and stunned silence only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '25',
    tier: 6,
    refName: 'Clip 25 - 1st Reference - Hector Blames Vivian in Panic',
    charRefs: ['hector-identity.png', 'vivian-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Two-shot: Hector frantically turning on Vivian, grabbing her shoulder in rage and panic. Vivian staring blankly, pale and stammering in denial, gold earrings shaking. Tropical shirt, emerald blouse, dramatic indoor lighting, no text, no watermark.',
    veoDirection: 'In dynamic two-shot, camera frames Hector violently grabbing Vivian\'s upper arm, shouting in her face as Vivian stammers in white-faced denial. Their lips move in frantic synchronization to their spoken lines: Hector screams in a cracking voice, "Vivian, kasalanan mo ito! Sabi mo ayos na ang lahat!", while Vivian trembles, replying, "Hindi totoo ito! Hindi ito maaari!". Character Consistency Lock: Hector and Vivian match their reference images 100%. 50mm f/1.8 lens, audio is strictly clear spoken dialogue only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '26',
    tier: 6,
    refName: 'Clip 26 - 1st Reference - Grace Wails in Disbelief',
    charRefs: ['grace-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Close-up: Grace clutching her cheeks with crimson manicured fingers, eyeliner smudging with furious tears, shouting in outraged disbelief at Noel offscreen. Pastel-pink jumpsuit, wavy hair, tear tracks on contoured cheeks, no text, no watermark.',
    veoDirection: 'In tight close-up, camera pushes in on Grace stomping her foot, eyeliner smudged with angry tears as she clutches her cheeks. Her lips move in sharp synchronization to her wailing spoken line in a hysterical Filipina voice: "Bakit sa isang apo lang ibinigay ang lahat?!". Character Consistency Lock: Grace matches her reference image 100%. 85mm f/1.8 lens, audio is strictly clear spoken dialogue only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '27',
    tier: 10,
    refName: 'Clip 27 - 1st Reference - Atty Mendoza Reads Letter Part 1',
    charRefs: ['atty-mendoza-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Dedicated medium close-up: Atty. Mendoza holding an official handwritten letter signed by Lolo Tomas, reading with deep moral solemnity. Piña Barong Tagalog, wise dark eyes, salt-and-pepper hair, warm golden sunlight streaming through capiz window behind him, no text, no watermark.',
    veoDirection: 'In medium close-up, camera holds on Atty. Mendoza as he reads aloud from Don Tomas\'s handwritten letter. His lips move in dignified synchronization to his spoken delivery in a deep, resonant Filipino voice: "Sa tatlo kong anak: Noong ako ay nakaratay sa banig ng karamdaman, walang sinuman sa inyo ang nagpunas ng aking pawis o nag abot ng kahit isang basong tubig.". Character Consistency Lock: Atty. Mendoza matches his reference image 100%. 85mm f/1.8 lens, audio is strictly clear spoken dialogue only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '28',
    tier: 10,
    refName: 'Clip 28 - 1st Reference - Atty Mendoza Reads Letter Part 2',
    charRefs: ['atty-mendoza-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Medium shot: Atty. Mendoza looking up from the letter directly toward the weeping siblings, delivering the final judgment of the father. Behind him, the Barangay Captain nods firmly. Traditional Barong Tagalog, natural lighting, no text, no watermark.',
    veoDirection: 'In medium shot, camera executes a slow pan across the room as Atty. Mendoza reads the final judgment from the letter. His lips move in solemn synchronization to his powerful spoken line in a ringing, moral Filipino voice: "Tanging si Noel lamang ang nagsakripisyo ng sarili niyang buhay upang kami ay alagaan. Ang lupang ito ay para sa taong nagpakita ng tunay na pagmamahal, at hindi sa tatlong taong pera lamang ang hinihintay.". Character Consistency Lock: Atty. Mendoza matches his reference image 100%. 50mm f/1.8 lens, audio is strictly clear spoken dialogue only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '29',
    tier: 8,
    refName: 'Clip 29 - 1st Reference - Siblings Plead and Beg Noel',
    charRefs: ['vivian-identity.png', 'hector-identity.png', 'grace-identity.png', 'noel-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Emotional reversal wide two-shot: Vivian reaching out with trembling hands to touch Noel\'s arm in desperate pleading, while Hector and Grace crowd behind her with humbled, tearful faces begging for mercy. Noel standing tall holding the title, impassive and dignified. Emerald blouse, tropical shirt, pink jumpsuit, white t-shirt. Dramatic indoor lighting, no text, no watermark.',
    veoDirection: 'In low-angle medium shot, camera captures Vivian reaching out desperately to clasp Noel\'s forearm, with Hector and Grace crowding behind her in tearful humiliation. Vivian\'s lips move in rapid, groveling synchronization to her pleading spoken words in an emotional Filipina voice: "Noel, pamangkin... pamilya tayo! Kahit tig kalahating ektarya lamang, pakiusap!", followed by Hector and Grace crying, "Noel, tulungan mo ako! Noel, huwag mo naman kaming tanggalan ng tahanan!". Character Consistency Lock: All characters match their reference images 100%. 50mm f/1.8 lens, audio is strictly clear spoken dialogue only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '30',
    tier: 10,
    refName: 'Clip 30 - 1st Reference - Noel Delivers Final Steel Decree',
    charRefs: ['noel-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Hero close-up: Noel pulling his arm back with firm, unbreakable dignity. Clutching the official land title against his chest, eyes resolute and completely dry, delivering the final verdict to his relatives. Crisp white t-shirt, clean side-parted hair, warm golden late-afternoon light illuminating his profile, no text, no watermark.',
    veoDirection: 'In hero close-up, camera holds on Noel as he firmly withdraws his arm from Vivian\'s touch, standing tall with unyielding moral authority. His lips move in calm, devastating synchronization to his final spoken decree delivered in a steady, resonant young Filipino voice: "Noong itinapon ninyo ang gamit ko kanina, kinalimutan ninyong pamilya ninyo ako. Hindi ko ibebenta ang sakahang ito. At gaya ng sinabi ninyo kanina sa akin... ang mga taong walang karapatan dito ay dapat nang mag alsa balutan. Lumabas kayong tatlo sa pamamahay ko.". Character Consistency Lock: Noel matches his reference image 100%. 85mm f/1.8 lens, audio is strictly clear spoken dialogue only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '31',
    tier: 6,
    refName: 'Clip 31 - 1st Reference - Disgraced Siblings Exit the Gate',
    charRefs: ['vivian-identity.png', 'hector-identity.png', 'grace-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Exterior wide tracking shot: Vivian, Hector, and Grace walking out of the wooden ancestral gate in total humiliation, heads bowed and shoulders slumped. Behind them, neighbors and barangay officials watch silently. Golden sunset light across the dusty provincial driveway, long shadows, no text, no watermark.',
    veoDirection: 'At the rustic wooden gate, camera holds a wide exterior shot as Vivian, Hector, and Grace shuffle out onto the public dirt road in complete disgrace, their heads bowed low in front of watching neighbors. Character Consistency Lock: Vivian, Hector, and Grace match their reference images 100%. 35mm f/2.8 lens, audio is strictly gravel footsteps and gentle outdoor evening breeze only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  },
  {
    id: '32',
    tier: 4,
    refName: 'Clip 32 - 1st Reference - Noel Hero Final Shot on Farm',
    charRefs: ['noel-identity.png'],
    promptImage: 'Use case: photorealistic-natural. Asset type: dedicated scene ingredient for Ang Tunay na Tagapagmana E001. Create ONE full-frame vertical 9:16 cinematic Philippine primetime drama still. Hero ending still: Noel standing on the wooden porch railing. In his left arm he holds the framed picture of Lolo Tomas and Lola Elena, in his right hand the registered land title. He smiles with profound peace and gratitude, gazing out over the vast lush green rice fields and mango trees bathed in warm golden sunset light. Cinematic lighting, photorealistic skin and nature textures, no text, no watermark.',
    veoDirection: 'On the wooden porch, camera executes a majestic slow crane pull-out from Noel holding the framed portrait of Lolo Tomas and Lola Elena and the land title, smiling in serene gratitude as he gazes across his vast, lush green five-hectare ancestral farm bathed in radiant golden sunset light. Voice-Over Lock: Mouth closed, peaceful smile. Character Consistency Lock: Noel matches his reference image 100%. 35mm f/2.0 lens, audio is strictly diegetic evening crickets and warm wind rustling through rice crops only, strictly no background music, no instrumental music, no musical score, no soundtrack, strictly no on-screen text, no titles, no subtitles, no watermark.'
  }
];

// 1. Group by tier for veo-auto-1ref
const batches = { 4: [], 6: [], 8: [], 10: [] };
const plainLines = [];
const scenePrompts = [];
const chatgptPlain = [];

clips.forEach((c, idx) => {
  const veoLine = `[Clip ${c.id} - 0.00-${c.tier}.00s] Shot begins on @${c.refName}: ${c.veoDirection}`;
  batches[c.tier].push(veoLine);
  plainLines.push(veoLine);

  scenePrompts.push(JSON.stringify({
    image_id: `image-${idx + 1}`,
    output_filename: `${c.refName}.png`,
    aspect_ratio: '9:16',
    prompt: c.promptImage,
    reference_files: c.charRefs
  }));

  chatgptPlain.push(`=== [CLIP ${c.id}] (${c.tier}s) ===\nFilename: ${c.refName}.png\nReference Assets: ${c.charRefs.join(', ') || 'None'}\nPrompt:\n${c.promptImage}\n`);
});

// Write Veo automation files
fs.writeFileSync(path.join(epDir, 'veo-auto-1ref-4s-batch.txt'), batches[4].join('\n\n'), 'utf8');
fs.writeFileSync(path.join(epDir, 'veo-auto-1ref-6s-batch.txt'), batches[6].join('\n\n'), 'utf8');
fs.writeFileSync(path.join(epDir, 'veo-auto-1ref-8s-batch.txt'), batches[8].join('\n\n'), 'utf8');
fs.writeFileSync(path.join(epDir, 'veo-auto-1ref-10s-batch.txt'), batches[10].join('\n\n'), 'utf8');
fs.writeFileSync(path.join(epDir, 'veo-auto-prompts-plain.txt'), plainLines.join('\n\n'), 'utf8');

// Write scene image generation queue files
fs.writeFileSync(path.join(epDir, 'scene-image-prompts.txt'), scenePrompts.join('\n'), 'utf8');
fs.writeFileSync(path.join(epDir, 'chatgpt-automation.txt'), chatgptPlain.join('\n----------------------------------------\n'), 'utf8');

console.log('Successfully generated all 7 automation and prompt files for E001!');
