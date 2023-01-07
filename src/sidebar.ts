import { getCollection } from "astro:content"
import { getDocsUrl } from "./lib/url"

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
		url: getDocsUrl(page.slug),
		title: page.data.title,
	})),
}
