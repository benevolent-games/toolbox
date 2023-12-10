
import {drag_has_files, dropped_files, html, ShockDrop} from "@benev/slate"

import {styles} from "./styles.js"
import {nexus} from "../../../nexus.js"
import {Vec2} from "../../../../tools/math/vec2.js"
import {repeater} from "../../../../tools/repeater.js"
import {GlbPanel} from "../../views/glb-panel/view.js"
import {scalar} from "../../../../tools/math/scalar.js"
import {Stick} from "../../../../impulse/nubs/stick/device.js"
import {NubStick} from "../../../../impulse/nubs/stick/element.js"

export const DanceStudio = nexus.shadow_component(use => {
	use.styles(styles)

	const {world, loader} = use.context

	const drop = use.prepare(() => new ShockDrop({
		predicate: event => drag_has_files(event),
		async handle_drop(event) {
			const [file] = dropped_files(event)
			loader.ingest(file)
		},
	}))

	const moveStick = use.prepare(() => new Stick("move"))
	const camStick = use.prepare(() => new Stick("cam"))

	const cameraBuddy = use.prepare(() => {
		const sensitivity = 1 / 10
		let zoom = 4
		let swivel = 160

		function drive([x, y]: Vec2) {
			zoom = scalar.cap(zoom + (-y * sensitivity), 1, 10)
			swivel = scalar.wrap(swivel + (x * 20 * sensitivity), 0, 360)

			world.jib.zoom(zoom)
			world.jib.swivel(swivel)
		}

		return {drive}
	})

	use.setup(() => repeater(60, () => {
		const glb = loader.glb.payload

		cameraBuddy.drive(camStick.vector)

		if (glb)
			glb.choreographer.tick({ambulate: moveStick.vector})
	}))

	return html`
		<div
			class=studio
			@dragover="${drop.dragover}"
			@dragleave="${drop.dragleave}"
			@drop="${drop.drop}"
			?data-drop="${drop.indicator}">

			${world.viewport.canvas}

			<div class=panel>
				<div click=sticks>
					${NubStick([moveStick])}
					${NubStick([camStick])}
				</div>
				${GlbPanel([])}
			</div>
		</div>
	`
})

