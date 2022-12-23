
import {timeAccumulator, timer} from "./utils/timer.js"

export interface Behavior<C extends {}, A extends keyof C> {
	name: string
	needs: A[]
	action: (
		c: {[P in A]: C[P]} & Partial<C>,
		controls: any
	) => void
}

export type SetupBehaviors<C extends {}> = (
	(behavior: <A extends keyof C>(b: Behavior<C, A>) => Behavior<C, A>) => Behavior<C, keyof C>[]
)

export function ecs<xComponents extends {[key: string]: {}}>(
		setup: SetupBehaviors<xComponents>
	) {

	const behaviors = setup(x => x)

	let count = 0
	const map = new Map<number, Partial<xComponents>>()
	const index = new Map<string[], Set<number>>()
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

	function getMatchingEntitiesForBehavior(
			behavior: Behavior<xComponents, keyof xComponents>
		) {
		timers.matching.start()
		const matching: [number, Partial<xComponents>][] = []
		for (const entry of map.entries())
			if (behavior.needs.every(key => entry[1].hasOwnProperty(key)))
				matching.push(entry)
		timers.matching.stop()
		return matching
	}

	return {
		map,
		timers,

		execute() {
			for (const behavior of behaviors) {
				const matching = getMatchingEntitiesForBehavior(behavior)
				timers.executing.start()
				for (const [id, components] of matching)
					behavior.action(<any>components, entityControls(id))
				timers.executing.stop()
			}
		},

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

		// behavior<A extends keyof xComponents>({name, needs, action}: {
		// 		name: string
		// 		needs: A[]
		// 		action: (
		// 			c: {[P in A]: xComponents[P]} & Partial<xComponents>,
		// 			controls: ReturnType<typeof entityControls>,
		// 		) => void
		// 	}): Behavior {

		// 	function getMatchingEntities() {
		// 		timers.matching.start()
		// 		const matching: [number, Partial<xComponents>][] = []
		// 		for (const entry of map.entries())
		// 			if (needs.every(key => entry[1].hasOwnProperty(key)))
		// 				matching.push(entry)
		// 		timers.matching.stop()
		// 		return matching
		// 	}

		// 	return {
		// 		execute() {
		// 			const matching = getMatchingEntities()
		// 			timers.executing.start()
		// 			matching
		// 				.forEach(([id, components]) =>
		// 					action(<any>components, entityControls(id))
		// 				)
		// 			timers.executing.stop()
		// 		},
		// 	}
		// },

	}
}
