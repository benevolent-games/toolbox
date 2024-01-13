
/** utility for displaying data as human-friendly strings */
export const human = {

	millions(n: number) {
		return `${(n / 1_000_000).toFixed(2)} million`
	},

	megabytes(bytes: number) {
		return `${(bytes / 1_000_000).toFixed(2)} MB`
	},

	percent(fraction: number) {
		return `${(fraction * 100).toFixed(0)}%`
	},

	time(ms: number) {
		const seconds = ms / 1000
		const format1 = (n: number) => Math.floor(n).toString().padStart(2, "0")
		const format2 = (n: number) => Math.floor(n).toString()

		if (seconds < 60)
			return `${format1(seconds)} seconds`

		if (seconds < 3600)
			return `${format1(seconds / 60)} minutes`

		if (seconds < 86400)
			return `${format1(seconds / 3600)} hours`

		return `${format2(seconds / 86400)} days`
	},

	bytes(bytes: number): string {
		if (bytes < 1e3)
			return `${bytes} B`

		if (bytes < 1e6)
			return `${(bytes / 1e3).toFixed(2)} KB`

		if (bytes < 1e9)
			return `${(bytes / 1e6).toFixed(2)} MB`

		if (bytes < 1e12)
			return `${(bytes / 1e9).toFixed(2)} GB`

		return `${(bytes / 1e12).toFixed(2)} TB`
	},

	vec: (vector: number[]) => `[${
		vector.map(n =>
			((n % 1) === 0)
				? n.toString()
				: n.toFixed(2)
		)
	}]`,
}

