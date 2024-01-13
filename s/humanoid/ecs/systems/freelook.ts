
import {processor} from "../house.js"
import {scalar} from "../../../tools/math/scalar.js"

export const freelook_system = processor("intent", "gimbal")(() => state => {
	const [gimbalX, gimbalY] = state.gimbal
	const [glanceX, glanceY] = state.intent.glance

	const x = gimbalX + glanceX

	// y must be twice as sensitive.
	//  - x axis traverses 360 degrees.
	//  - y axis traverses 180 degrees.
	//  - therefore gimbalX packs "double the punch" of gimbalY.
	//  - thus, to compensate, we double our influence on gimbalY.
	const y = gimbalY + (glanceY * 2)

	state.gimbal = [
		scalar.wrap(x),
		scalar.clamp(y),
	]
})

