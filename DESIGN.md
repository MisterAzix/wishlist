---
name: Wishlist Maxence
description: Une galerie simple, dans le thème shadcn b0 par défaut.
colors:
  background: "oklch(1 0 0)"
  foreground: "oklch(0.145 0 0)"
  card: "oklch(1 0 0)"
  primary: "oklch(0.205 0 0)"
  primary-foreground: "oklch(0.985 0 0)"
  secondary: "oklch(0.97 0 0)"
  secondary-foreground: "oklch(0.205 0 0)"
  muted: "oklch(0.97 0 0)"
  muted-foreground: "oklch(0.556 0 0)"
  input: "oklch(0.922 0 0)"
  ring: "oklch(0.708 0 0)"
  photo: "#ffffff"
  background-dark: "oklch(0.145 0 0)"
  foreground-dark: "oklch(0.985 0 0)"
  card-dark: "oklch(0.205 0 0)"
  primary-dark: "oklch(0.922 0 0)"
  primary-foreground-dark: "oklch(0.205 0 0)"
  secondary-dark: "oklch(0.269 0 0)"
  secondary-foreground-dark: "oklch(0.985 0 0)"
  muted-dark: "oklch(0.269 0 0)"
  muted-foreground-dark: "oklch(0.708 0 0)"
  input-dark: "oklch(1 0 0 / 15%)"
  ring-dark: "oklch(0.556 0 0)"
typography:
  headline:
    fontFamily: '"Inter Variable", sans-serif'
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: '"Inter Variable", sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  price:
    fontFamily: '"Inter Variable", sans-serif'
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
  price-wide:
    fontFamily: '"Inter Variable", sans-serif'
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.555556
  control:
    fontFamily: '"Inter Variable", sans-serif'
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.428571
  label:
    fontFamily: '"Inter Variable", sans-serif'
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.333333
rounded:
  lg: "0.625rem"
  xl: "0.875rem"
  4xl: "1.625rem"
spacing:
  2: "0.5rem"
  3: "0.75rem"
  4: "1rem"
  5: "1.25rem"
  6: "1.5rem"
  8: "2rem"
components:
  product-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
  category-badge:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.4xl}"
    padding: "0.125rem 0.5rem"
    height: "1.25rem"
  category-select:
    typography: "{typography.control}"
    rounded: "{rounded.lg}"
    padding: "0.25rem 2rem 0.25rem 0.625rem"
    height: "2rem"
---

# Design System: Wishlist Maxence

## Overview

**Creative North Star: "La galerie simple"**

Une galerie compacte laisse les photographies marchandes porter la personnalité des produits. Le cadre reste celui du preset shadcn `b0` : style `base-nova`, base `neutral` et Inter, sans personnalisation du thème.

Le thème propose Système, Clair et Sombre et conserve le choix localement ; Système suit les changements de préférence pendant la consultation. La sobriété vient des composants par défaut et d'une hiérarchie courte, sans décor ajouté.

**Key Characteristics:**

- Palette neutre, en clair et en sombre.
- Photographies contenues dans des carrés blancs.
- Prix lisible et catégorie secondaire.
- États explicites et navigation au clavier visible.

## Colors

Les valeurs normatives ci-dessus reprennent les variables de `src/styles/global.css` ; les clés terminées par `-dark` sont leurs variantes sombres. Les variables CSS restent la source d'implémentation.

### Primary

- **Encre primaire** : sélection native du contrôle ; le premier plan associé assure son contraste.

### Neutral

- **Fond et encre** : page et texte principal ; les cartes utilisent leur propre surface et le même premier plan.
- **Gris secondaire** : fond et texte des badges, sans accent de catégorie.
- **Gris atténué** : sous-titre, informations manquantes et prix acheté ; sa surface sert aussi au survol et à l'archive, avec une opacité de 40 %.
- **Contour de saisie et anneau** : bord du filtre et repères de focus.
- **Blanc photo** : reste blanc dans les deux thèmes ; le repli « Photo indisponible » utilise la surface atténuée.

**The Preset Rule.** Conserver les valeurs et le comportement du preset b0 ; ne pas ajouter une palette ou un thème propre à la galerie.

## Typography

