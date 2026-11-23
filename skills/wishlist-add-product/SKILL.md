---
name: wishlist-add-product
description: Ajouter un produit à cette wishlist Astro depuis un lien marchand, vérifier ses informations et préparer sa fiche Markdown et son commit. Utiliser pour un ajout ponctuel ; pas pour une surveillance de prix ni un achat.
---

# Ajouter un produit à la wishlist

Transformer le lien fourni en une fiche locale vérifiée. Le helper matérialise des
informations confirmées ; il ne navigue pas, ne scrape pas les boutiques, ne fait
aucun achat et n'exécute aucune commande Git.

## Retrouver le contexte

Travailler dans le dépôt contenant `src/content.config.ts` et
`docs/product-template.md`, ou fournir son chemin avec `--repo`. Lire `AGENTS.md`,
le schéma et le modèle actuels avant l'ajout. Ne pas modifier l'interface pour
ajouter un produit.

## Vérifier la fiche

Depuis la page marchande, réunir le nom exact, le lien d'achat, la grande catégorie
acceptée par le schéma, la référence si disponible et les variantes souhaitées
(taille, couleur, capacité…). Conserver le lien fourni et ses paramètres utiles ;
une redirection ou une fiche dans un autre pays ne justifie pas de changer la
variante, la boutique ou la devise sans vérification.

`price` représente **le prix initial hors promotion** : relever le prix régulier
explicite de la variante, pas le prix remisé, un montant mensuel, HT, membre, un
prix de pack ou un prix conseillé fabricant présenté comme autre référence. Sans
promotion, le prix normal affiché du produit seul convient. Confirmer la devise,
noter la source, une courte preuve lisible et la date `YYYY-MM-DD`. Ne pas déduire
un prix initial d'un pourcentage de remise. Si le prix initial manque, garder
`price: null` avec une raison ; ne pas remplacer l'inconnu par le prix promotionnel.

Les données structurées (JSON-LD, microdata) peuvent aider, mais `Offer.price`
correspond souvent au prix de vente actuel. Comparer au contenu de la fiche et aux
variantes ; une extraction réussie ne prouve pas que le prix est le prix initial.

Télécharger uniquement une photo vérifiée du bon produit dans `public/images/`,
optimiser son poids si utile et garder son URL dans `imageSource`. Une photo
inconnue reste `null`. Une taille/couleur ambiguë nécessite une question ciblée ;
la collecte peut rester incomplète si l'utilisateur l'accepte.

Rechercher URL et référence dans toutes les fiches, y compris archivées. Une envie
archivée peut déjà être achetée : ne pas la dupliquer ni la réactiver silencieusement.
Des variantes différentes peuvent avoir la même référence ; ne pas les fusionner.

## Matérialiser les informations confirmées

Créer un JSON temporaire suivant l'entrée ci-dessous. Aucun chiffre illustratif
ne doit devenir une donnée réelle. `id` donne un nom de fichier stable.

```json
{
  "id": "reference-produit",
  "title": "Nom exact confirmé",
  "url": "https://boutique.example/produit?color=beige&size=M",
  "image": null,
  "price": null,
  "currency": "EUR",
  "category": "Autres",
  "priceBasis": "unknown",
  "missingPriceReason": "Le prix initial n'est pas indiqué sur la fiche.",
  "reference": "REFERENCE-CONFIRMEE",
  "variant": { "color": "beige", "size": "M" }
}
```

Pour un prix confirmé, remplacer `price` par un nombre, utiliser
`"priceBasis": "regular"` et ajouter `priceCheckedAt`, `priceSource` (URL) et
`priceEvidence` (preuve textuelle courte). Pour une image locale, renseigner
`image: "/images/identifiant.webp"` et `imageSource`. `reference`, `variant` et
`notes` sont facultatifs. `currency` est toujours explicite, même si le prix manque.

Depuis le dossier du skill, ou avec le chemin absolu de celui-ci :

```sh
python3 scripts/create_product.py --repo /chemin/du/depot --input /tmp/produit.json
python3 scripts/create_product.py --repo /chemin/du/depot --input /tmp/produit.json --write
```

La première commande ne crée rien. Le helper refuse l'écrasement, les liens déjà
présents (hors paramètres de tracking connus), les prix sans preuve de prix initial
et les références ambiguës. Il préserve l'URL d'origine. Les références et variantes
sont conservées dans le corps Markdown. Deux variantes ne sont admises pour une même
référence que si les deux fiches les décrivent explicitement et différemment.

Le lecteur de doublons accepte les champs scalaires du modèle. Il s'arrête sur un
YAML complexe au lieu de prétendre l'avoir vérifié. Le helper ne reconnaît pas
universellement les mêmes produits entre boutiques : compléter sa vérification par
la référence et la lecture des fiches. Si le schéma a évolué ou si le helper bloque
un cas légitime, utiliser le modèle actuel après avoir résolu le doute ; ne pas
contourner un doublon par un autre identifiant.

## Vérifier et commiter

Utiliser la version de Node de `.nvmrc`. Formater les seules nouvelles fiches et
vérifier les changements, puis exécuter :

```sh
npm run lint
npm run format:check
npm test
npm run check
npm run build
```

Contrôler le diff, le lien marchand, la bonne photo, la devise, le prix initial et
`archived: false`. Si l'ajout demandé inclut un achat déjà confirmé, gérer ce statut
explicitement au lieu de l'inférer du lien.

Quand l'utilisateur demande l'ajout dans le dépôt, créer un commit de contenu
ciblé, par exemple `feat(content): add reference-produit`. Ajouter explicitement
la fiche, ses images et leurs éventuels fichiers de provenance ; jamais `git add .`.
Ne pas inclure de modifications préexistantes. Ne pas pousser ni publier sans
instruction correspondante. Rapporter la fiche créée, les informations inconnues,
les vérifications et le commit réellement effectué.
