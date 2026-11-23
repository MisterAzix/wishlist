const themeSelector = document.querySelector<HTMLSelectElement>("#theme");
const themeControl = document.querySelector<HTMLElement>("#theme-control");

if (themeSelector && themeControl) {
  const synchronizeSelector = () => {
    themeSelector.value = document.documentElement.dataset.theme ?? "system";
  };

  synchronizeSelector();
  themeSelector.addEventListener("change", () => {
    window.dispatchEvent(
      new CustomEvent("wishlist:theme-change", { detail: themeSelector.value }),
    );
  });
  window.addEventListener("wishlist:theme-updated", synchronizeSelector);
  themeControl.hidden = false;
}
