
import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {nexus} from "../../../nexus.js"
import {Vec2, vec2} from "../../../../tools/math/vec2.js"
import {Stick} from "../../../../impulse/nubs/stick/device.js"
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"
import {NubStick} from "../../../../impulse/nubs/stick/element.js"
import {Choreographer2} from "../../../models/loader/choreo/choreo.js"
import {ascii_progress_bar} from "../../../../tools/ascii_progress_bar.js"

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

	const choreography = use.signal(Choreographer2.default_choreography())
	const choreo = choreography.value

	use.once(() => world.onTick(() => {
		apply_to_camera(cameraStick.vector)
		const glb = loader.glb.payload

		choreography.value = {
			...choreography.value,
			intent: {
				amble: moveStick.vector,
				glance: lookStick.vector,
			},
		}

		if (glb) {
			choreography.value = glb.choreographer.update(choreography.value)
			glb.choreographer.character.root.rotationQuaternion = (
				Quaternion.FromEulerAngles(0, -choreography.value.rotation, 0)
			)
		}
	}))

	return html`
		<div class=sticks>
			${NubStick([moveStick])}
			${NubStick([lookStick])}
			${NubStick([cameraStick])}
		</div>
		<ul class=bars>
			${render_bars("ambulation",
				["magnitude", "knob", choreo.ambulatory.magnitude],
				["north", "knob", choreo.ambulatory.north],
				["west", "knob", choreo.ambulatory.west],
				["south", "knob", choreo.ambulatory.south],
				["east", "knob", choreo.ambulatory.east],
			)}
			${render_bars("swivel",
				["swivel", "knob", choreo.swivel],
				["adjustment-progress", "bar", choreo.adjustment?.progress ?? 0],
			)}
			${render_bars("gimbal",
				["gimbal-x", "knob", choreo.gimbal[0]],
				["gimbal-y", "knob", choreo.gimbal[1]],
			)}
		</ul>
	`
})

function render_bars(groupName: string, ...units: [
		string, // title
		"bar" | "knob", // kind
		number, // progress
	][]) {
	return html`
		<li class=barGroup>
			<span class=name>${groupName}</span>
			<span class=ascii>
				${units.map(([title, kind, progress]) => html`
					<span class=bar title="${title}">
						${ascii_progress_bar(progress, {
							kind,
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

