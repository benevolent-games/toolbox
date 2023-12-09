
import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {slate} from "../../slate.js"
import {Glb} from "../../models/loader.js"
import {human} from "../../../tools/human.js"
import {render_op} from "../../utils/render_op.js"

export const GlbPanel = slate.shadow_view({styles, name: "glb-panel"}, use => () => {
	const {loader} = use.context

	function render_glb(glb: Glb) {
		return html`
			<p><strong>${glb.filename}</strong></p>
			<p>
				<span>${human.megabytes(glb.filesize)}</span>
				<button class=based @click="${() => loader.unload_glb()}">unload</button>
			</p>
			<ul>
				${Object.entries(glb.anims).map(([animName, animGroup]) => html`
					<li>
						<span>${animName}</span>
						<span>${animGroup.targetedAnimations.length}</span>
					</li>
				`)}
			</ul>
		`
	}

	function render_no_glb() {
		return html`
			<p>no glb loaded.</p>
			<p>drag and drop a character glb.</p>
		`
	}

	return html`
		<h2>glb</h2>
		${render_op(loader.glb.value, glb => glb
			? render_glb(glb)
			: render_no_glb())}
	`
})

