
import {NubContext, NubEffectEvent} from "@benev/nubs"

import {walker} from "./walker.js"
import {v2} from "../../utils/v2.js"

export function makeSpectatorCamera({
		speed, nubContext, renderLoop, lookSensitivity,
		controls: {add_look, add_move},
	}: {
		nubContext: NubContext
		renderLoop: Set<() => void>
		speed: {
			walk: number
			sprint: number
		}
		lookSensitivity: {
			stick: number
			pointer: number
		}
		controls: {
			add_look: (vector: v2.V2) => void
			add_move: (force: v2.V2) => void
		}
	}) {

	NubEffectEvent
		.target(nubContext)
		.listen(({detail}) => {
			if (detail.kind === "pointer" && detail.effect === "look") {
				if (document.pointerLockElement || detail.cause === "Lookpad")
					add_look(v2.multiplyBy(detail.movement, lookSensitivity.pointer))
			}
		})

	renderLoop.add(() => {
		const {getForce} = walker({
			...speed,
			key: nubContext.effects.key,
			moveVector: nubContext.effects.stick.move?.vector,
		})
		add_move(getForce())
	})
}
