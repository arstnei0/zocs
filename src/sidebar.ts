import { getCollection } from "astro:content"

export type Sidebar = Record<
	string,
	{
		url: string
		title: string
	}[]
>

const docs = await getCollection("docs")

export const sidebar: Sidebar = {
	Documentation: docs.map((page) => ({
		url: `/docs/${page.slug}`,
		title: page.data.title,
	})),
}
