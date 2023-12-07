
import {drag_has_files, dropped_files, html, ShockDrop} from "@benev/slate"

import {styles} from "./styles.js"
import {slate} from "../../slate.js"
import {AnimPanel} from "../../views/anim-panel/view.js"

export const DanceStudio = slate.shadow_component({styles}, use => {
	const {world, loader} = use.context

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

			${AnimPanel([], {attrs: {class: "anim panel"}})}
		</div>
	`
})

