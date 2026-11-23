import type { CollectionEntry } from "astro:content";
import { Check, ImageOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { assetPath } from "@/lib/assets";
import { cn } from "@/lib/utils";

type Props = { product: CollectionEntry<"products">["data"] };

export function ProductCard({ product }: Props) {
  const Price = product.archived ? "s" : "span";
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
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${product.title} — ${price} — ${product.category}${product.archived ? " — Acheté" : ""} — Nouvel onglet`}
      className="block h-full rounded-xl outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
    >
      <Card
        data-archived={product.archived}
        className="h-full gap-0 py-0 transition-colors hover:bg-muted/40 data-[archived=true]:bg-muted/40"
      >
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
              className={cn(
                "h-full w-full object-contain p-4",
                product.archived && "opacity-60 grayscale",
              )}
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
          {product.archived && (
            <Badge variant="secondary" className="absolute top-3 left-3 gap-1">
              <Check className="size-3" aria-hidden="true" />
              Acheté
            </Badge>
          )}
        </div>
        <CardContent className="flex flex-col items-start gap-2 py-4">
          <h2
            className={cn(
              "text-base leading-snug font-medium break-words",
              product.archived && "text-muted-foreground",
            )}
          >
            {product.title}
          </h2>
          <Price
            className={cn(
              "text-base font-semibold tabular-nums sm:text-lg",
              product.archived && "text-muted-foreground",
            )}
            title={
              product.priceCheckedAt
                ? `Prix relevé le ${new Intl.DateTimeFormat("fr-FR", {
                    timeZone: "UTC",
                  }).format(new Date(product.priceCheckedAt))}`
                : undefined
            }
          >
            {price}
          </Price>
          <Badge variant="secondary">{product.category}</Badge>
        </CardContent>
      </Card>
    </a>
  );
}
