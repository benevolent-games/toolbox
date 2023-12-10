
import {Vec2} from "./vec2.js"

export namespace scalar {

	//
	// units and conversions
	//

	export function pi(n: number = 1) {
		return n * Math.PI
	}

	export function radians(degrees: number) {
		return degrees * Math.PI / 180
	}

	export function degrees(radians: number) {
		return radians * 180 / Math.PI
	}

	//
	// constraints and boundaries
	//

	export function bottom(n: number, min: number) {
		return n < min
			? min
			: n
	}

	export function top(n: number, max: number) {
		return n > max
			? max
			: n
	}

	export function cap(n: number, min: number = 0, max: number = 1) {
		return n < min
			? min
			: n > max
				? max
				: n
	}

	export function between(n: number, min: number, max: number) {
		const space = max - min
		const amount = n - min
		return amount / space
	}

	export function within(n: number, min: number = 0, max: number = 1) {
		return n >= min && n <= max
	}

	export function wrap(n: number, min: number = 0, max: number = 1) {
		const span = max - min
		const adjusted = n - min
		const wrapped = (adjusted < 0)
			? span - (-adjusted % span)
			: adjusted % span
		return min + wrapped
	}

	//
	// transformations and mappings
	//

	export function map(n: number, [b1, b2]: Vec2) {
		const fraction = (n - 0) / (1 - 0)
		return fraction * (b2 - b1) + b1
	}

	export function remap(n: number, [a1, a2]: Vec2, [b1, b2]: Vec2) {
		const fraction = (n - a1) / (a2 - a1)
		return fraction * (b2 - b1) + b1
	}

	export function spline(n: number, points: number[]): number {
		if (points.length < 2)
			throw new Error("spline must have at least two points")

		n = cap(n)

		// normalize n to the number of segments in the points array
		const maxIndex = points.length - 1
		const scaledN = n * maxIndex
		const i = Math.floor(scaledN)

		// handle edge cases for the start and end of the points array
		const p0 = points[Math.max(i - 1, 0)]
		const p1 = points[i]
		const p2 = points[Math.min(i + 1, maxIndex)]
		const p3 = points[Math.min(i + 2, maxIndex)]

		// perform catmull-rom interpolation
		const t = scaledN - i
		return internal.catmullRom(p0, p1, p2, p3, t)
	}

	//
	// private internal helpers
	//

	namespace internal {
		export function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number {
			const v0 = (p2 - p0) * 0.5
			const v1 = (p3 - p1) * 0.5
			const t2 = t * t
			const t3 = t * t2
			return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1
		}
	}
}

