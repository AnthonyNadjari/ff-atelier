// `ff typo` — la fonction PURE de correction typographique francaise (scripts/ff/typo.mjs).
// On ne teste pas la lecture de dist/ ici, seulement le noyau : c'est lui qui reecrit les
// site.config.ts des clients, donc c'est lui qui doit etre incassable. Les cas tordus (URL,
// e-mail, code, attribut HTML, apostrophe dans un nom propre, guillemets imbriques) sont la
// raison d'etre de ce fichier : une regression y coute un texte client abime.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  corrigerTexte,
  controlerTexte,
  guillemetsFrancais,
  textesVisibles,
  analyserHtml,
  corrigerSourceTs,
  corrigerSourceAstro,
  valeurTechnique,
  FINE,
  NBSP,
} from '../scripts/ff/typo.mjs';

/* ---------- Les regles francaises, une par une ---------- */

test('ponctuation double : fine insecable avant ; ! ?, insecable avant :', () => {
  assert.equal(corrigerTexte('Une urgence? Oui!'), `Une urgence${FINE}? Oui${FINE}!`);
  assert.equal(corrigerTexte('Horaires: 9 h'), `Horaires${NBSP}: 9${NBSP}h`);
  assert.equal(corrigerTexte('Ici ; la'), `Ici${FINE}; la`);
});

test('ponctuation double : une espace ordinaire ou insecable est remplacee, pas doublee', () => {
  assert.equal(corrigerTexte('Quel delai ?'), `Quel delai${FINE}?`);
  assert.equal(corrigerTexte(`Quel delai${NBSP}?`), `Quel delai${FINE}?`);
  assert.equal(corrigerTexte('Vraiment !'), `Vraiment${FINE}!`, 'U+2009 est une fine SECABLE : piege classique de &thinsp;');
  // Idempotence : repasser le correcteur ne doit plus rien changer.
  const une = corrigerTexte('Un projet, une urgence? Parlons-en.');
  assert.equal(corrigerTexte(une), une);
});

test('ponctuation double : un groupe « ?! » ne prend qu’une seule fine, en tete', () => {
  assert.equal(corrigerTexte('Ah?!'), `Ah${FINE}?!`);
  assert.equal(corrigerTexte('Oui!!'), `Oui${FINE}!!`);
});

test('ponctuation double : un signe en tete de ligne ne recoit pas d’espace fantome', () => {
  assert.equal(corrigerTexte('! Attention'), '! Attention');
});

test('apostrophe typographique, y compris dans un nom propre', () => {
  assert.equal(corrigerTexte("rue de l'Eglise"), 'rue de l’Église');
  assert.equal(corrigerTexte("Villeneuve-d'Ascq et l'Haÿ-les-Roses"), 'Villeneuve-d’Ascq et l’Haÿ-les-Roses');
  assert.equal(corrigerTexte("Artisan d'art"), 'Artisan d’art');
});

test('guillemets francais, avec leur fine insecable interieure', () => {
  assert.equal(corrigerTexte('Il a dit "bonjour".'), `Il a dit «${FINE}bonjour${FINE}».`);
  assert.equal(corrigerTexte('«bonjour»'), `«${FINE}bonjour${FINE}»`);
  assert.equal(corrigerTexte(`«${FINE}bonjour${FINE}»`), `«${FINE}bonjour${FINE}»`, 'idempotent');
});

test('guillemets imbriques : chevrons au premier niveau, courbes au second', () => {
  assert.equal(
    guillemetsFrancais('Il a dit "le "vrai" chene" ici.'),
    `Il a dit «${FINE}le “vrai” chene${FINE}» ici.`,
  );
});

test('guillemet orphelin (nombre impair) : on n’invente pas de paire', () => {
  assert.equal(corrigerTexte('Une planche de 6" de large.'), 'Une planche de 6" de large.');
});

test('points de suspension, ligature oe et ses exceptions', () => {
  assert.equal(corrigerTexte('Attendez...'), 'Attendez…');
  assert.equal(corrigerTexte('Coeur, soeur, manoeuvre, Marcq-en-Baroeul'), 'Cœur, sœur, manœuvre, Marcq-en-Barœul');
  assert.equal(
    corrigerTexte('Un coefficient, de la moelle, coexister'),
    'Un coefficient, de la moelle, coexister',
    'o et e de syllabes differentes : pas de ligature',
  );
});

