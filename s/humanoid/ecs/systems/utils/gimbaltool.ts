
import {scalar} from "../../../../tools/math/scalar.js"
import {Vec2, vec2} from "../../../../tools/math/vec2.js"

const circle = scalar.radians.from.circle()

export const gimbaltool = ([x]: Vec2) => ({

	horizontal_rotate(vector: Vec2) {
		return vec2.rotate(
			vector,
			-scalar.map(x, [0, circle]),
		)
	},

	horizontal_unrotate(vector: Vec2) {
		return vec2.rotate(
			vector,
			scalar.map(x, [0, circle]),
		)
	},
})

