// Documented prompt-column / blank-line import, not an extension API.
export function veoAutoText(rows) {
  return rows.map(r=>JSON.stringify(r.prompt)).join('\n\n');
}
export function veoAutoCsv(rows) {
  const cell=v=>'"'+String(v).replaceAll('"','""')+'"';
  return ['clip_id,prompt',...rows.map(r=>[cell(r.id),cell(JSON.stringify(r.prompt))].join(','))].join('\r\n');
}
