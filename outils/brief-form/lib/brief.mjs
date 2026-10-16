// Mise en forme pure des réponses du formulaire client en brief Markdown (format de docs/BRIEF.md),
// partagée par la fonction Vercel (api/brief.js) et testée (tests/brief-form.test.mjs).
// Règle d'or du brief : une réponse vide reste « ? à demander », jamais devinée.

const QUESTIONS = '? à demander';
const net = (v) => String(v ?? '').replace(/\r\n/g, '\n').trim().slice(0, 4000);
const ou = (v) => net(v) || QUESTIONS;
const liste = (v) => net(v).split('\n').map((l) => l.trim()).filter(Boolean);

/** Slug proposé à partir du nom et de la ville (minuscules, sans accents, tirets). */
export function slugPropose(nom, ville = '') {
  const base = `${net(nom)}`.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/&/g, ' et ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  return base || `client-${net(ville).toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'nouveau'}`;
}

/** Valide le minimum. Renvoie la liste des champs manquants (vide si tout va bien). */
export function champsManquants(d) {
  const requis = { nom: 'nom', metier: 'métier', ville: 'ville', tel: 'téléphone', services: 'services', contact_nom: 'nom du contact' };
  const out = Object.entries(requis).filter(([k]) => !net(d?.[k])).map(([, l]) => l);
  if (!d?.accord) out.push('accord');
  return out;
}

/** Brief Markdown au format de docs/BRIEF.md (sections 1 à 12), prêt pour `sites/<slug>/brief.md`. */
export function briefMarkdown(d, date = new Date()) {
  const jour = date.toISOString().slice(0, 10);
  const services = liste(d.services);
  const photos = Array.isArray(d.photos_dispo) ? d.photos_dispo : [];
  const coche = (v) => (photos.includes(v) ? 'x' : ' ');
  return `# Brief client — ${net(d.nom)} (${net(d.metier)})

Reçu par le formulaire en ligne le ${jour}. Contact : ${net(d.contact_nom)}. Slug proposé : \`${slugPropose(d.nom, d.ville)}\`.
Réponses du client, non retouchées. **Une case « ? à demander » n'est jamais devinée** (docs/BRIEF.md).

## 1. Identité
- **Nom de l'entreprise :** ${ou(d.nom)}
- **Métier affiché :** ${ou(d.metier)}
- **SIRET :** ${ou(d.siret)}
- **Depuis quand ? :** ${ou(d.depuis)}

## 2. Contact
- **Téléphone :** ${ou(d.tel)}
- **E-mail :** ${net(d.email) || 'aucun (ne pas en inventer)'}
- **Adresse — rue :** ${ou(d.rue)}
  code postal : ${ou(d.cp)}
  ville : ${ou(d.ville)}
- **Horaires :**
${liste(d.horaires).map((l) => `  - ${l}`).join('\n') || `  ${QUESTIONS}`}
- **Lien fiche Google :** ${ou(d.google)}

## 3. Zone d'intervention
- ${ou(d.zone)}

## 4. Services
${services.map((s) => `- ${s}`).join('\n') || QUESTIONS}

## 5. Histoire de l'entreprise
${ou(d.histoire)}

## 6. Ce qui les distingue
${ou(d.difference)}

## 7. Avis clients réels
${ou(d.avis)}

## 8. Photos disponibles
- [${coche('Logo')}] Logo
- [${coche('Portrait')}] Portrait / photo de l'artisan ou de l'équipe
- [${coche('Réalisations')}] Photos du travail, de la boutique
- [${coche('Avant/après')}] Photos avant/après
- **Lien vers les photos :** ${ou(d.photos)}

## 9. Réseaux sociaux
- **Instagram :** ${ou(d.instagram)}
- **Facebook :** ${ou(d.facebook)}

## 10. Questions fréquentes (ce que les clients demandent tout le temps)
${ou(d.demandes)}

## 11. Domaine et mise en ligne
- **Domaine :** ${ou(d.domaine)}

## 12. Ressenti du client
- **3 adjectifs :** ${ou(d.adjectifs)}
- **Sites qu'il aime :** ${ou(d.aime)}
- **Ce qu'il ne veut pas :** ${ou(d.deteste)}
- **Qu'est-ce qu'on pourrait filmer chez vous en 5 secondes ? :** ${ou(d.filmer)}
- **Un objet, un papier ou un rituel propre à la boutique :** ${ou(d.objet)}
- **Quand un client hésite, qu'est-ce qui le rassure ? :** ${ou(d.rassure)}
- **Remarques libres :** ${ou(d.remarques)}
`;
}
