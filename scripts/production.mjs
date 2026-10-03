import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {veoAutoText,veoAutoCsv} from './veo-auto-format.mjs';
import {chatgptAutomationText} from './chatgpt-automation-format.mjs';
import {validateCurrent,readyCurrent,nextCurrent} from './workflow-v22.mjs';

export function validate(m, base='.') {
  if(!m||typeof m!=='object')return ['Manifest object required'];
  const errors=validateCore(m,base);
  if(['2.2','2.3'].includes(m.schema_version)&&['assets','jobs','edit','characters','script_beats'].every(k=>Array.isArray(m[k]))) {
    try { errors.push(...validateCurrent(m,base)); } catch(error) { errors.push('Malformed current manifest: '+error.message); }
  }
  return errors;
}
function validateCore(m, base='.') {
  const current=['2.2','2.3'].includes(m.schema_version),tagpi=m.schema_version==='2.3',time=tagpi?Number.isFinite:Number.isInteger;
  const errors=[];
  const check=(v,s)=>{if(!v) errors.push(s);};
  const text=v=>typeof v==='string' && v.trim().length>0;
  const exists=p=>text(p)&&fs.existsSync(path.resolve(base,p))&&fs.statSync(path.resolve(base,p)).isFile();
  check(['2.1','2.2','2.3'].includes(m.schema_version),'schema_version must be 2.1 (legacy), 2.2, or current 2.3');
  check(text(m.series_id)&&text(m.episode_id),'series and episode IDs required');
  check(m.language==='Tagalog'&&m.aspect_ratio==='9:16','Tagalog and 9:16 required');
  check(m.providers?.image==='ChatGPT'&&m.providers?.video==='Omni Flash','providers must be ChatGPT and Omni Flash');
  check(time(m.target_runtime_seconds)&&m.target_runtime_seconds>0,tagpi?'target runtime must be positive finite seconds':'target runtime must be a positive whole number of seconds');
  for(const name of ['storyboard','images','video','publish']) {
    const a=m.approvals?.[name];
    check(typeof a?.approved==='boolean',`${name}: approval record required`);
    if(a?.approved) check(text(a.evidence),`${name}: approval evidence required`);
  }
  const assets=Array.isArray(m.assets)?m.assets:[];
  const jobs=Array.isArray(m.jobs)?m.jobs:[];
  const edit=Array.isArray(m.edit)?m.edit:[];
  const chars=Array.isArray(m.characters)?m.characters:[];
  check(Array.isArray(m.assets)&&Array.isArray(m.jobs)&&Array.isArray(m.edit)&&Array.isArray(m.characters),'assets/jobs/edit/characters arrays required');
  check(chars.length>0&&chars.every(text)&&new Set(chars).size===chars.length,'unique character IDs required');
  const all=[...assets,...jobs];
  check(all.every(x=>text(x.id))&&new Set(all.map(x=>x.id)).size===all.length,'asset/job IDs must be unique');
  const assetMap=new Map(assets.map(a=>[a.id,a]));
  const sourceMap=new Map(all.map(a=>[a.id,a]));
  for(const item of all) {
    check((current?['planned','running','failed','blocked','generated','approved','rejected']:['planned','generated','approved','rejected']).includes(item.status),`${item.id}: invalid status`);
    check(text(item.prompt),`${item.id}: prompt required`);
    check(Array.isArray(item.references),`${item.id}: references array required`);
    for(const ref of item.references??[]) check(ref!==item.id&&assetMap.has(ref),`${item.id}: missing/self reference ${ref}`);
    if(['generated','approved'].includes(item.status)) check(exists(item.output_path),`${item.id}: actual output file missing`);
    if(item.status==='approved') check(text(item.review),`${item.id}: review evidence required`);
    if(item.status==='approved') for(const ref of item.references??[]) check(assetMap.get(ref)?.status==='approved',`${item.id}: dependency ${ref} unapproved`);
  }
  const visiting=new Set(),done=new Set();
  function visit(id){if(visiting.has(id)){errors.push('asset dependency cycle');return;} if(done.has(id))return;visiting.add(id);for(const r of assetMap.get(id)?.references??[])if(assetMap.has(r))visit(r);visiting.delete(id);done.add(id);}
  assets.forEach(a=>visit(a.id));
  for(const a of assets) check(['character','location','prop','hero','angle','broll','style'].includes(a.role),`${a.id}: invalid asset role`);
  let hasPOV=false,hasBroll=false;
  for(const j of jobs) {
    check((current?[4,6,8,10]:[6,8,10]).includes(j.duration_seconds),`${j.id}: source must be ${current?'4, 6, 8, or 10':'6, 8, or 10'} seconds`);
    check(['multishot','single_shot_fallback','discrete_shot','single_shot'].includes(j.mode),`${j.id}: invalid generation mode`);
    const shots=Array.isArray(j.shots)?j.shots:[];
    check(j.mode==='multishot'?shots.length>=2&&shots.length<=5:shots.length===1,`${j.id}: invalid shot count`);
    const refCount=Array.isArray(j.references)?j.references.length:0;
    const validReferenceCount=tagpi?refCount>=1&&refCount<=3:current
      ? j.duration_seconds===10 ? refCount>=2&&refCount<=3 : refCount>=1&&refCount<=3
      : j.dialogue_only===true
      ? refCount>=1&&refCount<=2
      : j.duration_seconds===6
        ? refCount>=1&&refCount<=2
        : j.duration_seconds===8
          ? refCount>=2&&refCount<=3
          : refCount===3;
    check(validReferenceCount,`${j.id}: invalid ingredient reference count for ${j.duration_seconds}s${j.dialogue_only===true?' dialogue-only':''} source`);
    if(j.mode==='single_shot_fallback')check(text(j.fallback_reason),`${j.id}: fallback reason required`);
    if(j.mode==='discrete_shot'||j.mode==='single_shot')check(text(j.pacing_reason||j.framing_reason||j.fallback_reason),`${j.id}: pacing or framing reason required`);
    if(j.mode==='multishot')check(text(j.pacing_reason),`${j.id}: pacing reason required`);
    let end=0;
    for(const s of shots){
      check(time(s.in)&&time(s.out)&&Math.abs(s.in-end)<1e-6&&s.out>s.in&&s.out<=j.duration_seconds,`${j.id}: shot timing must be contiguous ${tagpi?'valid timing':'whole seconds'} within source duration`);
      check(text(s.action)&&text(s.camera)&&text(s.role),`${j.id}: shot action/camera/role required`);
      if(s.reference_id!==undefined)check(j.references.includes(s.reference_id),`${j.id}: shot reference_id must be listed in job references`);
      if(s.role==='pov'){hasPOV=true;check(chars.includes(s.pov_owner),`${j.id}: valid POV owner required`);}
      if(s.role==='broll'||s.broll===true)hasBroll=true;
      end=s.out;
    }
    check(end===j.duration_seconds,`${j.id}: shots must end at source duration ${j.duration_seconds}`);
    check((tagpi?['dialogue','inner_monologue','voice_over','ambience']:['dialogue','inner_monologue','ambience']).includes(j.audio?.mode),`${j.id}: audio mode required`);
    if(['dialogue','inner_monologue','voice_over'].includes(j.audio?.mode)){
      const turns=Array.isArray(j.audio?.lines)?j.audio.lines:[];
      const validSingle=chars.includes(j.audio?.speaker)&&text(j.audio?.line);
      const validTurns=turns.length>0&&turns.every(turn=>chars.includes(turn?.speaker)&&text(turn?.line));
      check(validSingle||validTurns,`${j.id}: exact line(s) and known speaker(s) required`);
    }
    if(j.audio?.mode==='ambience')check(!j.audio.line,`${j.id}: ambience must not invent speech`);
  }
  if(!current)check(hasPOV,'episode needs main-character POV coverage');
  if(!current)check(hasBroll||edit.some(e=>assetMap.get(e.source)?.role==='broll'),'episode needs purposeful b-roll');
  let total=0;
  for(const e of edit){const src=sourceMap.get(e.source);check(!!src,`edit: unknown source ${e.source}`);check(time(e.in)&&time(e.out)&&e.in>=0&&e.out>e.in,`edit ${e.source}: trim must use ${tagpi?'valid timing':'whole seconds'}`);if(jobs.includes(src))check(e.out<=src.duration_seconds,`edit ${e.source}: trim exceeds source`);check(text(e.audio_bridge),`edit ${e.source}: audio bridge required`);total+=e.out-e.in;}
  check(edit.length>0&&Math.abs(total-m.target_runtime_seconds)<1e-6,'edit duration does not match episode runtime');
  if(m.approvals?.video?.approved)check(m.approvals.storyboard?.approved&&m.approvals.images?.approved,'video approval requires approved storyboard and image queue');
  if(m.approvals?.publish?.approved)check(jobs.length>0&&jobs.every(j=>j.status==='approved')&&assets.every(a=>a.status==='approved')&&text(current?m.final_package?.review:m.final_review),'publishing requires reviewed sources and final review');
  return errors;
}

