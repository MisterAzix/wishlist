## Development

Use TypeScript in strict mode. Use the exact Node.js version in `.nvmrc` (`nvm use`).

Before committing, run `npm run lint`, `npm run format:check`, `npm run check`, and `npm run build`. Use Conventional Commits (`feat`, `fix`, `chore`, `ci`, `docs`) and keep each behavior change in a focused commit. Preserve the default shadcn preset `b0` appearance.

## Product content

- Read `PRODUCT.md` before changing behavior and `DESIGN.md` before changing presentation.
- Use one Markdown file per product in `src/content/products/`, based on `docs/product-template.md`.
- Check existing URLs and references, including archived entries, before adding a product. Preserve useful size/color URL parameters.
- Never invent product prices or images. Use `null` for missing information; keep the original image URL in `imageSource` and the observation date in `priceCheckedAt`.
- Use local images under `public/images/`; do not fetch merchant pages during the build.
- Only set `archived: true` when the owner confirms purchase. Archive state is shared through the content, not browser storage.
- Keep product names accessible but off the visible cards. Keep archived cards clickable.
- Commit content additions separately from code changes. Automatic ingestion, price monitoring, search, sorting, and gift reservations are outside this version.

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
