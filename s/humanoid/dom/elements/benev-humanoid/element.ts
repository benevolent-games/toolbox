
import {html, interval} from "@benev/slate"

import {styles} from "./styles.js"
import {nexus} from "../../../nexus.js"
import {Panel} from "../../views/panel/view.js"
import {render_op} from "../../../../dance-studio/utils/render_op.js"

export const BenevHumanoid = nexus.shadow_component(use => {
	use.styles(styles)

	const framerate = use.signal(0)
	const tickrate = use.signal(0)

	use.mount(() => interval(10, () => {
		framerate.value = use.context.realmOp.payload?.stage.engine.getFps() ?? 0
		tickrate.value = use.context.realmOp.payload?.stage.measured_tick_rate ?? 0
	}))

	return html`
		${render_op(use.context.realmOp.value, realm => html`
			${realm.porthole.canvas}
			${Panel([realm])}
			<span class=info>
				<span class=framerate>${Math.round(framerate.value)}</span>
				<span class=spacer>/</span>
				<span class=tickrate>${Math.round(tickrate.value)}</span>
			</span>
		`)}
	`
})

