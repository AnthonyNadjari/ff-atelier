// Lecture/ecriture minimaliste de litteraux JS/TS dans site.config.ts (regex + eval controle du
// texte source du projet lui-meme — jamais de compilation TS). Partage par figer.mjs et studio.mjs.

/** Avance i jusqu'a l'index (inclus) du guillemet fermant de la chaine qui commence a text[i]. */
export function skipString(text, i) {
  const q = text[i];
  i++;
  while (i < text.length) {
    if (text[i] === '\\') {
      i += 2;
      continue;
    }
    if (text[i] === q) return i;
    i++;
  }
  return i;
}

/**
 * A partir de `start` (debut d'une valeur JS, espaces avant tolérés), retourne l'index juste apres
 * la fin de cette valeur (objet/tableau/chaine/litteral nu), sans consommer de virgule finale.
 */
export function findValueEnd(text, start) {
  let i = start;
  while (i < text.length && /\s/.test(text[i])) i++;
  const ch = text[i];
  if (ch === '{' || ch === '[') {
    const open = ch;
    const close = ch === '{' ? '}' : ']';
    let depth = 0;
    for (; i < text.length; i++) {
      const c = text[i];
      if (c === "'" || c === '"' || c === '`') {
        i = skipString(text, i);
        continue;
      }
      if (c === open) depth++;
      else if (c === close) {
        depth--;
        if (depth === 0) {
          i++;
          break;
        }
      }
    }
    return i;
  }
  if (ch === "'" || ch === '"' || ch === '`') {
    return skipString(text, i) + 1;
  }
  // Litteral nu (nombre, booleen, identifiant...) : jusqu'a la virgule/retour a la ligne/accolade.
  let j = i;
  while (j < text.length && !',}\n]'.includes(text[j])) j++;
  return j;
}

/** true si `k` peut s'ecrire sans guillemets comme cle d'objet JS. */
function isPlainKey(k) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k);
}

function escapeSingleQuoted(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/** Serialise `value` en litteral TS lisible (guillemets simples, cles nues, virgules finales). */
export function toTs(value, level = 1) {
  const pad = '  '.repeat(level);
  const padIn = '  '.repeat(level + 1);
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'string') return `'${escapeSingleQuoted(value)}'`;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map((v) => `${padIn}${toTs(v, level + 1)},`).join('\n');
    return `[\n${items}\n${pad}]`;
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value).filter((k) => value[k] !== undefined);
    if (keys.length === 0) return '{}';
    const items = keys
      .map((k) => `${padIn}${isPlainKey(k) ? k : `'${escapeSingleQuoted(k)}'`}: ${toTs(value[k], level + 1)},`)
      .join('\n');
    return `{\n${items}\n${pad}}`;
  }
  return JSON.stringify(value);
}

/** Lit la valeur de la propriete top-level `key: ...` (indent 2 espaces) dans le texte d'un site.config.ts. */
export function extractTopLevelValue(text, key) {
  const marker = `\n  ${key}:`;
  const idx = text.indexOf(marker);
  if (idx === -1) return undefined;
  const valueStart = idx + marker.length;
  const end = findValueEnd(text, valueStart);
  const raw = text.slice(valueStart, end).trim();
  if (!raw) return undefined;
  try {
    // eslint-disable-next-line no-new-func
    return new Function(`"use strict"; return (${raw});`)();
  } catch {
    return undefined;
  }
}

/**
 * Remplace (ou insere apres `afterKey`) la propriete top-level `key` dans le texte d'un
 * site.config.ts par la valeur donnee. Retourne le nouveau texte.
 */
export function setTopLevelValue(text, key, value, afterKey = 'slug') {
  const marker = `\n  ${key}:`;
  const idx = text.indexOf(marker);
  const rendered = toTs(value, 1);
  if (idx !== -1) {
    const valueStart = idx + marker.length;
    const end = findValueEnd(text, valueStart);
    let end2 = end;
    while (text[end2] === ' ') end2++;
    if (text[end2] === ',') end2++;
    return text.slice(0, valueStart) + ' ' + rendered + ',' + text.slice(end2);
  }
  // Cle absente : insertion apres la ligne `afterKey:`.
  const afterMarker = `\n  ${afterKey}:`;
  const afterIdx = text.indexOf(afterMarker);
  if (afterIdx === -1) {
    // Repli : insere juste apres l'ouverture de defineSite({.
    const openIdx = text.indexOf('({');
    if (openIdx === -1) return text;
    const insertAt = openIdx + 2;
    return text.slice(0, insertAt) + `\n  ${key}: ${rendered},` + text.slice(insertAt);
  }
  const nl = text.indexOf('\n', afterIdx + 1);
  const insertAt = nl === -1 ? text.length : nl;
  return text.slice(0, insertAt) + `\n  ${key}: ${rendered},` + text.slice(insertAt);
}
