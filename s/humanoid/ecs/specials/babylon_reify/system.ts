
import {Pojo, ob} from "@benev/slate"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {InstantiatedEntries} from "@babylonjs/core/assetContainer.js"

import {Core} from "../../../../core/core.js"
import {Base, Tick, systematize} from "../../systematize.js"

import {HumanoidSchema} from "../../schema.js"
import {Gimbal} from "../../../../common/models/flycam/types/gimbal.js"

export type InternalRezzer<K extends keyof HumanoidSchema> = {
	add(id: Core.Id, entity: Core.Selection<HumanoidSchema, K>): void
	delete(id: Core.Id): void
}

export type ExternalRezzer<T> = {
	has(id: Core.Id): boolean
	get(id: Core.Id): T | undefined
	readonly ids: Core.Id[]
}

export type FullRezzer<T, K extends keyof HumanoidSchema> = {
	kinds: K[]
	internal: InternalRezzer<K>
	external: ExternalRezzer<T>
}

export const mrezzer = (
	<K extends keyof HumanoidSchema>(...kinds: K[]) => (
		<T>(make: (map: Map<Core.Id, T>) => InternalRezzer<K>): FullRezzer<T, K> => {
			const map = new Map<Core.Id, T>()
			return {
				kinds,
				internal: make(map),
				external: {
					has: id => map.has(id),
					get: id => map.get(id),
					get ids() { return [...map.keys()] },
				},
			}
		}
	)
)

export function setup_babylon_reify({entities, realm}: Base) {

	const rezzer_specs = {

		models: mrezzer("model")<InstantiatedEntries>(map => ({
			add(id, {model}) {
				const container = realm.containers[model.container]
				const instanced = container.instantiateModelsToScene()
				map.set(id, instanced)
			},
			delete(id) {
				const instanced = map.get(id)!
				instanced.dispose()
				map.delete(id)
			},
		})),
	}

	const rezzers = Object.values(rezzer_specs)

	const system: Core.System<Tick> = () => {

		for (const rezzer of rezzers)
			for (const [id, entity] of entities.select(...rezzer.kinds))
				if (!rezzer.external.has(id))
					rezzer.internal.add(id, entity)

		for (const rezzer of rezzers)
			for (const id of rezzer.external.ids)
				if (!entities.has(id))
					rezzer.internal.delete(id)
	}

	return {
		system,
		rezzers: ob(rezzer_specs).map(rezzer => rezzer.external),
	}
}

