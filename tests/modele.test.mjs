// `ff modele <slug> <nom>` (scripts/ff/modele.mjs) : le modèle vérifie que les données que son hero demande sont là
// (mêmes règles que HERO_DE_FAMILLE / varianteCompatible) ; sinon avertissement clair et hero `typographic`, jamais une
// donnée inventée. Né du 29 oct 2026 (un style = un site entier, posé par `ff modele` et `ff melanger --style`).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { exigenceHero, lookAvecHeroVerifie, largeurMaxDuSite, HERO_DE_REPLI, EXIGENCES_HERO, listPresets, readPreset } from '../scripts/ff/modele.mjs';
import { profilClient } from '../scripts/ff/melanger.mjs';

const vide = profilClient();
const riche = profilClient({ couverture: true, largeurMax: 2400, photosSite: 6, urgence: true, avis: 80, temoignages: 2, adresse: true, horaires: 3, video: 'client' });

test('exigenceHero : chaque hero à données dit ce qui lui manque, rien quand c’est là ; typographic et custom/ n’exigent rien', () => {
  assert.equal(exigenceHero('carte-sur-photo', vide), 'images.hero ≥ 1600 px');
  assert.equal(exigenceHero('carte-sur-photo', profilClient({ couverture: true, largeurMax: 1200 })), 'images.hero ≥ 1600 px', 'photo trop petite');
  assert.equal(exigenceHero('mosaique', profilClient({ photosSite: 3 })), '4 photos declarees (couverture, portrait, galerie, services)');
  assert.equal(exigenceHero('mur-de-photos', profilClient({ photosSite: 3 })), '4 photos declarees (couverture, portrait, galerie, services)');
  assert.equal(exigenceHero('numero-geant', vide), 'contact.emergency24h');
  assert.equal(exigenceHero('preuve-d-abord', profilClient({ avis: 80, temoignages: 1 })), 'proof.google et deux proof.testimonials');
  assert.equal(exigenceHero('plan-et-lieu', profilClient({ adresse: true })), 'contact.address.street et contact.hours');
  assert.equal(exigenceHero('fullbleed', vide), 'images.hero');
  assert.equal(exigenceHero('video', vide), 'une vraie video (images.video)');
  for (const h of Object.keys(EXIGENCES_HERO)) assert.equal(exigenceHero(h, riche), null, `${h} avec toutes les données`);
  assert.equal(exigenceHero(HERO_DE_REPLI, vide), null);
  assert.equal(exigenceHero('custom/hero', vide), null);
  assert.equal(exigenceHero(undefined, vide), null);
  // Hero d’un autre style, inconnu de la table : le verdict de varianteCompatible tranche.
  assert.equal(exigenceHero('panneaux-biais', vide, false), 'ses donnees (ff composer, varianteCompatible : hero/panneaux-biais)');
  assert.equal(exigenceHero('panneaux-biais', vide, true), null);
  assert.equal(exigenceHero('panneaux-biais', vide, null), null);
});

test('lookAvecHeroVerifie : hero remplacé par typographic avec l’avertissement en mots quand une donnée manque, look intact sinon', () => {
  const look = { direction: 'casabonay', layout: { shell: 'split', hero: 'mur-de-photos', sections: [] } };
  const r = lookAvecHeroVerifie(look, vide);
  assert.equal(r.look.layout.hero, 'typographic');
  assert.equal(r.look.layout.shell, 'split', 'le reste du layout est gardé');
  assert.equal(r.avertissement, 'le modele demande 4 photos declarees (couverture, portrait, galerie, services) : absent, hero mur-de-photos remplace par typographic');
  assert.equal(look.layout.hero, 'mur-de-photos', 'pure : le modèle lu n’est pas modifié');
  const ok = lookAvecHeroVerifie(look, riche);
  assert.equal(ok.look, look);
  assert.equal(ok.avertissement, null);
  assert.equal(lookAvecHeroVerifie({ direction: 'x' }, vide).avertissement, null, 'sans hero, rien à vérifier');
});

test('largeurMaxDuSite : la plus grande largeur du manifeste images.json, 0 sans manifeste ou illisible', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ff-modele-'));
  try {
    assert.equal(largeurMaxDuSite(dir), 0);
    fs.writeFileSync(path.join(dir, 'images.json'), JSON.stringify({ hero: { widths: [480, 800, 1600, 2000] }, p: { widths: [480] } }));
    assert.equal(largeurMaxDuSite(dir), 2000);
    fs.writeFileSync(path.join(dir, 'images.json'), '{ pas du json');
    assert.equal(largeurMaxDuSite(dir), 0);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('listPresets / readPreset : les modèles de site entier sont nommés comme leur direction, les autres non', () => {
  const tous = listPresets();
  assert.ok(tous.length > 0);
  for (const p of tous) assert.equal(readPreset(p.nom)?.nom, p.nom);
  const entiers = tous.filter((p) => p.look.direction === p.nom);
  for (const p of entiers) assert.ok(fs.existsSync(path.join(import.meta.dirname, '..', 'src', 'directions', p.nom, 'index.css')), `${p.nom} : direction entière src/directions/${p.nom}/`);
  assert.equal(readPreset('zzz-inexistant'), null);
});
