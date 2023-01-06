import { z, defineCollection } from "astro:content"

const docs = defineCollection({
	schema: {
		title: z.string(),
		description: z.string().optional(),
	},
})

export const collections = {}
