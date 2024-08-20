
export function smooth(
		smoothing: number,
		target: number,
		smooth: number,
	) {

	return smoothing <= 1
		? target
		: smooth + ((target - smooth) / smoothing)
}

export class Smooth {
	smooth: number

	constructor(public smoothing: number, public target: number) {
		this.smooth = target
	}

	tick() {
		return this.smooth = smooth(this.smoothing, this.target, this.smooth)
	}
}

export class SmoothVector<V extends number[]> {
	smooth: V

	constructor(public smoothing: number, public target: V) {
		this.smooth = target
	}

	tick() {
		return this.smooth = (
			this.smooth.map((x, i) => smooth(this.smoothing, this.target[i], x))
		) as V
	}
}

