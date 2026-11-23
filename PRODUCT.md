# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro statique, TypeScript strict, shadcn/ui preset `b0`, Tailwind CSS et React pour les composants shadcn. Hébergement prévu sur GitHub Pages.

## Users

Le propriétaire alimente sa wishlist depuis une session Codex. Sa famille la consulte sur téléphone ou ordinateur pour choisir des cadeaux ou s'en inspirer.

## Product Purpose

Centraliser les envies du quotidien et partager leurs liens d'achat dans une page simple.

## Operating Context

Un fichier Markdown par produit, versionné dans Git. Les ajouts et les achats sont modifiés dans les fichiers puis publiés. Aucun traitement IA n'est nécessaire lors de la consultation.

## Capabilities and Constraints

- Cartes entièrement cliquables vers les liens marchands dans un nouvel onglet, avec titre visible, photo, prix initial hors promotion et catégorie.
- Conserver le prix normal affiché lorsqu'aucune promotion n'est présentée ; ne pas le confondre avec un prix de pack ou un tarif conseillé fabricant.
- `archived` est un booléen : les achats sont masqués par défaut. Un filtre permet de les inclure ; ils restent cliquables, grisés, marqués « Acheté », avec le prix barré.
- Filtre par grande catégorie, combinable avec l'affichage des achats et les tris prix croissant/décroissant et A–Z/Z–A.
- Prix manquants en fin de tri ; pas de comparaison numérique trompeuse entre devises différentes.
- Sélecteur de thème Système/Clair/Sombre, avec préférence locale persistante ; aspect par défaut du preset b0.
- ESLint, Prettier, version exacte de Node dans `.nvmrc`, commits Conventional Commits.
- Collecte automatique, recherche d'offres, alertes de prix et réservation de cadeaux hors de cette version.
- Ajout assisté par un skill Codex prenant un lien marchand en entrée, avec création déterministe d'une fiche à partir d'informations vérifiées et commit ciblé.

## Evidence on Hand

Sept liens marchands fournis dans la conversation. Les prix, images et disponibilités ne doivent pas être inventés. Aucun produit n'a été confirmé comme acheté.

## Product Principles

- Garder une interface minimale.
- Séparer les données des composants.
- Accepter les informations manquantes.
- Livrer chaque comportement dans un commit cohérent et vérifié.
