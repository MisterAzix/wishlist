import { CategoryFilter } from "@/components/CategoryFilter";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

export function WishlistControls({ categories }: { categories: string[] }) {
  return (
    <section
      id="wishlist-controls"
      hidden
      aria-label="Filtrer et trier la wishlist"
      className="mb-6"
    >
      <div className="flex flex-wrap items-end gap-4">
        <CategoryFilter categories={categories} />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sort" className="text-sm font-medium">
            Trier par
          </label>
          <NativeSelect
            id="sort"
            defaultValue="title-asc"
            aria-controls="product-list"
          >
            <NativeSelectOption value="title-asc">Nom A–Z</NativeSelectOption>
            <NativeSelectOption value="title-desc">Nom Z–A</NativeSelectOption>
            <NativeSelectOption value="price-asc">
              Prix croissant
            </NativeSelectOption>
            <NativeSelectOption value="price-desc">
              Prix décroissant
            </NativeSelectOption>
          </NativeSelect>
        </div>
        <label
          htmlFor="include-archived"
          className="flex min-h-8 cursor-pointer items-center gap-2 text-sm"
        >
          <input
            id="include-archived"
            type="checkbox"
            aria-controls="product-list"
            className="size-4 shrink-0 accent-primary outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
          />
          Afficher les produits achetés
        </label>
      </div>
      <p
        id="currency-notice"
        hidden
        className="mt-3 text-sm text-muted-foreground"
      >
        Les prix sont regroupés par devise, sans conversion.
      </p>
    </section>
  );
}
