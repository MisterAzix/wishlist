# Wishlist

Une wishlist statique, en français, à consulter sur téléphone ou ordinateur.
Chaque carte ouvre la page marchande d’origine et affiche la photo, le prix et la catégorie.
Les produits achetés restent visibles, grisés et marqués « Acheté ».

Astro, TypeScript strict, React, Tailwind et shadcn/ui avec le preset `b0`.
Les composants sont générés en HTML ; seuls le filtre et le thème utilisent un peu de JavaScript.

## Démarrer

```sh
nvm install
nvm use
npm ci
npm run dev
```

La version exacte de Node est définie dans `.nvmrc`. Utiliser l’URL affichée par Astro.

## Vérifier le projet

```sh
npm run lint
npm run format:check
npm run check
npm run build
```

`npm run lint:fix` applique les corrections ESLint disponibles ; `npm run format`
formate les fichiers. `npm run preview` sert le résultat de `dist/`.
La CI exécute les quatre vérifications à chaque push et pull request.

## Ajouter un produit

1. Copier `docs/product-template.md` dans `src/content/products/` avec un nom stable,
   par exemple `mon-produit.md`.
2. Renseigner le nom exact, le lien marchand et une grande catégorie.
3. Placer la photo dans `public/images/`, de préférence en WebP, puis indiquer
   `/images/mon-produit.webp` dans la fiche. Conserver son URL d’origine dans `imageSource`.
4. Renseigner le prix, sa devise et `priceCheckedAt` si le prix a été vérifié.
   Utiliser `null` pour une photo ou un prix inconnu.
5. Exécuter les vérifications, puis créer un commit Conventional Commits.

Exemple de structure (les valeurs sont illustratives) :

```yaml
---
title: "Nom du produit"
url: "https://example.com/produit?couleur=beige"
image: null
price: null
currency: "EUR"
category: "Vêtements"
archived: false
---
```

Le titre sert au nom accessible du lien et au texte alternatif de l’image ; il
n’apparaît pas sur la carte. Les éventuelles notes sous le frontmatter restent dans
le dépôt et ne sont pas affichées sur le site.

Catégories acceptées : Vêtements, Musique, Maison, Accessoires, High-tech, Loisirs,
Autres. Le filtre ne propose que les catégories effectivement présentes.

Avant d’ajouter un produit, rechercher son URL et sa référence dans les fiches
existantes, y compris celles avec `archived: true`. Conserver les paramètres de
variante utiles dans le lien marchand. Ne pas fusionner deux variantes distinctes.

Les prix sont des relevés ponctuels, pas des prix actualisés automatiquement.
La fiche UNIQLO initiale conserve un prix inconnu. Aucune des envies initiales
n’a été déclarée achetée.

## Marquer comme acheté

Modifier uniquement le champ dans la fiche concernée :

```yaml
archived: true
```

La carte reste cliquable. Sa photo devient grisée, son prix est barré et une mention
« Acheté » apparaît. Pour la réactiver, remettre `archived: false`.
Le changement est partagé avec tout le monde après publication.

## Thèmes

Le site suit la préférence claire ou sombre du système, dès le premier affichage
et lorsque celle-ci change. Les variables du preset shadcn sont conservées.

## Publier sur GitHub Pages

1. Relier ce dépôt local au dépôt GitHub souhaité.
2. Dans **Settings → Pages → Build and deployment**, choisir **GitHub Actions**.
3. Publier le code sur `main` pour déclencher le workflow **Validate and deploy**.

Le déploiement ne démarre qu’après réussite des contrôles. Les autres branches et
les pull requests sont vérifiées sans publication. Le workflow peut aussi être
lancé manuellement sur `main`.

GitHub Pages fournit automatiquement l’origine et le sous-chemin du site au build.
Cela fonctionne pour un dépôt de projet et pour un dépôt `compte.github.io`.
Pour tester un sous-chemin localement :

```sh
SITE_URL=https://example.github.io BASE_PATH=/wishlist npm run build
```

Le site publié est une page publique. Il n’a pas d’interface d’administration :
les produits sont modifiés dans Git depuis une session Codex ayant accès au dépôt.

## Historique

Utiliser Conventional Commits et séparer les changements du site des ajouts de
produits. Exemples :

```text
feat(wishlist): display linked product cards
feat(filters): filter products by category
feat(content): add a new product
```
