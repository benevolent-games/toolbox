
import {timekeeper} from "./utils/timekeeper.js"
import {EntityControls} from "./ecs/entity-controls.js"
import {SetupBehaviors} from "./ecs/types/setup-behaviors.js"
import {behaviorEntityCorrelator} from "./ecs/behavior-entity-correlator.js"

export function ecs<xComponents extends {[key: string]: {}}>(
		setup: SetupBehaviors<xComponents>
	) {

	let count = 0
	const timekeep = timekeeper()
	const behaviors = setup(x => x)
	const map = new Map<number, Partial<xComponents>>()

	const correlator = behaviorEntityCorrelator(
		behaviors,
		id => map.get(id)!,
	)

	const entityControlCache = EntityControls
		.setupCache(map, correlator)

	return {
		map,
		timekeep,

		execute() {
			for (const behavior of behaviors) {

				const clock_matching = timekeep.clocks.matching
				const matching = correlator.get(behavior)
				clock_matching()

				const clock_executing = timekeep.clocks.executing
				for (const [id, components] of matching)
					behavior.action(
						<any>components,
						entityControlCache.get(id),
					)
				clock_executing()
			}
		},

		query(fun: (components: Partial<xComponents>) => boolean) {
			return [...map.entries()]
				.filter(([id, components]) => fun(components))
		},

		add(components: Partial<xComponents>) {
			const id = count++
			map.set(id, components)
			correlator.update(id, components)
			entityControlCache.entityWasAdded(id)
			return id
		},

		remove(id: number) {
			map.delete(id)
			correlator.delete(id)
			entityControlCache.entityWasDeleted(id)
		},

	}
}
