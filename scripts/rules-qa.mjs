import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {digest} from './workflow-v22.mjs';

export const RULE_FILES=['AGENTS.md','WORKFLOW_RULES.md','SOURCE_OF_TRUTH.md','PROJECT_RULES.md','START_HERE.md','AUTOMATION.md','CHATGPT_AUTOMATION_HANDOFF.md','VEO_AUTO_HANDOFF.md','VIDEO_GENERATION_WORKFLOW_STANDARD.md','PINOY_DRAMA_AUTOMATION_PROFILE.md','CLIP_ASSEMBLY_TRANSITION_STANDARD.md','GOOGLE_FLOW_OMNI_PINOY_DRAMA_ADAPTER.md','schemas/episode-v2.2.schema.json','templates/episode.template.json','templates/omni-prompt.template.json'];
RULE_FILES.push('scripts/production.mjs','scripts/workflow-v22.mjs','scripts/workflow.mjs','scripts/rules-qa.mjs');
RULE_FILES.push('WORKFLOW_QUICKSTART.md','RULE_CHANGELOG.md','SCRIPTWRITING_STANDARD.md','TAGALOG_DIALOGUE_STANDARD.md','DRAMA_PLAYBOOK.md','CAMERA_SHOTS_AND_ANGLE_CHOICES.md','PAGE_SETUP.md','DOLA_PHONETIC_DICTIONARY.md','scripts/export-tagpi-csv.mjs','scripts/export-veo-csv-e001.mjs','scripts/export-veo-csv-e002.mjs');
RULE_FILES.push(...['authorization','claim','download','review','failure','retry','pronunciation'].map(f=>'templates/workflow-actions/'+f+'.json'));
RULE_FILES.push('schemas/episode-v2.schema.json','tests/production.test.mjs','tests/workflow-v22.test.mjs','tests/chatgpt-automation-format.test.mjs','tests/veo-auto-format.test.mjs');
RULE_FILES.push('TAGPI_WORKFLOW_PROFILE.md','GEMINI.md','schemas/episode-v2.3.schema.json','tests/workflow-tagpi.test.mjs','tests/workflow-fixture.mjs');
export function rulesQA(root,checkBaseline=true){
  const errors=[],warnings=[];const seen=new Map();
  for(const f of RULE_FILES){
    const full=path.join(root,f);if(!fs.existsSync(full)){errors.push('Missing workflow document '+f);continue;}
    const body=fs.readFileSync(full,'utf8');
    if(f.endsWith('.md')&&f!=='WORKFLOW_RULES.md'&&!body.includes('WORKFLOW_RULES.md'))errors.push(f+': canonical workflow link missing');
    const scopedReference=/^> Scope: (?:Creative|Linguistic|Optional|Historical|Reference)/m.test(body);
    if(f.endsWith('.md')&&!scopedReference){
      for(const paragraph of body.split(/\n\s*\n/)){
        if(paragraph.length<180||paragraph.includes('WORKFLOW_RULES.md')||paragraph.startsWith('~~~'))continue;
        const normalized=paragraph.replace(/\s+/g,' ').trim();
        if(seen.has(normalized))errors.push(`${f}: duplicated operational paragraph from ${seen.get(normalized)}`);else seen.set(normalized,f);
      }
      for(const line of body.split('\n')){
        if(/legacy|histor|supersed|retired|not |no |never |without|old |earlier/i.test(line))continue;
        if(/(?:must|required|exactly|strictly).*(?:three|3|one|1)\s+(?:ingredient|reference).*10|(?:must|required).*(?:1st Reference|shared Hero)|guarantee.*(?:zero|100%|acceptance)|retry.*(?:forever|infinit)/i.test(line))errors.push(f+': conflicting operational mandate: '+line.trim());
      }
    }
  }
  const parse=f=>{try{return JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));}catch(error){errors.push(f+': '+error.message);return {};}};
  const schema=parse('schemas/episode-v2.3.schema.json'),template=parse('templates/episode.template.json'),prompt=parse('templates/omni-prompt.template.json');
  if(schema.properties?.schema_version?.const!=='2.3'||template.schema_version!=='2.3'||template.workflow_profile!=='tagpi_credit_optimized')errors.push('Current schema/template must select the Tagpi v2.3 profile');
  if(JSON.stringify(schema.properties?.jobs?.items?.properties?.duration_seconds?.enum)!=='[4,6,8,10]')errors.push('Current schema duration tiers differ from workflow policy');
  const references=schema.properties?.jobs?.items?.properties?.references;
  if(references?.minItems!==1||references?.maxItems!==3)errors.push('Current Tagpi schema must allow 1–3 beat-based ingredients including one-reference 10s');
  if(prompt.video?.shot_count!==prompt.shots?.length)errors.push('Omni template shot count differs from actual shots');
  if(prompt.reference_asset_ids?.length===1&&(prompt.shots?.length<2||prompt.audio?.track!=='continuous'))errors.push('One-image example must show multishot continuous audio');
  if(checkBaseline){
    const base=path.join(root,'.workflow','rules-baseline.json');
    if(!fs.existsSync(base))errors.push('Rules baseline missing: record reviewed rule change first');
    else for(const [f,hash]of Object.entries(JSON.parse(fs.readFileSync(base,'utf8')).files))if(!fs.existsSync(path.join(root,f))||digest(fs.readFileSync(path.join(root,f),'utf8'))!==hash)errors.push(f+': rule/template changed since reviewed baseline');
  }
  warnings.push('Static checks cannot detect every semantic conflict; reconcile the declared beat inventory against the approved script and review actual media.');
  return {passed:errors.length===0,errors,warnings};
}
export function recordRules(root,reason){
  if(!reason?.trim())throw Error('Rule change needs a review reason');const qa=rulesQA(root,false);if(!qa.passed)throw Error(qa.errors.join('\n'));
  const dir=path.join(root,'.workflow');fs.mkdirSync(dir,{recursive:true});
  const files=Object.fromEntries(RULE_FILES.map(f=>[f,digest(fs.readFileSync(path.join(root,f),'utf8'))]));
  const entry={recorded_at:new Date().toISOString(),reason,files};
  fs.writeFileSync(path.join(dir,'rules-baseline.json'),JSON.stringify(entry,null,2)+'\n');
  fs.appendFileSync(path.join(dir,'rule-changes.jsonl'),JSON.stringify(entry)+'\n');return entry;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(fs.realpathSync(path.resolve(process.argv[1]))).href){
  try{const [command='check',reason]=process.argv.slice(2),root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
    if(command==='record'){const e=recordRules(root,reason);console.log('Recorded reviewed rule revision: '+e.reason);}
    else if(command==='check'){const qa=rulesQA(root);console.log(JSON.stringify(qa,null,2));if(!qa.passed)process.exitCode=1;}
    else throw Error('Usage: rules-qa.mjs check | record "reviewed change reason"');
  }catch(error){console.error(error.message);process.exitCode=1;}
}
