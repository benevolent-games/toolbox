
export type Quat = quat.Quat

export namespace quat {
	export type Quat = [number, number, number, number]

	export function identity(): Quat {
		return [0, 0, 0, 1]
	}
}

