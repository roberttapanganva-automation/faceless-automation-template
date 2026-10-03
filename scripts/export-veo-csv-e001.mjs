import fs from 'node:fs';

// Archival format conversion only; current production uses the validated current v2.3 exporter.
if (!process.argv.includes('--legacy-convert')) {
  console.error('Historical converter: add --legacy-convert only for unchanged archived prompts. New work uses production.mjs export-veo-csv with current v2.3.');
  process.exit(1);
}

const txt = fs.readFileSync('series/completed/ang-binalewalang-ama/episodes/E001/veo-auto-import.txt', 'utf8');
const items = txt.split(/\r?\n\s*\r?\n/).filter(Boolean).map(x => JSON.parse(x));
const cell = v => '"' + String(v).replaceAll('"', '""') + '"';
const lines = ['clip_id,prompt', ...items.map(item => [cell(item.clip_id), cell(item.prompt)].join(','))];
fs.writeFileSync('series/completed/ang-binalewalang-ama/episodes/E001/veo-auto-import.csv', lines.join('\r\n'), 'utf8');
console.log('CSV created with', items.length, 'rows');
