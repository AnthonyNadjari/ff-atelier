# Modèles (presets)

Un modèle = un look complet, nommé, prêt à appliquer en un clic dans `ff studio` (onglet « Modèles »)
ou par `ff modele <slug> <nom-du-modele>`. Un modèle ne contient jamais de contenu : uniquement les
clés de look (les mêmes que `look.json`).

## Format : `presets/<nom>.json`

```json
{
  "nom": "atelier-bois",
  "titre": "Atelier bois",
  "description": "Chaleureux, photo pleine largeur, services en liste, avis Google.",
  "metiers": ["menuisier", "ébéniste", "tapissier"],
  "look": {
    "direction": "atelier",
    "motion": "subtle",
    "scale": "normal",
    "typography": { "display": "fraunces", "body": "inter" },
    "layout": {
      "nav": "bar", "hero": "fullbleed",
      "sections": [ { "type": "services", "variant": "list" }, ... ],
      "footer": "columns", "divider": "none", "tone": "flat"
    },
    "wording": { "devis": "Demander un devis" }
  }
}
```

- `look.layout.sections` liste les sections dans l'ordre ; les sections dont le site n'a pas la donnée
  (faq vide, pas d'avis) disparaissent d'elles-mêmes au build.
- `presets/vignettes/<nom>.webp` : capture 1280×800 du haut de page, générée par `ff vignettes`
  sur le site `_exemple`. Versionnée (petite) pour que le studio les affiche sans rien construire.
- Règle de variété : deux modèles ne partagent jamais le trio direction + hero + services.
