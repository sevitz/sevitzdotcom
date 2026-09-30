import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);

// Mirrors schema/frontmatter.schema.json in the posts repo.
const thoughts = defineCollection({
  loader: glob({ pattern: "*/index.md", base: ".content/thoughts-about/posts" }),
  schema: z.object({
    title: z.string().min(1),
    subtitle: z.string().min(1).optional(),
    slug,
    summary: z.string().min(1),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    status: z.enum(["draft", "published", "archived"]),
    wordCount: z.number().int().min(0).optional(),
    readingTimeMinutes: z.number().int().min(1).optional(),
    tags: z.array(slug).default([]),
    image: z.object({ src: z.string().min(1), alt: z.string().min(1) }).optional(),
    syndication: z
      .object({
        linkedin: z.url().optional(),
        bluesky: z.url().optional(),
        threads: z.url().optional(),
      })
      .optional(),
  }),
});

export const collections = { thoughts };
