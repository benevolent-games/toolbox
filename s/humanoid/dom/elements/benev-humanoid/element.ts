
import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {nexus} from "../../../nexus.js"
import {Panel} from "../../views/panel/view.js"
import {render_op} from "../../../../dance-studio/utils/render_op.js"

export const BenevHumanoid = nexus.shadow_component(use => {
	use.styles(styles)

	return html`
		${render_op(use.context.realmOp.value, realm => html`
			${realm.porthole.canvas}
			${Panel([realm])}
		`)}
	`
})

