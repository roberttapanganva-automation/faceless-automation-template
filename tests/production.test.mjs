import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {validate,next,ready,videoPrompt,chatgptImagePrompt} from '../scripts/production.mjs';
function fixture(){return {schema_version:'2.1',series_id:'test',episode_id:'E001',language:'Tagalog',aspect_ratio:'9:16',target_runtime_seconds:150,providers:{image:'ChatGPT',video:'Omni Flash'},approvals:Object.fromEntries(['storyboard','images','video','publish'].map(k=>[k,{approved:false,evidence:''}])),characters:['A','B'],assets:['face','angle','evidence'].map((id,i)=>({id,role:i===2?'broll':'character',status:'planned',prompt:'Fictional approved scene reference',references:[]})),jobs:Array.from({length:15},(_,i)=>({id:`J${i}`,status:'planned',duration_seconds:10,mode:'multishot',pacing_reason:'Three shots allow the line and reaction to settle',prompt:'Ten-second fictional scene',references:['face','angle','evidence'],audio:{mode:'dialogue',speaker:'A',line:'Uuwi rin ako.'},shots:[{in:0,out:4,role:'hero',action:'Looks up',camera:'locked'},{in:4,out:6,role:'pov',broll:true,pov_owner:'A',action:'Looks at bag',camera:'locked'},{in:6,out:10,role:'reaction',action:'Settles',camera:'locked'}]})),edit:Array.from({length:15},(_,i)=>({source:`J${i}`,in:0,out:10,audio_bridge:'room tone'}))};}
test('JSON prompt round-trip preserves dialogue and shot cuts',()=>{const j=fixture().jobs[0];j.audio.line='“Ubos na…”\nPaano na bukas?';const p=JSON.parse(JSON.stringify(videoPrompt(j)));assert.equal(p.audio.exact_dialogue,j.audio.line);assert.deepEqual(p.video.cut_times_seconds,[4,6]);assert.equal(p.video.shot_count,3);assert.equal(p.shots[1].pov_owner,'A');assert.equal(p.shots[2].end_seconds,10);});
test('video handoffs retain reference identity and conditional crowd staging after serialization',()=>{
  for(const version of ['2.1','2.3'])for(const staging of ['A alone is visible; no background people.','A speaks; B stands behind A and three bystanders wait at the gate.']){
    const j=fixture().jobs[0];j.prompt=`[0.00-10.00s] ${staging}`;
    if(version==='2.3'){
      j.clip_number=1;j.audio.lines=[{speaker:'A',line:j.audio.line,reference_id:'face'}];
      j.shots.forEach((shot,index)=>Object.assign(shot,{reference_id:j.references[index],angle:'eye level'}));
    }
    const p=JSON.parse(JSON.stringify(videoPrompt(j,[],[],version)));
    assert.ok(p.scene_direction.startsWith(j.prompt));
    assert.match(p.scene_direction,/exact character identity from each beat's @mentioned approved scene reference/);
    assert.match(p.scene_direction,/When that beat requires no background people/);
    assert.match(p.scene_direction,/anyone behind the speaking person/);
    assert.match(p.scene_direction,/When another character or crowd is explicitly required, preserve only those specified people, positions and actions/);
    assert.match(p.constraints.join(' '),/Keep offscreen speakers offscreen/);
    assert.equal(p.audio.exact_dialogue,version==='2.3'?'@face A: Uuwi rin ako.':j.audio.line);
  }
});
test('valid plan waits for actual authorization',()=>{const m=fixture();assert.deepEqual(validate(m),[]);assert.equal(next(m).stage,'storyboard_review');assert.deepEqual(ready(m,'images'),[]);});
test('authorized batch queues image but not dependent video',()=>{const m=fixture();for(const k of ['storyboard','images'])m.approvals[k]={approved:true,evidence:'User approved declared storyboard and images'};assert.equal(next(m).id,'face');assert.equal(ready(m,'video').length,0);});
test('reject unsupported source length, fractional timing and unknown POV owner',()=>{const m=fixture();m.jobs[0].duration_seconds=7;m.jobs[0].shots[0].out=3.5;m.jobs[0].shots[1].in=3.5;m.jobs[0].shots[1].pov_owner='other';m.edit[0].out=11;const e=validate(m).join(' ');assert.match(e,/6, 8, or 10 seconds/);assert.match(e,/whole seconds/);assert.match(e,/POV owner/);assert.match(e,/trim exceeds/);assert.match(e,/runtime/);});
test('missing approved file and cyclic references fail',()=>{const m=fixture();m.assets[0].status='approved';m.assets[0].references=['face'];const e=validate(m).join(' ');assert.match(e,/file missing/);assert.match(e,/cycle/);assert.match(e,/review evidence/);});
test('resume uses persisted reviewed images and video authorization',()=>{const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'tagalog-test-'));try{fs.writeFileSync(path.join(tmp,'reference.bin'),'fixture only');const m=fixture();for(const k of ['storyboard','images','video'])m.approvals[k]={approved:true,evidence:'test approval'};for(const asset of m.assets)Object.assign(asset,{status:'approved',output_path:'reference.bin',review:'test evidence'});assert.deepEqual(validate(m,tmp),[]);assert.equal(next(m).id,'J0');assert.equal(ready(m,'video').length,15);m.jobs[0].status='rejected';assert.equal(next(m).id,'J1');assert.equal(ready(m,'video').length,14);}finally{fs.unlinkSync(path.join(tmp,'reference.bin'));fs.rmdirSync(tmp);}});
test('two through five multishot beats pass while one and six fail',()=>{
  const boundaries={1:[0,10],2:[0,5,10],3:[0,3,6,10],4:[0,2,4,7,10],5:[0,2,4,6,8,10],6:[0,1,3,5,7,9,10]};
  for(const count of [1,2,3,4,5,6]){
    const m=fixture();m.jobs[0].shots=Array.from({length:count},(_,i)=>({in:boundaries[count][i],out:boundaries[count][i+1],role:i===1?'pov':'hero',pov_owner:'A',broll:i===1,action:'A checks the coins',camera:'Eye level to A’s right'}));
    assert.equal(validate(m).some(e=>e.includes('invalid shot count')),count<2||count>5);
  }
});
test('multishot requires a reason and ends at selected source duration',()=>{
  const m=fixture();delete m.jobs[0].pacing_reason;
  assert.match(validate(m).join(' '),/pacing reason/);
  m.jobs[0].shots[2].out=11;
  assert.match(validate(m).join(' '),/shots must end at source duration 10/);
});
test('duration-based references and dialogue-only exception are enforced',()=>{
  const m=fixture();
  Object.assign(m.jobs[0],{duration_seconds:6,references:['face'],shots:[{in:0,out:6,role:'hero',action:'A speaks',camera:'Locked'}],mode:'single_shot',framing_reason:'Solo dialogue'});
  m.edit[0].out=6;m.target_runtime_seconds=146;
  assert.deepEqual(validate(m),[]);
  Object.assign(m.jobs[0],{duration_seconds:8,references:['face']});m.jobs[0].shots[0].out=8;m.edit[0].out=8;m.target_runtime_seconds=148;
  assert.match(validate(m).join(' '),/ingredient reference count/);
  m.jobs[0].dialogue_only=true;
  assert.deepEqual(validate(m),[]);
});
test('shared-frame dialogue preserves ordered speaker turns',()=>{
  const j=fixture().jobs[0];j.dialogue_only=true;j.references=['face','angle'];j.audio={mode:'dialogue',lines:[{speaker:'A',line:'Ako muna.'},{speaker:'B',line:'Sige, makikinig ako.'}]};
  const p=videoPrompt(j,[{filename:'Clip 1 - 1st Reference - Shared Family Frame.png'},{filename:'Clip 1 - 2nd Reference - Closing Reaction.png'}]);
  assert.deepEqual(p.audio.dialogue_turns.map(({speaker,line})=>({speaker,line})),j.audio.lines);
  assert.match(p.audio.continuity,/active speaker/);
  assert.deepEqual(p.reference_mentions,['@Clip 1 - 1st Reference - Shared Family Frame','@Clip 1 - 2nd Reference - Closing Reaction']);
  assert.match(p.shots[0].reference_mention,/^@Clip 1/);
  assert.match(p.audio.dialogue_turns[0].reference_mention,/^@Clip 1/);
});
test('ChatGPT Automation image object carries filename, prompt and dependencies',()=>{
  const assets=[
    {id:'mother',output_path:'characters/Mother Reference.png'},
    {id:'scene',output_path:'images/Clip 1 - 1st Reference - Mother Reads Letter.png',prompt:'Create the approved scene.',references:['mother']}
  ];
  assert.deepEqual(chatgptImagePrompt(assets[1],assets),{
    image_id:'scene',
    output_filename:'Clip 1 - 1st Reference - Mother Reads Letter.png',
    aspect_ratio:'9:16',
    prompt:'Create the approved scene.',
    reference_files:['Mother Reference.png']
  });
});
test('discrete_shot and single_shot allow single shot with framing or pacing reason',()=>{
  const m=fixture();
  m.jobs[0].mode='discrete_shot';
  m.jobs[0].framing_reason='Tripod-locked 85mm f/1.8 close-up for clean dialogue delivery';
  m.jobs[0].shots=[{in:0,out:10,role:'hero',action:'Speaks line directly',camera:'Locked 85mm eye level'}];
  assert.deepEqual(validate(m),[]);
});
