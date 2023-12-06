
import {html} from "lit"
import {view} from "@chasemoskal/magical"

export const MobileControls = view({}, use => () => {
	return html`
		<div class=mobile-controls>
			<nub-stickpad></nub-stickpad>
			<nub-lookpad></nub-lookpad>
		</div>
	`
})
