import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chatgptAutomationText} from '../scripts/chatgpt-automation-format.mjs';

const rows=[
  {id:'IMG1',prompt:{image_id:'IMG1',output_filename:'Clip 1 - 1st Reference - Mother Reads Letter.png',aspect_ratio:'9:16',prompt:'Create the approved fictional drama scene.',reference_files:['Mother Reference.png']}},
  {id:'IMG2',prompt:{image_id:'IMG2',output_filename:'Clip 1 - 2nd Reference - Daughter Reacts.png',aspect_ratio:'9:16',prompt:'Create the approved reaction scene.',reference_files:['Daughter Reference.png']}}
];

test('ChatGPT Automation TXT keeps one intact image object per blank-line block',()=>{
  const text=chatgptAutomationText(rows);
  const parts=text.split(/\r?\n\s*\r?\n/);
  assert.equal(parts.length,2);
  assert.deepEqual(parts.map(JSON.parse),rows.map(row=>row.prompt));
  assert.equal(chatgptAutomationText([]),'');
});
