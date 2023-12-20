
import {Core} from "../../../../../core/core.js"
import {HumanoidSchema} from "../../../schema.js"

export type RezzerMap<T> = Map<Core.Id, T>

export type InternalRezzer<T, K extends keyof HumanoidSchema> = {
	add(id: Core.Id, entity: Core.Selection<HumanoidSchema, K>): void
	update(item: T, entity: Core.Selection<HumanoidSchema, K>): void
	delete(id: Core.Id): void
}

export type Rezzer<T, K extends keyof HumanoidSchema> = {
	readonly kinds: K[]
	readonly ids: Core.Id[]
	has(id: Core.Id): boolean
	get(id: Core.Id): T | undefined
}

export type FullRezzer<T, K extends keyof HumanoidSchema> = {
	map: RezzerMap<T>
	internal: InternalRezzer<T, K>
	external: Rezzer<T, K>
}

export type FullRezzers = FullRezzer<any, keyof HumanoidSchema>[]

