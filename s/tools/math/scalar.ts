
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

	export namespace spline {
		export function quickLinear(x: number, points: number[]) {
			if (points.length < 2)
				throw new Error("need at least two points, come on")

			const points2 = points.map(
				(p, index): Vec2 =>
					[cap(index / (points.length - 1)), p]
			)

			return linear(x, points2)
		}

		export function linear(x: number, points: Vec2[]): number {
			if (points.length < 2)
				throw new Error("need at least two points, come on")

			for (let i = 0; i < points.length - 1; i++) {
				const [x0, y0] = points[i]
				const [x1, y1] = points[i + 1]

				if (x >= x0 && x <= x1) {
					const t = (x - x0) / (x1 - x0)
					return y0 + t * (y1 - y0)
				}
			}

			throw new Error("x is out of bounds, what are you even doing")
		}

		export function catmullRom(x: number, points: Vec2[]) {
			if (points.length < 4)
				throw new Error("need at least four points for this magic")

			// find the segment where 'x' fits
			for (let i = 1; i < points.length - 2; i++) {
				const [x1, ] = points[i]
				const [x2, ] = points[i + 1]

				if (x >= x1 && x <= x2) {
					const t = (x - x1) / (x2 - x1)
					return helpers.catmullRom(t, points[i - 1], points[i], points[i + 1], points[i + 2])
				}
			}

			throw new Error("x is out of bounds, try again")
		}

		namespace helpers {
			export function catmullRom(
					t: number,
					[,p0]: Vec2,
					[,p1]: Vec2,
					[,p2]: Vec2,
					[,p3]: Vec2,
				) {

				const t2 = t * t
				const t3 = t2 * t

				// coefficients for the cubic polynomial (Catmull-Rom)
				const a = -0.5 * p0 + 1.5 * p1 - 1.5 * p2 + 0.5 * p3
				const b = p0 - 2.5 * p1 + 2 * p2 - 0.5 * p3
				const c = -0.5 * p0 + 0.5 * p2
				const d = p1

				return a * t3 + b * t2 + c * t + d
			}
		}
	}
}

