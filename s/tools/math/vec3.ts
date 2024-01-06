
export type Vec3 = vec3.Vec3

export namespace vec3 {
	export type Vec3 = [number, number, number]
	export type Xyz = {x: number, y: number, z: number}

	export const to = {
		xyz: ([x, y, z]: Vec3): Xyz => ({x, y, z}),
	}

	export const from = {
		xyz: ({x, y, z}: Xyz): Vec3 => [x, y, z],
	}

	export function as(vec3: Vec3): Vec3 {
		return vec3
	}

	export function zero(): Vec3 {
		return [0, 0, 0]
	}

	export function equal(a: Vec3, b: Vec3, ...c: Vec3[]) {
		const [x, y, z] = a
		for (const d of [b, ...c]) {
			const [x2, y2, z2] = d
			if (x !== x2 || y !== y2 || z !== z2)
				return false
		}
		return true
	}

	export function add(...vectors: Vec3[]): Vec3 {
		let x = 0
		let y = 0
		let z = 0
		for (const [vx, vy, vz] of vectors) {
			x += vx
			y += vy
			z += vz
		}
		return [x, y, z]
	}

	function applyBy([x, y, z]: Vec3, action: (a: number) => number): Vec3 {
		return [
			action(x),
			action(y),
			action(z),
		]
	}

	export function negate(vector: Vec3): Vec3 {
		return applyBy(vector, a => a * -1)
	}

	export function subtract(a: Vec3, b: Vec3): Vec3 {
		return [
			a[0] - b[0],
			a[1] - b[1],
			a[2] - b[2],
		]
	}

	export function addBy(vector: Vec3, delta: number): Vec3 {
		return applyBy(vector, a => a + delta)
	}

	export function multiplyBy(vector: Vec3, delta: number): Vec3 {
		return applyBy(vector, a => a * delta)
	}

	export function divideBy(vector: Vec3, delta: number): Vec3 {
		return applyBy(
			vector,
			a => delta === 0
				? a
				: a / delta
		)
	}

	export function magnitude([x, y, z]: Vec3): number {
		return Math.sqrt(
			x * x +
			y * y +
			z * z
		)
	}

	export function normalize(vector: Vec3): Vec3 {
		const length = magnitude(vector)
		const [x, y, z] = vector
		return length === 0
			? vector
			: [
				x / length,
				y / length,
				z / length,
			]
	}

	export function distance([ax, ay, az]: Vec3, [bx, by, bz]: Vec3) {
		return Math.sqrt(
			((ax - bx) ** 2) +
			((ay - by) ** 2) +
			((az - bz) ** 2)
		)
	}

	export function dot(a: Vec3, b: Vec3): number {
		return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2])
	}

	export function cross(a: Vec3, b: Vec3): Vec3 {
		return [
			(a[1] * b[2]) - (a[2] * b[1]),
			(a[2] * b[0]) - (a[0] * b[2]),
			(a[0] * b[1]) - (a[1] * b[0]),
		]
	}

	export function withinCircle([cx, cy, cz]: Vec3, radius: number, [ax, ay, az]: Vec3) {
		const distanceSquared = (
			((ax - cx) ** 2) +
			((ay - cy) ** 2) +
			((az - cz) ** 2)
		)
		const radiusSquared = radius ** 2
		return distanceSquared < radiusSquared
	}

	export function sum(...vectors: Vec3[]) {
		return vectors.reduce(
			(previous, current) => vec3.add(previous, current),
			[0, 0, 0] as Vec3,
		)
	}

	export function average(a: Vec3, ...more: Vec3[]) {
		const vectors = [a, ...more]
		return vec3.divideBy(
			sum(...vectors),
			vectors.length,
		)
	}
}

