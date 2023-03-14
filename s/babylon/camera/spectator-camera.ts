
import {NubContext, NubEffectEvent} from "@benev/nubs"

import {walker} from "./walker.js"
import {v2} from "../../utils/v2.js"
import {moveCamera} from "./utils/move-camera.js"
import {rotateCamera} from "./utils/rotate-camera.js"

export function makeSpectatorCamera({
		speed, nubContext, renderLoop, lookSensitivity: {pointer}, controls: {add_look, add_move}
	}: {
		speed: {
			walk: number
			sprint: number
		}
		nubContext: NubContext
		renderLoop: Set<() => void>
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
					rotateCamera({
						movement: detail.movement,
						addMouseforce: (mouseforce) => add_look(v2.multiplyBy(mouseforce, pointer)),
					})
			}
		})

	renderLoop.add(() => {

		const {getForce} = walker({
			...speed,
			key: nubContext.effects.key,
			moveVector: nubContext.effects.stick.move?.vector,
		})

		moveCamera({
			addMoveForce: () => add_move(getForce())
		})
	})
}
