
import {hub} from "../hub.js"

export const renderizer = hub
	.behavior("renderizer")
	.select("tile", "position")
	.processor(({canvas, context}) => _tick => {

	context.reset()
	context.fillRect(0, 0, canvas.width, canvas.height)

	return ({position: [x, y]}) => {
		context.fillStyle = "yellow"
		context.fillRect(x * 20, y * 20, 10, 10)
	}
})

