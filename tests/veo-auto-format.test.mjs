import {test} from 'node:test';
import assert from 'node:assert/strict';
import {veoAutoText,veoAutoCsv} from '../scripts/veo-auto-format.mjs';
const rows=[{id:'C001',prompt:{speaker:'Mara',line:'“Ubos na…”\n\nPaano bukas?',duration_seconds:10}},{id:'C002',prompt:{speaker:'Lito',line:'Sabi niya, "Uuwi ako."',duration_seconds:10}}];
test('blank-line import gives exactly two intact JSON prompts',()=>{const parts=veoAutoText(rows).split(/\r?\n\s*\r?\n/);assert.equal(parts.length,2);assert.deepEqual(parts.map(JSON.parse),rows.map(r=>r.prompt));assert.equal(veoAutoText([]),'');});
test('CSV stores JSON in one quoted prompt cell and preserves quotes',()=>{const lines=veoAutoCsv(rows).split('\r\n');assert.equal(lines[0],'clip_id,prompt');assert.equal(lines.length,3);for(let i=1;i<lines.length;i++){const line=lines[i];const match=line.match(/^"((?:[^"]|"")*)","((?:[^"]|"")*)"$/);assert.ok(match);assert.equal(match[1],rows[i-1].id);assert.deepEqual(JSON.parse(match[2].replaceAll('""','"')),rows[i-1].prompt);}});
