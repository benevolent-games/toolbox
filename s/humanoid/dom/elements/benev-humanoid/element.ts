
import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {nexus} from "../../../nexus.js"
import {Panel} from "../../views/panel/view.js"
import {render_op} from "../../../../dance-studio/utils/render_op.js"

export const BenevHumanoid = nexus.shadow_component(use => {
	use.styles(styles)

	const settings = use.signal(false)
	const toggleSettings = () => settings.value = !settings.value

	return html`
		${render_op(use.context.realmOp.value, realm => html`
			${realm.porthole.canvas}

			${settings.value ? html`
				<div class=panel>
					${Panel([realm])}
					<button
						class=close
						@click="${toggleSettings}">
						❌
					</button>
				</div>
			` : html`
				<button
					class=settings
					@click="${toggleSettings}">
					⚙️
				</button>
			`}
		`)}
	`
})

