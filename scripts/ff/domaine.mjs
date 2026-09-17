// `ff domaine <slug> <domaine> [--zone-id X] [--email-vers adresse] [--www] [--simuler]` :
// branche un site deja deploye (`ff deploy`) sur un domaine personnalise, avec e-mail optionnel,
// en une seule commande. Verifie via WebFetch sur developers.cloudflare.com/api/ (voir docs/DEPLOIEMENT.md
// § "Domaine en une commande" pour le detail et ce qui n'a pas pu etre confirme).
//
// Architecture : les fonctions `req*` ci-dessous sont pures (entrees -> { method, url, body }), sans
// I/O — testees par node --test tests/domaine.test.mjs. `cfFetch` est le seul point qui appelle
// vraiment l'API. `--simuler` imprime la sequence de requetes qu'un lancement reel tenterait (en
// supposant le cas "rien n'existe encore") sans jamais appeler `fetch`, pour pouvoir tester la
// commande sans jeton Cloudflare reel.
import fs from 'node:fs';
import path from 'node:path';
import { SITES_DIR, resolveSlug, parseArgs, envKey, ok, fail, warn, info, c } from './util.mjs';

export const API_BASE = 'https://api.cloudflare.com/client/v4';

// ---- Constructeurs de requetes (purs, testes unitairement) ----

export function reqGetProject(accountId, projet) {
  return { method: 'GET', url: `${API_BASE}/accounts/${accountId}/pages/projects/${projet}` };
}

export function reqCreateProject(accountId, projet) {
  return {
    method: 'POST',
    url: `${API_BASE}/accounts/${accountId}/pages/projects`,
    body: { name: projet, production_branch: 'main' },
  };
}

export function reqListZones(domaine) {
  return { method: 'GET', url: `${API_BASE}/zones?${new URLSearchParams({ name: domaine })}` };
}

export function reqAddPagesDomain(accountId, projet, domaine) {
  return {
    method: 'POST',
    url: `${API_BASE}/accounts/${accountId}/pages/projects/${projet}/domains`,
    body: { name: domaine },
  };
}

export function reqListDnsRecords(zoneId, name, type = 'CNAME') {
  return {
    method: 'GET',
    url: `${API_BASE}/zones/${zoneId}/dns_records?${new URLSearchParams({ type, name })}`,
  };
}

export function reqCreateDnsRecord(zoneId, name, content) {
  return {
    method: 'POST',
    url: `${API_BASE}/zones/${zoneId}/dns_records`,
    body: { type: 'CNAME', name, content, proxied: true, ttl: 1 },
  };
}

export function reqUpdateDnsRecord(zoneId, recordId, name, content) {
  return {
    method: 'PUT',
    url: `${API_BASE}/zones/${zoneId}/dns_records/${recordId}`,
    body: { type: 'CNAME', name, content, proxied: true, ttl: 1 },
  };
}

export function reqEnableEmailRouting(zoneId) {
  return { method: 'POST', url: `${API_BASE}/zones/${zoneId}/email/routing/enable` };
}

export function reqCreateDestinationAddress(accountId, email) {
  return {
    method: 'POST',
    url: `${API_BASE}/accounts/${accountId}/email/routing/addresses`,
    body: { email },
  };
}

export function reqListRoutingRules(zoneId) {
  return { method: 'GET', url: `${API_BASE}/zones/${zoneId}/email/routing/rules` };
}

export function reqCreateRoutingRule(zoneId, matchAddress, destinationEmail) {
  return {
    method: 'POST',
    url: `${API_BASE}/zones/${zoneId}/email/routing/rules`,
    body: {
      name: `ff domaine : ${matchAddress} -> ${destinationEmail}`,
      enabled: true,
      matchers: [{ type: 'literal', field: 'to', value: matchAddress }],
      actions: [{ type: 'forward', value: [destinationEmail] }],
    },
  };
}

export function reqListMxRecords(zoneId) {
  return { method: 'GET', url: `${API_BASE}/zones/${zoneId}/dns_records?${new URLSearchParams({ type: 'MX' })}` };
}

// ---- Appel reel ----

async function cfFetch(token, { method, url, body }) {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    // reponse sans corps JSON (rare, mais on ne casse pas dessus)
  }
  return { status: res.status, ok: res.ok, json };
}

