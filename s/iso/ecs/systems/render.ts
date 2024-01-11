
import {system} from "../hub.js"

export const render_system = system(hub => () => {
	const {canvas, context, entities} = hub

	const query = entities.select("tile", "position")
	context.reset()
	context.fillRect(0, 0, canvas.width, canvas.height)

	for (const [,{tile, position: [x, y]}] of query) {
		context.fillStyle = "yellow"
		context.fillRect(x * 20, y * 20, 10, 10)
	}
})

