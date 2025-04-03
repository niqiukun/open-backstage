import { defineCollection, defineContentConfig, z } from '@nuxt/content';

export default defineContentConfig({
  collections: {
    entities: defineCollection({
      type: 'data',
      source: 'entities/**.json',
      schema: z.object({
        foo: z.string(),
      })
    })
  }
});