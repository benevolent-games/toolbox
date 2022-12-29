
import {Timekeep} from "./utils/timekeep.js"
import {Behavior} from "./ecs/types/behavior.js"
import {setupSelectacon} from "./ecs/selectacon.js"
import {Timeline} from "./chronicler/utils/gametime.js"
import {SetupBehaviors} from "./ecs/types/setup-behaviors.js"
import {behaviorEntityCorrelator} from "./ecs/behavior-entity-correlator.js"

export function ecs<C extends {[key: string]: {}}>(
		setup: SetupBehaviors<C>,
		timeline: Timeline,
	) {

	let count = 0
	const timekeep = new Timekeep()
	const behaviors = setup(x => x)

	const entities = new Map<number, Partial<C>>()
	const selectacon = setupSelectacon(entities)
	const correlator = behaviorEntityCorrelator(
		behaviors,
		id => entities.get(id)!,
	)

	const {select} = selectacon

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

	const timeSinceBehaviorExecution = new WeakMap<Behavior<C, keyof C>, number>()

	return {
		entities,
		timekeep,

		execute({timeDelta}: {timeDelta: number}) {
			const gametime = timeline.makeGametime(timeDelta)

			function isBehaviorReadyToExecute(behavior: Behavior<C, keyof C>) {
				const behaviorTime = timeSinceBehaviorExecution.get(behavior) ?? 0
				const updatedTime = behaviorTime + timeDelta
				const frequency = behavior.frequency(gametime.duration)
				const ready = updatedTime > frequency
				timeSinceBehaviorExecution.set(behavior, ready ? 0 : updatedTime)
				return ready
			}

			const TIMER_FREQUENCY = timekeep.timers.frequency
			const readyBehaviors = behaviors.filter(isBehaviorReadyToExecute)
			TIMER_FREQUENCY()

			for (const behavior of readyBehaviors) {
				const TIMER_MATCHING = timekeep.timers.matching
				const matching = correlator.get(behavior)
				TIMER_MATCHING()

				const TIMER_EXECUTING = timekeep.timers.executing
				for (const [id, components] of matching)
					behavior.action(
						<any>components,
						{id, write, select, gametime},
					)
				TIMER_EXECUTING()
			}
		},

		select: selectacon.select,

		add(components: Partial<C>) {
			const TIMER_ADDING = timekeep.timers.adding

			const id = count++
			entities.set(id, components)
			correlator.update(id, components)
			selectacon.entityWasAddedOrUpdated(id, components)

			TIMER_ADDING()
			return id
		},

		delete(id: number) {
			const TIMER_DELETING = timekeep.timers.deleting
			entities.delete(id)
			correlator.delete(id)
			selectacon.entityWasDeleted(id)
			TIMER_DELETING()
		},

	}
}
