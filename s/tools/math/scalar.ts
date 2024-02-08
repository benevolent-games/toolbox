
import {Vec2} from "./vec2.js"

export namespace scalar {

	//
	// units and conversions
	//

	export const pi = Math.PI
	export const xpi = (n: number = 1) => n * pi

	export const radians = {
		to: {
			degrees(radians: number) {
				return radians * (180 / pi)
			},
		},
		from: {
			circle(fraction = 1) {
				return fraction * (2 * Math.PI)
			},
			degrees(degrees: number) {
				return degrees * (pi / 180)
			},
		},
	}

	//
	// constraints and boundaries
	//

	/** clip a number so it "bottoms-out" (eg, return min if n is less than min). */
	export function bottom(n: number, min: number = 0) {
		return n < min
			? min
			: n
	}

	/** clip a number so it "tops-out" (eg, return max if n is more than max). */
	export function top(n: number, max: number = 1) {
		return n > max
			? max
			: n
	}

	/** clamp a number within a range. */
	export function clamp(n: number, min: number = 0, max: number = 1) {
		return n < min
			? min
			: n > max
				? max
				: n
	}

	/** linear interpolate between two numbers. */
	export function lerp(fraction: number, a: number, b: number) {
		const difference = b - a
		const value = difference * fraction
		return a + value
	}

	/** return true is n is between a and b, otherwise return false. */
	export function within(n: number, a: number = 0, b: number = 1) {
		const min = Math.min(a, b)
		const max = Math.max(a, b)
		return (n >= min) && (n <= max)
	}

	/** if the number exceeds the range, it wraps around to the other side. */
	export function wrap(n: number, a: number = 0, b: number = 1) {
		const min = Math.min(a, b)
		const max = Math.max(a, b)
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

	/** flip a number between 0 and 1 to the other side (eg, 0.9 returns 0.1). */
	export function inverse(n: number) {
		return 1 - n
	}

	/** remap a number from [0,1] range to [-1,1] (making 0.0 the centerpoint). */
	export function center(x: number) {
		return (x * 2) - 1
	}

	/** remap a number from [-1,1] range to [0,1] (making 0.5 the centerpoint). */
	export function uncenter(x: number) {
		return (x + 1) / 2
	}

	/** linear interpolate between two numbers in a vector. */
	export function map(fraction: number, [a, b]: Vec2) {
		const difference = b - a
		const value = difference * fraction
		return a + value
	}

	/** remap a number from one range to another. */
	export function remap(n: number, [a1, a2]: Vec2, [b1, b2]: Vec2 = [0, 1]) {
		const fraction = (n - a1) / (a2 - a1)
		return (fraction * (b2 - b1)) + b1
	}

	export namespace spline {

		/** resolve a number within a linear spline. */
		export function linear(x: number, points: Vec2[]): number {
			if (points.length < 2)
				throw new Error("need at least two points, come on")

			const [first] = points.at(0)!
			const [last] = points.at(-1)!

			x = clamp(x, first, last)

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

		/** resolve a number within a catmull-rom spline, that's all smooth-like. */
		export function catmullRom(x: number, points: Vec2[]) {
			if (points.length < 4)
				throw new Error("need at least four points for this magic")

			x = clamp(x)

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

		export const ez = {

			/** simple linear spline where the control points are equally-spaced based on their array indices (x is expected to be between 0 and 1). */
			linear(x: number, points: number[]) {
				if (points.length < 2)
					throw new Error("need at least two points, come on")

				const points2 = points.map(
					(p, index): Vec2 =>
						[clamp(index / (points.length - 1)), p]
				)

				return linear(clamp(x), points2)
			}
		}

		namespace helpers {

			/** internal big-brain maths for the catmull-rom implementation */
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

