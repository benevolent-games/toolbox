
import {timeAccumulator, timer} from "./utils/timer.js"

export type Behavior = {
	execute(): void
}

export function ecs<xComponents extends {[key: string]: {}}>() {
	let count = 0
	// const entities: [string, Partial<xComponents>]
	const map = new Map<number, Partial<xComponents>>()
	const timers = {
		matching: timeAccumulator("matching"),
		executing: timeAccumulator("executing"),
	}

	function entityControls(id: number) {
		return {
			id,

			write(data: Partial<xComponents>) {
				const components: Partial<xComponents> = map.get(id) ?? {}
				for (const [key, value] of Object.entries(data)) {
					if (value === undefined)
						delete components[key]
					else
						components[<keyof xComponents>key] = value
				}
				map.set(id, components)
			},

			query(fun: (components: Partial<xComponents>) => boolean) {
				return [...map.entries()]
					.filter(([xid, components]) => {
						const isDifferentEntity = xid !== id
						return isDifferentEntity
							? fun(structuredClone(components))
							: false
					})
			},
		}
	}

	return {
		map,
		timers,

		query(fun: (components: Partial<xComponents>) => boolean) {
			return [...map.entries()]
				.filter(([id, components]) => fun(components))
		},

		add(components: Partial<xComponents>) {
			const id = count++
			map.set(id, components)
			return id
		},

		remove(id: number) {
			map.delete(id)
		},

		behavior<A extends keyof xComponents>({name, needs, action}: {
				name: string
				needs: A[]
				action: (
					c: {[P in A]: xComponents[P]} & Partial<xComponents>,
					controls: ReturnType<typeof entityControls>,
				) => void
			}): Behavior {

			function getMatchingEntities() {
				timers.matching.start()
				const matching: [number, Partial<xComponents>][] = []
				for (const entry of map.entries())
					if (needs.every(key => entry[1].hasOwnProperty(key)))
						matching.push(entry)
				timers.matching.stop()
				return matching
			}

			return {
				execute() {
					const matching = getMatchingEntities()
					timers.executing.start()
					matching
						.forEach(([id, components]) =>
							action(<any>components, entityControls(id))
						)
					timers.executing.stop()
				},
			}
		},
	}
}
