#!/usr/bin/env node
/**
 * Serveur MCP (Model Context Protocol) de l'atelier — transport stdio, JSON-RPC 2.0 en lignes
 * (newline-delimited JSON), sans dépendance : le protocole tient en trois méthodes et le SDK
 * officiel n'ajouterait qu'une couche pour ce périmètre. Testé par tests/mcp.test.mjs.
 *
 * Il expose les commandes de `scripts/ff.mjs` comme OUTILS appelables par n'importe quel agent
 * (Claude Code, Kimi Code, Cursor, ChatGPT desktop...) : l'associée non-développeuse pilote
 * l'atelier en langage naturel depuis une interface chat, sans terminal.
 *
 * Périmètre volontairement LOCAL : build, vérifs, composition de look, captures. Le déploiement
 * (`ff deploy`, `ff domaine`) et la génération payante (`ff-generer`) restent hors MCP — une action
 * qui publie ou facture ne doit pas partir d'un appel d'outil distrait.
 *
 * Déclaration côté client (ex. Claude Code, .claude.json / `claude mcp add`) :
 *   { "mcpServers": { "ff-atelier": { "command": "node", "args": ["scripts/ff-mcp.mjs"], "cwd": "<repo>" } } }
 */
import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FF = join(ROOT, 'scripts', 'ff.mjs');
const PROTOCOL_VERSION = '2025-06-18';
const SERVER_INFO = { name: 'ff-atelier', version: '1.0.0' };

const slugProp = { slug: { type: 'string', description: 'Slug du site (dossier sites/<slug>), ex. dubois-plomberie' } };

/** Outils exposés : chaque entrée mappe un nom d'outil MCP vers une commande ff + ses args. */
const TOOLS = [
  { name: 'ff_aide', description: 'Liste toutes les commandes de l\'atelier avec leur rôle.', args: [] },
  { name: 'ff_liste', description: 'Liste les sites clients, leur direction visuelle et si le build existe.', args: ['liste'] },
  { name: 'ff_variete', description: 'Liste les combinaisons direction/variantes déjà utilisées — à consulter avant de choisir un look pour ne pas répéter deux clients.', args: ['variete'] },
  { name: 'ff_modeles', description: 'Liste les modèles de look (presets) disponibles : titre, direction, métiers.', args: ['modeles'] },
  { name: 'ff_nouveau', description: 'Crée le dossier d\'un nouveau site client (sites/<slug>) prêt pour un brief.', args: ['nouveau'], schema: { type: 'object', properties: { ...slugProp }, required: ['slug'] } },
  { name: 'ff_build', description: 'Construit le site statique dans dist/<slug>.', args: ['build'], schema: { type: 'object', properties: { ...slugProp }, required: ['slug'] } },
  { name: 'ff_verifier', description: 'Contrôle qualité complet avant livraison (build + checklist SEO, contenu, rendu, visibilité IA).', args: ['verifier'], schema: { type: 'object', properties: { ...slugProp }, required: ['slug'] } },
  { name: 'ff_composer', description: 'Propose automatiquement un look (direction, variantes, typographie) dans look.json, sans toucher au contenu.', args: ['composer'], schema: { type: 'object', properties: { ...slugProp }, required: ['slug'] } },
  { name: 'ff_perf', description: 'Budget de performance sans navigateur (octets par catégorie vs perf-budget.json).', args: ['perf'], schema: { type: 'object', properties: { ...slugProp }, required: ['slug'] } },
  { name: 'ff_captures', description: 'Prend des captures d\'écran desktop/mobile du site buildé et signale erreurs console et débordements.', args: ['captures'], schema: { type: 'object', properties: { ...slugProp }, required: ['slug'] } },
];

function toolResult(id, { text, isError = false }) {
  return { jsonrpc: '2.0', id, result: { content: [{ type: 'text', text }], isError } };
}

function runFf(args) {
  const r = spawnSync(process.execPath, [FF, ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 10 * 60 * 1000, // un build + vérif peut prendre plusieurs minutes
  });
  const out = `${r.stdout || ''}${r.stderr || ''}`.trim();
  return { text: out || '(commande terminée sans sortie)', isError: (r.status ?? 1) !== 0 };
}

function handleMessage(msg) {
  if (!msg || msg.jsonrpc !== '2.0') return null;
  const { id, method, params } = msg;

  switch (method) {
    case 'initialize':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: params?.protocolVersion || PROTOCOL_VERSION,
          capabilities: { tools: {} },
          serverInfo: SERVER_INFO,
          instructions:
            "Atelier Finck & Fisch : pilotage local des sites clients. Périmètre : build, vérifications, looks, captures. Le déploiement et la génération de contenu restent hors MCP (à lancer à la main : node scripts/ff.mjs deploy <slug>).",
        },
      };
    case 'ping':
      return { jsonrpc: '2.0', id, result: {} };
    case 'notifications/initialized':
    case 'notifications/cancelled':
      return null; // notifications : pas de réponse
    case 'tools/list':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          tools: TOOLS.map((t) => ({
            name: t.name,
            description: t.description,
            inputSchema: t.schema ?? { type: 'object', properties: {} },
          })),
        },
      };
    case 'tools/call': {
      const tool = TOOLS.find((t) => t.name === params?.name);
      if (!tool) return { jsonrpc: '2.0', id, error: { code: -32602, message: `Outil inconnu : ${params?.name}` } };
      const slug = params?.arguments?.slug;
      if (tool.schema?.required?.includes('slug')) {
        if (typeof slug !== 'string' || !/^_?[a-z0-9-]+$/.test(slug)) {
          return toolResult(id, { text: `slug invalide ou manquant : "${slug}". Attendu : minuscules, chiffres, tirets.`, isError: true });
        }
      }
      const args = [...tool.args, ...(tool.schema ? [slug] : [])];
      return toolResult(id, runFf(args));
    }
    default:
      if (id === undefined) return null; // notification inconnue : ignorer
      return { jsonrpc: '2.0', id, error: { code: -32601, message: `Méthode inconnue : ${method}` } };
  }
}

const rl = createInterface({ input: process.stdin, terminal: false });
rl.on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  let msg;
  try {
    msg = JSON.parse(trimmed);
  } catch {
    process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'JSON invalide' } }) + '\n');
    return;
  }
  const response = handleMessage(msg);
  if (response) process.stdout.write(JSON.stringify(response) + '\n');
});