// Provider-neutral prompt content, not a vendor batch-import schema.
export function videoPrompt(job,referenceFiles=[],pronunciations=[],version='2.2',beats=[]){
  const tagpi=version==='2.3';
  const seconds=v=>Number(v).toFixed(2);
  const current=Number.isInteger(job.clip_number);
  const dialogueTurns=Array.isArray(job.audio.lines)?job.audio.lines:job.audio.line?[{speaker:job.audio.speaker,line:job.audio.line}]:[];
  const mentions=(job.references??[]).map((id,index)=>`@${(referenceFiles[index]?.filename??id).replace(/\.[^.]+$/,'')}`);
  const mentionForShot=(shot,index)=>{
    const explicit=shot.reference_id?(job.references??[]).indexOf(shot.reference_id):-1;
    const mapped=explicit>=0?explicit:Math.min(mentions.length-1,Math.floor(index*Math.max(mentions.length,1)/Math.max(job.shots.length,1)));
    return mentions[mapped]??null;
  };
  const taggedDialogueTurns=dialogueTurns.map((turn,index)=>{
    const explicit=job.references.indexOf(turn.reference_id);
    if(current&&explicit<0)throw Error('Explicit dialogue reference required; positional guessing disabled');
    const p=pronunciations.find(p=>p.id===turn.pronunciation_id);
    const beat=beats.find(b=>b.id===turn.beat_id);
    if(tagpi&&job.audio.mode==='voice_over'&&!beat?.reference_subject)throw Error('Offscreen export needs the explicit visible reference subject from the beat inventory');
    return {...turn,canonical_line:turn.line,spoken_line:p?.status==='approved'?p.spoken:turn.line,speaker_visibility:job.audio.mode==='voice_over'?'offscreen':'visible',visible_reference_subject:beat?.reference_subject??(job.audio.mode==='voice_over'?null:turn.speaker),reference_mention:mentions[explicit>=0?explicit:Math.min(mentions.length-1,Math.floor(index*Math.max(mentions.length,1)/Math.max(dialogueTurns.length,1)))]??null};
  });
  const voiceContext=job.audio.mode==='voice_over'?' The named speaker is offscreen; all visible listener mouths remain closed. Never transfer the offscreen voice to the visible listener.':job.audio.mode==='inner_monologue'?' Inner monologue: visible mouths remain closed.':'';
  const continuous='Use ONE continuous audio performance across all camera-angle cuts; do not restart, repeat, fade, mute or interrupt the line at a visual cut. Deliver every exact scripted line once in a natural Filipino/Tagalog voice. Only the active speaker moves their mouth; inner monologue keeps lips closed.'+voiceContext;
  const identityPopulationLock="Maintain the exact character identity from each beat's @mentioned approved scene reference: same face, age, skin tone, hair, body proportions, wardrobe and accessories throughout motion and camera cuts. Do not replace, duplicate or morph a referenced character. Show only the people required by the approved beat. When that beat requires no background people, do not add additional characters, extras, bystanders, crowd, silhouettes, blurred people, reflections of people or anyone behind the speaking person. When another character or crowd is explicitly required, preserve only those specified people, positions and actions; add no unrequested people. Keep offscreen speakers offscreen unless an approved beat brings them into view.";
  const timed=current?job.shots.map((s,i)=>`[${seconds(s.in)}-${seconds(s.out)}s] ${mentionForShot(s,i)}: ${s.action}. Camera ${s.angle}: ${s.camera}. ${i<job.shots.length-1?`Cut from ${mentionForShot(s,i)} to ${mentionForShot(job.shots[i+1],i+1)}; keep the same continuous audio track.`:`Hold ${mentionForShot(s,i)}.`}`).join(' '):job.prompt;
  return {
    video:{duration_seconds:job.duration_seconds,aspect_ratio:'9:16',shot_count:job.shots.length,cut_times_seconds:job.shots.slice(0,-1).map(s=>s.out),pacing:job.pacing_reason??job.fallback_reason},
    scene_direction:`${current?`${job.prompt} ${timed}`:job.prompt} ${identityPopulationLock}`,
    reference_asset_ids:job.references,
    reference_mentions:mentions,
    audio:{mode:job.audio.mode,speaker:job.audio.speaker??null,dialogue_turns:taggedDialogueTurns,language:'Tagalog',exact_dialogue:current?taggedDialogueTurns.map(turn=>`${turn.reference_mention} ${turn.speaker}: ${turn.spoken_line}`).join('\n'):job.audio.line??dialogueTurns.map(turn=>`${turn.speaker}: ${turn.line}`).join('\n'),continuity:continuous,track:'continuous'},
    shots:job.shots.map((s,i)=>({shot:i+1,start_seconds:s.in,end_seconds:s.out,reference_mention:mentionForShot(s,i),purpose:s.role,action:current?`${mentionForShot(s,i)}: ${s.action}`:s.action,camera_placement_and_movement:current?`${mentionForShot(s,i)}: ${s.angle}; ${s.camera}`:s.camera,pov_owner:s.pov_owner??null,broll:s.broll===true||s.role==='broll',transition:current?(i<job.shots.length-1?`Cut from ${mentionForShot(s,i)} to ${mentionForShot(job.shots[i+1],i+1)}; continuous audio`:`Hold ${mentionForShot(s,i)}`):i<job.shots.length-1?'Hard cut':'Hold settled ending'})),
    constraints:['Maintain named character identity, costume, light, screen axis and action state.',identityPopulationLock,tagpi?'Use the approved precise beat boundaries and fixed source tier.':'Use whole-second timing only.','Approved speech and diegetic sound only; no background music, subtitles, titles or watermark.','No unscripted speaker, repeated words, morph, unplanned shot or generated captions.']
  };
}

