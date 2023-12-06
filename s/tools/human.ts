
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
}

