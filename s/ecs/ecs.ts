
export namespace Ecs {
	export type Id = number
	export type Component = any
	export type Kind = string

	export type Schema = {[kind: Kind]: Component}
	export type AsSchema<Sc extends Schema> = Sc

	export type Executor<B, T> = (
		(base: B) => (tick: T) => void
	)

	export type Selection<Sc extends Schema, K extends keyof Sc> = {
		[P in K]: Sc[P]
	}

	export type ProcessorFn<Sc extends Schema, K extends keyof Sc, B, T> = (
		(base: B) => (id: Id, state: Selection<Sc, K>, tick: T) => void
	)

	export class System<
			Sc extends Schema,
			Base,
			Tick,
		> {

		entities = new Set<Id>()

		constructor(
			public readonly kinds: (keyof Sc)[],
			public readonly exe: Executor<Base, Tick>,
		) {}

		#match(entityKinds: (keyof Sc)[]) {
			const {kinds: systemKinds} = this
			return (entityKinds.length === systemKinds.length)
				? systemKinds.every(k => entityKinds.includes(k))
				: false
		}

		updateCache(id: Id, entityKinds: (keyof Sc)[]) {
			const match = this.#match(entityKinds)
			if (match)
				this.entities.add(id)
			else
				this.entities.delete(id)
			return match
		}
	}







	export type Sys<Sc extends Schema, Base, Tick> = {
		kinds: (keyof Sc)[]
		executor: Executor<Base, Tick>
	}

	export class Pipeline<Sc extends Schema, Base, Tick> {
		#cacheEntities = new Set<Id>()
		#cacheSystems = new Map<Sys<Sc, Base, Tick>, Set<Id>>()

		constructor(public systems: Sys<Sc, Base, Tick>[]) {
			for (const system of systems)
				this.#cacheSystems.set(system, new Set())
		}

		updateCache(id: Id, kinds: (keyof Sc)[]) {
			for (const system of this.systems) {
				const set = this.#cacheSystems.get(system)!
				const match = (kinds.length === system.kinds.length)
					? system.kinds.every(k => kinds.includes(k))
					: false

				if (match) {
					this.#cacheEntities.add(id)
					set.add(id)
				}
				else {
					this.#cacheEntities.delete(id)
					set.delete(id)
				}
			}
		}
	}







	export class Systems<
			Sc extends Schema,
			Base,
			Tick,
		> {

		system = (
			<K extends keyof Sc>(...kinds: K[]) =>
				(executor: Executor<Base, Tick>) =>
					new System<Sc, Base, Tick>(kinds, executor)
		)

		processor = (
			<K extends keyof Sc>(...kinds: K[]) =>
				(fn: ProcessorFn<Sc, K, Base, Tick>) =>
					this.system<K>(...kinds)(base => {
						const process = fn(base)
						return tick => {

							// TODO select
							for (const [id, state] of [] as any)
								process(id, state, tick)
						}
					})
		)
	}
}

