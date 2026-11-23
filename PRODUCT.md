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

- Cartes entièrement cliquables vers les liens marchands, avec photo, prix et catégorie.
- Nom conservé pour l'accessibilité, sans titre visible sur les cartes.
- `archived` est un booléen : une carte achetée reste visible et cliquable, grisée, avec une mention « Acheté » et le prix barré.
- Filtre par grande catégorie après le premier affichage minimal.
- Thème clair ou sombre selon le système ; aspect par défaut du preset b0.
- ESLint, Prettier, version exacte de Node dans `.nvmrc`, commits Conventional Commits.
- Collecte automatique, recherche d'offres, alertes de prix et réservation de cadeaux hors de cette version.

## Evidence on Hand

Sept liens marchands fournis dans la conversation. Les prix, images et disponibilités ne doivent pas être inventés. Aucun produit n'a été confirmé comme acheté.

## Product Principles

- Garder une interface minimale.
- Séparer les données des composants.
- Accepter les informations manquantes.
- Livrer chaque comportement dans un commit cohérent et vérifié.
