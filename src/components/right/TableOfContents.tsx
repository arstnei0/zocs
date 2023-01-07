import type { MarkdownHeading } from "astro"
import "~/styles/tableOfContents.css"
import { Component, createEffect, createSignal, onMount } from "solid-js"

export const TableOfContents: Component<{ headings: MarkdownHeading[] }> = (
	props
) => {
	let toc: any
	const onThisPageID = "on-this-page-heading"
	let itemOffsets: any
	const [currentID, setCurrentID] = createSignal("overview")

	if (globalThis.document) {
		onMount(() => {
			createEffect(() => {
				const getItemOffsets = () => {
					const titles = document.querySelectorAll(
						"article :is(h1, h2, h3, h4)"
					)
					if (itemOffsets)
						itemOffsets.current = Array.from(titles).map(
							(title) => ({
								id: title.id,
								topOffset:
									title.getBoundingClientRect().top +
									window.scrollY,
							})
						)
				}

				getItemOffsets()
				window.addEventListener("resize", getItemOffsets)

				return () => {
					window.removeEventListener("resize", getItemOffsets)
				}
			}, [])

			createEffect(() => {
				const setCurrent: IntersectionObserverCallback = (entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting) {
							const { id } = entry.target
							if (id === onThisPageID) continue
							setCurrentID(entry.target.id)
							break
						}
					}
				}

				const observerOptions: IntersectionObserverInit = {
					// Negative top margin accounts for `scroll-margin`.
					// Negative bottom margin means heading needs to be towards top of viewport to trigger intersection.
					rootMargin: "-100px 0% -66%",
					threshold: 1,
				}

				const headingsObserver = new IntersectionObserver(
					setCurrent,
					observerOptions
				)

				// Observe all the headings in the main page content.
				document
					.querySelectorAll("article :is(h1,h2,h3)")
					.forEach((h) => headingsObserver.observe(h))

				// Stop observing when the component is unmounted.
				return () => headingsObserver.disconnect()
			})
		})
	}

	const onLinkClick = (e: any) => {
		setCurrentID(e.target.getAttribute("href").replace("#", ""))
	}

	createEffect(() => {
		console.log(currentID())
	})

	return (
		<>
			<h2 id={onThisPageID} class="heading">
				On this page
			</h2>
			<ul ref={toc} class="table-of-contents">
				{props.headings
					.filter(({ depth }) => depth > 1 && depth < 4)
					.map((heading) => (
						<li
							class={`header-link depth-${heading.depth} ${
								currentID() === heading.slug
									? "current-header-link"
									: ""
							}`.trim()}
						>
							<a href={`#${heading.slug}`} onClick={onLinkClick}>
								{unescape(heading.text)}
							</a>
						</li>
					))}
			</ul>
		</>
	)
}
