
import {Behavior} from "./types/behavior.js"

export function behaviorEntityCorrelator<C extends {}>(
		behaviors: Behavior<any, any>[],
		getEntityComponents: (id: number) => Partial<C>,
	) {

	const index = new Map<string[], Set<number>>()

	for (const behavior of behaviors)
		index.set(<string[]>behavior.needs, new Set())

	return {

		get(behavior: Behavior<any, any>) {
			const entityIds = index.get(<string[]>behavior.needs)!
			const result: [number, Partial<C>][] = []
			for (const id of entityIds)
				result.push([id, getEntityComponents(id)])
			return result
		},

		update(id: number, components: Partial<C>) {
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

		delete(entityId: number) {
			for (const behavior of behaviors) {
				const entitiesThatMatchThisBehavior = (
					index.get(<string[]>behavior.needs)!
				)
				entitiesThatMatchThisBehavior.delete(entityId)
			}
		},

	}
}
