
import {html} from "@benev/slate"

import {styles} from "./css.js"
import {nexus} from "../nexus.js"
import {Orchestrator} from "./orchestrator.js"

export const OrchestratorView = nexus.shadowView(
		use => (orchestrator: Orchestrator) => {

	use.name("orchestrator")
	use.styles(styles)

	return html`
		<slot
			name=loading
			?data-active=${orchestrator.loading.value.active}
			style="transition-duration: ${orchestrator.animTime}ms;">
				${orchestrator.loading.value.template}
		</slot>

		<slot>
			${orchestrator.exhibit.value.template}
		</slot>
	`
})

