
import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {nexus} from "../../../nexus.js"
import {Vec2, vec2} from "../../../../tools/math/vec2.js"
import {Stick} from "../../../../impulse/nubs/stick/device.js"
import {Choreography} from "../../../../humanoid/ecs/schema.js"
import {NubStick} from "../../../../impulse/nubs/stick/element.js"
import {ascii_progress_bar} from "../../../../tools/ascii_progress_bar.js"
import {choreograph} from "../../../models/loader/choreo/choreo.js"

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

	const gimbal = use.signal<Vec2>([0, 0.5])

	const choreography = use.signal<Choreography>({
		swivel: 0.5,
		ambulation: [0, 0],
	})

	use.once(() => world.onTick(() => {
		apply_to_camera(cameraStick.vector)
		const glb = loader.glb.payload

		if (glb) {
			const {choreo} = choreograph({
				choreography: choreography.value,
				gimbal: gimbal.value,
				intent: {
					amble: moveStick.vector,
					glance: lookStick.vector,
				},
			})
			choreography.value = choreo.choreography
			gimbal.value = choreo.gimbal
			// glb.choreographer.tick({
			// 	move: moveStick.vector,
			// 	look: lookStick.vector,
			// })
		}
	}))

	return html`
		<div class=sticks>
			${NubStick([moveStick])}
			${NubStick([lookStick])}
			${NubStick([cameraStick])}
		</div>
		<ul class=bars>
			${barGroup("ambulation", ...renormalize(choreography.value.ambulation))}
			${barGroup("swivel", choreography.value.swivel)}
			${barGroup("gimbal", ...gimbal.value)}
		</ul>
	`
})

function barGroup(name: string, ...bars: number[]) {
	return html`
		<li class=barGroup>
			<span class=name>${name}</span>
			<span class=ascii>
				${bars.map(progress => html`
					<span class=bar>
						${ascii_progress_bar(progress, {
							kind: "knob",
							bars: 10,
							show_percent: false,
							clamp_between_1_and_99_percent: false,
						})}
					</span>
				`)}
			</span>
		</li>
	`
}

function renormalize(vector: Vec2) {
	return vec2.divideBy(vec2.addBy(vector, 1), 2)
}