test('majuscules accentuees en tete de mot et « A » mis pour « a »', () => {
  assert.equal(corrigerTexte('Etat des lieux a l’Ecole. Etre ou ne pas etre.'), 'État des lieux a l’École. Être ou ne pas etre.');
  assert.equal(corrigerTexte('A partir de mars.'), 'À partir de mars.');
  assert.equal(corrigerTexte('Le plan A reste valable.'), 'Le plan A reste valable.', 'une lettre isolee n’est pas un « à »');
});

test('numero, ordinaux et abreviations de civilite', () => {
  assert.equal(corrigerTexte('N° 4'), `n°${NBSP}4`);
  assert.equal(corrigerTexte('Le 2ème etage, la 1ère fois'), 'Le 2e etage, la 1re fois');
  assert.equal(corrigerTexte('Mr Dupont, Mme. Martin, Dr. Roux, etc...'), 'M. Dupont, Mme Martin, Dr Roux, etc.');
});

test('heures, telephone, prix et unites : insecables aux bons endroits', () => {
  assert.equal(corrigerTexte('Ouvert de 8h a 18h30.'), `Ouvert de 8${NBSP}h a 18${NBSP}h${NBSP}30.`);
  assert.equal(corrigerTexte('Appelez le 06.12.34.56.78'), `Appelez le 06${NBSP}12${NBSP}34${NBSP}56${NBSP}78`);
  assert.equal(corrigerTexte('Tarif 1200€ ou 49 €'), `Tarif 1${FINE}200${NBSP}€ ou 49${NBSP}€`);
  assert.equal(corrigerTexte('Dans un rayon de 30km, a 25°C, 15% de remise'), `Dans un rayon de 30${NBSP}km, a 25${NBSP}°C, 15${NBSP}% de remise`);
  assert.equal(corrigerTexte('24h/24 et 7j/7'), '24h/24 et 7j/7', 'la locution figee ne bouge pas');
});

/* ---------- Les pieges : ce a quoi on ne touche jamais ---------- */

test('piege : une URL traverse la correction intacte', () => {
  const t = 'Voir https://exemple.fr/devis?ref=1&n=2 pour l\'offre.';
  assert.equal(corrigerTexte(t), "Voir https://exemple.fr/devis?ref=1&n=2 pour l’offre.");
});

test('piege : une adresse e-mail et un tel: ne sont pas reponctues', () => {
  assert.equal(corrigerTexte('Ecrivez a contact@exemple.fr'), 'Ecrivez a contact@exemple.fr');
  assert.equal(corrigerTexte('Lien tel:+33600000000 actif'), 'Lien tel:+33600000000 actif');
});

test('piege : balise et attribut HTML intacts, texte autour corrige', () => {
  const t = '<a href="/devis?x=1" title="Un devis">Demandez l\'offre</a> maintenant!';
  assert.equal(
    corrigerTexte(t),
    `<a href="/devis?x=1" title="Un devis">Demandez l’offre</a> maintenant${FINE}!`,
  );
});

test('piege : une entite HTML n’est pas confondue avec du texte', () => {
  assert.equal(corrigerTexte('Marbre &amp; bois ; ici'), `Marbre &amp; bois${FINE}; ici`);
});

test('piege : un bloc de code sur une ligne n’est pas reponctue', () => {
  const t = 'Le selecteur .btn { color: red; } reste tel quel!';
  assert.equal(corrigerTexte(t), `Le selecteur .btn { color: red; } reste tel quel${FINE}!`);
});

test('piege : un nom de fichier et un chemin gardent leur ponctuation', () => {
  assert.equal(corrigerTexte('Ouvrez style.css puis hero.webp.'), 'Ouvrez style.css puis hero.webp.');
});

/* ---------- Detection ---------- */

test('controlerTexte : nomme les regles violees et cite la phrase', () => {
  const infractions = controlerTexte('Une urgence? Tarif 1200€.');
  const ids = infractions.map((i) => i.id);
  assert.ok(ids.includes('espace-avant-ponctuation'), ids.join(','));
  assert.ok(ids.includes('prix'), ids.join(','));
  assert.ok(infractions.every((i) => typeof i.extrait === 'string' && i.extrait.length > 0));
});

test('controlerTexte : un texte deja correct ne remonte rien', () => {
  const propre = corrigerTexte('Un projet, une urgence ? Tarif : 1200 € pour 30km. Coeur.');
  assert.deepEqual(controlerTexte(propre), []);
});

/* ---------- Texte visible d’une page ---------- */

