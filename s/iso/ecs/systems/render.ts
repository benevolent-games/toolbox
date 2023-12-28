
import {house} from "../house.js"

export const renderSystem = house.system(base => () => {
	const {canvas, context} = house

	const query = base.entities.select("tile", "position")
	context.reset()
	context.fillRect(0, 0, canvas.width, canvas.height)

	for (const [,{tile, position: [x, y]}] of query) {
		context.fillStyle = "yellow"
		context.fillRect(x * 20, y * 20, 10, 10)
	}
})

