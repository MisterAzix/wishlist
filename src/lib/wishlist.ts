export const sortOrders = [
  "title-asc",
  "title-desc",
  "price-asc",
  "price-desc",
] as const;

export type SortOrder = (typeof sortOrders)[number];

export interface WishlistItem {
  id: string;
  title: string;
  category: string;
  price: number | null;
  currency: string;
  archived: boolean;
}

export interface WishlistView {
  category: string;
  includeArchived: boolean;
  sort: SortOrder;
}

const titleCollator = new Intl.Collator("fr", {
  sensitivity: "base",
  numeric: true,
});

export function isSortOrder(value: string): value is SortOrder {
  return sortOrders.some((order) => order === value);
}

export function compareProducts(sort: SortOrder) {
  return (a: WishlistItem, b: WishlistItem): number => {
    const titleComparison = titleCollator.compare(a.title, b.title);
    const tieBreak = a.id.localeCompare(b.id, "fr");

    if (sort === "title-asc") return titleComparison || tieBreak;
    if (sort === "title-desc") return -titleComparison || tieBreak;

    // Unknown prices stay last in both numeric directions, across all currencies.
    if (a.price === null && b.price === null)
      return titleComparison || tieBreak;
    if (a.price === null) return 1;
    if (b.price === null) return -1;

    // Each currency is its own group. No exchange rate is assumed.
    const currencyComparison = a.currency.localeCompare(b.currency, "fr");
    if (currencyComparison) return currencyComparison;

    const priceComparison =
      sort === "price-asc" ? a.price - b.price : b.price - a.price;
    return priceComparison || titleComparison || tieBreak;
  };
}

export function selectProducts<T extends WishlistItem>(
  products: readonly T[],
  view: Partial<WishlistView> = {},
): T[] {
  return products
    .filter(
      (product) =>
        (view.includeArchived || !product.archived) &&
        (!view.category || product.category === view.category),
    )
    .sort(compareProducts(view.sort ?? "title-asc"));
}
