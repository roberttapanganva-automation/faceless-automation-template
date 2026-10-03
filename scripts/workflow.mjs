import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {validate} from './production.mjs';
import {updateWorkflow,planMarkdown,nextCurrent,publicationErrors} from './workflow-v22.mjs';

export function transact(filename,action,data){
  const target=path.resolve(filename),lock=target+'.lock';let fd;
  try {fd=fs.openSync(lock,'wx');}catch {throw Error('Manifest is being updated by another process; retry later');}
  const temp=target+`.${process.pid}.tmp`;
  try {
    const m=JSON.parse(fs.readFileSync(target,'utf8').replace(/^\uFEFF/,''));
    const base=path.dirname(target),before=validate(m,base);
    // Fresh authorization may legitimately resolve stale-scope errors.
    const repairable=before.filter(e=>!e.includes('approval scope changed'));
    if(repairable.length)throw Error('Fix manifest before changing workflow state:\n'+repairable.join('\n'));
    const result=updateWorkflow(m,action,data,base);
    const after=validate(m,base).filter(e=>!e.includes('approval scope changed'));
    if(after.length)throw Error('Workflow update rejected:\n'+after.join('\n'));
    fs.writeFileSync(temp,JSON.stringify(m,null,2)+'\n','utf8');fs.renameSync(temp,target);
    return result;
  } finally {if(fs.existsSync(temp))fs.unlinkSync(temp);fs.closeSync(fd);fs.unlinkSync(lock);}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(fs.realpathSync(path.resolve(process.argv[1]))).href){
  try {
    const [command,filename,dataFile]=process.argv.slice(2);
    if(!filename)throw Error('Usage: workflow.mjs status|plan|qa|package-check|authorize|claim|download|review|fail|retry|pronunciation manifest.json [action-data.json]');
    const m=JSON.parse(fs.readFileSync(filename,'utf8').replace(/^\uFEFF/,'')),base=path.dirname(path.resolve(filename));
    if(command==='plan')process.stdout.write(planMarkdown(m));
    else if(command==='status')console.log(JSON.stringify({next:nextCurrent(m,base),items:[...m.assets,...m.jobs].map(x=>({id:x.id,status:x.status,attempts:x.tracking?.attempts??0,limit:x.tracking?.max_attempts??3,output:x.output_path,error:x.tracking?.last_error??null}))},null,2));
    else if(command==='qa'||command==='package-check'){
      const errors=command==='qa'?validate(m,base):publicationErrors(m,base);console.log(JSON.stringify({passed:errors.length===0,errors},null,2));if(errors.length)process.exitCode=1;
    }else {
      if(!dataFile)throw Error('Mutation requires a JSON action-data file with actual authorization/review/failure evidence');
      console.log(JSON.stringify(transact(filename,command,JSON.parse(fs.readFileSync(dataFile,'utf8').replace(/^\uFEFF/,''))),null,2));
    }
  }catch(error){console.error(error.message);process.exitCode=1;}
}
