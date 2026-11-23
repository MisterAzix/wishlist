---
name: wishlist-add-product
description: Ajouter un produit à la wishlist depuis un lien marchand et créer sa fiche Markdown.
---

# Ajouter un produit

Entrée : le lien marchand fourni par l'utilisateur, depuis une session ayant accès
au dépôt de la wishlist.

1. Lire les instructions du dépôt, `src/content.config.ts` et
   `docs/product-template.md`.
2. Ouvrir la page et relever le nom, la photo, le prix initial hors promotion,
   la devise et une catégorie acceptée par le schéma. Sans promotion, utiliser
   le prix normal affiché. Ne pas inventer d'information : un prix ou une photo
   indisponible reste `null`. Poser une question ciblée si la fiche est ambiguë.
3. Vérifier que le lien n'est pas déjà présent dans `src/content/products/`,
   y compris dans les achats archivés. Ne pas écraser ou réactiver une fiche
   existante sans demande.
4. Copier le modèle dans `src/content/products/<nom-du-produit>.md` et remplir
   ses champs avec les informations trouvées. Conserver le lien fourni et ses
   paramètres. Utiliser `archived: false` pour une nouvelle envie. Enregistrer
   la photo dans `public/images/` et son chemin dans `image` ; conserver
   `imageSource` et `priceCheckedAt` lorsque ces informations sont disponibles.
5. Formater la fiche, puis lancer `npm run validate:products` depuis la racine
   du dépôt. Le script `scripts/validate-products.ts` vérifie les fiches Markdown
   avec le même schéma que le site, refuse les champs inconnus, vérifie les images
   locales et détecte les liens en double, achats archivés compris. Il ne vérifie
   pas l'exactitude des informations marchandes : celle-ci repose sur la lecture
   de la page. Corriger les erreurs, puis exécuter les contrôles de `AGENTS.md`.
   Vérifier le diff, puis créer un commit ciblé, par exemple
   `feat(content): add product-name`, avec uniquement la fiche et ses images.
   Laisser les autres modifications du dépôt à l'écart et ne pas pousser sans demande.

Rapporter la fiche créée, les informations manquantes et le commit effectué.
