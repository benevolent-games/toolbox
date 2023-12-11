
import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {nexus} from "../../../nexus.js"
import {Vec2} from "../../../../tools/math/vec2.js"
import {Stick} from "../../../../impulse/nubs/stick/device.js"
import {NubStick} from "../../../../impulse/nubs/stick/element.js"

export const ControlPanel = nexus.shadow_view(use => () => {
	use.name("control-panel")
	use.styles(styles)

	const {world, loader} = use.context
	const moveStick = use.once(() => new Stick("move"))
	const lookStick = use.once(() => new Stick("look"))
	const cameraStick = use.once(() => new Stick("camera"))

	const apply_to_camera = use.once(() => ([x, y]: Vec2) => {
		const sensitivity = 1 / 100
		world.cameraRig.zoom += y * sensitivity
		world.cameraRig.swivel += x * sensitivity
	})

	use.once(() => world.onTick(() => {
		apply_to_camera(cameraStick.vector)

		const glb = loader.glb.payload
		if (glb) {
			glb.choreographer.tick({
				move: moveStick.vector,
				look: lookStick.vector,
			})
		}
	}))

	return html`
		${NubStick([moveStick])}
		${NubStick([lookStick])}
		${NubStick([cameraStick])}
	`
})

