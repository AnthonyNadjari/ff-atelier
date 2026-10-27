/**
 * La demande d'estimation en étapes (site.estimation) : architecture `estimation-etapes` (src/lib/architectures.ts ;
 * source Movers, modèle de déménageur : « Get Your Free Estimate » à droite du h1, étape 1 le type, le départ, l'arrivée,
 * la date, étape 2 les coordonnées ; Déménagements Rigoulet, Gard : « Devis en ligne » à côté du numéro dans la barre ;
 * Les Artisans du Bâtiment : le devis commence dans le premier écran du téléphone ;
 * docs/veille/architectures/estimation-etapes.md). Le premier geste du visiteur est de dire son projet.
 *
 *   - questionsValides() : les questions du client qui se posent (nom, libellé ; un choix a au moins deux réponses) ;
 *   - etapesDe()         : les étapes du formulaire (le projet si 2 prestations ou plus, les questions s'il y en a, les
 *                          coordonnées toujours) avec leur numéro ;
 *   - lienEstimation()   : entrée de nav vers /estimation, dès 2 questions valides ;
 *   - projetDe()         : le slug de prestation lu dans ?projet= s'il existe chez le client (la porte d'une page service) ;
 *   - lignesDeDemande()  : les réponses en lignes « Libellé : valeur » (corps du mailto), dans l'ordre des questions.
 *
 * Module pur, sans import. Testé par tests/architectures-devis.test.mjs via scripts/ff/ts-loader.mjs (loadEstimationModule).
 */

export interface Question {
  nom: string;
  libelle: string;
  type?: 'choix' | 'texte' | 'date' | 'nombre';
  choix?: readonly string[];
  unite?: string;
}

export interface Estimation<Q extends Question = Question> {
  questions?: readonly Q[];
}

export interface Etape {
  n: number;
  cle: 'projet' | 'questions' | 'coordonnees';
}

export function questionsValides<Q extends Question>(e: Estimation<Q> | undefined): Q[] {
  const vus = new Set<string>();
  return (e?.questions ?? []).filter((q) => {
    const nom = (q.nom ?? '').trim();
    if (!nom || !(q.libelle ?? '').trim() || vus.has(nom)) return false;
    if ((q.type ?? 'texte') === 'choix' && (q.choix ?? []).filter((c) => c.trim()).length < 2) return false;
    vus.add(nom);
    return true;
  });
}

export function etapesDe(e: Estimation | undefined, nombreDeServices: number): Etape[] {
  const cles: Etape['cle'][] = [];
  if (nombreDeServices >= 2) cles.push('projet');
  if (questionsValides(e).length > 0) cles.push('questions');
  cles.push('coordonnees');
  return cles.map((cle, i) => ({ n: i + 1, cle }));
}

export function lienEstimation(e: Estimation | undefined, label: string): { href: string; label: string } | undefined {
  return questionsValides(e).length >= 2 ? { href: '/estimation', label } : undefined;
}

export function projetDe(recherche: string, slugs: readonly string[]): string | undefined {
  const m = /[?&]projet=([a-z0-9-]+)/.exec(recherche ?? '');
  return m && slugs.includes(m[1]) ? m[1] : undefined;
}

export function lignesDeDemande(valeurs: Record<string, string>, questions: readonly Question[]): string[] {
  const out: string[] = [];
  for (const q of questions) {
    const v = (valeurs[`q-${q.nom}`] ?? '').trim();
    if (v) out.push(`${q.libelle} : ${v}${q.unite && (q.type ?? 'texte') === 'nombre' ? ` ${q.unite}` : ''}`);
  }
  return out;
}
