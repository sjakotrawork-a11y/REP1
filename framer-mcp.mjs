import fs from 'node:fs/promises';

// Pass the private connection URL via FRAMER_MCP_URL; never persist it in source.
const [method, name, inputFile, outputFile] = process.argv.slice(2);
if (!process.env.FRAMER_MCP_URL) throw new Error('FRAMER_MCP_URL is required');
const args = inputFile ? JSON.parse(await fs.readFile(inputFile, 'utf8')) : {};
const params = method === 'resources/read' ? { uri: name } : { name, arguments: args };
const response = await fetch(process.env.FRAMER_MCP_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
  body: JSON.stringify({ jsonrpc: '2.0', id: Date.now(), method, params }),
});
const text = await response.text();
const data = JSON.parse(text);
if (outputFile) await fs.writeFile(outputFile, JSON.stringify(data, null, 2));
for (const item of data.result?.content || data.result?.contents || []) {
  if (item.text) console.log(item.text);
}
if (data.error) throw new Error(JSON.stringify(data.error));
if (data.result?.isError) process.exitCode = 1;