test('textesVisibles : ignore script, style, code et attributs', () => {
  const html = `<html lang="fr"><head><style>.a{content:"x?"}</style></head>
    <body><script>const a = "b?";</script><p title="Titre?">Bonjour l'ami</p>
    <pre><code>const x = 'y';</code></pre></body></html>`;
  const morceaux = textesVisibles(html);
  assert.ok(morceaux.some((m) => m.includes("Bonjour l'ami")));
  assert.ok(!morceaux.some((m) => m.includes('const')), morceaux.join(' | '));
  assert.ok(!morceaux.some((m) => m.includes('Titre?')), morceaux.join(' | '));
});

test('analyserHtml : compte les occurrences et decode les entites', () => {
  const html = '<p>Un devis&nbsp;? Oui</p><p>Et alors?</p><p>Le &quot;chene&quot;</p>';
  const trouve = analyserHtml(html);
  const parId = Object.fromEntries(trouve.map((t) => [t.id, t]));
  assert.equal(parId['espace-avant-ponctuation'].n, 2, 'le &nbsp; est une espace, mais pas la bonne');
  assert.ok(parId.guillemets, 'les &quot; decodes doivent compter comme guillemets droits');
});

/* ---------- Reecriture des sources ---------- */

test('valeurTechnique : reconnait slugs, icones, chemins et numeros bruts', () => {
  for (const v of ['mon-site', 'CookingPot', '/images/hero.webp', '+33600000000', 'https://x.fr', '08:00']) {
    assert.equal(valeurTechnique(v), true, v);
  }
  for (const v of ['Cuisines sur mesure', "Quel delai ?", 'Menuiserie Vasseur']) {
    assert.equal(valeurTechnique(v), false, v);
  }
});

test('corrigerSourceTs : corrige les textes, laisse les valeurs techniques', () => {
  const src = [
    "export default defineSite({",
    "  slug: 'mon-site',",
    "  business: { name: 'Menuiserie Vasseur', trade: 'Menuisier-ebeniste' },",
    "  contact: { phone: '+33600000000', mapsUrl: 'https://maps.google.com/?q=Roubaix' },",
    "  faq: [{ q: 'Quel delai pour une cuisine ?', a: 'Six semaines.' }],",
    "});",
  ].join('\n');
  const out = corrigerSourceTs(src);
  assert.ok(out.includes("slug: 'mon-site'"), 'le slug ne bouge pas');
  assert.ok(out.includes("phone: '+33600000000'"), 'le telephone machine ne bouge pas');
  assert.ok(out.includes("mapsUrl: 'https://maps.google.com/?q=Roubaix'"), "l'URL ne bouge pas");
  assert.ok(out.includes(`Quel delai pour une cuisine${FINE}?`), out);
});

test('corrigerSourceTs : n’introduit pas de guillemet qui casserait le literal', () => {
  const src = "const a = { texte: 'Il a dit \"bonjour\" ici' };";
  const out = corrigerSourceTs(src);
  assert.ok(out.includes('«'), out);
  assert.ok(!out.includes("'Il a dit '"), 'le literal reste bien forme');
  // Le resultat doit rester du JS evaluable.
  assert.doesNotThrow(() => new Function(`${out}; return a;`));
});

test('corrigerSourceTs : commentaires et imports intacts', () => {
  const src = "// N'y touchez pas : c'est un commentaire.\nimport { defineSite } from '@/lib/schema';\nconst t = 'Un titre...';";
  const out = corrigerSourceTs(src);
  assert.ok(out.startsWith("// N'y touchez pas : c'est un commentaire."), out);
  assert.ok(out.includes("from '@/lib/schema'"), out);
  assert.ok(out.includes("'Un titre…'"), out);
});

test('corrigerSourceAstro : frontmatter, balises et expressions intacts', () => {
  const src = [
    '---',
    "import { site } from '@/lib/site';",
    "const titre = \"l'atelier ?\";",
    '---',
    '<section id="menu" class="section-y">',
    '  <h2 set:html={site.wording.ctaTitle}>Nos plats du jour</h2>',
    "  <p>Bonjour l'ami! Le \"vrai\" gout.</p>",
    '</section>',
  ].join('\n');
  const out = corrigerSourceAstro(src);
  assert.ok(out.includes("const titre = \"l'atelier ?\";"), 'le frontmatter ne bouge pas');
  assert.ok(out.includes('class="section-y"'), "l'attribut ne bouge pas");
  assert.ok(out.includes('{site.wording.ctaTitle}'), "l'expression ne bouge pas");
  assert.ok(out.includes(`Bonjour l’ami${FINE}!`), out);
  assert.ok(out.includes(`«${FINE}vrai${FINE}»`), out);
});