function printSimulation(descriptor, note) {
  info(`  ${c.dim('[simulation]')} ${descriptor.method} ${descriptor.url}`);
  if (descriptor.body) info(`  ${c.dim('  corps :')} ${JSON.stringify(descriptor.body)}`);
  if (note) info(`  ${c.dim('  ' + note)}`);
}

const SCOPES_MESSAGE = [
  'Jeton API Cloudflare manquant ou incomplet (CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID).',
  '',
  'A creer une fois : Cloudflare dashboard -> My Profile -> API Tokens -> Create Token -> Custom Token, avec ces permissions :',
  '  - Account -> Cloudflare Pages -> Edit    (creer/lister le projet Pages, ajouter le domaine)',
  '  - Zone -> Zone -> Read                   (retrouver la zone du domaine)',
  '  - Zone -> DNS -> Edit                    (creer/mettre a jour les enregistrements CNAME)',
  '  - Zone -> Email Routing Rules -> Edit    (activer Email Routing, creer la regle de redirection)',
  '',
  "Renseigne ensuite CLOUDFLARE_API_TOKEN et CLOUDFLARE_ACCOUNT_ID dans .env (voir .env.example) ou dans l'environnement.",
  "L'Account ID est visible dans le dashboard Cloudflare, colonne de droite de n'importe quelle page de compte.",
].join('\n');

