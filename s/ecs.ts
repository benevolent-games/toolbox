
import {Controls} from "./ecs/types/controls.js"
import {timekeeper} from "./utils/timekeeper.js"
import {setupSelectacon} from "./ecs/selectacon.js"
import {SetupBehaviors} from "./ecs/types/setup-behaviors.js"
import {behaviorEntityCorrelator} from "./ecs/behavior-entity-correlator.js"

export function ecs<C extends {[key: string]: {}}>(
		setup: SetupBehaviors<C>
	) {

	let count = 0
	const timekeep = timekeeper()
	const behaviors = setup(x => x)

	const entities = new Map<number, Partial<C>>()
	const selectacon = setupSelectacon(entities)
	const correlator = behaviorEntityCorrelator(
		behaviors,
		id => entities.get(id)!,
	)

	const controlsCache = new Map<number, Controls<C>>()

	function write(id: number, changes: Partial<C>) {
		const components: Partial<C> = entities.get(id) ?? {}
		for (const [key, value] of Object.entries(changes)) {
			if (value === undefined)
				delete components[key]
			else
				components[key as keyof Partial<C>] = value
		}
		entities.set(id, components)
		correlator.update(id, components)
		selectacon.entityWasAddedOrUpdated(id, components)
	}

	return {
		entities,
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
						controlsCache.get(id)!,
					)
				clock_executing()
			}
		},

		select: selectacon.select,

		add(components: Partial<C>) {
			const clock_adding = timekeep.clocks.adding

			const id = count++
			entities.set(id, components)
			correlator.update(id, components)
			selectacon.entityWasAddedOrUpdated(id, components)
			controlsCache.set(id, {
				id,
				write,
				select: selectacon.select,
			})

			clock_adding()
			return id
		},

		delete(id: number) {
			const clock_deleting = timekeep.clocks.deleting
			entities.delete(id)
			correlator.delete(id)
			controlsCache.delete(id)
			selectacon.entityWasDeleted(id)
			clock_deleting()
		},

	}
}
