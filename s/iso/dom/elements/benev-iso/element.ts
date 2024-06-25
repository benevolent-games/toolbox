
import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {nexus} from "../../../nexus.js"

export const BenevIso = nexus.shadowComponent(use => {
	use.styles(styles)
	const {base} = use.context

	use.mount(() => {
		const resize = () => {
			const rect = base.canvas.getBoundingClientRect()
			base.canvas.width = rect.width
			base.canvas.height = rect.height
		}
		const observer = new ResizeObserver(resize)
		setTimeout(resize, 0)
		observer.observe(base.canvas)
		return () => observer.disconnect()
	})

	return html`${base.canvas}`
})

