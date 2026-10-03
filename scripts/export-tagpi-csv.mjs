import fs from 'node:fs';

// Archival format conversion only; current production uses the validated current v2.3 exporter.
if (!process.argv.includes('--legacy-convert')) {
  console.error('Historical converter: add --legacy-convert only for unchanged archived prompts. New work uses production.mjs export-veo-csv with current v2.3.');
  process.exit(1);
}

const cell = v => '"' + String(v).replaceAll('"', '""') + '"';

// 2-ref
const txt2 = fs.readFileSync('series/tagpi-tagping-bahay/episodes/E001/veo-auto-2ref-prompts-plain.txt', 'utf8');
const prompts2 = txt2.split(/\r?\n\s*\r?\n/).filter(Boolean);
const rows2 = ['clip_id,prompt', ...prompts2.map((p, i) => {
  const match = p.match(/^\[(.*?)\]/);
  const id = match ? match[1] : `Clip ${i+1}`;
  return [cell(id), cell(p)].join(',');
})];
fs.writeFileSync('series/tagpi-tagping-bahay/episodes/E001/veo-auto-2ref-import.csv', rows2.join('\r\n'), 'utf8');

// 1-ref
const txt1 = fs.readFileSync('series/tagpi-tagping-bahay/episodes/E001/veo-auto-1ref-prompts-plain.txt', 'utf8');
const prompts1 = txt1.split(/\r?\n\s*\r?\n/).filter(Boolean);
const rows1 = ['clip_id,prompt', ...prompts1.map((p, i) => {
  const match = p.match(/^\[(.*?)\]/);
  const id = match ? match[1] : `Clip ${i+1}`;
  return [cell(id), cell(p)].join(',');
})];
fs.writeFileSync('series/tagpi-tagping-bahay/episodes/E001/veo-auto-1ref-import.csv', rows1.join('\r\n'), 'utf8');

console.log(`Successfully generated CSVs: 2ref=${prompts2.length} rows, 1ref=${prompts1.length} rows`);
