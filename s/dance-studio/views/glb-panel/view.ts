
import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {nexus} from "../../nexus.js"
import {human} from "../../../tools/human.js"
import {render_op} from "../../utils/render_op.js"
import {Glb} from "../../models/loader/utils/types.js"

export const GlbPanel = nexus.shadow_view(use => () => {
	use.name("glb-panel")
	use.styles(styles)

	const {loader} = use.context

	function render_glb(glb: Glb) {
		const {anims, all_animations} = glb.choreographer
		const all_anim_keys = Object.keys(all_animations)
		const active_anim_keys = Object.keys(anims)

		return html`
			<p><strong>${glb.filename}</strong></p>
			<p>
				<span>${human.megabytes(glb.filesize)}</span>
				<button class=based @click="${() => loader.unload_glb()}">unload</button>
			</p>
			<ul class=anims>
				${Object.entries(all_animations).map(([animName, animGroup]) => html`
					<li ?data-active="${active_anim_keys.includes(animName)}">
						<span>${animName}</span>
						<span>${animGroup.targetedAnimations.length}</span>
					</li>
				`)}
			</ul>
			<ul class=missing-anims>
				${Object.entries(anims)
					.filter(([animName]) => !all_anim_keys.includes(animName))
					.map(([animName]) => html`
						<li>
							<span>${animName}</span>
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

