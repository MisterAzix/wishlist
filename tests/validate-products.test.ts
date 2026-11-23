import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test, { type TestContext } from "node:test";
import { stringify } from "yaml";
import { validateProducts } from "../scripts/validate-products.ts";

const product = {
  title: "Une envie",
  url: "https://example.com/product?color=31&size=003",
  image: null,
  price: null,
  currency: "EUR",
  category: "Vêtements",
  archived: false,
};

function fixture(t: TestContext) {
  const root = mkdtempSync(join(tmpdir(), "wishlist-products-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const directory = join(root, "src/content/products");
  mkdirSync(directory, { recursive: true });
  return {
    root,
    write(name: string, overrides: Record<string, unknown> = {}) {
      writeFileSync(
        join(directory, name),
        `---\n${stringify({ ...product, ...overrides })}---\n`,
      );
    },
  };
}

test("valid Markdown accepts missing information and existing local images", (t) => {
  const { root, write } = fixture(t);
  write("unknown.md");
  mkdirSync(join(root, "public/images"), { recursive: true });
  writeFileSync(join(root, "public/images/photo.webp"), "fixture");
  write("photo.md", {
    url: "https://example.com/another-product",
    image: "/images/photo.webp",
    imageSource: "https://example.com/photo.webp",
    price: 39.9,
    priceCheckedAt: "2026-11-23",
  });
  assert.deepEqual(validateProducts(root), { count: 2, errors: [] });
});

test("invalid fields and accidental extra attributes fail validation", (t) => {
  const { root, write } = fixture(t);
  write("invalid.md", {
    title: " ",
    url: "javascript:alert(1)",
    price: "39,90",
    currency: "euros",
    category: "Unknown",
    archived: "false",
    priceCheckedAt: "2026-02-30",
    accidentalField: true,
  });
  const { errors } = validateProducts(root);
  for (const field of [
    "title",
    "url",
    "price",
    "currency",
    "category",
    "archived",
    "priceCheckedAt",
    "accidentalField",
  ]) {
    assert.ok(
      errors.some((error) => error.includes(field)),
      field,
    );
  }
});

test("duplicates include archived products without merging different URL parameters", (t) => {
  const { root, write } = fixture(t);
  write("archived.md", { archived: true });
  write("duplicate.md", {
    url: "https://example.com/product?size=003&color=31#details",
  });
  write("different.md", {
    url: "https://example.com/product?color=31&size=004",
  });
  const { errors } = validateProducts(root);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /duplicate.md.*archived.md/);
});

test("missing images and paths outside the image directory fail validation", (t) => {
  const { root, write } = fixture(t);
  write("missing.md", { image: "/images/missing.webp" });
  write("escape.md", {
    url: "https://example.com/escape",
    image: "/images/../../package.json",
  });
  assert.equal(validateProducts(root).errors.length, 2);
});

test("the CLI rejects malformed Markdown with a nonzero exit code", (t) => {
  const { root } = fixture(t);
  writeFileSync(
    join(root, "src/content/products/broken.md"),
    "---\ntitle: [\n---\n",
  );
  const result = spawnSync(
    process.execPath,
    [join(process.cwd(), "scripts/validate-products.ts")],
    {
      cwd: root,
      encoding: "utf8",
    },
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /broken.md/);
});
