
import {MaterialPluginBase} from "@babylonjs/core/Materials/materialPluginBase.js"
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
	const index = new Map<string[], Set<number>>()
	for (const behavior of behaviors)
		index.set(<string[]>behavior.needs, new Set())

	let count = 0
	const map = new Map<number, Partial<xComponents>>()
	const timers = {
		matching: timeAccumulator("matching"),
		executing: timeAccumulator("executing"),
	}
	const entityControlMap = new Map<number, {}>()

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

				// update behavior-entity indexing
				for (const behavior of behaviors) {
					const thisEntityMatchesThisBehavior = (
						behavior
							.needs
							.every(key => components.hasOwnProperty(key))
					)
					const entitiesThatMatchThisBehavior = (
						index.get(<string[]>behavior.needs)!
					)
					if (thisEntityMatchesThisBehavior)
						entitiesThatMatchThisBehavior.add(id)
					else
						entitiesThatMatchThisBehavior.delete(id)
				}
			},

			query(fun: (components: Partial<xComponents>) => boolean) {
				return [...map.entries()]
					.filter(([xid, components]) =>
						xid !== id
							? fun(structuredClone(components))
							: false
					)
			},
		}
	}

	function getMatchingEntitiesForBehavior(
			behavior: Behavior<xComponents, keyof xComponents>
		) {
		timers.matching.start()
		const entitiesThatMatchThisBehavior = index.get(<string[]>behavior.needs)!
		const ids = [...entitiesThatMatchThisBehavior]
		const matching = <[number, Partial<xComponents>][]>ids.map(id => [id, map.get(id)])
		// const matching: [number, Partial<xComponents>][] = []
		// for (const entry of map.entries())
		// 	if (behavior.needs.every(key => entry[1].hasOwnProperty(key)))
		// 		matching.push(entry)
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
					behavior.action(<any>components, entityControlMap.get(id))
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

			// add to behavior-entity indexing
			for (const behavior of behaviors) {
				const thisEntityMatchesThisBehavior = (
					behavior
						.needs
						.every(key => components.hasOwnProperty(key))
				)
				const entitiesThatMatchThisBehavior = (
					index.get(<string[]>behavior.needs)!
				)
				if (thisEntityMatchesThisBehavior)
					entitiesThatMatchThisBehavior.add(id)
			}

			// entity-controls indexing
			entityControlMap.set(id, entityControls(id))

			return id
		},

		remove(id: number) {
			map.delete(id)

			// remove from behavior-entity indexing
			for (const behavior of behaviors) {
				const entitiesThatMatchThisBehavior = (
					index.get(<string[]>behavior.needs)!
				)
				entitiesThatMatchThisBehavior.delete(id)
			}
		},

	}
}
