
import {scalar} from "../../../../tools/math/scalar.js"
import {Vec2, vec2} from "../../../../tools/math/vec2.js"
import {Vec3, vec3} from "../../../../tools/math/vec3.js"

export function molasses2d(delta: number, from: Vec2, to: Vec2) {
	const [x, y] = vec2.subtract(to, from)
	return vec2.add(from, [
		clamp_scalar_to_delta_positive_or_negative(x, delta),
		clamp_scalar_to_delta_positive_or_negative(y, delta),
	])
}

export function molasses3d(delta: number, from: Vec3, to: Vec3) {
	const [x, y, z] = vec3.subtract(to, from)
	return vec3.add(from, [
		clamp_scalar_to_delta_positive_or_negative(x, delta),
		clamp_scalar_to_delta_positive_or_negative(y, delta),
		clamp_scalar_to_delta_positive_or_negative(z, delta),
	])
}

function clamp_scalar_to_delta_positive_or_negative(n: number, delta: number) {
	return scalar.within(n, -delta, delta)
		? n
		: n < 0
			? -delta
			: delta
}

