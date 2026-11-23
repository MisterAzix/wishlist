import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const products = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  schema: z.object({
    title: z.string().trim().min(1),
    url: z.url().refine((value) => /^https?:\/\//.test(value), {
      message: "Le lien marchand doit utiliser HTTP ou HTTPS.",
    }),
    image: z.string().startsWith("/images/").nullable().default(null),
    imageSource: z.url().optional(),
    price: z.number().nonnegative().nullable().default(null),
    currency: z
      .string()
      .regex(/^[A-Z]{3}$/)
      .default("EUR"),
    category: z.enum([
      "Vêtements",
      "Musique",
      "Maison",
      "Accessoires",
      "High-tech",
      "Loisirs",
      "Autres",
    ]),
    archived: z.boolean().default(false),
    priceCheckedAt: z.iso.date().optional(),
  }),
});

export const collections = { products };
