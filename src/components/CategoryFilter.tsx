import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

export function CategoryFilter({ categories }: { categories: string[] }) {
  return (
    <div id="category-filter" hidden>
      <label htmlFor="category" className="sr-only">
        Filtrer par catégorie
      </label>
      <NativeSelect id="category" aria-controls="product-list">
        <NativeSelectOption value="">Toutes les catégories</NativeSelectOption>
        {categories.map((category) => (
          <NativeSelectOption key={category} value={category}>
            {category}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  );
}
