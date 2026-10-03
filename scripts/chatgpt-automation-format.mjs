// Blank-line-separated image prompt import for ChatGPT Automation.
// This is an image-creation handoff format, not a video queue or provider API.
export function chatgptAutomationText(rows) {
  return rows.map(row=>JSON.stringify(row.prompt)).join('\n\n');
}
