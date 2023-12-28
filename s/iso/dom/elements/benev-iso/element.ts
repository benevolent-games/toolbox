
import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {nexus} from "../../../nexus.js"
import {house} from "../../../ecs/house.js"

export const BenevIso = nexus.shadow_component(use => {
	use.styles(styles)

	use.mount(() => {
		const resize = () => {
			const rect = house.canvas.getBoundingClientRect()
			house.canvas.width = rect.width
			house.canvas.height = rect.height
		}
		const observer = new ResizeObserver(resize)
		setTimeout(resize, 0)
		observer.observe(house.canvas)
		return () => observer.disconnect()
	})

	return html`${house.canvas}`
})

