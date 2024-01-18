
import {hub} from "../hub.js"

export const renderizer = hub.processor("renderizer")
	("tile", "position")
	(({canvas, context}) => _tick => {

	context.reset()
	context.fillRect(0, 0, canvas.width, canvas.height)

	return ({tile, position: [x, y]}) => {
		context.fillStyle = "yellow"
		context.fillRect(x * 20, y * 20, 10, 10)
	}
})

