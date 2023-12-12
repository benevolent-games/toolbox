
import {drag_has_files, dropped_files, html, ShockDrop} from "@benev/slate"

import {styles} from "./styles.js"
import {nexus} from "../../../nexus.js"
import {GlbPanel} from "../../views/glb-panel/view.js"
import {ControlPanel} from "../../views/control-panel/view.js"

export const DanceStudio = nexus.shadow_component(use => {
	use.styles(styles)

	const {world, loader} = use.context

	const drop = use.once(() => new ShockDrop({
		predicate: event => drag_has_files(event),
		async handle_drop(event) {
			const [file] = dropped_files(event)
			loader.ingest_file(file)
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
				${ControlPanel([])}
				${GlbPanel([])}
			</div>
		</div>
	`
})

