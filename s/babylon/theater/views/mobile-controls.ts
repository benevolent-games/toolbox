import {view} from "@chasemoskal/magical"
import {html} from "lit"

export const MobileControls = view({}, use => () => {
	return html`
		<div class=mobile-controls>
			<nub-stick></nub-stick>
			<nub-stick></nub-stick>
		</div>
	`
})
