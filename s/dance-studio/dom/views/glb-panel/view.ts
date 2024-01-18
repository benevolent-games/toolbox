
import {html} from "@benev/slate"

import {styles} from "./styles.js"
import {nexus} from "../../../nexus.js"
import {anim_title} from "./utils/anim_title.js"
import {human} from "../../../../tools/human.js"
import {op_effect} from "../../../../tools/op_effect.js"
import {Glb} from "../../../models/loader/utils/types.js"

export const GlbPanel = nexus.shadow_view(use => () => {
	use.name("glb-panel")
	use.styles(styles)

	const {loader} = use.context

	function render_glb(glb: Glb) {
		const {anims} = glb.choreographer
		const all_anim_names = glb.all_animations.map(a => a.name)
		const active_anim_names = Object.entries(anims)
			.filter(([,anim]) => anim.is_available)
			.map(([key]) => key)

		return html`
			<p><strong>${glb.filename}</strong></p>
			<p>
				<span>${human.megabytes(glb.filesize)}</span>
				<button class=based @click="${() => loader.unload_glb()}">unload</button>
			</p>

			<ul class=anims>
				${glb.all_animations.map(animGroup => html`
					<li
						title="${anim_title(animGroup)}"
						?data-active="${active_anim_names.includes(animGroup.name)}">
						<span>${animGroup.name}</span>
						<span>${animGroup.targetedAnimations.length}</span>
					</li>
				`)}
			</ul>

			<ul class=missing-anims>
				${active_anim_names
					.filter(animName => !all_anim_names.includes(animName))
					.map(animName => html`
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
		${op_effect.braille(loader.glb.value, glb => glb
			? render_glb(glb)
			: render_no_glb())}
	`
})

