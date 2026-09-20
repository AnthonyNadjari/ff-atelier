// Tests de scripts/ff-mcp.mjs : initialize, tools/list, tools/call (réel sur ff_aide, léger),
// slug invalide, méthode inconnue, JSON malformé. Le serveur est lancé en sous-processus et
// interrogé en JSON-RPC ligne par ligne, comme le ferait un client MCP stdio.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SERVER = path.join(ROOT, 'scripts', 'ff-mcp.mjs');

/** Envoie une série de messages JSON-RPC au serveur et lit les réponses ligne par ligne. */
async function echanger(messages) {
  const proc = spawn(process.execPath, [SERVER], { cwd: ROOT, stdio: ['pipe', 'pipe', 'pipe'] });
  const reponses = [];
  let buffer = '';
  proc.stdout.on('data', (chunk) => {
    buffer += chunk;
    const lignes = buffer.split('\n');
    buffer = lignes.pop();
    for (const l of lignes) {
      if (l.trim()) reponses.push(JSON.parse(l));
    }
  });
  for (const m of messages) proc.stdin.write(JSON.stringify(m) + '\n');
  proc.stdin.end();
  await new Promise((res, rej) => {
    proc.on('close', res);
    proc.on('error', rej);
    setTimeout(() => { proc.kill(); rej(new Error('serveur MCP trop lent')); }, 30000);
  });
  return reponses;
}

test('initialize : protocolVersion, capabilities.tools, serverInfo', async () => {
  const [rep] = await echanger([{ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18' } }]);
  assert.equal(rep.id, 1);
  assert.equal(rep.result.protocolVersion, '2025-06-18');
  assert.ok(rep.result.capabilities.tools);
  assert.equal(rep.result.serverInfo.name, 'ff-atelier');
});

test('tools/list : les 10 outils, schémas cohérents, aucun outil de déploiement', async () => {
  const [, rep] = await echanger([
    { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
    { jsonrpc: '2.0', id: 2, method: 'tools/list' },
  ]);
  assert.equal(rep.id, 2);
  const noms = rep.result.tools.map((t) => t.name);
  assert.equal(noms.length, 10);
  assert.ok(noms.includes('ff_verifier') && noms.includes('ff_build'));
  assert.ok(!noms.some((n) => /deploy|domaine|generer/.test(n)), 'le déploiement et la génération restent hors MCP');
  const build = rep.result.tools.find((t) => t.name === 'ff_build');
  assert.deepEqual(build.inputSchema.required, ['slug']);
});

test('tools/call ff_aide : exécute réellement la commande et renvoie sa sortie', async () => {
  const [rep] = await echanger([{ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'ff_aide', arguments: {} } }]);
  assert.equal(rep.id, 1);
  assert.equal(rep.result.isError, false);
  assert.match(rep.result.content[0].text, /verifier|build/);
});

test('tools/call : slug invalide refusé sans lancer de commande', async () => {
  const [rep] = await echanger([{ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'ff_build', arguments: { slug: '../etc' } } }]);
  assert.equal(rep.result.isError, true);
  assert.match(rep.result.content[0].text, /slug invalide/);
});

test('outil inconnu, méthode inconnue, JSON malformé : erreurs JSON-RPC propres', async () => {
  const proc = spawn(process.execPath, [SERVER], { cwd: ROOT, stdio: ['pipe', 'pipe', 'pipe'] });
  const reponses = [];
  let buffer = '';
  proc.stdout.on('data', (chunk) => {
    buffer += chunk;
    const lignes = buffer.split('\n');
    buffer = lignes.pop();
    for (const l of lignes) if (l.trim()) reponses.push(JSON.parse(l));
  });
  proc.stdin.write('pas du json\n');
  proc.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 10, method: 'tools/call', params: { name: 'ff_deploy', arguments: {} } }) + '\n');
  proc.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 11, method: 'resources/list' }) + '\n');
  proc.stdin.end();
  await new Promise((res) => proc.on('close', res));

  assert.equal(reponses[0].error.code, -32700); // parse error
  const inconnu = reponses.find((r) => r.id === 10);
  assert.equal(inconnu.error.code, -32602);
  const methode = reponses.find((r) => r.id === 11);
  assert.equal(methode.error.code, -32601);
});
