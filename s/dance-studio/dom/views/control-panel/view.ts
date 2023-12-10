
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
	const moveStick = use.prepare(() => new Stick("move"))
	const cameraStick = use.prepare(() => new Stick("camera"))

	const apply_to_camera = use.prepare(() => ([x, y]: Vec2) => {
		const sensitivity = 1 / 100
		world.jib.zoom += y * sensitivity
		world.jib.swivel += x * sensitivity
	})

	use.setup(() => world.onTick(() => {
		apply_to_camera(cameraStick.vector)

		const glb = loader.glb.payload
		if (glb)
			glb.choreographer.tick({ambulate: moveStick.vector})
	}))

	return html`
		${NubStick([moveStick])}
		${NubStick([cameraStick])}
	`
})

