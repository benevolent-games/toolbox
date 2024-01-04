
export type Quat = quat.Quat

export namespace quat {
	export type Quat = [number, number, number, number]
	export type Xyzw = {x: number, y: number, z: number, w: number}

	export const to = Object.freeze({
		xyzw: ([x, y, z, w]: Quat): Xyzw => ({x, y, z, w}),
	})

	export const from = Object.freeze({
		xyzw: ({x, y, z, w}: Xyzw): Quat => [x, y, z, w]
	})

	export function identity(): Quat {
		return [0, 0, 0, 1]
	}
}

