
export interface Clocks {
	[key: string]: <T extends void | Promise<void>>(
		fun: () => T
	) => T
}

export interface Timers {
	[key: string]: () => void
}

export class Timekeep {
	#label = ""

	constructor(label: string = "") {
		this.#label = label
	}

	#map = new Map<string, number>()

	#clocks = <Clocks>new Proxy({}, {
		get: (t, p: string) =>
			(fun: () => (void | Promise<void>)) => {
				const start = performance.now()
				const result = fun()
				const elapsed = performance.now() - start
				const accumulated = this.#map.get(p) ?? 0
				this.#map.set(p, accumulated + elapsed)
				return result
			}
	})

	#timers = <Timers>new Proxy({}, {
		get: (t, p: string) => {
			const start = performance.now()
			return () => {
				const elapsed = performance.now() - start
				const accumulated = this.#map.get(p) ?? 0
				this.#map.set(p, accumulated + elapsed)
			}
		}
	})

	get clocks(): Clocks { return this.#clocks }
	get timers(): Timers { return this.#timers }

	report() {
		for (const [clock, milliseconds] of this.#map)
			console.log(`⏱️ ${this.#label} ${clock} ${milliseconds.toFixed(2)} ms`)
	}
}
