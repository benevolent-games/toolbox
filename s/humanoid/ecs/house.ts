
import {Core} from "../../core/core.js"
import {HumanoidSchema} from "./schema.js"
import {Realm} from "../models/realm/realm.js"

export type Base = {
	entities: Core.Entities<HumanoidSchema>
	realm: Realm
}

export type Tick = {
	tick: number
}

export type RezzerLifecycle<K extends keyof HumanoidSchema> = {
	update(entity: Core.Selection<HumanoidSchema, K>, tick: Tick): void
	dispose(tick: Tick): void
}

export type RezzerFn<K extends keyof HumanoidSchema> = (
	(base: Base, tick: Tick) => (
		entity: Core.Selection<HumanoidSchema, K>,
		id: Core.Id,
	) => RezzerLifecycle<K>
)

export const house = new class House {
	entities = new Core.Entities<HumanoidSchema>()
	system = Core.configure_systems<Base, Tick>()
	rezzer = <K extends keyof HumanoidSchema>(kinds: K[], fn: RezzerFn<K>) => {
		const map = new Map<Core.Id, RezzerLifecycle<K>>()
		return this.system(base => tick => {
			for (const [id, entity] of this.entities.select(...kinds)) {
				if (map.has(id)) {
					const lifecycle = map.get(id)!
					lifecycle.update(entity, tick)
				}
				else {
					const lifecycle = fn(base, tick)(entity, id)
					map.set(id, lifecycle)
				}
			}
			for (const id of [...map.keys()]) {
				if (!this.entities.get(id)) {
					const lifecycle = map.get(id)!
					lifecycle.dispose(tick)
					map.delete(id)
				}
			}
		})
	}
}

