import { isSortOrder, selectProducts, type WishlistItem } from "@/lib/wishlist";

interface ProductElement extends WishlistItem {
  element: HTMLElement;
}

const list = document.querySelector<HTMLElement>("#product-list");
const controls = document.querySelector<HTMLElement>("#wishlist-controls");
const category = document.querySelector<HTMLSelectElement>("#category");
const sort = document.querySelector<HTMLSelectElement>("#sort");
const includeArchived =
  document.querySelector<HTMLInputElement>("#include-archived");
const result = document.querySelector<HTMLElement>("#filter-result");
const empty = document.querySelector<HTMLElement>("#filter-empty");
const currencyNotice = document.querySelector<HTMLElement>("#currency-notice");

const products: ProductElement[] = Array.from(
  document.querySelectorAll<HTMLElement>("[data-product]"),
  (element) => {
    const price = Number(element.dataset.price);
    return {
      id: element.dataset.product ?? "",
      title: element.dataset.title ?? "",
      category: element.dataset.category ?? "",
      archived: element.dataset.archived === "true",
      currency: element.dataset.currency ?? "EUR",
      price:
        element.dataset.price !== "" && Number.isFinite(price) ? price : null,
      element,
    };
  },
);

if (list && controls && category && sort && includeArchived) {
  const renderProducts = () => {
    const order = isSortOrder(sort.value) ? sort.value : "title-asc";
    const visible = selectProducts(products, {
      category: category.value,
      includeArchived: includeArchived.checked,
      sort: order,
    });
    const priceSort = order === "price-asc" || order === "price-desc";
    const currencies = new Set(
      visible
        .filter((product) => product.price !== null)
        .map((product) => product.currency),
    );
    const groupCurrencies = priceSort && currencies.size > 1;

    for (const product of products) product.element.hidden = true;
    for (const heading of list.querySelectorAll("[data-currency-group]"))
      heading.remove();

    const fragment = document.createDocumentFragment();
    let previousGroup: string | undefined;
    for (const product of visible) {
      const group = product.price === null ? "unknown" : product.currency;
      if (groupCurrencies && group !== previousGroup) {
        const heading = document.createElement("li");
        heading.dataset.currencyGroup = group;
        heading.setAttribute("role", "presentation");
        heading.className =
          "col-span-full pt-2 text-sm font-medium text-muted-foreground";
        heading.textContent =
          group === "unknown" ? "Prix non renseignés" : `Prix en ${group}`;
        fragment.append(heading);
      }
      product.element.hidden = false;
      fragment.append(product.element);
      previousGroup = group;
    }
    list.append(fragment);

    if (result) {
      const plural = visible.length > 1 ? "s" : "";
      result.textContent = `${visible.length} produit${plural} affiché${plural}`;
    }
    if (empty) {
      empty.hidden = visible.length !== 0;
      empty.textContent = "Aucune envie ne correspond à ces filtres.";
    }
    if (currencyNotice) currencyNotice.hidden = !groupCurrencies;
  };

  category.addEventListener("change", renderProducts);
  sort.addEventListener("change", renderProducts);
  includeArchived.addEventListener("change", renderProducts);
  renderProducts();
  controls.hidden = false;
}

function showMissingImage(image: HTMLImageElement) {
  image.hidden = true;
  const fallback = image.parentElement?.querySelector<HTMLElement>(
    "[data-image-fallback]",
  );
  if (fallback) fallback.hidden = false;
}

document.addEventListener(
  "error",
  (event) => {
    const image = event.target;
    if (
      image instanceof HTMLImageElement &&
      image.hasAttribute("data-product-image")
    ) {
      showMissingImage(image);
    }
  },
  true,
);

// Handle an image that failed before this deferred script was attached.
for (const image of document.querySelectorAll<HTMLImageElement>(
  "[data-product-image]",
)) {
  if (image.complete && image.naturalWidth === 0) showMissingImage(image);
}
