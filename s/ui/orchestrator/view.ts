
import {html} from "@benev/slate"

import {nexus} from "../nexus.js"
import {Orchestrator} from "./orchestrator.js"

export const OrchestratorView = nexus.lightView(
		use => (orchestrator: Orchestrator) => {

	use.name("orchestrator")

	return html`
		<div class=orchestrator>
			<div class=orchestrator-loading
				?data-active=${orchestrator.loading.value.active}
				style="transition-duration: ${orchestrator.animTime}ms;">
					${orchestrator.loading.value.template()}
			</div>

			<div class=orchestrator-exhibit>
				${orchestrator.exhibit.value.template()}
			</div>
		</div>
	`
})