export async function cmdDomaine(args) {
  const { positional, flags } = parseArgs(args);
  const slug = resolveSlug(positional[0]);
  const domaine = positional[1];
  const simuler = Boolean(flags.simuler);
  const avecWww = Boolean(flags.www);
  const emailVers = typeof flags['email-vers'] === 'string' ? flags['email-vers'] : null;
  const zoneIdFlag = typeof flags['zone-id'] === 'string' ? flags['zone-id'] : null;

  if (!domaine) {
    fail('Usage : ff domaine <slug> <domaine> [--zone-id X] [--email-vers adresse] [--www] [--simuler]');
    process.exit(1);
  }

  const projet = slug;
  const token = envKey('CLOUDFLARE_API_TOKEN');
  const accountId = envKey('CLOUDFLARE_ACCOUNT_ID');

  if (!simuler && (!token || !accountId)) {
    fail(SCOPES_MESSAGE.split('\n')[0]);
    info('');
    info(SCOPES_MESSAGE.split('\n').slice(1).join('\n'));
    process.exit(1);
  }

  if (simuler) {
    info(c.bold(`Simulation — ff domaine ${slug} ${domaine}${avecWww ? ' --www' : ''}${emailVers ? ` --email-vers ${emailVers}` : ''}`));
    info("Aucune requete n'est envoyee. Les appels ci-dessous supposent que rien n'existe encore cote Cloudflare");
    info('(en reel, chaque etape verifie d\'abord l\'existant : idempotent, ne duplique rien).');
    info('');

    info(c.bold('1. Projet Cloudflare Pages'));
    printSimulation(reqGetProject(accountId || '<ACCOUNT_ID>', projet));
    printSimulation(reqCreateProject(accountId || '<ACCOUNT_ID>', projet), 'si l\'etape precedente rend 404');
    info('');

    info(c.bold('2. Zone du domaine'));
    const zoneId = zoneIdFlag || '<ZONE_ID_A_DETECTER>';
    if (!zoneIdFlag) printSimulation(reqListZones(domaine));
    info('');

    const domaines = avecWww ? [domaine, `www.${domaine}`] : [domaine];
    info(c.bold('3. Domaine(s) personnalise(s) + DNS'));
    for (const d of domaines) {
      printSimulation(reqAddPagesDomain(accountId || '<ACCOUNT_ID>', projet, d));
      printSimulation(reqListDnsRecords(zoneId, d), 'pour verifier si un CNAME existe deja');
      printSimulation(reqCreateDnsRecord(zoneId, d, `${slug}.pages.dev`), "si aucun enregistrement trouve, sinon reqUpdateDnsRecord (PUT) sur l'id trouve");
    }
    info('');

    if (emailVers) {
      info(c.bold('4. Email Routing'));
      printSimulation(reqEnableEmailRouting(zoneId));
      printSimulation(reqCreateDestinationAddress(accountId || '<ACCOUNT_ID>', emailVers));
      printSimulation(reqListRoutingRules(zoneId), 'pour eviter de dupliquer la regle si elle existe deja');
      printSimulation(reqCreateRoutingRule(zoneId, `contact@${domaine}`, emailVers));
      printSimulation(reqListMxRecords(zoneId), 'pour afficher le statut des enregistrements MX');
      info('');
    }

    info(c.bold('5. Fichier local'));
    info(`  ${c.dim('[simulation]')} ecriture de sites/${slug}/domain.txt avec "${domaine}"`);
    info('');
    ok('Simulation terminee (aucun appel reseau).');
    return;
  }

  // ---- Mode reel ----

  info(`Verification du projet Cloudflare Pages "${projet}"...`);
  let getProject = await cfFetch(token, reqGetProject(accountId, projet));
  if (getProject.status === 404) {
    info(`Projet "${projet}" absent, creation...`);
    const created = await cfFetch(token, reqCreateProject(accountId, projet));
    if (!created.ok) {
      fail(`Creation du projet Pages echouee : ${JSON.stringify(created.json?.errors ?? created.json)}`);
      process.exit(1);
    }
    ok(`Projet "${projet}" cree.`);
  } else if (!getProject.ok) {
    fail(`Impossible de verifier le projet Pages "${projet}" : ${JSON.stringify(getProject.json?.errors ?? getProject.json)}`);
    process.exit(1);
  } else {
    ok(`Projet "${projet}" trouve.`);
  }

  info(`Recherche de la zone Cloudflare pour "${domaine}"...`);
  let zoneId = zoneIdFlag;
  if (!zoneId) {
    const zonesRes = await cfFetch(token, reqListZones(domaine));
    const zone = zonesRes.json?.result?.[0];
    if (!zonesRes.ok || !zone) {
      fail(`Aucune zone Cloudflare trouvee pour "${domaine}".`);
      info('');
      info(c.bold('Pour ajouter ce domaine a Cloudflare :'));
      info('  1. Cloudflare dashboard -> Add a domain -> renseigne le domaine.');
      info('  2. Cloudflare indique les serveurs de noms (nameservers) a poser.');
      info("  3. Chez le bureau d'enregistrement (registrar) du client, remplace les serveurs de noms");
      info('     actuels par ceux de Cloudflare (propagation : quelques minutes a 24-48h).');
      info('  4. Relance `ff domaine` une fois la zone active dans Cloudflare.');
      process.exit(1);
    }
    zoneId = zone.id;
    ok(`Zone trouvee : ${zoneId}.`);
  }

  const domaines = avecWww ? [domaine, `www.${domaine}`] : [domaine];
  for (const d of domaines) {
    info(`Ajout du domaine personnalise "${d}" au projet Pages...`);
    const addRes = await cfFetch(token, reqAddPagesDomain(accountId, projet, d));
    if (!addRes.ok) {
      const errs = JSON.stringify(addRes.json?.errors ?? addRes.json);
      // code 8000018 / message "already exists" -> deja associe, idempotent, pas une erreur.
      if (/already exists|deja/i.test(errs)) {
        warn(`Domaine "${d}" deja associe au projet Pages.`);
      } else {
        fail(`Ajout du domaine "${d}" echoue : ${errs}`);
        process.exit(1);
      }
    } else {
      ok(`Domaine "${d}" ajoute au projet Pages.`);
    }

    info(`Verification du DNS pour "${d}"...`);
    const listRes = await cfFetch(token, reqListDnsRecords(zoneId, d));
    const existing = listRes.json?.result?.[0];
    const target = `${slug}.pages.dev`;
    if (existing && existing.content === target) {
      ok(`Enregistrement CNAME deja correct pour "${d}".`);
    } else if (existing) {
      const upd = await cfFetch(token, reqUpdateDnsRecord(zoneId, existing.id, d, target));
      if (!upd.ok) {
        fail(`Mise a jour du CNAME pour "${d}" echouee : ${JSON.stringify(upd.json?.errors ?? upd.json)}`);
        process.exit(1);
      }
      ok(`Enregistrement CNAME mis a jour pour "${d}" -> ${target}.`);
    } else {
      const crt = await cfFetch(token, reqCreateDnsRecord(zoneId, d, target));
      if (!crt.ok) {
        fail(`Creation du CNAME pour "${d}" echouee : ${JSON.stringify(crt.json?.errors ?? crt.json)}`);
        process.exit(1);
      }
      ok(`Enregistrement CNAME cree pour "${d}" -> ${target}.`);
    }
  }

  if (emailVers) {
    info('Activation de Email Routing sur la zone...');
    const enableRes = await cfFetch(token, reqEnableEmailRouting(zoneId));
    if (!enableRes.ok) {
      const errs = JSON.stringify(enableRes.json?.errors ?? enableRes.json);
      if (/already|deja/i.test(errs)) {
        warn('Email Routing deja actif sur cette zone.');
      } else {
        warn(`Activation Email Routing : ${errs} (verifie manuellement dans le dashboard si besoin).`);
      }
    } else {
      ok('Email Routing active (enregistrements MX poses automatiquement par Cloudflare).');
    }

    info(`Enregistrement de l'adresse de destination "${emailVers}"...`);
    const destRes = await cfFetch(token, reqCreateDestinationAddress(accountId, emailVers));
    if (!destRes.ok) {
      const errs = JSON.stringify(destRes.json?.errors ?? destRes.json);
      if (/already|deja/i.test(errs)) {
        warn(`Adresse "${emailVers}" deja enregistree.`);
      } else {
        warn(`Enregistrement de l'adresse de destination : ${errs}`);
      }
    } else {
      ok(`Adresse "${emailVers}" enregistree (verification requise, voir ci-dessous).`);
    }

    const contactAddress = `contact@${domaine}`;
    info(`Creation de la regle ${contactAddress} -> ${emailVers}...`);
    const rulesRes = await cfFetch(token, reqListRoutingRules(zoneId));
    const already = rulesRes.json?.result?.find((r) =>
      r.matchers?.some((m) => m.value === contactAddress) && r.actions?.some((a) => a.value?.includes(emailVers)),
    );
    if (already) {
      ok(`Regle ${contactAddress} -> ${emailVers} deja presente.`);
    } else {
      const ruleRes = await cfFetch(token, reqCreateRoutingRule(zoneId, contactAddress, emailVers));
      if (!ruleRes.ok) {
        fail(`Creation de la regle de redirection echouee : ${JSON.stringify(ruleRes.json?.errors ?? ruleRes.json)}`);
        process.exit(1);
      }
      ok(`Regle ${contactAddress} -> ${emailVers} creee.`);
    }

    info('');
    warn(`Cloudflare envoie un e-mail de verification a ${emailVers} : le client doit cliquer le lien avant que la redirection fonctionne.`);

    const mxRes = await cfFetch(token, reqListMxRecords(zoneId));
    const mxCount = mxRes.json?.result?.length ?? 0;
    if (mxCount > 0) {
      ok(`${mxCount} enregistrement(s) MX en place sur la zone.`);
    } else {
      warn('Aucun enregistrement MX trouve — relance la commande dans quelques minutes si Email Routing vient juste d\'etre active.');
    }
  }

  fs.mkdirSync(path.join(SITES_DIR, slug), { recursive: true });
  fs.writeFileSync(path.join(SITES_DIR, slug, 'domain.txt'), `${domaine}\n`);
  ok(`sites/${slug}/domain.txt ecrit ("${domaine}").`);

  info('');
  info(c.bold('Checklist finale :'));
  info('  1. Propagation DNS : quelques minutes a quelques heures (immediat si le domaine est deja sur Cloudflare).');
  info('  2. HTTPS : certificat pose automatiquement par Cloudflare une fois le DNS propage, rien a faire.');
  info(`  3. Reconstruis le site pour que le canonical/sitemap refletent le domaine : node scripts/ff.mjs build ${slug}`);
  info(`  4. Teste le formulaire de contact sur https://${domaine}/ une fois le site en ligne.`);
  info(`  5. Soumets le sitemap dans Search Console : https://search.google.com/search-console -> Sitemaps -> https://${domaine}/sitemap-index.xml`);
  info('  6. Ajoute/verifie la fiche Bing Places : https://www.bingplaces.com/');
  info("  7. Relie ce domaine a la fiche Google Business Profile (GBP) du client (site web -> ce domaine).");
  if (emailVers) {
    info(`  8. Rappelle au client de confirmer l'e-mail de verification Cloudflare recu a ${emailVers}.`);
  }
}
