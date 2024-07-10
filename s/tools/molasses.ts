
import {Vec2} from "../math/vec2.js"
import {Vec3} from "../math/vec3.js"

export function molasses(smoothing: number, from: number, to: number) {
	return smoothing <= 1
		? to
		: from + ((to - from) / smoothing)
}

export function molasses2d(smoothing: number, from: Vec2, to: Vec2): Vec2 {
	return [
		molasses(smoothing, from[0], to[0]),
		molasses(smoothing, from[1], to[1]),
	]
}

export function molasses3d(smoothing: number, from: Vec3, to: Vec3): Vec3 {
	return [
		molasses(smoothing, from[0], to[0]),
		molasses(smoothing, from[1], to[1]),
		molasses(smoothing, from[2], to[2]),
	]
}

