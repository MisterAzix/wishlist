import assert from "node:assert/strict";
import test from "node:test";
import {
  compareProducts,
  selectProducts,
  type WishlistItem,
} from "../src/lib/wishlist.ts";

function product(
  id: string,
  title: string,
  overrides: Partial<WishlistItem> = {},
): WishlistItem {
  return {
    id,
    title,
    category: "Vêtements",
    price: 10,
    currency: "EUR",
    archived: false,
    ...overrides,
  };
}

test("the default view hides purchases and sorts names in French", () => {
  const input = [
    product("z", "Zèbre"),
    product("bought", "Acheté", { archived: true }),
    product("e", "Écharpe"),
    product("a", "Anorak"),
  ];
  assert.deepEqual(
    selectProducts(input).map(({ id }) => id),
    ["a", "e", "z"],
  );
  assert.equal(input[0].id, "z", "the source array is not reordered");
});

test("category and purchase inclusion combine without leaking other categories", () => {
  const input = [
    product("coat", "Manteau"),
    product("bought-coat", "Manteau acheté", { archived: true }),
    product("mill", "Moulin", { category: "Maison" }),
  ];
  assert.deepEqual(
    selectProducts(input, { category: "Vêtements" }).map(({ id }) => id),
    ["coat"],
  );
  assert.deepEqual(
    selectProducts(input, {
      category: "Vêtements",
      includeArchived: true,
    }).map(({ id }) => id),
    ["coat", "bought-coat"],
  );
  assert.deepEqual(selectProducts(input, { category: "Musique" }), []);
});

test("numeric sorting handles zero, decimals and missing prices in both directions", () => {
  const input = [
    product("unknown", "A inconnu", { price: null }),
    product("ten", "Dix", { price: 10 }),
    product("two", "Deux", { price: 2.5 }),
    product("zero", "Zéro", { price: 0 }),
  ];
  assert.deepEqual(
    selectProducts(input, { sort: "price-asc" }).map(({ id }) => id),
    ["zero", "two", "ten", "unknown"],
  );
  assert.deepEqual(
    selectProducts(input, { sort: "price-desc" }).map(({ id }) => id),
    ["ten", "two", "zero", "unknown"],
  );
  assert.equal(
    selectProducts(input)[0].id,
    "unknown",
    "A–Z stays alphabetical",
  );
});

test("price ordering groups currencies instead of comparing euros with dollars", () => {
  const input = [
    product("usd-cheap", "Dollar", { currency: "USD", price: 1 }),
    product("eur-high", "Euro cher", { price: 100 }),
    product("usd-unknown", "Dollar inconnu", { currency: "USD", price: null }),
    product("eur-low", "Euro bas", { price: 20 }),
  ];
  assert.deepEqual(
    selectProducts(input, { sort: "price-asc" }).map(({ id }) => id),
    ["eur-low", "eur-high", "usd-cheap", "usd-unknown"],
  );
  assert.deepEqual(
    selectProducts(input, { sort: "price-desc" }).map(({ id }) => id),
    ["eur-high", "eur-low", "usd-cheap", "usd-unknown"],
  );
});

test("name directions and equal-price tie breaks are deterministic", () => {
  const input = [
    product("z", "écharpe"),
    product("a", "Écharpe"),
    product("jacket10", "Veste 10"),
    product("jacket2", "Veste 2"),
  ];
  assert.deepEqual(
    [...input].sort(compareProducts("title-desc")).map(({ id }) => id),
    ["jacket10", "jacket2", "a", "z"],
  );
  assert.deepEqual(
    selectProducts(input, { sort: "price-desc" }).map(({ id }) => id),
    ["a", "z", "jacket2", "jacket10"],
  );
});
