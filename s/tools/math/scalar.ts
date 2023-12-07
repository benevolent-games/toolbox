
export namespace scalar {
	export function min(value: number, min: number) {
		return value < min
			? min
			: value
	}

	export function max(value: number, max: number) {
		return value > max
			? max
			: value
	}

	export function cap(value: number, min: number, max: number) {
		return value < min
			? min
			: value > max
				? max
				: value
	}

	export function between(value: number, min: number, max: number) {
		const space = max - min
		const amount = value - min
		return amount / space
	}

	export function within(value: number, min: number, max: number) {
		return value >= min && value <= max
	}

	export function radians(degrees: number) {
		return degrees * Math.PI / 180;
	}

	export function degrees(radians: number) {
		return radians * 180 / Math.PI;
	}
}

