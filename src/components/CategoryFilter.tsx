import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

export function CategoryFilter({ categories }: { categories: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="category" className="text-sm font-medium">
        Catégorie
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