Inter Variable, avec repli sans-serif, sert à tous les rôles. La graisse et l'espacement établissent la hiérarchie, sans police d'affichage distincte.

- **Headline** : titre de page compact, avec approche resserrée.
- **Body** : sous-titre et messages d'état visibles.
- **Price** : graisse semi-grasse et chiffres tabulaires ; le rôle `price-wide` prend le relais à partir de 640 px.
- **Control** : filtre natif et texte du repli photo.
- **Label** : badges de catégorie et d'achat, en casse naturelle.

Les noms des produits apparaissent en titre visible dans chaque carte (Inter 16 px, graisse 500, interligne 1,375) et restent disponibles dans le nom accessible du lien et le texte alternatif de l'image.

## Layout

Le conteneur centré atteint 72 rem. Ses marges internes sont de 20 px sur les côtés et 40 px verticalement ; à partir de 640 px, elles passent à 32 px et 64 px. L'en-tête place le titre au-dessus du sélecteur de thème sur petit écran, puis les aligne verticalement au centre d'une même ligne à partir de 640 px. Son espacement interne est de 24 px. Un espace de 32 px sépare l'en-tête des contrôles de catégorie, de tri et d'achats ; ces contrôles précèdent la grille de 24 px.

La grille conserve un intervalle de 20 px : une colonne sous 360 px, deux dès 360 px, trois dès 768 px et quatre dès 1024 px. Les cartes remplissent leur cellule. Leur photographie carrée conserve le produit entier avec 16 px de marge interne. Le bloc titre/prix/catégorie utilise 16 px de marge interne et 8 px entre ses éléments. Les contrôles de thème, de catégorie, d’achats et de tri restent compacts et reviennent à la ligne selon la place disponible.

## Elevation & Depth

La carte par défaut utilise un contour annulaire d'un pixel, à 10 % du premier plan. Il délimite la surface sans ombre portée ni mouvement de soulèvement. Le survol change seulement la couleur de surface. Les transitions de couleur reprennent la durée et la courbe Tailwind par défaut, consignées dans le sidecar.

## Shapes

Les cartes et leurs liens partagent l'arrondi `xl`, avec débordement masqué pour les images. Le filtre reprend l'arrondi `lg` et une bordure fine. Les badges utilisent l'arrondi `4xl` et une silhouette de petite capsule. Conserver les dimensions natives de ces composants.

## Components

### Filtre de catégorie

Un contrôle `select` natif shadcn, haut de 32 px, avec chevron SVG et libellé accessible. Le focus ajoute le bord de couleur anneau et un anneau de 3 px à 50 %. En sombre, le fond reprend le jeton de saisie à 30 %, puis 50 % au survol. Les options gardent les couleurs système Canvas/CanvasText.

### Badges

La variante secondaire sert à la catégorie et à « Acheté ». Le badge d'achat ajoute une coche SVG et se place à 12 px du haut et de la gauche de la photo. Les badges de la galerie ne sont pas des contrôles indépendants.

### Cartes liées

Toute la carte est un lien vers le marchand. Le focus du lien dessine un contour de 2 px décalé de 4 px. La surface conserve le composant Card b0 ; seuls son espacement et son contenu sont adaptés à la galerie. Le titre visible précède le prix, puis la catégorie.

Les achats sont masqués par défaut et peuvent être inclus via le filtre. Une carte achetée affichée reste cliquable : image en niveaux de gris à 60 % d'opacité, prix barré et atténué, badge « Acheté » explicite. Une image absente ou en erreur laisse place à une icône ImageOff SVG et au texte « Photo indisponible ». Un prix absent affiche « Prix non renseigné ».

## Do's and Don'ts

### Do:

- **Do** conserver les composants, jetons neutres et arrondis du preset b0.
- **Do** garder les photos entières sur fond blanc dans les deux thèmes.
- **Do** rendre le focus clavier visible et conserver les noms accessibles des produits.
- **Do** associer le gris d'une carte achetée à un prix barré et au marqueur « Acheté ».

### Don't:

- **Don't** masquer les titres des produits ni afficher les achats par défaut.
- **Don't** supprimer le lien d'une carte achetée.
- **Don't** remplacer une donnée manquante par un prix ou une photographie inventés.
