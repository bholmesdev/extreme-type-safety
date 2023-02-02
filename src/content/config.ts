import { z, defineCollection, getCollection } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { blog };