export function chatgptImagePrompt(asset,assets=[]){
  return {
    image_id:asset.id,
    output_filename:path.basename(asset.output_path??`${asset.id}.png`),
    aspect_ratio:'9:16',
    prompt:asset.prompt,
    reference_files:(asset.references??[]).map(id=>path.basename(assets.find(candidate=>candidate.id===id)?.output_path??id))
  };
}

export function selectExportItems(items,{references,duration}={}){
  if(references!==undefined&&![1,2,3].includes(references))throw Error('Reference filter must be 1, 2 or 3');
  if(duration!==undefined&&![4,6,8,10].includes(duration))throw Error('Duration filter must be 4, 6, 8 or 10');
  return items.filter(item=>(references===undefined||item.references.length===references)&&(duration===undefined||item.duration_seconds===duration));
}

export function ready(m,kind,base='.') {
  if(['2.2','2.3'].includes(m.schema_version))return readyCurrent(m,kind,base);
  const deps=x=>(x.references??[]).every(id=>m.assets.find(a=>a.id===id)?.status==='approved');
  if(!m.approvals.storyboard.approved||!m.approvals.images.approved)return [];
  if(kind==='images')return m.assets.filter(a=>a.status==='planned'&&deps(a));
  if(!m.approvals.video.approved||m.assets.some(a=>a.status!=='approved'))return [];
  return m.jobs.filter(j=>j.status==='planned'&&deps(j));
}
export function next(m,base='.') {
  if(['2.2','2.3'].includes(m.schema_version))return nextCurrent(m,base);
  if(!m.approvals.storyboard.approved)return {stage:'storyboard_review'};
  if(!m.approvals.images.approved)return {stage:'image_queue_approval'};
  const image=ready(m,'images',base)[0];if(image)return {stage:'image_generation',id:image.id};
  const pending=m.assets.find(a=>a.status!=='approved');if(pending)return {stage:pending.status==='generated'?'image_review':'image_blocked',id:pending.id};
  if(!m.approvals.video.approved)return {stage:'video_authorization'};
  const video=ready(m,'video',base)[0];if(video)return {stage:'video_generation',id:video.id};
  const job=m.jobs.find(j=>j.status!=='approved');if(job)return {stage:job.status==='generated'?'video_review':'video_blocked',id:job.id};
  return {stage:m.approvals.publish.approved?'ready_for_authorized_publish':'edit_and_final_review'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(fs.realpathSync(path.resolve(process.argv[1]))).href){
  try{
    const [command,file]=process.argv.slice(2);
    const argument=name=>{const i=process.argv.indexOf(name);return i<0?undefined:Number(process.argv[i+1]);};
    const filters={references:argument('--references'),duration:argument('--duration')};
    if((filters.references!==undefined||filters.duration!==undefined)&&!['export-video','export-veo-txt','export-veo-csv'].includes(command))throw Error('Ingredient/duration filters apply to video exports only');
    selectExportItems([],filters);
    if(!['validate','next','export-images','export-video','export-chatgpt-txt','export-veo-txt','export-veo-csv'].includes(command)||!file)throw Error('Usage: production.mjs validate|next|export-images|export-video|export-chatgpt-txt|export-veo-txt|export-veo-csv manifest.json');
    const m=JSON.parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,''));const base=path.dirname(path.resolve(file));const errors=validate(m,base);
    if(m.schema_version==='2.1'&&command.startsWith('export-')) {
      if(!process.argv.includes('--legacy-convert'))throw Error('v2.1 exports are archival conversion only. For unchanged historical artifacts add --legacy-convert; new production must use the current reviewed Tagpi profile (v2.3).');
      console.error('Legacy archival conversion: this export is not current workflow QA approval.');
    }
    if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
    else if(command==='validate')console.log('Valid production manifest');
    else if(command==='next')console.log(JSON.stringify(next(m,base),null,2));
    else if(command==='export-chatgpt-txt') {
      const rows=ready(m,'images',base).map(asset=>({id:asset.id,prompt:chatgptImagePrompt(asset,m.assets)}));
      process.stdout.write(chatgptAutomationText(rows));
    }
    else if(command==='export-veo-txt'||command==='export-veo-csv') {
      const rows=selectExportItems(ready(m,'video',base),filters).map(j=>{const referenceFiles=j.references.map(id=>({asset_id:id,filename:path.basename(m.assets.find(a=>a.id===id).output_path)}));return {id:j.id,prompt:{clip_id:j.id,...videoPrompt(j,referenceFiles,m.pronunciations,m.schema_version,m.script_beats),reference_files:referenceFiles}};});
      process.stdout.write(command==='export-veo-txt'?veoAutoText(rows):veoAutoCsv(rows));
    }
    else {const items=selectExportItems(ready(m,command==='export-images'?'images':'video',base),filters);console.log(JSON.stringify({format:'local_prompt_queue_v1',vendor_import_verified:false,count:items.length,jobs:items.map(i=>{const attachments=i.references.map(r=>({id:r,path:path.resolve(path.dirname(path.resolve(file)),m.assets.find(a=>a.id===r).output_path)}));const referenceFiles=attachments.map(a=>({asset_id:a.id,filename:path.basename(a.path)}));return {id:i.id,prompt:command==='export-video'?JSON.stringify(videoPrompt(i,referenceFiles,m.pronunciations,m.schema_version,m.script_beats)):i.prompt,duration_seconds:i.duration_seconds,shots:i.shots,audio:i.audio,attachments};})},null,2));}
  }catch(e){console.error(e.message);process.exitCode=1;}
}
