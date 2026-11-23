## Development

Use TypeScript in strict mode. Use the exact Node.js version in `.nvmrc` (`nvm use`).

Before committing, run `npm run lint`, `npm run format:check`, `npm run validate:products`, `npm test`, `npm run check`, and `npm run build`. Use Conventional Commits (`feat`, `fix`, `chore`, `ci`, `docs`) and keep each behavior change in a focused commit. Preserve the default shadcn preset `b0` appearance.

## Product content

For link-based additions, use the `wishlist-add-product` skill (versioned source in `skills/wishlist-add-product/SKILL.md`) and the existing Markdown template in `docs/product-template.md`.

- Read `PRODUCT.md` before changing behavior and `DESIGN.md` before changing presentation.
- Use one Markdown file per product in `src/content/products/`, based on `docs/product-template.md`.
- Check existing URLs and references, including archived entries, before adding a product. Preserve useful size/color URL parameters.
- Never invent product prices or images. `price` stores the verified regular/original product price, not a discounted offer. If there is no promotion, use the normal displayed price. Do not substitute a bundle price or manufacturer recommended price. Use `null` when the original price cannot be established; keep the original image URL in `imageSource` and the observation date in `priceCheckedAt`.
- Use local images under `public/images/`; do not fetch merchant pages during the build.
- Only set `archived: true` when the owner confirms purchase. Archive state is shared through the content, not browser storage.
- Show product names on cards and keep accessible link names. Hide archived cards by default and let visitors include them through the filter; keep them clickable and explicitly marked as purchased.
- Offer system/light/dark theme selection and persist the visitor's explicit preference locally. Category, archive and sort controls must work together. Never numerically compare different currencies without a visible grouping or a verified conversion.
- Commit content additions separately from code changes.

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
