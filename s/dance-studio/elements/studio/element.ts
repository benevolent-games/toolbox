
import {drag_has_files, dropped_files, html, ShockDrop} from "@benev/slate"

import {styles} from "./styles.js"
import {nexus} from "../../nexus.js"
import {scalar} from "../../../tools/math/scalar.js"
import {GlbPanel} from "../../views/glb-panel/view.js"
import {CameraPanel} from "../../views/camera-panel/view.js"
import {NubStick} from "../../../impulse/nubs/stick/element.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

export const DanceStudio = nexus.shadow_component(use => {
	use.styles(styles)

	const {world, loader, sticks, impulse} = use.context

	const drop = use.prepare(() => new ShockDrop({
		predicate: event => drag_has_files(event),
		async handle_drop(event) {
			const [file] = dropped_files(event)
			loader.ingest(file)
		},
	}))

	use.setup(() => {
		const interval = setInterval(() => {
			const [x, y] = impulse.report.normal.vectors.movement
			const glb = loader.glb.payload
			if (glb) {
				const anims = glb.activeAnims
				const forwardness = scalar.cap(y, 0, 1)
				const leftwardness = -scalar.cap(x, -1, 0)
				const rightwardness = scalar.cap(x, 0, 1)
				const backwardness = -scalar.cap(y, -1, 0)

				const weight = (anim: AnimationGroup | undefined, x: number) => {
					if (anim)
						anim.weight = x
				}

				weight(anims.legs_running, forwardness)
				weight(anims.arms_running, forwardness)
				weight(anims.legs_strafeleft, leftwardness)
				weight(anims.legs_straferight, rightwardness)
				weight(anims.runningbackwards, backwardness)
			}
		}, 1000 / 30)
		return () => clearInterval(interval)
	})

	return html`
		<div
			class=studio
			@dragover="${drop.dragover}"
			@dragleave="${drop.dragleave}"
			@drop="${drop.drop}"
			?data-drop="${drop.indicator}">

			${world.viewport.canvas}

			<div class=panel>
				${CameraPanel([])}
				${GlbPanel([])}
				${NubStick([sticks.movement])}
			</div>
		</div>
	`
})

