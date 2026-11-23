import type { CollectionEntry } from "astro:content";
import { ImageOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { assetPath } from "@/lib/assets";

type Props = { product: CollectionEntry<"products">["data"] };

export function ProductCard({ product }: Props) {
  const price =
    product.price === null
      ? "Prix non renseigné"
      : new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: product.currency,
        }).format(product.price);

  return (
    <a
      href={product.url}
      aria-label={`${product.title} — ${price} — ${product.category}`}
      className="block h-full rounded-xl outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
    >
      <Card className="h-full gap-0 py-0 transition-colors hover:bg-muted/40">
        <div className="relative aspect-square overflow-hidden bg-white">
          {product.image && (
            <img
              src={assetPath(product.image)}
              alt={product.title}
              width={800}
              height={800}
              loading="lazy"
              decoding="async"
              data-product-image
              className="h-full w-full object-contain p-4"
            />
          )}
          <div
            hidden={Boolean(product.image)}
            data-image-fallback
            className="flex h-full flex-col items-center justify-center gap-3 bg-muted p-4 text-center text-sm text-muted-foreground"
          >
            <ImageOff className="size-6" aria-hidden="true" />
            <span>Photo indisponible</span>
          </div>
        </div>
        <CardContent className="flex flex-col items-start gap-2 py-4">
          <span
            className="text-base font-semibold tabular-nums sm:text-lg"
            title={
              product.priceCheckedAt
                ? `Prix relevé le ${new Intl.DateTimeFormat("fr-FR", {
                    timeZone: "UTC",
                  }).format(new Date(product.priceCheckedAt))}`
                : undefined
            }
          >
            {price}
          </span>
          <Badge variant="secondary">{product.category}</Badge>
        </CardContent>
      </Card>
    </a>
  );
}
