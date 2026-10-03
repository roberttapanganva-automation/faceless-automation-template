import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const VERSION='2.3';
export const QA_KEYS=['identity','wardrobe','props','blocking','lighting','emotion','mouth_visibility','dialogue','audio_continuity','timing','unwanted_text_music'];
const text=v=>typeof v==='string'&&v.trim().length>0;
const file=(base,p)=>text(p)&&fs.existsSync(path.resolve(base,p))&&fs.statSync(path.resolve(base,p)).isFile()&&fs.statSync(path.resolve(base,p)).size>0;
export const digest=v=>crypto.createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const fileHash=(base,p)=>file(base,p)?crypto.createHash('sha256').update(fs.readFileSync(path.resolve(base,p))).digest('hex'):null;
export const mention=a=>'@'+path.basename(a.output_path??'').replace(/\.png$/i,'');
export function cleanSceneName(filename,clip,tagpi=false){
  const raw=path.basename(filename??'');
  const normalized=tagpi?raw.replace(/^(Clip [1-9]\d* - )(?:1st|2nd|3rd) Reference - /,'$1'):raw;
  const match=normalized.match(/^Clip ([1-9]\d*) - ([A-Za-z][A-Za-z '\-]*[A-Za-z])\.png$/);
  return !!match&&(!clip||Number(match[1])===clip)&&!(/\b(?:SCN|E\d+|C\d+)\b/.test(match[2]))&&!/\b[A-Z]{2,}\b/.test(match[2]);
}
const spec=x=>Object.fromEntries(Object.entries(x).filter(([k])=>!['status','review','qa','tracking'].includes(k)));
export function scopeHash(m,stage,base='.'){
  const story={version:m.schema_version,workflow_profile:m.workflow_profile,series:m.series_id,episode:m.episode_id,characters:m.characters,script:m.script,script_hash:fileHash(base,m.script?.path),pronunciations:(m.pronunciations??[]).map(p=>({...p,sample_sha256:fileHash(base,p.sample_path)})),beats:m.script_beats,jobs:m.jobs.map(spec),edit:m.edit,runtime:m.target_runtime_seconds};
  const images={story,assets:m.assets.map(spec)};
  const videos={images,files:m.assets.map(a=>({id:a.id,path:a.output_path,sha256:fileHash(base,a.output_path)}))};
  const publish={videos,sources:m.jobs.map(j=>({id:j.id,path:j.output_path,sha256:fileHash(base,j.output_path)})),package:m.final_package,package_files:Object.entries(m.final_package?.files??{}).map(([k,p])=>({kind:k,path:p,sha256:fileHash(base,p)}))};
  return digest(stage==='storyboard'?story:stage==='images'?images:stage==='video'?videos:publish);
}
export const authorized=(m,stage,base='.')=>m.approvals?.[stage]?.approved===true&&text(m.approvals[stage].evidence)&&m.approvals[stage].scope_hash===scopeHash(m,stage,base);
export function qaErrors(qa,label){
  const errors=[];
  for(const key of QA_KEYS){const value=qa?.[key];if(value?.result!=='pass'&&!(value?.result==='not_applicable'&&text(value.reason)))errors.push(`${label}: QA ${key} needs pass or explained not_applicable`);}
  return errors;
}
export function publicationErrors(m,base='.'){
  const e=[], pack=m.final_package;
  for(const k of new Set(['movie','cover','caption',...(pack?.required??[])]))if(!file(base,pack?.files?.[k]))e.push(`publish: actual ${k} file missing or empty`);
  if(pack?.duration_seconds!==m.target_runtime_seconds)e.push('publish: reviewed final duration must match target runtime');
  if(!text(pack?.review))e.push('publish: final package review evidence required');
  e.push(...qaErrors(pack?.qa,'publish'));
  return e;
}
export function validateCurrent(m,base='.'){
  const e=[],check=(ok,s)=>{if(!ok)e.push(s);};
  const tagpi=m.schema_version==='2.3',time=tagpi?Number.isFinite:Number.isInteger;
  if(tagpi)check(m.workflow_profile==='tagpi_credit_optimized','v2.3 requires the current tagpi_credit_optimized workflow profile');
  const beats=Array.isArray(m.script_beats)?m.script_beats:[],assets=m.assets??[],jobs=m.jobs??[];
  const assetMap=new Map(assets.map(a=>[a.id,a])),jobMap=new Map(jobs.map(j=>[j.id,j]));
  check(beats.length>0&&new Set(beats.map(b=>b.id)).size===beats.length,'script_beats: complete unique coverage inventory required');
  check(text(m.script?.path)&&text(m.script?.review),'script: approved-script path and coverage reconciliation evidence required');
  if(m.approvals?.storyboard?.approved)check(file(base,m.script?.path),'script: approved script file missing or empty');
  const usedImages=new Map(),usedPaths=new Set(),usedTurns=new Set(),seenSceneBytes=new Map();
  check(new Set(jobs.map(j=>j.clip_number)).size===jobs.length,'clip_number must be unique per source job');
  for(const b of beats){
    check(text(b.id)&&['dialogue','reaction','evidence'].includes(b.kind),`${b.id}: valid coverage beat required`);
    const a=assetMap.get(b.reference_id),j=jobMap.get(b.job_id);
    check(a&&['hero','angle','broll'].includes(a.role),`${b.id}: dedicated scene image required (identity master is insufficient)`);
    check(j&&(j.references??[]).includes(b.reference_id),`${b.id}: coverage image must belong to mapped job`);
    if(usedImages.has(b.reference_id))e.push(`${b.id}: image reused across distinct beats ${usedImages.get(b.reference_id)}`);
    usedImages.set(b.reference_id,b.id);
    for(const k of ['emotion','wardrobe','blocking','lighting'])check(text(b[k]),`${b.id}: ${k} planning required`);
    if(b.kind==='dialogue')check(m.characters.includes(b.speaker)&&text(b.line),`${b.id}: known speaker and exact script line required`);
  }
  for(const a of assets){
    check(text(a.output_path),`${a.id}: intended output path required`);
    const output=path.resolve(base,a.output_path??'').toLowerCase();
    check(!usedPaths.has(output),`${a.id}: duplicate output path`);usedPaths.add(output);
    if(['hero','angle','broll'].includes(a.role))check(cleanSceneName(a.output_path,undefined,tagpi),`${a.id}: use clean Clip Number - Description.png filename`);
    if(['hero','angle','broll'].includes(a.role)&&['generated','approved'].includes(a.status)&&file(base,a.output_path)){
      const hash=fileHash(base,a.output_path);check(!seenSceneBytes.has(hash),`${a.id}: copied scene-image bytes duplicate ${seenSceneBytes.get(hash)}`);seenSceneBytes.set(hash,a.id);
    }
  }
  for(const j of jobs){
    check(Number.isInteger(j.clip_number)&&j.clip_number>0,`${j.id}: clip_number required`);
    const refs=j.references??[],shots=j.shots??[],turns=j.audio?.lines??[];
    if(tagpi&&j.prefix_seconds!==undefined)check(Number.isFinite(j.prefix_seconds)&&j.prefix_seconds>=0&&j.prefix_seconds<j.duration_seconds&&turns.every(t=>t.in>=j.prefix_seconds),`${j.id}: merged prefix must leave the full ordered speaking interval`);
    check(new Set(refs).size===refs.length,`${j.id}: ingredient references must be distinct`);
    check(j.audio?.continuity==='continuous',`${j.id}: one continuous audio track required across camera cuts`);
    if(tagpi){
      check(j.audio?.mode==='ambience'?j.duration_seconds===4||text(j.duration_reason):j.duration_seconds!==4,`${j.id}: use 4s for pure visual actions; a longer silent hold needs an explicit duration reason`);
      if(j.audio?.mode==='ambience')check(turns.length===0,`${j.id}: ambience cannot contain spoken turns`);
    }else {
      check(j.duration_seconds===4?j.audio?.mode==='ambience':['dialogue','inner_monologue'].includes(j.audio?.mode),`${j.id}: silent sources use 4s; spoken sources use 6/8/10s`);
      if(j.duration_seconds===4)check(turns.length===0,`${j.id}: silent 4s source cannot contain spoken turns`);
    }
    const ordinal=tagpi?'(?:[1-9]\\d*(?:st|nd|rd|th) Clip - )?':'';
    check(new RegExp(`^\\[${ordinal}0\\.00-\\d+\\.00s\\]`).test(j.prompt??''),`${j.id}: timed scene direction must start at zero`);
    check(new RegExp(`^\\[${ordinal}0\\.00-${j.duration_seconds}\\.00s\\]`).test(j.prompt??''),`${j.id}: prompt duration must match source tier`);
    const clipPrefix=j.prompt?.match(/^\[(\d+)(?:st|nd|rd|th) Clip - /);
    if(tagpi&&clipPrefix)check(Number(clipPrefix[1])===j.clip_number,`${j.id}: ordinal prompt prefix must match clip number`);
    if(refs.length===1){
      check(j.mode==='multishot'&&shots.length>=2,`${j.id}: one ingredient needs at least two camera shots`);
      check(new Set(shots.map(s=>s.angle?.trim().toLowerCase())).size>=2,`${j.id}: one ingredient needs at least two distinct camera angles`);
    }
    for(const id of refs){check(['hero','angle','broll'].includes(assetMap.get(id)?.role),`${j.id}: ingredient ${id} must be a scene image`);check(cleanSceneName(assetMap.get(id)?.output_path,j.clip_number,tagpi),`${j.id}: ingredient filename must use its clip number`);check(shots.some(s=>s.reference_id===id),`${j.id}: unused ingredient ${id}`);}
    for(const s of shots){check(refs.includes(s.reference_id)&&text(s.angle),`${j.id}: explicit shot reference and angle required`);}
    let turnEnd=0;
    for(const t of turns){
      const b=beats.find(b=>b.id===t.beat_id);
      check(b?.kind==='dialogue'&&b.job_id===j.id&&b.reference_id===t.reference_id&&b.speaker===t.speaker&&b.line===t.line,`${j.id}: dialogue mapping must match exact inventoried beat ${t.beat_id}`);
      check(!usedTurns.has(t.beat_id),`${j.id}: repeated spoken beat ${t.beat_id}`);usedTurns.add(t.beat_id);
      check(time(t.in)&&time(t.out)&&t.in>=turnEnd&&t.out>t.in&&t.out<=j.duration_seconds,`${j.id}: ordered ${tagpi?'valid':'whole-second'} dialogue interval required`);turnEnd=t.out;
      if(tagpi&&t.delivery_seconds!==undefined)check(Number.isFinite(t.delivery_seconds)&&t.delivery_seconds>0&&t.delivery_seconds<=t.out-t.in,`${j.id}: measured delivery exceeds its allocated speaking interval; extend or split without rushing`);
      if(tagpi&&j.audio?.mode==='voice_over'){
        check(b?.speaker_visibility==='offscreen'&&m.characters.includes(b?.reference_subject),`${j.id}: offscreen voice needs explicit visible reference subject and offscreen speaker mapping`);
        check(j.audio.visible_mouths_closed===true,`${j.id}: visible listener mouths must remain closed during offscreen speech`);
      }
      // A camera angle may change during the line; its dedicated ingredient may not change.
      if(j.audio?.mode==='dialogue')for(const s of shots.filter(s=>s.in<t.out&&s.out>t.in))check(s.reference_id===t.reference_id,`${j.id}: speaking interval must retain its dedicated image through angle cuts`);
      if(tagpi&&j.audio?.mode==='dialogue')check(!b?.reference_subject||b.reference_subject===t.speaker,`${j.id}: visible dialogue must map to its actual speaker`);
      if(t.pronunciation_id){const p=m.pronunciations?.find(p=>p.id===t.pronunciation_id);check(p?.status==='approved'&&p.canonical===t.line&&text(p.spoken)&&p.meaning_preserved===true&&text(p.review)&&file(base,p.sample_path),`${j.id}: pronunciation needs reviewed meaning-preserving audio evidence`);}
    }
    if(['dialogue','inner_monologue','voice_over'].includes(j.audio?.mode))check(turns.length>0&&!j.audio.line,`${j.id}: explicit timed audio.lines required; positional/single-line shortcut disabled`);
  }
  for(const b of beats){const j=jobMap.get(b.job_id);if(b.kind==='dialogue')check(usedTurns.has(b.id),`${b.id}: missing spoken-line coverage`);else check(j?.shots?.some(s=>s.beat_id===b.id&&s.reference_id===b.reference_id),`${b.id}: critical reaction/evidence shot missing`);}
  for(const stage of ['storyboard','images','video','publish'])if(m.approvals?.[stage]?.approved)check(authorized(m,stage,base),`${stage}: approval scope changed; renew authorization for changed content`);
  for(const x of [...assets,...jobs])if(x.status==='approved'){
    e.push(...qaErrors(x.qa,x.id));
    check(x.tracking?.output_sha256===fileHash(base,x.output_path),`${x.id}: reviewed output content changed or checksum missing`);
    check(x.tracking?.spec_hash===digest(spec(x)),`${x.id}: reviewed production specification changed`);
  }
  for(const x of [...assets,...jobs])if(x.tracking)check(Number.isInteger(x.tracking.attempts)&&x.tracking.attempts>=0&&Number.isInteger(x.tracking.max_attempts)&&x.tracking.max_attempts>=1&&x.tracking.max_attempts<=10&&Array.isArray(x.tracking.history),`${x.id}: valid attempts, retry limit (1–10) and history required`);
  // Every spoken interval must survive editing, possibly through an explicit bridged audio source.
  const intervals=new Map(),lastAudioEnd=new Map();
  for(const edit of m.edit??[]){for(const [id,a,z] of [edit.audio_source?[edit.audio_source,edit.audio_in,edit.audio_out]:[edit.source,edit.in,edit.out]]){if(!id)continue;if(!intervals.has(id))intervals.set(id,[]);intervals.get(id).push([a,z]);}
    const audioId=edit.audio_source??edit.source,audioIn=edit.audio_source?edit.audio_in:edit.in,audioOut=edit.audio_source?edit.audio_out:edit.out;
    if((jobMap.get(audioId)?.audio?.lines??[]).length){check(!lastAudioEnd.has(audioId)||audioIn>=lastAudioEnd.get(audioId),`${audioId}: edit reverses or repeats the audio performance`);lastAudioEnd.set(audioId,audioOut);}
    if(edit.audio_source){const j=jobMap.get(edit.audio_source);check(j&&time(edit.audio_in)&&time(edit.audio_out)&&edit.audio_in>=0&&edit.audio_out<=j.duration_seconds&&Math.abs((edit.audio_out-edit.audio_in)-(edit.out-edit.in))<1e-6,`edit ${edit.source}: valid equal-duration continuous audio bridge required`);}
  }
  for(const [id,ranges]of intervals){let end=-1;for(const [a,z]of [...ranges].sort((a,b)=>a[0]-b[0])){check(a>=end,`${id}: edit repeats overlapping audio intervals`);end=z;}}
  for(const j of jobs)for(const t of j.audio?.lines??[]){let end=t.in;for(const [a,z] of (intervals.get(j.id)??[]).sort((a,b)=>a[0]-b[0]))if(a<=end&&z>end)end=z;check(end>=t.out,`${j.id}: edit drops or interrupts approved dialogue ${t.beat_id}`);}
  for(const b of beats.filter(b=>b.kind!=='dialogue')){
    const seconds=(m.edit??[]).reduce((sum,edit)=>sum+(edit.source===b.reference_id?edit.out-edit.in:edit.source===b.job_id?(jobMap.get(b.job_id)?.shots??[]).filter(s=>s.beat_id===b.id&&s.reference_id===b.reference_id).reduce((n,s)=>n+Math.max(0,Math.min(s.out,edit.out)-Math.max(s.in,edit.in)),0):0),0);
    check(seconds>=1,`${b.id}: final edit omits critical reaction/evidence coverage`);
  }
  if(m.approvals?.publish?.approved)e.push(...publicationErrors(m,base));
  return e;
}
export function readyCurrent(m,kind,base='.'){
  if(!authorized(m,'storyboard',base)||!authorized(m,'images',base))return [];
  const deps=x=>(x.references??[]).every(id=>m.assets.find(a=>a.id===id)?.status==='approved');
  if(kind==='images')return m.assets.filter(a=>a.status==='planned'&&deps(a));
  if(!authorized(m,'video',base)||m.assets.some(a=>a.status!=='approved'))return [];
  return m.jobs.filter(j=>j.status==='planned'&&deps(j));
}
export function nextCurrent(m,base='.'){
  for(const stage of ['storyboard','images'])if(!authorized(m,stage,base))return {stage:`${stage}_authorization`,reason:'missing or stale scope'};
  const image=readyCurrent(m,'images',base)[0];if(image)return {stage:'image_generation',id:image.id};
  const pending=m.assets.find(a=>a.status!=='approved');if(pending)return {stage:pending.status==='generated'?'image_review':pending.status,id:pending.id};
  if(!authorized(m,'video',base))return {stage:'video_authorization',reason:'missing or stale scope'};
  const job=readyCurrent(m,'video',base)[0];if(job)return {stage:'video_generation',id:job.id};
  const unfinished=m.jobs.find(j=>j.status!=='approved');if(unfinished)return {stage:unfinished.status==='generated'?'video_review':unfinished.status,id:unfinished.id};
  const errors=publicationErrors(m,base);return {stage:errors.length?'final_package_review':authorized(m,'publish',base)?'ready_for_authorized_publish':'publish_authorization',errors};
}
export function planMarkdown(m){
  const cell=v=>String(v??'').replaceAll('|','\\|').replaceAll('\n','<br>');
  const header=['Beat','Clip / tier','Exact line / purpose','Speaker','Visible reference subject','Emotion','Wardrobe','Blocking / light','Image','Status'];
  const rows=(m.script_beats??[]).map(b=>{const j=m.jobs.find(j=>j.id===b.job_id),a=m.assets.find(a=>a.id===b.reference_id);return [b.id,`${j?.clip_number} / ${j?.duration_seconds}s`,b.line??b.kind,b.speaker??'',b.reference_subject??b.speaker??'',b.emotion,b.wardrobe,`${b.blocking} / ${b.lighting}`,path.basename(a?.output_path??''),a?.status??'missing'].map(cell);});
  return '# Script-to-image production plan\n\n| '+header.join(' | ')+' |\n| '+header.map(()=>'---').join(' | ')+' |\n'+rows.map(r=>'| '+r.join(' | ')+' |').join('\n')+'\n';
}
export function updateWorkflow(m,action,data={},base='.'){
  if(!['2.2',VERSION].includes(m.schema_version))throw Error('Tracking operations require a reviewed current manifest; no automatic legacy migration');
  const stage=data.stage;
  if(action==='authorize'){
    if(!['storyboard','images','video','publish'].includes(stage)||!text(data.evidence))throw Error('Authorization requires stage and actual human authorization evidence');
    if(stage==='images'&&!authorized(m,'storyboard',base))throw Error('Approve storyboard scope first');
    if(stage==='video'&&(!authorized(m,'images',base)||m.assets.some(a=>a.status!=='approved')))throw Error('Video requires authorized and reviewed images');
    if(stage==='publish'&&(m.jobs.some(j=>j.status!=='approved')||publicationErrors(m,base).length))throw Error('Publication requires reviewed jobs and complete final package');
    m.approvals[stage]={approved:true,evidence:data.evidence,scope_hash:scopeHash(m,stage,base),recorded_at:new Date().toISOString()};
  } else if(action==='pronunciation'){
    const entry=data.entry;if(!text(entry?.id)||!text(entry.canonical)||!text(entry.spoken)||!file(base,entry.sample_path)||!text(entry.review)||!['candidate','approved','rejected'].includes(entry.status))throw Error('Pronunciation record requires actual sample, canonical/spoken forms, provider, status and review');
    if(!text(entry.provider)||(entry.status==='approved'&&entry.meaning_preserved!==true))throw Error('Pronunciation provider and approved meaning-preservation evidence required');
    m.pronunciations??=[];const i=m.pronunciations.findIndex(p=>p.id===entry.id);if(i<0)m.pronunciations.push(entry);else m.pronunciations[i]=entry;
  } else {
    const x=[...m.assets,...m.jobs].find(x=>x.id===data.id);if(!x)throw Error('Unknown production item');
    x.tracking??={attempts:0,max_attempts:3,history:[]};
    if(action==='claim'){
      if(x.status==='running')return {state:'already_running',id:x.id};
      const kind=m.assets.includes(x)?'images':'video';
      if(!readyCurrent(m,kind,base).some(a=>a.id===x.id))throw Error('Item is not authorized and ready; completed items are never regenerated');
      if(x.tracking.attempts>=x.tracking.max_attempts)throw Error('Retry limit reached');
      if(file(base,x.output_path))throw Error('Intended output path already contains a file; retain/archive it before starting a new generation');
      x.tracking.attempts++;x.tracking.spec_hash=digest(spec(x));x.status='running';
    }else if(action==='download'){
      if(x.status!=='running')throw Error('Only a running item can receive a download');
      if(!file(base,data.output_path))throw Error('Actual downloaded file missing or empty');
      if(data.output_path!==x.output_path)throw Error('Copy/map the download to its declared exact output path before recording it');
      if(x.tracking.spec_hash!==digest(spec(x)))throw Error('Production specification changed during generation');
      x.tracking.output_sha256=fileHash(base,x.output_path);x.status='generated';
    }else if(action==='review'){
      if(x.status!=='generated'||!file(base,x.output_path)||!text(data.evidence)||qaErrors(data.qa,x.id).length)throw Error('Review needs actual generated output, complete continuity QA and evidence');
      if(x.tracking.output_sha256!==fileHash(base,x.output_path)||x.tracking.spec_hash!==digest(spec(x)))throw Error('Output or specification changed since download');
      x.qa=data.qa;x.review=data.evidence;x.status='approved';
    }else if(action==='fail'){
      if(!['running','generated'].includes(x.status)||!text(data.reason))throw Error('Failure needs running/generated item and reason');
      x.tracking.history.push({event:'failed_output',path:x.output_path,sha256:x.tracking.output_sha256??null});
      x.status=x.tracking.attempts>=x.tracking.max_attempts?'blocked':'failed';x.tracking.last_error=data.reason;
    }else if(action==='retry'){
      if(x.status!=='failed'||x.tracking.attempts>=x.tracking.max_attempts)throw Error('Only failed items below the retry limit can be retried');
      if(file(base,x.output_path)&&!text(data.archive_path))throw Error('Archive the rejected output before retrying; provide its retained archive path');
      if(data.archive_path&&(!file(base,data.archive_path)||file(base,x.output_path)||fileHash(base,data.archive_path)!==x.tracking.output_sha256))throw Error('Move the exact rejected file to its archive first; keep intended output path clear');
      if(data.archive_path)x.tracking.history.push({event:'retained_draft',path:data.archive_path});x.status='planned';
    }else throw Error('Unknown workflow action');
    x.tracking.history.push({event:action,at:new Date().toISOString(),reason:data.reason??data.evidence??null});
  }
  m.workflow??={events:[]};m.workflow.events??=[];m.workflow.events.push({action,id:data.id??null,stage:stage??null,at:new Date().toISOString()});
  return {state:'recorded',action,id:data.id??null,stage:stage??null};
}

export function chooseTagpiTier(deliverySeconds,prefixSeconds=0){
  if(!Number.isFinite(deliverySeconds)||deliverySeconds<0||!Number.isFinite(prefixSeconds)||prefixSeconds<0)throw Error('Finite nonnegative delivery/prefix seconds required');
  const need=deliverySeconds+prefixSeconds;
  if(deliverySeconds===0&&need<=4)return {duration_seconds:4,split_required:false};
  const tier=(deliverySeconds>0?[6,8,10]:[4,6,8,10]).find(t=>t>=need);
  return tier?{duration_seconds:tier,split_required:false}:{duration_seconds:null,split_required:true,required_seconds:need};
}
