import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

export function ThemeSelector() {
  return (
    <div id="theme-control" hidden className="flex items-center gap-2">
      <label htmlFor="theme" className="text-sm text-muted-foreground">
        Thème
      </label>
      <NativeSelect id="theme" defaultValue="system">
        <NativeSelectOption value="system">Système</NativeSelectOption>
        <NativeSelectOption value="light">Clair</NativeSelectOption>
        <NativeSelectOption value="dark">Sombre</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}
