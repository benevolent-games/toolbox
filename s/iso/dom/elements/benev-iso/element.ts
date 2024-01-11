
import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {nexus} from "../../../nexus.js"

export const BenevIso = nexus.shadow_component(use => {
	use.styles(styles)
	const {hub} = use.context

	use.mount(() => {
		const resize = () => {
			const rect = hub.canvas.getBoundingClientRect()
			hub.canvas.width = rect.width
			hub.canvas.height = rect.height
		}
		const observer = new ResizeObserver(resize)
		setTimeout(resize, 0)
		observer.observe(hub.canvas)
		return () => observer.disconnect()
	})

	return html`${hub.canvas}`
})

