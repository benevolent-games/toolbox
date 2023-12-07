
import {drag_has_files, dropped_files, html, ShockDrop} from "@benev/slate"
import {styles} from "./styles.js"
import {slate} from "../../slate.js"
import {human} from "../../../tools/human.js"

export const DanceStudio = slate.shadow_component({styles}, use => {
	const {world} = use.context

	const drop = use.prepare(() => new ShockDrop({
		predicate: event => drag_has_files(event),
		handle_drop(event) {
			for (const file of dropped_files(event))
				console.log(file.name, human.megabytes(file.size))
		},
	}))

	return html`
		<div
			class=studio
			@dragover="${drop.dragover}"
			@dragleave="${drop.dragleave}"
			@drop="${drop.drop}"
			?data-drop="${drop.indicator}">

			${world.canvas}
		</div>
	`
})

