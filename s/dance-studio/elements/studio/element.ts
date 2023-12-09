
import {drag_has_files, dropped_files, html, ShockDrop} from "@benev/slate"

import {styles} from "./styles.js"
import {nexus} from "../../nexus.js"
import {GlbPanel} from "../../views/glb-panel/view.js"
import {CameraPanel} from "../../views/camera-panel/view.js"
import {NubStick} from "../../../impulse/nubs/stick/element.js"

export const DanceStudio = nexus.shadow_component(use => {
	use.styles(styles)

	const {world, loader, sticks} = use.context

	const drop = use.prepare(() => new ShockDrop({
		predicate: event => drag_has_files(event),
		async handle_drop(event) {
			const [file] = dropped_files(event)
			loader.ingest(file)
		},
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
				${CameraPanel([])}
				${GlbPanel([])}
				${NubStick([sticks.movement])}
			</div>
		</div>
	`
})

