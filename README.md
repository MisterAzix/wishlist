# Wishlist

Une wishlist statique, en français, à consulter sur téléphone ou ordinateur.
Chaque carte ouvre la page marchande d’origine et affiche le titre, la photo, le prix initial et la catégorie.
Les produits achetés sont masqués par défaut ; une option permet de les afficher, grisés et marqués « Acheté ».

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
npm run validate:products
npm test
npm run check
npm run build
```

`npm run lint:fix` applique les corrections ESLint disponibles ; `npm run format`
formate les fichiers. `npm run preview` sert le résultat de `dist/`.
La CI exécute lint, formatage, validation des fiches, tests, contrôle des types et build à chaque push et pull request.

## Ajouter avec le skill Codex

La source du skill est versionnée dans `skills/wishlist-add-product/`. Lorsqu'il est
installé dans Codex, une session ayant accès au dépôt peut l'invoquer avec :

```text
$wishlist-add-product https://boutique.example/produit
```

L'agent lit la page, vérifie les champs utiles et recherche le lien dans les fiches
existantes, achats compris. Il crée ensuite la fiche à partir de
`docs/product-template.md`, conserve le lien fourni et demande une précision si
nécessaire. Le skill guide les contrôles et le commit ciblé de la fiche et de ses
images. `npm run validate:products` vérifie les fichiers Markdown avec le schéma du
site, refuse les champs inconnus et détecte les images manquantes et les liens
dupliqués, achats compris. La commande n'écrit aucun fichier et ne consulte pas
les boutiques ; l'agent reste responsable de vérifier les informations à la source.
Aucun JSON intermédiaire n'est nécessaire.

## Ajouter un produit

1. Copier `docs/product-template.md` dans `src/content/products/` avec un nom stable,
   par exemple `mon-produit.md`.
2. Renseigner le nom exact, le lien marchand et une grande catégorie.
3. Placer la photo dans `public/images/`, de préférence en WebP, puis indiquer
   `/images/mon-produit.webp` dans la fiche. Conserver son URL d’origine dans `imageSource`.
4. Renseigner le prix initial hors promotion, sa devise et `priceCheckedAt`. Si aucune
   promotion n’est affichée, utiliser le prix normal du produit seul. Ne pas confondre
   avec le prix d’un pack ou un tarif conseillé fabricant. Utiliser `null` si le prix
   initial est introuvable ou si la photo manque.
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

Le titre apparaît sur la carte et sert aussi au nom accessible du lien et au texte
alternatif de l’image. Les éventuelles notes sous le frontmatter restent dans
le dépôt et ne sont pas affichées sur le site.

Catégories acceptées : Vêtements, Musique, Maison, Accessoires, High-tech, Loisirs,
Autres. Le filtre ne propose que les catégories effectivement présentes.

Avant d’ajouter un produit, rechercher son URL et sa référence dans les fiches
existantes, y compris celles avec `archived: true`. Conserver les paramètres de
variante utiles dans le lien marchand. Ne pas fusionner deux variantes distinctes.

Les prix sont des relevés ponctuels, pas des prix actualisés automatiquement.
Aucune des envies initiales n’a été déclarée achetée.

## Marquer comme acheté

Modifier uniquement le champ dans la fiche concernée :

```yaml
archived: true
```

La carte est masquée par défaut. Cocher « Afficher les produits achetés » permet de la voir :
elle reste cliquable, sa photo devient grisée, son prix est barré et une mention
« Acheté » apparaît. Pour la réactiver, remettre `archived: false`.
Le changement est partagé avec tout le monde après publication.

## Thèmes

Le sélecteur **Thème** permet de choisir **Système**, **Clair** ou **Sombre**. Le choix
est conservé localement dans le navigateur. Par défaut, le site suit le système,
y compris ses changements pendant la consultation. Les variables du preset shadcn
sont conservées.

## Filtrer et trier

La catégorie, l’affichage des achats et le tri sont combinables. Les tris disponibles
sont A–Z, Z–A, prix croissant et prix décroissant. Les prix manquants restent à la
fin des tris de prix. Si plusieurs devises sont présentes, les prix sont regroupés
par devise plutôt que comparés à tort sans conversion.

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
