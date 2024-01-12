
import {processor} from "../house.js"
import {scalar} from "../../../tools/math/scalar.js"

export const freelook_system = processor("intent", "gimbal")(() => state => {
	const [gimbalX, gimbalY] = state.gimbal
	const [glanceX, glanceY] = state.intent.glance

	const x = gimbalX + glanceX
	const y = gimbalY + glanceY

	state.gimbal = [
		scalar.wrap(x),
		scalar.clamp(y),
	]
})

