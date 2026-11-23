import { globSync, readFileSync, statSync } from "node:fs";
import { resolve, sep } from "node:path";
import { parse } from "yaml";
import { productSchema } from "../src/lib/product-schema.ts";

export function validateProducts(root: string) {
  const directory = resolve(root, "src/content/products");
  const images = resolve(root, "public/images");
  const files = globSync("**/*.md", { cwd: directory }).sort();
  const errors: string[] = [];
  const urls = new Map<string, string>();

  for (const file of files) {
    try {
      const markdown = readFileSync(resolve(directory, file), "utf8");
      const frontmatter = markdown
        .replace(/^\uFEFF/, "")
        .match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
      if (!frontmatter)
        throw new Error("Frontmatter YAML absent ou incomplet.");

      const result = productSchema.strict().safeParse(parse(frontmatter[1]));
      if (!result.success) {
        for (const issue of result.error.issues) {
          errors.push(
            `${file}: ${issue.path.join(".") || "fiche"}: ${issue.message}`,
          );
        }
        continue;
      }

      const product = result.data;
      const url = new URL(product.url);
      url.hash = "";
      url.searchParams.sort();
      const previous = urls.get(url.href);
      if (previous)
        errors.push(`${file}: lien déjà enregistré dans ${previous}.`);
      else urls.set(url.href, file);

      if (product.image !== null) {
        const path = resolve(root, "public", `.${product.image}`);
        if (!path.startsWith(`${images}${sep}`)) {
          errors.push(`${file}: l'image doit rester dans public/images/.`);
        } else {
          try {
            if (!statSync(path).isFile()) throw new Error();
          } catch {
            errors.push(
              `${file}: image locale introuvable : ${product.image}.`,
            );
          }
        }
      }
    } catch (error) {
      errors.push(
        `${file}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  if (files.length === 0) errors.push("Aucune fiche Markdown trouvée.");
  return { count: files.length, errors };
}

if (import.meta.main) {
  const { count, errors } = validateProducts(process.cwd());
  if (errors.length > 0) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else {
    console.log(`${count} fiches produits valides.`);
  }
}
